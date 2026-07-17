// ---------------------------------------------------------------------------
// This file replaces the old @base44/sdk client. It exposes the SAME shape
// (base44.entities.X.list/filter/create/update/delete, base44.auth.*,
// base44.integrations.Core.*, base44.functions.invoke) so that none of the
// existing pages/components had to be rewritten — they were moved over
// verbatim from the Base44 export.
//
// Everything underneath is backed by Supabase (Postgres + Auth + Storage)
// instead of Base44's hosted backend. See supabase/schema.sql for the table
// definitions and RLS policies these calls rely on.
// ---------------------------------------------------------------------------
import { supabase } from '@/lib/supabaseClient';

// Base44 entity name -> Postgres table name
const TABLES = {
  Episode: 'episodes',
  BlogPost: 'blog_posts',
  Subscriber: 'subscribers',
  PremiumSubscriber: 'premium_subscribers',
  Product: 'products',
  Meme: 'memes',
  PremiumEpisode: 'premium_episodes',
  PressRelease: 'press_releases',
  FunnyPhoto: 'funny_photos',
  UpcomingGuest: 'upcoming_guests',
  PollResponse: 'poll_responses',
  PhotoComment: 'photo_comments',
};

// Parses base44-style sort strings, e.g. "-publish_date" -> desc, "air_date" -> asc
function applySort(query, sort) {
  if (!sort) return query;
  const desc = sort.startsWith('-');
  const column = desc ? sort.slice(1) : sort;
  return query.order(column, { ascending: !desc });
}

function makeEntity(name) {
  const table = TABLES[name];
  if (!table) {
    throw new Error(`Unknown entity "${name}" — add it to TABLES in base44Client.js and to supabase/schema.sql`);
  }

  return {
    async list(sort, limit) {
      let q = supabase.from(table).select('*');
      q = applySort(q, sort);
      if (limit) q = q.limit(limit);
      const { data, error } = await q;
      if (error) throw error;
      return data;
    },

    async filter(match = {}, sort, limit) {
      let q = supabase.from(table).select('*').match(match);
      q = applySort(q, sort);
      if (limit) q = q.limit(limit);
      const { data, error } = await q;
      if (error) throw error;
      return data;
    },

    async create(values) {
      // NOTE: intentionally not chaining .select() here — anonymous visitors
      // (email gate, poll responses, photo comments) can INSERT under RLS
      // but aren't allowed to SELECT rows back, which made every create()
      // throw. None of the pages use the returned row, so we just echo back
      // what was sent.
      const { error } = await supabase.from(table).insert(values);
      if (error) throw error;
      return values;
    },

    async update(id, values) {
      const { data, error } = await supabase.from(table).update(values).eq('id', id).select().single();
      if (error) throw error;
      return data;
    },

    async delete(id) {
      const { error } = await supabase.from(table).delete().eq('id', id);
      if (error) throw error;
      return true;
    },
  };
}

const entities = Object.fromEntries(Object.keys(TABLES).map((name) => [name, makeEntity(name)]));

// ---- auth ----
async function getRole(userId) {
  const { data } = await supabase.from('profiles').select('role').eq('id', userId).single();
  return data?.role || 'user';
}

const auth = {
  async me() {
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error || !user) throw new Error('Not authenticated');
    const role = await getRole(user.id);
    return { id: user.id, email: user.email, role, ...user.user_metadata };
  },

  async loginViaEmailPassword(email, password) {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
  },

  loginWithProvider(provider, redirectPath = '/') {
    return supabase.auth.signInWithOAuth({
      provider,
      options: { redirectTo: `${window.location.origin}${redirectPath}` },
    });
  },

  async register({ email, password }) {
    const { error } = await supabase.auth.signUp({ email, password });
    if (error) throw error;
    // NOTE: for the 6-digit OTP flow used in Register.jsx to work, set your
    // Supabase "Confirm signup" email template to include {{ .Token }}
    // instead of the default magic-link button (Auth -> Email Templates).
  },

  async verifyOtp({ email, otpCode }) {
    const { data, error } = await supabase.auth.verifyOtp({ email, token: otpCode, type: 'signup' });
    if (error) throw error;
    return { access_token: data?.session?.access_token };
  },

  async resendOtp(email) {
    const { error } = await supabase.auth.resend({ type: 'signup', email });
    if (error) throw error;
  },

  async resetPasswordRequest(email) {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    if (error) throw error;
  },

  async resetPassword({ newPassword }) {
    // Supabase establishes a recovery session automatically from the URL
    // when the user lands on /reset-password from the emailed link, so we
    // don't need the resetToken directly — just update the password.
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    if (error) throw error;
  },

  setToken() {
    // No-op: supabase-js manages its own session/token storage.
  },

  logout(redirectUrl) {
    supabase.auth.signOut().then(() => {
      if (redirectUrl) window.location.href = '/login';
    });
  },

  redirectToLogin() {
    window.location.href = '/login';
  },
};

// ---- integrations.Core (email + file upload) ----
const integrations = {
  Core: {
    async SendEmail({ to, subject, body, from_name }) {
      const res = await fetch('/api/functions/sendEmail', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ to, subject, body, from_name }),
      });
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || 'Failed to send email');
      }
      return res.json();
    },

    async UploadFile({ file }) {
      const path = `${Date.now()}-${file.name}`;
      const { error } = await supabase.storage.from('public-uploads').upload(path, file);
      if (error) throw error;
      const { data } = supabase.storage.from('public-uploads').getPublicUrl(path);
      return { file_url: data.publicUrl };
    },
  },
};

// ---- functions.invoke (Cloudflare Pages Functions under /functions/api/) ----
const functions = {
  async invoke(name, payload) {
    const res = await fetch(`/api/functions/${name}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error(`Function ${name} failed`);
    return res.json();
  },
};

export const base44 = { entities, auth, integrations, functions };

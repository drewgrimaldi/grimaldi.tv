// Standalone Cloudflare Worker (cron trigger), replaces base44/functions/
// cleanupPremiumSubscribers and expireSubscriptions. Deployed separately
// from the main Pages site: `wrangler deploy` from this folder.
//
// Secrets required (wrangler secret put ...):
//   SUPABASE_URL
//   SUPABASE_SERVICE_ROLE_KEY   (service_role key — server-side only, bypasses RLS)

async function supabaseRequest(env, path, init = {}) {
  const res = await fetch(`${env.SUPABASE_URL}/rest/v1/${path}`, {
    ...init,
    headers: {
      apikey: env.SUPABASE_SERVICE_ROLE_KEY,
      Authorization: `Bearer ${env.SUPABASE_SERVICE_ROLE_KEY}`,
      'Content-Type': 'application/json',
      Prefer: init.prefer || 'return=representation',
      ...(init.headers || {}),
    },
  });
  if (!res.ok) throw new Error(`Supabase error ${res.status}: ${await res.text()}`);
  return res.json();
}

async function cleanupExpiredPremiumSubscribers(env) {
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  const iso = thirtyDaysAgo.toISOString();

  const stale = await supabaseRequest(
    env,
    `premium_subscribers?created_date=lt.${encodeURIComponent(iso)}&select=id`
  );
  for (const row of stale) {
    await supabaseRequest(env, `premium_subscribers?id=eq.${row.id}`, { method: 'DELETE' });
  }
  return { deleted: stale.length };
}

async function expireSubscriptions(env) {
  const today = new Date().toISOString().split('T')[0];
  const active = await supabaseRequest(
    env,
    `premium_subscribers?status=eq.active&subscription_expiry=lt.${today}&select=id`
  );
  for (const row of active) {
    await supabaseRequest(env, `premium_subscribers?id=eq.${row.id}`, {
      method: 'PATCH',
      body: JSON.stringify({ status: 'expired' }),
    });
  }
  return { expired: active.length };
}

export default {
  async scheduled(event, env, ctx) {
    ctx.waitUntil(
      (async () => {
        const cleanup = await cleanupExpiredPremiumSubscribers(env);
        const expired = await expireSubscriptions(env);
        console.log('cron run', cleanup, expired);
      })()
    );
  },

  // Optional: hit this manually to test, e.g. `wrangler dev` then curl localhost.
  async fetch(request, env) {
    const cleanup = await cleanupExpiredPremiumSubscribers(env);
    const expired = await expireSubscriptions(env);
    return Response.json({ cleanup, expired });
  },
};

// Cloudflare Pages Function: /api/functions/:name
// Deployed automatically alongside the Cloudflare Pages site.
//
// Required environment variables (set in Cloudflare Pages -> Settings ->
// Environment variables, NOT in a client-visible .env):
//   RESEND_API_KEY      - resend.com API key (or swap sendViaResend for your provider)
//   ADMIN_NOTIFY_EMAIL  - where admin notification emails go (drew@grimaldi.tv)
//
// (Blog posts are handled separately, directly against studio.grimaldi.tv's
// own Supabase project - see src/lib/studioSupabaseClient.js and
// functions/Blog/[slug].js. Nothing here talks to Base44.)

async function sendViaResend(env, { to, subject, body, from_name }) {
  const apiKey = env.RESEND_API_KEY || env.RESENT_API_KEY;
  if (!apiKey) {
    throw new Error('RESEND_API_KEY is not configured');
  }
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: `${from_name || 'grimaldi.tv'} <notifications@grimaldi.tv>`,
      to: [to],
      subject,
      text: body,
    }),
  });
  if (!res.ok) {
    const detail = await res.text();
    throw new Error(`Resend error: ${detail}`);
  }
  return res.json();
}

export async function onRequestPost({ params, request, env }) {
  const { name } = params;
  const payload = await request.json().catch(() => ({}));

  try {
    switch (name) {
      case 'sendEmail': {
        const { to, subject, body, from_name } = payload;
        const data = await sendViaResend(env, { to, subject, body, from_name });
        return Response.json({ success: true, data });
      }

      case 'sendPollResponse': {
        const { question, answer, email } = payload;
        if (!question || !answer) {
          return Response.json({ error: 'Missing question or answer' }, { status: 400 });
        }
        const adminEmail = env.ADMIN_NOTIFY_EMAIL || 'drew@grimaldi.tv';
        const body = `New Poll Response:\n\nQuestion: ${question}\n\nAnswer: ${answer}\n\nRespondent Email: ${email || 'Not provided'}\n\n---\nTimestamp: ${new Date().toLocaleString()}`;
        await sendViaResend(env, {
          to: adminEmail,
          subject: `New Poll Response: "${question.substring(0, 40)}..."`,
          body,
          from_name: 'Drew Grimaldi Poll',
        });
        return Response.json({ success: true });
      }

      case 'notifyPremiumSignup': {
        const { data } = payload;
        const name_ = data?.name || 'No name provided';
        const email = data?.email;
        const body = `New Premium Signup!\n\nName: ${name_}\nEmail: ${email}\nSubscription Type: ${data?.subscription_type || 'unknown'}\nStatus: ${data?.status}\nCreated: ${data?.created_date ? new Date(data.created_date).toLocaleString() : ''}\n\nPayPal Transaction ID: ${data?.paypal_transaction_id || 'N/A'}`;
        await sendViaResend(env, {
          to: env.ADMIN_NOTIFY_EMAIL || 'drew@grimaldi.tv',
          subject: `New Premium Signup: ${name_}`,
          body,
        });
        return Response.json({ success: true });
      }

      case 'getSubstackFeed': {
        const rssUrl = 'https://thedrewgrimaldipodcast.substack.com/feed';
        const res = await fetch(rssUrl);
        const xml = await res.text();
        const items = [];
        const itemRegex = /<item>([\s\S]*?)<\/item>/g;
        let match;
        while ((match = itemRegex.exec(xml)) !== null) {
          const content = match[1];
          const get = (tag) => {
            const m = content.match(new RegExp(`<${tag}[^>]*><!\\[CDATA\\[([\\s\\S]*?)\\]\\]><\\/${tag}>|<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`));
            return m ? (m[1] || m[2] || '').trim() : '';
          };
          const imgMatch = content.match(/<enclosure[^>]+url="([^"]+)"/);
          const thumbMatch = content.match(/<media:thumbnail[^>]+url="([^"]+)"/);
          const descHtml = get('description');
          const imgInDesc = descHtml.match(/<img[^>]+src="([^"]+)"/);
          items.push({
            title: get('title'),
            link: get('link'),
            pubDate: get('pubDate'),
            description: descHtml.replace(/<[^>]+>/g, '').slice(0, 160),
            image: (imgMatch && imgMatch[1]) || (thumbMatch && thumbMatch[1]) || (imgInDesc && imgInDesc[1]) || null,
          });
          if (items.length >= 6) break;
        }
        return Response.json({ items });
      }

      default:
        return Response.json({ error: `Unknown function "${name}"` }, { status: 404 });
    }
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}

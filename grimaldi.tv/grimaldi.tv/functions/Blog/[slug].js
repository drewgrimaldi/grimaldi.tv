// Runs only for /Blog/:slug URLs. Injects OG meta tags into the page so
// shared links show a proper preview card (title, image, description).
//
// KEY DESIGN: Only intercepts social-media / messaging crawler requests.
// Normal browser requests pass straight through to the SPA via context.next()
// so that React Router handles navigation normally.

const BOT_UA_PATTERN = /facebookexternalhit|Facebot|Twitterbot|LinkedInBot|Discordbot|WhatsApp|Slackbot|TelegramBot|Applebot|Pinterest|Embedly|Quora|Showyoubot|outbrain|vkShare|W3C_Validator|Baiduspider|bingbot|Googlebot|curl/i;

function isCrawler(request) {
  const ua = request.headers.get('user-agent') || '';
  return BOT_UA_PATTERN.test(ua);
}

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

export async function onRequest(context) {
  const { params, env, request } = context;

  // Normal browser → let the SPA handle it
  if (!isCrawler(request)) {
    return context.next();
  }

  // Crawler → inject OG tags for share preview cards
  const slug = params.slug;

  let html;
  try {
    const assetResponse = await context.env.ASSETS.fetch(new URL('/index.html', request.url));
    html = await assetResponse.text();
  } catch (err) {
    // Fallback: try context.next() if ASSETS isn't available
    try {
      const fallback = await context.next();
      html = await fallback.text();
    } catch {
      return new Response('Loading...', { headers: { 'content-type': 'text/html;charset=UTF-8' } });
    }
  }

  try {
    if (env.STUDIO_SUPABASE_URL && env.STUDIO_SUPABASE_ANON_KEY) {
      const baseUrl = env.STUDIO_SUPABASE_URL.replace(/\/+$/, '');
      const res = await fetch(
        `${baseUrl}/rest/v1/blog_posts?slug=eq.${encodeURIComponent(slug)}&status=eq.published&select=*`,
        { headers: { apikey: env.STUDIO_SUPABASE_ANON_KEY, Authorization: `Bearer ${env.STUDIO_SUPABASE_ANON_KEY}` } }
      );
      const rows = await res.json();
      const post = Array.isArray(rows) ? rows[0] : null;

      if (post) {
        const title = `${post.title} | THE DREW GRIMALDI PODCAST`;
        const description = (post.excerpt || '').slice(0, 200);
        const image = post.thumbnail_url || '';
        const url = new URL(request.url).toString();

        // Remove existing OG and Twitter meta tags to prevent duplicates
        html = html
          .replace(/<meta property="og:[^>]+>/g, '')
          .replace(/<meta name="twitter:[^>]+>/g, '')
          .replace(/<title>.*?<\/title>/, `<title>${escapeHtml(title)}</title>`)
          .replace(
            '</head>',
            `    <meta property="og:site_name" content="GRIMALDI.TV" />
    <meta property="og:title" content="${escapeHtml(title)}" />
    <meta property="og:description" content="${escapeHtml(description)}" />
    <meta property="og:image" content="${escapeHtml(image)}" />
    <meta property="og:url" content="${escapeHtml(url)}" />
    <meta property="og:type" content="article" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${escapeHtml(title)}" />
    <meta name="twitter:description" content="${escapeHtml(description)}" />
    <meta name="twitter:image" content="${escapeHtml(image)}" />
  </head>`
          );
      }
    }
  } catch (err) {
    console.error('Blog OG tag injection failed:', err);
  }

  return new Response(html, {
    headers: { 'content-type': 'text/html;charset=UTF-8' },
  });
}

export async function onRequest(context) {
  const { env, request } = context;
  const url = new URL(request.url);
  const siteUrl = `${url.protocol}//${url.host}`;

  // 1. Check for database credentials
  if (!env.STUDIO_SUPABASE_URL || !env.STUDIO_SUPABASE_ANON_KEY) {
    return new Response('Database credentials not configured.', { status: 500 });
  }

  try {
    const baseUrl = env.STUDIO_SUPABASE_URL.replace(/\/+$/, '');
    const res = await fetch(
      `${baseUrl}/rest/v1/blog_posts?status=eq.published&order=published_date.desc&select=*`,
      {
        headers: {
          apikey: env.STUDIO_SUPABASE_ANON_KEY,
          Authorization: `Bearer ${env.STUDIO_SUPABASE_ANON_KEY}`,
        },
      }
    );

    if (!res.ok) {
      throw new Error(`Failed to fetch blog posts: ${res.statusText}`);
    }

    const posts = await res.json();

    // Helper to escape special XML characters
    const escapeXml = (unsafe) => {
      if (!unsafe) return '';
      return unsafe.replace(/[<>&'"]/g, (c) => {
        switch (c) {
          case '<': return '&lt;';
          case '>': return '&gt;';
          case '&': return '&amp;';
          case '\'': return '&apos;';
          case '"': return '&quot;';
          default: return c;
        }
      });
    };

    // 2. Build the RSS XML content
    let rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>The Drew Grimaldi Podcast Blog</title>
    <link>${siteUrl}/Blog</link>
    <description>Commentary and analysis from Drew Grimaldi</description>
    <language>en-us</language>
    <atom:link href="${siteUrl}/rss.xml" rel="self" type="application/rss+xml" />
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
`;

    for (const post of posts) {
      const postUrl = `${siteUrl}/Blog/${post.slug}`;
      const pubDate = post.published_date
        ? new Date(post.published_date).toUTCString()
        : new Date().toUTCString();

      rss += `    <item>
      <title>${escapeXml(post.title)}</title>
      <link>${postUrl}</link>
      <guid isPermaLink="true">${postUrl}</guid>
      <pubDate>${pubDate}</pubDate>
      <description><![CDATA[${post.excerpt || ''}]]></description>
`;

      if (post.category) {
        rss += `      <category>${escapeXml(post.category)}</category>\n`;
      }

      if (post.thumbnail_url) {
        // Find image type from extension
        let type = 'image/jpeg';
        if (post.thumbnail_url.endsWith('.png')) {
          type = 'image/png';
        } else if (post.thumbnail_url.endsWith('.webp')) {
          type = 'image/webp';
        } else if (post.thumbnail_url.endsWith('.gif')) {
          type = 'image/gif';
        }
        rss += `      <enclosure url="${escapeXml(post.thumbnail_url)}" length="0" type="${type}" />\n`;
      }

      rss += `    </item>\n`;
    }

    rss += `  </channel>
</rss>`;

    return new Response(rss, {
      headers: {
        'Content-Type': 'application/rss+xml; charset=UTF-8',
        'Cache-Control': 'public, max-age=1800', // Cache for 30 minutes
      },
    });
  } catch (error) {
    console.error('RSS generation error:', error);
    return new Response('Error generating RSS feed.', { status: 500 });
  }
}

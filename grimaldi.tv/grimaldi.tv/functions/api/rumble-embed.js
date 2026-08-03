export async function onRequestGet(context) {
  const { searchParams } = new URL(context.request.url);
  const videoUrl = searchParams.get('url');

  if (!videoUrl) {
    return new Response(JSON.stringify({ error: 'Missing url parameter' }), {
      status: 400,
      headers: { 
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });
  }

  try {
    // Call Rumble oEmbed API
    const oembedUrl = `https://wn0.rumble.com/api/Media/oembed.json?url=${encodeURIComponent(videoUrl)}`;
    const res = await fetch(oembedUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      }
    });

    if (!res.ok) {
      // Fallback: try scraping the page HTML directly to find the embed code
      const htmlRes = await fetch(videoUrl, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
        }
      });
      if (htmlRes.ok) {
        const html = await htmlRes.text();
        const embedMatch = html.match(/rumble\.com\/embed\/([a-zA-Z0-9]+)/i);
        if (embedMatch) {
          return new Response(JSON.stringify({ embedId: embedMatch[1] }), {
            headers: { 
              'Content-Type': 'application/json',
              'Access-Control-Allow-Origin': '*'
            }
          });
        }
      }
      return new Response(JSON.stringify({ error: 'Failed to retrieve embed ID' }), {
        status: res.status,
        headers: { 
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      });
    }

    const data = await res.json();
    const embedMatch = data.html?.match(/embed\/([a-zA-Z0-9]+)/i);
    if (embedMatch) {
      return new Response(JSON.stringify({ embedId: embedMatch[1] }), {
        headers: { 
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      });
    }

    return new Response(JSON.stringify({ error: 'Embed ID not found in oEmbed' }), {
      status: 404,
      headers: { 
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { 
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });
  }
}

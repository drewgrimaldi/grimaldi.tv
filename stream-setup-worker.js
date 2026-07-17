// Grimaldi Studio — Stream Setup Worker
// Deploy this as a Cloudflare Worker. It holds your Cloudflare API token securely
// (as a Worker secret) so it never touches the browser.
//
// SETUP (one-time):
// 1. wrangler secret put CF_API_TOKEN         (a Cloudflare API token with Stream:Edit permission)
// 2. wrangler secret put CF_ACCOUNT_ID        (your Cloudflare account ID)
// 3. Deploy: wrangler deploy
// 4. Point studio-app.html's "Prepare Stream" button at this Worker's URL.
//
// WHAT IT DOES each time you call it with a YouTube key + Rumble key:
// - Creates ONE reusable Cloudflare Stream Live Input (first time only — after that it reuses it)
// - Overwrites/creates the YouTube + Rumble Outputs on that Live Input with whatever keys you just pasted in
// - Returns the WHIP URL for the browser to publish to
//
// This means: new episode → paste fresh YouTube/Rumble keys → click Prepare Stream → Go Live.
// No manual Cloudflare dashboard clicking required after initial deploy.

export default {
  async fetch(request, env) {
    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders() });
    }
    if (request.method !== 'POST') {
      return json({ error: 'POST only' }, 405);
    }

    let body;
    try {
      body = await request.json();
    } catch {
      return json({ error: 'Invalid JSON body' }, 400);
    }

    const { youtubeRtmpUrl, youtubeKey, rumbleRtmpUrl, rumbleKey, liveInputId } = body;

    if (!youtubeKey && !rumbleKey) {
      return json({ error: 'Provide at least one of youtubeKey or rumbleKey' }, 400);
    }

    const CF_API = `https://api.cloudflare.com/client/v4/accounts/${env.CF_ACCOUNT_ID}/stream`;
    const authHeaders = {
      'Authorization': `Bearer ${env.CF_API_TOKEN}`,
      'Content-Type': 'application/json'
    };

    try {
      // 1. Reuse existing Live Input if an ID was passed, otherwise create one
      let inputId = liveInputId;
      if (!inputId) {
        const createResp = await fetch(`${CF_API}/live_inputs`, {
          method: 'POST',
          headers: authHeaders,
          body: JSON.stringify({ meta: { name: 'Grimaldi Studio' }, recording: { mode: 'automatic' } })
        });
        const createData = await createResp.json();
        if (!createData.success) return json({ error: 'Failed to create Live Input', details: createData.errors }, 500);
        inputId = createData.result.uid;
      }

      // 2. Get existing outputs so we can replace youtube/rumble ones cleanly
      const outputsResp = await fetch(`${CF_API}/live_inputs/${inputId}/outputs`, { headers: authHeaders });
      const outputsData = await outputsResp.json();
      const existing = outputsData.success ? outputsData.result : [];

      async function upsertOutput(label, rtmpUrl, streamKey) {
        if (!streamKey) return;
        const match = existing.find(o => (o.url || '').includes(rtmpUrl.replace('rtmp://', '').split('/')[0]));
        if (match) {
          await fetch(`${CF_API}/live_inputs/${inputId}/outputs/${match.uid}`, {
            method: 'PUT',
            headers: authHeaders,
            body: JSON.stringify({ url: rtmpUrl, streamKey, enabled: true })
          });
        } else {
          await fetch(`${CF_API}/live_inputs/${inputId}/outputs`, {
            method: 'POST',
            headers: authHeaders,
            body: JSON.stringify({ url: rtmpUrl, streamKey, enabled: true })
          });
        }
      }

      await upsertOutput('youtube', youtubeRtmpUrl || 'rtmp://a.rtmp.youtube.com/live2', youtubeKey);
      if (rumbleKey) {
        await upsertOutput('rumble', rumbleRtmpUrl, rumbleKey);
      }

      // 3. Fetch the Live Input details to get the WHIP publish URL
      const detailResp = await fetch(`${CF_API}/live_inputs/${inputId}`, { headers: authHeaders });
      const detailData = await detailResp.json();
      if (!detailData.success) return json({ error: 'Failed to fetch Live Input details', details: detailData.errors }, 500);

      return json({
        success: true,
        liveInputId: inputId,
        whipUrl: detailData.result.webRTC?.url || null,
        rtmpUrl: detailData.result.rtmps?.url || null,
        streamKey: detailData.result.rtmps?.streamKey || null
      });

    } catch (err) {
      return json({ error: err.message }, 500);
    }
  }
};

function json(obj, status = 200) {
  return new Response(JSON.stringify(obj), {
    status,
    headers: { 'Content-Type': 'application/json', ...corsHeaders() }
  });
}

function corsHeaders() {
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type'
  };
}

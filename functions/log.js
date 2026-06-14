// Cloudflare Pages Function — POST /log
//
// Records each authenticated view to a Google Sheet for a permanent record that
// outlives Cloudflare's ~7-day Access log retention.
//
// The visitor's email is taken from the trusted Cf-Access-Authenticated-User-Email
// header when Access injects it; otherwise it falls back to the email the page read
// from Cloudflare's /cdn-cgi/access/get-identity endpoint and sent in the body.
// The Sheet's web-app URL lives in the SHEET_URL environment variable (Pages project
// → Settings → Variables and Secrets), so it's never exposed in the repo or client.
//
// Dormant until SHEET_URL is set.
export async function onRequest(context) {
  const { request, env } = context;

  let email = request.headers.get('Cf-Access-Authenticated-User-Email');
  if (!email) {
    try { const body = await request.json(); email = body && body.email; } catch (e) {}
  }

  if (email && env.SHEET_URL) {
    const payload = JSON.stringify({ email, time: new Date().toISOString() });
    context.waitUntil(
      fetch(env.SHEET_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: payload,
      }).catch(() => {})
    );
  }

  return new Response(null, { status: 204 });
}

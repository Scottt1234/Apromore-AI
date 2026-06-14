// Cloudflare Pages Function — POST /log
//
// Appends each authenticated view to a Google Sheet (permanent record beyond
// Cloudflare's ~7-day Access log retention). The email comes from the trusted
// Cf-Access-Authenticated-User-Email header that Access injects; a posted body
// {email} is used as a fallback. The Sheet web-app URL is the SHEET_URL env var
// (Pages project → Settings → Variables and Secrets), kept out of the repo/client.
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

// Cloudflare Pages Function — POST /log
//
// Records each authenticated view to a Google Sheet for a permanent record that
// outlives Cloudflare's ~7-day Access log retention.
//
// • The visitor's email comes from the trusted `Cf-Access-Authenticated-User-Email`
//   header that Cloudflare Access injects — it cannot be spoofed by the browser.
// • The Sheet's web-app URL is read from the SHEET_URL environment variable
//   (set in the Pages project → Settings → Variables and Secrets), so it is never
//   exposed in the public repo or to the client.
//
// Dormant until SHEET_URL is set: with no env var, it just returns 204 and logs nothing.
export async function onRequest(context) {
  const { request, env } = context;
  const email = request.headers.get('Cf-Access-Authenticated-User-Email');

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

// redeploy trigger: activate SHEET_URL logging

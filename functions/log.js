// Cloudflare Pages Function — route: /log
// On every authenticated deck load, append the viewer's email to a Google Sheet
// for a permanent access record (Cloudflare's own audit log only retains ~7 days).
//
// The email comes from the trusted `Cf-Access-Authenticated-User-Email` header that
// Cloudflare Access injects after login; the deck client just pings POST /log.
// The Sheet is a Google Apps Script web app; its /exec URL is the SHEET_URL env var.
export async function onRequest(context) {
  const { request, env } = context;

  const hdrEmail = request.headers.get('Cf-Access-Authenticated-User-Email') || '';
  let bodyEmail = '';
  try { const b = await request.json(); bodyEmail = (b && b.email) || ''; } catch (e) {}
  const email = hdrEmail || bodyEmail;

  // Heal a stray markdown-link paste in the env var ("…/exec](https://…/exec").
  let base = (env.SHEET_URL || '').trim();
  const md = base.indexOf('](');
  if (md !== -1) base = base.slice(0, md);
  base = base.replace(/[\[\]()]+$/, '').trim();

  if (email && base) {
    const url = new URL(base);
    url.searchParams.set('email', email);
    url.searchParams.set('time', new Date().toISOString());
    // Fire-and-forget: don't block the page on the Sheet write.
    context.waitUntil(fetch(url.toString(), { method: 'GET', redirect: 'follow' }).catch(() => {}));
  }

  return new Response(null, { status: 204 });
}

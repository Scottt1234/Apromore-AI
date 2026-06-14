// Cloudflare Pages Function — /log  (DIAGNOSTIC: GET w/ query params + reports state)
export async function onRequest(context) {
  const { request, env } = context;

  const hdrEmail = request.headers.get('Cf-Access-Authenticated-User-Email') || '';
  let bodyEmail = '';
  try { const b = await request.json(); bodyEmail = (b && b.email) || ''; } catch (e) {}
  const email = hdrEmail || bodyEmail || '(no email)';

  let posted = false, postStatus = 0, postErr = '';
  if (env.SHEET_URL) {
    try {
      const url = new URL(env.SHEET_URL);
      url.searchParams.set('email', email);
      url.searchParams.set('time', new Date().toISOString());
      const r = await fetch(url.toString(), { method: 'GET', redirect: 'follow' });
      posted = true;
      postStatus = r.status;
    } catch (e) {
      postErr = String(e);
    }
  }

  return new Response(
    JSON.stringify({ sheetUrlSet: !!env.SHEET_URL, hdrEmail: hdrEmail || null, bodyEmail: bodyEmail || null, posted, postStatus, postErr }),
    { status: 200, headers: { 'Content-Type': 'application/json' } }
  );
}

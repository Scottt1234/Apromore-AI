// Cloudflare Pages Function — /log  (DIAGNOSTIC MODE 2 — returns its state)
//
// Visit /log directly and read the JSON it returns to see whether SHEET_URL is
// present, what email it sees, and whether the POST to the Sheet succeeded.
export async function onRequest(context) {
  const { request, env } = context;

  const hdrEmail = request.headers.get('Cf-Access-Authenticated-User-Email') || '';
  let bodyEmail = '';
  try {
    const body = await request.json();
    bodyEmail = (body && body.email) || '';
  } catch (e) {}

  const email = hdrEmail || bodyEmail || '(no email)';

  let posted = false;
  let postErr = '';
  if (env.SHEET_URL) {
    try {
      await fetch(env.SHEET_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, time: new Date().toISOString() }),
      });
      posted = true;
    } catch (e) {
      postErr = String(e);
    }
  }

  return new Response(
    JSON.stringify({
      sheetUrlSet: !!env.SHEET_URL,
      sheetUrlStart: env.SHEET_URL ? env.SHEET_URL.slice(0, 45) : null,
      hdrEmail: hdrEmail || null,
      bodyEmail: bodyEmail || null,
      posted,
      postErr,
    }),
    { status: 200, headers: { 'Content-Type': 'application/json' } }
  );
}

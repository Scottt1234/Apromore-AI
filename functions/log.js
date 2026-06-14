// Cloudflare Pages Function — /log  (DIAGNOSTIC v4: self-heal SHEET_URL + capture response)
export async function onRequest(context) {
  const { request, env } = context;

  const hdrEmail = request.headers.get('Cf-Access-Authenticated-User-Email') || '';
  let bodyEmail = '';
  try { const b = await request.json(); bodyEmail = (b && b.email) || ''; } catch (e) {}
  const email = hdrEmail || bodyEmail || '(no email)';

  // Heal a markdown-link paste like "https://…/exec](https://…/exec" → take the first URL only.
  let base = (env.SHEET_URL || '').trim();
  const md = base.indexOf('](');
  if (md !== -1) base = base.slice(0, md);
  base = base.replace(/[\[\]()]+$/, '').trim();

  let posted = false, postStatus = 0, postErr = '', respSnippet = '', finalUrl = '';
  if (base) {
    try {
      const url = new URL(base);
      url.searchParams.set('email', email);
      url.searchParams.set('time', new Date().toISOString());
      const r = await fetch(url.toString(), { method: 'GET', redirect: 'follow' });
      posted = true;
      postStatus = r.status;
      finalUrl = r.url || '';
      respSnippet = (await r.text()).slice(0, 300);
    } catch (e) {
      postErr = String(e);
    }
  }

  return new Response(
    JSON.stringify({
      v: 'diag-g3',
      sheetUrlSet: !!env.SHEET_URL,
      healed: md !== -1,
      hdrEmail: hdrEmail || null,
      bodyEmail: bodyEmail || null,
      posted, postStatus, postErr, finalUrl, respSnippet,
    }),
    { status: 200, headers: { 'Content-Type': 'application/json' } }
  );
}

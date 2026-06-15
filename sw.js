/* Apromore deck — offline cache service worker.
 *
 * Registered ONLY when the presenter triggers the hidden offline control on the
 * setup screen (so ordinary visitors never get a service worker and cache
 * nothing). Once present on a device it makes the deck resilient to flaky/no
 * connection:
 *   • .mp3 narration → cache-first (don't re-download big audio once stored)
 *   • everything else same-origin → stale-while-revalidate (fast + auto-updates)
 *
 * The bulk "download everything" happens when the page posts {type:'cache-all'}.
 *
 * Updating: HTML/CSS/JS refresh themselves via stale-while-revalidate. Cached
 * audio is served from cache until CACHE_VERSION is bumped — bump it whenever you
 * replace narration files so devices re-fetch the new clips.
 *
 * To disable everywhere later: replace this file's contents with a
 * self-unregistering stub (registration.unregister() + caches.delete) and it
 * will tear itself down the next time each device loads the deck.
 */
const CACHE_VERSION = 'v1';
const CACHE = 'apromore-offline-' + CACHE_VERSION;

self.addEventListener('install', () => self.skipWaiting());

self.addEventListener('activate', (event) => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)));
    await self.clients.claim();
  })());
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;   // only our own assets

  // Cache-first for audio: once stored, serve locally and don't re-download.
  if (url.pathname.endsWith('.mp3')) {
    event.respondWith((async () => {
      const cached = await caches.match(req);
      if (cached) return cached;
      try {
        const res = await fetch(req);
        if (res && res.ok) (await caches.open(CACHE)).put(req, res.clone());
        return res;
      } catch (err) {
        return cached || Response.error();
      }
    })());
    return;
  }

  // Stale-while-revalidate for the app shell, embeds, css, images.
  event.respondWith((async () => {
    const cached = await caches.match(req);
    const network = fetch(req).then((res) => {
      if (res && res.ok) caches.open(CACHE).then((c) => c.put(req, res.clone()));
      return res;
    }).catch(() => null);
    return cached || (await network) || Response.error();
  })());
});

self.addEventListener('message', (event) => {
  const data = event.data || {};
  const client = event.source;

  if (data.type === 'cache-all' && Array.isArray(data.urls)) {
    event.waitUntil((async () => {
      const cache = await caches.open(CACHE);
      let done = 0;
      for (const u of data.urls) {
        try {
          const res = await fetch(u, { cache: 'reload' });
          if (res && res.ok) await cache.put(u, res.clone());
        } catch (err) { /* skip missing/unreachable */ }
        done++;
        if (client) client.postMessage({ type: 'cache-progress', done, total: data.urls.length });
      }
      if (client) client.postMessage({ type: 'cache-done', total: data.urls.length });
    })());
  } else if (data.type === 'cache-clear') {
    event.waitUntil(caches.delete(CACHE));
  }
});

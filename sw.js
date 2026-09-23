/* Service worker: lets the site install and work offline. It only ever caches this site's own files, never your saved data. */
const VERSION = '2026.09.23-1';
const CACHE = 'mp-' + VERSION;
const SHELL = ['./', 'index.html', 'products.json', 'manifest.webmanifest', 'icon.svg', 'icon-192.png', 'icon-512.png', 'icon-maskable-512.png', 'icon-180.png'];
self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(SHELL.map(u => new Request(u, { cache: 'reload' })))).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k.startsWith('mp-') && k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', e => {
  const req = e.request, url = new URL(req.url);
  if (req.method !== 'GET' || url.origin !== location.origin) return;
  if (url.pathname.endsWith('/version.json')) { e.respondWith(fetch(req).catch(() => new Response('{}', { headers: { 'Content-Type': 'application/json' } }))); return; }
  if (req.mode === 'navigate' || url.pathname.endsWith('/index.html')) {                   // the page itself: newest when online, saved copy when offline
    e.respondWith(fetch(req).then(res => { const copy = res.clone(); caches.open(CACHE).then(c => c.put('index.html', copy)); return res; }).catch(() => caches.match('index.html')));
    return;
  }
  if (url.pathname.endsWith('/products.json')) {                                             // the product list: show the saved one at once, refresh it in the background
    e.respondWith(caches.open(CACHE).then(c => c.match(req).then(hit => { const net = fetch(req).then(res => { if (res.ok) c.put(req, res.clone()); return res; }).catch(() => hit); return hit || net; })));
    return;
  }
  e.respondWith(caches.match(req).then(hit => hit || fetch(req)));
});

// AKT service worker · caché del shell de la app (Firestore gestiona su propio offline)
const CACHE = 'akt-v2';
const SHELL = ['./', './index.html', './manifest.json', './firebase-config.js', './icon-192.png', './icon-512.png'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(SHELL)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', e => {
  const url = new URL(e.request.url);
  // Solo cacheamos nuestros propios ficheros y los SDK de Firebase; el resto va directo a red
  const cacheable = url.origin === location.origin || url.hostname === 'www.gstatic.com';
  if (!cacheable || e.request.method !== 'GET') return;
  e.respondWith(
    caches.match(e.request).then(hit => {
      const fetching = fetch(e.request).then(res => {
        if (res && res.status === 200) caches.open(CACHE).then(c => c.put(e.request, res.clone()));
        return res;
      }).catch(() => hit);
      return hit || fetching;
    })
  );
});

const CACHE = 'ubs-digital-shell-v4'
const SHELL = ['/', '/manifest.webmanifest', '/icons/icon.svg', '/icons/icon-maskable.svg', '/icons/icon-192.png', '/icons/icon-512.png']
self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE).then(cache => cache.addAll(SHELL)).then(() => self.skipWaiting()))
})
self.addEventListener('activate', event => {
  event.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(key => key !== CACHE).map(key => caches.delete(key)))).then(() => self.clients.claim()))
})
self.addEventListener('fetch', event => {
  const request = event.request
  if (request.method !== 'GET' || new URL(request.url).origin !== self.location.origin || request.url.includes('/api/')) return
  event.respondWith(fetch(request).then(response => {
    if (response.ok && (request.mode === 'navigate' || /\.(js|css|json|svg|webmanifest)$/.test(new URL(request.url).pathname))) {
      const copy = response.clone()
      caches.open(CACHE).then(cache => cache.put(request, copy))
    }
    return response
  }).catch(() => caches.match(request).then(cached => cached || (request.mode === 'navigate' ? caches.match('/') : Response.error()))))
})

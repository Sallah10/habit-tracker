// public/sw.js
// Deliberately minimal. HTML pages are NEVER cached: this is an auth-gated app,
// and serving a stale page (or a logged-out shell to a logged-in user) causes
// far worse bugs than being offline. We only cache static assets. API is never
// cached either. Bump CACHE when this file changes so old workers are replaced.
const CACHE = 'habitapp-v2';
const PRECACHE = [
  '/manifest.webmanifest',
  '/icons/icon-192.png',
  '/icons/icon-512.png',
  '/default/social.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE).then((cache) => cache.addAll(PRECACHE)).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((key) => key !== CACHE).map((key) => caches.delete(key))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Only same-origin GETs.
  if (request.method !== 'GET' || url.origin !== self.location.origin) {
    return;
  }

  // Never touch API calls, and never cache/inject HTML navigations.
  if (url.pathname.startsWith('/api/') || request.mode === 'navigate') {
    return;
  }

  // Static assets: cache first, then network (and remember it).
  if (
    url.pathname.startsWith('/_next/static/') ||
    url.pathname.startsWith('/icons/') ||
    url.pathname.startsWith('/default/')
  ) {
    event.respondWith(
      caches.match(request).then((hit) => hit || fetch(request).then((response) => {
        const copy = response.clone();
        caches.open(CACHE).then((cache) => cache.put(request, copy));
        return response;
      }))
    );
  }
});

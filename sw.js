/**
 * x.GEN — Service Worker
 * Phase 8: PWA & Polish
 */

const CACHE_NAME = 'xgen-v1';

const PRECACHE_URLS = [
  '/',
  '/index.html',
  '/css/style.css',
  '/js/app.js',
  '/js/router.js',
  '/js/store.js',
  '/js/promptEngine.js',
  '/js/bridgeManager.js',
  '/js/storageManager.js',
  '/js/pages/home.js',
  '/js/pages/creationKit.js',
  '/js/pages/theLab.js',
  '/js/components/formRenderer.js',
  '/js/components/onboarding.js',
  '/js/components/settings.js',
  '/js/components/bridgeInstall.js',
  '/js/modules/presets.js',
  '/js/components/index.js',
  '/data/master_file.json',
  '/data/addon_file.json',
  '/data/defaultDummies.json',
  '/manifest.json',
  '/assets/icons/favicon.svg',
];

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(PRECACHE_URLS))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', (e) => {
  if (e.request.method !== 'GET') return;
  if (!e.request.url.startsWith(self.location.origin)) return;
  if (e.request.url.includes('venice.ai')) return;

  e.respondWith(
    caches.match(e.request).then(cached => {
      if (cached) return cached;

      return fetch(e.request).then(response => {
        if (!response || response.status !== 200 || response.type === 'opaque') {
          return response;
        }
        const clone = response.clone();
        caches.open(CACHE_NAME).then(cache => cache.put(e.request, clone));
        return response;
      }).catch(() => {
        if (e.request.mode === 'navigate') {
          return caches.match('/index.html');
        }
      });
    })
  );
});

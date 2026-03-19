/**
 * x.GEN — Service Worker
 * Phase 8: PWA & Polish
 */

const APP_VERSION = '1.0.2';
const CACHE_NAME = `xgen-v3-${APP_VERSION}`;
const APP_SCOPE = new URL(self.registration.scope);

function toAppUrl(path) {
  return new URL(path, APP_SCOPE).toString();
}

const PRECACHE_URLS = [
  '',
  'index.html',
  'css/style.css',
  `js/app.js?v=${APP_VERSION}`,
  'js/router.js',
  'js/store.js',
  'js/promptEngine.js',
  'js/bridgeManager.js',
  'js/storageManager.js',
  'js/pages/home.js',
  'js/pages/creationKit.js',
  'js/pages/theLab.js',
  'js/components/formRenderer.js',
  'js/components/onboarding.js',
  'js/components/settings.js',
  'js/components/bridgeInstall.js',
  'js/modules/presets.js',
  'js/components/index.js',
  'data/master_file.json',
  'data/addon_file.json',
  'data/defaultDummies.json',
  'manifest.json',
  'assets/icons/favicon.svg',
].map(toAppUrl);

const OFFLINE_FALLBACK_URL = toAppUrl('index.html');

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
  const requestUrl = new URL(e.request.url);
  if (requestUrl.origin !== APP_SCOPE.origin) return;
  if (!requestUrl.pathname.startsWith(APP_SCOPE.pathname)) return;

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
          return caches.match(OFFLINE_FALLBACK_URL);
        }
      });
    })
  );
});

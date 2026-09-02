// Service worker for Akshar Paaul Attendance — caches the app shell (the
// static files: this HTML, its manifest and icons) so the app still opens
// on a phone with no signal. It deliberately does NOT touch Firebase/Firestore
// requests or the Google Fonts CDN — those need the network and are already
// handled by the app's own offline queue (see PENDING_QUEUE in index.html).
//
// Bump CACHE_NAME whenever you want visitors to pick up a fresh shell sooner
// (the old cache is deleted automatically on the next visit either way).
const CACHE_NAME = 'akshar-paaul-shell-v1';
const SHELL_FILES = [
  './',
  './index.html',
  './manifest.json',
  './icon-192.png',
  './icon-512.png'
];

self.addEventListener('install', function(event){
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(function(cache){ return cache.addAll(SHELL_FILES); })
      .catch(function(){ /* fine on first install if a file 404s locally during dev */ })
  );
  self.skipWaiting();
});

self.addEventListener('activate', function(event){
  event.waitUntil(
    caches.keys().then(function(names){
      return Promise.all(names.filter(function(n){ return n !== CACHE_NAME; }).map(function(n){ return caches.delete(n); }));
    })
  );
  self.clients.claim();
});

// Stale-while-revalidate for same-origin GETs: answer instantly from cache
// when we have it (so the app opens offline), while quietly refreshing the
// cache in the background so the next open picks up anything new.
self.addEventListener('fetch', function(event){
  var req = event.request;
  if(req.method !== 'GET') return;
  var url = new URL(req.url);
  if(url.origin !== self.location.origin) return;

  event.respondWith(
    caches.open(CACHE_NAME).then(function(cache){
      return cache.match(req).then(function(cached){
        var network = fetch(req).then(function(res){
          if(res && res.status === 200) cache.put(req, res.clone());
          return res;
        }).catch(function(){ return cached; });
        return cached || network;
      });
    })
  );
});

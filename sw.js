/* Where To, Crew? — offline service worker.
   Strategy: NETWORK-FIRST for same-origin code (HTML/JS/CSS) so you always get
   the latest when online and it can NEVER serve a stale page; CACHE-FIRST for
   images (they don't change). Cross-origin (Supabase/Worker API, CDN libs, map
   tiles) is left untouched. Versioned cache + skipWaiting + clients.claim so a
   new deploy takes over immediately. This is the offline support, done right. */
var CACHE = 'wtc-v4';
// Resolve the app-shell as ABSOLUTE same-origin URLs relative to THIS worker's
// location (e.g. .../where-to-crew/), so addAll works under any subpath.
var BASE = self.location.href.replace(/sw\.js(\?.*)?$/, '');
var SHELL = [
  'index.html','emergency.html',
  'poland/sign-up.html','poland/plan-draft.html','poland/plan.html',
  'assets/motion.css','assets/site.css',
  'assets/motion.js','assets/config.js','assets/store.js','assets/crew.js','assets/plan-draft.js','assets/checklist.js',
  'manifest.webmanifest'
].map(function(p){ return BASE + p; });

self.addEventListener('install', function(e){
  // cache each file independently so one failure can't wipe the whole precache
  e.waitUntil(caches.open(CACHE).then(function(c){
    return Promise.all(SHELL.map(function(u){ return c.add(u).catch(function(){}); }));
  }).then(function(){ return self.skipWaiting(); }));
});
self.addEventListener('activate', function(e){
  e.waitUntil(caches.keys().then(function(keys){ return Promise.all(keys.filter(function(k){ return k!==CACHE; }).map(function(k){ return caches.delete(k); })); }).then(function(){ return self.clients.claim(); }));
});

function putCache(req, res){ var copy=res.clone(); caches.open(CACHE).then(function(c){ c.put(req, copy); }); return res; }
function networkFirst(req, fallback){
  return fetch(req).then(function(res){ return putCache(req, res); })
    .catch(function(){ return caches.match(req).then(function(m){ return m || (fallback && caches.match(fallback)); }); });
}
function cacheFirst(req){
  return caches.match(req).then(function(m){ return m || fetch(req).then(function(res){ return putCache(req, res); }); });
}

self.addEventListener('fetch', function(e){
  var req = e.request;
  if(req.method !== 'GET') return;                                   // never touch API writes
  if(new URL(req.url).origin !== self.location.origin) return;       // skip cross-origin (API/CDN/tiles)
  if(/\.(?:jpg|jpeg|png|gif|webp|svg|ico|woff2?|ttf)(?:\?|$)/i.test(req.url)) e.respondWith(cacheFirst(req));
  else e.respondWith(networkFirst(req, './poland/plan.html'));
});

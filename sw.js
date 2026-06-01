/* Where To, Crew? — offline cache so the plan, the emergency one-pager and
   saved bookings work in patchy Tatra signal. Network-first for HTML (fresh
   content when online), cache-first for assets/images. */
var CACHE = 'wtc-poland-v2';
var PRECACHE = [
  './index.html',
  './poland/plan.html',
  './poland/plan-draft.html',
  './poland/sign-up.html',
  './emergency.html',
  './assets/motion.css',
  './assets/site.css',
  './assets/motion.js',
  './assets/crew.js',
  './assets/plan-draft.js',
  './assets/checklist.js'
];

self.addEventListener('install', function(e){
  e.waitUntil(caches.open(CACHE).then(function(c){ return c.addAll(PRECACHE).catch(function(){}); }).then(function(){ return self.skipWaiting(); }));
});
self.addEventListener('activate', function(e){
  e.waitUntil(caches.keys().then(function(keys){ return Promise.all(keys.filter(function(k){ return k!==CACHE; }).map(function(k){ return caches.delete(k); })); }).then(function(){ return self.clients.claim(); }));
});
// Network-first for CODE (HTML/JS/CSS) so edits always show when online and
// we never serve a stale page/script; cache-first only for images/fonts (they
// don't change). Everything still falls back to cache when offline.
function networkFirst(req, fallback){
  return fetch(req).then(function(res){ var copy=res.clone(); caches.open(CACHE).then(function(c){ c.put(req, copy); }); return res; })
    .catch(function(){ return caches.match(req).then(function(m){ return m || (fallback && caches.match(fallback)); }); });
}
function cacheFirst(req){
  return caches.match(req).then(function(m){ return m || fetch(req).then(function(res){ var copy=res.clone(); caches.open(CACHE).then(function(c){ c.put(req, copy); }); return res; }); });
}
self.addEventListener('fetch', function(e){
  var req = e.request;
  if(req.method !== 'GET') return;
  var url = req.url;
  var isImg = /\.(?:jpg|jpeg|png|gif|webp|svg|woff2?|ttf)(?:\?|$)/i.test(url);
  var isHTML = req.mode === 'navigate' || (req.headers.get('accept')||'').indexOf('text/html') >= 0;
  if(isImg)       e.respondWith(cacheFirst(req));
  else if(isHTML) e.respondWith(networkFirst(req, './poland/plan.html'));
  else            e.respondWith(networkFirst(req));   // JS / CSS / JSON — always fresh online
});

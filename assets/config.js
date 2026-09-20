/* Where To, Crew? — backend config (the ONE place the shared store is wired).
   apiUrl '' => the site runs in local-only mode (saves to this device).
   Set apiUrl to the Cloudflare Worker URL to turn on the shared, multi-year,
   multi-trip store. `trip` namespaces the data so each trip gets its own bucket
   in the same backend. Swapping backends later = change apiUrl only.

   `trip` is DERIVED from the folder the page lives in (…/observatory/plan.html
   -> 'observatory'), not hardcoded. Poland keeps writing to 'poland' and the
   Observatory gets its own bucket, with no per-page edit when the next trip is
   added — just a new folder plus one entry in TRIPS. Getting this wrong is
   silent: assets/store.js falls back to 'poland', so an un-namespaced trip
   would write its sign-ups straight into the Poland data. */
(function(){
  var TRIPS  = { observatory:1, poland:1, next:1 };   // every trip folder that has its own bucket
  var ACTIVE = 'observatory';                 // fallback for root pages (index/emergency/car-games)
  var folder = location.pathname.replace(/\/[^\/]*$/, '').split('/').pop() || '';
  window.WTC_CFG = {
    apiUrl: 'https://wtc-store.mantekarys.workers.dev',
    trip: TRIPS[folder] ? folder : ACTIVE
  };
})();

/* Where To, Crew? — backend config (the ONE place the shared store is wired).
   apiUrl '' => the site runs in local-only mode (saves to this device).
   Set apiUrl to the Cloudflare Worker URL to turn on the shared, multi-year,
   multi-trip store. `trip` namespaces the data so future trips get their own
   bucket in the same backend. Swapping backends later = change apiUrl only. */
window.WTC_CFG = {
  apiUrl: 'https://wtc-store.mantekarys.workers.dev',
  trip: 'poland'
};

/* Where To, Crew? — the group-decision layer.
   Reads the shared store (assets/store.js → Cloudflare Worker/KV, with a local
   cache + local-only fallback). Every real sign-up + plan-draft shows up here,
   so "crew leaning" / consensus reflect the actual crew. No mock/seed people. */
(function(){
  var SEED = [];

  function isoFromDay(d){ var m=/(\d{1,2})/.exec(String(d||'')); return m?('2026-06-'+String(+m[1]).padStart(2,'0')):null; }

  // Map the shared store's entries → the people shape the UI expects.
  function all(){
    var crew = (window.Store ? window.Store.cached() : {}) || {};
    var meKey = window.Store ? window.Store.key(window.Store.me()) : '';
    var people = Object.keys(crew).map(function(k){
      var e = crew[k] || {}; var su = e.signup || {}; var pl = e.plan || {};
      return {
        name: (e.name || k) + (k === meKey ? ' (you)' : ''),
        going: e.going || 'in',
        availableDays: (su.dates || []).map(isoFromDay).filter(Boolean),
        rawDays: su.dates || [],
        stops: su.stops || [],
        vibes: su.vibes || [],
        activities: su.activities || [],
        tripLength: su.length || (pl.sel && pl.sel.length) || '',
        plan: pl.sel || null            // the plan-draft picks, for leaning
      };
    });
    // only count people who are in/maybe (not "can't this time") for leaning
    return people;
  }

  // count helper -> [[key, n, [names...]], ...] sorted desc
  function tally(people, getList){
    var counts = {}, who = {};
    people.forEach(function(p){
      (getList(p)||[]).forEach(function(k){
        counts[k] = (counts[k]||0)+1;
        (who[k] = who[k]||[]).push(p.name);
      });
    });
    return Object.keys(counts).map(function(k){ return [k, counts[k], who[k]]; })
      .sort(function(a,b){ return b[1]-a[1]; });
  }

  window.CREW = { seed:SEED, all:all, tally:tally };
})();

/* Where To, Crew? — the group-decision layer.
   Reads the shared store (assets/store.js → Cloudflare Worker/KV, with a local
   cache + local-only fallback). Every real sign-up + plan-draft shows up here,
   so "crew leaning" / consensus reflect the actual crew. No mock/seed people. */
(function(){
  var SEED = [];

  function isoFromDay(d){
    var s=String(d||'').trim(), full=/^\d{4}-\d{2}-\d{2}$/.exec(s);
    if(full) return s;
    var m=/^(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\s+(\d{1,2})(?:,?\s+(\d{4}))?$/i.exec(s);
    if(!m) return null;
    var months=['jan','feb','mar','apr','may','jun','jul','aug','sep','oct','nov','dec'];
    return (m[3]||'2026')+'-'+String(months.indexOf(m[1].slice(0,3).toLowerCase())+1).padStart(2,'0')+'-'+String(+m[2]).padStart(2,'0');
  }

  // Map the shared store's entries → the people shape the UI expects.
  function all(){
    var crew = (window.Store ? window.Store.cached() : {}) || {};
    var meKey = window.Store ? window.Store.key(window.Store.me()) : '';
    var people = Object.keys(crew).map(function(k){
      var e = crew[k] || {}; var su = e.signup || {}; var pl = e.plan || {};
      return {
        name: (e.name || k) + (k === meKey ? ' (you)' : ''),
        going: e.going || 'in',
        availableDays: (Array.isArray(su.dates)?su.dates:[]).map(isoFromDay).filter(Boolean),
        rawDays: Array.isArray(su.dates)?su.dates:[],
        stops: Array.isArray(su.stops)?su.stops:[],
        vibes: Array.isArray(su.vibes)?su.vibes:[],
        activities: Array.isArray(su.activities)?su.activities:[],
        notes: typeof su.notes==='string'?su.notes:'',
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

  function esc(x){ return String(x==null?'':x).replace(/[&<>"']/g,function(c){ return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]; }); }
  function suggestions(people){
    return (people||all()).filter(function(p){ return p.stops.length || p.activities.length || p.notes; });
  }
  function renderSuggestions(target, people){
    if(!target) return;
    var items=suggestions(people);
    target.innerHTML=items.length ? items.map(function(p){
      var parts=[];
      p.stops.forEach(function(s){ if(s&&s.label) parts.push('<li><b>Stop:</b> '+esc(s.label)+'</li>'); });
      p.activities.forEach(function(a){ if(a) parts.push('<li><b>Idea:</b> '+esc(a)+'</li>'); });
      if(p.notes) parts.push('<li><b>Note:</b> '+esc(p.notes)+'</li>');
      return '<article class="crew-suggestion"><h4>'+esc(p.name)+'</h4><ul>'+parts.join('')+'</ul></article>';
    }).join('') : '<p class="muted">No crew suggestions yet. Add yours on sign-up and the crew will see it here.</p>';
  }
  function onChange(fn){
    function handler(e){ if(!e.detail || !window.Store || e.detail.trip===window.Store.trip) fn(all()); }
    window.addEventListener('wtc:crew-updated',handler);
    fn(all());
    return function(){ window.removeEventListener('wtc:crew-updated',handler); };
  }

  window.CREW = { seed:SEED, all:all, tally:tally, suggestions:suggestions, renderSuggestions:renderSuggestions, onChange:onChange };
})();

/* Where To, Crew? — the group-decision layer. Crew picks come from real
   sign-ups (the shared sheet, wired later); for now we only surface whatever
   the current user has saved locally. No mock/seed people. */
(function(){
  var SEED = [];   // no fake crew — real sign-ups only

  function all(){
    // merge current user's saved signup (if any) as a person named after them
    var me = null;
    try { var s = JSON.parse(localStorage.getItem('wtc-poland-signup')||'null'); if(s && s.name) me = s; } catch(e){}
    var mePlan = null;
    try { var p = JSON.parse(localStorage.getItem('wtc-poland-plan')||'null'); if(p && p.sel) mePlan = p.sel; } catch(e){}
    var people = SEED.slice();
    if(me){
      people.push({
        name: me.name + ' (you)', going: me.going||'in',
        availableDays: (me.dates||[]).map(function(d){ // "Jun 24" -> iso
          var m = /Jun\s+(\d+)/.exec(d); return m ? '2026-06-'+String(+m[1]).padStart(2,'0') : null;
        }).filter(Boolean),
        stops: [], vibes: me.vibes||[], tripLength: me.length||'',
        activities: me.activities||[], plan: mePlan
      });
    }
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

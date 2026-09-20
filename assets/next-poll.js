(function(){
  'use strict';
  var trips = window.NEXT_TRIPS || [];
  var grid = document.getElementById('tripGrid');
  var form = document.getElementById('voteForm');
  var nameInput = document.getElementById('voterName');
  var noteInput = document.getElementById('voterNote');
  var status = document.getElementById('saveStatus');
  var summary = document.getElementById('voteSummary');
  var results = document.getElementById('resultsList');
  var notes = document.getElementById('crewNotes');

  function esc(v){ return String(v==null?'':v).replace(/[&<>'"]/g,function(c){ return {'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]; }); }
  function url(v){ return /^https:\/\//.test(v||'') ? esc(v) : '#'; }
  function tripById(id){ return trips.find(function(t){ return t.id===id; }); }

  function card(t){
    return '<article class="trip-card" data-trip="'+esc(t.id)+'" data-budget="'+t.budget+'">'+
      '<div class="trip-photo"><img src="'+esc(t.image)+'" alt="'+esc(t.imageAlt)+'" loading="lazy" width="900" height="600">'+
      '<div class="photo-shade"></div><span class="place-tag">'+esc(t.place)+'</span><a class="photo-credit" href="'+url(t.creditUrl)+'" target="_blank" rel="noopener">'+esc(t.credit)+' ↗</a></div>'+
      '<div class="trip-body"><h2 class="trip-title">'+esc(t.title)+'</h2><p class="trip-strap">'+esc(t.strap)+'</p>'+
      '<div class="price-row"><div class="price-box"><span class="k">Estimated whole trip · per person</span><strong>'+esc(t.estimate)+'</strong></div><div class="price-box checked"><span class="k">Checked core price</span><strong>'+esc(t.core)+'</strong></div></div>'+
      '<div class="fact-grid"><div class="fact"><div class="k">Best window</div><div class="v">'+esc(t.season)+'</div></div><div class="fact"><div class="k">Whole trip</div><div class="v">'+esc(t.duration)+'</div></div><div class="fact"><div class="k">Actual activity time</div><div class="v">'+esc(t.timing)+'</div></div><div class="fact"><div class="k">Physical</div><div class="v">'+esc(t.intensity)+'</div></div><div class="fact"><div class="k">Getting there</div><div class="v">'+esc(t.travel)+'</div></div><div class="fact"><div class="k">Main uncertainty</div><div class="v">'+esc(t.risk)+'</div></div></div>'+
      '<div class="card-actions"><label class="vote-control favorite"><input type="radio" name="favorite" value="'+esc(t.id)+'" form="voteForm"><span>★ My favorite</span></label><label class="vote-control"><input type="checkbox" name="join" value="'+esc(t.id)+'" form="voteForm"><span>✓ I would join</span></label></div>'+
      '<details class="trip-details"><summary>Activity plan, price basis &amp; booking</summary><div class="detail-content"><a class="booking-link" href="'+url(t.sources[0][1])+'" target="_blank" rel="noopener">Open the main provider / booking page ↗</a><h4>Realistic activity plan</h4><ol class="activity-plan">'+t.plan.map(function(p){return '<li>'+esc(p)+'</li>';}).join('')+'</ol><h4>How the price was built</h4><p class="basis">'+esc(t.basis)+'</p><h4>Evidence and booking links</h4><div class="source-list">'+t.sources.map(function(s){return '<a href="'+url(s[1])+'" target="_blank" rel="noopener">'+esc(s[0])+' ↗</a>';}).join('')+'</div></div></details></div></article>';
  }

  grid.innerHTML = trips.map(card).join('');
  document.getElementById('candidateCount').textContent = trips.length+' choices';

  function selected(){
    var fav = document.querySelector('input[name="favorite"]:checked');
    var joins = Array.from(document.querySelectorAll('input[name="join"]:checked')).map(function(i){return i.value;});
    return {favorite:fav?fav.value:'',join:joins,note:noteInput.value.trim().slice(0,500)};
  }
  function updateSummary(){
    var pick=selected(), fav=tripById(pick.favorite), joinNames=pick.join.map(tripById).filter(Boolean).map(function(t){return t.place;});
    summary.innerHTML = fav ? '<b>Favorite:</b> '+esc(fav.place)+'<br><b>Would join:</b> '+esc(joinNames.join(', ')||fav.place) : 'Pick one favorite. You can also mark every other trip you would actually join.';
  }
  function loadMine(crew){
    var me=(window.Store&&Store.me())||''; nameInput.value=me;
    var mine=null, norm=me.normalize('NFKD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/\s+/g,' ').trim();
    Object.keys(crew||{}).some(function(k){var e=crew[k], n=String((e&&e.name)||k).normalize('NFKD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/\s+/g,' ').trim(); if(norm&&n===norm){mine=e;return true;}return false;});
    if(!mine||!mine.poll) return updateSummary();
    var p=mine.poll;
    if(p.favorite){ var f=document.querySelector('input[name="favorite"][value="'+CSS.escape(p.favorite)+'"]'); if(f) f.checked=true; }
    (p.join||[]).forEach(function(id){var j=document.querySelector('input[name="join"][value="'+CSS.escape(id)+'"]');if(j)j.checked=true;});
    noteInput.value=p.note||''; updateSummary();
  }

  grid.addEventListener('change',function(e){
    if(e.target.name==='favorite'&&e.target.checked){var join=document.querySelector('input[name="join"][value="'+CSS.escape(e.target.value)+'"]');if(join)join.checked=true;}
    if(e.target.name==='join'&&!e.target.checked){var fav=document.querySelector('input[name="favorite"]:checked');if(fav&&fav.value===e.target.value){e.target.checked=true;status.textContent='Your favorite is always included in “would join”.';}}
    updateSummary();
  });
  noteInput.addEventListener('input',updateSummary);

  form.addEventListener('submit',function(e){
    e.preventDefault(); var name=nameInput.value.replace(/\s+/g,' ').trim(), pick=selected();
    if(!name){status.textContent='Add your name so the crew knows whose vote this is.';nameInput.focus();return;}
    if(!pick.favorite){status.textContent='Choose one favorite first.';grid.scrollIntoView({behavior:'smooth',block:'start'});return;}
    if(pick.join.indexOf(pick.favorite)<0) pick.join.push(pick.favorite);
    Store.setMe(name); status.textContent='Saving…';
    Store.saveMine({poll:pick}).then(function(r){status.textContent=r&&r.synced?'Saved — everyone opening this poll can see it.':'Saved on this device; it will sync when the connection returns.';return Store.all();}).then(renderResults).catch(function(){status.textContent='Saved locally; the shared connection is unavailable right now.';renderResults(Store.cached());});
  });

  function renderResults(crew){
    var tally={}; trips.forEach(function(t){tally[t.id]={trip:t,favorites:[],joins:[]};});
    var voterCount=0, noteRows=[];
    Object.keys(crew||{}).forEach(function(k){
      var e=crew[k]||{}, p=e.poll; if(!p||!p.favorite||!tally[p.favorite])return; voterCount++;
      var n=e.name||k; tally[p.favorite].favorites.push(n);
      Array.from(new Set((p.join||[]).concat(p.favorite))).forEach(function(id){if(tally[id])tally[id].joins.push(n);});
      if(p.note)noteRows.push({name:n,text:p.note});
    });
    document.getElementById('voterCount').textContent=voterCount+(voterCount===1?' voter':' voters');
    if(!voterCount){results.innerHTML='<div class="empty-results">No votes yet. Be the first to choose a favorite.</div>';notes.innerHTML='';return;}
    var ranked=Object.keys(tally).map(function(k){return tally[k];}).sort(function(a,b){var as=a.favorites.length*2+a.joins.length,bs=b.favorites.length*2+b.joins.length;return bs-as||b.favorites.length-a.favorites.length||a.trip.budget-b.trip.budget;});
    var max=Math.max.apply(null,ranked.map(function(r){return r.favorites.length*2+r.joins.length;}));
    results.innerHTML=ranked.map(function(r){var score=r.favorites.length*2+r.joins.length, favSet=new Set(r.favorites);var people=r.joins.map(function(n){return (favSet.has(n)?'★ ':'')+n;});return '<div class="result-row"><div class="result-top"><span class="result-name">'+esc(r.trip.place)+' · '+esc(r.trip.title)+'</span><span class="result-score">'+r.favorites.length+' favorite · '+r.joins.length+' would join</span></div><div class="result-track"><div class="result-fill" style="width:'+Math.round(score/max*100)+'%"></div></div><div class="result-people">'+(people.length?esc(people.join(' · ')):'No one yet')+'</div></div>';}).join('');
    notes.innerHTML=noteRows.length?'<h3>Crew notes</h3>'+noteRows.map(function(n){return '<div class="note-row"><b>'+esc(n.name)+':</b> '+esc(n.text)+'</div>';}).join(''):'';
  }

  document.querySelectorAll('.filter').forEach(function(btn){btn.addEventListener('click',function(){
    document.querySelectorAll('.filter').forEach(function(b){b.classList.toggle('on',b===btn);}); var f=btn.dataset.filter,count=0;
    document.querySelectorAll('.trip-card').forEach(function(card){var b=Number(card.dataset.budget),show=f==='all'||(f==='under600'&&b<600)||(f==='600to899'&&b>=600&&b<900)||(f==='900plus'&&b>=900);card.classList.toggle('hidden',!show);if(show)count++;});
    document.getElementById('candidateCount').textContent=count+' '+(count===1?'choice':'choices');
  });});

  document.getElementById('sharePoll').addEventListener('click',function(){
    var data={title:'Where To, Crew? — choose our next trip',text:'Compare the researched trip ideas and add your vote.',url:location.href};
    if(navigator.share){navigator.share(data).catch(function(){});return;}
    navigator.clipboard.writeText(location.href).then(function(){status.textContent='Poll link copied.';}).catch(function(){window.prompt('Copy this poll link:',location.href);});
  });

  Store.all().then(function(crew){loadMine(crew);renderResults(crew);});
  window.addEventListener('wtc:crew-updated',function(e){if(e.detail&&e.detail.trip==='next')renderResults(Store.cached());});
})();

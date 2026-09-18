/* Observatory plan links carry the chosen plan in the URL hash. */
(function(){
  var trip=(window.WTC_CFG && window.WTC_CFG.trip) || 'observatory';
  var key='wtc-'+trip+'-plan';
  function enc(str){ return btoa(unescape(encodeURIComponent(str))).replace(/\+/g,'-').replace(/\//g,'_').replace(/=+$/,''); }
  function dec(str){ str=String(str).replace(/-/g,'+').replace(/_/g,'/'); while(str.length%4) str+='='; return decodeURIComponent(escape(atob(str))); }
  function encodePlan(plan){
    plan=plan || WTC.load(key,{}) || {};
    var who=plan.who || (window.Store && window.Store.me && window.Store.me()) || '';
    return enc(JSON.stringify({v:1,who:who,sel:plan.sel||{},total:plan.total||null,bookings:plan.bookings||[],bookingStatus:plan.bookingStatus||{},night:plan.night||null}));
  }
  function decodePlan(value){
    try{
      var plan=JSON.parse(dec(value));
      if(!plan || plan.v!==1 || !plan.sel || typeof plan.sel!=='object' || ['40cm','80cm'].indexOf(plan.sel.anchor)<0) return null;
      plan.who=typeof plan.who==='string' ? plan.who.slice(0,100) : '';
      plan.total=typeof plan.total==='number' && Number.isFinite(plan.total) ? plan.total : null;
      plan.bookings=Array.isArray(plan.bookings) ? plan.bookings.filter(function(b){return b && typeof b==='object';}).slice(0,30).map(function(b){
        return {id:String(b.id||'').slice(0,80),name:String(b.name||'').slice(0,200),where:String(b.where||'').slice(0,300),must:!!b.must};
      }) : [];
      plan.bookingStatus=plan.bookingStatus && typeof plan.bookingStatus==='object' ? plan.bookingStatus : {};
      plan.night=typeof plan.night==='number' && Number.isFinite(plan.night) ? plan.night : null;
      return plan;
    }
    catch(e){ return null; }
  }
  function shareURL(plan){ return location.origin+location.pathname.replace(/[^/]*$/,'plan.html')+'#p='+encodePlan(plan); }
  function toast(message){
    var node=document.createElement('div'); node.textContent=message;
    node.style.cssText='position:fixed;left:50%;bottom:26px;transform:translateX(-50%);z-index:9999;background:#0b1310;color:#f3ede1;border:1px solid rgba(243,237,225,.2);border-radius:10px;padding:.7em 1.1em;font-family:monospace;font-size:.8rem;box-shadow:0 10px 34px rgba(0,0,0,.4);opacity:0;transition:opacity .25s;';
    document.body.appendChild(node); requestAnimationFrame(function(){node.style.opacity='1';});
    setTimeout(function(){node.style.opacity='0';setTimeout(function(){node.remove();},320);},2300);
  }
  function sharePlan(plan){
    plan=plan || WTC.load(key,{}) || {};
    if(!plan.sel || !plan.sel.anchor){ toast('Choose a telescope first to share the night plan.'); return; }
    var url=shareURL(plan), who=plan.who || (window.Store && window.Store.me && window.Store.me()) || '';
    var title='Where To, Crew? — '+(who?who+'’s ':'')+'Observatory plan';
    var message=(who?who+'’s ':'My ')+'Observatory night plan'+(plan.total?' (≈ €'+plan.total+'/person)':'')+' — tap to see it:';
    if(navigator.share){ navigator.share({title:title,text:message,url:url}).catch(function(){}); }
    else if(navigator.clipboard && navigator.clipboard.writeText){ navigator.clipboard.writeText(url).then(function(){toast('Plan link copied — paste it to the crew.');}).catch(function(){prompt('Copy your plan link:',url);}); }
    else { prompt('Copy your plan link:',url); }
  }
  window.WTC_encodePlan=encodePlan;
  window.WTC_decodePlan=decodePlan;
  window.WTC_shareURL=shareURL;
  window.WTC_sharePlan=sharePlan;
})();

/* Reusable trip invitation. Each trip gets its own sign-up URL and store bucket. */
(function(){
  function trip(){ return (window.WTC_CFG && window.WTC_CFG.trip) || ''; }
  function inviteURL(){
    var t=trip(), path=location.pathname, marker='/'+t+'/';
    var root=path.indexOf(marker)>=0 ? path.slice(0,path.lastIndexOf(marker)+1) : path.replace(/[^/]*$/,'');
    return location.origin+root+encodeURIComponent(t)+'/sign-up.html';
  }
  function toast(message){
    var node=document.createElement('div'); node.setAttribute('role','status'); node.className='trip-toast'; node.textContent=message;
    document.body.appendChild(node); setTimeout(function(){ node.remove(); },3200);
  }
  function shareTrip(){
    var url=inviteURL(), title='Where To, Crew? · '+trip();
    if(navigator.share) return navigator.share({title:title,text:'Add your availability and suggestions for this trip.',url:url}).catch(function(){});
    if(navigator.clipboard && navigator.clipboard.writeText) return navigator.clipboard.writeText(url).then(function(){toast('Trip link copied — send it to the crew.');}).catch(function(){window.prompt('Copy the trip link:',url);});
    window.prompt('Copy the trip link:',url);
  }
  function bind(){ document.querySelectorAll('[data-share-trip]').forEach(function(b){ b.addEventListener('click',shareTrip); }); }
  window.WTC_tripInviteURL=inviteURL;
  window.WTC_shareTrip=shareTrip;
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',bind); else bind();
})();

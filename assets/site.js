/* Where To, Crew? — shared behaviors */
(function(){
  // sticky nav state
  var nav = document.querySelector('.nav');
  if(nav){
    var onScroll = function(){
      if(window.scrollY > 24) nav.classList.add('scrolled');
      else nav.classList.remove('scrolled');
    };
    onScroll();
    window.addEventListener('scroll', onScroll, {passive:true});
  }

  // ---- in-view utility (scroll-position based; robust even where IntersectionObserver won't composite) ----
  var watchers = [];
  function runAll(){ watchers.slice().forEach(function(c){ c(); }); }
  window.onInView = function(el, cb, opts){
    opts = opts || {};
    var thresh = opts.threshold != null ? opts.threshold : 0.12;
    function check(){
      var r = el.getBoundingClientRect();
      var vh = window.innerHeight || document.documentElement.clientHeight;
      if(r.width===0 && r.height===0) return false;          // hidden (e.g. inactive hero variant)
      if(r.top < vh*(1-thresh) && r.bottom > vh*0.03){
        cb(); var i = watchers.indexOf(check); if(i>=0) watchers.splice(i,1); return true;
      }
      return false;
    }
    if(!check()) watchers.push(check);
  };
  window.addEventListener('scroll', runAll, {passive:true});
  window.addEventListener('resize', runAll);
  window.addEventListener('load', runAll);
  requestAnimationFrame(runAll);
  setTimeout(runAll, 250);
  setTimeout(runAll, 800);

  // scroll reveal (+ image wipes)
  document.querySelectorAll('.reveal, .rv-wipe').forEach(function(el){
    window.onInView(el, function(){ el.classList.add('in'); });
  });

  // gentle parallax for [data-parallax]
  var px = document.querySelectorAll('[data-parallax]');
  if(px.length && !matchMedia('(prefers-reduced-motion:reduce)').matches){
    var tick = function(){
      var vh = window.innerHeight;
      px.forEach(function(el){
        var r = el.getBoundingClientRect();
        var speed = parseFloat(el.getAttribute('data-parallax')) || 0.12;
        var off = (r.top + r.height/2 - vh/2) * speed * -1;
        el.style.setProperty('--py', off.toFixed(1)+'px');
      });
      raf = null;
    };
    var raf = null;
    window.addEventListener('scroll', function(){ if(!raf) raf = requestAnimationFrame(tick); }, {passive:true});
    tick();
  }
})();

/* shared helpers exposed for page scripts */
window.WTC = {
  eur: function(n){ return '€' + Math.round(n); },
  save: function(key, val){ try{ localStorage.setItem(key, JSON.stringify(val)); }catch(e){} },
  load: function(key, fallback){ try{ var v = localStorage.getItem(key); return v ? JSON.parse(v) : fallback; }catch(e){ return fallback; } }
};

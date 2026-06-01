/* Where To, Crew? — motion helpers (scramble/decode, count-up, drag carousel, mask reveals) */
(function(){
  var reduce = matchMedia('(prefers-reduced-motion:reduce)').matches;

  /* ---------- text scramble / decode ---------- */
  var GLYPHS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#%&*?/<>=+'.split('');
  function scramble(el, opts){
    opts = opts || {};
    var dur = opts.duration || 1100;
    // capture text nodes so markup (<br>, <span>) survives
    var walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT, null);
    var nodes = [], n;
    while((n = walker.nextNode())) if(n.nodeValue.trim().length || n.nodeValue.length) nodes.push(n);
    var slots = [];
    nodes.forEach(function(node){
      var chars = node.nodeValue.split('');
      slots.push({ node:node, chars:chars });
      node.nodeValue = chars.map(function(c){ return c===' '? ' ' : ''; }).join('');
    });
    var total = slots.reduce(function(s,x){ return s + x.chars.length; }, 0);
    if(reduce){ slots.forEach(function(s){ s.node.nodeValue = s.chars.join(''); }); return; }
    var start = null;
    function frame(t){
      if(start===null) start = t;
      var p = Math.min(1, (t-start)/dur);
      // ease
      var eased = 1 - Math.pow(1-p, 3);
      var revealCount = Math.floor(eased * total);
      var idx = 0;
      slots.forEach(function(s){
        var out = '';
        for(var i=0;i<s.chars.length;i++){
          var ch = s.chars[i];
          if(ch===' '){ out += ' '; idx++; continue; }
          if(idx < revealCount){ out += ch; }
          else if(idx < revealCount + 8){ out += GLYPHS[(Math.random()*GLYPHS.length)|0]; }
          else { out += ''; }
          idx++;
        }
        s.node.nodeValue = out;
      });
      if(p < 1) requestAnimationFrame(frame);
      else slots.forEach(function(s){ s.node.nodeValue = s.chars.join(''); });
    }
    requestAnimationFrame(frame);
  }
  window.scrambleText = scramble;

  /* fire scramble when element enters view */
  function arm(el){
    var trigger = function(){ scramble(el, { duration: +el.getAttribute('data-scramble-dur') || 1100 }); };
    if(window.onInView) window.onInView(el, trigger, {threshold:0.18});
    else trigger();
  }
  document.querySelectorAll('[data-scramble]').forEach(arm);

  /* ---------- count-up ---------- */
  function countUp(el){
    var target = parseFloat(el.getAttribute('data-countup'));
    var prefix = el.getAttribute('data-prefix') || '';
    var suffix = el.getAttribute('data-suffix') || '';
    var dur = 1200;
    if(reduce){ el.textContent = prefix + target + suffix; return; }
    var start = null;
    function frame(t){
      if(start===null) start = t;
      var p = Math.min(1, (t-start)/dur);
      var eased = 1 - Math.pow(1-p, 3);
      el.textContent = prefix + Math.round(eased*target) + suffix;
      if(p<1) requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
  }
  document.querySelectorAll('[data-countup]').forEach(function(el){
    if(window.onInView) window.onInView(el, function(){ countUp(el); }, {threshold:0.35});
    else countUp(el);
  });

  /* ---------- drag-to-scroll carousels ---------- */
  document.querySelectorAll('[data-drag]').forEach(function(track){
    var down=false, sx=0, sl=0, moved=false;
    track.addEventListener('pointerdown', function(e){
      down=true; moved=false; sx=e.clientX; sl=track.scrollLeft; track.setPointerCapture(e.pointerId); track.classList.add('dragging');
    });
    track.addEventListener('pointermove', function(e){
      if(!down) return; var dx = e.clientX - sx; if(Math.abs(dx)>3) moved=true; track.scrollLeft = sl - dx;
    });
    var end = function(e){ down=false; track.classList.remove('dragging'); };
    track.addEventListener('pointerup', end);
    track.addEventListener('pointercancel', end);
    // prevent click navigation after a drag
    track.addEventListener('click', function(e){ if(moved){ e.preventDefault(); e.stopPropagation(); } }, true);
  });
})();

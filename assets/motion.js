/* ============================================================
   Where To, Crew? — cohesion system (shared across every page)
   ONE Lenis conductor · ONE reveal() · ONE cursor · ONE magnetic ·
   ONE transition · ambient layer · reduced-motion + touch guard.
   Requires: gsap, ScrollTrigger, SplitText, lenis (loaded before this).
   Page-specific timelines (route map, etc.) live in the page itself
   and can call WTCM.* helpers after this runs.
   ============================================================ */
(function(){
  var reduce = matchMedia('(prefers-reduced-motion:reduce)').matches;
  var fine   = matchMedia('(hover:hover) and (pointer:fine)').matches;
  var hasGSAP = !!window.gsap;

  // shared tokens (reused everywhere)
  var TOK = {
    easeOut:'expo.out', easeInOut:'expo.inOut', short:'power3.out', snap:'elastic.out(1,.4)',
    dMicro:0.3, dStd:0.85, dHero:1.0,
    sChar:0.012, sLine:0.06, sCard:0.1
  };

  var lenis = null;

  if(hasGSAP){
    gsap.registerPlugin.apply(gsap, [window.ScrollTrigger, window.SplitText, window.DrawSVGPlugin, window.MotionPathPlugin].filter(Boolean));
    gsap.defaults({ ease:TOK.easeOut, duration:TOK.dStd });
  }

  /* ---- ONE scroll conductor: Lenis ---- */
  if(hasGSAP && !reduce && window.Lenis){
    lenis = new Lenis({ lerp:0.1, wheelMultiplier:1 });
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add(function(t){ lenis.raf(t*1000); });
    gsap.ticker.lagSmoothing(0);
  }

  /* ---- ONE reveal(): masked per-line/word/fade ---- */
  function reveal(el){
    if(!hasGSAP){ return; }
    var mode = el.getAttribute('data-reveal') || 'lines';
    if(reduce){ gsap.set(el,{opacity:1}); return; }
    if(mode==='fade'){
      gsap.from(el,{ opacity:0, y:24, duration:TOK.dStd, ease:TOK.easeOut,
        scrollTrigger:{ trigger:el, start:'top 88%', once:true } });
      return;
    }
    if(mode==='clip'){
      gsap.fromTo(el,{ clipPath:'inset(0 0 100% 0)' },{ clipPath:'inset(0 0 0% 0)', duration:1.1, ease:TOK.easeInOut,
        scrollTrigger:{ trigger:el, start:'top 85%', once:true } });
      return;
    }
    // lines / words via SplitText
    if(!window.SplitText){
      gsap.from(el,{ opacity:0, y:30, duration:TOK.dStd, scrollTrigger:{ trigger:el, start:'top 86%', once:true } });
      return;
    }
    var type = (mode==='words') ? 'words' : 'lines';
    var split = new SplitText(el, { type:type, mask:type, linesClass:'ln', wordsClass:'ln' });
    var targets = type==='words' ? split.words : split.lines;
    /* words drive in from the left (direction of travel); lines rise */
    var fromVars = type==='words' ? { xPercent:-110 } : { yPercent:115 };
    fromVars.duration=0.95; fromVars.ease=TOK.easeOut;
    fromVars.stagger=(type==='words'? 0.05 : TOK.sLine);
    fromVars.scrollTrigger={ trigger:el, start:'top 86%', once:true };
    gsap.from(targets, fromVars);
  }
  function initReveals(root){
    (root||document).querySelectorAll('[data-reveal]').forEach(function(el){
      if(el.__revealed) return; el.__revealed=true; reveal(el);
    });
  }

  /* ---- ONE stateful cursor: the crew marker on the road (compass + breadcrumb trail) ---- */
  function initCursor(){
    if(!fine || reduce || !hasGSAP) return;
    document.body.classList.add('cursor-on');
    var dot=document.createElement('div'); dot.className='cur'; dot.textContent='\uD83E\uDD7E'; /* hiking boot */
    var tag=document.createElement('div'); tag.className='cur-tag';
    document.body.appendChild(dot); document.body.appendChild(tag);
    var dx=gsap.quickTo(dot,'x',{duration:.09,ease:'power3'}),  dy=gsap.quickTo(dot,'y',{duration:.09,ease:'power3'});
    var drot=gsap.quickTo(dot,'rotation',{duration:.32,ease:'power3'});
    var lastX=null,lastY=null,cumDist=0,heading=0,stepSide=1;
    window.addEventListener('pointermove', function(e){
      dx(e.clientX); dy(e.clientY);
      tag.style.left=(e.clientX+18)+'px'; tag.style.top=(e.clientY+20)+'px';
      if(lastX===null){ lastX=e.clientX; lastY=e.clientY; return; }
      var ddx=e.clientX-lastX, ddy=e.clientY-lastY, dist=Math.hypot(ddx,ddy);
      if(dist>1.2){ heading=Math.atan2(ddy,ddx)*180/Math.PI; drot(heading+90); }
      // footprint trail — drops every ~30px travelled (consistent at any speed), steps left/right
      cumDist+=dist;
      if(cumDist>=30){
        cumDist=0; stepSide*=-1;
        var rad=heading*Math.PI/180, off=7*stepSide;
        var fx=e.clientX+Math.cos(rad+Math.PI/2)*off, fy=e.clientY+Math.sin(rad+Math.PI/2)*off;
        var f=document.createElement('span'); f.className='step'; f.textContent='\uD83D\uDC63'; /* footprints */
        f.style.left=fx+'px'; f.style.top=fy+'px';
        f.style.transform='rotate('+(heading+90)+'deg)';
        document.body.appendChild(f);
        f.addEventListener('animationend', function(){ f.remove(); });
      }
      lastX=e.clientX; lastY=e.clientY;
    });
    window.addEventListener('pointerdown', function(){ gsap.to(dot,{scale:.82,duration:.18}); });
    window.addEventListener('pointerup',   function(){ gsap.to(dot,{scale:1,duration:.3}); });
    function bind(el){
      var type=el.getAttribute('data-cursor');
      el.addEventListener('pointerenter', function(){ tag.textContent = type==='link' ? 'Go →' : (el.getAttribute('data-label')||'View'); tag.classList.add('show'); });
      el.addEventListener('pointerleave', function(){ tag.classList.remove('show'); });
    }
    document.querySelectorAll('[data-cursor]').forEach(bind);
    window.WTCM_bindCursor = function(el){ bind(el); };
  }

  /* ---- magnetic elements ---- */
  function initMagnetic(){
    if(!fine || reduce || !hasGSAP) return;
    document.querySelectorAll('[data-magnetic]').forEach(function(el){
      var str = parseFloat(el.getAttribute('data-magnetic')) || 0.35;
      var xT=gsap.quickTo(el,'x',{duration:.5,ease:TOK.snap});
      var yT=gsap.quickTo(el,'y',{duration:.5,ease:TOK.snap});
      el.addEventListener('pointermove', function(e){ var r=el.getBoundingClientRect(); xT((e.clientX-(r.left+r.width/2))*str); yT((e.clientY-(r.top+r.height/2))*str); });
      el.addEventListener('pointerleave', function(){ xT(0); yT(0); });
    });
  }

  /* ---- smart nav + route-line progress ---- */
  function initNav(){
    var nav=document.querySelector('.nav');
    var fillEls=document.querySelectorAll('.routebar .fill');
    var dotEls=document.querySelectorAll('.routebar .dot');
    var last=0;
    function onScroll(y){
      if(nav){
        nav.classList.toggle('solid', y>40);
        if(y>last && y>360) nav.classList.add('hidden'); else nav.classList.remove('hidden');
        last=y;
      }
      var max=document.documentElement.scrollHeight-window.innerHeight;
      var p=max>0 ? (y/max*100) : 0;
      fillEls.forEach(function(f){ f.style.width=p+'%'; });
      dotEls.forEach(function(d){ d.style.left=p+'%'; });
    }
    if(lenis) lenis.on('scroll', function(e){ onScroll(e.scroll||window.scrollY); });
    else window.addEventListener('scroll', function(){ onScroll(window.scrollY); }, {passive:true});
    onScroll(window.scrollY);
  }

  /* ---- ambient: drifting blobs + velocity marquee ---- */
  function initAmbient(){
    if(!hasGSAP) return;
    if(!reduce){
      gsap.to('.b1',{xPercent:8,yPercent:12,scale:1.12,duration:18,ease:'sine.inOut',repeat:-1,yoyo:true});
      gsap.to('.b2',{xPercent:-10,yPercent:-8,scale:1.18,duration:22,ease:'sine.inOut',repeat:-1,yoyo:true});
      gsap.to('.b3',{xPercent:-12,yPercent:10,scale:1.1,duration:26,ease:'sine.inOut',repeat:-1,yoyo:true});
    }
    var WORDS=['Where to, crew?','Poland 2026','The route','Plan the trip','Bring the crew'];
    document.querySelectorAll('[data-mqtrack]').forEach(function(track){
      var mq=track.closest('[data-mq]');
      var words=(mq && mq.getAttribute('data-words')) ? mq.getAttribute('data-words').split('|') : WORDS;
      var sep=(mq && mq.getAttribute('data-sep')) || '✦';
      var unit=words.map(function(w){ return '<span>'+w+'</span><span class="dot">'+sep+'</span>'; }).join('');
      track.innerHTML=unit+unit+unit+unit;
    });
    if(reduce) return;
    document.querySelectorAll('[data-mq]').forEach(function(mq){
      var track=mq.querySelector('[data-mqtrack]');
      var dir=parseFloat(mq.getAttribute('data-dir'))||1;
      var loop=gsap.to(track,{xPercent:-25,duration:24,ease:'none',repeat:-1});
      loop.timeScale(dir); var target=dir;
      if(lenis){
        lenis.on('scroll', function(){
          var v=lenis.velocity||0;
          target=dir*(1+Math.min(Math.abs(v)/6,6));
          gsap.to(track,{skewX:gsap.utils.clamp(-8,8,-v*0.25),duration:.4,ease:'power2.out',overwrite:'auto'});
        });
      }
      gsap.ticker.add(function(){
        loop.timeScale(loop.timeScale()+(target-loop.timeScale())*0.08);
        target+=(dir-target)*0.04;
      });
    });
  }

  /* ---- ONE page-transition primitive ---- */
  function initTransition(){
    var ov=document.querySelector('.transition'); if(!ov) return;
    if(!hasGSAP){ return; }
    if(!reduce && sessionStorage.getItem('wtc-trans')){
      sessionStorage.removeItem('wtc-trans');
      gsap.set(ov,{yPercent:0,autoAlpha:1});
      gsap.to(ov,{yPercent:-100,duration:.7,ease:TOK.easeInOut,delay:.05,onComplete:function(){ gsap.set(ov,{autoAlpha:0}); }});
    } else if(!reduce){ gsap.set(ov,{yPercent:100,autoAlpha:1}); }
    document.querySelectorAll('a[data-transition]').forEach(function(a){
      a.addEventListener('click', function(e){
        var href=a.getAttribute('href');
        if(reduce||e.metaKey||e.ctrlKey||e.shiftKey||a.target==='_blank'||!href) return;
        e.preventDefault();
        if(lenis) lenis.stop();
        sessionStorage.setItem('wtc-trans','1');
        gsap.to(ov,{yPercent:0,duration:.6,ease:TOK.easeInOut,onComplete:function(){ location.href=href; }});
      });
    });
  }

  /* ---- preloader: route line draws into the logo, hands off to hero ---- */
  function initPreloader(skip, done){
    var pre=document.querySelector('.preload');
    if(!pre || reduce || !hasGSAP || skip){ if(pre) pre.remove(); if(lenis) lenis.start(); done&&done(); return; }
    if(lenis) lenis.stop();
    var svgEl=pre.querySelector('svg'), mk=null;
    if(svgEl && window.MotionPathPlugin){ mk=document.createElementNS('http://www.w3.org/2000/svg','circle'); mk.setAttribute('r','5'); mk.setAttribute('fill','#f3ede1'); svgEl.appendChild(mk); }
    var tl=gsap.timeline({ onComplete:function(){ pre.remove(); if(lenis) lenis.start(); done&&done(); } });
    tl.set('.preload .pl-word',{opacity:0});
    tl.fromTo('.preload .pl-line',{drawSVG:'0%'},{drawSVG:'100%',duration:1.1,ease:TOK.easeInOut});
    if(mk) tl.to(mk,{ motionPath:{ path:'.preload .pl-line', align:'.preload .pl-line', alignOrigin:[.5,.5] }, duration:1.1, ease:TOK.easeInOut }, 0);
    tl.from('.preload .pl-dot',{scale:0,transformOrigin:'center',ease:'back.out(2)',duration:.4,stagger:.08},'-=0.5')
      .to('.preload .pl-word',{opacity:1,duration:.5,ease:'power2.out'},'-=0.2')
      .to('.preload',{yPercent:-100,duration:.8,ease:TOK.easeInOut,delay:.25});
  }

  /* ---- reusable dawn→night drive environment (opt-in via body[data-auto-env]) ---- */
  function initEnvironment(){
    var drive=document.querySelector('.drive'); if(!drive) return;
    var root=document.documentElement;
    var stars=drive.querySelector('.stars'), haze=drive.querySelector('.haze');
    var KF=[
      [0.00,[16,32,26],[44,30,22],'rgba(217,140,95,.30)','#d98c5f','#e7a877'],
      [0.42,[20,42,38],[20,38,30],'rgba(150,170,140,.16)','#ead9c2','#f3ede1'],
      [0.72,[40,28,30],[46,26,18],'rgba(224,120,66,.34)','#e0894c','#f1b56f'],
      [1.00,[10,16,30],[8,12,20],'rgba(70,100,160,.22)','#c3cede','#e6ecf5']
    ];
    function L(a,b,t){ return a+(b-a)*t; }
    function rgb(a){ return 'rgb('+Math.round(a[0])+','+Math.round(a[1])+','+Math.round(a[2])+')'; }
    function mix(a,b,t){ return [L(a[0],b[0],t),L(a[1],b[1],t),L(a[2],b[2],t)]; }
    function setEnv(p){
      var i=0; while(i<KF.length-1 && p>KF[i+1][0]) i++;
      var a=KF[i], b=KF[Math.min(i+1,KF.length-1)];
      var span=(b[0]-a[0])||1, t=Math.min(1,Math.max(0,(p-a[0])/span));
      root.style.setProperty('--sky-top', rgb(mix(a[1],b[1],t)));
      root.style.setProperty('--sky-bot', rgb(mix(a[2],b[2],t)));
      root.style.setProperty('--glow', t<0.5?a[3]:b[3]);
      root.style.setProperty('--orb', t<0.5?a[4]:b[4]);
      root.style.setProperty('--orb-core', t<0.5?a[5]:b[5]);
      root.style.setProperty('--orb-x', (10+78*p)+'%');
      root.style.setProperty('--orb-y', (74-48*Math.sin(p*Math.PI))+'%');
      if(stars) stars.style.opacity = Math.min(1,Math.max(0,(p-0.7)/0.3))*0.85;
      if(haze) haze.style.transform = 'translateY('+(p*-46)+'px)';
    }
    function docMax(){ return Math.max(1, document.documentElement.scrollHeight - window.innerHeight); }
    function update(y){ setEnv(Math.min(1,Math.max(0, y/docMax()))); }
    if(lenis) lenis.on('scroll', function(e){ update(e.scroll!=null?e.scroll:window.scrollY); });
    else window.addEventListener('scroll', function(){ update(window.scrollY); }, {passive:true});
    update(window.scrollY);
  }

  /* ---- reusable journey spine (opt-in via body[data-auto-journey]); nodes = [data-journey] els ---- */
  function initJourney(){
    var rail=document.querySelector('.journey'); if(!rail) return;
    var fill=rail.querySelector('.j-fill'), marker=rail.querySelector('.j-marker');
    var nodes=[].slice.call(document.querySelectorAll('[data-journey]')).map(function(el){
      var n=document.createElement('div'); n.className='j-node';
      var l=document.createElement('span'); l.className='j-lbl'; l.textContent=el.getAttribute('data-journey'); n.appendChild(l);
      rail.appendChild(n); return { el:el, node:n, frac:0 };
    });
    function docMax(){ return Math.max(1, document.documentElement.scrollHeight - window.innerHeight); }
    function recompute(){ var m=docMax(); nodes.forEach(function(n){ n.frac=Math.min(1,Math.max(0, n.el.getBoundingClientRect().top + (lenis?lenis.scroll:window.scrollY) - innerHeight*0.3)/m); n.frac=Math.min(1,Math.max(0,n.frac)); n.node.style.top=(n.frac*100)+'%'; }); }
    function update(y){ var m=docMax(), p=Math.min(1,Math.max(0, y/m)); fill.style.height=(p*100)+'%'; marker.style.top=(p*100)+'%'; nodes.forEach(function(n){ n.node.classList.toggle('on', p>=n.frac-0.004); }); }
    recompute();
    if(window.ScrollTrigger) ScrollTrigger.addEventListener('refresh', recompute);
    window.addEventListener('resize', recompute);
    if(lenis) lenis.on('scroll', function(e){ update(e.scroll!=null?e.scroll:window.scrollY); });
    else window.addEventListener('scroll', function(){ update(window.scrollY); }, {passive:true});
    update(window.scrollY);
  }

  /* ---- return-to-start pin (drive back to the top) ---- */
  function initToStart(){
    var b=document.createElement('button'); b.className='to-start'; b.innerHTML='\uD83D\uDCCD Start';
    document.body.appendChild(b);
    b.addEventListener('click', function(){ if(lenis) lenis.scrollTo(0,{duration:1.1}); else window.scrollTo({top:0,behavior:'smooth'}); });
    function onY(y){ b.classList.toggle('show', y>700); }
    if(lenis) lenis.on('scroll', function(e){ onY(e.scroll!=null?e.scroll:window.scrollY); });
    else window.addEventListener('scroll', function(){ onY(window.scrollY); }, {passive:true});
  }

  /* ---- boot ---- */
  function boot(){
    // Did we arrive through an internal page-transition? If so, the terracotta
    // transition overlay handles the reveal — skip the green preloader so the two
    // don't fight (orange flash → green interrupt). Read it BEFORE initTransition
    // consumes the flag.
    var viaTrans = !reduce && hasGSAP && !!sessionStorage.getItem('wtc-trans');
    initCursor(); initMagnetic(); initNav(); initAmbient(); initTransition(); initToStart();
    if(document.body.hasAttribute('data-auto-env')) initEnvironment();
    if(document.body.hasAttribute('data-auto-journey')) setTimeout(initJourney, 60);
    initPreloader(viaTrans, function(){
      if(document.fonts && document.fonts.ready){ document.fonts.ready.then(function(){ initReveals(); if(window.ScrollTrigger) ScrollTrigger.refresh(); }); }
      else initReveals();
      if(window.WTCM_onReady) window.WTCM_onReady({lenis:lenis, TOK:TOK, reduce:reduce, fine:fine});
    });
  }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();

  window.WTCM = { reveal:reveal, initReveals:initReveals, TOK:TOK, get lenis(){ return lenis; }, reduce:reduce, fine:fine };
})();

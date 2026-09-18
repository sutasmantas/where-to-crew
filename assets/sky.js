/* ============================================================
   Where To, Crew? — OBSERVATORY sky layer  ("Orbit To The Telescope")
   Loaded AFTER motion.js on the Observatory default + observatory/* pages.
   Reuses the shared conductor (window.WTCM: lenis, reduce, fine) and adds the
   cosmos-only mechanics: a telescope reticle cursor, a live starfield, the
   Kaunas→Observatory constellation route, star-card parallax + a moon helper.
   Everything degrades to a static night sky under prefers-reduced-motion.
   ============================================================ */
(function(){
  var reduce = matchMedia('(prefers-reduced-motion:reduce)').matches;
  var fine   = matchMedia('(hover:hover) and (pointer:fine)').matches;
  var G = window.gsap;
  var NS = 'http://www.w3.org/2000/svg';
  function svg(t,a){ var e=document.createElementNS(NS,t); for(var k in a) e.setAttribute(k,a[k]); return e; }

  /* ---------- 1 · cursor: glued star-point + trailing field-of-view ring ---------- */
  function initReticle(){
    if(!fine || reduce) return;
    if(document.body.getAttribute('data-cursor-theme')!=='reticle') return;
    document.body.classList.add('cursor-on');
    // full-viewport canvas for the stardust comet trail + sparkle-star head
    var cv=document.createElement('canvas'); cv.className='cur-fx';
    cv.style.cssText='position:fixed;inset:0;width:100%;height:100%;pointer-events:none;z-index:10000;';
    var tag=document.createElement('div'); tag.className='cur-tag';
    document.body.appendChild(cv); document.body.appendChild(tag);
    var ctx=cv.getContext('2d'), DPR=Math.min(2,window.devicePixelRatio||1);
    function resize(){ cv.width=innerWidth*DPR; cv.height=innerHeight*DPR; ctx.setTransform(DPR,0,0,DPR,0,0); }
    resize(); window.addEventListener('resize', resize);
    var px=innerWidth/2, py=innerHeight/2, lx=px, ly=py, on=false, locked=false, spin=0;
    var parts=[]; var COLS=['231,168,119','169,197,160','238,242,244']; // warm star · sage · white
    window.addEventListener('pointermove', function(e){
      px=e.clientX; py=e.clientY; on=true;
      tag.style.left=(px+18)+'px'; tag.style.top=(py+14)+'px';
      var dx=px-lx, dy=py-ly, sp=Math.hypot(dx,dy);
      var n=Math.min(5, 1+Math.floor(sp/5));
      for(var i=0;i<n;i++){
        parts.push({ x:px+(Math.random()-0.5)*4, y:py+(Math.random()-0.5)*4,
          vx:-dx*0.045+(Math.random()-0.5)*0.6, vy:-dy*0.045+(Math.random()-0.5)*0.6,
          life:1, decay:0.014+Math.random()*0.022, r:0.5+Math.random()*1.7, c:COLS[(Math.random()*COLS.length)|0] });
      }
      if(parts.length>240) parts.splice(0, parts.length-240);
      lx=px; ly=py;
    }, {passive:true});
    document.addEventListener('mouseleave', function(){ on=false; });
    document.addEventListener('mouseenter', function(){ on=true; });
    function bind(el){
      el.addEventListener('pointerenter', function(){ locked=true; var l=el.getAttribute('data-label'), t=el.getAttribute('data-cursor'); if(l||t==='label'||t==='view'){ tag.textContent=l||'View'; tag.classList.add('show'); } });
      el.addEventListener('pointerleave', function(){ locked=false; tag.classList.remove('show'); });
    }
    document.querySelectorAll('[data-cursor],a,button,.choice,.dest,.chip,input,textarea,label').forEach(bind);
    window.WTCM_bindReticle = bind;
    function sparkle(x,y,size,a){ // a warm 4-point star — reads instantly as a star, not a circle
      ctx.save(); ctx.globalCompositeOperation='lighter'; ctx.translate(x,y);
      var g=ctx.createRadialGradient(0,0,0,0,0,size*3.4); g.addColorStop(0,'rgba(231,168,119,'+a+')'); g.addColorStop(1,'rgba(231,168,119,0)');
      ctx.fillStyle=g; ctx.beginPath(); ctx.arc(0,0,size*3.4,0,6.283); ctx.fill();
      ctx.strokeStyle='rgba(255,240,224,'+a+')'; ctx.lineWidth=1.1; ctx.lineCap='round';
      for(var k=0;k<4;k++){ ctx.rotate(Math.PI/2); ctx.beginPath(); ctx.moveTo(0,0); ctx.lineTo(0,-size*2.7); ctx.stroke(); }
      ctx.restore();
    }
    function frame(){
      ctx.clearRect(0,0,innerWidth,innerHeight);
      ctx.globalCompositeOperation='lighter';
      for(var i=parts.length-1;i>=0;i--){ var p=parts[i]; p.x+=p.vx; p.y+=p.vy; p.vy+=0.004; p.life-=p.decay;
        if(p.life<=0){ parts.splice(i,1); continue; }
        var rr=Math.max(0.1,p.r*p.life)*3.2;
        var g=ctx.createRadialGradient(p.x,p.y,0,p.x,p.y,rr);
        g.addColorStop(0,'rgba('+p.c+','+(p.life*0.85)+')'); g.addColorStop(1,'rgba('+p.c+',0)');
        ctx.fillStyle=g; ctx.beginPath(); ctx.arc(p.x,p.y,rr,0,6.283); ctx.fill();
      }
      ctx.globalCompositeOperation='source-over';
      if(on){
        spin+=0.045;
        sparkle(px,py, locked?5:3.3, 0.95);
        if(locked){ // telescope viewfinder: warm corner brackets + one orbiting body
          ctx.save();
          ctx.strokeStyle='rgba(231,168,119,0.95)'; ctx.lineWidth=1.5; ctx.lineCap='round';
          var R=14, cc=5; var corners=[[-1,-1],[1,-1],[1,1],[-1,1]];
          for(var q=0;q<4;q++){ var sgx=corners[q][0], sgy=corners[q][1], cx=px+sgx*R, cy=py+sgy*R;
            ctx.beginPath(); ctx.moveTo(cx-sgx*cc, cy); ctx.lineTo(cx, cy); ctx.lineTo(cx, cy-sgy*cc); ctx.stroke(); }
          ctx.fillStyle='rgba(238,242,244,1)'; ctx.shadowColor='rgba(231,168,119,1)'; ctx.shadowBlur=8;
          ctx.beginPath(); ctx.arc(px+Math.cos(spin)*R, py+Math.sin(spin)*R, 2.1, 0, 6.283); ctx.fill();
          ctx.restore();
        }
      }
      requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
  }

  /* ---------- 2 · live starfield (canvas) over the cosmos stage ---------- */
  /* ---------- 2 · SITE-WIDE SIGNATURE: living constellation network ----------
     Drifting, twinkling stars that connect with faint lines and weave a
     constellation toward the cursor. Lives on .cosmos .field on every page. */
  function initStarfield(){
    var canvas=document.querySelector('.cosmos .field'); if(!canvas) return;
    if(reduce){ return; }                          // CSS cosmos.png band is the fallback
    var ctx=canvas.getContext('2d'), W=0,H=0,DPR=Math.min(2,window.devicePixelRatio||1);
    var stars=[], shoot=null, t=0, mx=null, my=null, pmx=0, pmy=0;
    var MAXD=145, MOUSER=210, LINE='169,197,160';   // sage connection lines
    function resize(){ W=innerWidth; H=innerHeight; canvas.width=W*DPR; canvas.height=H*DPR; canvas.style.width=W+'px'; canvas.style.height=H+'px'; ctx.setTransform(DPR,0,0,DPR,0,0);
      var n=Math.min(175, Math.round(W*H/12500)); stars=[];
      for(var i=0;i<n;i++){ var z=Math.random(); stars.push({ x:Math.random()*W, y:Math.random()*H, z:z, r:Math.random()*1.1+0.35, tw:Math.random()*6.28, sp:Math.random()*0.9+0.2, warm:Math.random()>0.8,
        vx:(Math.random()-0.5)*(0.08+z*0.14), vy:(Math.random()-0.5)*(0.08+z*0.14) }); }
    }
    resize(); window.addEventListener('resize', resize);
    window.addEventListener('pointermove', function(e){ mx=e.clientX; my=e.clientY; }, {passive:true});
    document.addEventListener('mouseleave', function(){ mx=my=null; });
    var burst=[];
    window.addEventListener('pointerdown', function(e){ for(var b=0;b<12;b++){ var ang=Math.PI*2*b/12; burst.push({ x:e.clientX, y:e.clientY, vx:Math.cos(ang)*(1.4+Math.random()*2.2), vy:Math.sin(ang)*(1.4+Math.random()*2.2), life:1 }); } });
    function maybeShoot(){ if(shoot||Math.random()>0.0035) return; shoot={ x:Math.random()*W*0.6, y:Math.random()*H*0.3, len:0, vx:5+Math.random()*4, vy:2+Math.random()*2, life:0 }; }
    function frame(){
      t+=0.016; ctx.clearRect(0,0,W,H);
      // gentle mouse-parallax for depth
      pmx += (((mx==null?W/2:mx)-W/2)*0.012 - pmx)*0.05;
      pmy += (((my==null?H/2:my)-H/2)*0.012 - pmy)*0.05;
      var i,j,s;
      // move + wrap
      for(i=0;i<stars.length;i++){ s=stars[i]; s.x+=s.vx; s.y+=s.vy;
        if(s.x<-20) s.x=W+20; else if(s.x>W+20) s.x=-20;
        if(s.y<-20) s.y=H+20; else if(s.y>H+20) s.y=-20;
        s.px = s.x - pmx*(0.3+s.z); s.py = s.y - pmy*(0.3+s.z);
      }
      // star-to-star constellation lines
      for(i=0;i<stars.length;i++){ var a=stars[i];
        for(j=i+1;j<stars.length;j++){ var b=stars[j]; var dx=a.px-b.px, dy=a.py-b.py; var d2=dx*dx+dy*dy;
          if(d2<MAXD*MAXD){ var al=(1-Math.sqrt(d2)/MAXD)*0.3*(0.55+(a.z+b.z)/2);
            ctx.strokeStyle='rgba('+LINE+','+al+')'; ctx.lineWidth=0.7; ctx.beginPath(); ctx.moveTo(a.px,a.py); ctx.lineTo(b.px,b.py); ctx.stroke(); }
        }
      }
      // lines from nearby stars to the cursor — the constellation "gathers"
      if(mx!=null){ for(i=0;i<stars.length;i++){ s=stars[i]; var dx=s.px-mx, dy=s.py-my, d=Math.sqrt(dx*dx+dy*dy);
        if(d<MOUSER){ var al=(1-d/MOUSER)*0.5; ctx.strokeStyle='rgba(231,168,119,'+al+')'; ctx.lineWidth=0.8; ctx.beginPath(); ctx.moveTo(s.px,s.py); ctx.lineTo(mx,my); ctx.stroke(); } } }
      // stars
      for(i=0;i<stars.length;i++){ s=stars[i];
        var near = mx!=null ? Math.max(0, 1-Math.hypot(s.px-mx,s.py-my)/MOUSER) : 0;
        var a=(0.35+0.45*Math.sin(s.tw+t*s.sp))*(0.4+s.z*0.6) + near*0.4;
        ctx.beginPath(); ctx.arc(s.px,s.py,s.r*(0.7+s.z)+near*0.8,0,6.2832);
        ctx.fillStyle = s.warm ? 'rgba(231,168,119,'+Math.min(1,a)+')' : 'rgba(238,242,244,'+Math.min(1,a)+')';
        ctx.fill();
      }
      maybeShoot();
      // click bursts (a little supernova)
      for(i=burst.length-1;i>=0;i--){ var bp=burst[i]; bp.x+=bp.vx; bp.y+=bp.vy; bp.vx*=0.94; bp.vy*=0.94; bp.life-=0.03;
        if(bp.life<=0){ burst.splice(i,1); continue; }
        ctx.fillStyle='rgba(231,168,119,'+bp.life+')'; ctx.beginPath(); ctx.arc(bp.x,bp.y,1.6*bp.life+0.4,0,6.2832); ctx.fill(); }
      if(shoot){ shoot.life++; shoot.x+=shoot.vx; shoot.y+=shoot.vy; shoot.len=Math.min(150,shoot.len+8);
        var gx=ctx.createLinearGradient(shoot.x,shoot.y,shoot.x-shoot.len,shoot.y-shoot.len*shoot.vy/shoot.vx);
        gx.addColorStop(0,'rgba(238,242,244,.9)'); gx.addColorStop(1,'rgba(238,242,244,0)');
        ctx.strokeStyle=gx; ctx.lineWidth=1.4; ctx.beginPath(); ctx.moveTo(shoot.x,shoot.y); ctx.lineTo(shoot.x-shoot.len,shoot.y-shoot.len*shoot.vy/shoot.vx); ctx.stroke();
        if(shoot.x>W+60||shoot.y>H+60||shoot.life>90) shoot=null;
      }
      requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
  }

  /* ---------- 3 · the Kaunas → Observatory constellation route ----------
     Same scroll-linked, pinned signature as the Poland road map — but the line
     is drawn as a constellation between star nodes, ending at the telescope. */
  function buildConstellationRoute(){
    var stage=document.getElementById('skystage'); if(!stage) return;
    var s=stage.querySelector('.sky-svg'), cam=s.querySelector('#skycam');
    var W=function(f){ return f; };
    // waypoints across a rising SW→NE sky path (Kaunas low-left → Observatory high-right)
    var d="M140,470 L330,392 L470,418 L500,300 L660,250 L840,140";
    var nodes=[
      { x:140,y:470, t:0.00, name:'Kaunas',     sub:'depart',          side:'below', mag:8 },
      { x:330,y:392, t:0.18, name:'Mindūnai',   sub:'optional tower',  side:'below', mag:7 },
      { x:470,y:418, t:0.34, name:'Molėtai',    sub:'warm-up / food',  side:'below', mag:6 },
      { x:660,y:250, t:0.54, name:'Kulionys',   sub:'arrive · buffer', side:'above', mag:7 },
      { x:840,y:140, t:0.72, name:'Observatory',sub:'night anchor',    side:'above', mag:11, anchor:true }
    ];
    cam.innerHTML='';
    cam.appendChild(svg('path',{ class:'ghost', d:d }));
    var line=svg('path',{ id:'skyPath', class:'conn', d:d }); cam.appendChild(line);
    nodes.forEach(function(wp,i){
      var g=svg('g',{ class:'starnode'+(wp.anchor?' anchor':'')+' n'+i });
      g.appendChild(svg('circle',{ class:'glow', cx:wp.x, cy:wp.y, r:wp.mag+10 }));
      var pcol = wp.anchor ? '#e7a877' : ['#c9a06a','#a9c5a0','#8fb6d6','#d98c5f'][i%4];
      var pr = wp.mag*0.62;
      g.appendChild(svg('circle',{ cx:wp.x, cy:wp.y, r:pr, fill:pcol, class:'pt' }));
      g.appendChild(svg('circle',{ cx:(wp.x+pr*0.3).toFixed(1), cy:(wp.y-pr*0.22).toFixed(1), r:(pr*0.72).toFixed(1), fill:'rgba(255,255,255,0.16)' }));
      if(i===1||i===3){ g.appendChild(svg('ellipse',{ cx:wp.x, cy:wp.y, rx:(pr*2).toFixed(1), ry:(pr*0.6).toFixed(1), fill:'none', stroke:pcol, 'stroke-width':1.1, opacity:0.65, transform:'rotate(-18 '+wp.x+' '+wp.y+')' })); }
      var ly = wp.side==='above' ? wp.y-22 : wp.y+34;
      var sy = wp.side==='above' ? wp.y-6  : wp.y+50;
      var lab=svg('text',{ class:'label', x:wp.x-6, y:ly, 'text-anchor':'middle' }); lab.textContent=wp.name; g.appendChild(lab);
      var sub=svg('text',{ class:'sub', x:wp.x-6, y:sy, 'text-anchor':'middle' }); sub.textContent=wp.sub; g.appendChild(sub);
      cam.appendChild(g);
    });
    var mk=svg('g',{ id:'skyMarker' });
    mk.appendChild(svg('path',{ class:'rk-flame', d:'M-7,-3.4 L-16,0 L-7,3.4 Z', fill:'#e7a877' }));
    mk.appendChild(svg('path',{ d:'M-3,-6 L-7,-10 L-7,-4 Z', fill:'#c0613f' }));
    mk.appendChild(svg('path',{ d:'M-3,6 L-7,10 L-7,4 Z', fill:'#c0613f' }));
    mk.appendChild(svg('path',{ class:'rk-body', d:'M13,0 L-3,-6 L-7,0 L-3,6 Z', fill:'#eef2f4' }));
    mk.appendChild(svg('circle',{ cx:2, cy:0, r:2.3, fill:'#5b6f8a' }));
    cam.appendChild(mk);

    if(!G){ return; }
    var raw, len;
    if(window.MotionPathPlugin){ raw=MotionPathPlugin.getRawPath('#skyPath'); MotionPathPlugin.cacheRawPathMeasurements(raw); }
    var VIEW={cx:500,cy:300,zoom:1.2}, END={cx:500,cy:300,zoom:0.86};
    function setCam(p){ p=Math.max(0,Math.min(1,p)); var pos= raw?MotionPathPlugin.getPositionOnPath(raw,p,false):{x:VIEW.cx,y:VIEW.cy};
      var zoom=VIEW.zoom, cx=pos.x, cy=pos.y;
      if(p>0.7){ var k=(p-0.7)/0.3; k=k<0?0:k>1?1:k; var e=1-Math.pow(1-k,3); zoom=VIEW.zoom+(END.zoom-VIEW.zoom)*e; cx=pos.x+(END.cx-pos.x)*e; cy=pos.y+(END.cy-pos.y)*e; }
      cam.setAttribute('transform','translate('+VIEW.cx+','+VIEW.cy+') scale('+zoom+') translate('+(-cx)+','+(-cy)+')');
    }
    if(reduce){ G.set('#skyPath',{drawSVG:'100%'}); G.set('.starnode',{opacity:1}); G.set('#skyMarker',{opacity:0}); setCam(0.5); return; }
    G.set('.starnode',{scale:0,opacity:0,transformOrigin:'center'});
    var tl=G.timeline({ defaults:{ease:'none'}, scrollTrigger:{ trigger:'#skyroute', start:'top top', end:'+=3600', scrub:1, pin:'#skystage', anticipatePin:1 } });
    tl.fromTo('#skyPath',{drawSVG:'0%'},{drawSVG:'100%',duration:0.78},0)
      .to('#skyMarker',{motionPath:{path:'#skyPath',align:'#skyPath',alignOrigin:[.5,.5],autoRotate:true},duration:0.78},0);
    nodes.forEach(function(wp,i){
      tl.fromTo('.starnode.n'+i,{scale:0,opacity:0},{scale:1,opacity:1,ease:'back.out(2)',duration:.06,immediateRender:false}, wp.t);
    });
    // arrival: marker fades into the telescope, the anchor swells + holds while the camera pulls back
    tl.to('#skyMarker',{opacity:0,duration:0.08}, 0.74);
    tl.fromTo('.starnode.anchor .glow',{ attr:{ r:21 } },{ attr:{ r:34 }, duration:0.22, ease:'sine.out' }, 0.74);
    tl.fromTo('.starnode.anchor',{ scale:1 },{ scale:1.28, duration:0.22, ease:'sine.out', transformOrigin:'center' }, 0.78);
    tl.eventCallback('onUpdate', function(){ setCam(tl.progress()); });
    setCam(0);
    if(window.ScrollTrigger) ScrollTrigger.addEventListener('refreshInit', function(){ if(window.MotionPathPlugin){ raw=MotionPathPlugin.getRawPath('#skyPath'); MotionPathPlugin.cacheRawPathMeasurements(raw); } });
  }

  /* ---------- 4 · star-card pointer parallax ---------- */
  function initStarCards(){
    if(!fine || reduce || !G) return;
    document.querySelectorAll('[data-parallax]').forEach(function(card){
      var img=card.querySelector('.img'); if(!img) return;
      var qx=G.quickTo(img,'xPercent',{duration:.6,ease:'power3'}), qy=G.quickTo(img,'yPercent',{duration:.6,ease:'power3'});
      card.addEventListener('pointermove', function(e){ var r=card.getBoundingClientRect(); qx((e.clientX-(r.left+r.width/2))/r.width*-8); qy((e.clientY-(r.top+r.height/2))/r.height*-8); });
      card.addEventListener('pointerleave', function(){ qx(0); qy(0); });
    });
  }

  /* ---------- 5 · moon helper (illumination 0..1, 0=new 1=full) ---------- */
  function setMoon(el, illum){
    var disc=el.querySelector('.moondisc .shadow'); if(!disc) return;
    disc.style.setProperty('--moon-x', ((1-illum)*100)+'%');
  }

  /* ---------- 6 · mini sky panel: "tonight over Kulionys" (CAND-018) ---------- */
  function skyPanel(canvas){
    var ctx=canvas.getContext('2d'), DPR=Math.min(2,window.devicePixelRatio||1), W,H;
    var illum=parseFloat(canvas.getAttribute('data-illum')||'0.12');
    // the Plough / Big Dipper, in 0..1 panel coords (asterism over the horizon)
    var aster=[[0.16,0.30],[0.30,0.26],[0.44,0.33],[0.55,0.30],[0.60,0.46],[0.74,0.52],[0.70,0.66]];
    var bg=[]; for(var i=0;i<46;i++) bg.push({x:Math.random(),y:Math.random()*0.78,r:Math.random()*1.1+0.3,tw:Math.random()*6.28,sp:0.4+Math.random()*0.8});
    function size(){ W=canvas.clientWidth; H=canvas.clientHeight; canvas.width=W*DPR; canvas.height=H*DPR; ctx.setTransform(DPR,0,0,DPR,0,0); }
    function draw(t){
      size(); ctx.clearRect(0,0,W,H);
      // horizon + observatory dome silhouette
      var hy=H*0.84;
      ctx.fillStyle='rgba(7,13,11,0.9)'; ctx.beginPath(); ctx.moveTo(0,hy);
      ctx.lineTo(0,H); ctx.lineTo(W,H); ctx.lineTo(W,hy);
      ctx.lineTo(W*0.78,hy); ctx.quadraticCurveTo(W*0.72,hy-15,W*0.66,hy); ctx.closePath(); ctx.fill();
      ctx.strokeStyle='rgba(169,197,160,0.4)'; ctx.lineWidth=1; ctx.beginPath(); ctx.moveTo(0,hy); ctx.lineTo(W*0.6,hy); ctx.moveTo(W*0.84,hy); ctx.lineTo(W,hy); ctx.stroke();
      // background stars
      for(var i=0;i<bg.length;i++){ var b=bg[i]; var a=0.3+0.4*Math.sin(b.tw+t*b.sp);
        ctx.fillStyle='rgba(238,242,244,'+a+')'; ctx.beginPath(); ctx.arc(b.x*W,b.y*hy,b.r,0,6.283); ctx.fill(); }
      // asterism lines + stars
      ctx.strokeStyle='rgba(169,197,160,0.55)'; ctx.lineWidth=1; ctx.beginPath();
      for(var k=0;k<aster.length;k++){ var p=aster[k]; if(k===0) ctx.moveTo(p[0]*W,p[1]*H); else ctx.lineTo(p[0]*W,p[1]*H); } ctx.stroke();
      for(var m=0;m<aster.length;m++){ var q=aster[m], tw=0.7+0.3*Math.sin(t*1.6+m);
        ctx.fillStyle='rgba(231,168,119,'+tw+')'; ctx.shadowColor='rgba(231,168,119,0.9)'; ctx.shadowBlur=6;
        ctx.beginPath(); ctx.arc(q[0]*W,q[1]*H,1.9,0,6.283); ctx.fill(); ctx.shadowBlur=0; }
      // moon (phase by illum)
      var mxp=W*0.84, myp=H*0.22, mr=Math.min(W,H)*0.085;
      ctx.fillStyle='rgba(231,168,119,0.95)'; ctx.beginPath(); ctx.arc(mxp,myp,mr,0,6.283); ctx.fill();
      ctx.fillStyle='rgba(7,13,11,1)'; ctx.beginPath(); ctx.arc(mxp+mr*(1-illum)*1.4,myp,mr,0,6.283); ctx.fill();
    }
    if(reduce){ draw(0); window.addEventListener('resize', function(){ draw(0); }); return; }
    var start=performance.now();
    (function loop(now){ draw((now-start)/1000); requestAnimationFrame(loop); })(start);
  }

  /* ---------- 7 · HERO COSMOS: WebGL shader starfield + nebula (the "wow") ----------
     GPU fragment shader — parallax flaring stars (Art-of-Code style) over a warm
     fractal-noise nebula, drifting + pointer-parallax. Falls back to .cosmos.png. */
  var FRAG=[
    'precision highp float;',
    'uniform vec2 iResolution; uniform float iTime; uniform vec2 iMouse;',
    'mat2 Rot(float a){ float s=sin(a),c=cos(a); return mat2(c,-s,s,c); }',
    'float Hash21(vec2 p){ p=fract(p*vec2(123.34,233.53)); p+=dot(p,p+23.45); return fract(p.x*p.y); }',
    'float Star(vec2 uv,float flare){ float d=length(uv); float m=.045/d;',
    '  float rays=max(0.,1.-abs(uv.x*uv.y*1000.)); m+=rays*flare;',
    '  uv*=Rot(3.1415/4.); rays=max(0.,1.-abs(uv.x*uv.y*1000.)); m+=rays*.3*flare;',
    '  m*=smoothstep(1.,.2,d); return m; }',
    'vec3 StarLayer(vec2 uv){ vec3 col=vec3(0.); vec2 gv=fract(uv)-.5; vec2 id=floor(uv);',
    '  for(int y=-1;y<=1;y++){ for(int x=-1;x<=1;x++){ vec2 o=vec2(float(x),float(y));',
    '    float n=Hash21(id+o); float size=fract(n*345.32);',
    '    float star=Star(gv-o-vec2(n,fract(n*34.))+.5, smoothstep(.82,1.,size)*.55);',
    '    vec3 c=sin(vec3(.7,.5,.9)*fract(n*2345.2)*6.2832)*.35+.65; c*=vec3(1.0,.86,.72+size*.3);',
    '    star*=sin(iTime*1.4+n*6.2832)*.4+1.; col+=star*size*c; } } return col; }',
    'float noise(vec2 p){ vec2 i=floor(p),f=fract(p); f=f*f*(3.-2.*f);',
    '  float a=Hash21(i),b=Hash21(i+vec2(1,0)),c=Hash21(i+vec2(0,1)),d=Hash21(i+vec2(1,1));',
    '  return mix(mix(a,b,f.x),mix(c,d,f.x),f.y); }',
    'float fbm(vec2 p){ float v=0.,a=.5; for(int i=0;i<5;i++){ v+=a*noise(p); p*=2.02; a*=.5; } return v; }',
    'void main(){ vec2 uv=(gl_FragCoord.xy-.5*iResolution.xy)/iResolution.y; vec2 M=(iMouse-.5)*.35; uv+=M;',
    '  vec3 col=vec3(0.);',
    '  float n=fbm(uv*2.1+vec2(iTime*0.02,iTime*0.014)); n=pow(n,2.3);',
    '  col+=mix(vec3(0.03,0.03,0.025),vec3(0.46,0.24,0.12),n)*0.6;',
    '  col+=vec3(0.07,0.13,0.10)*pow(fbm(uv*1.4-vec2(iTime*0.012,0.)),2.0);',
    '  float t=iTime*0.008;',
    '  for(int i=0;i<4;i++){ float fi=float(i)*0.25; float depth=fract(fi+t);',
    '    float scale=mix(16.,.4,depth); float fade=depth*smoothstep(1.,.85,depth);',
    '    col+=StarLayer(uv*scale+fi*453.2-vec2(iTime*0.015,0.)+M*depth*2.5)*fade; }',
    '  col=pow(col,vec3(.86)); gl_FragColor=vec4(col,1.); }'
  ].join('\n');
  function orrery(canvas){
    var THREE=window.THREE;
    if(reduce || !THREE){ return; }   // fallback: the .cosmos backdrop stays
    var renderer;
    try{ renderer=new THREE.WebGLRenderer({canvas:canvas, alpha:true, antialias:true}); }catch(e){ return; }
    renderer.setPixelRatio(Math.min(1.5,window.devicePixelRatio||1));
    var scene=new THREE.Scene();
    var cam=new THREE.PerspectiveCamera(60,1,0.1,100); cam.position.set(0,2.3,4.4);
    // soft round star sprite (so particles are glows, never squares)
    function dot(){ var c=document.createElement('canvas'); c.width=c.height=64; var x=c.getContext('2d');
      var g=x.createRadialGradient(32,32,0,32,32,32); g.addColorStop(0,'rgba(255,255,255,1)'); g.addColorStop(.35,'rgba(255,255,255,.5)'); g.addColorStop(1,'rgba(255,255,255,0)');
      x.fillStyle=g; x.fillRect(0,0,64,64); return new THREE.CanvasTexture(c); }
    var tex=dot();
    // ---- the galaxy ----
    var COUNT=9000, RAD=5, BRANCHES=4, SPIN=1.0, RND=0.5, RNDPOW=2.8;
    var pos=new Float32Array(COUNT*3), col=new Float32Array(COUNT*3);
    var cIn=new THREE.Color('#ffd6a0'), cMid=new THREE.Color('#e09a63'), cOut=new THREE.Color('#8fb6d6');
    for(var i=0;i<COUNT;i++){ var i3=i*3;
      var r=Math.pow(Math.random(),1.5)*RAD;
      var br=((i%BRANCHES)/BRANCHES)*Math.PI*2 + r*SPIN;
      function rr(){ return Math.pow(Math.random(),RNDPOW)*(Math.random()<.5?1:-1)*RND*(0.4+r*0.18); }
      pos[i3]=Math.cos(br)*r+rr(); pos[i3+1]=rr()*0.6; pos[i3+2]=Math.sin(br)*r+rr();
      var c=cIn.clone().lerp(r/RAD<0.55?cMid:cOut, Math.min(1,r/RAD));
      col[i3]=c.r; col[i3+1]=c.g; col[i3+2]=c.b;
    }
    var geo=new THREE.BufferGeometry();
    geo.setAttribute('position',new THREE.BufferAttribute(pos,3));
    geo.setAttribute('color',new THREE.BufferAttribute(col,3));
    var mat=new THREE.PointsMaterial({size:0.14, map:tex, sizeAttenuation:true, depthWrite:false, blending:THREE.AdditiveBlending, vertexColors:true, transparent:true});
    var galaxy=new THREE.Points(geo,mat); galaxy.rotation.x=0.42; scene.add(galaxy);
    // bright warm core
    var core=new THREE.Sprite(new THREE.SpriteMaterial({map:tex, color:0xffe7c2, blending:THREE.AdditiveBlending, transparent:true, depthWrite:false}));
    core.scale.set(1.6,1.6,1.6); scene.add(core);
    // distant background stars
    var sN=900, sp=new Float32Array(sN*3);
    for(var j=0;j<sN;j++){ sp[j*3]=(Math.random()-.5)*46; sp[j*3+1]=(Math.random()-.5)*46; sp[j*3+2]=(Math.random()-.5)*46; }
    var sGeo=new THREE.BufferGeometry(); sGeo.setAttribute('position',new THREE.BufferAttribute(sp,3));
    scene.add(new THREE.Points(sGeo,new THREE.PointsMaterial({size:0.12,map:tex,color:0xeef2f4,sizeAttenuation:true,transparent:true,opacity:.8,depthWrite:false,blending:THREE.AdditiveBlending})));
    var mx=0,my=0,cmx=0,cmy=0;
    window.addEventListener('pointermove',function(e){ mx=e.clientX/innerWidth-0.5; my=e.clientY/innerHeight-0.5; },{passive:true});
    function size(){ var w=canvas.clientWidth,h=canvas.clientHeight; renderer.setSize(w,h,false); cam.aspect=w/(h||1); cam.updateProjectionMatrix(); }
    size(); window.addEventListener('resize',size);
    (function loop(){ galaxy.rotation.y+=0.0010; cmx+=(mx-cmx)*0.04; cmy+=(my-cmy)*0.04;
      cam.position.x=cmx*2.6; cam.position.y=2.3-cmy*1.6; cam.lookAt(0,0,0);
      renderer.render(scene,cam); requestAnimationFrame(loop);
    })();
  }

  /* ---------- 8 · re-homed secondary scenes ---------- */
  function gasGiant(canvas){
    var ctx=canvas.getContext('2d'), W,H,cx,cy,PR, DPR=Math.min(2,window.devicePixelRatio||1);
    function size(){ W=canvas.clientWidth;H=canvas.clientHeight;canvas.width=W*DPR;canvas.height=H*DPR;ctx.setTransform(DPR,0,0,DPR,0,0);cx=W*0.5;cy=H*0.5;PR=Math.min(W,H)*0.2; }
    size(); window.addEventListener('resize',size);
    function ring(ox,oy,back){ var rot=-0.42, rs=[[PR*1.5,'rgba(231,200,150,0.5)',PR*0.3],[PR*1.85,'rgba(201,170,120,0.32)',PR*0.22],[PR*2.1,'rgba(231,200,150,0.2)',PR*0.13]];
      for(var i=0;i<rs.length;i++){ ctx.strokeStyle=rs[i][1]; ctx.lineWidth=rs[i][2]; ctx.beginPath();
        if(back) ctx.ellipse(ox,oy,rs[i][0],rs[i][0]*0.32,rot,Math.PI,2*Math.PI); else ctx.ellipse(ox,oy,rs[i][0],rs[i][0]*0.32,rot,0,Math.PI); ctx.stroke(); } }
    function draw(t){ ctx.clearRect(0,0,W,H); var ox=cx,oy=cy;
      var ag=ctx.createRadialGradient(ox,oy,PR*0.5,ox,oy,PR*1.5); ag.addColorStop(0,'rgba(231,168,119,0.16)'); ag.addColorStop(1,'rgba(231,168,119,0)'); ctx.fillStyle=ag; ctx.beginPath(); ctx.arc(ox,oy,PR*1.5,0,6.283); ctx.fill();
      ring(ox,oy,true);
      ctx.save(); ctx.beginPath(); ctx.arc(ox,oy,PR,0,6.283); ctx.clip();
      var bands=['#d9a86a','#b07d44','#e3c08a','#a06f3c','#cf9a5e','#bb8850','#e7caa0'],bh=PR*2/bands.length,off=(t*7)%bh;
      for(var b=-1;b<bands.length+1;b++){ ctx.fillStyle=bands[((b%bands.length)+bands.length)%bands.length]; ctx.fillRect(ox-PR,oy-PR+b*bh+off,PR*2,bh+1); }
      ctx.fillStyle='rgba(150,80,40,0.45)'; ctx.beginPath(); ctx.ellipse(ox+PR*0.3,oy+PR*0.16,PR*0.2,PR*0.12,0,0,6.283); ctx.fill();
      var tg=ctx.createLinearGradient(ox-PR,0,ox+PR,0); tg.addColorStop(0,'rgba(7,13,11,0.9)'); tg.addColorStop(0.45,'rgba(7,13,11,0.15)'); tg.addColorStop(0.72,'rgba(7,13,11,0)'); ctx.fillStyle=tg; ctx.fillRect(ox-PR,oy-PR,PR*2,PR*2);
      ctx.restore();
      ctx.strokeStyle='rgba(255,238,210,0.5)'; ctx.lineWidth=1.6; ctx.beginPath(); ctx.arc(ox,oy,PR-0.9,-1.15,0.7); ctx.stroke();
      ring(ox,oy,false);
      var mang=t*0.45,mr=Math.min(W,H)*0.022,mox=ox+Math.cos(mang)*PR*2.1,moy=oy+Math.sin(mang)*PR*2.1*0.38; ctx.fillStyle='rgba(222,212,196,0.95)'; ctx.beginPath(); ctx.arc(mox,moy,mr,0,6.283); ctx.fill();
    }
    if(reduce){ draw(0); window.addEventListener('resize',function(){draw(0);}); return; }
    var s0=performance.now(); (function l(n){ draw((n-s0)/1000); requestAnimationFrame(l); })(s0);
  }
  function orrerySolar(canvas){
    var ctx=canvas.getContext('2d'),W,H,cx,cy,base, DPR=Math.min(2,window.devicePixelRatio||1);
    var PL=[{a:0.26,sp:0.30,r:4,col:'231,168,119',ring:1},{a:0.42,sp:0.21,r:3.4,col:'143,182,214',ring:0,moon:1},{a:0.6,sp:0.14,r:6,col:'201,160,106',ring:1},{a:0.8,sp:0.09,r:3.4,col:'238,242,244',ring:0}];
    PL.forEach(function(p){p.ang=Math.random()*6.283;p.mang=Math.random()*6.283;});
    function size(){W=canvas.clientWidth;H=canvas.clientHeight;canvas.width=W*DPR;canvas.height=H*DPR;ctx.setTransform(DPR,0,0,DPR,0,0);cx=W*0.5;cy=H*0.5;base=Math.min(W,H);}
    size(); window.addEventListener('resize',size);
    function draw(t){ ctx.clearRect(0,0,W,H); var R0=base*0.11,pulse=1+0.05*Math.sin(t*1.4);
      var g=ctx.createRadialGradient(cx,cy,0,cx,cy,R0*4.2*pulse); g.addColorStop(0,'rgba(255,244,224,1)'); g.addColorStop(0.22,'rgba(255,224,180,0.85)'); g.addColorStop(0.55,'rgba(231,150,90,0.35)'); g.addColorStop(1,'rgba(231,150,90,0)');
      ctx.fillStyle=g; ctx.beginPath(); ctx.arc(cx,cy,R0*4.2*pulse,0,6.283); ctx.fill();
      ctx.fillStyle='rgba(255,247,232,1)'; ctx.beginPath(); ctx.arc(cx,cy,R0*pulse,0,6.283); ctx.fill();
      for(var i=0;i<PL.length;i++){ var p=PL[i],rx=base*0.46*p.a,ry=rx*0.4;
        ctx.strokeStyle='rgba(169,197,160,0.12)'; ctx.lineWidth=1; ctx.beginPath(); ctx.ellipse(cx,cy,rx,ry,0,0,6.283); ctx.stroke();
        p.ang+=p.sp*0.011; var px=cx+Math.cos(p.ang)*rx,py=cy+Math.sin(p.ang)*ry,depth=(Math.sin(p.ang)+1)/2,rr=p.r*(0.7+depth*0.5);
        var gg=ctx.createRadialGradient(px,py,0,px,py,rr*3); gg.addColorStop(0,'rgba('+p.col+','+(0.5+depth*0.4)+')'); gg.addColorStop(1,'rgba('+p.col+',0)'); ctx.fillStyle=gg; ctx.beginPath(); ctx.arc(px,py,rr*3,0,6.283); ctx.fill();
        if(p.ring){ ctx.save(); ctx.translate(px,py); ctx.rotate(-0.5); ctx.strokeStyle='rgba('+p.col+','+(0.5+depth*0.3)+')'; ctx.lineWidth=1.3; ctx.beginPath(); ctx.ellipse(0,0,rr*2,rr*0.66,0,0,6.283); ctx.stroke(); ctx.restore(); }
        ctx.fillStyle='rgba('+p.col+','+(0.85+depth*0.15)+')'; ctx.beginPath(); ctx.arc(px,py,rr,0,6.283); ctx.fill();
        if(p.moon){ p.mang+=0.05; ctx.fillStyle='rgba(238,242,244,0.9)'; ctx.beginPath(); ctx.arc(px+Math.cos(p.mang)*rr*2.4,py+Math.sin(p.mang)*rr*2.4*0.6,1.6,0,6.283); ctx.fill(); }
      }
    }
    if(reduce){ draw(0); window.addEventListener('resize',function(){draw(0);}); return; }
    var s0=performance.now(); (function l(n){ draw((n-s0)/1000); requestAnimationFrame(l); })(s0);
  }

  /* ---------- 9 · cursor-gravity nebula (interactive hero) ----------
     ~1000 glowing particles that swirl into orbit around the cursor and scatter
     in a supernova on click. 2D canvas for crisp, strong interaction. */
  function nebula(canvas){
    var ctx=canvas.getContext('2d'), DPR=Math.min(2,window.devicePixelRatio||1), W,H,N=0, ps=[], mx=0,my=0, active=false;
    var COLS=['231,168,119','169,197,160','143,182,214','238,242,244'];
    var sprites=COLS.map(function(c){ var s=document.createElement('canvas'); s.width=s.height=32; var x=s.getContext('2d');
      var g=x.createRadialGradient(16,16,0,16,16,16); g.addColorStop(0,'rgba('+c+',0.9)'); g.addColorStop(0.4,'rgba('+c+',0.35)'); g.addColorStop(1,'rgba('+c+',0)'); x.fillStyle=g; x.fillRect(0,0,32,32); return s; });
    function mk(){ return { x:Math.random()*W, y:Math.random()*H, vx:0, vy:0, hx:Math.random()*W, hy:Math.random()*H, ci:(Math.random()*COLS.length)|0, s:Math.random()*1.6+0.6 }; }
    function size(){ W=canvas.clientWidth; H=canvas.clientHeight; canvas.width=W*DPR; canvas.height=H*DPR; ctx.setTransform(DPR,0,0,DPR,0,0);
      N=Math.min(1200,Math.round(W*H/950)); ps=[]; for(var i=0;i<N;i++) ps.push(mk()); }
    size(); window.addEventListener('resize',size);
    function at(e){ var r=canvas.getBoundingClientRect(); mx=e.clientX-r.left; my=e.clientY-r.top; active=(mx>=0&&my>=0&&mx<=r.width&&my<=r.height); }
    window.addEventListener('pointermove',at,{passive:true});
    window.addEventListener('pointerdown',function(e){ at(e); if(!active) return; for(var i=0;i<ps.length;i++){ var p=ps[i],dx=p.x-mx,dy=p.y-my,d=Math.hypot(dx,dy)+1; var f=Math.min(9,520/d); p.vx+=dx/d*f; p.vy+=dy/d*f; } });
    function draw(){
      ctx.clearRect(0,0,W,H); ctx.globalCompositeOperation='lighter';
      for(var i=0;i<ps.length;i++){ var p=ps[i];
        if(active){ var dx=mx-p.x, dy=my-p.y, d2=dx*dx+dy*dy+40, d=Math.sqrt(d2);
          var pull=Math.min(0.55,1500/d2); p.vx+=dx/d*pull; p.vy+=dy/d*pull;       // gravity
          p.vx+=-dy/d*0.42; p.vy+=dx/d*0.42;                                         // tangential swirl
          if(d<95){ var rep=(95-d)*0.018; p.vx-=dx/d*rep; p.vy-=dy/d*rep; }          // soft core so they orbit
        } else { p.vx+=(p.hx-p.x)*0.0016; p.vy+=(p.hy-p.y)*0.0016; }
        p.vx*=0.9; p.vy*=0.9; p.x+=p.vx; p.y+=p.vy;
        var sp=Math.min(2.4,1+Math.hypot(p.vx,p.vy)*0.25), r=p.s*sp*3.2;
        ctx.drawImage(sprites[p.ci], p.x-r, p.y-r, r*2, r*2);
      }
      ctx.globalCompositeOperation='source-over';
      requestAnimationFrame(draw);
    }
    if(reduce){ ctx.globalCompositeOperation='lighter'; for(var i=0;i<ps.length;i++){ var p=ps[i],r=p.s*3.2; ctx.drawImage(sprites[p.ci],p.x-r,p.y-r,r*2,r*2); } return; }
    requestAnimationFrame(draw);
  }

  /* ---------- 11 · cinematic scroll-launch (interactive hero) ----------
     Scroll flies the camera up from the Kaunas horizon, through cloud + star
     layers, and lands at the observatory dome. Captions reveal in stages. */
  function launch(canvas){
    var ctx=canvas.getContext('2d'), DPR=Math.min(2,window.devicePixelRatio||1), W,H,p=0,tp=0,t=0;
    var section=canvas.closest('.hero')||canvas.parentNode;
    var stages=[].slice.call(section.querySelectorAll('[data-stage]'));
    var stars=[]; for(var i=0;i<260;i++) stars.push({x:Math.random(),y:Math.random(),r:Math.random()*1.3+0.3,tw:Math.random()*6.28});
    var clouds=[{alt:0.2,x:0.32,w:0.8,o:0.5},{alt:0.5,x:0.62,w:1.0,o:0.42},{alt:0.8,x:0.2,w:0.9,o:0.34}];
    function size(){ W=canvas.clientWidth;H=canvas.clientHeight;canvas.width=W*DPR;canvas.height=H*DPR;ctx.setTransform(DPR,0,0,DPR,0,0); }
    size(); window.addEventListener('resize',size);
    function L(a,b,k){ return a+(b-a)*k; }
    function setStages(){ var idx=p<0.34?0:p<0.68?1:2; for(var i=0;i<stages.length;i++){ var on=(+stages[i].getAttribute('data-stage')===idx); stages[i].style.opacity=on?'1':'0'; stages[i].style.transform=on?'none':'translateY(16px)'; } }
    function draw(){ t+=0.016; p+=(tp-p)*0.08; ctx.clearRect(0,0,W,H);
      var g=ctx.createLinearGradient(0,0,0,H);
      g.addColorStop(0,'rgb('+Math.round(L(18,7,p))+','+Math.round(L(28,13,p))+','+Math.round(L(46,11,p))+')');
      g.addColorStop(1,'rgb('+Math.round(L(60,8,p))+','+Math.round(L(40,16,p))+','+Math.round(L(32,18,p))+')');
      ctx.fillStyle=g; ctx.fillRect(0,0,W,H);
      var sa=Math.max(0,Math.min(1,(p-0.12)/0.4));
      for(var i=0;i<stars.length;i++){ var s=stars[i]; var y=((s.y*H+(1-p)*H*0.4)%H+H)%H; ctx.fillStyle='rgba(238,242,244,'+(sa*(0.35+0.5*Math.sin(s.tw+t)))+')'; ctx.beginPath(); ctx.arc(s.x*W,y,s.r,0,6.283); ctx.fill(); }
      for(var c=0;c<clouds.length;c++){ var cl=clouds[c], cy=H*cl.alt+p*H*1.8-H*0.25; if(cy>-60&&cy<H+80){ var cg=ctx.createRadialGradient(cl.x*W,cy,0,cl.x*W,cy,W*cl.w*0.5); cg.addColorStop(0,'rgba(150,150,160,'+(cl.o*(1-p*0.6))+')'); cg.addColorStop(1,'rgba(150,150,160,0)'); ctx.fillStyle=cg; ctx.beginPath(); ctx.ellipse(cl.x*W,cy,W*cl.w*0.5,H*0.13,0,0,6.283); ctx.fill(); } }
      var gy=H*0.8+p*H*1.35;
      if(gy<H+10){ ctx.fillStyle='#080d0a'; ctx.fillRect(0,gy,W,H-gy+12);
        var hg=ctx.createLinearGradient(0,gy-70,0,gy); hg.addColorStop(0,'rgba(224,150,90,0)'); hg.addColorStop(1,'rgba(224,150,90,'+(0.45*(1-p))+')'); ctx.fillStyle=hg; ctx.fillRect(0,gy-70,W,70);
        for(var l=0;l<46;l++){ ctx.fillStyle='rgba(231,180,120,'+(0.65*(1-p))+')'; ctx.fillRect((l*47.3)%W,gy+3+(l%3)*2,1.6,1.6); } }
      var dp=Math.max(0,Math.min(1,(p-0.52)/0.48));
      if(dp>0){ var ds=L(0.04,0.3,dp)*Math.min(W,H), dx=W*0.5, dy=L(H*1.2,H*0.6,dp);
        var dg=ctx.createRadialGradient(dx,dy-ds*0.3,0,dx,dy-ds*0.3,ds*1.6); dg.addColorStop(0,'rgba(231,168,119,'+(0.22*dp)+')'); dg.addColorStop(1,'rgba(231,168,119,0)'); ctx.fillStyle=dg; ctx.beginPath(); ctx.arc(dx,dy-ds*0.3,ds*1.6,0,6.283); ctx.fill();
        ctx.fillStyle='#0e1c16'; ctx.fillRect(dx-ds*0.5,dy,ds,H);
        ctx.beginPath(); ctx.arc(dx,dy,ds*0.62,Math.PI,0); ctx.fill();
        ctx.strokeStyle='rgba(231,168,119,'+(0.7*dp)+')'; ctx.lineWidth=Math.max(2,ds*0.05); ctx.beginPath(); ctx.moveTo(dx,dy-ds*0.6); ctx.lineTo(dx,dy-ds*0.12); ctx.stroke();
      }
      requestAnimationFrame(draw);
    }
    requestAnimationFrame(draw);
    if(window.gsap && window.ScrollTrigger && !reduce){
      ScrollTrigger.create({ trigger:section, start:'top top', end:'+=2200', pin:true, scrub:true, onUpdate:function(self){ tp=self.progress; setStages(); } });
    } else { tp=1; setStages(); }
    setStages();
  }

  /* ---------- 12 · drag-to-spin 3D observatory dome (interactive hero) ---------- */
  function dome(canvas){
    var THREE=window.THREE; if(reduce||!THREE) return;
    var renderer; try{ renderer=new THREE.WebGLRenderer({canvas:canvas,alpha:true,antialias:true}); }catch(e){ return; }
    renderer.setPixelRatio(Math.min(1.5,window.devicePixelRatio||1));
    var scene=new THREE.Scene(), cam=new THREE.PerspectiveCamera(50,1,0.1,100); cam.position.set(0,0.7,5.2);
    var grp=new THREE.Group(); grp.position.set(1.5,-0.3,0); scene.add(grp);
    var matBody=new THREE.MeshStandardMaterial({color:0x16241c,roughness:0.85,metalness:0.12});
    var tower=new THREE.Mesh(new THREE.CylinderGeometry(1.16,1.28,1.15,48),matBody); tower.position.y=-0.6; grp.add(tower);
    grp.add(new THREE.Mesh(new THREE.SphereGeometry(1.2,48,24,0,Math.PI*2,0,Math.PI/2),new THREE.MeshStandardMaterial({color:0x21372b,roughness:0.7,metalness:0.18})));
    var base=new THREE.Mesh(new THREE.TorusGeometry(1.2,0.075,14,48),matBody); base.rotation.x=Math.PI/2; grp.add(base);
    // open slit + warm light spilling out
    var slit=new THREE.Mesh(new THREE.BoxGeometry(0.24,1.3,0.12),new THREE.MeshBasicMaterial({color:0xf0c089})); slit.position.set(0,0.5,1.16); grp.add(slit);
    var lamp=new THREE.PointLight(0xe7a877,1.3,6); lamp.position.set(0,0.6,1.7); grp.add(lamp);
    scene.add(new THREE.AmbientLight(0x2a3442,0.85));
    var key=new THREE.DirectionalLight(0xffd9a0,1.15); key.position.set(-3,4,3); scene.add(key);
    var fill=new THREE.DirectionalLight(0x5f7fa0,0.55); fill.position.set(4,-1,2); scene.add(fill);
    var sN=700,sp=new Float32Array(sN*3); for(var i=0;i<sN;i++){ sp[i*3]=(Math.random()-.5)*42; sp[i*3+1]=(Math.random()-.5)*42; sp[i*3+2]=-6-Math.random()*26; }
    var sg=new THREE.BufferGeometry(); sg.setAttribute('position',new THREE.BufferAttribute(sp,3));
    scene.add(new THREE.Points(sg,new THREE.PointsMaterial({color:0xeef2f4,size:0.08,transparent:true,opacity:0.8})));
    var rotV=0.003, drag=false, lx=0;
    canvas.addEventListener('pointerdown',function(e){ drag=true; lx=e.clientX; canvas.setPointerCapture&&canvas.setPointerCapture(e.pointerId); });
    window.addEventListener('pointermove',function(e){ if(!drag) return; var dx=e.clientX-lx; rotV=dx*0.0010; grp.rotation.y+=dx*0.006; lx=e.clientX; });
    window.addEventListener('pointerup',function(){ drag=false; });
    function size(){ var w=canvas.clientWidth,h=canvas.clientHeight; renderer.setSize(w,h,false); cam.aspect=w/(h||1); cam.updateProjectionMatrix(); grp.position.x=w<760?0.1:1.5; }
    size(); window.addEventListener('resize',size); canvas.style.cursor='grab';
    (function loop(){ if(!drag){ grp.rotation.y+=rotV; rotV+=(0.0025-rotV)*0.02; } grp.rotation.x=-0.16; renderer.render(scene,cam); requestAnimationFrame(loop); })();
  }

  window.WTCSky = { setMoon:setMoon, skyPanel:skyPanel, orrery:orrery, nebula:nebula, gasGiant:gasGiant, orrerySolar:orrerySolar, starMap:starMap, launch:launch, dome:dome, buildConstellationRoute:buildConstellationRoute, bindReticle:function(el){ if(window.WTCM_bindReticle) window.WTCM_bindReticle(el); } };

  /* ---------- 10 · "Aim the telescope" — explorable star map (interactive hero) ----------
     Drag to pan the night sky; hover links the trip's stops into a constellation;
     click a labelled star to snap to it and reveal its card (via a 'starpick' event). */
  function starMap(canvas){
    var ctx=canvas.getContext('2d'), DPR=Math.min(2,window.devicePixelRatio||1), W,H,t=0;
    var WP=[
      {id:'kaunas',name:'Kaunas',sub:'Depart',x:320,y:780,info:'Set off from Kaunas — about a 2-hour drive north to the dark-sky hills.'},
      {id:'mindunai',name:'Mindūnai',sub:'Optional tower',x:760,y:560,info:'A 36 m forest tower over the Labanoras lakes — the best fall-photo stop, close to the observatory.'},
      {id:'moletai',name:'Molėtai',sub:'Warm-up / food',x:1060,y:600,info:'Dinner and a warm-up in Molėtai before the cold night tower.'},
      {id:'kulionys',name:'Kulionys',sub:'Arrive · buffer',x:1340,y:380,info:'Arrive ~45 min early at the Museum of Ethnocosmology. Warm clothes, phones charged.'},
      {id:'scope',name:'80 cm telescope',sub:'Night anchor',x:1580,y:210,info:'The anchor — the night observation. Clear-sky dependent; wait for the museum\u2019s ~14:00 weather call.',anchor:true}
    ];
    var WORLD={w:1900,h:1080};
    var bg=[]; for(var i=0;i<340;i++) bg.push({x:Math.random()*WORLD.w,y:Math.random()*WORLD.h,r:Math.random()*1.2+0.3,tw:Math.random()*6.28,sp:0.4+Math.random()*0.8});
    var vcx=WP[0].x+160, vcy=WP[0].y-80, tcx=vcx, tcy=vcy;
    var hovered=null, selected=null, visited={}, drag=false, moved=false, lx=0, ly=0;
    function size(){ W=canvas.clientWidth;H=canvas.clientHeight;canvas.width=W*DPR;canvas.height=H*DPR;ctx.setTransform(DPR,0,0,DPR,0,0); }
    size(); window.addEventListener('resize',size);
    function ox(){ return vcx-W/2; } function oy(){ return vcy-H/2; }
    function clamp(){ tcx=Math.max(W*0.32,Math.min(WORLD.w-W*0.18,tcx)); tcy=Math.max(H*0.28,Math.min(WORLD.h-H*0.18,tcy)); }
    function pick(sx,sy){ var wx=sx+ox(), wy=sy+oy(), best=null,bd=46; for(var i=0;i<WP.length;i++){ var d=Math.hypot(WP[i].x-wx,WP[i].y-wy); if(d<bd){ bd=d; best=WP[i]; } } return best; }
    function select(wp){ selected=wp; visited[wp.id]=1; tcx=wp.x; tcy=wp.y; clamp(); canvas.dispatchEvent(new CustomEvent('starpick',{detail:wp})); }
    canvas.addEventListener('pointerdown',function(e){ drag=true; moved=false; lx=e.clientX; ly=e.clientY; canvas.setPointerCapture&&canvas.setPointerCapture(e.pointerId); });
    canvas.addEventListener('pointermove',function(e){ var r=canvas.getBoundingClientRect(), sx=e.clientX-r.left, sy=e.clientY-r.top;
      if(drag){ var dx=e.clientX-lx, dy=e.clientY-ly; if(Math.abs(dx)+Math.abs(dy)>4) moved=true; vcx-=dx; vcy-=dy; tcx=vcx; tcy=vcy; clamp(); vcx=tcx; vcy=tcy; lx=e.clientX; ly=e.clientY; }
      else { hovered=pick(sx,sy); canvas.style.cursor=hovered?'pointer':'grab'; } });
    function up(e){ if(!drag) return; drag=false; if(!moved){ var r=canvas.getBoundingClientRect(); var w=pick(e.clientX-r.left,e.clientY-r.top); if(w) select(w); } }
    canvas.addEventListener('pointerup',up); canvas.addEventListener('pointerleave',function(){ drag=false; hovered=null; });
    function star(sx,sy,rad,a,warm){ ctx.beginPath(); ctx.arc(sx,sy,rad,0,6.283); ctx.fillStyle=(warm?'rgba(231,168,119,':'rgba(238,242,244,')+a+')'; ctx.fill(); }
    function draw(){
      t+=0.016; vcx+=(tcx-vcx)*0.08; vcy+=(tcy-vcy)*0.08;
      ctx.clearRect(0,0,W,H); var OX=ox(), OY=oy();
      for(var i=0;i<bg.length;i++){ var b=bg[i]; var x=b.x-OX, y=b.y-OY; if(x<-10||x>W+10||y<-10||y>H+10) continue; star(x,y,b.r,(0.3+0.4*Math.sin(b.tw+t*b.sp))*0.8,false); }
      // constellation line through the stops
      ctx.lineWidth=1.6; ctx.lineCap='round';
      for(var k=0;k<WP.length-1;k++){ var a=WP[k],c=WP[k+1]; var lit=(visited[a.id]&&visited[c.id]);
        ctx.strokeStyle=lit?'rgba(169,197,160,0.85)':'rgba(169,197,160,0.22)'; if(lit) ctx.shadowColor='rgba(169,197,160,0.6)',ctx.shadowBlur=6;
        ctx.beginPath(); ctx.moveTo(a.x-OX,a.y-OY); ctx.lineTo(c.x-OX,c.y-OY); ctx.stroke(); ctx.shadowBlur=0; }
      // waypoints
      for(var j=0;j<WP.length;j++){ var w=WP[j]; var sx=w.x-OX, sy=w.y-OY; var on=(hovered===w||selected===w);
        var rad=(w.anchor?7:5)*(on?1.5:1);
        var gl=ctx.createRadialGradient(sx,sy,0,sx,sy,rad*4); var base=w.anchor?'231,168,119':'238,242,244'; gl.addColorStop(0,'rgba('+base+','+(on?0.6:0.32)+')'); gl.addColorStop(1,'rgba('+base+',0)'); ctx.fillStyle=gl; ctx.beginPath(); ctx.arc(sx,sy,rad*4,0,6.283); ctx.fill();
        star(sx,sy,rad,1,w.anchor);
        ctx.font='700 15px "Hanken Grotesk",sans-serif'; ctx.fillStyle='rgba(243,237,225,'+(on?1:0.82)+')'; ctx.textAlign='center'; ctx.fillText(w.name,sx,sy-rad-10);
        ctx.font='400 10px "Space Mono",monospace'; ctx.fillStyle='rgba(174,184,182,'+(on?1:0.7)+')'; ctx.fillText(w.sub.toUpperCase(),sx,sy+rad+18);
      }
      // aiming reticle at screen centre
      ctx.strokeStyle='rgba(169,197,160,0.5)'; ctx.lineWidth=1; ctx.beginPath(); ctx.arc(W/2,H/2,16,0,6.283); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(W/2-24,H/2); ctx.lineTo(W/2-6,H/2); ctx.moveTo(W/2+6,H/2); ctx.lineTo(W/2+24,H/2); ctx.moveTo(W/2,H/2-24); ctx.lineTo(W/2,H/2-6); ctx.moveTo(W/2,H/2+6); ctx.lineTo(W/2,H/2+24); ctx.stroke();
      requestAnimationFrame(draw);
    }
    canvas.style.cursor='grab';
    if(reduce){ draw(); return; }
    requestAnimationFrame(draw);
  }

  /* ---------- boot (after motion.js boot) ---------- */
  function boot(){
    initReticle();
    initStarfield();
    initStarCards();
    document.querySelectorAll('.moonwidget[data-illum]').forEach(function(el){ setMoon(el, parseFloat(el.getAttribute('data-illum'))||0); });
    document.querySelectorAll('.sky-chart').forEach(skyPanel);
    document.querySelectorAll('.orrery').forEach(orrery);
    document.querySelectorAll('.gasgiant').forEach(gasGiant);
    document.querySelectorAll('.orrery-solar').forEach(orrerySolar);
    document.querySelectorAll('.nebula').forEach(nebula);
    document.querySelectorAll('.starmap').forEach(starMap);
    document.querySelectorAll('.launch-cv').forEach(launch);
    document.querySelectorAll('.dome3d').forEach(dome);
    // route is built by the page via WTCM_onReady so it can order with other timelines;
    // but if a page just wants it, auto-build when the stage exists and no page hook ran.
    if(document.getElementById('skystage') && !window.__skyRouteByPage){ buildConstellationRoute(); if(window.ScrollTrigger) ScrollTrigger.refresh(); }
  }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded', function(){ setTimeout(boot,90); });
  else setTimeout(boot,90);
})();

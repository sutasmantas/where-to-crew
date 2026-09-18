/* Drag across the Observatory hero to gather stars; release to fling them. */
(function(){
  var hero=document.querySelector('.hero'), canvas=hero&&hero.querySelector('.fling-cv');
  if(!canvas||matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  var ctx=canvas.getContext('2d'), stars=[], trail=[], down=false, last=null, vx=0, vy=0;
  function size(){ var d=Math.min(devicePixelRatio||1,2); canvas.width=hero.clientWidth*d; canvas.height=hero.clientHeight*d; ctx.setTransform(d,0,0,d,0,0); }
  size(); addEventListener('resize',size);
  function point(e){ var r=hero.getBoundingClientRect(); return {x:e.clientX-r.left,y:e.clientY-r.top}; }
  function spawn(x,y,dx,dy,n){ for(var i=0;i<n;i++) stars.push({x:x,y:y,vx:dx+(Math.random()-.5)*2,vy:dy+(Math.random()-.5)*2,life:1,r:Math.random()*1.8+.7,warm:Math.random()>.65}); }
  hero.addEventListener('pointerdown',function(e){ if(e.target.closest('a,button,input')) return; down=true; last=point(e); vx=vy=0; });
  hero.addEventListener('pointermove',function(e){ if(!down) return; var p=point(e); if(!last) last=p; vx=p.x-last.x; vy=p.y-last.y; trail.push(p); if(trail.length>12) trail.shift(); spawn(p.x,p.y,vx*.22,vy*.22,3); last=p; },{passive:true});
  function release(){ if(!down) return; down=false; if(last){ spawn(last.x,last.y,vx*.55,vy*.55,22); } last=null; trail=[]; }
  addEventListener('pointerup',release); addEventListener('pointercancel',release);
  function frame(){ var w=hero.clientWidth,h=hero.clientHeight; ctx.clearRect(0,0,w,h); ctx.save(); ctx.globalCompositeOperation='lighter';
    for(var i=stars.length-1;i>=0;i--){ var s=stars[i]; s.x+=s.vx; s.y+=s.vy; s.vx*=.985; s.vy*=.985; s.life-=.012; if(s.life<=0||s.x<0||s.y<0||s.x>w||s.y>h){ stars.splice(i,1); continue; }
      ctx.fillStyle=s.warm?'rgba(231,168,119,'+(s.life*.85)+')':'rgba(225,240,255,'+(s.life*.9)+')'; ctx.shadowColor=s.warm?'#e7a877':'#cde4ff'; ctx.shadowBlur=12; ctx.beginPath(); ctx.arc(s.x,s.y,s.r*s.life,0,Math.PI*2); ctx.fill();
    }
    ctx.restore(); requestAnimationFrame(frame); }
  requestAnimationFrame(frame);
})();

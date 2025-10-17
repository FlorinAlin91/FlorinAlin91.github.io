// ===== FLĂCĂRI „premium” (auriu + albastru), mișcare imediată =====
(() => {
  const canvas = document.getElementById('flames-bg');
  if (!canvas) return;

  const ctx = canvas.getContext('2d', { alpha: true });
  const sec = canvas.closest('.ms-hero');

  let W=0, H=0, DPR=Math.min(window.devicePixelRatio||1, 2);
  const P=[];                // particule
  const MAX=520;             // densitate
  const GOLD=[255,188,70];   // auriu cald
  const BLUE=[70,145,255];   // albastru rece

  function sizeToSection(){
    const r = sec.getBoundingClientRect();
    W = Math.max(1, r.width);
    H = Math.max(1, r.height);
    canvas.width  = W * DPR;
    canvas.height = H * DPR;
    ctx.setTransform(DPR,0,0,DPR,0,0);
  }
  sizeToSection();
  addEventListener('resize', sizeToSection, { passive:true });

  const mix =(a,b,t)=>a+(b-a)*t;
  const col =(c,a)=>rgba(${c[0]|0},${c[1]|0},${c[2]|0},${a});

  function spawn(x,y,c, boost=false){
    const s = boost ? (2+Math.random()*3.5) : (1+Math.random()*2.4);
    const vy = boost ? -(1.6+Math.random()*2.2) : -(1.2+Math.random()*1.7);
    P.push({
      x,y, vx:(Math.random()-0.5)*0.55, vy,
      life:0, max: (80+Math.random()*90),
      s, c
    });
  }

  // intro „burst” – se vede imediat la intrare
  (function intro(){
    const base = H*0.82;
    for (let i=0;i<180;i++){
      spawn(W*0.28 + (Math.random()-0.5)*140, base + Math.random()*40, GOLD, true);
      spawn(W*0.72 + (Math.random()-0.5)*140, base + Math.random()*40, BLUE, true);
    }
  })();

  let t=0;
  function tick(){
    t += 0.016;

    // fundal subtil în degrade
    const g = ctx.createLinearGradient(0,H,0,0);
    g.addColorStop(0,'#050607'); g.addColorStop(1,'#0b0f19');
    ctx.fillStyle = g; ctx.fillRect(0,0,W,H);

    // emițători continui
    const base = H*0.84;
    for (let i=0;i<10;i++){
      spawn(W*0.28 + Math.sin(t*0.9+i)*34, base + Math.random()*22, GOLD);
      spawn(W*0.72 + Math.cos(t*1.1+i)*34, base + Math.random()*22, BLUE);
    }

    ctx.globalCompositeOperation='lighter';
    for (let i=P.length-1;i>=0;i--){
      const p=P[i];
      p.life++;
      if (p.life>p.max){ P.splice(i,1); continue; }

      // „vânt” ușor + urcare
      const wind = Math.sin((p.y+t*60)/180)*0.28 + Math.sin(t*2.6)*0.18;
      p.vx += wind*0.004;
      p.x  += p.vx; p.y += p.vy;

      const k = p.life/p.max;
      const c = [ mix(p.c[0],255,k*0.65), mix(p.c[1],255,k*0.55), mix(p.c[2],255,k*0.65) ];
      const a = 0.15*(1-k);                 // alfa mai mare => mai vizibil
      const r = p.s*(1+k*1.7)*24;

      const rad = ctx.createRadialGradient(p.x,p.y,0,p.x,p.y,r);
      rad.addColorStop(0, col(c,a));
      rad.addColorStop(1, col(c,0));
      ctx.fillStyle = rad;
      ctx.beginPath(); ctx.arc(p.x,p.y,r,0,Math.PI*2); ctx.fill();
    }
    ctx.globalCompositeOperation='source-over';

    if (P.length>MAX) P.splice(0, P.length-MAX);
    requestAnimationFrame(tick);
  }
  tick();
})();

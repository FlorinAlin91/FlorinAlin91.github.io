// Flăcări vizibile (auriu + albastru), intensitate mare
(() => {
  const canvas = document.getElementById('flames-bg');
  if (!canvas) return;
  const ctx = canvas.getContext('2d', { alpha: true });
  const sec = canvas.parentElement;

  let W=0, H=0, DPR = Math.min(devicePixelRatio || 1, 2);
  const P = [];               // particule
  const MAX = 400;            // mai multe particule
  const GOLD = [255, 190, 60];
  const BLUE = [70, 150, 255];

  function resize(){
    const r = sec.getBoundingClientRect();
    W = Math.max(1, r.width);
    H = Math.max(1, sec.offsetHeight || r.height || innerHeight*0.78);
    canvas.width = W * DPR;
    canvas.height = H * DPR;
    ctx.setTransform(DPR,0,0,DPR,0,0);
  }
  addEventListener('resize', resize, {passive:true});
  resize();

  const mix = (a,b,t)=>a+(b-a)*t;
  const rgba = (c,a)=>rgba(${c[0]|0},${c[1]|0},${c[2]|0},${a});

  function spawn(x, y, c){
    P.push({
      x, y,
      vx:(Math.random()-0.5)*0.6,
      vy:-(1.4+Math.random()*2.0),
      life:0, max:80+Math.random()*80,
      s:1.2+Math.random()*3.0,
      c
    });
  }

  let t=0;
  function frame(){
    t += 0.016;

    // fundal foarte închis, ușor nuanțat
    const bg = ctx.createLinearGradient(0,H,0,0);
    bg.addColorStop(0,'#050506'); bg.addColorStop(1,'#0c111b');
    ctx.fillStyle = bg; ctx.fillRect(0,0,W,H);

    // emițătoare: auriu stânga, albastru dreapta
    const base = H*0.82;
    for (let i=0;i<10;i++){
      spawn(W*0.28 + Math.sin(t*0.9+i)*35, base + Math.random()*24, GOLD);
      spawn(W*0.72 + Math.cos(t*1.1+i)*35, base + Math.random()*24, BLUE);
    }

    ctx.globalCompositeOperation = 'lighter';
    for (let i=P.length-1;i>=0;i--){
      const p = P[i];
      p.life++;
      if (p.life>p.max){ P.splice(i,1); continue; }

      // vânt + urcare
      const wind = Math.sin((p.y+t*60)/160)*0.35 + Math.sin(t*3)*0.2;
      p.vx += wind*0.004;
      p.x += p.vx; p.y += p.vy;

      const k = p.life/p.max;
      const c = [ mix(p.c[0],255,k*0.7), mix(p.c[1],255,k*0.6), mix(p.c[2],255,k*0.7) ];
      const a = 0.14*(1-k);                   // alfa mai mare => mai vizibil
      const r = p.s*(1+k*1.7)*26;             // rază mai mare

      const g = ctx.createRadialGradient(p.x,p.y,0,p.x,p.y,r);
      g.addColorStop(0, rgba(c, a));
      g.addColorStop(1, rgba(c, 0));
      ctx.fillStyle = g;
      ctx.beginPath(); ctx.arc(p.x,p.y,r,0,Math.PI*2); ctx.fill();
    }
    ctx.globalCompositeOperation = 'source-over';

    if (P.length>MAX) P.splice(0, P.length-MAX);
    requestAnimationFrame(frame);
  }
  frame();
})();
/* ===== ALT HERO (fără flăcări) ===== */
.alt-hero{
  position: relative;
  height: clamp(520px, 72vh, 860px);
  margin: 0 auto 56px;
  overflow: hidden;
  isolation: isolate;
}

/* fundal discret cu gradient mișcat */
.alt-hero__bg{
  position:absolute; inset:0;
  background:
    radial-gradient(1200px 600px at 20% 80%, rgba(255,191,43,.15), transparent 60%),
    radial-gradient(1200px 600px at 80% 80%, rgba(80,140,255,.12), transparent 60%),
    #0b0b0e;
  animation: heroGlow 10s linear infinite;
  z-index: 0;
}

@keyframes heroGlow{
  0%   { filter: hue-rotate(0deg) brightness(1); }
  50%  { filter: hue-rotate(10deg) brightness(1.05); }
  100% { filter: hue-rotate(0deg) brightness(1); }
}

.alt-hero__content{
  position: relative;
  z-index: 2;
  height: 100%;
  max-width: 980px;
  margin: 0 auto;
  padding: 0 20px;
  display: grid;
  place-items: center;
  text-align: center;
}

.alt-hero__logo{
  width: 120px;              /* mai mic decât înainte */
  height: auto;
  margin-bottom: 16px;
  filter: drop-shadow(0 0 10px rgba(255,191,43,.35));
}

.alt-hero__title{
  font-size: clamp(30px, 5vw, 56px);
  line-height: 1.05;
  margin: 10px 0 8px;
  font-weight: 800;
  color: #fff;
  text-shadow: 0 0 16px rgba(255,191,43,.35);
}

.alt-hero__lead{
  color: #cfd2d8;
  margin: 0 0 22px;
  font-size: clamp(15px, 2vw, 18px);
}

.alt-hero__cta{
  display: inline-flex;
  gap: 12px;
  flex-wrap: wrap;
  justify-content: center;
}

/* butoane */
.btn{
  display:inline-block;
  padding: 12px 18px;
  border-radius: 999px;
  font-weight: 800;
  text-decoration: none;
  transition: transform .15s ease, box-shadow .2s ease, background .2s ease;
}

.btn--primary{
  background: linear-gradient(90deg, #ffbf2b, #ff9f00);
  color: #121212;
  box-shadow: 0 0 18px rgba(255,191,43,.35);
}
.btn--primary:hover{ transform: translateY(-1px); box-shadow:0 0 26px rgba(255,191,43,.55); }

.btn--ghost{
  border: 1px solid rgba(255,191,43,.45);
  color: #eee;
  background: transparent;
}
.btn--ghost:hover{ background: rgba(255,191,43,.08); }

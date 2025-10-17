// assets/js/flames-bg.js
(() => {
  const canvas = document.getElementById('flames-bg');
  if (!canvas) return;
  const ctx = canvas.getContext('2d', { alpha: true });
  const container = canvas.parentElement; // <section class="ms-hero">

  let W, H, DPR = Math.min(window.devicePixelRatio || 1, 2);
  const particles = [];
  const MAX = 260;
  const GOLD = [255, 180, 40];
  const BLUE = [60, 140, 255];

  function resize() {
    const rect = container.getBoundingClientRect();
    W = Math.max(1, rect.width);
    // dacă nu are înălțime setată, folosim 82% din viewport
    H = container.offsetHeight || rect.height || Math.round(window.innerHeight * 0.82);
    canvas.width = W * DPR;
    canvas.height = H * DPR;
    ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
  }
  resize();
  addEventListener('resize', resize, { passive: true });

  function spawn(x, baseY, color) {
    const s = Math.random() * 2.2 + 0.6;
    particles.push({
      x, y: baseY,
      vx: (Math.random() - 0.5) * 0.35,
      vy: -(1.2 + Math.random() * 1.6),
      life: 0, maxLife: 100 + Math.random() * 80,
      size: s, color
    });
  }
  const mix = (a,b,t) => a + (b - a) * t;
  const rgba = (c,a) => rgba(${c[0]|0},${c[1]|0},${c[2]|0},${a});

  let t = 0;
  function loop() {
    t += 0.016;
    ctx.clearRect(0,0,W,H);

    const g = ctx.createLinearGradient(0,H,0,0);
    g.addColorStop(0,'#050506'); g.addColorStop(1,'#0a0f1a');
    ctx.fillStyle = g; ctx.fillRect(0,0,W,H);

    const baseY = H * 0.8;
    for (let i=0;i<6;i++) {
      spawn(W*0.28 + Math.sin(t*0.9+i)*30, baseY + Math.random()*20, GOLD);
      spawn(W*0.72 + Math.cos(t*1.1+i)*30, baseY + Math.random()*20, BLUE);
    }

    ctx.globalCompositeOperation = 'lighter';
    for (let i = particles.length-1; i >= 0; i--) {
      const p = particles[i];
      if (++p.life > p.maxLife) { particles.splice(i,1); continue; }

      const wind = Math.sin((p.y+t*60)/180)*0.25 + Math.sin(t*2)*0.15;
      p.vx += wind*0.003; p.x += p.vx; p.y += p.vy;

      const k = p.life / p.maxLife;
      const c = [ mix(p.color[0],255,k*0.6),
                  mix(p.color[1],255,k*0.5),
                  mix(p.color[2],255,k*0.6) ];
      const alpha = 0.08 * (1 - k);
      const r = p.size * (1 + k*1.5) * 2.2;

      const grd = ctx.createRadialGradient(p.x,p.y,0,p.x,p.y,r);
      grd.addColorStop(0, rgba(c, alpha));
      grd.addColorStop(1, rgba(c, 0));
      ctx.fillStyle = grd;
      ctx.beginPath(); ctx.arc(p.x,p.y,r,0,Math.PI*2); ctx.fill();
    }
    ctx.globalCompositeOperation = 'source-over';

    if (particles.length > MAX) particles.splice(0, particles.length - MAX);
    requestAnimationFrame(loop);
  }
  loop();
})();

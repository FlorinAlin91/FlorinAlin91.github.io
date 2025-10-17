// === PHOENIX FLAMES — REAL FIRE BACKGROUND ===
// Autor: MSS setup – fără librării, performant pe desktop & mobil
(() => {
  const canvas = document.getElementById('flames-bg');
  if (!canvas) return;
  const ctx = canvas.getContext('2d', { alpha: true });

  // ---------- CONTROL PANEL (poți crește/scădea după gust) ----------
  const CFG = {
    COUNT: 900,          // număr particule (800–1400); mai mult = mai plin
    BASE_Y: 0.86,        // unde „ia foc” (procent din înălțimea secțiunii)
    SPREAD: 0.32,        // lățimea „vetrei” (0.2–0.45)
    SPEED_Y: [1.0, 2.6], // viteză verticală (px/frame) – mai mare = foc mai rapid
    WIND: 0.45,          // „vânt” lateral (0.2–0.7)
    SWIRL: 0.55,         // turbulență/rotire (0.3–0.8)
    SIZE: [10, 42],      // mărime particule (px)
    GLOW: 1.0,           // 0.8–1.4 – luminozitate
    BLUE_EDGE: 0.22,     // 0–0.4 – muchie albastră (fierbinte) – pune 0 dacă nu vrei
  };

  // ---------- sizing ----------
  const DPR = Math.min(window.devicePixelRatio || 1, 2);
  let W = 0, H = 0;
  function sizeToSection() {
    const sec = canvas.closest('.ms-hero') || document.body;
    const r = sec.getBoundingClientRect();
    W = Math.max(1, r.width);
    H = Math.max(1, r.height || window.innerHeight * 0.75);
    canvas.width  = Math.round(W * DPR);
    canvas.height = Math.round(H * DPR);
    ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
  }
  sizeToSection();
  addEventListener('resize', sizeToSection, { passive: true });

  // ---------- mic „noise” rapid (fără librării) ----------
  function n2(x, y, t) {
    // câmp pseudo-noise: combinații de sin/cos ca să curgă organic
    return Math.sin(x * 0.002 + t * 0.9) * Math.cos(y * 0.0027 - t * 0.7);
  }
  function curl(x, y, t) {
    // direcție rotativă (curl noise simplificat)
    const e = 1.3;
    const nx1 = n2(x + e, y, t) - n2(x - e, y, t);
    const ny1 = n2(x, y + e, t) - n2(x, y - e, t);
    return { x: ny1, y: -nx1 };
  }

  // ---------- particule ----------
  const P = [];
  function spawnOne() {
    const bx = W * 0.5;
    const by = H * CFG.BASE_Y;
    const x = bx + (Math.random() - 0.5) * W * CFG.SPREAD * 2;
    const y = by + Math.random() * 40;
    const vy = -rand(CFG.SPEED_Y[0], CFG.SPEED_Y[1]);
    const vx = (Math.random() - 0.5) * CFG.WIND;
    const r  = rand(CFG.SIZE[0], CFG.SIZE[1]);
    const life = 0;
    const max  = rand(70, 140);
    return { x, y, vx, vy, r, life, max };
  }
  function rand(a, b) { return a + Math.random() * (b - a); }

  for (let i = 0; i < CFG.COUNT; i++) P.push(spawnOne());

  // ---------- colorare foc (auriu → galben → roșu + muchie albastră) ----------
  function fillFireGradient(x, y, r, k) {
    // k = viață normalizată 0..1
    const a = (1 - k) * 0.18 * CFG.GLOW; // alfa scade spre final
    const g = ctx.createRadialGradient(x, y, 0, x, y, r);
    // miez: galben/auriu
    g.addColorStop(0.00, rgba(255, 220, 80, ${a * 1.1}));
    g.addColorStop(0.25, rgba(255, 180, 60, ${a}));
    // corp: portocaliu/roșu
    g.addColorStop(0.55, rgba(255, 120, 40, ${a * 0.85}));
    // muchie albastră fierbinte (opțional)
    if (CFG.BLUE_EDGE > 0) {
      g.addColorStop(0.78, rgba(60, 140, 255, ${a * CFG.BLUE_EDGE}));
    }
    g.addColorStop(1.00, rgba(0, 0, 0, 0));
    return g;
  }

  // ---------- animație ----------
  let t = 0;
  function frame() {
    t += 0.016;
    // fundal subtil foarte închis (nu-l facem complet negru)
    ctx.globalCompositeOperation = 'source-over';
    const bg = ctx.createLinearGradient(0, H, 0, 0);
    bg.addColorStop(0, '#050607');
    bg.addColorStop(1, '#0b0f16');
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, W, H);

    // desenăm flăcările în aditiv
    ctx.globalCompositeOperation = 'lighter';

    for (let i = P.length - 1; i >= 0; i--) {
      const p = P[i];
      p.life += 1;

      // curl + vânt
      const c = curl(p.x * 0.6, p.y * 0.6, t);
      p.vx += c.x * 0.02 * CFG.SWIRL;
      const swirlUp = c.y * 0.02 * CFG.SWIRL;
      p.x += p.vx + Math.sin((p.y + t * 100) * 0.005) * 0.3;
      p.y += p.vy + swirlUp;

      // dimensiune care „respiră” puțin
      const k = p.life / p.max;
      const rr = p.r * (1 + k * 0.8);
      ctx.fillStyle = fillFireGradient(p.x, p.y, rr, k);
      ctx.beginPath();
      ctx.arc(p.x, p.y, rr, 0, Math.PI * 2);
      ctx.fill();

      // re-spawn
      if (p.life > p.max || p.y + p.r < -40 || p.x < -200 || p.x > W + 200) {
        P[i] = spawnOne();
      }
    }

    requestAnimationFrame(frame);
  }
  frame();
})();

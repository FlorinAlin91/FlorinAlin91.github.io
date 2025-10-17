// === Mihaila Smart Solutions — Gold Phoenix Flames Background ===
// Autor: ChatGPT (optimizat pentru fundal elegant și performant)

(() => {
  const canvas = document.getElementById('flames-bg');
  if (!canvas) return;
  const ctx = canvas.getContext('2d', { alpha: true });

  const DPR = Math.min(window.devicePixelRatio || 1, 2);
  let W = 0, H = 0;

  function resize() {
    const section = canvas.closest('.ms-hero') || document.body;
    const rect = section.getBoundingClientRect();
    W = rect.width;
    H = rect.height || window.innerHeight * 0.8;
    canvas.width = W * DPR;
    canvas.height = H * DPR;
    ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
  }

  window.addEventListener('resize', resize);
  resize();

  // Particulele de flacără
  const particles = [];
  const COUNT = 700;
  const COLORS = [
    'rgba(255, 200, 60, 0.25)',
    'rgba(255, 150, 30, 0.18)',
    'rgba(255, 230, 100, 0.20)',
    'rgba(255, 170, 50, 0.22)'
  ];

  for (let i = 0; i < COUNT; i++) {
    particles.push({
      x: Math.random() * W,
      y: H * (0.8 + Math.random() * 0.2),
      r: 10 + Math.random() * 40,
      vx: (Math.random() - 0.5) * 0.3,
      vy: -0.6 - Math.random() * 1.5,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      life: Math.random() * 100
    });
  }

  function animate() {
    ctx.clearRect(0, 0, W, H);

    // Fundal subtil, ușor gradient negru–auriu
    const grad = ctx.createLinearGradient(0, H, 0, 0);
    grad.addColorStop(0, '#090909');
    grad.addColorStop(1, '#14100c');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, W, H);

    // Particule de flăcări
    for (let p of particles) {
      p.x += p.vx + Math.sin(p.life * 0.03) * 0.3;
      p.y += p.vy;
      p.life += 1;

      const fade = 1 - Math.abs(Math.sin(p.life * 0.02));
      const size = p.r * fade * 1.2;

      const radial = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, size);
      radial.addColorStop(0, 'rgba(255, 200, 90, 0.4)');
      radial.addColorStop(0.3, p.color);
      radial.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = radial;
      ctx.beginPath();
      ctx.arc(p.x, p.y, size, 0, Math.PI * 2);
      ctx.fill();

      // reset particle
      if (p.y < -50 || p.x < -50 || p.x > W + 50) {
        p.x = Math.random() * W;
        p.y = H * (0.9 + Math.random() * 0.2);
        p.life = 0;
      }
    }

    requestAnimationFrame(animate);
  }

  animate();
})();

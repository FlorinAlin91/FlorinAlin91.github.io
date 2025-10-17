// === FLACĂRI AURII PE TOT FUNDALUL ===
const canvas = document.getElementById('flames-bg');
if (canvas) {
  const ctx = canvas.getContext('2d', { alpha: true });

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  const flames = [];
  const flameCount = 80;

  for (let i = 0; i < flameCount; i++) {
    flames.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 250 + 150,
      alpha: Math.random() * 0.2 + 0.1,
      speedY: Math.random() * 0.4 + 0.2,
      speedX: (Math.random() - 0.5) * 0.3,
      hue: 42 + Math.random() * 10
    });
  }

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    flames.forEach(f => {
      const gradient = ctx.createRadialGradient(f.x, f.y, 0, f.x, f.y, f.r);
      gradient.addColorStop(0, hsla(${f.hue}, 100%, 65%, ${f.alpha}));
      gradient.addColorStop(0.5, hsla(${f.hue}, 100%, 45%, ${f.alpha * 0.6}));
      gradient.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(f.x, f.y, f.r, 0, Math.PI * 2);
      ctx.fill();

      f.y -= f.speedY;
      f.x += f.speedX;
      if (f.y + f.r < 0) {
        f.y = canvas.height + f.r;
        f.x = Math.random() * canvas.width;
      }
    });
    requestAnimationFrame(animate);
  }

  animate();
}

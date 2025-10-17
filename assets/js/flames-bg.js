// === FLACARI AURII ELEGANTE PE TOT FUNDALUL ===
const canvas = document.getElementById('flames-bg');
if (canvas) {
  const ctx = canvas.getContext('2d', { alpha: true });

  const resize = () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  };
  resize();
  window.addEventListener('resize', resize);

  const flames = [];
  const count = 70;

  for (let i = 0; i < count; i++) {
    flames.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 250 + 120,
      a: Math.random() * 0.15 + 0.05,
      speedY: Math.random() * 0.3 + 0.1,
      speedX: (Math.random() - 0.5) * 0.1,
      hue: 45 + Math.random() * 15 // nuanță aurie
    });
  }

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    flames.forEach(f => {
      const grad = ctx.createRadialGradient(f.x, f.y, 0, f.x, f.y, f.r);
      grad.addColorStop(0, hsla(${f.hue}, 100%, 60%, ${f.a}));
      grad.addColorStop(0.5, hsla(${f.hue}, 100%, 40%, ${f.a * 0.6}));
      grad.addColorStop(1, rgba(0,0,0,0));

      ctx.fillStyle = grad;
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

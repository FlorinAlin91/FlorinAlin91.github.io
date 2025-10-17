// ===== FLĂCĂRI MIHAILA SMART SOLUTIONS =====
const canvas = document.getElementById('flames-bg');
if (canvas) {
  const ctx = canvas.getContext('2d', { alpha: true });
  let particles = [];

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight * 0.75;
  }
  resize();
  window.addEventListener('resize', resize);

  class Flame {
    constructor(x, y, size, speed) {
      this.x = x;
      this.y = y;
      this.size = size;
      this.speed = speed;
      this.alpha = 1;
      this.color = rgba(255, ${150 + Math.random() * 80}, 43, ${this.alpha});
    }
    update() {
      this.y -= this.speed;
      this.size *= 0.98;
      this.alpha -= 0.015;
    }
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = this.color;
      ctx.globalAlpha = this.alpha;
      ctx.fill();
      ctx.globalAlpha = 1;
    }
  }

  function spawnFlames() {
    const x = Math.random() * canvas.width;
    const y = canvas.height - 20;
    const size = Math.random() * 10 + 6;
    const speed = Math.random() * 1.5 + 0.5;
    particles.push(new Flame(x, y, size, speed));
  }

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    spawnFlames();
    particles.forEach((f, i) => {
      f.update();
      f.draw();
      if (f.alpha <= 0 || f.size < 0.5) particles.splice(i, 1);
    });
    requestAnimationFrame(animate);
  }
  animate();
}

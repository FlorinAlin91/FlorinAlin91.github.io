// ===== FLĂCĂRI AURII MIHAILA SMART SOLUTIONS =====
const canvas = document.getElementById('flames-bg');
if (canvas) {
  const ctx = canvas.getContext('2d');
  let particles = [];

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight * 0.75;
  }
  resize();
  window.addEventListener('resize', resize);

  class Light {
    constructor() {
      this.x = Math.random() * canvas.width;
      this.y = canvas.height - Math.random() * 100;
      this.size = Math.random() * 120 + 60;
      this.alpha = Math.random() * 0.3 + 0.1;
      this.speed = Math.random() * 0.3 + 0.1;
    }
    update() {
      this.y -= this.speed;
      if (this.y < -100) this.y = canvas.height + 50;
    }
    draw() {
      const grad = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.size);
      grad.addColorStop(0, rgba(255,191,43,${this.alpha}));
      grad.addColorStop(1, 'transparent');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  for (let i = 0; i < 25; i++) particles.push(new Light());

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(f => { f.update(); f.draw(); });
    requestAnimationFrame(animate);
  }

  animate();
}

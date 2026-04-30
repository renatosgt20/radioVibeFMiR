const canvasPlanetas = document.getElementById("planetas");
const ctxPlanetas = canvasPlanetas.getContext("2d");

canvasPlanetas.width = window.innerWidth;
canvasPlanetas.height = window.innerHeight;

let planetas = [];

const coresPlanetas = ['#4a90e2', '#7b68ee', '#ff6b6b', '#00ced1'];

for(let i = 0; i < 4; i++) {
  planetas.push({
    x: Math.random() * canvasPlanetas.width,
    y: Math.random() * canvasPlanetas.height,
    r: 30 + Math.random() * 50,
    angle: Math.random() * Math.PI * 2,
    rot: Math.random() * 0.02,
    orbitR: 50 + Math.random() * 100,
    color: coresPlanetas[i % coresPlanetas.length],
    ring: Math.random() > 0.5
  });
}

function animarPlanetas() {
  ctxPlanetas.clearRect(0, 0, canvasPlanetas.width, canvasPlanetas.height);

  planetas.forEach(p => {
    // Glow
    const gradient = ctxPlanetas.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r * 1.5);
    gradient.addColorStop(0, p.color);
    gradient.addColorStop(0.6, p.color + '66');
    gradient.addColorStop(1, 'transparent');
    ctxPlanetas.fillStyle = gradient;
    ctxPlanetas.save();
    ctxPlanetas.beginPath();
    ctxPlanetas.arc(p.x, p.y, p.r * 1.5, 0, Math.PI * 2);
    ctxPlanetas.fill();

    // Planeta com sombra suave
    ctxPlanetas.shadowColor = p.color;
    ctxPlanetas.shadowBlur = 20;
    const planetaGradient = ctxPlanetas.createRadialGradient(p.x - p.r * 0.3, p.y - p.r * 0.3, 0, p.x, p.y, p.r);
    planetaGradient.addColorStop(0, p.color + 'ff');
    planetaGradient.addColorStop(0.6, p.color);
    planetaGradient.addColorStop(1, p.color + '40');
    ctxPlanetas.fillStyle = planetaGradient;
    ctxPlanetas.beginPath();
    ctxPlanetas.arc(p.x, p.y, p.r, 0, Math.PI * 2);
    ctxPlanetas.fill();
    ctxPlanetas.shadowBlur = 0;
    ctxPlanetas.restore();

    // Anel
    if (p.ring) {
      ctxPlanetas.strokeStyle = p.color + '40';
      ctxPlanetas.lineWidth = 3;
      ctxPlanetas.beginPath();
      ctxPlanetas.ellipse(p.x, p.y, p.r + 15, 8, p.angle, 0, Math.PI * 2);
      ctxPlanetas.stroke();
    }

    // Rotação órbita sutil
    p.angle += p.rot;
    p.x += Math.cos(p.angle) * 0.3;
    p.y += Math.sin(p.angle) * 0.2;
    if (p.x < 0 || p.x > canvasPlanetas.width) p.x = Math.random() * canvasPlanetas.width;
    if (p.y < 0 || p.y > canvasPlanetas.height) p.y = Math.random() * canvasPlanetas.height;
  });

  requestAnimationFrame(animarPlanetas);
}

animarPlanetas();

window.addEventListener('resize', () => {
  canvasPlanetas.width = window.innerWidth;
  canvasPlanetas.height = window.innerHeight;
});

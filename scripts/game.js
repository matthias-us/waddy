// scripts/game.js

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

window.addEventListener('resize', () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
});

let ball = {
  x: canvas.width / 2,
  y: canvas.height / 2,
  vx: 0,
  vy: 0,
  radius: 15,
  friction: 0.98,
};

let gravity = { x: 0, y: 0 };

window.addEventListener('deviceorientation', event => {
  gravity.x = event.gamma / 90;
  gravity.y = event.beta / 90;
});

function requestOrientationPermission() {
  if (typeof DeviceOrientationEvent.requestPermission === 'function') {
    DeviceOrientationEvent.requestPermission().then(response => {
      if (response !== 'granted') alert('Device orientation not granted.');
    }).catch(console.error);
  }
}

document.body.addEventListener('click', requestOrientationPermission, { once: true });

const terrainScale = 0.005;
function getTerrainHeight(x, y) {
  return Perlin.noise(x * terrainScale, y * terrainScale, 0) * 100;
}

function getTerrainGradient(x, y) {
  const delta = 1;
  const hX1 = getTerrainHeight(x + delta, y);
  const hX2 = getTerrainHeight(x - delta, y);
  const hY1 = getTerrainHeight(x, y + delta);
  const hY2 = getTerrainHeight(x, y - delta);
  return {
    x: (hX1 - hX2) / (2 * delta),
    y: (hY1 - hY2) / (2 * delta)
  };
}

function updatePhysics() {
  const slope = getTerrainGradient(ball.x, ball.y);
  ball.vx += gravity.x * 0.4 - slope.x * 0.05;
  ball.vy += gravity.y * 0.4 - slope.y * 0.05;
  ball.vx *= ball.friction;
  ball.vy *= ball.friction;
  ball.x += ball.vx;
  ball.y += ball.vy;
  ball.x = Math.min(Math.max(ball.radius, ball.x), canvas.width - ball.radius);
  ball.y = Math.min(Math.max(ball.radius, ball.y), canvas.height - ball.radius);
}

function drawTerrain() {
  const step = 20;
  for (let x = 0; x < canvas.width; x += step) {
    for (let y = 0; y < canvas.height; y += step) {
      const gradient = getTerrainGradient(x, y);
      const shading = gradient.x + gradient.y;
      const shade = Math.floor(128 + shading * 5);
      ctx.fillStyle = `rgb(${shade}, ${shade}, ${shade})`;
      ctx.fillRect(x, y, step, step);
    }
  }
}

function drawBall() {
  ctx.fillStyle = '#3b82f6';
  ctx.beginPath();
  ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
  ctx.fill();
}

function gameLoop() {
  updatePhysics();
  drawTerrain();
  drawBall();
  requestAnimationFrame(gameLoop);
}

gameLoop();

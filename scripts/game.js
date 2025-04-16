// scripts/game.js

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

window.addEventListener('resize', () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
});

let targets = [];
let holes = [];

let ball = {
  x: canvas.width / 2,
  y: canvas.height / 2,
  vx: 0,
  vy: 0,
  radius: 15,
  friction: 0.98,
};

let gravity = { x: 0, y: 0 };

document.body.addEventListener('click', requestOrientationPermission, { once: true });

function resetLevel() {
  ball.x = canvas.width / 2;
  ball.y = canvas.height / 2;
  ball.vx = 0;
  ball.vy = 0;

  targets = [];
  holes = [];

  // Add 3 random targets
  for (let i = 0; i < 3; i++) {
    targets.push({
      x: Math.random() * (canvas.width - 40) + 20,
      y: Math.random() * (canvas.height - 40) + 20,
      radius: 15
    });
  }

  // Add 1-2 random holes
  const numHoles = 1 + Math.floor(Math.random() * 2);
  for (let i = 0; i < numHoles; i++) {
    holes.push({
      x: Math.random() * (canvas.width - 60) + 30,
      y: Math.random() * (canvas.height - 60) + 30,
      radius: 25
    });
  }
}


function checkCollisions() {
  // Filter out targets that are collected
  targets = targets.filter(target => {
    const dx = ball.x - target.x;
    const dy = ball.y - target.y;
    return Math.hypot(dx, dy) > ball.radius + target.radius;
  });

  // Check for falling into a hole
  for (let hole of holes) {
    const dx = ball.x - hole.x;
    const dy = ball.y - hole.y;
    if (Math.hypot(dx, dy) < ball.radius + hole.radius) {
      alert('You fell into a hole! Try again.');
      resetLevel();
      return;
    }
  }

  if (targets.length === 0) {
    alert('Level completed!');
    resetLevel();
  }
}


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
      const light = { x: -1, y: -1 };
      const lightMag = Math.sqrt(light.x**2 + light.y**2);
      const gradMag = Math.sqrt(gradient.x**2 + gradient.y**2);
      const dot = (gradient.x * light.x + gradient.y * light.y) / (lightMag * gradMag + 1e-6);
      const shade = Math.floor(200 + dot * 55); // high contrast from directional light
      ctx.fillStyle = `rgb(${shade}, ${shade}, ${shade})`;
      ctx.fillRect(x, y, step, step);
    }
  }
}

function drawTargets() {
  ctx.fillStyle = '#22c55e';
  targets.forEach(t => {
    ctx.beginPath();
    ctx.arc(t.x, t.y, t.radius, 0, Math.PI * 2);
    ctx.fill();
  });
}

function drawHoles() {
  ctx.fillStyle = '#000';
  holes.forEach(h => {
    ctx.beginPath();
    ctx.arc(h.x, h.y, h.radius, 0, Math.PI * 2);
    ctx.fill();
  });
}

function drawBall() {
  ctx.fillStyle = '#3b82f6';
  ctx.beginPath();
  ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
  ctx.fill();
}

function gameLoop() {
  console.log('Game loop running');
  updatePhysics();
  checkCollisions();
  drawTerrain();
  drawTargets();
  drawHoles();
  drawBall();
  requestAnimationFrame(gameLoop);
}

resetLevel();
gameLoop();

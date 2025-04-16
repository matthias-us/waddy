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

function handleOrientation(event) {
  gravity.x = event.gamma / 90;
  gravity.y = event.beta / 90;
}

function requestOrientationPermission() {
  if (typeof DeviceOrientationEvent.requestPermission === 'function') {
    DeviceOrientationEvent.requestPermission().then(response => {
      if (response === 'granted') {
        window.addEventListener('deviceorientation', handleOrientation);
      } else {
        alert('Device orientation permission denied.');
      }
    }).catch(console.error);
  } else {
    window.addEventListener('deviceorientation', handleOrientation);
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

const light = { x: -1, y: -1 };
const lightMag = Math.sqrt(light.x**2 + light.y**2);
const gradMag = Math.sqrt(gradient.x**2 + gradient.y**2);
const dot = (gradient.x * light.x + gradient.y * light.y) / (lightMag * gradMag + 1e-6);
const shade = Math.floor(200 + dot * 55); // high contrast from directional light
ctx.fillStyle = `rgb(${shade}, ${shade}, ${shade})`;

function drawTerrain() {
  const step = 20;
  for (let x = 0; x < canvas.width; x += step) {
    for (let y = 0; y < canvas.height; y += step) {
      const gradient = getTerrainGradient(x, y);
      const shading = gradient.x + gradient.y;
      const shade = Math.floor(128 + shading * 10);
      ctx.fillStyle = `rgb(${shade}, ${shade}, ${shade})`;
      ctx.fillRect(x, y, step, step);
    }
  }
}

let targets = [
  { x: canvas.width * 0.25, y: canvas.height * 0.3, radius: 15 },
  { x: canvas.width * 0.75, y: canvas.height * 0.7, radius: 15 }
];

let holes = [
  { x: canvas.width * 0.5, y: canvas.height * 0.5, radius: 25 }
];

function drawTargets() {
  ctx.fillStyle = '#22c55e'; // green
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
  drawTerrain();
  drawTargets();
  drawHoles();
  drawBall();
  requestAnimationFrame(gameLoop);
}

gameLoop();

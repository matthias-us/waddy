// Canvas setup
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

window.addEventListener('resize', () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
});

// Ball properties
let ball = {
  x: canvas.width / 2,
  y: canvas.height / 2,
  vx: 0,
  vy: 0,
  radius: 20,
  friction: 0.98,
};

// Initial level targets and holes
let targets = [
  { x: canvas.width * 0.25, y: canvas.height * 0.25, radius: 15 },
  { x: canvas.width * 0.75, y: canvas.height * 0.75, radius: 15 },
];

let holes = [
  { x: canvas.width * 0.5, y: canvas.height * 0.5, radius: 25 },
];

// Gravity data from device orientation
let gravity = { x: 0, y: 0 };

// Device orientation handler
function handleOrientation(event) {
  gravity.x = event.gamma / 90; // range [-1,1]
  gravity.y = event.beta / 90;  // range [-2,2], but typically [-1,1] is sufficient
}

// Request device orientation permission (iOS specific)
function requestOrientationPermission() {
  if (typeof DeviceOrientationEvent.requestPermission === 'function') {
    DeviceOrientationEvent.requestPermission()
      .then(response => {
        if (response === 'granted') {
          window.addEventListener('deviceorientation', handleOrientation);
        } else {
          alert('Permission not granted for device orientation.');
        }
      })
      .catch(console.error);
  } else {
    window.addEventListener('deviceorientation', handleOrientation);
  }
}

// Physics update
function updatePhysics() {
  ball.vx += gravity.x * 0.5;
  ball.vy += gravity.y * 0.5;

  ball.vx *= ball.friction;
  ball.vy *= ball.friction;

  ball.x += ball.vx;
  ball.y += ball.vy;

  // Collision with screen edges
  if (ball.x < ball.radius || ball.x > canvas.width - ball.radius) ball.vx *= -0.7;
  if (ball.y < ball.radius || ball.y > canvas.height - ball.radius) ball.vy *= -0.7;

  ball.x = Math.min(Math.max(ball.radius, ball.x), canvas.width - ball.radius);
  ball.y = Math.min(Math.max(ball.radius, ball.y), canvas.height - ball.radius);
}

// Collision checking
function checkCollisions() {
  targets = targets.filter(target => {
    const dist = Math.hypot(ball.x - target.x, ball.y - target.y);
    return dist > ball.radius + target.radius;
  });

  holes.forEach(hole => {
    const dist = Math.hypot(ball.x - hole.x, ball.y - hole.y);
    if (dist < ball.radius + hole.radius) {
      alert('You fell into a hole! Game reset.');
      resetLevel();
    }
  });

  if (targets.length === 0) {
    alert('Level completed! Starting new level.');
    resetLevel();
  }
}

// Drawing
function drawGame() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Ball
  ctx.fillStyle = '#3b82f6';
  ctx.beginPath();
  ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
  ctx.fill();

  // Targets
  ctx.fillStyle = '#22c55e';
  targets.forEach(target => {
    ctx.beginPath();
    ctx.arc(target.x, target.y, target.radius, 0, Math.PI * 2);
    ctx.fill();
  });

  // Holes
  ctx.fillStyle = '#000';
  holes.forEach(hole => {
    ctx.beginPath();
    ctx.arc(hole.x, hole.y, hole.radius, 0, Math.PI * 2);
    ctx.fill();
  });
}

// Game loop
function gameLoop() {
  updatePhysics();
  checkCollisions();
  drawGame();
  requestAnimationFrame(gameLoop);
}

// Reset level
function resetLevel() {
  ball.x = canvas.width / 2;
  ball.y = canvas.height / 2;
  ball.vx = 0;
  ball.vy = 0;

  // Reset targets and holes positions dynamically (simple example)
  targets = [
    { x: Math.random() * (canvas.width - 40) + 20, y: Math.random() * (canvas.height - 40) + 20, radius: 15 },
    { x: Math.random() * (canvas.width - 40) + 20, y: Math.random() * (canvas.height - 40) + 20, radius: 15 },
  ];

  holes = [
    { x: Math.random() * (canvas.width - 40) + 20, y: Math.random() * (canvas.height - 40) + 20, radius: 25 },
  ];
}

// Start game after user interaction (required by Safari/iOS)
function initializeGame() {
  requestOrientationPermission();
  resetLevel();
  gameLoop();
}

// Tap screen to start the game (iOS Safari requirement)
document.body.addEventListener('click', initializeGame, { once: true });
document.body.addEventListener('touchstart', initializeGame, { once: true });

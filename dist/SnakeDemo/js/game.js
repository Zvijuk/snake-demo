/**
 * Coinis Snake Demo - Redesign
 * 100% Client-side, Vanilla JS
 */

const CONFIG = {
    // Game Play
    gridSize: 30, // Smaller grid for cleaner look on large screens
    speed: 90,    // Slightly faster feel

    // Mechanics
    softResetInterval: 10 * 60 * 1000,
    restartDelay: 2500,

    // Display
    // We don't use a solid bg anymore, we clearRect
    snakeColor: '#00bcd4', // Cyan
    snakeGlow: 'rgba(0, 188, 212, 0.4)',
    foodColor: '#ff4081',  // Pink/Magenta accent
    foodGlow: 'rgba(255, 64, 129, 0.5)',

    // Demo Messages
    demoMsgInterval: 30000,
    demoMsgDuration: 6000,
    messages: [
        "COINIS IT • Building innovative solutions",
        "UniFi Access • Seamless security integration",
        "Automation • Streamlining complex workflows",
        "Data Analytics • Real-time insights",
        "Infrastructure • Scalable & resilient"
    ]
};

// Globals
const wrapper = document.getElementById('game-wrapper');
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreEl = document.getElementById('score-val');
const clockEl = document.getElementById('clock');
const msgContainer = document.getElementById('demo-message-container');
const msgText = document.getElementById('demo-message-text');

let cols, rows;
let snake = [];
let dir = { x: 1, y: 0 };
let food = null;
let score = 0;
let isGameOver = false;

// Timers
let lastTime = 0;
let accumulator = 0;
let currentMsgIndex = 0;
let pulseFrame = 0;

function init() {
    resize();
    window.addEventListener('resize', resize);

    // Soft Reset
    setTimeout(() => window.location.reload(), CONFIG.softResetInterval);

    // Overlays
    startClock();
    startDemoMessages();

    resetGame();
    requestAnimationFrame(loop);
}

function resize() {
    // Fit canvas to the wrapper provided by CSS
    const rect = wrapper.getBoundingClientRect();

    // Make canvas logical size match visual size for sharpness
    // (Could handle DPR here for 4K sharpness, but standard 1:1 is usually performant enough for signage)
    canvas.width = rect.width;
    canvas.height = rect.height;

    cols = Math.floor(canvas.width / CONFIG.gridSize);
    rows = Math.floor(canvas.height / CONFIG.gridSize);

    // Clamp food/snake if resized
    if (food) clampToGrid(food);
}

function clampToGrid(pos) {
    if (pos.x >= cols) pos.x = cols - 1;
    if (pos.y >= rows) pos.y = rows - 1;
}

function resetGame() {
    isGameOver = false;
    score = 0;
    updateScore();

    const startX = Math.floor(cols / 2);
    const startY = Math.floor(rows / 2);
    snake = [
        { x: startX, y: startY },
        { x: startX - 1, y: startY },
        { x: startX - 2, y: startY },
        { x: startX - 3, y: startY }
    ];
    dir = { x: 1, y: 0 };
    spawnFood();
}

function loop(timestamp) {
    if (!lastTime) lastTime = timestamp;
    const deltaTime = timestamp - lastTime;
    lastTime = timestamp;

    if (!isGameOver) {
        accumulator += deltaTime;
        if (accumulator >= CONFIG.speed) {
            update();
            accumulator -= CONFIG.speed;
        }
    }

    draw(); // Draw every frame for smooth animations (pulse)
    pulseFrame += 0.05;

    if (isGameOver) {
        // Stop updating but keep drawing dead state? 
        // Actually we auto-restart.
    }

    if (!isGameOver || (isGameOver && deltaTime < CONFIG.restartDelay)) {
        requestAnimationFrame(loop);
    }
}

// AI Logic (Same as before)
function determineMove() {
    const head = snake[0];
    const dx = food.x - head.x;
    const dy = food.y - head.y;

    let preferredMoves = [];
    if (dx > 0) preferredMoves.push({ x: 1, y: 0 });
    else if (dx < 0) preferredMoves.push({ x: -1, y: 0 });
    if (dy > 0) preferredMoves.push({ x: 0, y: 1 });
    else if (dy < 0) preferredMoves.push({ x: 0, y: -1 });

    for (let move of preferredMoves) if (isValidMove(move)) return move;

    const allMoves = [{ x: 0, y: -1 }, { x: 0, y: 1 }, { x: -1, y: 0 }, { x: 1, y: 0 }];
    for (let move of allMoves) if (isValidMove(move)) return move;

    return dir;
}

function isValidMove(move) {
    if (move.x === -dir.x && move.y === -dir.y) return false;
    const targetX = snake[0].x + move.x;
    const targetY = snake[0].y + move.y;

    if (targetX < 0 || targetX >= cols || targetY < 0 || targetY >= rows) return false;
    for (let i = 0; i < snake.length - 1; i++) {
        if (targetX === snake[i].x && targetY === snake[i].y) return false;
    }
    return true;
}

function update() {
    const nextMove = determineMove();
    if (nextMove) dir = nextMove;

    const head = { x: snake[0].x + dir.x, y: snake[0].y + dir.y };

    // Collision
    if (head.x < 0 || head.x >= cols || head.y < 0 || head.y >= rows || isSnake(head.x, head.y)) {
        isGameOver = true;
        setTimeout(() => {
            resetGame();
            requestAnimationFrame(loop);
        }, CONFIG.restartDelay);
        return;
    }

    snake.unshift(head);
    if (head.x === food.x && head.y === food.y) {
        score++;
        updateScore();
        spawnFood();
    } else {
        snake.pop();
    }
}

function isSnake(x, y) {
    for (let p of snake) if (p.x === x && p.y === y) return true;
    return false;
}

function draw() {
    // Clear logic for Glass:
    // We actually want a fully transparent canvas to let the glass BG show through.
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const gs = CONFIG.gridSize;
    const gap = 2;
    const size = gs - gap;

    // Draw Snake
    ctx.shadowBlur = 15;
    ctx.shadowColor = CONFIG.snakeGlow;
    ctx.fillStyle = CONFIG.snakeColor;

    for (let i = 0; i < snake.length; i++) {
        const x = snake[i].x * gs + gap / 2;
        const y = snake[i].y * gs + gap / 2;

        // Head different style? slightly
        if (i === 0) {
            ctx.shadowBlur = 20;
            ctx.fillStyle = '#4dd0e1'; // Brighter cyan
        } else {
            ctx.shadowBlur = 10;
            ctx.fillStyle = CONFIG.snakeColor;
        }

        roundedRect(ctx, x, y, size, size, 6);
    }

    // Draw Food
    if (food) {
        const fx = food.x * gs + gs / 2;
        const fy = food.y * gs + gs / 2;
        const baseRadius = size / 2.5;
        // Pulse effect
        const pulse = Math.sin(pulseFrame) * 2;

        ctx.shadowBlur = 20;
        ctx.shadowColor = CONFIG.foodGlow;
        ctx.fillStyle = CONFIG.foodColor;

        ctx.beginPath();
        ctx.arc(fx, fy, baseRadius + pulse, 0, Math.PI * 2);
        ctx.fill();
    }

    // Reset shadow for next frame transparency
    ctx.shadowBlur = 0;
}

function roundedRect(ctx, x, y, width, height, radius) {
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + width - radius, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
    ctx.lineTo(x + width, y + height - radius);
    ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
    ctx.lineTo(x + radius, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
    ctx.lineTo(x, y + radius);
    ctx.quadraticCurveTo(x, y, x + radius, y);
    ctx.closePath();
    ctx.fill();
}

function spawnFood() {
    let valid = false;
    while (!valid) {
        const x = Math.floor(Math.random() * cols);
        const y = Math.floor(Math.random() * rows);
        if (!isSnake(x, y)) {
            food = { x, y };
            valid = true;
        }
    }
}

function updateScore() {
    scoreEl.innerText = score;
}

function startClock() {
    function tick() {
        const d = new Date();
        clockEl.innerText = `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
    }
    tick();
    setInterval(tick, 1000);
}

function startDemoMessages() {
    function cycle() {
        msgText.innerText = CONFIG.messages[currentMsgIndex];
        msgContainer.classList.remove('fade-out');
        msgContainer.classList.add('fade-in');

        setTimeout(() => {
            msgContainer.classList.remove('fade-in');
            msgContainer.classList.add('fade-out');
        }, CONFIG.demoMsgDuration);

        currentMsgIndex = (currentMsgIndex + 1) % CONFIG.messages.length;
    }
    setTimeout(cycle, 2000);
    setInterval(cycle, CONFIG.demoMsgInterval);
}

window.onload = init;

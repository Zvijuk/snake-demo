/**
 * Coinis Snake Demo - Logo Draw Mode
 * 100% Client-side, Vanilla JS
 */

const CONFIG = {
    // Game Play
    gridSize: 30,
    speed: 60, // Faster for drawing

    // Mechanics
    softResetInterval: 10 * 60 * 1000, // 10 minutes
    restartDelay: 2500,

    // Coinis Reveal / Draw Mode
    targetLength: 9999, // Ignored in Draw Mode (length determind by path)
    revealWord: "COINIS", // Text to show
    revealDuration: 3000,

    // Display
    snakeColor: '#00bcd4', // Cyan
    snakeGlow: 'rgba(0, 188, 212, 0.4)',
    foodColor: '#ff4081',
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
const revealOverlay = document.getElementById('overlay-reveal');
const revealWordEl = document.getElementById('reveal-word');

let cols, rows;
let snake = [];
let food = null;
let score = 0;
let isGameOver = false; // "Dead" or "Finished" state

// Draw Mode State
let drawPath = [];
let pathIndex = 0;

// Timers
let lastTime = 0;
let accumulator = 0;
let currentMsgIndex = 0;
let pulseFrame = 0;

function init() {
    resize();
    window.addEventListener('resize', resize);

    // Soft Reset
    if (CONFIG.softResetInterval) {
        setTimeout(() => window.location.reload(), CONFIG.softResetInterval);
    }

    // Overlays
    startClock();
    startDemoMessages();

    resetGame();
    requestAnimationFrame(loop);
}

function resize() {
    const rect = wrapper.getBoundingClientRect();
    canvas.width = rect.width;
    canvas.height = rect.height;

    cols = Math.floor(canvas.width / CONFIG.gridSize);
    rows = Math.floor(canvas.height / CONFIG.gridSize);
}

function resetGame() {
    isGameOver = false;
    score = 0;
    updateScore();
    pathIndex = 0;

    // Hide reveal
    if (revealOverlay) {
        revealOverlay.classList.remove('active');
        revealOverlay.classList.add('fade-out');
    }

    // Generate Path (Centered)
    if (typeof PATHS !== 'undefined') {
        drawPath = PATHS.getHardcodedCoinis();
    } else {
        // Fallback simple line
        drawPath = [{ x: 10, y: 10 }, { x: 11, y: 10 }, { x: 12, y: 10 }];
    }

    // Center the path
    const pathMinX = 2; const pathMaxX = 28;
    const pathMinY = 10; const pathMaxY = 18;
    const pWidth = pathMaxX - pathMinX;
    const pHeight = pathMaxY - pathMinY;

    const offsetX = Math.floor((cols - pWidth) / 2) - pathMinX;
    const offsetY = Math.floor((rows - pHeight) / 2) - pathMinY;

    drawPath = drawPath.map(p => ({
        x: p.x + offsetX,
        y: p.y + offsetY
    }));

    // Init Snake at Start of Path
    if (drawPath.length > 0) {
        snake = [drawPath[0]];
        pathIndex = 0;
        spawnFood();
    } else {
        snake = [{ x: 5, y: 5 }];
    }
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

    draw();
    pulseFrame += 0.05;

    requestAnimationFrame(loop);
}

function update() {
    // Are we done?
    if (pathIndex >= drawPath.length - 1) {
        finishDrawing();
        return;
    }

    // Next point
    const nextPos = drawPath[pathIndex + 1];

    // Move Head
    snake.unshift(nextPos);

    // Check Food & Grow (Always grow in Draw Mode)
    if (food && nextPos.x === food.x && nextPos.y === food.y) {
        score++;
        updateScore();
        pathIndex++;
        spawnFood();
    } else {
        // If we missed food (shouldn't happen with correct spawn), catch up logic
        score++;
        updateScore();
        pathIndex++;
        spawnFood();
    }
}

function finishDrawing() {
    isGameOver = true;

    if (revealOverlay) {
        revealWordEl.innerText = CONFIG.revealWord;
        revealOverlay.classList.remove('fade-out');
        revealOverlay.classList.add('active');
    }

    setTimeout(() => {
        resetGame();
    }, CONFIG.revealDuration);
}

function spawnFood() {
    if (pathIndex + 1 < drawPath.length) {
        food = drawPath[pathIndex + 1];
    } else {
        food = null;
    }
}

function draw() {
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

        if (i === 0) {
            ctx.shadowBlur = 20;
            ctx.fillStyle = '#4dd0e1';
        } else {
            ctx.shadowBlur = 10;
            ctx.fillStyle = CONFIG.snakeColor;
        }

        roundedRect(ctx, x, y, size, size, 4);
    }

    // Draw Food
    if (food) {
        const fx = food.x * gs + gs / 2;
        const fy = food.y * gs + gs / 2;
        const baseRadius = size / 2.5;
        const pulse = Math.sin(pulseFrame) * 2;

        ctx.shadowBlur = 20;
        ctx.shadowColor = CONFIG.foodGlow;
        ctx.fillStyle = CONFIG.foodColor;

        ctx.beginPath();
        ctx.arc(fx, fy, baseRadius + pulse, 0, Math.PI * 2);
        ctx.fill();
    }

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

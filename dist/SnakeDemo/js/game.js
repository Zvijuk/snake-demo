/**
 * Coinis Snake Demo - Logo Draw Mode
 * 100% Client-side, Vanilla JS
 */

const CONFIG = {
    // Game Play
    gridSize: 30,
    speed: 60, // Faster for drawing

    // Coinis Reveal / Draw Mode
    targetLength: 9999, // Ignored in Draw Mode (length determind by path)
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
    setTimeout(() => window.location.reload(), CONFIG.softResetInterval);

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

    // If resizing mid-draw, path might be skewed, but we rely on grid units so should be ok-ish.
    // Ideally we regenerate path on resize, but let's stick to simple reset if needed.
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
    drawPath = PATHS.getHardcodedCoinis();

    // Center the path on the current grid
    // The hardcoded path is approx 0-30 range. We offset it to center.
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
        spawnFood(); // Food at next point
    } else {
        // Fallback
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

    if (isGameOver && deltaTime < 500) { // Just keep loop running
        requestAnimationFrame(loop);
    } else {
        requestAnimationFrame(loop);
    }
}

function update() {
    // Logic: Move Head to next point in path

    // Are we done?
    if (pathIndex >= drawPath.length - 1) {
        finishDrawing();
        return;
    }

    // Next point
    const nextPos = drawPath[pathIndex + 1];

    // Move Head
    snake.unshift(nextPos);

    // Check Food (Visual marker for "Work to do")
    // In this mode, we basically ALWAYS eat?
    // User said: "Each food eaten advances head... increases visible snake length"
    // So visualizes: Head moves to food -> Eats -> Spawns new food at next path -> Tail stays (growing)

    // We assume food is AT nextPos.
    if (nextPos.x === food.x && nextPos.y === food.y) {
        score++;
        updateScore();
        pathIndex++;

        // Spawn next food
        spawnFood();

        // Don't pop -> Grow infinite
    } else {
        // This fails if we just unshifted nextPos but food wasn't there. 
        // But we spawn food at pathIndex+1.
        // So actually, we just moved to food.

        // If we want the snake to ONLY move when it eats:
        // Then the "Speed" is the rate of eating.
        // We technically just did that.

        // Wait, regular snake moves every frame.
        // If we move every frame, we consume the path quickly.
        // We should "Grow" every frame then? 
        // Yes, Drawing Mode = Grow every step.
        pathIndex++;
        score++;
        updateScore();
        // Since we "ate" the path step, we effectively moved. 
        // We need to move the food too to look like we are chasing it?
        spawnFood();
    }

    // No tail popping in Drawing Mode (draws the line)
}

function finishDrawing() {
    isGameOver = true; // Pauses update

    // Show "COINIS" Text Overlay over the drawn shape?
    // Or just look at the shape? 
    // User said: "Completion: Hold completed logo... Optional glow"

    if (revealOverlay) {
        revealWordEl.innerText = ""; // Clear text, maybe show Logo? 
        // Or just use the overlay to flash "DONE"?
        // Better: Just let the snake shape shine.

        // Let's flash the overlay text "COINIS" anyway as reinforcement
        revealWordEl.innerText = CONFIG.revealWord;
        revealOverlay.classList.remove('fade-out');
        revealOverlay.classList.add('active');
    }

    setTimeout(() => {
        resetGame(); // Restart drawing
    }, CONFIG.revealDuration);
}

function spawnFood() {
    // In Draw Mode, Food is simply the NEXT point in the path (or a few steps ahead)
    // To make it look like "Game", let's put food 1 step ahead.
    if (pathIndex + 1 < drawPath.length) {
        food = drawPath[pathIndex + 1];
    } else {
        food = null; // Done
    }
}

function draw() {
    // Clear with transparency
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const gs = CONFIG.gridSize;
    const gap = 2; // Tighter gap for continuous draw look? Or same?
    const size = gs - gap;

    // Draw Snake (The Drawing)
    ctx.shadowBlur = 15;
    ctx.shadowColor = CONFIG.snakeGlow;
    ctx.fillStyle = CONFIG.snakeColor;

    // Optimization: Drawing 1000 rects might be heavy?
    // Standard snake is fine.

    for (let i = 0; i < snake.length; i++) {
        const x = snake[i].x * gs + gap / 2;
        const y = snake[i].y * gs + gap / 2;

        // Head style
        if (i === 0) {
            ctx.shadowBlur = 20;
            ctx.fillStyle = '#4dd0e1';
        } else {
            ctx.shadowBlur = 10;
            ctx.fillStyle = CONFIG.snakeColor;
        }

        roundedRect(ctx, x, y, size, size, 4); // Smaller radius for "Blocky" logo feel?
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

// Helpers
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
    scoreEl.innerText = score; // "Length"
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

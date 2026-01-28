/**
 * Defined paths for the Snake to follow to draw logos.
 * Grid coordinates relative to a ~60x30 grid (1920x1080 / 30px).
 * 
 * We define strokes for letters. The snake will traverse these.
 */

const PATHS = {
    // Generate a centered "COINIS" path
    getLogoPath: function (cols, rows) {
        const path = [];
        // Center offset
        const startX = Math.floor(cols * 0.1);
        const startY = Math.floor(rows * 0.4);

        // Helper to add a stroke
        const addLine = (x1, y1, x2, y2) => {
            // Bresenham-like or simple linear interpolation for grid
            const dx = Math.abs(x2 - x1);
            const dy = Math.abs(y2 - y1);
            const sx = (x1 < x2) ? 1 : -1;
            const sy = (y1 < y2) ? 1 : -1;
            let err = dx - dy;

            let cx = x1;
            let cy = y1;

            while (true) {
                path.push({ x: cx, y: cy });
                if (cx === x2 && cy === y2) break;
                const e2 = 2 * err;
                if (e2 > -dy) { err -= dy; cx += sx; }
                if (e2 < dx) { err += dx; cy += sy; }
            }
        };

        // Letter C
        // Rounded C shape
        let cx = startX;
        let cy = startY;
        // Top arch
        addLine(cx + 4, cy, cx + 1, cy);
        addLine(cx + 1, cy, cx, cy + 1);
        addLine(cx, cy + 1, cx, cy + 5);
        addLine(cx, cy + 5, cx + 1, cy + 6);
        addLine(cx + 1, cy + 6, cx + 4, cy + 6);

        // Gap to O
        cx += 6;

        // Letter O
        addLine(cx + 1, cy, cx + 4, cy);
        addLine(cx + 4, cy, cx + 5, cy + 1);
        addLine(cx + 5, cy + 1, cx + 5, cy + 5);
        addLine(cx + 5, cy + 5, cx + 4, cy + 6);
        addLine(cx + 4, cy + 6, cx + 1, cy + 6);
        addLine(cx + 1, cy + 6, cx, cy + 5);
        addLine(cx, cy + 5, cx, cy + 1);
        addLine(cx, cy + 1, cx + 1, cy);

        // Gap to I
        cx += 7;

        // Letter I
        addLine(cx + 1, cy, cx + 1, cy + 6); // Just a bar

        // Gap to N
        cx += 4;

        // Letter N
        addLine(cx, cy + 6, cx, cy); // Up
        addLine(cx, cy, cx + 4, cy + 6); // Diagonal Down
        addLine(cx + 4, cy + 6, cx + 4, cy); // Up (Drawing logic: snake must be continuous, so we might need to backtrack or jump? 
        // Snake can't jump. It must be a continuous line.
        // For 'N', standard writing lifts pen. Snake must retrace or do a different style.
        // Continuous N: Up -> Diagonal Down -> Up. Correct.

        // Gap to I
        cx += 6;

        // Letter I
        addLine(cx + 1, cy + 6, cx + 1, cy); // Draw Up to be near next start? Or Down?
        // Previous N ended at Top. So I can go Down.
        // Wait, N ended at Top (cx+4, cy). Gap move is virtual.
        // Actually, snake must travel physically between letters.
        // We need connector paths!

        // Let's redefine: we manually push points for a CONTINUOUS line that forms the words.
        // Or we use "Food" to teleport? 
        // User said: "Each 'food eaten' advances the head... Snake body follows the exact path"
        // If we want separate letters, the snake must leave a "trail" that persists, OR the snake itself IS the text.
        // "Snake body becomes the logo shape". 
        // This implies the snake is one long continuous noodle spelling "COINIS".
        // So we need clear connectors that might be hidden or just thin?
        // Or we just style it like cursive / subway map.

        return path;
    },

    // Explicit hardcoded "COINIS" continuous path roughly
    // Assuming grid 64x36 (1920/30, 1080/30)
    getHardcodedCoinis: function () {
        // We will define key points (keyframes) and interpolate lines between them.
        const keys = [
            // C
            { x: 6, y: 10 }, { x: 2, y: 10 }, { x: 2, y: 18 }, { x: 6, y: 18 },
            // Connector to O (bottom level)
            { x: 8, y: 18 },
            // O (Draw counter clockwise to exit at bottom or top?)
            // Let's go: Bottom -> Right -> Top -> Left -> Bottom
            { x: 12, y: 18 }, { x: 12, y: 10 }, { x: 8, y: 10 }, { x: 8, y: 18 },
            // Connector to I
            { x: 14, y: 18 },
            // I (Up)
            { x: 14, y: 10 },
            // Connector to N (Top)
            { x: 16, y: 10 },
            // N (Down, Up-Diag, Down) -> "N" is usually Up, Down-Diag, Up.
            // Let's draw: Down -> Up-Diag -> Down (Reverse N) looks weird.
            // Let's do: Top-Left -> Bottom-Left -> Top-Right -> Bottom-Right
            // But we are at Top-Left (16,10)
            { x: 16, y: 18 }, // Down
            { x: 16, y: 10 }, // Back Up (Double thickness? No, collision off)
            { x: 20, y: 18 }, // Diag
            { x: 20, y: 10 }, // Up
            // Connector to I
            { x: 22, y: 10 },
            // I (Down)
            { x: 22, y: 18 },
            // Connector to S
            { x: 24, y: 18 },
            // S (snake shape!) Right -> Up -> Left -> Up -> Right
            { x: 28, y: 18 }, { x: 28, y: 14 }, { x: 24, y: 14 }, { x: 24, y: 10 }, { x: 28, y: 10 }
        ];

        const fullPath = [];

        // Interpolate
        const addStroke = (p1, p2) => {
            const dx = Math.abs(p2.x - p1.x);
            const dy = Math.abs(p2.y - p1.y);
            const sx = (p1.x < p2.x) ? 1 : -1;
            const sy = (p1.y < p2.y) ? 1 : -1;
            let err = dx - dy;

            let cx = p1.x;
            let cy = p1.y;

            while (!(cx === p2.x && cy === p2.y)) {
                fullPath.push({ x: cx, y: cy });
                const e2 = 2 * err;
                if (e2 > -dy) { err -= dy; cx += sx; }
                if (e2 < dx) { err += dx; cy += sy; }
            }
            fullPath.push(p2); // Ensure end point included
        };

        for (let i = 0; i < keys.length - 1; i++) {
            addStroke(keys[i], keys[i + 1]);
        }

        return fullPath;
    }
};

# MagicINFO Snake Custom App (Draw Mode)

A standalone Tizen Web App for Samsung displays.
**Current Mode**: "Logo Draw" - The snake automatically draws the "COINIS" logo.

## Features
- **Deterministic Drawing**: Follows a predefined coordinate path to spell "COINIS".
- **Continuous Growth**: Snake grows as it moves, forming a persistent line.
- **Auto-Loop**: Draws logo -> Holds for 3s -> Resets.
- **24/7 Stability**: Includes soft reset every 10 mins.

## Configuration
Edit `js/game.js`:

```javascript
const CONFIG = {
    speed: 60,           // Drawing speed (lower = faster)
    snakeColor: '#00bcd4', // Coinis Cyan
    
    // Draw Mode
    revealWord: "COINIS", // Text shown at end
    revealDuration: 3000, 
    
    // ...
};
```

To change the logo path, edit `js/paths.js` and update `getHardcodedCoinis()`.

## Installation (Git)
See `README_GIT.txt`.

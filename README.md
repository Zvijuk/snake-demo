# MagicINFO Snake Custom App

A standalone Tizen Web App designed for Samsung MagicINFO signage. It runs an automated Snake game 24/7 with custom branding and demo messages.

## Features
- **Auto-Player AI**: The snake plays itself indefinitely.
- **24/7 Stability**: Includes a "soft reset" every 10 minutes to clear memory/state.
- **Offline Capable**: No internet connection required.
- **Overlays**:
  - Top-Left: Branding & Score
  - Bottom-Right: Local Clock
  - Bottom-Left: Cycling demo messages

## Deployment (MagicINFO)
1. **Compress**: Zip the contents of `magicinfo-snake` (ensure `config.xml` and `index.html` are at the root of the zip).
   - Name it `SnakeDemo.zip`.
2. **Upload**:
   - Go to MagicINFO Server > Content > New > Web Application > Custom App (Tizen).
   - Upload the `.zip` file.
3. **Schedule**:
   - Create a playlist/schedule and assign the app to your Samsung display.
   - Standard Play Duration: Set to "Continuous" or a long duration (e.g., 24h).

## USB Deployment (Alternative)
1. Create a folder named `SnakeDemo` on a USB drive.
2. Copy all files (`index.html`, `config.xml`, `css/`, `js/`) into that folder.
3. Insert USB into the Samsung Display.
4. Launch the application via the "URL Launcher" or "MagicInfo Player" depending on your model's firmware features, or use the "Install Web App" feature in the Service Menu. (Note: Server deployment is recommended).

## Configuration
Edit `js/game.js` to change settings found at the top of the file:

```javascript
const CONFIG = {
    speed: 100,          // Snake speed (lower = faster)
    snakeColor: '#4CAF50', // Change snake color
    softResetInterval: 10 * 60 * 1000, // Reset timer (10 mins)
    
    // Demo Messages
    messages: [
        "Your Custom Message 1",
        "Your Custom Message 2"
    ]
};
```

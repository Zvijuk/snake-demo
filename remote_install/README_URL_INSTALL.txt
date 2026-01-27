MagicINFO Snake Custom App - URL Installation

If USB installation fails, you can install the app by hosting the files on a web server (local or public) and pointing the TV to it.

FILES NEEDED:
- SnakeDemo.wgt
- sssp_config.xml  (Optional, but good for "folder" updates)

--------------------------------------------------------------------------------
STEP 1: HOST THE FILES
--------------------------------------------------------------------------------
You need a web server accessible by the TV.

OPTION A: Local Laptop (Same WiFi/Network as TV)
1. Install Python (if not installed).
2. Open Terminal/Command Prompt in this "remote_install" folder.
3. Run: python3 -m http.server 8000
   (This hosts the files at http://YOUR_LAPTOP_IP:8000)

OPTION B: Public Web Space
1. Upload "SnakeDemo.wgt" to any web host (your website, AWS S3, GitHub Pages releases, or a tool like ngrok).
2. Get the Direct Link to the .wgt file.

--------------------------------------------------------------------------------
STEP 2: INSTALL ON SAMSUNG TV
--------------------------------------------------------------------------------
1. Turn on the Display.
2. Press [MENU] -> [System] -> [Play via] -> Select "URL Launcher".
3. Press [HOME] -> Go to [URL Launcher].
4. Open [Settings] (top right usually) or select [Install Web App].
5. Enter the URL:
   
   If using Option A (Local Python):
   http://192.168.1.50:8000/SnakeDemo.wgt
   (Replace 192.168.1.50 with your laptop's actual IP address).

   If using Option B (Direct Link):
   http://example.com/SnakeDemo.wgt

6. Press [Done] / [Ok].
7. The TV should download "SnakeDemo.wgt" and install it.

--------------------------------------------------------------------------------
TROUBLESHOOTING
--------------------------------------------------------------------------------
- Ensure the Laptop and TV are on the SAME network.
- Ensure your specific Firewall allows incoming connections to port 8000.
- If the TV asks for "SSSP config", point the URL to the FOLDER instead of the file:
  http://192.168.1.50:8000/

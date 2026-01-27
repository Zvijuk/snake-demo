MagicINFO Snake Demo - Git / GitHub Installation

The repository is configured to: https://github.com/Zvijuk/snake-demo

--------------------------------------------------------------------------------
OPTION 1: INSTALL AS WIDGET (Persistent App)
--------------------------------------------------------------------------------
To "Install" the app into the TV's memory, you must point to the configuration file, not the root folder.

Enter this EXACT URL in "Install Web App":
https://zvijuk.github.io/snake-demo/remote_install/sssp_config.xml

(This tells the TV to look for the widget file in the same folder).

--------------------------------------------------------------------------------
OPTION 2: RUN AS WEB CONTENT (Easiest / Working)
--------------------------------------------------------------------------------
Since you confirmed the link works in the browser, you can just set it as the "Start URL" or use it in a Schedule.

1. Open **URL Launcher** (or MagicInfo Player -> Web).
2. Go to **Settings** -> **URL**.
3. Enter:
   https://zvijuk.github.io/snake-demo/
4. Select **Go** or **Start**.

*Advantage:* Updates are instant (just push to git, refresh TV).
*Disadvantage:* Requires constant internet connection.

--------------------------------------------------------------------------------
TROUBLESHOOTING INSTALLATION
--------------------------------------------------------------------------------
If Option 1 fails with "Download Error" or "File Not Found":
1. Ensure you pushed the "remote_install" folder to GitHub.
   (Check: https://github.com/Zvijuk/snake-demo/tree/main/remote_install)
2. Try pointing directly to the WGT file (some firmwares support this):
   https://zvijuk.github.io/snake-demo/remote_install/SnakeDemo.wgt

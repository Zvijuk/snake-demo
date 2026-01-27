MagicINFO Snake Custom App - USB Installation Fix (QM65C / Tizen 6.5+)

CONTENTS:
1. SnakeDemo/       -> Raw files (Index, config, etc).
2. SnakeDemo.wgt    -> Tizen Web Widget package.
3. SnakeDemo.zip    -> Standard zip archive.

--------------------------------------------------------------------------------
INSTALLATION INSTRUCTIONS FOR QM65C (and newer Samsung Screens)
--------------------------------------------------------------------------------
The "Unable to find installation file" error usually means the TV is looking for a ".wgt" file, not a ".zip".

STEP 1: PREPARE USB
1. Format your USB drive to FAT32 (exFAT usually works, but FAT32 is safer).
2. Copy "SnakeDemo.wgt" directly to the ROOT of the USB drive.
   (Example: E:\SnakeDemo.wgt)
   
   **Tip**: Copy "SnakeDemo.zip" and the "SnakeDemo" folder as well, just in case, but ".wgt" is key.

STEP 2: INSTALL ON TV
1. Insert the USB into the Samsung QM65C.
2. Press [Home] or [Content Home] on the remote.
3. Navigate to [URL Launcher] settings OR [Application] menu?
   
   *CORRECT PATH FOR QM SERIES (Tizen 6.5+):*
   A. Press [Home] -> Go to [Custom App] or [URL Launcher].
   B. Usually there is an "Install Web App" button in the upper right or in the settings of the URL Launcher.
   
   *ALTERNATIVE PATH (Service Menu):*
   A. Press [Menu] -> [System] -> [Play via] -> Select [URL Launcher] (if available).
   B. If using MagicInfo Mode: Go to [MagicInfo Player] -> [Local Schedule] -> Browse USB.
   
   *IF USING "CUSTOM APP" MENU:*
   1. Go to URL Launcher / Custom App.
   2. Select "Install from USB".
   3. It should now detect "SnakeDemo.wgt".

--------------------------------------------------------------------------------
TROUBLESHOOTING
--------------------------------------------------------------------------------
- If it still says "No file found":
  Create a folder named "SSSP" on the USB root, and put "SnakeDemo.wgt" inside it.
  (Path: USB:\SSSP\SnakeDemo.wgt)

- If the App installs but functionality is wrong:
  The display might be in "MagicInfo Mode" vs "Public Display Mode".
  Change in [Menu] -> [System] -> [Play via].

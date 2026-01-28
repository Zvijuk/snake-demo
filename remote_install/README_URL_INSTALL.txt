MagicINFO Snake Custom App - URL Installation (Fix for 404 Error)

The log "GET /SnakeDemo.wgt/sssp_config.xml 404" suggests the TV is treating the file URL as a folder.
This often happens if the URL has a trailing "/" or if the TV strictly requires the XML manifest.

NEW INSTRUCTIONS:

1. Host the "remote_install" folder (Python server is fine)

2. On the TV (URL Launcher), enter the URL pointing to the **XML FILE**, not the .wgt file.

   URL to enter:
   http://192.168.210.138:8000/sssp_config.xml

   (Replace 192.168.210.138 with your actual Laptop IP if different).

WHY?
- The "sssp_config.xml" tells the TV exactly what file to download ("SnakeDemo.wgt").
- This avoids the "is it a file or folder?" confusion.

--------------------------------------------------------------------------------
VERIFY FILE STRUCTURE
--------------------------------------------------------------------------------
Ensure your folder has both files next to each other:
remote_install/
  |-- sssp_config.xml
  |-- SnakeDemo.wgt

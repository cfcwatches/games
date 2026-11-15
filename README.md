# games
© 2026 Colm. All rights reserved.

## App install / offline (PWA)
The site installs as an app and works offline via `manifest.webmanifest`, `sw.js` and `pwa.js`. If you add or rename pages or scripts, add them to `PRECACHE` in `sw.js` and bump `VERSION` (e.g. `hue-v2`) so returning visitors pick up the change. `sw.js` and `manifest.webmanifest` must stay in the site root.

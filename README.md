# games
© 2026 Colm. All rights reserved.

## App install / offline (PWA)
The site installs as an app and works offline via `manifest.webmanifest`, `sw.js` and `pwa.js`. If you add or rename pages or scripts, add them to `PRECACHE` in `sw.js` and bump `VERSION` (e.g. `hue-v2`) so returning visitors pick up the change. `sw.js` and `manifest.webmanifest` must stay in the site root.

## Cookie / ad consent
Ads are loaded by `consent.js`, not by a script tag in each page. Google's ad script only loads after the visitor presses Accept; Reject means no ads. The choice is stored in localStorage as `hue-consent`, and every page footer gets a "Cookie settings" link. For UK/EEA visitors Google requires a certified consent platform: if you turn on Google's free "Privacy & messaging" consent message in AdSense, set `USE_GOOGLE_CMP = true` at the top of `consent.js` so the two banners do not clash.

## Daily hub
`hub.js` tracks which daily puzzles are finished (Sudoku, Kakuro, Hue Word, Hue Shift) and the combined streak. To add another daily game, add it to the list in `hub.js`, call `HueHub.done('id')` when it is finished, and add a tile to the homepage panel.

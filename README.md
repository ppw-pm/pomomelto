FocusTimer
==========

A lightweight web app that helps you focus using a timer visualized as a melting ice cube, with optional procedurally generated background music.

Getting started
---------------

1) Open `index.html` in your browser (double-click or use a local server).
2) Set the session length, choose a drink (stub for now), and press Start.
3) The ice cube melts as time elapses; ambient music can be toggled.

Project structure
-----------------

- `index.html` — App shell
- `styles.css` — Global styles and layout
- `colors.css` — Color design tokens (CSS variables)
- `scripts/`
  - `app.js` — Timer, UI logic, and animation loop
  - `audio.js` — Web Audio API music generator
- `assets/`
  - `drinks/` — Placeholder folder for future ice/drink images

Notes
-----
- Colors are taken from the attached palette image and encoded as CSS variables in `colors.css`.
- All logic is vanilla JS for easy portability; no build step required.



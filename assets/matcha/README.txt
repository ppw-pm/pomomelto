Add drink images here.

Naming
------
- Use lowercase names that match the drink select values in `index.html`.
- To show progressive melting images every 5 minutes, add numbered variants 1..6:
  - water-1.png, water-2.png, ..., water-6.png
  - coffee-1.png, ..., coffee-6.png
- If numbered variants are missing, the app falls back to a single `{drink}.png`.

Format
------
- Recommended: PNG with transparency (so it blends over the canvas background).
- Suggested max width: ~800px. The app scales images down to fit.
- Center the glass/ice visually; leave some transparent padding.

How it appears
--------------
- The image is drawn near the bottom center of the canvas.
- Segment schedule (per session):
  - 0–5 min -> `*-1.png`
  - 5–10 min -> `*-2.png`
  - ...
  - 25–30 min -> `*-6.png`
- If a file for a segment is missing, the app falls back to `{drink}.png`; if that is missing too, only the procedural ice is shown.



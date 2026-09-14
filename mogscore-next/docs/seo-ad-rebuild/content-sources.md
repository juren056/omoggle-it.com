# Content and implementation sources

Checked 2026-09-14.

- Google AI Edge, Face Landmarker Web API: https://developers.google.com/edge/api/mediapipe/js/tasks-vision.facelandmarker
- Google AI Edge, Face Landmarker guide for Web: https://developers.google.cn/edge/mediapipe/solutions/vision/face_landmarker/web_js
- MediaPipe Tasks Vision package README: https://github.com/google-ai-edge/mediapipe/blob/master/mediapipe/tasks/web/vision/README.md
- Local package type declarations and bundled assets for `@mediapipe/tasks-vision@1.0.1`.
- Existing project source, local production build and generated sitemap.

The MediaPipe sources support landmark detection and note that synchronous detection can block the UI, which is why this implementation uses a Worker. They do not support a scientific attractiveness score; all site scores and shape thresholds are explicitly labelled heuristics.

No current primary source was available for exact Omoggle score weights, its current internal model, live service status or fixed score improvements. High-priority pages were softened instead of inventing confirmation. No GSC, GA4 or ad-platform export was provided.

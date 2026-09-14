# Local tool methodology

## Runtime and assets

The free tools use `@mediapipe/tasks-vision` 1.0.1, pinned exactly in `package.json`. Face Landmarker runs on demand in `workers/face-analysis.worker.js`. The model is served from `/mediapipe/models/face_landmarker_v1.task`; WASM is served from `/mediapipe/wasm`. The model file is the official float16 Face Landmarker v1 bundle downloaded from Google storage. Recorded SHA-256: `64184E229B263107BC2B804C6625DB1341FF2BB731874B0BCC2FE6544E0BC9FF`.

The model is not loaded by articles. The first tool run downloads about 3.59 MiB of model data plus the selected WASM binary (about 10.5–11.2 MiB). Browser-side processing removes per-run model API cost but not bandwidth.

The installed MediaPipe package is Apache-2.0 licensed. Its README states that inputs are processed on-device and are not sent to Google, while performance/utilization metrics may be sent to Google. The privacy page discloses this distinction; advertising and site analytics scripts remain excluded from tool routes.

## Input and measured output

- JPEG, PNG and WebP only; maximum file size 10 MiB; decoded dimensions at least 240×240.
- Images are downscaled to at most 1280 pixels on their longest edge before inference.
- Exactly one detected face is required. Zero and multiple faces fail without a score.
- The engine uses selected landmark distances for face bounds, eye line, nose offset, cheek width, jaw width and temple width. It also samples average luminance.
- Lighting, framing, roll and yaw checks describe controllable capture conditions.
- Symmetry and proportion numbers are site-defined heuristics. PSL and Mog outputs are entertainment/presentation labels, not official standards or objective attractiveness measurements.
- Face shape returns a closest and second category from Oval, Round, Square, Heart, Triangle and Oblong, plus the input-quality-derived confidence. Hair, facial hair, pose and lens perspective can make the classification unreliable.

## Stability, uncertainty and failure

Rule version `2026.09.1` is deterministic: identical landmarks, brightness and version produce identical output. Thresholds are product heuristics, not population-calibrated scientific cutoffs. The engine does not measure skin health, disease, age, race, identity, intelligence, social percentile or future improvement.

Inference runs in a module Worker to avoid continuously blocking the UI. Camera analysis captures one frame only. Abort signals cancel pending UI work; page unmount terminates the Worker, stops camera tracks and releases Object URLs. Unsupported browser APIs, model load failure, invalid files, small images, no face and multiple faces produce explicit errors and no fallback to the paid cloud API.

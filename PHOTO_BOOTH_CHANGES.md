# Doodle Museum — free Photo Booth update

## Changed files

- `src/PhotoBoothModal.jsx`: explicit Take Photo → live camera → Capture Photo flow; a separate Upload Photo button opens the file picker. Camera tracks stop after capture, cancellation, upload, closing, and late permission responses. Includes readable camera/file errors, original comparison, keyboard focus handling and Escape to close. Removed the old API-key gate, API prompts and fabricated second-pose messaging.
- `src/PhotoBoothCanvas.js` (new): browser-only, edge-aware smoothing, gentle color simplification, subtle outlines and soft color adjustments. Three styles: Soft Color, Pastel and Warm Paper. Preserves the full image's proportions and composition. No face warping, generated features, face-position assumptions or painted-on blush. Processing is capped at a 1000-pixel longest edge.
- `src/PhotoBooth.css` (new): scoped responsive styles retaining the existing cardboard/paper design, touch-friendly buttons and visible keyboard focus.
- `PHOTO_BOOTH_CHANGES.md` (new): this change and verification report.

## Result

Photo effects run entirely in the browser, without API calls, keys, subscriptions, credits, paid dependencies or server-side image generation. They are gentle soft-chibi-inspired photo effects, not generative chibi AI.

The downloadable 720 × 1180 PNG contains exactly two photo frames. Both use the same processed photograph: one straight frame and one slightly tilted paper frame. No second pose is invented. The preview is the actual downloadable PNG, including the artwork title and artist credit below the frames.

All other original project files, including `App.jsx`, `supabaseClient.js`, the Exhibition Wall, `package.json` and `package-lock.json`, are unchanged. The old `CaricatureEngine.js` is retained but is no longer used by the Photo Booth. No dependencies were added or upgraded in the delivered project.

The ZIP omits Git history, installed dependencies and generated build files; source and the original npm lockfile are included.

## Verification

- Installed the original locked npm dependencies and successfully built with Vite 8.2.1.
- Photo Booth JavaScript/JSX passes ESLint with zero errors or warnings.
- Automated Chromium tests passed for opening/capturing/reopening the camera with controlled browser video streams; no camera request occurs until Take Photo is pressed.
- Tested stream cleanup after capture, close and cancellation, including permission requests that finish after cancellation/unmount.
- Tested camera permission denial and upload fallback, the actual file-picker button, invalid-image recovery, style changes, original comparison, Escape and PNG download.
- Confirmed that downloaded PNG bytes match the displayed preview and that its dimensions are 720 × 1180.
- Checked 320, 390 and 768 pixel layouts for horizontal overflow; visually inspected desktop/mobile screenshots and a sample portrait strip.
- Tested all three styles on portrait, landscape, large and one-pixel inputs; checked aspect ratios and processing-size limits, and exercised long artist/title text.
- No runtime exceptions occurred in the completed browser tests. External services were intercepted during testing, so no Exhibition Wall data was written.

Full-project `npm run lint` still reports nine pre-existing errors in untouched files: unused variables/imports in `App.jsx`, `AvatarStudioModal.jsx` and `DoodleFrames.jsx`, plus unused-import and Fast Refresh export warnings configured as errors in `AvatarLibrary.jsx`. These are unrelated to the Photo Booth and do not prevent the production build. They were left unchanged to preserve the existing gallery/avatar implementation.

Physical camera hardware and native iOS/Android browsers were not available for testing. Chrome's simulated camera also intermittently reported no device on repeated runs; the app correctly displayed its fallback. Repeat-capture regression tests passed using controlled Canvas video streams.

## Run

Unzip, open the `doodle_museum` folder, then run:

```sh
npm ci
npm run dev
```

For production: `npm run build`, then serve the generated `dist` folder. Camera access requires HTTPS or localhost and browser permission. Upload works without camera permission. Supported uploads: JPG, PNG, WebP, GIF (a still frame), AVIF and BMP up to 25 MB, subject to browser decoding support; convert HEIC to JPG first.

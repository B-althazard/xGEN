# x.GEN — Bug Log

## 2026-03-19

### [FIXED] ES Module Export Mismatch

- **Severity:** Critical
- **Symptom:** `Uncaught (in promise) SyntaxError: The requested module doesn't provide an export named 'app'`
- **Root Cause:** `app.js` used `export default app` but consumers used `import { app }`
- **Fix:** Added named re-export `export { default as app } from './app.js'` in `app.js`
- **Files affected:** `js/app.js`, `js/components/formRenderer.js`, `js/pages/creationKit.js`, `js/modules/presets.js`
- **Reported by:** GitHub Pages deployment

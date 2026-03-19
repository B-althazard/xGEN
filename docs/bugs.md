# x.GEN — Bug Log

## 2026-03-19

### [FIXED] ES Module Export Mismatch

- **Severity:** Critical
- **Symptom:** `Uncaught (in promise) SyntaxError: The requested module doesn't provide an export named 'app'`
- **Root Cause:** `app.js` used `export default app` but consumers used `import { app }`
- **Fix:** Added named re-export `export { default as app } from './app.js'` in `app.js`
- **Files affected:** `js/app.js`, `js/components/formRenderer.js`, `js/pages/creationKit.js`, `js/modules/presets.js`
- **Reported by:** GitHub Pages deployment

### [FIXED] Self-referential Export in app.js

- **Severity:** Critical
- **Symptom:** Infinite loop in module evaluation, page never loads
- **Root Cause:** `export { default as app } from './app.js'` on line 286 re-exported from itself
- **Fix:** Removed self-referential line
- **Files affected:** `js/app.js`
- **Reported by:** GitHub Pages deployment (post-fix)

### [FIXED] Infinite Recursion in store.js `_deepMerge`

- **Severity:** Critical
- **Symptom:** `InternalError: too much recursion` crashing the page
- **Root Cause:** `_deepMerge` recursed into Set/Map objects and nested structures without depth guard; also no early-exit when state unchanged
- **Fix:** Added depth limit (`depth > 20` guard), explicit null/Set/Map/Date exclusion, and early-exit `if (merged === this._state) return` in `setState`
- **Files affected:** `js/store.js`
- **Reported by:** GitHub Pages deployment (post-fix)

### [FIXED] Duplicate Export in theLab.js

- **Severity:** Critical
- **Symptom:** `Uncaught (in promise) SyntaxError: duplicate export name 'renderLab'`
- **Root Cause:** `triggerGeneration` imported from `bridgeManager.js` then re-exported alongside `renderLab` — conflicting export statement
- **Fix:** Removed `triggerGeneration` from export line, keeping only `renderLab`
- **Files affected:** `js/pages/theLab.js`
- **Reported by:** GitHub Pages deployment (post-fix)

### [INFO] CSS Parser Warnings (non-blocking)

- **Symptom:** `-webkit-text-size-adjust` parse error, `-moz-osx-font-smoothing` unknown, "bad selector"
- **Root Cause:** Non-standard vendor-prefixed properties flagged by Chrome's parser
- **Fix:** Changed `-webkit-text-size-adjust: 100%` to `auto`; other warnings are harmless browser quirks
- **Files affected:** `css/style.css`
- **Reported by:** GitHub Pages deployment console

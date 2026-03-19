# x.GEN — Branding Guide

**Version:** 1.0  
**Status:** Authoritative  
**Last Updated:** 2026-03-19

---

## 1. Brand Name Usage

### Official Brand Name
**x.GEN** (with styled dot between x and GEN)

### Usage Rules

| Context | Form | Example |
|---------|------|---------|
| User-facing display | `x.GEN` | App title, wordmark, marketing |
| Code/internal identifiers | `xgen` | localStorage keys, event names, CSS prefixes |
| File names | `xgen-*` or `xgen.*` | `xgen-venice-bridge.user.js` |
| URL paths | `/xgen/` | `https://b-althazard.github.io/xgen/` |
| Documentation | `x.GEN` | This document, guides |

### Never Use
- ~~"Replic"~~ — internal placeholder, never user-facing
- ~~"XGen"~~ — inconsistent casing
- ~~"xgen.ai"~~ — placeholder domain, not registered (may be used as future reference)

---

## 2. GM Storage Key Naming

All Greasemonkey/Tampermonkey `GM_setValue` / `GM_getValue` keys follow this convention:

```
xgen_v1_<purpose>
```

### Canonical Keys

| Key | Purpose | Type |
|-----|---------|------|
| `xgen_v1_request` | Full request payload | Object |
| `xgen_v1_request_nonce` | Unique request identifier | String |
| `xgen_v1_result` | Full result payload | Object |
| `xgen_v1_result_nonce` | Unique result identifier | String |
| `xgen_v1_status` | Bridge status | Object |
| `xgen_v1_error` | Error details | Object |
| `xgen_v1_timestamp` | Request timestamp | Number |
| `xgen_v1_log_nonce` | Log entry trigger | String |
| `xgen_v1_last_log` | Last log entry | Object |
| `xgen_v1_last_processed_nonce` | Deduplication | String |
| `xgen_v1_heartbeat_xgen` | x.GEN page heartbeat | Number |
| `xgen_v1_heartbeat_venice` | Venice page heartbeat | Number |
| `xgen_v1_last_transfer_ts` | Last image transfer timestamp | Number |

### Key Naming Rules
- Use `xgen_v1_` prefix (not `xgen_to_venice_` or `replic_v1_`)
- Use underscores for word separation
- Use descriptive purpose names
- Version prefix (`v1`) allows future protocol changes

---

## 3. Custom Event Naming

All browser CustomEvent names follow this convention:

```
xgen:<action>
```

### Canonical Events

| Event | Direction | Purpose |
|-------|-----------|---------|
| `xgen:bridge-ready` | Userscript → PWA | Bridge installation detected |
| `xgen:generate` | PWA → Userscript | Generation request dispatched |
| `xgen:image-received` | Userscript → PWA | Generated image available |
| `xgen:status-update` | Userscript → PWA | Bridge status change |
| `xgen:generation-error` | Userscript → PWA | Generation failed |

### Event Naming Rules
- Use `xgen:` prefix (lowercase)
- Use past tense for receive events (`received`, `updated`)
- Use imperative for send events (`generate`)
- Never use `replic:` prefix

---

## 4. File Naming Conventions

### Userscript Files
```
xgen-venice-bridge.user.js
```
- All lowercase
- Hyphen-separated words
- `.user.js` extension for Violentmonkey/Tampermonkey compatibility

### PWA Source Files
```
js/bridgeManager.js
css/style.css
data/master_file.json
```

### Directory Structure
```
xGEN/
├── userscript/
│   └── xgen-venice-bridge.user.js
├── js/
│   ├── bridgeManager.js
│   └── ...
├── css/
│   └── style.css
├── docs/
│   └── BRANDING_GUIDE.md
└── ...
```

---

## 5. Cache Name Convention

PWA Service Worker cache names:

```
xgen-v<major>
```

| Cache Name | Version | Purpose |
|------------|---------|---------|
| `xgen-v1` | v1 | Primary app assets |

---

## 6. URL References

### Development URL
```
https://b-althazard.github.io/xgen/
```
- Always lowercase `xgen` in URL path
- Note: GitHub Pages is case-sensitive on some systems

### Future Production (Placeholder)
```
https://xgen.ai/
```
- Currently unregistered, used as placeholder
- Will be updated when domain is acquired

---

## 7. CSS Class Prefixes

| Prefix | Component |
|--------|-----------|
| `xgen-` | App-wide components |
| `bridge-` | Bridge-specific UI |
| `rvpb-` | Venice Bridge status panel (from original implementation) |

---

## 8. Console Log Prefix

```
[xGEN→Venice]
```

Used in userscript console.log statements for easy filtering.

---

## 9. LocalStorage Keys (PWA)

PWA-specific keys stored via `localStorage` (not GM storage):

| Key | Purpose |
|-----|---------|
| `xgen.dummies` | Saved dummy configurations |
| `xgen.settings` | User settings |
| `xgen.bridgeSeen` | Bridge install modal dismissed flag |
| `xgen.onboardingComplete` | Onboarding flow completed |

---

## 10. Quick Reference Card

### DO
- [x] Use `x.GEN` for user-facing text
- [x] Use `xgen` for code identifiers
- [x] Use `xgen_v1_` prefix for GM storage keys
- [x] Use `xgen:` prefix for CustomEvents
- [x] Use lowercase and hyphens for file names
- [x] Use `xgen-v1` for cache names

### DON'T
- [ ] Use "replic" anywhere
- [ ] Use mixed case in file names (`xGEN-*`)
- [ ] Use underscore in file names (except `.user.js` consideration)
- [ ] Use `xgen_to_venice_*` or `replic_v1_*` key patterns

---

## 11. Change Log

| Date | Version | Changes |
|------|---------|---------|
| 2026-03-19 | 1.0 | Initial branding guide created |

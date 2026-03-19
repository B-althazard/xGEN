# x.GEN — AUTHORITATIVE UPDATE DOCUMENT
## Guard Rails, Asset Request System, and Mandatory Validation Gate · Version 1.0

**Document status:** Authoritative addendum to the Master Build Document.  
**Intended reader:** Agent Q. and any secondary execution agent.  
**Precedence:** This document overrides conflicting implementation behavior in the Master Build Document for guard rails, asset handling, and validation only.

---

## 1. Purpose

This document closes the three known gaps in the Master Build Document:

1. partial guard-rail implementation,
2. a designer-directed asset brief that must instead be executable by Agent Q. or emitted as exact markdown request files,
3. a manual checklist without a mandatory automated validation gate.

This update does **not** change the product definition, brand direction, runtime stack, or scope of x.GEN. It adds execution rules, validation rules, and asset-production rules.

---

## 2. Authority and Rule Hierarchy

When Agent Q. makes a decision, it must use this order of authority:

1. Official platform or runtime documentation for the exact technology being used.
2. Product-owner-confirmed requirements in the Master Build Document.
3. This Authoritative Update Document.
4. Existing repository code that already passes the validation gate.
5. Agent decisions recorded in the decision log.
6. Temporary defaults explicitly marked as assumptions.

**Hard rule:** Agent Q. must never invent APIs, schema fields, asset filenames, dimensions, or system capabilities that are not supported by one of the sources above.

---

## 3. Guard Rail System

### 3.1 Anti-Hallucination Rules

Agent Q. must follow all of the following:

- Do not create new product features unless a source explicitly requires them.
- Do not rename existing IDs, keys, files, routes, event names, or storage keys without a traceable reason.
- Do not claim a task is complete without a validation artifact.
- Do not claim external compatibility unless it has been tested or directly documented.
- Do not claim an asset exists unless the file is present at the required path.
- Do not claim a bug is fixed unless the failure is reproducible before the fix and absent after the fix.

### 3.2 Evidence Rule

Every non-trivial action must leave one of the following evidence types:

- source citation or file path,
- generated file,
- passing test result,
- screenshot or rendered artifact,
- validation report entry,
- limitation report entry.

If no evidence exists, the task is **not complete**.

### 3.3 Loop Prevention and Retry Budgets

Agent Q. must track repeated failure by error signature.

| Failure Type | Max Immediate Retries | Required Next Action |
|---|---:|---|
| Formatting / syntax error | 2 | Run targeted validation, then patch once |
| Unit test failure | 2 | Switch to debug mode and isolate smallest failing unit |
| Integration / E2E failure | 2 | Capture logs, network state, and DOM evidence |
| Build / runtime crash | 1 | Reproduce in minimal scenario before changing code |
| External dependency unavailable | 1 | Emit limitation report or request file |
| Unknown repeated error signature | 2 | Stop iteration and create blocker record |

**Loop trigger:** if the same error signature occurs 3 times without a materially different fix strategy, Agent Q. must stop the current loop and enter the Debug and Escalation Procedure in Section 5.

### 3.4 Scope Guard

Agent Q. may not expand scope in order to solve an implementation problem.  
Allowed actions:

- substitute an equivalent internal implementation,
- add testing-only tooling,
- add validation-only scripts,
- add logging, diagnostics, and reporting.

Disallowed actions unless explicitly approved in source material:

- changing the product audience,
- changing the runtime stack,
- replacing the Venice bridge architecture,
- changing core information architecture,
- adding backend services not required by the spec,
- introducing framework migration.

### 3.5 Official Documentation Boundary

When source material conflicts with runtime reality, Agent Q. must:

1. preserve product intent,
2. follow official documentation for technical correctness,
3. record the delta in `docs/DECISION_LOG_AUTONOMOUS.md`,
4. keep the smallest possible implementation change.

### 3.6 Completion Guard

A phase is complete only when all of the following are true:

- implementation exists,
- automated gate for that phase passes,
- manual checklist items for that phase are checked,
- no open blocker remains unrecorded,
- outputs are written to the required paths,
- evidence is logged in `reports/VALIDATION_REPORT.md`.

---

## 4. Asset Generation and Request System

### 4.1 Required Agent Behavior

Agent Q. must attempt asset generation internally first.

If Agent Q. has asset-generation capability and the result can satisfy the acceptance criteria, Agent Q. must generate the asset pack directly.

If Agent Q. cannot satisfy the acceptance criteria internally, Agent Q. must generate one or more **exact markdown request files** using the filename format in Section 4.2.

### 4.2 Request Filename Format

All asset request files must use this exact pattern:

```text
ASSET_REQUEST__<PRIORITY>__<GROUP>__<SLUG>__v<MAJOR>.<MINOR>.md
```

Rules:

- `PRIORITY` = `P1`, `P2`, or `P3`
- `GROUP` = lowercase kebab-case noun group
- `SLUG` = lowercase kebab-case asset pack name
- version is semantic and begins at `v1.0`

Examples:

```text
ASSET_REQUEST__P1__brand__wordmark-and-symbol__v1.0.md
ASSET_REQUEST__P1__icons__pwa-icon-pack__v1.0.md
ASSET_REQUEST__P1__modals__shape-reference-pack__v1.0.md
ASSET_REQUEST__P2__portraits__default-dummy-placeholders__v1.0.md
```

### 4.3 Required Request File Structure

Every asset request markdown file must use this exact section order:

```markdown
# Asset Request
## Request ID
## Priority
## Requested By
## Target Path
## Required Deliverables
## Exact File Specifications
## Brand Constraints
## Content Constraints
## Acceptance Criteria
## Blocking Status
```

### 4.4 Canonical Asset Requests for This Project

The following request bodies are the canonical files Agent Q. must emit if external production is required.

---

## 4.4.1 `ASSET_REQUEST__P1__brand__wordmark-and-symbol__v1.0.md`

```markdown
# Asset Request
## Request ID
ASSET_REQUEST__P1__brand__wordmark-and-symbol__v1.0

## Priority
P1

## Requested By
Agent Q.

## Target Path
assets/brand/

## Required Deliverables
- xgen-wordmark.svg
- xgen-symbol-x.svg
- xgen-wordmark-preview.png
- xgen-symbol-preview.png

## Exact File Specifications
### 1. xgen-wordmark.svg
- Format: SVG
- Dimensions: scalable vector, designed to render cleanly at 180px width and above
- Content:
  - `x` in geometric sans-serif, weight 600
  - `.GEN` in same typeface, weight 600
  - `x` color: `#e5e7eb`
  - `.GEN` color: `#d0b067`
  - dot nodes: solid circular nodes, 1.3x punctuation size
  - replication motif applied to `x` with 2 ghost layers
  - ghost layer offsets: +2px/+1px and +4px/+2px
  - ghost layer opacity: 25% and 12%

### 2. xgen-symbol-x.svg
- Format: SVG
- Dimensions: scalable vector, square artboard
- Content:
  - layered `x` icon only
  - front layer color: `#e5e7eb`
  - middle layer color: `#d0b067`, 50% opacity, offset +3px/+2px
  - back layer color: `#f97187`, 25% opacity, offset +6px/+4px
  - background not baked into SVG

### 3. Preview PNG files
- Format: PNG
- Dimensions:
  - xgen-wordmark-preview.png: 1200x630
  - xgen-symbol-preview.png: 1024x1024
- Background: `#131313`

## Brand Constraints
- Brand personality: Sleek, Dark, Femme, Edgy, Empowering
- No literal face, body, doll, or mascot
- Rounded terminals preferred
- Minimal geometry only

## Content Constraints
- No gradients unless extremely subtle
- No photographic textures
- No bevels or 3D effects
- No extra colors beyond approved palette unless used for antialiasing only

## Acceptance Criteria
- SVG opens cleanly in browser and vector editor
- Wordmark remains legible at 180px width
- Symbol remains legible at 16px equivalent size
- All colors match exact approved hex values
- Offsets and opacity layers are visually distinct but not noisy

## Blocking Status
Blocking: yes
Reason: icon system and identity assets are required for final packaging and manifest completeness
```

---

## 4.4.2 `ASSET_REQUEST__P1__icons__pwa-icon-pack__v1.0.md`

```markdown
# Asset Request
## Request ID
ASSET_REQUEST__P1__icons__pwa-icon-pack__v1.0

## Priority
P1

## Requested By
Agent Q.

## Target Path
assets/icons/

## Required Deliverables
- favicon.ico
- icon-48.png
- icon-72.png
- icon-96.png
- icon-128.png
- icon-144.png
- icon-192.png
- icon-512.png
- icon-maskable-192.png
- icon-maskable-512.png
- apple-touch-icon.png

## Exact File Specifications
### Source Design
- Base symbol: layered `x`
- Front layer: `#e5e7eb`
- Middle layer: `#d0b067` at 50% opacity, offset +3px/+2px
- Back layer: `#f97187` at 25% opacity, offset +6px/+4px
- Background: `#131313`

### Output Files
- favicon.ico: contains 16x16 and 32x32
- icon-48.png: 48x48
- icon-72.png: 72x72
- icon-96.png: 96x96
- icon-128.png: 128x128
- icon-144.png: 144x144
- icon-192.png: 192x192
- icon-512.png: 512x512
- icon-maskable-192.png: 192x192 with safe content inside central 80%
- icon-maskable-512.png: 512x512 with safe content inside central 80%
- apple-touch-icon.png: 180x180

## Brand Constraints
- Use exact approved palette only
- Background must remain solid `#131313`
- Symbol centered in all outputs
- No text in icon assets

## Content Constraints
- No decorative border
- No outer glow
- No gradients that reduce legibility at small sizes
- No alpha background for PNG deliverables

## Acceptance Criteria
- Every file matches exact filename and dimensions
- Maskable icons keep symbol inside safe zone
- 16x16 favicon remains identifiable
- PNG exports are crisp and non-blurry
- Background color is exact and uniform

## Blocking Status
Blocking: yes
Reason: manifest, installability, and platform packaging require the full icon set
```

---

## 4.4.3 `ASSET_REQUEST__P1__modals__shape-reference-pack__v1.0.md`

```markdown
# Asset Request
## Request ID
ASSET_REQUEST__P1__modals__shape-reference-pack__v1.0

## Priority
P1

## Requested By
Agent Q.

## Target Path
assets/modals/

## Required Deliverables
- body_types.png
- ethnicity.png
- face_shapes.png
- eye_shapes.png
- nose_shapes.png
- lip_shapes.png
- bust_shapes.png
- hair_styles.png
- eyebrow_shapes.png

## Exact File Specifications
### Global Rules
- Format: PNG
- Background: transparent
- Canvas size: 1200x1200
- Layout: 3-column grid
- Option count: 6 to 9 per sheet
- Illustration style: minimal line art, monochromatic, clean
- Primary stroke color for dark-theme compatibility: `#e5e7eb`
- Secondary annotation color if needed: `#9ca3af`
- Do not use filled skin tones or realistic shading

### Per-file Constraints
#### body_types.png
- 6 to 8 silhouette variants
- Full-body simplified front-view silhouettes

#### ethnicity.png
- 8 simplified portrait silhouettes or facial-outline archetypes
- Must stay neutral and non-stereotyped

#### face_shapes.png
- 6 to 9 face-shape outlines

#### eye_shapes.png
- 6 to 9 eye-shape diagrams

#### nose_shapes.png
- 6 to 9 nose-shape diagrams

#### lip_shapes.png
- 6 to 9 lip-shape diagrams

#### bust_shapes.png
- 6 to 9 chest contour diagrams, abstract and non-explicit

#### hair_styles.png
- 6 to 9 hairstyle silhouettes

#### eyebrow_shapes.png
- 6 to 9 eyebrow shape diagrams

## Brand Constraints
- Visual system must feel clinical, clean, and selection-oriented
- Use one consistent stroke language across all sheets
- Maintain coherent margin and label spacing across files

## Content Constraints
- No color fills except transparent background and optional subtle line hierarchy
- No realistic anatomy rendering
- No sexualized detail
- No photographic imagery
- No inconsistent line weights across the set

## Acceptance Criteria
- Every PNG has transparent background
- Every file uses 1200x1200 canvas
- Each sheet is readable at modal scale on mobile and desktop
- File naming is exact
- The full pack feels like one coherent system

## Blocking Status
Blocking: yes
Reason: shape-modal fields require these assets for correct selection UX
```

---

## 4.4.4 `ASSET_REQUEST__P2__portraits__default-dummy-placeholders__v1.0.md`

```markdown
# Asset Request
## Request ID
ASSET_REQUEST__P2__portraits__default-dummy-placeholders__v1.0

## Priority
P2

## Requested By
Agent Q.

## Target Path
assets/placeholders/

## Required Deliverables
- goth.jpg
- bimbo.jpg
- gym-girl.jpg
- girl-next-door.jpg
- e-girl.jpg
- baddie.jpg
- soft-girl.jpg
- cottagecore.jpg

## Exact File Specifications
### Global Rules
- Format: JPG
- Dimensions: 1200x1800
- Aspect ratio: 2:3 portrait
- Framing: centered subject, waist to top-of-head crop
- Background: same neutral studio background, dark neutral, slightly blurred
- Lighting: soft key from 45 degrees left, subtle rim light
- Style: realistic photographic

### Archetype Consistency Rules
- All portraits must share camera height, lens feel, and composition family
- Each portrait must map to its archetype naming without breaking global consistency
- Wardrobe and styling variation are allowed only to the degree required to distinguish archetypes

## Brand Constraints
- Cohesive set, not eight unrelated portraits
- No illustration or render look
- No text overlays
- No watermark

## Content Constraints
- Adult-only compliance rules must be preserved
- No minors or age ambiguity
- No explicit nudity in placeholder portrait assets
- No background clutter

## Acceptance Criteria
- Every file is present at exact path and exact filename
- All files are 1200x1800 JPG
- Visual consistency across the set is obvious when viewed together
- Each archetype is recognizable and distinct

## Blocking Status
Blocking: no
Reason: placeholder portraits improve quality and completeness, but core app logic can function before they are finalized
```

### 4.5 Asset Handling Decision Rule

Agent Q. must use this sequence:

1. attempt internal generation,
2. validate against acceptance criteria,
3. save asset if valid,
4. otherwise emit canonical request file,
5. mark any blocking asset request in `reports/AUTONOMY_LIMITATION_REPORT.md`.

---

## 5. Debug and Escalation Procedure

### 5.1 Prevention Mode vs Debug Mode

Agent Q. starts in **Prevention Mode**:

- build smallest correct unit,
- validate before broad refactor,
- prefer deterministic fixes,
- avoid speculative changes.

Agent Q. switches to **Debug Mode** when any of the following occur:

- same error signature appears 3 times,
- test passes locally but fails in gate,
- a previously passing phase regresses,
- a bridge or async event failure is nondeterministic,
- file path / asset path mismatch persists after one patch.

### 5.2 Required Debug Sequence

In Debug Mode, Agent Q. must perform this exact order:

1. reproduce the failure in the smallest possible scope,
2. record failing symptom,
3. identify the responsible layer,
4. inspect inputs and outputs at the layer boundary,
5. write or tighten a test that demonstrates the bug,
6. patch once,
7. rerun the smallest affected test set,
8. rerun the broader phase gate.

### 5.3 Mandatory Blocker Record

If the issue cannot be resolved within the retry budget, Agent Q. must append a blocker entry to `reports/AUTONOMY_LIMITATION_REPORT.md` using this structure:

```markdown
## Blocker
- ID:
- Layer:
- Symptom:
- Reproduction:
- Evidence:
- Why blocked:
- What is required to proceed:
- Impact on scope:
- Blocking severity: blocking | non-blocking
```

---

## 6. Mandatory Validation System

### 6.1 Policy

A manual checklist is required.  
A fully automated validation gate is also required.  
Both are mandatory.  
Passing one does not waive the other.

### 6.2 Validation Gate Architecture

The validation gate must run in this order:

1. repository structure validation,
2. schema validation,
3. static code validation,
4. unit tests,
5. integration tests,
6. end-to-end smoke tests,
7. PWA/installability checks,
8. artifact presence checks,
9. release-readiness summary.

### 6.3 Allowed Tooling

The runtime product remains vanilla HTML/CSS/JS.  
Testing and validation tooling may introduce development-only dependencies.

Allowed development-only tooling:

- Node.js LTS
- Playwright
- Vitest or native Node test runner
- ESLint
- Prettier
- Ajv for JSON schema validation
- Lighthouse CI or equivalent PWA audit tooling

### 6.4 Required Files to Add

```text
package.json
eslint.config.js
playwright.config.js
scripts/validate-structure.mjs
scripts/validate-assets.mjs
scripts/validate-pwa.mjs
scripts/release-readiness.mjs
tests/unit/
tests/integration/
tests/e2e/
reports/
.github/workflows/validation.yml
```

### 6.5 Required NPM Scripts

```json
{
  "scripts": {
    "validate:structure": "node scripts/validate-structure.mjs",
    "validate:schema": "node scripts/validate-schema.mjs",
    "lint": "eslint .",
    "test:unit": "node --test tests/unit/**/*.test.js",
    "test:integration": "node --test tests/integration/**/*.test.js",
    "test:e2e": "playwright test",
    "validate:assets": "node scripts/validate-assets.mjs",
    "validate:pwa": "node scripts/validate-pwa.mjs",
    "validate:release": "node scripts/release-readiness.mjs",
    "gate": "npm run validate:structure && npm run validate:schema && npm run lint && npm run test:unit && npm run test:integration && npm run test:e2e && npm run validate:assets && npm run validate:pwa && npm run validate:release"
  }
}
```

### 6.6 Required Automated Checks

#### 6.6.1 Structure Validation

The structure validator must fail if required files or directories are missing, including:

- `index.html`
- `manifest.json`
- `sw.js`
- `css/style.css`
- all required JS modules
- required data files
- required asset directories

#### 6.6.2 Schema Validation

The schema validator must verify:

- `master_file.json` structure,
- field type validity,
- option ID uniqueness,
- required property presence,
- modal-image path validity for `shape-modal` fields,
- default dummies reference only valid field IDs and option IDs.

#### 6.6.3 Static Code Validation

The code validator must fail on:

- undefined variables,
- unreachable imports,
- duplicate exports,
- parse errors,
- accidental use of unsupported runtime syntax for the target browser matrix.

#### 6.6.4 Unit Tests

Minimum required unit coverage:

- prompt assembly per model,
- negative prompt generation,
- clothing mutual exclusivity,
- nude-clearing behavior,
- addon merge rules,
- storage pruning,
- undo/redo logic,
- pose compatibility validation.

**Correction to Master Build Document:** the multi-dummy test block must no longer be commented placeholder text. It must be executable and passing.

#### 6.6.5 Integration Tests

Minimum required integration coverage:

- bridge manager timeout handling,
- stale result rejection,
- image persistence into IndexedDB,
- history pruning to limit,
- addon parse failure handling without app crash,
- service worker registration success path,
- offline-generation error message path.

#### 6.6.6 End-to-End Smoke Tests

Minimum required E2E coverage:

- first-load age gate and onboarding flow,
- navigation between Home, Creation Kit, and The Lab,
- form rendering for all 13 categories,
- swatch selection and prompt update,
- save-as-Doll flow,
- save-as-Mannequin flow,
- multi-dummy tab appearance and switching,
- generate action when bridge missing,
- generate action when offline,
- installability indicators and manifest presence.

### 6.7 Gate Output Rules

Every validation run must produce or update:

```text
reports/VALIDATION_REPORT.md
reports/TEST_RESULTS_UNIT.txt
reports/TEST_RESULTS_INTEGRATION.txt
reports/TEST_RESULTS_E2E.txt
reports/RELEASE_READINESS_REPORT.md
```

### 6.8 Release Blocking Rules

Release is blocked if any of the following are true:

- any automated check fails,
- any blocking asset is missing,
- any blocking limitation remains open,
- service worker installability check fails,
- unit tests or E2E smoke tests are skipped without explicit approval,
- required manual checklist items remain unchecked.

---

## 7. Updated Manual Checklist

The existing manual checklist remains valid and is expanded with release-signoff items.

### 7.1 Release-Signoff Manual Checks

- [ ] Wordmark renders correctly in top bar
- [ ] App icon renders correctly in browser tab and install prompt
- [ ] Modal reference images are readable on mobile
- [ ] Empty states use correct approved visuals
- [ ] Theme switch preserves readability and brand contrast
- [ ] Bridge failure states are understandable and recoverable
- [ ] Offline mode blocks generation but preserves local use
- [ ] PWA installs and relaunches successfully
- [ ] Generated image history survives app reload
- [ ] No missing-asset broken image icons appear anywhere in the UI

---

## 8. Required Reports

Agent Q. must maintain these files:

```text
docs/DECISION_LOG_AUTONOMOUS.md
reports/VALIDATION_REPORT.md
reports/RELEASE_READINESS_REPORT.md
reports/AUTONOMY_LIMITATION_REPORT.md
```

### 8.1 Minimum Content for `reports/RELEASE_READINESS_REPORT.md`

```markdown
# Release Readiness Report
- Build status:
- Automated gate status:
- Manual checklist status:
- Blocking assets missing:
- Open blockers:
- Known non-blocking issues:
- Final recommendation: release | do-not-release
```

---

## 9. Integration Instructions for the Existing Master Build Document

Insert or apply this document as follows:

- augment Section 20 with Section 6 from this document,
- replace the designer-only behavior in Section 22 with Section 4 from this document,
- append Section 3 and Section 5 as new guard-rail and escalation sections,
- treat all validation outputs and reports in Section 8 as mandatory project deliverables.

---

## 10. Non-Negotiable Rules Summary

Agent Q. must not do any of the following:

- mark work complete without evidence,
- iterate indefinitely on the same failure,
- skip automated validation,
- skip manual validation,
- invent asset specs,
- defer blocking missing assets without a request file or limitation report,
- bypass official documentation when technical behavior conflicts with assumption.


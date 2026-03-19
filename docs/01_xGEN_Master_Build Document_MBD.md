# x.GEN — MASTER BUILD DOCUMENT
## Definitive AI Agent Specification · Version 1.0

---

> **PURPOSE OF THIS DOCUMENT**
> This is the single source of truth for building x.GEN from scratch. It contains every decision, every value, every algorithm, every component, and every edge case. An AI agent reading this document should be able to build the complete application with zero ambiguity and zero need for external clarification.
>
> Sections marked `[AGENT DECISION]` indicate a reasoned default established by the author. All other decisions are explicitly confirmed by the product owner.

---

## TABLE OF CONTENTS

1. [Project Identity & Summary](#1-project-identity--summary)
2. [Brand & Visual Identity System](#2-brand--visual-identity-system)
3. [Complete Design System](#3-complete-design-system)
4. [File Structure](#4-file-structure)
5. [Data Architecture](#5-data-architecture)
6. [App Shell & Shared Components](#6-app-shell--shared-components)
7. [Pages](#7-pages)
8. [Modules](#8-modules)
9. [The Form — All 13 Categories](#9-the-form--all-13-categories)
10. [Prompt Engine Algorithm](#10-prompt-engine-algorithm)
11. [Venice Bridge & UserScript](#11-venice-bridge--userscript)
12. [Storage Architecture](#12-storage-architecture)
13. [Multi-Dummy Mode](#13-multi-dummy-mode)
14. [Default Dummies — 8 Archetypes](#14-default-dummies--8-archetypes)
15. [Presets System — Dolls & Dummies](#15-presets-system--dolls--dummies)
16. [Settings & Onboarding](#16-settings--onboarding)
17. [PWA Configuration](#17-pwa-configuration)
18. [Desktop Layout](#18-desktop-layout)
19. [Keyboard Shortcuts](#19-keyboard-shortcuts)
20. [Testing Plan](#20-testing-plan)
21. [Build Order & Phases](#21-build-order--phases)
22. [Design Brief for Visual Designer](#22-design-brief-for-visual-designer)
23. [Agent Decision Log](#23-agent-decision-log)

---

## 1. PROJECT IDENTITY & SUMMARY

| Field | Value |
|---|---|
| **App Name** | x.GEN |
| **Logotype** | `x.GEN` with styled dot + GEN in gold accent |
| **Target Users** | Female content creators (OnlyFans, Fansly, Fanvue, Instagram, TikTok) |
| **Core Purpose** | Structured prompt-builder that generates an AI dummy of the user for image generation |
| **Platform** | Installable PWA — mobile-first, desktop-supported, offline-capable (except generation) |
| **Tech Stack** | Vanilla HTML / CSS / JS — native ES modules, no build step, no framework |
| **Deployment** | `https://b-althazard.github.io/xGEN/` (GitHub Pages for initial hosting) |
| **Repository** | Private — Proprietary license |
| **Version** | v1.0 |

### Core Flow

```
User fills Creation Kit form (structured fields, no free-text input)
    ↓
App assembles prompt in real-time via Prompt Engine
    ↓
User presses Generate → prompt broadcast to Venice bridge
    ↓
UserScript (Violentmonkey) running in browser:
    - Injects prompt into Venice.ai
    - Triggers generation
    - Polls for new image
    - Downloads result as base64
    - Posts image back to PWA
    ↓
PWA receives image → displays in The Lab viewer
```

### Version Roadmap (for architecture awareness only — v2 not built here)

| Version | Scope |
|---|---|
| **v1 (THIS DOCUMENT)** | Full PWA, Venice bridge, prompt engine, 8 default Dummies, presets system, offline |
| **v2** | Cloud sync, subscription model, multi-site bridge adapters, Kotlin Multiplatform migration, Android TWA |

---

## 2. BRAND & VISUAL IDENTITY SYSTEM

### 2.1 Brand Personality

The brand is built on five core adjectives that inform every design decision:

| Adjective | Application |
|---|---|
| **Sleek** | Minimal chrome, no decorative noise, tight spacing, clean geometry |
| **Dark** | Dark-first color system, even light theme is warm off-white not stark white |
| **Femme** | Soft pink primary, rounded UI elements, elegant type treatment |
| **Edgy** | Pink+orange accent palette, offset replication motif, subtle tension in composition |
| **Empowering** | Clear CTAs, confident typography, tool-forward language (not passive) |

### 2.2 Logo & Wordmark

#### Concept
A modern minimal wordmark built around **digital replication**. The wordmark `x.GEN` in clean geometric sans-serif, with the `x` featuring a layered replication motif and `.GEN` visually distinguished to foreground the generative AI identity.

#### Wordmark Construction

- **`x`** — geometric sans-serif (Inter or custom), weight 600, color `#e5e7eb`
- **`.GEN`** — same typeface, weight 600, color `#d0b067` (gold accent)
- **Dot character** — styled as solid circular node, slightly larger than standard punctuation (approx. 1.3× normal dot size), color `#d0b067`
- **Replication motif** — the letter `x` carries 2 slightly offset duplicate layers behind it (ghosted at 25% and 12% opacity), creating a triple-x echo effect. Offset: 2px right + 1px down per layer. This communicates "copies generated from an original" and creates the visual illusion of "xxx".

#### Logotype Variants

| Variant | Usage |
|---|---|
| **Full wordmark** | `x.GEN` — top bar, splash screens, onboarding |
| **Symbol only** | Layered `x` icon — app icon, favicon, small contexts |
| **Wordmark + symbol** | Side by side — marketing, install prompt |

#### Dot Treatment
The dot in `x.GEN` is a **design element**, not punctuation:
- Rendered as a **solid filled circle**, diameter ≈ 7px at 16px type size
- Color: `#d0b067` (gold)
- The dot is the **visual connector** between `x` and the `GEN` segment
- Optional: a subtle hairline (0.5px) connecting dot to the `G` letterform, referencing a neural network node

### 2.3 App Icon / PWA Icon System

#### Concept
A **stylized layered `x` symbol** implying replication. No literal faces or dolls. The icon communicates through symbolic abstraction and scales cleanly from 16px favicon to 512px PWA icon. The triple-layer `x` creates a subtle "xxx" visual effect matching the use-case.

#### Icon Construction

- **Base `x`**: Simple geometric x, stroke-based or filled, rounded terminals (matching the brand's 8px radius system applied at scale)
- **Layer 1 (front)**: Full opacity `#e5e7eb` — the original identity
- **Layer 2 (middle)**: 50% opacity, `#d0b067` gold — first dummy, offset +3px right, +2px down
- **Layer 3 (back)**: 25% opacity, `#f97187` pink — second dummy, offset +6px right, +4px down

#### Icon Sizes Required

| File | Size | Format | Purpose |
|---|---|---|---|
| `favicon.ico` | 16×16, 32×32 | ICO | Browser tab |
| `icon-48.png` | 48×48 | PNG | Android shortcut |
| `icon-72.png` | 72×72 | PNG | Android splash |
| `icon-96.png` | 96×96 | PNG | Android homescreen |
| `icon-128.png` | 128×128 | PNG | General |
| `icon-144.png` | 144×144 | PNG | Windows tile |
| `icon-192.png` | 192×192 | PNG | PWA manifest required |
| `icon-512.png` | 512×512 | PNG | PWA manifest required, Play Store |
| `icon-maskable-192.png` | 192×192 | PNG | PWA maskable (safe zone inner 80%) |
| `icon-maskable-512.png` | 512×512 | PNG | PWA maskable |
| `apple-touch-icon.png` | 180×180 | PNG | iOS add to homescreen |

All icons: background `#131313`, icon centered.

---

## 3. COMPLETE DESIGN SYSTEM

### 3.1 Color System

#### Dark Theme (Default)

```css
:root {
  /* Backgrounds */
  --bg-deep:           #131313;   /* Deepest layer — body, modal overlays */
  --bg-base:           #181818;   /* Base app background */
  --bg-surface:        #272727;   /* Cards, panels, form sections */
  --bg-elevated:       #2f2f2f;   /* Elevated cards, dropdowns, hover states */

  /* Text */
  --text-primary:      #e5e7eb;   /* Body text, primary labels */
  --text-secondary:    #9ca3af;   /* Secondary labels, captions, hints */
  --text-tertiary:     #6b7280;   /* Placeholder text, disabled labels */
  --text-accent:       #d0b067;   /* Gold — brand wordmark, prompt output, headings */

  /* Accent Colors — Semantic Hierarchy */
  --accent-primary:    #f97187;   /* Pink — PRIMARY: action buttons, selected states, FAB, active UI */
  --accent-primary-hover: #e85a72; /* Pink hover */
  --accent-functional: #fb923c;   /* Orange — FUNCTIONAL: icons needing attention, status, hover accents */
  --accent-label:      #d0b067;   /* Gold — IDENTITY/LABEL: wordmark, prompt text, section headings */

  /* Buttons */
  --btn-default-bg:    #131313;
  --btn-default-hover: #3f3f46;
  --btn-primary-bg:    #f97187;
  --btn-primary-hover: #e85a72;
  --btn-primary-text:  #ffffff;

  /* Borders */
  --border-subtle:     rgba(255, 255, 255, 0.08);
  --border-default:    rgba(255, 255, 255, 0.12);
  --border-strong:     rgba(255, 255, 255, 0.20);

  /* Shadows */
  --shadow-card:       0 2px 12px rgba(0, 0, 0, 0.5);
  --shadow-elevated:   0 4px 24px rgba(0, 0, 0, 0.6);
  --shadow-modal:      0 8px 40px rgba(0, 0, 0, 0.8);

  /* States */
  --state-success:     #34d399;
  --state-warning:     #fb923c;   /* Reuses orange accent */
  --state-error:       #f87171;
  --state-info:        #60a5fa;

  /* Special */
  --overlay-dim:       rgba(0, 0, 0, 0.75);
  --loading-overlay:   rgba(19, 19, 19, 0.92);
}
```

#### Light Theme

```css
[data-theme="light"] {
  /* Backgrounds — warm off-white, NOT pure white */
  --bg-deep:           #f0ede8;   /* Warm off-white deepest */
  --bg-base:           #f5f2ee;   /* Warm off-white base */
  --bg-surface:        #ede9e3;   /* Warm light surface */
  --bg-elevated:       #e8e3dc;   /* Warm elevated */

  /* Text */
  --text-primary:      #1a1a1a;
  --text-secondary:    #4a4a4a;
  --text-tertiary:     #7a7a7a;
  --text-accent:       #a0842a;   /* Muted gold for light theme */

  /* Accent — softened for warm light context */
  --accent-primary:    #e55a72;   /* Slightly darker pink for contrast on light */
  --accent-primary-hover: #d04563;
  --accent-functional: #d4761e;   /* Darker orange for visibility */
  --accent-label:      #a0842a;   /* Muted gold */

  /* Buttons */
  --btn-default-bg:    #e8e3dc;
  --btn-default-hover: #dcd7cf;
  --btn-primary-bg:    #e55a72;
  --btn-primary-hover: #d04563;
  --btn-primary-text:  #ffffff;

  /* Borders */
  --border-subtle:     rgba(0, 0, 0, 0.08);
  --border-default:    rgba(0, 0, 0, 0.12);
  --border-strong:     rgba(0, 0, 0, 0.20);

  /* Shadows */
  --shadow-card:       0 2px 12px rgba(0, 0, 0, 0.10);
  --shadow-elevated:   0 4px 24px rgba(0, 0, 0, 0.14);
  --shadow-modal:      0 8px 40px rgba(0, 0, 0, 0.20);

  --overlay-dim:       rgba(0, 0, 0, 0.40);
  --loading-overlay:   rgba(240, 237, 232, 0.92);
}
```

### 3.2 Typography System

```css
:root {
  --font-ui:    'Inter', 'Roboto', -apple-system, sans-serif;
  --font-mono:  'Fira Code', 'JetBrains Mono', 'Courier New', monospace;
}

/* TYPE SCALE */
/* h1 — 28px */
.text-h1   { font-size: 28px; font-weight: 600; line-height: 1.25; font-family: var(--font-ui); }
/* h2 — 24px */
.text-h2   { font-size: 24px; font-weight: 600; line-height: 1.3;  font-family: var(--font-ui); }
/* h3 — 20px */
.text-h3   { font-size: 20px; font-weight: 600; line-height: 1.35; font-family: var(--font-ui); }
/* h4 — 18px */
.text-h4   { font-size: 18px; font-weight: 500; line-height: 1.4;  font-family: var(--font-ui); }
/* body — 14px */
.text-body  { font-size: 14px; font-weight: 400; line-height: 1.6;  font-family: var(--font-ui); }
/* label — 13px */
.text-label { font-size: 13px; font-weight: 500; line-height: 1.4;  font-family: var(--font-ui); }
/* caption — 12px */
.text-cap   { font-size: 12px; font-weight: 400; line-height: 1.5;  font-family: var(--font-ui); }
/* micro — 10px */
.text-micro { font-size: 10px; font-weight: 400; line-height: 1.4;  font-family: var(--font-ui); letter-spacing: 0.04em; }
/* prompt output — monospace */
.text-prompt { font-size: 13px; font-weight: 400; line-height: 1.7; font-family: var(--font-mono); color: var(--text-accent); }
```

**Font Loading:**
```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Fira+Code:wght@400&display=swap" rel="stylesheet">
```
Both fonts must be in the service worker pre-cache.

### 3.3 Spacing System

Base unit: **8px**. All spacing values are multiples of 8px (with a 4px half-step for tight contexts).

```css
:root {
  --space-1:   4px;    /* Tight: icon gap, intra-chip spacing */
  --space-2:   8px;    /* Compact: input padding inline, icon margin */
  --space-3:   12px;   /* Small: label-to-field gap */
  --space-4:   16px;   /* Default: card internal padding, form row gap */
  --space-5:   20px;   /* Medium: section gaps within a page */
  --space-6:   24px;   /* Large: card padding, major gaps */
  --space-8:   32px;   /* XL: section separation */
  --space-10:  40px;   /* XXL: page top/bottom padding */
  --space-12:  48px;   /* Hero spacing */
}
```

**Usage Rules:**
- Between form fields: `--space-4` (16px)
- Card internal padding: `--space-6` (24px)
- Card-to-card gap: `--space-4` (16px)
- Section label to first field: `--space-3` (12px)
- Icon gap to text: `--space-2` (8px)
- Inline chips/swatches gap: `--space-1` (4px) to `--space-2` (8px)

### 3.4 Border Radius System

```css
:root {
  --radius-sm:     4px;    /* Small elements: badges, micro chips */
  --radius-md:     8px;    /* Input fields, buttons, chips, select items */
  --radius-lg:     12px;   /* Cards, panels, section containers */
  --radius-xl:     16px;   /* Modals, bottom sheets, large containers */
  --radius-pill:   999px;  /* Pills: navbar active state, badges, toggles */
  --radius-full:   50%;    /* Circles: color swatches, avatar, FAB */
}
```

### 3.5 Shadow System

```css
:root {
  --shadow-none:     none;
  --shadow-xs:       0 1px 3px rgba(0, 0, 0, 0.3);    /* Subtle lift, small elements */
  --shadow-sm:       0 2px 8px rgba(0, 0, 0, 0.4);    /* Cards at rest */
  --shadow-md:       0 4px 16px rgba(0, 0, 0, 0.5);   /* Cards elevated */
  --shadow-lg:       0 8px 32px rgba(0, 0, 0, 0.6);   /* Modals, FAB */
  --shadow-xl:       0 16px 48px rgba(0, 0, 0, 0.7);  /* Full-screen overlays */
  --shadow-inset:    inset 0 1px 3px rgba(0, 0, 0, 0.3); /* Input fields, pressed states */
}
```

### 3.6 Animation System

```css
:root {
  /* Easing */
  --ease-std:    cubic-bezier(0.4, 0, 0.2, 1);   /* Standard ease-in-out */
  --ease-out:    cubic-bezier(0, 0, 0.2, 1);     /* Decelerate (element entering) */
  --ease-in:     cubic-bezier(0.4, 0, 1, 1);     /* Accelerate (element leaving) */

  /* Durations */
  --dur-micro:   120ms;   /* Micro interactions: swatch select, checkbox check */
  --dur-fast:    160ms;   /* Fast: button hover, icon state change */
  --dur-std:     200ms;   /* Standard: most transitions */
  --dur-enter:   220ms;   /* Entering elements */
  --dur-modal:   240ms;   /* Modal open/close, full overlays */
  --dur-slow:    300ms;   /* Slow: accordion expand, page transition */
}
```

**Animation Rules:**
- All interactive elements use `transition: all var(--dur-std) var(--ease-std)`
- Entering elements: `--dur-enter` with `--ease-out`
- Leaving elements: `--dur-fast` with `--ease-in`
- Modal open: fade-in + scale from 0.96 → 1.0 over `--dur-modal`
- Modal close: fade-out + scale from 1.0 → 0.96 over `--dur-fast`
- Page transitions: fade in/out over `--dur-std`
- Never animate `width`, `height`, or `top/left` for performance reasons — use `transform` and `opacity` only

### 3.7 Component Library

#### 3.7.1 Buttons

```css
/* Base button */
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-2);
  padding: 10px 20px;
  border-radius: var(--radius-md);
  font-size: 14px;
  font-weight: 500;
  font-family: var(--font-ui);
  cursor: pointer;
  border: none;
  outline: none;
  transition: background var(--dur-fast) var(--ease-std),
              transform var(--dur-micro) var(--ease-std),
              box-shadow var(--dur-fast) var(--ease-std);
  -webkit-tap-highlight-color: transparent;
}

.btn:active { transform: scale(0.97); }

/* Default button */
.btn-default {
  background: var(--btn-default-bg);
  color: var(--text-primary);
  border: 1px solid var(--border-default);
}
.btn-default:hover { background: var(--btn-default-hover); }

/* Primary button (pink) */
.btn-primary {
  background: var(--btn-primary-bg);
  color: var(--btn-primary-text);
  box-shadow: 0 2px 8px rgba(249, 113, 135, 0.3);
}
.btn-primary:hover {
  background: var(--btn-primary-hover);
  box-shadow: 0 4px 16px rgba(249, 113, 135, 0.4);
}

/* Ghost button */
.btn-ghost {
  background: transparent;
  color: var(--text-secondary);
  border: 1px solid var(--border-subtle);
}
.btn-ghost:hover {
  background: var(--bg-elevated);
  color: var(--text-primary);
  border-color: var(--border-default);
}

/* Icon button */
.btn-icon {
  width: 40px;
  height: 40px;
  padding: 0;
  border-radius: var(--radius-md);
  background: transparent;
  color: var(--text-secondary);
}
.btn-icon:hover { background: var(--bg-elevated); color: var(--text-primary); }

/* Small variant */
.btn-sm { padding: 7px 14px; font-size: 13px; }

/* Full width */
.btn-full { width: 100%; }

/* Disabled */
.btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
  transform: none !important;
}
```

#### 3.7.2 Cards

```css
.card {
  background: var(--bg-surface);
  border-radius: var(--radius-lg);
  border: 1px solid var(--border-subtle);
  box-shadow: var(--shadow-sm);
  overflow: hidden;
}

.card-body { padding: var(--space-6); }

.card-header {
  padding: var(--space-4) var(--space-6);
  border-bottom: 1px solid var(--border-subtle);
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.card-title {
  font-size: 14px;
  font-weight: 500;
  color: var(--text-accent);   /* Gold label */
  text-transform: uppercase;
  letter-spacing: 0.06em;
}
```

#### 3.7.3 iOS-Style Toggle Switch

```css
.toggle-wrapper {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  cursor: pointer;
}

.toggle {
  position: relative;
  width: 48px;
  height: 28px;
}

.toggle input { opacity: 0; width: 0; height: 0; }

.toggle-track {
  position: absolute;
  inset: 0;
  background: var(--bg-elevated);
  border-radius: var(--radius-pill);
  border: 1px solid var(--border-default);
  transition: background var(--dur-std) var(--ease-std);
}

.toggle input:checked + .toggle-track {
  background: var(--accent-primary);
  border-color: var(--accent-primary);
}

.toggle-thumb {
  position: absolute;
  top: 3px;
  left: 3px;
  width: 20px;
  height: 20px;
  background: #ffffff;
  border-radius: 50%;
  box-shadow: 0 1px 4px rgba(0,0,0,0.3);
  transition: transform var(--dur-std) var(--ease-std);
}

.toggle input:checked ~ .toggle-thumb {
  transform: translateX(20px);
}
```

#### 3.7.4 Slider (Prompt Strength)

```css
.slider-wrapper {
  position: relative;
  padding-bottom: 20px; /* Space for tick labels */
}

.slider {
  -webkit-appearance: none;
  appearance: none;
  width: 100%;
  height: 4px;
  border-radius: var(--radius-pill);
  background: var(--bg-elevated);
  outline: none;
  cursor: pointer;
}

.slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: var(--accent-primary);
  box-shadow: 0 0 0 3px rgba(249,113,135,0.2);
  cursor: grab;
  transition: box-shadow var(--dur-fast) var(--ease-std);
}

.slider::-webkit-slider-thumb:active {
  cursor: grabbing;
  box-shadow: 0 0 0 6px rgba(249,113,135,0.3);
}

/* Tick marks at 25%, 50%, 75%, 100% */
.slider-ticks {
  display: flex;
  justify-content: space-between;
  padding: 4px 10px 0;
}

.slider-tick {
  font-size: 10px;
  color: var(--text-tertiary);
  font-family: var(--font-ui);
}
```

#### 3.7.5 Color Swatches

```css
.swatch-grid {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-2);
}

.swatch {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  border: 2px solid transparent;
  cursor: pointer;
  transition: transform var(--dur-micro) var(--ease-std),
              border-color var(--dur-micro) var(--ease-std),
              box-shadow var(--dur-micro) var(--ease-std);
  position: relative;
}

.swatch:hover {
  transform: scale(1.15);
  box-shadow: 0 2px 8px rgba(0,0,0,0.4);
}

.swatch.selected {
  border-color: var(--accent-primary);
  box-shadow: 0 0 0 2px rgba(249,113,135,0.4);
  transform: scale(1.1);
}

/* Checkmark on selected swatch */
.swatch.selected::after {
  content: '';
  position: absolute;
  inset: 0;
  background: rgba(0,0,0,0.25)
    url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 12 12'%3E%3Cpath d='M2 6l3 3 5-5' stroke='white' stroke-width='1.5' fill='none' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E") center/12px no-repeat;
  border-radius: 50%;
}
```

#### 3.7.6 Image Card Selector (Shape Modal Items)

```css
.image-card-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--space-3);
}

.image-card {
  aspect-ratio: 1;
  border-radius: var(--radius-md);
  overflow: hidden;
  cursor: pointer;
  border: 2px solid transparent;
  position: relative;
  transition: border-color var(--dur-micro) var(--ease-std),
              transform var(--dur-fast) var(--ease-std);
}

.image-card img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.image-card:hover { transform: scale(1.03); }

.image-card.selected {
  border-color: var(--accent-primary);
}

/* Checkmark overlay on selected */
.image-card.selected::after {
  content: '✓';
  position: absolute;
  top: 6px;
  right: 6px;
  width: 20px;
  height: 20px;
  background: var(--accent-primary);
  border-radius: 50%;
  font-size: 11px;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
}

.image-card-label {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 6px 8px;
  background: linear-gradient(transparent, rgba(0,0,0,0.75));
  font-size: 11px;
  color: #ffffff;
  font-weight: 500;
  text-align: center;
}
```

#### 3.7.7 Modal System

```css
.modal-overlay {
  position: fixed;
  inset: 0;
  background: var(--overlay-dim);
  display: flex;
  align-items: flex-end; /* Bottom sheet on mobile */
  justify-content: center;
  z-index: 1000;
  opacity: 0;
  pointer-events: none;
  transition: opacity var(--dur-modal) var(--ease-std);
}

.modal-overlay.open {
  opacity: 1;
  pointer-events: all;
}

.modal {
  background: var(--bg-surface);
  border-radius: var(--radius-xl) var(--radius-xl) 0 0;
  width: 100%;
  max-width: 480px;
  max-height: 85vh;
  overflow-y: auto;
  padding: var(--space-6);
  transform: translateY(24px);
  transition: transform var(--dur-modal) var(--ease-out);
  box-shadow: var(--shadow-modal);
}

.modal-overlay.open .modal {
  transform: translateY(0);
}

/* Desktop: centered card instead of bottom sheet */
@media (min-width: 768px) {
  .modal-overlay { align-items: center; }
  .modal {
    border-radius: var(--radius-xl);
    transform: scale(0.96);
    max-width: 520px;
  }
  .modal-overlay.open .modal { transform: scale(1); }
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: var(--space-5);
}

.modal-title {
  font-size: 16px;
  font-weight: 600;
  color: var(--text-primary);
}

.modal-close {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: var(--bg-elevated);
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text-secondary);
  font-size: 18px;
  transition: background var(--dur-fast) var(--ease-std);
}
.modal-close:hover { background: var(--bg-deep); color: var(--text-primary); }

/* Drag handle for mobile bottom sheets */
.modal-handle {
  width: 40px;
  height: 4px;
  background: var(--border-strong);
  border-radius: var(--radius-pill);
  margin: 0 auto var(--space-5);
}
```

#### 3.7.8 Accordion

```css
.accordion-item {
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-lg);
  overflow: hidden;
  margin-bottom: var(--space-3);
}

.accordion-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--space-4) var(--space-5);
  background: var(--bg-surface);
  cursor: pointer;
  user-select: none;
  transition: background var(--dur-fast) var(--ease-std);
}

.accordion-header:hover { background: var(--bg-elevated); }

.accordion-header.active {
  background: var(--bg-elevated);
  border-bottom: 1px solid var(--border-subtle);
}

.accordion-title {
  font-size: 14px;
  font-weight: 500;
  color: var(--text-primary);
  display: flex;
  align-items: center;
  gap: var(--space-3);
}

.accordion-chevron {
  color: var(--text-tertiary);
  font-size: 12px;
  transition: transform var(--dur-std) var(--ease-std);
}

.accordion-header.active .accordion-chevron {
  transform: rotate(180deg);
}

.accordion-body {
  max-height: 0;
  overflow: hidden;
  transition: max-height var(--dur-slow) var(--ease-std);
  background: var(--bg-surface);
}

.accordion-body.open {
  max-height: 2000px; /* Large enough for any content */
}

.accordion-content { padding: var(--space-5); }
```

#### 3.7.9 Checkbox Grid (Multi-select)

```css
.checkbox-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  gap: var(--space-2);
}

.checkbox-item {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  padding: var(--space-2) var(--space-3);
  border-radius: var(--radius-md);
  border: 1px solid var(--border-subtle);
  cursor: pointer;
  transition: background var(--dur-micro) var(--ease-std),
              border-color var(--dur-micro) var(--ease-std);
  user-select: none;
}

.checkbox-item:hover {
  background: var(--bg-elevated);
  border-color: var(--border-default);
}

.checkbox-item.checked {
  background: rgba(249, 113, 135, 0.08);
  border-color: var(--accent-primary);
}

.checkbox-item input { display: none; }

.checkbox-box {
  width: 16px;
  height: 16px;
  border-radius: 4px;
  border: 1.5px solid var(--border-strong);
  background: transparent;
  flex-shrink: 0;
  transition: background var(--dur-micro), border-color var(--dur-micro);
  display: flex;
  align-items: center;
  justify-content: center;
}

.checkbox-item.checked .checkbox-box {
  background: var(--accent-primary);
  border-color: var(--accent-primary);
}

.checkbox-label {
  font-size: 13px;
  color: var(--text-primary);
  font-weight: 400;
}
```

#### 3.7.10 FAB (Floating Action Button)

```css
.fab-container {
  position: fixed;
  bottom: calc(72px + var(--space-4)); /* Above navbar */
  right: var(--space-5);
  z-index: 100;
  display: flex;
  flex-direction: column-reverse;
  align-items: flex-end;
  gap: var(--space-3);
}

.fab-main {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: var(--accent-primary);
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 16px rgba(249, 113, 135, 0.4);
  transition: transform var(--dur-fast) var(--ease-std),
              box-shadow var(--dur-fast) var(--ease-std);
  color: white;
  font-size: 22px;
}

.fab-main:hover {
  transform: scale(1.08);
  box-shadow: 0 6px 24px rgba(249, 113, 135, 0.5);
}

.fab-main.open { transform: rotate(45deg) scale(1.05); }

/* Terminal action buttons — revealed when FAB is open */
.fab-actions {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: var(--space-2);
  opacity: 0;
  pointer-events: none;
  transform: translateY(16px);
  transition: opacity var(--dur-enter) var(--ease-out),
              transform var(--dur-enter) var(--ease-out);
}

.fab-actions.open {
  opacity: 1;
  pointer-events: all;
  transform: translateY(0);
}

.fab-action-item {
  display: flex;
  align-items: center;
  gap: var(--space-3);
}

.fab-action-label {
  background: var(--bg-surface);
  color: var(--text-primary);
  font-size: 13px;
  font-weight: 500;
  padding: 6px 12px;
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-sm);
  white-space: nowrap;
}

.fab-action-btn {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background: var(--bg-elevated);
  border: 1px solid var(--border-default);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text-primary);
  font-size: 18px;
  box-shadow: var(--shadow-sm);
  transition: background var(--dur-fast) var(--ease-std);
}

.fab-action-btn:hover { background: var(--bg-deep); }
```

#### 3.7.11 Bottom Navigation Bar

```css
.navbar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 64px;
  background: var(--bg-surface);
  border-top: 1px solid var(--border-subtle);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 var(--space-5);
  z-index: 90;
  gap: var(--space-2);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
}

.navbar-track {
  background: var(--bg-elevated);
  border-radius: var(--radius-pill);
  display: flex;
  align-items: center;
  padding: 4px;
  gap: 2px;
}

.navbar-item {
  display: flex;
  align-items: center;
  padding: 8px 12px;
  border-radius: var(--radius-pill);
  cursor: pointer;
  transition: background var(--dur-std) var(--ease-std),
              padding var(--dur-std) var(--ease-std);
  gap: 0;
  overflow: hidden;
  white-space: nowrap;
  color: var(--text-secondary);
}

.navbar-item:hover { color: var(--text-primary); }

.navbar-item.active {
  background: var(--accent-primary);
  color: white;
  padding: 8px 16px;
  gap: var(--space-2);
}

.navbar-icon { font-size: 20px; flex-shrink: 0; }

.navbar-label {
  font-size: 13px;
  font-weight: 500;
  max-width: 0;
  opacity: 0;
  overflow: hidden;
  transition: max-width var(--dur-std) var(--ease-std),
              opacity var(--dur-std) var(--ease-std);
}

/* Width expansion only — icon stays fixed, label fades in */
.navbar-item.active .navbar-label {
  max-width: 80px;
  opacity: 1;
}
```

#### 3.7.12 Top Bar

```css
.top-bar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 56px;
  background: var(--bg-base);
  border-bottom: 1px solid var(--border-subtle);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 var(--space-5);
  z-index: 90;
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
}

.top-bar-brand {
  font-size: 18px;
  font-weight: 600;
  font-family: var(--font-ui);
  letter-spacing: -0.02em;
}

.top-bar-brand .brand-x { color: var(--text-primary); }
.top-bar-brand .brand-gen     { color: var(--text-accent); }  /* ".GEN" in gold */

.top-bar-actions {
  display: flex;
  align-items: center;
  gap: var(--space-2);
}
```

#### 3.7.13 Pill Navbar (Creation Kit Category Tabs)

```css
.pill-navbar {
  display: flex;
  gap: var(--space-2);
  overflow-x: auto;
  padding: var(--space-2) var(--space-4);
  scrollbar-width: none;
  -ms-overflow-style: none;
  background: var(--bg-base);
  border-bottom: 1px solid var(--border-subtle);
  position: sticky;
  top: 56px; /* Below top bar */
  z-index: 80;
}

.pill-navbar::-webkit-scrollbar { display: none; }

.pill-nav-item {
  flex-shrink: 0;
  padding: 7px 16px;
  border-radius: var(--radius-pill);
  border: 1px solid var(--border-subtle);
  background: transparent;
  color: var(--text-secondary);
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: background var(--dur-fast) var(--ease-std),
              color var(--dur-fast) var(--ease-std),
              border-color var(--dur-fast) var(--ease-std);
  white-space: nowrap;
}

.pill-nav-item:hover {
  background: var(--bg-elevated);
  color: var(--text-primary);
}

.pill-nav-item.active {
  background: var(--accent-primary);
  color: white;
  border-color: var(--accent-primary);
}
```

#### 3.7.14 Loading State — Image Generation

```css
/* Full-screen overlay with animated dots */
.gen-loading-overlay {
  position: fixed;
  inset: 0;
  background: var(--loading-overlay);
  backdrop-filter: blur(4px);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  z-index: 200;
  opacity: 0;
  pointer-events: none;
  transition: opacity var(--dur-modal) var(--ease-std);
}

.gen-loading-overlay.active {
  opacity: 1;
  pointer-events: all;
}

.gen-loading-dots {
  display: flex;
  gap: 10px;
  margin-bottom: var(--space-5);
}

.gen-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: var(--accent-primary);
  animation: dot-pulse 1.4s ease-in-out infinite;
}

.gen-dot:nth-child(2) { animation-delay: 0.2s; }
.gen-dot:nth-child(3) { animation-delay: 0.4s; }

@keyframes dot-pulse {
  0%, 80%, 100% { transform: scale(0.8); opacity: 0.5; }
  40%           { transform: scale(1.2); opacity: 1; }
}

.gen-loading-text {
  font-size: 14px;
  color: var(--text-secondary);
  font-family: var(--font-ui);
}

.gen-loading-countdown {
  font-size: 12px;
  color: var(--text-tertiary);
  margin-top: var(--space-2);
  font-family: var(--font-mono);
}

/* Cancel button */
.gen-loading-cancel {
  margin-top: var(--space-6);
  padding: 8px 20px;
  border-radius: var(--radius-pill);
  border: 1px solid var(--border-default);
  background: transparent;
  color: var(--text-secondary);
  font-size: 13px;
  cursor: pointer;
}
```

#### 3.7.15 Error Banner (Venice Bridge)

```css
.error-banner {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  padding: var(--space-3) var(--space-4);
  background: rgba(251, 146, 60, 0.12);  /* Orange tint */
  border: 1px solid rgba(251, 146, 60, 0.3);
  border-radius: var(--radius-md);
  margin-bottom: var(--space-4);
  color: var(--accent-functional);       /* Orange text */
  font-size: 13px;
  font-family: var(--font-ui);
}

.error-banner-icon { font-size: 16px; flex-shrink: 0; }
.error-banner-text { flex: 1; }
.error-banner-action {
  font-size: 12px;
  font-weight: 500;
  text-decoration: underline;
  cursor: pointer;
}
```

#### 3.7.16 Empty States

**Home Page — No Dummies:**
```html
<div class="empty-state">
  <!-- Minimal illustration: placeholder Dummy silhouette grid, muted -->
  <div class="empty-illustration"><!-- AI-generated placeholder illustration --></div>
  <p class="empty-title">No Dummies yet</p>
  <p class="empty-sub">Create your first AI dummy to get started</p>
  <button class="btn btn-primary btn-sm">Create your first Dummy</button>
</div>
```

**The Lab — No Image:**
```html
<div class="empty-state lab-empty">
  <!-- Neutral placeholder illustration: frame with sparkle -->
  <div class="empty-illustration lab-illustration"><!-- Placeholder --></div>
  <p class="empty-title">No image generated yet</p>
  <p class="empty-sub">Generate an image from the Creation Kit</p>
</div>
```

```css
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: var(--space-10) var(--space-6);
  gap: var(--space-4);
}

.empty-title { font-size: 16px; font-weight: 500; color: var(--text-primary); }
.empty-sub   { font-size: 13px; color: var(--text-secondary); max-width: 240px; }
```

#### 3.7.17 Padlock Icon (Field Lock)

```css
.field-lock {
  width: 28px;
  height: 28px;
  border-radius: var(--radius-sm);
  background: transparent;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text-tertiary);
  font-size: 14px;
  transition: color var(--dur-fast) var(--ease-std);
  flex-shrink: 0;
}

.field-lock:hover { color: var(--text-secondary); }
.field-lock.locked { color: var(--accent-functional); } /* Orange when locked */

/* Lock icon: use SVG or Unicode 🔓 / 🔒 */
/* Recommended: inline SVG for crisp rendering at all sizes */
```

---

## 4. FILE STRUCTURE

```
xgen/
├── index.html                          # App shell — single HTML file, all pages via JS
├── manifest.json                       # PWA manifest
├── sw.js                               # Service worker (cache-first, offline)
│
├── css/
│   └── style.css                       # Complete design system + all component styles
│
├── js/
│   ├── app.js                          # Router, init, keyboard shortcuts
│   ├── store.js                        # State management + auto-save + undo stack
│   ├── promptEngine.js                 # Prompt assembly algorithm
│   ├── bridgeManager.js                # Venice bridge communication
│   ├── storageManager.js               # localStorage + IndexedDB abstraction
│   │
│   ├── pages/
│   │   ├── home.js                     # PAGE_Home render + logic
│   │   ├── creationKit.js              # PAGE_Creation_Kit render + logic
│   │   └── theLab.js                   # PAGE_The_Lab render + logic
│   │
│   ├── modules/
│   │   ├── prompter.js                 # MODULE_PROMPTER component
│   │   ├── terminal.js                 # Terminal / FAB actions
│   │   └── presets.js                  # Dolls / Dummies / default Dummies
│   │
│   └── components/
│       ├── navbar.js                   # Bottom navbar render + routing
│       ├── topBar.js                   # Top bar render
│       ├── fab.js                      # FAB expand/collapse + Terminal buttons
│       ├── modal.js                    # Modal system: open, close, content injection
│       ├── colorSwatch.js              # Color swatch picker component
│       ├── imageCard.js                # Image card grid selector
│       ├── accordion.js                # Accordion expand/collapse
│       ├── formRenderer.js             # Renders form fields from JSON schema
│       ├── dummyTabs.js              # Multi-dummy tab switcher
│       ├── onboarding.js               # 3-screen onboarding flow
│       ├── ageGate.js                  # 18+ confirmation modal
│       └── bridgeInstall.js            # Bridge detection + install modal
│
├── data/
│   ├── master_file.json                # Core form data — read-only at runtime
│   ├── addon_file.json                 # User-extendable additions
│   └── defaultDummies.json            # 8 default archetype presets
│
├── assets/
│   ├── icons/                          # All PWA icons (see Section 2.3)
│   ├── modals/                         # Reference images for shape modals
│   │   ├── body_types.png
│   │   ├── ethnicity.png
│   │   ├── face_shapes.png
│   │   ├── eye_shapes.png
│   │   ├── nose_shapes.png
│   │   ├── lip_shapes.png
│   │   ├── bust_shapes.png
│   │   ├── hair_styles.png
│   │   ├── eyebrow_shapes.png
│   │   └── [etc for every shape-modal field]
│   └── placeholders/                   # Default Dummy AI-generated portraits
│   │   ├── goth.jpg
│   │   ├── bimbo.jpg
│   │   ├── gym-girl.jpg
│   │   ├── girl-next-door.jpg
│   │   ├── e-girl.jpg
│   │   ├── baddie.jpg
│   │   ├── soft-girl.jpg
│   │   └── cottagecore.jpg
│
├── userscript/
│   └── xgen-venice-bridge.user.js    # Violentmonkey UserScript
│
└── tests/
    └── promptEngine.test.js            # Prompt engine unit tests (vanilla JS)
```

---

## 5. DATA ARCHITECTURE

### 5.1 master_file.json — Full Schema

```json
{
  "version": "1.0.0",
  "lastUpdated": "2026-01-01",
  "categories": [
    {
      "id": "identity",
      "label": "Identity",
      "icon": "👤",
      "fields": [
        {
          "id": "age",
          "label": "Age",
          "type": "single-select",
          "required": true,
          "options": [
            { "id": "18plus", "label": "+18",  "promptValue": "18+" },
            { "id": "20s",    "label": "20s",   "promptValue": "woman in her 20s" },
            { "id": "30s",    "label": "30s",   "promptValue": "woman in her 30s" },
            { "id": "40s",    "label": "40s",   "promptValue": "woman in her 40s" },
            { "id": "50s",    "label": "50s",   "promptValue": "woman in her 50s" },
            { "id": "60plus", "label": "60+",   "promptValue": "mature woman" }
          ]
        },
        {
          "id": "ethnicity",
          "label": "Ethnicity",
          "type": "shape-modal",
          "required": true,
          "modalImage": "assets/modals/ethnicity.png",
          "options": [
            { "id": "caucasian",      "label": "Caucasian",      "promptValue": "caucasian woman" },
            { "id": "latina",         "label": "Latina",         "promptValue": "latina woman" },
            { "id": "black",          "label": "Black",          "promptValue": "black woman" },
            { "id": "east_asian",     "label": "East Asian",     "promptValue": "east asian woman" },
            { "id": "southeast_asian","label": "SE Asian",       "promptValue": "southeast asian woman" },
            { "id": "south_asian",    "label": "South Asian",    "promptValue": "south asian woman" },
            { "id": "middle_eastern", "label": "Middle Eastern", "promptValue": "middle eastern woman" },
            { "id": "mixed",          "label": "Mixed",          "promptValue": "mixed race woman" }
          ]
        }
      ]
    }
  ]
}
```

See Section 9 for the **complete field definitions for all 13 categories**.

**Field type reference:**

| Type | UI Component |
|---|---|
| `single-select` | Button group or image card grid |
| `multi-select` | Checkbox grid |
| `color-swatch` | Swatch picker grid |
| `shape-modal` | Button that opens an image-grid modal (6 options per modal) |

Every option has a `promptValue` — the exact string injected into the generated prompt.

### 5.2 addon_file.json — Schema & Merge Rules

**Permitted operations:**
- Append options to existing fields
- Add new top-level categories (same schema as `master_file.json` categories)

**Prohibited operations:**
- Modify or remove existing master categories
- Modify or remove existing master fields
- Modify or remove existing master option IDs

**Merge algorithm (runs at app load):**
```javascript
function mergeAddon(master, addon) {
  const result = JSON.parse(JSON.stringify(master)); // deep clone master

  if (!addon || !addon.categories) return result;

  for (const addonCategory of addon.categories) {
    const masterCategory = result.categories.find(c => c.id === addonCategory.id);

    if (masterCategory) {
      // Existing category: merge fields
      for (const addonField of (addonCategory.fields || [])) {
        const masterField = masterCategory.fields.find(f => f.id === addonField.id);
        if (masterField) {
          // Existing field: append options only
          const existingIds = new Set(masterField.options.map(o => o.id));
          for (const opt of (addonField.options || [])) {
            if (!existingIds.has(opt.id)) {
              masterField.options.push({ ...opt, _addon: true });
            }
          }
        }
        // Do NOT add new fields to existing categories from addon (v1 restriction)
      }
    } else {
      // New category from addon
      addonCategory._addon = true;
      result.categories.push(addonCategory);
    }
  }
  return result;
}
```

**Error handling:** Wrap `JSON.parse(addonFile)` in try/catch. On error, log each problematic entry and surface in Settings → Addon Status panel. Never crash the app due to addon errors.

### 5.3 Runtime State (store.js)

```javascript
const state = {
  // Active dummy index (0-based)
  activeDummyIndex: 0,

  // Array of dummy configs (max 3)
  dummies: [
    {
      id: crypto.randomUUID(),
      name: "Dummy 1",
      fields: {},           // { fieldId: value | value[] }
      lockedFields: [],     // field IDs that are locked from randomizer
      referencePhoto: null, // base64 data URL or null
    }
  ],

  // Multi-dummy interaction (independent of individual dummy configs)
  multiDummyInteraction: {
    interactionType: null,
    focus: null,
    relationshipDynamic: null,
    proximity: null,
  },

  // Settings
  settings: {
    theme: "dark",                      // "dark" | "light"
    addonEnabled: false,                // bool
    promptMode: "auto",                 // "auto" | "natural" | "danbooru" | "score"
    qualityTagsMode: "auto",            // "auto" | "manual"
    defaultAspectRatio: "2:3",          // "2:3" | "1:1" | "9:16" | "4:3" | "16:9"
    selectedModel: "chroma",            // "chroma" | "lustify-sdxl" | "lustify-v7" | "z-image-turbo"
    resetLocalData: null,               // action, not a stored value
    addonStatus: { valid: 0, errors: [] },
  },

  // The Lab
  lab: {
    currentJobStatus: "idle",           // "idle" | "sent" | "received" | "generating" | "done" | "failed"
    currentJobNonce: null,
    generatedImages: [],                // stored in IndexedDB, nonces only here
    activeImageIndex: -1,
    errorMessage: null,
    generationStartTime: null,
  },

  // App state
  app: {
    currentPage: "home",                // "home" | "creationKit" | "theLab"
    isOnline: navigator.onLine,
    bridgeDetected: false,
    onboardingComplete: false,
    ageConfirmed: false,
  },

  // Undo stack
  _undoStack: [],   // max 20 entries
  _redoStack: [],
};
```

### 5.4 IndexedDB Schema

Database name: `xgen-db`
Version: `1`

```javascript
const DB_SCHEMA = {
  stores: [
    {
      name: "images",
      keyPath: "nonce",
      indexes: [
        { name: "ts", keyPath: "ts", unique: false }
      ]
      // Stores: { nonce, ts, dataUrl, prompt, negativePrompt, model, width, height, mime, size, generationTime }
    },
    {
      name: "dummies",
      keyPath: "id",
      indexes: [
        { name: "name", keyPath: "name", unique: false },
        { name: "type", keyPath: "type", unique: false }
      ]
      // Stores: { id, type: "doll"|"mannequin"|"default", name, fields, lockedFields, referencePhotoNonce, createdAt, updatedAt }
    },
    {
      name: "referencePhotos",
      keyPath: "id",
      // Stores: { id, dataUrl, filename, size, addedAt }
    }
  ]
};

// History limit: 10 images. On exceeding limit, delete oldest by ts.
const HISTORY_LIMIT = 10;
// Preset limit: 50 total (dolls + dummies combined)
const PRESET_LIMIT = 50;
```

### 5.5 localStorage Keys

```javascript
const STORAGE_KEYS = {
  DUMMIES:        'xgen.dummies',         // Current session dummy configs (JSON)
  SETTINGS:       'xgen.settings',        // Settings object (JSON)
  ACTIVE_STATE:   'xgen.activeState',     // Current unsaved form state (JSON)
  LAB_HISTORY:    'xgen.labHistory',      // Array of nonces (references to IndexedDB)
  ONBOARDING:     'xgen.onboarded',       // "true" when completed
  AGE_CONFIRMED:  'xgen.ageConfirmed',    // "true" when confirmed
  BRIDGE_SEEN:    'xgen.bridgeSeen',      // "true" when install modal was shown
};
```

---

## 6. APP SHELL & SHARED COMPONENTS

### 6.1 index.html Structure

```html
<!DOCTYPE html>
<html lang="en" data-theme="dark">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover">
  <meta name="theme-color" content="#131313">
  <meta name="apple-mobile-web-app-capable" content="yes">
  <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
  <meta name="apple-mobile-web-app-title" content="x.GEN">
  <title>x.GEN</title>
  <link rel="manifest" href="/manifest.json">
  <link rel="apple-touch-icon" href="/assets/icons/apple-touch-icon.png">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Fira+Code&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="/css/style.css">
</head>
<body>
  <!-- Age Gate (shown before anything else on first launch) -->
  <div id="age-gate" hidden></div>

  <!-- Onboarding (shown after age gate, before home, on first launch) -->
  <div id="onboarding-overlay" hidden></div>

  <!-- Bridge missing modal -->
  <div id="bridge-install-modal" hidden></div>

  <!-- App Shell -->
  <div id="app" hidden>
    <!-- Top Bar -->
    <header id="top-bar"></header>

    <!-- Page Container (padded for top-bar + bottom-navbar) -->
    <main id="page-container"
          style="padding-top: 56px; padding-bottom: 80px; min-height: 100dvh;">
    </main>

    <!-- Bottom Navigation -->
    <nav id="bottom-navbar"></nav>

    <!-- FAB -->
    <div id="fab-container"></div>

    <!-- Generation Loading Overlay -->
    <div id="gen-loading-overlay" class="gen-loading-overlay"></div>
  </div>

  <!-- Global Modal Overlay -->
  <div id="modal-overlay" class="modal-overlay"></div>

  <!-- Scripts (ES modules) -->
  <script type="module" src="/js/app.js"></script>
</body>
</html>
```

### 6.2 Routing (app.js)

```javascript
// Minimal hash-based router — no dependencies
const ROUTES = {
  '#home':        'home',
  '#creation-kit':'creationKit',
  '#the-lab':     'theLab',
};

function navigate(page) {
  window.location.hash = Object.entries(ROUTES).find(([,v]) => v === page)?.[0] || '#home';
}

function handleRoute() {
  const page = ROUTES[window.location.hash] || 'home';
  store.setState({ app: { ...store.state.app, currentPage: page } });
  renderPage(page);
  updateNavbar(page);
}

window.addEventListener('hashchange', handleRoute);
window.addEventListener('load', handleRoute);
```

### 6.3 Page Padding

All pages use:
- `padding-top: 56px` (top bar height)
- `padding-bottom: 80px` (navbar + safe area)
- On iOS: `padding-bottom: calc(80px + env(safe-area-inset-bottom))`

---

## 7. PAGES

### 7.1 PAGE — Home

**Layout:**
```
[TOP BAR]
─────────────────────
[Section: Default Dummies — 8 cards]
  Title: "Dummies"  (gold label)
  Subtitle: "Read-only archetypes. Save as Doll or Mannequin to customize."
  Grid: 2 columns (mobile) / 4 columns (desktop)
  Card: portrait photo + archetype name + "Use" button
─────────────────────
[Section: My Dolls]
  Title: "Dolls"  (gold label)
  Subtitle: "Your saved consistent dummies"
  Grid: 2 columns (mobile) / 4 columns (desktop)
  Empty state: "No Dolls saved yet" + Create CTA
─────────────────────
[Section: My Dummies]
  Title: "Dummies"  (gold label)
  Subtitle: "Partial presets for batch randomization"
  Grid: 2 columns (mobile) / 4 columns (desktop)
  Empty state: "No Dummies saved yet"
─────────────────────
[BOTTOM NAVBAR]  [FAB]
```

**Preset Card Component:**
```css
.preset-card {
  aspect-ratio: 2/3;                  /* Portrait orientation */
  border-radius: var(--radius-lg);
  overflow: hidden;
  position: relative;
  cursor: pointer;
  border: 1px solid var(--border-subtle);
  transition: transform var(--dur-fast) var(--ease-std);
}

.preset-card:hover { transform: scale(1.02); }

.preset-card img {
  width: 100%; height: 100%; object-fit: cover;
}

.preset-card-footer {
  position: absolute;
  bottom: 0; left: 0; right: 0;
  padding: var(--space-3) var(--space-4);
  background: linear-gradient(transparent, rgba(0,0,0,0.85));
}

.preset-card-name {
  font-size: 14px; font-weight: 600; color: white;
}

.preset-card-type {
  font-size: 11px; color: rgba(255,255,255,0.6); text-transform: uppercase;
  letter-spacing: 0.05em;
}

/* Lock badge for Dummies */
.preset-card-lock-badge {
  position: absolute; top: 8px; right: 8px;
  background: rgba(251,146,60,0.9);
  color: white; font-size: 10px; font-weight: 500;
  padding: 2px 7px; border-radius: var(--radius-pill);
}

/* Overflow menu (3-dot) on user presets */
.preset-card-menu {
  position: absolute; top: 8px; right: 8px;
  width: 28px; height: 28px;
  background: rgba(0,0,0,0.5); border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  color: white; font-size: 16px; cursor: pointer;
}
```

**Home Page Actions per card type:**
- Default Dummies: `[Use]` → loads into Creation Kit; `[Save As...]` → modal to save as Doll or Mannequin
- Dolls: `[Use]` → loads into Creation Kit; `[Edit]` → loads as editable; `[Delete]`
- Dummies: `[Use]` → loads with locks applied; `[Edit]` → edit lock config; `[Delete]`

### 7.2 PAGE — Creation Kit

**Mobile Layout:**
```
[TOP BAR — App name left, theme/settings right]
────────────────────────────────
[DUMMY TABS — if >1 dummy configured]
  [ Dummy 1 ] [ Dummy 2 ] [ + Add ]
────────────────────────────────
[MODULE_PROMPTER — sticky, collapsible]
  Prompt strength bar + positive prompt preview (monospace, gold, 3 lines max)
  [Collapse/expand arrow]
────────────────────────────────
[CREATION_KIT_PILL_NAVBAR — sticky, horizontal scroll]
  [ Identity ] [ Physique ] [ Bust ] [ Lower Body ] [ Face ] [ Hair ]
  [ Makeup ] [ Clothing ] [ Location ] [ Lighting ] [ Camera ]
  [ Posing ] [ Multi ]
────────────────────────────────
[CREATION_KIT_WINDOW — main scrollable area]
  Active category content renders here
  Accordion-based: one section open at a time within a category
  Swipeable left/right to navigate categories
────────────────────────────────
[BOTTOM NAVBAR]  [FAB — with Terminal actions]
```

**Category Window Behavior:**
- Swipe left → next category in pill navbar
- Swipe right → previous category
- Tap pill navbar item → jump to that category
- Category content scrolls vertically within the window
- Only one accordion open at a time within a category

**MODULE_PROMPTER (collapsed state):**
```
[Strength Bar: ████░░░░ 5/13 fields]
[Positive: "athletic caucasian woman, 20s, slim, natural makeup..."]
```

**MODULE_PROMPTER (expanded state):** See Section 8.1.

### 7.3 PAGE — The Lab

**Mobile Layout:**
```
[TOP BAR]
────────────────────────────────
[IMAGE_VIEWER — 40vh]
  If no image: empty state illustration
  If image: full-bleed with aspect ratio preserved
  Controls: ◀ prev | image 1/10 | next ▶
────────────────────────────────
[IMAGE_ACTIONS]
  [↓ Download] [⎘ Copy] [⛶ Full Screen] [⧉ Copy Prompt]
────────────────────────────────
[IMAGE_METADATA]
  Model: Chroma1-HD  |  Time: 12.4s  |  "athletic caucasian..."
────────────────────────────────
[HISTORY_STRIP — horizontal scroll]
  Thumbnail 1  Thumbnail 2  Thumbnail 3  ...  (up to 10)
────────────────────────────────
[MODULE_PROMPTER — read-only]
  Positive Prompt (read-only, copyable)
  Negative Prompt (read-only)
────────────────────────────────
[VENICE BRIDGE STATUS PANEL]
  Status: idle / sent / generating / done / failed
  [Generate] button (primary)
  Error banner (orange, conditional)
────────────────────────────────
[BOTTOM NAVBAR]  [FAB]
```

**Image Viewer — Zoom:**
- Mobile: pinch-to-zoom (touch events), double-tap to toggle fit/fill
- Desktop: scroll wheel to zoom, click-drag to pan
- Max zoom: 4×, min zoom: fit-to-container

**Image Actions (v1 only):**
```javascript
const LAB_ACTIONS_V1 = [
  { id: 'download',     label: 'Download',    icon: '↓',  action: downloadCurrentImage },
  { id: 'copy-image',   label: 'Copy',        icon: '⎘',  action: copyCurrentImageToClipboard },
  { id: 'fullscreen',   label: 'Full Screen', icon: '⛶',  action: openFullscreen },
  { id: 'copy-prompt',  label: 'Copy Prompt', icon: '¶',  action: copyPromptUsed },
];
// NOT in v1: Share, Delete, Regenerate
```

---

## 8. MODULES

### 8.1 MODULE_PROMPTER

**Responsibilities:**
- Show real-time assembled positive prompt (read-only, monospace, gold text)
- Show real-time assembled negative prompt (read-only, monospace, muted)
- Prompt strength indicator: `activeFields / totalFields` normalized to 0–100%
- Word count, token estimate, field count summary

**Component:**
```
┌─────────────────────────────────────┐
│ PROMPT STRENGTH                      │
│ ████████░░░░░░░░░░ 8 / 13 fields    │
│                                     │
│ POSITIVE ─────────────────────────── │
│ athletic caucasian woman, 20s,       │
│ slim figure, long blonde hair,       │
│ blue eyes, natural makeup, ...       │
│                                     │
│ NEGATIVE ─────────────────────────── │
│ low quality, blurry, deformed, ...   │
│                                     │
│ 42 words · ~58 tokens · 8 fields    │
└─────────────────────────────────────┘
```

**Prompt Strength Calculation:**
```javascript
function calculatePromptStrength(fields, allCategories) {
  // Count active fields (has at least one selected value)
  const activeFields = Object.values(fields).filter(v => {
    if (Array.isArray(v)) return v.length > 0;
    return v !== null && v !== undefined && v !== '';
  }).length;

  // Total possible fields
  const totalFields = allCategories.reduce((sum, cat) =>
    sum + cat.fields.length, 0);

  return Math.round((activeFields / totalFields) * 100);
}
```

### 8.2 MODULE_TERMINAL (FAB Actions)

**Actions:**
1. **Duplicate** — Copies positive prompt to clipboard. Shows toast: "Prompt copied!"
2. **Randomizer** — Randomizes all unlocked fields. Locked fields: skip (no animation, no change).
3. **Reset All** — Clears all field values for the active Dummy. Undo-able.

**Randomizer algorithm:**
```javascript
function randomizeFields(currentFields, allCategories, lockedFields) {
  const newFields = { ...currentFields };

  for (const category of allCategories) {
    for (const field of category.fields) {
      if (lockedFields.includes(field.id)) continue; // Skip locked

      if (field.type === 'multi-select') {
        // Select 0–3 random options
        const count = Math.floor(Math.random() * 4);
        const shuffled = [...field.options].sort(() => Math.random() - 0.5);
        newFields[field.id] = shuffled.slice(0, count).map(o => o.id);
      } else {
        // Single select: pick one random option (or null for 20% chance)
        if (Math.random() < 0.2) {
          newFields[field.id] = null;
        } else {
          const opt = field.options[Math.floor(Math.random() * field.options.length)];
          newFields[field.id] = opt.id;
        }
      }
    }
  }

  return newFields;
}
// Note: v1 uses uniform random selection, no weighted probabilities
```

**Prompter Addon** (settings-unlocked Terminal options):
- **Get 5** — Run 5 generate calls with randomized unlocked fields between each
- **Scene 3** — Run 3 generate calls keeping identity/look locked, randomizing scene-related fields only (Location, Lighting, Camera)
- **Prompt Mode Override** — dropdown: Auto / Natural Language / Danbooru / Score Tags
- **Quality Tags Override** — toggle: Auto / Manual
- **Aspect Ratio** — selector

### 8.3 MODULE_PRESETS

Handles:
- Loading default Dummies from `defaultDummies.json`
- Loading user Dolls and Dummies from IndexedDB
- Saving current state as Doll or Mannequin
- Enforcing 50-preset combined limit

```javascript
async function saveAsPreset(type, name, state) {
  const count = await getPresetCount();
  if (count >= 50) {
    showModal('Preset limit reached', 'You have 50 saved presets. Delete one to save a new one.');
    return;
  }

  const preset = {
    id: crypto.randomUUID(),
    type,                              // "doll" | "mannequin"
    name,
    fields: state.dummies[state.activeDummyIndex].fields,
    lockedFields: state.dummies[state.activeDummyIndex].lockedFields
      ? state.dummies[state.activeDummyIndex].lockedFields
      : [],
    referencePhotoNonce: state.dummies[state.activeDummyIndex].referencePhotoNonce || null,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  };

  await db.put('dummies', preset);
}
```

---

## 9. THE FORM — ALL 13 CATEGORIES

> **Rendering Rules:**
> - `SS` = Single-select (button group or image card grid)
> - `MS` = Multi-select (checkbox grid)
> - `SW` = Color swatch picker
> - `SM` = Shape modal (opens image grid modal with 6 options acting as buttons)
> - Only one accordion section open at a time per category
> - No free-text input anywhere on the form
> - All field values come from predefined options with `promptValue` strings

### 9.1 Identity

| Field | Type | Options |
|---|---|---|
| Age | SS | +18, 20s, 30s, 40s, 50s, 60+ |
| Ethnicity | SM | Caucasian, Latina, Black, East Asian, SE Asian, South Asian, Middle Eastern, Mixed |

### 9.2 Physique

| Field | Type | Options |
|---|---|---|
| Body Type | SM | Skinny, Slim, Athletic, Toned, Average, Curvy, Voluptuous, BBW, Petite |
| Height | SS | Very Short, Short, Average, Tall, Very Tall |
| Skin Tone | SW | Fair, Light, Medium, Olive, Tan, Brown, Deep Brown, Ebony |
| Skin Detail | MS | Smooth, Natural, Freckles, Light tan lines, Tattoos, Piercings, Moles/Beauty marks |

### 9.3 Bust

| Field | Type | Options |
|---|---|---|
| Size | SM | Flat, Small (A), Medium (B-C), Large (D-E), Extra Large (F+), Massive |
| Shape | SM | Perky, Round, Natural, Teardrop, Wide-set, Close-set |
| Nipples | SS | Default, Small, Large, Dark, Light, Pierced |
| Bust State | MS | Natural, Lifted, Pushed up, Exposed, Partially exposed |

### 9.4 Lower Body

| Field | Type | Options |
|---|---|---|
| Waist | SS | Very slim, Slim, Average, Defined, Soft |
| Hips | SS | Narrow, Average, Wide, Very wide |
| Ass | SM | Flat, Small, Average, Round, Bubble, Large, Extra Large |
| Legs | SS | Slim, Toned, Average, Thick, Very thick |

### 9.5 Face

| Field | Type | Options |
|---|---|---|
| Face Shape | SM | Oval, Round, Square, Heart, Diamond, Oblong |
| Eyes | SM | Almond, Round, Upturned, Downturned, Hooded, Monolid |
| Eye Color | SW | Brown, Dark Brown, Hazel, Green, Blue, Gray, Amber, Violet |
| Nose | SM | Button, Upturned, Straight, Roman, Wide, Narrow |
| Lips | SM | Thin, Medium, Full, Pouty, Heart-shaped, Wide |
| Eyebrows | SM | Thin, Arched, Straight, Bushy, Feathered, Sharp |

### 9.6 Hair

| Field | Type | Options |
|---|---|---|
| Color | SW | Black, Dark Brown, Brown, Light Brown, Dirty Blonde, Blonde, Platinum, Auburn, Red, Ginger, Pink, Blue, Purple, Green, White, Gray, Ombre, Highlighted |
| Length | SS | Buzzcut, Pixie, Ear-length, Chin-length, Shoulder-length, Mid-back, Long, Extra Long, Waist-length |
| Style | MS | Straight, Wavy, Curly, Coiled, Braided, Ponytail, Bun, Half-up, Bangs, Side-swept, Messy, Slicked back |

### 9.7 Makeup

| Field | Type | Options |
|---|---|---|
| Foundation | SS | None, Natural, Matte, Dewy, Heavy |
| Eye Makeup | MS | None, Mascara, Eyeliner, Smoky eye, Cut crease, Colored shadow, Graphic liner |
| Eye Shadow Color | SW | Neutral, Brown, Pink, Red, Purple, Blue, Green, Gold, Black, Glitter |
| Lashes | SS | None, Natural, Wispy, Full, Extra dramatic |
| Lip Makeup | SS | None, Nude, Pink, Red, Berry, Coral, Gloss, Matte dark |
| Blush / Effects | MS | None, Subtle blush, Heavy blush, Highlight, Contour, Bronzer, Shimmer, Glass skin |

### 9.8 Clothing

> **Mutual exclusivity rule:**
> - Selecting **Complete Outfit** → disables and clears Upper Layer, Lower Layer, Legwear, Footwear fields
> - Editing any **Upper/Lower Layer** field → clears Complete Outfit selection
> - Selecting **Nude** (a Complete Outfit option) → additionally clears Legwear, Footwear, Accessories

| Field | Type | Options |
|---|---|---|
| **Complete Outfit** | SS | Nude, Lingerie set, Bikini, Casual, Streetwear, Formal, Evening gown, Athletic, School uniform, Swimwear, Cosplay |
| **— OR — Upper Layer** | | |
| Upper Type | SS | Top, Bra, Bikini Top, Crop top, Button shirt, Jacket, Hoodie, Naked |
| Upper Style | MS | Basic, Sheer, Lace, Cut-out, Off-shoulder, Strapless, Wrap, Bodysuit |
| Upper Color | SW | White, Black, Red, Pink, Blue, Green, Yellow, Purple, Orange, Nude, Camo, Floral, Print |
| Upper Material | SS | Cotton, Silk, Lace, Leather, Latex, Sheer, Knit, Denim, Satin |
| Upper Fit | SS | Tight, Fitted, Loose, Oversized, Bandage |
| **— OR — Lower Layer** | | |
| Lower Type | SS | Pants, Jeans, Skirt, Mini skirt, Shorts, Thong, Panties, Bikini Bottom, Naked |
| Lower Style | MS | Basic, Distressed, Pleated, Wrap, Flared, Pencil, Bodycon |
| Lower Color | SW | White, Black, Red, Pink, Blue, Green, Yellow, Purple, Orange, Nude, Camo, Denim, Print |
| Lower Material | SS | Cotton, Denim, Silk, Lace, Leather, Latex, Knit, Satin |
| Lower Fit | SS | Tight, Fitted, Loose, Oversized, Flared |
| **Legwear** | MS | None, Stockings, Thigh-highs, Fishnets, Ankle socks, Knee socks, Leggings, Tights |
| **Footwear** | SS | Barefoot, Heels, Stilettos, Platform heels, Sneakers, Boots, Knee-high boots, Sandals, Mules |
| **Accessories** | MS | Necklace, Choker, Earrings, Bracelet, Ring, Anklet, Sunglasses, Hat, Cap, Belt, Bag, Watch, Body chain |

### 9.9 Location

| Field | Type | Options |
|---|---|---|
| Location | SS | Bedroom, Bathroom, Living room, Kitchen, Office, Hotel room, Pool, Beach, Outdoors park, Urban street, Studio, Car, Rooftop, Gym, Club |
| Scene | SS | Indoor, Outdoor, Fantasy / Dreamlike, Urban, Nature, Minimalist studio |
| Background | SS | Blurred (bokeh), Detailed, Minimal / Plain, Colorful, Dark |
| Time of Day | SS | Morning, Afternoon, Golden hour, Sunset, Blue hour, Night |

### 9.10 Lighting

| Field | Type | Options |
|---|---|---|
| Style | SS | Natural, Soft studio, Hard studio, Cinematic, Neon, Candlelight / Warm, Backlit / Silhouette, Fairy lights |
| Color | SW | White/Neutral, Warm, Cool, Pink, Blue, Purple, Red, Amber, Teal, Green, Mixed RGB |
| Effects | MS | Soft shadows, Hard shadows, Lens flare, Rim light, Catch lights, God rays, Glitter / Sparkle, Low key, High key |

### 9.11 Camera

| Field | Type | Options |
|---|---|---|
| Framing | SS | Close-up (face), Portrait (head-to-shoulder), Half-body, Three-quarter, Full body, Wide shot, Over-shoulder, POV |
| Lens | SS | 24mm (wide), 35mm, 50mm (natural), 85mm (portrait), 135mm (compressed), Macro, Fisheye |
| Angle | SS | Eye level, Slightly low, Low angle, Slightly high, High angle (bird's eye), Dutch tilt |
| Depth of Field | SS | Shallow (blurred background), Deep (everything sharp), Medium |

### 9.12 Posing & Expression

**Pose field rules:**
- Multi-select, max 2 poses
- Compatibility check: the following pose pairs are **incompatible** and must be enforced:
  - Standing + Lying → blocked
  - Standing + Kneeling (prone) → blocked
  - Sitting + Lying → blocked
  - Any other pairs: allowed

**Incompatibility enforcement:**
- When user tries to select a third pose: show inline message "Max 2 poses selected"
- When user selects an incompatible second pose: deselect the first, select the new one, show inline message "Poses adjusted for compatibility"

| Field | Type | Options |
|---|---|---|
| Pose | MS (max 2) | Standing, Sitting, Lying down, Kneeling, Kneeling (prone), Arching, Reaching up, Leaning, Lying on side, All fours |
| Expression | SS | Neutral, Smiling, Laughing, Seductive, Sultry, Playful, Pouty, Serious, Surprised, Shy, Biting lip |
| Eye Contact | SS | Direct (into camera), Looking away, Downcast, Eyes closed, Looking up |

### 9.13 Multi-Dummy

> **Design note:** This category is always independent of individual Dummy configurations.
> It describes the **interaction between Dummies** in the generated scene.
> This section is only visible / active when 2 or more Dummies are configured.

| Field | Type | Options |
|---|---|---|
| Interaction Type | SS | Solo (default), Side by side, Sitting together, Embracing, Back-to-back, Facing each other, Collab pose, Playful interaction |
| Focus | SS | Equal / Both, Focus on Dummy 1, Focus on Dummy 2, Focus on Dummy 3 |
| Relationship Dynamic | SS | Friends, Romantic couple, Rivals, Strangers, Colleagues |
| Proximity | SS | Close (touching), Medium (arm's length), Distant (same scene) |

---

## 10. PROMPT ENGINE ALGORITHM

**File:** `js/promptEngine.js`

### 10.1 Model Registry

```javascript
const MODELS = {
  'chroma': {
    id: 'chroma',
    label: 'Chroma1-HD',
    promptMode: 'natural',          // Always use natural language
    cfgScale: 7,
    steps: 20,
    sampler: 'dpm++_2m_sde',
    defaultNegative: [
      'low quality', 'worst quality', 'blurry', 'deformed', 'disfigured',
      'bad anatomy', 'extra limbs', 'missing limbs', 'watermark', 'text',
      'signature', 'ugly', 'gross', 'overexposed', 'underexposed',
    ],
    qualityPrefix: [],              // Chroma/FLUX models don't need score tags
    // Natural language: full descriptive sentences
  },

  'lustify-sdxl': {
    id: 'lustify-sdxl',
    label: 'Lustify SDXL',
    promptMode: 'danbooru',         // Danbooru comma-tag format
    cfgScale: 3.0,                  // Low CFG — Lustify SDXL is very prompt-adherent
    steps: 30,
    sampler: 'dpm++_2m_sde',
    defaultNegative: [
      'score_1', 'score_2', 'score_3', 'score_4', 'score_5',
      'low quality', 'worst quality', 'blurry', 'bad anatomy',
      'deformed', 'extra limbs', 'watermark', 'text', 'ugly',
    ],
    qualityPrefix: ['score_9', 'score_8_up', 'score_7_up'],
    // Danbooru: comma-separated tags in order, no full sentences
  },

  'lustify-v7': {
    id: 'lustify-v7',
    label: 'Lustify v7',
    promptMode: 'danbooru',
    cfgScale: 3.5,
    steps: 30,
    sampler: 'dpm++_2m_sde',
    defaultNegative: [
      'score_1', 'score_2', 'score_3', 'score_4',
      'low quality', 'worst quality', 'blurry', 'bad anatomy',
      'deformed', 'extra limbs', 'watermark', 'text',
    ],
    qualityPrefix: ['score_9', 'score_8_up', 'score_7_up'],
  },

  'z-image-turbo': {
    id: 'z-image-turbo',
    label: 'Z-Image Turbo',
    promptMode: 'natural',          // Natural language, short prompts
    cfgScale: 4,                    // Range: 3–5
    steps: 12,                      // Range: 8–20 — turbo model, low steps
    sampler: 'dpm_sde',             // Fast sampler
    defaultNegative: [
      'low quality', 'blurry', 'deformed', 'bad anatomy',
      'watermark', 'text', 'ugly',
    ],
    qualityPrefix: [],              // No score tags needed
    // Keep prompts short and focused for turbo model
  },
};
```

### 10.2 Prompt Assembly

**Positive Prompt Assembly Order (applies to both Natural Language and Danbooru modes):**

```
1. Quality prefix (model-specific, e.g. "score_9, score_8_up, score_7_up")
2. Photography/style framing (e.g. "photorealistic", "photography", "RAW photo")
3. Ethnicity
4. Age
5. Body type + height
6. Skin tone + skin details
7. Bust
8. Lower body
9. Face shape
10. Eyes (shape + color)
11. Nose
12. Lips
13. Eyebrows
14. Hair (color + length + style)
15. Makeup
16. Clothing (complete outfit OR upper/lower layers)
17. Accessories
18. Location + scene
19. Background
20. Time of day
21. Lighting (style + color + effects)
22. Camera (framing + lens + angle + depth of field)
23. Pose + expression + eye contact
24. Multi-dummy interaction (only if multiple dummies)
```

### 10.3 Natural Language Assembly

```javascript
function assembleNaturalLanguage(fields, model) {
  const parts = [];

  if (model.qualityPrefix.length) {
    parts.push(model.qualityPrefix.join(', '));
  }

  parts.push('photorealistic photography, RAW photo');

  // Identity
  const ethnicity = getPromptValue(fields, 'ethnicity');
  const age = getPromptValue(fields, 'age');
  if (ethnicity && age) parts.push(`${ethnicity}, ${age}`);
  else if (ethnicity) parts.push(ethnicity);
  else if (age) parts.push(age);

  // Physique
  const bodyType = getPromptValue(fields, 'body_type');
  const height = getPromptValue(fields, 'height');
  const skinTone = getPromptValue(fields, 'skin_tone');
  if (bodyType || height) parts.push([height, bodyType].filter(Boolean).join(', '));
  if (skinTone) parts.push(`${skinTone} skin`);

  const skinDetails = getPromptValues(fields, 'skin_detail');
  if (skinDetails.length) parts.push(skinDetails.join(', '));

  // Bust
  const bustSize = getPromptValue(fields, 'bust_size');
  const bustShape = getPromptValue(fields, 'bust_shape');
  if (bustSize) parts.push(`${bustShape ? bustShape + ', ' : ''}${bustSize} breasts`);

  // Lower body
  const hips = getPromptValue(fields, 'hips');
  const ass = getPromptValue(fields, 'ass');
  const legs = getPromptValue(fields, 'legs');
  if (hips || ass || legs) parts.push([hips, ass, legs].filter(Boolean).join(', '));

  // Face
  const faceShape = getPromptValue(fields, 'face_shape');
  const eyeShape = getPromptValue(fields, 'eye_shape');
  const eyeColor = getPromptValue(fields, 'eye_color');
  const nose = getPromptValue(fields, 'nose');
  const lips = getPromptValue(fields, 'lips');
  if (faceShape) parts.push(`${faceShape} face`);
  if (eyeShape || eyeColor) parts.push([eyeColor, eyeShape, 'eyes'].filter(Boolean).join(' '));
  if (nose) parts.push(`${nose} nose`);
  if (lips) parts.push(`${lips} lips`);

  // Hair
  const hairColor = getPromptValue(fields, 'hair_color');
  const hairLength = getPromptValue(fields, 'hair_length');
  const hairStyles = getPromptValues(fields, 'hair_style');
  if (hairColor || hairLength || hairStyles.length) {
    parts.push([hairColor, hairLength, hairStyles.join(', '), 'hair'].filter(Boolean).join(' '));
  }

  // Makeup
  const foundation = getPromptValue(fields, 'foundation');
  const eyeMakeup = getPromptValues(fields, 'eye_makeup');
  const lipMakeup = getPromptValue(fields, 'lip_makeup');
  const blushEffects = getPromptValues(fields, 'blush_effects');
  const makeupParts = [foundation, ...eyeMakeup, lipMakeup, ...blushEffects].filter(Boolean);
  if (makeupParts.length) parts.push(`${makeupParts.join(', ')} makeup`);

  // Clothing
  const completeOutfit = getPromptValue(fields, 'complete_outfit');
  if (completeOutfit) {
    parts.push(completeOutfit === 'nude' ? 'nude, naked' : `wearing ${completeOutfit}`);
  } else {
    const upperType = getPromptValue(fields, 'upper_type');
    const upperStyle = getPromptValues(fields, 'upper_style');
    const upperColor = getPromptValue(fields, 'upper_color');
    const upperMaterial = getPromptValue(fields, 'upper_material');
    const upperFit = getPromptValue(fields, 'upper_fit');
    if (upperType && upperType !== 'naked') {
      parts.push([upperFit, upperStyle.join(', '), upperColor, upperMaterial, upperType].filter(Boolean).join(' '));
    }

    const lowerType = getPromptValue(fields, 'lower_type');
    const lowerColor = getPromptValue(fields, 'lower_color');
    const lowerFit = getPromptValue(fields, 'lower_fit');
    if (lowerType && lowerType !== 'naked') {
      parts.push([lowerFit, lowerColor, lowerType].filter(Boolean).join(' '));
    }
  }

  const legwear = getPromptValues(fields, 'legwear');
  if (legwear.length && !legwear.includes('none')) parts.push(legwear.join(', '));

  const footwear = getPromptValue(fields, 'footwear');
  if (footwear && footwear !== 'barefoot') parts.push(footwear);

  const accessories = getPromptValues(fields, 'accessories');
  if (accessories.length) parts.push(accessories.join(', '));

  // Scene
  const location = getPromptValue(fields, 'location');
  const scene = getPromptValue(fields, 'scene');
  const background = getPromptValue(fields, 'background');
  const timeOfDay = getPromptValue(fields, 'time_of_day');
  if (location) parts.push(`in a ${location}`);
  if (scene) parts.push(scene);
  if (background) parts.push(`${background} background`);
  if (timeOfDay) parts.push(timeOfDay);

  // Lighting
  const lightStyle = getPromptValue(fields, 'lighting_style');
  const lightColor = getPromptValue(fields, 'lighting_color');
  const lightEffects = getPromptValues(fields, 'lighting_effects');
  if (lightStyle || lightColor || lightEffects.length) {
    parts.push([lightColor, lightStyle, 'lighting', ...lightEffects].filter(Boolean).join(', '));
  }

  // Camera
  const framing = getPromptValue(fields, 'camera_framing');
  const lens = getPromptValue(fields, 'camera_lens');
  const angle = getPromptValue(fields, 'camera_angle');
  const dof = getPromptValue(fields, 'depth_of_field');
  if (framing) parts.push(framing);
  if (lens) parts.push(`${lens} lens`);
  if (angle) parts.push(angle);
  if (dof) parts.push(dof);

  // Pose & expression
  const poses = getPromptValues(fields, 'pose');
  const expression = getPromptValue(fields, 'expression');
  const eyeContact = getPromptValue(fields, 'eye_contact');
  if (poses.length) parts.push(poses.join(', '));
  if (expression) parts.push(expression);
  if (eyeContact) parts.push(eyeContact);

  return parts.filter(Boolean).join(', ');
}
```

### 10.4 Danbooru Tag Assembly

```javascript
function assembleDanbooru(fields, model) {
  const tags = [];

  // Quality prefix first
  if (model.qualityPrefix.length) {
    tags.push(...model.qualityPrefix);
  }

  // Photography tags for realism
  tags.push('photorealistic', '1girl');

  // All other fields: same order as natural language but as bare tags (promptValues)
  // promptValues in danbooru mode are already in tag format (e.g., "blonde hair" not "she has blonde hair")
  const fieldOrder = [
    'ethnicity', 'age', 'body_type', 'height', 'skin_tone', 'skin_detail',
    'bust_size', 'bust_shape', 'nipples', 'bust_state',
    'waist', 'hips', 'ass', 'legs',
    'face_shape', 'eye_shape', 'eye_color', 'nose', 'lips', 'eyebrows',
    'hair_color', 'hair_length', 'hair_style',
    'foundation', 'eye_makeup', 'eye_shadow_color', 'lashes', 'lip_makeup', 'blush_effects',
    'complete_outfit', 'upper_type', 'upper_style', 'upper_color', 'upper_material', 'upper_fit',
    'lower_type', 'lower_style', 'lower_color', 'lower_fit',
    'legwear', 'footwear', 'accessories',
    'location', 'scene', 'background', 'time_of_day',
    'lighting_style', 'lighting_color', 'lighting_effects',
    'camera_framing', 'camera_lens', 'camera_angle', 'depth_of_field',
    'pose', 'expression', 'eye_contact',
  ];

  for (const fieldId of fieldOrder) {
    const field = findField(fieldId);
    if (!field) continue;

    if (field.type === 'multi-select' || field.type === 'color-swatch' && Array.isArray(fields[fieldId])) {
      const values = getPromptValues(fields, fieldId);
      tags.push(...values);
    } else {
      const value = getPromptValue(fields, fieldId);
      if (value) tags.push(value);
    }
  }

  return tags.filter(Boolean).join(', ');
}
```

### 10.5 Multi-Dummy Prompt Assembly

```javascript
function assembleMultiDummyPrompt(dummies, interactionFields, model) {
  if (dummies.length === 1) {
    return assemblePromptForModel(dummies[0].fields, model);
  }

  const prefixes = ['1girl', '2girls', '3girls'];
  const parts = [];

  // Quality prefix
  if (model.qualityPrefix.length) {
    parts.push(model.qualityPrefix.join(', '));
  }

  parts.push('photorealistic photography, RAW photo');
  parts.push(`${prefixes[dummies.length - 1]}`);

  // Each dummy's full attribute block
  for (let i = 0; i < dummies.length; i++) {
    const dummyPrompt = assemblePromptForModel(dummies[i].fields, model, { skipQualityPrefix: true });
    parts.push(`(${i + 1}girl: ${dummyPrompt})`);
  }

  // Interaction block (appended after all dummies)
  const interaction = getPromptValue(interactionFields, 'interaction_type');
  const focus = getPromptValue(interactionFields, 'focus');
  const relationship = getPromptValue(interactionFields, 'relationship_dynamic');
  const proximity = getPromptValue(interactionFields, 'proximity');

  const interactionParts = [interaction, focus, relationship, proximity].filter(Boolean);
  if (interactionParts.length) parts.push(interactionParts.join(', '));

  return parts.join(', ');
}
```

### 10.6 Negative Prompt Assembly

```javascript
function assembleNegativePrompt(model, userOverride = null) {
  if (userOverride) return userOverride;

  const base = model.defaultNegative;

  // Universal additions regardless of model
  const universal = [
    'multiple views', 'comic', 'cartoon', 'anime', 'illustration',
    'painting', 'sketch', 'render', 'CGI', '3d render',
    'bad hands', 'extra fingers', 'missing fingers', 'deformed hands',
    'bad face', 'ugly face', 'asymmetric face',
  ];

  return [...base, ...universal].join(', ');
}
```

### 10.7 Prompt Mode Override Warning

```javascript
function checkPromptModeCompatibility(mode, modelId) {
  const incompatible = {
    'danbooru': ['chroma', 'z-image-turbo'],
    'score': ['chroma', 'z-image-turbo'],
    'natural': [],  // Natural language works on all models
  };

  const problematic = incompatible[mode] || [];
  if (problematic.includes(modelId)) {
    return {
      compatible: false,
      message: `Danbooru/Score tag format produces weaker results with ${MODELS[modelId].label}. Natural language is recommended for this model.`,
      severity: 'warning',  // Non-blocking
    };
  }
  return { compatible: true };
}
// Show inline warning in Terminal settings panel, not a blocking modal
```

### 10.8 Batch Work Algorithms

**Get 5:**
```javascript
async function batchGet5(baseState) {
  const jobs = [];
  for (let i = 0; i < 5; i++) {
    // Randomize unlocked fields for variation
    const variantFields = randomizeFields(
      baseState.dummies[baseState.activeDummyIndex].fields,
      baseState.dummies[baseState.activeDummyIndex].lockedFields
    );
    const variantDummy = { ...baseState.dummies[baseState.activeDummyIndex], fields: variantFields };
    jobs.push({ prompt, dummy: variantDummy, index: i + 1 });
  }
  // Queue jobs sequentially (single-job mode: each completes before next starts)
  for (const job of jobs) {
    await triggerGeneration(job);
  }
}
```

**Scene 3:**
```javascript
async function batchScene3(baseState) {
  // Lock: all fields EXCEPT scene-related categories
  const SCENE_FIELDS = ['location', 'scene', 'background', 'time_of_day',
    'lighting_style', 'lighting_color', 'lighting_effects',
    'camera_framing', 'camera_lens', 'camera_angle', 'depth_of_field'];

  const baseFields = baseState.dummies[baseState.activeDummyIndex].fields;
  const tempLockedFields = Object.keys(baseFields).filter(id => !SCENE_FIELDS.includes(id));

  for (let i = 0; i < 3; i++) {
    const variantFields = randomizeFields(baseFields, allCategories, tempLockedFields);
    const prompt = assemblePromptForModel(variantFields, MODELS[baseState.settings.selectedModel]);
    await triggerGeneration({ prompt });
  }
}
```

---

## 11. VENICE BRIDGE & USERSCRIPT

### 11.1 Communication Protocol

**Shared storage keys (GM_setValue / GM_getValue):**
```javascript
const BRIDGE_KEYS = {
  REQUEST:        'xgen_v1_request',
  REQUEST_NONCE:  'xgen_v1_request_nonce',
  RESULT:        'xgen_v1_result',
  RESULT_NONCE:  'xgen_v1_result_nonce',
  STATUS:        'xgen_v1_status',
  ERROR:         'xgen_v1_error',
};
```

**Request payload (PWA → Venice):**
```javascript
{
  nonce: '1737_abc123',            // unique per job
  ts: Date.now(),
  prompt: 'photorealistic, ...',
  negativePrompt: 'low quality, ...',
  settings: {
    model: 'chroma',               // 'chroma' | 'lustify-sdxl' | 'lustify-v7' | 'z-image-turbo'
    cfgScale: 7,
    steps: 20,
    aspectRatio: '2:3',
  }
}
```

**Result payload (Venice → PWA):**
```javascript
{
  nonce: '1737_abc123',
  ts: Date.now(),
  prompt: '...',
  negativePrompt: '...',
  mime: 'image/png',
  size: 4880000,
  width: 1272,
  height: 1896,
  dataUrl: 'data:image/png;base64,...',
  generationTime: 12400,           // ms from request to result
  model: 'chroma',
}
```

### 11.2 UserScript Header

```javascript
// ==UserScript==
// @name         x.GEN → Venice Bridge
// @description  Bridges x.GEN to Venice.ai for automated image generation
// @author       x.GEN
// @match        https://b-althazard.github.io/xgen/*
// @match        https://venice.ai/chat/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addValueChangeListener
// @run-at       document-idle
// ==/UserScript==
```

### 11.3 Venice Selectors (confirmed stable)

```javascript
const VENICE_SELECTORS = {
  promptTextarea: 'textarea[name="prompt-textarea"]',
  submitButton:   'button[type="submit"][aria-label="Submit chat"]',
  imageOutput:    '.image-message img',
};
```

### 11.4 Full Venice Job Runner

```javascript
async function runVeniceJob(requestPayload) {
  const startTime = Date.now();

  GM_setValue(BRIDGE_KEYS.STATUS, { nonce: requestPayload.nonce, status: 'received' });

  const previousImg = getLatestVeniceImage();
  const previousSrc = previousImg?.src || null;

  // Inject prompt
  await fillVenicePrompt(requestPayload.prompt);
  await sleep(250);
  await clickVeniceSubmit();

  GM_setValue(BRIDGE_KEYS.STATUS, { nonce: requestPayload.nonce, status: 'generating' });

  // Wait for new image (120s timeout)
  await waitForNewImage(previousSrc, 120000);

  // Extract image
  const result = await extractImage(requestPayload);
  result.generationTime = Date.now() - startTime;

  publishResult(result);
  GM_setValue(BRIDGE_KEYS.STATUS, { nonce: requestPayload.nonce, status: 'done' });
}

function getLatestVeniceImage() {
  const imgs = document.querySelectorAll(VENICE_SELECTORS.imageOutput);
  return imgs[imgs.length - 1] || null;
}

function setNativeValue(element, value) {
  const proto = Object.getPrototypeOf(element);
  const descriptor = Object.getOwnPropertyDescriptor(proto, 'value');
  const setter = descriptor?.set;
  if (setter) setter.call(element, value);
  element.dispatchEvent(new Event('input', { bubbles: true }));
  element.dispatchEvent(new Event('change', { bubbles: true }));
}

async function fillVenicePrompt(prompt) {
  const textarea = document.querySelector(VENICE_SELECTORS.promptTextarea);
  if (!textarea) throw new Error('Venice prompt textarea not found');
  setNativeValue(textarea, prompt);
}

async function clickVeniceSubmit() {
  const btn = document.querySelector(VENICE_SELECTORS.submitButton);
  if (!btn) throw new Error('Venice submit button not found');
  if (btn.disabled) {
    // Wait up to 3s for button to become enabled
    await waitForCondition(() => !btn.disabled, 3000);
  }
  btn.click();
}

async function waitForNewImage(previousSrc, timeout = 120000) {
  const start = Date.now();
  return new Promise((resolve, reject) => {
    const observer = new MutationObserver(() => {
      const latest = getLatestVeniceImage();
      if (latest && latest.src && latest.src !== previousSrc && !latest.src.startsWith('data:')) {
        observer.disconnect();
        resolve(latest);
      }
    });
    observer.observe(document.body, { subtree: true, childList: true, attributes: true });

    setTimeout(() => {
      observer.disconnect();
      reject(new Error('Timeout: no new Venice image after 120s'));
    }, timeout);
  });
}

async function extractImage(requestPayload) {
  const img = getLatestVeniceImage();
  if (!img) throw new Error('No Venice image found after waiting');

  await img.decode().catch(() => {});

  const response = await fetch(img.src);
  const blob = await response.blob();
  const dataUrl = await blobToDataURL(blob);

  return {
    nonce: requestPayload.nonce,
    ts: Date.now(),
    prompt: requestPayload.prompt,
    negativePrompt: requestPayload.negativePrompt || '',
    mime: blob.type,
    size: blob.size,
    width: img.naturalWidth,
    height: img.naturalHeight,
    model: requestPayload.settings?.model || 'unknown',
    dataUrl,
  };
}

async function blobToDataURL(blob) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}
```

### 11.5 Full UserScript Logic (both sides)

```javascript
(function() {
  'use strict';

  const isXgen = window.location.hostname === 'xgen.ai'
    || window.location.href.includes('b-althazard.github.io/xgen');
  const isVenice = window.location.hostname === 'venice.ai';

  if (isXgen) {
    // x.GEN SIDE
    // Signal to PWA that bridge is installed
    window.dispatchEvent(new CustomEvent('xgen:bridge-ready'));

    // Listen for results from Venice
    GM_addValueChangeListener(BRIDGE_KEYS.RESULT_NONCE, (_k, _o, _n, remote) => {
      if (!remote) return;
      const payload = GM_getValue(BRIDGE_KEYS.RESULT, null);
      if (!payload) return;
      window.dispatchEvent(new CustomEvent('xgen:image-received', { detail: payload }));
    });

    // Listen for status updates
    GM_addValueChangeListener(BRIDGE_KEYS.STATUS, (_k, _o, newVal, remote) => {
      if (!remote) return;
      window.dispatchEvent(new CustomEvent('xgen:status-update', { detail: newVal }));
    });

    // Listen for errors
    GM_addValueChangeListener(BRIDGE_KEYS.ERROR, (_k, _o, newVal, remote) => {
      if (!remote) return;
      window.dispatchEvent(new CustomEvent('xgen:generation-error', { detail: newVal }));
    });

    // Listen for generate requests from PWA
    window.addEventListener('xgen:generate', (e) => {
      const payload = e.detail;
      GM_setValue(BRIDGE_KEYS.REQUEST, payload);
      GM_setValue(BRIDGE_KEYS.REQUEST_NONCE, `${payload.nonce}_${Date.now()}`);
    });
  }

  if (isVenice) {
    // VENICE SIDE
    GM_addValueChangeListener(BRIDGE_KEYS.REQUEST_NONCE, async (_k, _o, _n, remote) => {
      if (!remote) return;
      const requestPayload = GM_getValue(BRIDGE_KEYS.REQUEST, null);
      if (!requestPayload) return;

      try {
        await runVeniceJob(requestPayload);
      } catch (error) {
        GM_setValue(BRIDGE_KEYS.ERROR, {
          nonce: requestPayload.nonce,
          ts: Date.now(),
          message: String(error),
        });
        GM_setValue(BRIDGE_KEYS.STATUS, { nonce: requestPayload.nonce, status: 'failed' });
      }
    });
  }
})();
```

### 11.6 PWA Bridge Manager (bridgeManager.js)

```javascript
let bridgeDetected = false;
let currentJobNonce = null;
let jobTimeoutId = null;
const JOB_TIMEOUT_MS = 120000;

// Detect bridge on page load
window.addEventListener('xgen:bridge-ready', () => {
  bridgeDetected = true;
  store.setState({ app: { ...store.state.app, bridgeDetected: true } });
});

// Status updates
window.addEventListener('xgen:status-update', (e) => {
  const { status } = e.detail;
  const statusLabels = {
    received: 'Venice received request',
    generating: 'Generating image...',
    done: 'Image received',
    failed: 'Generation failed',
  };
  updateLabStatus(status, statusLabels[status] || status);
});

// Image received
window.addEventListener('xgen:image-received', async (e) => {
  clearTimeout(jobTimeoutId);
  const payload = e.detail;
  if (payload.nonce !== currentJobNonce) return; // Stale result

  // Save to IndexedDB
  await db.put('images', payload);

  // Prune history to HISTORY_LIMIT (10)
  const allImages = await db.getAllFromIndex('images', 'ts');
  if (allImages.length > HISTORY_LIMIT) {
    const toDelete = allImages.slice(0, allImages.length - HISTORY_LIMIT);
    for (const img of toDelete) await db.delete('images', img.nonce);
  }

  // Update lab state
  store.setState({ lab: { ...store.state.lab, currentJobStatus: 'done', activeImageIndex: 0 } });
  renderLabPage(); // Refresh lab viewer

  // Navigate to The Lab
  navigate('theLab');
  hideLoadingOverlay();
});

// Error handler
window.addEventListener('xgen:generation-error', (e) => {
  clearTimeout(jobTimeoutId);
  hideLoadingOverlay();
  const { message } = e.detail;
  showLabError(`Image generation failed: ${message}`);
  store.setState({ lab: { ...store.state.lab, currentJobStatus: 'failed', errorMessage: message } });
});

export function triggerGeneration(payload) {
  if (!bridgeDetected) {
    showBridgeInstallModal();
    return;
  }

  if (!navigator.onLine) {
    showLabError('Image generation requires connection to Venice.');
    return;
  }

  currentJobNonce = `${Date.now()}_${Math.random().toString(36).slice(2)}`;
  const fullPayload = {
    nonce: currentJobNonce,
    ts: Date.now(),
    ...payload,
  };

  // Start countdown timer
  showLoadingOverlay(JOB_TIMEOUT_MS);

  // Set timeout
  jobTimeoutId = setTimeout(() => {
    hideLoadingOverlay();
    showLabError('Generation timed out after 120 seconds. Check Venice.ai is open.');
    store.setState({ lab: { ...store.state.lab, currentJobStatus: 'failed' } });
  }, JOB_TIMEOUT_MS);

  // Dispatch to UserScript
  window.dispatchEvent(new CustomEvent('xgen:generate', { detail: fullPayload }));
  store.setState({ lab: { ...store.state.lab, currentJobStatus: 'sent', currentJobNonce } });
}
```

### 11.7 Bridge Missing — Install Modal

When `bridgeDetected === false` and user presses Generate:

```
┌─────────────────────────────────────┐
│  ⚡ x.GEN Bridge Not Detected       │
│                                     │
│  The Venice bridge UserScript is    │
│  required to generate images.       │
│                                     │
│  Steps:                             │
│  1. Install Violentmonkey           │
│     (Chrome / Firefox extension)    │
│  2. Click "Install Bridge Script"   │
│     to add the UserScript           │
│  3. Keep Venice.ai open in a tab    │
│  4. Press Generate again            │
│                                     │
│  [Install Violentmonkey]            │
│  [Install Bridge Script]            │
│  [Not now]                          │
└─────────────────────────────────────┘
```

---

## 12. STORAGE ARCHITECTURE

### 12.1 Auto-Save

```javascript
// Debounced auto-save — 500ms after last change
let autoSaveTimer = null;

export function scheduleAutoSave() {
  clearTimeout(autoSaveTimer);
  autoSaveTimer = setTimeout(() => {
    const state = store.getState();
    localStorage.setItem(STORAGE_KEYS.ACTIVE_STATE, JSON.stringify({
      dummies: state.dummies,
      multiDummyInteraction: state.multiDummyInteraction,
      settings: state.settings,
      activeDummyIndex: state.activeDummyIndex,
    }));
  }, 500);
}

// Call scheduleAutoSave() after every field change
```

### 12.2 Undo System

```javascript
const UNDO_LIMIT = 20;

// Action types
const ACTION_TYPES = {
  FIELD_CHANGE:   'field_change',
  RANDOMIZE:      'randomize',
  RESET_ALL:      'reset_all',
  LOAD_PRESET:    'load_preset',
};

export function pushUndo(action) {
  const stack = store.state._undoStack;
  stack.push({
    type: action.type,
    payload: action.payload,  // snapshot of what changed
    timestamp: Date.now(),
  });
  if (stack.length > UNDO_LIMIT) stack.shift();
  store.setState({ _undoStack: stack, _redoStack: [] }); // Clear redo on new action
}

export function undo() {
  const stack = [...store.state._undoStack];
  const redoStack = [...store.state._redoStack];
  if (stack.length === 0) return;

  const action = stack.pop();
  redoStack.push(action);

  // Restore the previous state from action payload
  applyUndoAction(action);

  store.setState({ _undoStack: stack, _redoStack: redoStack });
}
```

### 12.3 IndexedDB Helper (storageManager.js)

```javascript
let db;

export async function initDB() {
  db = await new Promise((resolve, reject) => {
    const request = indexedDB.open('xgen-db', 1);

    request.onupgradeneeded = (e) => {
      const database = e.target.result;

      // Images store
      if (!database.objectStoreNames.contains('images')) {
        const imagesStore = database.createObjectStore('images', { keyPath: 'nonce' });
        imagesStore.createIndex('ts', 'ts', { unique: false });
      }

      // Dummies store (dolls, dummies)
      if (!database.objectStoreNames.contains('dummies')) {
        const dummiesStore = database.createObjectStore('dummies', { keyPath: 'id' });
        dummiesStore.createIndex('name', 'name', { unique: false });
        dummiesStore.createIndex('type', 'type', { unique: false });
      }

      // Reference photos store
      if (!database.objectStoreNames.contains('referencePhotos')) {
        database.createObjectStore('referencePhotos', { keyPath: 'id' });
      }
    };

    request.onsuccess = (e) => resolve(e.target.result);
    request.onerror = (e) => reject(e.target.error);
  });
}

export const storage = {
  async put(storeName, item) {
    return new Promise((resolve, reject) => {
      const tx = db.transaction(storeName, 'readwrite');
      const store = tx.objectStore(storeName);
      const req = store.put(item);
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => reject(req.error);
    });
  },

  async get(storeName, key) {
    return new Promise((resolve, reject) => {
      const tx = db.transaction(storeName, 'readonly');
      const store = tx.objectStore(storeName);
      const req = store.get(key);
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => reject(req.error);
    });
  },

  async getAll(storeName) {
    return new Promise((resolve, reject) => {
      const tx = db.transaction(storeName, 'readonly');
      const store = tx.objectStore(storeName);
      const req = store.getAll();
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => reject(req.error);
    });
  },

  async delete(storeName, key) {
    return new Promise((resolve, reject) => {
      const tx = db.transaction(storeName, 'readwrite');
      const store = tx.objectStore(storeName);
      const req = store.delete(key);
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  },
};
```

---

## 13. MULTI-DUMMY MODE

### 13.1 Dummy Tab Bar

Renders at top of Creation Kit when any dummy tab UI is needed. Always visible (even with 1 Dummy, shows tab to establish the pattern).

```
[ Dummy 1 ] [ + Add Dummy ]       ← 1 dummy configured
[ Dummy 1 ] [ Dummy 2 ] [ + Add ] ← 2 dummies configured
[ Dummy 1 ] [ Dummy 2 ] [ Dummy 3 ]   ← 3 dummies (max, no + Add)
```

**Tab behavior:**
- Click active dummy tab → no action
- Click inactive tab → switch active dummy, form re-renders with that dummy's fields
- Click `+ Add` → create new dummy with all fields empty, switch to new tab
- Long-press / right-click tab → contextual menu: Rename / Duplicate / Remove

**State per dummy:** Each tab has completely independent field state, lockedFields array, and referencePhoto.

### 13.2 Interaction Fields Visibility

Multi-Dummy category in the form (Section 9.13) is:
- **Hidden** when only 1 Dummy is configured
- **Visible** (as last category in pill navbar) when 2–3 Dummies are configured

### 13.3 Prompt Assembly with Multiple Dummies

See Section 10.5. Each dummy gets its full attribute block prefixed by `(1girl: ...)`, `(2girl: ...)`, etc.

---

## 14. DEFAULT DUMMIES — 8 ARCHETYPES

> The AI agent should algorithmically derive field values from the archetype name and visual concept. The following is the complete specification of field values for each of the 8 default Dummies. These are read-only and ship with the app in `data/defaultDummies.json`.

**General rules for all default Dummies:**
- All are `type: "default"`, `locked: true` (cannot be overwritten)
- Reference photos: AI-generated portraits, 2:3 aspect ratio, neutral studio background, same lighting setup across all 8 for visual consistency
- These presets load into the Creation Kit fully intact when the user taps "Use"
- Users can only save a modified version as a new Doll or Mannequin

---

### Dummy 1: Goth

**Concept:** Dark aesthetic, pale skin, heavy makeup, all-black wardrobe, edgy accessories

| Category | Field | Value |
|---|---|---|
| Identity | Age | 20s |
| Identity | Ethnicity | Caucasian |
| Physique | Body Type | Slim |
| Physique | Skin Tone | Fair |
| Physique | Skin Detail | Smooth, Piercings |
| Face | Face Shape | Oval |
| Face | Eye Shape | Almond |
| Face | Eye Color | Dark Brown |
| Face | Lips | Full |
| Hair | Color | Black |
| Hair | Length | Mid-back |
| Hair | Style | Straight |
| Makeup | Foundation | Matte |
| Makeup | Eye Makeup | Eyeliner, Smoky eye |
| Makeup | Eye Shadow Color | Black |
| Makeup | Lashes | Full |
| Makeup | Lip Makeup | Matte dark |
| Makeup | Blush/Effects | Contour |
| Clothing | Complete Outfit | Casual |
| Clothing | Upper Type | Top |
| Clothing | Upper Color | Black |
| Clothing | Upper Material | Lace |
| Clothing | Lower Type | Skirt |
| Clothing | Lower Color | Black |
| Clothing | Legwear | Fishnets |
| Clothing | Footwear | Platform heels |
| Clothing | Accessories | Choker, Earrings |
| Location | Location | Studio |
| Location | Scene | Minimalist studio |
| Location | Background | Dark |
| Lighting | Style | Cinematic |
| Lighting | Color | Cool |
| Camera | Framing | Half-body |
| Camera | Lens | 85mm |
| Posing | Expression | Serious |
| Posing | Eye Contact | Direct |

---

### Dummy 2: Bimbo

**Concept:** Hyper-feminine, blonde, heavy glam makeup, pink/white wardrobe, very busty

| Category | Field | Value |
|---|---|---|
| Identity | Age | 20s |
| Identity | Ethnicity | Caucasian |
| Physique | Body Type | Voluptuous |
| Physique | Skin Tone | Light |
| Physique | Skin Detail | Smooth |
| Bust | Size | Extra Large |
| Bust | Shape | Round |
| Face | Eye Shape | Round |
| Face | Eye Color | Blue |
| Face | Lips | Pouty |
| Face | Eyebrows | Arched |
| Hair | Color | Platinum |
| Hair | Length | Long |
| Hair | Style | Straight, Voluminous |
| Makeup | Foundation | Dewy |
| Makeup | Eye Makeup | Mascara, Eyeliner, Colored shadow |
| Makeup | Eye Shadow Color | Pink |
| Makeup | Lashes | Extra dramatic |
| Makeup | Lip Makeup | Pink |
| Makeup | Blush/Effects | Heavy blush, Highlight |
| Clothing | Complete Outfit | Lingerie set |
| Clothing | Accessories | Necklace, Earrings, Bracelet |
| Location | Location | Bedroom |
| Location | Scene | Indoor |
| Location | Background | Blurred |
| Lighting | Style | Soft studio |
| Lighting | Color | Pink |
| Camera | Framing | Half-body |
| Posing | Expression | Playful |
| Posing | Eye Contact | Direct |

---

### Dummy 3: Gym Girl

**Concept:** Athletic, toned, minimal makeup, sporty, confident

| Category | Field | Value |
|---|---|---|
| Identity | Age | 20s |
| Identity | Ethnicity | Caucasian |
| Physique | Body Type | Athletic |
| Physique | Height | Tall |
| Physique | Skin Tone | Tan |
| Physique | Skin Detail | Toned, Natural |
| Face | Eye Shape | Almond |
| Face | Eye Color | Green |
| Face | Eyebrows | Straight |
| Hair | Color | Dirty Blonde |
| Hair | Length | Shoulder-length |
| Hair | Style | Ponytail |
| Makeup | Foundation | Natural |
| Makeup | Eye Makeup | Mascara |
| Makeup | Lip Makeup | Nude |
| Makeup | Blush/Effects | Subtle blush, Bronzer |
| Clothing | Complete Outfit | Athletic |
| Clothing | Accessories | Watch |
| Location | Location | Gym |
| Location | Scene | Indoor |
| Location | Background | Detailed |
| Lighting | Style | Natural |
| Lighting | Color | Warm |
| Camera | Framing | Full body |
| Camera | Lens | 35mm |
| Posing | Pose | Standing |
| Posing | Expression | Serious |
| Posing | Eye Contact | Direct |

---

### Dummy 4: Girl Next Door

**Concept:** Natural, approachable, minimal makeup, casual wardrobe, warm vibe

| Category | Field | Value |
|---|---|---|
| Identity | Age | 20s |
| Identity | Ethnicity | Caucasian |
| Physique | Body Type | Average |
| Physique | Skin Tone | Light |
| Physique | Skin Detail | Natural, Freckles |
| Face | Face Shape | Round |
| Face | Eye Shape | Downturned |
| Face | Eye Color | Hazel |
| Face | Lips | Medium |
| Face | Eyebrows | Feathered |
| Hair | Color | Light Brown |
| Hair | Length | Mid-back |
| Hair | Style | Wavy |
| Makeup | Foundation | Natural |
| Makeup | Eye Makeup | Mascara |
| Makeup | Lip Makeup | Nude |
| Makeup | Blush/Effects | Subtle blush |
| Clothing | Complete Outfit | Casual |
| Location | Location | Living room |
| Location | Scene | Indoor |
| Location | Background | Detailed |
| Lighting | Style | Natural |
| Lighting | Color | Warm |
| Camera | Framing | Half-body |
| Camera | Lens | 50mm |
| Posing | Expression | Smiling |
| Posing | Eye Contact | Direct |

---

### Dummy 5: E-Girl

**Concept:** Internet culture aesthetic, bold makeup, anime-influenced styling, dark-soft palette

| Category | Field | Value |
|---|---|---|
| Identity | Age | 20s |
| Identity | Ethnicity | East Asian |
| Physique | Body Type | Slim |
| Physique | Skin Tone | Fair |
| Physique | Skin Detail | Smooth |
| Face | Eye Shape | Monolid |
| Face | Eye Color | Brown |
| Face | Lips | Full |
| Face | Eyebrows | Straight |
| Hair | Color | Black |
| Hair | Length | Shoulder-length |
| Hair | Style | Straight, Bangs |
| Makeup | Foundation | Matte |
| Makeup | Eye Makeup | Eyeliner, Graphic liner, Colored shadow |
| Makeup | Eye Shadow Color | Purple |
| Makeup | Lashes | Full |
| Makeup | Lip Makeup | Matte dark |
| Makeup | Blush/Effects | Heavy blush |
| Clothing | Upper Type | Top |
| Clothing | Upper Color | Black |
| Clothing | Lower Type | Mini skirt |
| Clothing | Lower Color | Black |
| Clothing | Legwear | Thigh-highs |
| Clothing | Footwear | Platform heels |
| Clothing | Accessories | Choker, Earrings, Bracelet |
| Location | Location | Studio |
| Location | Scene | Indoor |
| Location | Background | Dark |
| Lighting | Style | Neon |
| Lighting | Color | Mixed RGB |
| Camera | Framing | Portrait |
| Camera | Lens | 85mm |
| Posing | Expression | Pouty |
| Posing | Eye Contact | Direct |

---

### Dummy 6: Baddie

**Concept:** Urban confidence, mixed ethnicity, heavy contour, streetwear, bold presence

| Category | Field | Value |
|---|---|---|
| Identity | Age | 20s |
| Identity | Ethnicity | Mixed |
| Physique | Body Type | Curvy |
| Physique | Skin Tone | Brown |
| Physique | Skin Detail | Smooth |
| Bust | Size | Large |
| Bust | Shape | Round |
| Lower Body | Hips | Wide |
| Lower Body | Ass | Bubble |
| Face | Eye Shape | Almond |
| Face | Eye Color | Dark Brown |
| Face | Lips | Full |
| Face | Eyebrows | Sharp |
| Hair | Color | Black |
| Hair | Length | Mid-back |
| Hair | Style | Straight, Sleek |
| Makeup | Foundation | Matte |
| Makeup | Eye Makeup | Eyeliner, Cut crease |
| Makeup | Lashes | Extra dramatic |
| Makeup | Lip Makeup | Nude |
| Makeup | Blush/Effects | Contour, Highlight, Bronzer |
| Clothing | Complete Outfit | Streetwear |
| Clothing | Accessories | Earrings, Necklace, Sunglasses |
| Location | Location | Urban street |
| Location | Scene | Urban |
| Location | Background | Detailed |
| Location | Time of Day | Golden hour |
| Lighting | Style | Natural |
| Lighting | Color | Warm |
| Camera | Framing | Full body |
| Camera | Lens | 35mm |
| Posing | Pose | Standing |
| Posing | Expression | Serious |
| Posing | Eye Contact | Direct |

---

### Dummy 7: Soft Girl

**Concept:** Pastel palette, innocent aesthetic, blush makeup, cozy feminine styling

| Category | Field | Value |
|---|---|---|
| Identity | Age | 20s |
| Identity | Ethnicity | East Asian |
| Physique | Body Type | Petite |
| Physique | Skin Tone | Fair |
| Physique | Skin Detail | Smooth |
| Face | Face Shape | Round |
| Face | Eye Shape | Round |
| Face | Eye Color | Brown |
| Face | Lips | Heart-shaped |
| Face | Eyebrows | Feathered |
| Hair | Color | Brown |
| Hair | Length | Shoulder-length |
| Hair | Style | Wavy, Side-swept |
| Makeup | Foundation | Dewy |
| Makeup | Eye Makeup | Mascara |
| Makeup | Eye Shadow Color | Pink |
| Makeup | Lashes | Wispy |
| Makeup | Lip Makeup | Pink |
| Makeup | Blush/Effects | Heavy blush, Glass skin, Shimmer |
| Clothing | Complete Outfit | Casual |
| Clothing | Accessories | Earrings, Necklace |
| Location | Location | Bedroom |
| Location | Scene | Indoor |
| Location | Background | Blurred |
| Lighting | Style | Soft studio |
| Lighting | Color | Pink |
| Lighting | Effects | Soft shadows, Catch lights |
| Camera | Framing | Portrait |
| Camera | Lens | 85mm |
| Posing | Expression | Smiling |
| Posing | Eye Contact | Direct |

---

### Dummy 8: Cottagecore

**Concept:** Rural romance aesthetic, natural makeup, floral dress, outdoor nature setting, warm earthy tones

| Category | Field | Value |
|---|---|---|
| Identity | Age | 20s |
| Identity | Ethnicity | Caucasian |
| Physique | Body Type | Average |
| Physique | Skin Tone | Light |
| Physique | Skin Detail | Natural, Freckles, Moles/Beauty marks |
| Face | Face Shape | Oval |
| Face | Eye Shape | Downturned |
| Face | Eye Color | Blue |
| Face | Eyebrows | Feathered |
| Hair | Color | Auburn |
| Hair | Length | Long |
| Hair | Style | Wavy, Braided |
| Makeup | Foundation | Natural |
| Makeup | Lip Makeup | Nude |
| Makeup | Blush/Effects | Subtle blush |
| Clothing | Complete Outfit | Casual |
| Clothing | Upper Type | Top |
| Clothing | Upper Color | Floral |
| Clothing | Upper Material | Cotton |
| Clothing | Lower Type | Skirt |
| Clothing | Lower Color | Print |
| Clothing | Accessories | Necklace |
| Location | Location | Outdoors park |
| Location | Scene | Nature |
| Location | Background | Detailed |
| Location | Time of Day | Golden hour |
| Lighting | Style | Natural |
| Lighting | Color | Warm |
| Lighting | Effects | God rays, Soft shadows |
| Camera | Framing | Half-body |
| Camera | Lens | 50mm |
| Camera | Depth of Field | Shallow |
| Posing | Expression | Smiling |
| Posing | Eye Contact | Looking away |

---

## 15. PRESETS SYSTEM — DOLLS & dummies

### 15.1 Definitions

| Type | Description |
|---|---|
| **Default Dummy** | Read-only archetype, ships with app, cannot be overwritten, serves as inspiration |
| **Doll** | User-saved preset — complete field state, used as a consistent Dummy or base model |
| **Mannequin** | User-saved preset with locked fields — ideal for batch randomization; locked fields never change during randomize |

### 15.2 Saving Flow

```
User fills in form → presses "Save"
    ↓
Modal: "Save as..."
  [ Doll — save complete state ]
  [ Mannequin — save with field locks ]
    ↓
User enters name (required, max 32 chars)
    ↓
If type = Mannequin: show field lock review screen
  "These fields are currently locked and will be preserved:"
  [list of locked fields with padlock icons]
    ↓
Save to IndexedDB → appear in Home page grid
```

### 15.3 Loading Flow

```
Home page → tap Doll/Mannequin card → tap "Use"
    ↓
If Creation Kit already has unsaved changes:
  Modal: "Load [Name]? Unsaved changes will be replaced."
  [Load anyway] [Cancel]
    ↓
Load fields into Creation Kit
  For Dummies: locked fields are restored AND their padlock state is activated
    ↓
Navigate to Creation Kit
```

### 15.4 Mannequin Lock UI

Each form field row has a padlock icon on the right side:

```
[Field Label]  [Field Controls...]  [🔓 / 🔒]
```

- 🔓 (unlocked) — field participates in randomization, default state, color: `--text-tertiary`
- 🔒 (locked) — field excluded from randomization, color: `--accent-functional` (orange)
- Click icon to toggle lock state
- Lock state is saved when "Save as Mannequin" is pressed
- Lock state is ignored when "Save as Doll" is pressed (Dolls have no locks)

### 15.5 Preset Storage Structure

```javascript
// Stored in IndexedDB 'dummies' store
{
  id: "uuid-v4",
  type: "doll",           // "doll" | "mannequin" | "default"
  name: "My Summer Doll",
  fields: {
    age: "20s",
    ethnicity: "latina",
    body_type: "curvy",
    // ... all field values
  },
  lockedFields: [],        // [] for dolls, array of field IDs for dummies
  referencePhotoId: null,  // ID in referencePhotos store, or null
  createdAt: 1700000000000,
  updatedAt: 1700000000000,
}
```

---

## 16. SETTINGS & ONBOARDING

### 16.1 Age Gate

Shown on first launch, before onboarding, before any content:

```
┌─────────────────────────────────────┐
│          ✦ x.GEN               │
│                                     │
│  This app is intended for adults.   │
│  By continuing you confirm you are  │
│  18 years of age or older.          │
│                                     │
│  ┌─────────────────────────────┐    │
│  │  I am 18 or older. Enter.   │    │   ← Primary button (pink)
│  └─────────────────────────────┘    │
│                                     │
│  I am under 18 — Exit               │   ← Text link, exit/close tab
└─────────────────────────────────────┘
```

- No backdrop blur, full dark overlay
- Cannot be dismissed by clicking outside
- On confirm: `localStorage.setItem(STORAGE_KEYS.AGE_CONFIRMED, 'true')` → proceed to onboarding
- On exit: `window.location.href = 'about:blank'`
- On subsequent loads: check localStorage, skip if already confirmed

### 16.2 Onboarding — 3 Screens

Triggered after age gate, only on first launch. Shows progress dots (●●○ / ●○○ / etc.).

**Screen 1 — What is x.GEN:**
```
[Illustration: stylized AI dummy generation visual]

        x.GEN

Build your AI dummy.
Generate stunning images using structured prompts
optimized for the best AI image models.

                            [ Next → ]
```

**Screen 2 — Install the Bridge:**
```
[Illustration: browser tabs + connection icon]

        Connect to Venice

You need two things to generate images:
• Violentmonkey extension installed
• Venice Bridge UserScript active

                [Install Violentmonkey]
                [Install Bridge Script]

                            [ Next → ]
```

**Screen 3 — Create your Dummy:**
```
[Illustration: Creation Kit form preview]

        You're ready.

Start with a default Dummy or build yours
from scratch in the Creation Kit.

                    [ Start Creating ]    ← navigates to Home
```

- Skip button available on screens 1 and 2
- On complete: `localStorage.setItem(STORAGE_KEYS.ONBOARDING, 'true')`

### 16.3 Settings Panel

Opens as a bottom sheet from the settings icon in top bar.

```
SETTINGS
────────────────────────────────────────
Appearance
  Theme                  [ Dark ●  Light ]

Generation
  Default Model          [ Chroma1-HD ▾ ]
  Default Aspect Ratio   [ 2:3 ▾ ]
  Prompt Mode            [ Auto ▾ ]
    ↳ Auto | Natural Language | Danbooru | Score Tags
  Quality Tags           [ Auto ▾ ]
    ↳ Auto | Manual

Form Data
  Enable Addon File      [●  OFF ]
  Addon Status           ✓ 0 entries loaded / ⚠ 2 errors

Bridge
  UserScript Status      ✓ Connected / ⚠ Not detected
  [Open Bridge Install Guide]

Advanced
  [Reset All Local Data]   ← confirmation modal required

About
  x.GEN v1.0.0
  Private / Proprietary
```

**Settings Options — Complete List:**

| Setting | Type | Options / Behavior |
|---|---|---|
| Theme | Toggle | Dark (default) / Light |
| Default Model | Dropdown | Chroma1-HD / Lustify SDXL / Lustify v7 / Z-Image Turbo |
| Default Aspect Ratio | Dropdown | 2:3 / 1:1 / 9:16 / 4:3 / 16:9 |
| Prompt Mode | Dropdown | Auto / Natural Language / Danbooru / Score Tags |
| Quality Tags | Dropdown | Auto / Manual |
| Enable Addon File | Toggle | Off (default) / On |
| Addon Status | Display | Shows count of valid entries and errors |
| UserScript Status | Display | Connected (green) / Not detected (orange) |
| Bridge Install Guide | Link | Opens install modal |
| Reset All Local Data | Button | Confirmation modal → clears localStorage + IndexedDB |

### 16.4 Bridge Detection Banner

Shown below top bar on Creation Kit and The Lab if bridge is not detected, and user has not dismissed it:

```
⚠ Venice bridge not detected. [Install →]   [✕]
```

Orange background, dismissable (stored in localStorage until next session).

### 16.5 PWA Install

- Listen for `beforeinstallprompt` event
- Store the event
- After first session (app has been open >60 seconds), show subtle banner:

```
┌────────────────────────────────────────┐
│  📱 Install x.GEN for quick access │
│                    [Install] [Not now] │
└────────────────────────────────────────┘
```

- On `[Install]`: call `deferredPrompt.prompt()`
- Banner appears at top of Home page, above the Dummies grid

---

## 17. PWA CONFIGURATION

### 17.1 manifest.json

```json
{
  "name": "x.GEN",
  "short_name": "x.GEN",
  "description": "AI dummy prompt builder for content creators",
  "start_url": "/",
  "scope": "/",
  "display": "standalone",
  "orientation": "portrait-primary",
  "background_color": "#131313",
  "theme_color": "#131313",
  "lang": "en",
  "categories": ["utilities", "productivity"],
  "icons": [
    { "src": "assets/icons/icon-48.png",             "sizes": "48x48",   "type": "image/png" },
    { "src": "assets/icons/icon-72.png",             "sizes": "72x72",   "type": "image/png" },
    { "src": "assets/icons/icon-96.png",             "sizes": "96x96",   "type": "image/png" },
    { "src": "assets/icons/icon-128.png",            "sizes": "128x128", "type": "image/png" },
    { "src": "assets/icons/icon-144.png",            "sizes": "144x144", "type": "image/png" },
    { "src": "assets/icons/icon-192.png",            "sizes": "192x192", "type": "image/png" },
    { "src": "assets/icons/icon-512.png",            "sizes": "512x512", "type": "image/png" },
    { "src": "assets/icons/icon-maskable-192.png",   "sizes": "192x192", "type": "image/png", "purpose": "maskable" },
    { "src": "assets/icons/icon-maskable-512.png",   "sizes": "512x512", "type": "image/png", "purpose": "maskable" }
  ],
  "screenshots": [
    { "src": "assets/screenshots/home.png",         "sizes": "390x844", "type": "image/png", "form_factor": "narrow" },
    { "src": "assets/screenshots/creation-kit.png", "sizes": "390x844", "type": "image/png", "form_factor": "narrow" },
    { "src": "assets/screenshots/the-lab.png",      "sizes": "390x844", "type": "image/png", "form_factor": "narrow" }
  ]
}
```

### 17.2 Service Worker (sw.js)

**Strategy:** Cache-first for all static assets. Network-first for nothing (app is fully offline-capable except generation).

```javascript
const CACHE_NAME = 'xgen-v1';

const PRECACHE_URLS = [
  '/',
  '/index.html',
  '/css/style.css',
  '/js/app.js',
  '/js/store.js',
  '/js/promptEngine.js',
  '/js/bridgeManager.js',
  '/js/storageManager.js',
  '/js/pages/home.js',
  '/js/pages/creationKit.js',
  '/js/pages/theLab.js',
  '/js/modules/prompter.js',
  '/js/modules/terminal.js',
  '/js/modules/presets.js',
  '/js/components/navbar.js',
  '/js/components/topBar.js',
  '/js/components/fab.js',
  '/js/components/modal.js',
  '/js/components/colorSwatch.js',
  '/js/components/imageCard.js',
  '/js/components/accordion.js',
  '/js/components/formRenderer.js',
  '/js/components/dummyTabs.js',
  '/js/components/onboarding.js',
  '/js/components/ageGate.js',
  '/js/components/bridgeInstall.js',
  '/data/master_file.json',
  '/data/addon_file.json',
  '/data/defaultDummies.json',
  '/manifest.json',
  // All icon files
  // All modal reference images (assets/modals/*.png)
  // All placeholder portrait images (assets/placeholders/*.jpg)
  // Google Fonts cached on first load
];

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(PRECACHE_URLS))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', (e) => {
  // Skip non-GET, cross-origin, and Venice/external requests
  if (e.request.method !== 'GET') return;
  if (!e.request.url.startsWith(self.location.origin)) return;

  e.respondWith(
    caches.match(e.request).then(cached => {
      if (cached) return cached;

      // Not in cache: fetch and cache
      return fetch(e.request).then(response => {
        if (!response || response.status !== 200) return response;
        const clone = response.clone();
        caches.open(CACHE_NAME).then(cache => cache.put(e.request, clone));
        return response;
      }).catch(() => {
        // Offline fallback for navigation requests
        if (e.request.mode === 'navigate') return caches.match('/index.html');
      });
    })
  );
});
```

---

## 18. DESKTOP LAYOUT

### 18.1 Breakpoints

| Range | Layout |
|---|---|
| < 768px | Mobile — bottom navbar, pill category nav, vertical scroll |
| 768–1023px | Tablet — same as mobile layout, slightly more width available |
| 1024–1280px | Desktop small — split pane, right panel 30–35% |
| ≥ 1280px | Desktop full — split pane, right panel 40% |

### 18.2 Desktop Creation Kit Layout

```
┌──────────────────────────────────────────────────────────────┐
│  TOP BAR (full width)                                        │
├──────────────────────────────────────────────────────────────┤
│                        │                                     │
│  LEFT PANEL (60-70%)   │  RIGHT PANEL (30-40%)               │
│                        │                                     │
│  [Dummy Tabs]        │  ┌─────────────────────────────┐   │
│                        │  │  LIVE PROMPT PREVIEW         │   │
│  [Category Accordion]  │  │  Monospace, gold, read-only  │   │
│  One section open at   │  │  Updates in real-time        │   │
│  a time. Full form     │  │  [Copy Prompt]               │   │
│  accessible via        │  └─────────────────────────────┘   │
│  accordion headers.    │                                     │
│                        │  ┌─────────────────────────────┐   │
│                        │  │  REFERENCE PHOTO             │   │
│                        │  │  Upload / Preview            │   │
│                        │  └─────────────────────────────┘   │
│                        │                                     │
│                        │  ┌─────────────────────────────┐   │
│                        │  │  GENERATION HISTORY          │   │
│                        │  │  Last 5 thumbnails           │   │
│                        │  │  Click → opens in Lab        │   │
│                        │  └─────────────────────────────┘   │
│                        │                                     │
├──────────────────────────────────────────────────────────────┤
│  SIDEBAR NAVBAR (left, vertical)  │  FAB (bottom-right)      │
└──────────────────────────────────────────────────────────────┘
```

### 18.3 Desktop-Specific CSS

```css
@media (min-width: 1024px) {
  /* Convert bottom navbar to left sidebar */
  #bottom-navbar {
    position: fixed;
    top: 56px;
    left: 0;
    bottom: 0;
    width: 72px;
    height: auto;
    border-top: none;
    border-right: 1px solid var(--border-subtle);
    flex-direction: column;
    justify-content: flex-start;
    padding: var(--space-4) var(--space-2);
    gap: var(--space-2);
  }

  /* Page container: account for left sidebar */
  #page-container {
    padding-left: 72px;
    padding-bottom: var(--space-6);
  }

  /* FAB: stays bottom-right */
  .fab-container {
    bottom: var(--space-5);
    right: var(--space-5);
  }

  /* Creation Kit: split pane */
  .creation-kit-layout {
    display: grid;
    grid-template-columns: 1fr 340px;
    gap: var(--space-6);
    align-items: start;
    max-width: 1400px;
    margin: 0 auto;
    padding: var(--space-6);
  }

  /* Right panel is sticky */
  .creation-kit-right-panel {
    position: sticky;
    top: calc(56px + var(--space-4));
    max-height: calc(100vh - 80px);
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    gap: var(--space-4);
  }
}

@media (min-width: 1280px) {
  .creation-kit-layout {
    grid-template-columns: 1fr 420px;
  }
}
```

---

## 19. KEYBOARD SHORTCUTS

All shortcuts are scoped to `document` and only fire when no input element is focused (except where noted).

```javascript
const KEYBOARD_SHORTCUTS = {
  'ctrl+s':       { label: 'Save as Doll',       action: () => openSaveAsModal('doll') },
  'ctrl+g':       { label: 'Generate',            action: () => triggerGeneration(buildCurrentPrompt()) },
  'ctrl+shift+c': { label: 'Copy Prompt',         action: () => copyPromptToClipboard() },
  'tab':          { label: 'Next category',       action: () => navigateCategory(+1) },
  'shift+tab':    { label: 'Prev category',       action: () => navigateCategory(-1) },
  'ctrl+z':       { label: 'Undo',                action: () => undo(),  allowInInputs: true },
  'ctrl+shift+z': { label: 'Redo',                action: () => redo(),  allowInInputs: true },
  'r':            { label: 'Randomize (no input focus)', action: () => randomizeAllUnlocked() },
};

document.addEventListener('keydown', (e) => {
  const inInput = ['INPUT', 'TEXTAREA', 'SELECT'].includes(document.activeElement?.tagName);

  for (const [combo, shortcut] of Object.entries(KEYBOARD_SHORTCUTS)) {
    if (inInput && !shortcut.allowInInputs) continue;

    const parts = combo.split('+');
    const ctrlRequired  = parts.includes('ctrl');
    const shiftRequired = parts.includes('shift');
    const key = parts[parts.length - 1];

    if (ctrlRequired  !== (e.ctrlKey || e.metaKey)) continue;
    if (shiftRequired !== e.shiftKey) continue;
    if (e.key.toLowerCase() !== key.toLowerCase()) continue;

    e.preventDefault();
    shortcut.action();
    break;
  }
});
```

---

## 20. TESTING PLAN

### 20.1 Prompt Engine Unit Tests (promptEngine.test.js)

```javascript
// Tests run with: node tests/promptEngine.test.js (vanilla JS, no framework)

import { assemblePromptForModel } from '../js/promptEngine.js';
import { MODELS } from '../js/promptEngine.js';

let passed = 0;
let failed = 0;

function assert(condition, message) {
  if (condition) { console.log(`  ✓ ${message}`); passed++; }
  else           { console.error(`  ✗ FAIL: ${message}`); failed++; }
}

// --- TEST SUITE 1: Natural Language (Chroma) ---
console.log('\nSuite 1: Natural Language — Chroma1-HD');

const chromaFields = {
  age: '20s',
  ethnicity: 'caucasian',
  body_type: 'athletic',
  skin_tone: 'tan',
  hair_color: 'blonde',
  hair_length: 'shoulder-length',
};

const chromaPrompt = assemblePromptForModel(chromaFields, MODELS['chroma']);
assert(chromaPrompt.includes('photorealistic'), 'Chroma includes photorealistic prefix');
assert(!chromaPrompt.includes('score_9'), 'Chroma does NOT include score tags');
assert(chromaPrompt.includes('caucasian'), 'Chroma includes ethnicity');
assert(chromaPrompt.includes('20s'), 'Chroma includes age');

// --- TEST SUITE 2: Danbooru (Lustify SDXL) ---
console.log('\nSuite 2: Danbooru Tags — Lustify SDXL');

const lustifyPrompt = assemblePromptForModel(chromaFields, MODELS['lustify-sdxl']);
assert(lustifyPrompt.startsWith('score_9'), 'Lustify prompt starts with score_9');
assert(lustifyPrompt.includes('score_8_up'), 'Lustify includes score_8_up');
assert(lustifyPrompt.includes('1girl'), 'Lustify includes 1girl tag');

// --- TEST SUITE 3: Clothing mutual exclusivity ---
console.log('\nSuite 3: Clothing Mutual Exclusivity');

const bothClothingFields = {
  complete_outfit: 'lingerie',
  upper_type: 'top',            // Should be ignored since complete_outfit is set
  upper_color: 'black',
};

const clothingPrompt = assemblePromptForModel(bothClothingFields, MODELS['chroma']);
assert(clothingPrompt.includes('lingerie'), 'Complete outfit takes precedence');
assert(!clothingPrompt.includes('wearing top'), 'Upper layer ignored when complete outfit set');

// --- TEST SUITE 4: Nude clears all clothing ---
console.log('\nSuite 4: Nude Option');

const nudeFields = {
  complete_outfit: 'nude',
  legwear: ['stockings'],       // Should be cleared
  footwear: 'heels',            // Should be cleared
};

const nudePrompt = assemblePromptForModel(nudeFields, MODELS['chroma']);
assert(nudePrompt.includes('nude'), 'Nude included in prompt');
assert(!nudePrompt.includes('stockings'), 'Legwear cleared when nude');
assert(!nudePrompt.includes('heels'), 'Footwear cleared when nude');

// --- TEST SUITE 5: Multi-dummy ---
console.log('\nSuite 5: Multi-Dummy');

const dummy1Fields = { age: '20s', ethnicity: 'caucasian', hair_color: 'blonde' };
const dummy2Fields = { age: '30s', ethnicity: 'latina', hair_color: 'black' };

// Test assembleMultiDummyPrompt (import separately)
// assert(multiPrompt.includes('1girl'), 'Multi includes 1girl prefix');
// assert(multiPrompt.includes('2girls'), 'Multi includes 2girls count');
// assert(multiPrompt.includes('(1girl:'), 'First dummy tagged');
// assert(multiPrompt.includes('(2girl:'), 'Second dummy tagged');

// --- TEST SUITE 6: Negative prompts ---
console.log('\nSuite 6: Negative Prompts');

const chromaNeg = assembleNegativePrompt(MODELS['chroma']);
const lustifyNeg = assembleNegativePrompt(MODELS['lustify-sdxl']);
assert(chromaNeg.includes('low quality'), 'Chroma negative includes low quality');
assert(lustifyNeg.includes('score_1'), 'Lustify negative includes score_1');
assert(!chromaNeg.includes('score_1'), 'Chroma negative does NOT include score_1');

// --- RESULTS ---
console.log(`\nResults: ${passed} passed, ${failed} failed`);
if (failed > 0) process.exit(1);
```

### 20.2 Manual Test Checklist

**App Shell:**
- [ ] Age gate shows on first load, does not show on subsequent loads
- [ ] Onboarding 3 screens show after age gate, navigate correctly
- [ ] Top bar renders on all pages
- [ ] Bottom navbar active state transitions correctly
- [ ] FAB expands on tap, shows 3 Terminal actions, collapses on outside tap
- [ ] Theme toggle switches between dark and light
- [ ] Page transitions are smooth

**Creation Kit — Form:**
- [ ] All 13 categories render correctly
- [ ] Accordion: only one section open at a time
- [ ] Pill navbar: scrolls horizontally, syncs with accordion
- [ ] Swipe left/right navigates categories
- [ ] Color swatches: select/deselect correctly
- [ ] Shape modals: open with correct image, selecting closes modal and sets value
- [ ] Multi-select checkboxes: toggle correctly
- [ ] Pose max-2 enforcement works
- [ ] Pose incompatibility check prevents invalid pairs
- [ ] Clothing mutual exclusivity: Complete Outfit disables layer fields
- [ ] Nude option clears legwear/footwear
- [ ] Prompt updates in real-time as fields change

**Presets:**
- [ ] Default Dummies load in Creation Kit
- [ ] Save as Doll works, appears on Home
- [ ] Save as Mannequin works, lock state preserved
- [ ] Mannequin lock icons toggle correctly
- [ ] Randomize skips locked fields (no visual change on locked fields)
- [ ] 50-preset limit enforced

**Multi-Dummy:**
- [ ] Tab bar appears when 2+ dummies
- [ ] Switching tabs switches form state
- [ ] Multi-Dummy category hidden with 1 dummy, visible with 2+
- [ ] Max 3 dummies enforced (+ Add button disappears)

**The Lab:**
- [ ] Empty state shows before generation
- [ ] Image viewer shows after generation
- [ ] Download works
- [ ] Copy image works
- [ ] Full-screen works
- [ ] Copy prompt works
- [ ] History thumbnails clickable
- [ ] Pinch-to-zoom works on mobile

**Bridge:**
- [ ] Bridge not detected: install modal shows
- [ ] Bridge detected: Generate fires correctly
- [ ] Loading overlay shows during generation
- [ ] Countdown visible
- [ ] Error banner shows on failure
- [ ] Image appears in Lab on success

**Offline:**
- [ ] Form works offline
- [ ] Presets load offline
- [ ] Prompt engine works offline
- [ ] Generate shows offline message
- [ ] Previously generated images viewable offline

**PWA:**
- [ ] Install prompt appears after first session
- [ ] App is installable
- [ ] Works after installation
- [ ] Icons correct at all sizes
- [ ] Offline after installation

**Keyboard (Desktop):**
- [ ] Ctrl+S saves as Doll
- [ ] Ctrl+G triggers generation
- [ ] Ctrl+Shift+C copies prompt
- [ ] Tab/Shift+Tab navigate categories
- [ ] Ctrl+Z undoes field changes
- [ ] R randomizes unlocked fields

---

## 21. BUILD ORDER & PHASES

Build in this exact order. Each phase is independently functional before moving to the next.

### Phase 1 — Shell & Design System (Foundation)

1. Set up file structure (all directories and empty files)
2. Write `css/style.css` — complete design system (variables, all components)
3. Write `index.html` — app shell, all `div` containers
4. Write `js/app.js` — router only (hash-based navigation stub)
5. Write `js/store.js` — state management, auto-save stub
6. Write navbar, top bar, FAB components (static, no page logic)
7. **Checkpoint:** App renders, navigation between 3 empty pages works, dark theme visible

### Phase 2 — Data Layer

1. Write `data/master_file.json` — all 13 categories, complete field definitions
2. Write `data/addon_file.json` — empty structure (valid but no additions)
3. Write `data/defaultDummies.json` — all 8 archetypes with field values
4. Write `js/storageManager.js` — IndexedDB init, all CRUD operations
5. Write `js/store.js` — connect to storage, implement auto-save, undo stack
6. **Checkpoint:** Data loads, can read/write to IndexedDB, state persists

### Phase 3 — Form & Prompt Engine

1. Write `js/components/formRenderer.js` — dynamic form from JSON schema
2. Write `js/components/colorSwatch.js`, `imageCard.js`, `accordion.js`
3. Write `js/components/modal.js` — shape modal system
4. Write `js/pages/creationKit.js` — full Creation Kit page
5. Write `js/promptEngine.js` — all models, all assembly modes
6. Write `js/modules/prompter.js` — live prompt preview
7. Write `tests/promptEngine.test.js` and run tests
8. **Checkpoint:** Complete form renders, prompt assembles in real-time, all models tested

### Phase 4 — Home & Presets

1. Write `js/modules/presets.js`
2. Write `js/pages/home.js` — all three grids
3. Write `js/components/dummyTabs.js`
4. Implement save/load/delete flows for Dolls and Dummies
5. **Checkpoint:** Home page shows default Dummies, save/load/delete works

### Phase 5 — Terminal & Randomizer

1. Write `js/modules/terminal.js` — Duplicate, Randomize, Reset All
2. Write `js/components/fab.js` — full expand/collapse with Terminal buttons
3. Implement Get 5 and Scene 3 (queued single-job mode)
4. Implement Prompt Mode Override warning
5. **Checkpoint:** FAB works, randomizer works, batch features work

### Phase 6 — The Lab & Bridge

1. Write `js/bridgeManager.js`
2. Write `js/pages/theLab.js` — viewer, history, actions, status panel
3. Write `userscript/xgen-venice-bridge.user.js`
4. Implement loading overlay with countdown
5. Implement image download, copy, fullscreen, copy-prompt actions
6. **Checkpoint:** End-to-end generation works: press Generate → Venice → image in Lab

### Phase 7 — Onboarding & Settings

1. Write `js/components/ageGate.js`
2. Write `js/components/onboarding.js`
3. Write `js/components/bridgeInstall.js`
4. Write Settings panel (as bottom sheet, connected to store)
5. Implement PWA install prompt logic
6. **Checkpoint:** First-launch flow complete, settings functional

### Phase 8 — PWA & Polish

1. Write `manifest.json` and `sw.js` — full service worker with precache
2. Generate all icon sizes from SVG source
3. Implement responsive/desktop layout
4. Implement all keyboard shortcuts
5. Light theme CSS implementation
6. Full manual test checklist pass
7. **Checkpoint:** Installable PWA, works offline, all features complete

---

## 22. DESIGN BRIEF FOR VISUAL DESIGNER

> This section is addressed to a visual designer who will produce brand assets. All values here are final decisions from the product owner.

### Brand Identity Summary

**Name:** x.GEN
**Personality:** Sleek · Dark · Femme · Edgy · Empowering
**Audience:** Female adult content creators aged 18–35

### Logo Requirements

**Wordmark:**
- Font: Geometric sans-serif (Inter 600 or custom)
- `x` in `#e5e7eb` (light gray)
- `.GEN` in `#d0b067` (gold)
- Replication motif on the `x`: 2 ghost layers offset +2px / +4px, 25% and 12% opacity
- Dot styled as solid circular node, 1.3× punctuation size, gold

**App Icon:**
- Layered `x` — three offset layers
- Layer 1 (front): `#e5e7eb`, full opacity
- Layer 2: `#d0b067`, 50% opacity, offset +3px/+2px
- Layer 3: `#f97187`, 25% opacity, offset +6px/+4px
- Background: `#131313`
- Rounded terminals, works at 16px–512px

**Deliverables required:**
- SVG source file (wordmark)
- SVG source file (icon)
- All PNG icon sizes listed in Section 2.3
- Favicon.ico

### Default Dummy Placeholder Portraits

8 AI-generated portrait photographs. Requirements:
- All same aspect ratio: 2:3 (portrait)
- Same composition: centered subject, mid-body crop (waist to top of head)
- Same neutral studio background (slightly blurred, dark neutral)
- Same lighting setup: soft key light from 45° left, subtle rim light
- Each portrait matches the archetype field values in Section 14
- Style: realistic photographic, not illustrated or rendered

### Modal Reference Images

For each `shape-modal` field, a reference grid image is needed. These open when the user taps a field to select an option (e.g. face shape, body type). Requirements:
- Grid of 6–9 options
- Each option: silhouette or anatomical illustration
- Style: minimal line art, monochromatic, clean
- Format: PNG, transparent background, fits `assets/modals/` naming convention
- Required files: `body_types.png`, `ethnicity.png`, `face_shapes.png`, `eye_shapes.png`, `nose_shapes.png`, `lip_shapes.png`, `bust_shapes.png`, `hair_styles.png`, `eyebrow_shapes.png`

### Color Usage Summary

| Color | Hex | Role |
|---|---|---|
| Pink | `#f97187` | Primary interactive — all main CTAs |
| Orange | `#fb923c` | Functional — warnings, icons, attention |
| Gold | `#d0b067` | Identity — wordmark, prompt output, labels |
| Deep black | `#131313` | Deepest background |
| Base black | `#181818` | App background |
| Surface | `#272727` | Cards and panels |
| Light gray | `#e5e7eb` | Body text |

---

## 23. AGENT DECISION LOG

> These are decisions made by the document author in the absence of explicit guidance. Each is reasoned and may be overridden by the product owner.

| ID | Decision | Reasoning |
|---|---|---|
| AD-01 | Tablet breakpoint uses mobile layout, not split-pane | The form requires enough width for the split-pane to be useful. At 768px it would be too cramped. |
| AD-02 | Shape modal images use 3-column grid (6 options = 2 rows of 3) | Standard visual selection pattern; fits both mobile and desktop. |
| AD-03 | Addon file cannot add new fields to existing categories (only append options) | Allowing new fields in existing categories risks breaking the prompt assembly order and field-level logic. |
| AD-04 | "Nude" as Complete Outfit also sets prompt to "nude, naked" explicitly | Both terms improve model adherence across different image models. |
| AD-05 | Batch Get 5 / Scene 3 runs jobs sequentially, not in parallel | Single-job mode requires this. Parallel would require multiple Venice tabs or queue. |
| AD-06 | Reference photo stored in IndexedDB by dummy ID, not per doll/mannequin save | Reference photo is part of the dummy session state and should transfer when saving. |
| AD-07 | Prompter module is collapsible on mobile to give more room to the form | On mobile the form needs maximum space; prompt preview is secondary. |
| AD-08 | Swipe gesture on creation kit uses threshold of 50px before committing | Prevents accidental swipes on scroll. Standard threshold for horizontal swipe detection. |
| AD-09 | Aspect ratio setting applies globally, not per-generation | Simplest UX. Per-generation aspect ratio is available in Terminal for power users. |
| AD-10 | Eye shadow color swatch is only visible when Eye Makeup includes a shadow option | Prevents orphaned color selection with no corresponding makeup. Conditional field visibility. |
| AD-11 | Pose compatibility rules applied client-side with inline validation message, not a blocking modal | Non-blocking validation is better UX. Users understand immediately without interruption. |
| AD-12 | Generation history shows newest first (index 0 = most recent) | Standard expectation for history/feed UIs. |
| AD-13 | Font families (Inter, Fira Code) are fetched from Google Fonts on first load and cached by service worker | Avoids self-hosting complexity while ensuring offline availability after first load. |
| AD-14 | Redo stack cleared on any new field change | Standard behavior for all undo systems. New action invalidates the redo branch. |
| AD-15 | Bridge detection is passive (listens for `xgen:bridge-ready` event); no active polling | Polling would create a false negative during first few seconds of page load. Event-driven is more reliable. |

---

*End of x.GEN Master Build Document — Version 1.0*
*Total sections: 23 | Estimated build complexity: 8 phases | Estimated lines of code: 4,000–6,000*
*All decisions confirmed by product owner except those marked [AGENT DECISION] in the Agent Decision Log.*

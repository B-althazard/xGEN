/**
 * x.GEN — The Lab Page
 * Phase 6: The Lab & Bridge
 * (Stub for Phase 1)
 */

import { store } from '../store.js';
import { triggerGeneration } from '../bridgeManager.js';

let unsub;

export function renderLab() {
  const state = store.getState();
  const images = state.lab.images || [];
  const activeIdx = state.lab.activeImageIndex;

  const emptyEl  = document.getElementById('lab-empty');
  const contentEl = document.getElementById('lab-content');

  if (!images.length || activeIdx < 0) {
    emptyEl.style.display = 'flex';
    contentEl.style.display = 'none';
  } else {
    emptyEl.style.display = 'none';
    contentEl.style.display = 'block';
    renderCurrentImage(images[activeIdx], activeIdx, images.length);
    renderHistory(images);
  }

  bindLabActions();
  updateBridgeStatus();

  unsub?.();
  unsub = store.subscribe(() => {
    const s = store.getState();
    const images = s.lab.images || [];
    const activeIdx = s.lab.activeImageIndex;

    if (!images.length || activeIdx < 0) {
      emptyEl.style.display = 'flex';
      contentEl.style.display = 'none';
    } else {
      emptyEl.style.display = 'none';
      contentEl.style.display = 'block';
      renderCurrentImage(images[activeIdx], activeIdx, images.length);
      renderHistory(images);
    }
  });
}

function renderCurrentImage(img, idx, total) {
  const imgEl    = document.getElementById('lab-image');
  const counterEl = document.getElementById('lab-counter');
  const promptEl = document.getElementById('lab-prompt-display');
  const metaEl   = document.getElementById('lab-meta');

  if (imgEl) {
    imgEl.src = img.dataUrl || '';
    imgEl.alt = `Generated image ${idx + 1}`;
  }
  if (counterEl) counterEl.textContent = `${idx + 1} / ${total}`;
  if (promptEl) promptEl.textContent = img.prompt || '—';
  if (metaEl) {
    const model = img.model || 'unknown';
    const time  = img.generationTime ? `${(img.generationTime / 1000).toFixed(1)}s` : '—';
    metaEl.textContent = `Model: ${model} · Time: ${time}`;
  }
}

function renderHistory(images) {
  const container = document.getElementById('lab-history');
  if (!container) return;

  container.innerHTML = '';
  images.forEach((img, i) => {
    const thumb = document.createElement('div');
    thumb.className = `lab-history-thumb${i === store.getState().lab.activeImageIndex ? ' active' : ''}`;
    thumb.setAttribute('role', 'listitem');
    thumb.innerHTML = `<img src="${img.dataUrl || ''}" alt="Image ${i + 1}" loading="lazy">`;
    thumb.addEventListener('click', () => {
      store.dispatch({ type: 'SET_LAB_IMAGE_INDEX', payload: i });
    });
    container.appendChild(thumb);
  });
}

function bindLabActions() {
  document.getElementById('lab-prev')?.addEventListener('click', () => navigate(-1));
  document.getElementById('lab-next')?.addEventListener('click', () => navigate(1));
  document.getElementById('lab-download')?.addEventListener('click', downloadCurrent);
  document.getElementById('lab-copy')?.addEventListener('click', copyCurrentImage);
  document.getElementById('lab-copy-prompt')?.addEventListener('click', copyPrompt);
  document.getElementById('lab-copy-prompt-btn')?.addEventListener('click', copyPrompt);
  document.getElementById('lab-fullscreen')?.addEventListener('click', openFullscreen);
  document.getElementById('lab-generate-btn')?.addEventListener('click', () => triggerGeneration?.());
  document.getElementById('lab-viewer')?.addEventListener('click', (e) => {
    if (e.target.id === 'lab-viewer' || e.target.id === 'lab-image') openFullscreen();
  });

  document.getElementById('fullscreen-viewer')?.addEventListener('click', () => {
    document.getElementById('fullscreen-viewer')?.classList.remove('open');
  });
}

function navigate(dir) {
  const state = store.getState();
  const images = state.lab.images;
  const idx = state.lab.activeImageIndex;
  const next = Math.max(0, Math.min(images.length - 1, idx + dir));
  store.dispatch({ type: 'SET_LAB_IMAGE_INDEX', payload: next });
}

async function downloadCurrent() {
  const state = store.getState();
  const img = state.lab.images[state.lab.activeImageIndex];
  if (!img?.dataUrl) return;
  const a = document.createElement('a');
  a.href = img.dataUrl;
  a.download = `xgen_${img.nonce || Date.now()}.png`;
  a.click();
}

async function copyCurrentImage() {
  const state = store.getState();
  const img = state.lab.images[state.lab.activeImageIndex];
  if (!img?.dataUrl) return;
  try {
    const resp = await fetch(img.dataUrl);
    const blob = await resp.blob();
    await navigator.clipboard.write([new ClipboardItem({ [blob.type]: blob })]);
    import('../app.js').then(m => m.default.showToast('Image copied!'));
  } catch {
    import('../app.js').then(m => m.default.showToast('Copy failed'));
  }
}

function copyPrompt() {
  const state = store.getState();
  const img = state.lab.images[state.lab.activeImageIndex];
  if (!img?.prompt) return;
  navigator.clipboard.writeText(img.prompt).then(() => {
    import('../app.js').then(m => m.default.showToast('Prompt copied!'));
  });
}

function openFullscreen() {
  const state = store.getState();
  const img = state.lab.images[state.lab.activeImageIndex];
  if (!img?.dataUrl) return;
  const viewer = document.getElementById('fullscreen-viewer');
  const fsImg  = document.getElementById('fullscreen-image');
  if (fsImg) fsImg.src = img.dataUrl;
  viewer?.classList.add('open');
}

function updateBridgeStatus() {
  const state = store.getState();
  const dot = document.getElementById('lab-bridge-dot');
  const text = document.getElementById('lab-status-text');

  if (dot) dot.classList.toggle('connected', state.app.bridgeDetected);
  if (text) text.textContent = state.app.bridgeDetected ? 'Ready to generate' : 'Bridge not detected';
}

export { renderLab };

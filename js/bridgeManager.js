/**
 * x.GEN — Bridge Manager (PWA Side)
 * Phase 6: The Lab & Bridge
 * Uses global window events to avoid circular imports with app.js
 */

import { store } from './store.js';

let bridgeDetected = false;
let currentJobNonce = null;
let jobTimeoutId = null;
const JOB_TIMEOUT_MS = 120000;

export function initBridge() {
  bridgeDetected = false;

  window.addEventListener('xgen:bridge-ready', () => {
    if (bridgeDetected) return;
    bridgeDetected = true;
    store.dispatch({ type: 'SET_BRIDGE_DETECTED', payload: true });
    dispatchAppEvent('bridge-connected');
  });

  window.addEventListener('xgen:status-update', (e) => {
    if (e.detail?.connected === true && !bridgeDetected) {
      bridgeDetected = true;
      store.dispatch({ type: 'SET_BRIDGE_DETECTED', payload: true });
      dispatchAppEvent('bridge-connected');
    }

    if (e.detail?.role?.toLowerCase().includes('venice')) {
      const statusText = String(e.detail.status || '');
      if (/waiting|filling|submitting|submitted|extracting/i.test(statusText)) {
        dispatchAppEvent('set-status', { status: 'generating' });
      }
    }

    dispatchAppEvent('bridge-status', e.detail);
  });

  window.addEventListener('xgen:image-received', async (e) => {
    clearTimeout(jobTimeoutId);
    const payload = e.detail;
    if (payload.nonce !== currentJobNonce) return;
    currentJobNonce = null;

    dispatchAppEvent('hide-loading');
    dispatchAppEvent('clear-error');

    try {
      const { storage } = await import('./storageManager.js');
      await storage.put('images', payload);

      const images = await storage.getAll('images');
      if (images.length > 10) {
        const sorted = images.sort((a, b) => b.ts - a.ts);
        for (let i = 10; i < sorted.length; i++) {
          await storage.delete('images', sorted[i].nonce);
        }
      }

      dispatchAppEvent('add-image', payload);
      dispatchAppEvent('set-status', { status: 'done' });
      dispatchAppEvent('show-toast', 'Image generated!');
      dispatchAppEvent('navigate', 'the-lab');
    } catch (err) {
      console.error('[Bridge] Failed to save image:', err);
    }
  });

  window.addEventListener('xgen:generation-error', (e) => {
    clearTimeout(jobTimeoutId);
    currentJobNonce = null;
    dispatchAppEvent('hide-loading');
    dispatchAppEvent('show-error', `Generation failed: ${e.detail.message}`);
    dispatchAppEvent('set-status', { status: 'failed', error: e.detail.message });
  });
}

function dispatchAppEvent(type, detail) {
  window.dispatchEvent(new CustomEvent(`xgen:app:${type}`, { detail }));
}

export function triggerGeneration() {
  if (!bridgeDetected) {
    window.dispatchEvent(new CustomEvent('xgen:app:open-bridge-install'));
    return;
  }

  if (!navigator.onLine) {
    dispatchAppEvent('show-error', 'Image generation requires connection to Venice.');
    return;
  }

  const state = store.getState();
  const prompt = state.app.currentPrompt || '';
  const negative = state.app.currentNegativePrompt || '';
  const settings = state.app.settings || {};

  if (!prompt.trim()) {
    dispatchAppEvent('show-toast', 'Configure some fields first');
    return;
  }

  currentJobNonce = `${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;

  const fullPayload = {
    nonce: currentJobNonce,
    ts: Date.now(),
    prompt,
    negativePrompt: negative,
    settings: {
      model: settings.defaultModel || 'chroma',
      aspectRatio: settings.defaultAspectRatio || '2:3',
      promptMode: settings.promptMode || 'auto',
      qualityTags: settings.qualityTags || 'auto',
    },
  };

  dispatchAppEvent('set-status', { status: 'sent' });
  dispatchAppEvent('clear-error');
  dispatchAppEvent('show-loading', { timeout: JOB_TIMEOUT_MS });

  jobTimeoutId = setTimeout(() => {
    currentJobNonce = null;
    dispatchAppEvent('hide-loading');
    dispatchAppEvent('show-error', 'Generation timed out after 120 seconds. Check Venice.ai is open.');
    dispatchAppEvent('set-status', { status: 'failed', error: 'timeout' });
  }, JOB_TIMEOUT_MS);

  window.dispatchEvent(new CustomEvent('xgen:generate', { detail: fullPayload }));
}

export function getBridgeStatus() {
  return bridgeDetected;
}

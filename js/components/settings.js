/**
 * x.GEN — Settings Panel
 * Phase 7: Onboarding & Settings
 */

import { store } from '../store.js';

export function openSettings() {
  const panel = document.getElementById('settings-panel');
  const body  = document.getElementById('settings-body');
  if (!panel || !body) return;

  renderSettings(body);
  panel.classList.add('open');

  panel.querySelector('.settings-backdrop')?.addEventListener('click', closeSettings);
  document.getElementById('settings-close')?.addEventListener('click', closeSettings);
}

function closeSettings() {
  document.getElementById('settings-panel')?.classList.remove('open');
}

function renderSettings(body) {
  const state = store.getState();
  const settings = state.app.settings || {};
  const bridgeDetected = state.app.bridgeDetected;

  body.innerHTML = `
    <div class="settings-section">
      <div class="settings-section-title">Appearance</div>
      <div class="settings-row">
        <div>
          <div class="settings-row-label">Theme</div>
        </div>
        <div style="display:flex;gap:8px;">
          <button class="dropdown" id="setting-theme" style="min-width:100px;">
            <option value="dark" ${settings.theme === 'dark' ? 'selected' : ''}>Dark</option>
            <option value="light" ${settings.theme === 'light' ? 'selected' : ''}>Light</option>
          </button>
        </div>
      </div>
    </div>

    <div class="settings-section">
      <div class="settings-section-title">Generation</div>
      <div class="settings-row">
        <div>
          <div class="settings-row-label">Default Model</div>
        </div>
        <select class="dropdown" id="setting-model">
          <option value="chroma"         ${settings.defaultModel === 'chroma'         ? 'selected' : ''}>Chroma1-HD</option>
          <option value="lustify-sdxl"   ${settings.defaultModel === 'lustify-sdxl'   ? 'selected' : ''}>Lustify SDXL</option>
          <option value="lustify-v7"     ${settings.defaultModel === 'lustify-v7'     ? 'selected' : ''}>Lustify v7</option>
          <option value="z-image-turbo"  ${settings.defaultModel === 'z-image-turbo'  ? 'selected' : ''}>Z-Image Turbo</option>
        </select>
      </div>
      <div class="settings-row">
        <div>
          <div class="settings-row-label">Default Aspect Ratio</div>
        </div>
        <select class="dropdown" id="setting-aspect">
          <option value="2:3"  ${settings.defaultAspectRatio === '2:3' ? 'selected' : ''}>2:3</option>
          <option value="1:1"  ${settings.defaultAspectRatio === '1:1' ? 'selected' : ''}>1:1</option>
          <option value="9:16" ${settings.defaultAspectRatio === '9:16' ? 'selected' : ''}>9:16</option>
          <option value="4:3"  ${settings.defaultAspectRatio === '4:3' ? 'selected' : ''}>4:3</option>
          <option value="16:9" ${settings.defaultAspectRatio === '16:9' ? 'selected' : ''}>16:9</option>
        </select>
      </div>
      <div class="settings-row">
        <div>
          <div class="settings-row-label">Prompt Mode</div>
        </div>
        <select class="dropdown" id="setting-prompt-mode">
          <option value="auto"            ${settings.promptMode === 'auto'            ? 'selected' : ''}>Auto</option>
          <option value="natural"         ${settings.promptMode === 'natural'         ? 'selected' : ''}>Natural Language</option>
          <option value="danbooru"         ${settings.promptMode === 'danbooru'         ? 'selected' : ''}>Danbooru Tags</option>
          <option value="score"            ${settings.promptMode === 'score'            ? 'selected' : ''}>Score Tags</option>
        </select>
      </div>
    </div>

    <div class="settings-section">
      <div class="settings-section-title">Bridge</div>
      <div class="settings-row">
        <div>
          <div class="settings-row-label">UserScript Status</div>
        </div>
        <span class="status-badge ${bridgeDetected ? 'success' : 'warning'}">
          ${bridgeDetected ? 'Connected' : 'Not detected'}
        </span>
      </div>
      <div style="padding: 8px 0;">
        <button class="btn btn-secondary btn-full" id="btn-bridge-guide">
          Open Bridge Install Guide
        </button>
      </div>
    </div>

    <div class="settings-section">
      <div class="settings-section-title">Advanced</div>
      <div style="padding: 8px 0;">
        <button class="btn btn-danger btn-full" id="btn-reset-all">
          Reset All Local Data
        </button>
      </div>
    </div>

    <div class="settings-section">
      <div class="settings-section-title">About</div>
      <div style="text-align:center;padding:16px 0;color:var(--text-tertiary);font-size:13px;">
        <div style="font-weight:700;color:var(--color-gold);">✦ x.GEN</div>
        <div style="margin-top:4px;">Private · Proprietary</div>
      </div>
    </div>
  `;

  body.querySelector('#setting-theme')?.addEventListener('change', (e) => {
    const theme = e.target.value;
    document.documentElement.setAttribute('data-theme', theme);
    store.dispatch({ type: 'SET_SETTINGS', payload: { theme } });
  });

  body.querySelector('#setting-model')?.addEventListener('change', (e) => {
    store.dispatch({ type: 'SET_SETTINGS', payload: { defaultModel: e.target.value } });
  });

  body.querySelector('#setting-aspect')?.addEventListener('change', (e) => {
    store.dispatch({ type: 'SET_SETTINGS', payload: { defaultAspectRatio: e.target.value } });
  });

  body.querySelector('#setting-prompt-mode')?.addEventListener('change', (e) => {
    store.dispatch({ type: 'SET_SETTINGS', payload: { promptMode: e.target.value } });
  });

  body.querySelector('#btn-bridge-guide')?.addEventListener('click', () => {
    import('./bridgeInstall.js').then(m => m.showInstallGuide());
  });

  body.querySelector('#btn-reset-all')?.addEventListener('click', () => {
    if (confirm('This will delete all saved Dummies, images, and settings. Continue?')) {
      localStorage.clear();
      indexedDB.deleteDatabase('xgen-db');
      window.location.reload();
    }
  });
}

export { closeSettings };

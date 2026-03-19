/**
 * x.GEN — Presets Module
 * Phase 4: Home & Presets
 */

import { store } from '../store.js';
import { app } from '../app.js';
import { storage } from '../storageManager.js';

const MAX_DUMMIES = 50;

export async function openSaveModal() {
  const state = store.getState();
  const dummy = state.dummies[state.app.activeDummyIndex];
  if (!dummy) return;

  app.openModal({
    title: 'Save Dummy',
    body: `
      <div>
        <label class="input-label">Name</label>
        <input class="input-field" id="save-dummy-name" placeholder="My Dummy" maxlength="32" value="${dummy.name || ''}" autocomplete="off">
        <p style="font-size:11px;color:var(--text-muted);margin-top:4px;">Max 32 characters</p>
      </div>
    `,
    footer: `
      <button class="btn btn-secondary" id="save-cancel">Cancel</button>
      <button class="btn btn-primary" id="save-confirm">Save</button>
    `,
  });

  document.getElementById('save-cancel')?.addEventListener('click', () => app.closeAllModals());
  document.getElementById('save-confirm')?.addEventListener('click', async () => {
    const nameInput = document.getElementById('save-dummy-name');
    const name = (nameInput?.value || '').trim() || 'Untitled';

    if (name.length > 32) {
      app.showToast('Name too long (max 32 chars)');
      return;
    }

    const count = await storage.count('dummies').catch(() => 0);
    if (count >= MAX_DUMMIES) {
      app.openModal({
        title: 'Preset limit reached',
        body: `<p style="color:var(--text-secondary);">You have ${MAX_DUMMIES} saved Dummies. Delete one to save a new one.</p>`,
        footer: `<button class="btn btn-primary" id="limit-ok">OK</button>`,
      });
      document.getElementById('limit-ok')?.addEventListener('click', () => app.closeAllModals());
      return;
    }

    const preset = {
      id: `dummy_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
      type: 'dummy',
      name,
      fields: { ...dummy.fields },
      lockedFields: dummy.lockedFields || [],
      referencePhotoId: dummy.referencePhotoId || null,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    await storage.put('dummies', preset);
    app.closeAllModals();
    app.showToast(`"${name}" saved!`);

    import('../pages/home.js').then(m => m.renderHome?.());
  });

  setTimeout(() => document.getElementById('save-dummy-name')?.focus(), 100);
}

export async function getPresetCount() {
  try {
    return await storage.count('dummies');
  } catch {
    return 0;
  }
}

export { storage };

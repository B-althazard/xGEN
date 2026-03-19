/**
 * x.GEN — Home Page
 * Phase 4: Home & Presets
 * (Stub for Phase 1)
 */

import { store } from '../store.js';

let defaultDummies = [];
let userDummies = [];

export async function renderHome() {
  const gridDefaults = document.getElementById('grid-defaults');
  const gridDummies   = document.getElementById('grid-dummies');
  if (!gridDefaults || !gridDummies) return;

  await loadDefaults();
  renderDefaultCards(gridDefaults);
  renderUserCards(gridDummies);
}

async function loadDefaults() {
  try {
    const res = await fetch('data/defaultDummies.json');
    const data = await res.json();
    defaultDummies = data.dummies || [];
  } catch {
    defaultDummies = [];
  }

  try {
    const { storage } = await import('../storageManager.js');
    userDummies = await storage.getAll('dummies') || [];
  } catch {
    userDummies = [];
  }
}

function renderDefaultCards(container) {
  container.innerHTML = '';
  defaultDummies.forEach((dummy, i) => {
    const card = createPresetCard({
      name: dummy.name,
      type: 'default',
      image: dummy.referencePhotoNonce ? `assets/placeholders/${dummy.id}.jpg` : null,
      placeholder: dummy.name?.charAt(0) || '?',
      badge: null,
      onUse: () => loadDummy(dummy),
    });
    container.appendChild(card);
  });
}

function renderUserCards(container) {
  container.innerHTML = '';
  if (!userDummies.length) {
    container.innerHTML = `
      <div class="empty-state" style="grid-column: 1/-1; padding: 32px 16px;">
        <div class="empty-state-icon">✦</div>
        <div class="empty-state-title">No saved Dummies yet</div>
        <div class="empty-state-desc">Create your first Dummy in the Creation Kit and save it here.</div>
      </div>`;
    return;
  }
  userDummies.forEach(dummy => {
    const card = createPresetCard({
      name: dummy.name,
      type: 'saved',
      badge: dummy.type,
      placeholder: dummy.name?.charAt(0) || '?',
      onUse: () => loadDummy(dummy),
      onDelete: () => deleteDummy(dummy),
    });
    container.appendChild(card);
  });
}

function createPresetCard({ name, type, badge, image, placeholder, onUse, onDelete }) {
  const card = document.createElement('article');
  card.className = 'preset-card';
  card.setAttribute('role', 'listitem');

  const badgeEl = badge ? `<span class="preset-card-badge">${badge}</span>` : '';
  const imgEl   = image
    ? `<img src="${image}" alt="${name}" loading="lazy" onerror="this.style.display='none';this.nextElementSibling.style.display='flex'"><div class="preset-card-placeholder" style="display:none">${placeholder}</div>`
    : `<div class="preset-card-placeholder">${placeholder}</div>`;

  card.innerHTML = `
    ${imgEl}
    ${badgeEl}
    <div class="preset-card-footer">
      <div class="preset-card-name">${name}</div>
      <div class="preset-card-type">${type === 'default' ? 'Default' : 'Dummy'}</div>
    </div>
    <div class="preset-card-menu" aria-label="More options">⋮</div>`;

  card.addEventListener('click', (e) => {
    if (e.target.closest('.preset-card-menu')) {
      showCardMenu(e, { onUse, onDelete, isDefault: type === 'default', name });
    } else {
      onUse?.();
    }
  });

  return card;
}

async function showCardMenu(e, { onUse, onDelete, isDefault, name }) {
  e.stopPropagation();
  const appModule = await import('../app.js');
  const appInstance = appModule.default;

  const items = [
    { label: 'Use', action: onUse },
  ];
  if (!isDefault) {
    items.push({ label: 'Delete', action: () => onDelete?.() });
  }

  const buttons = items.map((item, i) =>
    `<button class="btn btn-secondary" style="${item.label === 'Delete' ? 'color:var(--accent-danger);border-color:rgba(239,68,68,0.3)' : ''}" data-action="${i}">${item.label}</button>`
  ).join('');

  appInstance.openModal({
    title: name,
    body: `<div style="display:flex;flex-direction:column;gap:8px">${buttons}</div>`,
    footer: '',
  });

  items.forEach((item, i) => {
    document.querySelector(`[data-action="${i}"]`)?.addEventListener('click', () => {
      appInstance.closeAllModals();
      item.action?.();
    });
  });
}

async function loadDummy(dummy) {
  const routerModule = await import('../router.js');
  store.dispatch({ type: 'LOAD_DUMMY', payload: { dummy, multi: dummy.multiDummyInteraction } });
  routerModule.router.navigate('creation-kit');
}

async function deleteDummy(dummy) {
  try {
    const { storage } = await import('../storageManager.js');
    await storage.delete('dummies', dummy.id);
    userDummies = userDummies.filter(d => d.id !== dummy.id);
    renderUserCards(document.getElementById('grid-dummies'));
  } catch (e) {
    console.error('Delete failed:', e);
  }
}

export { loadDefaults, renderDefaultCards, renderUserCards };

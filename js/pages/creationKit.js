/**
 * x.GEN — Creation Kit Page
 * Phase 3: Form & Prompt Engine
 * (Stub for Phase 1 — full implementation in Phase 3)
 */

import { store } from '../store.js';
import { renderCategoryNav } from '../components/formRenderer.js';
import { renderCategoryWindow } from '../components/formRenderer.js';
import { assemblePrompt } from '../promptEngine.js';

let unsub;

export function renderCreationKit() {
  const container = document.getElementById('category-navbar');
  const windowEl   = document.getElementById('category-window');
  if (!container || !windowEl) return;

  const state = store.getState();
  const categories = state.app.categories;

  if (!categories.length) {
    windowEl.innerHTML = '<div class="empty-state"><div class="empty-state-title">Loading categories...</div></div>';
    return;
  }

  const activeIdx = state.app.activeCategoryIndex ?? 0;

  renderCategoryNav(container, categories, activeIdx, (idx) => {
    store.dispatch({ type: 'SET_ACTIVE_CATEGORY', payload: idx });
    renderCategoryWindow(windowEl, categories, idx, state.dummies[state.app.activeDummyIndex]?.fields || {});
    renderDummyTabs();
  });

  renderCategoryWindow(windowEl, categories, activeIdx, state.dummies[state.app.activeDummyIndex]?.fields || {});
  renderDummyTabs();
  updatePrompter();
  updateTabsVisibility();

  unsub?.();
  unsub = store.subscribe(() => {
    const s = store.getState();
    updatePrompter(s);
    updateTabsVisibility(s);
  });
}

function renderDummyTabs() {
  const tabsEl   = document.getElementById('dummy-tabs');
  const tabDummy0 = document.getElementById('tab-dummy-0');
  const btnAdd    = document.getElementById('btn-add-dummy');
  if (!tabsEl) return;

  const state = store.getState();
  const dummies = state.dummies;

  tabsEl.innerHTML = '';
  tabsEl.style.display = 'flex';

  dummies.forEach((dummy, i) => {
    const tab = document.createElement('button');
    tab.className = `dummy-tab${i === state.app.activeDummyIndex ? ' active' : ''}`;
    tab.setAttribute('role', 'tab');
    tab.setAttribute('aria-selected', String(i === state.app.activeDummyIndex));
    tab.textContent = dummy.name || `Dummy ${i + 1}`;
    tab.addEventListener('click', () => {
      store.dispatch({ type: 'SET_ACTIVE_DUMMY', payload: i });
      renderDummyTabs();
      renderCategoryWindow(
        document.getElementById('category-window'),
        state.app.categories,
        state.app.activeCategoryIndex ?? 0,
        dummies[i].fields
      );
    });
    tabsEl.appendChild(tab);
  });

  if (dummies.length < 3) {
    const addBtn = document.createElement('button');
    addBtn.className = 'dummy-tab-add';
    addBtn.textContent = '+ Add';
    addBtn.setAttribute('aria-label', 'Add dummy');
    addBtn.addEventListener('click', () => {
      store.dispatch({ type: 'ADD_DUMMY' });
    });
    tabsEl.appendChild(addBtn);
  }
}

function updateTabsVisibility(state) {
  const s = state || store.getState();
  const tabsEl = document.getElementById('dummy-tabs');
  if (tabsEl) {
    tabsEl.style.display = s.dummies.length > 1 ? 'flex' : 'none';
  }
}

function updatePrompter(state) {
  const s = state || store.getState();
  const fields = s.dummies[s.app.activeDummyIndex]?.fields || {};
  const categories = s.app.categories || [];

  const { positive, negative, wordCount } = assemblePrompt(fields, categories, s.app.settings);

  store.dispatch({ type: 'SET_PROMPTS', payload: { prompt: positive, negative } });

  const posEl  = document.getElementById('prompter-positive');
  const negEl  = document.getElementById('prompter-negative');
  const metaEl = document.getElementById('prompter-meta');
  const labelEl = document.getElementById('prompter-label');
  const barFill = document.getElementById('prompter-bar-fill');

  if (posEl)  posEl.textContent  = positive || '—';
  if (negEl)  negEl.textContent  = negative  || '—';
  if (metaEl) metaEl.textContent = `${wordCount} words`;

  const allFields = categories.flatMap(c => c.fields).length;
  const activeFields = categories.flatMap(c => c.fields).filter(f => {
    const v = fields[f.id];
    return v !== null && v !== undefined && (Array.isArray(v) ? v.length > 0 : true);
  }).length;

  if (labelEl) labelEl.textContent = `${activeFields} / ${allFields} fields`;
  if (barFill) barFill.style.width = allFields > 0 ? `${(activeFields / allFields) * 100}%` : '0%';
}

export { updatePrompter };

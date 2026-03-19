/**
 * x.GEN — Creation Kit Page
 * Phase 3: Form & Prompt Engine
 */

import { store } from '../store.js';
import { renderCategoryNav, renderCategoryWindow } from '../components/formRenderer.js';
import { assemblePrompt } from '../promptEngine.js';

let unsub;
let lastRenderSignature = '';

export function renderCreationKit() {
  const container = document.getElementById('category-navbar');
  const windowEl = document.getElementById('category-window');
  if (!container || !windowEl) return;

  renderFromState();

  unsub?.();
  unsub = store.subscribe((state) => {
    const signature = getRenderSignature(state);
    if (signature === lastRenderSignature) return;
    renderFromState(state);
  });
}

function renderFromState(state = store.getState()) {
  const container = document.getElementById('category-navbar');
  const windowEl = document.getElementById('category-window');
  if (!container || !windowEl) return;

  const categories = state.app.categories || [];
  if (!categories.length) {
    windowEl.innerHTML = '<div class="empty-state"><div class="empty-state-title">Loading categories...</div></div>';
    lastRenderSignature = getRenderSignature(state);
    return;
  }

  const activeIdx = Math.min(state.app.activeCategoryIndex ?? 0, categories.length - 1);
  const activeDummy = state.dummies[state.app.activeDummyIndex];
  const fields = activeDummy?.fields || {};

  renderCategoryNav(container, categories, activeIdx, (idx) => {
    store.dispatch({ type: 'SET_ACTIVE_CATEGORY', payload: idx });
  });
  renderCategoryWindow(windowEl, categories, activeIdx, fields);
  renderDummyTabs(state);
  updateTabsVisibility(state);
  updatePrompter(state);

  lastRenderSignature = getRenderSignature(store.getState());
}

function getRenderSignature(state = store.getState()) {
  return JSON.stringify({
    categories: state.app.categories,
    activeCategoryIndex: state.app.activeCategoryIndex,
    activeDummyIndex: state.app.activeDummyIndex,
    dummies: state.dummies,
    settings: {
      defaultModel: state.app.settings?.defaultModel,
      promptMode: state.app.settings?.promptMode,
    },
  });
}

function renderDummyTabs(state = store.getState()) {
  const tabsEl = document.getElementById('dummy-tabs');
  if (!tabsEl) return;

  const dummies = state.dummies || [];
  tabsEl.innerHTML = '';

  dummies.forEach((dummy, i) => {
    const tab = document.createElement('button');
    tab.className = `dummy-tab${i === state.app.activeDummyIndex ? ' active' : ''}`;
    tab.setAttribute('role', 'tab');
    tab.setAttribute('aria-selected', String(i === state.app.activeDummyIndex));
    tab.textContent = dummy.name || `Dummy ${i + 1}`;
    tab.addEventListener('click', () => {
      store.dispatch({ type: 'SET_ACTIVE_DUMMY', payload: i });
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

function updateTabsVisibility(state = store.getState()) {
  const tabsEl = document.getElementById('dummy-tabs');
  if (tabsEl) {
    tabsEl.style.display = state.dummies.length > 1 ? 'flex' : 'none';
  }
}

function updatePrompter(state = store.getState()) {
  const fields = state.dummies[state.app.activeDummyIndex]?.fields || {};
  const categories = state.app.categories || [];
  const { positive, negative, wordCount } = assemblePrompt(fields, categories, state.app.settings || {});

  const posEl = document.getElementById('prompter-positive');
  const negEl = document.getElementById('prompter-negative');
  const metaEl = document.getElementById('prompter-meta');
  const labelEl = document.getElementById('prompter-label');
  const barFill = document.getElementById('prompter-bar-fill');

  if (posEl) posEl.textContent = positive || '—';
  if (negEl) negEl.textContent = negative || '—';
  if (metaEl) metaEl.textContent = `${wordCount} words`;

  const visibleFields = categories.flatMap((category) => {
    if (category.id !== 'futa') return category.fields;
    return category.fields.filter((field) => field.id === 'futa_enabled' || fields.futa_enabled === 'on');
  });

  const activeFields = visibleFields.filter((field) => {
    const value = fields[field.id];
    return value !== null && value !== undefined && (Array.isArray(value) ? value.length > 0 : value !== 'off');
  }).length;

  if (labelEl) labelEl.textContent = `${activeFields} / ${visibleFields.length} fields`;
  if (barFill) barFill.style.width = visibleFields.length ? `${(activeFields / visibleFields.length) * 100}%` : '0%';

  const currentState = store.getState();
  if (
    currentState.app.currentPrompt !== positive ||
    currentState.app.currentNegativePrompt !== negative
  ) {
    store.dispatch({ type: 'SET_PROMPTS', payload: { prompt: positive, negative } });
  }
}

export { renderFromState, updatePrompter };

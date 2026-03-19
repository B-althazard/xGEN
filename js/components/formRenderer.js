/**
 * x.GEN — Form Renderer
 * Phase 3: Form & Prompt Engine
 */

import { store } from '../store.js';
import { app } from '../app.js';

export function renderCategoryNav(container, categories, activeIdx, onSelect) {
  container.innerHTML = '';
  categories.forEach((cat, i) => {
    const pill = document.createElement('button');
    pill.className = `category-pill${i === activeIdx ? ' active' : ''}`;
    pill.textContent = cat.label;
    pill.setAttribute('role', 'tab');
    pill.setAttribute('aria-selected', String(i === activeIdx));
    pill.addEventListener('click', () => onSelect(i));
    container.appendChild(pill);
  });
}

export function renderCategoryWindow(container, categories, activeIdx, fields) {
  const category = categories[activeIdx];
  if (!category) return;

  container.innerHTML = '';

  const activeDummy = store.getState().dummies[store.getState().app.activeDummyIndex];
  const lockedFields = activeDummy?.lockedFields || [];
  const futaEnabled = fields.futa_enabled === 'on';

  if (category.id === 'futa' && !futaEnabled) {
    const hint = document.createElement('div');
    hint.className = 'field-row';
    hint.innerHTML = '<div class="prompter-text prompter-negative">Futa is currently off. Turn it on to configure cock and balls details.</div>';
    container.appendChild(hint);
  }

  category.fields.forEach(field => {
    if (category.id === 'futa' && field.id !== 'futa_enabled' && !futaEnabled) return;

    const value = fields[field.id];
    const isLocked = lockedFields.includes(field.id);

    const fieldEl = createFieldElement(field, value, isLocked);
    container.appendChild(fieldEl);
  });
}

function createFieldElement(field, value, isLocked) {
  const row = document.createElement('div');
  row.className = 'field-row';
  row.dataset.fieldId = field.id;

  const labelRow = document.createElement('div');
  labelRow.className = 'field-label';

  const labelText = document.createElement('span');
  labelText.textContent = field.label;

  const labelRight = document.createElement('div');
  labelRight.className = 'field-label-right';

  const lockBtn = document.createElement('button');
  lockBtn.className = `field-lock-btn${isLocked ? ' locked' : ''}`;
  lockBtn.setAttribute('aria-label', isLocked ? 'Unlock field' : 'Lock field');
  lockBtn.setAttribute('title', isLocked ? 'Locked — will not randomize' : 'Click to lock');
  lockBtn.innerHTML = isLocked ? '🔒' : '🔓';
  lockBtn.addEventListener('click', () => {
    store.dispatch({ type: 'TOGGLE_LOCK_FIELD', payload: { fieldId: field.id } });
    store.pushUndo('toggle_lock', null);
  });

  labelRight.appendChild(lockBtn);
  labelRow.appendChild(labelText);
  labelRow.appendChild(labelRight);

  row.appendChild(labelRow);

  const inputContainer = document.createElement('div');

  switch (field.type) {
    case 'single-select':
      inputContainer.appendChild(createSingleSelect(field, value, isLocked));
      break;
    case 'multi-select':
      inputContainer.appendChild(createMultiSelect(field, value, isLocked));
      break;
    case 'color-swatch':
      inputContainer.appendChild(createColorSwatch(field, value, isLocked));
      break;
    case 'shape-modal':
      inputContainer.appendChild(createShapeModal(field, value, isLocked));
      break;
    default:
      inputContainer.appendChild(createSingleSelect(field, value, isLocked));
  }

  row.appendChild(inputContainer);
  return row;
}

function createSingleSelect(field, value, isLocked) {
  const group = document.createElement('div');
  group.className = 'ss-group';

  field.options.forEach(opt => {
    const btn = document.createElement('button');
    btn.className = `ss-btn${value === opt.id ? ' selected' : ''}`;
    btn.textContent = opt.label;
    btn.setAttribute('role', 'radio');
    btn.setAttribute('aria-checked', String(value === opt.id));
    btn.disabled = isLocked;
    btn.addEventListener('click', () => {
      if (isLocked) return;
      store.pushUndo('field_change', null);
      const newVal = value === opt.id ? null : opt.id;
      store.dispatch({ type: 'SET_FIELD', payload: { fieldId: field.id, value: newVal } });
    });
    group.appendChild(btn);
  });

  return group;
}

function createMultiSelect(field, value, isLocked) {
  const grid = document.createElement('div');
  grid.className = 'ms-grid';

  const selected = Array.isArray(value) ? value : [];

  field.options.forEach(opt => {
    const btn = document.createElement('button');
    const isSelected = selected.includes(opt.id);
    btn.className = `ms-btn${isSelected ? ' selected' : ''}`;
    btn.setAttribute('role', 'checkbox');
    btn.setAttribute('aria-checked', String(isSelected));
    btn.disabled = isLocked;

    const checkbox = document.createElement('span');
    checkbox.className = 'ms-checkbox';
    checkbox.textContent = isSelected ? '✓' : '';

    const label = document.createElement('span');
    label.textContent = opt.label;

    btn.appendChild(checkbox);
    btn.appendChild(label);

    btn.addEventListener('click', () => {
      if (isLocked) return;
      store.pushUndo('field_change', null);
      const currentSelected = Array.isArray(store.getState().dummies[store.getState().app.activeDummyIndex]?.fields[field.id])
        ? store.getState().dummies[store.getState().app.activeDummyIndex].fields[field.id]
        : [];
      const currentlySelected = currentSelected.includes(opt.id);
      const newSelected = currentlySelected
        ? currentSelected.filter(v => v !== opt.id)
        : [...currentSelected, opt.id];
      store.dispatch({ type: 'SET_FIELD', payload: { fieldId: field.id, value: newSelected } });
    });

    grid.appendChild(btn);
  });

  return grid;
}

function createColorSwatch(field, value, isLocked) {
  const wrapper = document.createElement('div');
  wrapper.className = 'swatch-grid';

  const selected = Array.isArray(value) ? value : (value ? [value] : []);
  const multi = field.multiSelect;

  (field.colors || []).forEach(color => {
    const swatch = document.createElement('button');
    swatch.className = `swatch${selected.includes(color.id) ? ' selected' : ''}`;
    swatch.style.background = color.value;
    swatch.setAttribute('aria-label', color.label);
    swatch.disabled = isLocked;

    const tooltip = document.createElement('span');
    tooltip.className = 'swatch-label';
    tooltip.textContent = color.label;
    swatch.appendChild(tooltip);

    swatch.addEventListener('click', () => {
      if (isLocked) return;
      store.pushUndo('field_change', null);
      const currentValue = store.getState().dummies[store.getState().app.activeDummyIndex]?.fields[field.id];
      const currentSelected = Array.isArray(currentValue) ? currentValue : (currentValue ? [currentValue] : []);
      let newVal;
      if (multi) {
        newVal = currentSelected.includes(color.id)
          ? currentSelected.filter(v => v !== color.id)
          : [...currentSelected, color.id];
      } else {
        newVal = currentSelected.includes(color.id) ? null : color.id;
      }
      store.dispatch({ type: 'SET_FIELD', payload: { fieldId: field.id, value: newVal } });
    });

    wrapper.appendChild(swatch);
  });

  return wrapper;
}

function createShapeModal(field, value, isLocked) {
  const trigger = document.createElement('button');
  trigger.className = `ss-btn${value ? ' selected' : ''}`;
  trigger.textContent = value
    ? (field.options.find(o => o.id === value)?.label || 'Select')
    : 'Select';
  trigger.disabled = isLocked;

  trigger.addEventListener('click', () => {
    if (isLocked) return;
    openShapeModal(field, value, (selected) => {
      store.pushUndo('field_change', null);
      store.dispatch({ type: 'SET_FIELD', payload: { fieldId: field.id, value: selected } });
    });
  });

  return trigger;
}

function openShapeModal(field, currentValue, onSelect) {
  const grid = field.options.map(opt => `
    <div class="shape-option${opt.id === currentValue ? ' selected' : ''}" data-id="${opt.id}">
      <div class="shape-option-label">${opt.label}</div>
    </div>
  `).join('');

  app.openModal({
    title: field.label,
    body: `<div class="shape-grid">${grid}</div>`,
    footer: '',
  });

  const modal = document.getElementById('modal-body');
  modal.querySelectorAll('.shape-option').forEach(el => {
    el.addEventListener('click', () => {
      const selected = el.dataset.id;
      onSelect(selected === currentValue ? null : selected);
      app.closeAllModals();
    });
  });
}

// Prompter toggle
document.getElementById('prompter-toggle')?.addEventListener('click', function() {
  const prompter = document.getElementById('module-prompter');
  const isExpanded = prompter.classList.toggle('expanded');
  prompter.classList.toggle('collapsed', !isExpanded);
  this.setAttribute('aria-expanded', String(isExpanded));
});

document.getElementById('prompter-toggle')?.addEventListener('keydown', (e) => {
  if (e.key === 'Enter' || e.key === ' ') {
    e.preventDefault();
    e.target.click();
  }
});

export { createFieldElement };

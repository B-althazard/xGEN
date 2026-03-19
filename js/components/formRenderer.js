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

  category.fields.forEach(field => {
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
    const dummy = store.getState().dummies[store.getState().app.activeDummyIndex];
    renderCategoryWindow(
      document.getElementById('category-window'),
      store.getState().app.categories,
      store.getState().app.activeCategoryIndex ?? 0,
      dummy?.fields || {}
    );
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
      btn.classList.toggle('selected', newVal !== null);
      btn.parentElement.querySelectorAll('.ss-btn').forEach(b => b.setAttribute('aria-checked', 'false'));
      btn.setAttribute('aria-checked', String(newVal !== null));
      import('../pages/creationKit.js').then(m => m.updatePrompter?.());
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
      const newSelected = isSelected
        ? selected.filter(v => v !== opt.id)
        : [...selected, opt.id];
      store.dispatch({ type: 'SET_FIELD', payload: { fieldId: field.id, value: newSelected } });
      btn.classList.toggle('selected', !isSelected);
      checkbox.textContent = !isSelected ? '✓' : '';
      btn.setAttribute('aria-checked', String(!isSelected));
      import('../pages/creationKit.js').then(m => m.updatePrompter?.());
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
      let newVal;
      if (multi) {
        newVal = selected.includes(color.id)
          ? selected.filter(v => v !== color.id)
          : [...selected, color.id];
      } else {
        newVal = selected.includes(color.id) ? null : color.id;
      }
      store.dispatch({ type: 'SET_FIELD', payload: { fieldId: field.id, value: newVal } });
      swatch.classList.toggle('selected', multi ? newVal.includes(color.id) : newVal === color.id);
      if (multi) {
        wrapper.querySelectorAll('.swatch').forEach(s => {
          const id = s.getAttribute('aria-label');
          const c = field.colors.find(cl => cl.label === id);
          s.classList.toggle('selected', newVal.includes(c?.id));
        });
      }
      import('../pages/creationKit.js').then(m => m.updatePrompter?.());
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
      trigger.textContent = selected ? (field.options.find(o => o.id === selected)?.label || 'Select') : 'Select';
      trigger.classList.toggle('selected', !!selected);
      import('../pages/creationKit.js').then(m => m.updatePrompter?.());
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

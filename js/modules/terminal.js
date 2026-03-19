/**
 * x.GEN — Terminal Module
 * Phase 5: Terminal & Randomizer
 */

import { store } from '../store.js';
import { app } from '../app.js';
import { triggerGeneration } from '../bridgeManager.js';

export async function duplicatePrompt() {
  const state = store.getState();
  const prompt = state.app.currentPrompt || '';
  if (!prompt) {
    app.showToast('Nothing to copy yet');
    return;
  }
  try {
    await navigator.clipboard.writeText(prompt);
    app.showToast('Prompt copied!');
  } catch {
    app.showToast('Copy failed');
  }
}

export function randomizeFields() {
  store.dispatch({ type: 'RANDOMIZE_FIELDS' });
  app.showToast('Fields randomized');
}

export function resetAllFields() {
  store.dispatch({ type: 'RESET_ALL_FIELDS' });
  app.showToast('All fields reset');
}

export async function batchGet5() {
  const state = store.getState();
  if (!state.app.bridgeDetected) {
    app.showToast('Bridge not connected');
    return;
  }

  app.showToast('Running Get 5...');

  for (let i = 0; i < 5; i++) {
    store.dispatch({ type: 'RANDOMIZE_FIELDS' });
    await new Promise(resolve => setTimeout(resolve, 500));
    triggerGeneration();
    await new Promise(resolve => setTimeout(resolve, 3000));
  }
}

export async function batchScene3() {
  const state = store.getState();
  if (!state.app.bridgeDetected) {
    app.showToast('Bridge not connected');
    return;
  }

  app.showToast('Running Scene 3...');

  const SCENE_FIELDS = [
    'location', 'scene_type', 'background', 'time_of_day',
    'lighting_style', 'lighting_color', 'lighting_effects',
    'framing', 'lens', 'camera_angle', 'depth_of_field',
    'pose', 'expression', 'eye_contact',
  ];

  const categories = state.app.categories || [];
  const allFieldIds = categories.flatMap(c => c.fields.map(f => f.id));
  const lockedIds = allFieldIds.filter(id => !SCENE_FIELDS.includes(id));

  for (let i = 0; i < 3; i++) {
    const dummy = state.dummies[state.app.activeDummyIndex];
    const newFields = { ...dummy.fields };

    for (const fieldId of SCENE_FIELDS) {
      const field = categories.flatMap(c => c.fields).find(f => f.id === fieldId);
      if (!field || lockedIds.includes(fieldId)) continue;

      if (field.type === 'multi-select') {
        const count = Math.floor(Math.random() * 3);
        const shuffled = [...field.options].sort(() => Math.random() - 0.5);
        newFields[fieldId] = shuffled.slice(0, count).map(o => o.id);
      } else {
        if (Math.random() < 0.15) {
          newFields[fieldId] = null;
        } else {
          const opt = field.options[Math.floor(Math.random() * field.options.length)];
          newFields[fieldId] = opt.id;
        }
      }
    }

    const idx = state.app.activeDummyIndex;
    const dummies = [...state.dummies];
    dummies[idx] = { ...dummies[idx], fields: newFields };
    store.setState({ dummies });

    await new Promise(resolve => setTimeout(resolve, 500));
    triggerGeneration();
    await new Promise(resolve => setTimeout(resolve, 3000));
  }
}

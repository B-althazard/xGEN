/**
 * x.GEN — State Management
 * Phase 1: Shell & Design System
 */

const STORAGE_KEY = 'xgen_state_v1';

function defaultFields() {
  return {
    age: null,
    ethnicity: null,
    body_type: null,
    height: null,
    skin_tone: null,
    skin_detail: [],
    cup_size: null,
    bust_shape: null,
    nipples: null,
    bust_state: [],
    waist: null,
    hips: null,
    ass: null,
    legs: null,
    pussy_style: null,
    pussy_state: null,
    futa_size: null,
    futa_shape: null,
    futa_cut: null,
    futa_state: null,
    futa_cum: null,
    futa_balls: null,
    futa_pussy: null,
    face_shape: null,
    eyes_shape: null,
    eye_color: null,
    eyebrows: null,
    nose_shape: null,
    nose_bridge: null,
    nose_nostrils: null,
    nose_tip: null,
    lips_shape: null,
    hair_color: null,
    hair_length: null,
    hair_style: [],
    foundation: null,
    eye_makeup: [],
    eyeshadow_color: null,
    lashes: null,
    lip_makeup: null,
    lip_color: null,
    blush_effects: [],
    complete_outfit: null,
    upper_type: null,
    upper_style: [],
    upper_color: null,
    lower_type: null,
    lower_style: [],
    lower_color: null,
    legwear: [],
    footwear: null,
    accessories: [],
    location: null,
    scene_type: null,
    background: null,
    time_of_day: null,
    lighting_style: null,
    lighting_color: null,
    lighting_effects: [],
    framing: null,
    lens: null,
    camera_angle: null,
    depth_of_field: null,
    pose: [],
    expression: null,
    eye_contact: null,
    solo_action: null,
    sexual_position: null,
    oral_action: null,
    cum_action: null,
    quality_tags: [],
    style_tags: null,
    interaction_type: null,
    focus: null,
    relationship_dynamic: null,
    proximity: null,
    number_of_people: null,
  };
}

function createDummy(index = 0) {
  return {
    id: `dummy_${Date.now()}_${index}`,
    name: `Dummy ${index + 1}`,
    fields: defaultFields(),
    lockedFields: [],
    referencePhotoId: null,
  };
}

const initialState = {
  app: {
    currentPage: 'home',
    bridgeDetected: false,
    bridgeBannerDismissed: false,
    currentPrompt: '',
    currentNegativePrompt: '',
    activeDummyIndex: 0,
    activeCategoryIndex: 0,
    categories: [],
    settings: {
      theme: 'dark',
      defaultModel: 'chroma',
      defaultAspectRatio: '2:3',
      promptMode: 'auto',
      qualityTags: 'auto',
      enableAddon: false,
      addonStatus: { valid: 0, errors: 0 },
    },
  },
  dummies: [createDummy(0)],
  multiDummyInteraction: {
    interaction_type: null,
    focus: null,
    relationship_dynamic: null,
    proximity: null,
    number_of_people: '1girl',
  },
  lab: {
    images: [],
    activeImageIndex: -1,
    currentJobStatus: 'idle',
    currentJobNonce: null,
    errorMessage: null,
  },
  _undoStack: [],
  _redoStack: [],
};

class Store {
  constructor() {
    this._state = this._load();
    this._listeners = new Set();
    this._autoSaveTimer = null;
  }

  _load() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        return { ...initialState, ...parsed, app: { ...initialState.app, ...parsed.app } };
      }
    } catch {}
    return JSON.parse(JSON.stringify(initialState));
  }

  _save() {
    clearTimeout(this._autoSaveTimer);
    this._autoSaveTimer = setTimeout(() => {
      try {
        const toSave = {
          dummies: this._state.dummies,
          multiDummyInteraction: this._state.multiDummyInteraction,
          app: {
            currentPage: this._state.app.currentPage,
            bridgeDetected: this._state.app.bridgeDetected,
            settings: this._state.app.settings,
            activeDummyIndex: this._state.app.activeDummyIndex,
            activeCategoryIndex: this._state.app.activeCategoryIndex,
          },
        };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(toSave));
      } catch {}
    }, 500);
  }

  getState() {
    return this._state;
  }

  setState(partial) {
    this._state = this._deepMerge(this._state, partial);
    this._notify();
    this._save();
  }

  _deepMerge(target, source) {
    const result = { ...target };
    for (const key of Object.keys(source)) {
      if (source[key] && typeof source[key] === 'object' && !Array.isArray(source[key]) && !(source[key] instanceof Date)) {
        result[key] = this._deepMerge(target[key] || {}, source[key]);
      } else {
        result[key] = source[key];
      }
    }
    return result;
  }

  dispatch(action) {
    switch (action.type) {
      case 'SET_STATE':
        this.setState(action.payload);
        break;

      case 'SET_FIELD': {
        const { fieldId, value } = action.payload;
        const idx = this._state.app.activeDummyIndex;
        const dummies = [...this._state.dummies];
        dummies[idx] = { ...dummies[idx], fields: { ...dummies[idx].fields, [fieldId]: value } };
        this.setState({ dummies });
        break;
      }

      case 'SET_MULTI_FIELD': {
        const { fieldId, value } = action.payload;
        const idx = this._state.app.activeDummyIndex;
        const dummies = [...this._state.dummies];
        dummies[idx] = { ...dummies[idx], fields: { ...dummies[idx].fields, [fieldId]: value } };
        this.setState({ dummies });
        break;
      }

      case 'TOGGLE_LOCK_FIELD': {
        const { fieldId } = action.payload;
        const idx = this._state.app.activeDummyIndex;
        const dummies = [...this._state.dummies];
        const locked = dummies[idx].lockedFields || [];
        const newLocked = locked.includes(fieldId)
          ? locked.filter(f => f !== fieldId)
          : [...locked, fieldId];
        dummies[idx] = { ...dummies[idx], lockedFields: newLocked };
        this.setState({ dummies });
        break;
      }

      case 'SET_ACTIVE_CATEGORY':
        this.setState({ app: { ...this._state.app, activeCategoryIndex: action.payload } });
        break;

      case 'SET_ACTIVE_DUMMY':
        this.setState({ app: { ...this._state.app, activeDummyIndex: action.payload } });
        break;

      case 'ADD_DUMMY': {
        if (this._state.dummies.length >= 3) return;
        const dummies = [...this._state.dummies, createDummy(this._state.dummies.length)];
        this.setState({ dummies, app: { ...this._state.app, activeDummyIndex: dummies.length - 1 } });
        break;
      }

      case 'REMOVE_DUMMY': {
        const { index } = action.payload;
        if (this._state.dummies.length <= 1) return;
        const dummies = this._state.dummies.filter((_, i) => i !== index);
        const activeIdx = Math.min(this._state.app.activeDummyIndex, dummies.length - 1);
        this.setState({ dummies, app: { ...this._state.app, activeDummyIndex: activeIdx } });
        break;
      }

      case 'LOAD_DUMMY': {
        const { dummy, multi } = action.payload;
        const dummies = [dummy];
        this.setState({
          dummies,
          multiDummyInteraction: multi || this._state.multiDummyInteraction,
          app: { ...this._state.app, activeDummyIndex: 0 },
        });
        break;
      }

      case 'RANDOMIZE_FIELDS': {
        const idx = this._state.app.activeDummyIndex;
        const dummy = this._state.dummies[idx];
        const categories = this._state.app.categories || [];
        const locked = dummy.lockedFields || [];
        const newFields = { ...dummy.fields };

        for (const cat of categories) {
          for (const field of cat.fields) {
            if (locked.includes(field.id)) continue;

            if (field.type === 'multi-select' || field.type === 'color-swatch') {
              const count = field.multiSelect ? Math.floor(Math.random() * 4) : (Math.random() < 0.5 ? 1 : 0);
              const shuffled = [...field.options].sort(() => Math.random() - 0.5);
              newFields[field.id] = shuffled.slice(0, count).map(o => o.id);
            } else {
              if (Math.random() < 0.15) {
                newFields[field.id] = null;
              } else {
                const opt = field.options[Math.floor(Math.random() * field.options.length)];
                newFields[field.id] = opt.id;
              }
            }
          }
        }

        const dummies = [...this._state.dummies];
        dummies[idx] = { ...dummy, fields: newFields };
        this.setState({ dummies });
        break;
      }

      case 'RESET_ALL_FIELDS': {
        const idx = this._state.app.activeDummyIndex;
        const dummies = [...this._state.dummies];
        dummies[idx] = { ...dummies[idx], fields: defaultFields() };
        this.setState({ dummies });
        break;
      }

      case 'SET_PROMPTS': {
        this.setState({ app: { ...this._state.app, currentPrompt: action.payload.prompt, currentNegativePrompt: action.payload.negative } });
        break;
      }

      case 'SET_BRIDGE_DETECTED':
        this.setState({ app: { ...this._state.app, bridgeDetected: action.payload } });
        break;

      case 'SET_SETTINGS':
        this.setState({ app: { ...this._state.app, settings: { ...this._state.app.settings, ...action.payload } } });
        break;

      case 'ADD_IMAGE': {
        const images = [action.payload, ...this._state.lab.images].slice(0, 10);
        this.setState({ lab: { ...this._state.lab, images, activeImageIndex: 0 } });
        break;
      }

      case 'SET_LAB_IMAGE_INDEX':
        this.setState({ lab: { ...this._state.lab, activeImageIndex: action.payload } });
        break;

      case 'SET_LAB_STATUS':
        this.setState({ lab: { ...this._state.lab, currentJobStatus: action.payload.status, errorMessage: action.payload.error || null } });
        break;

      case 'SET_CATEGORIES':
        this.setState({ app: { ...this._state.app, categories: action.payload } });
        break;

      case 'SET_MULTI_FIELD': {
        this.setState({ multiDummyInteraction: { ...this._state.multiDummyInteraction, [action.payload.fieldId]: action.payload.value } });
        break;
      }

      case 'UNDO': {
        const stack = [...this._state._undoStack];
        if (!stack.length) return;
        const action = stack.pop();
        this._applyUndo(action);
        this.setState({ _undoStack: stack });
        break;
      }

      case 'REDO': {
        const stack = [...this._state._redoStack];
        if (!stack.length) return;
        const action = stack.pop();
        this._applyUndo(action);
        this.setState({ _redoStack: stack });
        break;
      }

      default:
        console.warn('[Store] Unknown action:', action.type);
    }
  }

  _applyUndo(action) {
    // Simplified: just restore state snapshot
    if (action.snapshot) {
      this._state.dummies = action.snapshot.dummies;
      this._state.multiDummyInteraction = action.snapshot.multiDummyInteraction;
    }
  }

  pushUndo(type, snapshot) {
    const stack = [...this._state._undoStack];
    stack.push({ type, snapshot: JSON.parse(JSON.stringify({ dummies: this._state.dummies, multiDummyInteraction: this._state.multiDummyInteraction })) });
    if (stack.length > 20) stack.shift();
    this.setState({ _undoStack: stack, _redoStack: [] });
  }

  subscribe(fn) {
    this._listeners.add(fn);
    return () => this._listeners.delete(fn);
  }

  _notify() {
    this._listeners.forEach(fn => fn(this._state));
  }

  async init() {
    // Load categories from master_file.json
    try {
      const res = await fetch('data/master_file.json');
      const data = await res.json();
      this.setState({ app: { ...this._state.app, categories: data.categories || [] } });
    } catch (e) {
      console.error('[Store] Failed to load categories:', e);
    }
  }
}

export const store = new Store();
export { createDummy, defaultFields };

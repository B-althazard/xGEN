/**
 * x.GEN — Prompt Engine
 * Phase 3: Form & Prompt Engine
 */

import { store } from './store.js';

export const MODELS = {
  chroma: {
    id: 'chroma',
    label: 'Chroma1-HD',
    promptMode: 'natural',
    cfgScale: 7,
    steps: 20,
    sampler: 'dpm++_2m_sde',
    defaultNegative: [
      'low quality', 'worst quality', 'blurry', 'deformed', 'disfigured',
      'bad anatomy', 'extra limbs', 'missing limbs', 'watermark', 'text',
      'signature', 'ugly', 'gross', 'overexposed', 'underexposed',
    ],
    qualityPrefix: [],
  },
  'lustify-sdxl': {
    id: 'lustify-sdxl',
    label: 'Lustify SDXL',
    promptMode: 'danbooru',
    cfgScale: 3.0,
    steps: 30,
    sampler: 'dpm++_2m_sde',
    defaultNegative: [
      'score_1', 'score_2', 'score_3', 'score_4', 'score_5',
      'low quality', 'worst quality', 'blurry', 'bad anatomy',
      'deformed', 'extra limbs', 'watermark', 'text', 'ugly',
    ],
    qualityPrefix: ['score_9', 'score_8_up', 'score_7_up'],
  },
  'lustify-v7': {
    id: 'lustify-v7',
    label: 'Lustify v7',
    promptMode: 'danbooru',
    cfgScale: 3.5,
    steps: 30,
    sampler: 'dpm++_2m_sde',
    defaultNegative: [
      'score_1', 'score_2', 'score_3', 'score_4',
      'low quality', 'worst quality', 'blurry', 'bad anatomy',
      'deformed', 'extra limbs', 'watermark', 'text',
    ],
    qualityPrefix: ['score_9', 'score_8_up', 'score_7_up'],
  },
  'z-image-turbo': {
    id: 'z-image-turbo',
    label: 'Z-Image Turbo',
    promptMode: 'natural',
    cfgScale: 4,
    steps: 12,
    sampler: 'dpm_sde',
    defaultNegative: [
      'low quality', 'blurry', 'deformed', 'bad anatomy',
      'watermark', 'text', 'ugly',
    ],
    qualityPrefix: [],
  },
};

function getOptionPromptValue(categories, fieldId, value) {
  for (const cat of categories) {
    const field = cat.fields.find(f => f.id === fieldId);
    if (!field) continue;

    if (Array.isArray(value)) {
      return value
        .map(v => field.options?.find(o => o.id === v)?.promptValue)
        .filter(Boolean)
        .join(', ');
    }

    const opt = field.options?.find(o => o.id === value);
    return opt?.promptValue || '';
  }
  return '';
}

function findField(categories, fieldId) {
  for (const cat of categories) {
    const field = cat.fields.find(f => f.id === fieldId);
    if (field) return field;
  }
  return null;
}

export function assemblePrompt(fields, categories, settings = {}) {
  const modelId = settings.defaultModel || 'chroma';
  const model   = MODELS[modelId] || MODELS.chroma;

  const parts = [];
  const negParts = [];

  if (model.qualityPrefix.length) {
    parts.push(model.qualityPrefix.join(', '));
  }

  parts.push('photorealistic photography, RAW photo');

  const order = [
    'ethnicity', 'age',
    'body_type', 'height', 'skin_tone', 'skin_detail',
    'cup_size', 'bust_shape', 'nipples', 'bust_state',
    'waist', 'hips', 'ass', 'legs',
    'pussy_style', 'pussy_state',
    'futa_size', 'futa_shape', 'futa_cut', 'futa_state', 'futa_cum', 'futa_balls', 'futa_pussy',
    'face_shape', 'eyes_shape', 'eye_color', 'eyebrows', 'nose_shape', 'lips_shape',
    'hair_color', 'hair_length', 'hair_style',
    'foundation', 'eye_makeup', 'eyeshadow_color', 'lashes', 'lip_makeup', 'blush_effects',
    'complete_outfit',
    'upper_type', 'upper_style', 'upper_color',
    'lower_type', 'lower_style', 'lower_color',
    'legwear', 'footwear', 'accessories',
    'location', 'scene_type', 'background', 'time_of_day',
    'lighting_style', 'lighting_color', 'lighting_effects',
    'framing', 'lens', 'camera_angle', 'depth_of_field',
    'pose', 'expression', 'eye_contact',
    'solo_action', 'sexual_position', 'oral_action', 'cum_action',
    'quality_tags', 'style_tags',
  ];

  const usedParts = new Set();

  for (const fieldId of order) {
    const field = findField(categories, fieldId);
    if (!field) continue;

    const value = fields[fieldId];
    if (value === null || value === undefined) continue;
    if (Array.isArray(value) && value.length === 0) continue;

    let pv;
    if (fieldId === 'ass' && value) {
      const opt = field.options?.find(o => o.id === value);
      pv = opt?.promptValue || '';
    } else {
      pv = getOptionPromptValue(categories, fieldId, value);
    }

    if (!pv) continue;
    if (usedParts.has(pv)) continue;
    usedParts.add(pv);
    parts.push(pv);
  }

  for (const tag of model.defaultNegative) {
    negParts.push(tag);
  }

  const universal = [
    'multiple views', 'comic', 'cartoon', 'anime', 'illustration',
    'painting', 'sketch', 'render', 'CGI', '3d render',
    'bad hands', 'extra fingers', 'missing fingers', 'deformed hands',
    'bad face', 'ugly face', 'asymmetric face',
  ];

  const negative = [...new Set([...negParts, ...universal])].join(', ');
  const positive = parts.filter(Boolean).join(', ');
  const wordCount = positive.split(/\s+/).filter(Boolean).length;

  return { positive, negative, wordCount };
}

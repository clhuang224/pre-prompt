import {
  DEFAULT_INPUT_TEXT,
  DEFAULT_MAPPINGS,
  INPUT_STORAGE_KEY,
  STORAGE_KEY,
} from './constants.js';

export function loadMappings() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
  } catch {
    return [];
  }
}

export function saveMappings(mappings) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(mappings));
}

export function normalizeMappings(mappings) {
  if (!Array.isArray(mappings)) {
    throw new Error('Invalid mappings format');
  }

  return mappings.map(map => ({
    from: typeof map.from === 'string' ? map.from : '',
    to: typeof map.to === 'string' ? map.to : '',
    enabled: map.enabled !== false,
  }));
}

export function saveInputText(text) {
  localStorage.setItem(INPUT_STORAGE_KEY, text);
}

export function loadInputText() {
  return localStorage.getItem(INPUT_STORAGE_KEY) || '';
}

export function initializeDefaultData() {
  const hasStoredMappings = localStorage.getItem(STORAGE_KEY) !== null;
  const hasStoredInput = localStorage.getItem(INPUT_STORAGE_KEY) !== null;

  if (!hasStoredMappings) {
    saveMappings(DEFAULT_MAPPINGS);
  }

  if (!hasStoredInput) {
    saveInputText(DEFAULT_INPUT_TEXT);
  }
}

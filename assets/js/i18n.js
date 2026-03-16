import { LANGUAGE_STORAGE_KEY } from './constants.js';
import { en } from './locales/en.js';
import { ja } from './locales/ja.js';
import { zhTW } from './locales/zh-TW.js';

const locales = {
  'zh-TW': zhTW,
  en,
  ja,
};

const defaultLocaleCode = 'zh-TW';

function normalizeLocaleCode(localeCode) {
  if (!localeCode) {
    return defaultLocaleCode;
  }

  if (locales[localeCode]) {
    return localeCode;
  }

  const baseCode = localeCode.split('-')[0];
  if (baseCode === 'zh') {
    return 'zh-TW';
  }
  if (baseCode === 'en') {
    return 'en';
  }
  if (baseCode === 'ja') {
    return 'ja';
  }

  return defaultLocaleCode;
}

export function getInitialLocaleCode() {
  const stored = localStorage.getItem(LANGUAGE_STORAGE_KEY);
  return normalizeLocaleCode(stored || navigator.language);
}

export function saveLocaleCode(localeCode) {
  localStorage.setItem(LANGUAGE_STORAGE_KEY, normalizeLocaleCode(localeCode));
}

export function getLocale(localeCode) {
  return locales[normalizeLocaleCode(localeCode)];
}

export function getLocaleOptions() {
  return Object.values(locales).map(locale => ({
    code: locale.code,
    name: locale.name,
  }));
}

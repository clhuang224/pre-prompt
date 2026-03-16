import { TOAST_DURATION_MS } from './constants.js';
import {
  getInitialLocaleCode,
  getLocale,
  getLocaleOptions,
  saveLocaleCode,
} from './i18n.js';
import {
  initializeDefaultData,
  loadInputText,
  loadMappings,
  normalizeMappings,
  saveInputText,
  saveMappings,
} from './storage.js';
import { createToastController } from './toast.js';
import { bindCopyOutput, updateOutput } from './output.js';
import { renderMappings } from './mappings.js';
import { createSortable } from './sortable.js';
import { exportMappings, importMappingsFromFile } from './import-export.js';

const htmlElement = document.documentElement;
const inputText = document.getElementById('inputText');
const outputText = document.getElementById('outputText');
const mappingsDiv = document.getElementById('mappings');
const addMappingBtn = document.getElementById('addMapping');
const exportMappingsBtn = document.getElementById('exportMappings');
const importMappingsBtn = document.getElementById('importMappings');
const importFileInput = document.getElementById('importFile');
const statusMessage = document.getElementById('statusMessage');
const languageLabel = document.getElementById('languageLabel');
const languageSelect = document.getElementById('languageSelect');
const heroEyebrow = document.getElementById('heroEyebrow');
const heroCopy = document.getElementById('heroCopy');
const inputLabel = document.getElementById('inputLabel');
const outputLabel = document.getElementById('outputLabel');
const mappingKicker = document.getElementById('mappingKicker');
const mappingTitle = document.getElementById('mappingTitle');

const { setStatus, clearStatus } = createToastController(statusMessage, TOAST_DURATION_MS);

let mappings = [];
let sortableInstance = null;
let currentLocale = getLocale(getInitialLocaleCode());

function persistMappings() {
  saveMappings(mappings);
}

function refreshOutput() {
  updateOutput(inputText, outputText, mappings);
}

function getMessages() {
  return currentLocale.messages;
}

function getUiText() {
  return currentLocale.ui;
}

function bindSortable() {
  sortableInstance?.destroy();
  sortableInstance = createSortable(mappingsDiv, {
    onStart() {
      document.body.classList.add('is-sorting-active');
    },
    onEnd(event) {
      document.body.classList.remove('is-sorting-active');

      if (event.oldIndex == null || event.newIndex == null || event.oldIndex === event.newIndex) {
        return;
      }

      const [movedItem] = mappings.splice(event.oldIndex, 1);
      mappings.splice(event.newIndex, 0, movedItem);
      persistMappings();
      refreshMappings();
      refreshOutput();
    },
  });
}

function refreshMappings() {
  renderMappings(mappingsDiv, mappings, {
    onToggle(index, enabled) {
      mappings[index].enabled = enabled;
      persistMappings();
      refreshOutput();
    },
    onEdit(index, key, value) {
      mappings[index][key] = value;
      persistMappings();
      refreshOutput();
    },
    onDelete(index) {
      mappings.splice(index, 1);
      persistMappings();
      refreshMappings();
      refreshOutput();
    },
  }, getUiText());

  bindSortable();
}

function addMapping() {
  mappings.push({ from: '', to: '', enabled: true });
  persistMappings();
  refreshMappings();
  clearStatus();
}

function handleImportClick() {
  if (mappings.length > 0) {
    const confirmed = window.confirm(getMessages().importConfirm);

    if (!confirmed) {
      setStatus(getMessages().importCancelled);
      return;
    }
  }

  importFileInput.click();
}

function handleImportedMappings(importedMappings) {
  mappings = importedMappings;
  persistMappings();
  refreshMappings();
  refreshOutput();
}

function populateLanguageOptions() {
  languageSelect.innerHTML = '';

  getLocaleOptions().forEach(locale => {
    const option = document.createElement('option');
    option.value = locale.code;
    option.textContent = locale.name;
    languageSelect.appendChild(option);
  });
}

function applyLocale() {
  const uiText = getUiText();

  htmlElement.lang = currentLocale.meta.htmlLang;
  document.title = currentLocale.meta.title;
  heroEyebrow.textContent = uiText.heroEyebrow;
  heroCopy.textContent = uiText.heroCopy;
  languageLabel.textContent = uiText.languageLabel;
  inputLabel.textContent = uiText.inputLabel;
  inputText.placeholder = uiText.inputPlaceholder;
  outputLabel.textContent = uiText.outputLabel;
  outputText.title = uiText.outputTitle;
  mappingKicker.textContent = uiText.mappingKicker;
  mappingTitle.textContent = uiText.mappingTitle;
  exportMappingsBtn.textContent = uiText.exportMappings;
  importMappingsBtn.textContent = uiText.importMappings;
  addMappingBtn.textContent = uiText.addMapping;
  mappingsDiv.dataset.emptyText = uiText.emptyMappings;
  languageSelect.setAttribute('aria-label', uiText.languageLabel);
  languageSelect.value = currentLocale.code;
  refreshMappings();
}

function initializeApp() {
  populateLanguageOptions();
  initializeDefaultData(currentLocale.defaults);
  mappings = loadMappings();

  inputText.value = loadInputText();
  applyLocale();
  refreshOutput();
  clearStatus();

  inputText.addEventListener('input', () => {
    saveInputText(inputText.value);
    refreshOutput();
  });

  languageSelect.addEventListener('change', () => {
    currentLocale = getLocale(languageSelect.value);
    saveLocaleCode(currentLocale.code);
    applyLocale();
  });

  addMappingBtn.addEventListener('click', addMapping);
  exportMappingsBtn.addEventListener('click', () => {
    exportMappings(mappings, getMessages(), setStatus);
  });
  importMappingsBtn.addEventListener('click', handleImportClick);
  importFileInput.addEventListener('change', event => {
    importMappingsFromFile(
      event.target.files[0],
      normalizeMappings,
      handleImportedMappings,
      getMessages(),
      setStatus,
    );
    importFileInput.value = '';
  });

  bindCopyOutput(outputText, getMessages, setStatus);

  window.addEventListener('storage', () => {
    currentLocale = getLocale(getInitialLocaleCode());
    mappings = loadMappings();
    inputText.value = loadInputText();
    applyLocale();
    refreshOutput();
  });
}

initializeApp();

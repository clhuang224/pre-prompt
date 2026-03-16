import { TOAST_DURATION_MS } from './constants.js';
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

const inputText = document.getElementById('inputText');
const outputText = document.getElementById('outputText');
const mappingsDiv = document.getElementById('mappings');
const addMappingBtn = document.getElementById('addMapping');
const exportMappingsBtn = document.getElementById('exportMappings');
const importMappingsBtn = document.getElementById('importMappings');
const importFileInput = document.getElementById('importFile');
const statusMessage = document.getElementById('statusMessage');

const { setStatus } = createToastController(statusMessage, TOAST_DURATION_MS);

let mappings = [];
let sortableInstance = null;

function persistMappings() {
  saveMappings(mappings);
}

function refreshOutput() {
  updateOutput(inputText, outputText, mappings);
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
  });

  bindSortable();
}

function addMapping() {
  mappings.push({ from: '', to: '', enabled: true });
  persistMappings();
  refreshMappings();
  setStatus('');
}

function handleImportClick() {
  if (mappings.length > 0) {
    const confirmed = window.confirm('一旦匯入，會覆蓋畫面上的詞組資料，確定要繼續嗎？');

    if (!confirmed) {
      setStatus('已取消匯入');
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

function initializeApp() {
  initializeDefaultData();
  mappings = loadMappings();

  inputText.value = loadInputText();
  refreshMappings();
  refreshOutput();
  setStatus('');

  inputText.addEventListener('input', () => {
    saveInputText(inputText.value);
    refreshOutput();
  });

  addMappingBtn.addEventListener('click', addMapping);
  exportMappingsBtn.addEventListener('click', () => {
    exportMappings(mappings, setStatus);
  });
  importMappingsBtn.addEventListener('click', handleImportClick);
  importFileInput.addEventListener('change', event => {
    importMappingsFromFile(
      event.target.files[0],
      normalizeMappings,
      handleImportedMappings,
      setStatus,
    );
    importFileInput.value = '';
  });

  bindCopyOutput(outputText, setStatus);

  window.addEventListener('storage', () => {
    mappings = loadMappings();
    inputText.value = loadInputText();
    refreshMappings();
    refreshOutput();
  });
}

initializeApp();

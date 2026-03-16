const inputText = document.getElementById('inputText');
const outputText = document.getElementById('outputText');
const mappingsDiv = document.getElementById('mappings');
const addMappingBtn = document.getElementById('addMapping');
const exportMappingsBtn = document.getElementById('exportMappings');
const importMappingsBtn = document.getElementById('importMappings');
const importFileInput = document.getElementById('importFile');
const statusMessage = document.getElementById('statusMessage');
const STORAGE_KEY = 'word_mappings_v1';
const INPUT_STORAGE_KEY = 'input_text_v1';
const TOAST_DURATION_MS = 2400;
const DEFAULT_INPUT_TEXT = '竹筍公主最喜歡吃北門口肉圓，配上東泉辣椒醬。';
const DEFAULT_MAPPINGS = [
  { from: '竹筍公主', to: '我朋友', enabled: true },
  { from: '東泉辣椒醬', to: '台中神醬', enabled: true },
  { from: '北門口肉圓', to: '彰化第一肉圓', enabled: false },
  { from: '', to: '', enabled: true },
];
let toastTimerId;

function loadMappings() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
  } catch {
    return [];
  }
}

function saveMappings(mappings) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(mappings));
}

function normalizeMappings(mappings) {
  if (!Array.isArray(mappings)) {
    throw new Error('Invalid mappings format');
  }

  return mappings.map(map => ({
    from: typeof map.from === 'string' ? map.from : '',
    to: typeof map.to === 'string' ? map.to : '',
    enabled: map.enabled !== false,
  }));
}

function setStatus(message) {
  statusMessage.textContent = message;
  statusMessage.classList.remove('is-visible');

  if (toastTimerId) {
    window.clearTimeout(toastTimerId);
    toastTimerId = undefined;
  }

  if (!message) {
    return;
  }

  requestAnimationFrame(() => {
    statusMessage.classList.add('is-visible');
  });

  toastTimerId = window.setTimeout(() => {
    statusMessage.classList.remove('is-visible');
    toastTimerId = undefined;
  }, TOAST_DURATION_MS);
}

function renderMappings(mappings) {
  mappingsDiv.innerHTML = '';
  mappings.forEach((map, idx) => {
    const row = document.createElement('div');
    row.className = 'mapping-row';

    const switchLabel = document.createElement('label');
    switchLabel.className = 'switch';
    switchLabel.title = '啟用';

    const enable = document.createElement('input');
    enable.type = 'checkbox';
    enable.checked = map.enabled !== false;
    enable.addEventListener('change', () => {
      mappings[idx].enabled = enable.checked;
      saveMappings(mappings);
      updateOutput();
    });

    const switchSlider = document.createElement('span');
    switchSlider.className = 'switch-slider';

    switchLabel.appendChild(enable);
    switchLabel.appendChild(switchSlider);

    const from = document.createElement('input');
    from.type = 'text';
    from.placeholder = '原字詞';
    from.value = map.from;
    from.addEventListener('input', () => {
      mappings[idx].from = from.value;
      saveMappings(mappings);
      updateOutput();
    });

    const to = document.createElement('input');
    to.type = 'text';
    to.placeholder = '新字詞';
    to.value = map.to;
    to.addEventListener('input', () => {
      mappings[idx].to = to.value;
      saveMappings(mappings);
      updateOutput();
    });

    const del = document.createElement('button');
    del.textContent = '刪除';
    del.addEventListener('click', () => {
      mappings.splice(idx, 1);
      saveMappings(mappings);
      renderMappings(mappings);
      updateOutput();
    });

    row.appendChild(switchLabel);
    row.appendChild(from);
    row.appendChild(to);
    row.appendChild(del);
    mappingsDiv.appendChild(row);
  });
}

function updateOutput() {
  const mappings = loadMappings();
  let text = inputText.value;

  mappings.forEach(map => {
    if (map.enabled !== false && map.from) {
      // 新字詞自動加上 _ 前後綴
      const toWord = map.to ? `_${map.to}_` : '';
      const pattern = new RegExp(escapeRegExp(map.from), 'g');
      text = text.replace(pattern, toWord);
    }
  });

  outputText.value = text;
}

function escapeRegExp(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function addMapping() {
  const mappings = loadMappings();
  mappings.push({ from: '', to: '', enabled: true });
  saveMappings(mappings);
  renderMappings(mappings);
  setStatus('');
}

function saveInputText(text) {
  localStorage.setItem(INPUT_STORAGE_KEY, text);
}

function loadInputText() {
  return localStorage.getItem(INPUT_STORAGE_KEY) || '';
}

function initializeDefaultData() {
  const hasStoredMappings = localStorage.getItem(STORAGE_KEY) !== null;
  const hasStoredInput = localStorage.getItem(INPUT_STORAGE_KEY) !== null;

  if (!hasStoredMappings) {
    saveMappings(DEFAULT_MAPPINGS);
  }

  if (!hasStoredInput) {
    saveInputText(DEFAULT_INPUT_TEXT);
  }
}

function exportMappings() {
  const mappings = loadMappings();
  const payload = {
    version: 1,
    exportedAt: new Date().toISOString(),
    mappings,
  };
  const blob = new Blob([JSON.stringify(payload, null, 2)], {
    type: 'application/json',
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');

  link.href = url;
  link.download = 'preprompt-mappings.json';
  link.click();
  URL.revokeObjectURL(url);
  setStatus(`已匯出 ${mappings.length} 筆詞組`);
}

function importMappingsFromFile(file) {
  if (!file) {
    return;
  }

  const reader = new FileReader();
  reader.addEventListener('load', () => {
    try {
      const parsed = JSON.parse(reader.result);
      const importedMappings = normalizeMappings(parsed.mappings ?? parsed);
      saveMappings(importedMappings);
      renderMappings(importedMappings);
      updateOutput();
      setStatus(`已匯入 ${importedMappings.length} 筆詞組`);
    } catch {
      setStatus('匯入失敗，請確認 JSON 格式正確');
    }
  });
  reader.readAsText(file);
}

async function copyOutputText() {
  const text = outputText.value;

  if (!text) {
    setStatus('目前沒有可複製的內容');
    return;
  }

  try {
    await navigator.clipboard.writeText(text);
    setStatus('已複製結果');
  } catch {
    outputText.focus();
    outputText.select();
    outputText.setSelectionRange(0, text.length);

    const copied = document.execCommand('copy');
    window.getSelection()?.removeAllRanges();

    if (copied) {
      setStatus('已複製結果');
      return;
    }

    setStatus('複製失敗，請手動複製');
  }
}

inputText.value = loadInputText();
inputText.addEventListener('input', () => {
  saveInputText(inputText.value);
  updateOutput();
});
outputText.addEventListener('click', copyOutputText);

addMappingBtn.addEventListener('click', addMapping);
exportMappingsBtn.addEventListener('click', exportMappings);
importMappingsBtn.addEventListener('click', () => {
  const hasMappingsOnScreen = loadMappings().length > 0;

  if (hasMappingsOnScreen) {
    const confirmed = window.confirm('一旦匯入，會覆蓋畫面上的詞組資料，確定要繼續嗎？');

    if (!confirmed) {
      setStatus('已取消匯入');
      return;
    }
  }

  importFileInput.click();
});
importFileInput.addEventListener('change', event => {
  importMappingsFromFile(event.target.files[0]);
  importFileInput.value = '';
});

initializeDefaultData();
renderMappings(loadMappings());
inputText.value = loadInputText();
updateOutput();
setStatus('');

window.addEventListener('storage', () => {
  inputText.value = loadInputText();
  renderMappings(loadMappings());
  updateOutput();
});

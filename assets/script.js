const inputText = document.getElementById('inputText');
const outputText = document.getElementById('outputText');
const mappingsDiv = document.getElementById('mappings');
const addMappingBtn = document.getElementById('addMapping');
const STORAGE_KEY = 'word_mappings_v1';
const INPUT_STORAGE_KEY = 'input_text_v1';

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

function renderMappings(mappings) {
  mappingsDiv.innerHTML = '';
  mappings.forEach((map, idx) => {
    const row = document.createElement('div');
    row.className = 'mapping-row';

    const enable = document.createElement('input');
    enable.type = 'checkbox';
    enable.checked = map.enabled !== false;
    enable.title = '啟用';
    enable.addEventListener('change', () => {
      mappings[idx].enabled = enable.checked;
      saveMappings(mappings);
      updateOutput();
    });

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

    row.appendChild(enable);
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
}

function saveInputText(text) {
  localStorage.setItem(INPUT_STORAGE_KEY, text);
}

function loadInputText() {
  return localStorage.getItem(INPUT_STORAGE_KEY) || '';
}

inputText.value = loadInputText();
inputText.addEventListener('input', () => {
  saveInputText(inputText.value);
  updateOutput();
});

addMappingBtn.addEventListener('click', addMapping);

renderMappings(loadMappings());
updateOutput();

window.addEventListener('storage', () => {
  inputText.value = loadInputText();
  renderMappings(loadMappings());
  updateOutput();
});

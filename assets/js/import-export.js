export function exportMappings(mappings, setStatus) {
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

export function importMappingsFromFile(file, normalizeMappings, onImported, setStatus) {
  if (!file) {
    return;
  }

  const reader = new FileReader();
  reader.addEventListener('load', () => {
    try {
      const parsed = JSON.parse(reader.result);
      const importedMappings = normalizeMappings(parsed.mappings ?? parsed);
      onImported(importedMappings);
      setStatus(`已匯入 ${importedMappings.length} 筆詞組`);
    } catch {
      setStatus('匯入失敗，請確認 JSON 格式正確');
    }
  });
  reader.readAsText(file);
}

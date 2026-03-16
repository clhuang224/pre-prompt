export function exportMappings(mappings, messages, setStatus) {
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
  setStatus(messages.exportSuccess(mappings.length));
}

export function importMappingsFromFile(file, normalizeMappings, onImported, messages, setStatus) {
  if (!file) {
    return;
  }

  const reader = new FileReader();
  reader.addEventListener('load', () => {
    try {
      const parsed = JSON.parse(reader.result);
      const importedMappings = normalizeMappings(parsed.mappings ?? parsed);
      onImported(importedMappings);
      setStatus(messages.importSuccess(importedMappings.length));
    } catch {
      setStatus(messages.importFailed);
    }
  });
  reader.readAsText(file);
}

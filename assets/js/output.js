function escapeRegExp(text) {
  return text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

export function updateOutput(inputElement, outputElement, mappings) {
  let text = inputElement.value;

  mappings.forEach(map => {
    if (map.enabled !== false && map.from) {
      const replacement = map.to ? `_${map.to}_` : '';
      const pattern = new RegExp(escapeRegExp(map.from), 'g');
      text = text.replace(pattern, replacement);
    }
  });

  outputElement.value = text;
}

export function bindCopyOutput(outputElement, setStatus) {
  async function copyOutputText() {
    const text = outputElement.value;

    if (!text) {
      setStatus('目前沒有可複製的內容');
      return;
    }

    try {
      await navigator.clipboard.writeText(text);
      setStatus('已複製結果');
    } catch {
      outputElement.focus();
      outputElement.select();
      outputElement.setSelectionRange(0, text.length);

      const copied = document.execCommand('copy');
      window.getSelection()?.removeAllRanges();

      if (copied) {
        setStatus('已複製結果');
        return;
      }

      setStatus('複製失敗，請手動複製');
    }
  }

  outputElement.addEventListener('click', copyOutputText);
}

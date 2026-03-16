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

export function bindCopyOutput(outputElement, getMessages, setStatus) {
  async function copyOutputText() {
    const text = outputElement.value;
    const messages = getMessages();

    if (!text) {
      setStatus(messages.copyEmpty);
      return;
    }

    try {
      await navigator.clipboard.writeText(text);
      setStatus(messages.copySuccess);
    } catch {
      outputElement.focus();
      outputElement.select();
      outputElement.setSelectionRange(0, text.length);

      const copied = document.execCommand('copy');
      window.getSelection()?.removeAllRanges();

      if (copied) {
        setStatus(messages.copySuccess);
        return;
      }

      setStatus(messages.copyFailed);
    }
  }

  outputElement.addEventListener('click', copyOutputText);
}

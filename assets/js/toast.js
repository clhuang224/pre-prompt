export function createToastController(statusElement, durationMs) {
  let timerId;
  let lastMessage = '';

  function setStatus(message) {
    lastMessage = message;
    statusElement.textContent = message;
    statusElement.classList.remove('is-visible');

    if (timerId) {
      window.clearTimeout(timerId);
      timerId = undefined;
    }

    if (!message) {
      return;
    }

    requestAnimationFrame(() => {
      statusElement.classList.add('is-visible');
    });

    timerId = window.setTimeout(() => {
      statusElement.classList.remove('is-visible');
      timerId = undefined;
    }, durationMs);
  }

  function clearStatus() {
    setStatus('');
  }

  function getLastMessage() {
    return lastMessage;
  }

  return { setStatus, clearStatus, getLastMessage };
}

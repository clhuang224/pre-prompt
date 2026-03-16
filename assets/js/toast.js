export function createToastController(statusElement, durationMs) {
  let timerId;

  function setStatus(message) {
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

  return { setStatus };
}

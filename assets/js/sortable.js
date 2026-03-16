export function createSortable(container, callbacks) {
  if (typeof window.Sortable === 'undefined') {
    return null;
  }

  return window.Sortable.create(container, {
    animation: 180,
    handle: '.drag-handle',
    draggable: '.mapping-row',
    ghostClass: 'mapping-row-ghost',
    chosenClass: 'mapping-row-chosen',
    dragClass: 'mapping-row-drag',
    forceFallback: true,
    fallbackOnBody: true,
    fallbackTolerance: 4,
    onStart() {
      callbacks.onStart?.();
    },
    onEnd(event) {
      callbacks.onEnd?.(event);
    },
  });
}

export function createSortable(container, callbacks) {
  if (typeof window.Sortable === 'undefined') {
    return null;
  }

  return window.Sortable.create(container, {
    animation: 180,
    handle: '.mapping-list__drag-handle',
    draggable: '.mapping-list__item',
    ghostClass: 'mapping-list__item--ghost',
    chosenClass: 'mapping-list__item--chosen',
    dragClass: 'mapping-list__item--drag',
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

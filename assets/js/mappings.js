export function renderMappings(container, mappings, actions, uiText) {
  container.innerHTML = '';

  mappings.forEach(({ map, index }) => {
    const row = document.createElement('div');
    row.className = 'mapping-list__item';
    row.dataset.index = String(index);

    const dragHandle = document.createElement('button');
    dragHandle.type = 'button';
    dragHandle.className = 'mapping-list__drag-handle';
    dragHandle.title = uiText.dragHandleLabel;
    dragHandle.setAttribute('aria-label', uiText.dragHandleLabel);
    dragHandle.disabled = actions.isSortDisabled === true;
    dragHandle.innerHTML = '<span></span><span></span><span></span>';

    const switchLabel = document.createElement('label');
    switchLabel.className = 'switch';
    switchLabel.title = uiText.switchTitle;

    const enable = document.createElement('input');
    enable.type = 'checkbox';
    enable.className = 'switch__input';
    enable.checked = map.enabled !== false;
    enable.addEventListener('change', () => {
      actions.onToggle(index, enable.checked);
    });

    const switchSlider = document.createElement('span');
    switchSlider.className = 'switch__slider';
    switchLabel.appendChild(enable);
    switchLabel.appendChild(switchSlider);

    const from = document.createElement('input');
    from.type = 'text';
    from.className = 'mapping-list__input';
    from.placeholder = uiText.fromPlaceholder;
    from.value = map.from;
    from.addEventListener('input', () => {
      actions.onEdit(index, 'from', from.value);
    });

    const to = document.createElement('input');
    to.type = 'text';
    to.className = 'mapping-list__input';
    to.placeholder = uiText.toPlaceholder;
    to.value = map.to;
    to.addEventListener('input', () => {
      actions.onEdit(index, 'to', to.value);
    });

    const deleteButton = document.createElement('button');
    deleteButton.type = 'button';
    deleteButton.className = 'mapping-list__delete';
    deleteButton.textContent = uiText.deleteMapping;
    deleteButton.addEventListener('click', () => {
      actions.onDelete(index);
    });

    row.appendChild(dragHandle);
    row.appendChild(switchLabel);
    row.appendChild(from);
    row.appendChild(to);
    row.appendChild(deleteButton);
    container.appendChild(row);
  });
}

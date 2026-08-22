const desktop = document.querySelector('.desktop');
const trash = document.querySelector('.trash');

trash?.addEventListener('click', () => {
  if (trash.dataset.dragged) return;
  trash.classList.remove('is-swatting');
  void trash.offsetWidth;
  trash.classList.add('is-swatting');
  window.setTimeout(() => trash.classList.remove('is-swatting'), 850);
});

desktop?.querySelectorAll('.desktop-item').forEach((item) => {
  let drag = null;

  item.addEventListener('pointerdown', (event) => {
    if (event.button !== 0) return;
    const itemRect = item.getBoundingClientRect();
    drag = { startX: event.clientX, startY: event.clientY, offsetX: event.clientX - itemRect.left, offsetY: event.clientY - itemRect.top, moved: false };
    item.setPointerCapture(event.pointerId);
    item.classList.add('dragging');
  });

  item.addEventListener('pointermove', (event) => {
    if (!drag) return;
    const bounds = desktop.getBoundingClientRect();
    const left = Math.max(0, Math.min(event.clientX - bounds.left - drag.offsetX, bounds.width - item.offsetWidth));
    const top = Math.max(0, Math.min(event.clientY - bounds.top - drag.offsetY, bounds.height - item.offsetHeight));
    if (Math.hypot(event.clientX - drag.startX, event.clientY - drag.startY) > 4) drag.moved = true;
    item.style.left = `${left}px`;
    item.style.top = `${top}px`;
    item.style.right = 'auto';
  });

  item.addEventListener('pointerup', (event) => {
    if (!drag) return;
    if (item.hasPointerCapture(event.pointerId)) item.releasePointerCapture(event.pointerId);
    item.classList.remove('dragging');
    if (drag.moved) {
      item.dataset.dragged = 'true';
      window.setTimeout(() => delete item.dataset.dragged, 0);
    }
    drag = null;
  });

  item.addEventListener('click', (event) => {
    if (!item.dataset.dragged) return;
    event.preventDefault();
    event.stopImmediatePropagation();
  }, true);
});

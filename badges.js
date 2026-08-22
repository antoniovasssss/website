const positionBadgeBubble = (button) => {
  const board = button.closest('.badge-board');
  const caption = button.querySelector('.badge-caption');
  if (!board || !caption) return;

  button.classList.add('is-hovered');
  const boardRect = board.getBoundingClientRect();
  const buttonRect = button.getBoundingClientRect();
  const captionRect = caption.getBoundingClientRect();
  const padding = 12;
  const clamp = (value, min, max) => Math.min(Math.max(value, min), max);
  const x = clamp(buttonRect.left + buttonRect.width / 2, boardRect.left + captionRect.width / 2 + padding, boardRect.right - captionRect.width / 2 - padding);
  const preferredY = button.classList.contains('badge-button--chess') || buttonRect.top + buttonRect.height / 2 < boardRect.top + boardRect.height / 2
    ? buttonRect.bottom + captionRect.height / 2 + padding
    : buttonRect.top - captionRect.height / 2 - padding;
  const y = clamp(preferredY, boardRect.top + captionRect.height / 2 + padding, boardRect.bottom - captionRect.height / 2 - padding);

  button.style.setProperty('--bubble-x', `${x}px`);
  button.style.setProperty('--bubble-y', `${y}px`);
};

document.querySelectorAll('.badge-button').forEach((button) => {
  button.addEventListener('pointerenter', () => positionBadgeBubble(button));
  button.addEventListener('pointerleave', () => button.classList.remove('is-hovered'));
  button.addEventListener('focus', () => positionBadgeBubble(button));
  button.addEventListener('blur', () => button.classList.remove('is-hovered'));
});

const layoutStorageKey = 'portfolio-badge-layout';
const clamp = (value, min, max) => Math.min(Math.max(value, min), max);
const draggableBadges = document.querySelectorAll('.badge-button');
let savedBadgeLayout = {};

try {
  savedBadgeLayout = JSON.parse(localStorage.getItem(layoutStorageKey) || '{}');
} catch {
  savedBadgeLayout = {};
}

draggableBadges.forEach((button) => {
  const badgeKey = [...button.classList].find((name) => name.startsWith('badge-button--'));
  const savedPosition = savedBadgeLayout[badgeKey];
  if (savedPosition) {
    button.style.setProperty('--badge-x', `${savedPosition.x}%`);
    button.style.setProperty('--badge-y', `${savedPosition.y}%`);
  }

  const pin = button.querySelector('.board-pin');
  pin?.addEventListener('pointerdown', (event) => {
    if (event.button !== 0 || window.matchMedia('(max-width: 680px)').matches) return;

    const board = button.closest('.badge-board');
    if (!board) return;

    event.preventDefault();
    event.stopPropagation();
    button.classList.remove('is-hovered');
    button.classList.add('is-dragging');
    pin.setPointerCapture(event.pointerId);

    const startX = event.clientX;
    const startY = event.clientY;
    const startLeft = button.offsetLeft;
    const startTop = button.offsetTop;
    const padding = 10;

    const moveBadge = (moveEvent) => {
      const nextLeft = clamp(startLeft + moveEvent.clientX - startX, padding, board.clientWidth - button.offsetWidth - padding);
      const nextTop = clamp(startTop + moveEvent.clientY - startY, padding, board.clientHeight - button.offsetHeight - padding);
      const position = { x: (nextLeft / board.clientWidth) * 100, y: (nextTop / board.clientHeight) * 100 };

      button.style.setProperty('--badge-x', `${position.x}%`);
      button.style.setProperty('--badge-y', `${position.y}%`);
      savedBadgeLayout[badgeKey] = position;
    };

    const stopDragging = () => {
      button.classList.remove('is-dragging');
      localStorage.setItem(layoutStorageKey, JSON.stringify(savedBadgeLayout));
      pin.removeEventListener('pointermove', moveBadge);
    };

    pin.addEventListener('pointermove', moveBadge);
    pin.addEventListener('pointerup', stopDragging, { once: true });
    pin.addEventListener('pointercancel', stopDragging, { once: true });
  });
});

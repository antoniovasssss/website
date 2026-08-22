const icon = document.querySelector('.dvd-profile');
const desktop = document.querySelector('.desktop');
const magnetCursor = document.querySelector('.magnet-cursor');
let x = Math.random() * Math.max(0, window.innerWidth - 68);
let y = Math.random() * Math.max(0, window.innerHeight - 68);
let dx = 0.8;
let dy = 0.8;
let pointer = null;
let pointerMoving = false;
let pointerStopTimer;
let keyboardFocus = false;

function constrain() {
  x = Math.max(0, Math.min(x, window.innerWidth - icon.offsetWidth));
  y = Math.max(0, Math.min(y, window.innerHeight - icon.offsetHeight));
}

function moveIcon() {
  const width = icon.offsetWidth;
  const height = icon.offsetHeight;
  const centerX = x + width / 2;
  const centerY = y + height / 2;
  const distance = pointer ? Math.hypot(pointer.x - centerX, pointer.y - centerY) : Infinity;
  const magnetic = pointerMoving && distance < 78;

  icon.classList.toggle('is-magnetic', magnetic);

  if (magnetic) {
    x += (pointer.x - width / 2 - x) * 0.04;
    y += (pointer.y - height / 2 - y) * 0.04;
  } else if (!keyboardFocus) {
    x += dx;
    y += dy;
  }

  if (x <= 0 || x + width >= window.innerWidth) {
    dx *= -1;
    x = Math.max(0, Math.min(x, window.innerWidth - width));
  }
  if (y <= 0 || y + height >= window.innerHeight) {
    dy *= -1;
    y = Math.max(0, Math.min(y, window.innerHeight - height));
  }

  icon.style.transform = `translate3d(${x}px, ${y}px, 0)`;
  requestAnimationFrame(moveIcon);
}

window.addEventListener('resize', constrain);
window.addEventListener('pointermove', (event) => {
  if (event.pointerType === 'touch') return;
  pointer = { x: event.clientX, y: event.clientY };
  magnetCursor.style.left = `${event.clientX}px`;
  magnetCursor.style.top = `${event.clientY}px`;
  magnetCursor.classList.add('visible');
  pointerMoving = true;
  window.clearTimeout(pointerStopTimer);
  pointerStopTimer = window.setTimeout(() => { pointerMoving = false; }, 200);
});
window.addEventListener('pointerleave', () => { pointer = null; pointerMoving = false; magnetCursor.classList.remove('visible'); });
icon.addEventListener('focus', () => { keyboardFocus = true; });
icon.addEventListener('blur', () => { keyboardFocus = false; });
desktop.addEventListener('pointerup', (event) => {
  if (event.pointerType === 'touch' && !event.target.closest('.profile-app')) window.location.assign('index.html');
});
constrain();
requestAnimationFrame(moveIcon);

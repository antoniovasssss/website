const closeControl = document.querySelector('.window-control--close');
const fullscreenControl = document.querySelector('.window-control--fullscreen');

closeControl?.addEventListener('click', () => {
  window.location.assign('desktop.html');
});

fullscreenControl?.addEventListener('click', async () => {
  if (document.fullscreenElement) {
    await document.exitFullscreen();
  } else {
    await document.documentElement.requestFullscreen();
  }
});

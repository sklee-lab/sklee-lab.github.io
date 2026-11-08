(() => {
  const albums = {
    'kps-album': [
      ['images/lab-life/kps-2026-presentation.jpg', 'Presentation at the 2026 Korean Physiological Society meeting, with a speaker beside the title slide', 4032, 3024]
    ],
    'fens-album': [
      ['images/lab-life/fens-2026-02.jpg', 'Group photograph in front of the FENS Forum 2026 welcome sign in Barcelona', 1435, 1600],
      ['images/lab-life/fens-2026-01.jpg', 'Group seated together around a restaurant table during FENS 2026', 1435, 1600],
      ['images/lab-life/fens-2026-03.jpg', 'Group sharing a table during FENS 2026 in Barcelona', 1600, 1246]
    ]
  };
  document.querySelectorAll('[data-album-open]').forEach(opener => {
    const id = opener.getAttribute('aria-controls');
    const dialog = document.getElementById(id);
    const photos = albums[id];
    if (!dialog || !photos || typeof dialog.showModal !== 'function') return;
    const photo = dialog.querySelector('.album-viewer img');
    const counter = dialog.querySelector('.album-status span');
    let index = 0;
    let returnFocus;
    let touchStart = null;
    function show(next) {
      index = (next + photos.length) % photos.length;
      const [src, alt, width, height] = photos[index];
      photo.src = src;
      photo.alt = alt;
      photo.width = width;
      photo.height = height;
      counter.textContent = `${index + 1} / ${photos.length}`;
    }
    opener.addEventListener('click', () => {
      returnFocus = document.activeElement;
      show(0);
      dialog.showModal();
      document.body.classList.add('album-open');
      dialog.querySelector('[data-album-close]').focus();
    });
    dialog.querySelector('[data-album-close]').addEventListener('click', () => dialog.close());
    dialog.querySelector('[data-album-previous]')?.addEventListener('click', () => show(index - 1));
    dialog.querySelector('[data-album-next]')?.addEventListener('click', () => show(index + 1));
    dialog.addEventListener('click', event => {
      if (event.target !== dialog) return;
      const box = dialog.getBoundingClientRect();
      if (event.clientX < box.left || event.clientX > box.right || event.clientY < box.top || event.clientY > box.bottom) dialog.close();
    });
    dialog.addEventListener('close', () => {
      document.body.classList.remove('album-open');
      touchStart = null;
      if (returnFocus && returnFocus.isConnected) returnFocus.focus();
    });
    dialog.addEventListener('keydown', event => {
      if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
        event.preventDefault();
        show(index + (event.key === 'ArrowRight' ? 1 : -1));
      }
      if (event.key === 'Tab') {
        const controls = [...dialog.querySelectorAll('button:not([disabled])')];
        const first = controls[0], last = controls[controls.length - 1];
        if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
        else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
      }
    });
    photo.addEventListener('touchstart', event => {
      touchStart = event.touches.length === 1 ? {x: event.touches[0].clientX, y: event.touches[0].clientY} : null;
    }, {passive: true});
    photo.addEventListener('touchend', event => {
      if (!touchStart || event.changedTouches.length !== 1) { touchStart = null; return; }
      const dx = event.changedTouches[0].clientX - touchStart.x;
      const dy = event.changedTouches[0].clientY - touchStart.y;
      if (Math.abs(dx) > 60 && Math.abs(dx) > Math.abs(dy) * 1.5) show(index + (dx < 0 ? 1 : -1));
      touchStart = null;
    }, {passive: true});
    photo.addEventListener('touchcancel', () => { touchStart = null; }, {passive: true});
  });
})();

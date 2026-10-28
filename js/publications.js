// Measure wrapped navigation and text so native anchor links stay below the sticky controls.
(() => {
  const root = document.documentElement;
  const header = document.querySelector('.site-header');
  const toolbar = document.querySelector('.publication-toolbar');
  const years = document.querySelector('.publication-years');
  if (!header || !toolbar || !years) return;

  const updateOffsets = () => {
    const controls = getComputedStyle(toolbar).display === 'contents' ? years : toolbar;
    root.style.setProperty('--publication-header-height', `${header.getBoundingClientRect().height}px`);
    root.style.setProperty('--publication-toolbar-height', `${controls.getBoundingClientRect().height}px`);
  };

  updateOffsets();
  const observer = new ResizeObserver(updateOffsets);
  [header, toolbar, years].forEach(element => observer.observe(element));
  window.addEventListener('resize', updateOffsets);

  // Preserve deep links from Home and Research after fonts and layout settle.
  window.addEventListener('load', () => {
    updateOffsets();
    const target = document.getElementById(location.hash.slice(1));
    if (target) target.scrollIntoView({ behavior: 'instant' });
  }, { once: true });
})();

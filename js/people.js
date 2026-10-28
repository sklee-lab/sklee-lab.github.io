// Keep the complete timeline available when JavaScript is unavailable.
(() => {
  const button = document.querySelector('.experience-toggle');
  const entries = document.querySelectorAll('[data-experience-extra]');
  if (!button || !entries.length) return;
  const setExpanded = expanded => {
    entries.forEach(entry => { entry.hidden = !expanded; });
    button.setAttribute('aria-expanded', String(expanded));
    button.textContent = expanded ? 'Less' : 'More';
  };
  setExpanded(false);
  button.hidden = false;
  button.addEventListener('click', () => {
    setExpanded(button.getAttribute('aria-expanded') !== 'true');
  });
})();

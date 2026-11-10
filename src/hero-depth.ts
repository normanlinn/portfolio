/** Gentle depth in the hero: the name and the terrain lines drift at different speeds on scroll and pointer move. */
export function initHeroDepth(): void {
  const hero = document.querySelector<HTMLElement>('.hero');
  const word = document.querySelector<HTMLElement>('.hero-word');
  const terrain = document.querySelector<HTMLElement>('.hero-terrain');
  if (!hero || !word || !terrain) return;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const finePointer = matchMedia('(hover: hover) and (pointer: fine)');
  let pointerX = 0, pointerY = 0, x = 0, y = 0, frame = 0;

  function render(): void {
    frame = 0;
    if (reduced.matches) { word!.style.translate = ''; terrain!.style.translate = ''; return; }
    // Ease towards the pointer so the movement feels weighted rather than glued to the cursor.
    x += (pointerX - x) * 0.08;
    y += (pointerY - y) * 0.08;
    const scrolled = Math.min(window.scrollY, hero!.offsetHeight);
    word!.style.translate = `${(x * -14).toFixed(2)}px ${(scrolled * 0.22 + y * -8).toFixed(2)}px`;
    terrain!.style.translate = `${(x * 8).toFixed(2)}px ${(scrolled * 0.1 + y * 5).toFixed(2)}px`;
    if (Math.abs(pointerX - x) > 0.002 || Math.abs(pointerY - y) > 0.002) request();
  }
  function request(): void { if (!frame) frame = requestAnimationFrame(render); }

  hero.addEventListener('pointermove', event => {
    if (!finePointer.matches) return;
    const rect = hero.getBoundingClientRect();
    pointerX = (event.clientX - rect.left) / rect.width - 0.5;
    pointerY = (event.clientY - rect.top) / rect.height - 0.5;
    request();
  });
  hero.addEventListener('pointerleave', () => { pointerX = 0; pointerY = 0; request(); });
  window.addEventListener('scroll', request, { passive: true });
  reduced.addEventListener('change', request);
  request();
}

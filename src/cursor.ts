/** A decorative pointer overlay; native clicks and navigation stay intact. */
export function initCursor(): void {
  const finePointer = matchMedia('(hover: hover) and (pointer: fine)');
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  const root = document.documentElement;
  let cleanup: (() => void) | undefined;

  function sync(): void {
    cleanup?.();
    cleanup = undefined;
    if (!finePointer.matches || reducedMotion.matches) return;

    const cursor = document.createElement('div');
    cursor.className = 'custom-cursor';
    cursor.setAttribute('aria-hidden', 'true');
    cursor.innerHTML = '<span class="cursor-ring"></span><span class="cursor-dot"></span><span class="cursor-label"></span>';
    document.body.append(cursor);
    const ring = cursor.querySelector<HTMLElement>('.cursor-ring')!;
    const dot = cursor.querySelector<HTMLElement>('.cursor-dot')!;
    const label = cursor.querySelector<HTMLElement>('.cursor-label')!;
    let x = 0, y = 0, ringX = 0, ringY = 0;
    let frame = 0;
    let seen = false;

    function render(): void {
      ringX += (x - ringX) * 0.22;
      ringY += (y - ringY) * 0.22;
      ring.style.transform = 'translate3d(' + ringX + 'px,' + ringY + 'px,0)';
      label.style.transform = 'translate3d(' + ringX + 'px,' + ringY + 'px,0)';
      if (Math.abs(x - ringX) + Math.abs(y - ringY) > 0.1) frame = requestAnimationFrame(render);
      else frame = 0;
    }

    function hide(): void {
      root.classList.remove('custom-cursor-active');
      cursor.classList.remove('is-visible', 'is-pressed');
      seen = false;
      cancelAnimationFrame(frame);
      frame = 0;
    }

    function move(event: PointerEvent): void {
      if (event.pointerType !== 'mouse') { hide(); return; }
      const target = event.target instanceof Element ? event.target : null;
      // Keep native pointers over media controls, text inputs, and top-layer dialogs.
      if (target?.closest('dialog, video, input, textarea, select, [contenteditable="true"]')) {
        hide(); return;
      }
      x = event.clientX; y = event.clientY;
      if (!seen) { ringX = x; ringY = y; seen = true; }
      dot.style.transform = 'translate3d(' + x + 'px,' + y + 'px,0)';
      root.classList.add('custom-cursor-active');
      cursor.classList.add('is-visible');
      const interactive = target?.closest('a, button, [role="button"]');
      cursor.classList.toggle('is-link', !!interactive);
      label.textContent = target?.closest('.project') ? 'VIEW' :
        target?.closest('.identity-card') ? 'FLIP' :
        target?.closest('[data-skill]') ? 'EXPLORE' : '';
      cursor.classList.toggle('has-label', !!label.textContent);
      if (!frame) frame = requestAnimationFrame(render);
    }
    function press(): void { cursor.classList.add('is-pressed'); }
    function release(): void { cursor.classList.remove('is-pressed'); }
    function keyboard(event: KeyboardEvent): void { if (event.key === 'Tab') hide(); }
    function visibility(): void { if (document.hidden) hide(); }
    window.addEventListener('pointermove', move, { passive: true });
    window.addEventListener('pointerdown', press, { passive: true });
    window.addEventListener('pointerup', release, { passive: true });
    window.addEventListener('pointercancel', hide);
    document.addEventListener('pointerleave', hide);
    window.addEventListener('blur', hide);
    window.addEventListener('keydown', keyboard);
    document.addEventListener('visibilitychange', visibility);
    window.addEventListener('portfolio:dialog-open', hide);
    cleanup = () => {
      hide(); cursor.remove();
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerdown', press);
      window.removeEventListener('pointerup', release);
      window.removeEventListener('pointercancel', hide);
      document.removeEventListener('pointerleave', hide);
      window.removeEventListener('blur', hide);
      window.removeEventListener('keydown', keyboard);
      document.removeEventListener('visibilitychange', visibility);
      window.removeEventListener('portfolio:dialog-open', hide);
    };
  }
  finePointer.addEventListener('change', sync);
  reducedMotion.addEventListener('change', sync);
  sync();
}

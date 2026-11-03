import Lenis from 'lenis';

/** Keep native touch scrolling and keyboard behavior; smooth wheel and anchor travel. */
export function initSmoothScroll(): void {
  const preference = matchMedia('(prefers-reduced-motion: reduce)');
  const dialog = document.querySelector<HTMLDialogElement>('dialog');
  let lenis: Lenis | undefined;
  function sync(): void {
    lenis?.destroy();
    lenis = undefined;
    if (!preference.matches) {
      lenis = new Lenis({
        autoRaf: true,
        lerp: 0.105,
        smoothWheel: true,
        syncTouch: false,
        anchors: { offset: -90 },
        prevent: node => !!node.closest('dialog, [data-lenis-prevent]'),
      });
      if (dialog?.open) lenis.stop();
    }
  }
  window.addEventListener('portfolio:dialog-open', () => {
    lenis?.stop();
    document.documentElement.classList.add('dialog-visible');
  });
  dialog?.addEventListener('close', () => {
    document.documentElement.classList.remove('dialog-visible');
    lenis?.start();
  });
  preference.addEventListener('change', sync);
  sync();
}

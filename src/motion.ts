import { animate, inView, stagger, scroll, type AnimationPlaybackControlsWithThen, type DOMKeyframesDefinition, type AnimationOptions } from 'framer-motion';
import { requiredElement } from './dom';

const reduced = matchMedia('(prefers-reduced-motion: reduce)');
const cleanups: Array<() => void> = [];
const animations = new Set<AnimationPlaybackControlsWithThen>();
function play(target: string | Element, frames: DOMKeyframesDefinition, options: AnimationOptions) {
  const control = animate(target, frames, options);
  animations.add(control);
  control.then(() => animations.delete(control));
  return control;
}
function startMotion() {
  if (reduced.matches) return;
  const ease: [number, number, number, number] = [0.22, 1, 0.36, 1];
  const heading = requiredElement<HTMLHeadingElement>('.hero h1');
  play(heading, { opacity: [0, 1], y: [36, 0] }, { duration: 0.9, ease });
  play('.identity-card', { opacity: [0, 1], y: [30, 0], rotate: [-7, -3] }, { duration: 1, ease });
  play('.hero .eyebrow, .intro-copy', { opacity: [0, 1], y: [16, 0] }, { duration: 0.7, delay: stagger(0.18, { startDelay: 0.2 }), ease });

  cleanups.push(inView('.section-head, .project, .about-copy, .about > div:first-child, .process article, .contact', element => {
    play(element, { opacity: [0, 1], y: [28, 0] }, { duration: 0.65, ease });
  }, { amount: 0.12 }));

  const progress = document.createElement('div');
  progress.className = 'reading-progress';
  progress.setAttribute('aria-hidden', 'true');
  document.body.append(progress);
  cleanups.push(scroll(value => { progress.style.transform = 'scaleX(' + value + ')'; }));
  cleanups.push(() => progress.remove());

  document.querySelectorAll<HTMLElement>('.project .visual, .pill, .theme').forEach(element => {
    const isCard = element.classList.contains('visual');
    let control: AnimationPlaybackControlsWithThen | undefined;
    const move = (active: boolean, pressed = false) => {
      control?.stop();
      control = play(element, { scale: pressed ? 0.975 : active ? (isCard ? 1.012 : 1.04) : 1, y: active && !isCard ? -3 : 0 }, { type: 'spring', stiffness: 340, damping: 26 });
    };
    const over = (event: PointerEvent) => { if(event.pointerType !== 'touch') move(true); };
    const out = () => move(false);
    const down = () => move(false, true);
    const up = (event: PointerEvent) => move(event.pointerType !== 'touch');
    const events: Partial<Record<keyof HTMLElementEventMap, EventListener>> = {pointerenter:over as EventListener,pointerleave:out,pointerdown:down,pointerup:up as EventListener,pointercancel:out};
    Object.entries(events).forEach(([name, handler]) => element.addEventListener(name, handler));
    cleanups.push(() => { Object.entries(events).forEach(([name, handler]) => element.removeEventListener(name, handler)); element.style.transform = ''; });
  });
}
function stopMotion() {
  cleanups.splice(0).forEach(cleanup => cleanup());
  animations.forEach(control => control.stop());
  animations.clear();
  document.querySelectorAll<HTMLElement>('.headline-line, .hero .eyebrow, .hero-bottom, .section-head, .project, .about-copy, .about > div:first-child, .process article, .contact').forEach(element => {
    element.style.opacity = '';
    element.style.transform = '';
  });
}
reduced.addEventListener('change', () => { stopMotion(); startMotion(); });
window.addEventListener('portfolio:dialog-open', () => {
  if (!reduced.matches) play(requiredElement<HTMLDialogElement>('dialog'), { opacity: [0,1], y: [18,0], scale:[0.97,1] }, {duration:0.25, ease:[0.22,1,0.36,1]});
});
startMotion();

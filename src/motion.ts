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
const nameDrops = new Set<AnimationPlaybackControlsWithThen>();
function dropName() {
  nameDrops.forEach(control => control.stop());
  nameDrops.clear();
  if (reduced.matches) return;
  document.querySelectorAll<HTMLElement>('.name-letter').forEach((letter, index) => {
    const control = play(letter, { y: [-320, 16, -6, 0], opacity: [0, 1, 1, 1], rotate: [index % 2 ? 10 : -10, -2, 1, 0] }, {
      duration: 1.15, delay: index * 0.13, times: [0, 0.65, 0.83, 1], ease: [0.22, 1, 0.36, 1]
    });
    nameDrops.add(control);
    control.then(() => nameDrops.delete(control));
  });
}
window.addEventListener('portfolio:home-enter', dropName);
function startMotion() {
  if (reduced.matches) return;
  const ease: [number, number, number, number] = [0.22, 1, 0.36, 1];
  const heading = requiredElement<HTMLHeadingElement>('.hero h1');
  dropName();
  play(heading, { opacity: [0, 1], y: [36, 0] }, { duration: 0.9, ease });
  play('.hero .eyebrow, .intro-copy, .hero-center, .hero-actions', { opacity: [0, 1], y: [24, 0] }, { duration: 0.85, delay: stagger(0.13, { startDelay: 0.2 }), ease });

  const revealed = new WeakSet<Element>();
  const revealSelector = '.section-head, .project, .about-copy, .about > div:first-child, .id-column, .process article, .learning article, .contact, .skill-element';
  cleanups.push(inView(revealSelector, element => {
    if (revealed.has(element)) return;
    revealed.add(element);
    const isSkill = element.classList.contains('skill-element');
    const siblings = Array.from(element.parentElement?.children ?? []);
    const delay = isSkill ? Math.max(0, siblings.indexOf(element) % 6) * 0.055 : 0;
    play(element, { opacity: [0, 1], y: [isSkill ? 20 : 42, 0], filter: ['blur(5px)', 'blur(0px)'] }, { duration: 0.8, delay, ease });
  }, { amount: 0.08 }));
  document.querySelectorAll<HTMLElement>('.section-head h2, .contact h2').forEach(title => {
    if (!title.querySelector('.heading-word')) {
      const walker = document.createTreeWalker(title, NodeFilter.SHOW_TEXT);
      const nodes: Text[] = [];
      while (walker.nextNode()) {
        const node = walker.currentNode as Text;
        if (!node.parentElement?.closest('sup')) nodes.push(node);
      }
      nodes.forEach(node => {
        const fragment = document.createDocumentFragment();
        node.textContent?.split(/(\s+)/).forEach(part => {
          if (!part.trim()) fragment.append(document.createTextNode(part));
          else { const word = document.createElement('span'); word.className = 'heading-word'; word.textContent = part; fragment.append(word); }
        });
        node.replaceWith(fragment);
      });
    }
    cleanups.push(inView(title, () => {
      title.querySelectorAll('.heading-word').forEach((word, index) => {
        play(word, { opacity: [0, 1], y: [20, 0], rotate: [2, 0] }, { duration: 0.65, delay: index * 0.045, ease });
      });
    }, { amount: 0.4 }));
  });
  const heroWord = requiredElement<HTMLElement>('.hero-word');
  const hero = requiredElement<HTMLElement>('.hero');
  cleanups.push(scroll(() => {
    const travel = Math.min(1, Math.max(0, -hero.getBoundingClientRect().top / hero.offsetHeight));
    heroWord.style.translate = '0 ' + (travel * 85) + 'px';
  }));
  cleanups.push(() => { heroWord.style.translate = ''; });

  const progress = document.createElement('div');
  progress.className = 'reading-progress';
  progress.setAttribute('aria-hidden', 'true');
  document.body.append(progress);
  cleanups.push(scroll(value => { progress.style.transform = 'scaleX(' + value + ')'; }));
  cleanups.push(() => progress.remove());

  document.querySelectorAll<HTMLElement>('.project .visual, .pill, .theme, .skill-filter, .close').forEach(element => {
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
  document.querySelectorAll<HTMLElement>('.project .visual').forEach(visual => {
    let frame = 0;
    const move = (event: PointerEvent) => {
      if (event.pointerType !== 'mouse') return;
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const bounds = visual.getBoundingClientRect();
        visual.style.setProperty('--tilt-x', ((0.5 - (event.clientY - bounds.top) / bounds.height) * 7) + 'deg');
        visual.style.setProperty('--tilt-y', (((event.clientX - bounds.left) / bounds.width - 0.5) * 7) + 'deg');
      });
    };
    const reset = () => {
      cancelAnimationFrame(frame);
      visual.style.removeProperty('--tilt-x');
      visual.style.removeProperty('--tilt-y');
    };
    visual.addEventListener('pointermove', move, { passive: true });
    visual.addEventListener('pointerleave', reset);
    cleanups.push(() => { reset(); visual.removeEventListener('pointermove', move); visual.removeEventListener('pointerleave', reset); });
  });
}
function stopMotion() {
  cleanups.splice(0).forEach(cleanup => cleanup());
  animations.forEach(control => control.stop());
  animations.clear();
  document.querySelectorAll<HTMLElement>('.heading-word, .skill-element, .id-column, .hero-actions, .skill-filter, .close, .project .visual, .pill, .theme, .name-letter, .hero-word, .hero h1, .hero-center, .identity-card, .intro-copy, .learning article, .headline-line, .hero .eyebrow, .hero-bottom, .section-head, .project, .about-copy, .about > div:first-child, .process article, .contact').forEach(element => {
    element.style.filter = '';
    element.style.opacity = '';
    element.style.transform = '';
  });
}
reduced.addEventListener('change', () => { stopMotion(); startMotion(); });
window.addEventListener('portfolio:dialog-open', () => {
  if (!reduced.matches) play(requiredElement<HTMLDialogElement>('dialog'), { opacity: [0,1], y: [18,0], scale:[0.97,1] }, {duration:0.25, ease:[0.22,1,0.36,1]});
});
startMotion();

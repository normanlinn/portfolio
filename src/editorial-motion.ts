import { animate, inView, scroll, type AnimationPlaybackControlsWithThen } from 'framer-motion';

/** Original motion treatment inspired by editorial typography and physical print. */
export function initEditorialMotion(): void {
  const preference = matchMedia('(prefers-reduced-motion: reduce)');
  const heading = document.querySelector<HTMLElement>('.hero h1');
  if (!heading) return;
  // Keep the original heading readable to screen readers, while revealing visual glyphs.
  const label = heading.innerText.replace(/\s+/g, ' ');
  heading.setAttribute('aria-label', label);
  const walker = document.createTreeWalker(heading, NodeFilter.SHOW_TEXT);
  const nodes: Text[] = [];
  while (walker.nextNode()) nodes.push(walker.currentNode as Text);
  nodes.forEach(node => {
    const fragment = document.createDocumentFragment();
    node.textContent?.split(/(\s+)/).forEach(word => {
      if (!word.trim()) { fragment.append(document.createTextNode(word)); return; }
      const group = document.createElement('span');
      group.className = 'hero-type-word';
      group.setAttribute('aria-hidden', 'true');
      for (const letter of word) {
        const mask = document.createElement('span');
        mask.className = 'glyph-mask';
        const glyph = document.createElement('span');
        glyph.className = 'hero-glyph'; glyph.textContent = letter;
        mask.append(glyph); group.append(mask);
      }
      fragment.append(group);
    });
    node.replaceWith(fragment);
  });
  const paragraphs = document.querySelectorAll<HTMLElement>('.about-large, .about-copy p');
  paragraphs.forEach(paragraph => {
    const textWalker = document.createTreeWalker(paragraph, NodeFilter.SHOW_TEXT);
    const textNodes: Text[] = [];
    while (textWalker.nextNode()) textNodes.push(textWalker.currentNode as Text);
    textNodes.forEach(node => {
      const fragment = document.createDocumentFragment();
      node.textContent?.split(/(\s+)/).forEach(word => {
        if (!word.trim()) fragment.append(document.createTextNode(word));
        else { const span = document.createElement('span'); span.className = 'reading-word'; span.textContent = word; fragment.append(span); }
      });
      node.replaceWith(fragment);
    });
  });
  const controls = new Set<AnimationPlaybackControlsWithThen>();
  const cleanup: Array<() => void> = [];
  const play = (element: Element, frames: Parameters<typeof animate>[1], options: Parameters<typeof animate>[2]) => {
    const control = animate(element, frames, options);
    controls.add(control); control.then(() => controls.delete(control));
  };
  function entrance(): void {
    if (preference.matches) return;
    heading!.querySelectorAll('.hero-glyph').forEach((glyph, index) => {
      play(glyph, { y: ['115%', '0%'], rotate: [8, 0], opacity: [0, 1] }, { duration: 0.9, delay: 0.15 + index * 0.022, ease: [0.22, 1, 0.36, 1] });
    });
  }
  function sync(): void {
    cleanup.splice(0).forEach(fn => fn());
    controls.forEach(control => control.stop()); controls.clear();
    document.querySelectorAll<HTMLElement>('.hero-glyph, .reading-word, .section-rule').forEach(element => {
      element.style.transform = ''; element.style.opacity = '';
    });
    if (preference.matches) return;
    entrance();
    paragraphs.forEach(paragraph => {
      const words = paragraph.querySelectorAll<HTMLElement>('.reading-word');
      cleanup.push(scroll(progress => {
        words.forEach((word, index) => {
          const phase = Math.min(1, Math.max(0, progress * (words.length + 4) - index));
          word.style.opacity = String(0.3 + phase * 0.7);
        });
      }, { target: paragraph, offset: ['start 92%', 'end 48%'] }));
    });
    document.querySelectorAll<HTMLElement>('main>.section').forEach(section => {
      let rule = section.querySelector<HTMLElement>(':scope > .section-rule');
      if (!rule) { rule = document.createElement('span'); rule.className = 'section-rule'; rule.setAttribute('aria-hidden', 'true'); section.prepend(rule); }
      const line = rule;
      cleanup.push(inView(section, () => {
        play(line, { scaleX: [0, 1] }, { duration: 1.2, ease: [0.22, 1, 0.36, 1] });
      }, { amount: 0.08 }));
    });
  }
  window.addEventListener('portfolio:home-enter', entrance);
  preference.addEventListener('change', sync);
  sync();
}

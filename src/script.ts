import { initSmoothScroll } from './scroll';
import { initCursor } from './cursor';
import { profileMedia } from './profile';
import { skills } from './skills';
import { requiredElement } from './dom';

type DialogSection = readonly [heading: string, text: string];

const themeButton = requiredElement<HTMLButtonElement>('.theme');
function applyTheme(dark: boolean) {
  document.body.classList.toggle('dark', dark);
  themeButton.setAttribute('aria-label', dark ? 'Switch to light theme' : 'Switch to dark theme');
  themeButton.setAttribute('aria-pressed', String(dark));
}
let saved: string | null = null;
try { saved = localStorage.getItem('portfolio-theme'); } catch {}
applyTheme(saved === 'dark' || (!saved && matchMedia('(prefers-color-scheme: dark)').matches));
themeButton.addEventListener('click', () => {
  const dark = !document.body.classList.contains('dark');
  applyTheme(dark);
  try { localStorage.setItem('portfolio-theme', dark ? 'dark' : 'light'); } catch {}
});
const dialog = requiredElement<HTMLDialogElement>('#case-dialog');
function showDialog(title: string, intro: string, sections: readonly DialogSection[]) {
  requiredElement<HTMLElement>('#dialog-title').textContent = title;
  requiredElement<HTMLElement>('#dialog-intro').textContent = intro;
  const body = requiredElement<HTMLElement>('#dialog-body');
  body.replaceChildren();
  sections.forEach(([heading, text]) => { const h = document.createElement('h3'); h.textContent = heading; const p = document.createElement('p'); p.textContent = text; body.append(h,p); });
  dialog.showModal();
  window.dispatchEvent(new Event('portfolio:dialog-open'));
}
const actualProjects = [
  { title: 'LAXCommute', description: 'Employee shuttle information for LAX.', url: 'https://employeeshuttlelax.com/', source: 'https://github.com/normanlinn/LAXCommute' },
  { title: 'Yay Kyaw Nights', description: 'A browser-based night fair inspired by Yangon.', url: 'https://yaykyawfair.vercel.app/', source: 'https://github.com/normanlinn/yaykyawfair' },
  { title: 'Burman Tea', description: 'A website for a Burmese tea shop in Los Angeles.', url: 'https://burmantea.vercel.app/', source: null },
  { title: 'Derivatives Field Guide', description: 'An interactive study guide covering calculus and derivative rules.', url: 'https://calculus-study-site.vercel.app/', source: 'https://github.com/normanlinn/calculus-study-site' },
];
document.querySelectorAll<HTMLButtonElement>('[data-project]').forEach(button => button.addEventListener('click', () => {
  const project = actualProjects[Number(button.dataset.project)];
  if (!project) return;
  requiredElement('#dialog-label').textContent = 'MY PROJECT';
  showDialog(project.title, project.description, []);
  const links = document.createElement('div'); links.className = 'dialog-links';
  const live = document.createElement('a'); live.href = project.url; live.target = '_blank'; live.rel = 'noopener noreferrer'; live.className = 'pill primary'; live.textContent = 'Visit live site ↗'; links.append(live);
  if (project.source) { const source = document.createElement('a'); source.href = project.source; source.target = '_blank'; source.rel = 'noopener noreferrer'; source.textContent = 'View source ↗'; links.append(source); }
  requiredElement('#dialog-body').append(links);
}));
requiredElement<HTMLElement>('#contact-button').addEventListener('click', () => {
  requiredElement<HTMLElement>('#dialog-label').textContent = 'CONTACT';
  showDialog('Let’s connect.', 'Contact details are coming soon.', [['Make this yours','Add your email address or preferred contact link to enable direct inquiries.']]);
});
requiredElement<HTMLButtonElement>('.close').addEventListener('click', () => dialog.close());
dialog.addEventListener('click', event => { if (event.target === dialog) { const r = dialog.getBoundingClientRect(); if(event.clientX < r.left || event.clientX > r.right || event.clientY < r.top || event.clientY > r.bottom) dialog.close(); } });

const identityCard = requiredElement<HTMLButtonElement>('#identity-card');
identityCard.addEventListener('click', () => {
  const flipped = identityCard.classList.toggle('is-flipped');
  identityCard.setAttribute('aria-pressed', String(flipped));
  identityCard.querySelector('.card-front')?.setAttribute('aria-hidden', String(flipped));
  identityCard.querySelector('.card-back')?.setAttribute('aria-hidden', String(!flipped));
});
document.querySelectorAll<HTMLButtonElement>('[data-skill]').forEach(button => button.addEventListener('click', () => {
  const skill = skills[Number(button.dataset.skill)];
  if (!skill) return;
  requiredElement('#skill-symbol').textContent = skill.symbol;
  requiredElement('#skill-name').textContent = skill.name;
  requiredElement('#skill-description').textContent = skill.description;
  document.querySelectorAll('[data-skill]').forEach(element => element.classList.remove('selected'));
  button.classList.add('selected');
}));
document.querySelectorAll<HTMLButtonElement>('.skill-filter').forEach(button => button.addEventListener('click', () => {
  document.querySelectorAll('.skill-filter').forEach(element => element.setAttribute('aria-pressed', String(element === button)));
  document.querySelectorAll<HTMLElement>('[data-skill]').forEach(element => { element.hidden = button.dataset.category !== 'All' && element.dataset.category !== button.dataset.category; });
}));
if (profileMedia.heroImage && !profileMedia.heroVideo) {
  const stage = requiredElement<HTMLElement>('.hero-center');
  const figure = document.createElement('figure');
  figure.className = 'coding-figure';
  const image = document.createElement('img');
  image.src = profileMedia.heroImage;
  image.alt = 'AI portrait of Zaw Lin Naing coding on a laptop';
  image.width = 1024; image.height = 1536;
  image.fetchPriority = 'high';
  const caption = document.createElement('figcaption');
  caption.textContent = 'ZAW LIN / IN THE MAKING';
  figure.append(image, caption);
  stage.replaceChildren(figure);
  stage.classList.add('has-coding-portrait');
}
if (profileMedia.heroVideo) {
  const stage = requiredElement<HTMLElement>('.hero-center');
  const video = document.createElement('video');
  video.src = profileMedia.heroVideo;
  video.className = 'intro-video';
  video.loop = true;
  video.muted = true;
  video.playsInline = true;
  video.controls = true;
  video.setAttribute('aria-label', 'Introduction from Zaw Lin Naing');
  stage.replaceChildren(video);
  const preference = matchMedia('(prefers-reduced-motion: reduce)');
  const playback = () => { if (preference.matches) video.pause(); else void video.play().catch(() => {}); };
  playback(); preference.addEventListener('change', playback);
}
if (profileMedia.portrait) {
  const portrait = document.createElement('img');
  portrait.src = profileMedia.portrait; portrait.alt = 'Zaw Lin Naing';
  portrait.className = 'profile-portrait';
  requiredElement('.portrait-initials').replaceChildren(portrait);
}
const navLinks = document.querySelectorAll<HTMLAnchorElement>('nav a');
const navObserver = new IntersectionObserver(entries => {
  for (const entry of entries) if (entry.isIntersecting) {
    navLinks.forEach(link => {
      const active = link.hash === '#' + entry.target.id;
      link.classList.toggle('nav-active', active);
      if (active) link.setAttribute('aria-current','location'); else link.removeAttribute('aria-current');
    });
  }
}, { rootMargin: '-15% 0px -55% 0px', threshold: 0 });
document.querySelectorAll<HTMLElement>('main section[id]').forEach(section => navObserver.observe(section));

initCursor();

// Replay the introduction when visitors return Home.
const typedIntro = requiredElement<HTMLElement>('.typed-intro');
const typingPreference = matchMedia('(prefers-reduced-motion: reduce)');
let typingTimer: ReturnType<typeof setTimeout> | undefined;
function typeIntroduction(): void {
  clearTimeout(typingTimer);
  const words = 'Zaw Lin Naing / Software developer';
  if (typingPreference.matches) { typedIntro.textContent = words; return; }
  typedIntro.textContent = '';
  let position = 0;
  const tick = () => {
    typedIntro.textContent = words.slice(0, ++position);
    if (position < words.length) typingTimer = setTimeout(tick, position < 13 ? 75 : 45);
  };
  typingTimer = setTimeout(tick, 550);
}
document.querySelectorAll<HTMLAnchorElement>('a[href="#home"]').forEach(link => link.addEventListener('click', () => {
  typeIntroduction();
  window.dispatchEvent(new Event('portfolio:home-enter'));
}));
typingPreference.addEventListener('change', typeIntroduction);
typeIntroduction();

initSmoothScroll();


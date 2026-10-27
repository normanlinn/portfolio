import { initCursor } from './cursor';
import { initRoutes } from './routes';
import { profileMedia } from './profile';
import { skills } from './skills';
import { requiredElement } from './dom';

interface Project { title: string; intro: string; problem: string; approach: string; hardest?: string; results?: string[]; next: string; url?: string; linkLabel: string; source?: string; status: string; }
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
const projects: Project[] = [
  { title: 'LAXCommute', intro: 'A daily commute became a reason to build.', problem: 'Getting between an employee lot and an airport terminal should start with clear information. My work at LAX made that need personal.', approach: 'A phone-friendly web app for the South, East and West lot shuttles: live bus positions and arrival predictions, a saved "my commute", directions in Apple or Google Maps, and English, Spanish and Burmese. It installs on a phone as a progressive web app.', hardest: 'The shuttle data comes from an existing third-party tracker, and GitHub Pages cannot run a server. So the app runs on Cloudflare, where a same-origin API fetches the feed and Supabase processes it, so the phone only ever talks to one place.', results: ['Live tracking for 3 employee lots', 'English, Spanish and Burmese', '141 automated tests across 27 test files', '50 commits in its first three weeks'], next: 'Keep refining the details: navigation, route choices, install and share flows, and how clearly the interface communicates its current information.', url: 'https://employeeshuttlelax.com/', linkLabel: 'Open LAXCommute', source: 'https://github.com/normanlinn/LAXCommute', status: 'PERSONAL WEB APP / PROJECT NOTES' },
  { title: 'Settle', intro: 'A calmer way to plan a move.', problem: 'A move is made up of small responsibilities: utilities, address changes, cleaning, keys, inspection, and records. It is easy for a loose end to get lost.', approach: 'Bring the checklist and timeline into a single planning experience, with due dates and a way to see what is complete. The idea grew out of my own need to organize a move.', next: 'Keep making the next action clearer, especially when checking a task list from a phone.', linkLabel: 'Live link coming soon', status: 'IN DEVELOPMENT / PROJECT NOTES' },
  { title: 'Burman Tea', intro: 'A tea shop website, built for customers and the people behind the counter.', problem: 'BURMAN TEA serves Burmese milk tea and matcha in Westwood, Los Angeles. Customers need to see the menu, know when the shop is open and find it, and many of them read Burmese first.', approach: 'A mobile-first site with an English and Burmese language switch, a filterable menu with prices and allergy notes, pickup hours, directions and a drink-ordering flow, plus a protected staff workspace.', results: ['6 drinks across milk tea, iced tea and matcha', 'English and Burmese throughout'], next: 'Keep refining ordering and the staff workspace as the shop uses it.', url: 'https://burmantea.vercel.app/', linkLabel: 'Visit the Burman Tea site', status: 'SHOP WEBSITE / PROJECT NOTES' },
  { title: 'Derivatives Field Guide', intro: 'The study guide I wanted before my calculus quiz.', problem: 'Sections 2.8 and 3.1–3.5 of Stewart’s Calculus introduce a lot of derivative rules in a short time. I wanted one place to see why each rule works, and to practise until it stuck.', approach: 'A static Next.js site with a page per section: the idea, a graph you can drag, worked examples, then practice problems with hints and full solutions. Math is rendered with KaTeX at build time, and progress is saved in the browser.', hardest: 'Making the math work on a phone. Wide equations pushed the page sideways, and the graphs had to follow a finger as well as a mouse. I contained the equations, used pointer events with pointer capture so dragging works with touch, and drew each canvas at the screen’s pixel density so it stays sharp.', results: ['77 practice problems with hints and solutions', '8 interactive graphs', 'Rebuilt from a single 1,500-line HTML page into a Next.js site'], next: 'Add the next chapter’s sections as the course moves on.', url: 'https://normanlinn.github.io/calculus-study-site/', linkLabel: 'Open the study site', source: 'https://github.com/normanlinn/calculus-study-site', status: 'STUDY TOOL / PROJECT NOTES' },
  { title: 'Yay Kyaw Nights', intro: 'A love letter to Yangon’s night fair.', problem: 'Yay Kyaw’s night fairs are lanterns, snack carts, rides and crowds of families. I wanted to put that feeling in a browser, so anyone can walk through it, wherever they are.', approach: 'A Three.js world with twelve zones and first-person rides, a character creator with Myanmar outfits, a crowd that speaks Burmese, and saing waing music and fireworks synthesized with the Web Audio API. Thadingyut wishes are shared through a small Vercel API backed by Upstash Redis, so every player sees them over the lake.', hardest: 'Multiplayer without a game server. Players connect browser to browser over WebRTC with PeerJS. One player relays positions and chat for the fair, and if they leave, the others take over within a few seconds.', results: ['12 zones and 6 first-person rides', 'Up to 12 players share a public fair, live', 'Every sound is synthesized: no audio files'], next: 'Add a TURN relay so players on strict networks can join, and keep adding corners of the fair.', url: 'https://yaykyawfair.vercel.app/', linkLabel: 'Play Yay Kyaw Nights', source: 'https://github.com/normanlinn/yaykyawfair', status: '3D BROWSER GAME / PROJECT NOTES' }
];
const dialog = requiredElement<HTMLDialogElement>('#case-dialog');
function showDialog(title: string, intro: string, sections: readonly DialogSection[]) {
  requiredElement<HTMLElement>('#dialog-title').textContent = title;
  requiredElement<HTMLElement>('#dialog-intro').textContent = intro;
  const body = requiredElement<HTMLElement>('#dialog-body');
  body.replaceChildren();
  sections.forEach(([heading, text]) => { const h = document.createElement('h3'); h.textContent = heading; const p = document.createElement('p'); p.textContent = text; body.append(h,p); });
  dialog.showModal();
  document.body.style.overflow = 'hidden';
  window.dispatchEvent(new Event('portfolio:dialog-open'));
}
document.querySelectorAll<HTMLButtonElement>('[data-project]').forEach(button => button.addEventListener('click', () => {
  const p = projects[Number(button.dataset.project)];
  if (!p) return;
  requiredElement<HTMLElement>('#dialog-label').textContent = p.status;
  const sections: DialogSection[] = [['The starting point', p.problem], ['What I built', p.approach]];
  if (p.hardest) sections.push(['The hardest part', p.hardest]);
  sections.push(['The next improvement', p.next]);
  showDialog(p.title, p.intro, sections);
  if (p.results) {
    const heading = document.createElement('h3');
    heading.textContent = 'By the numbers';
    const list = document.createElement('ul');
    list.className = 'dialog-results';
    p.results.forEach(result => { const item = document.createElement('li'); item.textContent = result; list.append(item); });
    requiredElement('#dialog-body').append(heading, list);
  }
  const links = document.createElement('div');
  links.className = 'dialog-links';
  if (p.url) {
    const live = document.createElement('a');
    live.href = p.url; live.target = '_blank'; live.rel = 'noopener noreferrer'; live.className = 'pill primary'; live.textContent = p.linkLabel + ' ↗';
    links.append(live);
  }
  if (p.source) {
    const source = document.createElement('a');
    source.href = p.source; source.target = '_blank'; source.rel = 'noopener noreferrer'; source.className = 'inline-link'; source.textContent = 'Explore the source ↗';
    links.append(source);
  }
  requiredElement('#dialog-body').append(links);
}));
dialog.addEventListener('close', () => { document.body.style.overflow = ''; });
requiredElement<HTMLButtonElement>('.close').addEventListener('click', () => dialog.close());
dialog.addEventListener('click', event => { if (event.target === dialog) { const r = dialog.getBoundingClientRect(); if(event.clientX < r.left || event.clientX > r.right || event.clientY < r.top || event.clientY > r.bottom) dialog.close(); } });

const identityCard = requiredElement<HTMLButtonElement>('#identity-card');
identityCard.addEventListener('click', () => {
  const flipped = identityCard.classList.toggle('is-flipped');
  identityCard.setAttribute('aria-pressed', String(flipped));
  identityCard.querySelector('.card-front')?.setAttribute('aria-hidden', String(flipped));
  identityCard.querySelector('.card-back')?.setAttribute('aria-hidden', String(!flipped));
});
function selectSkill(button: HTMLButtonElement): void {
  const skill = skills[Number(button.dataset.skill)];
  if (!skill) return;
  requiredElement('#skill-symbol').textContent = skill.symbol;
  requiredElement('#skill-name').textContent = skill.name;
  requiredElement('#skill-description').textContent = skill.description;
  requiredElement('#skill-used').textContent = skill.usedIn;
  document.querySelectorAll<HTMLButtonElement>('[data-skill]').forEach(element => {
    const selected = element === button;
    element.classList.toggle('selected', selected);
    element.setAttribute('aria-pressed', String(selected));
  });
}
document.querySelectorAll<HTMLButtonElement>('[data-skill]').forEach(button => button.addEventListener('click', () => selectSkill(button)));
const initialSkill = document.querySelector<HTMLButtonElement>('[data-skill="3"]');
if (initialSkill) selectSkill(initialSkill);
document.querySelectorAll<HTMLButtonElement>('.skill-filter').forEach(button => button.addEventListener('click', () => {
  document.querySelectorAll('.skill-filter').forEach(element => element.setAttribute('aria-pressed', String(element === button)));
  document.querySelectorAll<HTMLButtonElement>('[data-skill]').forEach(element => {
    element.hidden = button.dataset.category !== 'All' && element.dataset.category !== button.dataset.category;
  });
  if (!document.querySelector('[data-skill].selected:not([hidden])')) {
    const first = document.querySelector<HTMLButtonElement>('[data-skill]:not([hidden])');
    if (first) selectSkill(first);
  }
}));

if (profileMedia.heroImage && !profileMedia.heroVideo) {
  const stage = requiredElement<HTMLElement>('.hero-center');
  const figure = document.createElement('figure');
  figure.className = 'coding-figure';
  const image = document.createElement('img');
  image.src = profileMedia.heroImage;
  image.alt = 'AI-assisted portrait of Zaw Lin Naing working on a laptop';
  image.width = 1024; image.height = 1536;
  image.fetchPriority = 'high';
  const caption = document.createElement('figcaption');
  caption.textContent = 'ZAW LIN / ALWAYS IN THE MAKING';
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
initRoutes();

// Replay the introduction when visitors return Home.
const typedIntro = requiredElement<HTMLElement>('.typed-intro');
const typingPreference = matchMedia('(prefers-reduced-motion: reduce)');
let typingTimer: ReturnType<typeof setTimeout> | undefined;
function typeIntroduction(): void {
  clearTimeout(typingTimer);
  const words = 'Zaw Lin Naing / Norman Linn';
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


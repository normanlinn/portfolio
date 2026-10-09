import { skills } from './skills';
import { requiredElement } from './dom';

interface Project { title: string; intro: string; problem: string; approach: string; next: string; }
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
  {title:'Folio — Focus dashboard', intro:'A concept for a calmer way to plan the workday.', problem:'Task lists can show what needs doing without helping people decide what matters. This concept brings focus time and weekly progress into one clear view.', approach:'Prioritize a readable overview, a compact set of metrics, and simple navigation. The interface explores how hierarchy can reduce the effort of checking progress.', next:'Replace this sample with your real project story, screenshots, role, and project link.'},
  {title:'Form — Digital storefront', intro:'An editorial storefront concept for considered everyday objects.', problem:'A shopping experience should give products room to breathe while keeping information easy to find.', approach:'Use a focused visual hierarchy and quiet typography to connect the collection with a simple browsing experience.', next:'Add your real project, product imagery, design decisions, and live website link here.'},
  {title:'Playground — Creative experiments', intro:'A place for small prototypes and new possibilities.', problem:'Some ideas are best understood by making them. A playground creates room to test interactions before they become full projects.', approach:'Keep experiments small, explore one question at a time, and document what each prototype teaches.', next:'Replace this sample with your experiments, source repositories, and interactive demos.'}
];
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
document.querySelectorAll<HTMLButtonElement>('[data-project]').forEach(button => button.addEventListener('click', () => {
  const p = projects[Number(button.dataset.project)];
  if (!p) return;
  requiredElement<HTMLElement>('#dialog-label').textContent = 'CONCEPT PROJECT / CASE STUDY';
  showDialog(p.title, p.intro, [['The challenge',p.problem],['The approach',p.approach],['Make it yours',p.next]]);
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
const projectTrack = requiredElement<HTMLElement>('.projects');
for (const [selector, direction] of [['#work-prev', -1], ['#work-next', 1]] as const) {
  requiredElement<HTMLButtonElement>(selector).addEventListener('click', () => projectTrack.scrollBy({left: direction * projectTrack.clientWidth * 0.85, behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth'}));
}

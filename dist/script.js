const themeButton = document.querySelector('.theme');
function applyTheme(dark) {
  document.body.classList.toggle('dark', dark);
  themeButton.setAttribute('aria-label', dark ? 'Switch to light theme' : 'Switch to dark theme');
  themeButton.setAttribute('aria-pressed', String(dark));
}
let saved;
try { saved = localStorage.getItem('portfolio-theme'); } catch {}
applyTheme(saved === 'dark' || (!saved && matchMedia('(prefers-color-scheme: dark)').matches));
themeButton.addEventListener('click', () => {
  const dark = !document.body.classList.contains('dark');
  applyTheme(dark);
  try { localStorage.setItem('portfolio-theme', dark ? 'dark' : 'light'); } catch {}
});
const projects = [
  {title:'Folio — Focus dashboard', intro:'A concept for a calmer way to plan the workday.', problem:'Task lists can show what needs doing without helping people decide what matters. This concept brings focus time and weekly progress into one clear view.', approach:'Prioritize a readable overview, a compact set of metrics, and simple navigation. The interface explores how hierarchy can reduce the effort of checking progress.', next:'Replace this sample with your real project story, screenshots, role, and project link.'},
  {title:'Form — Digital storefront', intro:'An editorial storefront concept for considered everyday objects.', problem:'A shopping experience should give products room to breathe while keeping information easy to find.', approach:'Use a focused visual hierarchy and quiet typography to connect the collection with a simple browsing experience.', next:'Add your real project, product imagery, design decisions, and live website link here.'},
  {title:'Playground — Creative experiments', intro:'A place for small prototypes and new possibilities.', problem:'Some ideas are best understood by making them. A playground creates room to test interactions before they become full projects.', approach:'Keep experiments small, explore one question at a time, and document what each prototype teaches.', next:'Replace this sample with your experiments, source repositories, and interactive demos.'}
];
const dialog = document.getElementById('case-dialog');
function showDialog(title, intro, sections) {
  document.getElementById('dialog-title').textContent = title;
  document.getElementById('dialog-intro').textContent = intro;
  const body = document.getElementById('dialog-body');
  body.replaceChildren();
  sections.forEach(([heading, text]) => { const h = document.createElement('h3'); h.textContent = heading; const p = document.createElement('p'); p.textContent = text; body.append(h,p); });
  dialog.showModal();
  window.dispatchEvent(new Event('portfolio:dialog-open'));
}
document.querySelectorAll('[data-project]').forEach(button => button.addEventListener('click', () => {
  const p = projects[Number(button.dataset.project)];
  document.getElementById('dialog-label').textContent = 'CONCEPT PROJECT / CASE STUDY';
  showDialog(p.title, p.intro, [['The challenge',p.problem],['The approach',p.approach],['Make it yours',p.next]]);
}));
document.getElementById('contact-button').addEventListener('click', () => {
  document.getElementById('dialog-label').textContent = 'CONTACT';
  showDialog('Let’s connect.', 'Contact details are coming soon.', [['Make this yours','Add your email address or preferred contact link to enable direct inquiries.']]);
});
document.querySelector('.close').addEventListener('click', () => dialog.close());
dialog.addEventListener('click', event => { if (event.target === dialog) { const r = dialog.getBoundingClientRect(); if(event.clientX < r.left || event.clientX > r.right || event.clientY < r.top || event.clientY > r.bottom) dialog.close(); } });

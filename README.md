# Portfolio 2026

A responsive portfolio with Framer Motion animations built with HTML, CSS, and TypeScript.

Open dist/index.html to view locally, or serve the dist folder with any static web server.

## Personalize

- Replace “YOUR NAME” and “Your Name” in dist/index.html.
- Update the role, biography, and toolkit in dist/index.html.
- Replace the three concept projects with your own work. Case-study text is in src/script.ts.
- Replace the contact-button handler in src/script.ts with a real contact link, and change the button to an anchor with a mailto URL in dist/index.html.
- Colors, responsive layouts, and animations are in dist/style.css.

The names, biography, skills, and projects are sample content. No real career claims or project results have been supplied. Contact is not connected.

Google Fonts are optional: system sans-serif fonts remain available when offline.

## Motion

Run npm ci, then npm run build after editing src/motion.ts. The bundled dist/motion.js is included for static hosting and offline preview. Animations include staggered headlines, scroll reveals, spring hover/press feedback, reading progress, and dialog entrances. Reduced-motion preferences disable these effects, including when changed during a visit.

## TypeScript development

The source is in src/script.ts, src/motion.ts, and src/dom.ts. Run npm ci, npm run typecheck, and npm run build. Edit TypeScript source rather than generated dist JavaScript. Strict checking includes DOM elements, project data, dialog content, and motion options. Serve dist to preview the built website.

## GitHub Pages

Live site: https://normanlinn.github.io/portfolio/

Pages publishes main /docs. Run npm run build after editing TypeScript, HTML, or CSS, then commit the regenerated docs folder along with the source. The build copies dist into docs and adds .nojekyll to serve the website directly.

import { createHash } from 'node:crypto';
import { cp, mkdir, readFile, rm, writeFile } from 'node:fs/promises';
await rm('docs', { recursive: true, force: true });
await mkdir('docs', { recursive: true });
await cp('dist', 'docs', { recursive: true });
await writeFile('docs/.nojekyll', '');

// GitHub Pages lets browsers cache files for 10 minutes, so tag each stylesheet and
// script with a hash of its contents: a changed file always gets a new URL.
let html = await readFile('docs/index.html', 'utf8');
for (const file of ['style.css', 'redesign.css', 'merge.css', 'script.js', 'motion.js']) {
  const hash = createHash('sha256').update(await readFile(`docs/${file}`)).digest('hex').slice(0, 10);
  html = html.replace(`"${file}"`, `"${file}?v=${hash}"`);
}
await writeFile('docs/index.html', html);

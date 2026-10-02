// Build step: prerender the English home route into dist/index.html.
//
// `vite build` emits the client bundle; `vite build --ssr` emits
// dist-ssr/EntryServer.js. This script renders the app to HTML, injects it
// into the root element, preloads the Latin AB Sans font the hero needs,
// inlines the stylesheet, and removes the temporary SSR output. The client then hydrates that markup
// (src/main.jsx), so the first paint no longer waits for JavaScript.
import { readFile, writeFile, readdir, rm } from 'node:fs/promises';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

const root = path.resolve('.');
const distDir = path.join(root, 'dist');
const ssrDir = path.join(root, 'dist-ssr');
const indexPath = path.join(distDir, 'index.html');

const { render } = await import(pathToFileURL(path.join(ssrDir, 'EntryServer.js')).href);
const appHtml = render();

let html = await readFile(indexPath, 'utf8');
if (!html.includes('<div id="root"></div>')) {
  throw new Error('prerender: <div id="root"></div> not found in dist/index.html');
}
html = html.replace('<div id="root"></div>', () => `<div id="root">${appHtml}</div>`);

// Preload the Latin AB Sans face so the headline renders in its real font on
// the first paint instead of swapping in later.
const assets = await readdir(path.join(distDir, 'assets'));
const font = assets.find((f) => /^AbSansLatin-.*\.woff2$/.test(f));
if (font) {
  // Reuse the deploy base Vite already wrote into the entry script's URL.
  const base = html.match(/src="(\/[^"]*?)assets\//)?.[1] ?? '/';
  const preload = `<link rel="preload" href="${base}assets/${font}" as="font" type="font/woff2" crossorigin />`;
  html = html.replace('</title>', `</title>\n    ${preload}`);
}

// Inline the stylesheet. It is small (about 8KB gzipped) and the page cannot
// paint without it, so shipping it inside the HTML removes a render-blocking
// round trip. Its font URLs are absolute (base-prefixed), so they still resolve.
const cssLink = html.match(/<link rel="stylesheet"[^>]*href="([^"]+\.css)"[^>]*>/);
if (cssLink) {
  const cssFile = path.join(distDir, 'assets', path.basename(cssLink[1]));
  const css = await readFile(cssFile, 'utf8');
  // Function replacers: `$` sequences in the payload must stay literal.
  html = html.replace(cssLink[0], () => `<style>${css}</style>`);
}

await writeFile(indexPath, html);
await rm(ssrDir, { recursive: true, force: true });

console.log(
  `prerender: wrote ${(appHtml.length / 1024).toFixed(1)}KB of markup${font ? `, preloaded ${font}` : ''}`
);

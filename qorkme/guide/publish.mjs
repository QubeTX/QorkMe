import { cp, readFile, rm } from 'node:fs/promises';

const source = new URL('./dist/', import.meta.url);
const target = new URL('../public/install/', import.meta.url);

// Fail the build if a content edit breaks an existing public bookmark.
const html = await readFile(new URL('index.html', source), 'utf8');
for (const id of ['install', 'use', 'downloads', 'api']) {
  if (!html.includes(`id="${id}"`)) throw new Error(`Missing /install#${id}`);
}

// This directory contains only Blume output. Remove obsolete hashed assets on rebuild.
await rm(target, { recursive: true, force: true });
await cp(source, target, {
  recursive: true,
  filter: (path) => !['vercel.json', '_headers'].includes(path.split(/[\\/]/).pop()),
});

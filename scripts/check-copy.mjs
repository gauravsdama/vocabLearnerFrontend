#!/usr/bin/env node

import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const markdown = await readFile(new URL("../LANDING_PAGE_COPY.pair.md", import.meta.url), "utf8");
const sourceRoot = fileURLToPath(new URL("../src/", import.meta.url));

async function sourceFiles(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const file = path.join(directory, entry.name);
    if (entry.isDirectory()) files.push(...(await sourceFiles(file)));
    else if (/\.tsx?$/.test(entry.name)) files.push(file);
  }
  return files;
}

const documented = [...markdown.matchAll(/^#### `([^`]+)`$/gm)].map((match) => match[1]);
const duplicateKeys = documented.filter((key, index) => documented.indexOf(key) !== index);
const usedKeys = [];
for (const file of await sourceFiles(sourceRoot)) {
  const source = await readFile(file, "utf8");
  usedKeys.push(...[...source.matchAll(/copy\(["`]([^"`$]+)["`]\)/g)].map((match) => match[1]));
}
const missing = usedKeys.filter((key) => !documented.includes(key));

if (duplicateKeys.length || missing.length) {
  if (duplicateKeys.length) console.error(`Duplicate copy IDs: ${[...new Set(duplicateKeys)].join(", ")}`);
  if (missing.length) console.error(`Undocumented copy IDs: ${[...new Set(missing)].join(", ")}`);
  process.exit(1);
}

console.log(`Validated ${documented.length} stable landing-page copy IDs.`);

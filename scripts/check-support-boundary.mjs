#!/usr/bin/env node

import { readdir, readFile } from "node:fs/promises";
import path from "node:path";

const sourceRoot = path.join(process.cwd(), "src");
const sourceFiles = [];

async function collect(directory) {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const absolutePath = path.join(directory, entry.name);
    if (entry.isDirectory()) await collect(absolutePath);
    else if (/\.(?:ts|tsx)$/.test(entry.name)) sourceFiles.push(absolutePath);
  }
}

await collect(sourceRoot);

const forbidden = [
  ["file input", /type\s*=\s*["']file["']/i],
  ["picker API", /\b(?:ImagePicker|DocumentPicker|showOpenFilePicker)\b/],
  ["support attachment field", /["'](?:file|image|photo|screenshot|attachment)["']\s*[,)]/i],
];
const violations = [];

for (const file of sourceFiles) {
  const source = await readFile(file, "utf8");
  for (const [label, pattern] of forbidden) {
    if (pattern.test(source)) violations.push(`${label}: ${path.relative(process.cwd(), file)}`);
  }
}

if (violations.length) {
  for (const violation of violations) console.error(`Text-only support boundary violation: ${violation}`);
  process.exit(1);
}

console.log(`Checked ${sourceFiles.length} source files; no support-upload UI or field wiring found.`);

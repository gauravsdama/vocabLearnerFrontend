#!/usr/bin/env node

import { readdir, stat } from "node:fs/promises";
import path from "node:path";

const directories = ["src/assets/mascot/white", "src/assets/mascot/marketing"];
const maxBytes = 256 * 1024;
const failures = [];
let checked = 0;

for (const directory of directories) {
  for (const name of await readdir(directory)) {
    if (!name.endsWith(".webp")) continue;
    checked += 1;
    const file = path.join(directory, name);
    const { size } = await stat(file);
    if (size > maxBytes) failures.push(`${file}: ${size} bytes`);
  }
}

if (checked !== 11 || failures.length) {
  if (checked !== 11) console.error(`Expected 11 optimized mascot assets, found ${checked}.`);
  for (const failure of failures) console.error(`Over budget: ${failure}`);
  process.exit(1);
}

console.log(`Validated ${checked} mascot assets at or below ${maxBytes} bytes each.`);

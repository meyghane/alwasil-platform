import { readdirSync, readFileSync } from 'node:fs';
import { extname, join } from 'node:path';

const textExtensions = new Set(['.ts', '.tsx', '.js', '.jsx', '.mjs', '.css', '.json', '.txt', '.html', '.xml', '.svg', '.md']);
const forbidden = String.fromCodePoint(0x2014);
const violations = [];

function scan(directory) {
  for (const entry of readdirSync(directory, { withFileTypes: true })) {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) {
      scan(path);
    } else if (entry.isFile() && textExtensions.has(extname(entry.name))) {
      const lines = readFileSync(path, 'utf8').split('\n');
      lines.forEach((line, index) => {
        if (line.includes(forbidden)) violations.push(`${path}:${index + 1}`);
      });
    }
  }
}

scan('src');
scan('public');

if (violations.length) {
  console.error(`Tiret cadratin interdit dans le site :\n${violations.join('\n')}`);
  process.exitCode = 1;
}

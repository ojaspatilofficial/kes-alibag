// Exports the starting content from src/data/*.ts (the single source of truth) to server/seed-data.json,
// so the API never has to load TypeScript at runtime (important on Vercel's serverless functions).
// Runs automatically before `build`, `server`, `seed` and `seed:reset`. Needs Node.js 22.18+.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const OUT = path.join(ROOT, 'server', 'seed-data.json');

try {
  const site = await import('../src/data/site.ts');
  const { institutions } = await import('../src/data/institutions.ts');
  const data = {
    institutions,
    board: site.board,
    leaders: site.leaders,
    timeline: site.timeline,
    documents: site.documents,
    notices: site.notices,
    gallery: site.gallery,
    defaultSettings: site.defaultSettings,
  };
  const json = JSON.stringify(data, null, 1) + '\n';
  if (!fs.existsSync(OUT) || fs.readFileSync(OUT, 'utf8') !== json) fs.writeFileSync(OUT, json);
  console.log(`export-data: ${institutions.length} institutions → server/seed-data.json`);
} catch (err) {
  if (fs.existsSync(OUT)) {
    console.warn('export-data: could not read src/data (Node 22.18+ needed) — keeping the existing server/seed-data.json.', err.message);
  } else {
    throw err;
  }
}

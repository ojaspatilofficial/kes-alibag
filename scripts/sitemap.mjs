// Writes public/sitemap.xml and public/robots.txt before every build.
// Base URL: SITE_URL in .env / Vercel env (falls back to the Society's domain).
import 'dotenv/config';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const BASE = (process.env.SITE_URL || 'https://www.kesalibag.edu.in').replace(/\/$/, '');

const urls = [];
try {
  const { pages } = await import('../src/data/pages.ts');
  const { categories } = await import('../src/data/categories.ts');
  const { institutions } = await import('../src/data/institutions.ts');
  urls.push(...pages.map((p) => p.path));
  urls.push(...categories.map((c) => `/institutions/${c.key}`));
  urls.push(...institutions.map((i) => `/institutions/${i.category}/${i.slug}`));
} catch (err) {
  console.warn('sitemap: could not read src/data (needs Node 22.18+). Writing a short sitemap instead.', err.message);
  urls.push('/', '/about', '/institutions', '/contact');
}

const today = new Date().toISOString().slice(0, 10);
const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map((u) => `  <url><loc>${BASE}${u}</loc><lastmod>${today}</lastmod></url>`).join('\n')}
</urlset>
`;
fs.writeFileSync(path.join(ROOT, 'public', 'sitemap.xml'), xml);
fs.writeFileSync(
  path.join(ROOT, 'public', 'robots.txt'),
  `User-agent: *\nAllow: /\nDisallow: /admin\nDisallow: /api/\n\nSitemap: ${BASE}/sitemap.xml\n`
);
console.log(`sitemap: ${urls.length} URLs → public/sitemap.xml (base ${BASE})`);

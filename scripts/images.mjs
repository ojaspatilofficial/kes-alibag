// npm run images
// Reads the original pictures in reference-assets/ (never modified) and writes optimised copies to
// public/images/<same-folder>/<name>-<width>.webp (+ .avif for the hero), favicons and the social-share image.
// It also writes src/data/imageManifest.json, which <Picture /> uses to build srcset + width/height.
import sharp from 'sharp';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const SRC = path.join(ROOT, 'reference-assets');
const OUT = path.join(ROOT, 'public', 'images');
const PUBLIC = path.join(ROOT, 'public');
const MANIFEST = path.join(ROOT, 'src', 'data', 'imageManifest.json');

/** Which widths to make for each folder. Widths larger than the original are skipped. */
const plans = {
  about: { widths: [480, 960, 1600], avif: true },
  board: { widths: [400, 800] },
  leaders: { widths: [400, 800] },
  history: { widths: [480, 960, 1600] },
  brand: { widths: [96, 192, 480] },
};
const SKIP = new Set(['kes-letterhead-banner.png', 'kes-favicon.ico']); // reference only

const manifest = {};
fs.mkdirSync(OUT, { recursive: true });

for (const [folder, plan] of Object.entries(plans)) {
  const dir = path.join(SRC, folder);
  if (!fs.existsSync(dir)) continue;
  fs.mkdirSync(path.join(OUT, folder), { recursive: true });

  for (const file of fs.readdirSync(dir)) {
    if (SKIP.has(file) || !/\.(jpe?g|png)$/i.test(file)) continue;
    const name = file.replace(/\.[^.]+$/, '');
    const input = path.join(dir, file);
    const meta = await sharp(input).metadata();
    let widths = plan.widths.filter((w) => w <= meta.width);
    // Also keep the original width when it sits between two planned sizes (no upscaling).
    if (meta.width < Math.max(...plan.widths) && !widths.includes(meta.width)) widths.push(meta.width);

    for (const w of widths) {
      const base = path.join(OUT, folder, `${name}-${w}`);
      await sharp(input).resize({ width: w }).webp({ quality: folder === 'history' ? 72 : 78 }).toFile(`${base}.webp`);
      if (plan.avif) await sharp(input).resize({ width: w }).avif({ quality: 55 }).toFile(`${base}.avif`);
    }
    manifest[`/images/${folder}/${name}`] = {
      widths,
      width: meta.width,
      height: meta.height,
      ...(plan.avif ? { avif: true } : {}),
    };
    console.log(`  ✓ ${folder}/${name}  (${widths.join(', ')})`);
  }
}

fs.writeFileSync(MANIFEST, JSON.stringify(manifest, null, 2) + '\n');
console.log(`  ✓ manifest → src/data/imageManifest.json (${Object.keys(manifest).length} images)`);

/* --------------------------- Documents (real PDFs) --------------------------- */
fs.mkdirSync(path.join(PUBLIC, 'documents'), { recursive: true });
for (const file of fs.readdirSync(path.join(SRC, 'documents'))) {
  fs.copyFileSync(path.join(SRC, 'documents', file), path.join(PUBLIC, 'documents', file));
  console.log(`  ✓ documents/${file}`);
}

/* --------------------------------- Icons ---------------------------------- */
const emblem = path.join(SRC, 'brand', 'kes-emblem.png');

// Emblem centred on a white circle (the original has a white background).
async function emblemDisc(size, pad = 0.06) {
  const inner = Math.round(size * (1 - pad * 2));
  const art = await sharp(emblem).resize(inner, inner, { fit: 'contain', background: '#ffffff' }).flatten({ background: '#ffffff' }).png().toBuffer();
  const square = await sharp({ create: { width: size, height: size, channels: 4, background: '#ffffff' } })
    .composite([{ input: art, gravity: 'centre' }])
    .png()
    .toBuffer();
  // Clip to a circle so no white corners show on dark backgrounds.
  const mask = Buffer.from(`<svg width="${size}" height="${size}"><circle cx="${size / 2}" cy="${size / 2}" r="${size / 2}" fill="#000"/></svg>`);
  return sharp(square).composite([{ input: mask, blend: 'dest-in' }]).png().toBuffer();
}

// favicon.svg — wraps a small PNG of the emblem so browsers that prefer SVG icons get a crisp version.
const png96 = await emblemDisc(64, 0.02);
fs.writeFileSync(
  path.join(PUBLIC, 'favicon.svg'),
  `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 64 64"><image width="64" height="64" xlink:href="data:image/png;base64,${png96.toString('base64')}"/></svg>\n`
);

// favicon.ico — ICO container holding 16, 32 and 48 px PNGs.
const icoSizes = [16, 32, 48];
const icoImages = await Promise.all(icoSizes.map((s) => emblemDisc(s, 0.01)));
const header = Buffer.alloc(6 + 16 * icoImages.length);
header.writeUInt16LE(0, 0);
header.writeUInt16LE(1, 2);
header.writeUInt16LE(icoImages.length, 4);
let offset = header.length;
icoImages.forEach((img, i) => {
  const e = 6 + i * 16;
  header.writeUInt8(icoSizes[i], e);
  header.writeUInt8(icoSizes[i], e + 1);
  header.writeUInt16LE(1, e + 4);
  header.writeUInt16LE(32, e + 6);
  header.writeUInt32LE(img.length, e + 8);
  header.writeUInt32LE(offset, e + 12);
  offset += img.length;
});
fs.writeFileSync(path.join(PUBLIC, 'favicon.ico'), Buffer.concat([header, ...icoImages]));

// apple-touch-icon.png — 180×180 on cream.
await sharp({ create: { width: 180, height: 180, channels: 4, background: '#FFF8EC' } })
  .composite([{ input: await emblemDisc(160, 0.03), gravity: 'centre' }])
  .png()
  .toFile(path.join(PUBLIC, 'apple-touch-icon.png'));

// og-image.png — 1200×630, emblem + name on deep maroon.
const ogText = Buffer.from(`
<svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <radialGradient id="g" cx="25%" cy="50%" r="70%">
      <stop offset="0" stop-color="#7F1A2B"/><stop offset="1" stop-color="#3A0912"/>
    </radialGradient>
  </defs>
  <rect width="1200" height="630" fill="url(#g)"/>
  <rect x="0" y="0" width="1200" height="10" fill="#F5B534"/>
  <circle cx="300" cy="315" r="205" fill="none" stroke="#F5B534" stroke-width="4" opacity="0.6"/>
  <text x="560" y="250" font-family="Georgia, 'Times New Roman', serif" font-size="56" font-weight="700" fill="#ffffff">Konkan Education</text>
  <text x="560" y="318" font-family="Georgia, 'Times New Roman', serif" font-size="56" font-weight="700" fill="#ffffff">Society, Alibag</text>
  <text x="562" y="372" font-family="Arial, sans-serif" font-size="19" font-weight="700" letter-spacing="3" fill="#F5B534">EST. 1917 · RAIGAD · THANE · SINDHUDURG</text>
  <text x="562" y="440" font-family="Arial, sans-serif" font-size="26" fill="#FBE5E8">Lighting the lamp of knowledge</text>
  <text x="562" y="476" font-family="Arial, sans-serif" font-size="26" fill="#FBE5E8">across the Konkan since 1917.</text>
</svg>`);
await sharp(ogText)
  .composite([{ input: await emblemDisc(380, 0.04), left: 110, top: 125 }])
  .png({ compressionLevel: 9, palette: true, quality: 90 })
  .toFile(path.join(PUBLIC, 'og-image.png'));

console.log('  ✓ favicon.svg, favicon.ico, apple-touch-icon.png, og-image.png');
console.log('Done.');

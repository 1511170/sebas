/**
 * Download Bitunix and BingX logos from sebas.co to public/images/
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SITE = 'https://sebas.co';
const OUT_DIR = path.join(__dirname, '..', 'public', 'images');

const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36';

async function get(url) {
  const res = await fetch(url, { headers: { 'User-Agent': UA } });
  if (!res.ok) throw new Error(`${res.status} ${url}`);
  return Buffer.from(await res.arrayBuffer());
}

function saveBuffer(filePath, data) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, data);
}

const logos = [
  { url: new URL('images/bitunix-sebas-co.png', SITE).href, file: 'bitunix-sebas-co.png' },
  { url: new URL('images/bingx-logo.svg', SITE).href, file: 'bingx-logo.svg' },
];

(async () => {
  fs.mkdirSync(OUT_DIR, { recursive: true });
  for (const { url, file } of logos) {
    try {
      const buf = await get(url);
      const outPath = path.join(OUT_DIR, file);
      saveBuffer(outPath, buf);
      console.log('Saved', file, '->', outPath);
    } catch (e) {
      console.error('Failed', file, e.message);
    }
  }
  console.log('Done.');
})();

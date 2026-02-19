/**
 * Fetch sebas.co HTML, find image URLs (likely founder/team photo), download and save as sebastian-cuadros.jpg
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SITE = 'https://sebas.co';
const OUT_DIR = path.join(__dirname, '..', 'public');
const OUT_FILE = path.join(OUT_DIR, 'sebastian-cuadros.jpg');

const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36';

async function get(url) {
  const res = await fetch(url, { headers: { 'User-Agent': UA } });
  if (!res.ok) throw new Error(res.status);
  return Buffer.from(await res.arrayBuffer());
}

function saveBuffer(filePath, data) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, data);
}

(async () => {
  try {
    let html;
    try {
      html = (await get(SITE)).toString();
    } catch (e) {
      console.error('Failed to fetch page:', e.message);
      process.exit(1);
    }
    fs.mkdirSync(OUT_DIR, { recursive: true });
    // Known founder image from sebas.co (from _sebas-raw.html: section-home-testimonial)
    const founderImgUrl = new URL('images/sebastian-cuadros-sebas-co.jpeg', SITE).href;
    try {
      const buf = await get(founderImgUrl);
      const isJpeg = buf.length >= 2 && buf[0] === 0xff && buf[1] === 0xd8;
      const isPng = buf.length >= 8 && buf[0] === 0x89 && buf[1] === 0x50 && buf[2] === 0x4e;
      if (buf && buf.length > 500 && (isJpeg || isPng)) {
        saveBuffer(OUT_FILE, buf);
        console.log('Downloaded founder image and saved to', OUT_FILE);
        process.exit(0);
      }
    } catch (e) {
      console.warn('Direct founder URL failed:', e.message);
    }
    // Common patterns: src="...", data-src="...", url(...), uploads-ssl.webflow.com, images.unsplash (unlikely for founder)
    const patterns = [
      /(?:src|data-src)=["'](https?:\/\/[^"']+\.(?:jpg|jpeg|png|webp)[^"']*)["']/gi,
      /(?:src|data-src)=["'](\/[^"']+\.(?:jpg|jpeg|png|webp)[^"']*)["']/gi,
      /url\(["']?(https?:\/\/[^"')]+\.(?:jpg|jpeg|png|webp)[^"')]*)["']?\)/gi,
    ];
    const candidates = new Set();
    for (const re of patterns) {
      let m;
      re.lastIndex = 0;
      while ((m = re.exec(html)) !== null) {
        let url = m[1];
        if (url.startsWith('/')) url = new URL(url, SITE).href;
        candidates.add(url);
      }
    }
    // Also match any https URL that looks like an image
    const anyImg = /(https?:\/\/[a-zA-Z0-9.-]+\/[^"'\s]+\.(?:jpg|jpeg|png|webp)(?:\?[^"'\s]*)?)/gi;
    let mm;
    while ((mm = anyImg.exec(html)) !== null) candidates.add(mm[1]);
    // Also look for any img near "Sebastian" or "Founder" in HTML (we can't easily do that with regex on minified HTML, so try first image from webflow)
    const arr = [...candidates];
    const webflowImages = arr.filter((u) => u.includes('webflow') || u.includes('uploads'));
    const toTry = webflowImages.length ? webflowImages : arr;
    if (toTry.length === 0) {
      console.log('No image URLs found in page. Trying common Webflow CDN pattern...');
      // Fallback: some sites use /images/ or similar - try direct path
      const fallback = `${SITE}/images/sebastian-cuadros.jpg`;
      try {
        const buf = await get(fallback);
        const isJpeg = buf.length >= 2 && buf[0] === 0xff && buf[1] === 0xd8;
        if (buf && buf.length > 500 && isJpeg) {
          saveBuffer(OUT_FILE, buf);
          console.log('Saved to', OUT_FILE);
          process.exit(0);
        }
      } catch (_) {}
      console.error('Could not find or download founder image. Add public/sebastian-cuadros.jpg manually.');
      process.exit(1);
    }
    for (const url of toTry.slice(0, 5)) {
      try {
        const buf = await get(url);
        const isJpeg = buf.length >= 2 && buf[0] === 0xff && buf[1] === 0xd8;
        const isPng = buf.length >= 8 && buf[0] === 0x89 && buf[1] === 0x50 && buf[2] === 0x4e;
        if (buf && buf.length > 500 && (isJpeg || isPng)) {
          saveBuffer(OUT_FILE, buf);
          console.log('Downloaded and saved:', OUT_FILE);
          process.exit(0);
        }
      } catch (e) {
        console.warn('Skip', url, e.message);
      }
    }
    console.error('No valid image found. Add public/sebastian-cuadros.jpg manually.');
    process.exit(1);
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
})();

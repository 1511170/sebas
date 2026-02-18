#!/usr/bin/env node
/**
 * Rebuild the Astro site and copy output to sebas-static.
 * Run from repo root: node scripts/sync-sebas-static.js
 *
 * After running, in sebas-static:
 *   git add -A && git status
 *   git commit -m "Update static export" && git push origin main
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const SITE = path.join(ROOT, 'sites', 'sebas');
const STATIC = path.join(ROOT, 'sebas-static');
const DIST = path.join(SITE, 'dist');

function run(cmd, cwd = ROOT) {
  console.log(`\n> ${cmd}`);
  execSync(cmd, { cwd, stdio: 'inherit', shell: true });
}

function copyRecursive(src, dest) {
  if (!fs.existsSync(src)) {
    console.error(`Missing: ${src}`);
    process.exit(1);
  }
  const stat = fs.statSync(src);
  if (stat.isDirectory()) {
    if (!fs.existsSync(dest)) fs.mkdirSync(dest, { recursive: true });
    for (const name of fs.readdirSync(src)) {
      copyRecursive(path.join(src, name), path.join(dest, name));
    }
  } else {
    fs.copyFileSync(src, dest);
  }
}

function clearDir(dir) {
  if (!fs.existsSync(dir)) return;
  for (const name of fs.readdirSync(dir)) {
    const full = path.join(dir, name);
    if (name === '.git') continue;
    if (fs.statSync(full).isDirectory()) {
      fs.rmSync(full, { recursive: true });
    } else {
      fs.unlinkSync(full);
    }
  }
}

console.log('Rebuilding site and syncing to sebas-static...\n');

run('npm run build', SITE);

if (!fs.existsSync(STATIC)) {
  console.error('sebas-static folder not found. Create it and run git init first.');
  process.exit(1);
}

console.log('\nCopying dist/ to sebas-static/ (keeping .git, README.md, .gitignore)...');
const keep = new Set(['.git', 'README.md', '.gitignore']);
for (const name of fs.readdirSync(STATIC)) {
  if (keep.has(name)) continue;
  const full = path.join(STATIC, name);
  if (fs.statSync(full).isDirectory()) {
    fs.rmSync(full, { recursive: true });
  } else {
    fs.unlinkSync(full);
  }
}

copyRecursive(DIST, STATIC);

// Remove any dist/.git or similar that might have been copied
const astroDir = path.join(STATIC, '_astro');
if (fs.existsSync(astroDir)) {
  // Keep _astro as-is (it was copied from dist)
}

console.log('\nDone. To publish:\n  cd sebas-static\n  git add -A && git status\n  git commit -m "Update static export" && git push origin main\n');

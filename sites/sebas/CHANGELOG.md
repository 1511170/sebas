# Changelog – Sebas.co site

## [Unreleased]

### Added
- **Floating Telegram button** linking to https://t.me/sebasCua on all pages (Layout + niche layouts).
- **Partner logos in Hero**: Bitunix and BingX wordmark SVGs (from `src/assets`) in the “Backed by the best” section, full color, no grayscale.
- **Script** `scripts/fetch-partner-logos.js` to download partner logos from sebas.co (for reference; local SVGs used in Hero).

### Changed
- **Footer**: Removed phone number (+1 (242) 589-1376). Kept email and “Where we are”.
- **Hero**: Partner block now uses imported SVG assets (`bitunix-logo.svg`, `bingx-logo.svg`) for reliable URLs in dev and build.
- **Navbar / Footer**: Present in all layouts (main + KOL, Trader, Fund, Platform) as shared components.
- **CTAs**: Navbar “Schedule a demo”, Footer “Schedule Strategic Call”, and niche CTAs point to Cal.com (e.g. `https://cal.com/sebasco/15min`, profile-specific where provided).
- **Site language**: Content and meta set to English (`lang="en"`, `og:locale="en_US"`).

### Technical
- Logos live in `src/assets/` and are imported in `Hero.astro` so Vite/Astro resolve paths in dev and static build.
- `public/images/` still holds copies of SVGs for reference; Hero uses assets from `src/assets/`.

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

---

## [2025-02] Services, FAQs, i18n, SEO

### Added
- **Services page** (`/services`, `/es/services`): Full page with hero, core services grid, “How we work” (3 steps), solutions by profile (KOL/Trader/Fund/Platform), FAQ accordion, and CTA. Bilingual (en/es) via i18n. Navbar “Services” links to `/services` (localized).
- **FAQs page** (`/faqs`, `/es/faqs`): Hero, category tabs (General, KOLs, Traders, Funds, Platforms) with swipe/scroll on mobile, accordion FAQs (30+ items), dynamic title by category, and CTA. Bilingual. Navbar “FAQs” links to `/faqs` (localized).
- **Footer “Backed by the best”**: Same label and partner logos (Bitunix PNG, BingX SVG) as Hero, placed after the main CTA block. Logos imported from `src/assets`.
- **Language toggle on mobile**: In the header next to the hamburger (not inside the menu). Nav strings `language` / `Idioma` in i18n.
- **SEO / AI citations** for new pages: Layout already provides citation meta (citation_title, citation_author, speakable, ai-purpose). FAQPage JSON-LD schema on `/faqs` and `/es/faqs`; FinancialService JSON-LD on `/services` and `/es/services` (injected via `slot="head"`).

### Changed
- **Hero**: Bitunix logo uses `bitunix-sebas-co-p-2600.png` (full brand image) instead of SVG wordmark.
- **ChooseProfile**: Quote, “Sebastian Cuadros” and “FOUNDER” in white, larger typography and light drop-shadow on the gradient background; slightly larger photo circle.
- **FAQ tabs**: Centered on desktop; scroll-snap and gradient hint on mobile for swipe; category title above accordion updates with selected tab.
- **Navbar**: Services → `getLocalizedPath('/services', locale)`; FAQs → `getLocalizedPath('/faqs', locale)`.
- **Footer**: Profiles “FAQs” link → `/faqs`; added partner logos block after CTA.

### Technical
- New components: `ServicesContent.astro`, `FaqContent.astro`. New assets: `bitunix-sebas-co-p-2600.png`.
- i18n: `meta.services_*`, `meta.faq_*`, `services.*`, `faq_page.*`, `nav.language` in en.json and es.json.
- FAQ filter script updates `#faq-category-title` from tab `data-faq-label`.

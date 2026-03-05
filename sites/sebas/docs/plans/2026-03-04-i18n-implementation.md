# i18n Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Add EN/ES bilingual support to sebas.co using the `skills/community/i18n` skill, with clean URL routing (`/` EN, `/es/` ES).

**Architecture:** Copy `skills/community/i18n` files into `src/i18n/`. Homepage shared components receive `locale` prop and read strings from JSON. Niche pages (kol, trader, fund, platform) use inline `copy` translation objects in frontmatter — avoids over-engineering with megafiles. Spanish pages live under `src/pages/es/`.

**Tech Stack:** Astro 5 SSG, TypeScript, `createI18n()` from skill utils.

---

## Task 1: Install i18n skill files

**Files:**
- Create: `sites/sebas/src/i18n/utils.ts`
- Create: `sites/sebas/src/i18n/index.ts`
- Create: `sites/sebas/src/components/shared/LanguageToggle.astro`

**Step 1: Copy utils.ts from skill**

Create `sites/sebas/src/i18n/utils.ts` with full content:

```typescript
export interface I18nConfig<T extends Record<string, Record<string, unknown>>> {
  translations: T;
  defaultLocale?: keyof T & string;
}

export type Locale<T extends Record<string, unknown>> = keyof T & string;

export function createI18n<T extends Record<string, Record<string, unknown>>>(
  config: I18nConfig<T>
) {
  const { translations, defaultLocale } = config;
  const locales = Object.keys(translations) as (keyof T & string)[];
  const def = defaultLocale ?? locales[0];

  function t(locale: keyof T & string): T[typeof locale] {
    return translations[locale];
  }

  function getLocaleFromUrl(url: URL): keyof T & string {
    const [, first] = url.pathname.split('/');
    if (first && locales.includes(first as keyof T & string) && first !== def) {
      return first as keyof T & string;
    }
    return def;
  }

  function getLocalizedPath(path: string, locale: keyof T & string): string {
    const clean = getPathWithoutLocale(path);
    if (locale === def) return clean;
    return `/${locale}${clean === '/' ? '' : clean}`;
  }

  function getPathWithoutLocale(pathname: string): string {
    for (const locale of locales) {
      if (locale === def) continue;
      const stripped = pathname.replace(new RegExp(`^\\/${locale}(\\/|$)`), '/');
      if (stripped !== pathname) return stripped || '/';
    }
    return pathname || '/';
  }

  function getLocales(): (keyof T & string)[] {
    return locales;
  }

  function getDefaultLocale(): keyof T & string {
    return def;
  }

  return { t, getLocaleFromUrl, getLocalizedPath, getPathWithoutLocale, getLocales, getDefaultLocale };
}
```

**Step 2: Create index.ts**

Create `sites/sebas/src/i18n/index.ts`:

```typescript
import { createI18n } from './utils';
import en from './en.json';
import es from './es.json';

export const {
  t,
  getLocaleFromUrl,
  getLocalizedPath,
  getPathWithoutLocale,
  getLocales,
  getDefaultLocale,
} = createI18n({
  translations: { en, es },
  defaultLocale: 'en',
});

export type SiteLocale = 'en' | 'es';
```

**Step 3: Create LanguageToggle.astro**

Create `sites/sebas/src/components/shared/LanguageToggle.astro`:

```astro
---
interface LocaleOption {
  code: string;
  label: string;
  flagSrc?: string;
  ariaLabel?: string;
}

interface Props {
  currentLocale: string;
  currentPath: string;
  alternates: Array<LocaleOption & { href: string }>;
  sticky?: boolean;
}

const { alternates, sticky = false } = Astro.props;

const inlineClass =
  'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-white/20 hover:border-white/50 transition-colors text-sm font-bold text-white hover:text-primary uppercase tracking-wider';
---

{sticky ? (
  <div class="fixed bottom-6 left-6 z-40 lg:hidden">
    {alternates.map((alt) => (
      <a href={alt.href} class="inline-flex items-center gap-2 px-4 py-3 rounded-full border-2 border-white/20 bg-black shadow-lg hover:border-primary hover:shadow-xl transition-all text-base font-bold text-white active:scale-[0.98]" aria-label={alt.ariaLabel ?? `Switch to ${alt.label}`} hreflang={alt.code}>
        <span>{alt.label}</span>
      </a>
    ))}
  </div>
) : (
  <div class="inline-flex items-center gap-1">
    {alternates.map((alt) => (
      <a href={alt.href} class={inlineClass} aria-label={alt.ariaLabel ?? `Switch to ${alt.label}`} hreflang={alt.code}>
        <span>{alt.label}</span>
      </a>
    ))}
  </div>
)}
```

**Step 4: Verify build**

```bash
cd sites/sebas && npm run build 2>&1 | tail -20
```
Expected: build exits 0 (or fails only on missing en.json/es.json — that's fine, we create them next).

**Step 5: Commit**

```bash
git add sites/sebas/src/i18n/ sites/sebas/src/components/shared/LanguageToggle.astro
git commit -m "feat(i18n): install i18n skill — utils, index, LanguageToggle"
```

---

## Task 2: Create translation JSON files

**Files:**
- Create: `sites/sebas/src/i18n/en.json`
- Create: `sites/sebas/src/i18n/es.json`

**Step 1: Create en.json**

Create `sites/sebas/src/i18n/en.json`:

```json
{
  "meta": {
    "home_title": "Sebas.co — We Connect Influence, Capital and Technology",
    "home_description": "Strategic partners of BingX and Bitunix. Institutional VIP access for KOLs, professional traders, investment funds and crypto platforms. Monthly volume: $2B–$4B."
  },
  "nav": {
    "kol": "KOL / Influencers",
    "trader": "Professional Traders",
    "fund": "Funds",
    "platform": "Platform / Communities",
    "services": "Services",
    "faqs": "FAQs",
    "cta": "Schedule a demo"
  },
  "hero": {
    "title": "We Connect Influence, Capital and Technology",
    "subtitle": "From financial influencers and professional traders to institutional funds and education communities: we give you the direct bridge to access, scale and monetize in crypto with top-tier exchanges.",
    "cta": "Apply Now",
    "partners_label": "Backed by the best"
  },
  "achieve": {
    "eyebrow": "This is what happens when you connect with the real power of the ecosystem",
    "title1": "What you can",
    "title2": "achieve with",
    "quote": "\"We've already opened doors where others didn't know there were keys. And we're just getting started.\" — Sebas",
    "features": [
      {
        "icon": "vpn_key",
        "title": "Institutional VIP access",
        "description": "Special-fee accounts, $10M+ limits, 24/7 support, and access to products the public never sees."
      },
      {
        "icon": "payments",
        "title": "Automated recurring revenue",
        "description": "Up to $200K/mo in automatic revenue sharing. Your audience works for you while you sleep."
      },
      {
        "icon": "hub",
        "title": "Full tech integration",
        "description": "Private APIs, custom dashboards, exclusive bots, and infrastructure that turns your brand into a money machine."
      },
      {
        "icon": "stars",
        "title": "Authority positioning",
        "description": "We position you as the bridge between traditional and crypto. Exclusive events, strategic partnerships, and institutional deal flow."
      },
      {
        "icon": "trending_up",
        "title": "Unlimited scalability",
        "description": "From influencer to fund manager, from trader to market maker. We support you at every stage of your evolution."
      }
    ]
  },
  "forwhom": {
    "eyebrow": "If you see yourself in any of these profiles, you're probably sitting on a gold mine... without knowing how to mine it.",
    "title": "Who is",
    "quote": "\"The difference between those who win and those who dominate is in the connections. We are those connections.\" — Sebas",
    "profiles": [
      {
        "icon": "mic",
        "title": "Crypto KOLs & Influencers",
        "description": "You have the attention (analysis, content, signals, controversy, disruption). We have the keys to the bank."
      },
      {
        "icon": "show_chart",
        "title": "Professional Trader",
        "description": "You know how to make money. We connect you to multiply it exponentially."
      },
      {
        "icon": "account_balance",
        "title": "Investment Fund",
        "description": "Crypto is no longer speculation. It's the new institutional asset class."
      },
      {
        "icon": "smart_toy",
        "title": "Platforms & Bots",
        "description": "You have the audience and the tech. We give you the infrastructure to monetize at scale."
      }
    ]
  },
  "different": {
    "eyebrow": "While others sell smoke, we move real money",
    "volume": "With a trading volume of between",
    "volume_range": "2 Billion and 4 Billion",
    "volume_period": "Monthly",
    "title": "What makes",
    "title_italic": "Sebas.co",
    "title_suffix": "different?",
    "items": [
      {
        "number": "1",
        "title": "Connections others can't get",
        "description": "We're not another affiliate asking for crumbs. We're strategic partners of BingX and Bitunix with direct desk access, institutional fees, and exclusive products that don't appear on their public site."
      },
      {
        "number": "2",
        "title": "Unlimited monetization",
        "description": "We build revenue ecosystems, not affiliate links. Revenue sharing, white-label programs, API integrations, and business models that scale with your growth."
      },
      {
        "number": "3",
        "title": "360° strategic vision",
        "description": "We don't sell you tools. We design strategies. Every client gets a custom blueprint to dominate their niche and expand their crypto empire."
      },
      {
        "number": "4",
        "title": "Institutional-speed execution",
        "description": "While others take months to \"structure\", we activate your revenue in days. We have the contacts, contracts, and credibility to make things happen."
      }
    ]
  },
  "choose": {
    "eyebrow": "Choose your profile and unlock your future",
    "title": "Your profile determines your potential. Choose wisely:",
    "apply_cta": "Apply Now",
    "quote": "\"The crypto world doesn't wait. Every day you don't act is money you'll never get back.\"",
    "founder_title": "Founder",
    "profiles": [
      { "title": "I'm a KOL / Influencer", "subtitle": "My audience is worth millions" },
      { "title": "I'm a Trader", "subtitle": "I want to scale exponentially" },
      { "title": "I manage capital", "subtitle": "Secure institutional entry" },
      { "title": "I have a platform", "subtitle": "Advanced monetization" }
    ]
  }
}
```

**Step 2: Create es.json**

Create `sites/sebas/src/i18n/es.json`:

```json
{
  "meta": {
    "home_title": "Sebas.co — Conectamos Influencia, Capital y Tecnología",
    "home_description": "Socios estratégicos de BingX y Bitunix. Acceso VIP institucional para KOLs, traders profesionales, fondos de inversión y plataformas crypto. Volumen mensual: $2B–$4B."
  },
  "nav": {
    "kol": "KOL / Influencers",
    "trader": "Traders Profesionales",
    "fund": "Fondos",
    "platform": "Plataforma / Comunidades",
    "services": "Servicios",
    "faqs": "FAQs",
    "cta": "Agenda una demo"
  },
  "hero": {
    "title": "Conectamos Influencia, Capital y Tecnología",
    "subtitle": "Desde influencers financieros y traders profesionales hasta fondos institucionales y comunidades de educación: te damos el puente directo para acceder, escalar y monetizar en crypto con los mejores exchanges del mundo.",
    "cta": "Aplica Ahora",
    "partners_label": "Respaldados por los mejores"
  },
  "achieve": {
    "eyebrow": "Esto es lo que pasa cuando te conectas con el poder real del ecosistema",
    "title1": "Lo que puedes",
    "title2": "lograr con",
    "quote": "\"Ya hemos abierto puertas donde otros ni sabían que había llaves. Y apenas estamos comenzando.\" — Sebas",
    "features": [
      {
        "icon": "vpn_key",
        "title": "Acceso VIP institucional",
        "description": "Cuentas con tarifas especiales, límites de $10M+, soporte 24/7 y acceso a productos que el público nunca ve."
      },
      {
        "icon": "payments",
        "title": "Ingresos recurrentes automatizados",
        "description": "Hasta $200K/mes en revenue sharing automático. Tu audiencia trabaja para ti mientras duermes."
      },
      {
        "icon": "hub",
        "title": "Integración tecnológica completa",
        "description": "APIs privadas, dashboards personalizados, bots exclusivos e infraestructura que convierte tu marca en una máquina de dinero."
      },
      {
        "icon": "stars",
        "title": "Posicionamiento de autoridad",
        "description": "Te posicionamos como el puente entre lo tradicional y lo crypto. Eventos exclusivos, alianzas estratégicas y flujo de deals institucionales."
      },
      {
        "icon": "trending_up",
        "title": "Escalabilidad ilimitada",
        "description": "De influencer a gestor de fondos, de trader a market maker. Te acompañamos en cada etapa de tu evolución."
      }
    ]
  },
  "forwhom": {
    "eyebrow": "Si te ves reflejado en alguno de estos perfiles, probablemente estás sentado sobre una mina de oro... sin saber cómo explotarla.",
    "title": "¿Para quién es",
    "quote": "\"La diferencia entre los que ganan y los que dominan está en las conexiones. Nosotros somos esas conexiones.\" — Sebas",
    "profiles": [
      {
        "icon": "mic",
        "title": "KOLs y Creadores Crypto",
        "description": "Tienes la atención (análisis, contenido, señales, controversia, disrupción). Nosotros tenemos las llaves del banco."
      },
      {
        "icon": "show_chart",
        "title": "Trader Profesional",
        "description": "Sabes cómo hacer dinero. Nosotros te conectamos para multiplicarlo exponencialmente."
      },
      {
        "icon": "account_balance",
        "title": "Fondo de Inversión",
        "description": "El crypto ya no es especulación. Es la nueva clase de activo institucional."
      },
      {
        "icon": "smart_toy",
        "title": "Plataformas y Bots",
        "description": "Tienes la audiencia y la tecnología. Nosotros te damos la infraestructura para monetizar a escala."
      }
    ]
  },
  "different": {
    "eyebrow": "Mientras otros venden humo, nosotros movemos dinero real",
    "volume": "Con un volumen de trading de entre",
    "volume_range": "2 Mil Millones y 4 Mil Millones",
    "volume_period": "Mensuales",
    "title": "¿Qué hace diferente a",
    "title_italic": "Sebas.co",
    "title_suffix": "?",
    "items": [
      {
        "number": "1",
        "title": "Conexiones que otros no pueden conseguir",
        "description": "No somos otro afiliado pidiendo migajas. Somos socios estratégicos de BingX y Bitunix con acceso directo a mesa, tarifas institucionales y productos exclusivos que no aparecen en su sitio público."
      },
      {
        "number": "2",
        "title": "Monetización ilimitada",
        "description": "Construimos ecosistemas de ingresos, no links de afiliados. Revenue sharing, programas white-label, integraciones API y modelos de negocio que escalan con tu crecimiento."
      },
      {
        "number": "3",
        "title": "Visión estratégica 360°",
        "description": "No te vendemos herramientas. Diseñamos estrategias. Cada cliente recibe un blueprint personalizado para dominar su nicho y expandir su imperio crypto."
      },
      {
        "number": "4",
        "title": "Ejecución a velocidad institucional",
        "description": "Mientras otros tardan meses en \"estructurar\", nosotros activamos tus ingresos en días. Tenemos los contactos, contratos y credibilidad para hacer que las cosas sucedan."
      }
    ]
  },
  "choose": {
    "eyebrow": "Elige tu perfil y desbloquea tu futuro",
    "title": "Tu perfil determina tu potencial. Elige con sabiduría:",
    "apply_cta": "Aplica Ahora",
    "quote": "\"El mundo crypto no espera. Cada día que no actúas es dinero que nunca vas a recuperar.\"",
    "founder_title": "Fundador",
    "profiles": [
      { "title": "Soy KOL / Influencer", "subtitle": "Mi audiencia vale millones" },
      { "title": "Soy Trader", "subtitle": "Quiero escalar exponencialmente" },
      { "title": "Gestiono capital", "subtitle": "Entrada institucional segura" },
      { "title": "Tengo una plataforma", "subtitle": "Monetización avanzada" }
    ]
  }
}
```

**Step 3: Verify build**

```bash
cd sites/sebas && npm run build 2>&1 | tail -20
```
Expected: build succeeds (components still use hardcoded strings, this just validates JSON is valid).

**Step 4: Commit**

```bash
git add sites/sebas/src/i18n/en.json sites/sebas/src/i18n/es.json
git commit -m "feat(i18n): add EN/ES translation JSON files for homepage"
```

---

## Task 3: Update homepage shared components to use locale prop

**Files:**
- Modify: `sites/sebas/src/components/sections/Hero.astro`
- Modify: `sites/sebas/src/components/sections/WhatYouCanAchieve.astro`
- Modify: `sites/sebas/src/components/sections/ForWhom.astro`
- Modify: `sites/sebas/src/components/sections/WhatMakesDifferent.astro`
- Modify: `sites/sebas/src/components/sections/ChooseProfile.astro`

**Step 1: Update Hero.astro**

Replace entire frontmatter and use `c` (copy) alias for translations:

```astro
---
import { t } from '../../i18n/index';
import type { SiteLocale } from '../../i18n/index';
import bitunixLogo from '../../assets/bitunix-logo.svg';
import bingxLogo from '../../assets/bingx-logo.svg';

interface Props { locale?: SiteLocale; }
const { locale = 'en' } = Astro.props;
const c = t(locale).hero;

const partners = [
  { name: 'Bitunix', src: bitunixLogo.src, alt: 'Bitunix with Sebas.co' },
  { name: 'BingX', src: bingxLogo.src, alt: 'BingX' },
];
---
```

Then replace hardcoded strings in the template:
- `We Connect Influence, Capital and Technology` → `{c.title}`
- The long subtitle paragraph → `{c.subtitle}`
- `Apply Now` (button) → `{c.cta}`
- `Backed by the best` → `{c.partners_label}`

**Step 2: Update WhatYouCanAchieve.astro**

Replace frontmatter:

```astro
---
import { t } from '../../i18n/index';
import type { SiteLocale } from '../../i18n/index';

interface Props { locale?: SiteLocale; }
const { locale = 'en' } = Astro.props;
const c = t(locale).achieve;
const features = c.features;
---
```

Replace hardcoded strings:
- eyebrow text → `{c.eyebrow}`
- `What you can` → `{c.title1}`
- `achieve with` → `{c.title2}`
- quote text → `{c.quote}`
- `feature.title` and `feature.description` already come from the array (no change needed in template).

**Step 3: Update ForWhom.astro**

Replace frontmatter:

```astro
---
import { t } from '../../i18n/index';
import type { SiteLocale } from '../../i18n/index';

interface Props { locale?: SiteLocale; }
const { locale = 'en' } = Astro.props;
const c = t(locale).forwhom;
const profiles = c.profiles;
---
```

Replace hardcoded strings:
- eyebrow → `{c.eyebrow}`
- `Who is` → `{c.title}`
- quote → `{c.quote}`

**Step 4: Update WhatMakesDifferent.astro**

Replace frontmatter:

```astro
---
import { t } from '../../i18n/index';
import type { SiteLocale } from '../../i18n/index';

interface Props { locale?: SiteLocale; }
const { locale = 'en' } = Astro.props;
const c = t(locale).different;
const differentiators = c.items.map((item: typeof c.items[number], i: number) => ({
  ...item,
  image: [
    'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=800&q=80',
    'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80',
    'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=800&q=80',
    'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=800&q=80',
  ][i],
  imageAlt: item.title,
  reverse: i % 2 !== 0,
}));
---
```

Replace strings:
- eyebrow → `{c.eyebrow}`
- volume text → `{c.volume}` / `{c.volume_range}` / `{c.volume_period}`
- title → `{c.title}` `{c.title_italic}` `{c.title_suffix}`

**Step 5: Update ChooseProfile.astro**

Replace frontmatter:

```astro
---
import { t } from '../../i18n/index';
import type { SiteLocale } from '../../i18n/index';
import sebastianPhoto from '../../assets/sebastian-cuadros.jpg';

interface Props { locale?: SiteLocale; }
const { locale = 'en' } = Astro.props;
const c = t(locale).choose;

const profiles = [
  { icon: 'key', iconColor: 'text-yellow-500', ...c.profiles[0], link: 'https://cal.com/sebasco/kol' },
  { icon: 'candlestick_chart', iconColor: 'text-gray-300', ...c.profiles[1], link: 'https://cal.com/sebasco/professional-trader' },
  { icon: 'account_balance_wallet', iconColor: 'text-blue-400', ...c.profiles[2], link: 'https://cal.com/sebasco/funds-sebas.co' },
  { icon: 'settings_suggest', iconColor: 'text-purple-400', ...c.profiles[3], link: 'https://cal.com/sebasco/communities-sebas.co' },
];
---
```

Replace strings:
- eyebrow → `{c.eyebrow}`
- title → `{c.title}`
- `Apply Now` → `{c.apply_cta}`
- quote → `{c.quote}`
- `Founder` → `{c.founder_title}`

**Step 6: Verify build passes**

```bash
cd sites/sebas && npm run build 2>&1 | tail -20
```
Expected: exits 0, no TS errors.

**Step 7: Commit**

```bash
git add sites/sebas/src/components/sections/
git commit -m "feat(i18n): add locale prop to all homepage sections"
```

---

## Task 4: Update Navbar and Layout with locale awareness

**Files:**
- Modify: `sites/sebas/src/components/shared/Navbar.astro`
- Modify: `sites/sebas/src/layouts/Layout.astro`

**Step 1: Update Navbar.astro**

Replace entire file:

```astro
---
import { t, getLocalizedPath, getPathWithoutLocale, getLocales } from '../../i18n/index';
import type { SiteLocale } from '../../i18n/index';
import LanguageToggle from './LanguageToggle.astro';

interface Props { locale?: SiteLocale; }
const { locale = 'en' } = Astro.props;
const c = t(locale).nav;

const navLinks = [
  { label: c.kol, href: getLocalizedPath('/kol', locale) },
  { label: c.trader, href: getLocalizedPath('/trader', locale) },
  { label: c.fund, href: getLocalizedPath('/fund', locale) },
  { label: c.platform, href: getLocalizedPath('/platform', locale) },
  { label: c.services, href: '#servicios' },
  { label: c.faqs, href: '#faqs' },
];

const currentPath = Astro.url.pathname;
const pathWithoutLocale = getPathWithoutLocale(currentPath);
const alternates = getLocales()
  .filter(l => l !== locale)
  .map(l => ({
    code: l,
    label: l.toUpperCase(),
    href: getLocalizedPath(pathWithoutLocale, l),
  }));
---

<nav class="fixed w-full z-50 top-0 left-0 bg-black/80 backdrop-blur-md border-b border-white/10 font-sans">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div class="flex justify-between items-center h-20">

      <!-- Logo -->
      <a href={getLocalizedPath('/', locale)} class="flex-shrink-0">
        <span class="font-display italic text-3xl text-white font-bold tracking-tighter">Sebas</span>
      </a>

      <!-- Desktop nav -->
      <div class="hidden md:flex space-x-8 items-center">
        {navLinks.map(link => (
          <a href={link.href} class="text-sm font-medium text-gray-300 hover:text-primary transition-colors">
            {link.label}
          </a>
        ))}
        <LanguageToggle currentLocale={locale} currentPath={currentPath} alternates={alternates} />
        <a href="https://cal.com/sebasco/15min" target="_blank" rel="noopener noreferrer"
          class="bg-primary text-black px-5 py-2 rounded-full text-xs font-bold uppercase tracking-wider hover:bg-white transition-all transform hover:scale-105 shadow-glow">
          {c.cta}
        </a>
      </div>

      <!-- Mobile hamburger -->
      <button id="menu-toggle" class="md:hidden text-white hover:text-primary" aria-label="Open menu">
        <span class="material-icons-outlined text-2xl">menu</span>
      </button>
    </div>
  </div>

  <!-- Mobile menu -->
  <div id="mobile-menu" class="hidden md:hidden bg-black border-t border-white/10 px-4 pb-6 pt-4">
    <div class="flex flex-col space-y-4">
      {navLinks.map(link => (
        <a href={link.href} class="text-sm font-medium text-gray-300 hover:text-primary transition-colors">
          {link.label}
        </a>
      ))}
      <LanguageToggle currentLocale={locale} currentPath={currentPath} alternates={alternates} sticky />
      <a href="https://cal.com/sebasco/15min" target="_blank" rel="noopener noreferrer"
        class="bg-primary text-black px-5 py-3 rounded-full text-xs font-bold uppercase tracking-wider text-center">
        {c.cta}
      </a>
    </div>
  </div>
</nav>

<script>
  const toggle = document.getElementById('menu-toggle');
  const menu = document.getElementById('mobile-menu');
  toggle?.addEventListener('click', () => { menu?.classList.toggle('hidden'); });
</script>
```

**Step 2: Update Layout.astro**

Add `locale` prop and pass to Navbar. Change `<html lang="en">` to dynamic:

In the Props interface add:
```typescript
locale?: string;
```

In destructuring add:
```typescript
const { ..., locale = 'en' } = Astro.props;
```

Change:
```html
<html lang="en">
```
To:
```html
<html lang={locale}>
```

Change:
```astro
<Navbar />
```
To:
```astro
<Navbar locale={locale as any} />
```

**Step 3: Build check**

```bash
cd sites/sebas && npm run build 2>&1 | tail -20
```
Expected: exits 0.

**Step 4: Commit**

```bash
git add sites/sebas/src/components/shared/Navbar.astro sites/sebas/src/layouts/Layout.astro
git commit -m "feat(i18n): locale-aware Navbar with LanguageToggle + dynamic html lang"
```

---

## Task 5: Update index.astro and create /es/ homepage

**Files:**
- Modify: `sites/sebas/src/pages/index.astro`
- Create: `sites/sebas/src/pages/es/index.astro`

**Step 1: Update index.astro**

```astro
---
import Layout from '../layouts/Layout.astro';
import Hero from '../components/sections/Hero.astro';
import WhatYouCanAchieve from '../components/sections/WhatYouCanAchieve.astro';
import ForWhom from '../components/sections/ForWhom.astro';
import WhatMakesDifferent from '../components/sections/WhatMakesDifferent.astro';
import ChooseProfile from '../components/sections/ChooseProfile.astro';
import { t } from '../i18n/index';

const locale = 'en';
const meta = t(locale).meta;
---

<Layout
  title={meta.home_title}
  description={meta.home_description}
  locale={locale}
>
  <main>
    <Hero locale={locale} />
    <WhatYouCanAchieve locale={locale} />
    <ForWhom locale={locale} />
    <WhatMakesDifferent locale={locale} />
    <ChooseProfile locale={locale} />
  </main>
</Layout>
```

**Step 2: Create es/index.astro**

Create `sites/sebas/src/pages/es/index.astro`:

```astro
---
import Layout from '../../layouts/Layout.astro';
import Hero from '../../components/sections/Hero.astro';
import WhatYouCanAchieve from '../../components/sections/WhatYouCanAchieve.astro';
import ForWhom from '../../components/sections/ForWhom.astro';
import WhatMakesDifferent from '../../components/sections/WhatMakesDifferent.astro';
import ChooseProfile from '../../components/sections/ChooseProfile.astro';
import { t } from '../../i18n/index';

const locale = 'es';
const meta = t(locale).meta;
---

<Layout
  title={meta.home_title}
  description={meta.home_description}
  locale={locale}
>
  <main>
    <Hero locale={locale} />
    <WhatYouCanAchieve locale={locale} />
    <ForWhom locale={locale} />
    <WhatMakesDifferent locale={locale} />
    <ChooseProfile locale={locale} />
  </main>
</Layout>
```

**Step 3: Build check**

```bash
cd sites/sebas && npm run build 2>&1 | tail -30
```
Expected: exits 0. Routes `/` and `/es/` both generated.

**Step 4: Commit**

```bash
git add sites/sebas/src/pages/index.astro sites/sebas/src/pages/es/
git commit -m "feat(i18n): EN homepage passes locale, ES homepage created at /es/"
```

---

## Task 6: Create Spanish KOL page (/es/kol)

**Files:**
- Create: `sites/sebas/src/pages/es/kol.astro`

**Step 1: Create es/kol.astro**

This page takes the full content of `kol.astro` and replaces all English text with Spanish. Create `sites/sebas/src/pages/es/kol.astro` — copy the entire `kol.astro` file and:

- Change `import LayoutKol from '../layouts/LayoutKol.astro'` → `import LayoutKol from '../../layouts/LayoutKol.astro'`
- Add `locale="es"` to `<LayoutKol>` (Layout will pass it to Navbar)
- Replace all English text with Spanish translations:

Key string replacements (replace every occurrence):

| English | Spanish |
|---------|---------|
| `title="KOL & Influencer Strategy"` | `title="Estrategia KOL e Influencer"` |
| `description="High-impact KOL system..."` | `description="Sistema KOL de alto impacto. De $100K a $1M anual. Monetiza tu audiencia sin perder el alma con Sebas.co."` |
| `High-Impact KOL System` | `Sistema KOL de Alto Impacto` |
| `YOU'RE SITTING ON` | `ESTÁS SENTADO SOBRE` |
| `A GOLDMINE` | `UNA MINA DE ORO` |
| `From $100K to $1M annually...` | `De $100K a $1M anual. Monetiza tu audiencia sin perder el alma con el sistema definitivo de arquitectura de imperio digital.` |
| `I want a free evaluation` | `Quiero una evaluación gratuita` |
| `View success stories` | `Ver casos de éxito` |
| `Audited` | `Auditado` |
| `Validated` | `Validado` |
| `Scalable` | `Escalable` |
| `Initial diagnosis` | `Diagnóstico inicial` |
| Any other section headings/body text | Translate to Spanish |

Note: Keep all `href` links, icon names, Tailwind classes, and structural HTML unchanged. Only translate visible text strings.

**Step 2: Update LayoutKol.astro to accept locale prop**

In `sites/sebas/src/layouts/LayoutKol.astro`, find the Props interface and add `locale?: string`. Pass it to Navbar: `<Navbar locale={locale as any} />` and to `<html lang={locale ?? 'en'}>`.

**Step 3: Build check**

```bash
cd sites/sebas && npm run build 2>&1 | grep -E "error|Error|/es/kol" | head -20
```
Expected: `/es/kol` route generated, no errors.

**Step 4: Commit**

```bash
git add sites/sebas/src/pages/es/kol.astro sites/sebas/src/layouts/LayoutKol.astro
git commit -m "feat(i18n): add /es/kol page + locale support in LayoutKol"
```

---

## Task 7: Create Spanish Trader page (/es/trader)

**Files:**
- Create: `sites/sebas/src/pages/es/trader.astro`

**Step 1: Create es/trader.astro**

Copy `trader.astro` to `sites/sebas/src/pages/es/trader.astro` and:
- Fix layout import path: `../../layouts/LayoutTrader.astro`
- Add `locale="es"` to `<LayoutTrader>`
- Translate all visible text strings:

| English | Spanish |
|---------|---------|
| `title="Professional Trader Scaling"` | `title="Escalado para Traders Profesionales"` |
| `description="Infrastructure for independent professionals..."` | `description="Infraestructura para profesionales independientes. Escala de $10K/mes a $100K+ sin operar más. Acceso institucional con Sebas.co."` |
| `Institutional Access Only` | `Acceso Institucional Exclusivo` |
| `Making $10K/mo trading?` | `¿Generando $10K/mes trading?` |
| `Generate $100K without opening another position.` | `Genera $100K sin abrir otra posición.` |
| `Infrastructure for independent professionals...` | `Infraestructura para profesionales independientes. Deja de cambiar tiempo por dinero. Convierte tu edge en una clase de activo.` |
| `Apply for Scaling Program` | `Aplicar al Programa de Escalado` |
| `View Performance Data` | `Ver Datos de Rendimiento` |
| `Scaling Projection` | `Proyección de Escalado` |
| `vs Manual` | `vs Manual` |
| `Capital Deployment` | `Despliegue de Capital` |
| `Avg. Desk Revenue` | `Ingreso Promedio de Mesa` |
| `Scaling Factor` | `Factor de Escalado` |
| `Trader Retention` | `Retención de Traders` |
| `The Hamster Wheel:` | `La Rueda del Hámster:` |
| `Why Manual Trading Doesn't Scale` | `Por Qué el Trading Manual No Escala` |
| (body paragraph) `More capital means more stress...` | `Más capital significa más estrés, slippage y presión psicológica. Nuestro ecosistema desacopla tus ingresos del tiempo que pasas mirando gráficos.` |
| `Time Insolvency` | `Insolvencia de Tiempo` |
| `You can only watch so many charts...` | `Solo puedes mirar tantos gráficos. Tus ingresos están limitados por tu capacidad física.` |
| `Status` | `Estado` |
| `Unscalable` | `No Escalable` |
| `Psychological Cap` | `Techo Psicológico` |
| `Managing $10M feels biologically different...` | `Gestionar $10M se siente biológicamente diferente a $100K. El cortisol escala linealmente con el tamaño de la posición.` |
| `Risk` | `Riesgo` |
| `High Burnout` | `Alto Riesgo de Agotamiento` |
| `Execution Drag` | `Arrastre de Ejecución` |
| `Slippage and liquidity issues eat alpha...` | `El slippage y los problemas de liquidez consumen el alpha al escalar. La ejecución manual falla a tamaño institucional.` |
| `Efficiency` | `Eficiencia` |
| `Declining` | `En Declive` |
| `Who We Fund` | `A Quiénes Financiamos` |
| `Select Your Archetype` | `Selecciona Tu Arquetipo` |
| `Active` | `Activo` |
| `Funded` | `Financiado` |
| `The Scalper` | `El Scalper` |
| `Execution speed is your alpha...` | `La velocidad de ejecución es tu alpha. Necesitas infraestructura, no solo capital.` |
| `Zero-latency institutional routing` | `Routing institucional de latencia cero` |
| `Exchange-level rebate structures` | `Estructuras de rebate a nivel de exchange` |
| `Tick-level data access` | `Acceso a datos a nivel de tick` |
| `Deploy Scalper Infra` | `Desplegar Infra de Scalper` |
| `The Swing Trader` | `El Swing Trader` |
| `You catch the big moves...` | `Capturas los grandes movimientos. Necesitas liquidez profunda para entrar y salir sin slippage.` |
| `Dark pool liquidity access` | `Acceso a liquidez de dark pool` |
| `Multi-day holding without swap fees` | `Holdings multi-día sin comisiones de swap` |
| `Analyst team support` | `Soporte de equipo analista` |
| `Access Deep Liquidity` | `Acceder a Liquidez Profunda` |
| `The Quant` | `El Quant` |
| `Your edge is mathematical...` | `Tu ventaja es matemática. Necesitas co-ubicación y límites robustos de API.` |
| `Direct API access (FIX/REST/WS)` | `Acceso directo API (FIX/REST/WS)` |
| `Dedicated server co-location` | `Co-ubicación de servidor dedicado` |
| `Backtesting environment sandbox` | `Sandbox de entorno de backtesting` |
| `Connect API` | `Conectar API` |
| `Ecosystem Multiplication` | `Multiplicación del Ecosistema` |
| `We don't just fund you...` | `No solo te financiamos. Productizamos tus datos de trading. Mientras te concentras en PnL, nuestro backend distribuye tu señal a inversores retail, instituciones e individuos de alto patrimonio.` |
| `You Trade` | `Tú Operas` |
| `Continue doing exactly what you do now. No extra work.` | `Continúa haciendo exactamente lo que haces ahora. Sin trabajo extra.` |
| `We Replicate` | `Nosotros Replicamos` |
| `Our engines copy your trades across our investor pool.` | `Nuestros motores copian tus operaciones en nuestro pool de inversores.` |
| `You Earn Multiples` | `Tú Ganas Múltiplos` |
| `Performance fees from every follower, aggregated monthly.` | `Comisiones de performance de cada seguidor, agregadas mensualmente.` |
| `Copy Trading` | `Copy Trading` |
| `Passive income from 500+ copiers following your verified strategy.` | `Ingresos pasivos de 500+ copiadores siguiendo tu estrategia verificada.` |
| `Signal Service` | `Servicio de Señales` |
| `Automated alerts sent to subscribers via Telegram/Discord integration.` | `Alertas automáticas enviadas a suscriptores via integración Telegram/Discord.` |
| `Asset Management` | `Gestión de Activos` |
| `Allocations for proven track records > 6 months.` | `Asignaciones para track records probados > 6 meses.` |
| `High Frequency` | `Alta Frecuencia` |
| `Macro / Swing` | `Macro / Swing` |
| `Quantitative` | `Cuantitativo` |

**Step 2: Update LayoutTrader.astro**

In `sites/sebas/src/layouts/LayoutTrader.astro`, add `locale?: string` prop, pass to `<Navbar locale={locale as any} />` and `<html lang={locale ?? 'en'}>`.

**Step 3: Build check**

```bash
cd sites/sebas && npm run build 2>&1 | grep -E "error|/es/trader" | head -10
```

**Step 4: Commit**

```bash
git add sites/sebas/src/pages/es/trader.astro sites/sebas/src/layouts/LayoutTrader.astro
git commit -m "feat(i18n): add /es/trader page + locale support in LayoutTrader"
```

---

## Task 8: Create Spanish Fund page (/es/fund)

**Files:**
- Create: `sites/sebas/src/pages/es/fund.astro`

**Step 1: Create es/fund.astro**

Copy `fund.astro`, fix layout import to `../../layouts/LayoutFund.astro`, add `locale="es"` to `<LayoutFund>`, and translate:

| English | Spanish |
|---------|---------|
| `title="Sebas.co Institutional"` | `title="Sebas.co Institucional"` |
| `description="Institutional-grade infrastructure..."` | `description="Infraestructura de nivel institucional para la próxima generación de activos. Sin fricciones, regulado, construido para asignadores y fondos."` |
| `New: Q3 Institutional Report Available` | `Nuevo: Informe Institucional Q3 Disponible` |
| `Your LPs are asking about crypto.` | `Tus LPs están preguntando por crypto.` |
| `We are the answer.` | `Nosotros somos la respuesta.` |
| `Institutional-grade infrastructure for the next generation of assets. Frictionless. Regulated. Built for scale.` | `Infraestructura de nivel institucional para la próxima generación de activos. Sin fricciones. Regulado. Construido para escalar.` |
| `Schedule Onboarding` | `Agendar Onboarding` |
| `View Performance` | `Ver Rendimiento` |
| `Assets Custodied` | `Activos Custodiados` |
| `Downtime` | `Tiempo de Inactividad` |
| `Type II Certified` | `Certificado Tipo II` |
| `The Institutional Mandate` | `El Mandato Institucional` |
| Any remaining section text | Translate to Spanish |

**Step 2: Update LayoutFund.astro**

Add `locale?: string` prop, pass to Navbar, update `<html lang>`.

**Step 3: Build check + commit**

```bash
cd sites/sebas && npm run build 2>&1 | grep -E "error|/es/fund" | head -10
git add sites/sebas/src/pages/es/fund.astro sites/sebas/src/layouts/LayoutFund.astro
git commit -m "feat(i18n): add /es/fund page + locale support in LayoutFund"
```

---

## Task 9: Create Spanish Platform page (/es/platform)

**Files:**
- Create: `sites/sebas/src/pages/es/platform.astro`

**Step 1: Create es/platform.astro**

Copy `platform.astro`, fix layout import to `../../layouts/LayoutPlatform.astro`, add `locale="es"` to `<LayoutPlatform>`, and translate:

| English | Spanish |
|---------|---------|
| `title="Platform Monetization Engine"` | `title="Motor de Monetización de Plataformas"` |
| `description="Turn dormant traffic into tangible assets..."` | `description="Convierte el tráfico dormido en activos tangibles. Motor avanzado de monetización para plataformas y comunidades de alto volumen."` |
| `Revenue Leak Detected` | `Fuga de Ingresos Detectada` |
| `You have 10,000 users but you're generating $2,000.` | `Tienes 10,000 usuarios pero estás generando $2,000.` |
| `Something's wrong.` | `Algo está mal.` |
| `Stop the bleed. Turn dormant traffic into tangible assets with our advanced monetization engine designed for high-volume platforms.` | `Detén la hemorragia. Convierte el tráfico dormido en activos tangibles con nuestro motor avanzado de monetización diseñado para plataformas de alto volumen.` |
| `Run Diagnostic` | `Ejecutar Diagnóstico` |
| `View Demo` | `Ver Demo` |
| `CURRENT RUN RATE` | `TASA ACTUAL` |
| `vs Potential` | `vs Potencial` |
| Any remaining section text | Translate to Spanish |

**Step 2: Update LayoutPlatform.astro**

Add `locale?: string` prop, pass to Navbar, update `<html lang>`.

**Step 3: Build check + commit**

```bash
cd sites/sebas && npm run build 2>&1 | grep -E "error|/es/platform" | head -10
git add sites/sebas/src/pages/es/platform.astro sites/sebas/src/layouts/LayoutPlatform.astro
git commit -m "feat(i18n): add /es/platform page + locale support in LayoutPlatform"
```

---

## Task 10: Final verification

**Step 1: Full build**

```bash
cd sites/sebas && npm run build 2>&1
```
Expected: exits 0, routes listed include `/`, `/es/`, `/kol`, `/es/kol`, `/trader`, `/es/trader`, `/fund`, `/es/fund`, `/platform`, `/es/platform`.

**Step 2: Dev preview check**

```bash
cd sites/sebas && npm run dev &
sleep 5
curl -s http://localhost:4321/ | grep -o "We Connect Influence"
curl -s http://localhost:4321/es/ | grep -o "Conectamos Influencia"
curl -s http://localhost:4321/kol | grep -o "GOLDMINE"
curl -s http://localhost:4321/es/kol | grep -o "MINA DE ORO"
```
Expected: each grep finds its string.

**Step 3: Kill dev server + final commit**

```bash
kill %1
git add -A
git commit -m "feat(i18n): complete EN/ES bilingual site — all 5 pages translated"
```

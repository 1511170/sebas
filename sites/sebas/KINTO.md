# 🚀 sebas - Project Guide

> **Client:** Sebas  
> **Industry:** Your industry here  
> **Site:** sebas.com  
> **CMS:** seb.kinto.info (hidden)  

---

## ⚡ Quick Commands

```bash
# You are in: kinto-cms/sites/sebas/

# View installed skills
cat skills-active.json

# Install available skills
node scripts/skill-add.js cms-sveltia
node scripts/skill-add.js {SKILL_NAME}

# Create a specific skill
node scripts/skill-create.js {NEW_SKILL}

# Dev server
npm install
npm run dev

# Build
npm run build
```

---

## 🎯 Client Brief

**Sebas** is a Your industry here company that needs:

### Required Pages
- [ ] **Home** - Hero, services/products, CTA
- [ ] **Services/Products** - Offer details
- [ ] **About** - History, team, values
- [ ] **Blog** - Articles/News (CMS-editable)
- [ ] **Contact** - Form + info

### Features
- [ ] CMS for code-free editing
- [ ] SEO optimized
- [ ] {FEATURES_CUSTOM}

### Visual Identity
- **Colors:** {PRIMARY_COLOR}, {SECONDARY_COLOR}
- **Style:** {STYLE_DESCRIPTION}
- **Images:** {IMAGE_GUIDELINES}

---

## 📁 Site Structure

```
sites/sebas/
├── src/
│   ├── pages/           # Routes
│   ├── layouts/        # Layouts
│   └── components/     # Local components
├── public/             # Assets
├── config/
│   ├── site.config.ts  # Site config
│   └── cms.config.yml   # CMS config
├── scripts/            # Utilities
└── skills-active.json  # Installed skills
```

---

## 🔧 Configuration

### Site Config
```typescript
{
  site: {
    domain: 'sebas.com',
    name: 'sebas',
    description: 'sebas website',
    language: 'en'
  },
  cms: {
    enabled: true,
    subdomain: 'seb.kinto.info',
    hidden: true
  }
}
```

---

## 🧩 Recommended Skills

| Skill | Purpose | Status |
|-------|---------|--------|
| `cms-sveltia` | Admin panel | ⬜ Pending |
| `testimonials` | Testimonials | ⬜ Pending |
| `{CUSTOM_SKILL}` | {PURPOSE} | ⬜ Create |

**Install:**
```bash
node scripts/skill-add.js cms-sveltia
```

---

## ✅ Delivery Checklist

- [ ] Main pages complete
- [ ] CMS installed and configured
- [ ] SEO (schema.org, meta tags)
- [ ] Optimized images
- [ ] Successful build
- [ ] Deploy on Cloudflare

---

## 🆘 References

- [Main Guide](../../KINTO.md)
- [AI Generation Guide](../../docs/AI_GENERATION.md)
- [Architecture](../../STRUCTURE.md)

---

**Status:** 🚧 In development

**Next step:** Configure site.config.ts and install required skills.

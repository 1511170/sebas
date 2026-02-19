# 🚀 KINTO CMS - Quick Start Guide for AI

> **TL;DR**: Static site system with **on-demand skills architecture**. Minimal core (Astro + Tailwind) + skills installed only when needed.

---

## ⚡ Essential Commands (Start Here)

```bash
# 1. Enter the client site
cd sites/serviworldlogistics

# 2. List available skills
node scripts/skill-list.js

# 3. Install required skills
node scripts/skill-add.js cms-sveltia
node scripts/skill-add.js testimonials

# 4. Create a new skill (if the one you need doesn't exist)
node scripts/skill-create.js my-new-skill

# 5. Install dependencies and run
npm install
npm run dev
```

---

## 🧠 Key Principles

### 1. **ZERO Skills by Default**
Each site starts clean (Astro + Tailwind only). Don't install anything that isn't explicitly requested.

### 2. **Skills = Reusable Plugins**
- Location: `kinto-cms/skills/{official,community}/`
- Once a skill is created → available for ALL sites
- If you need new functionality, create a skill, not ad-hoc code

### 3. **Hidden CMS**
- Public site: `serviworldlogistics.com`
- Private CMS: `swl.kinto.info/admin` (no public links)
- Client edits content without touching code

---

## 📁 Work Structure

```
kinto-cms/
├── skills/
│   ├── official/          # Official skills (CMS, SEO, etc)
│   │   └── cms-sveltia/
│   └── community/         # AI-created skills
│       └── testimonials/
├── sites/
│   └── serviworldlogistics/    # ← You work here
│       ├── src/pages/          # Astro pages
│       ├── config/             # site.config.ts
│       └── skills-active.json  # Installed skills
└── core/                  # Do not touch - base engine
```

---

## 🎯 Generation Workflow

### Step 1: Analyze the Brief
Example: *"I need a homepage with hero, services, testimonials and a contact form"*

### Step 2: Review Existing Skills
```bash
node scripts/skill-list.js
```

**Currently available skills:**
- ✅ `cms-sveltia` - Admin panel for the client
- ✅ `testimonials` - Testimonials with schema.org

### Step 3: Install Required Skills
```bash
node scripts/skill-add.js cms-sveltia
node scripts/skill-add.js testimonials
```

### Step 4: Generate Content
Edit `src/pages/index.astro` and create the needed pages using the installed skills.

### Step 5: If a Skill Is Missing, Create It
```bash
# Example: We need a contact form
node scripts/skill-create.js contact-form

# This creates: skills/community/contact-form/
# Then you implement the skill and use it
```

---

## 🛠️ Creating a New Skill

When the client needs something that doesn't exist:

```bash
node scripts/skill-create.js skill-name
```

This creates:
```
skills/community/skill-name/
├── SKILL.md              # Documentation
├── index.ts              # Entry point
├── components/           # Astro components
└── config/               # Configuration
```

**Rules for creating skills:**
1. The skill must be **reusable** on other sites
2. Document in `SKILL.md` how to use it
3. Export components in `index.ts`
4. Use `schema.org` when applicable (SEO)

---

## 📋 Pre-delivery Checklist

- [ ] All required skills installed in `skills-active.json`
- [ ] CMS configured in `config/site.config.ts`
- [ ] Schema.org in relevant places (SEO)
- [ ] Optimized images in `public/`
- [ ] Successful build: `npm run build`
- [ ] Preview works: `npm run preview`

---

## 🔗 Quick References

| Resource | Location |
|----------|----------|
| Site config | `sites/serviworldlogistics/config/site.config.ts` |
| Active skills | `sites/serviworldlogistics/skills-active.json` |
| Available skills | `kinto-cms/skills/` |
| Full AI guide | `kinto-cms/docs/AI_GENERATION.md` |
| Architecture | `kinto-cms/STRUCTURE.md` |

---

## 💡 Common Patterns

### Importing a skill in a page:
```astro
---
import { TestimonialsGrid } from '../../../skills/community/testimonials/index.ts';
---

<TestimonialsGrid category="logistics" max={6} />
```

### Checking if a skill is active:
```typescript
import activeSkills from '../skills-active.json';

const hasTestimonials = activeSkills.skills.includes('testimonials');
```

---

## 🆘 Stuck?

1. **List skills**: `node scripts/skill-list.js`
2. **View site config**: `cat config/site.config.ts`
3. **View active skills**: `cat skills-active.json`
4. **Read docs**: `cat docs/AI_GENERATION.md`

---

**Start here:**
```bash
cd sites/serviworldlogistics && node scripts/skill-list.js
```

---

## 📦 Static repo (sebas-static)

The static build of the site is published to a separate repo for deploy (Cloudflare Pages, Vercel, etc.):

- **Repo:** [github.com/1511170/sebas-static](https://github.com/1511170/sebas-static)
- **Regenerate and copy build to sebas-static:** from repo root:
```bash
node scripts/sync-sebas-static.js
```
Then in `sebas-static`: `git add -A`, `git commit -m "Update static export"`, `git push origin main`

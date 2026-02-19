# 🤖 AGENTS.md - Quick Start for Any AI

> **For:** Kimi Code, Claude Code, Cursor, or any AI agent

## 🎯 You Enter Here and Read THIS First

### Immediate Context
- **System**: KINTO CMS - Static site generator with skills architecture
- **Stack**: Astro 5 + Tailwind 4 + Sveltia CMS
- **Active site**: `sites/serviworldlogistics/` (logistics company)
- **Status**: Clean core, no skills installed yet

### Your Mission (If You Choose to Accept It)
Generate the full website for Serviworld Logistics:
1. Install required skills
2. Create pages: Home, Services, About, Blog, Contact
3. Configure CMS so the client can edit content

---

## ⚡ Get Started (Step-by-Step Flow)

### Step 1: Read the Client Brief
```bash
cat sites/serviworldlogistics/KINTO.md
```

### Step 2: List Available Skills
```bash
cd sites/serviworldlogistics
node scripts/skill-list.js
```

### Step 3: Install Required Skills
```bash
node scripts/skill-add.js cms-sveltia
node scripts/skill-add.js testimonials
```

### Step 4: Generate Content
- Edit `src/pages/index.astro`
- Create additional pages
- Configure CMS in `config/site.config.ts`

---

## 📁 Important Structure

```
kinto-cms/
├── KINTO.md              # ← Full system guide (read it)
├── sites/
│   └── serviworldlogistics/
│       ├── KINTO.md      # ← Client brief (read it)
│       └── src/pages/    # ← You work here
└── skills/
    ├── official/         # Official skills
    └── community/        # Community skills
```

---

## 🔗 References

- Full system guide: `KINTO.md`
- Project brief: `sites/serviworldlogistics/KINTO.md`
- Architecture: `STRUCTURE.md`

---

**TL;DR**: Go to `sites/serviworldlogistics`, read its `KINTO.md`, install skills, generate the site.

#!/usr/bin/env node
/**
 * KINTO CMS CLI
 * Comando central para gestionar sitios y skills
 */

import { execSync } from 'child_process';
import { existsSync, mkdirSync, readdirSync, copyFileSync, readFileSync, writeFileSync, cpSync } from 'fs';
import { join, resolve } from 'path';

const [, , command, ...args] = process.argv;

const CWD = process.cwd();
const KINTO_ROOT = resolve(CWD);

function showHelp() {
  console.log(`
🚀 KINTO CMS - Content Management System

Comandos:
  kinto init <site-name>           Crear nuevo sitio
  kinto dev --site=<name>          Modo desarrollo
  kinto build --site=<name>        Build estático
  kinto deploy --site=<name>       Deploy a Cloudflare
  
  kinto skills:list                Listar skills disponibles
  kinto skill:add <name>           Instalar skill
  kinto skill:create <name>        Crear nueva skill
  kinto skill:remove <name>        Remover skill
  
  kinto sites:list                 Listar sitios
  kinto sites:clone <from> <to>    Clonar sitio como template

Opciones:
  --site=<name>                    Especificar sitio
  --template=<name>                Usar template
  --category=<official|community>  Categoría para skills

Ejemplos:
  kinto init serviworldlogistics
  kinto dev --site=serviworldlogistics
  kinto skill:add testimonials --site=serviworldlogistics
  kinto skill:create fleet-tracker
`);
}

function initSite(siteName) {
  const sitePath = join(KINTO_ROOT, 'sites', siteName);
  
  if (existsSync(sitePath)) {
    console.error(`❌ El sitio "${siteName}" ya existe`);
    process.exit(1);
  }

  console.log(`🚀 Creando sitio: ${siteName}...`);
  
  // Copiar template base
  const templatePath = join(KINTO_ROOT, 'templates', 'enterprise');
  
  if (existsSync(templatePath)) {
    // Copiar todo el template
    cpSync(templatePath, sitePath, { recursive: true });
    
    // Personalizar KINTO.md con placeholders
    const kintoPath = join(sitePath, 'KINTO.md');
    if (existsSync(kintoPath)) {
      let kintoContent = readFileSync(kintoPath, 'utf8');
      
      // Reemplazar placeholders
      const domain = `${siteName}.com`;
      const cmsSubdomain = siteName.slice(0, 3).toLowerCase() + '.kinto.info';
      
      kintoContent = kintoContent
        .replace(/{SITE_NAME}/g, siteName)
        .replace(/{CLIENT_NAME}/g, siteName.charAt(0).toUpperCase() + siteName.slice(1))
        .replace(/{INDUSTRY}/g, 'Tu industria aquí')
        .replace(/{DOMAIN}/g, domain)
        .replace(/{CMS_SUBDOMAIN}/g, cmsSubdomain)
        .replace(/{DESCRIPTION}/g, `Sitio web de ${siteName}`)
        .replace(/{LANG}/g, 'es');
      
      writeFileSync(kintoPath, kintoContent);
    }
    
    // Personalizar site.config.ts
    const configPath = join(sitePath, 'config', 'site.config.ts');
    if (existsSync(configPath)) {
      let configContent = readFileSync(configPath, 'utf8');
      const domain = `${siteName}.com`;
      const cmsSubdomain = siteName.slice(0, 3).toLowerCase() + '.kinto.info';
      
      configContent = configContent
        .replace(/serviworldlogistics\.com/g, domain)
        .replace(/Serviworld Logistics/g, siteName)
        .replace(/swl\.kinto\.info/g, cmsSubdomain);
      
      writeFileSync(configPath, configContent);
    }
    
    // Personalizar package.json
    const pkgPath = join(sitePath, 'package.json');
    if (existsSync(pkgPath)) {
      const pkg = JSON.parse(readFileSync(pkgPath, 'utf8'));
      pkg.name = siteName.toLowerCase().replace(/[^a-z0-9]/g, '-');
      writeFileSync(pkgPath, JSON.stringify(pkg, null, 2));
    }
    
    console.log(`✅ Sitio "${siteName}" creado desde template`);
  } else {
    // Crear estructura mínima si no hay template
    console.log(`⚠️  Template no encontrado, creando estructura mínima...`);
    mkdirSync(sitePath, { recursive: true });
    mkdirSync(join(sitePath, 'src', 'pages'), { recursive: true });
    mkdirSync(join(sitePath, 'config'), { recursive: true });
    mkdirSync(join(sitePath, 'scripts'), { recursive: true });
    
    // Copiar desde serviworldlogistics como fallback
    const examplePath = join(KINTO_ROOT, 'sites', 'serviworldlogistics');
    if (existsSync(examplePath)) {
      // Copiar archivos clave
      const filesToCopy = [
        'package.json',
        'astro.config.mjs',
        'tailwind.config.mjs',
        'skills-active.json'
      ];
      
      for (const file of filesToCopy) {
        const src = join(examplePath, file);
        const dest = join(sitePath, file);
        if (existsSync(src)) {
          copyFileSync(src, dest);
        }
      }
      
      // Copiar scripts
      const scriptsSrc = join(examplePath, 'scripts');
      const scriptsDest = join(sitePath, 'scripts');
      if (existsSync(scriptsSrc)) {
        cpSync(scriptsSrc, scriptsDest, { recursive: true });
      }
    }
    
    console.log(`✅ Sitio "${siteName}" creado (estructura mínima)`);
  }
  
  console.log(`\n📍 Ubicación: sites/${siteName}/`);
  console.log(`📖 Lee primero: sites/${siteName}/KINTO.md`);
  console.log(`\n👉 Siguientes pasos:`);
  console.log(`   cd sites/${siteName}`);
  console.log(`   cat KINTO.md       # Lee la guía del proyecto`);
  console.log(`   npm install`);
  console.log(`   npm run dev`);
}

function listSkills() {
  const skillsRoot = join(KINTO_ROOT, 'skills');
  
  console.log('🧩 Skills disponibles:\n');
  
  for (const category of ['official', 'community']) {
    const catPath = join(skillsRoot, category);
    if (!existsSync(catPath)) continue;
    
    const skills = readdirSync(catPath, { withFileTypes: true })
      .filter(d => d.isDirectory())
      .map(d => `  • ${d.name}`);
    
    if (skills.length) {
      console.log(`${category.toUpperCase()}:`);
      skills.forEach(s => console.log(s));
      console.log('');
    }
  }
}

function devMode(siteName) {
  const sitePath = join(KINTO_ROOT, 'sites', siteName);
  
  if (!existsSync(sitePath)) {
    console.error(`❌ Sitio "${siteName}" no encontrado`);
    process.exit(1);
  }
  
  console.log(`🚀 Iniciando desarrollo para: ${siteName}`);
  execSync('npm run dev', { 
    cwd: sitePath, 
    stdio: 'inherit' 
  });
}

function buildSite(siteName) {
  const sitePath = join(KINTO_ROOT, 'sites', siteName);
  
  if (!existsSync(sitePath)) {
    console.error(`❌ Sitio "${siteName}" no encontrado`);
    process.exit(1);
  }
  
  console.log(`🔨 Building: ${siteName}...`);
  execSync('npm run build', { 
    cwd: sitePath, 
    stdio: 'inherit' 
  });
  console.log(`✅ Build completado: sites/${siteName}/dist/`);
}

// Main switch
switch (command) {
  case 'init':
    initSite(args[0]);
    break;
  case 'skills:list':
    listSkills();
    break;
  case 'dev':
    const devSite = args.find(a => a.startsWith('--site='))?.split('=')[1];
    if (!devSite) {
      console.error('❌ Especifica --site=<nombre>');
      process.exit(1);
    }
    devMode(devSite);
    break;
  case 'build':
    const buildSiteName = args.find(a => a.startsWith('--site='))?.split('=')[1];
    if (!buildSiteName) {
      console.error('❌ Especifica --site=<nombre>');
      process.exit(1);
    }
    buildSite(buildSiteName);
    break;
  case 'help':
  case '--help':
  case '-h':
  default:
    showHelp();
    break;
}

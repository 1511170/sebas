/**
 * Configuración del sitio: Sebas.co
 *
 * Domains:
 * - Public: sebas.co
 * - CMS (oculto): cms.sebas.co
 */

export interface SiteConfig {
  site: {
    domain: string;
    name: string;
    description: string;
    language: string;
    logo?: string;
    favicon?: string;
  };
  cms: {
    enabled: boolean;
    subdomain: string;
    hidden: boolean;
    githubRepo: string;
    authEndpoint?: string;
  };
  contact: {
    email: string;
    phone: string;
  };
  build: {
    output: 'static';
    compressHTML: boolean;
    inlineStylesheets: 'auto' | 'always' | 'never';
  };
  skills: {};
}

export default {
  site: {
    domain: 'sebas.co',
    name: 'Sebas.co',
    description: 'Conectamos Influencia, Capital y Tecnología. Partners estratégicos de BingX y Bitunix para KOLs, traders profesionales, fondos de inversión y plataformas cripto.',
    language: 'es',
    logo: '/logo.svg',
    favicon: '/favicon.ico'
  },
  cms: {
    enabled: false,
    subdomain: 'cms.sebas.co',
    hidden: true,
    githubRepo: '1511170/sebas',
    authEndpoint: ''
  },
  contact: {
    email: 'hello@sebas.co',
    phone: '+1 (242) 589-1376',
  },
  build: {
    output: 'static',
    compressHTML: true,
    inlineStylesheets: 'auto'
  },
  skills: {}
} satisfies SiteConfig;

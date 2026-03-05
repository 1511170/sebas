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

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

export const DEFAULT_LANGUAGE = "en";
export const LANGUAGES = ["en", "sq", "mk", "de"] as const;

export type LanguageCode = (typeof LANGUAGES)[number];

const languageSet = new Set<string>(LANGUAGES);

function normalizePath(pathname: string) {
  if (!pathname.startsWith("/")) {
    return `/${pathname}`;
  }

  return pathname;
}

export function isLanguageCode(value?: string | null): value is LanguageCode {
  return value ? languageSet.has(value) : false;
}

export function resolveLanguage(value?: string | null): LanguageCode {
  return isLanguageCode(value) ? value : DEFAULT_LANGUAGE;
}

export function stripLocaleFromPath(pathname: string) {
  const normalized = normalizePath(pathname);
  const segments = normalized.split("/");
  const firstSegment = segments[1];

  if (!isLanguageCode(firstSegment)) {
    return normalized;
  }

  const stripped = `/${segments.slice(2).join("/")}`;
  return stripped === "/" ? "/" : stripped.replace(/\/$/, "");
}

export function localizePath(pathname: string, language: LanguageCode) {
  if (!pathname.startsWith("/") || pathname.startsWith("//")) {
    return pathname;
  }

  const stripped = stripLocaleFromPath(pathname);
  return stripped === "/" ? `/${language}` : `/${language}${stripped}`;
}

export function switchLocalePath(pathname: string, language: LanguageCode) {
  return localizePath(stripLocaleFromPath(pathname), language);
}

export function getLanguageAlternates(pathname: string) {
  return Object.fromEntries(LANGUAGES.map((language) => [language, localizePath(pathname, language)]));
}

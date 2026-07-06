import { NextResponse, type NextRequest } from "next/server";
import { DEFAULT_LANGUAGE, LANGUAGES } from "./lib/languages";

const PUBLIC_FILE_PATTERN = /\.[^/]+$/;
const LOCALE_LIKE_PATTERN = /^[a-z]{2}(?:-[a-z]{2})?$/i;
const SKIPPED_PREFIXES = ["/api", "/_next", "/images", "/catalogs/imported"];

function hasSupportedLocale(pathname: string) {
  return LANGUAGES.some((language) => pathname === `/${language}` || pathname.startsWith(`/${language}/`));
}

function hasUnsupportedLocaleLikeSegment(pathname: string) {
  const firstSegment = pathname.split("/")[1];
  return Boolean(firstSegment && LOCALE_LIKE_PATTERN.test(firstSegment) && !LANGUAGES.includes(firstSegment as (typeof LANGUAGES)[number]));
}

function shouldSkip(pathname: string) {
  return (
    PUBLIC_FILE_PATTERN.test(pathname) ||
    SKIPPED_PREFIXES.some((prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`))
  );
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (hasSupportedLocale(pathname) || hasUnsupportedLocaleLikeSegment(pathname) || shouldSkip(pathname)) {
    return NextResponse.next();
  }

  const redirectUrl = request.nextUrl.clone();
  redirectUrl.pathname = pathname === "/" ? `/${DEFAULT_LANGUAGE}` : `/${DEFAULT_LANGUAGE}${pathname}`;

  return NextResponse.redirect(redirectUrl, 308);
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|.*\\..*).*)"]
};

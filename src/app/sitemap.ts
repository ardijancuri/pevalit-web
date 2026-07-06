import type { MetadataRoute } from "next";
import { defaultContent } from "@/lib/content";
import { getLanguageAlternates, LANGUAGES, localizePath } from "@/lib/localization";

const baseUrl = (process.env.NEXT_PUBLIC_SITE_URL || "https://pevalit.com").replace(/\/$/, "");

function absolutePath(pathname: string) {
  return `${baseUrl}${pathname}`;
}

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = ["/", "/products", "/catalogs", "/corporate/about", "/corporate/quality-policy", "/contact"];

  const categoryRoutes = defaultContent.categories.map((category) => `/products/${category.slug}`);
  const productRoutes = defaultContent.products.map((product) => `/product/${product.slug}`);
  const routes = [...staticRoutes, ...categoryRoutes, ...productRoutes];

  return routes.flatMap((route) => LANGUAGES.map((language) => ({
    url: absolutePath(localizePath(route, language)),
    alternates: {
      languages: Object.fromEntries(
        Object.entries(getLanguageAlternates(route)).map(([alternateLanguage, pathname]) => [
          alternateLanguage,
          absolutePath(pathname)
        ])
      )
    },
    changeFrequency: "weekly",
    priority: route === "/" ? 1 : 0.7
  })));
}

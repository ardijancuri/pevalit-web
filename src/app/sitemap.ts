import type { MetadataRoute } from "next";
import { defaultContent } from "@/lib/content";

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://pevalit.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = ["", "/products", "/catalogs", "/corporate/about", "/corporate/quality-policy", "/contact"];

  const categoryRoutes = defaultContent.categories.map((category) => `/products/${category.slug}`);
  const productRoutes = defaultContent.products.map((product) => `/product/${product.slug}`);

  return [...staticRoutes, ...categoryRoutes, ...productRoutes].map((route) => ({
    url: `${baseUrl}${route}`,
    changeFrequency: "weekly",
    priority: route === "" ? 1 : 0.7
  }));
}

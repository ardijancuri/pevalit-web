import siteDataJson from "@/content/en/site.json";
import categoriesJson from "@/content/en/categories.json";
import productsJson from "@/content/en/products.json";
import catalogsJson from "@/content/en/catalogs.json";
import corporateJson from "@/content/en/corporate.json";
import {
  catalogSchema,
  categorySchema,
  corporateSchema,
  productSchema,
  siteSchema
} from "@/lib/types";

const siteData = siteSchema.parse(siteDataJson);
const categories = categorySchema.array().parse(categoriesJson);
const products = productSchema.array().parse(productsJson);
const catalogs = catalogSchema.array().parse(catalogsJson);
const corporate = corporateSchema.parse(corporateJson);

export { siteData, categories, products, catalogs, corporate };

export const productsByCategory = categories.map((category) => ({
  category,
  products: products.filter((product) => product.categorySlug === category.slug)
}));

export function getCategoryBySlug(slug: string) {
  return categories.find((category) => category.slug === slug) ?? null;
}

export function getProductBySlug(slug: string) {
  return products.find((product) => product.slug === slug) ?? null;
}

const categoryNameBySlug = new Map(categories.map((category) => [category.slug, category.name]));

export function getCategoryNameBySlug(slug: string) {
  return categoryNameBySlug.get(slug) ?? slug;
}

export function getProductSummary(product: (typeof products)[number]) {
  const raw = (product.summary || "").trim();
  if (!raw || raw.toLowerCase() === product.name.toLowerCase()) {
    return `${product.name} for ${getCategoryNameBySlug(product.categorySlug)} applications with stable quality and consistent process performance.`;
  }
  return raw;
}

export function getProductSeoDescription(product: (typeof products)[number]) {
  const raw = (product.seo?.description || "").trim();
  if (!raw || raw.toLowerCase() === product.name.toLowerCase()) {
    return `${product.name} by PEVALIT with technical documentation, category-specific applications, and quote support.`;
  }
  return raw;
}

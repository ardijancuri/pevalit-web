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
import type { Metadata } from "next";
import { PageIntro } from "@/components/page-intro";
import { ProductFilters } from "@/components/product-filters";
import { categories, products } from "@/lib/content";

export const metadata: Metadata = {
  title: "Products | PEVALIT",
  description: "Discover PEVALIT additives and compounds by category, application, and performance requirement."
};

export default function ProductsPage() {
  return (
    <>
      <PageIntro
        eyebrow="Products"
        title="Find products faster with category and application filters."
        description="Explore our additive and masterbatch portfolio with a clearer structure, quick search, and streamlined product pages."
      />
      <ProductFilters categories={categories} products={products} />
    </>
  );
}

import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { PageIntro } from "@/components/page-intro";
import { ProductFilters } from "@/components/product-filters";
import { categories, getCategoryBySlug, products } from "@/lib/content";

type Props = {
  params: Promise<{ categorySlug: string }>;
};

export async function generateStaticParams() {
  return categories.map((category) => ({ categorySlug: category.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { categorySlug } = await params;
  const category = getCategoryBySlug(categorySlug);
  if (!category) {
    return {};
  }

  return {
    title: `${category.name} | PEVALIT`,
    description: category.description
  };
}

export default async function CategoryPage({ params }: Props) {
  const { categorySlug } = await params;
  const category = getCategoryBySlug(categorySlug);
  if (!category) {
    notFound();
  }

  return (
    <>
      <PageIntro eyebrow="Category" title={category.name} description={category.description} />
      <ProductFilters categories={categories} products={products} initialCategory={category.slug} />
    </>
  );
}

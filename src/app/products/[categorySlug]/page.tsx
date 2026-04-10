import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { PageIntro } from "@/components/page-intro";
import { ProductFilters } from "@/components/product-filters";
import { defaultContent, getCategoryBySlug, getLocalizedContent } from "@/lib/content";
import { getCategorySeoDescription, getUiCopy } from "@/lib/localization";
import { getCurrentLanguage } from "@/lib/server-language";

type Props = {
  params: Promise<{ categorySlug: string }>;
};

export async function generateStaticParams() {
  return defaultContent.categories.map((category) => ({ categorySlug: category.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const language = await getCurrentLanguage();
  const content = getLocalizedContent(language);
  const { categorySlug } = await params;
  const category = getCategoryBySlug(content, categorySlug);
  if (!category) {
    return {};
  }

  const description = getCategorySeoDescription(language, category.name);

  return {
    title: category.name,
    description,
    alternates: { canonical: `/products/${category.slug}` },
    openGraph: {
      title: category.name,
      description,
      images: [{ url: category.heroImage || "/images/imported/Pevalit-Catalogue-DE.jpg" }]
    }
  };
}

export default async function CategoryPage({ params }: Props) {
  const language = await getCurrentLanguage();
  const content = getLocalizedContent(language);
  const ui = getUiCopy(language);
  const { categorySlug } = await params;
  const category = getCategoryBySlug(content, categorySlug);
  if (!category) {
    notFound();
  }

  return (
    <>
      <PageIntro eyebrow={ui.categoryPage.eyebrow} title={category.name} description={category.description} />
      <ProductFilters
        language={language}
        categories={content.categories}
        products={content.products}
        initialCategory={category.slug}
        labels={ui.productFilters}
      />
    </>
  );
}

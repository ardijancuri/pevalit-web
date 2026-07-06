import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { PageIntro } from "@/components/page-intro";
import { ProductFilters } from "@/components/product-filters";
import { defaultContent, getCategoryBySlug, getLocalizedContent } from "@/lib/content";
import { getCategorySeoDescription, getLanguageAlternates, getUiCopy, LANGUAGES, localizePath } from "@/lib/localization";
import { getRouteLanguage } from "@/lib/server-language";

type Props = {
  params: Promise<{ language: string; categorySlug: string }>;
};

export async function generateStaticParams() {
  return LANGUAGES.flatMap((language) => defaultContent.categories.map((category) => ({ language, categorySlug: category.slug })));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { language: languageParam, categorySlug } = await params;
  const language = getRouteLanguage(languageParam);
  const content = getLocalizedContent(language);
  const category = getCategoryBySlug(content, categorySlug);
  if (!category) {
    return {};
  }

  const description = getCategorySeoDescription(language, category.name);

  return {
    title: category.name,
    description,
    alternates: {
      canonical: localizePath(`/products/${category.slug}`, language),
      languages: getLanguageAlternates(`/products/${category.slug}`)
    },
    openGraph: {
      title: category.name,
      description,
      images: [{ url: category.heroImage || "/images/imported/Pevalit-Catalogue-DE.jpg" }]
    }
  };
}

export default async function CategoryPage({ params }: Props) {
  const { language: languageParam, categorySlug } = await params;
  const language = getRouteLanguage(languageParam);
  const content = getLocalizedContent(language);
  const ui = getUiCopy(language);
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

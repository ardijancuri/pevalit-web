import type { Metadata } from "next";
import { PageIntro } from "@/components/page-intro";
import { ProductsDirectory } from "@/components/products-directory";
import { getLocalizedContent } from "@/lib/content";
import { getLanguageAlternates, getUiCopy, localizePath } from "@/lib/localization";
import { getRouteLanguage } from "@/lib/server-language";

type Props = {
  params: Promise<{ language: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { language: languageParam } = await params;
  const language = getRouteLanguage(languageParam);
  const ui = getUiCopy(language);

  return {
    title: ui.productsPage.eyebrow,
    description: ui.productsPage.description,
    alternates: {
      canonical: localizePath("/products", language),
      languages: getLanguageAlternates("/products")
    }
  };
}

export default async function ProductsPage({ params }: Props) {
  const { language: languageParam } = await params;
  const language = getRouteLanguage(languageParam);
  const { productsByCategory } = getLocalizedContent(language);
  const ui = getUiCopy(language);

  return (
    <div className="bg-white">
      <PageIntro
        eyebrow={ui.productsPage.eyebrow}
        title={ui.productsPage.title}
        description={ui.productsPage.description}
        surface="muted"
      />
      <ProductsDirectory language={language} groups={productsByCategory} labels={ui.productsPage} />
    </div>
  );
}

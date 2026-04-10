import enSiteJson from "@/content/en/site.json";
import enCategoriesJson from "@/content/en/categories.json";
import enProductsJson from "@/content/en/products.json";
import enCatalogsJson from "@/content/en/catalogs.json";
import enCorporateJson from "@/content/en/corporate.json";
import sqSiteJson from "@/content/sq/site.json";
import sqCategoriesJson from "@/content/sq/categories.json";
import sqCatalogsJson from "@/content/sq/catalogs.json";
import sqCorporateJson from "@/content/sq/corporate.json";
import mkSiteJson from "@/content/mk/site.json";
import mkCategoriesJson from "@/content/mk/categories.json";
import mkCatalogsJson from "@/content/mk/catalogs.json";
import mkCorporateJson from "@/content/mk/corporate.json";
import deSiteJson from "@/content/de/site.json";
import deCategoriesJson from "@/content/de/categories.json";
import deCatalogsJson from "@/content/de/catalogs.json";
import deCorporateJson from "@/content/de/corporate.json";
import {
  DEFAULT_LANGUAGE,
  type LanguageCode,
  getProductSeoDescriptionFallback,
  getProductSummaryFallback
} from "@/lib/localization";
import {
  type Catalog,
  type Category,
  type Corporate,
  type SiteData,
  catalogSchema,
  categorySchema,
  corporateSchema,
  productSchema,
  siteSchema
} from "@/lib/types";

const baseProducts = productSchema.array().parse(enProductsJson);

const contentSourceByLanguage = {
  en: {
    siteData: siteSchema.parse(enSiteJson),
    categories: categorySchema.array().parse(enCategoriesJson),
    catalogs: catalogSchema.array().parse(enCatalogsJson),
    corporate: corporateSchema.parse(enCorporateJson)
  },
  sq: {
    siteData: siteSchema.parse(sqSiteJson),
    categories: categorySchema.array().parse(sqCategoriesJson),
    catalogs: catalogSchema.array().parse(sqCatalogsJson),
    corporate: corporateSchema.parse(sqCorporateJson)
  },
  mk: {
    siteData: siteSchema.parse(mkSiteJson),
    categories: categorySchema.array().parse(mkCategoriesJson),
    catalogs: catalogSchema.array().parse(mkCatalogsJson),
    corporate: corporateSchema.parse(mkCorporateJson)
  },
  de: {
    siteData: siteSchema.parse(deSiteJson),
    categories: categorySchema.array().parse(deCategoriesJson),
    catalogs: catalogSchema.array().parse(deCatalogsJson),
    corporate: corporateSchema.parse(deCorporateJson)
  }
} satisfies Record<
  LanguageCode,
  {
    siteData: SiteData;
    categories: Category[];
    catalogs: Catalog[];
    corporate: Corporate;
  }
>;

function getCategoryApplicationPrefix(language: LanguageCode) {
  switch (language) {
    case "sq":
      return "Kategoria";
    case "mk":
      return "Категорија";
    case "de":
      return "Kategorie";
    default:
      return "Category";
  }
}

function translateProductBenefit(language: LanguageCode, benefit: string) {
  if (benefit !== "Imported product data from legacy website.") {
    return benefit;
  }

  switch (language) {
    case "sq":
      return "Të dhëna të importuara të produktit nga faqja e vjetër e internetit.";
    case "mk":
      return "Увезени податоци за производот од старата веб-страница.";
    case "de":
      return "Importierte Produktdaten von der früheren Website.";
    default:
      return benefit;
  }
}

function translateTechnicalSpecLabel(language: LanguageCode, label: string) {
  if (label !== "Source") {
    return label;
  }

  switch (language) {
    case "sq":
      return "Burimi";
    case "mk":
      return "Извор";
    case "de":
      return "Quelle";
    default:
      return label;
  }
}

function buildLocalizedContent(language: LanguageCode) {
  const content = contentSourceByLanguage[language];
  const categoryNameBySlug = new Map(content.categories.map((category) => [category.slug, category.name]));

  const products = baseProducts.map((product) => ({
    ...product,
    applications: product.applications.map((application) => {
      if (!application.startsWith("Category: ")) {
        return application;
      }

      return `${getCategoryApplicationPrefix(language)}: ${categoryNameBySlug.get(product.categorySlug) ?? product.categorySlug}`;
    }),
    benefits: product.benefits.map((benefit) => translateProductBenefit(language, benefit)),
    technicalSpecs: product.technicalSpecs.map((spec) => ({
      ...spec,
      label: translateTechnicalSpecLabel(language, spec.label)
    }))
  }));

  return {
    ...content,
    products,
    productsByCategory: content.categories.map((category) => ({
      category,
      products: products.filter((product) => product.categorySlug === category.slug)
    })),
    categoryNameBySlug
  };
}

export type LocalizedContent = ReturnType<typeof buildLocalizedContent>;

const localizedContentByLanguage = {
  en: buildLocalizedContent("en"),
  sq: buildLocalizedContent("sq"),
  mk: buildLocalizedContent("mk"),
  de: buildLocalizedContent("de")
} satisfies Record<LanguageCode, LocalizedContent>;

export const defaultContent = localizedContentByLanguage[DEFAULT_LANGUAGE];

export function getLocalizedContent(language: LanguageCode) {
  return localizedContentByLanguage[language];
}

export function getCategoryBySlug(content: LocalizedContent, slug: string) {
  return content.categories.find((category) => category.slug === slug) ?? null;
}

export function getProductBySlug(content: LocalizedContent, slug: string) {
  return content.products.find((product) => product.slug === slug) ?? null;
}

export function getCategoryNameBySlug(content: LocalizedContent, slug: string) {
  return content.categoryNameBySlug.get(slug) ?? slug;
}

export function getProductSummary(language: LanguageCode, content: LocalizedContent, product: LocalizedContent["products"][number]) {
  const raw = (product.summary || "").trim();
  if (!raw || raw.toLowerCase() === product.name.toLowerCase()) {
    return getProductSummaryFallback(language, product.name, getCategoryNameBySlug(content, product.categorySlug));
  }
  return raw;
}

export function getProductSeoDescription(language: LanguageCode, product: LocalizedContent["products"][number]) {
  const raw = (product.seo?.description || "").trim();
  if (!raw || raw.toLowerCase() === product.name.toLowerCase()) {
    return getProductSeoDescriptionFallback(language, product.name);
  }
  return raw;
}

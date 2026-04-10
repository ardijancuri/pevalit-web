import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { QuoteForm } from "@/components/quote-form";
import {
  defaultContent,
  getCategoryNameBySlug,
  getLocalizedContent,
  getProductBySlug,
  getProductSeoDescription,
  getProductSummary
} from "@/lib/content";
import { getUiCopy } from "@/lib/localization";
import { getCurrentLanguage } from "@/lib/server-language";

type Props = {
  params: Promise<{ productSlug: string }>;
};

export async function generateStaticParams() {
  return defaultContent.products.map((product) => ({ productSlug: product.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const language = await getCurrentLanguage();
  const content = getLocalizedContent(language);
  const { productSlug } = await params;
  const product = getProductBySlug(content, productSlug);
  if (!product) {
    return {};
  }

  const description = getProductSeoDescription(language, product);
  const image = product.imageUrl || "/images/imported/Pevalit-Catalogue-DE.jpg";

  return {
    title: product.name,
    description,
    alternates: { canonical: `/product/${product.slug}` },
    openGraph: {
      title: product.name,
      description,
      type: "article",
      images: [{ url: image }]
    }
  };
}

export default async function ProductPage({ params }: Props) {
  const language = await getCurrentLanguage();
  const content = getLocalizedContent(language);
  const ui = getUiCopy(language);
  const { productSlug } = await params;
  const product = getProductBySlug(content, productSlug);

  if (!product) {
    notFound();
  }

  const heroImage = product.imageUrl || "/images/imported/Pevalit-Catalogue-DE.jpg";
  const summary = getProductSummary(language, content, product);
  const localizedCategoryName = getCategoryNameBySlug(content, product.categorySlug);
  const homeLabel = content.siteData.navigation.find((item) => item.href === "/")?.label || "Home";
  const productsLabel = content.siteData.navigation.find((item) => item.href === "/products")?.label || "Products";
  const productLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    image: heroImage,
    description: getProductSeoDescription(language, product),
    category: localizedCategoryName,
    brand: { "@type": "Brand", name: "PEVALIT" }
  };
  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: homeLabel, item: "/" },
      { "@type": "ListItem", position: 2, name: productsLabel, item: "/products" },
      { "@type": "ListItem", position: 3, name: localizedCategoryName, item: `/products/${product.categorySlug}` },
      { "@type": "ListItem", position: 4, name: product.name, item: `/product/${product.slug}` }
    ]
  };

  return (
    <section className="section-block bg-white">
      <div className="site-container">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(productLd) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
        <section className="grid gap-8 lg:grid-cols-[1.3fr_1fr]">
          <article className="card p-4 md:p-6">
            <Image
              src={heroImage}
              alt={product.name}
              width={1200}
              height={900}
              className="mx-auto mb-6 aspect-[4/3] w-full max-w-2xl rounded-[8px] bg-white object-contain p-2"
            />
            <p className="text-xs uppercase tracking-[0.2em] text-[var(--brand)]">{localizedCategoryName}</p>
            <h1 className="mt-3 text-3xl leading-tight font-semibold md:text-4xl" style={{ fontFamily: "var(--font-heading), sans-serif" }}>
              {product.name}
            </h1>
            <p className="mt-4 text-base text-[var(--muted)] md:text-lg">{summary}</p>

            <h2 className="mt-8 text-xl font-semibold">{ui.productPage.keyBenefits}</h2>
            <ul className="mt-4 list-disc space-y-2 pl-5 text-sm text-[var(--muted)]">
              {product.benefits.map((benefit) => (
                <li key={benefit}>{benefit}</li>
              ))}
            </ul>

            <h2 className="mt-8 text-xl font-semibold">{ui.productPage.typicalApplications}</h2>
            <div className="mt-4 flex flex-wrap gap-2">
              {product.applications.map((application) => (
                <span key={application} className="rounded-[6px] bg-[var(--bg-soft)] px-3 py-1 text-xs text-[var(--text)]">
                  {application}
                </span>
              ))}
            </div>

            <h2 className="mt-8 text-xl font-semibold">{ui.productPage.technicalSpecs}</h2>
            <dl className="mt-4 grid gap-3 rounded-[8px] bg-[var(--bg-soft)] p-4">
              {product.technicalSpecs.map((spec) => (
                <div key={spec.label} className="grid grid-cols-1 gap-1 pb-3 sm:grid-cols-2 sm:gap-3 last:pb-0">
                  <dt className="text-sm text-[var(--muted)]">{spec.label}</dt>
                  <dd className="text-sm font-medium">{spec.value}</dd>
                </div>
              ))}
            </dl>

            <h2 className="mt-8 text-xl font-semibold">{ui.productPage.documents}</h2>
            <ul className="mt-4 flex flex-wrap gap-3">
              {product.documents.map((document) => (
                <li key={document.url}>
                  <Link
                    href={document.url}
                    aria-label={`${ui.productPage.technicalParameters} - ${document.title}`}
                    title={document.title}
                    className="inline-flex items-center gap-2 rounded-[8px] bg-[var(--brand)] px-4 py-2 text-sm font-semibold text-white transition hover:opacity-90"
                  >
                    <svg
                      aria-hidden="true"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="h-4 w-4"
                    >
                      <path d="M12 3v12" />
                      <path d="m7 10 5 5 5-5" />
                      <path d="M5 21h14" />
                    </svg>
                    {ui.productPage.technicalParameters}
                  </Link>
                </li>
              ))}
            </ul>
          </article>

          <aside className="lg:sticky lg:top-24 lg:max-h-[calc(100dvh-7rem)] lg:self-start lg:overflow-y-auto lg:pr-1">
            <QuoteForm key={`${language}-${product.slug}`} language={language} labels={ui.quoteForm} productSlug={product.slug} />
          </aside>
        </section>
      </div>
    </section>
  );
}

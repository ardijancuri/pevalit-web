import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { QuoteForm } from "@/components/quote-form";
import { getCategoryNameBySlug, getProductBySlug, getProductSeoDescription, getProductSummary, products } from "@/lib/content";

type Props = {
  params: Promise<{ productSlug: string }>;
};

export async function generateStaticParams() {
  return products.map((product) => ({ productSlug: product.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { productSlug } = await params;
  const product = getProductBySlug(productSlug);
  if (!product) {
    return {};
  }
  const description = getProductSeoDescription(product);
  const image = product.imageUrl || "/images/imported/Pevalit-Catalogue-DE.jpg";
  return {
    title: product.seo.title,
    description,
    alternates: { canonical: `/product/${product.slug}` },
    openGraph: {
      title: product.seo.title,
      description,
      type: "article",
      images: [{ url: image }]
    }
  };
}

export default async function ProductPage({ params }: Props) {
  const { productSlug } = await params;
  const product = getProductBySlug(productSlug);
  if (!product) {
    notFound();
  }
  const heroImage = product.imageUrl || "/images/imported/Pevalit-Catalogue-DE.jpg";
  const summary = getProductSummary(product);
  const relatedProducts = products
    .filter((item) => item.categorySlug === product.categorySlug && item.slug !== product.slug)
    .slice(0, 3);
  const productLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    image: heroImage,
    description: getProductSeoDescription(product),
    category: getCategoryNameBySlug(product.categorySlug),
    brand: { "@type": "Brand", name: "PEVALIT" }
  };
  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "/" },
      { "@type": "ListItem", position: 2, name: "Products", item: "/products" },
      { "@type": "ListItem", position: 3, name: getCategoryNameBySlug(product.categorySlug), item: `/products/${product.categorySlug}` },
      { "@type": "ListItem", position: 4, name: product.name, item: `/product/${product.slug}` }
    ]
  };

  return (
    <div className="site-container py-14">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(productLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
      <section className="grid gap-8 lg:grid-cols-[1.3fr_1fr]">
        <article className="card p-6">
          <Image
            src={heroImage}
            alt={product.name}
            width={1200}
            height={900}
            className="mx-auto mb-6 aspect-[4/3] w-full max-w-2xl rounded-2xl border border-[var(--line)] bg-white object-contain p-2"
          />
          <p className="text-xs uppercase tracking-[0.2em] text-[var(--brand)]">{product.categorySlug}</p>
          <h1 className="mt-3 text-4xl leading-tight font-semibold" style={{ fontFamily: "var(--font-heading), sans-serif" }}>
            {product.name}
          </h1>
          <p className="mt-4 text-lg text-[var(--muted)]">{summary}</p>

          <h2 className="mt-8 text-xl font-semibold">Key Benefits</h2>
          <ul className="mt-4 list-disc space-y-2 pl-5 text-sm text-[var(--muted)]">
            {product.benefits.map((benefit) => (
              <li key={benefit}>{benefit}</li>
            ))}
          </ul>

          <h2 className="mt-8 text-xl font-semibold">Typical Applications</h2>
          <div className="mt-4 flex flex-wrap gap-2">
            {product.applications.map((application) => (
              <span key={application} className="rounded-full bg-[var(--accent)] px-3 py-1 text-xs text-[var(--text)]">
                {application}
              </span>
            ))}
          </div>

          <h2 className="mt-8 text-xl font-semibold">Technical Specs</h2>
          <dl className="mt-4 grid gap-3 rounded-xl border border-[var(--line)] p-4">
            {product.technicalSpecs.map((spec) => (
              <div key={spec.label} className="grid grid-cols-2 gap-3 border-b border-[var(--line)] pb-3 last:border-b-0 last:pb-0">
                <dt className="text-sm text-[var(--muted)]">{spec.label}</dt>
                <dd className="text-sm font-medium">{spec.value}</dd>
              </div>
            ))}
          </dl>

          <h2 className="mt-8 text-xl font-semibold">Documents</h2>
          <ul className="mt-4 space-y-2">
            {product.documents.map((document) => (
              <li key={document.url}>
                <Link href={document.url} className="text-sm font-medium text-[var(--brand)] underline underline-offset-4">
                  {document.title}
                </Link>
              </li>
            ))}
          </ul>

          {relatedProducts.length ? (
            <>
              <h2 className="mt-8 text-xl font-semibold">Related Products</h2>
              <div className="mt-4 grid gap-3 md:grid-cols-3">
                {relatedProducts.map((item) => (
                  <Link key={item.slug} href={`/product/${item.slug}`} className="rounded-xl border border-[var(--line)] p-3 hover:border-[var(--brand)]">
                    <p className="text-sm font-semibold">{item.name}</p>
                  </Link>
                ))}
              </div>
            </>
          ) : null}
        </article>

        <aside className="lg:sticky lg:top-24 lg:max-h-[calc(100dvh-7rem)] lg:self-start lg:overflow-y-auto lg:pr-1">
          <QuoteForm productSlug={product.slug} />
        </aside>
      </section>
    </div>
  );
}

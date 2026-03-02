import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { QuoteForm } from "@/components/quote-form";
import { getProductBySlug, products } from "@/lib/content";

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
  return {
    title: product.seo.title,
    description: product.seo.description
  };
}

export default async function ProductPage({ params }: Props) {
  const { productSlug } = await params;
  const product = getProductBySlug(productSlug);
  if (!product) {
    notFound();
  }

  return (
    <div className="site-container py-14">
      <div className="max-w-3xl">
        <p className="text-xs uppercase tracking-[0.2em] text-[var(--brand)]">{product.categorySlug}</p>
        <h1 className="mt-3 text-4xl leading-tight font-semibold" style={{ fontFamily: "var(--font-heading), sans-serif" }}>
          {product.name}
        </h1>
        <p className="mt-4 text-lg text-[var(--muted)]">{product.summary}</p>
      </div>

      <section className="mt-10 grid gap-8 lg:grid-cols-[1.3fr_1fr]">
        <article className="card p-6">
          <h2 className="text-xl font-semibold">Key Benefits</h2>
          <ul className="mt-4 list-disc space-y-2 pl-5 text-sm text-[var(--muted)]">
            {product.benefits.map((benefit) => (
              <li key={benefit}>{benefit}</li>
            ))}
          </ul>

          <h2 className="mt-8 text-xl font-semibold">Typical Applications</h2>
          <div className="mt-4 flex flex-wrap gap-2">
            {product.applications.map((application) => (
              <span key={application} className="rounded-full bg-[var(--accent)] px-3 py-1 text-xs text-[var(--brand-strong)]">
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
        </article>

        <aside>
          <QuoteForm productSlug={product.slug} />
        </aside>
      </section>
    </div>
  );
}

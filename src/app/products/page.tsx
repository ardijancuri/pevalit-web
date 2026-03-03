import type { Metadata } from "next";
import Image from "next/image";
import { TrackedLink } from "@/components/tracked-link";
import { PageIntro } from "@/components/page-intro";
import { productsByCategory } from "@/lib/content";

export const metadata: Metadata = {
  title: "Products | PEVALIT",
  description: "Explore PEVALIT product categories, review technical product families, and navigate to detailed product documentation."
};

export default function ProductsPage() {
  return (
    <>
      <PageIntro
        eyebrow="Products"
        title="Browse Products By Category."
        description="Clean category navigation with direct access to full product lists and technical details."
      />
      <section className="site-container pb-20">
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {productsByCategory.map(({ category, products }) => (
            <article className="overflow-hidden rounded-2xl border border-[var(--line)] bg-white" key={category.slug}>
              <Image
                src={products[0]?.imageUrl || category.heroImage || "/images/imported/Pevalit-Catalogue-DE.jpg"}
                alt={category.name}
                width={800}
                height={640}
                className="aspect-[1.2/1] w-full border-b border-[var(--line)] object-cover"
                loading="lazy"
              />
              <div className="p-5">
                <h2 className="text-xl font-semibold">{category.name}</h2>
                <p className="mt-2 text-sm text-[var(--muted)]">{category.description}</p>
                <p className="mt-3 text-xs font-semibold uppercase tracking-[0.1em] text-[var(--brand)]">
                  {products.length} {products.length === 1 ? "product" : "products"}
                </p>

                {products.length ? (
                  <ul className="mt-3 space-y-1 text-sm text-[var(--text)]">
                    {products.slice(0, 3).map((product) => (
                      <li key={product.slug}>{product.name}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="mt-3 text-sm text-[var(--muted)]">No products currently listed.</p>
                )}

                <TrackedLink
                  href={`/products/${category.slug}`}
                  className="mt-4 inline-block rounded-full bg-[var(--brand)] px-4 py-2 text-xs font-semibold uppercase tracking-[0.08em] !text-white hover:bg-[var(--brand-strong)]"
                  trackingLabel={`View All - ${category.name}`}
                  trackingLocation="products_category_card"
                >
                  View Category
                </TrackedLink>
              </div>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}

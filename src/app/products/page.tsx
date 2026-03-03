import type { Metadata } from "next";
import Image from "next/image";
import { TrackedLink } from "@/components/tracked-link";
import { PageIntro } from "@/components/page-intro";
import { getProductSummary, productsByCategory } from "@/lib/content";

export const metadata: Metadata = {
  title: "Products | PEVALIT",
  description: "Explore PEVALIT product categories, review technical product families, and navigate to detailed product documentation."
};

export default function ProductsPage() {
  return (
    <>
      <PageIntro
        eyebrow="Products"
        title="Browse products by category."
        description="Products are grouped by category so you can quickly jump to the full list that matches your needs."
      />
      <section className="site-container space-y-8 pb-20">
        {productsByCategory.map(({ category, products }) => (
          <article className="card p-6" key={category.slug}>
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="text-2xl font-semibold">{category.name}</h2>
                <p className="mt-2 text-sm text-[var(--muted)]">{category.description}</p>
              </div>
              <TrackedLink
                href={`/products/${category.slug}`}
                className="rounded-full bg-[var(--brand)] px-4 py-2 text-sm font-semibold !text-white hover:bg-[var(--brand-strong)]"
                trackingLabel={`View All - ${category.name}`}
                trackingLocation="products_category_card"
              >
                View All
              </TrackedLink>
            </div>

            {products.length ? (
              <div className="mt-5 grid gap-4 md:grid-cols-2">
                {products.slice(0, 2).map((product) => (
                  <article className="overflow-hidden rounded-xl border border-[var(--line)]" key={product.slug}>
                    <Image
                      src={product.imageUrl || "/images/imported/Pevalit-Catalogue-DE.jpg"}
                      alt={product.name}
                      width={700}
                      height={700}
                      className="aspect-square w-full border-b border-[var(--line)] object-cover"
                      loading="lazy"
                    />
                    <div className="p-4">
                      <h3 className="text-base font-semibold">{product.name}</h3>
                      <p className="mt-2 text-sm text-[var(--muted)]">{getProductSummary(product)}</p>
                      <TrackedLink
                        href={`/product/${product.slug}`}
                        className="mt-3 inline-block rounded-full bg-[var(--brand)] px-3 py-1.5 text-sm font-semibold !text-white hover:bg-[var(--brand-strong)]"
                        trackingLabel={`View Product - ${product.name}`}
                        trackingLocation="products_category_card"
                      >
                        View Product
                      </TrackedLink>
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              <p className="mt-4 text-sm text-[var(--muted)]">No products currently listed in this category.</p>
            )}
          </article>
        ))}
      </section>
    </>
  );
}

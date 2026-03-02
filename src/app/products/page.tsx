import type { Metadata } from "next";
import Link from "next/link";
import { PageIntro } from "@/components/page-intro";
import { productsByCategory } from "@/lib/content";

export const metadata: Metadata = {
  title: "Products | PEVALIT",
  description: "Discover PEVALIT additives and compounds by category, application, and performance requirement."
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
              <Link
                href={`/products/${category.slug}`}
                className="rounded-full bg-[var(--brand)] px-4 py-2 text-sm font-semibold text-white hover:bg-[var(--brand-strong)]"
              >
                View all
              </Link>
            </div>

            {products.length ? (
              <div className="mt-5 max-w-md">
                <article className="overflow-hidden rounded-xl border border-[var(--line)]">
                  <img
                    src={products[0].imageUrl || "/images/imported/Pevalit-Catalogue-DE.jpg"}
                    alt={products[0].name}
                    className="aspect-square w-full border-b border-[var(--line)] object-cover"
                    loading="lazy"
                  />
                  <div className="p-4">
                    <h3 className="text-base font-semibold">{products[0].name}</h3>
                    <p className="mt-2 text-sm text-[var(--muted)]">{products[0].summary}</p>
                    <Link href={`/product/${products[0].slug}`} className="mt-3 inline-block text-sm font-semibold text-[var(--brand)]">
                      View product
                    </Link>
                  </div>
                </article>
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

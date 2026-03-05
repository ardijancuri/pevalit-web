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
    <div className="bg-[var(--bg)]">
      <PageIntro
        eyebrow="Products"
        title="Browse Products By Category."
        description="Clean category navigation with direct access to full product lists and technical details."
        surface="white"
      />
      <section className="section-block bg-[var(--bg)]">
        <div className="site-container grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {productsByCategory.map(({ category, products }) => (
            <article className="flex h-full flex-col overflow-hidden bg-[var(--charcoal)] text-[var(--charcoal-text)]" key={category.slug}>
              <Image
                src={products[0]?.imageUrl || category.heroImage || "/images/imported/Pevalit-Catalogue-DE.jpg"}
                alt={category.name}
                width={800}
                height={640}
                className="aspect-[1.2/1] w-full object-cover"
                loading="lazy"
              />
              <div className="flex flex-1 flex-col p-5">
                <h2 className="text-xl font-semibold">{category.name}</h2>
                <p className="mt-2 text-sm text-[var(--charcoal-muted)]">{category.description}</p>
                <p className="mt-3 text-xs font-semibold uppercase tracking-[0.1em] text-[var(--brand)]">
                  {products.length} {products.length === 1 ? "product" : "products"}
                </p>

                <div className="mt-auto pt-4">
                  <TrackedLink
                    href={`/products/${category.slug}`}
                    className="btn-primary"
                    trackingLabel={`View All - ${category.name}`}
                    trackingLocation="products_category_card"
                  >
                    View Category
                  </TrackedLink>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}

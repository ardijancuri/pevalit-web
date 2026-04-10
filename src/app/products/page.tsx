import type { Metadata } from "next";
import Image from "next/image";
import { TrackedLink } from "@/components/tracked-link";
import { PageIntro } from "@/components/page-intro";
import { getLocalizedContent } from "@/lib/content";
import { formatProductCount, getUiCopy } from "@/lib/localization";
import { getCurrentLanguage } from "@/lib/server-language";

export async function generateMetadata(): Promise<Metadata> {
  const language = await getCurrentLanguage();
  const ui = getUiCopy(language);

  return {
    title: ui.productsPage.eyebrow,
    description: ui.productsPage.description
  };
}

export default async function ProductsPage() {
  const language = await getCurrentLanguage();
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
      <section className="section-block bg-white">
        <div className="site-container grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {productsByCategory.map(({ category, products }) => (
            <article className="product-card flex h-full flex-col overflow-hidden border border-[var(--line)] bg-[var(--bg-soft)] text-[var(--text)]" key={category.slug}>
              <Image
                src={products[0]?.imageUrl || category.heroImage || "/images/imported/Pevalit-Catalogue-DE.jpg"}
                alt={category.name}
                width={800}
                height={640}
                className="aspect-square w-full object-cover"
                loading="lazy"
              />
              <div className="flex flex-1 flex-col p-5">
                <h2 className="text-xl font-semibold">{category.name}</h2>
                <p className="mt-2 text-sm text-[var(--muted)]">{category.description}</p>
                <p className="mt-3 text-xs font-semibold uppercase tracking-[0.1em] text-[var(--brand)]">
                  {formatProductCount(language, products.length)}
                </p>

                <div className="mt-auto pt-4">
                  <TrackedLink
                    href={`/products/${category.slug}`}
                    className="btn-primary"
                    trackingLabel={`${ui.productsPage.viewCategory} - ${category.name}`}
                    trackingLocation="products_category_card"
                  >
                    {ui.productsPage.viewCategory}
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

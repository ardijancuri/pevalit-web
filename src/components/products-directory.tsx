"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { ProductCard } from "@/components/product-card";
import { TrackedLink } from "@/components/tracked-link";
import { formatProductCount, localizePath, type LanguageCode, type UiCopy } from "@/lib/localization";
import type { Category, Product } from "@/lib/types";

type ProductsDirectoryProps = {
  language: LanguageCode;
  groups: Array<{ category: Category; products: Product[] }>;
  labels: UiCopy["productsPage"];
};

export function ProductsDirectory({ language, groups, labels }: ProductsDirectoryProps) {
  const [query, setQuery] = useState("");
  const normalizedQuery = query.trim().toLocaleLowerCase(language);
  const categoryNameBySlug = useMemo(() => new Map(groups.map(({ category }) => [category.slug, category.name])), [groups]);
  const filteredProducts = useMemo(() => {
    if (!normalizedQuery) return [];

    return groups
      .flatMap(({ products }) => products)
      .filter((product) => product.name.toLocaleLowerCase(language).includes(normalizedQuery));
  }, [groups, language, normalizedQuery]);

  return (
    <section className="section-block bg-white">
      <div className="site-container">
        <div className="card bg-[var(--bg-soft)] p-4 md:p-6">
          <label className="flex max-w-2xl flex-col gap-2 text-sm text-[var(--muted)]">
            {labels.searchByName}
            <input
              type="search"
              name="product-search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              className="rounded-[8px] border border-[var(--line)] bg-white px-4 py-3 text-base text-[var(--text)] outline-none transition-colors focus:border-[var(--brand)]"
              placeholder={labels.searchPlaceholder}
              autoComplete="off"
            />
          </label>
        </div>

        {normalizedQuery ? (
          <>
            <div className="mt-6 grid gap-4 sm:grid-cols-2 md:grid-cols-3">
              {filteredProducts.map((product) => (
                <ProductCard
                  key={product.slug}
                  language={language}
                  product={product}
                  categoryName={categoryNameBySlug.get(product.categorySlug) ?? product.categorySlug}
                  viewProductLabel={labels.viewProduct}
                  trackingLocation="products_name_search"
                />
              ))}
            </div>

            {!filteredProducts.length ? <p className="mt-8 text-sm text-[var(--muted)]">{labels.noSearchResults}</p> : null}
          </>
        ) : (
          <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {groups.map(({ category, products }) => (
              <TrackedLink
                className="product-card group flex h-full flex-col overflow-hidden border border-[var(--line)] bg-[var(--bg-soft)] text-[var(--text)]"
                href={localizePath(`/products/${category.slug}`, language)}
                key={category.slug}
                trackingLabel={`${labels.viewCategory} - ${category.name}`}
                trackingLocation="products_category_card"
              >
                <Image
                  src={products[0]?.imageUrl || category.heroImage || "/images/imported/Pevalit-Catalogue-DE.jpg"}
                  alt={category.name}
                  width={800}
                  height={640}
                  className="aspect-square w-full object-cover"
                  loading="lazy"
                />
                <div className="product-card-content flex flex-1 flex-col border-t p-5">
                  <h2 className="text-xl font-semibold">{category.name}</h2>
                  <p className="mt-2 text-sm text-[var(--muted)]">{category.description}</p>
                  <p className="mt-3 text-xs font-semibold uppercase tracking-[0.1em] text-[var(--brand)]">
                    {formatProductCount(language, products.length)}
                  </p>
                  <div className="mt-auto pt-4">
                    <span className="btn-primary transition-colors group-hover:border-[var(--brand-strong)] group-hover:bg-[var(--brand-strong)]">
                      {labels.viewCategory}
                    </span>
                  </div>
                </div>
              </TrackedLink>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { TrackedLink } from "@/components/tracked-link";
import { getProductSummaryFallback, type LanguageCode, type UiCopy } from "@/lib/localization";
import type { Category, Product } from "@/lib/types";

type ProductFiltersProps = {
  language: LanguageCode;
  categories: Category[];
  products: Product[];
  initialCategory?: string;
  labels: UiCopy["productFilters"];
};

function displaySummary(language: LanguageCode, product: Product, categoryNameBySlug: Map<string, string>) {
  const summary = (product.summary || "").trim();
  if (!summary || summary.toLowerCase() === product.name.toLowerCase()) {
    return getProductSummaryFallback(language, product.name, categoryNameBySlug.get(product.categorySlug) ?? product.categorySlug);
  }
  return summary;
}

export function ProductFilters({
  language,
  categories,
  products,
  initialCategory = "all",
  labels
}: ProductFiltersProps) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState(initialCategory);
  const categoryNameBySlug = useMemo(() => new Map(categories.map((item) => [item.slug, item.name])), [categories]);

  const filtered = useMemo(() => {
    return products.filter((product) => {
      const inCategory = category === "all" || product.categorySlug === category;
      if (!inCategory) return false;

      if (!query.trim()) return true;
      const q = query.toLowerCase();
      return (
        product.name.toLowerCase().includes(q) ||
        displaySummary(language, product, categoryNameBySlug).toLowerCase().includes(q) ||
        product.applications.some((item) => item.toLowerCase().includes(q))
      );
    });
  }, [category, categoryNameBySlug, language, products, query]);

  return (
    <section className="section-block bg-white">
      <div className="site-container">
        <div className="card p-4 md:p-6">
          <div className="grid gap-4 md:grid-cols-[1fr_auto]">
            <label className="flex flex-col gap-2 text-sm text-[var(--muted)]">
              {labels.searchProducts}
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                className="rounded-[8px] border border-[var(--line)] bg-white px-4 py-3 text-base text-[var(--text)]"
                placeholder={labels.searchPlaceholder}
              />
            </label>
            <label className="flex flex-col gap-2 text-sm text-[var(--muted)]">
              {labels.category}
              <select
                value={category}
                onChange={(event) => setCategory(event.target.value)}
                className="rounded-[8px] border border-[var(--line)] bg-white px-4 py-3 text-base text-[var(--text)]"
              >
                <option value="all">{labels.allCategories}</option>
                {categories.map((item) => (
                  <option key={item.slug} value={item.slug}>
                    {item.name}
                  </option>
                ))}
              </select>
            </label>
          </div>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2 md:grid-cols-3">
          {filtered.map((product) => (
            <article className="product-card overflow-hidden border border-[var(--line)] bg-[var(--bg-soft)] p-0 text-[var(--text)]" key={product.slug}>
              <Image
                src={product.imageUrl || "/images/imported/Pevalit-Catalogue-DE.jpg"}
                alt={product.name}
                width={700}
                height={700}
                className="aspect-square w-full object-cover"
                loading="lazy"
              />
              <div className="p-5 md:p-6">
                <p className="text-xs uppercase tracking-[0.16em] text-[var(--brand)]">
                  {categoryNameBySlug.get(product.categorySlug) ?? product.categorySlug}
                </p>
                <h2 className="mt-2 text-xl font-semibold">{product.name}</h2>
                <p className="mt-3 text-sm text-[var(--muted)]">{displaySummary(language, product, categoryNameBySlug)}</p>
                <TrackedLink
                  className="btn-primary mt-4"
                  href={`/product/${product.slug}`}
                  trackingLabel={`${labels.viewProduct} - ${product.name}`}
                  trackingLocation="products_filters"
                >
                  {labels.viewProduct}
                </TrackedLink>
              </div>
            </article>
          ))}
        </div>

        {!filtered.length ? (
          <p className="mt-8 text-sm text-[var(--muted)]">
            {labels.noResults}
          </p>
        ) : null}
      </div>
    </section>
  );
}

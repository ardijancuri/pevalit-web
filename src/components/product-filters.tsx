"use client";

import { useMemo, useState } from "react";
import { ProductCard, getProductCardSummary } from "@/components/product-card";
import { type LanguageCode, type UiCopy } from "@/lib/localization";
import type { Category, Product } from "@/lib/types";

type ProductFiltersProps = {
  language: LanguageCode;
  categories: Category[];
  products: Product[];
  initialCategory?: string;
  labels: UiCopy["productFilters"];
};

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
        getProductCardSummary(
          language,
          product,
          categoryNameBySlug.get(product.categorySlug) ?? product.categorySlug
        ).toLowerCase().includes(q) ||
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
            <ProductCard
              key={product.slug}
              language={language}
              product={product}
              categoryName={categoryNameBySlug.get(product.categorySlug) ?? product.categorySlug}
              viewProductLabel={labels.viewProduct}
              trackingLocation="products_filters"
            />
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

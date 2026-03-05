"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { TrackedLink } from "@/components/tracked-link";
import type { Category, Product } from "@/lib/types";

type ProductFiltersProps = {
  categories: Category[];
  products: Product[];
  initialCategory?: string;
};

function displaySummary(product: Product) {
  const summary = (product.summary || "").trim();
  if (!summary || summary.toLowerCase() === product.name.toLowerCase()) {
    return `${product.name} with stable performance and technical support for category-specific applications.`;
  }
  return summary;
}

export function ProductFilters({ categories, products, initialCategory = "all" }: ProductFiltersProps) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState(initialCategory);

  const filtered = useMemo(() => {
    return products.filter((product) => {
      const inCategory = category === "all" || product.categorySlug === category;
      if (!inCategory) return false;

      if (!query.trim()) return true;
      const q = query.toLowerCase();
      return (
        product.name.toLowerCase().includes(q) ||
        displaySummary(product).toLowerCase().includes(q) ||
        product.applications.some((item) => item.toLowerCase().includes(q))
      );
    });
  }, [category, products, query]);

  return (
    <section className="site-container pb-20">
      <div className="card p-4 md:p-6">
        <div className="grid gap-4 md:grid-cols-[1fr_auto]">
          <label className="flex flex-col gap-2 text-sm text-[var(--muted)]">
            Search products
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              className="rounded-xl border border-[var(--line)] bg-white px-4 py-3 text-base text-[var(--text)]"
              placeholder="Type application, feature, or product name"
            />
          </label>
          <label className="flex flex-col gap-2 text-sm text-[var(--muted)]">
            Category
            <select
              value={category}
              onChange={(event) => setCategory(event.target.value)}
              className="rounded-xl border border-[var(--line)] bg-white px-4 py-3 text-base text-[var(--text)]"
            >
              <option value="all">All categories</option>
              {categories.map((item) => (
                <option key={item.slug} value={item.slug}>
                  {item.name}
                </option>
              ))}
            </select>
          </label>
        </div>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-3">
        {filtered.map((product) => (
          <article className="card overflow-hidden p-0" key={product.slug}>
            <Image
              src={product.imageUrl || "/images/imported/Pevalit-Catalogue-DE.jpg"}
              alt={product.name}
              width={700}
              height={700}
              className="aspect-square w-full border-b border-[var(--line)] object-cover"
              loading="lazy"
            />
            <div className="p-6">
            <p className="text-xs uppercase tracking-[0.16em] text-[var(--brand)]">{product.categorySlug}</p>
            <h2 className="mt-2 text-xl font-semibold">{product.name}</h2>
            <p className="mt-3 text-sm text-[var(--muted)]">{displaySummary(product)}</p>
            <TrackedLink
              className="mt-4 inline-block rounded-full bg-[var(--brand)] px-4 py-2 text-sm font-medium !text-white hover:bg-[var(--brand-strong)]"
              href={`/product/${product.slug}`}
              trackingLabel={`View Product - ${product.name}`}
              trackingLocation="products_filters"
            >
              View Product
            </TrackedLink>
            </div>
          </article>
        ))}
      </div>

      {!filtered.length ? (
        <p className="mt-8 text-sm text-[var(--muted)]">
          No matching products found. Try a broader search or switch category.
        </p>
      ) : null}
    </section>
  );
}

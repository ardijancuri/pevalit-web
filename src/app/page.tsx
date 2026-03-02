import Link from "next/link";
import { categories, products, siteData } from "@/lib/content";

export default function HomePage() {
  return (
    <>
      <section className="site-container pt-18 pb-16">
        <p className="text-xs uppercase tracking-[0.2em] text-[var(--brand)]">Engineered Polymer Solutions</p>
        <h1 className="mt-4 max-w-3xl text-5xl leading-tight font-semibold" style={{ fontFamily: "var(--font-heading), sans-serif" }}>
          {siteData.tagline}
        </h1>
        <p className="mt-5 max-w-2xl text-lg text-[var(--muted)]">{siteData.description}</p>
        <div className="mt-7 flex flex-wrap gap-3">
          <Link className="rounded-full bg-[var(--brand)] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[var(--brand-strong)]" href={siteData.primaryCta.href}>
            {siteData.primaryCta.label}
          </Link>
          <Link className="rounded-full border border-[var(--line)] bg-white px-5 py-2.5 text-sm font-semibold hover:border-[var(--brand)]" href={siteData.secondaryCta.href}>
            {siteData.secondaryCta.label}
          </Link>
        </div>
      </section>

      <section className="site-container pb-10">
        <div className="grid gap-4 md:grid-cols-3">
          {categories.map((category) => (
            <Link className="card overflow-hidden p-0 hover:border-[var(--brand)]" key={category.slug} href={`/products/${category.slug}`}>
              <img
                src={category.heroImage.startsWith("/images/imported/") ? category.heroImage : "/images/imported/Pevalit-Catalogue-DE.jpg"}
                alt={category.name}
                className="aspect-square w-full border-b border-[var(--line)] object-cover"
                loading="lazy"
              />
              <div className="p-6">
                <h2 className="text-xl font-semibold">{category.name}</h2>
                <p className="mt-2 text-sm text-[var(--muted)]">{category.description}</p>
                <span className="mt-4 inline-block text-sm font-semibold text-[var(--brand)]">Browse category</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="site-container pb-20">
        <div className="card p-7">
          <h2 className="text-2xl font-semibold">Popular products</h2>
          <div className="mt-5 grid gap-3 md:grid-cols-3">
            {products.slice(0, 3).map((product) => (
              <Link key={product.slug} href={`/product/${product.slug}`} className="rounded-xl border border-[var(--line)] p-0 hover:border-[var(--brand)]">
                <img
                  src={product.imageUrl || "/images/imported/Pevalit-Catalogue-DE.jpg"}
                  alt={product.name}
                  className="aspect-square w-full rounded-t-xl border-b border-[var(--line)] object-cover"
                  loading="lazy"
                />
                <div className="p-4">
                <p className="text-sm font-semibold">{product.name}</p>
                <p className="mt-2 text-xs text-[var(--muted)]">{product.summary}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

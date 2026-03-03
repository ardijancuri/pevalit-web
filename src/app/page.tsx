import Link from "next/link";
import Image from "next/image";
import { HomeMiniProductSlider } from "@/components/home-mini-product-slider";
import { HomeProductSlider } from "@/components/home-product-slider";
import { TrackedLink } from "@/components/tracked-link";
import { categories, getCategoryNameBySlug, getProductSummary, products, siteData } from "@/lib/content";

export default function HomePage() {
  const featuredProducts = products.slice(0, 6).map((product) => ({
    slug: product.slug,
    name: product.name,
    imageUrl: product.imageUrl,
    categoryName: getCategoryNameBySlug(product.categorySlug),
    summary: getProductSummary(product),
    applications: product.applications,
    benefits: product.benefits,
    documentsCount: product.documents.length
  }));
  const secondaryProducts = products.slice(6).map((product) => ({
    slug: product.slug,
    name: product.name,
    imageUrl: product.imageUrl,
    categoryName: getCategoryNameBySlug(product.categorySlug),
    categorySlug: product.categorySlug
  }));

  return (
    <>
      <HomeProductSlider products={featuredProducts} />
      <HomeMiniProductSlider products={secondaryProducts} />

      <section className="site-container pt-10 pb-16">
        <p className="text-xs uppercase tracking-[0.2em] text-[var(--brand)]">Engineered Polymer Solutions</p>
        <h1 className="mt-4 max-w-3xl text-5xl leading-tight font-semibold" style={{ fontFamily: "var(--font-heading), sans-serif" }}>
          {siteData.tagline}
        </h1>
        <p className="mt-5 max-w-2xl text-lg text-[var(--muted)]">{siteData.description}</p>
        <div className="mt-7 flex flex-wrap gap-3">
          <TrackedLink
            className="rounded-full bg-[var(--brand)] px-5 py-2.5 text-sm font-semibold !text-white hover:bg-[var(--brand-strong)]"
            href={siteData.primaryCta.href}
            trackingLabel={siteData.primaryCta.label}
            trackingLocation="home_hero"
          >
            {siteData.primaryCta.label}
          </TrackedLink>
          <TrackedLink
            className="rounded-full border border-[var(--line)] bg-white px-5 py-2.5 text-sm font-semibold hover:border-[var(--brand)]"
            href={siteData.secondaryCta.href}
            trackingLabel={siteData.secondaryCta.label}
            trackingLocation="home_hero"
          >
            {siteData.secondaryCta.label}
          </TrackedLink>
        </div>
      </section>

      <section className="site-container pb-10">
        <div className="grid gap-4 md:grid-cols-3">
          {categories.map((category) => (
            <Link className="card overflow-hidden p-0 hover:border-[var(--brand)]" key={category.slug} href={`/products/${category.slug}`}>
              <Image
                src={category.heroImage.startsWith("/images/imported/") ? category.heroImage : "/images/imported/Pevalit-Catalogue-DE.jpg"}
                alt={category.name}
                width={700}
                height={700}
                className="aspect-square w-full border-b border-[var(--line)] object-cover"
                loading="lazy"
              />
              <div className="p-6">
                <h2 className="text-xl font-semibold">{category.name}</h2>
                <p className="mt-2 text-sm text-[var(--muted)]">{category.description}</p>
                <span className="mt-4 inline-block rounded-full border border-[var(--brand)] bg-[var(--brand)] px-4 py-1.5 text-sm font-semibold !text-white">
                  Browse category
                </span>
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
                <Image
                  src={product.imageUrl || "/images/imported/Pevalit-Catalogue-DE.jpg"}
                  alt={product.name}
                  width={700}
                  height={700}
                  className="aspect-square w-full rounded-t-xl border-b border-[var(--line)] object-cover"
                  loading="lazy"
                />
                <div className="p-4">
                <p className="text-sm font-semibold">{product.name}</p>
                <p className="mt-2 text-xs text-[var(--muted)]">{getProductSummary(product)}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="site-container pb-20">
        <div className="grid gap-4 md:grid-cols-3">
          <article className="card p-6">
            <p className="text-xs uppercase tracking-[0.16em] text-[var(--brand)]">Certified Systems</p>
            <p className="mt-3 text-sm text-[var(--muted)]">Production and products aligned with EN 12004 and ETAG 004 certification standards.</p>
          </article>
          <article className="card p-6">
            <p className="text-xs uppercase tracking-[0.16em] text-[var(--brand)]">Regional + Export Reach</p>
            <p className="mt-3 text-sm text-[var(--muted)]">Serving projects across Macedonia and international markets with consistent technical support.</p>
          </article>
          <article className="card p-6">
            <p className="text-xs uppercase tracking-[0.16em] text-[var(--brand)]">Fast Technical Response</p>
            <p className="mt-3 text-sm text-[var(--muted)]">Share your application and get a focused quote recommendation with relevant documentation.</p>
          </article>
        </div>
      </section>

      <section className="site-container pb-8">
        <div className="card grid gap-4 p-6 md:grid-cols-4">
          <article>
            <p className="text-3xl font-semibold" style={{ fontFamily: "var(--font-heading), sans-serif" }}>15+</p>
            <p className="mt-1 text-sm text-[var(--muted)]">Years serving contractors and manufacturers</p>
          </article>
          <article>
            <p className="text-3xl font-semibold" style={{ fontFamily: "var(--font-heading), sans-serif" }}>100+</p>
            <p className="mt-1 text-sm text-[var(--muted)]">Product formulations across key categories</p>
          </article>
          <article>
            <p className="text-3xl font-semibold" style={{ fontFamily: "var(--font-heading), sans-serif" }}>24h</p>
            <p className="mt-1 text-sm text-[var(--muted)]">Typical first technical response time</p>
          </article>
          <article>
            <p className="text-3xl font-semibold" style={{ fontFamily: "var(--font-heading), sans-serif" }}>EU</p>
            <p className="mt-1 text-sm text-[var(--muted)]">Standards-driven quality and documentation</p>
          </article>
        </div>
      </section>

      <section className="site-container pb-24">
        <div className="rounded-2xl border border-[var(--line)] bg-[var(--text)] p-8 text-white">
          <p className="text-xs uppercase tracking-[0.18em] text-[var(--brand)]">Technical + Commercial Support</p>
          <h2 className="mt-3 max-w-2xl text-3xl font-semibold" style={{ fontFamily: "var(--font-heading), sans-serif" }}>
            Send your formulation goal and get product recommendation with documents.
          </h2>
          <p className="mt-3 max-w-2xl text-sm text-white/80">
            Share substrate, climate, application method, and desired performance. Our team responds with suitable product options and next-step quote guidance.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <TrackedLink
              href="/contact"
              className="rounded-full bg-[var(--brand)] px-5 py-2.5 text-sm font-semibold !text-white hover:bg-[var(--brand-strong)]"
              trackingLabel="Request Technical Quote"
              trackingLocation="home_conversion"
            >
              Request Technical Quote
            </TrackedLink>
            <TrackedLink
              href="/catalogs"
              className="rounded-full border border-white/35 px-5 py-2.5 text-sm font-semibold text-white hover:border-white"
              trackingLabel="View Catalogs"
              trackingLocation="home_conversion"
            >
              View Catalogs
            </TrackedLink>
          </div>
        </div>
      </section>
    </>
  );
}

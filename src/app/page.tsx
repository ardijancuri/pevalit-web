import Link from "next/link";
import Image from "next/image";
import { TrackedLink } from "@/components/tracked-link";
import { catalogs, categories, getCategoryNameBySlug, getProductSummary, products, siteData } from "@/lib/content";

export default function HomePage() {
  const highlightedCatalogs = catalogs.slice(0, 3);
  const highlightedProducts = products.slice(0, 4);
  const reasons = [
    "Certified systems aligned with EN 12004 and ETAG 004.",
    "Consistent quality control with stable production methods.",
    "Fast technical guidance for specification and application.",
    "Regional and export coverage with practical support."
  ];

  return (
    <>
      <section className="overflow-hidden border-y border-[var(--line)] bg-[var(--bg)]">
        <div className="site-container grid gap-8 py-10 lg:grid-cols-[1.15fr_0.85fr] lg:items-center lg:py-14">
          <div>
            <p className="text-xs uppercase tracking-[0.22em] text-[var(--brand)]">Technical Construction Systems</p>
            <h1 className="mt-4 max-w-3xl text-4xl leading-tight font-semibold md:text-5xl" style={{ fontFamily: "var(--font-heading), sans-serif" }}>
              {siteData.tagline}
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-relaxed text-[var(--muted)] md:text-lg">{siteData.description}</p>
            <div className="mt-7 flex flex-wrap gap-3">
              <TrackedLink
                className="rounded-full bg-[var(--brand)] px-5 py-2.5 text-sm font-semibold uppercase tracking-[0.08em] !text-white hover:bg-[var(--brand-strong)]"
                href={siteData.primaryCta.href}
                trackingLabel={siteData.primaryCta.label}
                trackingLocation="home_hero"
              >
                {siteData.primaryCta.label}
              </TrackedLink>
              <TrackedLink
                className="rounded-full border border-[var(--line)] bg-white px-5 py-2.5 text-sm font-semibold uppercase tracking-[0.08em] hover:border-[var(--brand)]"
                href={siteData.secondaryCta.href}
                trackingLabel={siteData.secondaryCta.label}
                trackingLocation="home_hero"
              >
                {siteData.secondaryCta.label}
              </TrackedLink>
            </div>
            <div className="mt-7 grid gap-3 sm:grid-cols-3">
              <article className="rounded-xl border border-[var(--line)] bg-white/80 px-4 py-3">
                <p className="text-[0.63rem] uppercase tracking-[0.14em] text-[var(--brand)]">Production</p>
                <p className="mt-1 text-sm font-semibold">Standards-Based Process</p>
              </article>
              <article className="rounded-xl border border-[var(--line)] bg-white/80 px-4 py-3">
                <p className="text-[0.63rem] uppercase tracking-[0.14em] text-[var(--brand)]">Support</p>
                <p className="mt-1 text-sm font-semibold">Fast Technical Reply</p>
              </article>
              <article className="rounded-xl border border-[var(--line)] bg-white/80 px-4 py-3">
                <p className="text-[0.63rem] uppercase tracking-[0.14em] text-[var(--brand)]">Coverage</p>
                <p className="mt-1 text-sm font-semibold">Regional + Export Ready</p>
              </article>
            </div>
          </div>

          <article className="relative overflow-hidden rounded-2xl border border-[var(--line)] bg-[var(--text)] text-white shadow-xl">
            <Image
              src="/images/imported/corporate-copy.jpg"
              alt="PEVALIT production and technical support"
              width={900}
              height={1100}
              className="h-full w-full object-cover object-center opacity-70"
              priority
            />
            <div className="absolute inset-0 bg-[var(--text)]/45" />
            <div className="absolute inset-x-0 bottom-0 p-5 md:p-6">
              <p className="text-[0.65rem] uppercase tracking-[0.14em] text-[var(--brand)]">Built For Contractors And Manufacturers</p>
              <p className="mt-2 text-sm leading-relaxed text-white/90">
                Product systems with documented performance, stable quality control, and practical on-site technical guidance.
              </p>
            </div>
          </article>
        </div>
      </section>

      <section className="site-container pb-14">
        <div className="rounded-2xl border border-[var(--line)] bg-white p-6 md:p-7">
          <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-[var(--brand)]">Catalogues</p>
              <h2 className="mt-2 text-3xl font-semibold" style={{ fontFamily: "var(--font-heading), sans-serif" }}>
                Download Technical Catalogues
              </h2>
              <p className="mt-2 max-w-3xl text-sm text-[var(--muted)]">
                Open the latest product documentation and download PDF versions directly.
              </p>
            </div>
            <TrackedLink
              href="/catalogs"
              className="rounded-full border border-[var(--line)] bg-white px-4 py-2 text-xs font-semibold uppercase tracking-[0.09em] hover:border-[var(--brand)]"
              trackingLabel="View all catalogs"
              trackingLocation="home_catalogs"
            >
              View all catalogs
            </TrackedLink>
          </div>

          <div className="grid gap-3 md:grid-cols-3">
            {highlightedCatalogs.map((catalog) => (
              <article key={catalog.slug} className="overflow-hidden rounded-xl border border-[var(--line)] bg-white">
                <Image
                  src={catalog.previewImage}
                  alt={catalog.title}
                  width={700}
                  height={980}
                  className="h-52 w-full border-b border-[var(--line)] object-cover"
                  loading="lazy"
                />
                <div className="p-3">
                  <p className="text-sm font-semibold">{catalog.title}</p>
                  <p className="mt-2 text-xs text-[var(--muted)]">{catalog.description}</p>
                  <TrackedLink
                    href={catalog.fileUrl}
                    className="mt-3 inline-block rounded-full bg-[var(--brand)] px-3.5 py-1.5 text-xs font-semibold uppercase tracking-[0.08em] !text-white hover:bg-[var(--brand-strong)]"
                    trackingLabel={`Download PDF - ${catalog.title}`}
                    trackingLocation="home_catalogs"
                  >
                    Download PDF
                  </TrackedLink>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="site-container pb-14">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-[var(--brand)]">Solutions Portfolio</p>
            <h2 className="mt-2 text-3xl font-semibold" style={{ fontFamily: "var(--font-heading), sans-serif" }}>
              Browse By Category
            </h2>
            <p className="mt-2 max-w-3xl text-sm text-[var(--muted)]">
              Select the product family that matches your project type, then open full product details and documentation.
            </p>
          </div>
          <TrackedLink
            href="/products"
            className="rounded-full border border-[var(--line)] bg-white px-4 py-2 text-xs font-semibold uppercase tracking-[0.09em] hover:border-[var(--brand)]"
            trackingLabel="View all products"
            trackingLocation="home_categories"
          >
            View all products
          </TrackedLink>
        </div>

        <div className="grid gap-4 md:grid-cols-4">
          {categories.map((category) => (
            <Link
              className="group card overflow-hidden p-0 transition hover:-translate-y-0.5 hover:border-[var(--brand)]"
              key={category.slug}
              href={`/products/${category.slug}`}
            >
              <Image
                src={category.heroImage.startsWith("/images/imported/") ? category.heroImage : "/images/imported/Pevalit-Catalogue-DE.jpg"}
                alt={category.name}
                width={700}
                height={700}
                className="aspect-square w-full border-b border-[var(--line)] object-cover"
                loading="lazy"
              />
              <div className="p-5">
                <h2 className="text-lg font-semibold">{category.name}</h2>
                <p className="mt-2 text-sm text-[var(--muted)]">{category.description}</p>
                <span className="mt-4 inline-block rounded-full border border-[var(--brand)] bg-[var(--brand)] px-4 py-1.5 text-[0.68rem] font-semibold uppercase tracking-[0.08em] !text-white">
                  Browse Category
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="site-container pb-20">
        <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <article className="rounded-2xl border border-[var(--line)] bg-white p-6 md:p-7">
            <div>
              <p className="text-xs uppercase tracking-[0.19em] text-[var(--brand)]">Why PEVALIT</p>
              <h2 className="mt-2 text-3xl font-semibold" style={{ fontFamily: "var(--font-heading), sans-serif" }}>
                Clean, Reliable, Practical
              </h2>
              <p className="mt-3 text-sm text-[var(--muted)]">
                A focused portfolio with consistent quality and direct technical support, built for real project requirements.
              </p>

              <div className="mt-5 space-y-3">
                {reasons.map((reason) => (
                  <article key={reason} className="rounded-xl border border-[var(--line)] bg-[#fafbfb] p-3">
                    <p className="text-sm font-medium text-[var(--text)]">{reason}</p>
                  </article>
                ))}
              </div>
            </div>
          </article>

          <div className="grid gap-3 sm:grid-cols-2">
            {highlightedProducts.map((product) => (
              <Link
                key={product.slug}
                href={`/product/${product.slug}`}
                className="overflow-hidden rounded-xl border border-[var(--line)] bg-white transition hover:border-[var(--brand)]"
              >
                <Image
                  src={product.imageUrl || "/images/imported/Pevalit-Catalogue-DE.jpg"}
                  alt={product.name}
                  width={700}
                  height={700}
                  className="aspect-square w-full border-b border-[var(--line)] object-cover"
                  loading="lazy"
                />
                <div className="p-4">
                  <p className="text-[0.62rem] uppercase tracking-[0.14em] text-[var(--brand)]">{getCategoryNameBySlug(product.categorySlug)}</p>
                  <p className="mt-1 text-base font-semibold">{product.name}</p>
                  <p className="mt-2 text-xs text-[var(--muted)]">{getProductSummary(product)}</p>
                </div>
              </Link>
            ))}
          </div>
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

import Link from "next/link";
import Image from "next/image";
import { TrackedLink } from "@/components/tracked-link";
import { ConstructionSystemsSlider } from "@/components/construction-systems-slider";
import { HomeCategorySlider } from "@/components/home-category-slider";
import { catalogs, categories, corporate, getCategoryNameBySlug, getProductSummary, products, siteData } from "@/lib/content";

export default function HomePage() {
  const about = corporate.about;
  const constructionSystemSlideCount = 30;
  const constructionSystemSlides = Array.from({ length: constructionSystemSlideCount }, (_, index) => {
    const slideNumber = String(index + 1).padStart(2, "0");
    return {
      src: `/images/imported/construction-systems-slider/slide-${slideNumber}.jpg`,
      alt: `PEVALIT construction systems slide ${index + 1}`
    };
  });
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
      <section className="relative overflow-hidden bg-white pt-2 text-[var(--text)]">
        <div className="relative mx-auto w-[min(1285px,calc(100%-2rem))] py-7 lg:py-8">
          <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
            <div>
              <p className="text-xs uppercase tracking-[0.22em] text-[#626d79]">Construction Systems</p>
              <h1 className="mt-3 max-w-xl text-3xl leading-[1.08] font-semibold md:text-[3.25rem]" style={{ fontFamily: "var(--font-heading), sans-serif" }}>
                We build dependable insulation systems from foundation to finish.
              </h1>
              <p className="mt-3 max-w-2xl text-base leading-relaxed text-[var(--muted)] md:text-lg">{siteData.description}</p>
              <div className="mt-5 flex flex-wrap gap-3">
                <TrackedLink
                  className="rounded-full bg-[var(--brand)] px-5 py-2.5 text-sm font-semibold uppercase tracking-[0.08em] !text-white hover:bg-[var(--brand-strong)]"
                  href={siteData.primaryCta.href}
                  trackingLabel={siteData.primaryCta.label}
                  trackingLocation="home_hero"
                >
                  {siteData.primaryCta.label}
                </TrackedLink>
                <TrackedLink
                  className="rounded-full border border-[#c6ced6] bg-white px-5 py-2.5 text-sm font-semibold uppercase tracking-[0.08em] text-[var(--text)] hover:border-[var(--brand)]"
                  href={siteData.secondaryCta.href}
                  trackingLabel={siteData.secondaryCta.label}
                  trackingLocation="home_hero"
                >
                  {siteData.secondaryCta.label}
                </TrackedLink>
              </div>
            </div>

            <div className="relative">
              <ConstructionSystemsSlider
                images={constructionSystemSlides}
                className="relative z-10 w-full"
                intervalMs={2000}
              />
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto w-[min(1285px,calc(100%-2rem))] pt-12 pb-14">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-[var(--brand)]">Solutions Portfolio</p>
            <h2 className="mt-2 text-3xl font-semibold" style={{ fontFamily: "var(--font-heading), sans-serif" }}>
              Find Products by Category
            </h2>
            <p className="mt-2 max-w-3xl text-sm text-[var(--muted)]">
              Browse categories automatically or use left and right controls to move through the full category range.
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

        <HomeCategorySlider
          categories={categories}
          className="mt-2 w-full"
          ariaLabel="Solutions portfolio category slider"
        />
      </section>

      <section className="mx-auto w-[min(1285px,calc(100%-2rem))] py-14">
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
                  className="aspect-[1/1.42] w-full border-b border-[var(--line)] object-cover"
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

      <section className="mx-auto w-[min(1285px,calc(100%-2rem))] pb-14">
        <div className="grid gap-8 lg:grid-cols-[1fr_0.9fr] lg:items-center">
          <div className="max-w-4xl">
            <p className="text-xs uppercase tracking-[0.19em] text-[var(--brand)]">About Us</p>
            <h2 className="mt-2 text-3xl font-semibold" style={{ fontFamily: "var(--font-heading), sans-serif" }}>
              Built On A Proven Industry Story
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-[var(--muted)]">{about.intro}</p>
            <div className="mt-5 space-y-2">
              {about.sections.slice(0, 3).map((section) => (
                <p key={section.heading} className="text-sm text-[var(--text)]">
                  <span className="font-semibold">{section.heading}:</span> {section.body}
                </p>
              ))}
            </div>
            <TrackedLink
              href="/corporate/about"
              className="mt-5 inline-block rounded-full bg-[var(--brand)] px-5 py-2.5 text-sm font-semibold uppercase tracking-[0.08em] !text-white hover:bg-[var(--brand-strong)]"
              trackingLabel="Read More About Us"
              trackingLocation="home_about"
            >
              Read More
            </TrackedLink>
          </div>

          <div className="overflow-hidden">
            <Image
              src={about.heroImage}
              alt="PEVALIT factory and operations"
              width={1100}
              height={900}
              className="h-full min-h-[320px] w-full scale-[1.015] object-cover"
              loading="lazy"
            />
          </div>
        </div>
      </section>

      <section className="mx-auto w-[min(1285px,calc(100%-2rem))] pt-12 pb-20">
        <div className="grid items-start gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <article className="self-start rounded-2xl border border-[var(--line)] bg-white p-6 md:p-7 lg:sticky lg:top-24">
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

      <section className="mx-auto w-[min(1285px,calc(100%-2rem))] pb-24">
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


import Image from "next/image";
import { TrackedLink } from "@/components/tracked-link";
import { ConstructionSystemsSlider } from "@/components/construction-systems-slider";
import { HomeCatalogMobileSlider } from "@/components/home-catalog-mobile-slider";
import { catalogs, categories, corporate, siteData } from "@/lib/content";

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

  return (
    <>
      <section className="section-block bg-white text-[var(--text)]">
        <div className="site-container">
          <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
            <div>
              <p className="eyebrow text-[#586273]">Construction Systems</p>
              <h1 className="mt-3 max-w-2xl text-4xl leading-[1.03] font-semibold md:text-[3.7rem]" style={{ fontFamily: "var(--font-heading), sans-serif" }}>
                We build dependable insulation systems from foundation to finish.
              </h1>
              <p className="mt-3 max-w-xl text-base leading-relaxed text-[var(--muted)] md:text-lg">
                Reliable systems for consistent performance on modern construction projects.
              </p>
              <div className="mt-5 flex flex-wrap gap-3">
                <TrackedLink
                  className="btn-primary"
                  href={siteData.primaryCta.href}
                  trackingLabel={siteData.primaryCta.label}
                  trackingLocation="home_hero"
                >
                  {siteData.primaryCta.label}
                </TrackedLink>
                <TrackedLink
                  className="btn-secondary"
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

      <section className="section-block section-muted">
        <div className="site-container">
          <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="eyebrow">Solutions Portfolio</p>
              <h2 className="mt-2 text-3xl font-semibold md:text-4xl" style={{ fontFamily: "var(--font-heading), sans-serif" }}>
                Find Products by Category
              </h2>
              <p className="mt-2 max-w-3xl text-sm text-[var(--muted)]">
                Explore core categories and open full product lists with one click.
              </p>
            </div>
            <TrackedLink
              href="/products"
              className="btn-secondary"
              trackingLabel="View all products"
              trackingLocation="home_categories"
            >
              View all products
            </TrackedLink>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4 lg:gap-x-3 lg:gap-y-0">
            {categories.slice(0, 4).map((category) => (
              <article key={category.slug} className="relative overflow-visible bg-[var(--charcoal)] text-[var(--charcoal-text)]">
                <Image
                  src={category.heroImage}
                  alt={category.name}
                  width={640}
                  height={640}
                  className="aspect-square w-full object-cover"
                  loading="lazy"
                />
                <div className="p-3 lg:absolute lg:top-full lg:left-0 lg:z-10 lg:min-h-[132px] lg:w-full lg:bg-[var(--charcoal)] lg:p-4">
                  <h3 className="text-sm font-semibold md:text-base">{category.name}</h3>
                  <p className="mt-1 text-xs text-[var(--charcoal-muted)] md:mt-2 md:text-sm">{category.description}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section-block bg-white lg:mt-28 lg:pt-20">
        <div className="site-container">
          <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="eyebrow">Catalogues</p>
              <h2 className="mt-2 text-3xl font-semibold md:text-4xl" style={{ fontFamily: "var(--font-heading), sans-serif" }}>
                Download Technical Catalogues
              </h2>
              <p className="mt-2 max-w-3xl text-sm text-[var(--muted)]">
                Open the latest product documentation and download PDF versions directly.
              </p>
            </div>
            <TrackedLink
              href="/catalogs"
              className="btn-secondary"
              trackingLabel="View all catalogs"
              trackingLocation="home_catalogs"
            >
              View all catalogs
            </TrackedLink>
          </div>

          <HomeCatalogMobileSlider catalogs={highlightedCatalogs} />

          <div className="hidden gap-3 md:grid md:grid-cols-3">
            {highlightedCatalogs.map((catalog) => (
              <article key={catalog.slug} className="group relative overflow-hidden bg-white">
                <Image
                  src={catalog.previewImage}
                  alt={catalog.title}
                  width={700}
                  height={980}
                  className="aspect-[1/1.42] w-full object-cover"
                  loading="lazy"
                />
                <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-[var(--charcoal)] p-4 text-white transition-transform duration-300 ease-out md:translate-y-full md:group-hover:translate-y-0">
                  <p className="text-sm font-semibold">{catalog.title}</p>
                  <p className="mt-2 text-xs text-white/85">{catalog.description}</p>
                  <TrackedLink
                    href={catalog.fileUrl}
                    className="btn-primary pointer-events-auto mt-3"
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

      <section className="section-block section-muted">
        <div className="site-container">
          <div className="grid gap-8 lg:grid-cols-[1fr_0.9fr] lg:items-center">
          <div className="max-w-4xl">
            <p className="eyebrow">About Us</p>
            <h2 className="mt-2 text-3xl font-semibold md:text-4xl" style={{ fontFamily: "var(--font-heading), sans-serif" }}>
              Built On A Proven Industry Story
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-[var(--muted)]">{about.intro}</p>
            <TrackedLink
              href="/corporate/about"
              className="btn-primary mt-5"
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
              className="h-full min-h-[320px] w-full object-cover"
              loading="lazy"
            />
          </div>
        </div>
        </div>
      </section>

      <section className="section-block section-muted">
        <div className="site-container bg-white p-5 md:p-8">
          <p className="eyebrow">Technical + Commercial Support</p>
          <h2 className="mt-3 max-w-2xl text-3xl font-semibold md:text-4xl" style={{ fontFamily: "var(--font-heading), sans-serif" }}>
            Send your formulation goal and get product recommendation with documents.
          </h2>
          <p className="mt-3 max-w-2xl text-sm text-[var(--muted)]">
            Share substrate, climate, application method, and desired performance. Our team responds with suitable product options and next-step quote guidance.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <TrackedLink
              href="/contact"
              className="btn-primary"
              trackingLabel="Request Technical Quote"
              trackingLocation="home_conversion"
            >
              Request Technical Quote
            </TrackedLink>
            <TrackedLink
              href="/catalogs"
              className="btn-secondary"
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


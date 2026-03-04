import Link from "next/link";
import Image from "next/image";
import { TrackedLink } from "@/components/tracked-link";
import { HeroProductSlider } from "@/components/hero-product-slider";
import { catalogs, corporate, getCategoryNameBySlug, getProductSummary, products, siteData } from "@/lib/content";

export default function HomePage() {
  const about = corporate.about;
  const highlightedCatalogs = catalogs.slice(0, 3);
  const solutionProducts = products.map((product) => ({
    slug: product.slug,
    name: product.name,
    categoryName: getCategoryNameBySlug(product.categorySlug),
    summary: getProductSummary(product),
    imageUrl: product.imageUrl || "/images/imported/Pevalit-Catalogue-DE.jpg"
  }));
  const highlightedProducts = products.slice(0, 4);
  const reasons = [
    "Certified systems aligned with EN 12004 and ETAG 004.",
    "Consistent quality control with stable production methods.",
    "Fast technical guidance for specification and application.",
    "Regional and export coverage with practical support."
  ];
  const insulationFaqs = [
    {
      question: "Fire performance: what matters in practice?",
      answer:
        "Expanded polystyrene used in facade systems is specified with complete assembly behavior in mind. When paired with reinforcing layers and finishing plaster, systems are designed to support required reaction-to-fire classifications according to project standards."
    },
    {
      question: "Is EPS suitable for schools, public buildings, and stations?",
      answer:
        "Yes, when selected and installed according to local code requirements. The key factors are certified system components, tested assembly details, and proper execution on site."
    },
    {
      question: "Are EPS panels resistant to moisture?",
      answer:
        "EPS does not absorb moisture like open-structure materials. Good detailing, sealed joints, and proper facade layers remain essential to prevent water entry and preserve long-term thermal performance."
    },
    {
      question: "Does insulation stop walls from breathing?",
      answer:
        "Indoor humidity control depends mainly on ventilation and airtight window detailing. External insulation supports thermal stability, while indoor air management should be solved through balanced ventilation strategy."
    }
  ];

  return (
    <>
      <section className="relative overflow-hidden bg-[linear-gradient(112deg,#f3f4f6_0%,#e8ebee_52%,#dde2e8_100%)] text-[var(--text)]">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_82%_16%,rgba(255,255,255,0.75),transparent_45%)]" />
        <div className="relative mx-auto w-[min(1540px,calc(100%-2rem))] py-7 lg:py-8">
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
              <div className="absolute inset-x-10 bottom-4 h-24 rounded-full bg-[#9aa4af]/35 blur-3xl" />
              <Image
                src="/images/imported/3-2-1024x974.jpg"
                alt="PEVALIT EPS systems"
                width={1100}
                height={1048}
                className="relative z-10 ml-auto w-full max-w-[690px] object-contain drop-shadow-[0_20px_26px_rgba(46,56,67,0.25)]"
                priority
              />
            </div>
          </div>
        </div>
      </section>

      <section className="site-container pt-12 pb-14">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-[var(--brand)]">Solutions Portfolio</p>
            <h2 className="mt-2 text-3xl font-semibold" style={{ fontFamily: "var(--font-heading), sans-serif" }}>
              Explore Core Product Solutions
            </h2>
            <p className="mt-2 max-w-3xl text-sm text-[var(--muted)]">
              Drag with click-and-hold to browse key product options quickly, then open any item for full specs and documentation.
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

        <HeroProductSlider
          products={solutionProducts}
          label={null}
          className="mt-2"
          ariaLabel="Solutions portfolio slider"
        />
      </section>

      <section className="site-container py-14">
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

      <section className="bg-[#eceef1] py-14">
        <div className="site-container grid gap-8 lg:grid-cols-[1fr_1fr]">
          <article>
            <h2 className="max-w-2xl text-4xl leading-tight font-semibold text-[#2a2f36] md:text-5xl" style={{ fontFamily: "var(--font-heading), sans-serif" }}>
              How do insulated walls stay dry and durable over time?
            </h2>
            <div className="mt-4 flex items-center gap-2">
              <span className="text-[#1f6db8]">...</span>
              <span className="h-1 w-24 rounded-full bg-[#1f6db8]" />
            </div>
            <div className="mt-5 space-y-3 text-base leading-relaxed text-[#4c535c]">
              <p>
                Wall moisture issues are often caused by poor ventilation and airtight windows without proper air exchange, not by the insulation layer itself.
              </p>
              <p>
                In renovation projects, vapor generated indoors from cooking, drying, and daily use can be several times greater than outward diffusion through facade walls.
              </p>
              <p>
                Well-designed facade systems combine thermal insulation, reinforcement, and finishing layers to help control temperature stress, reduce condensation risk, and keep wall performance stable.
              </p>
              <p>
                Selecting tested components and applying them correctly on site is the decisive factor for long-term durability.
              </p>
            </div>
          </article>

          <div className="space-y-3">
            {insulationFaqs.map((item, index) => (
              <details
                key={item.question}
                open={index === 0}
                className="group border border-[#dde2e8] bg-[#f4f6f8] open:bg-white"
              >
                <summary className="flex cursor-pointer items-center justify-between gap-4 px-4 py-4 text-xl font-semibold text-[#2d333b]">
                  <span>{item.question}</span>
                  <span className="text-[var(--brand)] transition group-open:rotate-180">v</span>
                </summary>
                <div className="border-t border-[#e3e8ed] px-4 py-4">
                  <p className="text-base leading-relaxed text-[#4d5460]">{item.answer}</p>
                </div>
              </details>
            ))}
          </div>
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

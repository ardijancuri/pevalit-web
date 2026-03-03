import type { Metadata } from "next";
import Image from "next/image";
import { TrackedLink } from "@/components/tracked-link";
import { PageIntro } from "@/components/page-intro";
import { catalogs } from "@/lib/content";

export const metadata: Metadata = {
  title: "Catalogs | PEVALIT",
  description: "Browse PEVALIT catalogs with inline preview and direct download links."
};

export default function CatalogsPage() {
  return (
    <>
      <PageIntro
        eyebrow="Catalogs"
        title="Technical Catalogues, Ready To Download."
        description="Open the latest PEVALIT catalogues and download PDF versions directly."
      />
      <section className="site-container pb-20">
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {catalogs.map((catalog) => (
            <article className="overflow-hidden rounded-2xl border border-[var(--line)] bg-white" key={catalog.slug}>
              <Image
                src={catalog.previewImage}
                alt={catalog.title}
                width={700}
                height={1000}
                className="aspect-[1/1.34] w-full border-b border-[var(--line)] object-cover"
                loading="lazy"
              />
              <div className="p-5">
                <h2 className="text-xl font-semibold">{catalog.title}</h2>
                <p className="mt-2 text-sm text-[var(--muted)]">{catalog.description}</p>
                <TrackedLink
                  href={catalog.fileUrl}
                  className="mt-4 inline-block rounded-full bg-[var(--brand)] px-4 py-2 text-xs font-semibold uppercase tracking-[0.08em] !text-white hover:bg-[var(--brand-strong)]"
                  trackingLabel={`Download PDF - ${catalog.title}`}
                  trackingLocation="catalogs_grid"
                >
                  Download PDF
                </TrackedLink>
              </div>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}

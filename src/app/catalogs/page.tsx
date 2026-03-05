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
    <div className="bg-[var(--bg)]">
      <PageIntro
        eyebrow="Catalogs"
        title="Technical Catalogues, Ready To Download."
        description="Open the latest PEVALIT catalogues and download PDF versions directly."
        surface="white"
      />
      <section className="section-block bg-[var(--bg)]">
        <div className="site-container grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {catalogs.map((catalog) => (
            <article className="catalog-card overflow-hidden bg-white" key={catalog.slug}>
              <Image
                src={catalog.previewImage}
                alt={catalog.title}
                width={700}
                height={1000}
                className="aspect-[1/1.42] w-full object-cover"
                loading="lazy"
              />
              <div className="p-5">
                <h2 className="text-xl font-semibold">{catalog.title}</h2>
                <p className="mt-2 text-sm text-[var(--muted)]">{catalog.description}</p>
                <TrackedLink
                  href={catalog.fileUrl}
                  className="btn-primary mt-4"
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
    </div>
  );
}

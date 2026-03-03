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
        title="Technical catalogs with quick preview and direct download."
        description="Review portfolio documents without leaving the page, then download the latest PDF version."
      />
      <section className="site-container grid gap-6 pb-20 md:grid-cols-2">
        {catalogs.map((catalog) => (
          <article className="card overflow-hidden" key={catalog.slug}>
            <div className="p-6">
              <h2 className="text-xl font-semibold">{catalog.title}</h2>
              <p className="mt-2 text-sm text-[var(--muted)]">{catalog.description}</p>
              <Image
                src={catalog.previewImage}
                alt={catalog.title}
                width={700}
                height={1000}
                className="mt-4 aspect-[1/1.42] w-full rounded-xl border border-[var(--line)] object-cover"
                loading="lazy"
              />
              <TrackedLink
                href={catalog.fileUrl}
                className="mt-4 inline-block rounded-full bg-[var(--brand)] px-4 py-2 text-sm font-semibold !text-white hover:bg-[var(--brand-strong)]"
                trackingLabel={`Download PDF - ${catalog.title}`}
                trackingLocation="catalogs_grid"
              >
                Download PDF
              </TrackedLink>
            </div>
          </article>
        ))}
      </section>
    </>
  );
}

import type { Metadata } from "next";
import Image from "next/image";
import { TrackedLink } from "@/components/tracked-link";
import { PageIntro } from "@/components/page-intro";
import { getLocalizedContent } from "@/lib/content";
import { getUiCopy } from "@/lib/localization";
import { getCurrentLanguage } from "@/lib/server-language";

export async function generateMetadata(): Promise<Metadata> {
  const language = await getCurrentLanguage();
  const ui = getUiCopy(language);

  return {
    title: ui.catalogsPage.eyebrow,
    description: ui.catalogsPage.description
  };
}

export default async function CatalogsPage() {
  const language = await getCurrentLanguage();
  const { catalogs } = getLocalizedContent(language);
  const ui = getUiCopy(language);

  return (
    <div className="bg-[var(--bg)]">
      <PageIntro
        eyebrow={ui.catalogsPage.eyebrow}
        title={ui.catalogsPage.title}
        description={ui.catalogsPage.description}
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
                  trackingLabel={`${ui.catalogsPage.downloadPdf} - ${catalog.title}`}
                  trackingLocation="catalogs_grid"
                >
                  {ui.catalogsPage.downloadPdf}
                </TrackedLink>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}

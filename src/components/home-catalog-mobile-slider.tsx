"use client";

import Image from "next/image";
import { TrackedLink } from "@/components/tracked-link";

type MobileCatalog = {
  slug: string;
  title: string;
  description: string;
  fileUrl: string;
  previewImage: string;
};

type HomeCatalogMobileSliderProps = {
  catalogs: MobileCatalog[];
  downloadLabel: string;
};

export function HomeCatalogMobileSlider({ catalogs, downloadLabel }: HomeCatalogMobileSliderProps) {
  if (!catalogs.length) {
    return null;
  }

  return (
    <div className="md:hidden">
      <div className="flex snap-x snap-mandatory gap-3 overflow-x-auto pb-1 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
        {catalogs.map((catalog) => (
          <article key={catalog.slug} className="catalog-card shrink-0 snap-start basis-[86%] overflow-hidden bg-white">
            <Image
              src={catalog.previewImage}
              alt={catalog.title}
              width={700}
              height={980}
              className="aspect-[1/1.42] w-full object-cover"
              loading="lazy"
            />
            <div className="bg-[var(--charcoal)] p-4 text-white">
              <p className="text-sm font-semibold">{catalog.title}</p>
              <p className="mt-2 text-xs text-white/85">{catalog.description}</p>
              <TrackedLink
                href={catalog.fileUrl}
                className="btn-primary mt-3"
                trackingLabel={`${downloadLabel} - ${catalog.title}`}
                trackingLocation="home_catalogs"
              >
                {downloadLabel}
              </TrackedLink>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}

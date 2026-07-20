import Image from "next/image";
import { TrackedLink } from "@/components/tracked-link";
import { getProductSummaryFallback, localizePath, type LanguageCode } from "@/lib/localization";
import type { Product } from "@/lib/types";

type ProductCardProps = {
  language: LanguageCode;
  product: Product;
  categoryName: string;
  viewProductLabel: string;
  trackingLocation: string;
};

export function getProductCardSummary(language: LanguageCode, product: Product, categoryName: string) {
  const summary = (product.summary || "").trim();
  if (!summary || summary.toLowerCase() === product.name.toLowerCase()) {
    return getProductSummaryFallback(language, product.name, categoryName);
  }
  return summary;
}

export function ProductCard({ language, product, categoryName, viewProductLabel, trackingLocation }: ProductCardProps) {
  return (
    <TrackedLink
      className="product-card group flex h-full flex-col overflow-hidden border border-[var(--line)] bg-[var(--bg-soft)] p-0 text-[var(--text)]"
      href={localizePath(`/product/${product.slug}`, language)}
      trackingLabel={`${viewProductLabel} - ${product.name}`}
      trackingLocation={trackingLocation}
    >
      <Image
        src={product.imageUrl || "/images/imported/Pevalit-Catalogue-DE.jpg"}
        alt={product.name}
        width={700}
        height={700}
        className="aspect-square w-full object-cover"
        loading="lazy"
      />
      <div className="product-card-content flex flex-1 flex-col border-t p-5 md:p-6">
        <p className="text-xs uppercase tracking-[0.16em] text-[var(--brand)]">{categoryName}</p>
        <h2 className="mt-2 text-xl font-semibold">{product.name}</h2>
        <p className="mt-3 text-sm text-[var(--muted)]">{getProductCardSummary(language, product, categoryName)}</p>
        <div className="mt-auto pt-4">
          <span className="btn-primary transition-colors group-hover:border-[var(--brand-strong)] group-hover:bg-[var(--brand-strong)]">
            {viewProductLabel}
          </span>
        </div>
      </div>
    </TrackedLink>
  );
}

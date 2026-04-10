import Link from "next/link";
import Image from "next/image";
import { formatFooterCopyright, type LanguageCode, type UiCopy } from "@/lib/localization";

type SiteFooterProps = {
  siteData: {
    companyName: string;
    description: string;
    footerLinks: Array<{ label: string; href: string }>;
    contact: { email: string; phone: string; address: string };
  };
  language: LanguageCode;
  labels: UiCopy["footer"];
};

export function SiteFooter({ siteData, language, labels }: SiteFooterProps) {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-[var(--line)] bg-[var(--charcoal)] text-[var(--charcoal-text)]">
      <div className="site-container py-12">
        <div className="grid gap-10 pb-8 md:grid-cols-[1.25fr_0.9fr_0.9fr]">
          <div>
            <Image
              src="/images/imported/logo.svg"
              alt={siteData.companyName}
              width={228}
              height={46}
              className="h-8 w-auto"
            />
            <p className="mt-3 max-w-md text-sm text-[var(--charcoal-muted)]">{siteData.description}</p>
            <Link href="/contact" className="btn-primary mt-5">
              {labels.contactTeam}
            </Link>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--brand)]">{labels.explore}</p>
            <ul className="mt-3 space-y-2 text-sm text-[var(--charcoal-muted)]">
              {siteData.footerLinks.map((link) => (
                <li key={link.href}>
                  <Link className="hover:text-[var(--charcoal-text)]" href={link.href}>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--brand)]">{labels.contact}</p>
            <ul className="mt-3 space-y-2 text-sm text-[var(--charcoal-muted)]">
              <li>
                <a href={`mailto:${siteData.contact.email}`} className="hover:text-[var(--charcoal-text)]">
                  {siteData.contact.email}
                </a>
              </li>
              <li>
                <a href={`tel:${siteData.contact.phone}`} className="hover:text-[var(--charcoal-text)]">
                  {siteData.contact.phone}
                </a>
              </li>
              <li>{siteData.contact.address}</li>
            </ul>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap items-center justify-center gap-2 text-center text-xs text-[var(--charcoal-muted)] md:justify-between md:text-left">
          <p>{formatFooterCopyright(language, year)}</p>
          <p>{labels.certifiedSupport}</p>
        </div>
      </div>
    </footer>
  );
}

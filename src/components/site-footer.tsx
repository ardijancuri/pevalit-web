import Link from "next/link";
import Image from "next/image";
import { siteData } from "@/lib/content";

export function SiteFooter() {
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
              Contact Team
            </Link>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--brand)]">Explore</p>
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
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--brand)]">Contact</p>
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
          <p>(c) {year}. All rights reserved.</p>
          <p>Certified systems with practical technical support.</p>
        </div>
      </div>
    </footer>
  );
}

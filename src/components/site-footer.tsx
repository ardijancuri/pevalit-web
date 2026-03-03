import Link from "next/link";
import { siteData } from "@/lib/content";

export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-16 border-t border-[var(--line)] bg-white">
      <div className="site-container py-10">
        <div className="rounded-2xl border border-[var(--line)] bg-[var(--text)] p-6 text-white md:p-7">
          <div className="grid gap-8 md:grid-cols-[1.2fr_0.9fr_0.9fr]">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.08em]">{siteData.companyName}</p>
              <p className="mt-3 text-sm text-white/80">{siteData.description}</p>
              <Link
                href="/contact"
                className="mt-4 inline-block rounded-full bg-[var(--brand)] px-4 py-2 text-xs font-semibold uppercase tracking-[0.08em] !text-white hover:bg-[var(--brand-strong)]"
              >
                Contact Team
              </Link>
            </div>

            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--brand)]">Explore</p>
              <ul className="mt-3 space-y-2 text-sm text-white/80">
                {siteData.footerLinks.map((link) => (
                  <li key={link.href}>
                    <Link className="hover:text-white" href={link.href}>
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--brand)]">Contact</p>
              <ul className="mt-3 space-y-2 text-sm text-white/80">
                <li>
                  <a href={`mailto:${siteData.contact.email}`} className="hover:text-white">
                    {siteData.contact.email}
                  </a>
                </li>
                <li>
                  <a href={`tel:${siteData.contact.phone}`} className="hover:text-white">
                    {siteData.contact.phone}
                  </a>
                </li>
                <li>{siteData.contact.address}</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap items-center justify-between gap-2 text-xs text-[var(--muted)]">
          <p>{siteData.companyName} (c) {year}. All rights reserved.</p>
          <p>Certified systems with practical technical support.</p>
        </div>
      </div>
    </footer>
  );
}

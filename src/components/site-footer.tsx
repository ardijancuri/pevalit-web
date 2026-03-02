import Link from "next/link";
import { siteData } from "@/lib/content";

export function SiteFooter() {
  return (
    <footer className="mt-24 border-t border-[var(--line)] bg-white">
      <div className="site-container grid gap-8 py-10 md:grid-cols-3">
        <div>
          <p className="font-semibold">{siteData.companyName}</p>
          <p className="mt-2 text-sm text-[var(--muted)]">{siteData.description}</p>
        </div>
        <div>
          <p className="font-semibold">Explore</p>
          <ul className="mt-2 space-y-2 text-sm text-[var(--muted)]">
            {siteData.footerLinks.map((link) => (
              <li key={link.href}>
                <Link className="hover:text-[var(--brand)]" href={link.href}>
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className="font-semibold">Contact</p>
          <p className="mt-2 text-sm text-[var(--muted)]">{siteData.contact.email}</p>
          <p className="text-sm text-[var(--muted)]">{siteData.contact.phone}</p>
          <p className="text-sm text-[var(--muted)]">{siteData.contact.address}</p>
        </div>
      </div>
    </footer>
  );
}

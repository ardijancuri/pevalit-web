"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { siteData } from "@/lib/content";

export function SiteHeader() {
  const pathname = usePathname();

  function isActive(href: string) {
    if (href === "/") {
      return pathname === "/";
    }
    return pathname === href || pathname.startsWith(`${href}/`);
  }

  return (
    <header className="sticky top-0 z-20 border-b border-[var(--line)] bg-white/90 backdrop-blur">
      <div className="site-container flex items-center justify-between py-4">
        <Link href="/" className="font-semibold tracking-wide">
          {siteData.companyName}
        </Link>
        <nav aria-label="Main navigation">
          <ul className="flex flex-wrap gap-4 text-sm text-[var(--muted)]">
            {siteData.navigation.map((item) => (
              <li key={item.href}>
                <Link
                  className={`rounded-full border px-3 py-1.5 transition ${
                    isActive(item.href)
                      ? "border-[var(--brand)] bg-[var(--brand)] text-white"
                      : "border-transparent text-[var(--muted)] hover:border-[var(--brand)] hover:text-[var(--brand)]"
                  }`}
                  href={item.href}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  );
}

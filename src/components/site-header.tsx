"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRef, useState } from "react";
import { productsByCategory, siteData } from "@/lib/content";

export function SiteHeader() {
  const pathname = usePathname();
  const [productsMenuOpen, setProductsMenuOpen] = useState(false);
  const closeTimeoutRef = useRef<number | null>(null);

  function openProductsMenu() {
    if (closeTimeoutRef.current) {
      window.clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }
    setProductsMenuOpen(true);
  }

  function closeProductsMenu() {
    if (closeTimeoutRef.current) {
      window.clearTimeout(closeTimeoutRef.current);
    }
    closeTimeoutRef.current = window.setTimeout(() => {
      setProductsMenuOpen(false);
    }, 120);
  }

  function isActive(href: string) {
    if (href === "/") {
      return pathname === "/";
    }
    return pathname === href || pathname.startsWith(`${href}/`);
  }

  return (
    <header className="sticky top-0 z-20 border-b border-[var(--line)] bg-white/90 backdrop-blur relative">
      <div className="site-container flex items-center justify-between py-4">
        <Link href="/" className="font-semibold tracking-wide">
          {siteData.companyName}
        </Link>
        <nav aria-label="Main navigation">
          <ul className="flex flex-wrap gap-4 text-sm text-[var(--muted)]">
            {siteData.navigation.map((item) => {
              const baseClass = `rounded-full border px-3 py-1.5 transition ${
                isActive(item.href)
                  ? "border-[var(--brand)] bg-[var(--brand)] !text-white"
                  : "border-transparent text-[var(--muted)] hover:border-[var(--brand)] hover:text-[var(--brand)]"
              }`;

              if (item.href !== "/products") {
                return (
                  <li key={item.href}>
                    <Link className={baseClass} href={item.href}>
                      {item.label}
                    </Link>
                  </li>
                );
              }

              return (
                <li
                  key={item.href}
                  onMouseEnter={openProductsMenu}
                  onMouseLeave={closeProductsMenu}
                  onFocus={openProductsMenu}
                  onBlur={closeProductsMenu}
                >
                  <Link className={baseClass} href={item.href} aria-expanded={productsMenuOpen} aria-haspopup="menu">
                    {item.label}
                  </Link>
                  <div
                    className={`absolute left-0 right-0 top-full border-y border-[var(--line)] bg-white shadow-xl transition ${
                      productsMenuOpen ? "visible opacity-100" : "invisible opacity-0 pointer-events-none"
                    }`}
                    onMouseEnter={openProductsMenu}
                    onMouseLeave={closeProductsMenu}
                  >
                    <div className="site-container py-4">
                      <div className="grid grid-cols-5 gap-3">
                        {productsByCategory.slice(0, 10).map(({ category, products }) => (
                          <Link
                            key={category.slug}
                            href={`/products/${category.slug}`}
                            className="overflow-hidden rounded-xl border border-[var(--line)] hover:border-[var(--brand)]"
                          >
                            <img
                              src={products[0]?.imageUrl || category.heroImage || "/images/imported/Pevalit-Catalogue-DE.jpg"}
                              alt={category.name}
                              className="aspect-square w-full border-b border-[var(--line)] object-cover"
                              loading="lazy"
                            />
                            <p className="p-2 text-xs font-semibold text-[var(--text)]">{category.name}</p>
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>
    </header>
  );
}

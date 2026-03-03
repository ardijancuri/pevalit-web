"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRef, useState } from "react";
import { productsByCategory, siteData } from "@/lib/content";

export function SiteHeader() {
  const pathname = usePathname();
  const [productsMenuOpen, setProductsMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
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
    }, 260);
  }

  function isActive(href: string) {
    if (href === "/") {
      return pathname === "/";
    }
    return pathname === href || pathname.startsWith(`${href}/`);
  }

  function closeMobileMenu() {
    setMobileMenuOpen(false);
  }

  return (
    <header className="sticky top-0 z-20 border-b border-[var(--line)] bg-white/90 backdrop-blur relative">
      <div className="site-container flex items-center justify-between py-4">
        <Link href="/" aria-label={siteData.companyName} className="inline-flex items-center">
          <Image
            src="/images/imported/logo.svg"
            alt={siteData.companyName}
            width={228}
            height={46}
            className="h-8 w-auto"
          />
        </Link>
        <button
          type="button"
          aria-label="Open menu"
          className="rounded-lg border border-[var(--line)] px-3 py-2 text-sm font-semibold text-[var(--text)] md:hidden"
          onClick={() => setMobileMenuOpen(true)}
        >
          Menu
        </button>
        <nav aria-label="Main navigation" className="hidden md:block">
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
                    className={`absolute left-0 right-0 top-[calc(100%-0.75rem)] border-y border-[var(--line)] bg-white shadow-xl transition ${
                      productsMenuOpen ? "visible opacity-100" : "invisible opacity-0 pointer-events-none"
                    }`}
                    onMouseEnter={openProductsMenu}
                    onMouseLeave={closeProductsMenu}
                  >
                    <div className="site-container pt-6 pb-4">
                      <div className="grid grid-cols-5 gap-3">
                        {productsByCategory.slice(0, 10).map(({ category, products }) => (
                          <Link
                            key={category.slug}
                            href={`/products/${category.slug}`}
                            className="overflow-hidden rounded-xl border border-[var(--line)] hover:border-[var(--brand)]"
                          >
                            <Image
                              src={products[0]?.imageUrl || category.heroImage || "/images/imported/Pevalit-Catalogue-DE.jpg"}
                              alt={category.name}
                              width={600}
                              height={600}
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

      <aside
        className={`fixed inset-0 z-50 h-dvh w-full overflow-y-auto bg-white p-5 shadow-2xl transition-all md:hidden ${
          mobileMenuOpen ? "visible translate-y-0 opacity-100" : "invisible translate-y-4 opacity-0"
        }`}
      >
        <div className="mb-5 flex items-center justify-between">
          <Image
            src="/images/imported/logo.svg"
            alt={siteData.companyName}
            width={228}
            height={46}
            className="h-7 w-auto"
          />
          <button
            type="button"
            aria-label="Close menu"
            className="rounded-lg border border-[var(--line)] px-3 py-1.5 text-sm font-semibold"
            onClick={closeMobileMenu}
          >
            Close
          </button>
        </div>

        <ul className="space-y-2">
          {siteData.navigation.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                onClick={closeMobileMenu}
                className={`block rounded-lg border px-3 py-2 text-sm font-semibold ${
                  isActive(item.href)
                    ? "border-[var(--brand)] bg-[var(--brand)] !text-white"
                    : "border-[var(--line)] text-[var(--text)]"
                }`}
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="mt-6">
          <p className="text-xs uppercase tracking-[0.16em] text-[var(--brand)]">Product Categories</p>
          <ul className="mt-3 space-y-2">
            {productsByCategory.slice(0, 10).map(({ category }) => (
              <li key={category.slug}>
                <Link
                  href={`/products/${category.slug}`}
                  onClick={closeMobileMenu}
                  className="block rounded-lg border border-[var(--line)] px-3 py-2 text-sm text-[var(--text)]"
                >
                  {category.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </aside>
    </header>
  );
}

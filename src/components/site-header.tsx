"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { productsByCategory, siteData } from "@/lib/content";

type LanguageCode = "en" | "sq" | "mk" | "de";

const LANGUAGE_OPTIONS: Array<{ code: LanguageCode; label: string; short: string }> = [
  { code: "en", label: "ENGLISH (US)", short: "EN (US)" },
  { code: "sq", label: "ALBANIAN (ALB)", short: "ALB" },
  { code: "mk", label: "MACEDONIAN (MK)", short: "MK" },
  { code: "de", label: "GERMAN (DE)", short: "DE" }
];

const HEADER_COPY: Record<LanguageCode, { menu: string; close: string; productCategories: string; nav: Record<string, string> }> = {
  en: {
    menu: "Menu",
    close: "Close",
    productCategories: "Product Categories",
    nav: {
      "/": "Home",
      "/products": "Products",
      "/catalogs": "Catalogs",
      "/corporate/about": "Corporate",
      "/contact": "Contact"
    }
  },
  sq: {
    menu: "Menu",
    close: "Mbyll",
    productCategories: "Kategorite e Produkteve",
    nav: {
      "/": "Kreu",
      "/products": "Produktet",
      "/catalogs": "Kataloget",
      "/corporate/about": "Korporata",
      "/contact": "Kontakt"
    }
  },
  mk: {
    menu: "Мени",
    close: "Затвори",
    productCategories: "Категории на производи",
    nav: {
      "/": "Дома",
      "/products": "Производи",
      "/catalogs": "Каталози",
      "/corporate/about": "Корпоративно",
      "/contact": "Контакт"
    }
  },
  de: {
    menu: "Menue",
    close: "Schliessen",
    productCategories: "Produktkategorien",
    nav: {
      "/": "Startseite",
      "/products": "Produkte",
      "/catalogs": "Kataloge",
      "/corporate/about": "Unternehmen",
      "/contact": "Kontakt"
    }
  }
};

export function SiteHeader() {
  const pathname = usePathname();
  const [productsMenuOpen, setProductsMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [language, setLanguage] = useState<LanguageCode>("en");
  const [languageMenuOpen, setLanguageMenuOpen] = useState(false);
  const closeTimeoutRef = useRef<number | null>(null);
  const mobileMenuRef = useRef<HTMLElement | null>(null);
  const languageMenuRef = useRef<HTMLDivElement | null>(null);

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

  function onLanguageChange(nextLanguage: LanguageCode) {
    setLanguage(nextLanguage);
    setLanguageMenuOpen(false);
    if (typeof window !== "undefined") {
      window.localStorage.setItem("site-language", nextLanguage);
    }
    document.documentElement.lang = nextLanguage;
  }

  const selectedLanguage = LANGUAGE_OPTIONS.find((item) => item.code === language) || LANGUAGE_OPTIONS[0];
  const headerCopy = HEADER_COPY[language];

  useEffect(() => {
    if (!mobileMenuOpen) {
      document.body.style.overflow = "";
      return;
    }

    document.body.style.overflow = "hidden";
    const focusable = mobileMenuRef.current?.querySelectorAll<HTMLElement>(
      'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])'
    );
    focusable?.[0]?.focus();

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        event.preventDefault();
        closeMobileMenu();
        return;
      }

      if (event.key !== "Tab" || !focusable?.length) {
        return;
      }

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      const activeElement = document.activeElement as HTMLElement | null;

      if (event.shiftKey && activeElement === first) {
        event.preventDefault();
        last.focus();
      }

      if (!event.shiftKey && activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }

    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [mobileMenuOpen]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const savedLanguage = window.localStorage.getItem("site-language");
    if (savedLanguage && LANGUAGE_OPTIONS.some((item) => item.code === savedLanguage)) {
      const validLanguage = savedLanguage as LanguageCode;
      setLanguage(validLanguage);
      document.documentElement.lang = validLanguage;
      return;
    }
    document.documentElement.lang = "en";
  }, []);

  useEffect(() => {
    function onPointerDown(event: MouseEvent) {
      if (!languageMenuRef.current?.contains(event.target as Node)) {
        setLanguageMenuOpen(false);
      }
    }
    window.addEventListener("mousedown", onPointerDown);
    return () => window.removeEventListener("mousedown", onPointerDown);
  }, []);

  return (
    <header className="sticky top-0 z-40 bg-transparent px-2 pt-2">
      <div className="rounded-md border border-[#d4dbe1] bg-[linear-gradient(90deg,#eff2f5_0%,#e6eaee_100%)] text-[var(--text)] shadow-[0_8px_20px_rgba(24,39,56,0.12)]">
        <div className="mx-auto flex w-[min(1540px,calc(100%-1rem))] items-stretch justify-between gap-3 py-0">
          <div className="flex items-stretch">
            <span className="hidden w-16 bg-[var(--brand)] lg:block" />
            <Link href="/" aria-label={siteData.companyName} className="inline-flex items-center bg-white px-4 md:px-5">
              <Image
                src="/images/imported/logo.svg"
                alt={siteData.companyName}
                width={228}
                height={46}
                className="h-8 w-auto"
              />
            </Link>
          </div>

          <button
            type="button"
            aria-label="Open menu"
            aria-controls="mobile-menu"
            aria-expanded={mobileMenuOpen}
            className="my-2 rounded-lg border border-[#c7ced6] bg-white px-3 py-2 text-xs font-semibold uppercase tracking-[0.08em] text-[var(--text)] md:hidden"
            onClick={() => setMobileMenuOpen(true)}
          >
            {headerCopy.menu}
          </button>

          <div className="hidden min-w-0 flex-1 items-center justify-between md:flex">
            <nav aria-label="Main navigation" className="min-w-0 pl-5">
              <ul className="flex flex-wrap items-center gap-x-5 text-sm">
                {siteData.navigation.map((item) => {
                  const baseClass = `inline-flex border-b-2 px-0.5 py-5 text-[0.72rem] font-semibold uppercase tracking-[0.08em] transition ${
                    isActive(item.href)
                      ? "border-[var(--brand)] text-[var(--text)]"
                      : "border-transparent text-[#5b6570] hover:border-[#97a1ac] hover:text-[var(--text)]"
                  }`;
                  const translatedLabel = headerCopy.nav[item.href] || item.label;

                  if (item.href !== "/products") {
                    return (
                      <li key={item.href}>
                        <Link className={baseClass} href={item.href}>
                          {translatedLabel}
                        </Link>
                      </li>
                    );
                  }

                  return (
                    <li
                      key={item.href}
                      className="relative"
                      onMouseEnter={openProductsMenu}
                      onMouseLeave={closeProductsMenu}
                      onFocus={openProductsMenu}
                      onBlur={closeProductsMenu}
                    >
                      <Link className={baseClass} href={item.href} aria-expanded={productsMenuOpen} aria-haspopup="menu">
                        {translatedLabel}
                      </Link>
                      <div
                        className={`absolute left-1/2 top-full z-40 mt-2 w-[min(1040px,calc(100vw-2rem))] -translate-x-1/2 rounded-xl border border-[var(--line)] bg-white shadow-2xl transition ${
                          productsMenuOpen ? "visible opacity-100" : "invisible opacity-0 pointer-events-none"
                        }`}
                        onMouseEnter={openProductsMenu}
                        onMouseLeave={closeProductsMenu}
                      >
                        <div className="p-4">
                          <div className="grid grid-cols-2 gap-3 lg:grid-cols-5">
                            {productsByCategory.slice(0, 10).map(({ category, products }) => (
                              <Link
                                key={category.slug}
                                href={`/products/${category.slug}`}
                                className="overflow-hidden rounded-lg border border-[var(--line)] bg-white hover:border-[var(--brand)]"
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

            <div className="flex shrink-0 items-center gap-4">
              <div className="relative" ref={languageMenuRef}>
                <button
                  type="button"
                  aria-label="Change language"
                  aria-expanded={languageMenuOpen}
                  className="rounded-full border border-[#c7ced6] bg-white px-3 py-1.5 text-[0.68rem] font-semibold uppercase tracking-[0.08em] text-[var(--text)]"
                  onClick={() => setLanguageMenuOpen((prev) => !prev)}
                >
                  {selectedLanguage.short}
                </button>
                <ul
                  className={`absolute right-0 mt-2 min-w-[12rem] rounded-xl border border-[var(--line)] bg-white p-1 shadow-xl transition ${
                    languageMenuOpen ? "visible opacity-100" : "invisible opacity-0"
                  }`}
                >
                  {LANGUAGE_OPTIONS.map((option) => (
                    <li key={option.code}>
                      <button
                        type="button"
                        onClick={() => onLanguageChange(option.code)}
                        className={`w-full rounded-lg px-3 py-2 text-left text-xs font-semibold ${
                          option.code === language ? "bg-[var(--brand)] !text-white" : "text-[var(--text)] hover:bg-[var(--accent)]"
                        }`}
                      >
                        {option.label}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="hidden flex-col text-right text-[0.76rem] leading-tight font-semibold lg:flex">
                <a href={`tel:${siteData.contact.phone}`} className="text-[#4f5964] hover:text-[var(--text)]">
                  {siteData.contact.phone}
                </a>
                <a href={`mailto:${siteData.contact.email}`} className="mt-1 text-[#4f5964] hover:text-[var(--text)]">
                  {siteData.contact.email}
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      <aside
        id="mobile-menu"
        ref={mobileMenuRef}
        role="dialog"
        aria-modal="true"
        aria-label="Mobile navigation"
        aria-hidden={!mobileMenuOpen}
        className={`fixed inset-0 z-50 h-dvh w-full overflow-y-auto bg-white p-5 shadow-2xl transition-all md:hidden ${
          mobileMenuOpen ? "visible translate-y-0 opacity-100" : "invisible pointer-events-none translate-y-4 opacity-0"
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
            {headerCopy.close}
          </button>
        </div>

        <div className="mb-4 rounded-xl border border-[var(--line)] p-3">
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.16em] text-[var(--brand)]">Language</p>
          <div className="grid grid-cols-2 gap-2">
            {LANGUAGE_OPTIONS.map((option) => (
              <button
                key={option.code}
                type="button"
                onClick={() => onLanguageChange(option.code)}
                className={`rounded-lg border px-3 py-2 text-xs font-semibold ${
                  option.code === language
                    ? "border-[var(--brand)] bg-[var(--brand)] !text-white"
                    : "border-[var(--line)] text-[var(--text)]"
                }`}
              >
                {option.short}
              </button>
            ))}
          </div>
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
                {headerCopy.nav[item.href] || item.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="mt-6">
          <p className="text-xs uppercase tracking-[0.16em] text-[var(--brand)]">{headerCopy.productCategories}</p>
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

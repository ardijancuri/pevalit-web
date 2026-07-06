"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import {
  LANGUAGE_OPTIONS,
  localizePath,
  stripLocaleFromPath,
  switchLocalePath,
  type LanguageOption,
  type LanguageCode
} from "@/lib/localization";

type SiteHeaderProps = {
  companyName: string;
  navigation: Array<{ label: string; href: string }>;
  productsByCategory: Array<{ category: { slug: string; name: string } }>;
  initialLanguage: LanguageCode;
  labels: {
    changeLanguage: string;
    openMenu: string;
    closeMenu: string;
    mobileNavigation: string;
  };
};

function LanguageFlag({ option }: { option: LanguageOption }) {
  return (
    <Image
      src={option.flagSrc}
      alt={option.flagAlt}
      width={20}
      height={14}
      className="h-3.5 w-5 shrink-0 rounded-[2px] border border-black/10 object-cover"
    />
  );
}

export function SiteHeader({
  companyName,
  navigation,
  productsByCategory,
  initialLanguage,
  labels
}: SiteHeaderProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [productsMenuOpen, setProductsMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileCategoriesOpen, setMobileCategoriesOpen] = useState(false);
  const [language, setLanguage] = useState<LanguageCode>(initialLanguage);
  const [desktopLanguageMenuOpen, setDesktopLanguageMenuOpen] = useState(false);
  const [mobileLanguageMenuOpen, setMobileLanguageMenuOpen] = useState(false);
  const closeTimeoutRef = useRef<number | null>(null);
  const mobileMenuRef = useRef<HTMLElement | null>(null);
  const desktopLanguageMenuRef = useRef<HTMLDivElement | null>(null);
  const mobileLanguageMenuRef = useRef<HTMLDivElement | null>(null);

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
    const currentPath = stripLocaleFromPath(pathname);

    if (href === "/") {
      return currentPath === "/";
    }
    return currentPath === href || currentPath.startsWith(`${href}/`);
  }

  function closeMobileMenu() {
    setMobileMenuOpen(false);
    setMobileCategoriesOpen(false);
  }

  function onLanguageChange(nextLanguage: LanguageCode) {
    setLanguage(nextLanguage);
    setDesktopLanguageMenuOpen(false);
    setMobileLanguageMenuOpen(false);
    const queryString = typeof window === "undefined" ? "" : window.location.search;
    const hash = typeof window === "undefined" ? "" : window.location.hash;
    const nextPath = switchLocalePath(pathname, nextLanguage);
    router.push(`${nextPath}${queryString}${hash}`);
  }

  const selectedLanguage = LANGUAGE_OPTIONS.find((item) => item.code === language) || LANGUAGE_OPTIONS[0];

  useEffect(() => {
    setLanguage(initialLanguage);
    document.documentElement.lang = initialLanguage;
  }, [initialLanguage]);

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
    function onPointerDown(event: MouseEvent) {
      const targetNode = event.target as Node;
      if (!desktopLanguageMenuRef.current?.contains(targetNode) && !mobileLanguageMenuRef.current?.contains(targetNode)) {
        setDesktopLanguageMenuOpen(false);
        setMobileLanguageMenuOpen(false);
      }
    }

    window.addEventListener("mousedown", onPointerDown);
    return () => window.removeEventListener("mousedown", onPointerDown);
  }, []);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-[var(--line)] bg-white">
      <div className="site-container text-[var(--text)]">
        <div className="flex items-stretch justify-between gap-3 py-0">
          <div className="flex items-stretch">
            <span className="hidden w-16 bg-[var(--brand)] lg:block" />
            <Link href={localizePath("/", language)} aria-label={companyName} className="inline-flex items-center bg-white pl-0 pr-3 md:px-5">
              <Image
                src="/images/imported/logo.svg"
                alt={companyName}
                width={228}
                height={46}
                className="h-7 w-auto md:h-8"
              />
            </Link>
          </div>

          <div className="flex items-center gap-1 md:hidden">
            <div className="relative" ref={mobileLanguageMenuRef}>
              <button
                type="button"
                aria-label={labels.changeLanguage}
                aria-expanded={mobileLanguageMenuOpen}
                className="inline-flex h-10 items-center justify-center gap-1.5 px-2 text-[0.68rem] font-semibold uppercase tracking-[0.08em] text-[var(--text)]"
                onClick={() => setMobileLanguageMenuOpen((prev) => !prev)}
              >
                <LanguageFlag option={selectedLanguage} />
                <span>{selectedLanguage.short}</span>
              </button>
              <ul
                className={`absolute right-0 mt-2 min-w-[11rem] rounded-[8px] border border-[var(--line)] bg-white p-1 transition ${
                  mobileLanguageMenuOpen ? "visible opacity-100" : "invisible opacity-0"
                }`}
              >
                {LANGUAGE_OPTIONS.map((option) => (
                  <li key={option.code}>
                    <button
                      type="button"
                      onClick={() => onLanguageChange(option.code)}
                      className={`flex w-full items-center gap-2 rounded-[6px] px-3 py-2 text-left text-xs font-semibold ${
                        option.code === language ? "bg-[var(--brand)] !text-white" : "text-[var(--text)] hover:bg-[var(--accent)]"
                      }`}
                    >
                      <LanguageFlag option={option} />
                      <span>{option.label}</span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            <button
              type="button"
              aria-label={labels.openMenu}
              aria-controls="mobile-menu"
              aria-expanded={mobileMenuOpen}
              className="my-2 inline-flex h-10 w-10 items-center justify-center bg-transparent text-[var(--text)]"
              onClick={() => setMobileMenuOpen(true)}
            >
              <svg
                aria-hidden="true"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-6 w-6"
              >
                <path d="M4 7h16" />
                <path d="M4 12h16" />
                <path d="M4 17h16" />
              </svg>
            </button>
          </div>

          <div className="hidden min-w-0 flex-1 items-center justify-between pr-6 md:flex">
            <nav aria-label="Main navigation" className="relative min-w-0 pl-5">
              <ul className="flex flex-wrap items-center gap-x-5 text-sm">
                {navigation.map((item) => {
                  const baseClass = `inline-flex border-b-2 px-0.5 py-5 text-[0.72rem] font-semibold uppercase tracking-[0.08em] transition ${
                    isActive(item.href)
                      ? "border-[var(--brand)] text-[var(--text)]"
                      : "border-transparent text-[#5b6570] hover:text-[var(--text)]"
                  }`;

                  if (item.href !== "/products") {
                    return (
                      <li key={item.href}>
                        <Link className={baseClass} href={localizePath(item.href, language)}>
                          {item.label}
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
                      <Link className={baseClass} href={localizePath(item.href, language)} aria-expanded={productsMenuOpen} aria-haspopup="menu">
                        {item.label}
                      </Link>
                      <div
                        className={`absolute left-0 top-full z-40 mt-0 min-w-[16rem] border-x border-b border-[var(--line)] bg-white py-2 transition ${
                          productsMenuOpen ? "visible opacity-100" : "invisible pointer-events-none opacity-0"
                        }`}
                        onMouseEnter={openProductsMenu}
                        onMouseLeave={closeProductsMenu}
                      >
                        <ul className="space-y-0.5">
                          {productsByCategory.map(({ category }) => (
                            <li key={category.slug}>
                              <Link
                                href={localizePath(`/products/${category.slug}`, language)}
                                className="block px-3 py-2 text-[0.68rem] font-semibold uppercase tracking-[0.08em] text-[var(--text)] hover:bg-[var(--bg-soft)]"
                              >
                                {category.name}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </nav>

            <div className="flex shrink-0 items-center gap-4">
              <div className="relative" ref={desktopLanguageMenuRef}>
                <button
                  type="button"
                  aria-label={labels.changeLanguage}
                  aria-expanded={desktopLanguageMenuOpen}
                  className="inline-flex items-center gap-2 rounded-[8px] border border-[var(--line)] bg-white px-3 py-1.5 text-[0.68rem] font-semibold uppercase tracking-[0.08em] text-[var(--text)]"
                  onClick={() => setDesktopLanguageMenuOpen((prev) => !prev)}
                >
                  <LanguageFlag option={selectedLanguage} />
                  <span>{selectedLanguage.short}</span>
                </button>
                <ul
                  className={`absolute right-0 mt-2 min-w-[12rem] rounded-[8px] border border-[var(--line)] bg-white p-1 transition ${
                    desktopLanguageMenuOpen ? "visible opacity-100" : "invisible opacity-0"
                  }`}
                >
                  {LANGUAGE_OPTIONS.map((option) => (
                    <li key={option.code}>
                      <button
                        type="button"
                        onClick={() => onLanguageChange(option.code)}
                        className={`flex w-full items-center gap-2 rounded-[6px] px-3 py-2 text-left text-xs font-semibold ${
                          option.code === language ? "bg-[var(--brand)] !text-white" : "text-[var(--text)] hover:bg-[var(--accent)]"
                        }`}
                      >
                        <LanguageFlag option={option} />
                        <span>{option.label}</span>
                      </button>
                    </li>
                  ))}
                </ul>
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
        aria-label={labels.mobileNavigation}
        aria-hidden={!mobileMenuOpen}
        className={`fixed inset-0 z-50 h-dvh w-full overflow-y-auto bg-white p-5 transition-all md:hidden ${
          mobileMenuOpen ? "visible translate-y-0 opacity-100" : "invisible pointer-events-none translate-y-4 opacity-0"
        }`}
      >
        <div className="mb-5 flex items-center justify-between border-b border-[var(--line)] pb-3">
          <Image
            src="/images/imported/logo.svg"
            alt={companyName}
            width={180}
            height={36}
            className="h-6 w-auto"
          />
          <button
            type="button"
            aria-label={labels.closeMenu}
            className="inline-flex h-9 w-9 items-center justify-center text-[var(--text)]"
            onClick={closeMobileMenu}
          >
            <svg
              aria-hidden="true"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-5 w-5"
            >
              <path d="M18 6 6 18" />
              <path d="m6 6 12 12" />
            </svg>
          </button>
        </div>

        <ul className="space-y-2">
          {navigation.map((item) => {
            if (item.href === "/products") {
              return (
                <li key={item.href}>
                  <button
                    type="button"
                    className={`flex w-full items-center justify-between px-3 py-2 text-left text-sm font-semibold ${
                      isActive(item.href) ? "bg-[var(--brand)] !text-white" : "text-[var(--text)]"
                    }`}
                    aria-expanded={mobileCategoriesOpen}
                    onClick={() => setMobileCategoriesOpen((prev) => !prev)}
                  >
                    <span>{item.label}</span>
                    <span className={`inline-flex h-5 w-5 items-center justify-center transition-transform ${mobileCategoriesOpen ? "rotate-180" : ""}`}>
                      <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
                        <path d="m6 9 6 6 6-6" />
                      </svg>
                    </span>
                  </button>

                  {mobileCategoriesOpen ? (
                    <div className="bg-[var(--bg-soft)] p-2">
                      <ul className="space-y-1">
                        <li>
                          <Link
                            href={localizePath("/products", language)}
                            onClick={closeMobileMenu}
                            className="block px-2 py-2 text-sm font-semibold text-[var(--text)] hover:bg-white"
                          >
                            {item.label}
                          </Link>
                        </li>
                        {productsByCategory.map(({ category }) => (
                          <li key={category.slug}>
                            <Link
                              href={localizePath(`/products/${category.slug}`, language)}
                              onClick={closeMobileMenu}
                              className="block px-2 py-2 text-sm text-[var(--text)] hover:bg-white"
                            >
                              {category.name}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ) : null}
                </li>
              );
            }

            return (
              <li key={item.href}>
                <Link
                  href={localizePath(item.href, language)}
                  onClick={closeMobileMenu}
                  className={`block px-3 py-2 text-sm font-semibold ${
                    isActive(item.href)
                      ? "bg-[var(--brand)] !text-white"
                      : "text-[var(--text)]"
                  }`}
                >
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </aside>
    </header>
  );
}

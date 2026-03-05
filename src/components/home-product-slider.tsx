"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState, type PointerEvent as ReactPointerEvent } from "react";

type FeaturedProduct = {
  slug: string;
  name: string;
  imageUrl: string;
  categoryName: string;
  summary: string;
  applications: string[];
  benefits: string[];
  documentsCount: number;
};

type HomeProductSliderProps = {
  products: FeaturedProduct[];
};

const FALLBACK_IMAGE = "/images/imported/Pevalit-Catalogue-DE.jpg";
const AUTO_ADVANCE_MS = 7000;
const MIN_SWIPE_PX = 80;

function getSlideMetrics(product: FeaturedProduct) {
  return [
    { label: "Category", value: product.categoryName },
    { label: "Product", value: product.name },
    { label: "Applications", value: product.applications.slice(0, 2).join(", ") || "General use" },
    { label: "Benefits", value: product.benefits.slice(0, 2).join(", ") || "Stable quality" },
    { label: "Documents", value: `${product.documentsCount} available` }
  ];
}

export function HomeProductSlider({ products }: HomeProductSliderProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [dragOffset, setDragOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const autoplayDirectionRef = useRef<1 | -1>(1);
  const viewportRef = useRef<HTMLDivElement | null>(null);
  const pointerIdRef = useRef<number | null>(null);
  const dragStartXRef = useRef(0);

  useEffect(() => {
    if (products.length < 2 || isDragging) {
      return;
    }

    const intervalId = window.setInterval(() => {
      setActiveIndex((current) => {
        const lastIndex = products.length - 1;

        if (autoplayDirectionRef.current === 1) {
          if (current >= lastIndex) {
            autoplayDirectionRef.current = -1;
            return Math.max(0, lastIndex - 1);
          }
          return current + 1;
        }

        if (current <= 0) {
          autoplayDirectionRef.current = 1;
          return Math.min(lastIndex, 1);
        }
        return current - 1;
      });
    }, AUTO_ADVANCE_MS);

    return () => window.clearInterval(intervalId);
  }, [products.length, isDragging]);

  useEffect(() => {
    if (products.length === 0) {
      return;
    }
    setActiveIndex((current) => current % products.length);
  }, [products.length]);

  const activeProduct = products[activeIndex] ?? null;

  if (!activeProduct) {
    return null;
  }

  const handlePointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (products.length < 2) {
      return;
    }
    const target = event.target as HTMLElement;
    if (target.closest("a,button")) {
      return;
    }
    pointerIdRef.current = event.pointerId;
    dragStartXRef.current = event.clientX;
    setIsDragging(true);
    setDragOffset(0);
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const handlePointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (!isDragging || pointerIdRef.current !== event.pointerId) {
      return;
    }
    setDragOffset(event.clientX - dragStartXRef.current);
  };

  const finishDrag = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (!isDragging || pointerIdRef.current !== event.pointerId) {
      return;
    }

    const deltaX = event.clientX - dragStartXRef.current;
    const viewportWidth = viewportRef.current?.clientWidth ?? 0;
    const threshold = Math.max(MIN_SWIPE_PX, viewportWidth * 0.14);

    if (deltaX <= -threshold) {
      setActiveIndex((current) => (current + 1) % products.length);
    } else if (deltaX >= threshold) {
      setActiveIndex((current) => (current - 1 + products.length) % products.length);
    }

    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
    pointerIdRef.current = null;
    setDragOffset(0);
    setIsDragging(false);
  };

  const cancelDrag = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (!isDragging || pointerIdRef.current !== event.pointerId) {
      return;
    }
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
    pointerIdRef.current = null;
    setDragOffset(0);
    setIsDragging(false);
  };

  const trackStyle = {
    transform: `translate3d(calc(${-activeIndex * 100}% + ${dragOffset}px), 0, 0)`,
    transition: isDragging ? "none" : "transform 500ms cubic-bezier(0.22, 1, 0.36, 1)"
  };

  return (
    <section className="site-container pt-6 pb-1">
      <div
        className={`w-full touch-pan-y select-none overflow-hidden rounded-[8px] bg-[var(--surface)] ${
          isDragging ? "cursor-grabbing" : "cursor-grab"
        }`}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={finishDrag}
        onPointerCancel={cancelDrag}
        onDragStart={(event) => event.preventDefault()}
      >
        <div
          ref={viewportRef}
          className="overflow-hidden"
        >
          <div className="flex will-change-transform" style={trackStyle}>
            {products.map((product, index) => (
              <article key={product.slug} className="grid min-w-full lg:grid-cols-12">
                <div className="order-2 bg-[var(--text)] px-5 py-6 text-white lg:order-1 lg:col-span-5 lg:px-7 lg:py-7">
                  <p className="text-xs uppercase tracking-[0.18em] text-[var(--brand)]">Featured Products</p>
                  <h2 className="mt-3 text-2xl font-semibold lg:text-3xl" style={{ fontFamily: "var(--font-heading), sans-serif" }}>
                    {product.name}
                  </h2>
                  <p className="mt-3 text-sm text-white/80">{product.summary}</p>

                  <div className="mt-5 grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-5">
                    {getSlideMetrics(product).map((metric) => (
                      <article key={metric.label} className="rounded-lg border border-white/20 bg-white/8 p-2.5">
                        <p className="text-[0.65rem] uppercase tracking-[0.14em] text-[var(--brand)]">{metric.label}</p>
                        <p className="mt-1 text-xs leading-snug text-white/95">{metric.value}</p>
                      </article>
                    ))}
                  </div>
                </div>

                <div className="relative order-1 min-h-[260px] lg:order-2 lg:col-span-7 lg:min-h-[440px]">
                  <Image
                    src={product.imageUrl || FALLBACK_IMAGE}
                    alt={product.name}
                    fill
                    sizes="(min-width: 1024px) 65vw, 100vw"
                    className="pointer-events-none object-cover"
                    draggable={false}
                    priority={index === 0}
                  />
                  <div className="pointer-events-none absolute inset-0 bg-[var(--text)]/30" />
                </div>
              </article>
            ))}
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 bg-[var(--surface)] px-5 py-3 sm:px-7">
          <button
            type="button"
            aria-label="Previous product"
            onClick={() => setActiveIndex((current) => (current - 1 + products.length) % products.length)}
            className="rounded-[8px] border border-[var(--line)] bg-white px-4 py-2 text-xs font-semibold uppercase tracking-[0.12em] text-[var(--text)] hover:border-[var(--brand)]"
          >
            &larr;
          </button>
          <button
            type="button"
            aria-label="Next product"
            onClick={() => setActiveIndex((current) => (current + 1) % products.length)}
            className="rounded-[8px] border border-[var(--line)] bg-white px-4 py-2 text-xs font-semibold uppercase tracking-[0.12em] text-[var(--text)] hover:border-[var(--brand)]"
          >
            &rarr;
          </button>
          <div className="flex flex-wrap gap-1.5 sm:ml-2">
            {products.map((product, index) => (
              <button
                key={product.slug}
                type="button"
                aria-label={`Go to ${product.name}`}
                onClick={() => setActiveIndex(index)}
                className={`h-2.5 w-2.5 rounded-full transition-colors ${
                  index === activeIndex ? "bg-[var(--brand)]" : "bg-[var(--line)] hover:bg-[var(--muted)]"
                }`}
              />
            ))}
          </div>
          <Link
            href={`/product/${activeProduct.slug}`}
            className="ml-auto rounded-[8px] bg-[var(--brand)] px-4 py-2 text-xs font-semibold uppercase tracking-[0.12em] !text-white hover:bg-[var(--brand-strong)]"
          >
            View product
          </Link>
        </div>
      </div>
    </section>
  );
}

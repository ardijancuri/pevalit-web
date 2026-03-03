"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState, type PointerEvent as ReactPointerEvent } from "react";

type MiniProduct = {
  slug: string;
  name: string;
  imageUrl: string;
  categoryName: string;
  categorySlug: string;
};

type HomeMiniProductSliderProps = {
  products: MiniProduct[];
};

const FALLBACK_IMAGE = "/images/imported/Pevalit-Catalogue-DE.jpg";
const AUTO_SCROLL_MS = 3000;

function getMiniImageClass(categorySlug: string) {
  if (categorySlug === "eps-polystyrene-sheets") {
    return "object-contain p-2";
  }

  if (categorySlug === "plasters") {
    return "object-cover object-[center_40%] scale-[0.93]";
  }

  return "object-cover object-center";
}

export function HomeMiniProductSlider({ products }: HomeMiniProductSliderProps) {
  const viewportRef = useRef<HTMLDivElement | null>(null);
  const autoDirectionRef = useRef<1 | -1>(1);
  const pointerIdRef = useRef<number | null>(null);
  const startXRef = useRef(0);
  const startScrollLeftRef = useRef(0);
  const movedRef = useRef(false);
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    const viewport = viewportRef.current;
    if (!viewport || products.length < 2 || isDragging) {
      return;
    }

    const intervalId = window.setInterval(() => {
      const firstCard = viewport.querySelector<HTMLElement>("[data-mini-card='true']");
      const step = (firstCard?.offsetWidth ?? 220) + 12;
      const maxScrollLeft = viewport.scrollWidth - viewport.clientWidth;
      if (maxScrollLeft <= 0) {
        return;
      }

      const current = viewport.scrollLeft;

      if (autoDirectionRef.current === 1) {
        if (current >= maxScrollLeft - 4) {
          autoDirectionRef.current = -1;
          viewport.scrollTo({ left: Math.max(0, maxScrollLeft - step), behavior: "smooth" });
          return;
        }
        viewport.scrollTo({ left: Math.min(maxScrollLeft, current + step), behavior: "smooth" });
        return;
      }

      if (current <= 4) {
        autoDirectionRef.current = 1;
        viewport.scrollTo({ left: Math.min(maxScrollLeft, step), behavior: "smooth" });
        return;
      }

      viewport.scrollTo({ left: Math.max(0, current - step), behavior: "smooth" });
    }, AUTO_SCROLL_MS);

    return () => window.clearInterval(intervalId);
  }, [products.length, isDragging]);

  if (products.length === 0) {
    return null;
  }

  const handlePointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    pointerIdRef.current = event.pointerId;
    startXRef.current = event.clientX;
    startScrollLeftRef.current = viewportRef.current?.scrollLeft ?? 0;
    movedRef.current = false;
    setIsDragging(true);
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const handlePointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (!isDragging || pointerIdRef.current !== event.pointerId) {
      return;
    }

    const viewport = viewportRef.current;
    if (!viewport) {
      return;
    }

    const deltaX = event.clientX - startXRef.current;
    if (Math.abs(deltaX) > 5) {
      movedRef.current = true;
    }
    viewport.scrollLeft = startScrollLeftRef.current - deltaX;
  };

  const stopDrag = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (!isDragging || pointerIdRef.current !== event.pointerId) {
      return;
    }

    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }

    pointerIdRef.current = null;
    setIsDragging(false);
  };

  return (
    <section className="site-container pb-10">
      <div className="rounded-2xl border border-[var(--line)] bg-[var(--surface)] p-4 sm:p-5">
        <div className="mb-3 flex items-center justify-between gap-2">
          <p className="text-xs uppercase tracking-[0.16em] text-[var(--brand)]">More Products</p>
          <p className="text-[0.68rem] uppercase tracking-[0.1em] text-[var(--muted)]">Grab to slide</p>
        </div>

        <div
          ref={viewportRef}
          className={`flex gap-3 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden ${
            isDragging ? "cursor-grabbing" : "cursor-grab"
          }`}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={stopDrag}
          onPointerCancel={stopDrag}
          onDragStart={(event) => event.preventDefault()}
          onClickCapture={(event) => {
            if (movedRef.current) {
              event.preventDefault();
              event.stopPropagation();
              movedRef.current = false;
            }
          }}
        >
          {products.map((product) => (
            <Link
              key={product.slug}
              href={`/product/${product.slug}`}
              data-mini-card="true"
              className="group shrink-0 min-w-[185px] max-w-[185px] overflow-hidden rounded-xl border border-[var(--line)] bg-white sm:min-w-[220px] sm:max-w-[220px]"
            >
              <div className="relative h-28 overflow-hidden border-b border-[var(--line)] bg-[#f7f8f8] sm:h-32">
                <Image
                  src={product.imageUrl || FALLBACK_IMAGE}
                  alt={product.name}
                  fill
                  sizes="220px"
                  className={`pointer-events-none ${getMiniImageClass(product.categorySlug)}`}
                  draggable={false}
                />
              </div>
              <div className="p-3">
                <p className="text-[0.62rem] uppercase tracking-[0.14em] text-[var(--brand)]">{product.categoryName}</p>
                <p className="mt-1 text-sm font-semibold leading-snug text-[var(--text)]">{product.name}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

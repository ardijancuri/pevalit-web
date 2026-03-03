"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState, type PointerEvent as ReactPointerEvent } from "react";

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

function getMiniImageClass(categorySlug: string, slug: string) {
  if (slug === "384") {
    return "object-cover object-[center_40%] scale-[0.88]";
  }

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
  const activeIndexRef = useRef(0);
  const pointerIdRef = useRef<number | null>(null);
  const dragRafRef = useRef<number | null>(null);
  const pendingScrollLeftRef = useRef<number | null>(null);
  const startXRef = useRef(0);
  const startScrollLeftRef = useRef(0);
  const movedRef = useRef(false);
  const [isDragging, setIsDragging] = useState(false);

  const getCardTargets = useCallback(() => {
    const viewport = viewportRef.current;
    if (!viewport) {
      return [];
    }
    const maxScrollLeft = Math.max(0, viewport.scrollWidth - viewport.clientWidth);
    const cards = Array.from(viewport.querySelectorAll<HTMLElement>("[data-mini-card='true']"));
    const targets = cards.map((card) => Math.min(card.offsetLeft, maxScrollLeft));
    return Array.from(new Set(targets.map((value) => Math.round(value)))).sort((a, b) => a - b);
  }, []);

  const scrollToCard = useCallback((index: number, behavior: ScrollBehavior) => {
    const viewport = viewportRef.current;
    if (!viewport) {
      return false;
    }

    const targets = getCardTargets();
    if (targets.length === 0) {
      return false;
    }

    const safeIndex = Math.max(0, Math.min(index, targets.length - 1));
    activeIndexRef.current = safeIndex;
    viewport.scrollTo({ left: targets[safeIndex], behavior });
    return true;
  }, [getCardTargets]);

  const flushPendingDragScroll = useCallback(() => {
    const viewport = viewportRef.current;
    if (viewport && pendingScrollLeftRef.current !== null) {
      viewport.scrollLeft = pendingScrollLeftRef.current;
    }
    dragRafRef.current = null;
  }, []);

  useEffect(() => {
    return () => {
      if (dragRafRef.current !== null) {
        window.cancelAnimationFrame(dragRafRef.current);
      }
    };
  }, []);

  useEffect(() => {
    autoDirectionRef.current = 1;
    activeIndexRef.current = 0;
    scrollToCard(0, "auto");
  }, [products.length, scrollToCard]);

  useEffect(() => {
    if (products.length < 2 || isDragging) {
      return;
    }

    const intervalId = window.setInterval(() => {
      const targets = getCardTargets();
      const lastIndex = targets.length - 1;
      if (lastIndex < 1) {
        return;
      }

      const current = activeIndexRef.current;

      if (autoDirectionRef.current === 1) {
        if (current >= lastIndex) {
          autoDirectionRef.current = -1;
          scrollToCard(lastIndex - 1, "smooth");
          return;
        }
        scrollToCard(current + 1, "smooth");
        return;
      }

      if (current <= 0) {
        autoDirectionRef.current = 1;
        scrollToCard(1, "smooth");
        return;
      }

      scrollToCard(current - 1, "smooth");
    }, AUTO_SCROLL_MS);

    return () => window.clearInterval(intervalId);
  }, [products.length, isDragging, getCardTargets, scrollToCard]);

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
    pendingScrollLeftRef.current = startScrollLeftRef.current - deltaX;
    if (dragRafRef.current === null) {
      dragRafRef.current = window.requestAnimationFrame(flushPendingDragScroll);
    }
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
    if (dragRafRef.current !== null) {
      window.cancelAnimationFrame(dragRafRef.current);
      dragRafRef.current = null;
    }
    if (pendingScrollLeftRef.current !== null) {
      viewportRef.current?.scrollTo({ left: pendingScrollLeftRef.current, behavior: "auto" });
      pendingScrollLeftRef.current = null;
    }

    const viewport = viewportRef.current;
    if (!viewport) {
      return;
    }

    const targets = getCardTargets();
    if (targets.length === 0) {
      return;
    }

    let nearestIndex = 0;
    let nearestDistance = Number.POSITIVE_INFINITY;
    const current = viewport.scrollLeft;
    targets.forEach((target, index) => {
      const distance = Math.abs(target - current);
      if (distance < nearestDistance) {
        nearestDistance = distance;
        nearestIndex = index;
      }
    });
    scrollToCard(nearestIndex, "smooth");
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
          className={`flex touch-pan-y select-none gap-3 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden ${
            isDragging ? "snap-none cursor-grabbing" : "snap-x snap-mandatory scroll-smooth cursor-grab"
          }`}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={stopDrag}
          onPointerLeave={stopDrag}
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
              className="group shrink-0 snap-start basis-[calc((100%-0.75rem)/2)] overflow-hidden rounded-xl border border-[var(--line)] bg-white sm:basis-[calc((100%-2.25rem)/4)]"
            >
              <div className="relative h-28 overflow-hidden border-b border-[var(--line)] bg-[#f7f8f8] sm:h-32">
                <Image
                  src={product.imageUrl || FALLBACK_IMAGE}
                  alt={product.name}
                  fill
                  sizes="(min-width: 640px) 24vw, 48vw"
                  className={`pointer-events-none ${getMiniImageClass(product.categorySlug, product.slug)}`}
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

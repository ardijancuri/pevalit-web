"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef } from "react";

type HeroSliderProduct = {
  slug: string;
  name: string;
  categoryName: string;
  summary: string;
  imageUrl: string;
};

type HeroProductSliderProps = {
  products: HeroSliderProduct[];
};

export function HeroProductSlider({ products }: HeroProductSliderProps) {
  const trackRef = useRef<HTMLDivElement | null>(null);
  const dragStartXRef = useRef(0);
  const dragStartScrollRef = useRef(0);
  const isDraggingRef = useRef(false);
  const movedDuringDragRef = useRef(false);
  const suppressClickRef = useRef(false);
  const clearSuppressTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  function scrollTrack(direction: "prev" | "next") {
    if (!trackRef.current) return;
    const firstItem = trackRef.current.querySelector<HTMLElement>("[data-slider-item='true']");
    const step = firstItem ? firstItem.offsetWidth + 12 : 300;
    const left = direction === "next" ? step : -step;
    trackRef.current.scrollBy({ left, behavior: "smooth" });
  }

  function onPointerDown(event: React.PointerEvent<HTMLDivElement>) {
    if (!trackRef.current) return;
    if (event.pointerType === "mouse" && event.button !== 0) return;

    isDraggingRef.current = true;
    movedDuringDragRef.current = false;
    dragStartXRef.current = event.clientX;
    dragStartScrollRef.current = trackRef.current.scrollLeft;
    trackRef.current.setPointerCapture(event.pointerId);
  }

  function onPointerMove(event: React.PointerEvent<HTMLDivElement>) {
    if (!isDraggingRef.current || !trackRef.current) return;

    const deltaX = event.clientX - dragStartXRef.current;
    if (Math.abs(deltaX) > 4) {
      movedDuringDragRef.current = true;
    }
    trackRef.current.scrollLeft = dragStartScrollRef.current - deltaX;
  }

  function onPointerEnd(event: React.PointerEvent<HTMLDivElement>) {
    if (!trackRef.current || !isDraggingRef.current) return;

    isDraggingRef.current = false;
    trackRef.current.releasePointerCapture(event.pointerId);

    if (movedDuringDragRef.current) {
      suppressClickRef.current = true;
      if (clearSuppressTimeoutRef.current) {
        clearTimeout(clearSuppressTimeoutRef.current);
      }
      clearSuppressTimeoutRef.current = setTimeout(() => {
        suppressClickRef.current = false;
      }, 120);
    }
  }

  function onTrackClickCapture(event: React.MouseEvent<HTMLDivElement>) {
    if (!suppressClickRef.current) return;
    event.preventDefault();
    event.stopPropagation();
    suppressClickRef.current = false;
  }

  useEffect(() => {
    return () => {
      if (clearSuppressTimeoutRef.current) {
        clearTimeout(clearSuppressTimeoutRef.current);
      }
    };
  }, []);

  if (!products.length) {
    return null;
  }

  return (
    <div className="mt-6">
      <div className="mb-3 flex items-center justify-between gap-3">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#5f6873]">Featured Products</p>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => scrollTrack("prev")}
            className="rounded-full border border-[#c8d0d8] bg-white px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.08em] text-[#2a333c] hover:border-[var(--brand)]"
            aria-label="Scroll products left"
          >
            Prev
          </button>
          <button
            type="button"
            onClick={() => scrollTrack("next")}
            className="rounded-full border border-[#c8d0d8] bg-white px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.08em] text-[#2a333c] hover:border-[var(--brand)]"
            aria-label="Scroll products right"
          >
            Next
          </button>
        </div>
      </div>

      <div
        ref={trackRef}
        className="flex snap-x snap-mandatory gap-3 overflow-x-auto pb-2 select-none touch-pan-y cursor-grab active:cursor-grabbing"
        aria-label="Featured products slider"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerEnd}
        onPointerCancel={onPointerEnd}
        onClickCapture={onTrackClickCapture}
      >
        {products.map((product) => (
          <Link
            key={product.slug}
            href={`/product/${product.slug}`}
            data-slider-item="true"
            className="group block w-[240px] min-w-[240px] flex-none snap-start overflow-hidden rounded-xl border border-[#d1d8de] bg-white transition hover:border-[var(--brand)]"
            draggable={false}
          >
            <Image
              src={product.imageUrl}
              alt={product.name}
              width={520}
              height={520}
              className="h-36 w-full border-b border-[#e0e5ea] object-cover"
              loading="lazy"
              draggable={false}
            />
            <div className="p-3">
              <p className="text-[0.62rem] uppercase tracking-[0.14em] text-[#5f6873]">{product.categoryName}</p>
              <p className="mt-1 text-sm font-semibold text-[#212b36]">{product.name}</p>
              <p className="mt-1 text-xs leading-relaxed text-[#5f6873]">{product.summary}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

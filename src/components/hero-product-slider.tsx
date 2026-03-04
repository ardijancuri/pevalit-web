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
  label?: string | null;
  className?: string;
  ariaLabel?: string;
};

const AUTO_SCROLL_MS = 3000;
export function HeroProductSlider({ products, label = "Featured Products", className = "mt-6", ariaLabel = "Featured products slider" }: HeroProductSliderProps) {
  const trackRef = useRef<HTMLDivElement | null>(null);
  const dragStartXRef = useRef(0);
  const dragStartScrollRef = useRef(0);
  const nextScrollLeftRef = useRef(0);
  const activePointerIdRef = useRef<number | null>(null);
  const currentTargetIndexRef = useRef(0);
  const autoDirectionRef = useRef<1 | -1>(1);
  const dragRafRef = useRef<number | null>(null);
  const isDraggingRef = useRef(false);
  const autoPauseUntilRef = useRef(0);
  const movedDuringDragRef = useRef(false);
  const suppressClickRef = useRef(false);
  const clearSuppressTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  function onPointerDown(event: React.PointerEvent<HTMLDivElement>) {
    if (!trackRef.current) return;
    if (event.pointerType === "mouse" && event.button !== 0) return;
    activePointerIdRef.current = event.pointerId;
    isDraggingRef.current = true;
    autoPauseUntilRef.current = Date.now() + AUTO_SCROLL_MS;
    movedDuringDragRef.current = false;
    dragStartXRef.current = event.clientX;
    dragStartScrollRef.current = trackRef.current.scrollLeft;
    nextScrollLeftRef.current = dragStartScrollRef.current;
    trackRef.current.style.scrollBehavior = "auto";
    trackRef.current.style.scrollSnapType = "none";
    trackRef.current.setPointerCapture(event.pointerId);
  }

  function onPointerMove(event: React.PointerEvent<HTMLDivElement>) {
    if (!isDraggingRef.current || !trackRef.current || activePointerIdRef.current !== event.pointerId) return;

    const deltaX = event.clientX - dragStartXRef.current;
    if (Math.abs(deltaX) > 4) {
      movedDuringDragRef.current = true;
    }
    nextScrollLeftRef.current = dragStartScrollRef.current - deltaX;

    if (dragRafRef.current !== null) {
      return;
    }

    dragRafRef.current = window.requestAnimationFrame(() => {
      if (trackRef.current) {
        trackRef.current.scrollLeft = nextScrollLeftRef.current;
      }
      dragRafRef.current = null;
    });
  }

  function onPointerEnd(event: React.PointerEvent<HTMLDivElement>) {
    if (!trackRef.current || !isDraggingRef.current || activePointerIdRef.current !== event.pointerId) return;

    isDraggingRef.current = false;
    activePointerIdRef.current = null;
    if (trackRef.current.hasPointerCapture(event.pointerId)) {
      trackRef.current.releasePointerCapture(event.pointerId);
    }
    trackRef.current.style.scrollBehavior = "auto";
    trackRef.current.style.scrollSnapType = "none";

    if (dragRafRef.current !== null) {
      window.cancelAnimationFrame(dragRafRef.current);
      dragRafRef.current = null;
      trackRef.current.scrollLeft = nextScrollLeftRef.current;
    }

    if (movedDuringDragRef.current) {
      suppressClickRef.current = true;
      if (clearSuppressTimeoutRef.current) {
        clearTimeout(clearSuppressTimeoutRef.current);
      }
      clearSuppressTimeoutRef.current = setTimeout(() => {
        suppressClickRef.current = false;
      }, 120);
    }

    const targets = getScrollTargets();
    if (!targets.length) {
      return;
    }
    currentTargetIndexRef.current = getNearestTargetIndex(trackRef.current.scrollLeft, targets);
    trackRef.current.scrollTo({ left: targets[currentTargetIndexRef.current], behavior: "auto" });
    autoPauseUntilRef.current = Date.now() + AUTO_SCROLL_MS;
  }

  function onTrackClickCapture(event: React.MouseEvent<HTMLDivElement>) {
    if (!suppressClickRef.current) return;
    event.preventDefault();
    event.stopPropagation();
    suppressClickRef.current = false;
  }

  function getScrollTargets() {
    if (!trackRef.current) return [];

    const track = trackRef.current;
    const cards = Array.from(track.querySelectorAll<HTMLElement>("[data-slider-item='true']"));
    if (!cards.length) return [];

    const maxScrollLeft = Math.max(0, track.scrollWidth - track.clientWidth);
    const targets = cards.map((card) => Math.min(Math.round(card.offsetLeft), Math.round(maxScrollLeft)));
    return Array.from(new Set(targets));
  }

  function getNearestTargetIndex(scrollLeft: number, targets: number[]) {
    let nearestIndex = 0;
    let nearestDistance = Number.POSITIVE_INFINITY;
    targets.forEach((target, index) => {
      const distance = Math.abs(target - scrollLeft);
      if (distance < nearestDistance) {
        nearestDistance = distance;
        nearestIndex = index;
      }
    });
    return nearestIndex;
  }

  useEffect(() => {
    currentTargetIndexRef.current = 0;
    autoDirectionRef.current = 1;
    if (trackRef.current) {
      trackRef.current.style.scrollSnapType = "none";
      trackRef.current.scrollTo({ left: 0, behavior: "auto" });
    }
  }, [products.length]);

  useEffect(() => {
    if (products.length < 2) {
      return;
    }

    const intervalId = window.setInterval(() => {
      if (!trackRef.current || isDraggingRef.current) {
        return;
      }
      if (Date.now() < autoPauseUntilRef.current) {
        return;
      }

      const track = trackRef.current;
      const targets = getScrollTargets();
      if (targets.length < 2) {
        return;
      }

      const lastIndex = targets.length - 1;
      let nextIndex = Math.max(0, Math.min(currentTargetIndexRef.current, lastIndex));

      if (autoDirectionRef.current === 1 && nextIndex >= lastIndex) {
        autoDirectionRef.current = -1;
      } else if (autoDirectionRef.current === -1 && nextIndex <= 0) {
        autoDirectionRef.current = 1;
      }

      nextIndex = Math.max(0, Math.min(lastIndex, nextIndex + autoDirectionRef.current));
      currentTargetIndexRef.current = nextIndex;
      track.scrollTo({ left: targets[nextIndex], behavior: "smooth" });
    }, AUTO_SCROLL_MS);

    return () => window.clearInterval(intervalId);
  }, [products.length]);

  useEffect(() => {
    return () => {
      if (clearSuppressTimeoutRef.current) {
        clearTimeout(clearSuppressTimeoutRef.current);
      }
      if (dragRafRef.current !== null) {
        window.cancelAnimationFrame(dragRafRef.current);
      }
    };
  }, []);

  if (!products.length) {
    return null;
  }

  return (
    <div className={className}>
      {label ? <p className="mb-3 text-xs font-semibold uppercase tracking-[0.14em] text-[#5f6873]">{label}</p> : null}

      <div
        ref={trackRef}
        className="flex gap-3 lg:gap-[5px] overflow-x-auto px-[1px] pb-2 select-none touch-pan-y cursor-grab active:cursor-grabbing scroll-smooth [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
        aria-label={ariaLabel}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerEnd}
        onPointerCancel={onPointerEnd}
        onDragStart={(event) => event.preventDefault()}
        onClickCapture={onTrackClickCapture}
      >
        {products.map((product) => (
          <Link
            key={product.slug}
            href={`/product/${product.slug}`}
            data-slider-item="true"
            className="group block shrink-0 snap-start basis-[calc((100%-0.75rem)/2)] sm:basis-[calc((100%-1.5rem)/3)] lg:basis-[210px] lg:w-[210px] overflow-hidden rounded-xl border border-[#d1d8de] bg-white transition hover:border-[var(--brand)]"
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

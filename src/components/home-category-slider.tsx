"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useRef } from "react";

type CategorySlide = {
  slug: string;
  name: string;
  description: string;
  heroImage: string;
};

type HomeCategorySliderProps = {
  categories: CategorySlide[];
  className?: string;
  ariaLabel?: string;
};

const AUTO_SCROLL_MS = 3000;
const FALLBACK_IMAGE = "/images/imported/Pevalit-Catalogue-DE.jpg";

export function HomeCategorySlider({ categories, className = "", ariaLabel = "Solutions categories slider" }: HomeCategorySliderProps) {
  const trackRef = useRef<HTMLDivElement | null>(null);
  const autoDirectionRef = useRef<1 | -1>(1);
  const currentIndexRef = useRef(0);
  const autoPauseUntilRef = useRef(0);

  const getTargets = useCallback(() => {
    const track = trackRef.current;
    if (!track) {
      return [];
    }

    const cards = Array.from(track.querySelectorAll<HTMLElement>("[data-category-slide='true']"));
    if (!cards.length) {
      return [];
    }

    const maxScrollLeft = Math.max(0, track.scrollWidth - track.clientWidth);
    const targets = cards.map((card) => Math.min(Math.round(card.offsetLeft), Math.round(maxScrollLeft)));
    return Array.from(new Set(targets));
  }, []);

  const getNearestTargetIndex = useCallback((scrollLeft: number, targets: number[]) => {
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
  }, []);

  const goToIndex = useCallback(
    (index: number, behavior: ScrollBehavior) => {
      const track = trackRef.current;
      if (!track) {
        return false;
      }

      const targets = getTargets();
      if (!targets.length) {
        return false;
      }

      const safeIndex = Math.max(0, Math.min(index, targets.length - 1));
      currentIndexRef.current = safeIndex;
      track.scrollTo({ left: targets[safeIndex], behavior });
      return true;
    },
    [getTargets]
  );

  const step = useCallback(
    (direction: 1 | -1) => {
      const targets = getTargets();
      if (targets.length < 2) {
        return;
      }

      const lastIndex = targets.length - 1;
      const nextIndex = Math.max(0, Math.min(lastIndex, currentIndexRef.current + direction));
      autoPauseUntilRef.current = Date.now() + AUTO_SCROLL_MS;
      autoDirectionRef.current = direction;
      goToIndex(nextIndex, "smooth");
    },
    [getTargets, goToIndex]
  );

  useEffect(() => {
    currentIndexRef.current = 0;
    autoDirectionRef.current = 1;
    goToIndex(0, "auto");
  }, [categories.length, goToIndex]);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) {
      return;
    }

    const handleScroll = () => {
      const targets = getTargets();
      if (!targets.length) {
        return;
      }
      currentIndexRef.current = getNearestTargetIndex(track.scrollLeft, targets);
    };

    track.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => {
      track.removeEventListener("scroll", handleScroll);
    };
  }, [getNearestTargetIndex, getTargets]);

  useEffect(() => {
    if (categories.length < 2) {
      return;
    }

    const intervalId = window.setInterval(() => {
      if (Date.now() < autoPauseUntilRef.current) {
        return;
      }

      const targets = getTargets();
      const lastIndex = targets.length - 1;
      if (lastIndex < 1) {
        return;
      }

      let nextIndex = Math.max(0, Math.min(currentIndexRef.current, lastIndex));

      if (autoDirectionRef.current === 1 && nextIndex >= lastIndex) {
        autoDirectionRef.current = -1;
      } else if (autoDirectionRef.current === -1 && nextIndex <= 0) {
        autoDirectionRef.current = 1;
      }

      nextIndex = Math.max(0, Math.min(lastIndex, nextIndex + autoDirectionRef.current));
      goToIndex(nextIndex, "smooth");
    }, AUTO_SCROLL_MS);

    return () => window.clearInterval(intervalId);
  }, [categories.length, getTargets, goToIndex]);

  if (!categories.length) {
    return null;
  }

  return (
    <div className={className}>
      <div className="mb-3 flex justify-end gap-2">
        <button
          type="button"
          aria-label="Previous category"
          onClick={() => step(-1)}
          className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-[var(--line)] bg-white text-[var(--text)] hover:border-[var(--brand)]"
        >
          <svg
            aria-hidden="true"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-4 w-4"
          >
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </button>
        <button
          type="button"
          aria-label="Next category"
          onClick={() => step(1)}
          className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-[var(--line)] bg-white text-[var(--text)] hover:border-[var(--brand)]"
        >
          <svg
            aria-hidden="true"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-4 w-4"
          >
            <path d="M9 18l6-6-6-6" />
          </svg>
        </button>
      </div>

      <div
        ref={trackRef}
        className="flex snap-x snap-mandatory gap-3 lg:gap-[5px] overflow-x-hidden pb-2 scroll-smooth"
        aria-label={ariaLabel}
      >
        {categories.map((category) => (
          <Link
            key={category.slug}
            href={`/products/${category.slug}`}
            data-category-slide="true"
            className="group block shrink-0 snap-start basis-[calc((100%-0.75rem)/2)] sm:basis-[calc((100%-1.5rem)/3)] lg:basis-[210px] lg:w-[210px] overflow-hidden rounded-xl border border-[#d1d8de] bg-white transition hover:border-[var(--brand)]"
          >
            <Image
              src={category.heroImage.startsWith("/images/imported/") ? category.heroImage : FALLBACK_IMAGE}
              alt={category.name}
              width={520}
              height={520}
              className="h-36 w-full border-b border-[#e0e5ea] object-cover"
              loading="lazy"
              draggable={false}
            />
            <div className="p-3">
              <p className="text-[0.62rem] uppercase tracking-[0.14em] text-[#5f6873]">Category</p>
              <p className="mt-1 text-sm font-semibold text-[#212b36]">{category.name}</p>
              <p className="mt-1 text-xs leading-relaxed text-[#5f6873]">{category.description}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

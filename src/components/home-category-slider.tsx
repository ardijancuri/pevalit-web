"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";

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
  const viewportRef = useRef<HTMLDivElement | null>(null);
  const trackRef = useRef<HTMLDivElement | null>(null);
  const autoDirectionRef = useRef<1 | -1>(1);
  const autoPauseUntilRef = useRef(0);
  const [stepSize, setStepSize] = useState(0);
  const [visibleCount, setVisibleCount] = useState(1);
  const [currentIndex, setCurrentIndex] = useState(0);

  const maxIndex = useMemo(() => Math.max(0, categories.length - visibleCount), [categories.length, visibleCount]);

  function updateMeasurements() {
    const viewport = viewportRef.current;
    const track = trackRef.current;
    if (!viewport || !track) {
      return;
    }

    const firstCard = track.querySelector<HTMLElement>("[data-category-slide='true']");
    if (!firstCard) {
      setStepSize(0);
      setVisibleCount(1);
      return;
    }

    const styles = window.getComputedStyle(track);
    const gap = parseFloat(styles.columnGap || styles.gap || "0") || 0;
    const cardWidth = firstCard.getBoundingClientRect().width;
    const nextStepSize = cardWidth + gap;
    setStepSize(nextStepSize);

    if (nextStepSize <= 0) {
      setVisibleCount(1);
      return;
    }

    const nextVisibleCount = Math.max(1, Math.floor((viewport.clientWidth + gap) / nextStepSize));
    setVisibleCount(nextVisibleCount);
  }

  function step(direction: 1 | -1) {
    autoPauseUntilRef.current = Date.now() + AUTO_SCROLL_MS;
    autoDirectionRef.current = direction;
    setCurrentIndex((current) => Math.max(0, Math.min(maxIndex, current + direction)));
  }

  useEffect(() => {
    autoDirectionRef.current = 1;
    setCurrentIndex(0);
    updateMeasurements();
  }, [categories.length]);

  useEffect(() => {
    if (categories.length < 2) {
      return;
    }

    const intervalId = window.setInterval(() => {
      if (Date.now() < autoPauseUntilRef.current) {
        return;
      }

      if (maxIndex <= 0) {
        return;
      }

      setCurrentIndex((current) => {
        let next = current;
        if (autoDirectionRef.current === 1) {
          if (current >= maxIndex) {
            autoDirectionRef.current = -1;
            next = Math.max(0, current - 1);
          } else {
            next = current + 1;
          }
        } else if (current <= 0) {
          autoDirectionRef.current = 1;
          next = Math.min(maxIndex, current + 1);
        } else {
          next = current - 1;
        }

        return Math.max(0, Math.min(maxIndex, next));
      });
    }, AUTO_SCROLL_MS);

    return () => window.clearInterval(intervalId);
  }, [categories.length, maxIndex]);

  useEffect(() => {
    updateMeasurements();
    window.addEventListener("resize", updateMeasurements);
    return () => window.removeEventListener("resize", updateMeasurements);
  }, []);

  useEffect(() => {
    setCurrentIndex((current) => Math.max(0, Math.min(maxIndex, current)));
  }, [maxIndex]);

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
          className="inline-flex h-9 w-9 items-center justify-center rounded-[8px] border border-[var(--line)] bg-white text-[var(--text)] hover:border-[var(--brand)]"
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
          className="inline-flex h-9 w-9 items-center justify-center rounded-[8px] border border-[var(--line)] bg-white text-[var(--text)] hover:border-[var(--brand)]"
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
        ref={viewportRef}
        className="overflow-hidden pb-2"
        aria-label={ariaLabel}
      >
        <div
          ref={trackRef}
          className="flex gap-3 transition-transform duration-500 ease-out"
          style={{ transform: `translate3d(${-currentIndex * stepSize}px, 0, 0)` }}
        >
          {categories.map((category) => (
            <Link
              key={category.slug}
              href={`/products/${category.slug}`}
              data-category-slide="true"
              className="product-card group block shrink-0 basis-[calc((100%-0.75rem)/2)] sm:basis-[calc((100%-1.5rem)/3)] lg:basis-[210px] lg:w-[210px] overflow-hidden bg-[var(--charcoal)] text-[var(--charcoal-text)] transition"
            >
              <Image
                src={category.heroImage.startsWith("/images/imported/") ? category.heroImage : FALLBACK_IMAGE}
                alt={category.name}
                width={520}
                height={520}
                className="aspect-square w-full object-cover"
                loading="lazy"
                draggable={false}
              />
              <div className="p-3">
                <p className="text-[0.62rem] uppercase tracking-[0.14em] text-[var(--charcoal-muted)]">Category</p>
                <p className="mt-1 text-sm font-semibold text-[var(--charcoal-text)]">{category.name}</p>
                <p className="mt-1 text-xs leading-relaxed text-[var(--charcoal-muted)]">{category.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

type ConstructionSystemsSliderProps = {
  images: Array<{
    src: string;
    alt: string;
  }>;
  className?: string;
  intervalMs?: number;
};

export function ConstructionSystemsSlider({ images, className = "", intervalMs = 2000 }: ConstructionSystemsSliderProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (images.length < 2) {
      return;
    }

    const intervalId = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % images.length);
    }, intervalMs);

    return () => window.clearInterval(intervalId);
  }, [images.length, intervalMs]);

  if (!images.length) {
    return null;
  }

  return (
    <div className={className}>
      <div className="relative aspect-square w-full overflow-hidden bg-white">
        {images.map((image, index) => (
          <Image
            key={image.src}
            src={image.src}
            alt={image.alt}
            width={800}
            height={800}
            sizes="(max-width: 1024px) 100vw, 690px"
            className={`absolute inset-0 h-full w-full object-contain transition-opacity duration-500 ${
              index === activeIndex ? "opacity-100" : "opacity-0"
            }`}
            priority={index === 0}
            loading={index === 0 ? "eager" : "lazy"}
            quality={100}
            draggable={false}
          />
        ))}
      </div>
    </div>
  );
}

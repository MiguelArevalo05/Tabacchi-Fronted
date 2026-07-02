"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

interface ProductImageGalleryProps {
  images: string[];
  productName: string;
}

export default function ProductImageGallery({
  images,
  productName,
}: ProductImageGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isHovering, setIsHovering] = useState(false);
  const [zoomOrigin, setZoomOrigin] = useState({ x: 50, y: 50 });

  const visibleThumbs = 5;
  const extraCount = Math.max(images.length - visibleThumbs, 0);
  const activeImage = images[activeIndex];

  const goPrev = () => setActiveIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  const goNext = () => setActiveIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));

  const handleThumbClick = (index: number) => {
    if (index === visibleThumbs - 1 && extraCount > 0) {
      setActiveIndex(visibleThumbs);
      return;
    }
    setActiveIndex(index);
  };

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * 100;
    const y = ((event.clientY - rect.top) / rect.height) * 100;
    setZoomOrigin({ x, y });
  };

  if (!activeImage) return null;

  return (
    <div>
      <div className="relative overflow-hidden rounded-2xl bg-[#f3f4f6]">
        <div
          className="relative aspect-square cursor-zoom-in overflow-hidden"
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
          onMouseMove={handleMouseMove}
        >
          <Image
            src={activeImage}
            alt={productName}
            fill
            sizes="(max-width: 1024px) 100vw, 38vw"
            className="object-contain p-10 transition-transform duration-200 ease-out"
            style={{
              transform: isHovering ? "scale(2)" : "scale(1)",
              transformOrigin: `${zoomOrigin.x}% ${zoomOrigin.y}%`,
            }}
            priority
          />
        </div>

        {images.length > 1 ? (
          <>
            <button
              type="button"
              onClick={goPrev}
              className="absolute left-3 top-1/2 z-10 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-slate-200/80 bg-white/90 text-slate-600 shadow-sm backdrop-blur transition hover:bg-white"
              aria-label="Imagen anterior"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={goNext}
              className="absolute right-3 top-1/2 z-10 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-slate-200/80 bg-white/90 text-slate-600 shadow-sm backdrop-blur transition hover:bg-white"
              aria-label="Imagen siguiente"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </>
        ) : null}
      </div>

      {images.length > 1 ? (
        <div className="mt-4 grid grid-cols-5 gap-2.5">
          {images.slice(0, visibleThumbs).map((image, index) => {
            const isLastVisible = index === visibleThumbs - 1 && extraCount > 0;
            const isActive = activeIndex === index;

            return (
              <button
                key={`${image}-${index}`}
                type="button"
                onClick={() => handleThumbClick(index)}
                className={`relative aspect-square overflow-hidden rounded-xl bg-[#f3f4f6] ${
                  isActive ? "ring-2 ring-[#2563eb] ring-offset-2" : "ring-1 ring-slate-200"
                }`}
              >
                <Image
                  src={image}
                  alt={`${productName} miniatura ${index + 1}`}
                  fill
                  sizes="72px"
                  className="object-contain p-1.5"
                />
                {isLastVisible ? (
                  <span className="absolute inset-0 flex items-center justify-center bg-black/50 text-sm font-bold text-white">
                    +{extraCount}
                  </span>
                ) : null}
              </button>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}

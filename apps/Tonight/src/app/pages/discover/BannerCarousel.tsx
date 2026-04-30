/* Banner Carousel — full-bleed hero, drag + autoplay */
import { useState, useRef, useEffect, useCallback, useLayoutEffect } from "react";
import { ImageWithFallback } from "../../components/figma/ImageWithFallback";
import { BANNERS } from "./discoverData";

interface BannerCarouselProps {
  onBannerClick?: (bannerId: string) => void;
  onViewAll?: () => void;
}

export function BannerCarousel({ onBannerClick, onViewAll }: BannerCarouselProps) {
  const [current, setCurrent] = useState(0);
  const viewportRef = useRef<HTMLDivElement>(null);
  const dragStartX = useRef(0);
  const didDrag = useRef(false);
  const [dragging, setDragging] = useState(false);
  const [dragDelta, setDragDelta] = useState(0);
  const [slideWidth, setSlideWidth] = useState(0);
  const autoPlayRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const total = BANNERS.length;

  const stopAutoPlay = useCallback(() => {
    if (autoPlayRef.current) {
      clearInterval(autoPlayRef.current);
      autoPlayRef.current = null;
    }
  }, []);

  const startAutoPlay = useCallback(() => {
    stopAutoPlay();
    autoPlayRef.current = setInterval(() => {
      setCurrent((prev) => (prev + 1) % total);
    }, 3000);
  }, [total, stopAutoPlay]);

  useEffect(() => {
    startAutoPlay();
    return stopAutoPlay;
  }, [startAutoPlay, stopAutoPlay]);

  useLayoutEffect(() => {
    const el = viewportRef.current;
    if (!el) return undefined;
    const measure = () => setSlideWidth(el.offsetWidth);
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const handleDragStart = (clientX: number) => {
    stopAutoPlay();
    setDragging(true);
    didDrag.current = false;
    dragStartX.current = clientX;
  };

  const handleDragMove = (clientX: number) => {
    if (!dragging) return;
    const delta = clientX - dragStartX.current;
    if (Math.abs(delta) > 5) didDrag.current = true;
    setDragDelta(delta);
  };

  const handleDragEnd = () => {
    if (!dragging) return;
    setDragging(false);
    const threshold = Math.max(40, slideWidth * 0.08);
    if (dragDelta < -threshold) {
      setCurrent((p) => (p + 1) % total);
    } else if (dragDelta > threshold) {
      setCurrent((p) => (p - 1 + total) % total);
    }
    setDragDelta(0);
    startAutoPlay();
  };

  const translatePx =
    slideWidth > 0 ? -(current * slideWidth) + (dragging ? dragDelta : 0) : 0;

  return (
    <div ref={viewportRef} className="relative w-full overflow-hidden rounded-b-[1.75rem]">
      <div
        className="flex w-full touch-pan-x select-none"
        style={{
          transform: `translate3d(${translatePx}px, 0, 0)`,
          transition: dragging || slideWidth === 0 ? "none" : "transform 0.45s cubic-bezier(0.32, 0.72, 0, 1)",
        }}
        onMouseDown={(e) => {
          e.preventDefault();
          handleDragStart(e.clientX);
        }}
        onMouseMove={(e) => handleDragMove(e.clientX)}
        onMouseUp={handleDragEnd}
        onMouseLeave={() => {
          if (dragging) handleDragEnd();
        }}
        onTouchStart={(e) => handleDragStart(e.touches[0].clientX)}
        onTouchMove={(e) => handleDragMove(e.touches[0].clientX)}
        onTouchEnd={handleDragEnd}
      >
        {BANNERS.map((b) => (
          <div
            key={b.id}
            className="relative shrink-0 cursor-grab overflow-hidden active:cursor-grabbing"
            style={{
              flex: slideWidth > 0 ? `0 0 ${slideWidth}px` : "0 0 100%",
              minHeight: "15.5rem",
              aspectRatio: "1.45 / 1",
            }}
            onClick={() => {
              if (didDrag.current) return;
              onBannerClick?.(b.id);
            }}
          >
            <ImageWithFallback src={b.image} alt={b.title} className="pointer-events-none h-full w-full object-cover" />
            <div className={`pointer-events-none absolute inset-0 bg-gradient-to-t ${b.gradient}`} />
            <div className="pointer-events-none absolute inset-0 flex flex-col justify-end p-5 pb-16 sm:pb-20">
              <h2 className="whitespace-pre-line text-[1.5rem] leading-tight text-white sm:text-[1.75rem]" style={{ fontWeight: 800 }}>
                {b.title}
              </h2>
              <p className="mt-0.5 whitespace-pre-line text-[0.9375rem] leading-snug text-white/90 sm:text-[1.0625rem]" style={{ fontWeight: 500 }}>
                {b.subtitle}
              </p>
              {b.cta && <p className="mt-2 text-[0.6875rem] uppercase tracking-wider text-white/60">{b.cta}</p>}
            </div>
          </div>
        ))}
      </div>

      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 flex flex-col justify-end bg-gradient-to-t from-black/55 via-black/20 to-transparent pb-3 pt-12">
        <div className="pointer-events-auto flex justify-center gap-1.5 px-24">
          {BANNERS.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => {
                setCurrent(i);
                stopAutoPlay();
                startAutoPlay();
              }}
              className={`h-1.5 rounded-full transition-all ${
                i === current ? "w-6 bg-white shadow-sm" : "w-1.5 bg-white/45 hover:bg-white/70"
              }`}
              aria-label={`Banner ${i + 1}`}
            />
          ))}
        </div>
        <button
          type="button"
          className="pointer-events-auto absolute bottom-3 right-3 rounded-full bg-white/90 px-2.5 py-1 text-[0.6875rem] text-gray-800 shadow-sm backdrop-blur-sm transition hover:bg-white"
          style={{ fontWeight: 500 }}
          onClick={(e) => {
            e.stopPropagation();
            onViewAll?.();
          }}
          onMouseDown={(e) => e.stopPropagation()}
          onTouchStart={(e) => e.stopPropagation()}
        >
          View All
        </button>
      </div>
    </div>
  );
}

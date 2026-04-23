/* Banner Carousel with peek + drag + autoplay */
import { useState, useRef, useEffect, useCallback } from "react";
import { ImageWithFallback } from "../../components/figma/ImageWithFallback";
import { BANNERS } from "./discoverData";

interface BannerCarouselProps {
  onBannerClick?: (bannerId: string) => void;
  onViewAll?: () => void;
}

export function BannerCarousel({ onBannerClick, onViewAll }: BannerCarouselProps) {
  const [current, setCurrent] = useState(0);
  const trackRef = useRef<HTMLDivElement>(null);
  const dragStartX = useRef(0);
  const didDrag = useRef(false);
  const [dragging, setDragging] = useState(false);
  const [dragDelta, setDragDelta] = useState(0);
  const autoPlayRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const total = BANNERS.length;
  const internalIdx = current + 1;

  const stopAutoPlay = useCallback(() => {
    if (autoPlayRef.current) { clearInterval(autoPlayRef.current); autoPlayRef.current = null; }
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

  const cardWidthPct = 82;
  const gapPct = 2;

  const getTranslateX = (idx: number, delta = 0) => {
    const offset = (100 - cardWidthPct) / 2;
    return -(idx * (cardWidthPct + gapPct)) + offset + delta;
  };

  const handleDragStart = (clientX: number) => {
    stopAutoPlay();
    setDragging(true);
    didDrag.current = false;
    dragStartX.current = clientX;
  };

  const handleDragMove = (clientX: number) => {
    if (!dragging) return;
    const containerW = trackRef.current?.parentElement?.offsetWidth || 400;
    const delta = clientX - dragStartX.current;
    if (Math.abs(delta) > 5) didDrag.current = true;
    const deltaPct = (delta / containerW) * 100;
    setDragDelta(deltaPct);
  };

  const handleDragEnd = () => {
    if (!dragging) return;
    setDragging(false);
    const threshold = 10;
    if (dragDelta < -threshold) {
      setCurrent((p) => (p + 1) % total);
    } else if (dragDelta > threshold) {
      setCurrent((p) => (p - 1 + total) % total);
    }
    setDragDelta(0);
    startAutoPlay();
  };

  const translateX = getTranslateX(internalIdx, dragging ? dragDelta : 0);
  const extendedBanners = [BANNERS[total - 1], ...BANNERS, BANNERS[0]];

  return (
    <div className="relative overflow-hidden -mx-4 sm:-mx-6 lg:-mx-4">
      <div
        ref={trackRef}
        className="flex select-none w-full"
        style={{
          transform: `translateX(${translateX}%)`,
          transition: dragging ? "none" : "transform 0.45s cubic-bezier(0.32, 0.72, 0, 1)",
          gap: `${gapPct}%`,
        }}
        onMouseDown={(e) => { e.preventDefault(); handleDragStart(e.clientX); }}
        onMouseMove={(e) => handleDragMove(e.clientX)}
        onMouseUp={handleDragEnd}
        onMouseLeave={() => { if (dragging) handleDragEnd(); }}
        onTouchStart={(e) => handleDragStart(e.touches[0].clientX)}
        onTouchMove={(e) => handleDragMove(e.touches[0].clientX)}
        onTouchEnd={handleDragEnd}
      >
        {extendedBanners.map((b, i) => {
          const realIndex = i === 0 ? total - 1 : i === extendedBanners.length - 1 ? 0 : i - 1;
          return (
            <div
              key={`banner-${i}`}
              className="shrink-0 relative rounded-2xl overflow-hidden cursor-grab active:cursor-grabbing"
              style={{ width: `${cardWidthPct}%`, aspectRatio: "1.8 / 1" }}
              onClick={() => { if (didDrag.current) return; onBannerClick?.(b.id); }}
            >
              <ImageWithFallback src={b.image} alt={b.title} className="w-full h-full object-cover pointer-events-none" />
              <div className={`absolute inset-0 bg-gradient-to-t ${b.gradient} pointer-events-none`} />
              <div className="absolute inset-0 flex flex-col justify-end p-5 pointer-events-none">
                <h2 className="text-white text-[1.5rem] sm:text-[1.75rem] whitespace-pre-line leading-tight" style={{ fontWeight: 800 }}>
                  {b.title}
                </h2>
                <p className="text-white/90 text-[0.9375rem] sm:text-[1.0625rem] mt-0.5 whitespace-pre-line leading-snug" style={{ fontWeight: 500 }}>
                  {b.subtitle}
                </p>
                {b.cta && (
                  <p className="text-white/60 text-[0.6875rem] mt-2 uppercase tracking-wider">{b.cta}</p>
                )}
              </div>
              <button
                type="button"
                className="absolute top-3 right-3 bg-white/80 backdrop-blur-sm rounded-full px-2.5 py-1 text-[0.6875rem] text-gray-800 cursor-pointer hover:bg-white transition"
                style={{ fontWeight: 500 }}
                onClick={(e) => { e.stopPropagation(); if (didDrag.current) return; onViewAll?.(); }}
                onMouseDown={(e) => e.stopPropagation()}
                onTouchStart={(e) => e.stopPropagation()}
              >
                View All
              </button>
              <div className="absolute bottom-3 right-3 bg-black/50 backdrop-blur-sm rounded-full px-2.5 py-1 text-[0.6875rem] text-white pointer-events-none" style={{ fontWeight: 500 }}>
                {realIndex + 1} / {total}
              </div>
            </div>
          );
        })}
      </div>
      <div className="flex justify-center gap-1.5 mt-3">
        {BANNERS.map((_, i) => (
          <button
            key={i}
            onClick={() => { setCurrent(i); stopAutoPlay(); startAutoPlay(); }}
            className={`h-1.5 rounded-full transition-all cursor-pointer ${
              i === current ? "w-6 bg-primary" : "w-1.5 bg-muted-foreground/30"
            }`}
          />
        ))}
      </div>
    </div>
  );
}

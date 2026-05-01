import { useState, useCallback, useEffect, useRef, type ReactNode } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

type CarouselAlign = "start" | "center";

interface CarouselProps {
  children: ReactNode[];
  autoPlay?: boolean;
  autoPlayInterval?: number;
  showArrows?: boolean;
  showDots?: boolean;
  loop?: boolean;
  slidesToShow?: number;
  gap?: number;
  align?: CarouselAlign;
  arrowSize?: "sm" | "md" | "lg";
  dotVariant?: "dot" | "line";
  className?: string;
}

const arrowSizes = {
  sm: { btn: "w-7 h-7", icon: 14 },
  md: { btn: "w-9 h-9", icon: 18 },
  lg: { btn: "w-11 h-11", icon: 22 },
};

export function Carousel({
  children,
  autoPlay = false,
  autoPlayInterval = 4000,
  showArrows = true,
  showDots = true,
  loop = true,
  slidesToShow = 1,
  gap = 16,
  align = "start",
  arrowSize = "md",
  dotVariant = "dot",
  className = "",
}: CarouselProps) {
  const total = children.length;
  const maxIndex = Math.max(0, total - slidesToShow);
  const [current, setCurrent] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval>>();

  const goTo = useCallback(
    (idx: number) => {
      if (loop) {
        setCurrent(((idx % total) + total) % total);
      } else {
        setCurrent(Math.max(0, Math.min(idx, maxIndex)));
      }
    },
    [loop, total, maxIndex]
  );

  const next = useCallback(() => goTo(current + 1), [goTo, current]);
  const prev = useCallback(() => goTo(current - 1), [goTo, current]);

  // Autoplay
  useEffect(() => {
    if (!autoPlay) return;
    timerRef.current = setInterval(next, autoPlayInterval);
    return () => clearInterval(timerRef.current);
  }, [autoPlay, autoPlayInterval, next]);

  const pause = () => clearInterval(timerRef.current);
  const resume = () => {
    if (!autoPlay) return;
    timerRef.current = setInterval(next, autoPlayInterval);
  };

  const a = arrowSizes[arrowSize];

  const translateX = (() => {
    const slideWidth = `(100% - ${gap * (slidesToShow - 1)}px) / ${slidesToShow}`;
    return `calc(-${current} * (${slideWidth} + ${gap}px))`;
  })();

  return (
    <div
      className={`relative group ${className}`}
      onMouseEnter={pause}
      onMouseLeave={resume}
    >
      {/* Track */}
      <div className="overflow-hidden rounded-xl">
        <div
          className="flex transition-transform duration-500 ease-out"
          style={{
            gap: `${gap}px`,
            transform: `translateX(${translateX})`,
          }}
        >
          {children.map((child, i) => (
            <div
              key={i}
              className="shrink-0"
              style={{
                width: `calc((100% - ${gap * (slidesToShow - 1)}px) / ${slidesToShow})`,
              }}
            >
              {child}
            </div>
          ))}
        </div>
      </div>

      {/* Arrows */}
      {showArrows && total > slidesToShow && (
        <>
          <button
            onClick={prev}
            disabled={!loop && current === 0}
            className={`absolute left-2 top-1/2 -translate-y-1/2 ${a.btn}
              bg-card/90 backdrop-blur-sm border border-border rounded-full shadow-md
              flex items-center justify-center
              opacity-0 group-hover:opacity-100 transition-opacity
              hover:bg-card cursor-pointer
              disabled:opacity-0`}
            aria-label="Previous"
          >
            <ChevronLeft size={a.icon} />
          </button>
          <button
            onClick={next}
            disabled={!loop && current === maxIndex}
            className={`absolute right-2 top-1/2 -translate-y-1/2 ${a.btn}
              bg-card/90 backdrop-blur-sm border border-border rounded-full shadow-md
              flex items-center justify-center
              opacity-0 group-hover:opacity-100 transition-opacity
              hover:bg-card cursor-pointer
              disabled:opacity-0`}
            aria-label="Next"
          >
            <ChevronRight size={a.icon} />
          </button>
        </>
      )}

      {/* Dots */}
      {showDots && total > slidesToShow && (
        <div className="flex items-center justify-center gap-1.5 mt-4">
          {Array.from({ length: loop ? total : maxIndex + 1 }, (_, i) => {
            const isActive = i === current;
            if (dotVariant === "line") {
              return (
                <button
                  key={i}
                  onClick={() => goTo(i)}
                  className={`h-1 rounded-full transition-all cursor-pointer ${
                    isActive ? "w-6 bg-primary" : "w-3 bg-border hover:bg-muted-foreground"
                  }`}
                  aria-label={`Go to slide ${i + 1}`}
                />
              );
            }
            return (
              <button
                key={i}
                onClick={() => goTo(i)}
                className={`w-2 h-2 rounded-full transition-all cursor-pointer ${
                  isActive ? "bg-primary scale-125" : "bg-border hover:bg-muted-foreground"
                }`}
                aria-label={`Go to slide ${i + 1}`}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}

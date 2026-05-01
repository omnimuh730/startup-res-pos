import { useRef, useEffect, type ReactNode } from "react";

/**
 * Reusable wrapper that enables mouse-drag horizontal scrolling
 * on overflow-x containers. Works alongside native touch scrolling.
 */
export function DragScrollContainer({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let isDown = false;
    let startX = 0;
    let scrollLeft = 0;
    let hasDragged = false;

    const onDown = (e: MouseEvent) => {
      isDown = true;
      hasDragged = false;
      el.style.cursor = "grabbing";
      startX = e.pageX - el.offsetLeft;
      scrollLeft = el.scrollLeft;
    };
    const onLeave = () => { isDown = false; el.style.cursor = "grab"; };
    const onUp = () => {
      isDown = false;
      el.style.cursor = "grab";
    };
    const onMove = (e: MouseEvent) => {
      if (!isDown) return;
      e.preventDefault();
      const x = e.pageX - el.offsetLeft;
      const diff = x - startX;
      if (Math.abs(diff) > 3) hasDragged = true;
      el.scrollLeft = scrollLeft - diff;
    };
    const onClick = (e: MouseEvent) => {
      if (hasDragged) {
        e.preventDefault();
        e.stopPropagation();
        hasDragged = false;
      }
    };

    el.style.cursor = "grab";
    el.addEventListener("mousedown", onDown);
    el.addEventListener("mouseleave", onLeave);
    el.addEventListener("mouseup", onUp);
    el.addEventListener("mousemove", onMove);
    el.addEventListener("click", onClick, true);
    return () => {
      el.removeEventListener("mousedown", onDown);
      el.removeEventListener("mouseleave", onLeave);
      el.removeEventListener("mouseup", onUp);
      el.removeEventListener("mousemove", onMove);
      el.removeEventListener("click", onClick, true);
    };
  }, []);

  return (
    <div
      ref={ref}
      className={`overflow-x-auto scrollbar-hide select-none ${className}`}
      style={{ WebkitUserDrag: 'none' } as React.CSSProperties}
      onDragStart={(e) => e.preventDefault()}
    >
      {children}
    </div>
  );
}

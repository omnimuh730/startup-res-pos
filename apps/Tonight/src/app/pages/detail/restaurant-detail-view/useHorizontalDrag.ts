import { useEffect, type RefObject } from "react";

interface UseHorizontalDragOptions {
  snapToPage?: boolean;
  snapToCard?: (container: HTMLDivElement) => void;
}

export function useHorizontalDrag(
  ref: RefObject<HTMLDivElement | null>,
  { snapToPage = false, snapToCard }: UseHorizontalDragOptions = {},
) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let isDown = false;
    let startX = 0;
    let scrollLeft = 0;
    let scrollEndTimer: number | null = null;

    const finishScroll = () => {
      if (snapToPage) {
        const idx = Math.round(el.scrollLeft / el.clientWidth);
        el.scrollTo({ left: idx * el.clientWidth, behavior: "smooth" });
      }
      if (snapToCard) snapToCard(el);
    };

    const onDown = (e: MouseEvent) => {
      isDown = true;
      el.style.cursor = "grabbing";
      startX = e.pageX - el.offsetLeft;
      scrollLeft = el.scrollLeft;
    };
    const onUp = () => {
      if (!isDown && snapToPage) return;
      isDown = false;
      el.style.cursor = "grab";
      finishScroll();
    };
    const onMove = (e: MouseEvent) => {
      if (!isDown) return;
      e.preventDefault();
      el.scrollLeft = scrollLeft - (e.pageX - el.offsetLeft - startX);
    };
    const onScroll = () => {
      if (!snapToCard || isDown) return;
      if (scrollEndTimer) window.clearTimeout(scrollEndTimer);
      scrollEndTimer = window.setTimeout(() => snapToCard(el), 120);
    };

    el.style.cursor = "grab";
    el.addEventListener("mousedown", onDown);
    el.addEventListener("mouseleave", onUp);
    el.addEventListener("mouseup", onUp);
    el.addEventListener("mousemove", onMove);
    el.addEventListener("scroll", onScroll);

    return () => {
      el.removeEventListener("mousedown", onDown);
      el.removeEventListener("mouseleave", onUp);
      el.removeEventListener("mouseup", onUp);
      el.removeEventListener("mousemove", onMove);
      el.removeEventListener("scroll", onScroll);
      if (scrollEndTimer) window.clearTimeout(scrollEndTimer);
    };
  }, [ref, snapToCard, snapToPage]);
}

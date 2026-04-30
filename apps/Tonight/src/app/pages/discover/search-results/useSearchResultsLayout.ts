import { useEffect, useState, type RefObject } from "react";

const PEEK_CONTENT_HEIGHT = 60;
const SEARCH_HEADER_FALLBACK = 5.25 * 16;

type UseSearchResultsLayoutParams = {
  sheetRef: RefObject<HTMLElement | null>;
  searchHeaderRef: RefObject<HTMLDivElement | null>;
  peekHeaderRef: RefObject<HTMLButtonElement | null>;
};

export function useSearchResultsLayout({ sheetRef, searchHeaderRef, peekHeaderRef }: UseSearchResultsLayoutParams) {
  const [sheetHeight, setSheetHeight] = useState(0);
  const [searchHeaderHeight, setSearchHeaderHeight] = useState(SEARCH_HEADER_FALLBACK);
  const [peekHeaderHeight, setPeekHeaderHeight] = useState(PEEK_CONTENT_HEIGHT);

  useEffect(() => {
    const sheet = sheetRef.current;
    if (!sheet) return;
    const updateHeight = () => setSheetHeight(sheet.getBoundingClientRect().height);
    updateHeight();
    const observer = new ResizeObserver(updateHeight);
    observer.observe(sheet);
    window.addEventListener("resize", updateHeight);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", updateHeight);
    };
  }, [sheetRef]);

  useEffect(() => {
    const measure = () => {
      const el = peekHeaderRef.current;
      if (!el) return;
      const measured = el.getBoundingClientRect().height || PEEK_CONTENT_HEIGHT;
      setPeekHeaderHeight(Math.min(76, Math.max(56, measured)));
    };
    const raf = window.requestAnimationFrame(measure);
    const el = peekHeaderRef.current;
    let ro: ResizeObserver | null = null;
    if (el) {
      ro = new ResizeObserver(() => measure());
      ro.observe(el);
    }
    window.addEventListener("resize", measure);
    return () => {
      window.cancelAnimationFrame(raf);
      window.removeEventListener("resize", measure);
      ro?.disconnect();
    };
  }, [peekHeaderRef]);

  useEffect(() => {
    const measure = () => {
      const el = searchHeaderRef.current;
      if (!el) return;
      const next = el.getBoundingClientRect().height;
      if (Number.isFinite(next) && next > 0) setSearchHeaderHeight(next);
    };
    measure();
    let ro: ResizeObserver | null = null;
    if (searchHeaderRef.current) {
      ro = new ResizeObserver(() => measure());
      ro.observe(searchHeaderRef.current);
    }
    window.addEventListener("resize", measure);
    return () => {
      window.removeEventListener("resize", measure);
      ro?.disconnect();
    };
  }, [searchHeaderRef]);

  useEffect(() => {
    const id = "tonight-search-results-scrollbars";
    if (document.getElementById(id)) return;
    const style = document.createElement("style");
    style.id = id;
    style.textContent = `
      .tonight-search-results,
      .tonight-search-results * {
        scrollbar-width: none;
        -ms-overflow-style: none;
      }
      .tonight-search-results::-webkit-scrollbar,
      .tonight-search-results *::-webkit-scrollbar {
        display: none;
        width: 0;
        height: 0;
      }
      .tonight-search-results .maplibregl-control-container,
      .tonight-search-results .maplibregl-ctrl-logo,
      .tonight-search-results .maplibregl-ctrl-attrib {
        display: none !important;
      }
    `;
    document.head.appendChild(style);
    return () => document.getElementById(id)?.remove();
  }, []);

  return {
    sheetHeight,
    searchHeaderHeight,
    peekHeaderHeight,
  };
}

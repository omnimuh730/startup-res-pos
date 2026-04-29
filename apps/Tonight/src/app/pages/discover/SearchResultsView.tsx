/* Airbnb-style map + draggable restaurant results */
import { useEffect, useMemo, useRef, useState, type PointerEvent as ReactPointerEvent } from "react";
import { AnimatePresence, motion } from "motion/react";
import "maplibre-gl/dist/maplibre-gl.css";
import { ArrowLeft, Map as MapIcon, Search, SlidersHorizontal, X } from "lucide-react";
import type { SearchResults, SearchResultLocation, SearchResultRestaurant, SearchResultFood, SearchResultChef } from "./discoverTypes";
import { ALL_SEARCH_DATA } from "./discoverSearchData";
import { MapSurface } from "./search-results/MapSurface";
import { MapPreviewCard, RestaurantResultCard } from "./search-results/ResultCards";
import { SearchFiltersSheet } from "./search-results/SearchFiltersSheet";
import { DEFAULT_FILTERS, type SearchFilterState, type SheetState } from "./search-results/types";
import {
  filterSearchRestaurants,
  getFilterCount,
  getNearestSheetState,
  getSheetY,
  mapRestaurantToExplorerLocation,
} from "./search-results/filterUtils";

const MOBILE_NAV_CLEARANCE_FALLBACK = 76;
const PEEK_CONTENT_HEIGHT = 60;

export function SearchResultsView({
  query,
  results,
  summary,
  onBack,
  onChangeQuery,
  onOpenSearch,
  onSelectRestaurant,
}: {
  query: string;
  results: SearchResults;
  summary?: string;
  onBack: () => void;
  onChangeQuery: (q: string) => void;
  onOpenSearch?: () => void;
  onSelectLocation: (loc: SearchResultLocation) => void;
  onSelectRestaurant: (r: SearchResultRestaurant) => void;
  onSelectFood: (f: SearchResultFood) => void;
  onSelectChef: (c: SearchResultChef) => void;
}) {
  const [sheetState, setSheetState] = useState<SheetState>("half");
  const [activeMarker, setActiveMarker] = useState(0);
  const [previewIndex, setPreviewIndex] = useState<number | null>(null);
  const sheetRef = useRef<HTMLElement | null>(null);
  const searchHeaderRef = useRef<HTMLDivElement | null>(null);
  const peekHeaderRef = useRef<HTMLButtonElement | null>(null);
  const resultsListRef = useRef<HTMLDivElement | null>(null);
  const listPullRef = useRef({ active: false, dragging: false, startX: 0, startY: 0, lastY: 0 });

  const [sheetHeight, setSheetHeight] = useState(0);
  const [bottomNavHeight, setBottomNavHeight] = useState(MOBILE_NAV_CLEARANCE_FALLBACK);
  const [globalTopBarHeight, setGlobalTopBarHeight] = useState(() => {
    return typeof window !== "undefined" && window.innerWidth >= 1024 ? 0 : 5.5 * 16;
  });
  const [searchHeaderHeight, setSearchHeaderHeight] = useState(5.25 * 16);
  const [peekHeaderHeight, setPeekHeaderHeight] = useState(PEEK_CONTENT_HEIGHT);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [filters, setFilters] = useState<SearchFilterState>(DEFAULT_FILTERS);
  const [draftFilters, setDraftFilters] = useState<SearchFilterState>(DEFAULT_FILTERS);

  const restaurants = useMemo(() => {
    if (results.restaurants.length > 0) return results.restaurants;
    if (query.trim()) return ALL_SEARCH_DATA.restaurants.slice(0, 6);
    return [];
  }, [query, results.restaurants]);

  const mappedRestaurants = useMemo(
    () => restaurants.map((restaurant, index) => mapRestaurantToExplorerLocation(restaurant, index)),
    [restaurants]
  );
  const filteredRestaurants = useMemo(
    () => filterSearchRestaurants(mappedRestaurants, filters),
    [mappedRestaurants, filters]
  );
  const draftResultCount = useMemo(
    () => filterSearchRestaurants(mappedRestaurants, draftFilters).length,
    [mappedRestaurants, draftFilters]
  );
  const activeFilterCount = getFilterCount(filters);

  const hasResults = filteredRestaurants.length > 0;
  const title = hasResults ? "Over 1,000 results" : "No restaurants found";
  const previewRestaurant = previewIndex !== null ? filteredRestaurants[previewIndex] : null;
  const peekHeight = bottomNavHeight + peekHeaderHeight;
  const sheetY = getSheetY(sheetState, sheetHeight, peekHeight);
  const isPeek = sheetState === "peek";

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
  }, []);

  useEffect(() => {
    const measure = () => {
      const el = peekHeaderRef.current;
      if (!el) return;
      setPeekHeaderHeight(el.getBoundingClientRect().height || PEEK_CONTENT_HEIGHT);
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
  }, []);

  useEffect(() => {
    const updateGlobalTopBarHeight = () => {
      const el = document.querySelector('[data-global-topbar="true"]') as HTMLElement | null;
      if (!el) {
        setGlobalTopBarHeight(typeof window !== "undefined" && window.innerWidth >= 1024 ? 0 : 5.5 * 16);
        return;
      }
      setGlobalTopBarHeight(el.getBoundingClientRect().height || 5.5 * 16);
    };
    updateGlobalTopBarHeight();
    window.addEventListener("resize", updateGlobalTopBarHeight);
    return () => window.removeEventListener("resize", updateGlobalTopBarHeight);
  }, []);

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
  }, []);

  useEffect(() => {
    const updateBottomNavHeight = () => {
      const el = document.querySelector('nav[data-bottom-nav="true"]') as HTMLElement | null;
      if (!el) {
        setBottomNavHeight(MOBILE_NAV_CLEARANCE_FALLBACK);
        return;
      }
      setBottomNavHeight(el.getBoundingClientRect().height || MOBILE_NAV_CLEARANCE_FALLBACK);
    };
    updateBottomNavHeight();
    window.addEventListener("resize", updateBottomNavHeight);
    return () => window.removeEventListener("resize", updateBottomNavHeight);
  }, []);

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

  useEffect(() => {
    if (activeMarker >= filteredRestaurants.length) setActiveMarker(0);
    if (previewIndex !== null && previewIndex >= filteredRestaurants.length) setPreviewIndex(null);
  }, [activeMarker, filteredRestaurants.length, previewIndex]);

  const openFilters = () => {
    setDraftFilters(filters);
    setFiltersOpen(true);
  };

  const applyFilters = () => {
    setFilters(draftFilters);
    setPreviewIndex(null);
    setActiveMarker(0);
    setSheetState("half");
    setFiltersOpen(false);
  };

  const resetListPull = () => {
    listPullRef.current = { active: false, dragging: false, startX: 0, startY: 0, lastY: 0 };
  };

  const handleListPointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (sheetState !== "full") return;
    if ((resultsListRef.current?.scrollTop ?? 0) > 1) return;
    event.currentTarget.setPointerCapture(event.pointerId);
    listPullRef.current = {
      active: true,
      dragging: false,
      startX: event.clientX,
      startY: event.clientY,
      lastY: event.clientY,
    };
  };

  const handleListPointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    const pull = listPullRef.current;
    if (!pull.active) return;
    const deltaY = event.clientY - pull.startY;
    const deltaX = Math.abs(event.clientX - pull.startX);
    pull.lastY = event.clientY;
    if (deltaY <= 0 || deltaX > Math.abs(deltaY)) return;
    if (!pull.dragging && (resultsListRef.current?.scrollTop ?? 0) > 1) return;
    if (deltaY > 18) {
      pull.dragging = true;
      if (event.cancelable) event.preventDefault();
    }
    if (deltaY > 42 && sheetState === "full") {
      setPreviewIndex(null);
      setSheetState("half");
    }
  };

  const handleListPointerEnd = (event: ReactPointerEvent<HTMLDivElement>) => {
    const pull = listPullRef.current;
    if (!pull.active) return;
    const deltaY = pull.lastY - pull.startY;
    if (pull.dragging && deltaY > 104) {
      setPreviewIndex(null);
      setSheetState("peek");
    }
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
    resetListPull();
  };

  return (
    <div
      className="tonight-search-results -mx-4 -mt-6 min-h-[640px] overflow-hidden bg-white sm:-mx-6 lg:-mx-8"
      style={{ height: `calc(100vh - ${Math.round(globalTopBarHeight)}px)` }}
    >
      <div className="relative h-full overflow-hidden bg-[#f5f1ea]">
        <div
          ref={searchHeaderRef}
          className="absolute left-0 right-0 top-0 z-30 border-b border-[#DDDDDD] bg-white/96 px-4 pb-3 pt-4 backdrop-blur-xl"
        >
          <div className="flex items-center gap-3">
            <button onClick={onBack} className="flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center rounded-full transition hover:bg-[#F7F7F7]" aria-label="Back">
              <ArrowLeft className="h-5 w-5" />
            </button>
            <div className="relative min-w-0 flex-1">
              <button onClick={onOpenSearch} className="h-14 w-full cursor-pointer rounded-full border border-[#DDDDDD] bg-white pl-11 pr-10 text-left shadow-[0_6px_18px_rgba(0,0,0,0.08)]">
                <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#222222]" />
                <span className="block truncate text-[0.875rem] text-[#222222]" style={{ fontWeight: 700 }}>{query || "Start your search"}</span>
                <span className="block truncate text-[0.75rem] text-[#717171]">{summary || "Tonight, 7:00 PM, 2 people"}</span>
              </button>
              {query && (
                <button onClick={() => onChangeQuery("")} className="absolute right-3 top-1/2 flex h-7 w-7 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full hover:bg-[#F7F7F7]" aria-label="Clear search">
                  <X className="h-4 w-4 text-[#717171]" />
                </button>
              )}
            </div>
            <button type="button" onClick={openFilters} className="relative flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center rounded-full border border-[#DDDDDD] bg-white shadow-[0_4px_14px_rgba(0,0,0,0.08)] transition hover:scale-[1.03]" aria-label="Open filters">
              <SlidersHorizontal className="h-4 w-4 text-[#222222]" />
              {activeFilterCount > 0 && (
                <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-[#FF385C] px-1 text-[0.625rem] text-white" style={{ fontWeight: 800 }}>
                  {activeFilterCount}
                </span>
              )}
            </button>
          </div>
        </div>

        <MapSurface
          restaurants={filteredRestaurants}
          activeMarker={activeMarker}
          onMarkerSelect={(index) => {
            setActiveMarker(index);
            setPreviewIndex(index);
            setSheetState("peek");
          }}
          onMapClick={() => setPreviewIndex(null)}
          query={query}
          topOffset={searchHeaderHeight}
        />

        <motion.section
          ref={sheetRef}
          drag="y"
          dragElastic={0.04}
          dragConstraints={{ top: 0, bottom: getSheetY("peek", sheetHeight, peekHeight) }}
          onDragStart={() => setPreviewIndex(null)}
          onDragEnd={(_, info) => {
            const projectedY = sheetY + info.offset.y + info.velocity.y * 0.16;
            if (info.velocity.y < -650) return setSheetState("full");
            if (info.velocity.y > 650) return setSheetState(sheetState === "full" ? "half" : "peek");
            setSheetState(getNearestSheetState(projectedY, sheetHeight, peekHeight));
          }}
          animate={{ y: sheetY }}
          transition={{ type: "spring", damping: 34, stiffness: 320 }}
          className="absolute bottom-0 left-0 right-0 z-20 rounded-t-[1.75rem] bg-white shadow-[0_-10px_30px_rgba(0,0,0,0.12)]"
          style={{ top: searchHeaderHeight, touchAction: sheetState === "full" ? "pan-y" : "none" }}
        >
          <button
            ref={peekHeaderRef}
            type="button"
            onClick={() => {
              setPreviewIndex(null);
              setSheetState((current) => (current === "peek" ? "half" : current === "half" ? "full" : "half"));
            }}
            className="block w-full cursor-grab px-5 pb-3 pt-2 active:cursor-grabbing"
            aria-label={isPeek ? "Show results list" : "Move results list"}
          >
            <span className="mx-auto block h-1 w-10 rounded-full bg-[#D1D1D1]" />
            <span className="mt-3 block text-center text-[1rem] text-[#222222]" style={{ fontWeight: 700 }}>{title}</span>
          </button>

          {!hasResults ? (
            <div className={`px-6 py-12 text-center transition-opacity ${isPeek ? "pointer-events-none opacity-0" : "opacity-100"}`}>
              <Search className="mx-auto mb-3 h-11 w-11 text-[#717171]/30" />
              <p className="text-[0.9375rem] text-[#222222]" style={{ fontWeight: 700 }}>
                {activeFilterCount > 0 ? "No restaurants match these filters" : `No results for "${query}"`}
              </p>
              <p className="mt-1 text-[0.8125rem] text-[#717171]">
                {activeFilterCount > 0 ? "Clear a few filters to see more places." : "Try a cuisine, restaurant name, or neighborhood."}
              </p>
            </div>
          ) : (
            <div
              ref={resultsListRef}
              onPointerDown={handleListPointerDown}
              onPointerMove={handleListPointerMove}
              onPointerUp={handleListPointerEnd}
              onPointerCancel={(event) => {
                if (event.currentTarget.hasPointerCapture(event.pointerId)) {
                  event.currentTarget.releasePointerCapture(event.pointerId);
                }
                resetListPull();
              }}
              onWheel={(event) => {
                if (sheetState === "full" && (resultsListRef.current?.scrollTop ?? 0) <= 1 && event.deltaY < -28) {
                  setPreviewIndex(null);
                  setSheetState("half");
                }
              }}
              className={`px-4 pb-0 transition-opacity ${
                isPeek ? "pointer-events-none overflow-hidden opacity-0" : sheetState === "full" ? "overflow-y-auto overscroll-contain opacity-100" : "overflow-hidden opacity-100"
              }`}
              style={{ height: `calc(100% - ${Math.round(peekHeaderHeight)}px)`, paddingBottom: `${Math.round(bottomNavHeight + 56)}px` }}
            >
              <div className="space-y-6">
                {filteredRestaurants.map((restaurant, index) => (
                  <RestaurantResultCard key={restaurant.id} restaurant={restaurant} index={index} onSelect={() => onSelectRestaurant(restaurant)} />
                ))}
              </div>
            </div>
          )}
        </motion.section>

        {sheetState === "full" && (
          <button
            type="button"
            onClick={() => {
              setSheetState("peek");
              setPreviewIndex(null);
            }}
            className="absolute left-1/2 z-40 flex -translate-x-1/2 items-center gap-2 rounded-full bg-[#222222] px-4 py-2.5 text-[0.8125rem] text-white shadow-[0_8px_18px_rgba(0,0,0,0.25)]"
            style={{ fontWeight: 700, bottom: `${Math.round(bottomNavHeight + 24)}px` }}
          >
            Map
            <MapIcon className="h-4 w-4" />
          </button>
        )}

        {isPeek && previewRestaurant && (
          <MapPreviewCard
            restaurant={previewRestaurant}
            index={previewIndex ?? 0}
            bottomNavHeight={bottomNavHeight}
            onSelect={() => onSelectRestaurant(previewRestaurant)}
          />
        )}

        <AnimatePresence>
          {filtersOpen && (
            <SearchFiltersSheet
              filters={draftFilters}
              onChange={setDraftFilters}
              onClose={() => setFiltersOpen(false)}
              onClear={() => setDraftFilters(DEFAULT_FILTERS)}
              onApply={applyFilters}
              resultCount={draftResultCount}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

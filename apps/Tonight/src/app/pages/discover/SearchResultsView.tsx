/* Airbnb-style map + draggable restaurant results */
import { useEffect, useMemo, useRef, useState, type PointerEvent as ReactPointerEvent, type ReactNode } from "react";
import { AnimatePresence, motion } from "motion/react";
import MapLibre, { Marker, type MapRef } from "react-map-gl/maplibre";
import "maplibre-gl/dist/maplibre-gl.css";
import { ArrowLeft, Check, Heart, Map as MapIcon, MapPin, Search, SlidersHorizontal, Star, X, Zap } from "lucide-react";
import { ImageWithFallback } from "../../components/figma/ImageWithFallback";
import type { SearchResults, SearchResultLocation, SearchResultRestaurant, SearchResultFood, SearchResultChef } from "./discoverTypes";
import { ALL_SEARCH_DATA } from "./discoverSearchData";
import { fmtR } from "./discoverTypes";
import {
  AMENITY_OPTIONS,
  CUISINE_OPTIONS,
  DISTANCE_OPTIONS,
  LIGHT_STYLE,
  OCCASION_OPTIONS,
  PRICE_OPTIONS,
  RATING_OPTIONS,
  RESTAURANTS,
  SEATING_OPTIONS,
  SORT_OPTIONS,
  USER_LOCATION,
} from "../explorer/explorerData";

const CARD_DETAILS = [
  { wait: "Tables tonight", area: "Gangnam", offer: "Free cancellation" },
  { wait: "Few seats left", area: "SoHo", offer: "Chef counter available" },
  { wait: "Opens at 7 PM", area: "Downtown", offer: "No booking fee" },
  { wait: "Popular tonight", area: "Midtown", offer: "Window seats available" },
  { wait: "Late seating", area: "Mission", offer: "Special menu" },
];

type SheetState = "peek" | "half" | "full";
type MappedSearchRestaurant = SearchResultRestaurant & {
  lng: number;
  lat: number;
  open?: boolean;
  distance?: string;
  mapImage: string;
};

type SearchFilterState = {
  sortBy: string;
  prices: string[];
  cuisines: string[];
  rating: string;
  distance: string;
  amenities: string[];
  occasions: string[];
  seating: string[];
  openNow: boolean;
  instantBook: boolean;
};

const DEFAULT_FILTERS: SearchFilterState = {
  sortBy: "Recommended",
  prices: [],
  cuisines: [],
  rating: "Any",
  distance: "Any Distance",
  amenities: [],
  occasions: [],
  seating: [],
  openNow: false,
  instantBook: false,
};

const MOBILE_NAV_CLEARANCE_FALLBACK = 76;
const PEEK_CONTENT_HEIGHT = 60;
const HALF_VISIBLE_RATIO = 0.62;

function getSheetY(state: SheetState, height: number, peekHeight: number) {
  if (state === "full") return 0;
  if (state === "peek") return Math.max(0, height - peekHeight);
  return Math.max(0, height * (1 - HALF_VISIBLE_RATIO));
}

function getNearestSheetState(projectedY: number, height: number, peekHeight: number): SheetState {
  const positions: Array<{ state: SheetState; y: number }> = [
    { state: "full", y: getSheetY("full", height, peekHeight) },
    { state: "half", y: getSheetY("half", height, peekHeight) },
    { state: "peek", y: getSheetY("peek", height, peekHeight) },
  ];

  return positions.reduce((nearest, option) =>
    Math.abs(option.y - projectedY) < Math.abs(nearest.y - projectedY) ? option : nearest
  ).state;
}

function mapRestaurantToExplorerLocation(restaurant: SearchResultRestaurant, index: number): MappedSearchRestaurant {
  const cuisine = restaurant.cuisine?.replace(" BBQ", "").toLowerCase();
  const byName = RESTAURANTS.find((candidate) => candidate.name.toLowerCase() === restaurant.name.toLowerCase());
  const byCuisine = cuisine ? RESTAURANTS.find((candidate) => candidate.cuisine.toLowerCase().includes(cuisine)) : null;
  const fallback = RESTAURANTS[index % RESTAURANTS.length];
  const match = byName ?? byCuisine ?? fallback;

  return {
    ...restaurant,
    lng: match.lng,
    lat: match.lat,
    open: match.open,
    distance: match.distance,
    mapImage: restaurant.image.replace("w=100&h=100", "w=400&h=300"),
  };
}

function toggleFilterValue(values: string[], value: string) {
  return values.includes(value) ? values.filter((item) => item !== value) : [...values, value];
}

function getFilterCount(filters: SearchFilterState) {
  return (
    filters.prices.length +
    filters.cuisines.length +
    filters.amenities.length +
    filters.occasions.length +
    filters.seating.length +
    (filters.sortBy !== "Recommended" ? 1 : 0) +
    (filters.rating !== "Any" ? 1 : 0) +
    (filters.distance !== "Any Distance" ? 1 : 0) +
    (filters.openNow ? 1 : 0) +
    (filters.instantBook ? 1 : 0)
  );
}

function getRestaurantSeed(restaurant: MappedSearchRestaurant, index: number) {
  const numeric = Number(restaurant.id.replace(/\D/g, ""));
  return Number.isFinite(numeric) && numeric > 0 ? numeric : index + 1;
}

function hasMockFeature(seed: number, label: string) {
  return (seed + label.length) % 3 !== 1;
}

function getPriceRank(price?: string) {
  return Math.max(1, price?.length || 2);
}

function getDistanceMiles(distance?: string) {
  return Number(distance?.match(/[\d.]+/)?.[0] || 99);
}

function filterSearchRestaurants(restaurants: MappedSearchRestaurant[], filters: SearchFilterState) {
  const filtered = restaurants.map((restaurant, index) => ({ restaurant, index })).filter(({ restaurant, index }) => {
    const seed = getRestaurantSeed(restaurant, index);

    if (filters.prices.length > 0 && !filters.prices.includes(restaurant.price || "$$")) return false;
    if (filters.cuisines.length > 0) {
      const cuisine = `${restaurant.cuisine || restaurant.subtitle}`.toLowerCase();
      if (!filters.cuisines.some((item) => cuisine.includes(item.toLowerCase().replace("grilled ", "")))) return false;
    }
    if (filters.rating !== "Any") {
      const minRating = Number(filters.rating.replace("+", ""));
      if ((restaurant.rating || 0) < minRating) return false;
    }
    if (filters.distance !== "Any Distance") {
      const maxDistance = Number(filters.distance.match(/[\d.]+/)?.[0] || 99);
      const distance = Number((restaurant.distance || "1").match(/[\d.]+/)?.[0] || 1);
      if (distance > maxDistance) return false;
    }
    if (filters.openNow && restaurant.open === false) return false;
    if (filters.instantBook && seed % 4 === 0) return false;
    if (filters.amenities.length > 0 && !filters.amenities.every((item) => hasMockFeature(seed, item))) return false;
    if (filters.occasions.length > 0 && !filters.occasions.some((item) => hasMockFeature(seed + 2, item))) return false;
    if (filters.seating.length > 0 && !filters.seating.some((item) => hasMockFeature(seed + 4, item))) return false;

    return true;
  });

  filtered.sort((a, b) => {
    if (filters.sortBy === "Highest Rated") return (b.restaurant.rating || 0) - (a.restaurant.rating || 0) || a.index - b.index;
    if (filters.sortBy === "Nearest") return getDistanceMiles(a.restaurant.distance) - getDistanceMiles(b.restaurant.distance) || a.index - b.index;
    if (filters.sortBy === "Price: Low to High") return getPriceRank(a.restaurant.price) - getPriceRank(b.restaurant.price) || a.index - b.index;
    if (filters.sortBy === "Price: High to Low") return getPriceRank(b.restaurant.price) - getPriceRank(a.restaurant.price) || a.index - b.index;
    if (filters.sortBy === "Most Reviewed") return (b.restaurant.reviews || 0) - (a.restaurant.reviews || 0) || a.index - b.index;
    return a.index - b.index;
  });

  return filtered.map(({ restaurant }) => restaurant);
}

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
    // GlobalTopBar is `lg:hidden`, so on desktop it won't exist.
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
    // Measure the "peek" header height so the title can't be clipped by the bottom nav.
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
      const next = el.getBoundingClientRect().height;
      setGlobalTopBarHeight(next || 5.5 * 16);
    };
    updateGlobalTopBarHeight();
    window.addEventListener("resize", updateGlobalTopBarHeight);
    return () => window.removeEventListener("resize", updateGlobalTopBarHeight);
  }, []);

  useEffect(() => {
    // Measure the page-internal search header height. The sheet/map "top" must be positioned
    // relative to the boundary immediately below this header (not the full screen).
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
      const next = el.getBoundingClientRect().height;
      setBottomNavHeight(next || MOBILE_NAV_CLEARANCE_FALLBACK);
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

    return () => {
      document.getElementById(id)?.remove();
    };
  }, []);

  useEffect(() => {
    if (activeMarker >= filteredRestaurants.length) setActiveMarker(0);
    if (previewIndex !== null && previewIndex >= filteredRestaurants.length) setPreviewIndex(null);
  }, [activeMarker, filteredRestaurants.length, previewIndex]);

  const expandSheet = () => {
    setPreviewIndex(null);
    setSheetState((current) => (current === "peek" ? "half" : current === "half" ? "full" : "half"));
  };

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

  const clearFilters = () => {
    setDraftFilters(DEFAULT_FILTERS);
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
            <button
              onClick={onBack}
              className="flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center rounded-full transition hover:bg-[#F7F7F7]"
              aria-label="Back"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <div className="relative min-w-0 flex-1">
              <button
                onClick={onOpenSearch}
                className="h-14 w-full cursor-pointer rounded-full border border-[#DDDDDD] bg-white pl-11 pr-10 text-left shadow-[0_6px_18px_rgba(0,0,0,0.08)]"
              >
                <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#222222]" />
                <span className="block truncate text-[0.875rem] text-[#222222]" style={{ fontWeight: 700 }}>
                  {query || "Start your search"}
                </span>
                <span className="block truncate text-[0.75rem] text-[#717171]">{summary || "Tonight, 7:00 PM, 2 people"}</span>
              </button>
              {query && (
                <button
                  onClick={() => onChangeQuery("")}
                  className="absolute right-3 top-1/2 flex h-7 w-7 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full hover:bg-[#F7F7F7]"
                  aria-label="Clear search"
                >
                  <X className="h-4 w-4 text-[#717171]" />
                </button>
              )}
            </div>
            <button
              type="button"
              onClick={openFilters}
              className="relative flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center rounded-full border border-[#DDDDDD] bg-white shadow-[0_4px_14px_rgba(0,0,0,0.08)] transition hover:scale-[1.03]"
              aria-label="Open filters"
            >
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
            if (info.velocity.y < -650) {
              setSheetState("full");
              return;
            }
            if (info.velocity.y > 650) {
              setSheetState(sheetState === "full" ? "half" : "peek");
              return;
            }
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
            onClick={expandSheet}
            className="block w-full cursor-grab px-5 pb-3 pt-2 active:cursor-grabbing"
            aria-label={isPeek ? "Show results list" : "Move results list"}
          >
            <span className="mx-auto block h-1 w-10 rounded-full bg-[#D1D1D1]" />
            <span className="mt-3 block text-center text-[1rem] text-[#222222]" style={{ fontWeight: 700 }}>
              {title}
            </span>
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
                // Keep list content clear of the fixed bottom nav and device safe-area.
                isPeek ? "pointer-events-none overflow-hidden opacity-0" : sheetState === "full" ? "overflow-y-auto overscroll-contain opacity-100" : "overflow-hidden opacity-100"
              }`}
              style={{
                height: `calc(100% - ${Math.round(peekHeaderHeight)}px)`,
                paddingBottom: `${Math.round(bottomNavHeight + 56)}px`,
              }}
            >
              <div className="space-y-6">
                {filteredRestaurants.map((restaurant, index) => (
                  <RestaurantResultCard
                    key={restaurant.id}
                    restaurant={restaurant}
                    index={index}
                    onSelect={() => onSelectRestaurant(restaurant)}
                  />
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
              onClear={clearFilters}
              onApply={applyFilters}
              resultCount={draftResultCount}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

function SearchFiltersSheet({
  filters,
  onChange,
  onClose,
  onClear,
  onApply,
  resultCount,
}: {
  filters: SearchFilterState;
  onChange: (filters: SearchFilterState) => void;
  onClose: () => void;
  onClear: () => void;
  onApply: () => void;
  resultCount: number;
}) {
  const activeCount = getFilterCount(filters);
  const update = (patch: Partial<SearchFilterState>) => onChange({ ...filters, ...patch });
  const toggleList = (key: "prices" | "cuisines" | "amenities" | "occasions" | "seating", value: string) => {
    update({ [key]: toggleFilterValue(filters[key], value) });
  };

  return (
    <motion.div
      className="fixed inset-0 z-[90] flex justify-center bg-black/30"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="absolute bottom-0 flex h-[min(88vh,760px)] w-full max-w-[430px] flex-col overflow-hidden rounded-t-[1.75rem] bg-white text-[#222222] shadow-[0_-18px_50px_rgba(0,0,0,0.2)]"
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "100%" }}
        transition={{ type: "spring", damping: 34, stiffness: 320 }}
        onClick={(event) => event.stopPropagation()}
      >
        <div className="relative flex h-14 shrink-0 items-center justify-center border-b border-[#DDDDDD]">
          <button
            type="button"
            onClick={onClose}
            className="absolute right-4 flex h-9 w-9 items-center justify-center rounded-full transition hover:bg-[#F7F7F7]"
            aria-label="Close filters"
          >
            <X className="h-5 w-5" />
          </button>
          <p className="text-[1rem]" style={{ fontWeight: 800 }}>Filters</p>
        </div>

        <div className="flex-1 overflow-y-auto px-6 pb-28 pt-6">
          <FilterSection title="Sort by">
            <div className="flex flex-wrap gap-2">
              {SORT_OPTIONS.map((option) => (
                <FilterPill
                  key={option}
                  label={option}
                  active={filters.sortBy === option}
                  onClick={() => update({ sortBy: option })}
                />
              ))}
            </div>
          </FilterSection>

          <FilterSection title="Recommended for you">
            <div className="grid grid-cols-3 gap-3">
              <RecommendedFilterCard
                label="Open now"
                active={filters.openNow}
                icon={<span className="text-[1.65rem]">●</span>}
                onClick={() => update({ openNow: !filters.openNow })}
              />
              <RecommendedFilterCard
                label="Instant Book"
                active={filters.instantBook}
                icon={<Zap className="h-8 w-8 text-[#FF385C]" />}
                onClick={() => update({ instantBook: !filters.instantBook })}
              />
              <RecommendedFilterCard
                label="Parking"
                active={filters.amenities.includes("Parking")}
                icon={<span className="text-[1.75rem]">P</span>}
                onClick={() => toggleList("amenities", "Parking")}
              />
            </div>
          </FilterSection>

          <FilterSection title="Cuisine">
            <div className="flex flex-wrap gap-2">
              {CUISINE_OPTIONS.slice(0, 12).map((option) => (
                <FilterPill
                  key={option.label}
                  label={option.label}
                  active={filters.cuisines.includes(option.label)}
                  onClick={() => toggleList("cuisines", option.label)}
                />
              ))}
            </div>
          </FilterSection>

          <FilterSection title="Price range" subtitle="Average table price, includes fees">
            <div className="mb-4 mt-3 flex h-20 items-end gap-1">
              {Array.from({ length: 34 }).map((_, index) => {
                const height = 8 + Math.round(Math.sin((index / 33) * Math.PI) * 54) + (index % 5) * 3;
                return <span key={index} className="flex-1 rounded-t-sm bg-[#FF385C]" style={{ height }} />;
              })}
            </div>
            <div className="grid grid-cols-4 gap-2">
              {PRICE_OPTIONS.map((price) => (
                <button
                  key={price}
                  type="button"
                  onClick={() => toggleList("prices", price)}
                  className={`h-11 rounded-full border text-[0.875rem] transition ${
                    filters.prices.includes(price) ? "border-[#222222] bg-[#222222] text-white" : "border-[#DDDDDD] bg-white text-[#222222]"
                  }`}
                  style={{ fontWeight: 700 }}
                >
                  {price}
                </button>
              ))}
            </div>
          </FilterSection>

          <FilterSection title="Rating">
            <div className="flex flex-wrap gap-2">
              {RATING_OPTIONS.map((rating) => (
                <FilterPill
                  key={rating}
                  label={rating}
                  active={filters.rating === rating}
                  onClick={() => update({ rating })}
                />
              ))}
            </div>
          </FilterSection>

          <FilterSection title="Distance">
            <div className="flex flex-wrap gap-2">
              {DISTANCE_OPTIONS.map((distance) => (
                <FilterPill
                  key={distance}
                  label={distance}
                  active={filters.distance === distance}
                  onClick={() => update({ distance })}
                />
              ))}
            </div>
          </FilterSection>

          <FilterSection title="Amenities">
            <div className="flex flex-wrap gap-2">
              {AMENITY_OPTIONS.map((option) => (
                <FilterPill
                  key={option.label}
                  label={option.label}
                  active={filters.amenities.includes(option.label)}
                  onClick={() => toggleList("amenities", option.label)}
                />
              ))}
            </div>
          </FilterSection>

          <FilterSection title="Seating">
            <div className="flex flex-wrap gap-2">
              {SEATING_OPTIONS.map((option) => (
                <FilterPill
                  key={option.label}
                  label={option.label}
                  active={filters.seating.includes(option.label)}
                  onClick={() => toggleList("seating", option.label)}
                />
              ))}
            </div>
          </FilterSection>

          <FilterSection title="Occasion">
            <div className="flex flex-wrap gap-2">
              {OCCASION_OPTIONS.map((option) => (
                <FilterPill
                  key={option.label}
                  label={option.label}
                  active={filters.occasions.includes(option.label)}
                  onClick={() => toggleList("occasions", option.label)}
                />
              ))}
            </div>
          </FilterSection>
        </div>

        <div className="absolute bottom-0 left-0 right-0 flex items-center justify-between gap-4 border-t border-[#DDDDDD] bg-white/95 px-6 py-4 backdrop-blur-xl">
          <button
            type="button"
            onClick={onClear}
            disabled={activeCount === 0}
            className="text-[0.9375rem] underline disabled:text-[#B0B0B0] disabled:no-underline"
            style={{ fontWeight: 700 }}
          >
            Clear all
          </button>
          <button
            type="button"
            onClick={onApply}
            className="rounded-lg bg-[#222222] px-7 py-3 text-[0.9375rem] text-white disabled:bg-[#DDDDDD]"
            style={{ fontWeight: 800 }}
            disabled={resultCount === 0}
          >
            {resultCount > 0 ? "Show 1,000+ places" : "No matches"}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

function FilterSection({ title, subtitle, children }: { title: string; subtitle?: string; children: ReactNode }) {
  return (
    <section className="border-b border-[#EBEBEB] py-6 first:pt-0">
      <h3 className="text-[1.125rem] text-[#222222]" style={{ fontWeight: 800 }}>{title}</h3>
      {subtitle && <p className="mt-0.5 text-[0.875rem] text-[#717171]">{subtitle}</p>}
      <div className="mt-4">{children}</div>
    </section>
  );
}

function RecommendedFilterCard({
  label,
  icon,
  active,
  onClick,
}: {
  label: string;
  icon: ReactNode;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button type="button" onClick={onClick} className="text-center">
      <span className={`relative flex aspect-square items-center justify-center rounded-xl border bg-white transition ${
        active ? "border-[#222222] ring-2 ring-[#222222]" : "border-[#DDDDDD]"
      }`}>
        {icon}
        {active && (
          <span className="absolute right-2 top-2 flex h-5 w-5 items-center justify-center rounded-full bg-[#222222] text-white">
            <Check className="h-3 w-3" />
          </span>
        )}
      </span>
      <span className="mt-2 block text-[0.8125rem] text-[#222222]">{label}</span>
    </button>
  );
}

function FilterPill({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full border px-4 py-2.5 text-[0.875rem] transition ${
        active ? "border-[#222222] bg-[#222222] text-white" : "border-[#DDDDDD] bg-white text-[#222222]"
      }`}
      style={{ fontWeight: active ? 700 : 500 }}
    >
      {label}
    </button>
  );
}

function MapSurface({
  restaurants,
  activeMarker,
  onMarkerSelect,
  onMapClick,
  query,
  topOffset,
}: {
  restaurants: MappedSearchRestaurant[];
  activeMarker: number;
  onMarkerSelect: (index: number) => void;
  onMapClick: () => void;
  query: string;
  topOffset: number;
}) {
  const mapRef = useRef<MapRef>(null);
  const markers = restaurants.length > 0
    ? restaurants
    : ALL_SEARCH_DATA.restaurants.slice(0, 6).map((restaurant, index) => mapRestaurantToExplorerLocation(restaurant, index));
  const [viewState, setViewState] = useState({
    longitude: USER_LOCATION.lng,
    latitude: USER_LOCATION.lat,
    zoom: 13.6,
    pitch: 0,
    bearing: 0,
  });

  return (
    <div
      className="absolute inset-x-0 bottom-0 overflow-hidden bg-[#f4f0e8]"
      style={{ top: topOffset }}
    >
      <MapLibre
        ref={mapRef}
        {...viewState}
        onMove={(event) => setViewState(event.viewState)}
        onClick={onMapClick}
        mapStyle={LIGHT_STYLE}
        style={{ width: "100%", height: "100%" }}
        maxZoom={19}
        minZoom={10}
        scrollZoom={true}
        dragPan={true}
        dragRotate={false}
        touchPitch={false}
        touchZoomRotate={true}
        attributionControl={false}
      >
        <Marker longitude={USER_LOCATION.lng} latitude={USER_LOCATION.lat} anchor="center">
          <div className="relative">
            <div className="absolute -inset-3 rounded-full bg-blue-500/20 animate-ping" style={{ animationDuration: "2.5s" }} />
            <div className="absolute -inset-2 rounded-full bg-blue-500/10" />
            <div className="h-4 w-4 rounded-full border-2 border-white bg-blue-500 shadow-lg" />
          </div>
        </Marker>

        {markers.map((restaurant, index) => {
          const active = index === activeMarker;
          const price = restaurant.price || (index % 3 === 0 ? "$$$" : "$$");
          return (
            <Marker key={`${restaurant.id}-${index}`} longitude={restaurant.lng} latitude={restaurant.lat} anchor="bottom">
              <button
                type="button"
                onClick={(event) => {
                  event.stopPropagation();
                  onMarkerSelect(index);
                  mapRef.current?.flyTo({ center: [restaurant.lng, restaurant.lat], zoom: Math.max(viewState.zoom, 14.2), duration: 450 });
                }}
                className={`relative cursor-pointer rounded-full px-3 py-1.5 text-[0.8125rem] shadow-[0_4px_12px_rgba(0,0,0,0.22)] transition ${
                  active ? "z-20 scale-110 bg-[#222222] text-white" : "bg-white text-[#222222] hover:scale-105"
                }`}
                style={{ fontWeight: 800 }}
                aria-label={`Show ${restaurant.name}`}
              >
                {price}
              </button>
            </Marker>
          );
        })}
      </MapLibre>

      <div className="absolute left-4 top-4 rounded-full bg-white/95 px-3 py-2 text-[0.8125rem] text-[#222222] shadow-[0_4px_14px_rgba(0,0,0,0.12)]" style={{ fontWeight: 700 }}>
        <MapPin className="mr-1 inline h-3.5 w-3.5" />
        {query || "Restaurants"}
      </div>
    </div>
  );
}

function RestaurantResultCard({
  restaurant,
  index,
  onSelect,
}: {
  restaurant: SearchResultRestaurant;
  index: number;
  onSelect: () => void;
}) {
  const detail = CARD_DETAILS[index % CARD_DETAILS.length];
  const discounted = index % 3 === 0;
  const basePrice = restaurant.price || "$$";

  return (
    <article className="cursor-pointer" onClick={onSelect}>
      <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-[#F7F7F7]">
        <ImageWithFallback
          src={restaurant.image.replace("w=100&h=100", "w=800&h=800")}
          alt={restaurant.name}
          className="h-full w-full object-cover transition-transform duration-500 hover:scale-[1.03]"
        />
        <span className="absolute left-3 top-3 rounded-full bg-white px-3 py-1.5 text-[0.8125rem] text-[#222222] shadow-sm" style={{ fontWeight: 700 }}>
          {index % 2 === 0 ? "Trophy pick" : "Guest favorite"}
        </span>
        <button
          type="button"
          onClick={(event) => event.stopPropagation()}
          className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-black/25 text-white backdrop-blur-sm"
          aria-label="Save restaurant"
        >
          <Heart className="h-5 w-5" />
        </button>
        <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 items-center gap-1.5">
          {[0, 1, 2, 3, 4].map((dot) => (
            <span key={dot} className={`h-1.5 w-1.5 rounded-full ${dot === 0 ? "bg-white" : "bg-white/55"}`} />
          ))}
        </div>
      </div>

      <div className="pt-3">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <p className="truncate text-[0.9375rem] text-[#222222]" style={{ fontWeight: 700 }}>{restaurant.name}</p>
            <p className="mt-0.5 text-[0.875rem] leading-snug text-[#717171]">
              {restaurant.cuisine || restaurant.subtitle} in {detail.area}
            </p>
            <p className="mt-0.5 text-[0.875rem] text-[#717171]">{detail.offer}</p>
            <p className="mt-0.5 text-[0.875rem] text-[#717171]">{detail.wait}</p>
          </div>
          <span className="flex shrink-0 items-center gap-1 text-[0.875rem] text-[#222222]">
            <Star className="h-4 w-4 fill-current" />
            {fmtR(restaurant.rating || 4.7)}
          </span>
        </div>
        <p className="mt-2 text-[0.9375rem] text-[#222222]">
          {discounted && <span className="mr-1 text-[#717171] line-through">{basePrice}</span>}
          <span className={discounted ? "underline" : ""} style={{ fontWeight: 700 }}>{discounted ? "$$" : basePrice}</span>
          <span className="text-[#717171]"> for tonight</span>
        </p>
      </div>
    </article>
  );
}

function MapPreviewCard({
  restaurant,
  index,
  bottomNavHeight,
  onSelect,
}: {
  restaurant: MappedSearchRestaurant;
  index: number;
  bottomNavHeight: number;
  onSelect: () => void;
}) {
  const detail = CARD_DETAILS[index % CARD_DETAILS.length];
  const basePrice = restaurant.price || "$$";

  return (
    <motion.article
      initial={{ opacity: 0, y: 28, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 20, scale: 0.96 }}
      transition={{ type: "spring", damping: 24, stiffness: 280 }}
      className="absolute left-4 right-4 z-40 overflow-hidden rounded-2xl bg-white shadow-[0_12px_30px_rgba(0,0,0,0.28)]"
      style={{ bottom: `${Math.round(bottomNavHeight + 100)}px` }}
      onClick={onSelect}
    >
      <div className="relative h-40 bg-[#F7F7F7]">
        <ImageWithFallback
          src={restaurant.mapImage.replace("w=400&h=300", "w=700&h=420")}
          alt={restaurant.name}
          className="h-full w-full object-cover"
        />
        <span className="absolute left-3 top-3 rounded-full bg-white px-3 py-1.5 text-[0.8125rem] text-[#222222] shadow-sm" style={{ fontWeight: 700 }}>
          Trophy pick
        </span>
        <button
          type="button"
          onClick={(event) => event.stopPropagation()}
          className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-white/95 text-[#222222] shadow-sm"
          aria-label="Save restaurant"
        >
          <Heart className="h-5 w-5" />
        </button>
        <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 items-center gap-1.5">
          {[0, 1, 2, 3, 4].map((dot) => (
            <span key={dot} className={`h-1.5 w-1.5 rounded-full ${dot === 0 ? "bg-white" : "bg-white/55"}`} />
          ))}
        </div>
      </div>
      <div className="px-4 py-3">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <p className="truncate text-[0.9375rem] text-[#222222]" style={{ fontWeight: 700 }}>{restaurant.name}</p>
            <p className="truncate text-[0.8125rem] text-[#717171]">{restaurant.cuisine || restaurant.subtitle} in {detail.area}</p>
            <p className="truncate text-[0.8125rem] text-[#717171]">{detail.wait}</p>
          </div>
          <span className="flex shrink-0 items-center gap-1 text-[0.875rem] text-[#222222]">
            <Star className="h-4 w-4 fill-current" />
            {fmtR(restaurant.rating || 4.7)}
          </span>
        </div>
        <p className="mt-1 text-[0.875rem] text-[#222222]">
          <span className="mr-1 text-[#717171] line-through">{basePrice}</span>
          <span className="underline" style={{ fontWeight: 700 }}>$$</span>
          <span className="text-[#717171]"> for tonight</span>
        </p>
      </div>
    </motion.article>
  );
}

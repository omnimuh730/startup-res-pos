/* Airbnb-style map + draggable restaurant results */
import { useEffect, useMemo, useRef, useState, type PointerEvent as ReactPointerEvent } from "react";
import { motion } from "motion/react";
import MapLibre, { Marker, type MapRef } from "react-map-gl/maplibre";
import "maplibre-gl/dist/maplibre-gl.css";
import { ArrowLeft, Heart, Map as MapIcon, MapPin, Search, Star, X } from "lucide-react";
import { ImageWithFallback } from "../../components/figma/ImageWithFallback";
import type { SearchResults, SearchResultLocation, SearchResultRestaurant, SearchResultFood, SearchResultChef } from "./discoverTypes";
import { ALL_SEARCH_DATA } from "./discoverSearchData";
import { fmtR } from "./discoverTypes";
import { LIGHT_STYLE, RESTAURANTS, USER_LOCATION } from "../explorer/explorerData";

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

const MOBILE_NAV_CLEARANCE = 76;
const PEEK_CONTENT_HEIGHT = 40;
const PEEK_HEIGHT = MOBILE_NAV_CLEARANCE + PEEK_CONTENT_HEIGHT;
const HALF_VISIBLE_RATIO = 0.62;

function getSheetY(state: SheetState, height: number) {
  if (state === "full") return 0;
  if (state === "peek") return Math.max(0, height - PEEK_HEIGHT);
  return Math.max(0, height * (1 - HALF_VISIBLE_RATIO));
}

function getNearestSheetState(projectedY: number, height: number): SheetState {
  const positions: Array<{ state: SheetState; y: number }> = [
    { state: "full", y: getSheetY("full", height) },
    { state: "half", y: getSheetY("half", height) },
    { state: "peek", y: getSheetY("peek", height) },
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
  const resultsListRef = useRef<HTMLDivElement | null>(null);
  const listPullRef = useRef({ active: false, dragging: false, startX: 0, startY: 0, lastY: 0 });
  const [sheetHeight, setSheetHeight] = useState(0);
  const restaurants = useMemo(() => {
    if (results.restaurants.length > 0) return results.restaurants;
    if (query.trim()) return ALL_SEARCH_DATA.restaurants.slice(0, 6);
    return [];
  }, [query, results.restaurants]);
  const mappedRestaurants = useMemo(
    () => restaurants.map((restaurant, index) => mapRestaurantToExplorerLocation(restaurant, index)),
    [restaurants]
  );

  const hasResults = mappedRestaurants.length > 0;
  const title = hasResults ? "Over 1,000 results" : "No restaurants found";
  const previewRestaurant = previewIndex !== null ? mappedRestaurants[previewIndex] : null;
  const sheetY = getSheetY(sheetState, sheetHeight);
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

  const expandSheet = () => {
    setPreviewIndex(null);
    setSheetState((current) => (current === "peek" ? "half" : current === "half" ? "full" : "half"));
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
    <div className="tonight-search-results -mx-4 -mt-6 h-[calc(100vh-5.5rem)] min-h-[640px] overflow-hidden bg-white sm:-mx-6 lg:-mx-8">
      <div className="relative h-full overflow-hidden bg-[#f5f1ea]">
        <div className="absolute left-0 right-0 top-0 z-30 border-b border-[#DDDDDD] bg-white/96 px-4 pb-3 pt-4 backdrop-blur-xl">
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
          </div>
        </div>

        <MapSurface
          restaurants={mappedRestaurants}
          activeMarker={activeMarker}
          onMarkerSelect={(index) => {
            setActiveMarker(index);
            setPreviewIndex(index);
            setSheetState("peek");
          }}
          onMapClick={() => setPreviewIndex(null)}
          query={query}
        />

        <motion.section
          ref={sheetRef}
          drag="y"
          dragElastic={0.04}
          dragConstraints={{ top: 0, bottom: getSheetY("peek", sheetHeight) }}
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
            setSheetState(getNearestSheetState(projectedY, sheetHeight));
          }}
          animate={{ y: sheetY }}
          transition={{ type: "spring", damping: 34, stiffness: 320 }}
          className="absolute bottom-0 left-0 right-0 top-[5.25rem] z-20 rounded-t-[1.75rem] bg-white shadow-[0_-10px_30px_rgba(0,0,0,0.12)]"
          style={{ touchAction: sheetState === "full" ? "pan-y" : "none" }}
        >
          <button
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
              <p className="text-[0.9375rem] text-[#222222]" style={{ fontWeight: 700 }}>No results for "{query}"</p>
              <p className="mt-1 text-[0.8125rem] text-[#717171]">Try a cuisine, restaurant name, or neighborhood.</p>
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
              className={`h-[calc(100%-4.5rem)] px-4 pb-14 transition-opacity ${
                isPeek ? "pointer-events-none overflow-hidden opacity-0" : sheetState === "full" ? "overflow-y-auto overscroll-contain opacity-100" : "overflow-hidden opacity-100"
              }`}
            >
              <div className="space-y-6">
                {restaurants.map((restaurant, index) => (
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
            className="absolute bottom-[5.25rem] left-1/2 z-40 flex -translate-x-1/2 items-center gap-2 rounded-full bg-[#222222] px-4 py-2.5 text-[0.8125rem] text-white shadow-[0_8px_18px_rgba(0,0,0,0.25)]"
            style={{ fontWeight: 700 }}
          >
            Map
            <MapIcon className="h-4 w-4" />
          </button>
        )}

        {isPeek && previewRestaurant && (
          <MapPreviewCard
            restaurant={previewRestaurant}
            index={previewIndex ?? 0}
            onSelect={() => onSelectRestaurant(previewRestaurant)}
          />
        )}
      </div>
    </div>
  );
}

function MapSurface({
  restaurants,
  activeMarker,
  onMarkerSelect,
  onMapClick,
  query,
}: {
  restaurants: MappedSearchRestaurant[];
  activeMarker: number;
  onMarkerSelect: (index: number) => void;
  onMapClick: () => void;
  query: string;
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
    <div className="absolute inset-x-0 bottom-0 top-[5.25rem] overflow-hidden bg-[#f4f0e8]">
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
  onSelect,
}: {
  restaurant: MappedSearchRestaurant;
  index: number;
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
      className="absolute bottom-44 left-4 right-4 z-40 overflow-hidden rounded-2xl bg-white shadow-[0_12px_30px_rgba(0,0,0,0.28)]"
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

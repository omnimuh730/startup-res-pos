/* Main Explorer Page with map, search, filters, and restaurant list */
import { useState, useRef, useCallback, useEffect } from "react";
import { useLocation, useNavigate, useSearchParams, useOutletContext } from "react-router";
import type { AppOutletContext } from "../../AppLayout";
import Map, { Marker, type MapRef } from "react-map-gl/maplibre";
import "maplibre-gl/dist/maplibre-gl.css";
import {
  Search, X, SlidersHorizontal, Crosshair, Star,
  RotateCcw, Navigation, CalendarDays, UtensilsCrossed,
  Plus, Minus, Clock, ChevronDown,
} from "lucide-react";
import { Drawer, DrawerBody } from "../../components/ds/Drawer";
import { Button } from "../../components/ds/Button";
import { ListGroup } from "../../components/ds/ListGroup";
import { ImageWithFallback } from "../../components/figma/ImageWithFallback";
import { RestaurantDetailView } from "../detail/RestaurantDetailView";
import type { RestaurantData } from "../detail/restaurantDetailData";
import { BookTableFlow } from "../booking/BookTableFlow";
import {
  fmtR, LIGHT_STYLE, DARK_STYLE, USER_LOCATION, RESTAURANTS, CATEGORIES,
  SORT_OPTIONS, PRICE_OPTIONS, CUISINE_OPTIONS, RATING_OPTIONS, DISTANCE_OPTIONS,
  OCCASION_OPTIONS, SEATING_OPTIONS, AMENITY_OPTIONS,
  type DrawerMode, type ViewMode,
} from "./explorerData";
import {
  useIsDarkTheme, useSwipeable, ActionBtn, FilterChip, FilterSection, FilterBarChip,
} from "./ExplorerWidgets";

export function ExplorerPage() {
  const mapRef = useRef<MapRef>(null);
  const catScrollRef = useRef<HTMLDivElement>(null);
  const filterScrollRef = useRef<HTMLDivElement>(null);
  const isDraggingRight = useRef(false);
  const lastMousePos = useRef({ x: 0, y: 0 });

  useSwipeable(catScrollRef);
  useSwipeable(filterScrollRef);

  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const outletCtx = useOutletContext<AppOutletContext | undefined>();

  // Initialize state from URL on first render
  const initFromUrl = () => ({
    search: searchParams.get("q") ?? "",
    category: searchParams.get("category") ?? "all",
    sort: searchParams.get("sort") ?? "Recommended",
    prices: new Set((searchParams.get("prices") ?? "").split(",").filter(Boolean)),
    cuisines: new Set((searchParams.get("cuisine") ?? "").split(",").filter(Boolean)),
    rating: searchParams.get("rating") ?? "Any",
    distance: searchParams.get("distance") ?? "Any Distance",
    occasion: new Set((searchParams.get("occasion") ?? "").split(",").filter(Boolean)),
    seating: new Set((searchParams.get("seating") ?? "").split(",").filter(Boolean)),
    amenity: new Set((searchParams.get("amenity") ?? "").split(",").filter(Boolean)),
    openNow: searchParams.get("open") === "1",
  });
  const urlInit = useRef(initFromUrl()).current;

  const [searchValue, setSearchValue] = useState(urlInit.search);
  const [searchFocused, setSearchFocused] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>(["Sakura Omakase", "Italian", "Seafood", "Brunch", "Korean BBQ"]);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const [activeCategory, setActiveCategory] = useState(urlInit.category);
  const [selectedRestaurant, setSelectedRestaurant] = useState<string | null>(null);

  // Parse URL for detail/book sub-routes
  const subPath = location.pathname.replace(/^\/explorer\/?/, "");
  const [subType, subId, subAction] = subPath.split("/");
  const isNearbyMode = subType === "nearby";
  const NEARBY_RADIUS_M = 1000;
  const [mapLoaded, setMapLoaded] = useState(false);
  const urlDetailId = subType === "restaurant" ? subId : null;
  const urlViewMode: ViewMode = urlDetailId
    ? subAction === "book" ? "book" : "detail"
    : "map";
  const urlDetailRestaurant: RestaurantData | null = urlDetailId ? (RESTAURANTS.find(r => r.id === urlDetailId) ?? null) : null;

  const viewMode = urlViewMode;
  const detailRestaurant = urlViewMode === "detail" || urlViewMode === "book" ? urlDetailRestaurant : null;
  const setDetailRestaurant = (r: RestaurantData | null) => {
    if (r) navigate(`/explorer/restaurant/${r.id}`);
    else navigate({ pathname: "/explorer", search: searchParams.toString() });
  };
  const bookRestaurant = urlViewMode === "book" ? urlDetailRestaurant : null;
  const setBookRestaurant = (r: RestaurantData | null) => {
    if (r) navigate(`/explorer/restaurant/${r.id}/book`);
    else if (detailRestaurant) navigate(`/explorer/restaurant/${detailRestaurant.id}`);
    else navigate({ pathname: "/explorer", search: searchParams.toString() });
  };

  const [routeCoords, setRouteCoords] = useState<[number, number][] | null>(null);
  const [routeInfo, setRouteInfo] = useState<{ distance: string; duration: string } | null>(null);
  const [directionsLoading, setDirectionsLoading] = useState(false);

  const [listExpanded, setListExpanded] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const dragStartY = useRef(0);
  const dragStartExpanded = useRef(false);
  const [dragOffset, setDragOffset] = useState<number | null>(null);
  const isDraggingPanel = useRef(false);
  const maxPanelHeight = typeof window !== "undefined" ? window.innerHeight * 0.7 : 500;
  const collapsedHeight = 72;

  const [drawerMode, setDrawerMode] = useState<DrawerMode>(null);
  const [sortBy, setSortBy] = useState(urlInit.sort);
  const [selectedPrices, setSelectedPrices] = useState<Set<string>>(urlInit.prices);
  const [minRating, setMinRating] = useState(urlInit.rating);
  const [distance, setDistance] = useState(urlInit.distance);
  const [selectedCuisines, setSelectedCuisines] = useState<Set<string>>(urlInit.cuisines);
  const [selectedOccasions, setSelectedOccasions] = useState<Set<string>>(urlInit.occasion);
  const [selectedSeating, setSelectedSeating] = useState<Set<string>>(urlInit.seating);
  const [selectedAmenities, setSelectedAmenities] = useState<Set<string>>(urlInit.amenity);
  const [openNowOnly, setOpenNowOnly] = useState(urlInit.openNow);

  // Sync filter state → URL whenever any changes
  useEffect(() => {
    const next = new URLSearchParams();
    if (searchValue) next.set("q", searchValue);
    if (activeCategory && activeCategory !== "all") next.set("category", activeCategory);
    if (sortBy && sortBy !== "Recommended") next.set("sort", sortBy);
    if (selectedPrices.size) next.set("prices", Array.from(selectedPrices).join(","));
    if (selectedCuisines.size) next.set("cuisine", Array.from(selectedCuisines).join(","));
    if (minRating && minRating !== "Any") next.set("rating", minRating);
    if (distance && distance !== "Any Distance") next.set("distance", distance);
    if (selectedOccasions.size) next.set("occasion", Array.from(selectedOccasions).join(","));
    if (selectedSeating.size) next.set("seating", Array.from(selectedSeating).join(","));
    if (selectedAmenities.size) next.set("amenity", Array.from(selectedAmenities).join(","));
    if (openNowOnly) next.set("open", "1");
    setSearchParams(next, { replace: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchValue, activeCategory, sortBy, selectedPrices, selectedCuisines, minRating, distance, selectedOccasions, selectedSeating, selectedAmenities, openNowOnly]);

  const [viewState, setViewState] = useState({ longitude: USER_LOCATION.lng, latitude: USER_LOCATION.lat, zoom: 14, pitch: 0, bearing: 0 });
  const isDark = useIsDarkTheme();

  useEffect(() => {
    const id = "explorer-map-style";
    if (document.getElementById(id)) return;
    const style = document.createElement("style");
    style.id = id;
    style.textContent = `.maplibregl-ctrl-group button { background: var(--card) !important; border-color: var(--border) !important; } .maplibregl-ctrl-group button:hover { background: var(--secondary) !important; } .maplibregl-ctrl-group button + button { border-top-color: var(--border) !important; }`;
    document.head.appendChild(style);
    return () => { document.getElementById(id)?.remove(); };
  }, []);

  const handleMouseDown = useCallback((e: React.MouseEvent) => { if (e.button === 2) { isDraggingRight.current = true; lastMousePos.current = { x: e.clientX, y: e.clientY }; e.preventDefault(); } }, []);
  const handleMouseMove = useCallback((e: React.MouseEvent) => { if (isDraggingRight.current) { const dx = e.clientX - lastMousePos.current.x; const dy = e.clientY - lastMousePos.current.y; setViewState(prev => ({ ...prev, bearing: prev.bearing + dx * 0.3, pitch: Math.max(0, Math.min(85, prev.pitch - dy * 0.3)) })); lastMousePos.current = { x: e.clientX, y: e.clientY }; } }, []);
  const handleMouseUp = useCallback(() => { isDraggingRight.current = false; }, []);
  const handleContextMenu = useCallback((e: React.MouseEvent) => { e.preventDefault(); }, []);

  const haversineM = (lat1: number, lng1: number, lat2: number, lng2: number) => {
    const R = 6371000, toRad = (d: number) => (d * Math.PI) / 180;
    const dLat = toRad(lat2 - lat1), dLng = toRad(lng2 - lng1);
    const a = Math.sin(dLat / 2) ** 2 + Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  };
  const nearbyCircleGeoJSON = (() => {
    const steps = 64, coords: [number, number][] = [];
    const latRad = (USER_LOCATION.lat * Math.PI) / 180;
    const dLat = (NEARBY_RADIUS_M / 6371000) * (180 / Math.PI);
    const dLng = dLat / Math.cos(latRad);
    for (let i = 0; i <= steps; i++) {
      const t = (i / steps) * 2 * Math.PI;
      coords.push([USER_LOCATION.lng + dLng * Math.cos(t), USER_LOCATION.lat + dLat * Math.sin(t)]);
    }
    return { type: "FeatureCollection" as const, features: [{ type: "Feature" as const, properties: {}, geometry: { type: "Polygon" as const, coordinates: [coords] } }] };
  })();

  const filteredRestaurants = RESTAURANTS.filter(r => {
    if (isNearbyMode) {
      if (haversineM(USER_LOCATION.lat, USER_LOCATION.lng, r.lat, r.lng) > NEARBY_RADIUS_M) return false;
      if (!r.open) return false;
    }
    if (activeCategory !== "all") {
      const catMap: Record<string, string[]> = { sushi: ["Japanese"], italian: ["Italian"], thai: ["Thai"], korean: ["Korean"], french: ["French"], chinese: ["Chinese"], seafood: ["Seafood"], vegan: ["Vegan"], brunch: ["Brunch"] };
      if (catMap[activeCategory] && !catMap[activeCategory].includes(r.cuisine)) return false;
    }
    if (searchValue) { const q = searchValue.toLowerCase(); if (!r.name.toLowerCase().includes(q) && !r.cuisine.toLowerCase().includes(q)) return false; }
    if (openNowOnly && !r.open) return false;
    return true;
  });

  const flyToUser = useCallback(() => { mapRef.current?.flyTo({ center: [USER_LOCATION.lng, USER_LOCATION.lat], zoom: 15, duration: 800 }); }, []);

  useEffect(() => {
    if (!isNearbyMode) return;
    const t = setTimeout(() => { mapRef.current?.flyTo({ center: [USER_LOCATION.lng, USER_LOCATION.lat], zoom: 14.2, duration: 600 }); }, 200);
    return () => clearTimeout(t);
  }, [isNearbyMode]);

  useEffect(() => {
    if (!mapLoaded) return;
    const map = mapRef.current?.getMap();
    if (!map) return;
    const apply = () => {
      if (!map.isStyleLoaded()) { map.once("styledata", apply); return; }
      if (isNearbyMode) {
        if (map.getSource("nearby-circle")) { (map.getSource("nearby-circle") as any).setData(nearbyCircleGeoJSON); }
        else {
          map.addSource("nearby-circle", { type: "geojson", data: nearbyCircleGeoJSON });
          map.addLayer({ id: "nearby-circle-fill", type: "fill", source: "nearby-circle", paint: { "fill-color": "#3b82f6", "fill-opacity": 0.12 } });
          map.addLayer({ id: "nearby-circle-line", type: "line", source: "nearby-circle", paint: { "line-color": "#3b82f6", "line-width": 2, "line-opacity": 0.7 } });
        }
      } else {
        if (map.getLayer("nearby-circle-line")) map.removeLayer("nearby-circle-line");
        if (map.getLayer("nearby-circle-fill")) map.removeLayer("nearby-circle-fill");
        if (map.getSource("nearby-circle")) map.removeSource("nearby-circle");
      }
    };
    apply();
  }, [isNearbyMode, isDark, mapLoaded]);
  const toggleSet = (set: Set<string>, value: string) => { const next = new Set(set); next.has(value) ? next.delete(value) : next.add(value); return next; };
  const resetFilters = () => { setSortBy("Recommended"); setSelectedPrices(new Set()); setMinRating("Any"); setDistance("Any Distance"); setSelectedCuisines(new Set()); setSelectedOccasions(new Set()); setSelectedSeating(new Set()); setSelectedAmenities(new Set()); };
  const activeFilterCount = [sortBy !== "Recommended" ? 1 : 0, selectedPrices.size, minRating !== "Any" ? 1 : 0, distance !== "Any Distance" ? 1 : 0, selectedCuisines.size, selectedOccasions.size, selectedSeating.size, selectedAmenities.size].reduce((a, b) => a + b, 0);

  const openDetail = (r: RestaurantData) => { setDetailRestaurant(r); setSelectedRestaurant(null); };
  const openBookTable = (r: RestaurantData) => { setBookRestaurant(r); };

  const openDirections = useCallback(async (r: RestaurantData) => {
    setDirectionsLoading(true);
    try {
      const res = await fetch(`https://router.project-osrm.org/route/v1/foot/${USER_LOCATION.lng},${USER_LOCATION.lat};${r.lng},${r.lat}?overview=full&geometries=geojson`);
      const data = await res.json();
      if (data.routes?.[0]) {
        const route = data.routes[0];
        const coords: [number, number][] = route.geometry.coordinates;
        setRouteCoords(coords);
        const distM = route.distance; const durS = route.duration;
        setRouteInfo({ distance: distM < 1000 ? `${Math.round(distM)} m` : `${(distM / 1609.34).toFixed(1)} mi`, duration: `${Math.round(durS / 60)} min` });
        const map = mapRef.current?.getMap();
        if (map) {
          const geojson: any = { type: "Feature", properties: {}, geometry: route.geometry };
          if (map.getSource("route")) { (map.getSource("route") as any).setData(geojson); }
          else { map.addSource("route", { type: "geojson", data: geojson }); map.addLayer({ id: "route-line-bg", type: "line", source: "route", layout: { "line-join": "round", "line-cap": "round" }, paint: { "line-color": "#3b82f6", "line-width": 8, "line-opacity": 0.3 } }); map.addLayer({ id: "route-line", type: "line", source: "route", layout: { "line-join": "round", "line-cap": "round" }, paint: { "line-color": "#3b82f6", "line-width": 4, "line-opacity": 0.9 } }); }
          const lngs = coords.map(c => c[0]); const lats = coords.map(c => c[1]);
          map.fitBounds([[Math.min(...lngs), Math.min(...lats)], [Math.max(...lngs), Math.max(...lats)]], { padding: 80, duration: 1000 });
        }
      }
    } catch { mapRef.current?.flyTo({ center: [(USER_LOCATION.lng + r.lng) / 2, (USER_LOCATION.lat + r.lat) / 2], zoom: 15, duration: 800 }); }
    setDirectionsLoading(false);
    setSelectedRestaurant(r.id);
  }, []);

  // Handle incoming ?directions=<id> query param (from Discover's Directions button)
  const pendingDirectionsId = useRef<string | null>(searchParams.get("directions"));
  useEffect(() => {
    const id = pendingDirectionsId.current;
    if (!id) return;
    pendingDirectionsId.current = null;
    const r = RESTAURANTS.find(x => x.id === id);
    if (!r) return;
    const waitForMap = () => {
      if (mapRef.current?.getMap()?.loaded()) { openDirections(r); }
      else { setTimeout(waitForMap, 150); }
    };
    waitForMap();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const clearRoute = useCallback(() => {
    setRouteCoords(null); setRouteInfo(null);
    const map = mapRef.current?.getMap();
    if (map) { if (map.getLayer("route-line")) map.removeLayer("route-line"); if (map.getLayer("route-line-bg")) map.removeLayer("route-line-bg"); if (map.getSource("route")) map.removeSource("route"); }
  }, []);

  // Panel drag handlers
  const handlePanelTouchStart = (e: React.TouchEvent) => { dragStartY.current = e.touches[0].clientY; dragStartExpanded.current = listExpanded; isDraggingPanel.current = true; setDragOffset(0); };
  const handlePanelTouchMove = (e: React.TouchEvent) => { if (!isDraggingPanel.current) return; setDragOffset(dragStartY.current - e.touches[0].clientY); };
  const handlePanelTouchEnd = () => { isDraggingPanel.current = false; if (dragOffset !== null) { const startH = dragStartExpanded.current ? maxPanelHeight : collapsedHeight; const currentH = Math.max(collapsedHeight, Math.min(maxPanelHeight, startH + dragOffset)); const threshold = (maxPanelHeight - collapsedHeight) * 0.35; setListExpanded(currentH > collapsedHeight + threshold); } setDragOffset(null); };
  const handlePanelMouseDown = (e: React.MouseEvent) => {
    isDraggingPanel.current = true; dragStartY.current = e.clientY; dragStartExpanded.current = listExpanded; setDragOffset(0);
    const onMove = (ev: MouseEvent) => { setDragOffset(dragStartY.current - ev.clientY); };
    const onUp = (ev: MouseEvent) => { isDraggingPanel.current = false; const diff = dragStartY.current - ev.clientY; const startH = dragStartExpanded.current ? maxPanelHeight : collapsedHeight; const currentH = Math.max(collapsedHeight, Math.min(maxPanelHeight, startH + diff)); const threshold = (maxPanelHeight - collapsedHeight) * 0.35; setListExpanded(currentH > collapsedHeight + threshold); setDragOffset(null); window.removeEventListener("mousemove", onMove); window.removeEventListener("mouseup", onUp); };
    window.addEventListener("mousemove", onMove); window.addEventListener("mouseup", onUp);
  };

  const computedPanelHeight = (() => {
    if (dragOffset !== null && isDraggingPanel.current) { const startH = dragStartExpanded.current ? maxPanelHeight : collapsedHeight; return Math.max(collapsedHeight, Math.min(maxPanelHeight, startH + dragOffset)); }
    return listExpanded ? maxPanelHeight : collapsedHeight;
  })();
  const showListContent = computedPanelHeight > collapsedHeight + 20;

  const drawerTitle = drawerMode === "sort" ? "Sort By" : drawerMode === "price" ? "Price Range" : drawerMode === "cuisine" ? "Cuisine" : drawerMode === "amenities" ? "Amenities" : "All Filters";

  // ── Detail / Book views ──
  if (viewMode === "detail" && detailRestaurant) {
    return <RestaurantDetailView restaurant={detailRestaurant} onBack={() => setDetailRestaurant(null)} onBookTable={r => openBookTable(r)} onDirections={r => { setDetailRestaurant(null); openDirections(r); }} onSave={outletCtx?.toggleSaveRestaurant} />;
  }
  if (viewMode === "book" && bookRestaurant) {
    return <BookTableFlow restaurant={bookRestaurant} onBack={() => setBookRestaurant(null)} onComplete={() => { setBookRestaurant(null); setDetailRestaurant(null); }} />;
  }

  const showActionPanel = selectedRestaurant !== null;
  const selectedR = showActionPanel ? RESTAURANTS.find(r => r.id === selectedRestaurant) : null;

  return (
    <div className="relative w-full h-full min-h-[calc(100vh-64px)] lg:min-h-screen flex flex-col">
      {/* ── Top Overlay: Search + Categories ── */}
      {!showActionPanel && !listExpanded && !showListContent && (
        <div className="absolute top-0 left-0 right-0 z-20 px-3 pt-3">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
            <input type="text" value={searchValue} onChange={e => setSearchValue(e.target.value)} placeholder="Search restaurants, cuisines..." className="w-full pl-11 pr-10 py-3 bg-card border border-border rounded-full text-[0.875rem] outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all shadow-lg" onFocus={() => setSearchFocused(true)} onBlur={() => setTimeout(() => setSearchFocused(false), 200)} ref={searchInputRef} />
            {searchValue && <button onClick={() => setSearchValue("")} className="absolute right-4 top-1/2 -translate-y-1/2 p-0.5 hover:bg-secondary rounded-full cursor-pointer"><X className="w-4 h-4 text-muted-foreground" /></button>}
            {searchFocused && !searchValue && recentSearches.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-2 z-50">
                <div className="bg-card border border-border rounded-xl shadow-xl overflow-hidden">
                  <div className="flex items-center justify-between px-3 py-2">
                    <span className="text-[0.8125rem] text-muted-foreground" style={{ fontWeight: 500 }}>Recent Searches</span>
                    <button onMouseDown={e => e.preventDefault()} onClick={() => setRecentSearches([])} className="text-[0.75rem] text-primary cursor-pointer hover:underline">Clear All</button>
                  </div>
                  <ListGroup items={recentSearches.map((term, idx) => ({ id: `recent-${idx}`, label: term, icon: <Clock className="w-4 h-4" />, rightContent: (<button onMouseDown={e => e.preventDefault()} onClick={e => { e.stopPropagation(); setRecentSearches(prev => prev.filter((_, i) => i !== idx)); }} className="p-1 hover:bg-secondary rounded-full cursor-pointer"><X className="w-3 h-3 text-muted-foreground" /></button>), onClick: () => { setSearchValue(term); setSearchFocused(false); searchInputRef.current?.blur(); } }))} variant="default" hoverable />
                </div>
              </div>
            )}
          </div>
          <div ref={catScrollRef} className="flex gap-2 mt-2.5 overflow-x-auto scrollbar-hide pb-1 select-none">
            {CATEGORIES.map(cat => (
              <button key={cat.id} onClick={() => setActiveCategory(cat.id)} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[0.8125rem] whitespace-nowrap transition-all cursor-pointer shrink-0 ${activeCategory === cat.id ? "bg-primary text-primary-foreground shadow-md" : "bg-card border border-border text-foreground hover:bg-secondary"}`}>
                <span>{cat.emoji}</span>{cat.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ── Map ── */}
      <div className="flex-1 w-full" onMouseDown={handleMouseDown} onMouseMove={handleMouseMove} onMouseUp={handleMouseUp} onMouseLeave={handleMouseUp} onContextMenu={handleContextMenu} onClick={() => { if (!listExpanded) setSelectedRestaurant(null); }}>
        <Map ref={mapRef} {...viewState} onMove={evt => setViewState(evt.viewState)} onLoad={() => setMapLoaded(true)} mapStyle={isDark ? DARK_STYLE : LIGHT_STYLE} style={{ width: "100%", height: "100%" }} maxZoom={19} scrollZoom={true} dragPan={!isDraggingRight.current} dragRotate={false} touchPitch={true} touchZoomRotate={true} attributionControl={false}>
          <Marker longitude={USER_LOCATION.lng} latitude={USER_LOCATION.lat} anchor="center">
            <div className="relative"><div className="absolute -inset-3 rounded-full bg-blue-500/20 animate-ping" style={{ animationDuration: "2.5s" }} /><div className="absolute -inset-2 rounded-full bg-blue-500/10" /><div className="w-4 h-4 rounded-full bg-blue-500 border-2 border-white shadow-lg" /></div>
          </Marker>
          {filteredRestaurants.map(r => (
            <Marker key={r.id} longitude={r.lng} latitude={r.lat} anchor="bottom">
              <button onClick={e => { e.stopPropagation(); if (selectedRestaurant === r.id) openDetail(r); else setSelectedRestaurant(r.id); }} className={`relative cursor-pointer transition-transform duration-200 ${selectedRestaurant === r.id ? "scale-110 z-20" : "hover:scale-105"}`}>
                <div className={`flex flex-col items-center ${!r.open && selectedRestaurant !== r.id ? "opacity-60" : ""}`}>
                  <div className={`rounded-xl overflow-hidden border-2 shadow-lg transition-all ${selectedRestaurant === r.id ? "border-primary shadow-primary/40" : "border-white/80"}`}>
                    <img src={r.image} alt={r.name} className="w-12 h-12 object-cover" />
                  </div>
                  <div className={`mt-1 px-1.5 py-0.5 rounded-md text-[0.5625rem] max-w-[4.5rem] truncate text-center shadow-sm ${selectedRestaurant === r.id ? "bg-primary text-primary-foreground" : "bg-card/95 text-foreground border border-border/50"}`} style={{ fontWeight: 600, lineHeight: "1.2" }}>
                    {r.name}
                  </div>
                </div>
              </button>
            </Marker>
          ))}
        </Map>
      </div>

      {/* ── Map Controls ── */}
      {!showActionPanel && (
        <div className="absolute right-3 top-1/2 -translate-y-1/2 z-20 flex flex-col items-center gap-1.5">
          <button onClick={() => mapRef.current?.getMap().zoomIn({ duration: 300 })} className="w-9 h-9 rounded-xl bg-card/90 backdrop-blur-sm border border-border flex items-center justify-center shadow-md hover:bg-secondary transition cursor-pointer"><Plus className="w-4 h-4" /></button>
          <button onClick={() => mapRef.current?.getMap().zoomOut({ duration: 300 })} className="w-9 h-9 rounded-xl bg-card/90 backdrop-blur-sm border border-border flex items-center justify-center shadow-md hover:bg-secondary transition cursor-pointer"><Minus className="w-4 h-4" /></button>
          <div className="w-5 h-px bg-border my-0.5" />
          <button onClick={flyToUser} className="w-11 h-11 rounded-2xl bg-primary text-primary-foreground flex items-center justify-center shadow-lg shadow-primary/30 hover:opacity-90 transition cursor-pointer"><Crosshair className="w-5 h-5" /></button>
        </div>
      )}

      {/* ── Restaurant count badge ── */}
      {!showActionPanel && !listExpanded && (
        <div className="absolute bottom-[calc(6.5rem+env(safe-area-inset-bottom,0px)+52px)] lg:bottom-28 left-3 z-20">
          <div className="flex items-center gap-1.5 bg-card/90 backdrop-blur-sm border border-border rounded-full px-3 py-1.5 shadow-md">
            <div className="w-2 h-2 rounded-full bg-primary" />
            <span className="text-[0.8125rem]" style={{ fontWeight: 500 }}>{filteredRestaurants.length} restaurants</span>
          </div>
        </div>
      )}

      {/* ── Bottom Panel ── */}
      {showActionPanel && selectedR ? (
        <div className="absolute left-0 right-0 bottom-[calc(env(safe-area-inset-bottom,0px)+52px)] lg:bottom-0 z-30 px-3 pb-3">
          <div className="bg-card border border-border rounded-2xl p-3 shadow-xl">
            <div className="flex items-center gap-3 mb-3">
              <button onClick={() => openDetail(selectedR)} className="flex items-center gap-3 flex-1 min-w-0 text-left cursor-pointer hover:opacity-80 transition">
                <ImageWithFallback src={selectedR.image} alt={selectedR.name} className="w-14 h-14 rounded-xl object-cover shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-[0.9375rem] truncate" style={{ fontWeight: 600 }}>{selectedR.name}</p>
                  <div className="flex items-center gap-1.5 text-[0.75rem] text-muted-foreground mt-0.5">
                    <Star className="w-3 h-3 fill-warning text-warning" /> {fmtR(selectedR.rating)} <span>·</span> {selectedR.cuisine} <span>·</span> {selectedR.price}
                    <span className={`ml-1 flex items-center gap-1 ${selectedR.open ? "text-success" : "text-muted-foreground"}`}><span className={`w-1.5 h-1.5 rounded-full ${selectedR.open ? "bg-success" : "bg-muted-foreground"}`} />{selectedR.open ? "Open" : "Closed"}</span>
                  </div>
                </div>
              </button>
              <button onClick={() => setSelectedRestaurant(null)} className="p-1.5 hover:bg-secondary rounded-full cursor-pointer shrink-0"><X className="w-4 h-4" /></button>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <ActionBtn icon={<Navigation className="w-5 h-5" />} label="Directions" onClick={() => openDirections(selectedR)} loading={directionsLoading} />
              <ActionBtn icon={<CalendarDays className="w-5 h-5" />} label="Reserve" onClick={() => openBookTable(selectedR)} />
              <ActionBtn icon={<UtensilsCrossed className="w-5 h-5" />} label="Menu" onClick={() => openDetail(selectedR)} />
            </div>
          </div>
        </div>
      ) : (
        <div ref={panelRef} className="absolute left-0 right-0 z-30 bg-card border-t border-border rounded-t-2xl shadow-2xl overflow-hidden bottom-[calc(env(safe-area-inset-bottom,0px)+52px)] lg:bottom-0" style={{ height: `${computedPanelHeight}px`, transition: dragOffset !== null ? "none" : "height 0.3s cubic-bezier(0.32, 0.72, 0, 1)" }}>
          <div className="touch-none" onTouchStart={handlePanelTouchStart} onTouchMove={handlePanelTouchMove} onTouchEnd={handlePanelTouchEnd} onMouseDown={handlePanelMouseDown}>
            <div className="flex justify-center py-2 cursor-grab active:cursor-grabbing" onClick={() => setListExpanded(!listExpanded)}><div className="w-10 h-1 rounded-full bg-muted-foreground/30" /></div>
            <div ref={filterScrollRef} className="flex items-center gap-2 px-3 pb-2.5 overflow-x-auto scrollbar-hide select-none">
              <button onClick={() => setDrawerMode("all")} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-secondary hover:bg-secondary/80 transition cursor-pointer shrink-0">
                <SlidersHorizontal className="w-4 h-4" />
                {activeFilterCount > 0 && <span className="min-w-[1rem] h-4 rounded-full bg-primary text-primary-foreground text-[0.625rem] flex items-center justify-center px-1">{activeFilterCount}</span>}
              </button>
              <FilterBarChip label="Sort" hasChevron active={sortBy !== "Recommended"} onClick={() => setDrawerMode("sort")} />
              <FilterBarChip label="Open Now" active={openNowOnly} onClick={() => setOpenNowOnly(p => !p)} />
              <FilterBarChip label="Price" hasChevron active={selectedPrices.size > 0} onClick={() => setDrawerMode("price")} />
              <FilterBarChip label="Cuisine" hasChevron active={selectedCuisines.size > 0} onClick={() => setDrawerMode("cuisine")} />
              <FilterBarChip label="Amenities" hasChevron active={selectedAmenities.size > 0} onClick={() => setDrawerMode("amenities")} />
            </div>
          </div>

          {showListContent && (
            <div className="flex-1 overflow-y-auto px-3 pb-4" style={{ maxHeight: "calc(70vh - 5rem)" }}>
              <div className="flex items-center justify-between mb-3">
                <p className="text-[0.8125rem] text-muted-foreground">{filteredRestaurants.length} restaurants found</p>
                <button onClick={() => setListExpanded(false)} className="text-[0.8125rem] text-primary cursor-pointer hover:underline" style={{ fontWeight: 500 }}>Close list</button>
              </div>
              <div className="space-y-2.5">
                {filteredRestaurants.map(r => (
                  <button key={r.id} onClick={() => openDetail(r)} className="w-full flex items-center gap-3 p-3 rounded-2xl border border-border bg-card hover:bg-secondary/50 transition cursor-pointer text-left">
                    <ImageWithFallback src={r.image} alt={r.name} className="w-16 h-16 rounded-xl object-cover shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5"><p className="text-[0.9375rem] truncate" style={{ fontWeight: 600 }}>{r.name}</p><span className={`w-2 h-2 rounded-full shrink-0 ${r.open ? "bg-success" : "bg-muted-foreground"}`} /></div>
                      <p className="text-[0.75rem] text-muted-foreground mt-0.5">{r.cuisine} · {r.price} · {r.distance}</p>
                      <div className="flex items-center gap-1 mt-0.5"><Star className="w-3.5 h-3.5 fill-warning text-warning" /><span className="text-[0.8125rem]" style={{ fontWeight: 600 }}>{fmtR(r.rating)}</span><span className="text-[0.75rem] text-muted-foreground">({r.reviews.toLocaleString()})</span></div>
                    </div>
                    <ChevronDown className="w-4 h-4 text-muted-foreground -rotate-90 shrink-0" />
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ── Filter Drawer ── */}
      <Drawer open={drawerMode !== null} onClose={() => setDrawerMode(null)} side="bottom" size={drawerMode === "all" ? "xl" : "md"} title={drawerTitle} className={drawerMode === "all" ? "!max-h-[85vh]" : drawerMode === "amenities" ? "!h-auto !max-h-[60vh]" : "!h-auto !max-h-[50vh]"} footer={<div className="flex gap-3 w-full">{drawerMode === "all" && <Button variant="outline" onClick={resetFilters} className="flex-1 gap-2"><RotateCcw className="w-4 h-4" /> Reset</Button>}<Button variant="primary" onClick={() => setDrawerMode(null)} className={drawerMode === "all" ? "flex-[2]" : "flex-1"}>Apply</Button></div>}>
        <DrawerBody className="space-y-5 !px-5">
          {(drawerMode === "sort" || drawerMode === "all") && <FilterSection title={drawerMode === "all" ? "Sort By" : undefined}><div className="flex flex-wrap gap-2">{SORT_OPTIONS.map(opt => <FilterChip key={opt} label={opt} selected={sortBy === opt} onClick={() => setSortBy(opt)} />)}</div></FilterSection>}
          {(drawerMode === "price" || drawerMode === "all") && <FilterSection title={drawerMode === "all" ? "Price Range" : undefined}><div className="flex flex-wrap gap-2">{PRICE_OPTIONS.map(opt => <FilterChip key={opt} label={opt} selected={selectedPrices.has(opt)} onClick={() => setSelectedPrices(prev => toggleSet(prev, opt))} />)}</div></FilterSection>}
          {(drawerMode === "amenities" || drawerMode === "all") && <FilterSection title={drawerMode === "all" ? "Amenities" : undefined}><div className="flex flex-wrap gap-2">{AMENITY_OPTIONS.map(opt => <FilterChip key={opt.label} label={opt.label} emoji={opt.emoji} selected={selectedAmenities.has(opt.label)} onClick={() => setSelectedAmenities(prev => toggleSet(prev, opt.label))} />)}</div></FilterSection>}
          {(drawerMode === "cuisine" || drawerMode === "all") && <FilterSection title={drawerMode === "all" ? "Cuisine" : undefined}><div className="flex flex-wrap gap-2">{CUISINE_OPTIONS.map(opt => <FilterChip key={opt.label} label={opt.label} emoji={opt.emoji} selected={selectedCuisines.has(opt.label)} onClick={() => setSelectedCuisines(prev => toggleSet(prev, opt.label))} />)}</div></FilterSection>}
          {drawerMode === "all" && (
            <>
              <FilterSection title="Minimum Rating"><div className="flex flex-wrap gap-2">{RATING_OPTIONS.map(opt => <FilterChip key={opt} label={opt} selected={minRating === opt} onClick={() => setMinRating(opt)} />)}</div></FilterSection>
              <FilterSection title="Distance"><div className="flex flex-wrap gap-2">{DISTANCE_OPTIONS.map(opt => <FilterChip key={opt} label={opt} selected={distance === opt} onClick={() => setDistance(opt)} />)}</div></FilterSection>
              <FilterSection title="Occasion & Vibe"><div className="flex flex-wrap gap-2">{OCCASION_OPTIONS.map(opt => <FilterChip key={opt.label} label={opt.label} emoji={opt.emoji} selected={selectedOccasions.has(opt.label)} onClick={() => setSelectedOccasions(prev => toggleSet(prev, opt.label))} />)}</div></FilterSection>
              <FilterSection title="Seating Preference"><div className="flex flex-wrap gap-2">{SEATING_OPTIONS.map(opt => <FilterChip key={opt.label} label={opt.label} emoji={opt.emoji} selected={selectedSeating.has(opt.label)} onClick={() => setSelectedSeating(prev => toggleSet(prev, opt.label))} />)}</div></FilterSection>
            </>
          )}
        </DrawerBody>
      </Drawer>
    </div>
  );
}
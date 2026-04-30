/* DiscoverPage â€” main orchestrator component */
import { useState, useRef, useCallback, useEffect, useLayoutEffect } from "react";
import { useLocation, useNavigate, useSearchParams, useOutletContext } from "react-router";
import type { AppOutletContext } from "../../AppLayout";
import { Stagger, StaggerItem } from "../../components/ds/Animate";
import { DSBadge } from "../../components/ds/Badge";
import { ImageWithFallback } from "../../components/figma/ImageWithFallback";
import { Ribbon, pickRibbonLabel } from "../../components/ds/Ribbon";
import { Star, ChevronRight, Clock, Map as MapIcon, MapPin, Search } from "lucide-react";
import { DragScrollContainer } from "../shared/DragScrollContainer";
import { RestaurantDetailView } from "../detail/RestaurantDetailView";
import type { RestaurantData } from "../detail/RestaurantDetailView";
import { BookTableFlow } from "../booking/BookTableFlow";
import type { SearchResults, SearchResultLocation, SearchResultFood, SearchResultChef } from "./discoverTypes";
import { fmtR } from "./discoverTypes";
import { _savedRIds, _savedFNames, _notifySaved, incrementSavedSnapshot } from "./savedStore";
import { QUICK_CATEGORIES, CITIES, FOOD_TYPES, MONTHLY_BEST, LOVED_BY_LOCALS, DATE_NIGHT } from "./discoverData";
import { ALL_SEARCH_DATA, searchResultToRestaurantData, filterSearchResults, ALL_SECTION_DATA } from "./discoverSearchData";
import { CardSaveBtn, SectionHeader } from "./SaveButtons";
import { CategoryIcon } from "./CategoryIcon";
import { BannerCarousel } from "./BannerCarousel";
import { BannerGalleryModal } from "./BannerGalleryModal";
import { SearchResultsView } from "./SearchResultsView";
import { LocationResultsView } from "./LocationResultsView";
import { FoodResultsView } from "./FoodResultsView";
import { CategoryResultsView } from "./CategoryResultsView";
import { SectionListView } from "./SectionListView";
import { RestaurantsByPrice } from "./RestaurantsByPrice";
import { NewsSection, NewsListPage, NewsDetailPage, MOCK_NEWS } from "./NewsSection";
import { DiscoverSearchModal, type SearchPlan } from "./DiscoverSearchModal";
import { AirbnbRestaurantCard } from "./AirbnbRestaurantCard";
import { cn } from "../../components/ui/utils";
import { motion, useReducedMotion } from "motion/react";

/** Long ease-out for “gliding” compact bar + hero handoff (no spring overshoot). */
const DISCOVER_GLIDE_EASE = [0.16, 1, 0.32, 1] as const;

function formatReservationTime(value: string) {
  const match = value.match(/^(\d{1,2}):(\d{2})$/);
  if (!match) return value;
  const hour = Number(match[1]);
  const suffix = hour >= 12 ? "PM" : "AM";
  const displayHour = hour % 12 || 12;
  return `${displayHour}:${match[2]} ${suffix}`;
}

function formatSearchPlanSummary(plan: SearchPlan) {
  const people = `${plan.partySize} ${plan.partySize === 1 ? "person" : "people"}`;
  return `${plan.dateLabel}, ${formatReservationTime(plan.timeLabel)}, ${people}`;
}

export function DiscoverPage() {
  const reduceMotion = useReducedMotion();
  const glide = (duration: number, delay = 0) =>
    reduceMotion
      ? { type: "tween" as const, duration: Math.min(0.18, duration), ease: DISCOVER_GLIDE_EASE, delay: 0 }
      : { type: "tween" as const, duration, ease: DISCOVER_GLIDE_EASE, delay };
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const ctx = useOutletContext<AppOutletContext>();
  const { savedRestaurantsRef, savedFoodsRef, toggleSaveRestaurant: toggleSaveRestaurantProp, toggleSaveFood: toggleSaveFoodProp, requireAuth } = ctx;

  // Parse sub-view from URL: /discover/(type)/(id)[/action]
  const subPath = location.pathname.replace(/^\/discover\/?/, "");
  const [subType, subId, subAction] = subPath.split("/");

  const locState = location.state as {
    restaurant?: RestaurantData;
    food?: SearchResultFood;
    locationRef?: SearchResultLocation;
    categoryRef?: { id: string; label: string; icon?: string };
    reservationPlan?: SearchPlan;
  } | null;

  // Derived sub-view state
  const detailRestaurant = subType === "restaurant" && subId ? (locState?.restaurant ?? null) : null;
  const bookingRestaurant = subType === "restaurant" && subId && subAction === "book" ? (locState?.restaurant ?? null) : null;
  const bookingReservationPlan = subType === "restaurant" && subId && subAction === "book" ? (locState?.reservationPlan ?? undefined) : undefined;
  const selectedLocation = subType === "location" && subId ? (locState?.locationRef ?? { id: subId, name: subId.toUpperCase(), count: 50 }) : null;
  const selectedFood = subType === "food" && subId ? (locState?.food ?? { id: subId, name: subId, count: 50, image: "" }) : null;
  const selectedCategory = subType === "category" && subId ? (locState?.categoryRef ?? { id: subId, label: subId, icon: "" }) : null;
  const viewingSection = subType === "section" && subId ? subId : null;
  const showSearchResults = subType === "search";
  const viewingNewsList = subType === "news" && !subId;
  const viewingNewsId = subType === "news" && subId ? subId : null;
  const viewingNewsItem = viewingNewsId ? (MOCK_NEWS.find((n) => n.id === viewingNewsId) ?? null) : null;

  const searchQuery = searchParams.get("q") ?? "";
  const [searchResults, setSearchResults] = useState<SearchResults>({ locations: [], restaurants: [], foods: [], chefs: [] });

  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Rerun search when URL query changes
  useEffect(() => {
    if (showSearchResults && searchQuery.trim()) {
      setSearchResults(filterSearchResults(searchQuery));
    }
  }, [showSearchResults, searchQuery]);

  const setDetailRestaurant = (r: RestaurantData | null) => {
    if (r) navigate(`/discover/restaurant/${r.id}`, { state: { restaurant: r } });
    else navigate("/discover");
  };
  const setBookingRestaurant = (r: RestaurantData | null) => {
    if (r) navigate(`/discover/restaurant/${r.id}/book`, { state: { restaurant: r } });
    else if (detailRestaurant) navigate(`/discover/restaurant/${detailRestaurant.id}`, { state: { restaurant: detailRestaurant } });
    else navigate("/discover");
  };
  const setSelectedLocation = (l: SearchResultLocation | null) => {
    if (l) navigate(`/discover/location/${l.id}`, { state: { locationRef: l } });
    else navigate("/discover");
  };
  const setSelectedFood = (f: SearchResultFood | null) => {
    if (f) navigate(`/discover/food/${f.id}`, { state: { food: f } });
    else navigate("/discover");
  };
  const setSelectedCategory = (c: { id: string; label: string; icon?: string } | null) => {
    if (c) navigate(`/discover/category/${c.id}`, { state: { categoryRef: c } });
    else navigate("/discover");
  };
  const setViewingSection = (s: string | null) => {
    if (s) navigate(`/discover/section/${s}`);
    else navigate("/discover");
  };
  const setShowSearchResults = (show: boolean) => {
    if (show) {
      const q = searchQuery || searchParams.get("q") || "";
      navigate(`/discover/search${q ? `?q=${encodeURIComponent(q)}` : ""}`);
    } else {
      navigate("/discover");
    }
  };
  const setSearchQuery = (q: string) => {
    if (showSearchResults) {
      const next = new URLSearchParams(searchParams);
      if (q) next.set("q", q); else next.delete("q");
      setSearchParams(next, { replace: true });
    }
  };

  const scrollPosRef = useRef(0);
  const savedFoodNamesRef = useRef<string[]>([]);
  const savedFoodNames = savedFoodNamesRef.current;

  // Local input text (only used on main feed search bar)
  const [searchInput, setSearchInput] = useState(searchQuery);
  useEffect(() => { setSearchInput(searchQuery); }, [searchQuery]);
  const [showBannerGallery, setShowBannerGallery] = useState(false);
  const [showSearchModal, setShowSearchModal] = useState(false);
  const [searchPlan, setSearchPlan] = useState<SearchPlan | null>(null);
  const [discoverNavCompact, setDiscoverNavCompact] = useState(false);
  const discoverHeroSentinelRef = useRef<HTMLDivElement>(null);

  const toggleSaveRestaurant = toggleSaveRestaurantProp;
  const toggleSaveFood = toggleSaveFoodProp;

  const isRestaurantSaved = useCallback((id: string) => _savedRIds.has(id), []);

  const toggleSaveFoodName = useCallback((name: string) => {
    if (!requireAuth("/discover", "Sign in to save foods to your Heart list.")) return;
    if (_savedFNames.has(name)) { _savedFNames.delete(name); savedFoodNamesRef.current = savedFoodNamesRef.current.filter((n) => n !== name); }
    else { _savedFNames.add(name); savedFoodNamesRef.current = [...savedFoodNamesRef.current, name]; }
    incrementSavedSnapshot(); _notifySaved();
  }, [requireAuth]);

  const saveScrollPos = useCallback(() => { const main = document.querySelector("main"); if (main) scrollPosRef.current = main.scrollTop; }, []);
  const restoreScrollPos = useCallback(() => {}, []);

  const handleSearchChange = (q: string) => {
    setSearchInput(q);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (!q.trim()) return;
    debounceRef.current = setTimeout(() => {
      setSearchResults(filterSearchResults(q));
      navigate(`/discover/search?q=${encodeURIComponent(q)}`);
    }, 400);
  };
  const handleSearchSubmit = () => {
    const q = searchInput.trim();
    if (q) { setSearchResults(filterSearchResults(q)); navigate(`/discover/search?q=${encodeURIComponent(q)}`); }
  };
  const handleSearchPlanSubmit = (plan: SearchPlan) => {
    const results = filterSearchResults(plan.query);
    setSearchPlan(plan);
    setSearchInput(plan.query);
    setSearchResults(results);
    setShowSearchModal(false);
    navigate(`/discover/search?q=${encodeURIComponent(plan.query)}`);
  };
  const handleOpenMapSearch = () => {
    const q = (searchPlan?.query || searchInput || "Gangnam").trim();
    setSearchInput(q);
    setSearchResults(filterSearchResults(q));
    navigate(`/discover/search?q=${encodeURIComponent(q)}`);
  };
  const handleSearchBack = () => { setSearchInput(""); navigate("/discover"); };

  const handleSelectLocation = (_loc: SearchResultLocation) => { saveScrollPos(); setSelectedLocation(_loc); };
  const handleSelectFood = (f: SearchResultFood) => { saveScrollPos(); setSelectedFood(f); };
  const handleSelectChef = (c: SearchResultChef) => {
    const linked = ALL_SEARCH_DATA.restaurants.find((r) => r.id === c.restaurantId);
    if (linked) setDetailRestaurant(searchResultToRestaurantData(linked));
    else setDetailRestaurant({ id: c.id, name: c.restaurant, cuisine: "Chef's Table", emoji: "", rating: 4.8, reviews: 500, price: "$$$", lng: -122.42, lat: 37.78, open: true, distance: "0.5 mi", image: c.image.replace("w=100&h=100", "w=400&h=300") });
  };

  const hasSubView = !!(detailRestaurant || selectedLocation || selectedFood || selectedCategory || viewingSection || showSearchResults || viewingNewsList || viewingNewsItem);
  const isInlineSubView = !detailRestaurant && !!(selectedLocation || selectedFood || selectedCategory || viewingSection || showSearchResults || viewingNewsList || viewingNewsItem);

  useEffect(() => {
    const main = document.querySelector("main");
    const el = discoverHeroSentinelRef.current;
    if (!main || !el || hasSubView) {
      setDiscoverNavCompact(false);
      return undefined;
    }
    const io = new IntersectionObserver(
      ([entry]) => setDiscoverNavCompact(!entry.isIntersecting),
      { root: main, threshold: 0, rootMargin: "0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [hasSubView]);
  const prevInlineRef = useRef(false);
  useLayoutEffect(() => {
    const main = document.querySelector("main");
    if (!main) return;
    if (isInlineSubView && !prevInlineRef.current) main.scrollTop = 0;
    else if (!isInlineSubView && prevInlineRef.current) main.scrollTop = scrollPosRef.current;
    prevInlineRef.current = isInlineSubView;
  }, [isInlineSubView]);

  const openRestaurant = (r: { id: string; name: string; cuisine: string; rating: number; image: string; price?: string; reviews?: number }) => {
    const main = document.querySelector("main");
    if (main) scrollPosRef.current = main.scrollTop;
    setDetailRestaurant({ id: r.id, name: r.name, cuisine: r.cuisine, emoji: "", rating: r.rating, reviews: r.reviews || 500, price: r.price || "$$$", lng: -122.42, lat: 37.78, open: true, distance: "0.5 mi", image: r.image });
  };
  const openSection = (sectionId: string) => { saveScrollPos(); setViewingSection(sectionId); };
  const openFoodType = (f: typeof FOOD_TYPES[0]) => { saveScrollPos(); setSelectedCategory({ id: f.id, label: f.label }); };
  const openCity = (city: typeof CITIES[0]) => { saveScrollPos(); setSelectedLocation({ id: city.id, name: city.label, count: 100 + Math.floor(Math.random() * 300) }); };
  return (
    <>
    <style>{`.discover-ribbon > div > div { padding: 4px 40px !important; font-size: 0.75rem !important; letter-spacing: 0.04em !important; line-height: 1.3 !important; }`}</style>
    {detailRestaurant && (<>
      <RestaurantDetailView restaurant={detailRestaurant} onBack={() => { setDetailRestaurant(null); restoreScrollPos(); }} onBookTable={(r) => setBookingRestaurant(r)} onDirections={(r) => navigate(`/discover/search?q=${encodeURIComponent(r.name)}`)} onSave={toggleSaveRestaurant} isSaved={isRestaurantSaved(detailRestaurant.id)} onSaveFood={toggleSaveFoodName} savedFoodNames={savedFoodNames} />
      {bookingRestaurant && <BookTableFlow restaurant={bookingRestaurant} initialReservation={bookingReservationPlan} onBack={() => setBookingRestaurant(null)} onComplete={() => { setBookingRestaurant(null); setDetailRestaurant(null); }} />}
    </>)}

    {selectedLocation && !detailRestaurant && <LocationResultsView location={selectedLocation} onBack={() => { setSelectedLocation(null); restoreScrollPos(); }} onSelectRestaurant={(r) => setDetailRestaurant(r)} onSaveRestaurant={toggleSaveRestaurant} isRestaurantSaved={isRestaurantSaved} />}
    {selectedFood && !detailRestaurant && <FoodResultsView food={selectedFood} onBack={() => { setSelectedFood(null); restoreScrollPos(); }} onSaveFood={toggleSaveFood} isFoodSaved={savedFoodsRef.current.some((s) => s.id === selectedFood.id)} onSaveFoodName={toggleSaveFoodName} savedFoodNames={savedFoodNames} />}
    {selectedCategory && !detailRestaurant && (<><CategoryResultsView category={selectedCategory} onBack={() => { setSelectedCategory(null); restoreScrollPos(); }} onSelectRestaurant={(r) => setDetailRestaurant(r)} onBookTable={(r) => setBookingRestaurant(r)} onSaveRestaurant={toggleSaveRestaurant} />{bookingRestaurant && <BookTableFlow restaurant={bookingRestaurant} onBack={() => setBookingRestaurant(null)} onComplete={() => setBookingRestaurant(null)} />}</>)}
    {viewingSection && ALL_SECTION_DATA[viewingSection] && !detailRestaurant && <SectionListView title={ALL_SECTION_DATA[viewingSection].title} items={ALL_SECTION_DATA[viewingSection].items} onBack={() => { setViewingSection(null); restoreScrollPos(); }} onSelectRestaurant={(r) => setDetailRestaurant(r)} onSaveRestaurant={toggleSaveRestaurant} isRestaurantSaved={isRestaurantSaved} />}
    {viewingNewsList && <NewsListPage onBack={() => navigate("/discover")} onSelect={(id) => navigate(`/discover/news/${id}`)} />}
    {viewingNewsItem && <NewsDetailPage item={viewingNewsItem} onBack={() => navigate("/discover/news")} onSelect={(id) => navigate(`/discover/news/${id}`)} />}
    {showSearchResults && !detailRestaurant && !selectedLocation && !selectedFood && (
      <SearchResultsView
        query={searchQuery}
        results={searchResults}
        summary={searchPlan ? formatSearchPlanSummary(searchPlan) : undefined}
        onBack={handleSearchBack}
        onChangeQuery={(q) => {
          setSearchQuery(q);
          if (debounceRef.current) clearTimeout(debounceRef.current);
          debounceRef.current = setTimeout(() => {
            setSearchResults(filterSearchResults(q));
          }, 400);
        }}
        onOpenSearch={() => setShowSearchModal(true)}
        onSelectLocation={handleSelectLocation}
        onSelectRestaurant={(r) => setDetailRestaurant(searchResultToRestaurantData(r))}
        onSelectFood={handleSelectFood}
        onSelectChef={handleSelectChef}
      />
    )}

    <div className="overflow-x-clip" style={{ display: hasSubView ? "none" : undefined }}>
    <div className="relative left-1/2 w-screen max-w-[100vw] -translate-x-1/2 overflow-x-clip -mt-6 sm:-mt-6 lg:-mt-6">
    <section className="relative">
      <BannerCarousel
        onBannerClick={(bannerId) => {
          saveScrollPos();
          const bannerMap: Record<string, () => void> = {
            "1": () => setSelectedCategory({ id: "michelin", label: "Michelin", icon: "" }),
            "2": () => setSelectedCategory({ id: "best-kbbq", label: "Best K-BBQ", icon: "" }),
            "3": () => setViewingSection("date-night"),
            "4": () => setSelectedCategory({ id: "michelin", label: "Chef's Table", icon: "" }),
            "5": () => setSelectedLocation({ id: "ny", name: "NEW YORK", count: 50 }),
            "6": () => setSelectedCategory({ id: "banner-sushi", label: "Sushi Masters", icon: "" }),
          };
          bannerMap[bannerId]?.();
        }}
        onViewAll={() => setShowBannerGallery(true)}
      />
      <motion.div
        className="pointer-events-none absolute inset-x-0 top-0 z-30 px-4 pt-[calc(1.35rem+env(safe-area-inset-top,0px))] sm:px-6 sm:pt-[calc(1.5rem+env(safe-area-inset-top,0px))] lg:px-8"
        initial={false}
        animate={{
          opacity: discoverNavCompact ? 0 : 1,
          y: discoverNavCompact ? (reduceMotion ? 0 : -8) : 0,
        }}
        transition={{
          opacity: glide(discoverNavCompact ? 0.36 : 0.48),
          y: glide(discoverNavCompact ? 0.36 : 0.48),
        }}
      >
        <div className={cn("pointer-events-auto mx-auto flex max-w-3xl items-center gap-2", discoverNavCompact && "pointer-events-none")}>
          <button
            type="button"
            onClick={() => setShowSearchModal(true)}
            className="flex h-14 flex-1 cursor-pointer items-center gap-3 rounded-full border border-white/30 bg-background/92 px-4 text-left shadow-[0_8px_28px_rgba(0,0,0,0.14)] backdrop-blur-md transition hover:bg-background/98"
          >
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-secondary/90">
              <Search className="h-4 w-4 text-foreground" />
            </span>
            <span className="min-w-0">
              <span className="block truncate text-[0.9375rem]" style={{ fontWeight: 700 }}>
                {searchPlan?.query || searchInput || "Find a restaurant"}
              </span>
              <span className="block truncate text-[0.75rem] text-muted-foreground">
                {searchPlan ? formatSearchPlanSummary(searchPlan) : "Tonight, 7:00 PM, 2 people"}
              </span>
            </span>
          </button>
          <button
            type="button"
            onClick={handleOpenMapSearch}
            className="flex h-14 w-14 shrink-0 cursor-pointer items-center justify-center rounded-full border border-white/30 bg-background/92 shadow-[0_8px_28px_rgba(0,0,0,0.14)] backdrop-blur-md transition hover:scale-[1.03] hover:bg-background/98 active:scale-95"
            aria-label="Open map search"
          >
            <MapIcon className="h-5 w-5 text-foreground" />
          </button>
        </div>
      </motion.div>
      <div
        ref={discoverHeroSentinelRef}
        className="pointer-events-none absolute left-0 right-0 top-[min(7.5rem,calc(4.5rem+env(safe-area-inset-top,0px)))] h-px"
        aria-hidden={true}
      />
    </section>
    {!hasSubView && (
      <motion.div
        aria-hidden={!discoverNavCompact}
        className="fixed inset-x-0 top-0 z-50 flex justify-center px-4 pt-[max(0.35rem,env(safe-area-inset-top,0px))] sm:px-6 lg:px-8"
        initial={false}
        animate={{
          opacity: discoverNavCompact ? 1 : 0,
          y: reduceMotion ? 0 : discoverNavCompact ? 0 : -22,
        }}
        transition={{
          opacity: glide(discoverNavCompact ? 0.52 : 0.34, reduceMotion ? 0 : discoverNavCompact ? 0.04 : 0),
          y: glide(discoverNavCompact ? 0.56 : 0.4),
        }}
        style={{ pointerEvents: discoverNavCompact ? "auto" : "none" }}
      >
        <motion.div
          className="mx-auto w-full max-w-3xl overflow-hidden rounded-b-[1.35rem] border border-border/55 bg-background/88 pb-2.5 pt-2 shadow-[0_14px_48px_-12px_rgba(0,0,0,0.22)] backdrop-blur-xl supports-[backdrop-filter]:bg-background/78"
          initial={false}
          animate={{
            scale: discoverNavCompact ? 1 : 0.96,
            opacity: discoverNavCompact ? 1 : 0,
          }}
          transition={{
            scale: glide(discoverNavCompact ? 0.55 : 0.38, reduceMotion ? 0 : discoverNavCompact ? 0.05 : 0),
            opacity: glide(discoverNavCompact ? 0.5 : 0.34, reduceMotion ? 0 : discoverNavCompact ? 0.03 : 0),
          }}
        >
          <div className="flex items-center gap-2 px-1">
            <motion.button
              type="button"
              onClick={() => setShowSearchModal(true)}
              className="flex h-11 min-h-11 flex-1 cursor-pointer items-center gap-2.5 rounded-full border border-border/80 bg-card/95 px-3 text-left shadow-[0_2px_12px_rgba(0,0,0,0.06)]"
              initial={false}
              animate={
                discoverNavCompact
                  ? { opacity: 1, x: 0 }
                  : { opacity: 0, x: reduceMotion ? 0 : -10 }
              }
              transition={{
                opacity: glide(0.46, reduceMotion ? 0 : discoverNavCompact ? 0.06 : 0),
                x: glide(0.52, reduceMotion ? 0 : discoverNavCompact ? 0.06 : 0),
              }}
            >
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-secondary">
                <Search className="h-3.5 w-3.5 text-foreground" />
              </span>
              <span className="min-w-0">
                <span className="block truncate text-[0.8125rem] leading-tight" style={{ fontWeight: 700 }}>
                  {searchPlan?.query || searchInput || "Find a restaurant"}
                </span>
                <span className="block truncate text-[0.625rem] leading-tight text-muted-foreground">
                  {searchPlan ? formatSearchPlanSummary(searchPlan) : "Tonight, 7:00 PM, 2 people"}
                </span>
              </span>
            </motion.button>
            <motion.button
              type="button"
              onClick={handleOpenMapSearch}
              className="flex h-11 w-11 shrink-0 cursor-pointer items-center justify-center rounded-full border border-border/80 bg-card/95 shadow-[0_2px_12px_rgba(0,0,0,0.06)] transition hover:scale-[1.04] active:scale-95"
              aria-label="Open map search"
              initial={false}
              animate={
                discoverNavCompact
                  ? { opacity: 1, x: 0, scale: 1 }
                  : { opacity: 0, x: reduceMotion ? 0 : 10, scale: reduceMotion ? 1 : 0.94 }
              }
              transition={{
                opacity: glide(0.46, reduceMotion ? 0 : discoverNavCompact ? 0.1 : 0),
                x: glide(0.52, reduceMotion ? 0 : discoverNavCompact ? 0.1 : 0),
                scale: glide(0.52, reduceMotion ? 0 : discoverNavCompact ? 0.1 : 0),
              }}
            >
              <MapIcon className="h-4 w-4 text-foreground" />
            </motion.button>
          </div>
        </motion.div>
      </motion.div>
    )}
    <BannerGalleryModal
      open={showBannerGallery}
      onClose={() => setShowBannerGallery(false)}
      onSelect={(bannerId) => {
        setShowBannerGallery(false);
        saveScrollPos();
        const bannerMap: Record<string, () => void> = {
          "1": () => setSelectedCategory({ id: "michelin", label: "Michelin", icon: "" }),
          "2": () => setSelectedCategory({ id: "best-kbbq", label: "Best K-BBQ", icon: "" }),
          "3": () => setViewingSection("date-night"),
          "4": () => setSelectedCategory({ id: "michelin", label: "Chef's Table", icon: "" }),
          "5": () => setSelectedLocation({ id: "ny", name: "NEW YORK", count: 50 }),
          "6": () => setSelectedCategory({ id: "banner-sushi", label: "Sushi Masters", icon: "" }),
        };
        bannerMap[bannerId]?.();
      }}
    />
    <div className="relative z-10 -mt-10 rounded-t-[2rem] bg-background px-4 pb-6 pt-4 shadow-[0_-18px_50px_-24px_rgba(0,0,0,0.18)] sm:px-6 lg:px-8 lg:pb-8">
    <Stagger stagger={0.06} className="pb-0">
      <StaggerItem preset="fadeInUp" className="mt-0"><div className="grid grid-cols-4 gap-y-3 gap-x-1">{QUICK_CATEGORIES.map((cat) => (<button key={cat.id} onClick={() => { if (cat.id === "nearby-me") { if (!requireAuth("/discover/search?q=Gangnam", "Sign in to find restaurants near your current location.")) return; navigate("/discover/search?q=Gangnam"); return; } if (cat.id === "local-fav") { saveScrollPos(); openSection("loved-by-locals"); return; } saveScrollPos(); setSelectedCategory(cat); }} className="flex flex-col items-center gap-1 cursor-pointer group"><div className="group-hover:scale-110 transition-transform"><CategoryIcon id={cat.id} className="w-11 h-11" /></div><span className="text-[0.75rem] text-center whitespace-pre-line leading-tight" style={{ fontWeight: 500 }}>{cat.label}</span></button>))}</div></StaggerItem>
      <StaggerItem preset="fadeInUp" className="mt-8"><SectionHeader title="Where to Eat?" onAction={() => openSection("where-to-eat")} /><DragScrollContainer className="flex gap-3 pb-1">{CITIES.map((city) => (<button key={city.id} onClick={() => openCity(city)} className="relative shrink-0 w-32 h-20 rounded-xl overflow-hidden cursor-pointer group"><ImageWithFallback src={city.image} alt={city.label} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" /><div className="absolute inset-0 bg-black/35 group-hover:bg-black/45 transition-colors" /><span className="absolute inset-0 flex items-center justify-center text-white text-[0.8125rem] tracking-wider" style={{ fontWeight: 700 }}>{city.label}</span></button>))}<button onClick={() => openSection("where-to-eat")} className="shrink-0 w-16 h-20 rounded-xl flex items-center justify-center text-primary cursor-pointer hover:bg-secondary transition"><div className="flex flex-col items-center gap-1"><ChevronRight className="w-6 h-6" /><span className="text-[0.6875rem]" style={{ fontWeight: 500 }}>More</span></div></button></DragScrollContainer></StaggerItem>
      <StaggerItem preset="fadeInUp" className="mt-8"><SectionHeader title="Top Picks by Food Type" action="More" onAction={() => openSection("top-picks-food")} /><DragScrollContainer className="flex gap-3 pb-1">{FOOD_TYPES.map((f) => (<button key={f.id} onClick={() => openFoodType(f)} className="relative shrink-0 w-28 h-20 rounded-xl overflow-hidden cursor-pointer group"><ImageWithFallback src={f.image} alt={f.label} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" /><div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" /><span className="absolute bottom-2 left-2 right-2 text-white text-[0.75rem]" style={{ fontWeight: 600 }}>{f.label}</span></button>))}</DragScrollContainer></StaggerItem>
      <StaggerItem preset="fadeInUp" className="mt-8">
        <SectionHeader title="Monthly Best" action="View All" onAction={() => openSection("monthly-best")} />
        <DragScrollContainer className="flex gap-4 pb-2">
          {MONTHLY_BEST.map((r, idx) => (
            <AirbnbRestaurantCard
              key={r.id}
              item={{
                id: r.id,
                name: r.name,
                cuisine: r.cuisine,
                area: r.area,
                rating: r.rating,
                image: r.image,
                price: idx === 1 ? "$$" : idx === 3 ? "$$$$" : "$$$",
                reviews: 780 + idx * 137,
                distance: `${(0.4 + idx * 0.3).toFixed(1)} mi`,
                badge: pickRibbonLabel(r.id),
                wait: idx === 3 ? "Few seats left" : "Tables tonight",
              }}
              onSelect={(item) => openRestaurant(item)}
              onSave={toggleSaveRestaurant}
              className="shrink-0 w-44 sm:w-48"
            />
          ))}
        </DragScrollContainer>
      </StaggerItem>      <StaggerItem preset="fadeInUp" className="mt-8"><SectionHeader title="Loved by Locals" action="View All" onAction={() => openSection("loved-by-locals")} /><div className="space-y-3">{LOVED_BY_LOCALS.map((r, idx) => (<div key={r.id} onClick={() => openRestaurant({ ...r, cuisine: r.cuisine.split("\u00b7")[0].trim() })} className="flex items-center gap-3 p-3 rounded-2xl border border-border bg-card hover:bg-secondary/30 transition cursor-pointer group"><div className="relative w-20 h-20 rounded-xl overflow-hidden shrink-0"><ImageWithFallback src={r.image} alt={r.name} className="w-full h-full object-cover" /><Ribbon position="top-left" variant="diagonal" size="sm" color={pickRibbonLabel(r.id) === "Sale" ? "destructive" : "primary"}>{pickRibbonLabel(r.id)}</Ribbon></div><div className="flex-1 min-w-0"><div className="flex items-center gap-2"><p className="text-[0.875rem] truncate" style={{ fontWeight: 600 }}>{r.name}</p><DSBadge variant="soft" color="primary" size="sm">{r.tag}</DSBadge></div><p className="text-[0.75rem] text-muted-foreground mt-0.5">{r.cuisine} / {r.price}</p><div className="flex items-center gap-3 mt-1 text-[0.75rem]"><span className="flex items-center gap-1 text-warning"><Star className="w-3 h-3 fill-current" /> {fmtR(r.rating)}</span><span className="text-muted-foreground">({r.reviews.toLocaleString()})</span><span className="text-muted-foreground flex items-center gap-0.5"><MapPin className="w-3 h-3" /> {r.distance}</span></div></div><CardSaveBtn id={r.id} restaurant={{ id: r.id, name: r.name, cuisine: r.cuisine.split("\u00b7")[0].trim(), emoji: "", rating: r.rating, reviews: r.reviews, price: r.price, lng: -122.42, lat: 37.78, open: true, distance: r.distance, image: r.image }} onToggle={toggleSaveRestaurant} variant="inline" /></div>))}</div></StaggerItem>
      {false && <StaggerItem preset="fadeInUp" className="mt-8"><SectionHeader title="Date Night Picks" action="View All" onAction={() => openSection("date-night")} /><DragScrollContainer className="flex gap-3 pb-1">{DATE_NIGHT.map((r) => (<div key={r.id} className="shrink-0 w-52 cursor-pointer group" onClick={() => openRestaurant(r)}><div className="relative h-36 rounded-xl overflow-hidden mb-2"><ImageWithFallback src={r.image} alt={r.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" /><Ribbon position="top-left" variant="diagonal" size="lg" color={pickRibbonLabel(r.id) === "Sale" ? "destructive" : "primary"}>{pickRibbonLabel(r.id)}</Ribbon><div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" /><div className="absolute bottom-2 right-2 bg-black/50 text-white text-[0.6875rem] px-2 py-0.5 rounded-full">{r.price}</div><CardSaveBtn id={r.id} restaurant={{ id: r.id, name: r.name, cuisine: r.cuisine, emoji: "", rating: r.rating, reviews: 500, price: r.price, lng: -122.42, lat: 37.78, open: true, distance: "0.5 mi", image: r.image }} onToggle={toggleSaveRestaurant} /></div><p className="text-[0.8125rem] truncate" style={{ fontWeight: 600 }}>{r.name}</p><p className="text-[0.6875rem] text-muted-foreground">{r.cuisine}</p><div className="flex items-center gap-1 mt-0.5"><Star className="w-3 h-3 fill-warning text-warning" /><span className="text-[0.75rem]" style={{ fontWeight: 600 }}>{fmtR(r.rating)}</span></div></div>))}</DragScrollContainer></StaggerItem>}
      {false && <StaggerItem preset="fadeInUp" className="mt-8"><SectionHeader title="Weekend Brunch Spots" action="View All" onAction={() => openSection("brunch")} /><DragScrollContainer className="flex gap-3 pb-1">{[{ id: "b1", name: "Morning Table", cuisine: "American \u00b7 Brunch", rating: 4.5, price: "$$", image: "https://images.unsplash.com/photo-1687276287139-88f7333c8ca4?w=400&h=300&fit=crop" },{ id: "b2", name: "Flour & Butter", cuisine: "Bakery \u00b7 Caf\u00e9", rating: 4.6, price: "$$", image: "https://images.unsplash.com/photo-1657502996869-6ccd568b9d41?w=400&h=300&fit=crop" },{ id: "b3", name: "Green Bowl Co.", cuisine: "Healthy \u00b7 Bowls", rating: 4.4, price: "$", image: "https://images.unsplash.com/photo-1692780941487-505d5d908aa6?w=400&h=300&fit=crop" }].map((r) => (<div key={r.id} className="shrink-0 w-44 cursor-pointer group" onClick={() => openRestaurant({ ...r, cuisine: r.cuisine.split("\u00b7")[0].trim() })}><div className="relative h-32 rounded-xl overflow-hidden mb-2"><ImageWithFallback src={r.image} alt={r.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" /><Ribbon position="top-left" variant="diagonal" size="md" color={pickRibbonLabel(r.id) === "Sale" ? "destructive" : "primary"}>{pickRibbonLabel(r.id)}</Ribbon><div className="absolute bottom-2 right-2 bg-black/50 text-white text-[0.6875rem] px-2 py-0.5 rounded-full">{r.price}</div><CardSaveBtn id={r.id} restaurant={{ id: r.id, name: r.name, cuisine: r.cuisine.split("\u00b7")[0].trim(), emoji: "", rating: r.rating, reviews: 500, price: r.price, lng: -122.42, lat: 37.78, open: true, distance: "0.5 mi", image: r.image }} onToggle={toggleSaveRestaurant} /></div><p className="text-[0.8125rem] truncate" style={{ fontWeight: 600 }}>{r.name}</p><p className="text-[0.6875rem] text-muted-foreground">{r.cuisine}</p><div className="flex items-center gap-1 mt-0.5"><Star className="w-3 h-3 fill-warning text-warning" /><span className="text-[0.75rem]" style={{ fontWeight: 600 }}>{fmtR(r.rating)}</span></div></div>))}</DragScrollContainer></StaggerItem>}
      <StaggerItem preset="fadeInUp" className="mt-8"><NewsSection onSelect={(id) => navigate(`/discover/news/${id}`)} onViewAll={() => navigate("/discover/news")} /></StaggerItem>
      <StaggerItem preset="fadeInUp" className="mt-8"><SectionHeader title="New This Week" /><div className="space-y-3">{[{ id: "n1", name: "Sakura Bloom", cuisine: "Japanese \u00b7 Tempura", time: "Opens Today", rating: 4.3, image: "https://images.unsplash.com/photo-1681270507609-e2a5f21969b0?w=400&h=300&fit=crop" },{ id: "n2", name: "Saffron Street", cuisine: "Indian \u00b7 Street Food", time: "3 days ago", rating: 4.1, image: "https://images.unsplash.com/photo-1675150303909-1bb94e33132f?w=400&h=300&fit=crop" },{ id: "n3", name: "Verdant Table", cuisine: "Vegan \u00b7 Organic", time: "1 week ago", rating: 4.4, image: "https://images.unsplash.com/photo-1692780941487-505d5d908aa6?w=400&h=300&fit=crop" }].map((r) => (<div key={r.id} onClick={() => openRestaurant({ ...r, cuisine: r.cuisine.split("\u00b7")[0].trim() })} className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-secondary/30 transition cursor-pointer"><div className="w-16 h-16 rounded-xl overflow-hidden shrink-0"><ImageWithFallback src={r.image} alt={r.name} className="w-full h-full object-cover" /></div><div className="flex-1 min-w-0"><p className="text-[0.875rem] truncate" style={{ fontWeight: 600 }}>{r.name}</p><p className="text-[0.6875rem] text-muted-foreground">{r.cuisine}</p><div className="flex items-center gap-2 mt-0.5 text-[0.6875rem]"><span className="flex items-center gap-1 text-warning"><Star className="w-3 h-3 fill-current" /> {fmtR(r.rating)}</span><span className="text-success flex items-center gap-0.5"><Clock className="w-3 h-3" /> {r.time}</span></div></div><div className="flex items-center gap-1 shrink-0"><DSBadge variant="soft" color="success" size="sm">NEW</DSBadge><CardSaveBtn id={r.id} restaurant={{ id: r.id, name: r.name, cuisine: r.cuisine.split("\u00b7")[0].trim(), emoji: "", rating: r.rating, reviews: 500, price: "$$$", lng: -122.42, lat: 37.78, open: true, distance: "0.5 mi", image: r.image }} onToggle={toggleSaveRestaurant} variant="inline" /></div></div>))}</div></StaggerItem>
      <StaggerItem preset="fadeInUp" className="mt-8"><SectionHeader title="Late Night Eats" action="View All" onAction={() => openSection("late-night")} />
      <DragScrollContainer className="flex gap-3 pb-1">{[{ id: "ln1", name: "Midnight Ramen", cuisine: "Japanese \u00b7 Ramen", rating: 4.5, price: "$$", image: "https://images.unsplash.com/photo-1731460202531-bf8389d565f7?w=400&h=300&fit=crop", hours: "Open till 3 AM" },{ id: "ln2", name: "After Hours BBQ", cuisine: "Korean \u00b7 BBQ", rating: 4.6, price: "$$$", image: "https://images.unsplash.com/photo-1590189599125-67138c6509ef?w=400&h=300&fit=crop", hours: "Open till 2 AM" },{ id: "ln3", name: "Night Owl Bar", cuisine: "Cocktails \u00b7 Tapas", rating: 4.3, price: "$$$", image: "https://images.unsplash.com/photo-1598990386084-8af4dd12b3b4?w=400&h=300&fit=crop", hours: "Open till 4 AM" }].map((r) => (<div key={r.id} className="shrink-0 w-44 cursor-pointer group" onClick={() => openRestaurant({ ...r, cuisine: r.cuisine.split("\u00b7")[0].trim() })}><div className="relative h-32 rounded-xl overflow-hidden mb-2"><ImageWithFallback src={r.image} alt={r.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" /><Ribbon position="top-left" variant="diagonal" size="md" color={pickRibbonLabel(r.id) === "Sale" ? "destructive" : "primary"}>{pickRibbonLabel(r.id)}</Ribbon><div className="absolute bottom-2 left-2 bg-black/60 text-white text-[0.6875rem] px-2 py-0.5 rounded-full flex items-center gap-1"><Clock className="w-3 h-3" /> {r.hours}</div><CardSaveBtn id={r.id} restaurant={{ id: r.id, name: r.name, cuisine: r.cuisine.split("\u00b7")[0].trim(), emoji: "", rating: r.rating, reviews: 500, price: r.price, lng: -122.42, lat: 37.78, open: true, distance: "0.5 mi", image: r.image }} onToggle={toggleSaveRestaurant} /></div><p className="text-[0.8125rem] truncate" style={{ fontWeight: 600 }}>{r.name}</p><p className="text-[0.6875rem] text-muted-foreground">{r.cuisine} / {r.price}</p><div className="flex items-center gap-1 mt-0.5"><Star className="w-3 h-3 fill-warning text-warning" /><span className="text-[0.75rem]" style={{ fontWeight: 600 }}>{fmtR(r.rating)}</span></div></div>))}</DragScrollContainer>
      </StaggerItem>
    </Stagger>
    <RestaurantsByPrice onSelectRestaurant={openRestaurant} onSaveRestaurant={toggleSaveRestaurant} isRestaurantSaved={isRestaurantSaved} />
    </div>
    </div>
    </div>
    <DiscoverSearchModal open={showSearchModal} initialQuery={searchInput} onClose={() => setShowSearchModal(false)} onSearch={handleSearchPlanSubmit} />
    </>
  );
}


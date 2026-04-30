/* DiscoverPage — main orchestrator component */
import { useState, useRef, useCallback, useEffect, useLayoutEffect } from "react";
import { useLocation, useNavigate, useSearchParams, useOutletContext } from "react-router";
import type { AppOutletContext } from "../../AppLayout";
import type { RestaurantData } from "../detail/RestaurantDetailView";
import type { SearchResults, SearchResultLocation, SearchResultFood, SearchResultChef } from "./discoverTypes";
import { _savedRIds, _savedFNames, _notifySaved, incrementSavedSnapshot } from "./savedStore";
import { FOOD_TYPES, CITIES } from "./discoverData";
import { ALL_SEARCH_DATA, searchResultToRestaurantData, filterSearchResults } from "./discoverSearchData";
import { DiscoverSearchModal, type SearchPlan } from "./DiscoverSearchModal";
import { MOCK_NEWS } from "./NewsSection";
import { useReducedMotion } from "motion/react";
import { DISCOVER_GLIDE_EASE } from "./discover-page/discoverFormatters";
import { DiscoverSubViews } from "./discover-page/DiscoverSubViews";
import { DiscoverHomeShell } from "./discover-page/DiscoverHomeShell";
import { useDiscoverNavCompact } from "./discover-page/useDiscoverNavCompact";
import { createDiscoverBannerNavigator } from "./discover-page/discoverBannerActions";

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
  const { savedFoodsRef, toggleSaveRestaurant: toggleSaveRestaurantProp, toggleSaveFood: toggleSaveFoodProp, requireAuth } = ctx;

  const subPath = location.pathname.replace(/^\/discover\/?/, "");
  const [subType, subId, subAction] = subPath.split("/");

  const locState = location.state as {
    restaurant?: RestaurantData;
    food?: SearchResultFood;
    locationRef?: SearchResultLocation;
    categoryRef?: { id: string; label: string; icon?: string };
    reservationPlan?: SearchPlan;
  } | null;

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
  const setSearchQuery = (q: string) => {
    if (showSearchResults) {
      const next = new URLSearchParams(searchParams);
      if (q) next.set("q", q);
      else next.delete("q");
      setSearchParams(next, { replace: true });
    }
  };

  const scrollPosRef = useRef(0);
  const savedFoodNamesRef = useRef<string[]>([]);
  const savedFoodNames = savedFoodNamesRef.current;

  const [searchInput, setSearchInput] = useState(searchQuery);
  useEffect(() => {
    setSearchInput(searchQuery);
  }, [searchQuery]);
  const [showBannerGallery, setShowBannerGallery] = useState(false);
  const [showSearchModal, setShowSearchModal] = useState(false);
  const [searchPlan, setSearchPlan] = useState<SearchPlan | null>(null);
  const [discoverNavCompact, setDiscoverNavCompact] = useState(false);
  const discoverHeroSectionRef = useRef<HTMLElement>(null);

  const toggleSaveRestaurant = toggleSaveRestaurantProp;
  const toggleSaveFood = toggleSaveFoodProp;

  const isRestaurantSaved = useCallback((id: string) => _savedRIds.has(id), []);

  const toggleSaveFoodName = useCallback(
    (name: string) => {
      if (!requireAuth("/discover", "Sign in to save foods to your Heart list.")) return;
      if (_savedFNames.has(name)) {
        _savedFNames.delete(name);
        savedFoodNamesRef.current = savedFoodNamesRef.current.filter((n) => n !== name);
      } else {
        _savedFNames.add(name);
        savedFoodNamesRef.current = [...savedFoodNamesRef.current, name];
      }
      incrementSavedSnapshot();
      _notifySaved();
    },
    [requireAuth],
  );

  const saveScrollPos = useCallback(() => {
    const main = document.querySelector("main");
    if (main) scrollPosRef.current = main.scrollTop;
  }, []);
  const restoreScrollPos = useCallback(() => {}, []);

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
  const handleSearchBack = () => {
    setSearchInput("");
    navigate("/discover");
  };

  const handleSelectLocation = (_loc: SearchResultLocation) => {
    saveScrollPos();
    setSelectedLocation(_loc);
  };
  const handleSelectFood = (f: SearchResultFood) => {
    saveScrollPos();
    setSelectedFood(f);
  };
  const handleSelectChef = (c: SearchResultChef) => {
    const linked = ALL_SEARCH_DATA.restaurants.find((r) => r.id === c.restaurantId);
    if (linked) setDetailRestaurant(searchResultToRestaurantData(linked));
    else
      setDetailRestaurant({
        id: c.id,
        name: c.restaurant,
        cuisine: "Chef's Table",
        emoji: "",
        rating: 4.8,
        reviews: 500,
        price: "$$$",
        lng: -122.42,
        lat: 37.78,
        open: true,
        distance: "0.5 mi",
        image: c.image.replace("w=100&h=100", "w=400&h=300"),
      });
  };

  const hasSubView = !!(
    detailRestaurant ||
    selectedLocation ||
    selectedFood ||
    selectedCategory ||
    viewingSection ||
    showSearchResults ||
    viewingNewsList ||
    viewingNewsItem
  );
  const isInlineSubView = !detailRestaurant && !!(selectedLocation || selectedFood || selectedCategory || viewingSection || showSearchResults || viewingNewsList || viewingNewsItem);

  useDiscoverNavCompact(hasSubView, discoverHeroSectionRef, setDiscoverNavCompact);

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
    setDetailRestaurant({
      id: r.id,
      name: r.name,
      cuisine: r.cuisine,
      emoji: "",
      rating: r.rating,
      reviews: r.reviews || 500,
      price: r.price || "$$$",
      lng: -122.42,
      lat: 37.78,
      open: true,
      distance: "0.5 mi",
      image: r.image,
    });
  };
  const openSection = (sectionId: string) => {
    saveScrollPos();
    setViewingSection(sectionId);
  };
  const openFoodType = (f: (typeof FOOD_TYPES)[0]) => {
    saveScrollPos();
    setSelectedCategory({ id: f.id, label: f.label });
  };
  const openCity = (city: (typeof CITIES)[0]) => {
    saveScrollPos();
    setSelectedLocation({ id: city.id, name: city.label, count: 100 + Math.floor(Math.random() * 300) });
  };

  const runBannerNavigation = createDiscoverBannerNavigator(saveScrollPos, setSelectedCategory, (s) => setViewingSection(s), (l) =>
    setSelectedLocation(l),
  );
  const onGalleryBannerSelect = (bannerId: string) => {
    setShowBannerGallery(false);
    runBannerNavigation(bannerId);
  };

  return (
    <>
      <style>{`.discover-ribbon > div > div { padding: 4px 40px !important; font-size: 0.75rem !important; letter-spacing: 0.04em !important; line-height: 1.3 !important; }`}</style>
      <DiscoverSubViews
        detailRestaurant={detailRestaurant}
        bookingRestaurant={bookingRestaurant}
        bookingReservationPlan={bookingReservationPlan}
        selectedLocation={selectedLocation}
        selectedFood={selectedFood}
        selectedCategory={selectedCategory}
        viewingSection={viewingSection}
        showSearchResults={showSearchResults}
        viewingNewsList={viewingNewsList}
        viewingNewsItem={viewingNewsItem}
        searchQuery={searchQuery}
        searchResults={searchResults}
        searchPlan={searchPlan}
        debounceRef={debounceRef}
        setDetailRestaurant={setDetailRestaurant}
        setBookingRestaurant={setBookingRestaurant}
        setSelectedLocation={setSelectedLocation}
        setSelectedFood={setSelectedFood}
        setSelectedCategory={setSelectedCategory}
        setViewingSection={setViewingSection}
        setSearchQuery={setSearchQuery}
        setSearchResults={setSearchResults}
        setShowSearchModal={setShowSearchModal}
        toggleSaveRestaurant={toggleSaveRestaurant}
        toggleSaveFood={toggleSaveFood}
        toggleSaveFoodName={toggleSaveFoodName}
        isRestaurantSaved={isRestaurantSaved}
        savedFoodsRef={savedFoodsRef}
        savedFoodNames={savedFoodNames}
        restoreScrollPos={restoreScrollPos}
        handleSearchBack={handleSearchBack}
        handleSelectLocation={handleSelectLocation}
        handleSelectFood={handleSelectFood}
        handleSelectChef={handleSelectChef}
      />
      <DiscoverHomeShell
        hasSubView={hasSubView}
        discoverHeroSectionRef={discoverHeroSectionRef}
        discoverNavCompact={discoverNavCompact}
        reduceMotion={reduceMotion}
        glide={glide}
        showBannerGallery={showBannerGallery}
        setShowBannerGallery={setShowBannerGallery}
        searchPlan={searchPlan}
        searchInput={searchInput}
        setShowSearchModal={setShowSearchModal}
        handleOpenMapSearch={handleOpenMapSearch}
        onBannerClick={runBannerNavigation}
        onGalleryBannerSelect={onGalleryBannerSelect}
        requireAuth={requireAuth}
        saveScrollPos={saveScrollPos}
        setSelectedCategory={setSelectedCategory}
        openSection={openSection}
        openCity={openCity}
        openFoodType={openFoodType}
        openRestaurant={openRestaurant}
        toggleSaveRestaurant={toggleSaveRestaurant}
        isRestaurantSaved={isRestaurantSaved}
      />
      <DiscoverSearchModal open={showSearchModal} initialQuery={searchInput} onClose={() => setShowSearchModal(false)} onSearch={handleSearchPlanSubmit} />
    </>
  );
}

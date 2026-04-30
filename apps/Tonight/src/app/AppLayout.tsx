import { useState, useRef, useCallback, useEffect, useSyncExternalStore } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Outlet, useLocation, useNavigate } from "react-router";
import {
  subscribeNotifications, getNotificationSnapshot, getUnreadCount,
} from "./stores/notificationStore";
import type { RestaurantData } from "./pages/detail/RestaurantDetailView";
import type { SearchResultFood } from "./pages/discover/discoverTypes";
import {
  _savedRIds, _notifySaved, incrementSavedSnapshot,
} from "./pages/discover/savedStore";
import { authStore } from "./stores/authStore";
import { LoginPromptModal } from "./components/LoginPromptModal";
import { FirstLoginDbModal } from "./components/FirstLoginDbModal";
import { dailyBonusStore } from "./pages/profile/dailyreward/DailyBonusModal";
import { WishlistSelectionSheet, type WishlistSheetCollection } from "./pages/discover/WishlistSelectionSheet";
import { WishlistSavedToast, type WishlistSavedToastState } from "./pages/discover/WishlistSavedToast";
import { SidebarNav, pageVariants, type TabId } from "./app-layout/navigation";
import { QUICK_SAVE_WINDOW_MS, type AppOutletContext, type AppWishlistCollection } from "./app-layout/types";
import { BottomNav } from "./app-layout/BottomNav";

export type { AppOutletContext } from "./app-layout/types";

export function AppLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const shellRef = useRef<HTMLDivElement>(null);
  const bottomNavRef = useRef<HTMLElement>(null!);
  const qrActionRef = useRef<HTMLButtonElement>(null!);

  const activeTab: TabId = (location.pathname.startsWith("/wishlist") || location.pathname.startsWith("/saved")) ? "wishlist"
    : location.pathname.startsWith("/dining") ? "dining"
    : location.pathname.startsWith("/profile") ? "profile"
    : "discover";

  const isDiscoverSearchRoute = location.pathname.startsWith("/discover/search");
  const shouldLockMainScroll = isDiscoverSearchRoute;

  useEffect(() => {
    const shell = shellRef.current;
    if (!shell) return;

    const updateBottomNavHeight = () => {
      const nav = bottomNavRef.current;
      const isHidden = !nav || window.getComputedStyle(nav).display === "none";
      const navRect = nav?.getBoundingClientRect();
      const actionRect = qrActionRef.current?.getBoundingClientRect();
      const height = isHidden || !navRect ? 0 : navRect.height;
      const overhang = !isHidden && navRect && actionRect ? Math.max(0, navRect.top - actionRect.top) : 0;
      const chromeHeight = height + overhang;

      shell.style.setProperty("--app-bottom-nav-height", `${Math.round(height)}px`);
      shell.style.setProperty("--app-bottom-nav-overhang", `${Math.round(overhang)}px`);
      shell.style.setProperty("--app-bottom-chrome-height", `${Math.round(chromeHeight)}px`);
      document.documentElement.style.setProperty("--app-bottom-nav-height", `${Math.round(height)}px`);
      document.documentElement.style.setProperty("--app-bottom-nav-overhang", `${Math.round(overhang)}px`);
      document.documentElement.style.setProperty("--app-bottom-chrome-height", `${Math.round(chromeHeight)}px`);
    };

    updateBottomNavHeight();
    const observer = new ResizeObserver(updateBottomNavHeight);
    if (bottomNavRef.current) observer.observe(bottomNavRef.current);
    window.addEventListener("resize", updateBottomNavHeight);

    return () => {
      observer.disconnect();
      window.removeEventListener("resize", updateBottomNavHeight);
      document.documentElement.style.removeProperty("--app-bottom-nav-height");
      document.documentElement.style.removeProperty("--app-bottom-nav-overhang");
      document.documentElement.style.removeProperty("--app-bottom-chrome-height");
    };
  }, []);

  const [userLocation, setUserLocation] = useState({ name: "Gangnam Station", address: "Gangnam-gu, Seoul", lat: 37.498, lng: 127.0276 });
  const savedRestaurantsRef = useRef<RestaurantData[]>([]);
  const savedFoodsRef = useRef<SearchResultFood[]>([]);
  const [wishlistRestaurant, setWishlistRestaurant] = useState<RestaurantData | null>(null);
  const [wishlistCollections, setWishlistCollections] = useState<AppWishlistCollection[]>([]);
  const [quickSaveTarget, setQuickSaveTarget] = useState<null | { collectionId: string; title: string; savedAt: number }>(null);
  const [savedToast, setSavedToast] = useState<WishlistSavedToastState | null>(null);
  const savedToastTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Subscribe for auth changes so the layout updates (we don't need the value here).
  useSyncExternalStore(authStore.subscribe, authStore.getSnapshot);
  const [loginPrompt, setLoginPrompt] = useState<null | { title?: string; message?: string; redirect: string }>(null);

  const requireAuth = useCallback((redirect: string, message?: string): boolean => {
    if (authStore.getSnapshot()) return true;
    setLoginPrompt({ redirect, message });
    return false;
  }, []);

  useEffect(() => () => {
    if (savedToastTimerRef.current) clearTimeout(savedToastTimerRef.current);
  }, []);

  const saveRestaurantToRecent = useCallback((r: RestaurantData) => {
    if (_savedRIds.has(r.id)) {
      if (!savedRestaurantsRef.current.some((saved) => saved.id === r.id)) {
        savedRestaurantsRef.current = [...savedRestaurantsRef.current, r];
      }
      return false;
    }
    _savedRIds.add(r.id);
    savedRestaurantsRef.current = [...savedRestaurantsRef.current, r];
    return true;
  }, []);

  const showSavedToast = useCallback((restaurant: RestaurantData, collectionTitle: string) => {
    if (savedToastTimerRef.current) clearTimeout(savedToastTimerRef.current);
    setSavedToast({
      id: Date.now(),
      restaurant,
      collectionTitle,
    });
    savedToastTimerRef.current = setTimeout(() => {
      setSavedToast(null);
      savedToastTimerRef.current = null;
    }, 4200);
  }, []);

  const hideSavedToast = useCallback(() => {
    if (savedToastTimerRef.current) {
      clearTimeout(savedToastTimerRef.current);
      savedToastTimerRef.current = null;
    }
    setSavedToast(null);
  }, []);

  const getWishlistCollectionTitle = useCallback((collectionId: string) => {
    if (collectionId === "recent") return "Recently searched restaurants";
    return wishlistCollections.find((collection) => collection.id === collectionId)?.title ?? "Wishlist";
  }, [wishlistCollections]);

  const saveRestaurantToCollection = useCallback((restaurant: RestaurantData, collectionId: string) => {
    saveRestaurantToRecent(restaurant);
    if (collectionId !== "recent") {
      setWishlistCollections((current) => current.map((collection) => {
        if (collection.id !== collectionId || collection.restaurants.some((saved) => saved.id === restaurant.id)) {
          return collection;
        }
        return { ...collection, restaurants: [...collection.restaurants, restaurant] };
      }));
    }
    incrementSavedSnapshot();
    _notifySaved();
  }, [saveRestaurantToRecent]);

  const removeSavedRestaurant = useCallback((r: RestaurantData) => {
    const existed = _savedRIds.delete(r.id);
    savedRestaurantsRef.current = savedRestaurantsRef.current.filter((saved) => saved.id !== r.id);
    setWishlistCollections((current) => current.map((collection) => ({
      ...collection,
      restaurants: collection.restaurants.filter((saved) => saved.id !== r.id),
    })));
    if (existed) {
      incrementSavedSnapshot();
      _notifySaved();
    }
    setWishlistRestaurant((current) => (current?.id === r.id ? null : current));
    hideSavedToast();
  }, [hideSavedToast]);

  const toggleSaveRestaurant = useCallback((r: RestaurantData) => {
    if (_savedRIds.has(r.id)) {
      removeSavedRestaurant(r);
      return;
    }

    const canQuickSave = authStore.getSnapshot()
      && quickSaveTarget
      && Date.now() - quickSaveTarget.savedAt <= QUICK_SAVE_WINDOW_MS;

    if (canQuickSave) {
      const savedAt = Date.now();
      saveRestaurantToCollection(r, quickSaveTarget.collectionId);
      setQuickSaveTarget({ ...quickSaveTarget, savedAt });
      showSavedToast(r, quickSaveTarget.title);
      return;
    }

    setWishlistRestaurant(r);
  }, [quickSaveTarget, removeSavedRestaurant, saveRestaurantToCollection, showSavedToast]);

  const handleSelectWishlistCollection = useCallback((collectionId: string) => {
    if (!wishlistRestaurant) return;
    if (!authStore.getSnapshot()) {
      setWishlistRestaurant(null);
      requireAuth("/discover", "Sign in to save restaurants to your wishlist.");
      return;
    }
    const title = getWishlistCollectionTitle(collectionId);
    const savedAt = Date.now();
    saveRestaurantToCollection(wishlistRestaurant, collectionId);
    setQuickSaveTarget({ collectionId, title, savedAt });
    showSavedToast(wishlistRestaurant, title);
    setWishlistRestaurant(null);
  }, [getWishlistCollectionTitle, requireAuth, saveRestaurantToCollection, showSavedToast, wishlistRestaurant]);

  const handleCreateWishlist = useCallback((name: string) => {
    if (!wishlistRestaurant) return;
    if (!authStore.getSnapshot()) {
      setWishlistRestaurant(null);
      requireAuth("/discover", "Sign in to create a wishlist.");
      return;
    }
    const collectionId = `wishlist-${Date.now().toString(36)}`;
    const nextCollection: AppWishlistCollection = {
      id: collectionId,
      title: name,
      restaurants: [wishlistRestaurant],
    };
    const savedAt = Date.now();
    saveRestaurantToRecent(wishlistRestaurant);
    setWishlistCollections((current) => [nextCollection, ...current]);
    setQuickSaveTarget({ collectionId, title: name, savedAt });
    showSavedToast(wishlistRestaurant, name);
    incrementSavedSnapshot();
    _notifySaved();
    setWishlistRestaurant(null);
  }, [requireAuth, saveRestaurantToRecent, showSavedToast, wishlistRestaurant]);

  const wishlistSheetCollections: WishlistSheetCollection[] = [
    {
      id: "recent",
      title: "Recently searched restaurants",
      restaurants: savedRestaurantsRef.current,
      isDefault: true,
    },
    ...wishlistCollections,
  ];

  const closeWishlistSheet = useCallback(() => {
    setWishlistRestaurant(null);
  }, []);

  const handleChangeSavedToast = useCallback((restaurant: RestaurantData) => {
    hideSavedToast();
    setWishlistRestaurant(restaurant);
  }, [hideSavedToast]);

  const toggleSaveFood = useCallback((f: SearchResultFood) => {
    if (!requireAuth("/discover", "Sign in to save foods to your Heart list.")) return;
    const exists = savedFoodsRef.current.some((s) => s.id === f.id);
    savedFoodsRef.current = exists ? savedFoodsRef.current.filter((s) => s.id !== f.id) : [...savedFoodsRef.current, f];
    incrementSavedSnapshot(); _notifySaved();
  }, [requireAuth]);

  useSyncExternalStore(subscribeNotifications, getNotificationSnapshot);
  const unreadCount = getUnreadCount();
  const dailyClaimed = useSyncExternalStore(dailyBonusStore.subscribe, dailyBonusStore.getSnapshot);

  const handleTabSelect = useCallback((id: TabId) => {
    if ((id === "wishlist" || id === "dining" || id === "profile") && !authStore.getSnapshot()) {
      setLoginPrompt({ redirect: `/${id}`, message: id === "dining"
        ? "Sign in to view and manage your reservations."
        : id === "wishlist"
          ? "Sign in to view your wishlist."
        : "Sign in to access your profile." });
      return;
    }
    navigate(`/${id}`);
  }, [navigate]);

  const handleQRPay = useCallback(() => {
    if (!authStore.getSnapshot()) {
      setLoginPrompt({ redirect: "/qrpay", message: "Sign in to use QR Pay." });
      return;
    }
    navigate("/qrpay");
  }, [navigate]);

  const ctx: AppOutletContext = { userLocation, setUserLocation, savedRestaurantsRef, savedFoodsRef, wishlistCollections, toggleSaveRestaurant, removeSavedRestaurant, toggleSaveFood, requireAuth };

  return (
    <div ref={shellRef} className="flex overflow-hidden bg-background" style={{ height: "100dvh" }}>
      <SidebarNav activeTab={activeTab} onSelect={handleTabSelect} />

      <div className="relative flex h-full min-w-0 flex-1 flex-col overflow-hidden">
        <main className={`flex-1 min-w-0 min-h-0 ${shouldLockMainScroll ? "overflow-hidden" : "overflow-y-auto"}`}
          style={shouldLockMainScroll ? undefined : { overflowX: "clip" }}>
            <div
              className={
                shouldLockMainScroll
                  ? "mx-auto h-full w-full max-w-3xl"
                  : "relative mx-auto min-h-full w-full max-w-3xl px-4 pb-6 pt-6 sm:px-6 lg:px-8 lg:pb-8"
              }
            >
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                className={shouldLockMainScroll ? "h-full" : undefined}
                variants={pageVariants}
                initial="initial" animate="animate" exit="exit"
                transition={{ duration: 0.25, ease: [0.25, 0.1, 0.25, 1] }}
              >
                <Outlet context={ctx} />
              </motion.div>
            </AnimatePresence>
          </div>
        </main>

        <BottomNav
          bottomNavRef={bottomNavRef}
          qrActionRef={qrActionRef}
          activeTab={activeTab}
          unreadCount={unreadCount}
          dailyClaimed={dailyClaimed}
          onTabSelect={handleTabSelect}
          onQrPay={handleQRPay}
        />
      </div>
      <LoginPromptModal
        open={!!loginPrompt}
        onClose={() => setLoginPrompt(null)}
        onConfirm={() => {
          const redirect = loginPrompt?.redirect ?? location.pathname;
          setLoginPrompt(null);
          navigate("/auth/login", { state: { from: redirect } });
        }}
        message={loginPrompt?.message}
      />
      <WishlistSelectionSheet
        open={!!wishlistRestaurant}
        restaurant={wishlistRestaurant}
        collections={wishlistSheetCollections}
        onClose={closeWishlistSheet}
        onSelectCollection={handleSelectWishlistCollection}
        onCreateWishlist={handleCreateWishlist}
      />
      <WishlistSavedToast toast={savedToast} onChange={handleChangeSavedToast} />
      <FirstLoginDbModal />
    </div>
  );
}

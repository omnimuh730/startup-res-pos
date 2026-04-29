/* AppLayout — tab shell with sidebar, topbar, bottom nav. Renders nested routes via Outlet. */
import React, { useState, useRef, useCallback, useEffect, useSyncExternalStore } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Outlet, useLocation, useNavigate } from "react-router";
import { Home, Compass, UtensilsCrossed, User } from "lucide-react";
import { GlobalTopBar } from "./components/GlobalTopBar";
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
import { dailyBonusStore } from "./pages/discover/DailyBonusModal";

export type AppOutletContext = {
  userLocation: { name: string; address: string; lat: number; lng: number };
  setUserLocation: (l: AppOutletContext["userLocation"]) => void;
  savedRestaurantsRef: React.RefObject<RestaurantData[]>;
  savedFoodsRef: React.RefObject<SearchResultFood[]>;
  toggleSaveRestaurant: (r: RestaurantData) => void;
  toggleSaveFood: (f: SearchResultFood) => void;
  requireAuth: (redirect: string, message?: string) => boolean;
};

const TABS = [
  { id: "discover", label: "Discover", icon: Home, isLogo: true, path: "/discover" },
  { id: "explorer", label: "Explorer", icon: Compass, path: "/explorer" },
  { id: "dining", label: "Dining", icon: UtensilsCrossed, path: "/dining" },
  { id: "profile", label: "Profile", icon: User, path: "/profile" },
] as const;

type TabId = (typeof TABS)[number]["id"];

interface Particle { id: number; x: number; y: number; size: number; angle: number; distance: number; }

function SparkleEffect({ active }: { active: boolean }) {
  const [particles, setParticles] = useState<Particle[]>([]);
  useEffect(() => {
    if (!active) return;
    const newParticles: Particle[] = Array.from({ length: 8 }, (_, i) => ({
      id: Date.now() + i, x: 0, y: 0, size: Math.random() * 4 + 2,
      angle: (i / 8) * 360 + Math.random() * 20 - 10,
      distance: Math.random() * 16 + 12,
    }));
    setParticles(newParticles);
    const timer = setTimeout(() => setParticles([]), 600);
    return () => clearTimeout(timer);
  }, [active]);
  if (particles.length === 0) return null;
  return (
    <div className="absolute inset-0 pointer-events-none overflow-visible">
      {particles.map((p) => {
        const rad = (p.angle * Math.PI) / 180;
        const tx = Math.cos(rad) * p.distance;
        const ty = Math.sin(rad) * p.distance;
        return (
          <motion.div key={p.id} className="absolute rounded-full"
            style={{ width: p.size, height: p.size, left: "50%", top: "50%", marginLeft: -p.size / 2, marginTop: -p.size / 2, background: "var(--primary)" }}
            initial={{ opacity: 1, x: 0, y: 0, scale: 1 }}
            animate={{ opacity: 0, x: tx, y: ty, scale: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          />
        );
      })}
    </div>
  );
}

function CatchTableIcon({ className, isActive }: { className?: string; isActive?: boolean }) {
  const color = isActive ? "var(--primary)" : "var(--muted-foreground)";
  return (
    <svg viewBox="0 0 28 28" fill="none" className={className}>
      <path d="M14 4.5a9.5 9.5 0 1 0 0 19 9.5 9.5 0 0 0 0-19zm0 6.7a2.8 2.8 0 1 1 0 5.6 2.8 2.8 0 0 1 0-5.6z" fill={color} fillRule="evenodd" />
      <circle cx="1.8" cy="14" r="1.8" fill={color} />
    </svg>
  );
}

function TabButton({ tab, isActive, onSelect, badgeCount, showDot }: {
  tab: (typeof TABS)[number]; isActive: boolean; onSelect: () => void; badgeCount?: number; showDot?: boolean;
}) {
  const [sparkle, setSparkle] = useState(false);
  const prevActive = useRef(isActive);
  useEffect(() => {
    if (isActive && !prevActive.current) {
      setSparkle(true);
      const t = setTimeout(() => setSparkle(false), 600);
      prevActive.current = isActive;
      return () => clearTimeout(t);
    }
    prevActive.current = isActive;
  }, [isActive]);
  return (
    <button onClick={onSelect} className="flex-1 flex flex-col items-center justify-center gap-0.5 py-2.5 relative transition-colors cursor-pointer select-none">
      <AnimatePresence>
        {isActive && (
          <motion.div className="absolute inset-0" style={{ background: "var(--primary)", opacity: 0.08 }}
            initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 0.08 }} exit={{ scale: 1, opacity: 0 }}
            transition={{ duration: 0.35, ease: "easeOut" }} />
        )}
      </AnimatePresence>
      <div className="relative">
        <SparkleEffect active={sparkle} />
        {badgeCount != null && badgeCount > 0 && (
          <span className="absolute -top-1.5 -right-2 min-w-[1rem] h-4 px-1 rounded-full bg-primary text-primary-foreground text-[0.5625rem] flex items-center justify-center z-20" style={{ fontWeight: 700 }}>
            {badgeCount > 99 ? "99+" : badgeCount}
          </span>
        )}
        {showDot && !(badgeCount != null && badgeCount > 0) && (
          <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-destructive border-2 border-card z-20" />
        )}
        <motion.div
          animate={isActive ? { scale: [1, 0.8, 1.15, 1], y: [0, 2, -2, 0] } : { scale: 1, y: 0 }}
          transition={{ duration: 0.35, ease: "easeOut" }} className="relative z-10">
          {"isLogo" in tab && tab.isLogo ? (
            <CatchTableIcon className="w-[26px] h-[26px] transition-colors duration-200" isActive={isActive} />
          ) : (
            <tab.icon className={`w-[22px] h-[22px] transition-colors duration-200 ${isActive ? "text-primary fill-primary stroke-primary" : "text-muted-foreground"}`}
              strokeWidth={isActive ? 2.5 : 1.8}
              style={isActive ? { fill: "var(--primary)", fillOpacity: 0.15 } : undefined} />
          )}
        </motion.div>
      </div>
      <span className={`text-[0.75rem] md:text-[0.8125rem] transition-colors duration-200 relative z-10 ${isActive ? "text-primary" : "text-muted-foreground"}`}
        style={{ fontWeight: isActive ? 700 : 400 }}>{tab.label}</span>
    </button>
  );
}

function SidebarNav({ activeTab, onSelect }: { activeTab: TabId; onSelect: (id: TabId) => void }) {
  return (
    <aside className="hidden lg:flex flex-col w-60 xl:w-64 border-r border-border bg-card shrink-0 sticky top-0 h-screen">
      <div className="p-6 pb-4">
        <h1 className="text-[1.25rem] text-primary" style={{ fontWeight: 700 }}>CatchTable</h1>
        <p className="text-muted-foreground text-[0.75rem] mt-0.5">Restaurant Reservations</p>
      </div>
      <nav className="flex-1 px-3 space-y-1">
        {TABS.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button key={tab.id} onClick={() => onSelect(tab.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all ${isActive ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-secondary hover:text-foreground"}`}>
              {"isLogo" in tab && tab.isLogo ? (
                <CatchTableIcon className="w-5 h-5" isActive={isActive} />
              ) : (
                <tab.icon className="w-5 h-5" strokeWidth={isActive ? 2.5 : 1.8} />
              )}
              <span className="text-[0.9375rem]" style={{ fontWeight: isActive ? 600 : 400 }}>{tab.label}</span>
            </button>
          );
        })}
      </nav>
      <div className="p-4 border-t border-border">
        <p className="text-muted-foreground text-[0.6875rem]">v2.4.1 · Powered by DS</p>
      </div>
    </aside>
  );
}

const pageVariants = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
};

export function AppLayout() {
  const location = useLocation();
  const navigate = useNavigate();

  const activeTab: TabId = location.pathname.startsWith("/explorer") ? "explorer"
    : location.pathname.startsWith("/dining") ? "dining"
    : location.pathname.startsWith("/profile") ? "profile"
    : "discover";

  const isExplorerRoute = location.pathname.startsWith("/explorer");

  const [userLocation, setUserLocation] = useState({ name: "Gangnam Station", address: "Gangnam-gu, Seoul", lat: 37.498, lng: 127.0276 });
  const savedRestaurantsRef = useRef<RestaurantData[]>([]);
  const savedFoodsRef = useRef<SearchResultFood[]>([]);

  const authed = useSyncExternalStore(authStore.subscribe, authStore.getSnapshot);
  const [loginPrompt, setLoginPrompt] = useState<null | { title?: string; message?: string; redirect: string }>(null);

  const requireAuth = useCallback((redirect: string, message?: string): boolean => {
    if (authStore.getSnapshot()) return true;
    setLoginPrompt({ redirect, message });
    return false;
  }, []);

  const toggleSaveRestaurant = useCallback((r: RestaurantData) => {
    if (!requireAuth("/discover", "Sign in to save restaurants to your Heart list.")) return;
    if (_savedRIds.has(r.id)) { _savedRIds.delete(r.id); savedRestaurantsRef.current = savedRestaurantsRef.current.filter((s) => s.id !== r.id); }
    else { _savedRIds.add(r.id); savedRestaurantsRef.current = [...savedRestaurantsRef.current, r]; }
    incrementSavedSnapshot(); _notifySaved();
  }, [requireAuth]);

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
    if ((id === "dining" || id === "profile") && !authStore.getSnapshot()) {
      setLoginPrompt({ redirect: `/${id}`, message: id === "dining"
        ? "Sign in to view and manage your reservations."
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

  const ctx: AppOutletContext = {
    userLocation, setUserLocation,
    savedRestaurantsRef, savedFoodsRef,
    toggleSaveRestaurant, toggleSaveFood,
    requireAuth,
  };

  // Hide GlobalTopBar only on saved/notifications overlay routes (they render their own header)
  const hideTopBar = /^\/(saved|notifications|profile)/.test(location.pathname);

  return (
    <div className="h-screen bg-background flex overflow-hidden">
      <SidebarNav activeTab={activeTab} onSelect={handleTabSelect} />

      <div className="flex-1 flex flex-col min-w-0 h-full relative">
        {!hideTopBar && (
          <GlobalTopBar
            userLocation={userLocation}
            onLocationChange={setUserLocation}
            onNotificationsOpen={() => { if (!authStore.getSnapshot()) { setLoginPrompt({ redirect: "/notifications", message: "Sign in to view your notifications." }); return; } navigate("/notifications"); }}
            onSavedOpen={() => { if (!authStore.getSnapshot()) { setLoginPrompt({ redirect: "/saved", message: "Sign in to view your saved list." }); return; } navigate("/saved"); }}
            savedRestaurantsRef={savedRestaurantsRef}
            savedFoodsRef={savedFoodsRef}
          />
        )}

        <main className={`flex-1 min-w-0 min-h-0 ${isExplorerRoute ? "overflow-hidden" : "overflow-y-auto"}`}
          style={isExplorerRoute ? undefined : { overflowX: "clip" }}>
          <div className={isExplorerRoute ? "h-full" : "max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-24 lg:pb-8 w-full"}>
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                variants={pageVariants}
                initial="initial" animate="animate" exit="exit"
                transition={{ duration: 0.25, ease: [0.25, 0.1, 0.25, 1] }}
                className={isExplorerRoute ? "h-full" : ""}
              >
                <Outlet context={ctx} />
              </motion.div>
            </AnimatePresence>
          </div>
        </main>

        <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-card/95 backdrop-blur-md border-t border-border z-50">
          <div className="flex items-stretch pb-[max(0.25rem,env(safe-area-inset-bottom))]">
            {TABS.map((tab, idx) => (
              <React.Fragment key={tab.id}>
                <TabButton tab={tab} isActive={activeTab === tab.id}
                  onSelect={() => handleTabSelect(tab.id)}
                  badgeCount={tab.id === "discover" ? unreadCount : undefined}
                  showDot={tab.id === "profile" && !dailyClaimed} />
                {idx === 1 && (
                  <div className="relative flex items-center justify-center" style={{ width: 0 }}>
                    <button onClick={handleQRPay}
                      className="absolute -top-5 w-[3.75rem] h-[3.75rem] rounded-full flex items-center justify-center shadow-lg transition-transform active:scale-90 z-10 border-4 border-card"
                      style={{ background: "var(--primary)", color: "var(--primary-foreground)" }} aria-label="QR Pay">
                      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="3" y="3" width="7" height="7" rx="1" />
                        <rect x="14" y="3" width="7" height="7" rx="1" />
                        <rect x="3" y="14" width="7" height="7" rx="1" />
                        <rect x="14" y="14" width="3" height="3" />
                        <path d="M21 14h-3v3" /><path d="M18 21v-3h3" />
                      </svg>
                    </button>
                  </div>
                )}
              </React.Fragment>
            ))}
          </div>
        </nav>
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
      <FirstLoginDbModal />
    </div>
  );
}

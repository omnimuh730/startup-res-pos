import React, { useState, useRef, useCallback, useEffect, useSyncExternalStore, useTransition } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Home, Compass, UtensilsCrossed, User } from "lucide-react";
import { DiscoverPage } from "./discover/DiscoverPage";
const ExplorerPage = React.lazy(() => import("./explorer/ExplorerPage").then(m => ({ default: m.ExplorerPage })));
import { DiningPage } from "./dining/DiningPage";
import { ProfilePage } from "./profile/ProfilePage";
import {
  subscribeNotifications, getNotificationSnapshot, getUnreadCount,
} from "../stores/notificationStore";
import { QRPayPage } from "./qrpay/QRPayPage";
import { GlobalTopBar } from "../components/GlobalTopBar";
import { SavedListView } from "./discover/SavedListView";
import { NotificationsView } from "./discover/NotificationsView";
import type { RestaurantData } from "./detail/RestaurantDetailView";
import type { SearchResultFood } from "./discover/discoverTypes";
import { _savedRIds, _savedFNames, _notifySaved, incrementSavedSnapshot } from "./discover/savedStore";

const TABS = [
  { id: "discover", label: "Discover", icon: Home, isLogo: true },
  { id: "explorer", label: "Explorer", icon: Compass },
  { id: "dining", label: "Dining", icon: UtensilsCrossed },
  { id: "profile", label: "Profile", icon: User },
] as const;

type TabId = (typeof TABS)[number]["id"];

/* ── Sparkle Particle ───────────────────────────── */
interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  angle: number;
  distance: number;
}

function SparkleEffect({ active }: { active: boolean }) {
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    if (!active) return;
    const newParticles: Particle[] = Array.from({ length: 8 }, (_, i) => ({
      id: Date.now() + i,
      x: 0,
      y: 0,
      size: Math.random() * 4 + 2,
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
          <motion.div
            key={p.id}
            className="absolute rounded-full"
            style={{
              width: p.size,
              height: p.size,
              left: "50%",
              top: "50%",
              marginLeft: -p.size / 2,
              marginTop: -p.size / 2,
              background: "var(--primary)",
            }}
            initial={{ opacity: 1, x: 0, y: 0, scale: 1 }}
            animate={{ opacity: 0, x: tx, y: ty, scale: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          />
        );
      })}
    </div>
  );
}

/* ── CatchTable Logo Icon ───────────────────────── */
function CatchTableIcon({ className, isActive }: { className?: string; isActive?: boolean }) {
  const color = isActive ? "var(--primary)" : "var(--muted-foreground)";
  return (
    <svg viewBox="0 0 28 28" fill="none" className={className}>
      <path d="M14 4.5a9.5 9.5 0 1 0 0 19 9.5 9.5 0 0 0 0-19zm0 6.7a2.8 2.8 0 1 1 0 5.6 2.8 2.8 0 0 1 0-5.6z" fill={color} fillRule="evenodd" />
      <circle cx="1.8" cy="14" r="1.8" fill={color} />
    </svg>
  );
}

/* ── Tab Button ─────────────────────────────────── */
function TabButton({
  tab,
  isActive,
  onSelect,
  badgeCount,
}: {
  tab: (typeof TABS)[number];
  isActive: boolean;
  onSelect: () => void;
  badgeCount?: number;
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
    <button
      onClick={onSelect}
      className="flex-1 flex flex-col items-center justify-center gap-0.5 py-2.5 relative transition-colors cursor-pointer select-none"
    >
      {/* Glow ring */}
      <AnimatePresence>
        {isActive && (
          <motion.div
            className="absolute inset-0"
            style={{
              background: "var(--primary)",
              opacity: 0.08,
            }}
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 0.08 }}
            exit={{ scale: 1, opacity: 0 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
          />
        )}
      </AnimatePresence>

      {/* Sparkle particles */}
      <div className="relative">
        <SparkleEffect active={sparkle} />
        {badgeCount != null && badgeCount > 0 && (
          <span className="absolute -top-1.5 -right-2 min-w-[1rem] h-4 px-1 rounded-full bg-primary text-primary-foreground text-[0.5625rem] flex items-center justify-center z-20" style={{ fontWeight: 700 }}>
            {badgeCount > 99 ? "99+" : badgeCount}
          </span>
        )}
        <motion.div
          animate={
            isActive
              ? { scale: [1, 0.8, 1.15, 1], y: [0, 2, -2, 0] }
              : { scale: 1, y: 0 }
          }
          transition={{ duration: 0.35, ease: "easeOut" }}
          className="relative z-10"
        >
          {"isLogo" in tab && tab.isLogo ? (
            <CatchTableIcon
              className="w-[26px] h-[26px] transition-colors duration-200"
              isActive={isActive}
            />
          ) : (
            <tab.icon
              className={`w-[22px] h-[22px] transition-colors duration-200 ${
                isActive
                  ? "text-primary fill-primary stroke-primary"
                  : "text-muted-foreground"
              }`}
              strokeWidth={isActive ? 2.5 : 1.8}
              style={isActive ? { fill: "var(--primary)", fillOpacity: 0.15 } : undefined}
            />
          )}
        </motion.div>
      </div>

      <span
        className={`text-[0.75rem] md:text-[0.8125rem] transition-colors duration-200 relative z-10 ${
          isActive ? "text-primary" : "text-muted-foreground"
        }`}
        style={{ fontWeight: isActive ? 700 : 400 }}
      >
        {tab.label}
      </span>
    </button>
  );
}

/* ── Page Transition Variants ───────────────────── */
const pageVariants = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -6 },
};

/* ── Sidebar Nav for desktop ────────────────────── */
function SidebarNav({
  activeTab,
  onSelect,
}: {
  activeTab: TabId;
  onSelect: (id: TabId) => void;
}) {
  return (
    <aside className="hidden lg:flex flex-col w-60 xl:w-64 border-r border-border bg-card shrink-0 sticky top-0 h-screen">
      <div className="p-6 pb-4">
        <h1 className="text-[1.25rem] text-primary" style={{ fontWeight: 700 }}>
          CatchTable
        </h1>
        <p className="text-muted-foreground text-[0.75rem] mt-0.5">Restaurant Reservations</p>
      </div>
      <nav className="flex-1 px-3 space-y-1">
        {TABS.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onSelect(tab.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all ${
                isActive
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-secondary hover:text-foreground"
              }`}
            >
              {"isLogo" in tab && tab.isLogo ? (
                <CatchTableIcon className="w-5 h-5" isActive={isActive} />
              ) : (
                <tab.icon
                  className="w-5 h-5"
                  strokeWidth={isActive ? 2.5 : 1.8}
                />
              )}
              <span
                className="text-[0.9375rem]"
                style={{ fontWeight: isActive ? 600 : 400 }}
              >
                {tab.label}
              </span>
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

/* ── Main ───────────────────────────────────────── */
export default function RestaurantApp() {
  const [activeTab, setActiveTab] = useState<TabId>("discover");
  const [prevTab, setPrevTab] = useState<TabId>("discover");
  const [, startTransition] = useTransition();
  const [showQRPay, setShowQRPay] = useState(false);
  const [userLocation, setUserLocation] = useState({ name: "Gangnam Station", address: "Gangnam-gu, Seoul", lat: 37.498, lng: 127.0276 });
  const [showSavedList, setShowSavedList] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const savedRestaurantsRef = useRef<RestaurantData[]>([]);
  const savedFoodsRef = useRef<SearchResultFood[]>([]);

  const toggleSaveRestaurant = useCallback((r: RestaurantData) => {
    if (_savedRIds.has(r.id)) { _savedRIds.delete(r.id); savedRestaurantsRef.current = savedRestaurantsRef.current.filter((s) => s.id !== r.id); }
    else { _savedRIds.add(r.id); savedRestaurantsRef.current = [...savedRestaurantsRef.current, r]; }
    incrementSavedSnapshot(); _notifySaved();
  }, []);

  const toggleSaveFood = useCallback((f: SearchResultFood) => {
    const exists = savedFoodsRef.current.some((s) => s.id === f.id);
    savedFoodsRef.current = exists ? savedFoodsRef.current.filter((s) => s.id !== f.id) : [...savedFoodsRef.current, f];
    incrementSavedSnapshot(); _notifySaved();
  }, []);

  useSyncExternalStore(subscribeNotifications, getNotificationSnapshot);
  const unreadCount = getUnreadCount();

  const handleTabChange = useCallback(
    (id: TabId) => {
      if (id !== activeTab) {
        setPrevTab(activeTab);
        startTransition(() => {
          setActiveTab(id);
        });
      }
    },
    [activeTab]
  );

  return (
    <div className="h-screen bg-background flex overflow-hidden">
      {/* Desktop sidebar */}
      <SidebarNav activeTab={activeTab} onSelect={handleTabChange} />

      {/* Main area */}
      <div className="flex-1 flex flex-col min-w-0 h-full relative">
        {/* Global sticky top bar */}
        {!showNotifications && !showSavedList && (
        <GlobalTopBar
          onSavedOpen={() => setShowSavedList(true)}
          savedRestaurantsRef={savedRestaurantsRef}
          savedFoodsRef={savedFoodsRef}
        />
        )}

        {/* Saved / Notifications overlays */}
        {showSavedList && (
          <div className="absolute inset-0 z-30 bg-background overflow-y-auto">
            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-24 lg:pb-8 w-full">
              <SavedListView
                savedRestaurantsRef={savedRestaurantsRef}
                savedFoodsRef={savedFoodsRef}
                onBack={() => setShowSavedList(false)}
                onSelectRestaurant={() => {}}
                onSelectFood={() => {}}
                onRemoveRestaurant={toggleSaveRestaurant}
                onRemoveFood={toggleSaveFood}
              />
            </div>
          </div>
        )}
        {showNotifications && (
          <div className="absolute inset-0 z-30 bg-background overflow-y-auto">
            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-24 lg:pb-8 w-full">
              <NotificationsView onBack={() => setShowNotifications(false)} />
            </div>
          </div>
        )}

        {/* Content */}
        <main className={`flex-1 min-w-0 min-h-0 ${activeTab === "explorer" ? "overflow-hidden" : "overflow-y-auto"}`} style={activeTab === "explorer" ? undefined : { overflowX: "clip" }}>
          <div className={`${activeTab === "explorer" ? "h-full" : "max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-24 lg:pb-8 w-full"}`}>
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                variants={pageVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={{ duration: 0.25, ease: [0.25, 0.1, 0.25, 1] }}
                className={activeTab === "explorer" ? "h-full" : ""}
              >
                {activeTab === "discover" && (
                  <DiscoverPage
                    onNavigateExplorer={() => handleTabChange("explorer")}
                    userLocation={userLocation}
                    onLocationChange={setUserLocation}
                    savedRestaurantsRef={savedRestaurantsRef}
                    savedFoodsRef={savedFoodsRef}
                    toggleSaveRestaurant={toggleSaveRestaurant}
                    toggleSaveFood={toggleSaveFood}
                  />
                )}
                {activeTab === "explorer" && <React.Suspense fallback={<div className="h-full flex items-center justify-center text-muted-foreground">Loading map...</div>}><ExplorerPage /></React.Suspense>}
                {activeTab === "dining" && <DiningPage />}
                {activeTab === "profile" && <ProfilePage />}
              </motion.div>
            </AnimatePresence>
          </div>
        </main>

        {/* Bottom Navigation — mobile/tablet only */}
        <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-card/95 backdrop-blur-md border-t border-border z-50">
          <div className="flex items-stretch pb-[max(0.25rem,env(safe-area-inset-bottom))]">
            {TABS.map((tab, idx) => (
              <React.Fragment key={tab.id}>
                <TabButton
                  tab={tab}
                  isActive={activeTab === tab.id}
                  onSelect={() => handleTabChange(tab.id)}
                  badgeCount={tab.id === "discover" ? unreadCount : undefined}
                />
                {/* FAB between Explorer (idx 1) and Dining (idx 2) */}
                {idx === 1 && (
                  <div className="relative flex items-center justify-center" style={{ width: 0 }}>
                    <button
                      onClick={() => setShowQRPay(true)}
                      className="absolute -top-5 w-[3.75rem] h-[3.75rem] rounded-full flex items-center justify-center shadow-lg transition-transform active:scale-90 z-10 border-4 border-card"
                      style={{ background: "var(--primary)", color: "var(--primary-foreground)" }}
                      aria-label="QR Pay"
                    >
                      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="3" y="3" width="7" height="7" rx="1" />
                        <rect x="14" y="3" width="7" height="7" rx="1" />
                        <rect x="3" y="14" width="7" height="7" rx="1" />
                        <rect x="14" y="14" width="3" height="3" />
                        <path d="M21 14h-3v3" />
                        <path d="M18 21v-3h3" />
                      </svg>
                    </button>
                  </div>
                )}
              </React.Fragment>
            ))}
          </div>
        </nav>

        {/* QR Pay Overlay */}
        <AnimatePresence>
          {showQRPay && <QRPayPage onClose={() => setShowQRPay(false)} />}
        </AnimatePresence>
      </div>
    </div>
  );
}

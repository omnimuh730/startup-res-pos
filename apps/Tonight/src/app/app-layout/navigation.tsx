import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Home, Heart, UtensilsCrossed, User } from "lucide-react";
import { TonightLogoMark } from "../utils/brand/TonightLogo";

export const TABS = [
  { id: "discover", label: "Discover", icon: Home, isLogo: true, path: "/discover" },
  { id: "wishlist", label: "Wishlist", icon: Heart, path: "/wishlist" },
  { id: "dining", label: "Dining", icon: UtensilsCrossed, path: "/dining" },
  { id: "profile", label: "Profile", icon: User, path: "/profile" },
] as const;

export type TabId = (typeof TABS)[number]["id"];

type Particle = { id: number; x: number; y: number; size: number; angle: number; distance: number };

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
    <div className="pointer-events-none absolute inset-0 overflow-visible">
      {particles.map((p) => {
        const rad = (p.angle * Math.PI) / 180;
        const tx = Math.cos(rad) * p.distance;
        const ty = Math.sin(rad) * p.distance;
        return (
          <motion.div
            key={p.id}
            className="absolute rounded-full"
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

function TonightTabIcon({ className, isActive }: { className?: string; isActive?: boolean }) {
  const color = isActive ? "var(--primary)" : "var(--muted-foreground)";
  return <TonightLogoMark className={className} color={color} title="Tonight" />;
}

export function TabButton({ tab, isActive, onSelect, badgeCount, showDot }: { tab: (typeof TABS)[number]; isActive: boolean; onSelect: () => void; badgeCount?: number; showDot?: boolean }) {
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
    <button onClick={onSelect} className="relative flex flex-1 cursor-pointer select-none flex-col items-center justify-center gap-0.5 py-2.5 transition-colors">
      <AnimatePresence>
        {isActive && <motion.div className="absolute inset-0" style={{ background: "var(--primary)", opacity: 0.08 }} initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 0.08 }} exit={{ scale: 1, opacity: 0 }} transition={{ duration: 0.35, ease: "easeOut" }} />}
      </AnimatePresence>
      <div className="relative">
        <SparkleEffect active={sparkle} />
        {badgeCount != null && badgeCount > 0 && (
          <span className="absolute -right-2 -top-1.5 z-20 flex h-4 min-w-[1rem] items-center justify-center rounded-full bg-primary px-1 text-[0.5625rem] text-primary-foreground" style={{ fontWeight: 700 }}>
            {badgeCount > 99 ? "99+" : badgeCount}
          </span>
        )}
        {showDot && !(badgeCount != null && badgeCount > 0) && <span className="absolute -right-0.5 -top-0.5 z-20 h-2.5 w-2.5 rounded-full border-2 border-card bg-destructive" />}
        <motion.div animate={isActive ? { scale: [1, 0.8, 1.15, 1], y: [0, 2, -2, 0] } : { scale: 1, y: 0 }} transition={{ duration: 0.35, ease: "easeOut" }} className="relative z-10">
          {"isLogo" in tab && tab.isLogo ? (
            <TonightTabIcon className="h-[26px] w-[26px] transition-colors duration-200" isActive={isActive} />
          ) : (
            <tab.icon className={`h-[22px] w-[22px] transition-colors duration-200 ${isActive ? "fill-primary stroke-primary text-primary" : "text-muted-foreground"}`} strokeWidth={isActive ? 2.5 : 1.8} style={isActive ? { fill: "var(--primary)", fillOpacity: 0.15 } : undefined} />
          )}
        </motion.div>
      </div>
      <span className={`relative z-10 text-[0.75rem] transition-colors duration-200 md:text-[0.8125rem] ${isActive ? "text-primary" : "text-muted-foreground"}`} style={{ fontWeight: isActive ? 700 : 400 }}>{tab.label}</span>
    </button>
  );
}

export function SidebarNav({ activeTab, onSelect }: { activeTab: TabId; onSelect: (id: TabId) => void }) {
  return (
    <aside className="sticky top-0 hidden h-dvh w-60 shrink-0 flex-col border-r border-border bg-card lg:flex xl:w-64">
      <div className="p-6 pb-4">
        <h1 className="text-[1.25rem] text-primary" style={{ fontWeight: 700 }}>Tonight</h1>
        <p className="mt-0.5 text-[0.75rem] text-muted-foreground">Restaurant Reservations</p>
      </div>
      <nav className="flex-1 space-y-1 px-3">
        {TABS.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button key={tab.id} onClick={() => onSelect(tab.id)} className={`w-full rounded-xl px-4 py-3 text-left transition-all ${isActive ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-secondary hover:text-foreground"}`}>
              <span className="flex items-center gap-3">
                {"isLogo" in tab && tab.isLogo ? <TonightTabIcon className="h-5 w-5" isActive={isActive} /> : <tab.icon className="h-5 w-5" strokeWidth={isActive ? 2.5 : 1.8} />}
                <span className="text-[0.9375rem]" style={{ fontWeight: isActive ? 600 : 400 }}>{tab.label}</span>
              </span>
            </button>
          );
        })}
      </nav>
      <div className="border-t border-border p-4"><p className="text-[0.6875rem] text-muted-foreground">v2.4.1 · Powered by DS</p></div>
    </aside>
  );
}

export const pageVariants = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
};

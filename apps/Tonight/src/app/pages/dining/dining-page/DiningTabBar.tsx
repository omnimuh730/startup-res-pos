import { motion } from "framer-motion";
import type { DiningTabId, DiningTabOption } from "./diningTabs";
import { DINING_TABS } from "./diningTabs";

export function DiningTabBar({
  value,
  counts,
  onChange,
}: {
  value: DiningTabId;
  counts: Record<DiningTabId, number>;
  onChange: (value: DiningTabId) => void;
}) {
  return (
    <div role="tablist" aria-label="Dining booking status" className="sticky top-2 z-10 -mx-1 rounded-[1.5rem] bg-background/90 px-1 py-2 backdrop-blur-md">
      <div className="grid w-full grid-cols-3 gap-2">
        {DINING_TABS.map((tab: DiningTabOption) => {
          const Icon = tab.icon;
          const active = value === tab.id;
          const visualLabel = tab.id === "cancel" ? "Cancelled" : tab.shortLabel;

          return (
            <motion.button
              key={tab.id}
              type="button"
              role="tab"
              aria-selected={active}
              aria-label={`${tab.label}: ${counts[tab.id]} booking${counts[tab.id] === 1 ? "" : "s"}`}
              onClick={() => onChange(tab.id)}
              className={`flex h-10 min-w-0 cursor-pointer items-center justify-center gap-1 rounded-full px-1.5 transition active:scale-95 ${
                active
                  ? "bg-primary text-primary-foreground shadow-[0_8px_18px_rgba(255,56,92,0.22)]"
                  : "bg-secondary/75 text-muted-foreground hover:bg-secondary hover:text-foreground"
              }`}
              style={{ fontWeight: 800 }}
              transition={{ type: "spring", stiffness: 520, damping: 38 }}
            >
              <Icon className="h-4 w-4 shrink-0" strokeWidth={active ? 2.4 : 2} />
              <span className="min-w-0 truncate text-[0.75rem]">{visualLabel}</span>
              <span
                className={`flex h-4 min-w-4 shrink-0 items-center justify-center rounded-full px-1 text-[0.625rem] ${
                  active ? "bg-white/20 text-white" : "bg-card text-muted-foreground"
                }`}
              >
                {counts[tab.id]}
              </span>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}

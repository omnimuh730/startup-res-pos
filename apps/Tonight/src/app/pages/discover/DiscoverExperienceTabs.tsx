import { CalendarDays, Martini, UtensilsCrossed } from "lucide-react";
import { motion } from "motion/react";

export type DiscoverExperienceTab = "restaurants" | "bars" | "events";

const tabs: Array<{
  id: DiscoverExperienceTab;
  label: string;
  helper: string;
  icon: typeof UtensilsCrossed;
}> = [
  { id: "restaurants", label: "Restaurants", helper: "Tables tonight", icon: UtensilsCrossed },
  { id: "bars", label: "Bars", helper: "Cocktails & bites", icon: Martini },
  { id: "events", label: "Events", helper: "Chef-led nights", icon: CalendarDays },
];

export function DiscoverExperienceTabs({
  active,
  onChange,
}: {
  active: DiscoverExperienceTab;
  onChange: (tab: DiscoverExperienceTab) => void;
}) {
  return (
    <div className="mt-4 -mx-4 px-4 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8 overflow-x-auto scrollbar-hide">
      <div className="flex min-w-max gap-7 border-b border-border">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const selected = active === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onChange(tab.id)}
              className={`relative flex flex-col items-center gap-1 pb-3 cursor-pointer transition-colors ${selected ? "text-foreground" : "text-muted-foreground"}`}
            >
              <motion.span
                animate={selected ? { scale: [1, 1.08, 1] } : { scale: 1 }}
                transition={{ duration: 0.25, ease: "easeOut" }}
                className={`w-11 h-11 rounded-2xl flex items-center justify-center ${selected ? "bg-[#F7F7F7]" : "bg-transparent"}`}
              >
                <Icon className="w-5 h-5" strokeWidth={selected ? 2.4 : 1.8} />
              </motion.span>
              <span className="text-[0.8125rem]" style={{ fontWeight: selected ? 700 : 500 }}>{tab.label}</span>
              <span className="text-[0.6875rem] -mt-1">{tab.helper}</span>
              {selected && (
                <motion.span
                  layoutId="discover-experience-underline"
                  className="absolute -bottom-px left-2 right-2 h-[2.5px] rounded-full bg-foreground"
                  transition={{ duration: 0.2, ease: "easeOut" }}
                />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

import { useEffect, useRef, useState } from "react";
import { MENU_DATA, type RestaurantData } from "../restaurantDetailData";
import { MenuBanner } from "./MenuBanner";
import { MenuCategorySection } from "./MenuCategorySection";
import type { MenuItemWithCategory } from "./types";

export function MenuPage({
  restaurant: _restaurant,
  onBack,
  onSelectItem,
}: {
  restaurant: RestaurantData;
  onBack: () => void;
  onSelectItem: (item: MenuItemWithCategory) => void;
}) {
  const [entered, setEntered] = useState(false);
  const [closing, setClosing] = useState(false);
  const [compactBanner, setCompactBanner] = useState(false);
  const menuScrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const id = window.requestAnimationFrame(() => setEntered(true));
    return () => window.cancelAnimationFrame(id);
  }, []);

  const handleBack = () => {
    if (closing) return;
    setClosing(true);
    setEntered(false);
    window.setTimeout(() => onBack(), 440);
  };

  return (
    <div
      className={`fixed inset-0 z-[320] bg-background text-foreground will-change-transform transition-transform duration-[440ms] ease-[cubic-bezier(0.22,0.61,0.36,1)] ${
        entered ? "translate-x-0" : "translate-x-full"
      }`}
    >
      <div
        ref={menuScrollRef}
        onScroll={(e) => {
          const top = (e.target as HTMLDivElement).scrollTop;
          // Widened the thresholds slightly to prevent scroll-bounce thrashing
          setCompactBanner((prev) => {
            if (!prev && top > 64) return true;
            if (prev && top < 24) return false;
            return prev;
          });
        }}
        // Added overflow-anchor:none to prevent Chrome anchoring bug from fighting the transition
        className="h-full overflow-y-auto pb-24 [overflow-anchor:none]"
      >
        <MenuBanner compactBanner={compactBanner} onBack={handleBack} />

        {/* Added min-h block so that a small menu doesn't force a scrollTop glitch on shrink */}
        <div className="px-5 py-5 min-h-[calc(100vh-4.5rem)]">
          {Object.entries(MENU_DATA).map(([category, items]) => (
            <MenuCategorySection
              key={category}
              category={category}
              items={items}
              onSelectItem={onSelectItem}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
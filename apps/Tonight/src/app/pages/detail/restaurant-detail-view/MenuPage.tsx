import { useEffect, useRef, useState } from "react";
import { MENU_DATA, type RestaurantData } from "../restaurantDetailData";
import { MenuBanner } from "./MenuBanner";

type MenuCategoryName = keyof typeof MENU_DATA;

const MENU_CATEGORIES = Object.keys(MENU_DATA) as MenuCategoryName[];

export function MenuPage({
  restaurant: _restaurant,
  onBack,
}: {
  restaurant: RestaurantData;
  onBack: () => void;
}) {
  const [entered, setEntered] = useState(false);
  const [closing, setClosing] = useState(false);
  const [compactBanner, setCompactBanner] = useState(false);
  const [activeCategory, setActiveCategory] = useState<MenuCategoryName>(MENU_CATEGORIES[0]);
  const menuScrollRef = useRef<HTMLDivElement>(null);
  const activeItems = MENU_DATA[activeCategory];

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

        <div className="sticky top-[4.5rem] z-10 border-b border-border bg-background/95 backdrop-blur-xl">
          <div className="overflow-x-auto scrollbar-hide">
            <div className="flex w-max gap-2 px-5 py-3">
              {MENU_CATEGORIES.map((category) => {
                const isActive = activeCategory === category;
                return (
                  <button
                    key={category}
                    type="button"
                    onClick={() => setActiveCategory(category)}
                    className={`h-10 shrink-0 cursor-pointer rounded-full px-4 text-[0.875rem] transition active:scale-95 ${
                      isActive ? "bg-primary text-primary-foreground shadow-[0_8px_18px_rgba(255,56,92,0.22)]" : "bg-secondary text-muted-foreground hover:bg-secondary/80 hover:text-foreground"
                    }`}
                    style={{ fontWeight: 800 }}
                  >
                    {category}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <div className="min-h-[calc(100vh-9rem)] px-5 py-5">
          <ul className="space-y-3">
            {activeItems.map((item) => (
              <li
                key={item.name}
                className="rounded-2xl border border-border bg-card px-4 py-4 text-center shadow-[0_4px_14px_rgba(0,0,0,0.05)]"
              >
                <span
                  className="block break-words text-[2rem] leading-tight text-foreground sm:text-[2.25rem]"
                  style={{
                    fontFamily: `"Old English Text MT", "Blackadder ITC", "UnifrakturCook", "UnifrakturMaguntia", Georgia, fantasy`,
                    fontWeight: 700,
                    letterSpacing: 0,
                  }}
                >
                  {item.name}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

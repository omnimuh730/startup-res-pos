/* Global sticky top bar — compact discover header + saved */
import { Heart } from "lucide-react";
import { Heading } from "./ds/Text";
import { SavedCountBadge } from "../pages/discover/SaveButtons";
import type { RestaurantData } from "../pages/detail/RestaurantDetailView";
import type { SearchResultFood } from "../pages/discover/discoverTypes";

interface GlobalTopBarProps {
  onSavedOpen: () => void;
  savedRestaurantsRef: React.RefObject<RestaurantData[]>;
  savedFoodsRef: React.RefObject<SearchResultFood[]>;
}

export function GlobalTopBar({
  onSavedOpen,
  savedRestaurantsRef,
  savedFoodsRef,
}: GlobalTopBarProps) {
  return (
    <div
      data-global-topbar="true"
      className="sticky top-0 z-40 bg-background/95 backdrop-blur-md border-b border-border/50 px-4 sm:px-6 lg:px-8 max-w-3xl mx-auto w-full lg:hidden"
      style={{
        paddingTop: "calc(var(--safe-area-inset-top) + 0.75rem)",
        paddingBottom: "0.75rem",
      }}
    >
      <div className="flex items-center justify-between gap-4">
        <div className="min-w-0">
          <Heading level={3}>Where shall we dine?</Heading>
        </div>
        <button
          onClick={onSavedOpen}
          className="relative w-10 h-10 rounded-full bg-secondary flex items-center justify-center hover:bg-secondary/80 transition cursor-pointer shrink-0"
          aria-label="Open saved list"
        >
          <Heart className="w-5 h-5" />
          <SavedCountBadge restaurantsRef={savedRestaurantsRef} foodsRef={savedFoodsRef} />
        </button>
      </div>
    </div>
  );
}

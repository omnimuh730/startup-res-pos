/* Global sticky top bar — location, notifications, saved */
import { useState, useRef, useCallback } from "react";
import { MapPin, ChevronRight, Heart } from "lucide-react";
import { Heading } from "./ds/Text";
import { NotificationBellBtn, SavedCountBadge } from "../pages/discover/SaveButtons";
import { LocationPickerModal } from "../pages/shared/LocationPickerModal";
import type { RestaurantData } from "../pages/detail/RestaurantDetailView";
import type { SearchResultFood } from "../pages/discover/discoverTypes";

interface GlobalTopBarProps {
  userLocation: { name: string; address: string; lat: number; lng: number };
  onLocationChange: (loc: { name: string; address: string; lat: number; lng: number }) => void;
  onNotificationsOpen: () => void;
  onSavedOpen: () => void;
  savedRestaurantsRef: React.RefObject<RestaurantData[]>;
  savedFoodsRef: React.RefObject<SearchResultFood[]>;
}

export function GlobalTopBar({
  userLocation,
  onLocationChange,
  onNotificationsOpen,
  onSavedOpen,
  savedRestaurantsRef,
  savedFoodsRef,
}: GlobalTopBarProps) {
  const [showLocationPicker, setShowLocationPicker] = useState(false);

  return (
    <>
      {showLocationPicker && (
        <LocationPickerModal
          open={showLocationPicker}
          onClose={() => setShowLocationPicker(false)}
          onSelect={(loc) => {
            onLocationChange(loc);
            setShowLocationPicker(false);
          }}
          currentLocation={userLocation}
        />
      )}
      <div className="sticky top-0 z-40 bg-background/95 backdrop-blur-md border-b border-border/50 px-4 sm:px-6 lg:px-8 py-3 max-w-3xl mx-auto w-full lg:hidden">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowLocationPicker(true)}
              className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center hover:bg-primary/20 transition cursor-pointer shrink-0"
              title="Set location"
            >
              <MapPin className="w-5 h-5 text-primary" />
            </button>
            <div>
              <button
                onClick={() => setShowLocationPicker(true)}
                className="flex items-center gap-1 text-muted-foreground text-[0.75rem] hover:text-primary transition cursor-pointer"
              >
                <span className="truncate max-w-[10rem]">{userLocation.name}</span>
                <ChevronRight className="w-3 h-3 -rotate-90" />
              </button>
              <Heading level={3}>Where shall we dine?</Heading>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <NotificationBellBtn onClick={onNotificationsOpen} />
            <button
              onClick={onSavedOpen}
              className="relative w-10 h-10 rounded-full bg-secondary flex items-center justify-center hover:bg-secondary/80 transition cursor-pointer"
            >
              <Heart className="w-5 h-5" />
              <SavedCountBadge restaurantsRef={savedRestaurantsRef} foodsRef={savedFoodsRef} />
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
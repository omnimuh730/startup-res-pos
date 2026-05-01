/* Main restaurant detail view */
import { useEffect, useMemo, useRef, useState } from "react";
import { FoodDetailPage } from "./FoodDetailPage";
import { addNotification } from "../../stores/notificationStore";
import { InviteFriends } from "../shared/InviteFriends";
import {
  type RestaurantData,
  type ReviewEntry,
  fmtR,
  getExtendedData,
  MENU_DATA,
  REVIEW_DATA,
} from "./restaurantDetailData";
import { useSavedVersion, _savedRIds } from "../discover/savedStore";
import { AboutSection, AmenitiesSection, CancellationPolicySection, HighlightsSection } from "./restaurant-detail-view/InfoSections";
import { BookingBar } from "./restaurant-detail-view/BookingBar";
import { GuestFavoriteSection } from "./restaurant-detail-view/GuestFavoriteSection";
import { HeaderSummary, RatingsSummary } from "./restaurant-detail-view/HeaderSummary";
import { HeroCarousel } from "./restaurant-detail-view/HeroCarousel";
import { HostSection } from "./restaurant-detail-view/HostSection";
import { LocationSection } from "./restaurant-detail-view/LocationSection";
import { MenuPage } from "./restaurant-detail-view/MenuPage";
import { PopularMenuSection } from "./restaurant-detail-view/PopularMenuSection";
import { ReviewsPage } from "./restaurant-detail-view/ReviewsPage";
import { getHostProfile } from "./restaurant-detail-view/hostProfile";
import { snapToNearestCard } from "./restaurant-detail-view/scrollUtils";
import type { MenuItemWithCategory, RestaurantDetailProps } from "./restaurant-detail-view/types";
import { useHorizontalDrag } from "./restaurant-detail-view/useHorizontalDrag";

// Re-export for consumers
export type { RestaurantData, ReviewEntry };
export { FoodDetailPage, fmtR };
export { WriteReviewModal } from "./ReviewComponents";
export { FOOD_DETAILS } from "./restaurantDetailData";

export function RestaurantDetailView({
  restaurant,
  onBack,
  onBookTable,
  onDirections,
  onSave,
  requireAuth,
  isSaved: _isSavedProp,
  onSaveFood,
  savedFoodNames = [],
}: RestaurantDetailProps) {
  useSavedVersion();
  const isSaved = _savedRIds.has(restaurant.id);
  const [selectedMenuItem, setSelectedMenuItem] = useState<MenuItemWithCategory | null>(null);
  const [showReviewsPage, setShowReviewsPage] = useState(false);
  const [showMenuPage, setShowMenuPage] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);
  const [sharedFriendIds, setSharedFriendIds] = useState<Set<string>>(new Set());
  const [heroIdx, setHeroIdx] = useState(0);
  const heroRef = useRef<HTMLDivElement>(null);
  const guestReviewsRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const ext = getExtendedData(restaurant);
  const galleryImages = [
    restaurant.image,
    "https://images.unsplash.com/photo-1552566626-52f8b828add9?w=1200&h=800&fit=crop",
    "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1200&h=800&fit=crop",
    "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1200&h=800&fit=crop",
  ];

  useHorizontalDrag(heroRef, { snapToPage: true });
  useHorizontalDrag(guestReviewsRef, { snapToCard: snapToNearestCard });

  useEffect(() => {
    const prevBody = document.body.style.overflow;
    const m = document.querySelector("main") as HTMLElement | null;
    const prevMain = m?.style.overflow ?? "";
    document.body.style.overflow = "hidden";
    if (m) m.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prevBody;
      if (m) m.style.overflow = prevMain;
    };
  }, []);

  const topGuestReviews = useMemo(() => REVIEW_DATA.slice(0, 10), []);
  const hostProfile = useMemo(() => getHostProfile(restaurant), [restaurant]);
  const menuItems = useMemo(
    () => Object.entries(MENU_DATA).flatMap(([category, items]) => items.map((item) => ({ ...item, category }))),
    [],
  );

  const openAllReviews = () => setShowReviewsPage(true);
  const openShareModal = () => {
    if (requireAuth && !requireAuth(`/discover/restaurant/${restaurant.id}`, "Sign in to share restaurants with friends.")) return;
    setShareOpen(true);
  };
  const handleShared = (friendIds: Set<string>) => {
    setSharedFriendIds(friendIds);
    const newShareCount = [...friendIds].filter((id) => !sharedFriendIds.has(id)).length;
    if (newShareCount === 0) return;
    addNotification({
      title: `${restaurant.name} shared`,
      message: `${newShareCount} friend${newShareCount === 1 ? "" : "s"} received this restaurant in notifications.`,
      icon: "share",
      restaurant,
    });
  };
  const onHeroScroll = () => {
    const el = heroRef.current;
    if (!el) return;
    const idx = Math.round(el.scrollLeft / el.clientWidth);
    if (idx !== heroIdx) setHeroIdx(idx);
  };

  return (
    <div className="fixed inset-0 z-[200] bg-background text-foreground">
      <div ref={scrollRef} className="h-full overflow-y-auto pb-44">
        <HeroCarousel
          restaurant={restaurant}
          galleryImages={galleryImages}
          heroIdx={heroIdx}
          heroRef={heroRef}
          isSaved={isSaved}
          onBack={onBack}
          onHeroScroll={onHeroScroll}
          onSave={onSave}
          onShare={openShareModal}
        />

        <HeaderSummary restaurant={restaurant} ext={ext} />
        <RatingsSummary restaurant={restaurant} onOpenReviews={openAllReviews} />
        <HighlightsSection restaurant={restaurant} />
        <AboutSection ext={ext} />
        <AmenitiesSection ext={ext} />
        <LocationSection restaurant={restaurant} ext={ext} onDirections={onDirections} />
        <GuestFavoriteSection
          restaurant={restaurant}
          guestReviewsRef={guestReviewsRef}
          topGuestReviews={topGuestReviews}
          onOpenReviews={openAllReviews}
        />
        <HostSection restaurant={restaurant} hostProfile={hostProfile} />
        <CancellationPolicySection />
        <PopularMenuSection
          menuItems={menuItems}
          onSelectMenuItem={setSelectedMenuItem}
          onShowMenu={() => setShowMenuPage(true)}
        />
      </div>

      <BookingBar restaurant={restaurant} onBookTable={onBookTable} />

      {selectedMenuItem && (
        <FoodDetailPage item={selectedMenuItem} restaurantName={restaurant.name} onBack={() => setSelectedMenuItem(null)} onSave={() => onSaveFood?.(selectedMenuItem.name)} isSaved={savedFoodNames.includes(selectedMenuItem.name)} />
      )}

      {showReviewsPage && (
        <ReviewsPage
          restaurant={restaurant}
          onBack={() => setShowReviewsPage(false)}
        />
      )}

      {showMenuPage && (
        <MenuPage
          restaurant={restaurant}
          onBack={() => setShowMenuPage(false)}
          onSelectItem={(item) => {
            setShowMenuPage(false);
            setSelectedMenuItem(item);
          }}
        />
      )}

      <InviteFriends
        open={shareOpen}
        onClose={() => setShareOpen(false)}
        restaurantName={restaurant.name}
        date=""
        time=""
        alreadyInvited={sharedFriendIds}
        onInvited={handleShared}
        mode="share"
      />
    </div>
  );
}

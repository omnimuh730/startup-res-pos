/* Main restaurant detail view */
import { useEffect, useMemo, useRef, useState } from "react";
import { ArrowLeft, Heart, Share2 } from "lucide-react";
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
import type { RestaurantDetailProps } from "./restaurant-detail-view/types";
import { useHorizontalDrag } from "./restaurant-detail-view/useHorizontalDrag";

// Re-export for consumers
export type { RestaurantData, ReviewEntry };
export { fmtR };
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
}: RestaurantDetailProps) {
  useSavedVersion();
  const isSaved = _savedRIds.has(restaurant.id);
  const [showReviewsPage, setShowReviewsPage] = useState(false);
  const [showMenuPage, setShowMenuPage] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);
  const [sharedFriendIds, setSharedFriendIds] = useState<Set<string>>(new Set());
  const [heroIdx, setHeroIdx] = useState(0);
  const [detailHeaderSolid, setDetailHeaderSolid] = useState(false);
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
  const onDetailScroll = () => {
    const top = scrollRef.current?.scrollTop ?? 0;
    setDetailHeaderSolid((prev) => {
      if (!prev && top > 20) return true;
      if (prev && top < 8) return false;
      return prev;
    });
  };

  return (
    <div className="fixed inset-0 z-[200] bg-background text-foreground">
      <RestaurantDetailTopBar
        restaurant={restaurant}
        isSaved={isSaved}
        solid={detailHeaderSolid}
        onBack={onBack}
        onSave={onSave}
        onShare={openShareModal}
      />

      <div ref={scrollRef} onScroll={onDetailScroll} className="h-full overflow-y-auto pb-44">
        <HeroCarousel
          restaurant={restaurant}
          galleryImages={galleryImages}
          heroIdx={heroIdx}
          heroRef={heroRef}
          onHeroScroll={onHeroScroll}
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
          onShowMenu={() => setShowMenuPage(true)}
        />
      </div>

      <BookingBar restaurant={restaurant} onBookTable={onBookTable} />

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

function RestaurantDetailTopBar({
  restaurant,
  isSaved,
  solid,
  onBack,
  onSave,
  onShare,
}: {
  restaurant: RestaurantData;
  isSaved: boolean;
  solid: boolean;
  onBack: () => void;
  onSave?: (restaurant: RestaurantData) => void;
  onShare: () => void;
}) {
  const buttonClass = solid
    ? "bg-secondary text-foreground shadow-none hover:bg-secondary/80"
    : "bg-white/90 text-foreground shadow-[0_8px_22px_rgba(0,0,0,0.18)] backdrop-blur hover:bg-white";

  return (
    <div
      className={`absolute inset-x-0 top-0 z-[230] transition-all duration-300 ease-[cubic-bezier(0.22,0.61,0.36,1)] ${
        solid ? "border-b border-border bg-background/92 shadow-[0_10px_28px_rgba(0,0,0,0.08)] backdrop-blur-xl" : "bg-transparent"
      }`}
      style={{ paddingTop: "var(--safe-area-inset-top, 0px)" }}
    >
      <div className="mx-auto flex h-16 w-full max-w-3xl items-center justify-between px-4 sm:px-5">
        <button
          type="button"
          onClick={onBack}
          aria-label="Back"
          className={`flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center rounded-full transition active:scale-95 ${buttonClass}`}
        >
          <ArrowLeft className="h-5 w-5" />
        </button>

        <div
          className={`min-w-0 flex-1 px-3 text-center transition-all duration-300 ${
            solid ? "translate-y-0 opacity-100" : "-translate-y-1 opacity-0"
          }`}
          aria-hidden={!solid}
        >
          <p className="truncate text-[0.9375rem] leading-tight" style={{ fontWeight: 800 }}>
            {restaurant.name}
          </p>
        </div>

        <div className="flex shrink-0 items-center gap-2">
          <button
            type="button"
            onClick={(event) => {
              event.preventDefault();
              event.stopPropagation();
              onShare();
            }}
            aria-label="Share restaurant"
            className={`flex h-10 w-10 cursor-pointer items-center justify-center rounded-full transition active:scale-95 ${buttonClass}`}
          >
            <Share2 className="h-[1.125rem] w-[1.125rem]" />
          </button>
          <button
            type="button"
            onClick={(event) => {
              event.preventDefault();
              event.stopPropagation();
              onSave?.(restaurant);
            }}
            aria-label={isSaved ? "Remove saved restaurant" : "Save restaurant"}
            className={`flex h-10 w-10 cursor-pointer items-center justify-center rounded-full transition active:scale-95 ${buttonClass}`}
          >
            <Heart className={`h-5 w-5 ${isSaved ? "fill-rose-500 text-rose-500" : ""}`} />
          </button>
        </div>
      </div>
    </div>
  );
}

import type { RefObject } from "react";
import { useNavigate } from "react-router";
import { Stagger } from "../../../components/ds/Animate";
import { RestaurantsByPrice } from "../RestaurantsByPrice";
import type { RestaurantData } from "../detail/RestaurantDetailView";
import type { SearchPlan } from "../DiscoverSearchModal";
import { CITIES, FOOD_TYPES } from "../discoverData";

type DiscoverCity = (typeof CITIES)[number];
type DiscoverFood = (typeof FOOD_TYPES)[number];
import { DiscoverHeroNav } from "./DiscoverHeroNav";
import { buildDiscoverFeedStaggerItems } from "./DiscoverFeedMinified";

type Glide = (duration: number, delay?: number) => {
  type: "tween";
  duration: number;
  ease: readonly [number, number, number, number];
  delay: number;
};

export function DiscoverHomeShell({
  hasSubView,
  discoverHeroSectionRef,
  discoverNavCompact,
  reduceMotion,
  glide,
  showBannerGallery,
  setShowBannerGallery,
  searchPlan,
  searchInput,
  setShowSearchModal,
  handleOpenMapSearch,
  onBannerClick,
  onGalleryBannerSelect,
  requireAuth,
  saveScrollPos,
  setSelectedCategory,
  openSection,
  openCity,
  openFoodType,
  openRestaurant,
  toggleSaveRestaurant,
  isRestaurantSaved,
}: {
  hasSubView: boolean;
  discoverHeroSectionRef: RefObject<HTMLElement | null>;
  discoverNavCompact: boolean;
  reduceMotion: boolean | null;
  glide: Glide;
  showBannerGallery: boolean;
  setShowBannerGallery: (v: boolean) => void;
  searchPlan: SearchPlan | null;
  searchInput: string;
  setShowSearchModal: (v: boolean) => void;
  handleOpenMapSearch: () => void;
  onBannerClick: (bannerId: string) => void;
  onGalleryBannerSelect: (bannerId: string) => void;
  requireAuth: (path: string, message: string) => boolean;
  saveScrollPos: () => void;
  setSelectedCategory: (c: { id: string; label: string; icon?: string }) => void;
  openSection: (sectionId: string) => void;
  openCity: (city: DiscoverCity) => void;
  openFoodType: (f: DiscoverFood) => void;
  openRestaurant: (r: {
    id: string;
    name: string;
    cuisine: string;
    rating: number;
    image: string;
    price?: string;
    reviews?: number;
  }) => void;
  toggleSaveRestaurant: (r: RestaurantData) => void;
  isRestaurantSaved: (id: string) => boolean;
}) {
  const navigate = useNavigate();
  const feedItems = buildDiscoverFeedStaggerItems({
    navigate,
    requireAuth,
    saveScrollPos,
    setSelectedCategory,
    openSection,
    openCity,
    openFoodType,
    openRestaurant,
    toggleSaveRestaurant,
  });

  return (
    <div className="w-full min-w-0" style={{ display: hasSubView ? "none" : undefined }}>
      <DiscoverHeroNav
        discoverHeroSectionRef={discoverHeroSectionRef}
        discoverNavCompact={discoverNavCompact}
        reduceMotion={reduceMotion}
        glide={glide}
        showBannerGallery={showBannerGallery}
        setShowBannerGallery={setShowBannerGallery}
        searchPlan={searchPlan}
        searchInput={searchInput}
        setShowSearchModal={setShowSearchModal}
        handleOpenMapSearch={handleOpenMapSearch}
        onBannerClick={onBannerClick}
        onGalleryBannerSelect={onGalleryBannerSelect}
        hasSubView={hasSubView}
      />
      <div className="relative z-10 -mx-4 -mt-10 rounded-t-[2rem] bg-background px-4 pb-6 pt-4 shadow-[0_-18px_50px_-24px_rgba(0,0,0,0.18)] sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8 lg:pb-8">
        <Stagger stagger={0.06} className="pb-0">
          {feedItems}
        </Stagger>
        <RestaurantsByPrice onSelectRestaurant={openRestaurant} onSaveRestaurant={toggleSaveRestaurant} isRestaurantSaved={isRestaurantSaved} />
      </div>
    </div>
  );
}

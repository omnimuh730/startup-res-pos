/* Main restaurant detail view */
import { useState, useEffect, useRef } from "react";
import {
  ArrowLeft, Heart, Star, Clock, MapPin, Navigation, CalendarDays,
  UtensilsCrossed, Phone, ChevronDown,
} from "lucide-react";
import { Tabs, TabList, TabTrigger, TabPanel } from "../../components/ds/Tabs";
import { Button } from "../../components/ds/Button";
import { ImageWithFallback } from "../../components/figma/ImageWithFallback";
import { Ribbon, RibbonContainer, pickRibbonLabel } from "../../components/ds/Ribbon";
import {
  type RestaurantData, type ReviewEntry,
  fmtR, getExtendedData, MENU_DATA, MENU_IMAGES, REVIEW_DATA,
} from "./restaurantDetailData";
import { ReviewCard, ReviewCardSkeleton, RatingBreakdown } from "./ReviewComponents";
import { FoodDetailPage } from "./FoodDetailPage";
import { useSavedVersion, _savedRIds } from "../discover/savedStore";

// Re-export for consumers
export type { RestaurantData, ReviewEntry };
export { FoodDetailPage, fmtR };
export { WriteReviewModal } from "./ReviewComponents";
export { FOOD_DETAILS } from "./restaurantDetailData";

interface Props {
  restaurant: RestaurantData;
  onBack: () => void;
  onBookTable: (restaurant: RestaurantData) => void;
  onDirections?: (restaurant: RestaurantData) => void;
  onSave?: (restaurant: RestaurantData) => void;
  isSaved?: boolean;
  onSaveFood?: (foodName: string) => void;
  savedFoodNames?: string[];
}

const REVIEWS_INITIAL = 5;
const REVIEWS_PAGE = 5;

export function RestaurantDetailView({ restaurant, onBack, onBookTable, onDirections, onSave, isSaved: _isSavedProp, onSaveFood, savedFoodNames = [] }: Props) {
  useSavedVersion();
  const isSaved = _savedRIds.has(restaurant.id);
  const [selectedMenuItem, setSelectedMenuItem] = useState<{ name: string; desc: string; price: number; popular: boolean; category: string } | null>(null);
  const [userReviews] = useState<ReviewEntry[]>([]);
  const [visibleCount, setVisibleCount] = useState(REVIEWS_INITIAL);
  const [loadingMore, setLoadingMore] = useState(false);
  const ext = getExtendedData(restaurant);
  const galleryImages = [
    restaurant.image,
    "https://images.unsplash.com/photo-1552566626-52f8b828add9?w=1200&h=800&fit=crop",
    "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1200&h=800&fit=crop",
    "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1200&h=800&fit=crop",
  ];
  const [heroIdx, setHeroIdx] = useState(0);
  const heroRef = useRef<HTMLDivElement>(null);
  const onHeroScroll = () => {
    const el = heroRef.current;
    if (!el) return;
    const idx = Math.round(el.scrollLeft / el.clientWidth);
    if (idx !== heroIdx) setHeroIdx(idx);
  };

  useEffect(() => {
    const el = heroRef.current;
    if (!el) return;
    let isDown = false;
    let startX = 0;
    let scrollLeft = 0;
    const onDown = (e: MouseEvent) => {
      isDown = true;
      el.style.cursor = "grabbing";
      startX = e.pageX - el.offsetLeft;
      scrollLeft = el.scrollLeft;
    };
    const endDrag = () => {
      if (!isDown) return;
      isDown = false;
      el.style.cursor = "grab";
      const idx = Math.round(el.scrollLeft / el.clientWidth);
      el.scrollTo({ left: idx * el.clientWidth, behavior: "smooth" });
    };
    const onMove = (e: MouseEvent) => {
      if (!isDown) return;
      e.preventDefault();
      el.scrollLeft = scrollLeft - (e.pageX - el.offsetLeft - startX);
    };
    el.style.cursor = "grab";
    el.addEventListener("mousedown", onDown);
    el.addEventListener("mouseleave", endDrag);
    el.addEventListener("mouseup", endDrag);
    el.addEventListener("mousemove", onMove);
    return () => {
      el.removeEventListener("mousedown", onDown);
      el.removeEventListener("mouseleave", endDrag);
      el.removeEventListener("mouseup", endDrag);
      el.removeEventListener("mousemove", onMove);
    };
  }, []);

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

  const allReviews = [...userReviews, ...REVIEW_DATA];
  const visibleReviews = allReviews.slice(0, visibleCount);
  const hasMoreReviews = allReviews.length > visibleCount;

  const loadMoreReviews = () => {
    if (loadingMore) return;
    setLoadingMore(true);
    setTimeout(() => {
      setVisibleCount((c) => Math.min(c + REVIEWS_PAGE, allReviews.length));
      setLoadingMore(false);
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-[200] bg-background flex flex-col">
      {/* Hero Image Carousel */}
      <div className="relative h-56 sm:h-64 shrink-0 overflow-hidden select-none">
        <div
          ref={heroRef}
          onScroll={onHeroScroll}
          className="flex h-full w-full overflow-x-auto overflow-y-hidden snap-x snap-mandatory scrollbar-hide"
          style={{ scrollSnapType: "x mandatory" }}
          onDragStart={(e) => e.preventDefault()}
        >
          {galleryImages.map((src, i) => (
            <div key={i} className="w-full h-full shrink-0 snap-center relative pointer-events-none">
              <ImageWithFallback src={src} alt={`${restaurant.name} ${i + 1}`} className="w-full h-full object-cover" />
            </div>
          ))}
        </div>
        <Ribbon position="bottom-right" variant="diagonal" size="lg" color={pickRibbonLabel(restaurant.id) === "Sale" ? "destructive" : "primary"}>{pickRibbonLabel(restaurant.id)}</Ribbon>
        <style>{`.hero-ribbon > div > div { padding: 6px 56px !important; font-size: 0.875rem !important; letter-spacing: 0.08em !important; line-height: 1.3 !important; }`}</style>
        <div className="absolute bottom-3 left-0 right-0 flex items-center justify-center gap-1.5 pointer-events-none">
          {galleryImages.map((_, i) => (
            <span key={i} className={`h-1.5 rounded-full transition-all ${i === heroIdx ? "w-5 bg-white" : "w-1.5 bg-white/70"} shadow`} />
          ))}
        </div>
        <button onClick={onBack} className="absolute top-4 left-4 w-10 h-10 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center cursor-pointer hover:bg-black/60 transition z-10">
          <ArrowLeft className="w-5 h-5 text-white" />
        </button>
        <div className="absolute top-4 right-4 flex items-center gap-2 z-10">
          {onSave && (
            <button onClick={() => onSave(restaurant)} className="w-10 h-10 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center cursor-pointer hover:bg-black/60 transition">
              <Heart className={`w-5 h-5 ${isSaved ? "fill-red-500 text-red-500" : "text-white"}`} />
            </button>
          )}
        </div>
      </div>

      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto pb-24">
        {/* Restaurant info (below image for accessibility) */}
        <div className="px-5 pt-4 pb-3 border-b border-border">
          <h1 className="text-[1.5rem]" style={{ fontWeight: 700 }}>{restaurant.name}</h1>
          <p className="text-[0.8125rem] text-muted-foreground mt-1">{ext.description}</p>
          <div className="flex items-center gap-2 mt-2 flex-wrap">
            <span className="px-2.5 py-0.5 rounded-full bg-secondary text-foreground text-[0.75rem]" style={{ fontWeight: 500 }}>{restaurant.price} · {restaurant.cuisine}</span>
            <span className={`px-2.5 py-0.5 rounded-full text-[0.75rem] flex items-center gap-1 ${restaurant.open ? "bg-success/15 text-success" : "bg-destructive/15 text-destructive"}`} style={{ fontWeight: 500 }}>
              <span className={`w-1.5 h-1.5 rounded-full ${restaurant.open ? "bg-success" : "bg-destructive"}`} />
              {restaurant.open ? `Open · Closes at ${ext.closesAt}` : "Closed"}
            </span>
          </div>
        </div>
        {/* Quick stats */}
        <div className="flex items-center gap-4 px-5 py-3 border-b border-border text-[0.8125rem]">
          <span className="flex items-center gap-1"><Star className="w-4 h-4 fill-warning text-warning" /><span style={{ fontWeight: 600 }}>{fmtR(restaurant.rating)}</span><span className="text-muted-foreground">({restaurant.reviews.toLocaleString()})</span></span>
          <span className="w-px h-4 bg-border" />
          <span className="flex items-center gap-1 text-muted-foreground"><Clock className="w-3.5 h-3.5" /> {ext.deliveryTime}</span>
          <span className="w-px h-4 bg-border" />
          <span className="flex items-center gap-1 text-muted-foreground"><MapPin className="w-3.5 h-3.5" /> {restaurant.distance}</span>
        </div>

        {/* Action buttons */}
        <div className="grid grid-cols-3 gap-2 px-5 py-4">
          <ActionBtn icon={<Navigation className="w-5 h-5" />} label="Directions" onClick={() => onDirections?.(restaurant)} />
          <ActionBtn icon={<CalendarDays className="w-5 h-5" />} label="Reserve" onClick={() => onBookTable(restaurant)} />
          <ActionBtn icon={<UtensilsCrossed className="w-5 h-5" />} label="Menu" />
        </div>

        {/* Tabs */}
        <Tabs defaultValue="about" variant="boxed" size="md">
          <div className="sticky top-0 z-30 bg-background px-5 pt-2 pb-1 border-b border-border">
            <TabList className="w-full">
              <TabTrigger value="about" className="flex-1 justify-center">About</TabTrigger>
              <TabTrigger value="menu" className="flex-1 justify-center">Menu</TabTrigger>
              <TabTrigger value="reviews" className="flex-1 justify-center">Reviews</TabTrigger>
            </TabList>
          </div>

          {/* Menu Tab */}
          <TabPanel value="menu" className="px-5 pt-4">
            <div className="flex items-center gap-2 mb-4"><h3 className="text-[1rem]" style={{ fontWeight: 600 }}>Menu</h3></div>
            {Object.entries(MENU_DATA).map(([category, items]) => (
              <div key={category} className="mb-5">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-[1rem]">{category === "Appetizers" ? "A" : category === "Main Course" ? "M" : "D"}</span>
                  <h4 className="text-[0.9375rem]" style={{ fontWeight: 600 }}>{category}</h4>
                </div>
                <div className="space-y-3">
                  {items.map((item) => (
                    <div key={item.name} role="button" tabIndex={0} onClick={() => setSelectedMenuItem({ ...item, category })} onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") setSelectedMenuItem({ ...item, category }); }} className="w-full flex items-start gap-3 p-3 rounded-xl border border-border bg-card/50 cursor-pointer hover:bg-secondary/30 active:bg-secondary/50 transition text-left">
                      <div className="flex-1 min-w-0">
                        <span className="text-[0.875rem]" style={{ fontWeight: 500 }}>{item.name}</span>
                        <p className="text-[0.75rem] text-muted-foreground mt-0.5 line-clamp-2">{item.desc}</p>
                        <p className="text-[0.875rem] mt-1" style={{ fontWeight: 600 }}>${item.price}</p>
                      </div>
                      <RibbonContainer className="w-20 h-20 rounded-xl shrink-0">
                        <ImageWithFallback src={MENU_IMAGES[item.name] || ""} alt={item.name} className="w-full h-full object-cover" />
                        {item.popular && <Ribbon position="top-left" variant="diagonal" size="sm" color={pickRibbonLabel(item.name) === "Sale" ? "destructive" : "primary"}>{pickRibbonLabel(item.name)}</Ribbon>}
                      </RibbonContainer>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </TabPanel>

          {/* About Tab */}
          <TabPanel value="about" className="px-5 pt-4">
            <div className="flex items-center gap-2 mb-4"><MapPin className="w-4 h-4 text-primary" /><h3 className="text-[1rem]" style={{ fontWeight: 600 }}>About</h3></div>
            <div className="p-4 rounded-xl border border-border bg-card/50 space-y-4">
              <p className="text-[0.8125rem] text-muted-foreground">{ext.description}</p>
              <InfoRow icon={<MapPin className="w-4 h-4 text-success" />} label="Address" value={ext.address} />
              <InfoRow icon={<Clock className="w-4 h-4 text-info" />} label="Hours" value={ext.hours} />
              <InfoRow icon={<Phone className="w-4 h-4 text-primary" />} label="Phone" value={ext.phone} />
            </div>
            <div className="flex flex-wrap gap-2 mt-4">
              {ext.tags.map((tag) => <span key={tag} className="px-3 py-1 rounded-full border border-border text-[0.75rem] text-muted-foreground">{tag}</span>)}
            </div>
            <div className="mt-6">
              <div className="flex items-center gap-2 mb-4"><Star className="w-5 h-5 fill-warning text-warning" /><h3 className="text-[1rem]" style={{ fontWeight: 600 }}>Reviews</h3></div>
              <RatingBreakdown rating={restaurant.rating} reviews={restaurant.reviews} />
            </div>
          </TabPanel>

          {/* Reviews Tab */}
          <TabPanel value="reviews" className="px-5 pt-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2"><Star className="w-5 h-5 fill-warning text-warning" /><h3 className="text-[1rem]" style={{ fontWeight: 600 }}>Reviews</h3></div>
            </div>
            <RatingBreakdown rating={restaurant.rating} reviews={restaurant.reviews} />
            <p className="text-[0.8125rem] text-muted-foreground mt-4 mb-3">Showing 1–{visibleReviews.length} of {restaurant.reviews.toLocaleString()} reviews</p>
            <div className="space-y-3">
              {visibleReviews.map((review, i) => <ReviewCard key={i} review={review} />)}
              {loadingMore && Array.from({ length: REVIEWS_PAGE }).map((_, i) => <ReviewCardSkeleton key={`sk-${i}`} />)}
            </div>
            {hasMoreReviews && !loadingMore && (
              <Button variant="outline" onClick={loadMoreReviews} className="w-full mt-4 gap-1.5 text-[0.8125rem]">
                <ChevronDown className="w-4 h-4" /> Show more reviews
              </Button>
            )}
            {!hasMoreReviews && visibleReviews.length > REVIEWS_INITIAL && (
              <p className="text-center text-[0.75rem] text-muted-foreground mt-4">You've reached the end · {visibleReviews.length} reviews</p>
            )}
          </TabPanel>
        </Tabs>
      </div>

      {/* Bottom CTA */}
      <div className="absolute bottom-0 left-0 right-0 bg-card/95 backdrop-blur-md border-t border-border px-5 py-3 z-10">
        <Button variant="primary" onClick={() => onBookTable(restaurant)} className="w-full gap-2"><CalendarDays className="w-4 h-4" /> Book a Table</Button>
      </div>

      {/* Food Detail Modal */}
      {selectedMenuItem && (
        <FoodDetailPage item={selectedMenuItem} restaurantName={restaurant.name} onBack={() => setSelectedMenuItem(null)} onSave={() => onSaveFood?.(selectedMenuItem.name)} isSaved={savedFoodNames.includes(selectedMenuItem.name)} />
      )}

    </div>
  );
}

function ActionBtn({ icon, label, onClick }: { icon: React.ReactNode; label: string; onClick?: () => void }) {
  return (
    <button onClick={onClick} className="flex flex-col items-center gap-1.5 py-3 rounded-xl bg-primary/10 hover:bg-primary/20 transition cursor-pointer">
      <span className="text-primary">{icon}</span>
      <span className="text-[0.75rem] text-primary" style={{ fontWeight: 500 }}>{label}</span>
    </button>
  );
}

function InfoRow({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-start gap-3">
      <span className="mt-0.5">{icon}</span>
      <div>
        <p className="text-[0.8125rem]" style={{ fontWeight: 500 }}>{label}</p>
        <p className="text-[0.8125rem] text-muted-foreground">{value}</p>
      </div>
    </div>
  );
}
/* Restaurants by Price — tabbed $ to $$$$ with infinite scroll */
import { useState, useRef, useCallback, useEffect } from "react";
import { Star, MapPin, ChevronRight } from "lucide-react";
import { ImageWithFallback } from "../../components/figma/ImageWithFallback";
import { Ribbon, RibbonContainer, pickRibbonLabel } from "../../components/ds/Ribbon";
import { CardSaveBtn } from "./SaveButtons";
import { fmtR } from "./discoverTypes";

const PRICE_TABS = [
  { label: "$", description: "Budget-friendly", color: "text-green-600", activeBg: "bg-green-500/15 border-green-500/40" },
  { label: "$$", description: "Moderate", color: "text-blue-600", activeBg: "bg-blue-500/15 border-blue-500/40" },
  { label: "$$$", description: "Upscale", color: "text-purple-600", activeBg: "bg-purple-500/15 border-purple-500/40" },
  { label: "$$$$", description: "Fine Dining", color: "text-amber-600", activeBg: "bg-amber-500/15 border-amber-500/40" },
] as const;

type PoolItem = {
  name: string; cuisine: string; rating: number; price: string;
  reviews: number; image: string; distance: string; tag: string;
};

const POOL: Record<string, PoolItem[]> = {
  "$": [
    { name: "Taco Libre", cuisine: "Mexican · Street Food", rating: 4.5, price: "$", reviews: 4521, image: "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=400&h=300&fit=crop", distance: "0.4 mi", tag: "Trending" },
    { name: "Pho Vietnam", cuisine: "Vietnamese · Noodle", rating: 4.3, price: "$", reviews: 3890, image: "https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?w=400&h=300&fit=crop", distance: "0.3 mi", tag: "Comfort" },
    { name: "Falafel Corner", cuisine: "Middle Eastern · Wraps", rating: 4.2, price: "$", reviews: 2100, image: "https://images.unsplash.com/photo-1529006557810-274b9b2fc783?w=400&h=300&fit=crop", distance: "0.6 mi", tag: "Quick Bite" },
    { name: "Dumpling House", cuisine: "Chinese · Dumplings", rating: 4.4, price: "$", reviews: 3200, image: "https://images.unsplash.com/photo-1563245372-f21724e3856d?w=400&h=300&fit=crop", distance: "0.5 mi", tag: "Local Gem" },
    { name: "Banh Mi Boys", cuisine: "Vietnamese · Sandwich", rating: 4.3, price: "$", reviews: 2780, image: "https://images.unsplash.com/photo-1455619452474-d2be8b1e70cd?w=400&h=300&fit=crop", distance: "0.7 mi", tag: "Fast" },
    { name: "Pizza Slice", cuisine: "Italian · Pizza", rating: 4.1, price: "$", reviews: 5100, image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&h=300&fit=crop", distance: "0.2 mi", tag: "Classic" },
    { name: "Curry Express", cuisine: "Indian · Curry", rating: 4.0, price: "$", reviews: 1890, image: "https://images.unsplash.com/photo-1596797038530-2c107229654b?w=400&h=300&fit=crop", distance: "0.8 mi", tag: "Spicy" },
    { name: "Noodle Bar", cuisine: "Chinese · Noodles", rating: 4.2, price: "$", reviews: 2450, image: "https://images.unsplash.com/photo-1525755662778-989d0524087e?w=400&h=300&fit=crop", distance: "0.4 mi", tag: "Hearty" },
  ],
  "$$": [
    { name: "Baan Thai", cuisine: "Thai · Curry", rating: 4.4, price: "$$", reviews: 2103, image: "https://images.unsplash.com/photo-1455619452474-d2be8b1e70cd?w=400&h=300&fit=crop", distance: "0.5 mi", tag: "Best Value" },
    { name: "Dragon Palace", cuisine: "Chinese · Dim Sum", rating: 4.3, price: "$$", reviews: 3210, image: "https://images.unsplash.com/photo-1563245372-f21724e3856d?w=400&h=300&fit=crop", distance: "0.6 mi", tag: "Family" },
    { name: "Seoul Garden", cuisine: "Korean · Banchan", rating: 4.7, price: "$$", reviews: 2678, image: "https://images.unsplash.com/photo-1498654896293-37aacf113fd9?w=400&h=300&fit=crop", distance: "0.2 mi", tag: "Local Gem" },
    { name: "The Smokehouse", cuisine: "American · BBQ", rating: 4.6, price: "$$", reviews: 2145, image: "https://images.unsplash.com/photo-1529006557810-274b9b2fc783?w=400&h=300&fit=crop", distance: "1.1 mi", tag: "Smoky" },
    { name: "Brunch & Co.", cuisine: "Brunch · Café", rating: 4.3, price: "$$", reviews: 2567, image: "https://images.unsplash.com/photo-1495214783159-3503fd1b572d?w=400&h=300&fit=crop", distance: "0.4 mi", tag: "Weekend" },
    { name: "Masala House", cuisine: "Indian · Curry", rating: 4.7, price: "$$", reviews: 1543, image: "https://images.unsplash.com/photo-1596797038530-2c107229654b?w=400&h=300&fit=crop", distance: "0.9 mi", tag: "Aromatic" },
    { name: "Wok Master", cuisine: "Chinese · Szechuan", rating: 4.5, price: "$$", reviews: 1987, image: "https://images.unsplash.com/photo-1525755662778-989d0524087e?w=400&h=300&fit=crop", distance: "0.6 mi", tag: "Fiery" },
    { name: "Verde Garden", cuisine: "Vegan · Organic", rating: 4.4, price: "$$", reviews: 1234, image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&h=300&fit=crop", distance: "0.5 mi", tag: "Plant-based" },
  ],
  "$$$": [
    { name: "Mapo Galmaegi", cuisine: "Korean · BBQ", rating: 4.7, price: "$$$", reviews: 1842, image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&h=300&fit=crop", distance: "0.3 mi", tag: "Popular" },
    { name: "Le Petit Bistro", cuisine: "French · Bistro", rating: 4.5, price: "$$$", reviews: 789, image: "https://images.unsplash.com/photo-1466978913421-dad2ebd01d17?w=400&h=300&fit=crop", distance: "1.0 mi", tag: "Romantic" },
    { name: "Aegean Sea", cuisine: "Greek · Mediterranean", rating: 4.4, price: "$$$", reviews: 892, image: "https://images.unsplash.com/photo-1544025162-d76694265947?w=400&h=300&fit=crop", distance: "1.5 mi", tag: "Healthy" },
    { name: "Harbor Fish", cuisine: "Seafood · Grill", rating: 4.6, price: "$$$", reviews: 876, image: "https://images.unsplash.com/photo-1559737558-2f5a35f4523b?w=400&h=300&fit=crop", distance: "1.3 mi", tag: "Fresh Catch" },
    { name: "Pasta Fresca", cuisine: "Italian · Fresh Pasta", rating: 4.5, price: "$$$", reviews: 1034, image: "https://images.unsplash.com/photo-1473093295043-cdd812d0e601?w=400&h=300&fit=crop", distance: "0.7 mi", tag: "Handmade" },
    { name: "Sakura Tempura", cuisine: "Japanese · Tempura", rating: 4.4, price: "$$$", reviews: 678, image: "https://images.unsplash.com/photo-1515669097368-22e68427d265?w=400&h=300&fit=crop", distance: "0.8 mi", tag: "Crispy" },
    { name: "Tuscan Table", cuisine: "Italian · Rustic", rating: 4.6, price: "$$$", reviews: 920, image: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400&h=300&fit=crop", distance: "1.2 mi", tag: "Cozy" },
    { name: "Spice Route", cuisine: "Indian · Fine Casual", rating: 4.5, price: "$$$", reviews: 1100, image: "https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400&h=300&fit=crop", distance: "0.9 mi", tag: "Vibrant" },
  ],
  "$$$$": [
    { name: "Osteria Bella", cuisine: "Italian · Pasta", rating: 4.6, price: "$$$$", reviews: 923, image: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400&h=300&fit=crop", distance: "0.8 mi", tag: "Michelin" },
    { name: "Sushi Kaze", cuisine: "Japanese · Omakase", rating: 4.9, price: "$$$$", reviews: 567, image: "https://images.unsplash.com/photo-1553621042-f6e147245754?w=400&h=300&fit=crop", distance: "1.2 mi", tag: "Top Rated" },
    { name: "Chez Marcel", cuisine: "French · Fine Dining", rating: 4.8, price: "$$$$", reviews: 412, image: "https://images.unsplash.com/photo-1559339352-11d035aa65de?w=400&h=300&fit=crop", distance: "2.0 mi", tag: "Splurge" },
    { name: "Nobu Garden", cuisine: "Japanese · Fusion", rating: 4.7, price: "$$$$", reviews: 645, image: "https://images.unsplash.com/photo-1515669097368-22e68427d265?w=400&h=300&fit=crop", distance: "1.8 mi", tag: "Exclusive" },
    { name: "The Capital Grill", cuisine: "American · Steakhouse", rating: 4.7, price: "$$$$", reviews: 1320, image: "https://images.unsplash.com/photo-1544025162-d76694265947?w=400&h=300&fit=crop", distance: "1.5 mi", tag: "Premium" },
    { name: "Azure Rooftop", cuisine: "Modern · Tasting Menu", rating: 4.8, price: "$$$$", reviews: 389, image: "https://images.unsplash.com/photo-1466978913421-dad2ebd01d17?w=400&h=300&fit=crop", distance: "2.2 mi", tag: "Views" },
    { name: "La Maison", cuisine: "French · Haute Cuisine", rating: 4.9, price: "$$$$", reviews: 298, image: "https://images.unsplash.com/photo-1559339352-11d035aa65de?w=400&h=300&fit=crop", distance: "1.6 mi", tag: "Legendary" },
    { name: "Koi Palace", cuisine: "Japanese · Kaiseki", rating: 4.8, price: "$$$$", reviews: 510, image: "https://images.unsplash.com/photo-1553621042-f6e147245754?w=400&h=300&fit=crop", distance: "2.5 mi", tag: "Artful" },
  ],
};

const BATCH_SIZE = 6;

function generateBatch(price: string, page: number) {
  const pool = POOL[price] || [];
  if (pool.length === 0) return [];
  const items = [];
  for (let i = 0; i < BATCH_SIZE; i++) {
    const idx = (page * BATCH_SIZE + i) % pool.length;
    const base = pool[idx];
    items.push({
      ...base,
      id: `price-${price}-${page}-${i}`,
      rating: Math.round((base.rating + (Math.random() * 0.4 - 0.2)) * 10) / 10,
      reviews: base.reviews + Math.floor(Math.random() * 200),
      distance: `${(parseFloat(base.distance) + Math.random() * 0.5).toFixed(1)} mi`,
    });
  }
  return items;
}

function SkeletonCard() {
  return (
    <div className="flex items-center gap-3 p-3 rounded-2xl border border-border bg-card animate-pulse">
      <div className="w-20 h-20 rounded-xl bg-secondary shrink-0" />
      <div className="flex-1 min-w-0 space-y-2">
        <div className="h-4 bg-secondary rounded-md w-3/5" />
        <div className="h-3 bg-secondary rounded-md w-2/5" />
        <div className="flex gap-3">
          <div className="h-3 bg-secondary rounded-md w-12" />
          <div className="h-3 bg-secondary rounded-md w-16" />
        </div>
      </div>
      <div className="w-4 h-4 bg-secondary rounded-full shrink-0" />
    </div>
  );
}

export function RestaurantsByPrice({
  onSelectRestaurant,
  onSaveRestaurant,
  isRestaurantSaved,
}: {
  onSelectRestaurant: (r: any) => void;
  onSaveRestaurant?: (r: any) => void;
  isRestaurantSaved?: (id: string) => boolean;
}) {
  const [activeTab, setActiveTab] = useState("$");
  const [itemsByPrice, setItemsByPrice] = useState<Record<string, ReturnType<typeof generateBatch>>>({
    "$": [], "$$": [], "$$$": [], "$$$$": [],
  });
  const [loading, setLoading] = useState(false);
  const [initialLoad, setInitialLoad] = useState<Record<string, boolean>>({
    "$": true, "$$": true, "$$$": true, "$$$$": true,
  });
  const pageRefs = useRef<Record<string, number>>({ "$": 0, "$$": 0, "$$$": 0, "$$$$": 0 });
  const sentinelRef = useRef<HTMLDivElement>(null);

  const loadMore = useCallback(() => {
    setLoading(true);
    const currentPage = pageRefs.current[activeTab];
    const isFirst = initialLoad[activeTab];
    setTimeout(() => {
      setItemsByPrice((prev) => ({
        ...prev,
        [activeTab]: [...prev[activeTab], ...generateBatch(activeTab, currentPage)],
      }));
      pageRefs.current[activeTab] += 1;
      setLoading(false);
      if (isFirst) setInitialLoad((prev) => ({ ...prev, [activeTab]: false }));
    }, isFirst ? 600 : 800);
  }, [activeTab, initialLoad]);

  // Load first batch when tab changes if empty
  useEffect(() => {
    if (itemsByPrice[activeTab].length === 0) loadMore();
  }, [activeTab]);

  // Infinite scroll observer
  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !loading) loadMore();
      },
      { rootMargin: "200px" },
    );
    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [loading, loadMore]);

  const items = itemsByPrice[activeTab];
  const currentTabInfo = PRICE_TABS.find((t) => t.label === activeTab)!;

  return (
    <div className="mt-8 pb-6">
      {/* Sticky header with tabs */}
      <div className="sticky top-0 z-20 bg-background/95 backdrop-blur-md -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 py-3 border-b border-border/50">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <h3 className="text-[1rem]" style={{ fontWeight: 700 }}>
              Restaurants by Price
            </h3>
          </div>
          {items.length > 0 && (
            <span className="text-[0.75rem] text-muted-foreground">
              {items.length}+ places
            </span>
          )}
        </div>
        {/* Price tabs */}
        <div className="flex">
          {PRICE_TABS.map((tab) => {
            const isActive = activeTab === tab.label;
            return (
              <button
                key={tab.label}
                onClick={() => setActiveTab(tab.label)}
                className={`flex-1 pb-2.5 text-center cursor-pointer relative transition-colors ${
                  isActive ? "text-foreground" : "text-muted-foreground hover:text-foreground/70"
                }`}
              >
                <span
                  className="text-[0.9375rem] tracking-wide"
                  style={{ fontWeight: isActive ? 700 : 500 }}
                >
                  {tab.label}
                </span>
                {isActive && (
                  <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-10 h-[2.5px] bg-foreground rounded-full" />
                )}
              </button>
            );
          })}
          <div className="absolute bottom-0 left-0 right-0 h-px bg-border" />
        </div>
      </div>

      {/* Restaurant list */}
      <div className="space-y-3 mt-4">
        {items.map((r) => (
          <div
            key={r.id}
            onClick={() => onSelectRestaurant(r)}
            className="flex items-center gap-3 p-3 rounded-2xl border border-border bg-card hover:bg-secondary/30 transition cursor-pointer group"
          >
            <RibbonContainer className="w-20 h-20 rounded-xl shrink-0">
              <ImageWithFallback
                src={r.image}
                alt={r.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <Ribbon position="top-left" variant="diagonal" size="sm" color={pickRibbonLabel(r.id) === "Sale" ? "destructive" : "primary"}>{pickRibbonLabel(r.id)}</Ribbon>
            </RibbonContainer>
            <div className="flex-1 min-w-0">
              <p className="text-[0.875rem] truncate" style={{ fontWeight: 600 }}>
                {r.name}
              </p>
              <p className="text-[0.75rem] text-muted-foreground mt-0.5">
                {r.cuisine} · {r.price}
              </p>
              <div className="flex items-center gap-3 mt-1 text-[0.75rem]">
                <span className="flex items-center gap-1 text-warning">
                  <Star className="w-3 h-3 fill-current" /> {fmtR(r.rating)}
                </span>
                <span className="text-muted-foreground">
                  ({r.reviews.toLocaleString()})
                </span>
                <span className="text-muted-foreground flex items-center gap-0.5">
                  <MapPin className="w-3 h-3" /> {r.distance}
                </span>
              </div>
            </div>
            {onSaveRestaurant ? (
              <CardSaveBtn
                id={r.id}
                restaurant={{
                  id: r.id, name: r.name, cuisine: r.cuisine.split("·")[0].trim(),
                  emoji: "", rating: r.rating, reviews: r.reviews, price: r.price,
                  lng: -122.42, lat: 37.78, open: true, distance: r.distance, image: r.image,
                }}
                onToggle={onSaveRestaurant}
                variant="inline"
              />
            ) : (
              <ChevronRight className="w-4 h-4 text-muted-foreground shrink-0" />
            )}
          </div>
        ))}
        {loading && (
          <>
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
          </>
        )}
      </div>
      <div ref={sentinelRef} className="h-1" />
    </div>
  );
}
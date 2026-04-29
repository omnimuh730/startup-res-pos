/* Recommended For You - infinite scroll with skeleton loaders */
import {
  useState,
  useRef,
  useCallback,
  useEffect,
} from "react";
import { Star, MapPin, ChevronRight } from "lucide-react";
import { ImageWithFallback } from "../../components/figma/ImageWithFallback";
import { Ribbon, RibbonContainer, pickRibbonLabel } from "../../components/ds/Ribbon";
import { CardSaveBtn } from "./SaveButtons";
import { fmtR } from "./discoverTypes";

const REC_POOL = [
  {
    name: "Mapo Galmaegi",
    cuisine: "Korean \u00b7 BBQ",
    rating: 4.7,
    price: "$$$",
    reviews: 1842,
    image:
      "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&h=300&fit=crop",
    distance: "0.3 mi",
    tag: "Popular",
  },
  {
    name: "Osteria Bella",
    cuisine: "Italian \u00b7 Pasta",
    rating: 4.6,
    price: "$$$$",
    reviews: 923,
    image:
      "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400&h=300&fit=crop",
    distance: "0.8 mi",
    tag: "Michelin",
  },
  {
    name: "Sushi Kaze",
    cuisine: "Japanese \u00b7 Omakase",
    rating: 4.9,
    price: "$$$$",
    reviews: 567,
    image:
      "https://images.unsplash.com/photo-1553621042-f6e147245754?w=400&h=300&fit=crop",
    distance: "1.2 mi",
    tag: "Top Rated",
  },
  {
    name: "Baan Thai",
    cuisine: "Thai \u00b7 Curry",
    rating: 4.4,
    price: "$$",
    reviews: 2103,
    image:
      "https://images.unsplash.com/photo-1455619452474-d2be8b1e70cd?w=400&h=300&fit=crop",
    distance: "0.5 mi",
    tag: "Best Value",
  },
  {
    name: "Le Petit Bistro",
    cuisine: "French \u00b7 Bistro",
    rating: 4.5,
    price: "$$$",
    reviews: 789,
    image:
      "https://images.unsplash.com/photo-1466978913421-dad2ebd01d17?w=400&h=300&fit=crop",
    distance: "1.0 mi",
    tag: "Romantic",
  },
  {
    name: "Dragon Palace",
    cuisine: "Chinese \u00b7 Dim Sum",
    rating: 4.3,
    price: "$$",
    reviews: 3210,
    image:
      "https://images.unsplash.com/photo-1563245372-f21724e3856d?w=400&h=300&fit=crop",
    distance: "0.6 mi",
    tag: "Family",
  },
  {
    name: "Taco Libre",
    cuisine: "Mexican \u00b7 Street Food",
    rating: 4.5,
    price: "$",
    reviews: 4521,
    image:
      "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=400&h=300&fit=crop",
    distance: "0.4 mi",
    tag: "Trending",
  },
  {
    name: "Naan & Kabob",
    cuisine: "Indian \u00b7 Tandoor",
    rating: 4.6,
    price: "$$",
    reviews: 1456,
    image:
      "https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400&h=300&fit=crop",
    distance: "0.9 mi",
    tag: "Spicy",
  },
  {
    name: "Aegean Sea",
    cuisine: "Greek \u00b7 Mediterranean",
    rating: 4.4,
    price: "$$$",
    reviews: 892,
    image:
      "https://images.unsplash.com/photo-1544025162-d76694265947?w=400&h=300&fit=crop",
    distance: "1.5 mi",
    tag: "Healthy",
  },
  {
    name: "Seoul Garden",
    cuisine: "Korean \u00b7 Banchan",
    rating: 4.7,
    price: "$$",
    reviews: 2678,
    image:
      "https://images.unsplash.com/photo-1498654896293-37aacf113fd9?w=400&h=300&fit=crop",
    distance: "0.2 mi",
    tag: "Local Gem",
  },
  {
    name: "Pasta Fresca",
    cuisine: "Italian \u00b7 Fresh Pasta",
    rating: 4.5,
    price: "$$$",
    reviews: 1034,
    image:
      "https://images.unsplash.com/photo-1473093295043-cdd812d0e601?w=400&h=300&fit=crop",
    distance: "0.7 mi",
    tag: "Handmade",
  },
  {
    name: "Pho Vietnam",
    cuisine: "Vietnamese \u00b7 Noodle",
    rating: 4.3,
    price: "$",
    reviews: 3890,
    image:
      "https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?w=400&h=300&fit=crop",
    distance: "0.3 mi",
    tag: "Comfort",
  },
  {
    name: "The Smokehouse",
    cuisine: "American \u00b7 BBQ",
    rating: 4.6,
    price: "$$",
    reviews: 2145,
    image:
      "https://images.unsplash.com/photo-1529006557810-274b9b2fc783?w=400&h=300&fit=crop",
    distance: "1.1 mi",
    tag: "Smoky",
  },
  {
    name: "Sakura Tempura",
    cuisine: "Japanese \u00b7 Tempura",
    rating: 4.4,
    price: "$$$",
    reviews: 678,
    image:
      "https://images.unsplash.com/photo-1515669097368-22e68427d265?w=400&h=300&fit=crop",
    distance: "0.8 mi",
    tag: "Crispy",
  },
  {
    name: "Chez Marcel",
    cuisine: "French \u00b7 Fine Dining",
    rating: 4.8,
    price: "$$$$",
    reviews: 412,
    image:
      "https://images.unsplash.com/photo-1559339352-11d035aa65de?w=400&h=300&fit=crop",
    distance: "2.0 mi",
    tag: "Splurge",
  },
  {
    name: "Wok Master",
    cuisine: "Chinese \u00b7 Szechuan",
    rating: 4.5,
    price: "$$",
    reviews: 1987,
    image:
      "https://images.unsplash.com/photo-1525755662778-989d0524087e?w=400&h=300&fit=crop",
    distance: "0.6 mi",
    tag: "Fiery",
  },
  {
    name: "Brunch & Co.",
    cuisine: "Brunch \u00b7 Caf\u00e9",
    rating: 4.3,
    price: "$$",
    reviews: 2567,
    image:
      "https://images.unsplash.com/photo-1495214783159-3503fd1b572d?w=400&h=300&fit=crop",
    distance: "0.4 mi",
    tag: "Weekend",
  },
  {
    name: "Masala House",
    cuisine: "Indian \u00b7 Curry",
    rating: 4.7,
    price: "$$",
    reviews: 1543,
    image:
      "https://images.unsplash.com/photo-1596797038530-2c107229654b?w=400&h=300&fit=crop",
    distance: "0.9 mi",
    tag: "Aromatic",
  },
  {
    name: "Harbor Fish",
    cuisine: "Seafood \u00b7 Grill",
    rating: 4.6,
    price: "$$$",
    reviews: 876,
    image:
      "https://images.unsplash.com/photo-1559737558-2f5a35f4523b?w=400&h=300&fit=crop",
    distance: "1.3 mi",
    tag: "Fresh Catch",
  },
  {
    name: "Verde Garden",
    cuisine: "Vegan \u00b7 Organic",
    rating: 4.4,
    price: "$$",
    reviews: 1234,
    image:
      "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&h=300&fit=crop",
    distance: "0.5 mi",
    tag: "Plant-based",
  },
];

const BATCH_SIZE = 6;

function generateBatch(page: number) {
  const items = [];
  for (let i = 0; i < BATCH_SIZE; i++) {
    const idx = (page * BATCH_SIZE + i) % REC_POOL.length;
    const base = REC_POOL[idx];
    items.push({
      ...base,
      id: `rec-${page}-${i}`,
      rating:
        Math.round(
          (base.rating + (Math.random() * 0.4 - 0.2)) * 10,
        ) / 10,
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

export function RecommendedForYou({
  onSelectRestaurant,
  onSaveRestaurant,
  isRestaurantSaved,
}: {
  onSelectRestaurant: (r: any) => void;
  onSaveRestaurant?: (r: any) => void;
  isRestaurantSaved?: (id: string) => boolean;
}) {
  const [items, setItems] = useState<
    ReturnType<typeof generateBatch>
  >([]);
  const [loading, setLoading] = useState(false);
  const [initialLoad, setInitialLoad] = useState(true);
  const sentinelRef = useRef<HTMLDivElement>(null);
  const pageRef = useRef(0);

  const loadMore = useCallback(() => {
    setLoading(true);
    const currentPage = pageRef.current;
    setTimeout(
      () => {
        setItems((prev) => [
          ...prev,
          ...generateBatch(currentPage),
        ]);
        pageRef.current += 1;
        setLoading(false);
        setInitialLoad(false);
      },
      initialLoad ? 600 : 800,
    );
  }, [initialLoad]);

  useEffect(() => {
    loadMore();
  }, []);

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

  return (
    <div className="mt-8 pb-6">
      <div className="sticky top-0 z-20 bg-background/95 backdrop-blur-md -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 py-3 border-b border-border/50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h3
              className="text-[1rem]"
              style={{ fontWeight: 700 }}
            >
              Recommended for You
            </h3>
            <span className="text-[0.6875rem] text-muted-foreground bg-secondary px-2 py-0.5 rounded-full">
              Personalized
            </span>
          </div>
          {items.length > 0 && (
            <span className="text-[0.75rem] text-muted-foreground">
              {items.length}+ places
            </span>
          )}
        </div>
      </div>
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
              <p
                className="text-[0.875rem] truncate"
                style={{ fontWeight: 600 }}
              >
                {r.name}
              </p>
              <p className="text-[0.75rem] text-muted-foreground mt-0.5">
                {r.cuisine} · {r.price}
              </p>
              <div className="flex items-center gap-3 mt-1 text-[0.75rem]">
                <span className="flex items-center gap-1 text-warning">
                  <Star className="w-3 h-3 fill-current" />{" "}
                  {fmtR(r.rating)}
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
                restaurant={r as any}
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
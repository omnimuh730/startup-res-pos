/* Saved Items View (2 tabs: Foods / Restaurants) */
import { useState } from "react";
import { ArrowLeft, Heart, Star } from "lucide-react";
import { ImageWithFallback } from "../../components/figma/ImageWithFallback";
import { useSavedVersion } from "./savedStore";
import { fmtR } from "./discoverTypes";
import type { SearchResultFood } from "./discoverTypes";
import type { RestaurantData } from "../detail/RestaurantDetailView";

export function SavedListView({ savedRestaurantsRef, savedFoodsRef, onBack, onSelectRestaurant, onSelectFood, onRemoveRestaurant, onRemoveFood }: {
  savedRestaurantsRef: React.RefObject<RestaurantData[]>;
  savedFoodsRef: React.RefObject<SearchResultFood[]>;
  onBack: () => void;
  onSelectRestaurant: (r: RestaurantData) => void;
  onSelectFood: (f: SearchResultFood) => void;
  onRemoveRestaurant: (r: RestaurantData) => void;
  onRemoveFood: (f: SearchResultFood) => void;
}) {
  useSavedVersion();
  const savedRestaurants = savedRestaurantsRef.current || [];
  const savedFoods = savedFoodsRef.current || [];
  const [tab, setTab] = useState<"restaurants" | "foods">("restaurants");

  return (
    <div className="min-h-[calc(100vh-120px)]">
      <div className="flex items-center gap-3 mb-4">
        <button onClick={onBack} className="p-1.5 hover:bg-secondary rounded-full transition cursor-pointer shrink-0">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h2 className="text-[1.125rem]" style={{ fontWeight: 700 }}>Saved</h2>
      </div>

      <div className="flex mb-4 rounded-xl bg-secondary p-1 gap-1">
        <button onClick={() => setTab("restaurants")}
          className={`flex-1 py-2.5 rounded-lg text-[0.8125rem] transition cursor-pointer ${tab === "restaurants" ? "bg-card shadow-sm text-foreground" : "text-muted-foreground"}`}
          style={{ fontWeight: tab === "restaurants" ? 600 : 400 }}>
          Restaurants ({savedRestaurants.length})
        </button>
        <button onClick={() => setTab("foods")}
          className={`flex-1 py-2.5 rounded-lg text-[0.8125rem] transition cursor-pointer ${tab === "foods" ? "bg-card shadow-sm text-foreground" : "text-muted-foreground"}`}
          style={{ fontWeight: tab === "foods" ? 600 : 400 }}>
          Foods ({savedFoods.length})
        </button>
      </div>

      {tab === "restaurants" && (
        <div className="space-y-3">
          {savedRestaurants.length === 0 && (
            <div className="text-center py-16">
              <Heart className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
              <p className="text-muted-foreground text-[0.875rem]">No saved restaurants yet</p>
              <p className="text-muted-foreground/60 text-[0.75rem] mt-1">Tap the bookmark icon on any restaurant to save it</p>
            </div>
          )}
          {savedRestaurants.map((r) => (
            <div key={r.id} className="flex items-center gap-3 p-3 rounded-2xl border border-border bg-card hover:bg-secondary/30 transition cursor-pointer group">
              <button onClick={() => onSelectRestaurant(r)} className="flex items-center gap-3 flex-1 min-w-0 text-left cursor-pointer">
                <div className="w-20 h-20 rounded-xl overflow-hidden shrink-0">
                  <ImageWithFallback src={r.image} alt={r.name} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[0.875rem] truncate" style={{ fontWeight: 600 }}>{r.name}</p>
                  <p className="text-[0.75rem] text-muted-foreground mt-0.5">{r.cuisine} · {r.price}</p>
                  <div className="flex items-center gap-3 mt-1 text-[0.75rem]">
                    <span className="flex items-center gap-1 text-warning"><Star className="w-3 h-3 fill-current" /> {fmtR(r.rating)}</span>
                    <span className="text-muted-foreground">({r.reviews.toLocaleString()})</span>
                  </div>
                </div>
              </button>
              <button onClick={() => onRemoveRestaurant(r)} className="p-2 hover:bg-destructive/10 rounded-full transition cursor-pointer shrink-0" title="Remove">
                <Heart className="w-4 h-4 fill-red-500 text-red-500" />
              </button>
            </div>
          ))}
        </div>
      )}

      {tab === "foods" && (
        <div className="space-y-3">
          {savedFoods.length === 0 && (
            <div className="text-center py-16">
              <Heart className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
              <p className="text-muted-foreground text-[0.875rem]">No saved food categories yet</p>
              <p className="text-muted-foreground/60 text-[0.75rem] mt-1">Tap the bookmark icon on any food category to save it</p>
            </div>
          )}
          {savedFoods.map((f) => (
            <div key={f.id} className="flex items-center gap-3 p-3 rounded-2xl border border-border bg-card hover:bg-secondary/30 transition cursor-pointer group">
              <button onClick={() => onSelectFood(f)} className="flex items-center gap-3 flex-1 min-w-0 text-left cursor-pointer">
                {f.image && (
                  <div className="w-16 h-16 rounded-xl overflow-hidden shrink-0">
                    <ImageWithFallback src={f.image} alt={f.name} className="w-full h-full object-cover" />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-[0.875rem] truncate" style={{ fontWeight: 600 }}>{f.name}</p>
                  <p className="text-[0.75rem] text-muted-foreground mt-0.5">{f.count} restaurants</p>
                </div>
              </button>
              <button onClick={() => onRemoveFood(f)} className="p-2 hover:bg-destructive/10 rounded-full transition cursor-pointer shrink-0" title="Remove">
                <Heart className="w-4 h-4 fill-red-500 text-red-500" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

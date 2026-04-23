/* Generic Section List View (for "View All" / "More") */
import { ArrowLeft, Star, MapPin, ChevronRight } from "lucide-react";
import { ImageWithFallback } from "../../components/figma/ImageWithFallback";
import { CardSaveBtn } from "./SaveButtons";
import { fmtR } from "./discoverTypes";
import type { SectionItem } from "./discoverTypes";
import type { RestaurantData } from "../detail/RestaurantDetailView";

export function SectionListView({ title, items, onBack, onSelectRestaurant, onSaveRestaurant, isRestaurantSaved }: {
  title: string;
  items: SectionItem[];
  onBack: () => void;
  onSelectRestaurant: (r: RestaurantData) => void;
  onSaveRestaurant?: (r: RestaurantData) => void;
  isRestaurantSaved?: (id: string) => boolean;
}) {
  return (
    <div className="min-h-[calc(100vh-120px)]">
      <div className="flex items-center gap-3 mb-6">
        <button onClick={onBack} className="p-1.5 hover:bg-secondary rounded-full transition cursor-pointer shrink-0">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h2 className="text-[1.125rem]" style={{ fontWeight: 700 }}>{title}</h2>
          <p className="text-[0.75rem] text-muted-foreground">{items.length} restaurants</p>
        </div>
      </div>
      <div className="space-y-3">
        {items.map((r) => (
          <div
            key={r.id}
            onClick={() => onSelectRestaurant({
              id: r.id, name: r.name, cuisine: r.cuisine, emoji: "",
              rating: r.rating, reviews: r.reviews || 500, price: r.price || "$$$",
              lng: -122.42 + Math.random() * 0.03, lat: 37.78 + Math.random() * 0.03,
              open: true, distance: r.distance || "0.5 mi", image: r.image,
            })}
            className="w-full flex items-center gap-3 p-3 rounded-2xl border border-border bg-card hover:bg-secondary/30 transition cursor-pointer text-left"
          >
            <div className="relative w-20 h-20 rounded-xl overflow-hidden shrink-0">
              <ImageWithFallback src={r.image} alt={r.name} className="w-full h-full object-cover" />
              {r.tag && (
                <div className="absolute top-1.5 left-1.5">
                  <span className="bg-primary/90 text-primary-foreground text-[0.5625rem] px-1.5 py-0.5 rounded-full" style={{ fontWeight: 700 }}>{r.tag}</span>
                </div>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[0.875rem] truncate" style={{ fontWeight: 600 }}>{r.name}</p>
              <p className="text-[0.75rem] text-muted-foreground mt-0.5">{r.cuisine} · {r.price || "$$$"}</p>
              <div className="flex items-center gap-3 mt-1 text-[0.75rem]">
                <span className="flex items-center gap-1 text-warning">
                  <Star className="w-3 h-3 fill-current" /> {fmtR(r.rating)}
                </span>
                {r.reviews && <span className="text-muted-foreground">({r.reviews.toLocaleString()})</span>}
                {r.distance && (
                  <span className="text-muted-foreground flex items-center gap-0.5">
                    <MapPin className="w-3 h-3" /> {r.distance}
                  </span>
                )}
              </div>
            </div>
            {onSaveRestaurant ? (
              <CardSaveBtn id={r.id} restaurant={{ id: r.id, name: r.name, cuisine: r.cuisine, emoji: "", rating: r.rating, reviews: r.reviews || 500, price: r.price || "$$$", lng: -122.42, lat: 37.78, open: true, distance: r.distance || "0.5 mi", image: r.image }} onToggle={onSaveRestaurant} variant="inline" />
            ) : (
              <ChevronRight className="w-4 h-4 text-muted-foreground shrink-0" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
/* Location Results Page */
import { ArrowLeft, ChevronRight, MapPin, Star } from "lucide-react";
import { ImageWithFallback } from "../../components/figma/ImageWithFallback";
import { CardSaveBtn } from "./SaveButtons";
import { fmtR } from "./discoverTypes";
import type { SearchResultLocation } from "./discoverTypes";
import type { RestaurantData } from "../detail/RestaurantDetailView";
import { CITIES } from "./discoverData";
import { CITY_RESTAURANTS } from "./discoverRestaurantData";
import { ALL_SEARCH_DATA, searchResultToRestaurantData } from "./discoverSearchData";
import { AirbnbRestaurantListCard } from "./AirbnbRestaurantListCard";

export function LocationResultsView({ location, onBack, onSelectRestaurant, onSaveRestaurant, isRestaurantSaved }: {
  location: SearchResultLocation;
  onBack: () => void;
  onSelectRestaurant: (r: RestaurantData) => void;
  onSaveRestaurant?: (r: RestaurantData) => void;
  isRestaurantSaved?: (id: string) => boolean;
}) {
  const cityId = CITIES.find((c) => c.label === location.name)?.id;
  const cityPool = cityId ? CITY_RESTAURANTS[cityId] : null;

  const restaurants: RestaurantData[] = cityPool
    ? cityPool.map((r, i) => ({
        id: `${location.id}-${i}`, name: r.name, cuisine: r.cuisine, emoji: "",
        rating: r.rating, reviews: r.reviews, price: r.price,
        lng: -122.41 + Math.random() * 0.05, lat: 37.77 + Math.random() * 0.05,
        open: true, distance: `${(0.2 + Math.random() * 1.5).toFixed(1)} mi`, image: r.image,
      }))
    : ALL_SEARCH_DATA.restaurants.slice(0, 6).map((r) => ({
        ...searchResultToRestaurantData(r), id: `${location.id}-${r.id}`,
      }));

  const cityImage = CITIES.find((c) => c.label === location.name)?.image;

  return (
    <div className="min-h-[calc(100vh-120px)]">
      {cityImage ? (
        <div className="relative -mx-4 sm:-mx-6 lg:-mx-8 -mt-6 mb-5">
          <div className="relative h-48 sm:h-56 overflow-hidden">
            <ImageWithFallback src={cityImage} alt={location.name} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
            <button onClick={onBack} className="absolute top-4 left-4 p-1.5 bg-black/40 backdrop-blur-sm rounded-full hover:bg-black/60 transition cursor-pointer">
              <ArrowLeft className="w-5 h-5 text-white" />
            </button>
            <div className="absolute bottom-4 left-4 right-4">
              <h2 className="text-white text-[1.5rem]" style={{ fontWeight: 800 }}>{location.name}</h2>
              <p className="text-white/70 text-[0.8125rem] mt-0.5">{restaurants.length} restaurants</p>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex items-center gap-3 mb-6">
          <button onClick={onBack} className="p-1.5 hover:bg-secondary rounded-full transition cursor-pointer shrink-0">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h2 className="text-[1.125rem]" style={{ fontWeight: 700 }}>{location.name}</h2>
            <p className="text-[0.75rem] text-muted-foreground">{restaurants.length} restaurants</p>
          </div>
        </div>
      )}
      <div className="space-y-4">
        {restaurants.map((r, index) => (
          <AirbnbRestaurantListCard
            key={r.id}
            restaurant={r}
            onSelect={onSelectRestaurant}
            onSave={onSaveRestaurant}
            badge={index === 0 ? "Guest favorite" : index === 1 ? "Popular" : undefined}
            waitLabel={index % 3 === 0 ? "Tables tonight" : undefined}
          />
        ))}
        {false && restaurants.map((r) => (
          <div key={r.id} onClick={() => onSelectRestaurant(r)}
            className="w-full flex items-center gap-3 p-3 rounded-2xl border border-border bg-card hover:bg-secondary/30 transition cursor-pointer text-left">
            <div className="w-20 h-20 rounded-xl overflow-hidden shrink-0">
              <ImageWithFallback src={r.image} alt={r.name} className="w-full h-full object-cover" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[0.875rem] truncate" style={{ fontWeight: 600 }}>{r.name}</p>
              <p className="text-[0.75rem] text-muted-foreground mt-0.5">{r.cuisine} · {r.price}</p>
              <div className="flex items-center gap-3 mt-1 text-[0.75rem]">
                <span className="flex items-center gap-1 text-warning"><Star className="w-3 h-3 fill-current" /> {fmtR(r.rating)}</span>
                <span className="text-muted-foreground">({r.reviews.toLocaleString()})</span>
                <span className="text-muted-foreground flex items-center gap-0.5"><MapPin className="w-3 h-3" /> {r.distance}</span>
              </div>
            </div>
            {onSaveRestaurant ? (
              <CardSaveBtn id={r.id} restaurant={r} onToggle={onSaveRestaurant} variant="inline" />
            ) : (
              <ChevronRight className="w-4 h-4 text-muted-foreground shrink-0" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

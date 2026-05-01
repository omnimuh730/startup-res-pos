import { Heart, Star } from "lucide-react";
import { motion } from "motion/react";
import { ImageWithFallback } from "../../components/figma/ImageWithFallback";
import type { RestaurantData } from "../detail/RestaurantDetailView";
import { fmtR } from "./discoverTypes";
import { _savedRIds, useSavedVersion } from "./savedStore";

const DOT = "\u00b7";

export interface AirbnbRestaurantCardItem {
  id: string;
  name: string;
  cuisine: string;
  rating: number;
  image: string;
  area?: string;
  price?: string;
  reviews?: number;
  distance?: string;
  badge?: string;
  wait?: string;
}

export function AirbnbRestaurantCard({
  item,
  onSelect,
  onSave,
  className = "",
}: {
  item: AirbnbRestaurantCardItem;
  onSelect: (item: AirbnbRestaurantCardItem) => void;
  onSave: (restaurant: RestaurantData) => void;
  className?: string;
}) {
  useSavedVersion();
  const saved = _savedRIds.has(item.id);
  const restaurant = toRestaurantData(item);

  return (
    <article className={`group cursor-pointer ${className}`} onClick={() => onSelect(item)}>
      <div className="relative h-32 overflow-hidden rounded-2xl bg-secondary">
        <ImageWithFallback
          src={item.image}
          alt={item.name}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
        />
        {item.badge && (
          <span className="absolute left-2 top-2 rounded-full bg-white px-2.5 py-1 text-[0.6875rem] text-[#222222] shadow-sm" style={{ fontWeight: 700 }}>
            {item.badge}
          </span>
        )}
        <motion.button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onSave(restaurant);
          }}
          whileTap={{ scale: 1.3 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="absolute right-2 top-2 w-8 h-8 rounded-full bg-black/30 backdrop-blur-sm flex items-center justify-center cursor-pointer"
          aria-label={saved ? "Remove from saved" : "Save restaurant"}
        >
          <Heart className={`w-4.5 h-4.5 transition-colors ${saved ? "fill-[#E31C5F] text-[#E31C5F]" : "text-white"}`} />
        </motion.button>
        <div className="absolute bottom-2.5 left-1/2 -translate-x-1/2 flex items-center gap-1.5">
          {[0, 1, 2, 3, 4].map((dot) => (
            <span key={dot} className={`w-1.5 h-1.5 rounded-full ${dot === 0 ? "bg-white" : "bg-white/50"}`} />
          ))}
        </div>
      </div>

      <div className="pt-2">
        <div className="flex items-start justify-between gap-2">
          <p className="min-w-0 flex-1 truncate text-[0.875rem] text-[#222222]" style={{ fontWeight: 700 }}>
            {item.name}
          </p>
          <span className="flex items-center gap-1 text-[0.75rem] text-[#222222] shrink-0">
            <Star className="w-3.5 h-3.5 fill-current" />
            {fmtR(item.rating)}
          </span>
        </div>
        <p className="text-[0.75rem] text-[#717171] truncate">
          {item.cuisine}{item.area ? ` ${DOT} ${item.area}` : ""}
        </p>
        <p className="text-[0.75rem] text-[#717171] truncate">
          {item.price || "$$"} {DOT} {item.wait || "Tables tonight"}{item.distance ? ` ${DOT} ${item.distance}` : ""}
        </p>
        {item.reviews && (
          <p className="text-[0.75rem] text-[#222222] mt-0.5" style={{ fontWeight: 600 }}>
            {item.reviews.toLocaleString()} reviews
          </p>
        )}
      </div>
    </article>
  );
}

function toRestaurantData(item: AirbnbRestaurantCardItem): RestaurantData {
  return {
    id: item.id,
    name: item.name,
    cuisine: item.cuisine.split(DOT)[0].trim(),
    emoji: "",
    rating: item.rating,
    reviews: item.reviews || 500,
    price: item.price || "$$",
    lng: -122.42,
    lat: 37.78,
    open: true,
    distance: item.distance || "0.5 mi",
    image: item.image,
  };
}

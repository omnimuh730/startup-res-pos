import type { ReactNode } from "react";
import { ChevronRight, MapPin, Star } from "lucide-react";
import { ImageWithFallback } from "../../components/figma/ImageWithFallback";
import type { RestaurantData } from "../detail/RestaurantDetailView";
import { CardSaveBtn } from "./SaveButtons";
import { fmtR } from "./discoverTypes";

const DOT = "\u00b7";

export function AirbnbRestaurantListCard({
  restaurant,
  onSelect,
  onSave,
  badge,
  waitLabel,
  detail,
  meta,
  children,
}: {
  restaurant: RestaurantData;
  onSelect: (restaurant: RestaurantData) => void;
  onSave?: (restaurant: RestaurantData) => void;
  badge?: string;
  waitLabel?: string;
  detail?: string;
  meta?: string;
  children?: ReactNode;
}) {
  return (
    <article className="group border-b border-border/80 pb-4 last:border-b-0 last:pb-0">
      <button
        type="button"
        onClick={() => onSelect(restaurant)}
        className="w-full flex gap-3 text-left cursor-pointer"
      >
        <div className="relative w-28 h-28 rounded-2xl overflow-hidden bg-secondary shrink-0">
          <ImageWithFallback
            src={restaurant.image}
            alt={restaurant.name}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
          />
          {badge && (
            <span className="absolute left-2 top-2 rounded-full bg-white px-2.5 py-1 text-[0.6875rem] text-[#222222] shadow-sm" style={{ fontWeight: 700 }}>
              {badge}
            </span>
          )}
          {onSave && (
            <CardSaveBtn id={restaurant.id} restaurant={restaurant} onToggle={onSave} />
          )}
          {waitLabel && (
            <span className="absolute left-2 bottom-2 rounded-full bg-black/65 px-2 py-0.5 text-[0.6875rem] text-white backdrop-blur-sm" style={{ fontWeight: 700 }}>
              {waitLabel}
            </span>
          )}
        </div>

        <div className="min-w-0 flex-1 pt-0.5">
          <div className="flex items-start justify-between gap-2">
            <p className="min-w-0 flex-1 truncate text-[0.9375rem] text-[#222222]" style={{ fontWeight: 700 }}>
              {restaurant.name}
            </p>
            <span className="flex items-center gap-1 text-[0.8125rem] text-[#222222] shrink-0">
              <Star className="w-3.5 h-3.5 fill-current" />
              {fmtR(restaurant.rating)}
            </span>
          </div>
          <p className="mt-1 truncate text-[0.8125rem] text-[#717171]">
            {detail || `${restaurant.cuisine} ${DOT} ${restaurant.price}`}
          </p>
          <p className="mt-0.5 truncate text-[0.8125rem] text-[#717171]">
            {meta || `${restaurant.distance} ${DOT} ${restaurant.reviews.toLocaleString()} reviews`}
          </p>
          <p className="mt-2 inline-flex items-center gap-1 text-[0.75rem] text-[#222222]" style={{ fontWeight: 600 }}>
            <MapPin className="w-3.5 h-3.5" />
            Reserve a table
          </p>
        </div>

        {!onSave && <ChevronRight className="w-4 h-4 text-muted-foreground shrink-0 mt-2" />}
      </button>
      {children && <div className="mt-3 pl-[7rem]">{children}</div>}
    </article>
  );
}

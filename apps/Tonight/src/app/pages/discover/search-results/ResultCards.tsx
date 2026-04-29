import { motion } from "motion/react";
import { Heart, Star } from "lucide-react";
import { ImageWithFallback } from "../../../components/figma/ImageWithFallback";
import { fmtR } from "../discoverTypes";
import { CARD_DETAILS, type MappedSearchRestaurant } from "./types";
import type { SearchResultRestaurant } from "../discoverTypes";

export function RestaurantResultCard({
  restaurant,
  index,
  onSelect,
}: {
  restaurant: SearchResultRestaurant;
  index: number;
  onSelect: () => void;
}) {
  const detail = CARD_DETAILS[index % CARD_DETAILS.length];
  const discounted = index % 3 === 0;
  const basePrice = restaurant.price || "$$";

  return (
    <article className="cursor-pointer" onClick={onSelect}>
      <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-[#F7F7F7]">
        <ImageWithFallback
          src={restaurant.image.replace("w=100&h=100", "w=800&h=800")}
          alt={restaurant.name}
          className="h-full w-full object-cover transition-transform duration-500 hover:scale-[1.03]"
        />
        <span className="absolute left-3 top-3 rounded-full bg-white px-3 py-1.5 text-[0.8125rem] text-[#222222] shadow-sm" style={{ fontWeight: 700 }}>
          {index % 2 === 0 ? "Trophy pick" : "Guest favorite"}
        </span>
        <button
          type="button"
          onClick={(event) => event.stopPropagation()}
          className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-black/25 text-white backdrop-blur-sm"
          aria-label="Save restaurant"
        >
          <Heart className="h-5 w-5" />
        </button>
        <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 items-center gap-1.5">
          {[0, 1, 2, 3, 4].map((dot) => (
            <span key={dot} className={`h-1.5 w-1.5 rounded-full ${dot === 0 ? "bg-white" : "bg-white/55"}`} />
          ))}
        </div>
      </div>

      <div className="pt-3">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <p className="truncate text-[0.9375rem] text-[#222222]" style={{ fontWeight: 700 }}>{restaurant.name}</p>
            <p className="mt-0.5 text-[0.875rem] leading-snug text-[#717171]">
              {restaurant.cuisine || restaurant.subtitle} in {detail.area}
            </p>
            <p className="mt-0.5 text-[0.875rem] text-[#717171]">{detail.offer}</p>
            <p className="mt-0.5 text-[0.875rem] text-[#717171]">{detail.wait}</p>
          </div>
          <span className="flex shrink-0 items-center gap-1 text-[0.875rem] text-[#222222]">
            <Star className="h-4 w-4 fill-current" />
            {fmtR(restaurant.rating || 4.7)}
          </span>
        </div>
        <p className="mt-2 text-[0.9375rem] text-[#222222]">
          {discounted && <span className="mr-1 text-[#717171] line-through">{basePrice}</span>}
          <span className={discounted ? "underline" : ""} style={{ fontWeight: 700 }}>{discounted ? "$$" : basePrice}</span>
          <span className="text-[#717171]"> for tonight</span>
        </p>
      </div>
    </article>
  );
}

export function MapPreviewCard({
  restaurant,
  index,
  bottomNavHeight,
  onSelect,
}: {
  restaurant: MappedSearchRestaurant;
  index: number;
  bottomNavHeight: number;
  onSelect: () => void;
}) {
  const detail = CARD_DETAILS[index % CARD_DETAILS.length];
  const basePrice = restaurant.price || "$$";

  return (
    <motion.article
      initial={{ opacity: 0, y: 28, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 20, scale: 0.96 }}
      transition={{ type: "spring", damping: 24, stiffness: 280 }}
      className="absolute left-4 right-4 z-40 overflow-hidden rounded-2xl bg-white shadow-[0_12px_30px_rgba(0,0,0,0.28)]"
      style={{ bottom: `${Math.round(bottomNavHeight + 100)}px` }}
      onClick={onSelect}
    >
      <div className="relative h-40 bg-[#F7F7F7]">
        <ImageWithFallback
          src={restaurant.mapImage.replace("w=400&h=300", "w=700&h=420")}
          alt={restaurant.name}
          className="h-full w-full object-cover"
        />
        <span className="absolute left-3 top-3 rounded-full bg-white px-3 py-1.5 text-[0.8125rem] text-[#222222] shadow-sm" style={{ fontWeight: 700 }}>
          Trophy pick
        </span>
        <button
          type="button"
          onClick={(event) => event.stopPropagation()}
          className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-white/95 text-[#222222] shadow-sm"
          aria-label="Save restaurant"
        >
          <Heart className="h-5 w-5" />
        </button>
        <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 items-center gap-1.5">
          {[0, 1, 2, 3, 4].map((dot) => (
            <span key={dot} className={`h-1.5 w-1.5 rounded-full ${dot === 0 ? "bg-white" : "bg-white/55"}`} />
          ))}
        </div>
      </div>
      <div className="px-4 py-3">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <p className="truncate text-[0.9375rem] text-[#222222]" style={{ fontWeight: 700 }}>{restaurant.name}</p>
            <p className="truncate text-[0.8125rem] text-[#717171]">{restaurant.cuisine || restaurant.subtitle} in {detail.area}</p>
            <p className="truncate text-[0.8125rem] text-[#717171]">{detail.wait}</p>
          </div>
          <span className="flex shrink-0 items-center gap-1 text-[0.875rem] text-[#222222]">
            <Star className="h-4 w-4 fill-current" />
            {fmtR(restaurant.rating || 4.7)}
          </span>
        </div>
        <p className="mt-1 text-[0.875rem] text-[#222222]">
          <span className="mr-1 text-[#717171] line-through">{basePrice}</span>
          <span className="underline" style={{ fontWeight: 700 }}>$$</span>
          <span className="text-[#717171]"> for tonight</span>
        </p>
      </div>
    </motion.article>
  );
}

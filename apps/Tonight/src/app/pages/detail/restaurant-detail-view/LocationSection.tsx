import { MapPin } from "lucide-react";
import { ImageWithFallback } from "../../../components/figma/ImageWithFallback";
import type { RestaurantData } from "../restaurantDetailData";
import type { RestaurantExtendedData } from "./types";

export function LocationSection({
  restaurant,
  ext,
  onDirections,
}: {
  restaurant: RestaurantData;
  ext: RestaurantExtendedData;
  onDirections?: (restaurant: RestaurantData) => void;
}) {
  return (
    <section className="px-6 py-6 border-b border-border">
      <h2 className="text-[1.75rem] leading-tight mb-2" style={{ fontWeight: 700 }}>Where you'll be</h2>
      <p className="text-muted-foreground text-[0.95rem] mb-4">{ext.address}</p>
      <div className="relative rounded-3xl overflow-hidden h-[17rem]">
        <ImageWithFallback src={`https://maps.googleapis.com/maps/api/staticmap?center=${restaurant.lat},${restaurant.lng}&zoom=14&size=800x500&maptype=roadmap&markers=color:red%7C${restaurant.lat},${restaurant.lng}&key=`} alt="Restaurant location map" className="w-full h-full object-cover" />
        <button onClick={() => onDirections?.(restaurant)} className="absolute top-3 right-3 w-12 h-12 rounded-full bg-white/95 flex items-center justify-center cursor-pointer shadow">
          <MapPin className="w-5 h-5" />
        </button>
        <div className="absolute left-1/2 -translate-x-1/2 bottom-4 bg-white/95 px-4 py-2 rounded-full shadow text-[0.85rem]" style={{ fontWeight: 600 }}>
          Verified location
        </div>
      </div>
    </section>
  );
}

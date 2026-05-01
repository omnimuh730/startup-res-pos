import { CalendarDays, Shield } from "lucide-react";
import type { RestaurantData } from "../restaurantDetailData";

export function BookingBar({
  restaurant,
  onBookTable,
}: {
  restaurant: RestaurantData;
  onBookTable: (restaurant: RestaurantData) => void;
}) {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-background border-t border-border px-6 py-4 z-20">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-[1.6rem] leading-none underline" style={{ fontWeight: 700 }}>${Math.max(60, Math.round((restaurant.rating * 50) + 80))}</p>
          <p className="text-[0.85rem] text-muted-foreground">for 2 guests · Tonight</p>
          <p className="text-[0.85rem] mt-1 flex items-center gap-1"><Shield className="w-4 h-4" /> Free cancellation</p>
        </div>
        <button onClick={() => onBookTable(restaurant)} className="h-12 px-8 rounded-full bg-[#e31c5f] text-white text-[1rem] cursor-pointer flex items-center gap-2" style={{ fontWeight: 700 }}>
          <CalendarDays className="w-4 h-4" />
          Reserve
        </button>
      </div>
    </div>
  );
}

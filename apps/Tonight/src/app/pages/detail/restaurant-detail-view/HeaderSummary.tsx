import { fmtR, type RestaurantData } from "../restaurantDetailData";
import type { RestaurantExtendedData } from "./types";

export function HeaderSummary({ restaurant, ext }: { restaurant: RestaurantData; ext: RestaurantExtendedData }) {
  return (
    <div className="-mt-6 relative z-[2] bg-background px-6 pt-6 pb-4 rounded-t-[2.1rem] border-b border-border">
      <h1 className="text-[2rem] leading-[1.2]" style={{ fontWeight: 700 }}>{restaurant.name}</h1>
      <p className="mt-1.5 text-muted-foreground text-[1rem]">{restaurant.cuisine} restaurant in {restaurant.distance} area</p>
      <p className="text-muted-foreground text-[1rem]">{restaurant.price} · {restaurant.open ? `Open until ${ext.closesAt}` : "Currently closed"}</p>
    </div>
  );
}

// The "boris leaves" (Laurel branch) SVG component
export const LaurelBranch = ({ className }: { className?: string }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    {/* Main curved stem */}
    <path d="M11 22c-4-4-5-9-4-14 1-4 3-6 6-6" />
    {/* Outer leaf bottom */}
    <path d="M7 16c-3-2-4-5-2-7 1-2 3-2 5-1" />
    {/* Outer leaf top */}
    <path d="M9 9c-2-2-3-4-1-6 2-1 4 0 5 2" />
    {/* Inner leaf */}
    <path d="M7 15c2-2 4-1 5 1 1 2 0 4-2 4-2 0-4-2-3-5z" />
  </svg>
);

// Type placeholder - make sure this matches your actual type
//type RestaurantData = { rating: number; reviews: number; [key: string]: any };
//const fmtR = (num: number) => num.toFixed(2); // Example formatter based on image

export function RatingsSummary({
  restaurant,
  onOpenReviews,
}: {
  restaurant: RestaurantData;
  onOpenReviews: () => void;
}) {
  return (
    <section
      className="px-6 py-6 border-b border-border cursor-pointer transition-colors hover:bg-muted/30"
      onClick={onOpenReviews}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") onOpenReviews();
      }}
    >
      <div className="grid grid-cols-3 gap-2 text-center items-center">
        
        {/* Left: Rating */}
        <div className="flex flex-col items-center justify-center">
          <p className="text-[2rem] leading-none tracking-tight font-bold text-foreground">
            {fmtR(restaurant.rating)}
          </p>
          <div className="mt-2 flex gap-0.5 text-foreground">
            {/* Crisp SVG stars instead of text emojis */}
            {[...Array(5)].map((_, i) => (
              <svg key={i} className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
              </svg>
            ))}
          </div>
        </div>

        {/* Middle: Guest Favorite Badge */}
        <div className="border-x border-border flex items-center justify-center gap-1.5 px-2 h-full py-1">
          <LaurelBranch className="w-8 h-8 sm:w-9 sm:h-9 text-foreground" />
          <div className="flex flex-col items-center justify-center font-bold text-[1.15rem] leading-[1.1] tracking-tight">
            <span>Guest</span>
            <span>favorite</span>
          </div>
          {/* Flip the second branch horizontally */}
          <LaurelBranch className="w-8 h-8 sm:w-9 sm:h-9 text-foreground transform scale-x-[-1]" />
        </div>

        {/* Right: Reviews */}
        <div className="flex flex-col items-center justify-center">
          <p className="text-[2rem] leading-none tracking-tight font-bold text-foreground">
            {restaurant.reviews}
          </p>
          <p className="mt-1.5 text-[0.85rem] font-medium text-foreground">
            Reviews
          </p>
        </div>
        
      </div>
    </section>
  );
}
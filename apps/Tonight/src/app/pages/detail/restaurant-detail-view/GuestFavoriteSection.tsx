import { Star } from "lucide-react";
import type { RefObject } from "react";
import { fmtR, type RestaurantData, type ReviewEntry } from "../restaurantDetailData";
import { LaurelBranch } from "./HeaderSummary";

interface GuestFavoriteSectionProps {
  restaurant: RestaurantData;
  guestReviewsRef: RefObject<HTMLDivElement | null>;
  topGuestReviews: ReviewEntry[];
  onOpenReviews: () => void;
}

export function GuestFavoriteSection({ restaurant, guestReviewsRef, topGuestReviews, onOpenReviews }: GuestFavoriteSectionProps) {
  return (
    <section className="px-6 py-6 border-b border-border">
      {/* Middle: Guest Favorite Badge */}
      <div className="text-center mb-5">
        <div className="flex items-center justify-center gap-1.5 px-2 h-full py-1">
          <LaurelBranch className="w-8 h-8 sm:w-9 sm:h-9 text-foreground scale-y-[2] scale-x-[2]" />
          <div className="flex flex-col items-center justify-center font-bold text-[3.25rem] leading-[1.1] tracking-tight">
            {fmtR(restaurant.rating)}
          </div>
          {/* Flip the second branch horizontally */}
          <LaurelBranch className="w-8 h-8 sm:w-9 sm:h-9 text-foreground transform scale-x-[-2] scale-y-[2]" />
        </div>
        <h2 className="text-[1.75rem] leading-tight mt-2" style={{ fontWeight: 700 }}>Guest favorite</h2>

        <p className="text-muted-foreground text-[0.95rem] mt-2">This restaurant is in the top picks for quality, reviews, and reliability.</p>
      </div>
      <div
        ref={guestReviewsRef}
        className="flex gap-3 overflow-x-auto pb-2 snap-x snap-mandatory scrollbar-hide select-none"
        style={{ WebkitOverflowScrolling: "touch" }}
        aria-label="Guest review cards"
      >
        {topGuestReviews.map((review, idx) => (
          <article key={`${review.name}-${idx}`} className="w-[84%] sm:w-[70%] shrink-0 snap-start rounded-2xl border border-border p-4 bg-card/50">
            <div className="flex items-center gap-2 text-[0.875rem] mb-2">
              <Star className="w-4 h-4 fill-current" />
              <span>{review.date}</span>
            </div>
            <p className="text-[0.95rem] leading-6 line-clamp-4">{review.text}</p>
            <button onClick={onOpenReviews} className="underline mt-2 text-[0.9rem] cursor-pointer" style={{ fontWeight: 500 }}>
              Show more
            </button>
            <div className="mt-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center" style={{ fontWeight: 700 }}>
                {review.name.slice(0, 1)}
              </div>
              <div>
                <p className="text-[0.95rem]" style={{ fontWeight: 600 }}>{review.name}</p>
                <p className="text-[0.8rem] text-muted-foreground">Verified diner</p>
              </div>
            </div>
          </article>
        ))}
      </div>
      <button
        onClick={onOpenReviews}
        className="w-full mt-4 rounded-xl bg-secondary h-12 text-[1rem] cursor-pointer"
        style={{ fontWeight: 600 }}
      >
        Show all {restaurant.reviews.toLocaleString()} reviews
      </button>
      <p className="text-center text-[0.85rem] text-muted-foreground mt-3">
        Drag to browse guest reviews
      </p>
    </section>
  );
}

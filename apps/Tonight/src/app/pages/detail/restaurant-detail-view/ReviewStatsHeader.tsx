import { ArrowLeft, Search, SlidersHorizontal } from "lucide-react";
import { fmtR, type RestaurantData } from "../restaurantDetailData";
import type { ReviewSortBy } from "./ReviewsToolbar";

const subRatings = [
  { label: "Taste", value: "5.0", icon: "🍽️" },
  { label: "Ambience", value: "4.9", icon: "✨" },
  { label: "Service", value: "4.8", icon: "🤝" },
  { label: "Value", value: "4.7", icon: "💰" },
];

const distribution = [
  { stars: 5, pct: 88 },
  { stars: 4, pct: 64 },
  { stars: 3, pct: 30 },
  { stars: 2, pct: 14 },
  { stars: 1, pct: 8 },
];

export function ReviewStatsHeader({
  restaurant,
  searchOpen,
  compactHeader,
  sortBy,
  sortOpen,
  onSortOpenChange,
  onSortByChange,
  onSearchOpen,
  onBack,
  onShowHowReviewsWork,
  headerSortRef,
}: {
  restaurant: RestaurantData;
  searchOpen: boolean;
  compactHeader: boolean;
  sortBy: ReviewSortBy;
  sortOpen: boolean;
  onSortOpenChange: (open: boolean) => void;
  onSortByChange: (sort: ReviewSortBy) => void;
  onSearchOpen: () => void;
  onBack: () => void;
  onShowHowReviewsWork: () => void;
  headerSortRef: React.RefObject<HTMLDivElement>;
}) {
  return (
    <section
      className={`sticky top-0 z-20 border-b border-border bg-[#f5f2e8] transition-[height,opacity] duration-[400ms] ease-[cubic-bezier(0.22,0.61,0.36,1)] ${
        sortOpen ? "overflow-visible" : "overflow-hidden"
      } ${
        searchOpen
          ? "h-0 border-b-0 opacity-0"
          : compactHeader
            ? "h-[4.5rem] opacity-100"
            : "h-[33.5rem] opacity-100"
      }`}
    >
      <div className="relative h-full w-full">
        <div
          className={`absolute left-0 right-0 top-0 z-10 flex h-[4.5rem] items-center justify-between transition-all duration-[400ms] ease-[cubic-bezier(0.22,0.61,0.36,1)] ${
            compactHeader ? "px-4" : "px-5"
          }`}
        >
          <div className="flex items-center">
            <button
              onClick={onBack}
              aria-label="Back"
              className="flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center rounded-full bg-background/65 transition hover:bg-background active:scale-95"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <p
              className={`ml-3 truncate text-[1.05rem] leading-none transition-all duration-300 ${
                compactHeader ? "translate-y-0 opacity-100" : "-translate-y-1 opacity-0 pointer-events-none"
              }`}
              style={{ fontWeight: 800 }}
            >
              Reviews
            </p>
          </div>

          {/* Compact Mode Search and Sort Actions */}
          <div
            className={`flex items-center gap-2 transition-all duration-300 ${
              compactHeader && !searchOpen
                ? "pointer-events-auto translate-y-0 opacity-100"
                : "pointer-events-none -translate-y-2 opacity-0"
            }`}
          >
            <div className="relative" ref={headerSortRef}>
              <button
                onClick={() => onSortOpenChange(!sortOpen)}
                className="flex h-9 cursor-pointer items-center gap-2 rounded-full border border-border bg-background px-3 text-[0.85rem] font-semibold transition hover:bg-muted"
              >
                <SlidersHorizontal className="h-4 w-4" />
                <span className="hidden sm:inline">
                  {sortBy === "most_recent"
                    ? "Most recent"
                    : sortBy === "highest_rated"
                      ? "Highest rated"
                      : "Lowest rated"}
                </span>
              </button>

              {sortOpen && (
                <div className="absolute right-0 top-full mt-2 w-48 overflow-hidden rounded-xl border border-border bg-card text-card-foreground shadow-lg">
                  {(["most_recent", "highest_rated", "lowest_rated"] as ReviewSortBy[]).map((opt) => (
                    <button
                      key={opt}
                      className={`w-full cursor-pointer px-4 py-3 text-left text-[0.9rem] transition hover:bg-muted ${
                        sortBy === opt ? "bg-muted/50 font-bold" : "font-medium"
                      }`}
                      onClick={() => {
                        onSortByChange(opt);
                        onSortOpenChange(false);
                      }}
                    >
                      {opt === "most_recent"
                        ? "Most recent"
                        : opt === "highest_rated"
                          ? "Highest rated"
                          : "Lowest rated"}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <button
              onClick={onSearchOpen}
              className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-full border border-border bg-background transition hover:bg-muted"
            >
              <Search className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div
          className={`absolute inset-x-0 top-[4.5rem] px-5 pb-10 transition-all duration-[400ms] ease-[cubic-bezier(0.22,0.61,0.36,1)] ${
            compactHeader
              ? "pointer-events-none -translate-y-4 scale-95 opacity-0"
              : "translate-y-0 scale-100 opacity-100"
          }`}
        >
          <div className="text-center">
            <div className="text-[3.25rem] leading-none">🏆 {fmtR(restaurant.rating)} 🏆</div>
            <h2 className="mt-2 text-[1.75rem] leading-tight" style={{ fontWeight: 700 }}>
              Guest favorite
            </h2>
            <p className="mt-2 text-[0.95rem] leading-6 text-muted-foreground">
              This home is in the top 5% of eligible listings based on ratings, reviews, and reliability
            </p>
            <button onClick={onShowHowReviewsWork} className="mt-2 cursor-pointer text-[0.85rem] underline">
              How reviews work
            </button>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-4 border-t border-border pt-4">
            <div className="pr-2">
              <p className="mb-3 text-[1rem]" style={{ fontWeight: 700 }}>
                Overall rating
              </p>
              <div className="space-y-1.5">
                {distribution.map((d) => (
                  <div key={d.stars} className="grid grid-cols-[12px_1fr] items-center gap-2">
                    <span className="text-[0.95rem] text-muted-foreground">{d.stars}</span>
                    <div className="h-2 overflow-hidden rounded-full bg-border/70">
                      <div
                        className={`h-full rounded-full ${d.stars === 5 ? "bg-foreground" : "bg-muted-foreground/30"}`}
                        style={{ width: `${d.pct}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 border-l border-border pl-2">
              {subRatings.map((m, idx) => (
                <div
                  key={m.label}
                  className={`px-4 py-2 ${idx % 2 === 0 ? "border-r border-border" : ""} ${
                    idx < 2 ? "border-b border-border" : ""
                  }`}
                >
                  <p className="text-[0.85rem]">{m.label}</p>
                  <p className="mt-0.5 text-[1rem]" style={{ fontWeight: 700 }}>
                    {m.value}
                  </p>
                  <p className="mt-1.5 text-[0.95rem]">{m.icon}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
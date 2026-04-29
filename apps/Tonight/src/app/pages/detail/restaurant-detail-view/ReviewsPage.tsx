import { useEffect, useMemo, useRef, useState } from "react";
import { ReviewCard } from "../ReviewComponents";
import { REVIEW_DATA, type RestaurantData } from "../restaurantDetailData";
import { HowReviewsWorkModal } from "./HowReviewsWorkModal";
import { ReviewStatsHeader } from "./ReviewStatsHeader";
import { ReviewsSearchBar } from "./ReviewsSearchBar";
import { ReviewsToolbar, type ReviewSortBy } from "./ReviewsToolbar";

export function ReviewsPage({ restaurant, onBack }: { restaurant: RestaurantData; onBack: () => void }) {
  const [entered, setEntered] = useState(false);
  const [closing, setClosing] = useState(false);
  const [showHowReviewsWork, setShowHowReviewsWork] = useState(false);
  const [sortOpen, setSortOpen] = useState(false);
  const [sortBy, setSortBy] = useState<ReviewSortBy>("most_recent");
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchText, setSearchText] = useState("");
  const sortRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const id = window.requestAnimationFrame(() => setEntered(true));
    return () => window.cancelAnimationFrame(id);
  }, []);

  useEffect(() => {
    const onDocMouseDown = (e: MouseEvent) => {
      const node = sortRef.current;
      if (!node) return;
      if (!node.contains(e.target as Node)) setSortOpen(false);
    };
    document.addEventListener("mousedown", onDocMouseDown);
    return () => document.removeEventListener("mousedown", onDocMouseDown);
  }, []);

  const sortedAndFiltered = useMemo(() => {
    const list = [...REVIEW_DATA];
    if (sortBy === "highest_rated") list.sort((a, b) => b.rating - a.rating);
    if (sortBy === "lowest_rated") list.sort((a, b) => a.rating - b.rating);
    if (sortBy === "most_recent") {
      // REVIEW_DATA is authored newest -> oldest already.
    }
    const q = searchText.trim().toLowerCase();
    if (!q) return list;
    return list.filter((r) => `${r.name} ${r.text} ${r.date}`.toLowerCase().includes(q));
  }, [sortBy, searchText]);

  const handleBack = () => {
    if (closing) return;
    setClosing(true);
    setEntered(false);
    window.setTimeout(() => onBack(), 440);
  };

  return (
    <div
      className={`fixed inset-0 z-[320] bg-background text-foreground will-change-transform transition-transform duration-[440ms] ease-[cubic-bezier(0.22,0.61,0.36,1)] ${entered ? "translate-x-0" : "translate-x-full"}`}
    >
      <div className="h-full overflow-y-auto pb-12">
        <ReviewStatsHeader
          restaurant={restaurant}
          searchOpen={searchOpen}
          onBack={handleBack}
          onShowHowReviewsWork={() => setShowHowReviewsWork(true)}
        />

        <div className="px-5 py-5">
          <ReviewsSearchBar
            searchOpen={searchOpen}
            searchText={searchText}
            onSearchTextChange={setSearchText}
            onCancel={() => { setSearchOpen(false); setSearchText(""); }}
          />

          <ReviewsToolbar
            reviewCount={sortedAndFiltered.length}
            searchOpen={searchOpen}
            sortOpen={sortOpen}
            sortBy={sortBy}
            sortRef={sortRef}
            onSortOpenChange={setSortOpen}
            onSortByChange={setSortBy}
            onSearchOpen={() => { setSortOpen(false); setSearchOpen(true); }}
          />

          <div className="space-y-4">
            {sortedAndFiltered.map((review, i) => (
              <ReviewCard key={`${review.name}-${i}`} review={review} />
            ))}
          </div>
        </div>
      </div>

      {showHowReviewsWork && <HowReviewsWorkModal onClose={() => setShowHowReviewsWork(false)} />}
    </div>
  );
}

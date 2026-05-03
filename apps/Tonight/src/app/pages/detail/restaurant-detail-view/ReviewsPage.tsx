import { type UIEvent, useEffect, useMemo, useRef, useState } from "react";
import { ReviewCard } from "../ReviewComponents";
import { REVIEW_DATA, type RestaurantData } from "../restaurantDetailData";
import { HowReviewsWorkModal } from "./HowReviewsWorkModal";
import { ReviewStatsHeader } from "./ReviewStatsHeader";
import { ReviewsSearchBar } from "./ReviewsSearchBar";
import { ReviewsToolbar, type ReviewSortBy } from "./ReviewsToolbar";

const INITIAL_REVIEW_COUNT = 5;
const REVIEW_BATCH_SIZE = 5;

export function ReviewsPage({ restaurant, onBack }: { restaurant: RestaurantData; onBack: () => void }) {
  const [entered, setEntered] = useState(false);
  const [closing, setClosing] = useState(false);
  const [showHowReviewsWork, setShowHowReviewsWork] = useState(false);
  const [sortOpen, setSortOpen] = useState(false);
  const [sortBy, setSortBy] = useState<ReviewSortBy>("most_recent");
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [compactHeader, setCompactHeader] = useState(false);
  const [reviewLimit, setReviewLimit] = useState(INITIAL_REVIEW_COUNT);
  
  const reviewsScrollRef = useRef<HTMLDivElement>(null);
  const sortRef = useRef<HTMLDivElement>(null);
  const headerSortRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const id = window.requestAnimationFrame(() => setEntered(true));
    return () => window.cancelAnimationFrame(id);
  }, []);

  useEffect(() => {
    const onDocMouseDown = (e: MouseEvent) => {
      const clickedNode = e.target as Node;
      if (
        sortRef.current?.contains(clickedNode) ||
        headerSortRef.current?.contains(clickedNode)
      ) {
        return;
      }
      setSortOpen(false);
    };
    document.addEventListener("mousedown", onDocMouseDown);
    return () => document.removeEventListener("mousedown", onDocMouseDown);
  }, []);

  useEffect(() => {
    setReviewLimit(INITIAL_REVIEW_COUNT);
  }, [searchText, sortBy]);

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

  const handleScroll = (e: UIEvent<HTMLDivElement>) => {
    const top = e.currentTarget.scrollTop;
    setCompactHeader((prev) => {
      if (!prev && top > 64) return true;
      if (prev && top < 24) return false;
      return prev;
    });
  };

  const handleSearchOpen = () => {
    setSortOpen(false);
    setSearchOpen(true);
    // When expanding the search bar from a scrolled state, auto-scroll to the top so it becomes visible
    setTimeout(() => {
      if (reviewsScrollRef.current) {
        reviewsScrollRef.current.scrollTo({ top: 0, behavior: "smooth" });
      }
    }, 10);
  };

  const visibleReviews = sortedAndFiltered.slice(0, reviewLimit);
  const hasMoreReviews = visibleReviews.length < sortedAndFiltered.length;

  return (
    <div
      className={`fixed inset-0 z-[320] bg-background text-foreground transition-transform duration-[440ms] ease-[cubic-bezier(0.22,0.61,0.36,1)] will-change-transform ${
        entered ? "translate-x-0" : "translate-x-full"
      }`}
    >
      <style>{`
        @keyframes reviewFadeInUp {
          0% { opacity: 0; transform: translateY(15px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        .review-card-enter {
          animation: reviewFadeInUp 0.5s cubic-bezier(0.22, 1, 0.36, 1) forwards;
        }
      `}</style>

      <div ref={reviewsScrollRef} onScroll={handleScroll} className="h-full overflow-y-auto pb-12 [overflow-anchor:none]">
        <ReviewStatsHeader
          restaurant={restaurant}
          searchOpen={searchOpen}
          compactHeader={compactHeader}
          sortBy={sortBy}
          sortOpen={sortOpen}
          onSortOpenChange={setSortOpen}
          onSortByChange={setSortBy}
          onSearchOpen={handleSearchOpen}
          onBack={handleBack}
          onShowHowReviewsWork={() => setShowHowReviewsWork(true)}
          headerSortRef={headerSortRef}
        />

        <div className="px-5 py-5">
          <ReviewsSearchBar
            searchOpen={searchOpen}
            searchText={searchText}
            onSearchTextChange={setSearchText}
            onCancel={() => {
              setSearchOpen(false);
              setSearchText("");
            }}
          />

          <ReviewsToolbar
            reviewCount={sortedAndFiltered.length}
            searchOpen={searchOpen}
            sortOpen={sortOpen}
            sortBy={sortBy}
            sortRef={sortRef}
            onSortOpenChange={setSortOpen}
            onSortByChange={setSortBy}
            onSearchOpen={handleSearchOpen}
          />

          <div className="space-y-4">
            {visibleReviews.map((review, i) => (
              <div
                key={`${review.name}-${review.date}-${i}`}
                className="review-card-enter opacity-0"
                style={{ animationDelay: `${(i % REVIEW_BATCH_SIZE) * 100}ms` }}
              >
                <ReviewCard review={review} />
              </div>
            ))}
          </div>

          {hasMoreReviews && (
            <button
              type="button"
              onClick={() => setReviewLimit((value) => value + REVIEW_BATCH_SIZE)}
              className="mt-5 h-12 w-full cursor-pointer rounded-full border border-foreground bg-card text-[0.9375rem] text-foreground transition hover:bg-secondary active:scale-[0.98]"
              style={{ fontWeight: 800 }}
            >
              Show more
            </button>
          )}
        </div>
      </div>

      {showHowReviewsWork && <HowReviewsWorkModal onClose={() => setShowHowReviewsWork(false)} />}
    </div>
  );
}
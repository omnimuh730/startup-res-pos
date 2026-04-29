import { Search } from "lucide-react";
import type { RefObject } from "react";

export type ReviewSortBy = "most_recent" | "highest_rated" | "lowest_rated";

export function ReviewsToolbar({
  reviewCount,
  searchOpen,
  sortOpen,
  sortBy,
  sortRef,
  onSortOpenChange,
  onSortByChange,
  onSearchOpen,
}: {
  reviewCount: number;
  searchOpen: boolean;
  sortOpen: boolean;
  sortBy: ReviewSortBy;
  sortRef: RefObject<HTMLDivElement | null>;
  onSortOpenChange: (open: boolean | ((open: boolean) => boolean)) => void;
  onSortByChange: (sortBy: ReviewSortBy) => void;
  onSearchOpen: () => void;
}) {
  const sortLabel =
    sortBy === "highest_rated" ? "Highest rated"
      : sortBy === "lowest_rated" ? "Lowest rated"
        : "Most recent";

  return (
    <div className="flex items-center justify-between mb-4">
      <h3 className="text-[1.9rem] leading-none" style={{ fontWeight: 700 }}>{reviewCount} reviews</h3>
      <div className="flex items-center gap-2">
        <div className="relative" ref={sortRef}>
          <button onClick={() => onSortOpenChange((v) => !v)} className="h-11 rounded-full border border-border px-4 text-[0.95rem] cursor-pointer">
            {sortLabel}
          </button>
          <div
            className={`absolute right-0 mt-2 w-44 rounded-xl border border-border bg-background shadow-lg overflow-hidden z-20 origin-top-right transition-all duration-200 ease-out ${sortOpen ? "opacity-100 scale-100 translate-y-0 pointer-events-auto" : "opacity-0 scale-95 -translate-y-1 pointer-events-none"}`}
          >
            <SortOption label="Most recent" active={sortBy === "most_recent"} onClick={() => { onSortByChange("most_recent"); onSortOpenChange(false); }} />
            <SortOption label="Highest rated" active={sortBy === "highest_rated"} onClick={() => { onSortByChange("highest_rated"); onSortOpenChange(false); }} />
            <SortOption label="Lowest rated" active={sortBy === "lowest_rated"} onClick={() => { onSortByChange("lowest_rated"); onSortOpenChange(false); }} />
          </div>
        </div>
        {!searchOpen && (
          <button onClick={onSearchOpen} className="w-11 h-11 rounded-full border border-border flex items-center justify-center cursor-pointer">
            <Search className="w-4.5 h-4.5" />
          </button>
        )}
      </div>
    </div>
  );
}

function SortOption({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`w-full text-left px-3 py-2.5 text-[0.92rem] cursor-pointer ${active ? "bg-secondary" : "hover:bg-secondary/60"}`}
      style={{ fontWeight: active ? 600 : 500 }}
    >
      {label}
    </button>
  );
}

import { ArrowLeft, Search, SlidersHorizontal, X } from "lucide-react";
import type { RefObject } from "react";

type SearchResultsHeaderProps = {
  query: string;
  summary?: string;
  activeFilterCount: number;
  onBack: () => void;
  onOpenSearch?: () => void;
  onChangeQuery: (q: string) => void;
  onOpenFilters: () => void;
  searchHeaderRef: RefObject<HTMLDivElement | null>;
};

export function SearchResultsHeader({
  query,
  summary,
  activeFilterCount,
  onBack,
  onOpenSearch,
  onChangeQuery,
  onOpenFilters,
  searchHeaderRef,
}: SearchResultsHeaderProps) {
  return (
    <div
      ref={searchHeaderRef}
      className="absolute left-0 right-0 top-0 z-30 border-b border-[#DDDDDD] bg-white/96 px-4 pb-3 pt-4 backdrop-blur-xl"
    >
      <div className="flex items-center gap-3">
        <button onClick={onBack} className="flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center rounded-full transition hover:bg-[#F7F7F7]" aria-label="Back">
          <ArrowLeft className="h-5 w-5" />
        </button>
        <div className="relative min-w-0 flex-1">
          <button onClick={onOpenSearch} className="h-14 w-full cursor-pointer rounded-full border border-[#DDDDDD] bg-white pl-11 pr-10 text-left shadow-[0_6px_18px_rgba(0,0,0,0.08)]">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#222222]" />
            <span className="block truncate text-[0.875rem] text-[#222222]" style={{ fontWeight: 700 }}>{query || "Start your search"}</span>
            <span className="block truncate text-[0.75rem] text-[#717171]">{summary || "Tonight, 7:00 PM, 2 people"}</span>
          </button>
          {query && (
            <button onClick={() => onChangeQuery("")} className="absolute right-3 top-1/2 flex h-7 w-7 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full hover:bg-[#F7F7F7]" aria-label="Clear search">
              <X className="h-4 w-4 text-[#717171]" />
            </button>
          )}
        </div>
        <button type="button" onClick={onOpenFilters} className="relative flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center rounded-full border border-[#DDDDDD] bg-white shadow-[0_4px_14px_rgba(0,0,0,0.08)] transition hover:scale-[1.03]" aria-label="Open filters">
          <SlidersHorizontal className="h-4 w-4 text-[#222222]" />
          {activeFilterCount > 0 && (
            <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-[#FF385C] px-1 text-[0.625rem] text-white" style={{ fontWeight: 800 }}>
              {activeFilterCount}
            </span>
          )}
        </button>
      </div>
    </div>
  );
}

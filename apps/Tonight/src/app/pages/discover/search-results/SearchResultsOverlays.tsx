import { AnimatePresence } from "motion/react";
import { Map as MapIcon } from "lucide-react";
import { MapPreviewCard } from "./ResultCards";
import { SearchFiltersSheet } from "./SearchFiltersSheet";
import type { MappedSearchRestaurant } from "./types";
import { DEFAULT_FILTERS, type SearchFilterState, type SheetState } from "./types";

export function SearchResultsOverlays({
  bottomNavHeight,
  draftFilters,
  draftResultCount,
  filtersOpen,
  isPeek,
  onApplyFilters,
  onChangeDraftFilters,
  onCloseFilters,
  onOpenMap,
  onSelectPreview,
  previewIndex,
  previewRestaurant,
  sheetState,
}: {
  bottomNavHeight: number;
  draftFilters: SearchFilterState;
  draftResultCount: number;
  filtersOpen: boolean;
  isPeek: boolean;
  onApplyFilters: () => void;
  onChangeDraftFilters: (next: SearchFilterState) => void;
  onCloseFilters: () => void;
  onOpenMap: () => void;
  onSelectPreview: () => void;
  previewIndex: number | null;
  previewRestaurant: MappedSearchRestaurant | null;
  sheetState: SheetState;
}) {
  return (
    <>
      {sheetState === "full" && (
        <button
          type="button"
          onClick={onOpenMap}
          className="absolute left-1/2 z-40 flex -translate-x-1/2 items-center gap-2 rounded-full bg-[#222222] px-4 py-2.5 text-[0.8125rem] text-white shadow-[0_8px_18px_rgba(0,0,0,0.25)]"
          style={{ fontWeight: 700, bottom: `${Math.round(bottomNavHeight + 24)}px` }}
        >
          Map
          <MapIcon className="h-4 w-4" />
        </button>
      )}

      {isPeek && previewRestaurant && (
        <MapPreviewCard
          restaurant={previewRestaurant}
          index={previewIndex ?? 0}
          bottomNavHeight={bottomNavHeight}
          onSelect={onSelectPreview}
        />
      )}

      <AnimatePresence>
        {filtersOpen && (
          <SearchFiltersSheet
            filters={draftFilters}
            onChange={onChangeDraftFilters}
            onClose={onCloseFilters}
            onClear={() => onChangeDraftFilters(DEFAULT_FILTERS)}
            onApply={onApplyFilters}
            resultCount={draftResultCount}
          />
        )}
      </AnimatePresence>
    </>
  );
}

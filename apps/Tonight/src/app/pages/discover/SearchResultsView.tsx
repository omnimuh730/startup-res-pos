/* Airbnb-style map + draggable restaurant results */
import { useRef } from "react";
import "maplibre-gl/dist/maplibre-gl.css";
import type { SearchResults, SearchResultLocation, SearchResultRestaurant, SearchResultFood, SearchResultChef } from "./discoverTypes";
import { MapSurface } from "./search-results/MapSurface";
import { SearchResultsHeader } from "./search-results/SearchResultsHeader";
import { SearchResultsSheet } from "./search-results/SearchResultsSheet";
import { SearchResultsOverlays } from "./search-results/SearchResultsOverlays";
import { useSearchResultsLayout } from "./search-results/useSearchResultsLayout";
import { useSearchResultsController } from "./search-results/useSearchResultsController";
import { useResultsListPull } from "./search-results/useResultsListPull";

export function SearchResultsView({
  query,
  results,
  summary,
  onBack,
  onChangeQuery,
  onOpenSearch,
  onSelectRestaurant,
}: {
  query: string;
  results: SearchResults;
  summary?: string;
  onBack: () => void;
  onChangeQuery: (q: string) => void;
  onOpenSearch?: () => void;
  onSelectLocation: (loc: SearchResultLocation) => void;
  onSelectRestaurant: (r: SearchResultRestaurant) => void;
  onSelectFood: (f: SearchResultFood) => void;
  onSelectChef: (c: SearchResultChef) => void;
}) {
  const sheetRef = useRef<HTMLElement | null>(null);
  const searchHeaderRef = useRef<HTMLDivElement | null>(null);
  const peekHeaderRef = useRef<HTMLButtonElement | null>(null);
  const resultsListRef = useRef<HTMLDivElement | null>(null);
  const { sheetHeight, bottomNavHeight, globalTopBarHeight, searchHeaderHeight, peekHeaderHeight } = useSearchResultsLayout({
    sheetRef,
    searchHeaderRef,
    peekHeaderRef,
  });

  const {
    activeFilterCount,
    activeMarker,
    applyFilters,
    draftFilters,
    draftResultCount,
    filteredRestaurants,
    filtersOpen,
    isPeek,
    openFilters,
    peekHeight,
    previewIndex,
    previewRestaurant,
    setActiveMarker,
    setDraftFilters,
    setFiltersOpen,
    setPreviewIndex,
    setSheetState,
    sheetState,
    sheetY,
  } = useSearchResultsController({
    query,
    results,
    bottomNavHeight,
    peekHeaderHeight,
    sheetHeight,
  });

  const { handleListPointerDown, handleListPointerMove, handleListPointerEnd, handleListPointerCancel } = useResultsListPull({
    sheetState,
    resultsListRef,
    setPreviewIndex,
    setSheetState,
  });

  return (
    <div
      className="tonight-search-results -mx-4 -mt-6 min-h-[640px] overflow-hidden bg-white sm:-mx-6 lg:-mx-8"
      style={{ height: `calc(100vh - ${Math.round(globalTopBarHeight)}px)` }}
    >
      <div className="relative h-full overflow-hidden bg-[#f5f1ea]">
        <SearchResultsHeader
          query={query}
          summary={summary}
          activeFilterCount={activeFilterCount}
          onBack={onBack}
          onOpenSearch={onOpenSearch}
          onChangeQuery={onChangeQuery}
          onOpenFilters={openFilters}
          searchHeaderRef={searchHeaderRef}
        />

        <MapSurface
          restaurants={filteredRestaurants}
          activeMarker={activeMarker}
          onMarkerSelect={(index) => {
            setActiveMarker(index);
            setPreviewIndex(index);
            setSheetState("peek");
          }}
          onMapClick={() => setPreviewIndex(null)}
          query={query}
          topOffset={searchHeaderHeight}
        />

        <SearchResultsSheet
          filteredRestaurants={filteredRestaurants}
          query={query}
          activeFilterCount={activeFilterCount}
          sheetState={sheetState}
          setSheetState={setSheetState}
          setPreviewIndex={setPreviewIndex}
          onSelectRestaurant={(restaurant) => onSelectRestaurant(restaurant)}
          sheetRef={sheetRef}
          peekHeaderRef={peekHeaderRef}
          resultsListRef={resultsListRef}
          sheetHeight={sheetHeight}
          peekHeight={peekHeight}
          sheetY={sheetY}
          searchHeaderHeight={searchHeaderHeight}
          peekHeaderHeight={peekHeaderHeight}
          bottomNavHeight={bottomNavHeight}
          onListPointerDown={handleListPointerDown}
          onListPointerMove={handleListPointerMove}
          onListPointerEnd={handleListPointerEnd}
          onListPointerCancel={handleListPointerCancel}
        />

        <SearchResultsOverlays
          bottomNavHeight={bottomNavHeight}
          draftFilters={draftFilters}
          draftResultCount={draftResultCount}
          filtersOpen={filtersOpen}
          isPeek={isPeek}
          onApplyFilters={applyFilters}
          onChangeDraftFilters={setDraftFilters}
          onCloseFilters={() => setFiltersOpen(false)}
          onOpenMap={() => {
            setSheetState("peek");
            setPreviewIndex(null);
          }}
          onSelectPreview={() => {
            if (previewRestaurant) onSelectRestaurant(previewRestaurant);
          }}
          previewIndex={previewIndex}
          previewRestaurant={previewRestaurant}
          sheetState={sheetState}
        />
      </div>
    </div>
  );
}

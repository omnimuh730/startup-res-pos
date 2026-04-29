import { useEffect, useMemo, useState } from "react";
import type { SearchResults } from "../discoverTypes";
import { ALL_SEARCH_DATA } from "../discoverSearchData";
import { DEFAULT_FILTERS, type SearchFilterState, type SheetState } from "./types";
import { filterSearchRestaurants, getFilterCount, getSheetY, mapRestaurantToExplorerLocation } from "./filterUtils";

export function useSearchResultsController({ query, results, bottomNavHeight, peekHeaderHeight, sheetHeight }: {
  query: string;
  results: SearchResults;
  bottomNavHeight: number;
  peekHeaderHeight: number;
  sheetHeight: number;
}) {
  const [sheetState, setSheetState] = useState<SheetState>("half");
  const [activeMarker, setActiveMarker] = useState(0);
  const [previewIndex, setPreviewIndex] = useState<number | null>(null);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [filters, setFilters] = useState<SearchFilterState>(DEFAULT_FILTERS);
  const [draftFilters, setDraftFilters] = useState<SearchFilterState>(DEFAULT_FILTERS);

  const restaurants = useMemo(() => {
    if (results.restaurants.length > 0) return results.restaurants;
    if (query.trim()) return ALL_SEARCH_DATA.restaurants.slice(0, 6);
    return [];
  }, [query, results.restaurants]);

  const mappedRestaurants = useMemo(
    () => restaurants.map((restaurant, index) => mapRestaurantToExplorerLocation(restaurant, index)),
    [restaurants]
  );
  const filteredRestaurants = useMemo(
    () => filterSearchRestaurants(mappedRestaurants, filters),
    [mappedRestaurants, filters]
  );
  const draftResultCount = useMemo(
    () => filterSearchRestaurants(mappedRestaurants, draftFilters).length,
    [mappedRestaurants, draftFilters]
  );
  const activeFilterCount = getFilterCount(filters);
  const previewRestaurant = previewIndex !== null ? filteredRestaurants[previewIndex] : null;
  const peekHeight = bottomNavHeight + peekHeaderHeight;
  const sheetY = getSheetY(sheetState, sheetHeight, peekHeight);
  const isPeek = sheetState === "peek";

  useEffect(() => {
    if (activeMarker >= filteredRestaurants.length) setActiveMarker(0);
    if (previewIndex !== null && previewIndex >= filteredRestaurants.length) setPreviewIndex(null);
  }, [activeMarker, filteredRestaurants.length, previewIndex]);

  const openFilters = () => {
    setDraftFilters(filters);
    setFiltersOpen(true);
  };

  const applyFilters = () => {
    setFilters(draftFilters);
    setPreviewIndex(null);
    setActiveMarker(0);
    setSheetState("half");
    setFiltersOpen(false);
  };

  return {
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
  };
}

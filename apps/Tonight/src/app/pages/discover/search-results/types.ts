import type { SearchResultRestaurant } from "../discoverTypes";

export type SheetState = "peek" | "half" | "full";

export type MappedSearchRestaurant = SearchResultRestaurant & {
  lng: number;
  lat: number;
  open?: boolean;
  distance?: string;
  mapImage: string;
};

export type SearchFilterState = {
  sortBy: string;
  prices: string[];
  cuisines: string[];
  rating: string;
  distance: string;
  amenities: string[];
  occasions: string[];
  seating: string[];
  openNow: boolean;
  instantBook: boolean;
};

export const DEFAULT_FILTERS: SearchFilterState = {
  sortBy: "Recommended",
  prices: [],
  cuisines: [],
  rating: "Any",
  distance: "Any Distance",
  amenities: [],
  occasions: [],
  seating: [],
  openNow: false,
  instantBook: false,
};

export const CARD_DETAILS = [
  { wait: "Tables tonight", area: "Gangnam", offer: "Free cancellation" },
  { wait: "Few seats left", area: "SoHo", offer: "Chef counter available" },
  { wait: "Opens at 7 PM", area: "Downtown", offer: "No booking fee" },
  { wait: "Popular tonight", area: "Midtown", offer: "Window seats available" },
  { wait: "Late seating", area: "Mission", offer: "Special menu" },
];

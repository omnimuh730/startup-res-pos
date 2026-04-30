import type React from "react";
import type { RestaurantData } from "../pages/detail/RestaurantDetailView";
import type { SearchResultFood } from "../pages/discover/discoverTypes";

export type AppWishlistCollection = {
  id: string;
  title: string;
  restaurants: RestaurantData[];
};

export type AppOutletContext = {
  userLocation: { name: string; address: string; lat: number; lng: number };
  setUserLocation: (l: AppOutletContext["userLocation"]) => void;
  savedRestaurantsRef: React.RefObject<RestaurantData[]>;
  savedFoodsRef: React.RefObject<SearchResultFood[]>;
  wishlistCollections: AppWishlistCollection[];
  toggleSaveRestaurant: (r: RestaurantData) => void;
  removeSavedRestaurant: (r: RestaurantData) => void;
  toggleSaveFood: (f: SearchResultFood) => void;
  requireAuth: (redirect: string, message?: string) => boolean;
};

export const QUICK_SAVE_WINDOW_MS = 12000;

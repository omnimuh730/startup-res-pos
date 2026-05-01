import type { NavigateFunction } from "react-router";
import type { ReactElement } from "react";

import { CITIES, FOOD_TYPES } from "../discoverData";
import type { RestaurantData } from "../detail/RestaurantDetailView";

export type DiscoverFeedBuilderProps = {
  navigate: NavigateFunction;
  requireAuth: (path: string, message: string) => boolean;
  saveScrollPos: () => void;
  setSelectedCategory: (c: { id: string; label: string; icon?: string }) => void;
  openSection: (sectionId: string) => void;
  openCity: (city: (typeof CITIES)[0]) => void;
  openFoodType: (f: (typeof FOOD_TYPES)[0]) => void;
  openRestaurant: (r: {
    id: string;
    name: string;
    cuisine: string;
    rating: number;
    image: string;
    price?: string;
    reviews?: number;
  }) => void;
  toggleSaveRestaurant: (r: RestaurantData) => void;
};

export type DiscoverFeedStaggerList = ReactElement[];

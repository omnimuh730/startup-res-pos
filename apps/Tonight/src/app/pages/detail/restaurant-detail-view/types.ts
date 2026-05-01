import { type RestaurantData, getExtendedData } from "../restaurantDetailData";

export interface RestaurantDetailProps {
  restaurant: RestaurantData;
  onBack: () => void;
  onBookTable: (restaurant: RestaurantData) => void;
  onDirections?: (restaurant: RestaurantData) => void;
  onSave?: (restaurant: RestaurantData) => void;
  requireAuth?: (redirect: string, message?: string) => boolean;
  isSaved?: boolean;
  onSaveFood?: (foodName: string) => void;
  savedFoodNames?: string[];
}

export interface MenuItemWithCategory {
  name: string;
  desc: string;
  price: number;
  popular: boolean;
  category: string;
}

export interface HostProfile {
  name: string;
  yearsHosting: number;
  image: string;
}

export type RestaurantExtendedData = ReturnType<typeof getExtendedData>;

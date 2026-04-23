/* Shared types for the Discover page module */

export interface RestaurantCardData {
  id: string;
  name: string;
  cuisine: string;
  rating: number;
  image: string;
  price?: string;
  reviews?: number;
}

export interface SearchResultLocation { id: string; name: string; count: number; }
export interface SearchResultRestaurant { id: string; name: string; subtitle: string; address: string; image: string; cuisine?: string; rating?: number; reviews?: number; price?: string; }
export interface SearchResultFood { id: string; name: string; count: number; image?: string; }
export interface SearchResultChef { id: string; name: string; restaurant: string; image: string; restaurantId?: string; }

export interface SearchResults {
  locations: SearchResultLocation[];
  restaurants: SearchResultRestaurant[];
  foods: SearchResultFood[];
  chefs: SearchResultChef[];
}

export interface SectionItem {
  id: string; name: string; cuisine: string; rating: number; price?: string; image: string;
  reviews?: number; distance?: string; tag?: string; subtitle?: string;
}

/** Format rating: strip trailing zeros after decimal (4.00->4, 4.80->4.8, 4.83->4.83) */
export function fmtR(n: number): string {
  return parseFloat(n.toFixed(2)).toString();
}

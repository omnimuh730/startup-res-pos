import type { SearchResultRestaurant } from "../discoverTypes";
import { RESTAURANTS } from "../../explorer/explorerData";
import type { MappedSearchRestaurant, SearchFilterState, SheetState } from "./types";

const HALF_VISIBLE_RATIO = 0.62;

export function getSheetY(state: SheetState, height: number, peekHeight: number) {
  if (state === "full") return 0;
  if (state === "peek") return Math.max(0, height - peekHeight);
  return Math.max(0, height * (1 - HALF_VISIBLE_RATIO));
}

export function getNearestSheetState(projectedY: number, height: number, peekHeight: number): SheetState {
  const positions: Array<{ state: SheetState; y: number }> = [
    { state: "full", y: getSheetY("full", height, peekHeight) },
    { state: "half", y: getSheetY("half", height, peekHeight) },
    { state: "peek", y: getSheetY("peek", height, peekHeight) },
  ];

  return positions.reduce((nearest, option) =>
    Math.abs(option.y - projectedY) < Math.abs(nearest.y - projectedY) ? option : nearest
  ).state;
}

export function mapRestaurantToExplorerLocation(restaurant: SearchResultRestaurant, index: number): MappedSearchRestaurant {
  const cuisine = restaurant.cuisine?.replace(" BBQ", "").toLowerCase();
  const byName = RESTAURANTS.find((candidate) => candidate.name.toLowerCase() === restaurant.name.toLowerCase());
  const byCuisine = cuisine ? RESTAURANTS.find((candidate) => candidate.cuisine.toLowerCase().includes(cuisine)) : null;
  const fallback = RESTAURANTS[index % RESTAURANTS.length];
  const match = byName ?? byCuisine ?? fallback;

  return {
    ...restaurant,
    lng: match.lng,
    lat: match.lat,
    open: match.open,
    distance: match.distance,
    mapImage: restaurant.image.replace("w=100&h=100", "w=400&h=300"),
  };
}

export function toggleFilterValue(values: string[], value: string) {
  return values.includes(value) ? values.filter((item) => item !== value) : [...values, value];
}

export function getFilterCount(filters: SearchFilterState) {
  return (
    filters.prices.length +
    filters.cuisines.length +
    filters.amenities.length +
    filters.occasions.length +
    filters.seating.length +
    (filters.sortBy !== "Recommended" ? 1 : 0) +
    (filters.rating !== "Any" ? 1 : 0) +
    (filters.distance !== "Any Distance" ? 1 : 0) +
    (filters.openNow ? 1 : 0) +
    (filters.instantBook ? 1 : 0)
  );
}

function getRestaurantSeed(restaurant: MappedSearchRestaurant, index: number) {
  const numeric = Number(restaurant.id.replace(/\D/g, ""));
  return Number.isFinite(numeric) && numeric > 0 ? numeric : index + 1;
}

function hasMockFeature(seed: number, label: string) {
  return (seed + label.length) % 3 !== 1;
}

function getPriceRank(price?: string) {
  return Math.max(1, price?.length || 2);
}

function getDistanceMiles(distance?: string) {
  return Number(distance?.match(/[\d.]+/)?.[0] || 99);
}

export function filterSearchRestaurants(restaurants: MappedSearchRestaurant[], filters: SearchFilterState) {
  const filtered = restaurants.map((restaurant, index) => ({ restaurant, index })).filter(({ restaurant, index }) => {
    const seed = getRestaurantSeed(restaurant, index);

    if (filters.prices.length > 0 && !filters.prices.includes(restaurant.price || "$$")) return false;
    if (filters.cuisines.length > 0) {
      const cuisine = `${restaurant.cuisine || restaurant.subtitle}`.toLowerCase();
      if (!filters.cuisines.some((item) => cuisine.includes(item.toLowerCase().replace("grilled ", "")))) return false;
    }
    if (filters.rating !== "Any") {
      const minRating = Number(filters.rating.replace("+", ""));
      if ((restaurant.rating || 0) < minRating) return false;
    }
    if (filters.distance !== "Any Distance") {
      const maxDistance = Number(filters.distance.match(/[\d.]+/)?.[0] || 99);
      const distance = Number((restaurant.distance || "1").match(/[\d.]+/)?.[0] || 1);
      if (distance > maxDistance) return false;
    }
    if (filters.openNow && restaurant.open === false) return false;
    if (filters.instantBook && seed % 4 === 0) return false;
    if (filters.amenities.length > 0 && !filters.amenities.every((item) => hasMockFeature(seed, item))) return false;
    if (filters.occasions.length > 0 && !filters.occasions.some((item) => hasMockFeature(seed + 2, item))) return false;
    if (filters.seating.length > 0 && !filters.seating.some((item) => hasMockFeature(seed + 4, item))) return false;

    return true;
  });

  filtered.sort((a, b) => {
    if (filters.sortBy === "Highest Rated") return (b.restaurant.rating || 0) - (a.restaurant.rating || 0) || a.index - b.index;
    if (filters.sortBy === "Nearest") return getDistanceMiles(a.restaurant.distance) - getDistanceMiles(b.restaurant.distance) || a.index - b.index;
    if (filters.sortBy === "Price: Low to High") return getPriceRank(a.restaurant.price) - getPriceRank(b.restaurant.price) || a.index - b.index;
    if (filters.sortBy === "Price: High to Low") return getPriceRank(b.restaurant.price) - getPriceRank(a.restaurant.price) || a.index - b.index;
    if (filters.sortBy === "Most Reviewed") return (b.restaurant.reviews || 0) - (a.restaurant.reviews || 0) || a.index - b.index;
    return a.index - b.index;
  });

  return filtered.map(({ restaurant }) => restaurant);
}

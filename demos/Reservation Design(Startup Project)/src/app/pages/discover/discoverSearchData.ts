/* Search mock data + filter logic + section data */
import type { SearchResults, SearchResultFood, SectionItem } from "./discoverTypes";
import { MONTHLY_BEST, LOVED_BY_LOCALS, VIRAL, DATE_NIGHT, EDITORS_CHOICE, FOOD_TYPES, CITIES } from "./discoverData";
import type { RestaurantData } from "../detail/RestaurantDetailView";
import type { SearchResultRestaurant } from "./discoverTypes";

export const ALL_SEARCH_DATA: SearchResults = {
  locations: [
    { id: "loc1", name: "Hongdae / Yeonnam-dong", count: 417 },
    { id: "loc2", name: "Hongdae", count: 337 },
    { id: "loc3", name: "Hong Kong Street", count: 89 },
    { id: "loc4", name: "SoHo / Downtown", count: 256 },
    { id: "loc5", name: "Mission District", count: 198 },
    { id: "loc6", name: "Gangnam Station", count: 512 },
    { id: "loc7", name: "Midtown Manhattan", count: 345 },
    { id: "loc8", name: "Seongsu-dong", count: 276 },
  ],
  restaurants: [
    { id: "r1", name: "Hongbaksa Gangnam Branch", subtitle: "Hongbaksa Saenggogi Gangnamjeom \u00b7 \ud64d\ubc15\uc0ac \uc0dd\uace0\uae30 \uac15\ub0a8\uc810", address: "176 Dosan-daero, Gangnam-gu, Seoul, the first floor", image: "https://images.unsplash.com/photo-1590189599125-67138c6509ef?w=100&h=100&fit=crop", cuisine: "Korean BBQ", rating: 4.5, reviews: 823, price: "$$" },
    { id: "r2", name: "Hong Bo Gak", subtitle: "\ud64d\ubcf4\uac01", address: "130 Bongeunsa-ro, Gangnam-gu, Seoul, Novotel Ambassador Gangnam Seoul, LL Floor", image: "https://images.unsplash.com/photo-1678684279246-96e6afb970f2?w=100&h=100&fit=crop", cuisine: "Korean", rating: 4.7, reviews: 456, price: "$$$" },
    { id: "r3", name: "Honghwadon", subtitle: "\ud64d\ud654\ub3c8", address: "23-1 Wangsipri-ro 4-gil, Seogyeong Building, the first floor, Seongdong-gu, Seoul", image: "https://images.unsplash.com/photo-1526366411709-472085c8a586?w=100&h=100&fit=crop", cuisine: "Korean", rating: 4.3, reviews: 312, price: "$$" },
    { id: "r4", name: "Sakura Omakase", subtitle: "Japanese \u00b7 Omakase", address: "243 S San Pedro St, Los Angeles, CA 90012", image: "https://images.unsplash.com/photo-1681270507609-e2a5f21969b0?w=100&h=100&fit=crop", cuisine: "Japanese", rating: 4.9, reviews: 1234, price: "$$$$" },
    { id: "r5", name: "Trattoria Moderna", subtitle: "Italian \u00b7 Trattoria", address: "456 Market St, San Francisco, CA 94105", image: "https://images.unsplash.com/photo-1762922425306-ef64664f6e4d?w=100&h=100&fit=crop", cuisine: "Italian", rating: 4.6, reviews: 678, price: "$$$" },
    { id: "r6", name: "Le Petit Bistro", subtitle: "French \u00b7 Bistro", address: "101 Main St, San Francisco, CA 94102", image: "https://images.unsplash.com/photo-1657502996869-6ccd568b9d41?w=100&h=100&fit=crop", cuisine: "French", rating: 4.8, reviews: 567, price: "$$$$" },
    { id: "r7", name: "Golden Dragon Palace", subtitle: "Chinese \u00b7 Dim Sum", address: "789 Mission St, San Francisco, CA 94103", image: "https://images.unsplash.com/photo-1694834589398-27b369c6f7a6?w=100&h=100&fit=crop", cuisine: "Chinese", rating: 4.5, reviews: 987, price: "$$" },
    { id: "r8", name: "Gangnam BBQ House", subtitle: "Korean \u00b7 BBQ", address: "555 Pier St, San Francisco, CA 94133", image: "https://images.unsplash.com/photo-1590189599125-67138c6509ef?w=100&h=100&fit=crop", cuisine: "Korean BBQ", rating: 4.4, reviews: 734, price: "$$" },
  ],
  foods: [
    { id: "f1", name: "Korean BBQ", count: 156, image: "https://images.unsplash.com/photo-1590189599125-67138c6509ef?w=800&h=400&fit=crop" },
    { id: "f2", name: "Japanese Omakase", count: 89, image: "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=800&h=400&fit=crop" },
    { id: "f3", name: "Italian Pasta", count: 234, image: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&h=400&fit=crop" },
    { id: "f4", name: "French Bistro", count: 67, image: "https://images.unsplash.com/photo-1550966871-3ed3cdb51f3a?w=800&h=400&fit=crop" },
    { id: "f5", name: "Thai Curry", count: 112, image: "https://images.unsplash.com/photo-1562565652-a0d8f0c59eb4?w=800&h=400&fit=crop" },
    { id: "f6", name: "Chinese Dim Sum", count: 145, image: "https://images.unsplash.com/photo-1552566626-52f8b828add9?w=800&h=400&fit=crop" },
    { id: "f7", name: "Brunch & Breakfast", count: 198, image: "https://images.unsplash.com/photo-1533089860892-a7c6f0a88666?w=800&h=400&fit=crop" },
    { id: "f8", name: "Vegan & Plant-based", count: 76, image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&h=400&fit=crop" },
  ],
  chefs: [
    { id: "c1", name: "Hong Seok-cheon", restaurant: "Hong's Kitchen", image: "https://images.unsplash.com/photo-1564759319376-a60b400ced8e?w=100&h=100&fit=crop", restaurantId: "r1" },
    { id: "c2", name: "Chef Jun Hong", restaurant: "Jun's Omakase", image: "https://images.unsplash.com/photo-1681270507609-e2a5f21969b0?w=100&h=100&fit=crop", restaurantId: "r4" },
    { id: "c3", name: "Chef David Chang", restaurant: "Momofuku", image: "https://images.unsplash.com/photo-1590189599125-67138c6509ef?w=100&h=100&fit=crop", restaurantId: "r8" },
    { id: "c4", name: "Chef Yuki Tanaka", restaurant: "Sakura Omakase", image: "https://images.unsplash.com/photo-1763506240757-a8a33ca2c26f?w=100&h=100&fit=crop", restaurantId: "r4" },
  ],
};

export function searchResultToRestaurantData(r: SearchResultRestaurant): RestaurantData {
  return {
    id: r.id, name: r.name,
    cuisine: r.cuisine || r.subtitle.split("\u00b7")[0]?.trim() || "Restaurant",
    emoji: "", rating: r.rating || 4.5, reviews: r.reviews || 100,
    price: r.price || "$$",
    lng: -122.4194 + Math.random() * 0.05, lat: 37.7749 + Math.random() * 0.05,
    open: true, distance: "0.5 mi",
    image: r.image.replace("w=100&h=100", "w=400&h=300"),
  };
}

export function filterSearchResults(query: string): SearchResults {
  if (!query.trim()) return { locations: [], restaurants: [], foods: [], chefs: [] };
  const q = query.toLowerCase();
  return {
    locations: ALL_SEARCH_DATA.locations.filter((l) => l.name.toLowerCase().includes(q)),
    restaurants: ALL_SEARCH_DATA.restaurants.filter((r) => r.name.toLowerCase().includes(q) || r.subtitle.toLowerCase().includes(q) || r.address.toLowerCase().includes(q)),
    foods: ALL_SEARCH_DATA.foods.filter((f) => f.name.toLowerCase().includes(q)),
    chefs: ALL_SEARCH_DATA.chefs.filter((c) => c.name.toLowerCase().includes(q) || c.restaurant.toLowerCase().includes(q)),
  };
}

export const ALL_SECTION_DATA: Record<string, { title: string; items: SectionItem[] }> = {
  "monthly-best": {
    title: "Monthly Best",
    items: MONTHLY_BEST.map((r) => ({ ...r, cuisine: r.cuisine, price: "$$$", reviews: 800 + Math.floor(Math.random() * 500), distance: "0.5 mi" })),
  },
  "loved-by-locals": {
    title: "Loved by Locals",
    items: LOVED_BY_LOCALS.map((r) => ({ ...r, cuisine: r.cuisine.split("\u00b7")[0].trim() })),
  },
  "viral": {
    title: "Viral on Social",
    items: VIRAL.map((r) => ({ ...r, cuisine: r.cuisine.split("\u00b7")[0].trim(), price: "$$", reviews: 1500, distance: "0.8 mi", tag: "Viral" })),
  },
  "date-night": {
    title: "Date Night Picks",
    items: DATE_NIGHT.map((r) => ({ ...r, reviews: 600, distance: "1.0 mi", tag: "Romantic" })),
  },
  "editors-choice": {
    title: "Editor's Choice",
    items: EDITORS_CHOICE.map((r) => ({ ...r, price: "$$$", reviews: 700, distance: "0.6 mi" })),
  },
  "brunch": {
    title: "Weekend Brunch Spots",
    items: [
      { id: "b1", name: "Morning Table", cuisine: "American", rating: 4.5, price: "$$", image: "https://images.unsplash.com/photo-1687276287139-88f7333c8ca4?w=400&h=300&fit=crop", reviews: 890, distance: "0.4 mi", tag: "Brunch" },
      { id: "b2", name: "Flour & Butter", cuisine: "Bakery", rating: 4.6, price: "$$", image: "https://images.unsplash.com/photo-1657502996869-6ccd568b9d41?w=400&h=300&fit=crop", reviews: 1200, distance: "0.6 mi", tag: "Pastry" },
      { id: "b3", name: "Green Bowl Co.", cuisine: "Healthy", rating: 4.4, price: "$", image: "https://images.unsplash.com/photo-1692780941487-505d5d908aa6?w=400&h=300&fit=crop", reviews: 670, distance: "0.3 mi", tag: "Bowls" },
    ],
  },
  "late-night": {
    title: "Late Night Eats",
    items: [
      { id: "ln1", name: "Midnight Ramen", cuisine: "Japanese", rating: 4.5, price: "$$", image: "https://images.unsplash.com/photo-1731460202531-bf8389d565f7?w=400&h=300&fit=crop", reviews: 1100, distance: "0.5 mi", tag: "Late Night" },
      { id: "ln2", name: "After Hours BBQ", cuisine: "Korean", rating: 4.6, price: "$$$", image: "https://images.unsplash.com/photo-1590189599125-67138c6509ef?w=400&h=300&fit=crop", reviews: 980, distance: "0.7 mi", tag: "BBQ" },
      { id: "ln3", name: "Night Owl Bar", cuisine: "Cocktails", rating: 4.3, price: "$$$", image: "https://images.unsplash.com/photo-1598990386084-8af4dd12b3b4?w=400&h=300&fit=crop", reviews: 760, distance: "0.9 mi", tag: "Bar" },
    ],
  },
  "top-picks-food": {
    title: "Top Picks by Food Type",
    items: FOOD_TYPES.map((f) => ({
      id: f.id, name: f.label, cuisine: f.label, rating: 4.5 + Math.random() * 0.4, price: "$$$",
      image: f.image, reviews: 500 + Math.floor(Math.random() * 1000), distance: "0.5 mi", tag: f.label,
    })),
  },
  "where-to-eat": {
    title: "Where to Eat?",
    items: CITIES.map((c) => ({
      id: c.id, name: `Best of ${c.label}`, cuisine: "Various", rating: 4.6, price: "$$$",
      image: c.image, reviews: 2000 + Math.floor(Math.random() * 1000), distance: c.label, tag: c.label,
    })),
  },
};
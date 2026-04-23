/* Category restaurant data + time slot generator */
import { QUICK_CATEGORIES, FOOD_TYPES } from "./discoverData";

const base = [
  { id: "cr1", name: "Sakura Omakase", cuisine: "Japanese", emoji: "", rating: 4.9, reviews: 2341, price: "$$$", image: "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=400&h=300&fit=crop", distance: "0.3 mi", waitMin: 25 as number | null },
  { id: "cr2", name: "Trattoria Moderna", cuisine: "Italian", emoji: "", rating: 4.7, reviews: 1856, price: "$$", image: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=400&h=300&fit=crop", distance: "0.5 mi", waitMin: null },
  { id: "cr3", name: "Gangnam BBQ", cuisine: "Korean", emoji: "", rating: 4.6, reviews: 1203, price: "$$$", image: "https://images.unsplash.com/photo-1590846406792-0adc7f938f1d?w=400&h=300&fit=crop", distance: "0.8 mi", waitMin: 40 },
  { id: "cr4", name: "Le Petit Bistro", cuisine: "French", emoji: "", rating: 4.8, reviews: 987, price: "$$$$", image: "https://images.unsplash.com/photo-1550966871-3ed3cdb51f3a?w=400&h=300&fit=crop", distance: "1.2 mi", waitMin: null },
  { id: "cr5", name: "The Ember Room", cuisine: "Steakhouse", emoji: "", rating: 4.8, reviews: 1543, price: "$$$", image: "https://images.unsplash.com/photo-1544025162-d76694265947?w=400&h=300&fit=crop", distance: "1.2 mi", waitMin: 15 },
  { id: "cr6", name: "Ocean Pearl", cuisine: "Seafood", emoji: "", rating: 4.7, reviews: 892, price: "$$$", image: "https://images.unsplash.com/photo-1615141982883-c7ad0e69fd62?w=400&h=300&fit=crop", distance: "1.5 mi", waitMin: null },
  { id: "cr7", name: "Golden Dragon", cuisine: "Chinese", emoji: "", rating: 4.5, reviews: 1678, price: "$$", image: "https://images.unsplash.com/photo-1552566626-52f8b828add9?w=400&h=300&fit=crop", distance: "0.9 mi", waitMin: 30 },
  { id: "cr8", name: "Siam Garden", cuisine: "Thai", emoji: "", rating: 4.6, reviews: 1203, price: "$$", image: "https://images.unsplash.com/photo-1562565652-a0d8f0c59eb4?w=400&h=300&fit=crop", distance: "0.8 mi", waitMin: null },
  { id: "cr9", name: "Saffron Palace", cuisine: "Fine Dining", emoji: "", rating: 4.9, reviews: 2100, price: "$$$$", image: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400&h=300&fit=crop", distance: "0.2 mi", waitMin: 50 },
  { id: "cr10", name: "Verde Kitchen", cuisine: "Healthy", emoji: "", rating: 4.4, reviews: 756, price: "$", image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&h=300&fit=crop", distance: "0.2 mi", waitMin: null },
  { id: "cr11", name: "Wine & Dine", cuisine: "Wine Bar", emoji: "", rating: 4.8, reviews: 1123, price: "$$$$", image: "https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400&h=300&fit=crop", distance: "0.3 mi", waitMin: 20 },
  { id: "cr12", name: "Brunch & Co", cuisine: "Brunch", emoji: "", rating: 4.6, reviews: 987, price: "$$$", image: "https://images.unsplash.com/photo-1533089860892-a7c6f0a88666?w=400&h=300&fit=crop", distance: "0.7 mi", waitMin: null },
];

export const CATEGORY_RESTAURANTS: Record<string, typeof base> = (() => {
  const result: Record<string, typeof base> = {};
  const allIds = [...QUICK_CATEGORIES.map(c => c.id), ...FOOD_TYPES.map(f => f.id), "sc1", "sc2", "sc3", "sc4", "banner-sushi"];
  for (const catId of allIds) {
    const seed = catId.charCodeAt(0) + catId.charCodeAt(catId.length - 1);
    const shuffled = [...base].sort((a, b) => {
      const ha = (a.id.charCodeAt(2) * seed) % 100;
      const hb = (b.id.charCodeAt(2) * seed) % 100;
      return ha - hb;
    });
    result[catId] = shuffled.map((r, i) => ({ ...r, id: `${catId}-${r.id}-${i}` }));
  }
  return result;
})();

export function getTimeSlots(restaurantId: string) {
  const hash = restaurantId.split("").reduce((a, c) => a + c.charCodeAt(0), 0);
  const slots = [
    "11:30", "12:00", "12:30", "13:00", "13:30",
    "17:00", "17:30", "18:00", "18:30", "19:00", "19:30", "20:00", "20:30", "21:00", "21:30",
  ];
  return slots.map((time, i) => {
    const v = (hash * (i + 1) * 7) % 100;
    return { time, open: v < 55 };
  });
}

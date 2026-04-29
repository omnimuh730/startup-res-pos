/* Explorer page data: restaurants, categories, filter options, map styles */
import type { RestaurantData } from "../detail/restaurantDetailData";

export function fmtR(n: number): string {
  if (Number.isInteger(n)) return String(n);
  const s = n.toFixed(2);
  return s.replace(/0+$/, "").replace(/\.$/, "");
}

export const LIGHT_STYLE: any = {
  version: 8,
  sources: { "osm-tiles": { type: "raster", tiles: ["https://a.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png"], tileSize: 256, maxzoom: 19, attribution: "© OpenStreetMap contributors, © CartoDB" } },
  layers: [{ id: "osm-tiles-layer", type: "raster", source: "osm-tiles", minzoom: 0, maxzoom: 19 }],
};

export const DARK_STYLE: any = {
  version: 8,
  sources: { "dark-tiles": { type: "raster", tiles: ["https://a.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png"], tileSize: 256, maxzoom: 19, attribution: "© OpenStreetMap contributors, © CartoDB" } },
  layers: [{ id: "dark-tiles-layer", type: "raster", source: "dark-tiles", minzoom: 0, maxzoom: 19 }],
};

export const USER_LOCATION = { lng: -122.4074, lat: 37.7849 };

export const RESTAURANTS: RestaurantData[] = [
  { id: "1", name: "Sakura Omakase", cuisine: "Japanese", emoji: "", rating: 4.9, reviews: 2341, price: "$$$", lng: -122.4120, lat: 37.7920, open: true, distance: "0.3 mi", image: "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=400&h=300&fit=crop" },
  { id: "2", name: "Trattoria Moderna", cuisine: "Italian", emoji: "", rating: 4.7, reviews: 1856, price: "$$", lng: -122.4180, lat: 37.7870, open: true, distance: "0.5 mi", image: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=400&h=300&fit=crop" },
  { id: "3", name: "Gangnam BBQ", cuisine: "Korean", emoji: "", rating: 4.6, reviews: 1203, price: "$$$", lng: -122.4050, lat: 37.7810, open: false, distance: "0.8 mi", image: "https://images.unsplash.com/photo-1590846406792-0adc7f938f1d?w=400&h=300&fit=crop" },
  { id: "4", name: "Le Petit Bistro", cuisine: "French", emoji: "", rating: 4.8, reviews: 987, price: "$$$$", lng: -122.3990, lat: 37.7890, open: true, distance: "1.2 mi", image: "https://images.unsplash.com/photo-1550966871-3ed3cdb51f3a?w=400&h=300&fit=crop" },
  { id: "5", name: "The Ember Room", cuisine: "Steakhouse", emoji: "", rating: 4.8, reviews: 1543, price: "$$$", lng: -122.4140, lat: 37.7760, open: true, distance: "1.2 mi", image: "https://images.unsplash.com/photo-1544025162-d76694265947?w=400&h=300&fit=crop" },
  { id: "6", name: "Ocean Pearl", cuisine: "Seafood", emoji: "", rating: 4.7, reviews: 892, price: "$$$", lng: -122.3950, lat: 37.7940, open: true, distance: "1.5 mi", image: "https://images.unsplash.com/photo-1615141982883-c7ad0e69fd62?w=400&h=300&fit=crop" },
  { id: "7", name: "Golden Dragon", cuisine: "Chinese", emoji: "", rating: 4.5, reviews: 1678, price: "$$", lng: -122.4060, lat: 37.7960, open: false, distance: "0.9 mi", image: "https://images.unsplash.com/photo-1552566626-52f8b828add9?w=400&h=300&fit=crop" },
  { id: "8", name: "Siam Garden", cuisine: "Thai", emoji: "", rating: 4.6, reviews: 1203, price: "$$", lng: -122.4200, lat: 37.7800, open: true, distance: "0.8 mi", image: "https://images.unsplash.com/photo-1562565652-a0d8f0c59eb4?w=400&h=300&fit=crop" },
  { id: "9", name: "Verde Kitchen", cuisine: "Healthy", emoji: "", rating: 4.4, reviews: 756, price: "$", lng: -122.4010, lat: 37.7830, open: true, distance: "0.2 mi", image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&h=300&fit=crop" },
  { id: "10", name: "Noodle House", cuisine: "Noodles & Soup", emoji: "", rating: 4.2, reviews: 543, price: "$", lng: -122.4100, lat: 37.7950, open: true, distance: "0.7 mi", image: "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=400&h=300&fit=crop" },
  { id: "11", name: "Cafe de Flore", cuisine: "French", emoji: "", rating: 4.5, reviews: 1234, price: "$$", lng: -122.3970, lat: 37.7780, open: true, distance: "1.3 mi", image: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=400&h=300&fit=crop" },
  { id: "12", name: "Seoul Kitchen", cuisine: "Korean", emoji: "", rating: 4.4, reviews: 876, price: "$$", lng: -122.4160, lat: 37.7910, open: false, distance: "0.4 mi", image: "https://images.unsplash.com/photo-1498654896293-37aacf113fd9?w=400&h=300&fit=crop" },
  { id: "13", name: "Saffron Palace", cuisine: "Fine Dining", emoji: "", rating: 4.9, reviews: 2100, price: "$$$$", lng: -122.4030, lat: 37.7870, open: true, distance: "0.2 mi", image: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400&h=300&fit=crop" },
  { id: "14", name: "Burger Joint", cuisine: "Grilled Beef", emoji: "", rating: 4.1, reviews: 2345, price: "$", lng: -122.4190, lat: 37.7840, open: true, distance: "1.4 mi", image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=300&fit=crop" },
  { id: "15", name: "Vegan Garden", cuisine: "Vegan", emoji: "", rating: 4.3, reviews: 654, price: "$$", lng: -122.3980, lat: 37.7920, open: true, distance: "0.8 mi", image: "https://images.unsplash.com/photo-1540914124281-342587941389?w=400&h=300&fit=crop" },
  { id: "16", name: "Steakhouse Prime", cuisine: "Steakhouse", emoji: "", rating: 4.7, reviews: 1890, price: "$$$$", lng: -122.4080, lat: 37.7770, open: true, distance: "1.0 mi", image: "https://images.unsplash.com/photo-1600891964092-4316c288032e?w=400&h=300&fit=crop" },
  { id: "17", name: "Dim Sum Palace", cuisine: "Chinese", emoji: "", rating: 4.5, reviews: 1456, price: "$$", lng: -122.4150, lat: 37.7980, open: true, distance: "0.9 mi", image: "https://images.unsplash.com/photo-1563245372-f21724e3856d?w=400&h=300&fit=crop" },
  { id: "18", name: "Pizza Roma", cuisine: "Italian", emoji: "", rating: 4.4, reviews: 2134, price: "$$", lng: -122.4020, lat: 37.7750, open: false, distance: "1.6 mi", image: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=400&h=300&fit=crop" },
  { id: "19", name: "Brunch & Co", cuisine: "Brunch", emoji: "", rating: 4.6, reviews: 987, price: "$$$", lng: -122.4210, lat: 37.7860, open: true, distance: "0.7 mi", image: "https://images.unsplash.com/photo-1533089860892-a7c6f0a88666?w=400&h=300&fit=crop" },
  { id: "20", name: "Wine & Dine", cuisine: "Wine", emoji: "", rating: 4.8, reviews: 1123, price: "$$$$", lng: -122.3960, lat: 37.7850, open: true, distance: "0.3 mi", image: "https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400&h=300&fit=crop" },
  { id: "21", name: "Tandoori Nights", cuisine: "Indian", emoji: "", rating: 4.5, reviews: 1345, price: "$$", lng: -122.4230, lat: 37.7880, open: true, distance: "1.1 mi", image: "https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400&h=300&fit=crop" },
  { id: "22", name: "Pho Saigon", cuisine: "Vietnamese", emoji: "", rating: 4.3, reviews: 987, price: "$", lng: -122.4170, lat: 37.7930, open: true, distance: "0.6 mi", image: "https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?w=400&h=300&fit=crop" },
  { id: "23", name: "El Farolito", cuisine: "Mexican", emoji: "", rating: 4.6, reviews: 2876, price: "$", lng: -122.4240, lat: 37.7520, open: true, distance: "2.3 mi", image: "https://images.unsplash.com/photo-1613514785940-daed07799d9b?w=400&h=300&fit=crop" },
  { id: "24", name: "Aegean Taverna", cuisine: "Greek", emoji: "", rating: 4.4, reviews: 678, price: "$$", lng: -122.3940, lat: 37.7900, open: true, distance: "1.0 mi", image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&h=300&fit=crop" },
  { id: "25", name: "Marrakech Express", cuisine: "Moroccan", emoji: "", rating: 4.7, reviews: 432, price: "$$$", lng: -122.4090, lat: 37.7990, open: false, distance: "1.4 mi", image: "https://images.unsplash.com/photo-1541518763669-27fef04b14ea?w=400&h=300&fit=crop" },
  { id: "26", name: "Ramen Dojo", cuisine: "Japanese", emoji: "", rating: 4.8, reviews: 1987, price: "$$", lng: -122.4110, lat: 37.7740, open: true, distance: "1.1 mi", image: "https://images.unsplash.com/photo-1557872943-16a5ac26437e?w=400&h=300&fit=crop" },
  { id: "27", name: "The Oyster Bar", cuisine: "Seafood", emoji: "", rating: 4.6, reviews: 1123, price: "$$$", lng: -122.3930, lat: 37.7960, open: true, distance: "1.3 mi", image: "https://images.unsplash.com/photo-1448043552756-e747b7a2b2b8?w=400&h=300&fit=crop" },
  { id: "28", name: "Pasta Fresca", cuisine: "Italian", emoji: "", rating: 4.5, reviews: 1456, price: "$$", lng: -122.4260, lat: 37.7810, open: true, distance: "1.5 mi", image: "https://images.unsplash.com/photo-1556761223-4c4282c73f77?w=400&h=300&fit=crop" },
  { id: "29", name: "Taqueria Luna", cuisine: "Mexican", emoji: "", rating: 4.2, reviews: 2134, price: "$", lng: -122.4130, lat: 37.7650, open: true, distance: "1.8 mi", image: "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=400&h=300&fit=crop" },
  { id: "30", name: "Spice Route", cuisine: "Indian", emoji: "", rating: 4.7, reviews: 876, price: "$$$", lng: -122.3920, lat: 37.7830, open: false, distance: "1.2 mi", image: "https://images.unsplash.com/photo-1596797038530-2c107229654b?w=400&h=300&fit=crop" },
  { id: "31", name: "Blue Fin Sushi", cuisine: "Japanese", emoji: "", rating: 4.4, reviews: 1678, price: "$$$", lng: -122.4040, lat: 37.8010, open: true, distance: "1.6 mi", image: "https://images.unsplash.com/photo-1553621042-f6e147245754?w=400&h=300&fit=crop" },
  { id: "32", name: "The Wok Station", cuisine: "Chinese", emoji: "", rating: 4.3, reviews: 1234, price: "$$", lng: -122.4200, lat: 37.7970, open: true, distance: "1.4 mi", image: "https://images.unsplash.com/photo-1525755662778-989d0524087e?w=400&h=300&fit=crop" },
  { id: "33", name: "Harvest Table", cuisine: "Healthy", emoji: "", rating: 4.6, reviews: 567, price: "$$", lng: -122.3910, lat: 37.7870, open: true, distance: "1.3 mi", image: "https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=400&h=300&fit=crop" },
  { id: "34", name: "Firehouse Grill", cuisine: "Steakhouse", emoji: "", rating: 4.5, reviews: 1890, price: "$$$", lng: -122.4170, lat: 37.7720, open: true, distance: "1.5 mi", image: "https://images.unsplash.com/photo-1558030006-450675393462?w=400&h=300&fit=crop" },
  { id: "35", name: "Lotus Thai", cuisine: "Thai", emoji: "", rating: 4.4, reviews: 987, price: "$$", lng: -122.4000, lat: 37.7950, open: false, distance: "1.0 mi", image: "https://images.unsplash.com/photo-1559314809-0d155014e29e?w=400&h=300&fit=crop" },
  { id: "36", name: "Chez Marcel", cuisine: "French", emoji: "", rating: 4.9, reviews: 654, price: "$$$$", lng: -122.4070, lat: 37.7710, open: true, distance: "1.6 mi", image: "https://images.unsplash.com/photo-1559339352-11d035aa65de?w=400&h=300&fit=crop" },
  { id: "37", name: "Seoul Street", cuisine: "Korean", emoji: "", rating: 4.3, reviews: 1345, price: "$$", lng: -122.4250, lat: 37.7860, open: true, distance: "1.3 mi", image: "https://images.unsplash.com/photo-1583224964978-2257b960c3d3?w=400&h=300&fit=crop" },
  { id: "38", name: "Crab Shack", cuisine: "Seafood", emoji: "", rating: 4.2, reviews: 2345, price: "$$", lng: -122.3900, lat: 37.8020, open: true, distance: "1.9 mi", image: "https://images.unsplash.com/photo-1559737558-2f5a35f4523b?w=400&h=300&fit=crop" },
  { id: "39", name: "Greenhouse Cafe", cuisine: "Vegan", emoji: "", rating: 4.5, reviews: 432, price: "$$", lng: -122.4130, lat: 37.7690, open: true, distance: "1.7 mi", image: "https://images.unsplash.com/photo-1494859802809-d069c3b71a8a?w=400&h=300&fit=crop" },
  { id: "40", name: "Sunrise Brunch", cuisine: "Brunch", emoji: "", rating: 4.7, reviews: 1567, price: "$$$", lng: -122.3950, lat: 37.7790, open: true, distance: "0.9 mi", image: "https://images.unsplash.com/photo-1504754524776-8f4f37790ca0?w=400&h=300&fit=crop" },
  { id: "41", name: "Istanbul Grill", cuisine: "Turkish", emoji: "", rating: 4.6, reviews: 789, price: "$$", lng: -122.4280, lat: 37.7840, open: true, distance: "1.6 mi", image: "https://images.unsplash.com/photo-1529006557810-274b9b2fc783?w=400&h=300&fit=crop" },
  { id: "42", name: "Peking Garden", cuisine: "Chinese", emoji: "", rating: 4.4, reviews: 1890, price: "$$", lng: -122.4070, lat: 37.8000, open: false, distance: "1.5 mi", image: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=400&h=300&fit=crop" },
  { id: "43", name: "Curry House", cuisine: "Indian", emoji: "", rating: 4.5, reviews: 1123, price: "$$", lng: -122.3890, lat: 37.7910, open: true, distance: "1.5 mi", image: "https://images.unsplash.com/photo-1631292784640-2b24be784d5d?w=400&h=300&fit=crop" },
  { id: "44", name: "Baja Fish Tacos", cuisine: "Mexican", emoji: "", rating: 4.1, reviews: 1678, price: "$", lng: -122.4220, lat: 37.7730, open: true, distance: "1.9 mi", image: "https://images.unsplash.com/photo-1551504734-5ee1c4a1479b?w=400&h=300&fit=crop" },
  { id: "45", name: "Miso Ramen Bar", cuisine: "Japanese", emoji: "", rating: 4.6, reviews: 2100, price: "$$", lng: -122.3980, lat: 37.7760, open: true, distance: "0.9 mi", image: "https://images.unsplash.com/photo-1591814468924-caf88d1232e1?w=400&h=300&fit=crop" },
  { id: "46", name: "Athenian Table", cuisine: "Greek", emoji: "", rating: 4.3, reviews: 543, price: "$$", lng: -122.4160, lat: 37.8030, open: true, distance: "1.8 mi", image: "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=400&h=300&fit=crop" },
  { id: "47", name: "Napoli Express", cuisine: "Italian", emoji: "", rating: 4.2, reviews: 1345, price: "$", lng: -122.4030, lat: 37.7670, open: false, distance: "1.8 mi", image: "https://images.unsplash.com/photo-1595295333158-4742f28fbd85?w=400&h=300&fit=crop" },
  { id: "48", name: "The Smokehouse", cuisine: "Steakhouse", emoji: "", rating: 4.7, reviews: 1567, price: "$$$", lng: -122.4300, lat: 37.7890, open: true, distance: "1.7 mi", image: "https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?w=400&h=300&fit=crop" },
  { id: "49", name: "Bamboo Garden", cuisine: "Thai", emoji: "", rating: 4.5, reviews: 876, price: "$$", lng: -122.3870, lat: 37.7850, open: true, distance: "1.6 mi", image: "https://images.unsplash.com/photo-1455619452474-d2be8b1e70cd?w=400&h=300&fit=crop" },
  { id: "50", name: "Provence Bistro", cuisine: "French", emoji: "", rating: 4.8, reviews: 789, price: "$$$$", lng: -122.4110, lat: 37.7680, open: true, distance: "1.7 mi", image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400&h=300&fit=crop" },
  { id: "51", name: "Banh Mi House", cuisine: "Vietnamese", emoji: "", rating: 4.4, reviews: 1234, price: "$", lng: -122.4180, lat: 37.7940, open: true, distance: "1.1 mi", image: "https://images.unsplash.com/photo-1509722747041-616f39b57569?w=400&h=300&fit=crop" },
  { id: "52", name: "Mezze Bar", cuisine: "Mediterranean", emoji: "", rating: 4.6, reviews: 678, price: "$$", lng: -122.3940, lat: 37.7980, open: true, distance: "1.4 mi", image: "https://images.unsplash.com/photo-1544025162-d76694265947?w=400&h=300&fit=crop" },
  { id: "53", name: "Fuji Mountain", cuisine: "Japanese", emoji: "", rating: 4.7, reviews: 1456, price: "$$$", lng: -122.4050, lat: 37.7700, open: false, distance: "1.5 mi", image: "https://images.unsplash.com/photo-1580822184713-fc5400e7fe10?w=400&h=300&fit=crop" },
  { id: "54", name: "Churros y Chocolate", cuisine: "Dessert", emoji: "", rating: 4.3, reviews: 987, price: "$", lng: -122.4270, lat: 37.7820, open: true, distance: "1.5 mi", image: "https://images.unsplash.com/photo-1551024506-0bccd828d307?w=400&h=300&fit=crop" },
  { id: "55", name: "Wagyu House", cuisine: "Steakhouse", emoji: "", rating: 4.9, reviews: 876, price: "$$$$", lng: -122.3910, lat: 37.7730, open: true, distance: "1.4 mi", image: "https://images.unsplash.com/photo-1546833998-877b37c2e5c6?w=400&h=300&fit=crop" },
  { id: "56", name: "Szechuan Fire", cuisine: "Chinese", emoji: "", rating: 4.5, reviews: 1678, price: "$$", lng: -122.4140, lat: 37.8040, open: true, distance: "2.0 mi", image: "https://images.unsplash.com/photo-1569058242253-92a9c755a0ec?w=400&h=300&fit=crop" },
  { id: "57", name: "Garden of Eatin", cuisine: "Vegan", emoji: "", rating: 4.4, reviews: 543, price: "$$", lng: -122.4020, lat: 37.7660, open: true, distance: "2.0 mi", image: "https://images.unsplash.com/photo-1498837167922-ddd27525d352?w=400&h=300&fit=crop" },
  { id: "58", name: "Paella y Sangria", cuisine: "Spanish", emoji: "", rating: 4.6, reviews: 765, price: "$$$", lng: -122.4290, lat: 37.7910, open: true, distance: "1.6 mi", image: "https://images.unsplash.com/photo-1534080564583-6be75777b70a?w=400&h=300&fit=crop" },
  { id: "59", name: "Katsu Corner", cuisine: "Japanese", emoji: "", rating: 4.2, reviews: 1345, price: "$$", lng: -122.3880, lat: 37.7790, open: false, distance: "1.6 mi", image: "https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?w=400&h=300&fit=crop" },
  { id: "60", name: "The Artisan", cuisine: "Fine Dining", emoji: "", rating: 4.9, reviews: 432, price: "$$$$", lng: -122.4100, lat: 37.7640, open: true, distance: "2.1 mi", image: "https://images.unsplash.com/photo-1559329007-40df8a9345d8?w=400&h=300&fit=crop" },
  { id: "61", name: "Bibimbap House", cuisine: "Korean", emoji: "", rating: 4.5, reviews: 1890, price: "$$", lng: -122.4190, lat: 37.7960, open: true, distance: "1.3 mi", image: "https://images.unsplash.com/photo-1590301157890-4810ed352733?w=400&h=300&fit=crop" },
  { id: "62", name: "Fisherman's Catch", cuisine: "Seafood", emoji: "", rating: 4.7, reviews: 1123, price: "$$$", lng: -122.3860, lat: 37.8050, open: true, distance: "2.2 mi", image: "https://images.unsplash.com/photo-1534604973900-c43ab4c2e0ab?w=400&h=300&fit=crop" },
  { id: "63", name: "La Cocina", cuisine: "Mexican", emoji: "", rating: 4.4, reviews: 2345, price: "$$", lng: -122.4230, lat: 37.7680, open: true, distance: "2.0 mi", image: "https://images.unsplash.com/photo-1599974579688-8dbdd335c77f?w=400&h=300&fit=crop" },
  { id: "64", name: "Chai & Naan", cuisine: "Indian", emoji: "", rating: 4.6, reviews: 654, price: "$$", lng: -122.3970, lat: 37.8020, open: true, distance: "1.7 mi", image: "https://images.unsplash.com/photo-1567337710282-00832b415979?w=400&h=300&fit=crop" },
  { id: "65", name: "The Crepe Studio", cuisine: "French", emoji: "", rating: 4.3, reviews: 876, price: "$$", lng: -122.4150, lat: 37.7630, open: false, distance: "2.2 mi", image: "https://images.unsplash.com/photo-1519676867240-f03562e64548?w=400&h=300&fit=crop" },
  { id: "66", name: "Wasabi Express", cuisine: "Japanese", emoji: "", rating: 4.1, reviews: 1567, price: "$", lng: -122.4060, lat: 37.7970, open: true, distance: "1.2 mi", image: "https://images.unsplash.com/photo-1617196034183-421b4917c92d?w=400&h=300&fit=crop" },
  { id: "67", name: "Olive Branch", cuisine: "Mediterranean", emoji: "", rating: 4.5, reviews: 789, price: "$$$", lng: -122.3850, lat: 37.7870, open: true, distance: "1.8 mi", image: "https://images.unsplash.com/photo-1476718406336-bb5a9690ee2a?w=400&h=300&fit=crop" },
  { id: "68", name: "Duck & Waffle", cuisine: "Brunch", emoji: "", rating: 4.7, reviews: 1234, price: "$$$", lng: -122.4310, lat: 37.7850, open: true, distance: "1.8 mi", image: "https://images.unsplash.com/photo-1525351484163-7529414344d8?w=400&h=300&fit=crop" },
  { id: "69", name: "Szechuan Garden", cuisine: "Chinese", emoji: "", rating: 4.4, reviews: 1678, price: "$$", lng: -122.4080, lat: 37.8060, open: true, distance: "2.1 mi", image: "https://images.unsplash.com/photo-1547592166-23ac45744acd?w=400&h=300&fit=crop" },
  { id: "70", name: "Portobello", cuisine: "Italian", emoji: "", rating: 4.6, reviews: 987, price: "$$$", lng: -122.3930, lat: 37.7710, open: true, distance: "1.5 mi", image: "https://images.unsplash.com/photo-1481931098730-318b6f776db0?w=400&h=300&fit=crop" },
  { id: "71", name: "Bangkok Street", cuisine: "Thai", emoji: "", rating: 4.3, reviews: 1456, price: "$", lng: -122.4200, lat: 37.7990, open: false, distance: "1.6 mi", image: "https://images.unsplash.com/photo-1562565652-a0d8f0c59eb4?w=400&h=300&fit=crop" },
  { id: "72", name: "Tapas Bonita", cuisine: "Spanish", emoji: "", rating: 4.5, reviews: 654, price: "$$", lng: -122.4010, lat: 37.7620, open: true, distance: "2.3 mi", image: "https://images.unsplash.com/photo-1515443961218-a51367888e4b?w=400&h=300&fit=crop" },
  { id: "73", name: "Grillmaster", cuisine: "Steakhouse", emoji: "", rating: 4.4, reviews: 2100, price: "$$$", lng: -122.4270, lat: 37.7930, open: true, distance: "1.5 mi", image: "https://images.unsplash.com/photo-1432139509613-5c4255a9a503?w=400&h=300&fit=crop" },
  { id: "74", name: "Matcha Cafe", cuisine: "Japanese", emoji: "", rating: 4.2, reviews: 543, price: "$", lng: -122.3900, lat: 37.7950, open: true, distance: "1.3 mi", image: "https://images.unsplash.com/photo-1536256263959-770b48d82b0a?w=400&h=300&fit=crop" },
  { id: "75", name: "Ethiopian Flame", cuisine: "Ethiopian", emoji: "", rating: 4.6, reviews: 432, price: "$$", lng: -122.4120, lat: 37.7600, open: true, distance: "2.5 mi", image: "https://images.unsplash.com/photo-1567982047351-76b6f93e38ee?w=400&h=300&fit=crop" },
  { id: "76", name: "Anchor Seafood", cuisine: "Seafood", emoji: "", rating: 4.5, reviews: 1345, price: "$$$", lng: -122.3840, lat: 37.7800, open: false, distance: "2.0 mi", image: "https://images.unsplash.com/photo-1559339352-11d035aa65de?w=400&h=300&fit=crop" },
  { id: "77", name: "Avocado Toast Co", cuisine: "Brunch", emoji: "", rating: 4.4, reviews: 1890, price: "$$", lng: -122.4240, lat: 37.7760, open: true, distance: "1.6 mi", image: "https://images.unsplash.com/photo-1482049016688-2d3e1b311543?w=400&h=300&fit=crop" },
  { id: "78", name: "Lucky Dragon", cuisine: "Chinese", emoji: "", rating: 4.0, reviews: 3456, price: "$", lng: -122.4050, lat: 37.8070, open: true, distance: "2.2 mi", image: "https://images.unsplash.com/photo-1526318896980-cf78c088247c?w=400&h=300&fit=crop" },
  { id: "79", name: "Butter & Bloom", cuisine: "French", emoji: "", rating: 4.7, reviews: 567, price: "$$$", lng: -122.3960, lat: 37.7650, open: true, distance: "2.0 mi", image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400&h=300&fit=crop" },
  { id: "80", name: "Bulgogi Brothers", cuisine: "Korean", emoji: "", rating: 4.5, reviews: 1678, price: "$$", lng: -122.4310, lat: 37.7870, open: true, distance: "1.8 mi", image: "https://images.unsplash.com/photo-1567533708067-5a3a3ab3b915?w=400&h=300&fit=crop" },
  { id: "81", name: "Masala Craft", cuisine: "Indian", emoji: "", rating: 4.8, reviews: 876, price: "$$$", lng: -122.3870, lat: 37.7920, open: true, distance: "1.7 mi", image: "https://images.unsplash.com/photo-1505253758473-96b7015fcd40?w=400&h=300&fit=crop" },
  { id: "82", name: "Taco Libre", cuisine: "Mexican", emoji: "", rating: 4.3, reviews: 2134, price: "$", lng: -122.4180, lat: 37.7580, open: false, distance: "2.7 mi", image: "https://images.unsplash.com/photo-1570461226513-e08b58a52f9e?w=400&h=300&fit=crop" },
  { id: "83", name: "Truffle & Vine", cuisine: "Fine Dining", emoji: "", rating: 4.9, reviews: 345, price: "$$$$", lng: -122.3990, lat: 37.7690, open: true, distance: "1.6 mi", image: "https://images.unsplash.com/photo-1470337458703-46ad1756a187?w=400&h=300&fit=crop" },
  { id: "84", name: "Dumpling Dynasty", cuisine: "Chinese", emoji: "", rating: 4.6, reviews: 1567, price: "$$", lng: -122.4130, lat: 37.8080, open: true, distance: "2.3 mi", image: "https://images.unsplash.com/photo-1496116218417-1a781b1c416c?w=400&h=300&fit=crop" },
  { id: "85", name: "Coastline Kitchen", cuisine: "Seafood", emoji: "", rating: 4.4, reviews: 987, price: "$$$", lng: -122.3820, lat: 37.7860, open: true, distance: "2.1 mi", image: "https://images.unsplash.com/photo-1559339352-11d035aa65de?w=400&h=300&fit=crop" },
  { id: "86", name: "Sakura Garden", cuisine: "Japanese", emoji: "", rating: 4.5, reviews: 1234, price: "$$$", lng: -122.4090, lat: 37.7590, open: true, distance: "2.6 mi", image: "https://images.unsplash.com/photo-1611143669185-af224c5e3252?w=400&h=300&fit=crop" },
  { id: "87", name: "Wild Herbs", cuisine: "Healthy", emoji: "", rating: 4.3, reviews: 654, price: "$$", lng: -122.4260, lat: 37.7950, open: true, distance: "1.5 mi", image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&h=300&fit=crop" },
  { id: "88", name: "Carnivore Club", cuisine: "Steakhouse", emoji: "", rating: 4.8, reviews: 1345, price: "$$$$", lng: -122.3850, lat: 37.7740, open: false, distance: "2.0 mi", image: "https://images.unsplash.com/photo-1588168333986-5078d3ae3976?w=400&h=300&fit=crop" },
  { id: "89", name: "Tofu Kingdom", cuisine: "Vegan", emoji: "", rating: 4.2, reviews: 432, price: "$", lng: -122.4210, lat: 37.8010, open: true, distance: "1.9 mi", image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=300&fit=crop" },
  { id: "90", name: "Lyon Brasserie", cuisine: "French", emoji: "", rating: 4.7, reviews: 789, price: "$$$$", lng: -122.3980, lat: 37.7610, open: true, distance: "2.4 mi", image: "https://images.unsplash.com/photo-1550966871-3ed3cdb51f3a?w=400&h=300&fit=crop" },
  { id: "91", name: "Pad Thai Palace", cuisine: "Thai", emoji: "", rating: 4.4, reviews: 1890, price: "$$", lng: -122.4300, lat: 37.7780, open: true, distance: "1.8 mi", image: "https://images.unsplash.com/photo-1569562211093-4ed0d0758f12?w=400&h=300&fit=crop" },
  { id: "92", name: "Golden Crisp", cuisine: "Fried Chicken", emoji: "", rating: 4.1, reviews: 2876, price: "$", lng: -122.4040, lat: 37.8090, open: true, distance: "2.4 mi", image: "https://images.unsplash.com/photo-1626645738196-c2a7c87a8f58?w=400&h=300&fit=crop" },
  { id: "93", name: "Risotto Room", cuisine: "Italian", emoji: "", rating: 4.6, reviews: 765, price: "$$$", lng: -122.3900, lat: 37.7670, open: true, distance: "1.9 mi", image: "https://images.unsplash.com/photo-1476124369491-e7addf5db371?w=400&h=300&fit=crop" },
  { id: "94", name: "Han River", cuisine: "Korean", emoji: "", rating: 4.5, reviews: 1123, price: "$$$", lng: -122.4160, lat: 37.7560, open: false, distance: "2.9 mi", image: "https://images.unsplash.com/photo-1580651214613-f4692d6d138e?w=400&h=300&fit=crop" },
  { id: "95", name: "The Juicery", cuisine: "Healthy", emoji: "", rating: 4.0, reviews: 345, price: "$", lng: -122.4020, lat: 37.8030, open: true, distance: "1.8 mi", image: "https://images.unsplash.com/photo-1622597467836-f3285f2131b8?w=400&h=300&fit=crop" },
  { id: "96", name: "Ember & Ash", cuisine: "Fine Dining", emoji: "", rating: 4.8, reviews: 567, price: "$$$$", lng: -122.3830, lat: 37.7830, open: true, distance: "2.1 mi", image: "https://images.unsplash.com/photo-1544148103-0773bf10d330?w=400&h=300&fit=crop" },
  { id: "97", name: "Wonton World", cuisine: "Chinese", emoji: "", rating: 4.3, reviews: 1456, price: "$", lng: -122.4250, lat: 37.8000, open: true, distance: "1.7 mi", image: "https://images.unsplash.com/photo-1563245372-f21724e3856d?w=400&h=300&fit=crop" },
  { id: "98", name: "Pistachio Cafe", cuisine: "Dessert", emoji: "", rating: 4.5, reviews: 876, price: "$$", lng: -122.3960, lat: 37.7570, open: true, distance: "2.8 mi", image: "https://images.unsplash.com/photo-1488477181946-6428a0291777?w=400&h=300&fit=crop" },
  { id: "99", name: "Flame & Fork", cuisine: "Steakhouse", emoji: "", rating: 4.6, reviews: 1678, price: "$$$", lng: -122.4100, lat: 37.7550, open: true, distance: "3.0 mi", image: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=400&h=300&fit=crop" },
  { id: "100", name: "Zen Bowls", cuisine: "Healthy", emoji: "", rating: 4.4, reviews: 654, price: "$$", lng: -122.4320, lat: 37.7900, open: true, distance: "1.9 mi", image: "https://images.unsplash.com/photo-1511690656952-34342bb7c2f2?w=400&h=300&fit=crop" },
];

export const CATEGORIES = [
  { id: "all", label: "All", emoji: "" }, { id: "sushi", label: "Sushi", emoji: "" },
  { id: "italian", label: "Italian", emoji: "" }, { id: "thai", label: "Thai", emoji: "" },
  { id: "korean", label: "Korean", emoji: "" }, { id: "french", label: "French", emoji: "" },
  { id: "chinese", label: "Chinese", emoji: "" }, { id: "seafood", label: "Seafood", emoji: "" },
  { id: "vegan", label: "Vegan", emoji: "" }, { id: "brunch", label: "Brunch", emoji: "" },
];

export const SORT_OPTIONS = ["Recommended", "Highest Rated", "Nearest", "Price: Low to High", "Price: High to Low", "Most Reviewed"];
export const PRICE_OPTIONS = ["$", "$$", "$$$", "$$$$"];
export const CUISINE_OPTIONS = [
  { emoji: "", label: "Grilled Beef" }, { emoji: "", label: "Grilled Pork" },
  { emoji: "", label: "Bar & Pub" }, { emoji: "", label: "Meat" }, { emoji: "", label: "Fine Dining" },
  { emoji: "", label: "Seafood" }, { emoji: "", label: "Korean" }, { emoji: "", label: "Italian" },
  { emoji: "", label: "Japanese" }, { emoji: "", label: "French" }, { emoji: "", label: "Chinese" },
  { emoji: "", label: "Thai" }, { emoji: "", label: "Wine" }, { emoji: "", label: "Brunch" },
  { emoji: "", label: "Vegan" }, { emoji: "", label: "Steakhouse" }, { emoji: "", label: "Fusion" },
  { emoji: "", label: "Healthy" }, { emoji: "", label: "Noodles & Soup" }, { emoji: "", label: "Family Meal" },
];
export const RATING_OPTIONS = ["Any", "3+", "3.5+", "4+", "4.5+"];
export const DISTANCE_OPTIONS = ["Any Distance", "Within 0.5 mi", "Within 1 mi", "Within 2 mi", "Within 5 mi"];
export const OCCASION_OPTIONS = [
  { emoji: "", label: "Date Night" }, { emoji: "", label: "Business Dinner" },
  { emoji: "", label: "Celebration" }, { emoji: "", label: "Casual Dining" },
  { emoji: "", label: "Romantic" }, { emoji: "", label: "Family-friendly" },
  { emoji: "", label: "Late Night" }, { emoji: "", label: "Quick Bite" },
];
export const SEATING_OPTIONS = [
  { emoji: "", label: "Dining Hall" }, { emoji: "", label: "Private Room" },
  { emoji: "", label: "Terrace" }, { emoji: "", label: "Window Seat" }, { emoji: "", label: "Bar" },
];
export const AMENITY_OPTIONS = [
  { emoji: "", label: "Parking" }, { emoji: "", label: "Valet" }, { emoji: "", label: "Corkage-free" },
  { emoji: "", label: "Kids Welcome" }, { emoji: "", label: "Pet Friendly" },
  { emoji: "", label: "Wi-Fi" }, { emoji: "", label: "Wheelchair Accessible" },
  { emoji: "", label: "Outdoor Seating" }, { emoji: "", label: "Private Dining" },
  { emoji: "", label: "Chef Counter" }, { emoji: "", label: "Bar Seating" },
  { emoji: "", label: "Vegan Options" }, { emoji: "", label: "Vegetarian Options" },
  { emoji: "", label: "Gluten-Free Options" }, { emoji: "", label: "Wine Pairing" },
  { emoji: "", label: "Tasting Menu" }, { emoji: "", label: "Takeout" },
  { emoji: "", label: "Delivery" }, { emoji: "", label: "Open Late" },
  { emoji: "", label: "Live Music" }, { emoji: "", label: "Rooftop" },
  { emoji: "", label: "High Chairs" }, { emoji: "", label: "No Booking Fee" },
];

export type DrawerMode = null | "all" | "sort" | "price" | "cuisine" | "amenities" | "datetime";
export type ViewMode = "map" | "detail" | "book";

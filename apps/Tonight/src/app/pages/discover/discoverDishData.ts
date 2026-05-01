/* Food-type-specific dish data for "Top Picks by Food Type" */

export const FOOD_TYPE_DISHES: Record<string, { name: string; desc: string; price: number; popular: boolean; restaurant: string; image: string }[]> = {
  "grilled-beef": [
    { name: "Wagyu Ribeye Steak", desc: "Prime A5 wagyu ribeye grilled over binchotan charcoal, served with truffle butter", price: 68, popular: true, restaurant: "The Ember Room", image: "https://images.unsplash.com/photo-1678684279246-96e6afb970f2?w=400&h=300&fit=crop" },
    { name: "Korean Galbi", desc: "Marinated beef short ribs grilled tableside with garlic and sesame", price: 36, popular: true, restaurant: "Gangnam BBQ", image: "https://images.unsplash.com/photo-1590189599125-67138c6509ef?w=400&h=300&fit=crop" },
    { name: "Tomahawk Steak", desc: "32oz bone-in ribeye dry-aged for 45 days, herb-crusted", price: 95, popular: false, restaurant: "Prime Cut House", image: "https://images.unsplash.com/photo-1544025162-d76694265947?w=400&h=300&fit=crop" },
    { name: "Beef Tartare", desc: "Hand-cut tenderloin with capers, cornichons, and quail egg", price: 24, popular: false, restaurant: "Le Petit Bistro", image: "https://images.unsplash.com/photo-1697659206568-7a0148bc5482?w=400&h=300&fit=crop" },
    { name: "Bulgogi Bowl", desc: "Thinly sliced marinated beef with steamed rice and banchan", price: 22, popular: true, restaurant: "Seoul Kitchen", image: "https://images.unsplash.com/photo-1584278858536-52532423b9ea?w=400&h=300&fit=crop" },
  ],
  "japanese": [
    { name: "Omakase Nigiri Set", desc: "12-piece chef's selection of seasonal nigiri with premium fish", price: 85, popular: true, restaurant: "Sakura Omakase", image: "https://images.unsplash.com/photo-1774635800472-41eaa93c1453?w=400&h=300&fit=crop" },
    { name: "Tonkotsu Ramen", desc: "Rich pork bone broth simmered 18 hours with chashu and ajitama egg", price: 18, popular: true, restaurant: "Midnight Ramen", image: "https://images.unsplash.com/photo-1731460202531-bf8389d565f7?w=400&h=300&fit=crop" },
    { name: "Wagyu Tataki", desc: "Seared A5 wagyu with ponzu and microgreens", price: 32, popular: true, restaurant: "Sakura Omakase", image: "https://images.unsplash.com/photo-1697659206568-7a0148bc5482?w=400&h=300&fit=crop" },
    { name: "Tempura Moriawase", desc: "Assorted seasonal tempura with tentsuyu dipping sauce", price: 26, popular: false, restaurant: "Sakura Bloom", image: "https://images.unsplash.com/photo-1681270507609-e2a5f21969b0?w=400&h=300&fit=crop" },
    { name: "Matcha Tiramisu", desc: "Japanese-Italian fusion with mascarpone cream", price: 16, popular: false, restaurant: "Sakura Omakase", image: "https://images.unsplash.com/photo-1768165335825-c2552c6b2299?w=400&h=300&fit=crop" },
  ],
  "italian": [
    { name: "Truffle Tagliatelle", desc: "Handmade egg pasta with black truffle and parmigiano cream", price: 34, popular: true, restaurant: "Trattoria Moderna", image: "https://images.unsplash.com/photo-1739417083034-4e9118f487be?w=400&h=300&fit=crop" },
    { name: "Margherita DOC", desc: "San Marzano tomato, buffalo mozzarella, fresh basil, Neapolitan style", price: 18, popular: true, restaurant: "Trattoria Moderna", image: "https://images.unsplash.com/photo-1762922425306-ef64664f6e4d?w=400&h=300&fit=crop" },
    { name: "Lobster Risotto", desc: "Creamy arborio rice with butter-poached lobster", price: 42, popular: false, restaurant: "Trattoria Moderna", image: "https://images.unsplash.com/photo-1461009683693-342af2f2d6ce?w=400&h=300&fit=crop" },
    { name: "Osso Buco", desc: "Braised veal shank with gremolata and saffron risotto", price: 38, popular: false, restaurant: "Il Giardino", image: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=400&h=300&fit=crop" },
  ],
  "chinese": [
    { name: "Xiao Long Bao", desc: "Steamed soup dumplings with pork and crab filling", price: 16, popular: true, restaurant: "Golden Dragon", image: "https://images.unsplash.com/photo-1694834589398-27b369c6f7a6?w=400&h=300&fit=crop" },
    { name: "Peking Duck", desc: "Whole roasted duck with thin pancakes, scallions, and hoisin", price: 68, popular: true, restaurant: "Golden Dragon", image: "https://images.unsplash.com/photo-1552566626-52f8b828add9?w=400&h=300&fit=crop" },
    { name: "Mapo Tofu", desc: "Silken tofu in spicy doubanjiang sauce with Sichuan peppercorn", price: 18, popular: false, restaurant: "Sichuan House", image: "https://images.unsplash.com/photo-1694834589398-27b369c6f7a6?w=400&h=300&fit=crop" },
    { name: "Char Siu Bao", desc: "Fluffy steamed buns filled with barbecue roasted pork", price: 12, popular: false, restaurant: "Golden Dragon", image: "https://images.unsplash.com/photo-1694834589398-27b369c6f7a6?w=400&h=300&fit=crop" },
  ],
};

export function generateDishesForFoodType(foodId: string, foodName: string): typeof FOOD_TYPE_DISHES["grilled-beef"] {
  const pool = FOOD_TYPE_DISHES[foodId];
  if (pool) return pool;
  return [
    { name: `${foodName} Special`, desc: `Chef's signature ${foodName.toLowerCase()} dish with premium seasonal ingredients`, price: 28, popular: true, restaurant: "Chef's Table", image: "" },
    { name: `${foodName} Platter`, desc: `A generous selection of our best ${foodName.toLowerCase()} offerings`, price: 35, popular: true, restaurant: "The Kitchen", image: "" },
    { name: `Classic ${foodName}`, desc: `Traditional ${foodName.toLowerCase()} prepared with authentic techniques`, price: 22, popular: false, restaurant: "Heritage Kitchen", image: "" },
    { name: `${foodName} Fusion`, desc: `A modern twist on ${foodName.toLowerCase()} with Asian-inspired flavors`, price: 26, popular: false, restaurant: "East Meets West", image: "" },
  ];
}

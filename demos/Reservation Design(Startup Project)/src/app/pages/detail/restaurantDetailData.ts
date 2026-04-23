/* RestaurantDetailView types, data, and helpers */

export interface RestaurantData {
  id: string;
  name: string;
  cuisine: string;
  emoji: string;
  rating: number;
  reviews: number;
  price: string;
  lng: number;
  lat: number;
  open: boolean;
  distance: string;
  image: string;
}

export function fmtR(n: number): string {
  if (Number.isInteger(n)) return String(n);
  const s = n.toFixed(2);
  return s.replace(/0+$/, "").replace(/\.$/, "");
}

export interface ReviewEntry {
  name: string;
  date: string;
  rating: number;
  taste?: number | null;
  ambience?: number | null;
  service?: number | null;
  value?: number | null;
  text: string;
}

// Mock extended data — deterministic based on restaurant id
export function getExtendedData(r: RestaurantData) {
  const descriptions: Record<string, string> = {
    "1": "Award-winning omakase experience with the freshest seasonal fish flown in daily from Tsukiji Market.",
    "2": "Authentic Neapolitan pizza and handmade pasta in a cozy Italian trattoria setting.",
    "4": "Classic French bistro cuisine with a modern twist, featuring seasonal ingredients.",
    "13": "An exquisite fine dining experience with a 12-course tasting menu by Chef Marco.",
  };
  const tags: Record<string, string[]> = {
    "1": ["Sushi", "Omakase", "Fine Dining"],
    "2": ["Pasta", "Pizza", "Wine Bar"],
    "4": ["Bistro", "Wine", "Brunch"],
    "13": ["Tasting Menu", "Fine Dining", "Wine Pairing"],
  };
  const idNum = parseInt(r.id, 10) || r.id.charCodeAt(0);
  const streetNum = (idNum * 137 + 42) % 500 + 100;
  const stNum = (idNum * 73 + 11) % 80 + 10;
  const phoneNum = (idNum * 997 + 1234) % 9000 + 1000;
  const delivMin = (idNum * 31) % 20 + 20;
  const delivMax = delivMin + (idNum * 17) % 15 + 10;
  return {
    description: descriptions[r.id] || `Experience the best of ${r.cuisine} cuisine at ${r.name}. A perfect spot for any occasion.`,
    address: `${streetNum} W ${stNum}th St`,
    hours: "Mon–Sun: 17:00 – 23:00",
    phone: `(212) 555-${String(phoneNum)}`,
    tags: tags[r.id] || [r.cuisine, "Dining"],
    closesAt: "23:00",
    deliveryTime: `${delivMin}–${delivMax} min`,
  };
}

export const MENU_IMAGES: Record<string, string> = {
  "Truffle Toro Nigiri": "https://images.unsplash.com/photo-1700324828870-43027cba6d18?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0b3JvJTIwbmlnaXJpJTIwc3VzaGl8ZW58MXx8fHwxNzc2MjE1NzgzfDA&ixlib=rb-4.1.0&q=80&w=1080",
  "Wagyu Tataki": "https://images.unsplash.com/photo-1697659206568-7a0148bc5482?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3YWd5dSUyMGJlZWYlMjB0YXRha2l8ZW58MXx8fHwxNzc2MjE1NzgzfDA&ixlib=rb-4.1.0&q=80&w=1080",
  "Uni Bruschetta": "https://images.unsplash.com/photo-1761095596656-7142a0600ecc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0b2FzdCUyMGFwcGV0aXplciUyMHNlYWZvb2R8ZW58MXx8fHwxNzc2MjE1NzkwfDA&ixlib=rb-4.1.0&q=80&w=1080",
  "Chef's Omakase": "https://images.unsplash.com/photo-1607886098701-91274ad78cf9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxvbWFrYXNlJTIwc3VzaGklMjBwbGF0dGVyfGVufDF8fHx8MTc3NjIxNTc4NHww&ixlib=rb-4.1.0&q=80&w=1080",
  "Lobster Risotto": "https://images.unsplash.com/photo-1461009683693-342af2f2d6ce?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsb2JzdGVyJTIwcmlzb3R0byUyMGRpc2h8ZW58MXx8fHwxNzc2MjE1Nzg0fDA&ixlib=rb-4.1.0&q=80&w=1080",
  "Miso Black Cod": "https://images.unsplash.com/photo-1632420758649-a9bde11730ef?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtaXNvJTIwZ2xhemVkJTIwY29kJTIwZmlzaHxlbnwxfHx8fDE3NzYyMTU3ODZ8MA&ixlib=rb-4.1.0&q=80&w=1080",
  "Matcha Tiramisu": "https://images.unsplash.com/photo-1768165335825-c2552c6b2299?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtYXRjaGElMjB0aXJhbWlzdSUyMGRlc3NlcnR8ZW58MXx8fHwxNzc2MjE1Nzg2fDA&ixlib=rb-4.1.0&q=80&w=1080",
  "Yuzu Sorbet": "https://images.unsplash.com/photo-1629245425377-b999b2a7d1ae?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsZW1vbiUyMHNvcmJldCUyMGRlc3NlcnQlMjBib3dsfGVufDF8fHx8MTc3NjIxNTc5MXww&ixlib=rb-4.1.0&q=80&w=1080",
};

export const MENU_DATA = {
  Appetizers: [
    { name: "Truffle Toro Nigiri", desc: "Bluefin tuna belly with black truffle and gold leaf", price: 28, popular: true },
    { name: "Wagyu Tataki", desc: "Seared A5 wagyu with ponzu and microgreens", price: 32, popular: true },
    { name: "Uni Bruschetta", desc: "Fresh sea urchin on crispy toast with yuzu", price: 24, popular: false },
  ],
  "Main Course": [
    { name: "Chef's Omakase", desc: "12-piece seasonal selection by the chef", price: 85, popular: true },
    { name: "Lobster Risotto", desc: "Creamy arborio rice with butter-poached lobster", price: 42, popular: false },
    { name: "Miso Black Cod", desc: "48-hour marinated cod with sweet miso glaze", price: 38, popular: true },
  ],
  Desserts: [
    { name: "Matcha Tiramisu", desc: "Japanese-Italian fusion with mascarpone cream", price: 16, popular: false },
    { name: "Yuzu Sorbet", desc: "Refreshing citrus sorbet with candied zest", price: 12, popular: false },
  ],
};

export const REVIEW_DATA: ReviewEntry[] = [
  { name: "Matthew Y.", date: "Today", rating: 5, taste: 5, ambience: 5, service: 5, value: 4, text: "Absolutely incredible experience. The omakase was a journey through flavors I never knew existed." },
  { name: "Sarah L.", date: "2 days ago", rating: 5, taste: 5, ambience: 4, service: 5, value: 4, text: "Best sushi in the city, hands down. The wagyu tataki melts in your mouth." },
  { name: "James K.", date: "1 week ago", rating: 4, taste: 4, ambience: 5, service: 3, text: "Great food and ambiance. Service was a bit slow but the quality makes up for it." },
  { name: "Emily R.", date: "2 weeks ago", rating: 5, taste: 5, ambience: 5, service: 4, value: 5, text: "We celebrated our anniversary here and it was perfect. Highly recommend the chef's omakase." },
  { name: "David M.", date: "3 weeks ago", rating: 4, taste: 5, text: "Fantastic fresh fish. The uni bruschetta is a must-try appetizer." },
  { name: "Priya S.", date: "3 weeks ago", rating: 4, taste: 4, value: 5, text: "Great value for the tasting menu — felt generous for the price." },
  { name: "Noah P.", date: "1 month ago", rating: 3, service: 3, text: "Food was fine but the waiter seemed rushed. Left a strange aftertaste for such a nice place." },
  { name: "Grace H.", date: "1 month ago", rating: 5, taste: 5, ambience: 5, text: "Dim lighting, warm wood, and perfect nigiri. Felt like being in Ginza." },
  { name: "Oliver T.", date: "1 month ago", rating: 4, taste: 4, ambience: 4, service: 4, value: 3, text: "Solid across the board. The lobster risotto was a highlight, though pricey." },
  { name: "Chloe D.", date: "1 month ago", rating: 5, taste: 5, text: "The miso cod. I dream about it." },
  { name: "Ethan B.", date: "2 months ago", rating: 4, ambience: 5, text: "Beautiful room, lovely music — we stayed talking long after dessert." },
  { name: "Ava W.", date: "2 months ago", rating: 3, taste: 4, value: 2, text: "Tasted wonderful but the portions were small for the price." },
  { name: "Lucas M.", date: "2 months ago", rating: 5, taste: 5, ambience: 5, service: 5, value: 4, text: "Our server Tomoko was fantastic — explained every course with care." },
  { name: "Mia F.", date: "2 months ago", rating: 4, taste: 5, service: 3, text: "Loved the food. Service felt a bit inattentive on a busy Saturday." },
  { name: "Leo G.", date: "3 months ago", rating: 5, taste: 5, ambience: 5, service: 5, value: 5, text: "A perfect 10. We're already planning our next visit." },
  { name: "Zoe N.", date: "3 months ago", rating: 2, service: 2, text: "We waited 30 minutes past our reservation. Disappointing for a special occasion." },
  { name: "Henry C.", date: "3 months ago", rating: 4, value: 4, text: "Prices are high but you get what you pay for. Would return for celebrations." },
  { name: "Isla J.", date: "3 months ago", rating: 5, ambience: 5, service: 5, text: "Calm, hushed, elegant. The kind of dinner that resets your week." },
  { name: "Mason V.", date: "4 months ago", rating: 4, taste: 4, ambience: 4, value: 3, text: "Great date night. Wine list was impressive though expensive by the glass." },
  { name: "Aria K.", date: "4 months ago", rating: 5, taste: 5, text: "Truffle toro nigiri is transcendent." },
  { name: "Caleb Z.", date: "4 months ago", rating: 3, taste: 3, ambience: 4, service: 3, value: 3, text: "Fine, not memorable. Expected more given the hype." },
  { name: "Ruby E.", date: "5 months ago", rating: 5, taste: 5, ambience: 5, service: 5, text: "Every bite had intention. Service was warm without being intrusive." },
  { name: "Finn O.", date: "5 months ago", rating: 4, service: 5, text: "Our waiter saved the night when we realized we were celebrating our anniversary a day early." },
  { name: "Sophia Q.", date: "5 months ago", rating: 4, taste: 5, value: 3, text: "The food earned its stars. I'd come back for a special evening, not a Tuesday." },
  { name: "Jack H.", date: "6 months ago", rating: 5, taste: 5, ambience: 5, service: 4, value: 4, text: "Brought my parents for their anniversary. They still talk about it." },
  { name: "Layla R.", date: "6 months ago", rating: 3, ambience: 3, text: "Food was great but the acoustics were tough — hard to hear our own conversation." },
  { name: "Tobias W.", date: "6 months ago", rating: 4, taste: 4, service: 4, text: "Everything good, nothing surprising. Dependable special-occasion spot." },
  { name: "Nora P.", date: "7 months ago", rating: 5, taste: 5, ambience: 5, service: 5, value: 5, text: "Worth every penny. The matcha tiramisu is an event." },
  { name: "Owen L.", date: "7 months ago", rating: 4, taste: 4, ambience: 5, text: "Romantic lighting, quiet tables. Food was a strong 8/10." },
  { name: "Eva S.", date: "8 months ago", rating: 5, taste: 5, service: 5, text: "First omakase ever and we were nervous — the staff put us completely at ease." },
];

export const FOOD_DETAILS: Record<string, { ingredients: string[]; allergens: string[]; pairings: string[]; calories: number; prepTime: string }> = {
  "Truffle Toro Nigiri": { ingredients: ["Bluefin tuna belly", "Black truffle shavings", "Gold leaf", "Seasoned sushi rice", "Wasabi"], allergens: ["Fish", "Gluten"], pairings: ["Junmai Daiginjo Sake", "Champagne Brut"], calories: 180, prepTime: "5 min" },
  "Wagyu Tataki": { ingredients: ["A5 Wagyu beef", "Ponzu sauce", "Microgreens", "Shallots", "Garlic chips"], allergens: ["Soy"], pairings: ["Pinot Noir", "Craft IPA"], calories: 320, prepTime: "8 min" },
  "Uni Bruschetta": { ingredients: ["Fresh sea urchin", "Crispy sourdough", "Yuzu zest", "Chive oil", "Sea salt flakes"], allergens: ["Shellfish", "Gluten"], pairings: ["Chablis", "Dry Riesling"], calories: 220, prepTime: "5 min" },
  "Chef's Omakase": { ingredients: ["12 seasonal nigiri pieces", "Chef's selection of premium fish", "House-made pickled ginger", "Fresh wasabi"], allergens: ["Fish", "Shellfish", "Soy"], pairings: ["Premium Sake Flight", "Grüner Veltliner"], calories: 650, prepTime: "25 min" },
  "Lobster Risotto": { ingredients: ["Butter-poached lobster tail", "Arborio rice", "Parmesan", "Lobster bisque", "Fresh herbs"], allergens: ["Shellfish", "Dairy", "Gluten"], pairings: ["Chardonnay", "Viognier"], calories: 580, prepTime: "18 min" },
  "Miso Black Cod": { ingredients: ["Chilean sea bass", "White miso paste", "Mirin", "Sake", "Pickled daikon"], allergens: ["Fish", "Soy"], pairings: ["Sake Nigori", "Gewürztraminer"], calories: 420, prepTime: "15 min" },
  "Matcha Tiramisu": { ingredients: ["Mascarpone cream", "Ceremonial matcha", "Ladyfingers", "White chocolate", "Espresso"], allergens: ["Dairy", "Gluten", "Eggs"], pairings: ["Matcha Latte", "Dessert Wine"], calories: 380, prepTime: "10 min" },
  "Yuzu Sorbet": { ingredients: ["Fresh yuzu juice", "Cane sugar", "Candied yuzu zest", "Mint leaf"], allergens: [], pairings: ["Prosecco", "Sparkling Water"], calories: 120, prepTime: "3 min" },
};

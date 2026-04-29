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
    { name: "Crispy Rice Spicy Tuna", desc: "Crispy sushi rice with spicy tuna tartare", price: 19, popular: true },
    { name: "Hamachi Jalapeno", desc: "Yellowtail sashimi with jalapeno ponzu", price: 21, popular: false },
    { name: "Shiso Shrimp Tempura", desc: "Light battered shrimp wrapped in shiso", price: 18, popular: false },
    { name: "King Crab Gyoza", desc: "Pan-seared dumplings filled with king crab", price: 22, popular: true },
    { name: "Agedashi Tofu", desc: "Silken tofu with savory dashi broth", price: 12, popular: false },
    { name: "Miso Eggplant Skewers", desc: "Charred eggplant with sweet miso glaze", price: 13, popular: false },
    { name: "Salmon Tartare Cone", desc: "Crispy nori cone with salmon tartare", price: 15, popular: true },
    { name: "Citrus Oyster Shooter", desc: "Fresh oyster with yuzu and ponzu", price: 17, popular: false },
    { name: "Karaage Chicken Bites", desc: "Japanese fried chicken with lemon aioli", price: 16, popular: true },
    { name: "Smoked Edamame", desc: "Sea-salted edamame with smoked soy", price: 9, popular: false },
    { name: "Truffle Mushroom Gyoza", desc: "Pan-crisped dumplings with truffle", price: 14, popular: false },
    { name: "Chili Garlic Lotus Chips", desc: "Crispy lotus root with chili garlic", price: 11, popular: false },
  ],
  Nigiri: [
    { name: "Otoro Nigiri", desc: "Premium fatty tuna nigiri", price: 14, popular: true },
    { name: "Chutoro Nigiri", desc: "Medium fatty tuna nigiri", price: 12, popular: true },
    { name: "Kanpachi Nigiri", desc: "Amberjack nigiri", price: 10, popular: false },
    { name: "Salmon Belly Nigiri", desc: "Rich salmon belly cut", price: 9, popular: false },
    { name: "Scallop Nigiri", desc: "Sweet Hokkaido scallop", price: 11, popular: true },
    { name: "Uni Nigiri", desc: "Fresh sea urchin", price: 16, popular: true },
    { name: "Anago Nigiri", desc: "Sea eel with tare glaze", price: 10, popular: false },
    { name: "A5 Wagyu Nigiri", desc: "Lightly torched A5 wagyu", price: 18, popular: true },
    { name: "Sea Bream Nigiri", desc: "Delicate madai with citrus salt", price: 11, popular: false },
    { name: "Ikura Nigiri", desc: "Salmon roe over seasoned rice", price: 12, popular: true },
    { name: "Flounder Fin Nigiri", desc: "Engawa with yuzu kosho", price: 13, popular: false },
    { name: "Sweet Shrimp Nigiri", desc: "Botan ebi nigiri", price: 13, popular: false },
    { name: "Spanish Mackerel Nigiri", desc: "Aburi sawara with ginger", price: 12, popular: false },
    { name: "King Salmon Nigiri", desc: "Rich king salmon cut", price: 12, popular: true },
    { name: "Scampi Nigiri", desc: "Langoustine nigiri with ponzu", price: 14, popular: false },
  ],
  Sashimi: [
    { name: "Bluefin Tuna Sashimi", desc: "Chef-selected tuna cuts", price: 26, popular: true },
    { name: "Hamachi Sashimi", desc: "Yellowtail sashimi with citrus", price: 22, popular: false },
    { name: "Salmon Sashimi", desc: "Norwegian salmon sashimi", price: 20, popular: false },
    { name: "Botan Ebi Sashimi", desc: "Sweet shrimp sashimi", price: 24, popular: true },
    { name: "Hokkaido Scallop Sashimi", desc: "Fresh scallop sashimi", price: 23, popular: false },
    { name: "Madai Sashimi", desc: "Sea bream sashimi", price: 21, popular: false },
    { name: "Octopus Sashimi", desc: "Tender octopus slices", price: 19, popular: false },
    { name: "Chef Sashimi Assortment", desc: "Daily sashimi selection", price: 42, popular: true },
    { name: "King Salmon Sashimi", desc: "Premium king salmon", price: 24, popular: true },
    { name: "Toro Flight Sashimi", desc: "Otoro, chutoro, akami selection", price: 39, popular: true },
    { name: "Shima Aji Sashimi", desc: "Striped jack sashimi", price: 25, popular: false },
    { name: "Tasmanian Trout Sashimi", desc: "Silky ocean trout slices", price: 22, popular: false },
    { name: "Live Scallop Carpaccio", desc: "Scallop with citrus oil", price: 26, popular: true },
    { name: "Toro Tataki Sashimi", desc: "Lightly torched fatty tuna", price: 29, popular: false },
    { name: "Amberjack Ponzu Sashimi", desc: "Kanpachi with house ponzu", price: 23, popular: false },
  ],
  Rolls: [
    { name: "Dragon Roll", desc: "Eel, cucumber, avocado", price: 18, popular: true },
    { name: "Spicy Tuna Roll", desc: "Tuna, spicy mayo, cucumber", price: 14, popular: true },
    { name: "Rainbow Roll", desc: "California roll topped with fish", price: 19, popular: true },
    { name: "Soft Shell Crab Roll", desc: "Crispy crab with tobiko", price: 17, popular: false },
    { name: "Lobster Tempura Roll", desc: "Tempura lobster with aioli", price: 23, popular: true },
    { name: "Volcano Roll", desc: "Baked seafood spicy roll", price: 18, popular: false },
    { name: "Shrimp Tempura Roll", desc: "Tempura shrimp and avocado", price: 15, popular: false },
    { name: "Cucumber Avocado Roll", desc: "Classic veggie maki", price: 11, popular: false },
    { name: "Spicy Scallop Roll", desc: "Scallop and chili mayo", price: 17, popular: true },
    { name: "Crispy Salmon Skin Roll", desc: "Crunchy salmon skin and cucumber", price: 13, popular: false },
    { name: "Eel Avocado Roll", desc: "Grilled eel and avocado", price: 16, popular: false },
    { name: "Truffle California Roll", desc: "Snow crab, avocado, truffle", price: 18, popular: true },
    { name: "Spicy Hamachi Roll", desc: "Yellowtail with spicy sauce", price: 16, popular: false },
    { name: "Surf & Turf Roll", desc: "Wagyu and lobster fusion roll", price: 24, popular: true },
    { name: "Tempura Veggie Roll", desc: "Seasonal vegetable tempura roll", price: 13, popular: false },
  ],
  "Main Course": [
    { name: "Chef's Omakase", desc: "12-piece seasonal selection by the chef", price: 85, popular: true },
    { name: "Lobster Risotto", desc: "Creamy arborio rice with butter-poached lobster", price: 42, popular: false },
    { name: "Miso Black Cod", desc: "48-hour marinated cod with sweet miso glaze", price: 38, popular: true },
    { name: "Wagyu Striploin", desc: "Charcoal grilled wagyu striploin", price: 56, popular: true },
    { name: "Grilled Branzino", desc: "Mediterranean sea bass with herbs", price: 36, popular: false },
    { name: "Short Rib Robata", desc: "Soy-braised short ribs over robata", price: 39, popular: false },
    { name: "Seafood Hot Pot", desc: "Nabe with shellfish and vegetables", price: 44, popular: true },
    { name: "Duck Breast Teriyaki", desc: "Pan-seared duck with teriyaki glaze", price: 35, popular: false },
    { name: "Miso Butter Lobster", desc: "Roasted lobster with miso butter", price: 58, popular: true },
    { name: "Charred Octopus Steak", desc: "Octopus with potato puree", price: 37, popular: false },
    { name: "Yuzu Glazed Salmon", desc: "Salmon filet with yuzu reduction", price: 34, popular: false },
    { name: "Wagyu Sukiyaki", desc: "Hot sukiyaki pot with wagyu", price: 49, popular: true },
    { name: "Teriyaki Sea Bass", desc: "Sea bass with sesame vegetables", price: 36, popular: false },
    { name: "Lamb Loin Miso", desc: "Miso-marinated lamb loin", price: 41, popular: false },
    { name: "Truffle Chicken Katsu", desc: "Crispy katsu with truffle curry", price: 29, popular: true },
  ],
  Noodles: [
    { name: "Uni Cream Udon", desc: "Udon in uni cream sauce", price: 28, popular: true },
    { name: "Spicy Miso Ramen", desc: "Ramen with spicy miso broth", price: 20, popular: false },
    { name: "Truffle Soba", desc: "Cold soba with truffle soy", price: 19, popular: false },
    { name: "Lobster Yaki Udon", desc: "Stir-fried udon with lobster", price: 31, popular: true },
    { name: "Beef Sukiyaki Udon", desc: "Sweet soy beef udon", price: 24, popular: false },
    { name: "Tempura Soba", desc: "Buckwheat noodles with tempura", price: 22, popular: false },
    { name: "Mushroom Garlic Udon", desc: "Roasted mushrooms and garlic butter", price: 18, popular: false },
    { name: "Seafood Yaki Soba", desc: "Wok-tossed soba with seafood", price: 25, popular: true },
    { name: "Duck Broth Ramen", desc: "Rich duck stock with noodles", price: 23, popular: false },
    { name: "Spicy Seafood Udon", desc: "Seafood udon in chili broth", price: 27, popular: true },
    { name: "Cold Sesame Udon", desc: "Chilled udon with sesame sauce", price: 17, popular: false },
    { name: "Mentaiko Pasta", desc: "Japanese cod roe cream pasta", price: 24, popular: true },
    { name: "Tofu Curry Udon", desc: "Silken tofu and curry udon", price: 19, popular: false },
    { name: "Sukiyaki Nabe Udon", desc: "Sukiyaki style udon hot pot", price: 26, popular: false },
    { name: "Garlic Chili Ramen", desc: "Aromatic chili garlic ramen", price: 21, popular: false },
  ],
  Desserts: [
    { name: "Matcha Tiramisu", desc: "Japanese-Italian fusion with mascarpone cream", price: 16, popular: false },
    { name: "Yuzu Sorbet", desc: "Refreshing citrus sorbet with candied zest", price: 12, popular: false },
    { name: "Black Sesame Creme Brulee", desc: "Torch-finished custard dessert", price: 14, popular: true },
    { name: "Mochi Trio", desc: "Assorted mochi ice cream", price: 13, popular: false },
    { name: "Hojicha Cheesecake", desc: "Roasted tea flavored cheesecake", price: 15, popular: false },
    { name: "Yuzu Panna Cotta", desc: "Silky panna cotta with yuzu", price: 12, popular: false },
    { name: "Chocolate Miso Tart", desc: "Dark chocolate tart with miso caramel", price: 14, popular: true },
    { name: "Strawberry Daifuku", desc: "Fresh strawberry rice cake", price: 11, popular: false },
    { name: "Matcha Lava Cake", desc: "Warm matcha cake with molten center", price: 15, popular: true },
    { name: "Salted Caramel Mochi", desc: "Chewy mochi with caramel filling", price: 12, popular: false },
    { name: "Black Sesame Ice Cream", desc: "House black sesame gelato", price: 10, popular: false },
    { name: "Yuzu Lemon Tart", desc: "Citrus tart with meringue", price: 13, popular: false },
    { name: "Mochi Cheesecake Bites", desc: "Cheesecake wrapped in mochi", price: 12, popular: false },
    { name: "Pistachio Matcha Parfait", desc: "Layered parfait dessert", price: 14, popular: true },
    { name: "Warm Hojicha Pudding", desc: "Roasted tea custard pudding", price: 11, popular: false },
  ],
  Beverages: [
    { name: "Yuzu Sparkling Soda", desc: "House yuzu citrus soda", price: 9, popular: false },
    { name: "Cold Brew Matcha", desc: "Ceremonial matcha over ice", price: 10, popular: true },
    { name: "Japanese Highball", desc: "Whisky soda with lemon peel", price: 14, popular: true },
    { name: "Sake Flight", desc: "Three premium sake pours", price: 26, popular: true },
    { name: "Plum Wine Spritz", desc: "Umeshu with sparkling water", price: 13, popular: false },
    { name: "Hojicha Latte", desc: "Roasted tea milk latte", price: 8, popular: false },
    { name: "Ginger Citrus Cooler", desc: "Fresh ginger and citrus tonic", price: 9, popular: false },
    { name: "Sparkling Mineral Water", desc: "750ml bottle", price: 7, popular: false },
    { name: "Lychee Jasmine Tea", desc: "Floral jasmine with lychee", price: 9, popular: false },
    { name: "Cucumber Mint Tonic", desc: "Refreshing cucumber tonic", price: 8, popular: false },
    { name: "Genmaicha Iced Tea", desc: "Roasted rice green tea", price: 7, popular: false },
    { name: "Smoked Old Fashioned", desc: "Whisky cocktail with smoke", price: 16, popular: true },
    { name: "Yuzu Margarita", desc: "Citrus-forward house margarita", price: 15, popular: true },
    { name: "Sakura Fizz", desc: "Cherry blossom inspired mocktail", price: 10, popular: false },
    { name: "Cold Brew Coffee", desc: "Single-origin cold brew", price: 7, popular: false },
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

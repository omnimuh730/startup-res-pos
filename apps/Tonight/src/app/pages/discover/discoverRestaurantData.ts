/* City-specific and food-type-specific restaurant pools */

export const CITY_RESTAURANTS: Record<string, { name: string; cuisine: string; rating: number; price: string; reviews: number; image: string }[]> = {
  sf: [
    { name: "Fog City Diner", cuisine: "American", rating: 4.5, price: "$$", reviews: 1823, image: "https://images.unsplash.com/photo-1466978913421-dad2ebd01d17?w=400&h=300&fit=crop" },
    { name: "Mission Burrito Bar", cuisine: "Mexican", rating: 4.4, price: "$", reviews: 3210, image: "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=400&h=300&fit=crop" },
    { name: "Golden Gate Sushi", cuisine: "Japanese", rating: 4.8, price: "$$$", reviews: 987, image: "https://images.unsplash.com/photo-1553621042-f6e147245754?w=400&h=300&fit=crop" },
    { name: "Fisherman's Catch", cuisine: "Seafood", rating: 4.6, price: "$$$", reviews: 1456, image: "https://images.unsplash.com/photo-1559737558-2f5a35f4523b?w=400&h=300&fit=crop" },
    { name: "SOMA Noodle House", cuisine: "Chinese", rating: 4.3, price: "$$", reviews: 2100, image: "https://images.unsplash.com/photo-1563245372-f21724e3856d?w=400&h=300&fit=crop" },
    { name: "Bay Breeze Caf\u00e9", cuisine: "Brunch", rating: 4.5, price: "$$", reviews: 890, image: "https://images.unsplash.com/photo-1687276287139-88f7333c8ca4?w=400&h=300&fit=crop" },
  ],
  ny: [
    { name: "Brooklyn Steakhouse", cuisine: "Steakhouse", rating: 4.7, price: "$$$$", reviews: 2341, image: "https://images.unsplash.com/photo-1544025162-d76694265947?w=400&h=300&fit=crop" },
    { name: "Little Italy Trattoria", cuisine: "Italian", rating: 4.6, price: "$$$", reviews: 1856, image: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=400&h=300&fit=crop" },
    { name: "Harlem Soul Kitchen", cuisine: "Soul Food", rating: 4.5, price: "$$", reviews: 1678, image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&h=300&fit=crop" },
    { name: "Times Square Sushi", cuisine: "Japanese", rating: 4.8, price: "$$$$", reviews: 1234, image: "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=400&h=300&fit=crop" },
    { name: "Chelsea Market Tacos", cuisine: "Mexican", rating: 4.4, price: "$", reviews: 3456, image: "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=400&h=300&fit=crop" },
    { name: "SoHo Wine & Dine", cuisine: "French", rating: 4.9, price: "$$$$", reviews: 567, image: "https://images.unsplash.com/photo-1559339352-11d035aa65de?w=400&h=300&fit=crop" },
  ],
  la: [
    { name: "Sunset Strip Grill", cuisine: "American", rating: 4.5, price: "$$$", reviews: 1890, image: "https://images.unsplash.com/photo-1529006557810-274b9b2fc783?w=400&h=300&fit=crop" },
    { name: "K-Town BBQ King", cuisine: "Korean BBQ", rating: 4.7, price: "$$", reviews: 2678, image: "https://images.unsplash.com/photo-1590189599125-67138c6509ef?w=400&h=300&fit=crop" },
    { name: "Venice Beach Bowls", cuisine: "Healthy", rating: 4.4, price: "$$", reviews: 1234, image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&h=300&fit=crop" },
    { name: "Santa Monica Seafood", cuisine: "Seafood", rating: 4.6, price: "$$$", reviews: 1567, image: "https://images.unsplash.com/photo-1559737558-2f5a35f4523b?w=400&h=300&fit=crop" },
    { name: "Hollywood Thai", cuisine: "Thai", rating: 4.5, price: "$$", reviews: 2100, image: "https://images.unsplash.com/photo-1455619452474-d2be8b1e70cd?w=400&h=300&fit=crop" },
    { name: "Beverly Hills Omakase", cuisine: "Japanese", rating: 4.9, price: "$$$$", reviews: 456, image: "https://images.unsplash.com/photo-1553621042-f6e147245754?w=400&h=300&fit=crop" },
  ],
  seattle: [
    { name: "Pike Place Chowder", cuisine: "Seafood", rating: 4.7, price: "$$", reviews: 3890, image: "https://images.unsplash.com/photo-1559737558-2f5a35f4523b?w=400&h=300&fit=crop" },
    { name: "Capitol Hill Ramen", cuisine: "Japanese", rating: 4.5, price: "$$", reviews: 1678, image: "https://images.unsplash.com/photo-1553621042-f6e147245754?w=400&h=300&fit=crop" },
    { name: "Ballard Brewery Bites", cuisine: "Gastropub", rating: 4.4, price: "$$", reviews: 1234, image: "https://images.unsplash.com/photo-1598990386084-8af4dd12b3b4?w=400&h=300&fit=crop" },
    { name: "Fremont Coffee & Brunch", cuisine: "Brunch", rating: 4.6, price: "$$", reviews: 890, image: "https://images.unsplash.com/photo-1687276287139-88f7333c8ca4?w=400&h=300&fit=crop" },
    { name: "Intl District Dim Sum", cuisine: "Chinese", rating: 4.5, price: "$", reviews: 2345, image: "https://images.unsplash.com/photo-1563245372-f21724e3856d?w=400&h=300&fit=crop" },
    { name: "Queen Anne Thai", cuisine: "Thai", rating: 4.3, price: "$$", reviews: 1100, image: "https://images.unsplash.com/photo-1455619452474-d2be8b1e70cd?w=400&h=300&fit=crop" },
  ],
};

export const FOOD_TYPE_RESTAURANTS: Record<string, { name: string; cuisine: string; rating: number; price: string; reviews: number; image: string }[]> = {
  "grilled-beef": [
    { name: "Ember & Oak Steakhouse", cuisine: "Grilled Beef", rating: 4.8, price: "$$$", reviews: 2341, image: "https://images.unsplash.com/photo-1544025162-d76694265947?w=400&h=300&fit=crop" },
    { name: "Prime Cut Grill", cuisine: "Grilled Beef", rating: 4.7, price: "$$$$", reviews: 1856, image: "https://images.unsplash.com/photo-1529006557810-274b9b2fc783?w=400&h=300&fit=crop" },
    { name: "Wagyu House", cuisine: "Grilled Beef", rating: 4.9, price: "$$$$", reviews: 987, image: "https://images.unsplash.com/photo-1678684279246-96e6afb970f2?w=400&h=300&fit=crop" },
    { name: "Charcoal & Flame", cuisine: "Grilled Beef", rating: 4.6, price: "$$$", reviews: 1543, image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&h=300&fit=crop" },
    { name: "Seoul Galbi House", cuisine: "Grilled Beef", rating: 4.7, price: "$$", reviews: 2678, image: "https://images.unsplash.com/photo-1590189599125-67138c6509ef?w=400&h=300&fit=crop" },
  ],
  "grilled-pork": [
    { name: "Samgyeopsal Master", cuisine: "Grilled Pork", rating: 4.6, price: "$$", reviews: 1890, image: "https://images.unsplash.com/photo-1526366411709-472085c8a586?w=400&h=300&fit=crop" },
    { name: "Pork Belly House", cuisine: "Grilled Pork", rating: 4.5, price: "$$", reviews: 2345, image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&h=300&fit=crop" },
    { name: "The Smokehouse BBQ", cuisine: "Grilled Pork", rating: 4.7, price: "$$$", reviews: 1678, image: "https://images.unsplash.com/photo-1529006557810-274b9b2fc783?w=400&h=300&fit=crop" },
    { name: "K-BBQ Pork Joint", cuisine: "Grilled Pork", rating: 4.4, price: "$$", reviews: 3210, image: "https://images.unsplash.com/photo-1590189599125-67138c6509ef?w=400&h=300&fit=crop" },
    { name: "Golden Pork Grill", cuisine: "Grilled Pork", rating: 4.6, price: "$$", reviews: 1456, image: "https://images.unsplash.com/photo-1544025162-d76694265947?w=400&h=300&fit=crop" },
  ],
  "bar-pub": [
    { name: "The Craft Taproom", cuisine: "Bar & Pub", rating: 4.5, price: "$$", reviews: 1890, image: "https://images.unsplash.com/photo-1598990386084-8af4dd12b3b4?w=400&h=300&fit=crop" },
    { name: "Night Owl Lounge", cuisine: "Bar & Pub", rating: 4.3, price: "$$$", reviews: 1234, image: "https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400&h=300&fit=crop" },
    { name: "Hoppy Place", cuisine: "Bar & Pub", rating: 4.6, price: "$$", reviews: 2100, image: "https://images.unsplash.com/photo-1466978913421-dad2ebd01d17?w=400&h=300&fit=crop" },
    { name: "The Whiskey Den", cuisine: "Bar & Pub", rating: 4.7, price: "$$$", reviews: 876, image: "https://images.unsplash.com/photo-1559339352-11d035aa65de?w=400&h=300&fit=crop" },
  ],
  japanese: [
    { name: "Sakura Omakase", cuisine: "Japanese", rating: 4.9, price: "$$$$", reviews: 1234, image: "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=400&h=300&fit=crop" },
    { name: "Ramen Ichiban", cuisine: "Japanese", rating: 4.5, price: "$$", reviews: 2678, image: "https://images.unsplash.com/photo-1553621042-f6e147245754?w=400&h=300&fit=crop" },
    { name: "Tempura Garden", cuisine: "Japanese", rating: 4.7, price: "$$$", reviews: 987, image: "https://images.unsplash.com/photo-1515669097368-22e68427d265?w=400&h=300&fit=crop" },
    { name: "Sushi Kaze", cuisine: "Japanese", rating: 4.8, price: "$$$$", reviews: 567, image: "https://images.unsplash.com/photo-1681270507609-e2a5f21969b0?w=400&h=300&fit=crop" },
    { name: "Izakaya Tanaka", cuisine: "Japanese", rating: 4.4, price: "$$", reviews: 1890, image: "https://images.unsplash.com/photo-1553621042-f6e147245754?w=400&h=300&fit=crop" },
  ],
  italian: [
    { name: "Trattoria Moderna", cuisine: "Italian", rating: 4.7, price: "$$$", reviews: 1856, image: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=400&h=300&fit=crop" },
    { name: "Pasta Republic", cuisine: "Italian", rating: 4.6, price: "$$", reviews: 2341, image: "https://images.unsplash.com/photo-1473093295043-cdd812d0e601?w=400&h=300&fit=crop" },
    { name: "Osteria Bella", cuisine: "Italian", rating: 4.8, price: "$$$$", reviews: 923, image: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400&h=300&fit=crop" },
    { name: "Napoli Pizza Co.", cuisine: "Italian", rating: 4.5, price: "$$", reviews: 3456, image: "https://images.unsplash.com/photo-1762922425306-ef64664f6e4d?w=400&h=300&fit=crop" },
  ],
  brunch: [
    { name: "Morning Table", cuisine: "Brunch", rating: 4.5, price: "$$", reviews: 1890, image: "https://images.unsplash.com/photo-1687276287139-88f7333c8ca4?w=400&h=300&fit=crop" },
    { name: "Flour & Butter", cuisine: "Brunch", rating: 4.6, price: "$$", reviews: 1234, image: "https://images.unsplash.com/photo-1495214783159-3503fd1b572d?w=400&h=300&fit=crop" },
    { name: "Sunny Side Caf\u00e9", cuisine: "Brunch", rating: 4.4, price: "$", reviews: 2567, image: "https://images.unsplash.com/photo-1533089860892-a7c6f0a88666?w=400&h=300&fit=crop" },
    { name: "The Pancake Parlor", cuisine: "Brunch", rating: 4.7, price: "$$", reviews: 1678, image: "https://images.unsplash.com/photo-1687276287139-88f7333c8ca4?w=400&h=300&fit=crop" },
  ],
  thai: [
    { name: "Baan Thai", cuisine: "Thai", rating: 4.6, price: "$$", reviews: 2103, image: "https://images.unsplash.com/photo-1455619452474-d2be8b1e70cd?w=400&h=300&fit=crop" },
    { name: "Siam Garden", cuisine: "Thai", rating: 4.5, price: "$$", reviews: 1456, image: "https://images.unsplash.com/photo-1562565652-a0d8f0c59eb4?w=400&h=300&fit=crop" },
    { name: "Thai Spice Market", cuisine: "Thai", rating: 4.7, price: "$$", reviews: 1890, image: "https://images.unsplash.com/photo-1455619452474-d2be8b1e70cd?w=400&h=300&fit=crop" },
    { name: "Pad Thai Palace", cuisine: "Thai", rating: 4.4, price: "$", reviews: 3210, image: "https://images.unsplash.com/photo-1562565652-a0d8f0c59eb4?w=400&h=300&fit=crop" },
  ],
  french: [
    { name: "Le Petit Bistro", cuisine: "French", rating: 4.8, price: "$$$$", reviews: 567, image: "https://images.unsplash.com/photo-1559339352-11d035aa65de?w=400&h=300&fit=crop" },
    { name: "Chez Marcel", cuisine: "French", rating: 4.7, price: "$$$", reviews: 1234, image: "https://images.unsplash.com/photo-1550966871-3ed3cdb51f3a?w=400&h=300&fit=crop" },
    { name: "Boulangerie Parisienne", cuisine: "French", rating: 4.6, price: "$$", reviews: 890, image: "https://images.unsplash.com/photo-1657502996869-6ccd568b9d41?w=400&h=300&fit=crop" },
    { name: "Maison de Vin", cuisine: "French", rating: 4.9, price: "$$$$", reviews: 412, image: "https://images.unsplash.com/photo-1559339352-11d035aa65de?w=400&h=300&fit=crop" },
  ],
  chinese: [
    { name: "Golden Dragon Palace", cuisine: "Chinese", rating: 4.5, price: "$$", reviews: 2987, image: "https://images.unsplash.com/photo-1563245372-f21724e3856d?w=400&h=300&fit=crop" },
    { name: "Dim Sum Garden", cuisine: "Chinese", rating: 4.6, price: "$$", reviews: 1678, image: "https://images.unsplash.com/photo-1552566626-52f8b828add9?w=400&h=300&fit=crop" },
    { name: "Wok Master", cuisine: "Chinese", rating: 4.5, price: "$$", reviews: 1987, image: "https://images.unsplash.com/photo-1525755662778-989d0524087e?w=400&h=300&fit=crop" },
    { name: "Szechuan Fire", cuisine: "Chinese", rating: 4.7, price: "$$", reviews: 1456, image: "https://images.unsplash.com/photo-1563245372-f21724e3856d?w=400&h=300&fit=crop" },
  ],
  healthy: [
    { name: "Verde Garden", cuisine: "Healthy", rating: 4.4, price: "$$", reviews: 1234, image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&h=300&fit=crop" },
    { name: "Green Bowl Co.", cuisine: "Healthy", rating: 4.5, price: "$", reviews: 1890, image: "https://images.unsplash.com/photo-1692780941487-505d5d908aa6?w=400&h=300&fit=crop" },
    { name: "Superfood Kitchen", cuisine: "Healthy", rating: 4.6, price: "$$", reviews: 876, image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&h=300&fit=crop" },
    { name: "Raw & Fresh", cuisine: "Healthy", rating: 4.3, price: "$$", reviews: 1567, image: "https://images.unsplash.com/photo-1692780941487-505d5d908aa6?w=400&h=300&fit=crop" },
  ],
};

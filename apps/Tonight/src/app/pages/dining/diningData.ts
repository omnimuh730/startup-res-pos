/* DiningPage types, mock data, status config, helpers */
import { CheckCircle, XCircle, CircleAlert } from "lucide-react";
import type { RestaurantData } from "../detail/restaurantDetailData";

export function fmtR(n: number): string {
  if (Number.isInteger(n)) return String(n);
  const s = n.toFixed(2);
  return s.replace(/0+$/, "").replace(/\.$/, "");
}

export type BookingStatus = "confirmed" | "completed" | "cancelled" | "no-show";
export type BookingType = "reservation";

export interface ReceiptItem { name: string; qty: number; price: number; emoji?: string; }
export interface Receipt {
  items: ReceiptItem[];
  subtotal: number;
  tax: number;
  tip: number;
  total: number;
  paymentMethod: string;
  paidAt: string;
}

export interface MenuItem { name: string; price: number; description: string; emoji: string; popular?: boolean; }

export interface Booking {
  id: string;
  restaurant: string;
  cuisine: string;
  image: string;
  date: string;
  time: string;
  guests: number;
  status: BookingStatus;
  type: BookingType;
  rating?: number;
  address: string;
  phone: string;
  diningPoints: number;
  specialRequest?: string;
  occasion?: string;
  seating: string;
  confirmationNo: string;
  receipt?: Receipt;
  menu?: MenuItem[];
}

const SAMPLE_MENU_JP: MenuItem[] = [
  { emoji: "🍣", name: "Omakase Tasting (12 pc)", price: 88, description: "Chef's selection of premium nigiri", popular: true },
  { emoji: "🍶", name: "Junmai Daiginjo Sake", price: 24, description: "Premium chilled sake, 6oz" },
  { emoji: "🍵", name: "Matcha Crème Brûlée", price: 14, description: "House-made dessert, lightly torched" },
  { emoji: "🥢", name: "Otoro Add-on", price: 18, description: "Two pieces of fatty tuna belly", popular: true },
];
const SAMPLE_MENU_FR: MenuItem[] = [
  { emoji: "🥖", name: "Steak Frites", price: 32, description: "Grass-fed sirloin with truffle fries", popular: true },
  { emoji: "🥗", name: "Salade Niçoise", price: 18, description: "Tuna, egg, olives, haricots verts" },
  { emoji: "🍷", name: "Côtes du Rhône", price: 14, description: "By the glass" },
  { emoji: "🍮", name: "Crème Caramel", price: 11, description: "Classic French dessert" },
];
const SAMPLE_MENU_KR: MenuItem[] = [
  { emoji: "🥩", name: "Premium Wagyu Set", price: 96, description: "180g A5 wagyu with banchan", popular: true },
  { emoji: "🍚", name: "Bibimbap", price: 18, description: "Sizzling stone-pot rice bowl" },
  { emoji: "🍶", name: "Soju Bottle", price: 12, description: "Chilled traditional soju" },
  { emoji: "🥬", name: "Kimchi Pancake", price: 14, description: "Crispy pajeon with house kimchi" },
];

export function getMenuFor(b: Booking): MenuItem[] {
  if (b.menu) return b.menu;
  if (b.cuisine.includes("Japanese")) return SAMPLE_MENU_JP;
  if (b.cuisine.includes("French")) return SAMPLE_MENU_FR;
  if (b.cuisine.includes("Korean")) return SAMPLE_MENU_KR;
  return SAMPLE_MENU_FR;
}

export const statusConfig: Record<BookingStatus, { label: string; color: string; bg: string; icon: typeof CheckCircle }> = {
  confirmed: { label: "Confirmed", color: "text-success", bg: "bg-success/10", icon: CheckCircle },
  completed: { label: "Visited", color: "text-info", bg: "bg-info/10", icon: CheckCircle },
  cancelled: { label: "Cancelled", color: "text-destructive", bg: "bg-destructive/10", icon: XCircle },
  "no-show": { label: "No-show", color: "text-destructive", bg: "bg-destructive/10", icon: CircleAlert },
};

export const BOOKINGS: Booking[] = [
  {
    id: "1", restaurant: "Sakura Omakase", cuisine: "Japanese · Omakase",
    image: "https://images.unsplash.com/photo-1717838207789-62684e75a770?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdXNoaSUyMGphcGFuZXNlJTIwcmVzdGF1cmFudCUyMGZvb2R8ZW58MXx8fHwxNzc2MTc3MzU1fDA&ixlib=rb-4.1.0&q=80&w=1080",
    date: "Tue, 21 Apr 2026", time: "19:30", guests: 2, status: "confirmed", type: "reservation",
    address: "243 S San Pedro St, Los Angeles, CA 90012", phone: "(213) 265-7763",
    diningPoints: 150, specialRequest: "Window seat preferred", occasion: "Anniversary", seating: "Indoor",
    confirmationNo: "CT-2026-0418A",
  },
  {
    id: "2", restaurant: "Le Petit Bistro", cuisine: "French · Bistro",
    image: "https://images.unsplash.com/photo-1679586491709-478283802c40?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmcmVuY2glMjBiaXN0cm8lMjBjYWZlfGVufDF8fHx8MTc3NjE3NzM1Nnww&ixlib=rb-4.1.0&q=80&w=1080",
    date: "Sat, 19 Apr 2026", time: "18:00", guests: 4, status: "confirmed", type: "reservation",
    address: "456 Market St, San Francisco, CA 94105", phone: "(415) 555-0182",
    diningPoints: 200, seating: "Terrace", confirmationNo: "CT-2026-0422B",
  },
  {
    id: "3", restaurant: "Gangnam BBQ House", cuisine: "Korean · BBQ",
    image: "https://images.unsplash.com/photo-1709433420612-8cad609df914?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxrb3JlYW4lMjBiYnElMjByZXN0YXVyYW50fGVufDF8fHx8MTc3NjE2OTA2Mnww&ixlib=rb-4.1.0&q=80&w=1080",
    date: "Sun, 20 Apr 2026", time: "12:30", guests: 1, status: "confirmed", type: "reservation",
    address: "789 Mission St, San Francisco, CA 94103", phone: "(415) 555-0299",
    diningPoints: 80, seating: "Any", confirmationNo: "CT-2026-0420W",
  },
  {
    id: "4", restaurant: "Bella Napoli", cuisine: "Italian · Trattoria",
    image: "https://images.unsplash.com/photo-1662197480393-2a82030b7b83?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpdGFsaWFuJTIwcGFzdGElMjByZXN0YXVyYW50fGVufDF8fHx8MTc3NjE2Mzk1MHww&ixlib=rb-4.1.0&q=80&w=1080",
    date: "Fri, 28 Mar 2026", time: "20:00", guests: 2, status: "completed", type: "reservation",
    rating: 4.5, address: "101 Main St, San Francisco, CA 94102", phone: "(415) 555-0345",
    diningPoints: 120, seating: "Indoor", confirmationNo: "CT-2026-0328C",
    receipt: {
      items: [
        { emoji: "🍝", name: "Tagliatelle al Tartufo", qty: 2, price: 28 },
        { emoji: "🥗", name: "Burrata Caprese", qty: 1, price: 18 },
        { emoji: "🍷", name: "Chianti Classico (glass)", qty: 2, price: 14 },
        { emoji: "🍰", name: "Tiramisu", qty: 1, price: 12 },
      ],
      subtotal: 114, tax: 10.26, tip: 22.80, total: 147.06,
      paymentMethod: "Tonight Wallet", paidAt: "Fri, 28 Mar 2026 · 21:48",
    },
  },
  {
    id: "5", restaurant: "Ocean Pearl", cuisine: "Seafood · Raw Bar",
    image: "https://images.unsplash.com/photo-1761314037182-8ea3363cf3a3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzZWFmb29kJTIwcGxhdHRlciUyMHJlc3RhdXJhbnR8ZW58MXx8fHwxNzc2MTc3MzU2fDA&ixlib=rb-4.1.0&q=80&w=1080",
    date: "Wed, 19 Mar 2026", time: "19:00", guests: 3, status: "completed", type: "reservation",
    rating: 4.8, address: "555 Pier St, San Francisco, CA 94133", phone: "(415) 555-0488",
    diningPoints: 100, seating: "Outdoor", confirmationNo: "CT-2026-0319D",
    receipt: {
      items: [
        { emoji: "🦪", name: "Oyster Sampler (12 pc)", qty: 1, price: 42 },
        { emoji: "🦞", name: "Lobster Roll", qty: 2, price: 36 },
        { emoji: "🍤", name: "Garlic Shrimp", qty: 1, price: 24 },
        { emoji: "🥂", name: "Champagne (glass)", qty: 3, price: 16 },
      ],
      subtotal: 186, tax: 16.74, tip: 37.20, total: 239.94,
      paymentMethod: "Tonight Wallet", paidAt: "Wed, 19 Mar 2026 · 20:35",
    },
  },
  {
    id: "6", restaurant: "The Morning Table", cuisine: "American · Brunch",
    image: "https://images.unsplash.com/photo-1664192578382-8216149bd4d5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxicnVuY2glMjBicmVha2Zhc3QlMjBjYWZlfGVufDF8fHx8MTc3NjE3NzM1Nnww&ixlib=rb-4.1.0&q=80&w=1080",
    date: "Sat, 8 Mar 2026", time: "10:30", guests: 2, status: "completed", type: "reservation",
    rating: 4.2, address: "222 Brunch Ave, San Francisco, CA 94110", phone: "(415) 555-0122",
    diningPoints: 60, seating: "Indoor", confirmationNo: "CT-2026-0308E",
    receipt: {
      items: [
        { emoji: "🥞", name: "Stack of Buttermilk Pancakes", qty: 1, price: 16 },
        { emoji: "🍳", name: "Eggs Benedict", qty: 1, price: 18 },
        { emoji: "🥑", name: "Avocado Toast", qty: 1, price: 14 },
        { emoji: "☕", name: "Cappuccino", qty: 2, price: 6 },
      ],
      subtotal: 60, tax: 5.40, tip: 12, total: 77.40,
      paymentMethod: "Tonight Wallet", paidAt: "Sat, 8 Mar 2026 · 11:42",
    },
  },
  {
    id: "7", restaurant: "Twilight Lounge", cuisine: "Bar · Cocktails",
    image: "https://images.unsplash.com/photo-1768508948990-f5866f800fad?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlbGVnYW50JTIwY29ja3RhaWwlMjBiYXJ8ZW58MXx8fHwxNzc2MTc3MzU2fDA&ixlib=rb-4.1.0&q=80&w=1080",
    date: "Sat, 1 Mar 2026", time: "21:00", guests: 4, status: "cancelled", type: "reservation",
    address: "333 Nightlife Blvd, San Francisco, CA 94107", phone: "(415) 555-0777",
    diningPoints: 0, seating: "Bar", confirmationNo: "CT-2026-0301F",
  },
  {
    id: "8", restaurant: "Gangnam BBQ House", cuisine: "Korean · BBQ",
    image: "https://images.unsplash.com/photo-1709433420612-8cad609df914?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxrb3JlYW4lMjBiYnElMjByZXN0YXVyYW50fGVufDF8fHx8MTc3NjE2OTA2Mnww&ixlib=rb-4.1.0&q=80&w=1080",
    date: "Fri, 14 Feb 2026", time: "19:00", guests: 2, status: "no-show", type: "reservation",
    address: "789 Mission St, San Francisco, CA 94103", phone: "(415) 555-0299",
    diningPoints: 0, seating: "Indoor", confirmationNo: "CT-2026-0214G",
  },
];

/** Parse "Wed, 16 Apr 2026" + "19:30" into a Date. */
export function parseBookingDateTime(b: Booking): Date | null {
  const m = b.date.match(/(\d{1,2})\s+([A-Za-z]+)\s+(\d{4})/);
  if (!m) return null;
  const [, day, monStr, year] = m;
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const monthIdx = months.findIndex(mn => monStr.startsWith(mn));
  if (monthIdx < 0) return null;
  const [hh, mm] = b.time.split(":").map(Number);
  return new Date(Number(year), monthIdx, Number(day), hh, mm);
}

/** Persisted after a successful table QR scan so "live dining" survives navigation and reloads. */
export const DINING_CHECKED_IN_STORAGE_KEY = "tonight.dining.checkedInBookingIds";

export function readCheckedInBookingIds(): Set<string> {
  if (typeof window === "undefined") return new Set();
  try {
    const raw = window.localStorage.getItem(DINING_CHECKED_IN_STORAGE_KEY);
    if (!raw) return new Set();
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return new Set();
    return new Set(parsed.filter((id): id is string => typeof id === "string"));
  } catch {
    return new Set();
  }
}

export function persistCheckedInBookingId(id: string) {
  if (typeof window === "undefined") return;
  const next = readCheckedInBookingIds();
  next.add(id);
  window.localStorage.setItem(DINING_CHECKED_IN_STORAGE_KEY, JSON.stringify([...next]));
}

export function removeCheckedInBookingId(id: string) {
  if (typeof window === "undefined") return;
  const next = readCheckedInBookingIds();
  next.delete(id);
  window.localStorage.setItem(DINING_CHECKED_IN_STORAGE_KEY, JSON.stringify([...next]));
}

/** True when "now" is within [bookingTime - 15min, bookingTime + 2h], OR when booking date is today, OR after QR check-in (see `checkedInIds`). */
export function isCurrentlyDining(b: Booking, now: Date = new Date(), checkedInIds?: Set<string>): boolean {
  if (checkedInIds?.has(b.id)) return true;
  if (b.status !== "confirmed") return false;
  const dt = parseBookingDateTime(b);
  if (!dt) return false;
  const sameDay = dt.getFullYear() === now.getFullYear() && dt.getMonth() === now.getMonth() && dt.getDate() === now.getDate();
  if (sameDay) return true;
  const start = dt.getTime() - 15 * 60 * 1000;
  const end = dt.getTime() + 2 * 60 * 60 * 1000;
  const t = now.getTime();
  return t >= start && t <= end;
}

export function bookingToRestaurant(b: Booking): RestaurantData {
  const idNum = b.id.charCodeAt(0) + b.restaurant.length;
  return {
    id: b.id,
    name: b.restaurant,
    cuisine: b.cuisine.split(" · ")[0],
    emoji: b.cuisine.includes("Japanese") ? "🍣" : b.cuisine.includes("French") ? "🥐" : b.cuisine.includes("Korean") ? "🥩" : b.cuisine.includes("Italian") ? "🍝" : b.cuisine.includes("Seafood") ? "🦐" : b.cuisine.includes("Brunch") ? "🥞" : b.cuisine.includes("Bar") ? "🍸" : "🍽️",
    rating: b.rating || 4.5,
    reviews: (idNum * 137 + 200) % 800 + 100,
    price: "$$",
    lng: -122.4194 + (idNum * 0.003),
    lat: 37.7749 + (idNum * 0.002),
    open: true,
    distance: "1.2 km",
    image: b.image,
  };
}

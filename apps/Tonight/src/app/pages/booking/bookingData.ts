/* Booking constants, data arrays, and helpers */
import { Heart, Cake, Wine, Briefcase, Coffee, PartyPopper } from "lucide-react";

export function fmtR(n: number): string {
  if (Number.isInteger(n)) return String(n);
  const s = n.toFixed(2);
  return s.replace(/0+$/, "").replace(/\.$/, "");
}

export function genBookingId(rId: string): string {
  const n = parseInt(rId, 10) || rId.charCodeAt(0);
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const c1 = chars[(n * 7 + 3) % 26]; const c2 = chars[(n * 13 + 11) % 26];
  const c3 = chars[(n * 19 + 5) % 26]; const c4 = chars[(n * 23 + 17) % 26];
  const num = ((n * 9973 + 7919) % 90 + 10).toString();
  return `RSV-${num}${c1}${c2}${c3}${c4}`;
}

export const TIME_SLOTS = ["17:00", "17:30", "18:00", "18:30", "19:00", "19:30", "20:00", "20:30", "21:00", "21:30"];

export const DAYS = (() => {
  const days: { label: string; day: string; date: number; month: string; full: Date }[] = [];
  const now = new Date();
  for (let i = 0; i < 14; i++) {
    const d = new Date(now); d.setDate(now.getDate() + i);
    days.push({
      label: i === 0 ? "Today" : i === 1 ? "Tomorrow" : d.toLocaleDateString("en", { weekday: "short" }),
      day: d.toLocaleDateString("en", { weekday: "short" }),
      date: d.getDate(), month: d.toLocaleDateString("en", { month: "short" }), full: d,
    });
  }
  return days;
})();

export const OCCASIONS = [
  { id: "anniversary", label: "Anniversary", icon: Heart },
  { id: "birthday", label: "Birthday", icon: Cake },
  { id: "date", label: "Date Night", icon: Wine },
  { id: "business", label: "Business", icon: Briefcase },
  { id: "casual", label: "Casual", icon: Coffee },
  { id: "celebration", label: "Celebration", icon: PartyPopper },
];

export const SEATING_OPTIONS = [
  { id: "dining-hall", label: "Dining Hall", emoji: "" }, { id: "private-room", label: "Private Room", emoji: "" },
  { id: "terrace", label: "Terrace", emoji: "" }, { id: "window", label: "Window Seat", emoji: "" },
  { id: "bar", label: "Bar", emoji: "" }, { id: "booth", label: "Booth", emoji: "" },
  { id: "rooftop", label: "Rooftop", emoji: "" }, { id: "counter", label: "Counter", emoji: "" },
];

export const CUISINE_PREFS = [
  { id: "grilled-beef", label: "Grilled Beef", emoji: "" }, { id: "seafood", label: "Seafood", emoji: "" },
  { id: "italian", label: "Italian", emoji: "" }, { id: "japanese", label: "Japanese", emoji: "" },
  { id: "french", label: "French", emoji: "" }, { id: "korean", label: "Korean", emoji: "" },
  { id: "chinese", label: "Chinese", emoji: "" }, { id: "thai", label: "Thai", emoji: "" },
  { id: "wine-pairing", label: "Wine Pairing", emoji: "" }, { id: "brunch", label: "Brunch", emoji: "" },
  { id: "steakhouse", label: "Steakhouse", emoji: "" }, { id: "healthy", label: "Healthy", emoji: "" },
];

export const VIBE_OPTIONS = [
  { id: "date-night", label: "Date Night", emoji: "" }, { id: "business-dinner", label: "Business Dinner", emoji: "" },
  { id: "celebration", label: "Celebration", emoji: "" }, { id: "casual-dining", label: "Casual Dining", emoji: "" },
  { id: "romantic", label: "Romantic", emoji: "" }, { id: "family-friendly", label: "Family-friendly", emoji: "" },
  { id: "late-night", label: "Late Night", emoji: "" }, { id: "quiet-intimate", label: "Quiet / Intimate", emoji: "" },
];

export const AMENITY_OPTIONS = [
  { id: "parking", label: "Parking", emoji: "" }, { id: "valet", label: "Valet", emoji: "" },
  { id: "corkage-free", label: "Corkage-free", emoji: "" }, { id: "lettering", label: "Lettering", emoji: "" },
  { id: "kids-welcome", label: "Kids Welcome", emoji: "" }, { id: "kids-free", label: "Kids-free Zone", emoji: "" },
  { id: "sommelier", label: "Sommelier", emoji: "" }, { id: "accessible", label: "Accessible", emoji: "" },
  { id: "pet-friendly", label: "Pet-friendly", emoji: "" }, { id: "high-chair", label: "High Chair", emoji: "" },
  { id: "waiting-space", label: "Waiting Space", emoji: "" }, { id: "wifi", label: "Wi-Fi", emoji: "" },
  { id: "live-music", label: "Live Music", emoji: "" }, { id: "projector", label: "Projector/AV", emoji: "" },
  { id: "birthday-setup", label: "Birthday Setup", emoji: "" }, { id: "flower-deco", label: "Flower Deco", emoji: "" },
];

export const DEPOSIT_PER_GUEST = 10;
export const SERVICE_FEE = 2.99;
export const REWARD_BALANCE = 250.0;
export const POINTS_EARN = 45;

export type Step = "date" | "details" | "preferences" | "confirm" | "awaiting" | "success";
export const STEP_ORDER: Step[] = ["date", "details", "preferences", "confirm"];

export function collectPrefTags(seating: string[], cuisinePrefs: string[], vibes: string[], amenities: string[]) {
  const lookup = (list: { id: string; label: string; emoji: string }[], ids: string[]) =>
    ids.map(id => { const o = list.find(x => x.id === id); return { emoji: o?.emoji || "", label: o?.label || id }; });
  return [
    ...lookup(SEATING_OPTIONS, seating), ...lookup(CUISINE_PREFS, cuisinePrefs),
    ...lookup(VIBE_OPTIONS, vibes), ...lookup(AMENITY_OPTIONS, amenities),
  ];
}

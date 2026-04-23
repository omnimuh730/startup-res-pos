/* ScanQR flow types and data */

export type ScanStep = "scan" | "arrived" | "dining" | "bill" | "pay" | "review";

export const STEPS: { id: ScanStep; label: string }[] = [
  { id: "scan", label: "Scan" }, { id: "arrived", label: "Arrived" },
  { id: "dining", label: "Dining" }, { id: "bill", label: "Bill" },
  { id: "pay", label: "Pay" }, { id: "review", label: "Review" },
];

export interface BookingInfo {
  restaurant: string; image: string; date: string;
  time: string; guests: number; seating: string; confirmationNo: string;
}

export const INITIAL_MENU = [
  { name: "Truffle Edamame", qty: 1, price: 14.0, icon: "TE" },
  { name: "Wagyu Tartare", qty: 1, price: 28.0, icon: "WT" },
  { name: "Omakase Selection (8pc)", qty: 2, price: 170.0, icon: "OS" },
];

export const FULL_MENU = [
  { name: "Truffle Edamame", qty: 1, price: 14.0, icon: "TE" },
  { name: "Wagyu Tartare", qty: 1, price: 28.0, icon: "WT" },
  { name: "Omakase Selection (8pc)", qty: 2, price: 170.0, icon: "OS" },
  { name: "A5 Wagyu Steak", qty: 1, price: 120.0, icon: "WS" },
  { name: "Sake Flight - Premium", qty: 1, price: 42.0, icon: "SF" },
  { name: "Sparkling Water", qty: 2, price: 12.0, icon: "SW" },
  { name: "Matcha Creme Brulee", qty: 2, price: 32.0, icon: "MC" },
  { name: "Espresso", qty: 2, price: 10.0, icon: "ES" },
];

export const REVIEW_TAGS = ["Great food", "Amazing ambiance", "Excellent service", "Good value", "Will return"];
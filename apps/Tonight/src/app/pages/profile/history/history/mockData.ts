import { format as fmtDateFns, startOfDay } from "date-fns";
import type { DateRange, PresetId, TxCategory, TxRecord } from "./types";
import { PERIOD_PRESETS } from "./types";

const RESTAURANTS_FOR_TX = [
  { name: "Sakura Omakase", address: "456 Sushi Lane, San Francisco, CA 94110", items: [{ name: "Omakase Set", qty: 1, price: 38.0 }, { name: "Green Tea", qty: 1, price: 3.5 }] },
  { name: "Bella Napoli", address: "789 Pizza St, San Francisco, CA 94102", items: [{ name: "Margherita Pizza", qty: 1, price: 18.0 }, { name: "Tiramisu", qty: 1, price: 8.0 }] },
  { name: "Le Petit Bistro", address: "234 Bistro Ave, San Francisco, CA 94115", items: [{ name: "Steak Frites", qty: 1, price: 42.0 }, { name: "Red Wine", qty: 1, price: 15.0 }] },
  { name: "Taco Fiesta", address: "567 Taco Blvd, San Francisco, CA 94103", items: [{ name: "Taco Trio", qty: 1, price: 15.0 }, { name: "Guacamole", qty: 1, price: 4.0 }] },
  { name: "Gangnam BBQ", address: "120 Korea Way, San Francisco, CA 94108", items: [{ name: "Wagyu Set", qty: 1, price: 48.0 }, { name: "Banchan", qty: 1, price: 6.0 }] },
  { name: "Saigon Pho", address: "88 Mission St, San Francisco, CA 94105", items: [{ name: "Pho Bowl", qty: 1, price: 16.0 }, { name: "Spring Rolls", qty: 1, price: 7.0 }] },
  { name: "Verde Trattoria", address: "321 Vine St, San Francisco, CA 94117", items: [{ name: "Truffle Pasta", qty: 1, price: 32.0 }, { name: "Affogato", qty: 1, price: 9.0 }] },
  { name: "The Burger Lab", address: "12 Market St, San Francisco, CA 94103", items: [{ name: "Lab Burger", qty: 1, price: 17.5 }, { name: "Truffle Fries", qty: 1, price: 8.0 }] },
];
const TOPUP_METHODS = ["Apple Pay", "Google Pay", "PayPal", "Bank Transfer", "VISA ••4242"];
const REWARD_SOURCES = ["10% cashback", "Weekly streak bonus", "First-of-month bonus", "Tier upgrade reward"];
const REFERRAL_NAMES = ["Maria Rodriguez", "Daniel Park", "Aiko Sato", "Chris Donovan", "Renee Cho"];
const GIFT_SENDERS = ["Maria Rodriguez", "Jin Lee", "Hannah Wright", "Marco Bellini"];

function pad(n: number) { return n < 10 ? `0${n}` : `${n}`; }
function fmtAmt(v: number) { return `${v >= 0 ? "+" : "-"}$${Math.abs(v).toFixed(2)}`; }
function fmtDate(d: Date) { return fmtDateFns(d, "MMM d"); }
function fmtTime(d: Date) { return fmtDateFns(d, "h:mm a"); }

export function generateMockTransactions(count = 84): TxRecord[] {
  let seed = 12345;
  const rand = () => { seed = (seed * 1664525 + 1013904223) % 0x100000000; return seed / 0x100000000; };
  const pick = <T,>(arr: T[]) => arr[Math.floor(rand() * arr.length)];
  const records: TxRecord[] = [];
  const now = new Date();
  for (let i = 0; i < count; i++) {
    const daysAgo = Math.floor(i * (rand() * 0.6 + 0.7));
    const d = new Date(now);
    d.setDate(d.getDate() - daysAgo);
    d.setHours(8 + Math.floor(rand() * 13), Math.floor(rand() * 60), 0, 0);
    const roll = rand();
    let cat: TxCategory;
    if (roll < 0.45) cat = "pay"; else if (roll < 0.65) cat = "charge"; else if (roll < 0.83) cat = "reward"; else if (roll < 0.93) cat = "referral"; else cat = "gift";
    const id = `tx-${i}`;
    const txnId = `TXN-${50000000 + i * 137 + Math.floor(rand() * 99)}`;
    if (cat === "pay") {
      const r = pick(RESTAURANTS_FOR_TX);
      const subtotal = r.items.reduce((s, it) => s + it.price * it.qty, 0);
      const tax = +(subtotal * 0.09).toFixed(2);
      const serviceFee = +(subtotal * 0.05).toFixed(2);
      const total = subtotal + tax + serviceFee;
      records.push({ id, label: r.name, amount: fmtAmt(-total), amountValue: -total, date: fmtDate(d), dateObj: d, type: "debit", category: "pay", time: fmtTime(d), method: "Balance", receiptNo: `INV-2026-${pad(i + 1)}`, transactionId: txnId, items: r.items, subtotal, tax, serviceFee, tip: 0, discount: 0, restaurant: r.name, address: r.address });
    } else if (cat === "charge") {
      const presets = [25, 50, 75, 100, 150, 200];
      const v = presets[Math.floor(rand() * presets.length)];
      records.push({ id, label: "Top Up", amount: fmtAmt(v), amountValue: v, date: fmtDate(d), dateObj: d, type: "credit", category: "charge", time: fmtTime(d), method: pick(TOPUP_METHODS), receiptNo: `TOP-2026-${pad(i + 1)}`, transactionId: txnId });
    } else if (cat === "reward") {
      const v = +(rand() * 9 + 1).toFixed(2);
      records.push({ id, label: "Reward Earned", amount: fmtAmt(v), amountValue: v, date: fmtDate(d), dateObj: d, type: "reward", category: "reward", time: fmtTime(d), receiptNo: `RWD-2026-${pad(i + 1)}`, transactionId: txnId, source: pick(REWARD_SOURCES) });
    } else if (cat === "referral") {
      const v = pick([10, 15, 20, 25]);
      records.push({ id, label: "Referral Bonus", amount: fmtAmt(v), amountValue: v, date: fmtDate(d), dateObj: d, type: "reward", category: "referral", time: fmtTime(d), receiptNo: `REF-2026-${pad(i + 1)}`, transactionId: txnId, source: `${pick(REFERRAL_NAMES)} signed up` });
    } else {
      const v = pick([10, 25, 30, 50]);
      records.push({ id, label: "Gift Received", amount: fmtAmt(v), amountValue: v, date: fmtDate(d), dateObj: d, type: "credit", category: "gift", time: fmtTime(d), method: "Gift Card", receiptNo: `GFT-2026-${pad(i + 1)}`, transactionId: txnId, sender: pick(GIFT_SENDERS) });
    }
  }
  return records.sort((a, b) => b.dateObj.getTime() - a.dateObj.getTime());
}

export function rangeFromPreset(p: Exclude<PresetId, "custom">): DateRange {
  const now = new Date();
  const today = startOfDay(now);
  if (p === "all") return { from: new Date(2000, 0, 1), to: now, presetId: p };
  if (p === "ytd") return { from: new Date(now.getFullYear(), 0, 1), to: now, presetId: p };
  const days = PERIOD_PRESETS.find((x) => x.id === p)!.days;
  const from = new Date(today);
  from.setDate(from.getDate() - days + 1);
  return { from, to: now, presetId: p };
}

export function rangeLabel(r: DateRange): string {
  if (r.presetId !== "custom") return PERIOD_PRESETS.find((p) => p.id === r.presetId)!.label;
  const sameYear = r.from.getFullYear() === r.to.getFullYear();
  return sameYear ? `${fmtDateFns(r.from, "MMM d")} – ${fmtDateFns(r.to, "MMM d, yyyy")}` : `${fmtDateFns(r.from, "MMM d, yyyy")} – ${fmtDateFns(r.to, "MMM d, yyyy")}`;
}

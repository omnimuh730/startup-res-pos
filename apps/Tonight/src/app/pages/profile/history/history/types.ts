export type TxCategory = "charge" | "pay" | "reward" | "referral" | "gift";

export type TxRecord = {
  id: string;
  label: string;
  amount: string;
  amountValue: number;
  date: string;
  dateObj: Date;
  type: "credit" | "debit" | "reward";
  category: TxCategory;
  time: string;
  method?: string;
  receiptNo: string;
  transactionId: string;
  items?: { name: string; qty: number; price: number }[];
  subtotal?: number;
  tax?: number;
  serviceFee?: number;
  tip?: number;
  discount?: number;
  restaurant?: string;
  address?: string;
  source?: string;
  sender?: string;
};

export const PERIOD_PRESETS = [
  { id: "7d", label: "7 Days", days: 7 },
  { id: "1m", label: "1 Month", days: 30 },
  { id: "3m", label: "3 Months", days: 90 },
  { id: "ytd", label: "This Year", days: 0 },
  { id: "all", label: "All Time", days: -1 },
  { id: "custom", label: "Custom", days: -2 },
] as const;

export type PresetId = (typeof PERIOD_PRESETS)[number]["id"];
export type DateRange = { from: Date; to: Date; presetId: PresetId };

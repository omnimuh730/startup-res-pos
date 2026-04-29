import { Building2, Globe, Smartphone, Zap } from "lucide-react";

export const PAYMENT_PROVIDERS = [
  { id: "apple", name: "Apple Pay", icon: <Smartphone className="w-5 h-5" />, color: "bg-foreground text-background", desc: "Instant" },
  { id: "google", name: "Google Pay", icon: <Globe className="w-5 h-5" />, color: "bg-blue-500 text-white", desc: "Instant" },
  { id: "paypal", name: "PayPal", icon: <Zap className="w-5 h-5" />, color: "bg-blue-600 text-white", desc: "1-2 min" },
  { id: "bank", name: "Bank Transfer", icon: <Building2 className="w-5 h-5" />, color: "bg-emerald-600 text-white", desc: "1-3 days" },
] as const;

export const TOPUP_PRESETS_USD = [10, 25, 50, 100, 200, 500];
export const TOPUP_PRESETS_KRW = [10_000, 30_000, 50_000, 100_000, 300_000, 500_000];

export const fmtMoney = (n: number, c: "KRW" | "USD") => (c === "KRW" ? `\u20A9${Math.round(n).toLocaleString()}` : `$${n.toFixed(2)}`);

export type ProcessStage = { key: string; label: string };

export const PROCESS_STAGES_BY_PROVIDER: Record<string, ProcessStage[]> = {
  apple: [
    { key: "connect", label: "Connecting to Apple Pay" },
    { key: "auth", label: "Verifying Face ID" },
    { key: "authorize", label: "Authorizing transaction" },
    { key: "post", label: "Crediting your wallet" },
  ],
  google: [
    { key: "connect", label: "Connecting to Google Pay" },
    { key: "auth", label: "Confirming device security" },
    { key: "authorize", label: "Authorizing transaction" },
    { key: "post", label: "Crediting your wallet" },
  ],
  paypal: [
    { key: "redirect", label: "Redirecting to PayPal" },
    { key: "auth", label: "Confirming PayPal account" },
    { key: "authorize", label: "Authorizing transaction" },
    { key: "post", label: "Crediting your wallet" },
  ],
  bank: [
    { key: "connect", label: "Reaching your bank" },
    { key: "auth", label: "Validating account details" },
    { key: "authorize", label: "Initiating ACH transfer" },
    { key: "post", label: "Posting pending balance" },
  ],
};

export type TopUpStep = "select" | "confirm" | "auth" | "processing" | "error" | "done";

export function genReceiptNo() {
  const r = Math.floor(100000 + Math.random() * 900000);
  return `TOP-2026-${r}`;
}

export function genTxnId() {
  return `TXN-${Math.floor(10000000 + Math.random() * 90000000)}`;
}

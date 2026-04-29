/* Profile sub-pages: Edit, TopUp, SendGift, History, Orders, ThisMonth */
import { useState, useEffect, useRef } from "react";
import { Card } from "../../components/ds/Card";
import { Text } from "../../components/ds/Text";
import { Button } from "../../components/ds/Button";
import { Avatar } from "../../components/ds/Avatar";
import { Input } from "../../components/ds/Input";
import { ProgressBar } from "../../components/ds/ProgressBar";
import { DSBadge } from "../../components/ds/Badge";
import {
  Gift, ShoppingBag, Plus, Minus, Send, Star, X, Check, MapPin,
  Wallet, Shield, ArrowRight, Zap, Building2, Smartphone, Globe, Lock, Sparkles,
  Fingerprint, Loader2, AlertCircle, ChevronLeft, ChevronRight, Receipt, Copy, Calendar,
  Delete, ArrowLeftRight,
} from "lucide-react";
import {
  format as fmtDateFns, startOfMonth, endOfMonth, startOfWeek, endOfWeek,
  eachDayOfInterval, addMonths, subMonths, isSameMonth, isSameDay,
  isBefore, isAfter, startOfDay,
} from "date-fns";
import { PageHeader } from "./profileHelpers";

export function ProfileEditPage({ onBack }: { onBack: () => void }) {
  const [name, setName] = useState("Alex Chen");
  const [phone, setPhone] = useState("+1 (555) 234-5678");
  const [username, setUsername] = useState("alexchen");
  return (
    <div className="pb-8">
      <PageHeader title="Edit Profile" onBack={onBack} />
      <div className="flex flex-col items-center mb-6">
        <Avatar name="Alex Chen" size="2xl" className="mb-3" />
        <Button variant="link" size="xs">Change Photo</Button>
      </div>
      <div className="space-y-4">
        <Input label="Full Name" value={name} onChange={e => setName(e.target.value)} fullWidth />
        <Input label="Phone Number" value={phone} onChange={e => setPhone(e.target.value)} fullWidth />
        <Input label="Username" value={username} onChange={e => setUsername(e.target.value)} fullWidth />
      </div>
      <div className="flex gap-3 mt-6">
        <Button variant="ghost" onClick={onBack} className="flex-1">Cancel</Button>
        <Button variant="primary" onClick={onBack} className="flex-1">Save Changes</Button>
      </div>
    </div>
  );
}

/* ── Payment Methods for Top Up ─────────────────── */
const PAYMENT_PROVIDERS = [
  { id: "apple", name: "Apple Pay", icon: <Smartphone className="w-5 h-5" />, color: "bg-foreground text-background", desc: "Instant" },
  { id: "google", name: "Google Pay", icon: <Globe className="w-5 h-5" />, color: "bg-blue-500 text-white", desc: "Instant" },
  { id: "paypal", name: "PayPal", icon: <Zap className="w-5 h-5" />, color: "bg-blue-600 text-white", desc: "1-2 min" },
  { id: "bank", name: "Bank Transfer", icon: <Building2 className="w-5 h-5" />, color: "bg-emerald-600 text-white", desc: "1-3 days" },
] as const;

const TOPUP_PRESETS_USD = [10, 25, 50, 100, 200, 500];
const TOPUP_PRESETS_KRW = [10_000, 30_000, 50_000, 100_000, 300_000, 500_000];
const fmtMoney = (n: number, c: "KRW" | "USD") => c === "KRW" ? `\u20A9${Math.round(n).toLocaleString()}` : `$${n.toFixed(2)}`;

type ProcessStage = { key: string; label: string };
const PROCESS_STAGES_BY_PROVIDER: Record<string, ProcessStage[]> = {
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

type TopUpStep = "select" | "confirm" | "auth" | "processing" | "error" | "done";

function genReceiptNo() {
  const r = Math.floor(100000 + Math.random() * 900000);
  return `TOP-2026-${r}`;
}
function genTxnId() {
  return `TXN-${Math.floor(10000000 + Math.random() * 90000000)}`;
}

export function TopUpPage({ onBack }: { onBack: () => void }) {
  const [currency, setCurrency] = useState<"KRW" | "USD">("KRW");
  const [amount, setAmount] = useState(50_000);
  const [customAmount, setCustomAmount] = useState("");
  const [selectedProvider, setSelectedProvider] = useState<string | null>(null);
  const [step, setStep] = useState<TopUpStep>("select");
  const [stageIdx, setStageIdx] = useState(0);
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [otpError, setOtpError] = useState<string | null>(null);
  const [resendIn, setResendIn] = useState(0);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [receipt, setReceipt] = useState<{ id: string; txn: string; at: string } | null>(null);
  const [providerSheet, setProviderSheet] = useState(false);
  useEffect(() => { if (!selectedProvider) setSelectedProvider("apple"); }, [selectedProvider]);

  const activeAmount = customAmount ? Number(customAmount) : amount;
  const bonus = 0;
  const presets = currency === "KRW" ? TOPUP_PRESETS_KRW : TOPUP_PRESETS_USD;
  const fmt = (n: number) => fmtMoney(n, currency);

  const switchCurrency = (c: "KRW" | "USD") => {
    setCurrency(c);
    setCustomAmount("");
    setAmount(c === "KRW" ? 50_000 : 50);
  };

  // Resend cooldown
  useEffect(() => {
    if (resendIn <= 0) return;
    const t = setInterval(() => setResendIn((s) => Math.max(0, s - 1)), 1000);
    return () => clearInterval(t);
  }, [resendIn]);

  // When entering processing, walk through stages. Bank uses OTP step before this.
  useEffect(() => {
    if (step !== "processing" || !selectedProvider) return;
    const stages = PROCESS_STAGES_BY_PROVIDER[selectedProvider] ?? PROCESS_STAGES_BY_PROVIDER.apple;
    setStageIdx(0);
    let i = 0;
    const tick = () => {
      i += 1;
      if (i >= stages.length) {
        // Final stage done, transition to receipt screen
        setStageIdx(stages.length);
        setReceipt({ id: genReceiptNo(), txn: genTxnId(), at: new Date().toLocaleString() });
        setTimeout(() => setStep("done"), 450);
        return;
      }
      setStageIdx(i);
      const next = 700 + Math.random() * 600;
      timer = window.setTimeout(tick, next);
    };
    let timer = window.setTimeout(tick, 800);
    return () => window.clearTimeout(timer);
  }, [step, selectedProvider]);

  const handleConfirm = () => {
    // Bank requires OTP. Other providers go through device auth simulated inside processing.
    if (selectedProvider === "bank") {
      setOtp(["", "", "", ""]);
      setOtpError(null);
      setResendIn(30);
      setStep("auth");
    } else {
      setStep("processing");
    }
  };

  const submitOtp = () => {
    const code = otp.join("");
    if (code.length < 4) { setOtpError("Enter the 4-digit code"); return; }
    // Mock: 0000 fails to demonstrate error handling, anything else passes.
    if (code === "0000") {
      setOtpError("That code didn't match. Try again.");
      return;
    }
    setOtpError(null);
    setStep("processing");
  };

  const setOtpDigit = (i: number, v: string) => {
    const digit = v.replace(/\D/g, "").slice(-1);
    setOtp((prev) => {
      const next = [...prev];
      next[i] = digit;
      return next;
    });
    if (digit && i < 3) {
      const el = document.getElementById(`topup-otp-${i + 1}`);
      el?.focus();
    }
  };

  if (step === "done") {
    const provider = PAYMENT_PROVIDERS.find(p => p.id === selectedProvider);
    return (
      <div className="pb-8">
        <PageHeader title="Top Up" onBack={onBack} />
        <div className="flex flex-col items-center justify-center py-10 text-center">
          <div className="relative w-20 h-20 mb-5">
            <div className="absolute inset-0 rounded-full bg-success/10 animate-ping" style={{ animationDuration: "2s", animationIterationCount: "3" }} />
            <div className="relative w-20 h-20 rounded-full bg-success/15 flex items-center justify-center">
              <Check className="w-10 h-10 text-success" />
            </div>
          </div>
          <Text className="text-[1.375rem] mb-2" style={{ fontWeight: 700 }}>Top Up Successful!</Text>
          <Text className="text-muted-foreground text-[0.875rem] mb-1">{fmt(activeAmount)} added to your {currency === "KRW" ? "Domestic" : "Foreign"} balance</Text>
          {bonus > 0 && (
            <div className="flex items-center gap-1.5 mt-2 px-3 py-1.5 rounded-full bg-success/10 border border-success/20">
              <Sparkles className="w-3.5 h-3.5 text-success" />
              <Text className="text-success text-[0.8125rem]" style={{ fontWeight: 600 }}>+{fmt(bonus)} bonus added!</Text>
            </div>
          )}
          <div className="w-full mt-7 p-4 rounded-2xl border border-border bg-card text-left">
            <div className="flex items-center gap-2 mb-3 pb-3 border-b border-dashed border-border">
              <Receipt className="w-4 h-4 text-muted-foreground" />
              <Text className="text-[0.75rem] tracking-wider text-muted-foreground" style={{ fontWeight: 600 }}>RECEIPT</Text>
              <span className="ml-auto text-[0.6875rem] text-muted-foreground">{receipt?.at}</span>
            </div>
            <div className="flex justify-between text-[0.8125rem] mb-1.5">
              <Text className="text-muted-foreground">Receipt No.</Text>
              <button
                className="flex items-center gap-1 hover:text-primary transition"
                onClick={() => receipt && navigator.clipboard?.writeText(receipt.id)}
              >
                <span style={{ fontWeight: 500 }}>{receipt?.id}</span>
                <Copy className="w-3 h-3" />
              </button>
            </div>
            <div className="flex justify-between text-[0.8125rem] mb-1.5">
              <Text className="text-muted-foreground">Transaction ID</Text>
              <Text style={{ fontWeight: 500 }}>{receipt?.txn}</Text>
            </div>
            <div className="flex justify-between text-[0.8125rem] mb-3">
              <Text className="text-muted-foreground">Method</Text>
              <Text style={{ fontWeight: 500 }}>{provider?.name}</Text>
            </div>
            <div className="flex justify-between text-[0.875rem] mb-2">
              <Text className="text-muted-foreground">Top Up</Text>
              <Text className="text-success">+{fmt(activeAmount)}</Text>
            </div>
            {bonus > 0 && (
              <div className="flex justify-between text-[0.875rem] mb-2">
                <Text className="text-success flex items-center gap-1"><Sparkles className="w-3 h-3" /> Bonus</Text>
                <Text className="text-success">+{fmt(bonus)}</Text>
              </div>
            )}
            <div className="border-t border-border pt-2 mt-1 flex justify-between">
              <Text style={{ fontWeight: 700 }}>Added</Text>
              <Text className="text-[1.125rem]" style={{ fontWeight: 700 }}>{fmt(activeAmount + bonus)}</Text>
            </div>
          </div>
          <div className="w-full mt-6 grid grid-cols-2 gap-2">
            <Button variant="ghost" onClick={() => { setStep("select"); setSelectedProvider(null); setReceipt(null); }}>Top Up Again</Button>
            <Button variant="primary" onClick={onBack}>Done</Button>
          </div>
        </div>
      </div>
    );
  }

  if (step === "error") {
    return (
      <div className="pb-8">
        <PageHeader title="Top Up Failed" onBack={() => setStep("confirm")} />
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="w-20 h-20 rounded-full bg-destructive/10 flex items-center justify-center mb-5">
            <AlertCircle className="w-10 h-10 text-destructive" />
          </div>
          <Text className="text-[1.25rem] mb-2" style={{ fontWeight: 700 }}>Payment Couldn't Be Completed</Text>
          <Text className="text-muted-foreground text-[0.875rem]">{errorMsg ?? "We couldn't reach your payment provider."}</Text>
          <Text className="text-muted-foreground text-[0.75rem] mt-3">No funds were deducted.</Text>
          <div className="w-full mt-8 grid grid-cols-2 gap-2">
            <Button variant="ghost" onClick={onBack}>Cancel</Button>
            <Button variant="primary" onClick={() => { setErrorMsg(null); setStep("processing"); }}>Try Again</Button>
          </div>
        </div>
      </div>
    );
  }

  if (step === "auth") {
    const provider = PAYMENT_PROVIDERS.find(p => p.id === selectedProvider)!;
    const code = otp.join("");
    return (
      <div className="pb-8">
        <PageHeader title="Verify It's You" onBack={() => setStep("confirm")} />
        <div className="flex flex-col items-center text-center pt-2">
          <div className={`w-16 h-16 rounded-2xl ${provider.color} flex items-center justify-center mb-4`}>
            <Shield className="w-8 h-8" />
          </div>
          <Text className="text-[1.125rem]" style={{ fontWeight: 700 }}>Enter the 4-digit code</Text>
          <Text className="text-muted-foreground text-[0.8125rem] mt-1.5 px-6">
            We sent a verification code to your {provider.name === "Bank Transfer" ? "registered phone (•••• 5678)" : provider.name + " account"}.
          </Text>
          <div className="flex items-center gap-2 mt-6">
            {otp.map((d, i) => (
              <input
                key={i}
                id={`topup-otp-${i}`}
                value={d}
                onChange={(e) => setOtpDigit(i, e.target.value)}
                onKeyDown={(e) => { if (e.key === "Backspace" && !otp[i] && i > 0) document.getElementById(`topup-otp-${i - 1}`)?.focus(); }}
                inputMode="numeric"
                maxLength={1}
                className={`w-12 h-14 text-center text-[1.25rem] rounded-xl border-2 outline-none transition ${otpError ? "border-destructive" : d ? "border-primary bg-primary/5" : "border-border focus:border-primary"}`}
                style={{ fontWeight: 700 }}
              />
            ))}
          </div>
          {otpError && (
            <div className="flex items-center gap-1.5 mt-3 text-destructive text-[0.75rem]">
              <AlertCircle className="w-3.5 h-3.5" />
              <span>{otpError}</span>
            </div>
          )}
          <button
            disabled={resendIn > 0}
            onClick={() => { setResendIn(30); setOtpError(null); }}
            className="mt-5 text-[0.8125rem] text-primary disabled:text-muted-foreground"
            style={{ fontWeight: 500 }}
          >
            {resendIn > 0 ? `Resend code in ${resendIn}s` : "Resend code"}
          </button>
          <div className="text-[0.6875rem] text-muted-foreground mt-3">Tip: try <span className="font-mono">0000</span> to see the failure flow.</div>
          <Button variant="primary" fullWidth radius="full" onClick={submitOtp} className="mt-7" disabled={code.length < 4}>
            Verify & Continue
          </Button>
        </div>
      </div>
    );
  }

  if (step === "processing") {
    const provider = PAYMENT_PROVIDERS.find(p => p.id === selectedProvider);
    const stages = PROCESS_STAGES_BY_PROVIDER[selectedProvider ?? "apple"];
    return (
      <div className="pb-8">
        <PageHeader title="Processing" onBack={() => {}} />
        <div className="px-1 pt-2">
          <div className="rounded-2xl p-5 mb-5 text-center" style={{ background: "linear-gradient(135deg, var(--primary) 0%, color-mix(in srgb, var(--primary) 60%, #000) 100%)" }}>
            <Text className="text-white/70 text-[0.6875rem] tracking-wider" style={{ fontWeight: 600 }}>PROCESSING TOP UP</Text>
            <Text className="text-white text-[1.75rem] block mt-1" style={{ fontWeight: 700 }}>{fmt(activeAmount)}</Text>
            <Text className="text-white/70 text-[0.75rem]">via {provider?.name}</Text>
          </div>
          <ol className="space-y-3">
            {stages.map((s, i) => {
              const done = i < stageIdx;
              const active = i === stageIdx;
              return (
                <li key={s.key} className={`flex items-center gap-3 p-3 rounded-xl border transition ${active ? "border-primary bg-primary/5" : done ? "border-success/30 bg-success/5" : "border-border"}`}>
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 ${done ? "bg-success text-white" : active ? "bg-primary/15 text-primary" : "bg-secondary text-muted-foreground"}`}>
                    {done ? <Check className="w-4 h-4" /> : active ? <Loader2 className="w-4 h-4 animate-spin" /> : <span className="text-[0.75rem]" style={{ fontWeight: 700 }}>{i + 1}</span>}
                  </div>
                  <Text className={`text-[0.875rem] ${done ? "text-muted-foreground" : ""}`} style={{ fontWeight: active ? 600 : 500 }}>{s.label}</Text>
                  {active && <Fingerprint className="w-4 h-4 text-primary ml-auto opacity-60" />}
                </li>
              );
            })}
          </ol>
          <div className="flex items-center justify-center gap-2 text-[0.75rem] text-muted-foreground mt-5">
            <Lock className="w-3.5 h-3.5 text-success" />
            <span>End-to-end encrypted · do not close this screen</span>
          </div>
        </div>
      </div>
    );
  }

  if (step === "confirm") {
    const provider = PAYMENT_PROVIDERS.find(p => p.id === selectedProvider)!;
    return (
      <div className="pb-8">
        <PageHeader title="Confirm Top Up" onBack={() => setStep("select")} />
        <div className="space-y-4">
          {/* Summary Card */}
          <div className="relative rounded-2xl overflow-hidden p-5" style={{ background: "linear-gradient(135deg, var(--primary) 0%, color-mix(in srgb, var(--primary) 60%, #000) 100%)" }}>
            <div className="absolute top-0 right-0 w-24 h-24 rounded-full bg-white/5 -translate-y-1/2 translate-x-1/2" />
            <div className="relative z-10 text-center">
              <Text className="text-white/60 text-[0.75rem]" style={{ fontWeight: 500 }}>TOP UP · {currency === "KRW" ? "DOMESTIC" : "FOREIGN"}</Text>
              <Text className="text-white text-[2.25rem] block mt-1" style={{ fontWeight: 700 }}>{fmt(activeAmount)}</Text>
              {bonus > 0 && (
                <div className="inline-flex items-center gap-1 mt-2 px-3 py-1 rounded-full bg-white/15">
                  <Sparkles className="w-3 h-3 text-white" />
                  <Text className="text-white text-[0.75rem]" style={{ fontWeight: 600 }}>+{fmt(bonus)} bonus included</Text>
                </div>
              )}
            </div>
          </div>

          {/* Payment Method */}
          <div className="p-4 rounded-xl border border-border">
            <Text className="text-[0.75rem] text-muted-foreground mb-2" style={{ fontWeight: 500 }}>PAYMENT METHOD</Text>
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl ${provider.color} flex items-center justify-center shrink-0`}>
                {provider.icon}
              </div>
              <div className="flex-1">
                <Text className="text-[0.9375rem]" style={{ fontWeight: 600 }}>{provider.name}</Text>
                <Text className="text-muted-foreground text-[0.75rem]">{provider.desc}</Text>
              </div>
              <button onClick={() => setStep("select")} className="text-primary text-[0.8125rem]" style={{ fontWeight: 500 }}>Change</button>
            </div>
          </div>

          {/* Breakdown */}
          <div className="p-4 rounded-xl border border-border space-y-2">
            <div className="flex justify-between text-[0.875rem]">
              <Text className="text-muted-foreground">Top Up Amount</Text>
              <Text>{fmt(activeAmount)}</Text>
            </div>
            <div className="flex justify-between text-[0.875rem]">
              <Text className="text-muted-foreground">Processing Fee</Text>
              <Text className="text-success">FREE</Text>
            </div>
            {bonus > 0 && (
              <div className="flex justify-between text-[0.875rem]">
                <Text className="text-success flex items-center gap-1"><Sparkles className="w-3 h-3" /> Bonus</Text>
                <Text className="text-success">+{fmt(bonus)}</Text>
              </div>
            )}
            <div className="border-t border-border pt-2 mt-1 flex justify-between">
              <Text style={{ fontWeight: 700 }}>You Pay</Text>
              <Text className="text-[1.125rem]" style={{ fontWeight: 700 }}>{fmt(activeAmount)}</Text>
            </div>
          </div>

          {/* Security */}
          <div className="flex items-center justify-center gap-2 text-[0.75rem] text-muted-foreground">
            <Lock className="w-3.5 h-3.5 text-success" />
            <span>Secured by {provider.name} · 256-bit encryption</span>
          </div>

          <Button variant="primary" fullWidth radius="full" onClick={handleConfirm} className="!mt-6">
            Pay {fmt(activeAmount)} with {provider.name}
          </Button>
        </div>
      </div>
    );
  }

  // Numeric keypad helpers
  const numStr = customAmount !== "" ? customAmount : String(amount);
  const intPart = numStr.split(".")[0] || "0";
  const hasDot = numStr.includes(".");
  const decPart = hasDot ? numStr.split(".")[1] : "";
  const formattedInt = Number(intPart || "0").toLocaleString();
  const displayBig = currency === "USD" && hasDot ? `${formattedInt}.${decPart}` : formattedInt;
  const symbol = currency === "KRW" ? "₩" : "$";

  const pressKey = (k: string) => {
    if (k === "back") {
      setCustomAmount((prev) => {
        const base = prev !== "" ? prev : String(amount);
        return base.slice(0, -1);
      });
      return;
    }
    if (k === ".") {
      if (currency !== "USD") return;
      setCustomAmount((prev) => {
        const base = prev !== "" ? prev : String(amount);
        if (base.includes(".")) return base;
        return (base || "0") + ".";
      });
      return;
    }
    setCustomAmount((prev) => {
      const base = prev !== "" ? prev : "";
      if (base === "" && k === "0") return "0";
      if (base === "0") return k;
      if (base.replace(".", "").length >= 12) return base;
      if (currency === "USD" && base.includes(".") && (base.split(".")[1] || "").length >= 2) return base;
      return base + k;
    });
  };

  const KEYS = currency === "USD"
    ? ["1", "2", "3", "4", "5", "6", "7", "8", "9", ".", "0", "back"]
    : ["1", "2", "3", "4", "5", "6", "7", "8", "9", "", "0", "back"];

  const quickPresets = presets.slice(0, 3);
  const provider = PAYMENT_PROVIDERS.find((p) => p.id === selectedProvider);
  const altSymbol = currency === "KRW" ? "$" : "₩";
  const altLabel = currency === "KRW" ? "USD" : "KRW";

  return (
    <div className="pb-32 relative">
      <PageHeader title="Topup" onBack={onBack} />

      {/* Hero amount with currency switch */}
      <div className="text-center mb-6 mt-2">
        <Text className="text-[0.6875rem] uppercase text-muted-foreground" style={{ fontWeight: 600, letterSpacing: "0.14em" }}>
          Topup amount
        </Text>
        <div className="mt-3 flex items-center justify-center gap-2">
          <div className="flex items-start gap-1">
            <span className="text-[1.5rem] text-muted-foreground" style={{ fontWeight: 500, lineHeight: "1.4" }}>{symbol}</span>
            <span
              className="text-[3.25rem] tabular-nums text-foreground"
              style={{ fontWeight: 700, letterSpacing: "-0.025em", lineHeight: 1 }}
            >
              {displayBig || "0"}
            </span>
          </div>
          <button
            onClick={() => switchCurrency(currency === "KRW" ? "USD" : "KRW")}
            className="ml-2 inline-flex items-center gap-1 h-9 px-3 rounded-full bg-primary/10 text-primary hover:bg-primary/20 transition cursor-pointer"
            aria-label={`Switch to ${altLabel}`}
            style={{ fontWeight: 700 }}
          >
            <span className="text-[1rem]">{altSymbol}</span>
            <ArrowLeftRight className="w-3.5 h-3.5 opacity-70" />
          </button>
        </div>
      </div>

      {/* Quick presets */}
      <div className="grid grid-cols-3 gap-2 mb-5">
        {quickPresets.map((a) => {
          const isSel = customAmount === "" && amount === a;
          return (
            <button
              key={a}
              onClick={() => { setAmount(a); setCustomAmount(""); }}
              className={`py-2.5 rounded-full text-[0.8125rem] transition border cursor-pointer ${isSel ? "bg-primary text-primary-foreground border-primary shadow-sm shadow-primary/20" : "bg-card border-border text-foreground hover:bg-secondary/50"}`}
              style={{ fontWeight: isSel ? 600 : 500 }}
            >
              {fmt(a)}
            </button>
          );
        })}
      </div>

      {/* Numpad */}
      <div className="grid grid-cols-3 gap-1.5 select-none">
        {KEYS.map((k, i) => {
          if (k === "") return <div key={`spacer-${i}`} aria-hidden />;
          return (
            <button
              key={`${k}-${i}`}
              onClick={() => pressKey(k)}
              className="aspect-[1.7/1] flex items-center justify-center rounded-2xl text-[1.375rem] text-foreground hover:bg-secondary/60 active:bg-secondary transition cursor-pointer tabular-nums"
              style={{ fontWeight: 500 }}
            >
              {k === "back" ? <Delete className="w-5 h-5 text-muted-foreground" /> : k}
            </button>
          );
        })}
      </div>

      {/* Pay with row */}
      <button
        onClick={() => setProviderSheet(true)}
        className="w-full mt-5 flex items-center gap-3 p-3 rounded-2xl border border-border bg-card text-left hover:bg-secondary/40 transition cursor-pointer"
      >
        <div className={`w-10 h-10 rounded-xl ${provider?.color ?? "bg-secondary"} flex items-center justify-center shrink-0`}>
          {provider?.icon ?? <Wallet className="w-5 h-5" />}
        </div>
        <div className="flex-1 min-w-0">
          <Text className="text-[0.625rem] text-muted-foreground uppercase" style={{ fontWeight: 600, letterSpacing: "0.1em" }}>Pay with</Text>
          <Text className="text-[0.875rem]" style={{ fontWeight: 600 }}>{provider?.name ?? "Choose method"}</Text>
        </div>
        <span className="text-[0.75rem] text-muted-foreground mr-1">{provider?.desc}</span>
        <ChevronRight className="w-4 h-4 text-muted-foreground shrink-0" />
      </button>

      {/* Sticky CTA */}
      <div className="sticky bottom-0 left-0 right-0 mt-6 pt-4 pb-2 -mx-1 px-1" style={{ background: "linear-gradient(to top, var(--background) 60%, color-mix(in srgb, var(--background) 80%, transparent) 80%, transparent)" }}>
        <Button
          variant="primary"
          fullWidth
          radius="full"
          onClick={() => setStep("confirm")}
          disabled={!selectedProvider || activeAmount <= 0}
        >
          Topup Now {activeAmount > 0 ? `· ${fmt(activeAmount)}` : ""}
        </Button>
      </div>

      {/* Provider bottom sheet */}
      {providerSheet && (
        <div
          className="fixed inset-0 z-50 flex items-end md:items-center justify-center bg-black/50 backdrop-blur-sm"
          onClick={() => setProviderSheet(false)}
        >
          <div
            className="w-full md:max-w-md bg-background rounded-t-3xl md:rounded-3xl border border-border shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-5 pt-5 pb-3">
              <div>
                <Text style={{ fontWeight: 600 }}>Pay With</Text>
                <Text className="text-muted-foreground text-[0.75rem]">Choose your payment method</Text>
              </div>
              <button onClick={() => setProviderSheet(false)} className="w-8 h-8 rounded-full bg-secondary hover:bg-secondary/70 flex items-center justify-center cursor-pointer" aria-label="Close">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="px-5 pb-5 space-y-2">
              {PAYMENT_PROVIDERS.map((p) => (
                <button
                  key={p.id}
                  onClick={() => { setSelectedProvider(p.id); setProviderSheet(false); }}
                  className={`w-full flex items-center gap-3 p-3 rounded-2xl border transition text-left cursor-pointer ${selectedProvider === p.id ? "border-primary bg-primary/5" : "border-border hover:bg-secondary/40"}`}
                >
                  <div className={`w-10 h-10 rounded-xl ${p.color} flex items-center justify-center shrink-0`}>{p.icon}</div>
                  <div className="flex-1 min-w-0">
                    <Text className="text-[0.9375rem]" style={{ fontWeight: 600 }}>{p.name}</Text>
                    <Text className="text-muted-foreground text-[0.75rem]">{p.desc}</Text>
                  </div>
                  <div className={`w-5 h-5 rounded-full border-2 relative shrink-0 ${selectedProvider === p.id ? "border-primary" : "border-muted-foreground/40"}`}>
                    {selectedProvider === p.id && <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full bg-primary" />}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export function SendGiftPage({ onBack }: { onBack: () => void }) {
  const [currency, setCurrency] = useState<"KRW" | "USD">("KRW");
  const [amount, setAmount] = useState(30_000);
  const [recipient, setRecipient] = useState("");

  const step = currency === "KRW" ? 5_000 : 5;
  const min = currency === "KRW" ? 5_000 : 5;
  const max = currency === "KRW" ? 1_000_000 : 1000;
  const fmt = (n: number) => fmtMoney(n, currency);
  const balance = currency === "KRW" ? 13_000_000 : 5_000;

  const switchCurrency = (c: "KRW" | "USD") => {
    setCurrency(c);
    setAmount(c === "KRW" ? 30_000 : 25);
  };

  return (
    <div className="pb-8">
      <PageHeader title="Send Gift Card" onBack={onBack} />
      <div className="text-center mb-5">
        <div className="w-16 h-16 rounded-full bg-success/10 flex items-center justify-center mx-auto mb-3">
          <Gift className="w-8 h-8 text-success" />
        </div>
        <Text className="text-[0.8125rem] text-muted-foreground">Send a dining gift to someone special</Text>
      </div>

      {/* Currency selector */}
      <Text className="text-[0.8125rem] mb-2" style={{ fontWeight: 600 }}>Send From</Text>
      <div className="grid grid-cols-2 gap-2 mb-4">
        <button onClick={() => switchCurrency("KRW")} className={`rounded-xl p-3 text-left border transition ${currency === "KRW" ? "border-primary bg-primary/5" : "border-border bg-card hover:bg-secondary/30"}`}>
          <p className="text-[0.625rem] text-muted-foreground tracking-wider" style={{ fontWeight: 600 }}>DOMESTIC · ₩</p>
          <p className="text-[0.9375rem] mt-0.5" style={{ fontWeight: 700 }}>₩13,000,000</p>
        </button>
        <button onClick={() => switchCurrency("USD")} className={`rounded-xl p-3 text-left border transition ${currency === "USD" ? "border-primary bg-primary/5" : "border-border bg-card hover:bg-secondary/30"}`}>
          <p className="text-[0.625rem] text-muted-foreground tracking-wider" style={{ fontWeight: 600 }}>FOREIGN · $</p>
          <p className="text-[0.9375rem] mt-0.5" style={{ fontWeight: 700 }}>$5,000.00</p>
        </button>
      </div>

      <div className="space-y-4">
        <Input label="Recipient Username" value={recipient} onChange={e => setRecipient(e.target.value)} placeholder="Enter username" fullWidth />
        <div>
          <Text className="text-[0.8125rem] mb-2" style={{ fontWeight: 600 }}>Gift Amount</Text>
          <div className="flex items-center gap-3 justify-center">
            <Button variant="outline" size="icon" radius="full" onClick={() => setAmount(Math.max(min, amount - step))}><Minus className="w-4 h-4" /></Button>
            <Text className="text-[1.5rem] w-32 text-center" style={{ fontWeight: 700 }}>{fmt(amount)}</Text>
            <Button variant="outline" size="icon" radius="full" onClick={() => setAmount(Math.min(max, amount + step))}><Plus className="w-4 h-4" /></Button>
          </div>
        </div>
        <Input label="Personal Message (optional)" placeholder="Enjoy a great meal!" fullWidth />
      </div>
      <div className="mt-4 p-3 rounded-xl bg-secondary flex items-center gap-3">
        <Wallet className="w-5 h-5 text-muted-foreground" />
        <div className="flex-1">
          <Text className="text-[0.8125rem]" style={{ fontWeight: 500 }}>Pay from {currency === "KRW" ? "Domestic" : "Foreign"} Balance</Text>
          <Text className="text-muted-foreground text-[0.6875rem]">Available: {fmt(balance)}</Text>
        </div>
        <DSBadge variant="outline" size="sm">Default</DSBadge>
      </div>
      <Button variant="primary" fullWidth radius="full" leftIcon={<Send className="w-4 h-4" />} onClick={onBack} className="mt-5" disabled={amount > balance || !recipient}>
        Send {fmt(amount)}
      </Button>
    </div>
  );
}

type TxCategory = "charge" | "pay" | "reward" | "referral" | "gift";
type TxRecord = {
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
  subtotal?: number; tax?: number; serviceFee?: number; tip?: number; discount?: number;
  restaurant?: string; address?: string; source?: string; sender?: string;
};

const RESTAURANTS_FOR_TX = [
  { name: "Sakura Omakase", address: "456 Sushi Lane, San Francisco, CA 94110", items: [{ name: "Omakase Set", qty: 1, price: 38.00 }, { name: "Green Tea", qty: 1, price: 3.50 }] },
  { name: "Bella Napoli", address: "789 Pizza St, San Francisco, CA 94102", items: [{ name: "Margherita Pizza", qty: 1, price: 18.00 }, { name: "Tiramisu", qty: 1, price: 8.00 }] },
  { name: "Le Petit Bistro", address: "234 Bistro Ave, San Francisco, CA 94115", items: [{ name: "Steak Frites", qty: 1, price: 42.00 }, { name: "Red Wine", qty: 1, price: 15.00 }] },
  { name: "Taco Fiesta", address: "567 Taco Blvd, San Francisco, CA 94103", items: [{ name: "Taco Trio", qty: 1, price: 15.00 }, { name: "Guacamole", qty: 1, price: 4.00 }] },
  { name: "Gangnam BBQ", address: "120 Korea Way, San Francisco, CA 94108", items: [{ name: "Wagyu Set", qty: 1, price: 48.00 }, { name: "Banchan", qty: 1, price: 6.00 }] },
  { name: "Saigon Pho", address: "88 Mission St, San Francisco, CA 94105", items: [{ name: "Pho Bowl", qty: 1, price: 16.00 }, { name: "Spring Rolls", qty: 1, price: 7.00 }] },
  { name: "Verde Trattoria", address: "321 Vine St, San Francisco, CA 94117", items: [{ name: "Truffle Pasta", qty: 1, price: 32.00 }, { name: "Affogato", qty: 1, price: 9.00 }] },
  { name: "The Burger Lab", address: "12 Market St, San Francisco, CA 94103", items: [{ name: "Lab Burger", qty: 1, price: 17.50 }, { name: "Truffle Fries", qty: 1, price: 8.00 }] },
];
const TOPUP_METHODS = ["Apple Pay", "Google Pay", "PayPal", "Bank Transfer", "VISA ••4242"];
const REWARD_SOURCES = ["10% cashback", "Weekly streak bonus", "First-of-month bonus", "Tier upgrade reward"];
const REFERRAL_NAMES = ["Maria Rodriguez", "Daniel Park", "Aiko Sato", "Chris Donovan", "Renee Cho"];
const GIFT_SENDERS = ["Maria Rodriguez", "Jin Lee", "Hannah Wright", "Marco Bellini"];

function pad(n: number) { return n < 10 ? `0${n}` : `${n}`; }
function fmtAmt(v: number) { return `${v >= 0 ? "+" : "-"}$${Math.abs(v).toFixed(2)}`; }
function fmtDate(d: Date) {
  const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  return `${months[d.getMonth()]} ${d.getDate()}`;
}
function fmtTime(d: Date) {
  let h = d.getHours();
  const m = d.getMinutes();
  const ampm = h >= 12 ? "PM" : "AM";
  h = h % 12 || 12;
  return `${h}:${pad(m)} ${ampm}`;
}

function generateMockTransactions(count = 84): TxRecord[] {
  // Deterministic pseudo-random so list is stable between renders
  let seed = 12345;
  const rand = () => { seed = (seed * 1664525 + 1013904223) % 0x100000000; return seed / 0x100000000; };
  const pick = <T,>(arr: T[]) => arr[Math.floor(rand() * arr.length)];
  const records: TxRecord[] = [];
  let now = new Date();
  for (let i = 0; i < count; i++) {
    const daysAgo = Math.floor(i * (rand() * 0.6 + 0.7));
    const d = new Date(now);
    d.setDate(d.getDate() - daysAgo);
    d.setHours(8 + Math.floor(rand() * 13), Math.floor(rand() * 60), 0, 0);
    const roll = rand();
    let cat: TxCategory;
    if (roll < 0.45) cat = "pay";
    else if (roll < 0.65) cat = "charge";
    else if (roll < 0.83) cat = "reward";
    else if (roll < 0.93) cat = "referral";
    else cat = "gift";
    const id = `tx-${i}`;
    const txnId = `TXN-${50000000 + i * 137 + Math.floor(rand() * 99)}`;
    if (cat === "pay") {
      const r = pick(RESTAURANTS_FOR_TX);
      const subtotal = r.items.reduce((s, it) => s + it.price * it.qty, 0);
      const tax = +(subtotal * 0.09).toFixed(2);
      const serviceFee = +(subtotal * 0.05).toFixed(2);
      const total = subtotal + tax + serviceFee;
      records.push({
        id, label: r.name, amount: fmtAmt(-total), amountValue: -total, date: fmtDate(d), dateObj: d,
        type: "debit", category: "pay", time: fmtTime(d), method: "Balance",
        receiptNo: `INV-2026-${pad(i + 1)}`, transactionId: txnId,
        items: r.items, subtotal, tax, serviceFee, tip: 0, discount: 0,
        restaurant: r.name, address: r.address,
      });
    } else if (cat === "charge") {
      const presets = [25, 50, 75, 100, 150, 200];
      const v = presets[Math.floor(rand() * presets.length)];
      records.push({
        id, label: "Top Up", amount: fmtAmt(v), amountValue: v, date: fmtDate(d), dateObj: d,
        type: "credit", category: "charge", time: fmtTime(d), method: pick(TOPUP_METHODS),
        receiptNo: `TOP-2026-${pad(i + 1)}`, transactionId: txnId,
      });
    } else if (cat === "reward") {
      const v = +(rand() * 9 + 1).toFixed(2);
      records.push({
        id, label: "Reward Earned", amount: fmtAmt(v), amountValue: v, date: fmtDate(d), dateObj: d,
        type: "reward", category: "reward", time: fmtTime(d),
        receiptNo: `RWD-2026-${pad(i + 1)}`, transactionId: txnId, source: pick(REWARD_SOURCES),
      });
    } else if (cat === "referral") {
      const v = pick([10, 15, 20, 25]);
      records.push({
        id, label: "Referral Bonus", amount: fmtAmt(v), amountValue: v, date: fmtDate(d), dateObj: d,
        type: "reward", category: "referral", time: fmtTime(d),
        receiptNo: `REF-2026-${pad(i + 1)}`, transactionId: txnId, source: `${pick(REFERRAL_NAMES)} signed up`,
      });
    } else {
      const v = pick([10, 25, 30, 50]);
      records.push({
        id, label: "Gift Received", amount: fmtAmt(v), amountValue: v, date: fmtDate(d), dateObj: d,
        type: "credit", category: "gift", time: fmtTime(d), method: "Gift Card",
        receiptNo: `GFT-2026-${pad(i + 1)}`, transactionId: txnId, sender: pick(GIFT_SENDERS),
      });
    }
  }
  return records.sort((a, b) => b.dateObj.getTime() - a.dateObj.getTime());
}

const PERIOD_PRESETS = [
  { id: "7d",     label: "7 Days",    days: 7 },
  { id: "1m",     label: "1 Month",   days: 30 },
  { id: "3m",     label: "3 Months",  days: 90 },
  { id: "ytd",    label: "This Year", days: 0 },
  { id: "all",    label: "All Time",  days: -1 },
  { id: "custom", label: "Custom",    days: -2 },
] as const;
type PresetId = typeof PERIOD_PRESETS[number]["id"];

type DateRange = { from: Date; to: Date; presetId: PresetId };

function rangeFromPreset(p: Exclude<PresetId, "custom">): DateRange {
  const now = new Date();
  const today = startOfDay(now);
  if (p === "all") return { from: new Date(2000, 0, 1), to: now, presetId: p };
  if (p === "ytd") return { from: new Date(now.getFullYear(), 0, 1), to: now, presetId: p };
  const days = PERIOD_PRESETS.find(x => x.id === p)!.days;
  const from = new Date(today);
  from.setDate(from.getDate() - days + 1);
  return { from, to: now, presetId: p };
}

function rangeLabel(r: DateRange): string {
  if (r.presetId !== "custom") {
    return PERIOD_PRESETS.find(p => p.id === r.presetId)!.label;
  }
  const sameYear = r.from.getFullYear() === r.to.getFullYear();
  return sameYear
    ? `${fmtDateFns(r.from, "MMM d")} – ${fmtDateFns(r.to, "MMM d, yyyy")}`
    : `${fmtDateFns(r.from, "MMM d, yyyy")} – ${fmtDateFns(r.to, "MMM d, yyyy")}`;
}

function PeriodPicker({ value, onChange }: { value: DateRange; onChange: (r: DateRange) => void }) {
  const [open, setOpen] = useState(false);
  const [month, setMonth] = useState<Date>(value.from);
  const [draft, setDraft] = useState<{ from: Date | null; to: Date | null }>({ from: value.from, to: value.to });
  const [selecting, setSelecting] = useState<"from" | "to">("from");
  const [hover, setHover] = useState<Date | null>(null);
  const ref = useRef<HTMLDivElement>(null);
  const today = startOfDay(new Date());

  useEffect(() => {
    const onDoc = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false); };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  useEffect(() => {
    if (open) {
      setDraft({ from: value.from, to: value.to });
      setMonth(value.from);
      setSelecting("from");
      setHover(null);
    }
  }, [open, value]);

  const days = eachDayOfInterval({
    start: startOfWeek(startOfMonth(month), { weekStartsOn: 0 }),
    end: endOfWeek(endOfMonth(month), { weekStartsOn: 0 }),
  });

  const handleDay = (d: Date) => {
    if (selecting === "from" || !draft.from || (draft.from && draft.to)) {
      setDraft({ from: d, to: null });
      setSelecting("to");
    } else {
      if (isBefore(d, draft.from)) {
        setDraft({ from: d, to: null });
        setSelecting("to");
      } else {
        setDraft({ from: draft.from, to: d });
        setSelecting("from");
      }
    }
  };

  // Effective range used for highlighting (handles in-progress hover preview)
  const effFrom = draft.from;
  const effTo = draft.to ?? (selecting === "to" && draft.from && hover && !isBefore(hover, draft.from) ? hover : draft.to);

  const inRange = (d: Date) => effFrom && effTo && isAfter(d, effFrom) && isBefore(d, effTo);

  const dayCount = effFrom && effTo
    ? Math.round((startOfDay(effTo).getTime() - startOfDay(effFrom).getTime()) / 86400000) + 1
    : 0;

  const apply = () => {
    if (draft.from && draft.to) {
      onChange({ from: startOfDay(draft.from), to: draft.to, presetId: "custom" });
      setOpen(false);
    }
  };

  const choosePreset = (id: PresetId) => {
    if (id === "custom") {
      // Switch to custom mode without committing a range yet — let user pick on calendar.
      setDraft({ from: null, to: null });
      setSelecting("from");
      return;
    }
    onChange(rangeFromPreset(id));
    setOpen(false);
  };

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(o => !o)}
        className={`w-full flex items-center justify-between gap-2 pl-2 pr-5 py-2 rounded-full border bg-card transition cursor-pointer ${open ? "border-primary ring-4 ring-primary/15" : "border-border hover:border-primary/40"}`}
      >
        <div className="flex items-center gap-3 min-w-0">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center transition ${open ? "bg-primary text-primary-foreground" : "bg-primary/10 text-primary"}`}>
            <Calendar className="w-4 h-4" />
          </div>
          <div className="text-left min-w-0">
            <div className="text-[0.625rem] text-muted-foreground tracking-wider" style={{ fontWeight: 600 }}>PERIOD</div>
            <div className="text-[0.875rem] truncate" style={{ fontWeight: 600 }}>{rangeLabel(value)}</div>
          </div>
        </div>
        <ChevronRight className={`w-4 h-4 text-muted-foreground transition-transform ${open ? "rotate-90" : ""}`} />
      </button>

      {open && (
        <div className="absolute z-50 left-0 right-0 mt-2 bg-background border border-border rounded-3xl shadow-2xl overflow-hidden">
          {/* Preset chips */}
          <div className="p-3 border-b border-border">
            <div className="grid grid-cols-3 gap-1.5">
              {PERIOD_PRESETS.map(p => {
                const isActive = value.presetId === p.id || (p.id === "custom" && (!draft.from || !draft.to) && value.presetId === "custom");
                return (
                  <button
                    key={p.id}
                    onClick={() => choosePreset(p.id)}
                    className={`relative px-2 py-1.5 rounded-full border text-center text-[0.75rem] transition ${isActive ? "border-primary bg-primary/5 text-primary" : "border-border hover:border-primary/40 hover:bg-primary/5"}`}
                    style={{ fontWeight: isActive ? 700 : 500 }}
                  >
                    {p.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Range summary */}
          <div className="px-3 pt-2 pb-1.5 flex items-center gap-1.5">
            <button
              onClick={() => setSelecting("from")}
              className={`flex-1 text-left px-3 py-1 rounded-full border transition ${selecting === "from" ? "border-primary bg-primary/5" : "border-border"}`}
            >
              <div className="text-[0.5625rem] tracking-wider text-muted-foreground leading-tight" style={{ fontWeight: 600 }}>FROM</div>
              <div className="text-[0.75rem] leading-tight" style={{ fontWeight: 600 }}>
                {draft.from ? fmtDateFns(draft.from, "MMM d") : <span className="text-muted-foreground">—</span>}
              </div>
            </button>
            {dayCount > 0 ? (
              <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-[0.625rem] shrink-0" style={{ fontWeight: 700 }}>
                {dayCount}d
              </span>
            ) : (
              <ArrowRight className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
            )}
            <button
              onClick={() => draft.from && setSelecting("to")}
              className={`flex-1 text-left px-3 py-1 rounded-full border transition ${selecting === "to" ? "border-primary bg-primary/5" : "border-border"}`}
            >
              <div className="text-[0.5625rem] tracking-wider text-muted-foreground leading-tight" style={{ fontWeight: 600 }}>TO</div>
              <div className="text-[0.75rem] leading-tight" style={{ fontWeight: 600 }}>
                {draft.to ? fmtDateFns(draft.to, "MMM d") : <span className="text-muted-foreground">—</span>}
              </div>
            </button>
          </div>

          {/* Calendar */}
          <div className="px-3 pb-2">
            <div className="flex items-center justify-between mb-1.5">
              <button onClick={() => setMonth(subMonths(month, 1))} className="w-7 h-7 bg-primary/10 text-primary hover:bg-primary/15 rounded-full flex items-center justify-center transition">
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>
              <span className="text-[0.8125rem]" style={{ fontWeight: 700 }}>
                {fmtDateFns(month, "MMMM")} <span className="text-muted-foreground" style={{ fontWeight: 500 }}>{fmtDateFns(month, "yyyy")}</span>
              </span>
              <button onClick={() => setMonth(addMonths(month, 1))} className="w-7 h-7 bg-primary/10 text-primary hover:bg-primary/15 rounded-full flex items-center justify-center transition">
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
            <div className="grid grid-cols-7">
              {["S","M","T","W","T","F","S"].map((d, i) => (
                <div key={i} className="text-center text-[0.625rem] text-muted-foreground py-2 tracking-wider" style={{ fontWeight: 600 }}>{d}</div>
              ))}
              {days.map(day => {
                const isFrom = !!effFrom && isSameDay(day, effFrom);
                const isTo = !!effTo && isSameDay(day, effTo);
                const within = inRange(day);
                const outside = !isSameMonth(day, month);
                const isTodayDay = isSameDay(day, today);
                const endpoint = isFrom || isTo;
                const sameDayRange = isFrom && isTo;
                const fillClasses = [
                  within ? "bg-primary/12" : "",
                  isFrom && !sameDayRange ? "bg-primary/12 rounded-l-full" : "",
                  isTo && !sameDayRange ? "bg-primary/12 rounded-r-full" : "",
                ].join(" ");
                return (
                  <button
                    key={day.toISOString()}
                    onClick={() => handleDay(day)}
                    onMouseEnter={() => setHover(day)}
                    onMouseLeave={() => setHover(null)}
                    className={`relative w-full h-11 flex items-center justify-center text-[0.8125rem] ${fillClasses}`}
                    style={{ fontWeight: outside ? 400 : 500 }}
                  >
                    <span className={`
                      relative z-10 w-9 h-9 max-w-full max-h-full flex items-center justify-center transition-all rounded-full
                      ${isFrom ? "bg-primary text-primary-foreground shadow-md" : ""}
                      ${isTo && !isFrom ? "border-2 border-primary text-primary bg-background" : ""}
                      ${!endpoint && !within ? "hover:bg-secondary" : ""}
                      ${outside ? "text-muted-foreground/40" : ""}
                      ${isTodayDay && !endpoint ? "text-primary" : ""}
                    `}>
                      {fmtDateFns(day, "d")}
                      {isTodayDay && !endpoint && (
                        <span className="absolute -bottom-0.5 w-1 h-1 rounded-full bg-primary" />
                      )}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex items-center justify-between gap-2 px-3 py-2 border-t border-border bg-secondary/20">
            <button
              onClick={() => { setDraft({ from: null, to: null }); setSelecting("from"); }}
              className="text-[0.75rem] text-muted-foreground hover:text-foreground"
              style={{ fontWeight: 500 }}
            >
              Clear
            </button>
            <div className="flex gap-1.5">
              <button onClick={() => setOpen(false)} className="px-3.5 py-1.5 text-[0.75rem] rounded-full hover:bg-secondary" style={{ fontWeight: 500 }}>
                Cancel
              </button>
              <button
                onClick={apply}
                disabled={!draft.from || !draft.to}
                className="px-3.5 py-1.5 text-[0.75rem] rounded-full bg-primary text-primary-foreground disabled:opacity-40 hover:bg-primary/90 transition"
                style={{ fontWeight: 600 }}
              >
                Apply
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const CATEGORY_OPTIONS: { id: "all" | TxCategory; label: string; icon: any; color: string }[] = [
  { id: "all", label: "All", icon: Wallet, color: "text-foreground" },
  { id: "charge", label: "Charge", icon: Plus, color: "text-success" },
  { id: "pay", label: "Pay", icon: ShoppingBag, color: "text-foreground" },
  { id: "reward", label: "Reward", icon: Star, color: "text-primary" },
  { id: "referral", label: "Referral", icon: Send, color: "text-info" },
  { id: "gift", label: "Gift", icon: Gift, color: "text-success" },
];

const PAGE_SIZE = 20;

export function HistoryPage({ onBack }: { onBack: () => void }) {
  const [selectedTransaction, setSelectedTransaction] = useState<TxRecord | null>(null);
  const [range, setRange] = useState<DateRange>(() => rangeFromPreset("1m"));
  const [category, setCategory] = useState<"all" | TxCategory>("all");
  const [visible, setVisible] = useState(PAGE_SIZE);
  const [allTransactions] = useState(() => generateMockTransactions(84));

  const filtered = allTransactions.filter(t => {
    if (category !== "all" && t.category !== category) return false;
    const ts = t.dateObj.getTime();
    return ts >= range.from.getTime() && ts <= range.to.getTime();
  });

  // Reset pagination when filters change
  useEffect(() => { setVisible(PAGE_SIZE); }, [range, category]);

  const shown = filtered.slice(0, visible);
  const hasMore = visible < filtered.length;
  const totalIn = filtered.filter(t => t.amountValue > 0).reduce((s, t) => s + t.amountValue, 0);
  const totalOut = filtered.filter(t => t.amountValue < 0).reduce((s, t) => s + Math.abs(t.amountValue), 0);

  // Group by date label
  const groups: { date: string; items: TxRecord[] }[] = [];
  shown.forEach(t => {
    const last = groups[groups.length - 1];
    if (last && last.date === t.date) last.items.push(t);
    else groups.push({ date: t.date, items: [t] });
  });

  return (
    <div className="pb-8">
      <PageHeader title="Transaction History" onBack={onBack} />

      {/* Period picker — calendar with presets */}
      <div className="mb-4">
        <PeriodPicker value={range} onChange={setRange} />
      </div>

      {/* Categories — Notion-style: active hugs label, inactive flex to fill remaining width */}
      <div className="flex items-stretch gap-1 mb-4 p-1.5 rounded-full bg-secondary/40 w-full">
        {CATEGORY_OPTIONS.map(c => {
          const Icon = c.icon;
          const isActive = category === c.id;
          return (
            <button
              key={c.id}
              onClick={() => setCategory(c.id)}
              aria-label={c.label}
              className={`group relative flex items-center justify-center h-12 rounded-full cursor-pointer min-w-0 overflow-hidden transition-[flex-grow,flex-basis,padding,background-color,border-color,box-shadow,color] duration-[1400ms] ease-[cubic-bezier(0.22,1,0.36,1)] ${
                isActive
                  ? "flex-[0_0_auto] px-5 bg-background border border-border shadow-sm text-foreground"
                  : "flex-[1_1_0%] px-0 bg-transparent border border-transparent text-muted-foreground hover:text-foreground hover:bg-background/60"
              }`}
              style={{ fontWeight: isActive ? 600 : 500 }}
            >
              <Icon className={`w-[1.125rem] h-[1.125rem] shrink-0 transition-colors duration-[1400ms] ${isActive ? c.color : ""}`} />
              <span
                className="text-[0.8125rem] whitespace-nowrap inline-block transition-[max-width,opacity,margin-left,transform] duration-[1400ms] ease-[cubic-bezier(0.22,1,0.36,1)] overflow-hidden"
                style={{
                  maxWidth: isActive ? "10rem" : "0px",
                  opacity: isActive ? 1 : 0,
                  marginLeft: isActive ? "0.5rem" : "0px",
                  transform: isActive ? "translateX(0)" : "translateX(-4px)",
                }}
              >
                {c.label}
              </span>
            </button>
          );
        })}
      </div>

      {/* Result count */}
      <div className="flex items-center justify-between mb-2 px-1">
        <Text className="text-[0.6875rem] text-muted-foreground">
          {filtered.length} result{filtered.length === 1 ? "" : "s"}
        </Text>
        {(category !== "all" || range.presetId !== "1m") && (
          <button onClick={() => { setCategory("all"); setRange(rangeFromPreset("1m")); }} className="text-[0.6875rem] text-primary" style={{ fontWeight: 600 }}>
            Reset filters
          </button>
        )}
      </div>

      {/* List */}
      {filtered.length === 0 ? (
        <div className="text-center py-12">
          <div className="w-14 h-14 rounded-full bg-secondary mx-auto flex items-center justify-center mb-3">
            <Receipt className="w-6 h-6 text-muted-foreground" />
          </div>
          <Text className="text-[0.9375rem]" style={{ fontWeight: 600 }}>No transactions</Text>
          <Text className="text-muted-foreground text-[0.75rem] mt-1">Try a different period or category.</Text>
        </div>
      ) : (
        <div className="space-y-4">
          {groups.map(g => (
            <div key={g.date}>
              <Text className="text-[0.6875rem] text-muted-foreground tracking-wider mb-1 px-1" style={{ fontWeight: 600 }}>{g.date.toUpperCase()}</Text>
              <div className="rounded-xl border border-border bg-card overflow-hidden">
                {g.items.map((t, idx) => (
                  <button
                    key={t.id}
                    onClick={() => setSelectedTransaction(t)}
                    className={`w-full flex items-center justify-between py-3 px-3 hover:bg-secondary/30 transition-colors ${idx > 0 ? "border-t border-border" : ""}`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 ${
                        t.category === "charge" ? "bg-success/10"
                        : t.category === "gift" ? "bg-success/10"
                        : t.category === "reward" ? "bg-primary/10"
                        : t.category === "referral" ? "bg-info/10"
                        : "bg-secondary"
                      }`}>
                        {t.category === "charge" ? <Plus className="w-4 h-4 text-success" />
                        : t.category === "gift" ? <Gift className="w-4 h-4 text-success" />
                        : t.category === "reward" ? <Star className="w-4 h-4 text-primary" />
                        : t.category === "referral" ? <Send className="w-4 h-4 text-info" />
                        : <ShoppingBag className="w-4 h-4 text-muted-foreground" />}
                      </div>
                      <div className="text-left min-w-0">
                        <Text className="text-[0.8125rem] truncate" style={{ fontWeight: 500 }}>{t.label}</Text>
                        <div className="flex items-center gap-1.5">
                          <Text className="text-muted-foreground text-[0.6875rem]">{t.time}</Text>
                          <span className="text-muted-foreground text-[0.6875rem]">·</span>
                          <DSBadge variant="soft" size="sm" color={
                            t.category === "charge" ? "success"
                            : t.category === "reward" ? "primary"
                            : t.category === "referral" ? "info"
                            : t.category === "gift" ? "success"
                            : "secondary"
                          }>
                            {CATEGORY_OPTIONS.find(c => c.id === t.category)?.label}
                          </DSBadge>
                        </div>
                      </div>
                    </div>
                    <Text className={`text-[0.8125rem] shrink-0 ml-2 ${t.type !== "debit" ? "text-success" : ""}`} style={{ fontWeight: 600 }}>{t.amount}</Text>
                  </button>
                ))}
              </div>
            </div>
          ))}

          {hasMore && (
            <Button variant="outline" fullWidth onClick={() => setVisible(v => v + PAGE_SIZE)} className="mt-2">
              Load {Math.min(PAGE_SIZE, filtered.length - visible)} more
            </Button>
          )}
          {!hasMore && filtered.length > PAGE_SIZE && (
            <Text className="text-center text-muted-foreground text-[0.6875rem] mt-2">You're all caught up.</Text>
          )}
        </div>
      )}

      {selectedTransaction && (
        <InvoiceModal transaction={selectedTransaction} onClose={() => setSelectedTransaction(null)} />
      )}
    </div>
  );
}

export function OrdersPage({ onBack }: { onBack: () => void }) {
  return (
    <div className="pb-8">
      <PageHeader title="Orders" onBack={onBack} />
      <div className="text-center mb-4">
        <Text className="text-[2.5rem]" style={{ fontWeight: 700 }}>47</Text>
        <Text className="text-muted-foreground text-[0.75rem]">Total Orders</Text>
      </div>
      <div className="space-y-3">
        {[
          { name: "Sakura Omakase", date: "Apr 8", amount: "$42.50", items: 3 },
          { name: "Bella Napoli", date: "Apr 5", amount: "$28.00", items: 2 },
          { name: "Le Petit Bistro", date: "Mar 15", amount: "$65.00", items: 4 },
          { name: "Gangnam BBQ", date: "Mar 10", amount: "$55.00", items: 5 },
        ].map((o, i) => (
          <Card key={i} variant="filled" padding="sm" radius="lg">
            <div className="flex items-center justify-between">
              <div>
                <Text className="text-[0.8125rem]" style={{ fontWeight: 600 }}>{o.name}</Text>
                <Text className="text-muted-foreground text-[0.6875rem]">{o.date} · {o.items} items</Text>
              </div>
              <Text style={{ fontWeight: 600 }}>{o.amount}</Text>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

export function ThisMonthPage({ onBack }: { onBack: () => void }) {
  return (
    <div className="pb-8">
      <PageHeader title="This Month's Spending" onBack={onBack} />
      <div className="text-center mb-5">
        <Text className="text-[2.5rem] text-primary" style={{ fontWeight: 700 }}>$218</Text>
        <Text className="text-muted-foreground text-[0.75rem]">April 2026</Text>
      </div>
      <div className="space-y-3">
        <div className="flex justify-between text-[0.8125rem]">
          <Text className="text-muted-foreground">Dining Out</Text>
          <Text style={{ fontWeight: 600 }}>$178.00</Text>
        </div>
        <ProgressBar value={82} color="primary" size="sm" />
        <div className="flex justify-between text-[0.8125rem]">
          <Text className="text-muted-foreground">Delivery</Text>
          <Text style={{ fontWeight: 600 }}>$40.00</Text>
        </div>
        <ProgressBar value={18} color="info" size="sm" />
      </div>
      <div className="mt-5 p-3 rounded-xl bg-secondary">
        <div className="flex justify-between text-[0.8125rem]">
          <Text className="text-muted-foreground">vs Last Month</Text>
          <Text className="text-success" style={{ fontWeight: 600 }}>{"\u2193"} 12% less</Text>
        </div>
      </div>
    </div>
  );
}

function InvoiceModal({ transaction, onClose }: { transaction: any; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4" onClick={onClose}>
      <div className="bg-background rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="sticky top-0 bg-background border-b border-border px-5 py-4 flex items-center justify-between">
          <Text style={{ fontWeight: 700 }}>Receipt</Text>
          <button onClick={onClose} className="w-8 h-8 rounded-full hover:bg-secondary flex items-center justify-center transition">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 space-y-4">
          {transaction.type === "debit" && transaction.items ? (
            <>
              <div className="text-center pb-4 border-b border-dashed border-border">
                <div className="w-12 h-12 rounded-full bg-success/10 flex items-center justify-center mx-auto mb-2">
                  <Check className="w-6 h-6 text-success" />
                </div>
                <Text className="text-success" style={{ fontWeight: 600 }}>Payment Successful</Text>
                <Text className="text-muted-foreground text-[0.75rem] mt-1">{transaction.date}, {transaction.time}</Text>
              </div>

              <div className="space-y-2">
                <div className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 text-muted-foreground mt-0.5 shrink-0" />
                  <div>
                    <Text className="text-[0.9375rem]" style={{ fontWeight: 600 }}>{transaction.restaurant}</Text>
                    <Text className="text-muted-foreground text-[0.75rem]">{transaction.address}</Text>
                  </div>
                </div>
              </div>

              <div className="space-y-2 pt-3 border-t border-border">
                <Text className="text-[0.75rem] text-muted-foreground" style={{ fontWeight: 600 }}>ORDER DETAILS</Text>
                {transaction.items.map((item: any, idx: number) => (
                  <div key={idx} className="flex justify-between">
                    <div className="flex gap-2">
                      <Text className="text-[0.8125rem] text-muted-foreground">{item.qty}x</Text>
                      <Text className="text-[0.8125rem]">{item.name}</Text>
                    </div>
                    <Text className="text-[0.8125rem]">${item.price.toFixed(2)}</Text>
                  </div>
                ))}
              </div>

              <div className="space-y-2 pt-3 border-t border-dashed border-border">
                <div className="flex justify-between text-[0.8125rem]">
                  <Text className="text-muted-foreground">Subtotal</Text>
                  <Text>${transaction.subtotal.toFixed(2)}</Text>
                </div>
                <div className="flex justify-between text-[0.8125rem]">
                  <Text className="text-muted-foreground">Tax</Text>
                  <Text>${transaction.tax.toFixed(2)}</Text>
                </div>
                {transaction.serviceFee > 0 && (
                  <div className="flex justify-between text-[0.8125rem]">
                    <Text className="text-muted-foreground">Service Fee</Text>
                    <Text>${transaction.serviceFee.toFixed(2)}</Text>
                  </div>
                )}
                {transaction.discount > 0 && (
                  <div className="flex justify-between text-[0.8125rem]">
                    <Text className="text-success">Discount</Text>
                    <Text className="text-success">-${transaction.discount.toFixed(2)}</Text>
                  </div>
                )}
              </div>

              <div className="flex justify-between pt-3 border-t border-border">
                <Text style={{ fontWeight: 700 }}>Total Paid</Text>
                <Text className="text-[1.125rem]" style={{ fontWeight: 700 }}>{transaction.amount}</Text>
              </div>

              <div className="pt-3 border-t border-dashed border-border space-y-1">
                <div className="flex justify-between text-[0.75rem]">
                  <Text className="text-muted-foreground">Paid From</Text>
                  <Text>{transaction.method}</Text>
                </div>
                <div className="flex justify-between text-[0.75rem]">
                  <Text className="text-muted-foreground">Receipt No.</Text>
                  <Text>{transaction.receiptNo}</Text>
                </div>
                <div className="flex justify-between text-[0.75rem]">
                  <Text className="text-muted-foreground">Transaction ID</Text>
                  <Text>{transaction.transactionId}</Text>
                </div>
              </div>
            </>
          ) : transaction.type === "credit" ? (
            <>
              <div className="text-center pb-4 border-b border-dashed border-border">
                <div className="w-12 h-12 rounded-full bg-success/10 flex items-center justify-center mx-auto mb-2">
                  <Plus className="w-6 h-6 text-success" />
                </div>
                <Text className="text-success" style={{ fontWeight: 600 }}>Top Up Successful</Text>
                <Text className="text-muted-foreground text-[0.75rem] mt-1">{transaction.date}, {transaction.time}</Text>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between">
                  <Text className="text-muted-foreground">Amount</Text>
                  <Text className="text-success text-[1.5rem]" style={{ fontWeight: 700 }}>{transaction.amount}</Text>
                </div>
                <div className="flex justify-between text-[0.875rem]">
                  <Text className="text-muted-foreground">Via</Text>
                  <Text>{transaction.method}</Text>
                </div>
                {transaction.sender && (
                  <div className="flex justify-between text-[0.875rem]">
                    <Text className="text-muted-foreground">From</Text>
                    <Text>{transaction.sender}</Text>
                  </div>
                )}
              </div>

              <div className="pt-3 border-t border-dashed border-border space-y-1">
                <div className="flex justify-between text-[0.75rem]">
                  <Text className="text-muted-foreground">Receipt No.</Text>
                  <Text>{transaction.receiptNo}</Text>
                </div>
                <div className="flex justify-between text-[0.75rem]">
                  <Text className="text-muted-foreground">Transaction ID</Text>
                  <Text>{transaction.transactionId}</Text>
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="text-center pb-4 border-b border-dashed border-border">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-2">
                  <Star className="w-6 h-6 text-primary" />
                </div>
                <Text className="text-primary" style={{ fontWeight: 600 }}>Reward Earned</Text>
                <Text className="text-muted-foreground text-[0.75rem] mt-1">{transaction.date}, {transaction.time}</Text>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between">
                  <Text className="text-muted-foreground">Amount</Text>
                  <Text className="text-success text-[1.5rem]" style={{ fontWeight: 700 }}>{transaction.amount}</Text>
                </div>
                <div className="text-[0.875rem]">
                  <Text className="text-muted-foreground mb-1">Source</Text>
                  <Text>{transaction.source}</Text>
                </div>
              </div>

              <div className="pt-3 border-t border-dashed border-border space-y-1">
                <div className="flex justify-between text-[0.75rem]">
                  <Text className="text-muted-foreground">Receipt No.</Text>
                  <Text>{transaction.receiptNo}</Text>
                </div>
                <div className="flex justify-between text-[0.75rem]">
                  <Text className="text-muted-foreground">Transaction ID</Text>
                  <Text>{transaction.transactionId}</Text>
                </div>
              </div>
            </>
          )}

          <div className="pt-3">
            <Button variant="primary" fullWidth onClick={onClose}>Close</Button>
          </div>
        </div>
      </div>
    </div>
  );
}

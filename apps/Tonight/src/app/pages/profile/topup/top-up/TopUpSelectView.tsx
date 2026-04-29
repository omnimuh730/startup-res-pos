import { ArrowLeftRight, ChevronRight, Delete, Wallet, X } from "lucide-react";
import { Button } from "../../../../components/ds/Button";
import { Text } from "../../../../components/ds/Text";
import { PageHeader } from "../../profileHelpers";
import { PAYMENT_PROVIDERS } from "./types";
import { motion, AnimatePresence } from "framer-motion";

interface Props {
  onBack: () => void;
  currency: "KRW" | "USD";
  amount: number;
  customAmount: string;
  activeAmount: number;
  presets: number[];
  selectedProvider: string | null;
  providerSheet: boolean;
  fmt: (n: number) => string;
  switchCurrency: (c: "KRW" | "USD") => void;
  setAmount: (n: number) => void;
  setCustomAmount: (v: string) => void;
  setProviderSheet: (v: boolean) => void;
  setSelectedProvider: (v: string) => void;
  pressKey: (k: string) => void;
  onContinue: () => void;
}

export function TopUpSelectView({
  onBack, currency, amount, customAmount, activeAmount, presets, selectedProvider, providerSheet, fmt,
  switchCurrency, setAmount, setCustomAmount, setProviderSheet, setSelectedProvider, pressKey, onContinue,
}: Props) {
  
  const numStr = customAmount !== "" ? customAmount : String(amount);
  const intPart = numStr.split(".")[0] || "0";
  const hasDot = numStr.includes(".");
  const decPart = hasDot ? numStr.split(".")[1] : "";
  const symbol = currency === "KRW" ? "₩" : "$";
  const altSymbol = currency === "KRW" ? "$" : "₩";
  const altLabel = currency === "KRW" ? "USD" : "KRW";

  // 1. Smart Formatting logic for Framer Motion IDs
  const getAnimatedItems = () => {
    const items = [];
    // Integer part
    for (let i = 0; i < intPart.length; i++) {
      items.push({ id: `raw-${i}`, char: intPart[i] });
      const digitsAfter = intPart.length - 1 - i;
      if (digitsAfter > 0 && digitsAfter % 3 === 0) {
        items.push({ id: `comma-${digitsAfter}`, char: "," });
      }
    }
    // Decimal part
    if (hasDot) {
      items.push({ id: "dot", char: "." });
      for (let i = 0; i < decPart.length; i++) {
        items.push({ id: `dec-${i}`, char: decPart[i] });
      }
    }
    if (items.length === 0) items.push({ id: "raw-0", char: "0" });
    return items;
  };

  const animatedDigits = getAnimatedItems();
  
  // 2. Dynamic Sizing to prevent screen overflow on massive numbers
  const totalChars = animatedDigits.length;
  // Scale down the text and button height when characters exceed certain thresholds
  const numSizeClass = totalChars > 11 ? "text-[2rem]" : totalChars > 8 ? "text-[2.5rem]" : "text-[3.25rem]";
  const btnHeightClass = totalChars > 11 ? "h-[2.5rem]" : totalChars > 8 ? "h-[3rem]" : "h-[3.25rem]";

  const KEYS = currency === "USD" ? ["1", "2", "3", "4", "5", "6", "7", "8", "9", ".", "0", "back"] : ["1", "2", "3", "4", "5", "6", "7", "8", "9", "", "0", "back"];
  const quickPresets = presets.slice(0, 3);
  const provider = PAYMENT_PROVIDERS.find((p) => p.id === selectedProvider);

  return (
    <div className="pb-4 relative">
      <PageHeader title="Topup" onBack={onBack} />
      
      <div className="text-center mb-6 mt-2 w-full px-4 overflow-hidden">
        
        {/* Number & Currency Wrapper */}
        <div className="mt-3 flex items-center justify-center gap-3 w-full">
          
          <div className="flex items-baseline min-w-0 shrink-0">
            {/* Currency Symbol aligned to bottom */}
            <span
              className={`mr-1.5 align-baseline text-[1.5rem] ${currency === "KRW" ? "text-blue-600" : "text-muted-foreground"}`}
              style={{ fontWeight: 500 }}
            >
              {symbol}
            </span>
            
            {/* ✨ MAGICAL NUMBER ANIMATION ✨ */}
            <div className="flex items-baseline relative">
              <AnimatePresence mode="popLayout">
                {animatedDigits.map((item) => (
                  <motion.span
                    layout
                    key={`${item.id}-${item.char}`}
                    initial={{ opacity: 0, scale: 0.6 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.6 }}
                    transition={{
                      type: "spring",
                      stiffness: 400,
                      damping: 30,
                      mass: 0.8,
                    }}
                    className={`${numSizeClass} tabular-nums inline-block align-baseline transition-all duration-200 ease-out origin-bottom ${currency === "KRW" ? "text-blue-600" : "text-rose-600"}`}
                    style={{ fontWeight: 700, letterSpacing: "-0.025em", lineHeight: 1 }}
                  >
                    {item.char}
                  </motion.span>
                ))}
              </AnimatePresence>
            </div>
          </div>

          {/* Currency Switch Button (Height correctly matches text) */}
          <button 
            onClick={() => switchCurrency(currency === "KRW" ? "USD" : "KRW")} 
            className={`shrink-0 inline-flex items-center justify-center gap-1.5 rounded-full px-4 transition-all cursor-pointer ${btnHeightClass} ${
              currency === "USD"
                ? "bg-sky-100 text-blue-700 hover:bg-sky-200"
                : "bg-rose-100 text-rose-700 hover:bg-rose-200"
            }`}
            aria-label={`Switch to ${altLabel}`} 
            style={{ fontWeight: 700 }}
          >
            <span className="text-[1rem]">{altSymbol}</span>
            <ArrowLeftRight className="w-3.5 h-3.5 opacity-70" />
          </button>

        </div>
      </div>

      {/* Quick Presets */}
      <div className="grid grid-cols-3 gap-2 mb-5">
        {quickPresets.map((a) => {
          const isSel = customAmount === "" && amount === a;
          return (
            <button key={a} onClick={() => { setAmount(a); setCustomAmount(""); }} className={`py-2.5 rounded-full text-[0.8125rem] transition border cursor-pointer ${isSel ? "bg-primary text-primary-foreground border-primary shadow-sm shadow-primary/20" : "bg-card border-border text-foreground hover:bg-secondary/50"}`} style={{ fontWeight: isSel ? 600 : 500 }}>
              {fmt(a)}
            </button>
          );
        })}
      </div>

      {/* Tactile Keypad */}
      <div className="grid grid-cols-3 gap-1.5 select-none">
        {KEYS.map((k, i) => {
          if (k === "") return <div key={`spacer-${i}`} aria-hidden />;
          return (
            <motion.button 
              key={`${k}-${i}`} 
              whileTap={{ scale: 0.92 }}
              onClick={() => pressKey(k)} 
              className="aspect-[1.7/1] flex items-center justify-center rounded-2xl text-[1.375rem] text-foreground hover:bg-secondary/60 active:bg-secondary transition-colors cursor-pointer tabular-nums" 
              style={{ fontWeight: 500 }}
            >
              {k === "back" ? <Delete className="w-5 h-5 text-muted-foreground" /> : k}
            </motion.button>
          );
        })}
      </div>

      {/* Payment Provider Selector */}
      <button onClick={() => setProviderSheet(true)} className="w-full mt-5 flex items-center gap-3 p-3 rounded-2xl border border-border bg-card text-left hover:bg-secondary/40 transition cursor-pointer">
        <div className={`w-10 h-10 rounded-xl ${provider?.color ?? "bg-secondary"} flex items-center justify-center shrink-0`}>{provider?.icon ?? <Wallet className="w-5 h-5" />}</div>
        <div className="flex-1 min-w-0">
          <Text className="text-[0.625rem] text-muted-foreground uppercase" style={{ fontWeight: 600, letterSpacing: "0.1em" }}>Pay with</Text>
          <Text className="text-[0.875rem]" style={{ fontWeight: 600 }}>{provider?.name ?? "Choose method"}</Text>
        </div>
        <span className="text-[0.75rem] text-muted-foreground mr-1">{provider?.desc}</span>
        <ChevronRight className="w-4 h-4 text-muted-foreground shrink-0" />
      </button>

      {/* Bottom Sticky Action */}
      <div className="sticky bottom-0 left-0 right-0 mt-6 pt-4 pb-2 -mx-1 px-1" style={{ background: "linear-gradient(to top, var(--background) 60%, color-mix(in srgb, var(--background) 80%, transparent) 80%, transparent)" }}>
        <Button variant="primary" fullWidth radius="full" onClick={onContinue} disabled={!selectedProvider || activeAmount <= 0}>
          Topup Now {activeAmount > 0 ? `· ${fmt(activeAmount)}` : ""}
        </Button>
      </div>

      {/* Provider Selection Sheet */}
      {providerSheet && (
        <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center bg-black/50 backdrop-blur-sm" onClick={() => setProviderSheet(false)}>
          <div className="w-full md:max-w-md bg-background rounded-t-3xl md:rounded-3xl border border-border shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between px-5 pt-5 pb-3">
              <div><Text style={{ fontWeight: 600 }}>Pay With</Text><Text className="text-muted-foreground text-[0.75rem]">Choose your payment method</Text></div>
              <button onClick={() => setProviderSheet(false)} className="w-8 h-8 rounded-full bg-secondary hover:bg-secondary/70 flex items-center justify-center cursor-pointer" aria-label="Close"><X className="w-4 h-4" /></button>
            </div>
            <div className="px-5 pb-5 space-y-2">
              {PAYMENT_PROVIDERS.map((p) => (
                <button key={p.id} onClick={() => { setSelectedProvider(p.id); setProviderSheet(false); }} className={`w-full flex items-center gap-3 p-3 rounded-2xl border transition text-left cursor-pointer ${selectedProvider === p.id ? "border-primary bg-primary/5" : "border-border hover:bg-secondary/40"}`}>
                  <div className={`w-10 h-10 rounded-xl ${p.color} flex items-center justify-center shrink-0`}>{p.icon}</div>
                  <div className="flex-1 min-w-0"><Text className="text-[0.9375rem]" style={{ fontWeight: 600 }}>{p.name}</Text><Text className="text-muted-foreground text-[0.75rem]">{p.desc}</Text></div>
                  <div className={`w-5 h-5 rounded-full border-2 relative shrink-0 ${selectedProvider === p.id ? "border-primary" : "border-muted-foreground/40"}`}>{selectedProvider === p.id && <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full bg-primary" />}</div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
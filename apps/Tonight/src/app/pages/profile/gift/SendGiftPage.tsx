import { useState } from "react";
import { ArrowLeft, Delete, ArrowLeftRight, User, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { TonightLogoMark } from "../../../utils/brand/TonightLogo";

export function SendGiftPage({ onBack }: { onBack: () => void }) {
  const [currency, setCurrency] = useState<"KRW" | "USD">("USD");
  const [valStr, setValStr] = useState("50");
  const [recipient, setRecipient] = useState("");

  const activeAmount = Number(valStr) || 0;
  const presets = currency === "USD" ? [10, 25, 50] : [500000, 1000000, 2000000];
  const symbol = currency === "KRW" ? "₩" : "$";
  const altSymbol = currency === "KRW" ? "$" : "₩";
  
  // Format string for the bottom button
  const intPart = valStr.split(".")[0] || "0";
  const hasDot = valStr.includes(".");
  const decPart = hasDot ? valStr.split(".")[1] : "";
  const displayAmount = currency === "USD" && hasDot 
    ? `${Number(intPart).toLocaleString()}.${decPart}` 
    : Number(intPart).toLocaleString();

  // 1. SMART FORMATTING: Generate stable IDs for Framer Motion
  // This completely stops the "bombing" effect. Digits keep their original ID,
  // so only new digits animate, while existing ones smoothly slide over.
  const getAnimatedItems = () => {
    const items = [];
    
    // Integer part
    for (let i = 0; i < intPart.length; i++) {
      items.push({ id: `raw-${i}`, char: intPart[i] });
      
      const digitsAfter = intPart.length - 1 - i;
      // Insert commas stably based on distance from the decimal point
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
    
    // Fallback if empty
    if (items.length === 0) items.push({ id: "raw-0", char: "0" });

    return items;
  };

  const animatedDigits = getAnimatedItems();

  // Keypad logic
  const KEYS = currency === "USD" 
    ? ["1", "2", "3", "4", "5", "6", "7", "8", "9", ".", "0", "back"] 
    : ["1", "2", "3", "4", "5", "6", "7", "8", "9", "", "0", "back"];

  const switchCurrency = () => {
    const newCur = currency === "KRW" ? "USD" : "KRW";
    setCurrency(newCur);
    setValStr(newCur === "USD" ? "50" : "500000");
  };

  const pressKey = (k: string) => {
    if (k === "back") {
      setValStr(prev => prev.length > 1 ? prev.slice(0, -1) : "");
      return;
    }
    if (k === "." && valStr.includes(".")) return;
    if (valStr === "0" && k !== ".") {
      setValStr(k);
      return;
    }
    if (currency === "USD" && valStr.length > 6) return;
    if (currency === "KRW" && valStr.length > 9) return;
    
    setValStr(prev => prev + k);
  };

  return (
    <div className="bg-white flex h-full min-h-0 flex-col font-sans">
      
      {/* Header */}
      <div className="sticky top-0 z-20 flex items-center justify-between px-4 pt-8 pb-2 bg-white shrink-0">
        <button onClick={onBack} className="w-10 h-10 -ml-2 rounded-full hover:bg-gray-100 flex items-center justify-center text-black cursor-pointer transition">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <span className="font-bold text-[1rem] tracking-tight">Send a gift</span>
        <div className="w-10" />
      </div>
      
      <div className="flex-1 min-h-0 flex flex-col overflow-y-auto px-6 pt-4">
        
        {/* Recipient Input */}
        <div className="relative mb-8 shrink-0">
          <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
            <User className="w-[18px] h-[18px] text-gray-400" />
          </div>
          <input 
            type="text" 
            value={recipient}
            onChange={(e) => setRecipient(e.target.value)}
            placeholder="Who is this for? (Username)" 
            className="w-full bg-[#f3f4f6] text-black text-[0.9375rem] font-medium rounded-[1rem] py-3.5 pl-11 pr-4 outline-none focus:ring-2 focus:ring-black/5 transition placeholder:font-normal placeholder:text-gray-500"
          />
        </div>

        {/* Gift Card — USD coral / KRW blue series */}
        <div
          className={`relative mx-auto flex aspect-[1.58/1] w-full max-w-[280px] shrink-0 flex-col justify-between overflow-hidden rounded-[1.25rem] p-5 ${
            currency === "KRW"
              ? "bg-gradient-to-br from-blue-600 to-sky-500 shadow-[0_8px_24px_rgba(37,99,235,0.28)]"
              : "bg-[#FF5A5F] shadow-[0_8px_24px_rgba(255,90,95,0.25)]"
          }`}
        >
          
          <div className="absolute top-[-30%] right-[-10%] w-[80%] aspect-square bg-white rounded-full opacity-[0.08] blur-[24px]" />
          
          <div className="flex justify-between items-start relative z-10">
            <div className="bg-white/20 p-2 rounded-[0.625rem] backdrop-blur-md text-white">
              <TonightLogoMark className="w-6 h-6" color="currentColor" />
            </div>
            <Sparkles className="w-5 h-5 text-white/50" />
          </div>

          <div className="relative z-10">
            <p className="text-white/80 text-[0.6875rem] font-bold tracking-widest uppercase mb-0.5">
              Gift Card Balance
            </p>
            
            {/* 2. PERFECT ALIGNMENT: items-baseline correctly aligns the symbol with the bottom of the numbers */}
            <div
              className={`flex items-baseline ${
                currency === "KRW" ? "text-sky-100" : "text-white"
              }`}
            >
              <span className="mr-1.5 align-baseline text-[1.5rem] font-medium opacity-90">
                {symbol}
              </span>
              
              {/* 3. SMOOTH GRADUATE ANIMATION */}
              <div className="flex items-baseline h-[3rem]">
                <AnimatePresence mode="popLayout">
                  {animatedDigits.map((item) => (
                    <motion.span
                      layout // This is what creates the smooth left/right sliding
                      key={`${item.id}-${item.char}`}
                      initial={{ opacity: 0, scale: 0.6 }} // Gentle pop in
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.6 }} // Gentle pop out
                      transition={{
                        type: "spring",
                        stiffness: 400,
                        damping: 30, // Perfectly smooth iOS-like curve
                        mass: 0.8,
                      }}
                      className="inline-block align-baseline text-[2.5rem] font-bold leading-none tabular-nums tracking-tight text-white"
                    >
                      {item.char}
                    </motion.span>
                  ))}
                </AnimatePresence>
              </div>
            </div>

          </div>
        </div>

        {/* Quick Presets & Currency Toggle */}
        <div className="flex items-center gap-2 mb-4 shrink-0 mt-6">
          <div className="flex-1 flex gap-2">
            {presets.map((p) => {
              const isSel = valStr === String(p);
              return (
                <button 
                  key={p} 
                  onClick={() => setValStr(String(p))} 
                  className={`flex-1 py-3 rounded-2xl text-[0.8125rem] font-bold transition-all cursor-pointer ${
                    isSel
                      ? currency === "KRW"
                        ? "bg-blue-600 text-white shadow-md shadow-blue-600/25"
                        : "bg-rose-600 text-white shadow-md shadow-rose-600/25"
                      : "bg-[#f3f4f6] text-black hover:bg-gray-200"
                  }`}
                >
                  {currency === "USD" ? `$${p}` : p.toLocaleString()}
                </button>
              );
            })}
          </div>
          <button 
            onClick={switchCurrency}
            className={`flex h-12 w-12 shrink-0 flex-col items-center justify-center gap-0.5 rounded-2xl text-[0.625rem] font-bold leading-none transition cursor-pointer ${
              currency === "USD"
                ? "bg-sky-100 text-blue-700 hover:bg-sky-200"
                : "bg-rose-100 text-rose-700 hover:bg-rose-200"
            }`}
            aria-label="Switch Currency"
          >
            <span>{altSymbol}</span>
            <ArrowLeftRight className="h-3 w-3 shrink-0 opacity-80" strokeWidth={2.5} />
          </button>
        </div>

        {/* Keypad */}
        <div className="grid grid-cols-3 gap-x-2 gap-y-2 mb-4 shrink-0 select-none">
          {KEYS.map((k, i) => {
            if (k === "") return <div key={`spacer-${i}`} aria-hidden />;
            return (
              <button 
                key={`${k}-${i}`} 
                onClick={() => pressKey(k)} 
                className="aspect-[2.2/1] flex items-center justify-center rounded-2xl text-[1.25rem] font-medium text-black bg-white hover:bg-gray-50 active:bg-gray-100 transition cursor-pointer tabular-nums"
              >
                {k === "back" ? <Delete className="w-6 h-6 text-black" strokeWidth={1.5} /> : k}
              </button>
            );
          })}
        </div>

        {/* Send Action Button */}
        <button 
          disabled={activeAmount <= 0 || !recipient.trim()}
          onClick={onBack}
          className={`mt-auto mb-2 w-full shrink-0 rounded-full py-3 text-[1.0625rem] font-bold text-white transition-colors disabled:cursor-not-allowed disabled:opacity-30 ${
            currency === "KRW"
              ? "bg-blue-600 shadow-[0_4px_12px_rgba(37,99,235,0.25)] hover:bg-blue-700 disabled:hover:bg-blue-600"
              : "bg-[#FF5A5F] shadow-[0_4px_12px_rgba(255,90,95,0.2)] hover:bg-[#E0484D] disabled:hover:bg-[#FF5A5F]"
          }`}
        >
          Send {activeAmount > 0 ? `${symbol}${displayAmount}` : "Gift"}
        </button>

      </div>
    </div>
  );
}

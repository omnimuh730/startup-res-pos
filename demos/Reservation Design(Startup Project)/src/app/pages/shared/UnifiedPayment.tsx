/* UnifiedPayment — reusable payment page for QR Pay, Reservation, and Dining flows */
import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  ChevronRight, Shield, Gift, Check,
  AlertTriangle, Copy, CheckCircle,
} from "lucide-react";
import { Toggle } from "../../components/ds/Toggle";
import { DSBadge } from "../../components/ds/Badge";

/* ── Constants ───────────────────────────────────── */
const INTERNAL_BALANCE_KRW = 13_000_000; // Domestic wallet in KRW (Won)
const BONUS_BALANCE_KRW = 330_000;        // Bonus in KRW (usable on internal only)
const EXTERNAL_BALANCE_USD = 5000.00;     // Foreign wallet in USD
const USD_TO_KRW = 1350;                  // FX rate
const POINTS_EARN_RATE = 2;               // points per dollar
const fmtKRW = (n: number) => `\u20A9${Math.round(n).toLocaleString()}`;
const fmtUSD = (n: number) => `$${n.toFixed(2)}`;

/* ── Types ───────────────────────────────────────── */
export interface PaymentLineItem {
  label: string;
  value: number;
  color?: "default" | "muted" | "success" | "destructive";
  icon?: React.ReactNode;
}

export interface UnifiedPaymentProps {
  /** Recipient name/address shown at top */
  payTo: string;
  /** Optional subtitle under payTo */
  payToSub?: string;
  /** Pre-set amount (for fixed payments) */
  amount?: number;
  /** If true, user can edit the amount (QR pay). If false, amount is locked (reservation/dining) */
  editable?: boolean;
  /** Itemized breakdown lines above the total */
  lineItems?: PaymentLineItem[];
  /** Show reward points toggle */
  showRewards?: boolean;
  /** Called when slide-to-pay completes. Receives final amount. */
  onComplete: (amount: number) => void;
  /** Quick-select amounts for editable mode */
  quickAmounts?: number[];
}

/* ── Slide To Pay (premium design from ScanQRWidgets) ── */
function SlideToPay({ amount, onComplete, disabled }: {
  amount: string; onComplete: () => void; disabled?: boolean;
}) {
  const [dragX, setDragX] = useState(0);
  const [completed, setCompleted] = useState(false);
  const trackRef = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);
  const startX = useRef(0);
  const [trackWidth, setTrackWidth] = useState(280);

  useEffect(() => {
    if (trackRef.current) setTrackWidth(trackRef.current.offsetWidth - 56);
  }, []);

  const progress = Math.min(dragX / trackWidth, 1);

  const handleStart = (clientX: number) => {
    if (completed || disabled) return;
    dragging.current = true;
    startX.current = clientX - dragX;
  };

  const handleMove = useCallback((clientX: number) => {
    if (!dragging.current) return;
    setDragX(Math.max(0, Math.min(clientX - startX.current, trackWidth)));
  }, [trackWidth]);

  const handleEnd = useCallback(() => {
    dragging.current = false;
    if (dragX > trackWidth * 0.7) {
      setDragX(trackWidth);
      setCompleted(true);
      setTimeout(onComplete, 800);
    } else {
      setDragX(0);
    }
  }, [dragX, onComplete, trackWidth]);

  useEffect(() => {
    const moveH = (e: MouseEvent | TouchEvent) => {
      const cx = "touches" in e ? e.touches[0].clientX : e.clientX;
      handleMove(cx);
    };
    const upH = () => handleEnd();
    window.addEventListener("mousemove", moveH);
    window.addEventListener("mouseup", upH);
    window.addEventListener("touchmove", moveH);
    window.addEventListener("touchend", upH);
    return () => {
      window.removeEventListener("mousemove", moveH);
      window.removeEventListener("mouseup", upH);
      window.removeEventListener("touchmove", moveH);
      window.removeEventListener("touchend", upH);
    };
  }, [handleMove, handleEnd]);

  if (disabled) {
    return (
      <div className="relative h-16 rounded-full bg-muted/50 flex items-center justify-center select-none">
        <span className="text-[1rem] text-muted-foreground" style={{ fontWeight: 500 }}>
          Insufficient Balance
        </span>
      </div>
    );
  }

  return (
    <div className="relative">
      <div
        ref={trackRef}
        className="relative h-16 rounded-full overflow-hidden select-none"
        style={{
          background: completed
            ? "var(--success)"
            : `linear-gradient(90deg, color-mix(in srgb, var(--primary) ${Math.round(progress * 40)}%, var(--secondary)) 0%, var(--secondary) 100%)`,
          transition: completed ? "background 0.5s ease" : undefined,
        }}
      >
        {/* Shimmer */}
        {!completed && (
          <div className="absolute inset-0 overflow-hidden" style={{ opacity: 1 - progress * 0.8 }}>
            <div
              className="absolute inset-0"
              style={{
                background: "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.06) 50%, transparent 100%)",
                animation: "slideShimmer 2.5s ease-in-out infinite",
              }}
            />
          </div>
        )}

        {/* Progress fill */}
        {!completed && progress > 0 && (
          <div
            className="absolute top-0 left-0 bottom-0 rounded-full"
            style={{
              width: `${progress * 100}%`,
              background: `linear-gradient(90deg, color-mix(in srgb, var(--primary) 15%, transparent), color-mix(in srgb, var(--primary) 8%, transparent))`,
              transition: dragging.current ? "none" : "width 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)",
            }}
          />
        )}

        {/* Label */}
        <AnimatePresence mode="wait">
          {!completed ? (
            <motion.div
              key="label"
              className="absolute inset-0 flex items-center justify-center gap-2.5"
              initial={{ opacity: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.2 }}
            >
              <span
                className="text-[1rem] text-muted-foreground"
                style={{ opacity: 1 - progress * 1.5, fontWeight: 500 }}
              >
                Slide to Pay {amount}
              </span>
            </motion.div>
          ) : (
            <motion.div
              key="done"
              className="absolute inset-0 flex items-center justify-center gap-2.5 text-white"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, ease: [0.34, 1.56, 0.64, 1] }}
            >
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ duration: 0.5, delay: 0.1, ease: [0.34, 1.56, 0.64, 1] }}
              >
                <Check className="w-6 h-6" />
              </motion.div>
              <span className="text-[1.0625rem]" style={{ fontWeight: 600 }}>
                Payment Complete!
              </span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Thumb */}
        {!completed && (
          <div
            className="absolute top-2 left-2 w-12 h-12 rounded-full cursor-grab active:cursor-grabbing z-10"
            style={{
              transform: `translateX(${dragX}px)`,
              transition: dragging.current ? "none" : "transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)",
            }}
            onMouseDown={(e) => handleStart(e.clientX)}
            onTouchStart={(e) => handleStart(e.touches[0].clientX)}
          >
            <div
              className="absolute -inset-1 rounded-full bg-primary/20"
              style={{
                opacity: progress > 0 ? 0.3 + progress * 0.7 : 0,
                transform: `scale(${1 + progress * 0.3})`,
                transition: "all 0.2s ease",
              }}
            />
            <div
              className="relative w-full h-full rounded-full bg-primary flex items-center justify-center shadow-lg"
              style={{
                boxShadow: `0 4px 15px color-mix(in srgb, var(--primary) ${Math.round(30 + progress * 40)}%, transparent)`,
              }}
            >
              <motion.div
                animate={{ x: [0, 3, 0] }}
                transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
              >
                <ChevronRight className="w-5 h-5 text-primary-foreground" />
              </motion.div>
            </div>
          </div>
        )}

        {/* Ripple on complete */}
        {completed && (
          <motion.div
            className="absolute inset-0 rounded-full bg-white/20"
            initial={{ scale: 0, opacity: 0.5 }}
            animate={{ scale: 3, opacity: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            style={{ transformOrigin: "right center" }}
          />
        )}
      </div>
      <style>{`@keyframes slideShimmer { 0% { transform: translateX(-100%); } 100% { transform: translateX(200%); } }`}</style>
    </div>
  );
}

/* ── Main Unified Payment Component ──────────────── */
export function UnifiedPayment({
  payTo,
  payToSub,
  amount: fixedAmount,
  editable = false,
  lineItems = [],
  showRewards = true,
  onComplete,
  quickAmounts = [5, 10, 15, 20],
}: UnifiedPaymentProps) {
  const [inputAmount, setInputAmount] = useState(fixedAmount ? String(fixedAmount) : "");
  const [useRewards, setUseRewards] = useState(false);
  const [copied, setCopied] = useState(false);
  const [paySource, setPaySource] = useState<"internal" | "external">("internal");

  const payAmount = editable ? (parseFloat(inputAmount) || 0) : (fixedAmount ?? 0); // in USD
  // Bonus (KRW) only applies when paying from internal wallet. Convert to USD for discount math.
  const payAmountKRW = payAmount * USD_TO_KRW;
  const bonusKRWUsed = useRewards && paySource === "internal" ? Math.min(BONUS_BALANCE_KRW, payAmountKRW) : 0;
  const rewardDiscount = bonusKRWUsed / USD_TO_KRW;
  const finalAmount = Math.max(0, payAmount - rewardDiscount);
  const sourceBalanceUSD = paySource === "internal" ? INTERNAL_BALANCE_KRW / USD_TO_KRW : EXTERNAL_BALANCE_USD;
  const remaining = sourceBalanceUSD - finalAmount;
  const insufficient = finalAmount > sourceBalanceUSD;
  const invalid = payAmount <= 0;
  const pointsEarned = Math.floor(finalAmount * POINTS_EARN_RATE);

  const handleCopy = () => {
    navigator.clipboard.writeText(payTo).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const handleComplete = () => {
    onComplete(finalAmount);
  };

  return (
    <div className="flex-1 flex flex-col px-5 pt-4 pb-6 overflow-y-auto">
      {/* Pay To */}
      <div className="rounded-2xl bg-secondary/60 p-4 mb-4">
        <p className="text-muted-foreground text-[0.75rem] mb-1" style={{ fontWeight: 500 }}>
          Pay To
        </p>
        <div className="flex items-center gap-2">
          <p className="text-[0.9375rem] flex-1 truncate" style={{ fontWeight: 600 }}>
            {payTo}
          </p>
          <button
            onClick={handleCopy}
            className="p-1.5 rounded-lg hover:bg-secondary transition"
          >
            {copied ? (
              <CheckCircle className="w-4 h-4 text-success" />
            ) : (
              <Copy className="w-4 h-4 text-muted-foreground" />
            )}
          </button>
        </div>
        {payToSub && (
          <p className="text-muted-foreground text-[0.75rem] mt-0.5">{payToSub}</p>
        )}
      </div>

      {/* Payment source picker */}
      <div className="grid grid-cols-2 gap-2 mb-3">
        <button onClick={() => setPaySource("internal")} className={`rounded-xl p-3 text-left border transition ${paySource === "internal" ? "border-primary bg-primary/5" : "border-border bg-card hover:bg-secondary/30"}`}>
          <p className="text-[0.6875rem] text-muted-foreground" style={{ fontWeight: 500 }}>Domestic (KRW)</p>
          <p className="text-[0.9375rem] mt-0.5" style={{ fontWeight: 700 }}>{fmtKRW(INTERNAL_BALANCE_KRW)}</p>
          <p className="text-[0.625rem] text-success mt-0.5" style={{ fontWeight: 500 }}>+{fmtKRW(BONUS_BALANCE_KRW)} bonus</p>
        </button>
        <button onClick={() => { setPaySource("external"); setUseRewards(false); }} className={`rounded-xl p-3 text-left border transition ${paySource === "external" ? "border-primary bg-primary/5" : "border-border bg-card hover:bg-secondary/30"}`}>
          <p className="text-[0.6875rem] text-muted-foreground" style={{ fontWeight: 500 }}>Foreign (USD)</p>
          <p className="text-[0.9375rem] mt-0.5" style={{ fontWeight: 700 }}>{fmtUSD(EXTERNAL_BALANCE_USD)}</p>
          <p className="text-[0.625rem] text-muted-foreground mt-0.5">VISA ••4242</p>
        </button>
      </div>

      {/* Balance Cards */}
      <div className="grid grid-cols-3 gap-3 mb-4">
        <div className="rounded-xl bg-secondary/60 p-3 text-center">
          <p className="text-muted-foreground text-[0.6875rem] mb-0.5" style={{ fontWeight: 500 }}>
            {paySource === "internal" ? "Domestic" : "Foreign"}
          </p>
          <p className="text-[1.125rem]" style={{ fontWeight: 700 }}>
            {paySource === "internal" ? fmtKRW(INTERNAL_BALANCE_KRW) : fmtUSD(EXTERNAL_BALANCE_USD)}
          </p>
        </div>
        <div className="rounded-xl bg-primary/10 p-3 text-center">
          <p className="text-primary text-[0.6875rem] mb-0.5" style={{ fontWeight: 500 }}>
            Paying
          </p>
          <p className="text-primary text-[1.125rem]" style={{ fontWeight: 700 }}>
            ${finalAmount.toFixed(2)}
          </p>
        </div>
        <div className={`rounded-xl p-3 text-center ${insufficient ? "bg-destructive/10" : "bg-success/10"}`}>
          <p className={`text-[0.6875rem] mb-0.5 ${insufficient ? "text-destructive" : "text-success"}`} style={{ fontWeight: 500 }}>
            Remaining
          </p>
          <p className={`text-[1.125rem] ${insufficient ? "text-destructive" : "text-success"}`} style={{ fontWeight: 700 }}>
            ${remaining.toFixed(2)}
          </p>
        </div>
      </div>

      {/* Amount Input (editable) or Payment Summary (fixed) */}
      {editable ? (
        <div className="mb-4">
          <label className="text-[0.8125rem] text-muted-foreground mb-2 block" style={{ fontWeight: 500 }}>
            Enter Amount
          </label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground text-[1.25rem]" style={{ fontWeight: 600 }}>
              $
            </span>
            <input
              type="number"
              min="0"
              step="0.01"
              value={inputAmount}
              onChange={(e) => setInputAmount(e.target.value)}
              placeholder="0.00"
              className="w-full h-14 pl-10 pr-4 rounded-2xl bg-secondary/60 border border-border text-[1.25rem] outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition"
              style={{ fontWeight: 600 }}
            />
          </div>
          <div className="flex gap-2 mt-3">
            {quickAmounts.map((v) => (
              <button
                key={v}
                onClick={() => setInputAmount(String(v))}
                className="flex-1 py-2 rounded-xl bg-secondary/60 text-[0.8125rem] hover:bg-primary/10 hover:text-primary transition"
                style={{ fontWeight: 500 }}
              >
                ${v}
              </button>
            ))}
          </div>
        </div>
      ) : (
        lineItems.length > 0 && (
          <div className="p-4 rounded-xl border border-border space-y-2 mb-4">
            {lineItems.map((item, i) => (
              <div key={i} className="flex justify-between text-[0.875rem]">
                <span className={`flex items-center gap-1.5 ${item.color === "success" ? "text-success" : item.color === "muted" ? "text-muted-foreground" : ""}`}>
                  {item.icon}
                  {item.label}
                </span>
                <span
                  className={item.color === "success" ? "text-success" : item.color === "muted" ? "text-muted-foreground" : ""}
                  style={{ fontWeight: 500 }}
                >
                  {item.value < 0 ? `-$${Math.abs(item.value).toFixed(2)}` : `$${item.value.toFixed(2)}`}
                </span>
              </div>
            ))}
            <div className="border-t border-border pt-2 mt-1" />
            <div className="flex justify-between text-[1rem]" style={{ fontWeight: 700 }}>
              <span>Total</span>
              <span>${payAmount.toFixed(2)}</span>
            </div>
          </div>
        )
      )}

      {/* Fixed amount display when no line items */}
      {!editable && lineItems.length === 0 && (
        <div className="p-4 rounded-xl border border-border mb-4">
          <div className="flex justify-between text-[1rem]" style={{ fontWeight: 700 }}>
            <span>Total</span>
            <span>${payAmount.toFixed(2)}</span>
          </div>
        </div>
      )}

      {/* Reward / Bonus Points */}
      {showRewards && (
        <div className={`flex items-center gap-3 p-4 rounded-xl border border-border mb-4 ${paySource === "external" ? "opacity-60" : ""}`}>
          <div className="w-10 h-10 rounded-full bg-success/15 flex items-center justify-center shrink-0">
            <Gift className="w-5 h-5 text-success" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-[0.875rem]" style={{ fontWeight: 500 }}>Bonus Points</span>
              {useRewards && paySource === "internal" && <DSBadge variant="soft" color="success" size="sm">APPLIED</DSBadge>}
            </div>
            <p className="text-[0.75rem] text-muted-foreground">
              {paySource === "internal"
                ? <>You have <span className="text-success" style={{ fontWeight: 600 }}>{fmtKRW(BONUS_BALANCE_KRW)}</span> in bonus</>
                : <>Bonus only applies to Domestic (KRW) wallet</>}
            </p>
          </div>
          {useRewards && paySource === "internal" && (
            <span className="text-[0.875rem] text-success mr-1" style={{ fontWeight: 600 }}>
              -${rewardDiscount.toFixed(2)}
            </span>
          )}
          <Toggle checked={useRewards && paySource === "internal"} onToggle={setUseRewards} size="md" color="success" />
        </div>
      )}

      {/* Points earn */}
      {showRewards && !insufficient && !invalid && (
        <div className="flex items-center gap-2 text-[0.8125rem] text-muted-foreground px-1 mb-4">
          <Gift className="w-4 h-4 text-success" />
          <span>
            You'll earn <span className="text-success" style={{ fontWeight: 700 }}>{pointsEarned} points</span> from this payment
          </span>
        </div>
      )}

      {/* Security badge */}
      <div className="flex items-center justify-center gap-2 text-[0.75rem] text-muted-foreground mb-4">
        <Shield className="w-3.5 h-3.5 text-success" />
        <span>Secure payment from your balance</span>
      </div>

      {/* Warning */}
      <AnimatePresence>
        {insufficient && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-4 overflow-hidden"
          >
            <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-destructive/10 border border-destructive/20">
              <AlertTriangle className="w-5 h-5 text-destructive shrink-0 mt-0.5" />
              <div>
                <p className="text-destructive text-[0.8125rem]" style={{ fontWeight: 600 }}>
                  Insufficient Balance
                </p>
                <p className="text-destructive/70 text-[0.75rem] mt-0.5">
                  You need ${(finalAmount - USER_BALANCE).toFixed(2)} more. Top up your balance in the Profile page.
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Spacer */}
      <div className="flex-1 min-h-[1rem]" />

      {/* Slide to Pay */}
      <SlideToPay
        amount={`$${finalAmount.toFixed(2)}`}
        onComplete={handleComplete}
        disabled={insufficient || invalid}
      />
    </div>
  );
}
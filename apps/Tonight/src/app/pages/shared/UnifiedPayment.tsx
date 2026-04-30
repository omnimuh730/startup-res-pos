/* UnifiedPayment - reusable payment surface for QR Pay, Reservation, and Dining flows */
import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { AnimatePresence, motion } from "motion/react";
import {
  AlertTriangle,
  BadgeCheck,
  Check,
  CheckCircle,
  ChevronRight,
  Copy,
  Gift,
  Lock,
  ReceiptText,
  Shield,
  Wallet,
} from "lucide-react";
import { Toggle } from "../../components/ds/Toggle";

const INTERNAL_BALANCE_KRW = 13_000_000;
const BONUS_BALANCE_KRW = 330_000;
const WALLET_BALANCE_USD = 5000.0;
const USD_TO_KRW = 1350;
const POINTS_EARN_RATE = 2;

const fmtKRW = (value: number) => `\u20A9${Math.round(value).toLocaleString()}`;
const fmtUSD = (value: number) => `$${value.toFixed(2)}`;
const pct = (value: number, max: number) => Math.max(0, Math.min(100, (value / Math.max(max, 1)) * 100));

export interface PaymentLineItem {
  label: string;
  value: number;
  color?: "default" | "muted" | "success" | "destructive";
  icon?: ReactNode;
}

export interface UnifiedPaymentProps {
  payTo: string;
  payToSub?: string;
  amount?: number;
  amountKRW?: number;
  editable?: boolean;
  lineItems?: PaymentLineItem[];
  showRewards?: boolean;
  onComplete: (amount: number) => void;
  quickAmounts?: number[];
}

function formatPaying(krw: number, usd: number) {
  const parts = [krw > 0 ? fmtKRW(krw) : "", usd > 0 ? fmtUSD(usd) : ""].filter(Boolean);
  return parts.length ? parts.join(" + ") : "Enter amount";
}

function MiniPill({
  children,
  tone = "default",
}: {
  children: ReactNode;
  tone?: "default" | "primary" | "success" | "warning";
}) {
  const toneClass = {
    default: "bg-secondary text-muted-foreground",
    primary: "bg-primary/10 text-primary",
    success: "bg-success/10 text-success",
    warning: "bg-warning/10 text-warning",
  }[tone];

  return (
    <span className={`inline-flex h-7 items-center gap-1.5 rounded-full px-2.5 text-[0.75rem] font-medium ${toneClass}`}>
      {children}
    </span>
  );
}

function SlideToPay({
  amount,
  onComplete,
  disabled,
}: {
  amount: string;
  onComplete: () => void;
  disabled?: boolean;
}) {
  const [dragX, setDragX] = useState(0);
  const [completed, setCompleted] = useState(false);
  const trackRef = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);
  const startX = useRef(0);
  const [trackWidth, setTrackWidth] = useState(280);

  useEffect(() => {
    if (!trackRef.current) return;
    const update = () => setTrackWidth(Math.max(1, trackRef.current!.offsetWidth - 56));
    update();
    const observer = new ResizeObserver(update);
    observer.observe(trackRef.current);
    return () => observer.disconnect();
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
    if (!dragging.current) return;
    dragging.current = false;
    if (dragX > trackWidth * 0.72) {
      setDragX(trackWidth);
      setCompleted(true);
      window.setTimeout(onComplete, 650);
    } else {
      setDragX(0);
    }
  }, [dragX, onComplete, trackWidth]);

  useEffect(() => {
    const move = (event: MouseEvent | TouchEvent) => {
      const clientX = "touches" in event ? event.touches[0].clientX : event.clientX;
      handleMove(clientX);
    };
    const up = () => handleEnd();
    window.addEventListener("mousemove", move);
    window.addEventListener("mouseup", up);
    window.addEventListener("touchmove", move);
    window.addEventListener("touchend", up);
    return () => {
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mouseup", up);
      window.removeEventListener("touchmove", move);
      window.removeEventListener("touchend", up);
    };
  }, [handleEnd, handleMove]);

  if (disabled) {
    return (
      <div className="flex h-14 items-center justify-center rounded-full border border-border bg-secondary/70 text-[0.9375rem] text-muted-foreground">
        {amount ? "Insufficient balance" : "Enter an amount"}
      </div>
    );
  }

  return (
    <div className="relative">
      <div ref={trackRef} className="relative h-14 overflow-hidden rounded-full border border-border bg-card shadow-[0_10px_26px_rgba(0,0,0,0.07)]">
        <motion.div
          className="absolute inset-y-0 left-0 rounded-full bg-primary/12"
          animate={{ width: `${progress * 100}%` }}
          transition={{ duration: dragging.current ? 0 : 0.24, ease: "easeOut" }}
        />
        <AnimatePresence mode="wait">
          {!completed ? (
            <motion.div
              key="label"
              className="absolute inset-0 flex items-center justify-center gap-2 text-[0.9375rem] text-muted-foreground"
              initial={{ opacity: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
            >
              <Lock className="h-4 w-4" />
              <span style={{ opacity: 1 - progress * 1.4 }}>Slide to pay {amount}</span>
            </motion.div>
          ) : (
            <motion.div
              key="done"
              className="absolute inset-0 flex items-center justify-center gap-2 bg-success text-[0.9375rem] font-medium text-success-foreground"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <Check className="h-5 w-5" />
              Payment complete
            </motion.div>
          )}
        </AnimatePresence>
        {!completed && (
          <div
            className="absolute left-1 top-1 flex h-12 w-12 cursor-grab items-center justify-center rounded-full bg-primary text-primary-foreground shadow-[0_10px_22px_rgba(255,56,92,0.26)] active:cursor-grabbing"
            style={{
              transform: `translateX(${dragX}px)`,
              transition: dragging.current ? "none" : "transform 0.24s ease-out",
            }}
            onMouseDown={(event) => handleStart(event.clientX)}
            onTouchStart={(event) => handleStart(event.touches[0].clientX)}
          >
            <ChevronRight className="h-5 w-5" />
          </div>
        )}
      </div>
    </div>
  );
}

function SourceCard({
  active,
  icon,
  title,
  subtitle,
  balance,
  paying,
  remaining,
  progress,
  insufficient,
}: {
  active: boolean;
  icon: ReactNode;
  title: string;
  subtitle: string;
  balance: string;
  paying: string;
  remaining: string;
  progress: number;
  insufficient?: boolean;
}) {
  return (
    <motion.div
      layout
      className={`rounded-[1.35rem] border bg-card p-3.5 transition ${
        active ? "border-primary/35 shadow-[0_10px_26px_rgba(255,56,92,0.08)]" : "border-border"
      }`}
    >
      <div className="mb-3 flex items-center gap-2.5">
        <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${active ? "bg-primary/10 text-primary" : "bg-secondary text-muted-foreground"}`}>
          {icon}
        </span>
        <div className="min-w-0 flex-1">
          <p className="truncate text-[0.875rem] font-medium">{title}</p>
          <p className="truncate text-[0.75rem] text-muted-foreground">{subtitle}</p>
        </div>
        {active && <span className="h-2 w-2 shrink-0 rounded-full bg-primary" />}
      </div>
      <div className="mb-3 h-1.5 overflow-hidden rounded-full bg-secondary">
        <div className={`h-full rounded-full ${insufficient ? "bg-destructive" : active ? "bg-primary" : "bg-border"}`} style={{ width: `${progress}%` }} />
      </div>
      <div className="space-y-1.5 text-[0.75rem]">
        <div className="flex justify-between gap-3">
          <span className="text-muted-foreground">Available</span>
          <span>{balance}</span>
        </div>
        <div className="flex justify-between gap-3">
          <span className="text-muted-foreground">This payment</span>
          <span className={active ? "text-primary" : "text-muted-foreground"}>{paying}</span>
        </div>
        <div className="flex justify-between gap-3">
          <span className="text-muted-foreground">After</span>
          <span className={insufficient ? "text-destructive" : ""}>{remaining}</span>
        </div>
      </div>
    </motion.div>
  );
}

function LineItemRow({ item }: { item: PaymentLineItem }) {
  const tone = item.color === "success"
    ? "text-success"
    : item.color === "destructive"
      ? "text-destructive"
      : item.color === "muted"
        ? "text-muted-foreground"
        : "";

  return (
    <div className="flex items-center justify-between gap-3 text-[0.875rem]">
      <span className={`flex min-w-0 items-center gap-1.5 ${tone}`}>
        {item.icon}
        <span className="truncate">{item.label}</span>
      </span>
      <span className={tone}>{item.value < 0 ? `-$${Math.abs(item.value).toFixed(2)}` : `$${item.value.toFixed(2)}`}</span>
    </div>
  );
}

export function UnifiedPayment({
  payTo,
  payToSub,
  amount: fixedAmount,
  amountKRW: fixedKRW,
  editable = false,
  lineItems = [],
  showRewards = true,
  onComplete,
  quickAmounts = [5, 10, 15, 20],
}: UnifiedPaymentProps) {
  const [amountUSD, setAmountUSD] = useState(fixedAmount ? String(fixedAmount) : "");
  const [amountKRW, setAmountKRW] = useState(fixedKRW ? String(fixedKRW) : "");
  const [useRewards, setUseRewards] = useState(false);
  const [copied, setCopied] = useState(false);

  const krwNum = parseFloat(amountKRW) || 0;
  const usdNum = parseFloat(amountUSD) || 0;
  const payKRW = editable ? krwNum : (fixedKRW ?? 0);
  const payUSD = editable ? usdNum : (fixedAmount ?? 0);
  const bonusKRWUsed = useRewards ? Math.min(BONUS_BALANCE_KRW, payKRW) : 0;
  const finalKRW = Math.max(0, payKRW - bonusKRWUsed);
  const finalUSD = payUSD;
  const remainingKRW = INTERNAL_BALANCE_KRW - finalKRW;
  const remainingUSD = WALLET_BALANCE_USD - finalUSD;
  const insufficientKRW = finalKRW > INTERNAL_BALANCE_KRW;
  const insufficientUSD = finalUSD > WALLET_BALANCE_USD;
  const insufficient = insufficientKRW || insufficientUSD;
  const invalid = payKRW <= 0 && payUSD <= 0;
  const pointsEarned = Math.floor((finalKRW / USD_TO_KRW + finalUSD) * POINTS_EARN_RATE);
  const finalLabel = formatPaying(finalKRW, finalUSD);

  useEffect(() => {
    if (payKRW <= 0 && useRewards) setUseRewards(false);
  }, [payKRW, useRewards]);

  const handleCopy = () => {
    navigator.clipboard?.writeText(payTo).catch(() => {});
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1300);
  };

  const handleComplete = () => {
    onComplete(finalKRW / USD_TO_KRW + finalUSD);
  };

  return (
    <div className="flex flex-1 flex-col overflow-y-auto bg-background px-5 pb-6 pt-4">
      <motion.section
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-4 rounded-[1.6rem] border border-border bg-card p-4 shadow-[0_10px_30px_rgba(0,0,0,0.055)]"
      >
        <div className="mb-4 flex items-center justify-between gap-3">
          <MiniPill tone="success">
            <BadgeCheck className="h-3.5 w-3.5" />
            Verified
          </MiniPill>
          <MiniPill tone={invalid ? "warning" : "primary"}>
            {invalid ? "Waiting for amount" : "Ready"}
          </MiniPill>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-secondary text-primary">
            <ReceiptText className="h-5 w-5" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-[0.75rem] text-muted-foreground">Pay to</p>
            <p className="truncate text-[0.9375rem] font-medium">{payTo}</p>
            {payToSub && <p className="mt-0.5 truncate text-[0.75rem] text-muted-foreground">{payToSub}</p>}
          </div>
          <button
            type="button"
            onClick={handleCopy}
            className="relative flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-secondary text-muted-foreground transition hover:text-primary active:scale-95"
            aria-label="Copy recipient"
          >
            <AnimatePresence mode="wait">
              {copied ? (
                <motion.span key="check" initial={{ scale: 0.5, rotate: -12 }} animate={{ scale: 1, rotate: 0 }} exit={{ scale: 0.5, opacity: 0 }}>
                  <CheckCircle className="h-4 w-4 text-primary" />
                </motion.span>
              ) : (
                <motion.span key="copy" initial={{ scale: 0.8 }} animate={{ scale: 1 }} exit={{ scale: 0.8, opacity: 0 }}>
                  <Copy className="h-4 w-4" />
                </motion.span>
              )}
            </AnimatePresence>
            <AnimatePresence>
              {copied && (
                <motion.span
                  initial={{ opacity: 0, y: 6, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 4, scale: 0.92 }}
                  className="absolute -top-9 whitespace-nowrap rounded-full bg-primary px-2.5 py-1 text-[0.6875rem] font-medium text-primary-foreground shadow-[0_8px_18px_rgba(255,56,92,0.2)]"
                >
                  Copied
                </motion.span>
              )}
            </AnimatePresence>
          </button>
        </div>
      </motion.section>

      <section className="mb-4 rounded-[1.75rem] border border-border bg-card p-4 shadow-[0_8px_24px_rgba(0,0,0,0.045)]">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="text-[0.75rem] text-muted-foreground">Total payment</p>
            <p className="mt-1 truncate text-[1.85rem] font-semibold leading-tight">{finalLabel}</p>
            <p className="mt-2 max-w-[18rem] text-[0.75rem] leading-snug text-muted-foreground">
              Tonight Wallet keeps KRW and USD pockets separate, so each balance stays easy to review.
            </p>
          </div>
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
            <Shield className="h-5 w-5" />
          </div>
        </div>
      </section>

      {editable && (
        <section className="mb-4 rounded-[1.5rem] border border-border bg-card p-4">
          <div className="mb-3 flex items-end justify-between gap-3">
            <div>
              <p className="text-[0.9375rem] font-medium">Amount builder</p>
              <p className="mt-0.5 text-[0.75rem] text-muted-foreground">Choose one Tonight Wallet pocket or split the payment.</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <label className="rounded-[1.2rem] bg-secondary/65 px-3 py-2.5">
              <span className="text-[0.6875rem] text-muted-foreground">Wallet KRW</span>
              <div className="mt-1 flex items-center gap-1.5">
                <span className="text-[0.8125rem] text-muted-foreground">KRW</span>
                <input
                  type="number"
                  min="0"
                  step="1000"
                  value={amountKRW}
                  onChange={(event) => setAmountKRW(event.target.value)}
                  placeholder="0"
                  className="min-w-0 flex-1 bg-transparent text-[1rem] outline-none"
                />
              </div>
            </label>
            <label className="rounded-[1.2rem] bg-secondary/65 px-3 py-2.5">
              <span className="text-[0.6875rem] text-muted-foreground">Wallet USD</span>
              <div className="mt-1 flex items-center gap-1.5">
                <span className="text-[0.8125rem] text-muted-foreground">USD</span>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={amountUSD}
                  onChange={(event) => setAmountUSD(event.target.value)}
                  placeholder="0.00"
                  className="min-w-0 flex-1 bg-transparent text-[1rem] outline-none"
                />
              </div>
            </label>
          </div>
          <div className="mt-3 flex gap-2">
            {quickAmounts.map((value) => (
              <button
                key={value}
                type="button"
                onClick={() => {
                  setAmountUSD(String(value));
                  setAmountKRW("");
                }}
                className="flex-1 rounded-full bg-secondary px-3 py-2 text-[0.8125rem] text-muted-foreground transition hover:bg-primary/10 hover:text-primary"
              >
                ${value}
              </button>
            ))}
          </div>
        </section>
      )}

      <section className="mb-4">
        <div className="mb-2 flex items-center justify-between">
          <p className="text-[0.9375rem] font-medium">Tonight Wallet</p>
          <span className="text-[0.75rem] text-muted-foreground">{[payKRW > 0, payUSD > 0].filter(Boolean).length || 0} pocket{[payKRW > 0, payUSD > 0].filter(Boolean).length === 1 ? "" : "s"} active</span>
        </div>
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          <SourceCard
            active={payKRW > 0}
            icon={<Wallet className="h-4 w-4" />}
            title="KRW pocket"
            subtitle="Tonight Wallet balance"
            balance={fmtKRW(INTERNAL_BALANCE_KRW)}
            paying={payKRW > 0 ? fmtKRW(finalKRW) : fmtKRW(0)}
            remaining={fmtKRW(remainingKRW)}
            progress={pct(finalKRW, INTERNAL_BALANCE_KRW)}
            insufficient={insufficientKRW}
          />
          <SourceCard
            active={payUSD > 0}
            icon={<Wallet className="h-4 w-4" />}
            title="USD pocket"
            subtitle="Tonight Wallet balance"
            balance={fmtUSD(WALLET_BALANCE_USD)}
            paying={payUSD > 0 ? fmtUSD(finalUSD) : fmtUSD(0)}
            remaining={fmtUSD(remainingUSD)}
            progress={pct(finalUSD, WALLET_BALANCE_USD)}
            insufficient={insufficientUSD}
          />
        </div>
      </section>

      {lineItems.length > 0 && (
        <section className="mb-4 rounded-[1.5rem] border border-border bg-card p-4">
          <div className="mb-3 flex items-center justify-between gap-3">
            <p className="text-[0.9375rem] font-medium">Breakdown</p>
            <ReceiptText className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="space-y-2">
            {lineItems.map((item, index) => <LineItemRow key={`${item.label}-${index}`} item={item} />)}
            <div className="h-px bg-border" />
            <div className="space-y-1.5 pt-1">
              {payKRW > 0 && (
                <div className="flex justify-between text-[0.875rem]">
                  <span className="text-muted-foreground">Domestic total</span>
                  <span>{fmtKRW(finalKRW)}</span>
                </div>
              )}
              {payUSD > 0 && (
                <div className="flex justify-between text-[0.875rem]">
                  <span className="text-muted-foreground">USD wallet total</span>
                  <span>{fmtUSD(finalUSD)}</span>
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {showRewards && (
        <section className={`mb-4 rounded-[1.5rem] border border-border bg-card p-4 ${payKRW <= 0 ? "opacity-70" : ""}`}>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-success/10 text-success">
              <Gift className="h-5 w-5" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-[0.9375rem] font-medium">Bonus balance</p>
              <p className="mt-0.5 text-[0.75rem] text-muted-foreground">
                {payKRW > 0 ? `${fmtKRW(BONUS_BALANCE_KRW)} available for domestic payments` : "Bonus applies to domestic wallet payments only"}
              </p>
            </div>
            {bonusKRWUsed > 0 && <span className="text-[0.8125rem] text-success">-{fmtKRW(bonusKRWUsed)}</span>}
            <Toggle
              checked={useRewards && payKRW > 0}
              onToggle={(checked) => setUseRewards(payKRW > 0 ? checked : false)}
              disabled={payKRW <= 0}
              size="md"
              color="success"
            />
          </div>
          {!insufficient && !invalid && (
            <p className="mt-3 text-[0.75rem] text-muted-foreground">
              You will earn <span className="text-success">{pointsEarned} points</span> from this payment.
            </p>
          )}
        </section>
      )}

      <AnimatePresence>
        {insufficient && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-4 overflow-hidden"
          >
            <div className="flex items-start gap-3 rounded-[1.25rem] border border-destructive/20 bg-destructive/8 p-3.5">
              <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-destructive" />
              <div>
                <p className="text-[0.8125rem] font-medium text-destructive">Insufficient balance</p>
                <p className="mt-0.5 text-[0.75rem] text-destructive/75">
                  {insufficientKRW && <>Need {fmtKRW(finalKRW - INTERNAL_BALANCE_KRW)} more in Domestic. </>}
                  {insufficientUSD && <>Need {fmtUSD(finalUSD - WALLET_BALANCE_USD)} more in USD wallet. </>}
                  Top up in Profile.
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="mb-4 flex items-center justify-center gap-2 text-[0.75rem] text-muted-foreground">
        <Shield className="h-3.5 w-3.5 text-success" />
        Secure payment from your saved balance
      </div>

      <div className="min-h-4 flex-1" />

      <SlideToPay amount={invalid ? "" : finalLabel} onComplete={handleComplete} disabled={insufficient || invalid} />
    </div>
  );
}

import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { AnimatePresence, motion } from "motion/react";
import { AlertTriangle, BadgeCheck, Check, CheckCircle, ChevronRight, Copy, Gift, Lock, ReceiptText, Shield, Wallet } from "lucide-react";
import { Toggle } from "../../../components/ds/Toggle";
import { BONUS_BALANCE_KRW, INTERNAL_BALANCE_KRW, WALLET_BALANCE_USD } from "./constants";
import type { PaymentLineItem } from "./types";
import { fmtKRW, fmtUSD, pct } from "./utils";

function MiniPill({ children, tone = "default" }: { children: ReactNode; tone?: "default" | "primary" | "success" | "warning" }) {
  const toneClass = { default: "bg-secondary text-muted-foreground", primary: "bg-primary/10 text-primary", success: "bg-success/10 text-success", warning: "bg-warning/10 text-warning" }[tone];
  return <span className={`inline-flex h-7 items-center gap-1.5 rounded-full px-2.5 text-[0.75rem] font-medium ${toneClass}`}>{children}</span>;
}

function SlideToPay({ amount, onComplete, disabled }: { amount: string; onComplete: () => void; disabled?: boolean }) {
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
    return <div className="flex h-14 items-center justify-center rounded-full border border-border bg-secondary/70 text-[0.9375rem] text-muted-foreground">{amount ? "Insufficient balance" : "Enter an amount"}</div>;
  }

  return (
    <div className="relative">
      <div ref={trackRef} className="relative h-14 overflow-hidden rounded-full border border-border bg-card shadow-[0_10px_26px_rgba(0,0,0,0.07)]">
        <motion.div className="absolute inset-y-0 left-0 rounded-full bg-primary/12" animate={{ width: `${progress * 100}%` }} transition={{ duration: dragging.current ? 0 : 0.24, ease: "easeOut" }} />
        <AnimatePresence mode="wait">
          {!completed ? (
            <motion.div key="label" className="absolute inset-0 flex items-center justify-center gap-2 text-[0.9375rem] text-muted-foreground" initial={{ opacity: 1 }} exit={{ opacity: 0, scale: 0.96 }}>
              <Lock className="h-4 w-4" />
              <span style={{ opacity: 1 - progress * 1.4 }}>Slide to pay {amount}</span>
            </motion.div>
          ) : (
            <motion.div key="done" className="absolute inset-0 flex items-center justify-center gap-2 bg-success text-[0.9375rem] font-medium text-success-foreground" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <Check className="h-5 w-5" />
              Payment complete
            </motion.div>
          )}
        </AnimatePresence>
        {!completed && (
          <div className="absolute left-1 top-1 flex h-12 w-12 cursor-grab items-center justify-center rounded-full bg-primary text-primary-foreground shadow-[0_10px_22px_rgba(255,56,92,0.26)] active:cursor-grabbing" style={{ transform: `translateX(${dragX}px)`, transition: dragging.current ? "none" : "transform 0.24s ease-out" }} onMouseDown={(event) => handleStart(event.clientX)} onTouchStart={(event) => handleStart(event.touches[0].clientX)}>
            <ChevronRight className="h-5 w-5" />
          </div>
        )}
      </div>
    </div>
  );
}

function SourceCard({ active, icon, title, subtitle, balance, paying, remaining, progress, insufficient }: { active: boolean; icon: ReactNode; title: string; subtitle: string; balance: string; paying: string; remaining: string; progress: number; insufficient?: boolean }) {
  return (
    <motion.div layout className={`rounded-[1.35rem] border bg-card p-3.5 transition ${active ? "border-primary/35 shadow-[0_10px_26px_rgba(255,56,92,0.08)]" : "border-border"}`}>
      <div className="mb-3 flex items-center gap-2.5">
        <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${active ? "bg-primary/10 text-primary" : "bg-secondary text-muted-foreground"}`}>{icon}</span>
        <div className="min-w-0 flex-1"><p className="truncate text-[0.875rem] font-medium">{title}</p><p className="truncate text-[0.75rem] text-muted-foreground">{subtitle}</p></div>
        {active && <span className="h-2 w-2 shrink-0 rounded-full bg-primary" />}
      </div>
      <div className="mb-3 h-1.5 overflow-hidden rounded-full bg-secondary"><div className={`h-full rounded-full ${insufficient ? "bg-destructive" : active ? "bg-primary" : "bg-border"}`} style={{ width: `${progress}%` }} /></div>
      <div className="space-y-1.5 text-[0.75rem]">
        <div className="flex justify-between gap-3"><span className="text-muted-foreground">Available</span><span>{balance}</span></div>
        <div className="flex justify-between gap-3"><span className="text-muted-foreground">This payment</span><span className={active ? "text-primary" : "text-muted-foreground"}>{paying}</span></div>
        <div className="flex justify-between gap-3"><span className="text-muted-foreground">After</span><span className={insufficient ? "text-destructive" : ""}>{remaining}</span></div>
      </div>
    </motion.div>
  );
}

function LineItemRow({ item }: { item: PaymentLineItem }) {
  const tone = item.color === "success" ? "text-success" : item.color === "destructive" ? "text-destructive" : item.color === "muted" ? "text-muted-foreground" : "";
  return (
    <div className="flex items-center justify-between gap-3 text-[0.875rem]">
      <span className={`flex min-w-0 items-center gap-1.5 ${tone}`}>{item.icon}<span className="truncate">{item.label}</span></span>
      <span className={tone}>{item.value < 0 ? `-$${Math.abs(item.value).toFixed(2)}` : `$${item.value.toFixed(2)}`}</span>
    </div>
  );
}

export { MiniPill, SlideToPay, SourceCard, LineItemRow };

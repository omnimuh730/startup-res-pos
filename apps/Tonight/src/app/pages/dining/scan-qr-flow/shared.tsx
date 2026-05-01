import { type ComponentType, type ReactNode } from "react";
import { motion } from "motion/react";
import { Receipt, Star } from "lucide-react";
import { Text, Heading } from "../../../components/ds/Text";
import { ImageWithFallback } from "../../../components/figma/ImageWithFallback";
import { FULL_MENU, type BookingInfo } from "../scanQRData";
import { formatMoney } from "./helpers";

export function StepIntro({ icon: Icon, title, desc, tone = "primary" }: { icon: ComponentType<{ className?: string; strokeWidth?: number }>; title: string; desc: string; tone?: "primary" | "success" | "warning" | "info" }) {
  const toneClass = { primary: "bg-primary/10 text-primary", success: "bg-success/10 text-success", warning: "bg-warning/10 text-warning", info: "bg-info/10 text-info" }[tone];
  return (
    <div className="text-center">
      <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: [1.06, 1], opacity: 1 }} transition={{ duration: 0.3, ease: "easeOut" }} className={`mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-[1.25rem] ${toneClass}`}>
        <Icon className="h-7 w-7" />
      </motion.div>
      <Heading level={3}>{title}</Heading>
      <Text className="mx-auto mt-1 max-w-xs text-[0.875rem] leading-snug text-muted-foreground">{desc}</Text>
    </div>
  );
}

export function BookingMiniCard({ booking, right }: { booking: BookingInfo; right?: ReactNode }) {
  return (
    <div className="flex items-center gap-3 rounded-[1.35rem] border border-border bg-card p-3 shadow-[0_6px_20px_rgba(0,0,0,0.045)]">
      <ImageWithFallback src={booking.image} alt={booking.restaurant} className="h-14 w-14 shrink-0 rounded-[1rem] object-cover object-center" />
      <div className="min-w-0 flex-1 text-left">
        <Text className="truncate text-[0.9375rem]" style={{ fontWeight: 900 }}>{booking.restaurant}</Text>
        <Text className="mt-0.5 truncate text-[0.75rem] text-muted-foreground">{booking.date} - {booking.time} - {booking.guests} guest{booking.guests > 1 ? "s" : ""}</Text>
        <Text className="mt-0.5 text-[0.75rem] text-primary" style={{ fontWeight: 800 }}>Table P1 - {booking.seating}</Text>
      </div>
      {right}
    </div>
  );
}

export function BillCard({ items, subtotal, tax, tip, total, tipPercent, setTipPercent, compact = false }: { items: typeof FULL_MENU; subtotal: number; tax?: number; tip?: number; total?: number; tipPercent?: number; setTipPercent?: (value: number) => void; compact?: boolean }) {
  return (
    <div className="w-full rounded-[1.5rem] border border-border bg-card p-4 text-left shadow-[0_6px_20px_rgba(0,0,0,0.045)]">
      <div className="mb-3 flex items-center justify-between"><div className="flex items-center gap-2"><Receipt className="h-4 w-4 text-primary" /><Text className="text-[0.9375rem]" style={{ fontWeight: 900 }}>{compact ? "Live bill" : "Your bill"}</Text></div>{compact && <span className="inline-flex items-center gap-1.5 rounded-full bg-warning/10 px-2.5 py-1 text-warning"><span className="h-1.5 w-1.5 rounded-full bg-warning" /><Text className="text-[0.6875rem] text-warning" style={{ fontWeight: 800 }}>Updating</Text></span>}</div>
      <div className="divide-y divide-border">{items.map((item, index) => <div key={`${item.name}-${index}`} className="flex items-center justify-between gap-3 py-2.5"><div className="flex min-w-0 items-center gap-3"><span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-secondary text-[0.6875rem]" style={{ fontWeight: 900 }}>{item.icon}</span><div className="min-w-0"><Text className="truncate text-[0.875rem]" style={{ fontWeight: 700 }}>{item.name}</Text><Text className="text-[0.75rem] text-muted-foreground">Qty {item.qty}</Text></div></div><Text className="text-[0.875rem]" style={{ fontWeight: 800 }}>{formatMoney(item.price)}</Text></div>)}</div>
      {typeof tax === "number" && typeof tip === "number" && typeof total === "number" ? (
        <div className="mt-3 border-t border-border pt-3">
          <div className="space-y-1.5 text-[0.875rem]"><div className="flex justify-between"><Text className="text-muted-foreground">Subtotal</Text><Text>{formatMoney(subtotal)}</Text></div><div className="flex justify-between"><Text className="text-muted-foreground">Tax</Text><Text>{formatMoney(tax)}</Text></div></div>
          {setTipPercent && <div className="mt-4"><div className="mb-2 flex items-center justify-between"><Text className="text-[0.875rem] text-muted-foreground">Tip</Text><Text className="text-[0.875rem]" style={{ fontWeight: 800 }}>{formatMoney(tip)}</Text></div><div className="grid grid-cols-4 gap-2">{[15, 18, 20, 25].map((percent) => <button key={percent} type="button" onClick={() => setTipPercent(percent)} className={`h-9 rounded-full text-[0.8125rem] transition ${tipPercent === percent ? "bg-primary text-primary-foreground" : "bg-secondary text-foreground"}`} style={{ fontWeight: 800 }}>{percent}%</button>)}</div></div>}
          <div className="mt-4 flex items-center justify-between rounded-[1rem] bg-primary/8 px-3 py-2.5"><Text className="text-[1rem]" style={{ fontWeight: 900 }}>Total</Text><Text className="text-[1.15rem] text-primary" style={{ fontWeight: 900 }}>{formatMoney(total)}</Text></div>
        </div>
      ) : (
        <div className="mt-3 flex items-center justify-between rounded-[1rem] bg-primary/8 px-3 py-2.5"><div><Text className="text-primary" style={{ fontWeight: 900 }}>Running total</Text><Text className="text-[0.75rem] text-muted-foreground">Tax calculated at checkout</Text></div><Text className="text-primary text-[1rem]" style={{ fontWeight: 900 }}>{formatMoney(subtotal)}</Text></div>
      )}
    </div>
  );
}

export function SubRatingRow({ label, value, onChange }: { label: string; value: number | null; onChange: (value: number | null) => void }) {
  return (
    <div className="flex items-center justify-between rounded-[1rem] bg-secondary/65 px-3 py-2.5">
      <Text className="text-[0.875rem]" style={{ fontWeight: 800 }}>{label}</Text>
      <div className="flex items-center gap-0.5">
        {Array.from({ length: 5 }).map((_, index) => <button key={index} type="button" onClick={() => onChange(index + 1)} className="cursor-pointer p-0.5" aria-label={`${label} ${index + 1} stars`}><Star className={`h-5 w-5 transition ${value !== null && index < value ? "fill-warning text-warning" : "text-border hover:text-warning/50"}`} /></button>)}
        <button type="button" onClick={() => onChange(value === null ? 5 : null)} className="ml-1 rounded-full px-2 py-1 text-[0.6875rem] text-muted-foreground transition hover:bg-card" style={{ fontWeight: 800 }}>{value === null ? "Rate" : "Clear"}</button>
      </div>
    </div>
  );
}

/* Booking Confirm, Awaiting, and Success steps */
import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { CalendarDays, Check, Clock, Copy, Info, Sparkles, Star, Users, Wallet } from "lucide-react";
import { ImageWithFallback } from "../../components/figma/ImageWithFallback";
import { ConfettiEffect, DetailRow } from "./BookingWidgets";
import { DEPOSIT_PER_GUEST, OCCASIONS, SERVICE_FEE, fmtR } from "./bookingData";
import type { RestaurantData } from "../detail/restaurantDetailData";

interface ConfirmProps {
  restaurant: RestaurantData;
  dateStr: string;
  selectedTime: string | null;
  guests: number;
  occasion: string | null;
  name: string;
  phone: string;
  notes: string;
  allPrefTags: { emoji: string; label: string }[];
  depositAmount: number;
  useRewards: boolean;
  rewardDiscount: number;
  totalAmount: number;
}

function SectionCard({ children }: { children: React.ReactNode }) {
  return <div className="rounded-[1.5rem] border border-border bg-card p-4 shadow-[0_6px_20px_rgba(0,0,0,0.045)]">{children}</div>;
}

export function ConfirmStep(p: ConfirmProps) {
  return (
    <div className="space-y-4 px-5 py-5">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="overflow-hidden rounded-[1.75rem] border border-border bg-card shadow-[0_8px_24px_rgba(0,0,0,0.06)]">
        <div className="relative h-40">
          <ImageWithFallback src={p.restaurant.image} alt={p.restaurant.name} className="h-full w-full object-cover object-center" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/78 via-black/20 to-transparent" />
          <div className="absolute bottom-4 left-4 right-4 text-white">
            <p className="truncate text-[1.25rem] font-semibold">{p.restaurant.name}</p>
            <p className="mt-0.5 truncate text-[0.8125rem] text-white/78">{p.restaurant.cuisine} - {p.restaurant.distance}</p>
            <div className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-white/18 px-2.5 py-1 backdrop-blur">
              <Star className="h-3.5 w-3.5 fill-warning text-warning" />
              <span className="text-[0.75rem] font-medium">{fmtR(p.restaurant.rating)}</span>
            </div>
          </div>
        </div>
      </motion.div>

      <SectionCard>
        <h4 className="mb-3 text-[1rem] font-semibold">Reservation</h4>
        <div className="grid gap-2">
          <DetailRow icon={<CalendarDays className="h-4 w-4" />} label="Date" value={p.dateStr} />
          <DetailRow icon={<Clock className="h-4 w-4" />} label="Time" value={p.selectedTime || ""} />
          <DetailRow icon={<Users className="h-4 w-4" />} label="Guests" value={`${p.guests} ${p.guests === 1 ? "person" : "people"}`} />
          <DetailRow icon={<Sparkles className="h-4 w-4" />} label="Occasion" value={OCCASIONS.find((occasion) => occasion.id === p.occasion)?.label || "None"} />
        </div>
      </SectionCard>

      <SectionCard>
        <h4 className="mb-3 text-[1rem] font-semibold">Contact</h4>
        <div className="grid gap-2">
          <DetailRow label="Name" value={p.name} />
          <DetailRow label="Phone" value={p.phone} />
          {p.notes && <DetailRow label="Notes" value={p.notes} />}
        </div>
      </SectionCard>

      {p.allPrefTags.length > 0 && (
        <SectionCard>
          <div className="mb-3 flex items-center justify-between">
            <h4 className="text-[1rem] font-semibold">Preferences</h4>
            <span className="rounded-full bg-primary/10 px-2.5 py-1 text-[0.6875rem] font-medium text-primary">{p.allPrefTags.length} selected</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {p.allPrefTags.map((tag) => (
              <span key={tag.label} className="rounded-full border border-border bg-secondary/55 px-3 py-1.5 text-[0.8125rem] font-medium">
                {tag.emoji ? `${tag.emoji} ` : ""}{tag.label}
              </span>
            ))}
          </div>
        </SectionCard>
      )}

      <SectionCard>
        <h4 className="mb-3 flex items-center gap-2 text-[1rem] font-semibold">
          <Wallet className="h-4 w-4" />
          Payment
        </h4>
        <div className="space-y-2 text-[0.875rem]">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Deposit ({p.guests} x ${DEPOSIT_PER_GUEST})</span>
            <span className="font-medium">${p.depositAmount.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Service fee</span>
            <span className="text-muted-foreground">${SERVICE_FEE.toFixed(2)}</span>
          </div>
          {p.useRewards && (
            <div className="flex justify-between text-success">
              <span className="flex items-center gap-1"><Sparkles className="h-3.5 w-3.5" /> Reward points</span>
              <span>-${p.rewardDiscount.toFixed(2)}</span>
            </div>
          )}
          <div className="mt-3 flex items-center justify-between rounded-[1rem] bg-primary/8 px-3 py-2.5">
            <span className="font-medium">Total</span>
            <span className="text-[1.125rem] font-semibold text-primary">${p.totalAmount.toFixed(2)}</span>
          </div>
        </div>
      </SectionCard>

      <div className="flex gap-3 rounded-[1.25rem] border border-info/25 bg-info/8 p-4">
        <Info className="mt-0.5 h-5 w-5 shrink-0 text-info" />
        <div>
          <p className="text-[0.8125rem] font-medium">Refund policy</p>
          <p className="mt-0.5 text-[0.75rem] leading-snug text-muted-foreground">If the restaurant declines, you receive a full refund instantly. Once approved, the deposit is non-refundable.</p>
        </div>
      </div>
    </div>
  );
}

export function AwaitingStep({
  restaurant,
  dateStr,
  selectedTime,
  guests,
  totalAmount,
}: {
  restaurant: RestaurantData;
  dateStr: string;
  selectedTime: string | null;
  guests: number;
  totalAmount: number;
}) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-6 text-center">
      <div className="relative mb-6 h-24 w-24">
        <div className="absolute inset-0 rounded-full border-2 border-primary/10 animate-ping" style={{ animationDuration: "2s" }} />
        <div className="absolute inset-2 rounded-full border-2 border-primary/20 animate-ping" style={{ animationDuration: "2.5s" }} />
        <div className="absolute inset-0 rounded-full border-4 border-primary/20 border-t-primary animate-spin" style={{ animationDuration: "1.5s" }} />
      </div>
      <h2 className="mb-2 text-[1.5rem] font-semibold">Awaiting approval</h2>
      <p className="mb-6 max-w-xs text-[0.875rem] leading-snug text-muted-foreground">{restaurant.name} is reviewing your reservation request.</p>
      <div className="mb-8 flex gap-2">
        {[0, 1, 2, 3].map((index) => <div key={index} className="h-2 w-2 rounded-full bg-primary animate-pulse" style={{ animationDelay: `${index * 0.3}s` }} />)}
      </div>
      <div className="flex w-full max-w-sm items-center gap-3 rounded-[1.5rem] border border-border bg-card p-3 text-left shadow-[0_8px_24px_rgba(0,0,0,0.06)]">
        <ImageWithFallback src={restaurant.image} alt={restaurant.name} className="h-14 w-14 shrink-0 rounded-[1rem] object-cover object-center" />
        <div className="min-w-0 flex-1">
          <p className="truncate text-[0.875rem] font-medium">{restaurant.name}</p>
          <p className="text-[0.75rem] text-muted-foreground">{dateStr} - {selectedTime} - {guests} guests</p>
        </div>
        <div className="shrink-0 text-right">
          <p className="text-[0.875rem] font-medium">${totalAmount.toFixed(2)}</p>
          <p className="text-[0.6875rem] font-medium text-success">Paid</p>
        </div>
      </div>
    </div>
  );
}

export function SuccessStep({
  restaurant,
  bookingId,
  dateStr,
  selectedTime,
  guests,
  occasion,
  totalAmount,
  allPrefTags,
}: {
  restaurant: RestaurantData;
  bookingId: string;
  dateStr: string;
  selectedTime: string | null;
  guests: number;
  occasion: string | null;
  totalAmount: number;
  allPrefTags: { emoji: string; label: string }[];
}) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return undefined;
    const timer = window.setTimeout(() => setCopied(false), 1500);
    return () => window.clearTimeout(timer);
  }, [copied]);

  const handleCopy = () => {
    navigator.clipboard?.writeText(bookingId).catch(() => {});
    setCopied(true);
  };

  return (
    <div className="px-5 py-6">
      <ConfettiEffect />
      <div className="mb-6 flex flex-col items-center text-center">
        <motion.div initial={{ scale: 0.75, opacity: 0 }} animate={{ scale: [1.1, 0.96, 1], opacity: 1 }} className="mb-4 flex h-20 w-20 items-center justify-center rounded-[1.75rem] bg-success/10 text-success">
          <Check className="h-10 w-10" />
        </motion.div>
        <h2 className="mb-1 text-[1.5rem] font-semibold">Reservation request sent</h2>
        <p className="text-[0.875rem] text-muted-foreground">{restaurant.name} will review and approve or reject your request.</p>
        <div className="mt-3 inline-flex items-center gap-2 rounded-full bg-success/10 px-3 py-1.5 text-success">
          <Check className="h-4 w-4" />
          <span className="text-[0.8125rem] font-medium">${totalAmount.toFixed(2)} deposit paid</span>
          <span className="rounded-full bg-warning/10 px-2 py-0.5 text-[0.6875rem] font-medium text-warning">Pending</span>
        </div>
      </div>

      <div className="overflow-hidden rounded-[1.75rem] border border-border bg-card shadow-[0_14px_36px_rgba(0,0,0,0.09)]">
        <div className="relative h-36">
          <ImageWithFallback src={restaurant.image} alt={restaurant.name} className="h-full w-full object-cover object-center" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/78 via-black/20 to-transparent" />
          <div className="absolute bottom-4 left-4 right-4 text-white">
            <p className="truncate text-[1.125rem] font-semibold">{restaurant.name}</p>
            <p className="mt-0.5 text-[0.8125rem] text-white/78">{dateStr} - {selectedTime}</p>
          </div>
        </div>
        <div className="space-y-4 p-5">
          <div className="text-center">
            <p className="text-[0.6875rem] font-medium uppercase tracking-[0.08em] text-muted-foreground">Confirmation</p>
            <div className="mt-1 flex items-center justify-center gap-2">
              <p className="text-[1.25rem] font-semibold tracking-[0.04em]">{bookingId}</p>
              <button type="button" onClick={handleCopy} className="relative flex h-9 w-9 cursor-pointer items-center justify-center rounded-full bg-secondary transition active:scale-95" aria-label="Copy confirmation code">
                {copied ? <Check className="h-4 w-4 text-primary" /> : <Copy className="h-4 w-4 text-muted-foreground" />}
                {copied && <span className="absolute -top-8 rounded-full bg-foreground px-2 py-1 text-[0.6875rem] text-background">Copied</span>}
              </button>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <SummaryTile label="Date" value={dateStr} />
            <SummaryTile label="Time" value={selectedTime || ""} />
            <SummaryTile label="Guests" value={String(guests)} />
            <SummaryTile label="Status" value="Pending" />
          </div>
          {occasion && (
            <div className="flex justify-center">
              <span className="rounded-full border border-border bg-secondary/55 px-3 py-1.5 text-[0.8125rem] font-medium">
                {OCCASIONS.find((item) => item.id === occasion)?.label}
              </span>
            </div>
          )}
          {allPrefTags.length > 0 && (
            <div className="flex flex-wrap justify-center gap-1.5">
              {allPrefTags.map((tag) => (
                <span key={tag.label} className="rounded-full bg-primary/8 px-2.5 py-1 text-[0.75rem] font-medium text-primary">
                  {tag.emoji ? `${tag.emoji} ` : ""}{tag.label}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function SummaryTile({ label, value, accent = false }: { label: string; value: string; accent?: boolean }) {
  return (
    <div className="rounded-[1rem] bg-secondary/65 px-3 py-2 text-center">
      <p className="text-[0.6875rem] font-medium text-muted-foreground">{label}</p>
      <p className={`mt-0.5 truncate text-[0.875rem] font-medium ${accent ? "text-success" : ""}`}>{value}</p>
    </div>
  );
}

/* Booking Confirm, Awaiting, and Success steps */
import { useState } from "react";
import { CalendarDays, Clock, Users, Check, Wallet, Sparkles, Star, Info, Copy } from "lucide-react";
import { DSBadge } from "../../components/ds/Badge";
import { ImageWithFallback } from "../../components/figma/ImageWithFallback";
import { DetailRow, ConfettiEffect } from "./BookingWidgets";
import { OCCASIONS, DEPOSIT_PER_GUEST, SERVICE_FEE, POINTS_EARN, fmtR } from "./bookingData";
import type { RestaurantData } from "../detail/restaurantDetailData";

interface ConfirmProps {
  restaurant: RestaurantData; dateStr: string; selectedTime: string | null; guests: number;
  occasion: string | null; name: string; phone: string; notes: string;
  allPrefTags: { emoji: string; label: string }[];
  depositAmount: number; useRewards: boolean; rewardDiscount: number; totalAmount: number;
}

export function ConfirmStep(p: ConfirmProps) {
  return (
    <div className="px-4 py-4 space-y-4">
      <div className="flex items-center gap-3 p-3 rounded-xl border border-border bg-card/50">
        <ImageWithFallback src={p.restaurant.image} alt={p.restaurant.name} className="w-14 h-14 rounded-xl object-cover shrink-0" />
        <div className="flex-1 min-w-0">
          <p className="text-[0.875rem] truncate" style={{ fontWeight: 600 }}>{p.restaurant.name}</p>
          <p className="text-[0.75rem] text-muted-foreground">{p.restaurant.cuisine} · {p.restaurant.distance}</p>
          <div className="flex items-center gap-1 mt-0.5"><Star className="w-3 h-3 fill-warning text-warning" /><span className="text-[0.75rem]" style={{ fontWeight: 500 }}>{fmtR(p.restaurant.rating)}</span></div>
        </div>
      </div>
      <div className="p-4 rounded-xl border border-border bg-card/50 space-y-3">
        <h4 className="text-[0.9375rem]" style={{ fontWeight: 600 }}>Booking Details</h4>
        <DetailRow icon={<CalendarDays className="w-4 h-4 text-muted-foreground" />} label="Date" value={p.dateStr} />
        <DetailRow icon={<Clock className="w-4 h-4 text-muted-foreground" />} label="Time" value={p.selectedTime || ""} />
        <DetailRow icon={<Users className="w-4 h-4 text-muted-foreground" />} label="Guests" value={`${p.guests} ${p.guests === 1 ? "person" : "people"}`} />
        <DetailRow icon={<Sparkles className="w-4 h-4 text-muted-foreground" />} label="Occasion" value={OCCASIONS.find(o => o.id === p.occasion)?.label || "\u2014"} />
      </div>
      <div className="p-4 rounded-xl border border-border bg-card/50 space-y-3">
        <h4 className="text-[0.9375rem]" style={{ fontWeight: 600 }}>Contact</h4>
        <DetailRow label="Name" value={p.name} /><DetailRow label="Phone" value={p.phone} />
        {p.notes && <DetailRow label="Notes" value={p.notes} />}
      </div>
      {p.allPrefTags.length > 0 && (
        <div className="p-4 rounded-xl border border-border bg-card/50 space-y-3">
          <div className="flex items-center justify-between"><h4 className="text-[0.9375rem]" style={{ fontWeight: 600 }}>Preferences</h4><DSBadge variant="soft" color="primary" size="sm">{p.allPrefTags.length} selected</DSBadge></div>
          <div className="flex gap-1.5 flex-wrap">{p.allPrefTags.map(t => <DSBadge key={t.label} variant="outline" color="secondary" size="md">{t.emoji} {t.label}</DSBadge>)}</div>
        </div>
      )}
      <div className="p-4 rounded-xl border border-border bg-card/50 space-y-2">
        <h4 className="text-[0.9375rem] mb-1 flex items-center gap-2" style={{ fontWeight: 600 }}><Wallet className="w-4 h-4" /> Payment Summary</h4>
        <div className="flex justify-between text-[0.8125rem]"><span>Reservation Deposit ({p.guests} x ${DEPOSIT_PER_GUEST})</span><span style={{ fontWeight: 500 }}>${p.depositAmount.toFixed(2)}</span></div>
        <div className="flex justify-between text-[0.8125rem]"><span className="text-muted-foreground">Service Fee</span><span className="text-muted-foreground">${SERVICE_FEE.toFixed(2)}</span></div>
        {p.useRewards && <div className="flex justify-between text-[0.8125rem]"><span className="text-success flex items-center gap-1"><Sparkles className="w-3 h-3" /> Reward Points</span><span className="text-success">-${p.rewardDiscount.toFixed(2)}</span></div>}
        <div className="border-t border-border pt-2 mt-1" />
        <div className="flex justify-between text-[0.9375rem]" style={{ fontWeight: 700 }}><span>Total</span><span>${p.totalAmount.toFixed(2)}</span></div>
      </div>
      <div className="p-4 rounded-xl border border-info/30 bg-info/5 flex gap-3">
        <Info className="w-5 h-5 text-info shrink-0 mt-0.5" />
        <div><p className="text-[0.8125rem]" style={{ fontWeight: 600 }}>Refund Policy</p><p className="text-[0.75rem] text-muted-foreground mt-0.5">If the restaurant declines, you'll receive a <span className="text-success" style={{ fontWeight: 600 }}>100% full refund</span> instantly. Once approved, the deposit is non-refundable.</p></div>
      </div>
    </div>
  );
}

export function AwaitingStep({ restaurant, dateStr, selectedTime, guests, totalAmount }: {
  restaurant: RestaurantData; dateStr: string; selectedTime: string | null; guests: number; totalAmount: number;
}) {
  return (
    <div className="flex flex-col items-center justify-center px-6 pt-20 text-center">
      <div className="relative w-24 h-24 mb-6">
        <div className="absolute inset-0 rounded-full border-2 border-primary/10 animate-ping" style={{ animationDuration: "2s" }} />
        <div className="absolute inset-2 rounded-full border-2 border-primary/20 animate-ping" style={{ animationDuration: "2.5s" }} />
        <div className="absolute inset-0 rounded-full border-4 border-primary/20 border-t-primary animate-spin" style={{ animationDuration: "1.5s" }} />
      </div>
      <h2 className="text-[1.25rem] mb-2" style={{ fontWeight: 700 }}>Awaiting Approval</h2>
      <p className="text-[0.875rem] text-muted-foreground mb-2">{restaurant.name} is reviewing your reservation request</p>
      <p className="text-[0.75rem] text-muted-foreground/60 italic mb-8">The restaurant is reviewing your preferences...</p>
      <div className="flex gap-2 mb-8">{[0, 1, 2, 3].map(i => <div key={i} className="w-2 h-2 rounded-full bg-primary animate-pulse" style={{ animationDelay: `${i * 0.3}s` }} />)}</div>
      <div className="w-full max-w-sm flex items-center gap-3 p-3 rounded-xl border border-border bg-card/50">
        <ImageWithFallback src={restaurant.image} alt={restaurant.name} className="w-12 h-12 rounded-xl object-cover shrink-0" />
        <div className="flex-1 min-w-0 text-left">
          <p className="text-[0.8125rem] truncate" style={{ fontWeight: 600 }}>{restaurant.name}</p>
          <p className="text-[0.6875rem] text-muted-foreground">{dateStr} · {selectedTime} · {guests} guests</p>
        </div>
        <div className="text-right shrink-0"><p className="text-[0.875rem]" style={{ fontWeight: 600 }}>${totalAmount.toFixed(2)}</p><DSBadge variant="soft" color="success" size="sm">Paid</DSBadge></div>
      </div>
    </div>
  );
}

export function SuccessStep({ restaurant, bookingId, dateStr, selectedTime, guests, occasion, totalAmount, allPrefTags }: {
  restaurant: RestaurantData; bookingId: string; dateStr: string; selectedTime: string | null;
  guests: number; occasion: string | null; totalAmount: number; allPrefTags: { emoji: string; label: string }[];
}) {
  const [copied, setCopied] = useState(false);
  const handleCopy = () => { navigator.clipboard?.writeText(bookingId).catch(() => {}); setCopied(true); setTimeout(() => setCopied(false), 2000); };

  return (
    <div className="px-4 py-6">
      <ConfettiEffect />
      <div className="flex flex-col items-center text-center mb-6">
        <div className="relative w-20 h-20 mb-4">
          <div className="absolute inset-0 rounded-full bg-success/10 animate-ping" style={{ animationDuration: "2s", animationIterationCount: "3" }} />
          <div className="relative w-20 h-20 rounded-full bg-success/15 flex items-center justify-center"><Check className="w-10 h-10 text-success" /></div>
        </div>
        <h2 className="text-[1.375rem] mb-1" style={{ fontWeight: 700 }}>Reservation Approved!</h2>
        <p className="text-[0.8125rem] text-muted-foreground">{restaurant.name} has confirmed your reservation</p>
        <div className="flex items-center gap-2 mt-3 px-4 py-2 rounded-full bg-success/10 border border-success/20">
          <Check className="w-4 h-4 text-success" /><span className="text-[0.8125rem] text-success" style={{ fontWeight: 500 }}>Payment of ${totalAmount.toFixed(2)} confirmed</span>
          <DSBadge variant="soft" color="warning" size="sm">+{POINTS_EARN} pts</DSBadge>
        </div>
      </div>
      <div className="rounded-2xl border border-border bg-card overflow-hidden shadow-lg">
        <div className="relative h-3 bg-card overflow-hidden"><div className="absolute inset-x-0 -bottom-1.5 flex justify-around">{Array.from({ length: 20 }).map((_, i) => <div key={i} className="w-3 h-3 rounded-full bg-background" />)}</div></div>
        <div className="px-5 py-5 space-y-4">
          <div className="text-center">
            <p className="text-[0.6875rem] text-muted-foreground uppercase tracking-widest" style={{ fontWeight: 500 }}>Confirmation Code</p>
            <div className="flex items-center justify-center gap-2 mt-1">
              <p className="text-[1.375rem]" style={{ fontWeight: 800, letterSpacing: "0.05em" }}>{bookingId}</p>
              <button onClick={handleCopy} className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center cursor-pointer hover:bg-secondary/80 transition">
                {copied ? <Check className="w-4 h-4 text-success" /> : <Copy className="w-4 h-4 text-muted-foreground" />}
              </button>
            </div>
          </div>
          <div className="border-t border-dashed border-border" />
          <div className="grid grid-cols-2 gap-y-4 gap-x-6">
            <div className="text-center"><p className="text-[0.6875rem] text-muted-foreground" style={{ fontWeight: 500 }}>Date</p><p className="text-[0.9375rem] mt-0.5" style={{ fontWeight: 600 }}>{dateStr}</p></div>
            <div className="text-center"><p className="text-[0.6875rem] text-muted-foreground" style={{ fontWeight: 500 }}>Time</p><p className="text-[0.9375rem] mt-0.5" style={{ fontWeight: 600 }}>{selectedTime}</p></div>
            <div className="text-center"><p className="text-[0.6875rem] text-muted-foreground" style={{ fontWeight: 500 }}>Guests</p><p className="text-[0.9375rem] mt-0.5" style={{ fontWeight: 600 }}>{guests}</p></div>
            <div className="text-center"><p className="text-[0.6875rem] text-muted-foreground" style={{ fontWeight: 500 }}>Status</p><p className="text-[0.9375rem] text-success mt-0.5" style={{ fontWeight: 600 }}>Confirmed</p></div>
          </div>
          <div className="border-t border-dashed border-border" />
          {occasion && <div className="flex justify-center"><DSBadge variant="outline" color="secondary" size="lg">{OCCASIONS.find(o => o.id === occasion)?.label}</DSBadge></div>}
          {allPrefTags.length > 0 && <div className="flex justify-center gap-1.5 flex-wrap">{allPrefTags.map(t => <DSBadge key={t.label} variant="soft" color="primary" size="sm">{t.emoji} {t.label}</DSBadge>)}</div>}
        </div>
        <div className="relative h-3 bg-card overflow-hidden"><div className="absolute inset-x-0 -top-1.5 flex justify-around">{Array.from({ length: 20 }).map((_, i) => <div key={i} className="w-3 h-3 rounded-full bg-background" />)}</div></div>
      </div>
    </div>
  );
}
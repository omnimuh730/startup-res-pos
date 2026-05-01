import { AnimatePresence, motion } from "motion/react";
import { Button } from "../../../components/ds/Button";
import { Heading, Text } from "../../../components/ds/Text";
import { ImageWithFallback } from "../../../components/figma/ImageWithFallback";
import { MapView } from "../../shared/MapView";
import { Calendar, Check, Clock, Copy, Heart, MapPin, Navigation, Phone, QrCode, Receipt as ReceiptIcon, RotateCcw, Sparkles, Star, Timer, Trash2, UserPlus, Users, UtensilsCrossed } from "lucide-react";
import type { Booking } from "../diningData";
import { fmtR } from "../diningData";
import { ActionRow, InfoTile } from "./BookingDetailParts";

export function BookingDetailMainContent({
  booking,
  saved,
  setSaved,
  copied,
  copyCode,
  statusLabel,
  statusClass,
  StatusIcon,
  isScheduled,
  isCancelled,
  onManage,
  onScanQR,
  onShowQR,
  onInvite,
  onBookAgain,
  onDeleteRequest,
  onViewReceipt,
}: {
  booking: Booking;
  saved: boolean;
  setSaved: (value: boolean | ((v: boolean) => boolean)) => void;
  copied: boolean;
  copyCode: () => void;
  statusLabel: string;
  statusClass: { bg: string; color: string };
  StatusIcon: React.ComponentType<{ className?: string }>;
  isScheduled: boolean;
  isCancelled: boolean;
  onManage: () => void;
  onScanQR: () => void;
  onShowQR: () => void;
  onInvite: () => void;
  onBookAgain: () => void;
  onDeleteRequest?: () => void;
  onViewReceipt?: () => void;
}) {
  const day = booking.date.split(",")[0] ?? booking.date;
  const date = booking.date.split(",").slice(1).join(",").trim() || booking.date;

  return (
    <>
      <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.32, ease: "easeOut" }} className="relative overflow-hidden rounded-[1.75rem]">
        <ImageWithFallback src={booking.image} alt={booking.restaurant} className="h-64 w-full object-cover object-center" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/10" />
        <button type="button" onClick={() => setSaved((value) => !value)} className="absolute right-3 top-3 flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-white/90 text-foreground shadow-lg backdrop-blur transition active:scale-90" aria-label={saved ? "Unsave restaurant" : "Save restaurant"}>
          <motion.span animate={saved ? { scale: [1, 1.2, 1] } : { scale: 1 }} transition={{ duration: 0.28 }}>
            <Heart className={`h-5 w-5 ${saved ? "fill-primary text-primary" : ""}`} />
          </motion.span>
        </button>
        <div className="absolute inset-x-0 bottom-0 p-5">
          <div className={`mb-3 inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 ${statusClass.bg}`}>
            <StatusIcon className={`h-3.5 w-3.5 ${statusClass.color}`} />
            <Text className={`text-[0.75rem] ${statusClass.color}`} style={{ fontWeight: 800 }}>{statusLabel}</Text>
          </div>
          <Heading level={2} className="text-white">{booking.restaurant}</Heading>
          <Text className="mt-1 text-[0.875rem] text-white/82">{booking.cuisine}</Text>
        </div>
      </motion.div>

      <div className="mt-4 grid grid-cols-3 gap-2">
        <InfoTile icon={Users} label="Party" value={`${booking.guests} ${booking.guests > 1 ? "guests" : "guest"}`} />
        <InfoTile icon={Calendar} label={day} value={date} />
        <InfoTile icon={Clock} label={booking.seating} value={booking.time} />
      </div>

      {isScheduled && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.28, delay: 0.05 }} className="mt-4 rounded-[1.5rem] border border-primary/18 bg-primary/6 p-3.5">
          <div className="flex items-center justify-between gap-3">
            <div className="min-w-0">
              <Text className="text-[0.6875rem] tracking-[0.08em] text-primary uppercase" style={{ fontWeight: 800 }}>Confirmation</Text>
              <Text className="mt-0.5 truncate text-[1rem] text-foreground" style={{ fontWeight: 800 }}>{booking.confirmationNo}</Text>
            </div>
            <div className="flex items-center gap-2">
              <span className="hidden items-center gap-1.5 rounded-full bg-card px-3 py-2 text-[0.75rem] text-muted-foreground sm:inline-flex">
                <Timer className="h-3.5 w-3.5" />
                Ready for arrival
              </span>
              <button type="button" onClick={copyCode} className="relative flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-card text-muted-foreground shadow-sm transition hover:text-foreground active:scale-95" aria-label="Copy confirmation code">
                <AnimatePresence mode="wait" initial={false}>
                  {copied ? (
                    <motion.span key="check" initial={{ scale: 0.4, opacity: 0 }} animate={{ scale: [1.15, 1], opacity: 1 }} exit={{ scale: 0.5, opacity: 0 }}>
                      <Check className="h-4 w-4 text-primary" />
                    </motion.span>
                  ) : (
                    <motion.span key="copy" initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.7, opacity: 0 }}>
                      <Copy className="h-4 w-4" />
                    </motion.span>
                  )}
                </AnimatePresence>
                {copied && <span className="absolute -top-8 rounded-full bg-foreground px-2 py-1 text-[0.6875rem] text-background">Copied</span>}
              </button>
            </div>
          </div>
          <div className="mt-3 grid grid-cols-2 gap-2">
            <Button variant="primary" radius="full" className="font-bold" leftIcon={<QrCode className="h-4 w-4" />} onClick={onShowQR}>Show QR</Button>
            <Button variant="outline" radius="full" className="font-bold" onClick={onManage}>Manage</Button>
            <Button variant="outline" radius="full" className="font-bold" leftIcon={<QrCode className="h-4 w-4" />} onClick={onScanQR}>Scan</Button>
            <Button variant="outline" radius="full" className="font-bold" leftIcon={<UserPlus className="h-4 w-4" />} onClick={onInvite}>Invite</Button>
          </div>
        </motion.div>
      )}

      {booking.status === "pending" && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.28, delay: 0.05 }} className="mt-4 rounded-[1.5rem] border border-warning/20 bg-warning/10 p-4">
          <Text className="text-[1rem] text-warning" style={{ fontWeight: 900 }}>Pending approval</Text>
          <Text className="mt-1 text-[0.875rem] leading-snug text-muted-foreground">
            The restaurant is reviewing your reservation request. You will get a notification when it is approved or rejected.
          </Text>
          <div className="mt-3 rounded-[1rem] bg-card px-3 py-2">
            <Text className="text-[0.6875rem] tracking-[0.08em] text-muted-foreground uppercase" style={{ fontWeight: 800 }}>Request code</Text>
            <Text className="mt-0.5 truncate text-[0.9375rem]" style={{ fontWeight: 800 }}>{booking.confirmationNo}</Text>
          </div>
        </motion.div>
      )}

      {booking.status === "rejected" && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.28, delay: 0.05 }} className="mt-4 rounded-[1.5rem] border border-destructive/20 bg-destructive/10 p-4">
          <Text className="text-[1rem] text-destructive" style={{ fontWeight: 900 }}>Request rejected</Text>
          <Text className="mt-1 text-[0.875rem] leading-snug text-muted-foreground">
            This time was not approved. You can request another time or delete the request from your dining list.
          </Text>
          <div className="mt-3 grid grid-cols-2 gap-2">
            <Button variant="primary" radius="full" className="font-bold" leftIcon={<RotateCcw className="h-4 w-4" />} onClick={onBookAgain}>Request again</Button>
            <Button variant="outline" radius="full" className="font-bold text-destructive" leftIcon={<Trash2 className="h-4 w-4" />} onClick={onDeleteRequest}>Delete</Button>
          </div>
        </motion.div>
      )}

      <div className="mt-5 space-y-3">
        <Text className="px-1 text-[1rem] text-foreground" style={{ fontWeight: 800 }}>Restaurant</Text>
        <ActionRow icon={UtensilsCrossed} title="Browse menu" subtitle="Preview dishes before you arrive" tone="primary" />
        <ActionRow icon={Navigation} title="Get directions" subtitle={booking.address} />
        <ActionRow icon={Phone} title="Call restaurant" subtitle={booking.phone} onClick={() => { window.location.href = `tel:${booking.phone}`; }} />
      </div>

      {(booking.occasion || booking.specialRequest) && (
        <div className="mt-5 rounded-[1.5rem] border border-border bg-card p-4 shadow-[0_5px_18px_rgba(0,0,0,0.04)]">
          <Text className="text-[1rem]" style={{ fontWeight: 800 }}>Details</Text>
          {booking.occasion && (
            <div className="mt-3 flex flex-wrap gap-2">
              {["Birthday", "Anniversary", "Date", "Special"].map((occasion) => (
                <span key={occasion} className={`rounded-full border px-3 py-1.5 text-[0.8125rem] ${booking.occasion === occasion ? "border-primary bg-primary/8 text-primary" : "border-border text-muted-foreground"}`} style={{ fontWeight: 700 }}>{occasion}</span>
              ))}
            </div>
          )}
          {booking.specialRequest && <Text className="mt-3 rounded-[1rem] bg-secondary/70 px-3 py-2 text-[0.875rem] leading-snug text-muted-foreground">{booking.specialRequest}</Text>}
        </div>
      )}

      <div className="mt-5">
        <Text className="mb-2 px-1 text-[1rem]" style={{ fontWeight: 800 }}>Location</Text>
        <div className="mb-3 flex items-start gap-2 px-1">
          <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
          <Text className="text-[0.875rem] leading-snug text-muted-foreground">{booking.address}</Text>
        </div>
        <MapView address={booking.address} restaurantName={booking.restaurant} height="h-48" className="rounded-[1.5rem]" />
      </div>

      <div className="mt-5 rounded-[1.5rem] border border-border bg-card p-4 shadow-[0_5px_18px_rgba(0,0,0,0.04)]">
        <div className="flex items-center justify-between gap-3">
          <div>
            <Text className="text-[0.75rem] text-muted-foreground">Dining points</Text>
            <Text className="mt-0.5 text-[0.9375rem]" style={{ fontWeight: 800 }}>{booking.diningPoints > 0 ? `${booking.diningPoints} points ${booking.status === "completed" ? "earned" : "pending"}` : "No points for this booking"}</Text>
          </div>
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-warning/10 text-warning"><Star className="h-4 w-4" /></div>
        </div>
        {booking.status === "completed" && booking.rating && (
          <div className="mt-3 flex items-center gap-1.5 rounded-full bg-secondary/70 px-3 py-2">
            <Star className="h-4 w-4 fill-warning text-warning" />
            <Text className="text-[0.875rem]" style={{ fontWeight: 800 }}>{fmtR(booking.rating)}</Text>
            <Text className="text-[0.8125rem] text-muted-foreground">Your rating</Text>
          </div>
        )}
      </div>

      {isCancelled && <Button variant="primary" fullWidth radius="full" className="mt-5 font-bold" leftIcon={<RotateCcw className="h-4 w-4" />} onClick={onBookAgain}>Book again</Button>}

      {booking.status === "completed" && (
        <div className="mt-5 grid gap-2">
          {booking.receipt && <Button variant="outline" fullWidth radius="full" className="font-bold" leftIcon={<ReceiptIcon className="h-4 w-4" />} onClick={onViewReceipt}>View receipt</Button>}
          <Button variant="primary" fullWidth radius="full" className="font-bold" leftIcon={<RotateCcw className="h-4 w-4" />} onClick={onBookAgain}>Book again</Button>
        </div>
      )}

      {isScheduled && (
        <div className="mt-5 flex items-center gap-2 rounded-[1.25rem] bg-secondary/70 px-3 py-3">
          <Sparkles className="h-4 w-4 shrink-0 text-primary" />
          <Text className="text-[0.8125rem] text-muted-foreground">Keep this code handy. You can share it with friends so they can join the reservation.</Text>
        </div>
      )}
    </>
  );
}

/* Full-page booking detail view */
import { useState } from "react";
import { Text, Heading } from "../../components/ds/Text";
import { Button } from "../../components/ds/Button";
import { Card } from "../../components/ds/Card";
import { Animate } from "../../components/ds/Animate";
import { ImageWithFallback } from "../../components/figma/ImageWithFallback";
import { MapView } from "../shared/MapView";
import {
  Calendar, Clock, Users, Star, RotateCcw, MapPin, Phone,
  ChevronRight, Navigation, UtensilsCrossed, Heart,
  Share2, Copy, Timer, ChevronLeft, QrCode, UserPlus, Receipt as ReceiptIcon,
} from "lucide-react";
import type { Booking } from "./diningData";
import { statusConfig, fmtR } from "./diningData";

interface Props {
  booking: Booking;
  onBack: () => void;
  onManage: () => void;
  onScanQR: () => void;
  onShowQR: () => void;
  onInvite: () => void;
  onBookAgain: () => void;
  onViewReceipt?: () => void;
}

export function BookingDetailPage({ booking, onBack, onManage, onScanQR, onShowQR, onInvite, onBookAgain, onViewReceipt }: Props) {
  const [saved, setSaved] = useState(false);
  const sc = statusConfig[booking.status];
  const StatusIcon = sc.icon;
  const isScheduled = booking.status === "confirmed";
  const isCancelled = booking.status === "cancelled" || booking.status === "no-show";

  return (
    <Animate preset="fadeIn" duration={0.25}>
      <div className="pb-8">
        <button onClick={onBack} className="flex items-center gap-1.5 text-muted-foreground hover:text-foreground transition mb-4 cursor-pointer">
          <ChevronLeft className="w-5 h-5" /><span className="text-[0.9375rem]">Back to Dining</span>
        </button>

        {/* Hero Image */}
        <div className="relative rounded-2xl overflow-hidden mb-5">
          <ImageWithFallback src={booking.image} alt={booking.restaurant} className="w-full h-52 sm:h-64 md:h-72 object-cover" />
          <button onClick={() => setSaved(!saved)} className="absolute top-3 right-3 w-10 h-10 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center">
            <Heart className={`w-5 h-5 ${saved ? "fill-red-500 text-red-500" : "text-foreground"}`} />
          </button>
        </div>

        <Heading level={2} className="mb-1">{booking.restaurant}</Heading>
        <Text className="text-muted-foreground text-[0.9375rem] mb-3">{booking.cuisine}</Text>

        <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full ${sc.bg} mb-5`}>
          <StatusIcon className={`w-4 h-4 ${sc.color}`} />
          <Text className={`${sc.color} text-[0.9375rem]`} style={{ fontWeight: 600 }}>{sc.label}</Text>
        </div>

        {/* Booking Info Cards */}
        <div className="grid grid-cols-3 gap-3 mb-5">
          <Card variant="filled" padding="sm" radius="lg" className="text-center">
            <Users className="w-5 h-5 text-primary mx-auto mb-1" />
            <Text className="text-[1rem]" style={{ fontWeight: 600 }}>{booking.guests}</Text>
            <Text className="text-muted-foreground text-[0.8125rem]">{booking.guests > 1 ? "Guests" : "Guest"}</Text>
          </Card>
          <Card variant="filled" padding="sm" radius="lg" className="text-center">
            <Calendar className="w-5 h-5 text-primary mx-auto mb-1" />
            <Text className="text-[0.875rem]" style={{ fontWeight: 600 }}>{booking.date.split(", ")[0]}</Text>
            <Text className="text-muted-foreground text-[0.8125rem]">{booking.date.split(", ").slice(1).join(", ")}</Text>
          </Card>
          <Card variant="filled" padding="sm" radius="lg" className="text-center">
            <Clock className="w-5 h-5 text-primary mx-auto mb-1" />
            <Text className="text-[1rem]" style={{ fontWeight: 600 }}>{booking.time}</Text>
            <Text className="text-muted-foreground text-[0.8125rem]">{booking.seating}</Text>
          </Card>
        </div>

        {/* Reservation Code + Actions — scheduled only */}
        {isScheduled && (
          <div className="mb-5 space-y-3">
            <div className="flex items-center justify-between p-3.5 rounded-xl border border-border bg-secondary/40">
              <div className="flex items-center gap-3">
                <Text className="text-muted-foreground text-[0.8125rem]">Code:</Text>
                <Text className="text-[1rem]" style={{ fontWeight: 700, letterSpacing: "0.04em" }}>{booking.confirmationNo}</Text>
                <button className="p-1 rounded-md hover:bg-secondary transition"><Copy className="w-4 h-4 text-muted-foreground" /></button>
              </div>
              <div className="flex items-center gap-1.5 text-muted-foreground text-[0.875rem]"><Timer className="w-4 h-4" /><span>23h 02m</span></div>
            </div>
            <div className="grid grid-cols-4 gap-2">
              <Button variant="outline" radius="full" onClick={onManage} className="text-[0.875rem]">Manage</Button>
              <Button variant="outline" radius="full" leftIcon={<QrCode className="w-4 h-4" />} className="text-[0.875rem]" onClick={onScanQR}>Scan QR</Button>
              <Button variant="primary" radius="full" leftIcon={<QrCode className="w-4 h-4" />} className="text-[0.875rem]" onClick={onShowQR}>Show QR</Button>
              <Button variant="outline" radius="full" leftIcon={<UserPlus className="w-4 h-4" />} className="text-[0.875rem]" onClick={onInvite}>Invite</Button>
            </div>
          </div>
        )}

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <button className="flex flex-col items-center gap-2 p-5 rounded-xl bg-secondary hover:bg-secondary/80 transition">
            <div className="w-11 h-11 rounded-full bg-primary/10 flex items-center justify-center"><UtensilsCrossed className="w-5 h-5 text-primary" /></div>
            <div className="text-center"><Text className="text-[0.875rem]" style={{ fontWeight: 500 }}>Browse menu</Text><Text className="text-muted-foreground text-[0.8125rem]">Restaurant's website</Text></div>
          </button>
          <button className="flex flex-col items-center gap-2 p-5 rounded-xl bg-secondary hover:bg-secondary/80 transition">
            <div className="w-11 h-11 rounded-full bg-primary/10 flex items-center justify-center"><Navigation className="w-5 h-5 text-primary" /></div>
            <div className="text-center"><Text className="text-[0.875rem]" style={{ fontWeight: 500 }}>Get directions</Text><Text className="text-muted-foreground text-[0.8125rem]">1.3 km away</Text></div>
          </button>
        </div>

        {/* Occasion */}
        {booking.occasion && (
          <div className="mb-6">
            <Text className="text-[0.9375rem] mb-2" style={{ fontWeight: 600 }}>What's the occasion?</Text>
            <div className="flex gap-2">
              {["Birthday", "Anniversary", "Date", "Special"].map(o => (
                <span key={o} className={`px-4 py-1.5 rounded-full text-[0.875rem] border transition ${booking.occasion === o ? "border-primary bg-primary/5 text-primary" : "border-border text-muted-foreground"}`}>{o}</span>
              ))}
            </div>
          </div>
        )}

        {/* Special Request */}
        {booking.specialRequest && (
          <div className="mb-6">
            <Text className="text-[0.9375rem] mb-1" style={{ fontWeight: 600 }}>Special Request</Text>
            <Text className="text-muted-foreground text-[0.9375rem]">{booking.specialRequest}</Text>
          </div>
        )}

        {/* Address */}
        <div className="mb-4">
          <Text className="text-[0.9375rem] mb-2" style={{ fontWeight: 600 }}>Address</Text>
          <div className="flex items-start gap-2"><MapPin className="w-4 h-4 text-muted-foreground mt-1 shrink-0" /><Text className="text-[0.9375rem] text-muted-foreground">{booking.address}</Text></div>
        </div>

        <MapView address={booking.address} restaurantName={booking.restaurant} height="h-48" className="mb-6" />

        {/* Restaurant Profile */}
        <div className="mb-5">
          <Text className="text-[0.9375rem] mb-2" style={{ fontWeight: 600 }}>Restaurant's full profile</Text>
          <button className="w-full flex items-center justify-between p-4 rounded-xl bg-secondary hover:bg-secondary/80 transition">
            <div className="flex items-center gap-3"><UtensilsCrossed className="w-5 h-5 text-muted-foreground" /><Text className="text-[0.9375rem]">{booking.restaurant}</Text></div>
            <ChevronRight className="w-5 h-5 text-muted-foreground" />
          </button>
        </div>

        {/* Phone */}
        <div className="mb-5">
          <Text className="text-[0.9375rem] mb-2" style={{ fontWeight: 600 }}>Phone number</Text>
          <a href={`tel:${booking.phone}`} className="flex items-center gap-2 text-primary text-[0.9375rem]"><Phone className="w-4 h-4" /> {booking.phone}</a>
        </div>

        {/* Dining Points */}
        <div className="mb-5">
          <Text className="text-[0.9375rem] mb-1" style={{ fontWeight: 600 }}>Dining points</Text>
          <div className="flex items-center gap-2"><Star className="w-4 h-4 text-warning" /><Text className="text-muted-foreground text-[0.9375rem]">{booking.diningPoints > 0 ? `${booking.diningPoints} points ${booking.status === "completed" ? "earned" : "to be earned"} on this booking` : "No points for this booking"}</Text></div>
        </div>

        {/* Rating for completed */}
        {booking.status === "completed" && booking.rating && (
          <div className="flex items-center gap-1 mt-2"><Star className="w-4 h-4 text-warning fill-warning" /><Text className="text-[0.9375rem] text-warning" style={{ fontWeight: 600 }}>{fmtR(booking.rating)}</Text><Text className="text-muted-foreground text-[0.875rem] ml-1">Your rating</Text></div>
        )}

        {/* Reservation code for scheduled */}
        {isScheduled && (
          <div className="flex items-center gap-2 mt-2.5 text-[0.875rem]">
            <Text className="text-muted-foreground">Code:</Text>
            <Text style={{ fontWeight: 600, letterSpacing: "0.03em" }}>{booking.confirmationNo}</Text>
            <button className="p-0.5 rounded hover:bg-secondary transition" onClick={(e: React.MouseEvent) => e.stopPropagation()}><Copy className="w-3.5 h-3.5 text-muted-foreground" /></button>
          </div>
        )}

        {/* Confirmation Number */}
        <div className="pt-4 border-t border-border mb-5">
          <div className="flex items-center justify-between">
            <div><Text className="text-muted-foreground text-[0.8125rem]">Confirmation #</Text><Text className="text-[0.9375rem]" style={{ fontWeight: 500 }}>{booking.confirmationNo}</Text></div>
            <Button variant="ghost" size="icon"><Share2 className="w-5 h-5" /></Button>
          </div>
        </div>

        {/* Bottom Action */}
        {isCancelled && <Button variant="primary" fullWidth radius="full" leftIcon={<RotateCcw className="w-4 h-4" />} onClick={onBookAgain}>Book Again</Button>}
        {booking.status === "completed" && (
          <div className="flex flex-col gap-2">
            {booking.receipt && (
              <Button variant="outline" fullWidth radius="full" leftIcon={<ReceiptIcon className="w-4 h-4" />} onClick={onViewReceipt}>View Order Receipt</Button>
            )}
            <Button variant="primary" fullWidth radius="full" leftIcon={<RotateCcw className="w-4 h-4" />} onClick={onBookAgain}>Book Again</Button>
          </div>
        )}
      </div>
    </Animate>
  );
}

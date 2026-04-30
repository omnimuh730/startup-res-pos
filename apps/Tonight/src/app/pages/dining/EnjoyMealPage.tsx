/* EnjoyMealPage — celebration page for currently-dining or upcoming bookings */
import { useEffect, useState } from "react";
import { motion } from "motion/react";
import {
  ArrowLeft,
  Clock,
  MapPin,
  Users,
  Bell,
  BookOpen,
  QrCode,
  Receipt as ReceiptIcon,
  PartyPopper,
  ChevronRight,
  UtensilsCrossed,
  ScanLine,
  Navigation,
  UserPlus,
  Hourglass,
} from "lucide-react";
import { ImageWithFallback } from "../../components/figma/ImageWithFallback";
import { Text } from "../../components/ds/Text";
import { useToast } from "../../components/ds/Toast";
import type { Booking } from "./diningData";
import { parseBookingDateTime } from "./diningData";
import { MenuModal } from "./EnjoyExtras";

type Mode = "live" | "upcoming";

function useTick(intervalMs = 1000) {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const id = window.setInterval(
      () => setNow(new Date()),
      intervalMs,
    );
    return () => window.clearInterval(id);
  }, [intervalMs]);
  return now;
}

function formatElapsed(start: Date, now: Date) {
  const diff = Math.max(0, now.getTime() - start.getTime());
  const totalMin = Math.floor(diff / 60000);
  const h = Math.floor(totalMin / 60);
  const m = totalMin % 60;
  const s = Math.floor((diff % 60000) / 1000);
  return h > 0
    ? `${h}h ${m}m`
    : `${m}:${String(s).padStart(2, "0")}`;
}

function formatRemaining(target: Date, now: Date) {
  const diff = Math.max(0, target.getTime() - now.getTime());
  const totalMin = Math.floor(diff / 60000);
  const d = Math.floor(totalMin / (60 * 24));
  const h = Math.floor((totalMin % (60 * 24)) / 60);
  const m = totalMin % 60;
  if (d > 0) return `${d}d ${h}h`;
  if (h > 0) return `${h}h ${String(m).padStart(2, "0")}m`;
  const s = Math.floor((diff % 60000) / 1000);
  return `${m}:${String(s).padStart(2, "0")}`;
}

export function EnjoyMealPage({
  booking,
  mode,
  onBack,
  onShowQR,
  onScanQR,
  onScanPay,
  onInvite,
  onOpenRestaurantProfile,
  onOpenDirections,
}: {
  booking: Booking;
  mode: Mode;
  onBack: () => void;
  onShowQR: () => void;
  onScanQR: () => void;
  onScanPay: () => void;
  onInvite: () => void;
  onOpenRestaurantProfile: () => void;
  onOpenDirections: () => void;
}) {
  const start = parseBookingDateTime(booking);
  const now = useTick(1000);
  const [showMenu, setShowMenu] = useState(false);
  const { success } = useToast();

  const isLive = mode === "live";
  const timeLabel = isLive
    ? `Seated ${start ? formatElapsed(start, now) : "0:00"}`
    : `Left ${start ? formatRemaining(start, now) : "—"}`;

  const handleCallServer = () =>
    success("Server notified", "A staff member is on their way to your table.");

  const liveActions = [
    {
      id: "menu",
      icon: BookOpen,
      label: "View menu",
      desc: "Browse what's on offer",
      color: "var(--info)",
      onClick: () => setShowMenu(true),
    },
    {
      id: "server",
      icon: Bell,
      label: "Call server",
      desc: "Get help at your table",
      color: "var(--warning)",
      onClick: handleCallServer,
    },
    {
      id: "pay",
      icon: ReceiptIcon,
      label: "Scan & pay",
      desc: "Settle the bill instantly",
      color: "var(--success)",
      onClick: onScanPay,
    },
  ];

  const upcomingActions = [
    {
      id: "menu",
      icon: BookOpen,
      label: "Preview menu",
      desc: "Plan what to order",
      color: "var(--info)",
      onClick: () => setShowMenu(true),
    },
    {
      id: "showqr",
      icon: QrCode,
      label: "Show QR on arrival",
      desc: "Skip the host stand check-in",
      color: "var(--primary)",
      onClick: onShowQR,
    },
    {
      id: "scanqr",
      icon: ScanLine,
      label: "Scan QR to verify arrival",
      desc: "Quick check-in at the host stand",
      color: "#8B5CF6",
      onClick: onScanQR,
    },
    {
      id: "directions",
      icon: Navigation,
      label: "Get directions",
      desc: booking.address,
      color: "var(--warning)",
      onClick: onOpenDirections,
    },
    {
      id: "invite",
      icon: UserPlus,
      label: "Invite friends",
      desc: "Share the reservation",
      color: "var(--success)",
      onClick: onInvite,
    },
  ];

  const actions = isLive ? liveActions : upcomingActions;
  const heroTitle = isLive
    ? "Enjoy Your Meal!"
    : "Get Ready to Dine!";
  const heroSubtitle = isLive
    ? "You're now dining at"
    : "Your reservation is booked at";
  const liveBadge = isLive
    ? { label: "LIVE NOW", color: "var(--success)" }
    : { label: "UPCOMING", color: "var(--primary)" };
  const HeroIcon = isLive ? PartyPopper : Hourglass;

  return (
    <div className="pb-8 -mt-6">
      {/* Sticky header */}
      <div className="sticky top-0 z-10 bg-background/95 backdrop-blur-md -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 py-3 flex items-center gap-2 border-b border-border">
        <button
          onClick={onBack}
          className="p-2 rounded-full hover:bg-secondary transition"
          aria-label="Back"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <Text
          className="text-[1rem]"
          style={{ fontWeight: 600 }}
        >
          {isLive ? "Now Dining" : "Upcoming Reservation"}
        </Text>
      </div>

      {/* Hero */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="relative mt-5 rounded-3xl overflow-hidden"
        style={{
          background: isLive
            ? "linear-gradient(135deg, color-mix(in oklab, var(--primary) 18%, transparent), color-mix(in oklab, var(--warning) 14%, transparent))"
            : "linear-gradient(135deg, color-mix(in oklab, var(--primary) 18%, transparent), color-mix(in oklab, var(--info) 14%, transparent))",
        }}
      >
        <div className="absolute inset-0">
          <ImageWithFallback
            src={booking.image}
            alt={booking.restaurant}
            className="w-full h-full object-cover"
          />
        </div>
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.72) 60%, rgba(0,0,0,0.85) 100%)",
          }}
        />

        <div className="relative px-5 pt-6 pb-5 text-center">
          <motion.div
            animate={
              isLive
                ? { scale: [1, 1.06, 1] }
                : { opacity: [0.7, 1, 0.7] }
            }
            transition={{
              duration: 1.6,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full mb-3"
            style={{
              background: `color-mix(in oklab, ${liveBadge.color} 28%, rgba(0,0,0,0.35))`,
              color: "#fff",
            }}
          >
            <span
              className="w-1.5 h-1.5 rounded-full"
              style={{ background: liveBadge.color }}
            />
            <span
              className="text-[0.6875rem]"
              style={{
                fontWeight: 700,
                letterSpacing: "0.08em",
              }}
            >
              {liveBadge.label}
            </span>
          </motion.div>

          <h2
            className="text-[1.625rem] mt-1 text-white"
            style={{
              fontWeight: 700,
              textShadow: "0 2px 8px rgba(0,0,0,0.35)",
            }}
          >
            {heroTitle}
          </h2>
          <Text className="text-white/85 text-[0.875rem] mt-1">
            {heroSubtitle}
          </Text>

          {/* Clickable restaurant name → opens restaurant profile */}
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={onOpenRestaurantProfile}
            className="mt-1 inline-flex items-center gap-1.5 px-3 py-1 rounded-xl hover:bg-white/10 transition group"
          >
            <Text
              className="text-[1.0625rem] text-white"
              style={{ fontWeight: 700 }}
            >
              {booking.restaurant}
            </Text>
            <ChevronRight className="w-4 h-4 text-white/80 group-hover:translate-x-0.5 transition-transform" />
          </motion.button>
          <Text className="text-white/65 text-[0.6875rem]">
            Tap to view restaurant profile
          </Text>

          <div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full mt-4 backdrop-blur border"
            style={{
              background: "rgba(255,255,255,0.14)",
              borderColor: "rgba(255,255,255,0.22)",
            }}
          >
            <Clock
              className="w-4 h-4"
              style={{ color: "#fbbf24" }}
            />
            <Text
              className="text-[0.875rem] text-white"
              style={{ fontWeight: 600 }}
            >
              {timeLabel}
            </Text>
          </div>
        </div>
      </motion.div>

      {/* Booking details strip */}
      <div className="grid grid-cols-3 gap-2 mt-4">
        {[
          {
            icon: Users,
            label: `${booking.guests} ${booking.guests > 1 ? "guests" : "guest"}`,
          },
          { icon: Clock, label: booking.time },
          { icon: MapPin, label: booking.seating },
        ].map((item, i) => (
          <div
            key={i}
            className="flex flex-col items-center gap-1 p-3 rounded-xl bg-secondary"
          >
            <item.icon className="w-4 h-4 text-muted-foreground" />
            <Text
              className="text-[0.8125rem]"
              style={{ fontWeight: 600 }}
            >
              {item.label}
            </Text>
          </div>
        ))}
      </div>

      {/* Action cards */}
      <Text
        className="text-[0.6875rem] text-muted-foreground mt-6 mb-2 ml-1"
        style={{ fontWeight: 700, letterSpacing: "0.08em" }}
      >
        {isLive ? "WHILE YOU DINE" : "BEFORE YOU ARRIVE"}
      </Text>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {actions.map((a) => (
          <motion.button
            key={a.id}
            whileTap={{ scale: 0.97 }}
            onClick={a.onClick}
            className="flex items-center gap-3 p-4 rounded-2xl bg-card border border-border hover:border-primary/40 hover:shadow-sm transition text-left"
          >
            <div
              className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0"
              style={{
                background: `color-mix(in oklab, ${a.color} 14%, transparent)`,
              }}
            >
              <a.icon
                className="w-5 h-5"
                style={{ color: a.color }}
              />
            </div>
            <div className="flex-1 min-w-0">
              <Text
                className="text-[0.9375rem]"
                style={{ fontWeight: 600 }}
              >
                {a.label}
              </Text>
              <Text className="text-muted-foreground text-[0.75rem] truncate">
                {a.desc}
              </Text>
            </div>
            <ChevronRight className="w-4 h-4 text-muted-foreground shrink-0" />
          </motion.button>
        ))}
      </div>

      <MenuModal
        open={showMenu}
        onClose={() => setShowMenu(false)}
        booking={booking}
        variant={isLive ? "order" : "preview"}
      />
    </div>
  );
}

/* EnjoyMealPage - live or upcoming reservation surface */
import { useEffect, useState, type ComponentType } from "react";
import { motion } from "motion/react";
import {
  ArrowLeft,
  Bell,
  BookOpen,
  ChevronRight,
  Clock,
  Hourglass,
  MapPin,
  Navigation,
  QrCode,
  Receipt as ReceiptIcon,
  ScanLine,
  ShieldCheck,
  UserPlus,
  Users,
  UtensilsCrossed,
} from "lucide-react";
import { ImageWithFallback } from "../../components/figma/ImageWithFallback";
import { Text } from "../../components/ds/Text";
import { Button } from "../../components/ds/Button";
import { useToast } from "../../components/ds/Toast";
import type { Booking } from "./diningData";
import { parseBookingDateTime } from "./diningData";
import { MenuModal } from "./EnjoyExtras";

type Mode = "live" | "upcoming";

function useTick(intervalMs = 1000) {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const id = window.setInterval(() => setNow(new Date()), intervalMs);
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
  return h > 0 ? `${h}h ${m}m` : `${m}:${String(s).padStart(2, "0")}`;
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

function DetailChip({
  icon: Icon,
  label,
}: {
  icon: ComponentType<{ className?: string; strokeWidth?: number }>;
  label: string;
}) {
  return (
    <div className="flex min-w-0 items-center gap-2 rounded-full bg-secondary px-3 py-2">
      <Icon className="h-4 w-4 shrink-0 text-muted-foreground" />
      <Text className="truncate text-[0.8125rem]" style={{ fontWeight: 800 }}>
        {label}
      </Text>
    </div>
  );
}

function ActionCard({
  icon: Icon,
  label,
  desc,
  onClick,
  primary = false,
}: {
  icon: ComponentType<{ className?: string; strokeWidth?: number }>;
  label: string;
  desc: string;
  onClick: () => void;
  primary?: boolean;
}) {
  return (
    <motion.button
      type="button"
      whileTap={{ scale: 0.975 }}
      onClick={onClick}
      className={`flex w-full cursor-pointer items-center gap-3 rounded-[1.35rem] border p-3.5 text-left shadow-[0_6px_20px_rgba(0,0,0,0.045)] transition ${
        primary ? "border-primary/24 bg-primary/8" : "border-border bg-card hover:border-primary/28"
      }`}
    >
      <span className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full ${primary ? "bg-primary text-primary-foreground" : "bg-secondary text-foreground"}`}>
        <Icon className="h-5 w-5" />
      </span>
      <span className="min-w-0 flex-1">
        <Text className="truncate text-[0.9375rem]" style={{ fontWeight: 800 }}>
          {label}
        </Text>
        <Text className="mt-0.5 line-clamp-1 text-[0.75rem] text-muted-foreground">{desc}</Text>
      </span>
      <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground" />
    </motion.button>
  );
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
  const timeLabel = isLive ? `Seated ${start ? formatElapsed(start, now) : "0:00"}` : `Starts in ${start ? formatRemaining(start, now) : "--"}`;
  const statusLabel = isLive ? "Live now" : "Upcoming";

  const handleCallServer = () => success("Server notified", "A staff member is on their way.");

  const actions = isLive
    ? [
        { id: "pay", icon: ReceiptIcon, label: "Scan and pay", desc: "Settle the bill from your table", primary: true, onClick: onScanPay },
        { id: "menu", icon: BookOpen, label: "View menu", desc: "Browse tonight's dishes", onClick: () => setShowMenu(true) },
        { id: "server", icon: Bell, label: "Call server", desc: "Ask for help at the table", onClick: handleCallServer },
      ]
    : [
        { id: "showqr", icon: QrCode, label: "Show QR", desc: "Fast arrival check-in", primary: true, onClick: onShowQR },
        { id: "invite", icon: UserPlus, label: "Invite friends", desc: "Share this reservation", onClick: onInvite },
        { id: "directions", icon: Navigation, label: "Directions", desc: booking.address, onClick: onOpenDirections },
        { id: "scanqr", icon: ScanLine, label: "Scan arrival QR", desc: "Verify at the host stand", onClick: onScanQR },
        { id: "menu", icon: BookOpen, label: "Preview menu", desc: "Plan what to order", onClick: () => setShowMenu(true) },
      ];

  return (
    <div className="pb-8">
      <div className="sticky top-0 z-20 -mx-4 mb-4 flex items-center gap-3 bg-background/92 px-4 py-3 backdrop-blur-md sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
        <button
          type="button"
          onClick={onBack}
          className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-secondary text-foreground transition active:scale-95"
          aria-label="Back"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <div className="min-w-0">
          <Text className="text-[0.9375rem]" style={{ fontWeight: 900 }}>
            {isLive ? "Now dining" : "Upcoming reservation"}
          </Text>
          <Text className="truncate text-[0.75rem] text-muted-foreground">{booking.restaurant}</Text>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.32, ease: "easeOut" }}
        className="relative overflow-hidden rounded-[1.75rem]"
      >
        <ImageWithFallback src={booking.image} alt={booking.restaurant} className="h-64 w-full object-cover object-center" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/82 via-black/25 to-black/5" />
        <div className="absolute inset-x-0 bottom-0 p-5">
          <div className="mb-3 flex flex-wrap items-center gap-2">
            <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-white ${isLive ? "bg-success" : "bg-primary"}`}>
              {isLive ? <UtensilsCrossed className="h-3.5 w-3.5" /> : <Hourglass className="h-3.5 w-3.5" />}
              <Text className="text-[0.75rem] text-white" style={{ fontWeight: 900 }}>
                {statusLabel}
              </Text>
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/16 px-3 py-1.5 text-white backdrop-blur">
              <Clock className="h-3.5 w-3.5" />
              <Text className="text-[0.75rem] text-white" style={{ fontWeight: 900 }}>
                {timeLabel}
              </Text>
            </span>
          </div>
          <motion.button
            type="button"
            whileTap={{ scale: 0.98 }}
            onClick={onOpenRestaurantProfile}
            className="flex max-w-full cursor-pointer items-center gap-1 text-left"
          >
            <Text className="truncate text-[1.65rem] leading-tight text-white" style={{ fontWeight: 900 }}>
              {booking.restaurant}
            </Text>
            <ChevronRight className="h-5 w-5 shrink-0 text-white/75" />
          </motion.button>
          <Text className="mt-1 truncate text-[0.875rem] text-white/78">{booking.cuisine}</Text>
        </div>
      </motion.div>

      <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-3">
        <DetailChip icon={Users} label={`${booking.guests} ${booking.guests > 1 ? "guests" : "guest"}`} />
        <DetailChip icon={Clock} label={booking.time} />
        <DetailChip icon={MapPin} label={booking.seating} />
      </div>

      <div className="mt-5 rounded-[1.5rem] border border-border bg-card p-4 shadow-[0_6px_20px_rgba(0,0,0,0.045)]">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
            <ShieldCheck className="h-4 w-4" />
          </div>
          <div className="min-w-0">
            <Text className="text-[0.9375rem]" style={{ fontWeight: 900 }}>
              {isLive ? "Table session is active" : "Ready for arrival"}
            </Text>
            <Text className="mt-1 text-[0.8125rem] leading-snug text-muted-foreground">
              {isLive ? "Your QR session, bill, and table actions are available here." : `Confirmation ${booking.confirmationNo} is linked to this reservation.`}
            </Text>
          </div>
        </div>
      </div>

      <Text className="mb-2 mt-5 px-1 text-[1rem]" style={{ fontWeight: 900 }}>
        {isLive ? "At the table" : "Before you arrive"}
      </Text>
      <div className="grid gap-2">
        {actions.map((action, index) => (
          <motion.div
            key={action.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.22, delay: index * 0.035 }}
          >
            <ActionCard
              icon={action.icon}
              label={action.label}
              desc={action.desc}
              onClick={action.onClick}
              primary={"primary" in action && action.primary}
            />
          </motion.div>
        ))}
      </div>

      {!isLive && (
        <div className="mt-5 rounded-[1.5rem] bg-secondary/70 p-4">
          <Text className="text-[0.9375rem]" style={{ fontWeight: 900 }}>
            Arrival checklist
          </Text>
          <div className="mt-3 grid gap-2">
            {["Bring your QR code", "Share booking code with guests", "Arrive a few minutes early"].map((item) => (
              <div key={item} className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-primary" />
                <Text className="text-[0.8125rem] text-muted-foreground">{item}</Text>
              </div>
            ))}
          </div>
        </div>
      )}

      {isLive && (
        <div className="mt-5">
          <Button variant="primary" fullWidth radius="full" className="h-12 font-bold" leftIcon={<ReceiptIcon className="h-4 w-4" />} onClick={onScanPay}>
            Scan and pay
          </Button>
        </div>
      )}

      <MenuModal open={showMenu} onClose={() => setShowMenu(false)} booking={booking} variant={isLive ? "order" : "preview"} />
    </div>
  );
}

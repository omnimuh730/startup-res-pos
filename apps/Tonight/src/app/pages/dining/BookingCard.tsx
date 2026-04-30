/* BookingCard and EmptyState components */
import { useEffect, useState, type ComponentType, type KeyboardEvent, type MouseEvent } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Text, Heading } from "../../components/ds/Text";
import { Button } from "../../components/ds/Button";
import { Animate } from "../../components/ds/Animate";
import { ImageWithFallback } from "../../components/figma/ImageWithFallback";
import {
  Calendar,
  Clock,
  Users,
  Star,
  RotateCcw,
  QrCode,
  UserPlus,
  Copy,
  Receipt as ReceiptIcon,
  MapPin,
  Armchair,
  CheckCircle2,
  UtensilsCrossed,
} from "lucide-react";
import type { Booking } from "./diningData";
import { statusConfig, fmtR, isCurrentlyDining } from "./diningData";

function compactDate(date: string) {
  const parts = date.split(",").map((part) => part.trim());
  return parts.length > 1 ? parts.slice(1).join(", ") : date;
}

function stop(action?: () => void) {
  return (event: MouseEvent) => {
    event.stopPropagation();
    action?.();
  };
}

function DetailPill({
  icon: Icon,
  label,
}: {
  icon: ComponentType<{ className?: string; strokeWidth?: number }>;
  label: string;
}) {
  return (
    <span className="inline-flex h-8 min-w-0 items-center gap-1.5 rounded-full bg-secondary/70 px-2.5 text-[0.75rem] text-muted-foreground">
      <Icon className="h-3.5 w-3.5 shrink-0" />
      <span className="truncate">{label}</span>
    </span>
  );
}

function StatusBadge({
  booking,
  checkedInIds,
  className = "",
}: {
  booking: Booking;
  checkedInIds?: Set<string>;
  className?: string;
}) {
  const sc = statusConfig[booking.status];
  const StatusIcon = sc.icon;
  const live = booking.status === "confirmed" && isCurrentlyDining(booking, new Date(), checkedInIds);

  if (live) {
    return (
      <span className={`inline-flex h-7 items-center justify-center gap-1.5 rounded-full bg-success px-2.5 text-[0.6875rem] text-white shadow-sm ${className}`}>
        <span className="relative flex h-1.5 w-1.5">
          <span className="absolute inset-0 rounded-full bg-white opacity-75 animate-ping" />
          <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-white" />
        </span>
        <span style={{ fontWeight: 800 }}>Now</span>
      </span>
    );
  }

  return (
    <span className={`inline-flex h-7 items-center justify-center gap-1.5 rounded-full px-2.5 text-[0.6875rem] ${sc.bg} ${sc.color} ${className}`}>
      <StatusIcon className="h-3.5 w-3.5" />
      <span style={{ fontWeight: 800 }}>{sc.label}</span>
    </span>
  );
}

function PrimaryAction({
  booking,
  isLiveDining,
  onOpenLive,
  onManage,
  onScanQR,
  onBookAgain,
  onViewReceipt,
}: {
  booking: Booking;
  isLiveDining?: boolean;
  onOpenLive?: () => void;
  onManage?: () => void;
  onScanQR?: () => void;
  onBookAgain?: () => void;
  onViewReceipt?: () => void;
}) {
  if (booking.status === "confirmed" && isLiveDining && onOpenLive) {
    return (
      <Button
        variant="primary"
        size="sm"
        radius="full"
        className="min-h-9 px-3 font-bold"
        leftIcon={<UtensilsCrossed className="h-3.5 w-3.5" />}
        onClick={stop(onOpenLive)}
      >
        Enjoy
      </Button>
    );
  }

  if (booking.status === "confirmed") {
    return (
      <Button
        variant="primary"
        size="sm"
        radius="full"
        className="min-h-9 px-3 font-bold"
        leftIcon={<QrCode className="h-3.5 w-3.5" />}
        onClick={stop(onScanQR)}
      >
        Scan
      </Button>
    );
  }

  if (booking.status === "completed" && booking.receipt) {
    return (
      <Button
        variant="outline"
        size="sm"
        radius="full"
        className="min-h-9 px-3 font-bold"
        leftIcon={<ReceiptIcon className="h-3.5 w-3.5" />}
        onClick={stop(onViewReceipt)}
      >
        Receipt
      </Button>
    );
  }

  return (
    <Button
      variant="primary"
      size="sm"
      radius="full"
      className="min-h-9 px-3 font-bold"
      leftIcon={<RotateCcw className="h-3.5 w-3.5" />}
      onClick={stop(onBookAgain ?? onManage)}
    >
      Book again
    </Button>
  );
}

export function BookingCard({
  booking,
  checkedInIds,
  onTap,
  onManage,
  onScanQR,
  onShowQR,
  onInvite,
  onBookAgain,
  onViewReceipt,
  invitedCount = 0,
}: {
  booking: Booking;
  /** When set, QR check-in from Dining is merged with time-window logic for "live" state. */
  checkedInIds?: Set<string>;
  onTap: () => void;
  onManage?: () => void;
  onScanQR?: () => void;
  onShowQR?: () => void;
  onInvite?: () => void;
  onBookAgain?: () => void;
  onViewReceipt?: () => void;
  invitedCount?: number;
}) {
  const [copied, setCopied] = useState(false);
  const isScheduled = booking.status === "confirmed";
  const isVisited = booking.status === "completed";
  const isCancelled = booking.status === "cancelled" || booking.status === "no-show";
  const isLive = isScheduled && isCurrentlyDining(booking, new Date(), checkedInIds);
  const receiptTotal = booking.receipt ? `$${booking.receipt.total.toFixed(2)}` : null;

  useEffect(() => {
    if (!copied) return undefined;
    const timer = window.setTimeout(() => setCopied(false), 1500);
    return () => window.clearTimeout(timer);
  }, [copied]);

  const handleCardKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.target !== event.currentTarget) return;
    if (event.defaultPrevented) return;
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      onTap();
    }
  };

  const handleCopy = async (event: MouseEvent) => {
    event.stopPropagation();
    try {
      await navigator.clipboard?.writeText(booking.confirmationNo);
    } catch {
      // Clipboard may be unavailable in some webviews; still confirm the local action.
    }
    setCopied(true);
  };

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onTap}
      onKeyDown={handleCardKeyDown}
      className={`group w-full cursor-pointer overflow-hidden rounded-[1.5rem] border bg-card text-left shadow-[0_4px_18px_rgba(0,0,0,0.05)] transition hover:-translate-y-0.5 hover:shadow-[0_10px_28px_rgba(0,0,0,0.09)] focus:outline-none focus-visible:ring-2 focus-visible:ring-primary active:scale-[0.99] ${
        isLive ? "border-success/45 ring-2 ring-success/15" : "border-border"
      } ${isCancelled ? "opacity-90" : ""}`}
    >
      <div className="flex items-center gap-3 p-3.5">
        <div className="flex w-[6.75rem] shrink-0 flex-col gap-2">
          <div className="relative h-[6.75rem] overflow-hidden rounded-[1.125rem] bg-secondary">
            <ImageWithFallback
              src={booking.image}
              alt={booking.restaurant}
              className="h-full w-full object-cover object-center transition duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/55 to-transparent p-2">
              <Text className="truncate text-[0.6875rem] text-white/90" style={{ fontWeight: 800 }}>
                {booking.cuisine.split("·")[0].trim()}
              </Text>
            </div>
          </div>
          <StatusBadge booking={booking} checkedInIds={checkedInIds} className="w-full" />
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <Text className="truncate text-[1.0625rem] leading-tight text-foreground" style={{ fontWeight: 800 }}>
                {booking.restaurant}
              </Text>
              <Text className="mt-0.5 truncate text-[0.8125rem] text-muted-foreground">
                {booking.cuisine}
              </Text>
            </div>
          </div>

          <div className="mt-3 grid grid-cols-2 gap-1.5">
            <DetailPill icon={Calendar} label={compactDate(booking.date)} />
            <DetailPill icon={Clock} label={booking.time} />
            <DetailPill icon={Users} label={`${booking.guests} guest${booking.guests > 1 ? "s" : ""}`} />
            <DetailPill icon={Armchair} label={booking.seating} />
          </div>
        </div>
      </div>

      <div className="border-t border-border/70 px-3.5 py-3">
        {isScheduled && (
          <div className="mb-3 flex items-center justify-between gap-2 rounded-[1rem] bg-primary/6 px-3 py-2">
            <div className="min-w-0">
              <Text className="text-[0.6875rem] uppercase tracking-[0.08em] text-primary" style={{ fontWeight: 800 }}>
                Confirmation
              </Text>
              <Text className="truncate text-[0.875rem] text-foreground" style={{ fontWeight: 800 }}>
                {booking.confirmationNo}
              </Text>
            </div>
            <button
              type="button"
              onClick={handleCopy}
              className={`relative flex h-8 w-8 shrink-0 cursor-pointer items-center justify-center overflow-visible rounded-full bg-card shadow-sm transition ${
                copied ? "text-primary ring-2 ring-primary/20" : "text-muted-foreground hover:text-foreground"
              }`}
              aria-label="Copy confirmation code"
            >
              <AnimatePresence mode="wait" initial={false}>
                {copied ? (
                  <motion.span
                    key="check"
                    initial={{ scale: 0.35, rotate: -30, opacity: 0 }}
                    animate={{ scale: [1.15, 0.95, 1], rotate: 0, opacity: 1 }}
                    exit={{ scale: 0.4, opacity: 0 }}
                    transition={{ duration: 0.34, ease: "easeOut" }}
                  >
                    <CheckCircle2 className="h-4.5 w-4.5" />
                  </motion.span>
                ) : (
                  <motion.span
                    key="copy"
                    initial={{ scale: 0.75, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.6, opacity: 0 }}
                    transition={{ duration: 0.16 }}
                  >
                    <Copy className="h-4 w-4" />
                  </motion.span>
                )}
              </AnimatePresence>
              <AnimatePresence>
                {copied && (
                  <>
                    <motion.span
                      className="absolute inset-0 rounded-full border border-primary"
                      initial={{ scale: 0.8, opacity: 0.5 }}
                      animate={{ scale: 1.9, opacity: 0 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.55, ease: "easeOut" }}
                    />
                    <motion.span
                      className="absolute -top-9 right-0 whitespace-nowrap rounded-full bg-foreground px-2.5 py-1 text-[0.6875rem] text-background shadow-lg"
                      initial={{ opacity: 0, y: 5, scale: 0.92 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 5, scale: 0.92 }}
                      transition={{ duration: 0.18 }}
                      style={{ fontWeight: 800 }}
                    >
                      Copied
                    </motion.span>
                  </>
                )}
              </AnimatePresence>
            </button>
          </div>
        )}

        {isVisited && (
          <div className="mb-3 grid grid-cols-3 gap-2">
            <div className="rounded-[1rem] bg-secondary/65 px-3 py-2">
              <Text className="text-[0.6875rem] text-muted-foreground" style={{ fontWeight: 700 }}>
                Rating
              </Text>
              <div className="mt-0.5 flex items-center gap-1 text-warning">
                <Star className="h-3.5 w-3.5 fill-warning" />
                <Text className="text-[0.875rem] text-warning" style={{ fontWeight: 800 }}>
                  {booking.rating ? fmtR(booking.rating) : "--"}
                </Text>
              </div>
            </div>
            <div className="rounded-[1rem] bg-secondary/65 px-3 py-2">
              <Text className="text-[0.6875rem] text-muted-foreground" style={{ fontWeight: 700 }}>
                Paid
              </Text>
              <Text className="mt-0.5 truncate text-[0.875rem]" style={{ fontWeight: 800 }}>
                {receiptTotal ?? "--"}
              </Text>
            </div>
            <div className="rounded-[1rem] bg-secondary/65 px-3 py-2">
              <Text className="text-[0.6875rem] text-muted-foreground" style={{ fontWeight: 700 }}>
                Points
              </Text>
              <Text className="mt-0.5 truncate text-[0.875rem]" style={{ fontWeight: 800 }}>
                +{booking.diningPoints}
              </Text>
            </div>
          </div>
        )}

        {isCancelled && (
          <div className="mb-3 flex items-start gap-2 rounded-[1rem] bg-secondary/65 px-3 py-2">
            <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
            <Text className="line-clamp-2 text-[0.8125rem] leading-snug text-muted-foreground">
              {booking.address}
            </Text>
          </div>
        )}

        <div className="flex items-center gap-2">
          <PrimaryAction
            booking={booking}
            isLiveDining={isLive}
            onOpenLive={onTap}
            onManage={onManage}
            onScanQR={onScanQR}
            onBookAgain={onBookAgain}
            onViewReceipt={onViewReceipt}
          />

          {isScheduled && (
            <>
              <Button
                variant="outline"
                size="sm"
                radius="full"
                className="min-h-9 px-3 font-bold"
                onClick={stop(onManage)}
              >
                Manage
              </Button>
              <button
                type="button"
                onClick={stop(onInvite)}
                className="relative flex h-9 w-9 shrink-0 cursor-pointer items-center justify-center rounded-full border border-border bg-card text-foreground transition hover:bg-secondary"
                aria-label="Invite friends"
              >
                <UserPlus className="h-4 w-4" />
                {invitedCount > 0 && (
                  <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[0.5625rem] text-primary-foreground">
                    {invitedCount}
                  </span>
                )}
              </button>
              <button
                type="button"
                onClick={stop(onShowQR)}
                className="flex h-9 w-9 shrink-0 cursor-pointer items-center justify-center rounded-full border border-border bg-card text-foreground transition hover:bg-secondary"
                aria-label="Show QR"
              >
                <QrCode className="h-4 w-4" />
              </button>
            </>
          )}

          {isVisited && (
            <Button
              variant="outline"
              size="sm"
              radius="full"
              className="min-h-9 px-3 font-bold"
              leftIcon={<RotateCcw className="h-3.5 w-3.5" />}
              onClick={stop(onBookAgain)}
            >
              Book again
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

export function EmptyState({
  icon: Icon,
  title,
  description,
}: {
  icon: typeof Calendar;
  title: string;
  description: string;
}) {
  return (
    <Animate preset="fadeIn" duration={0.4}>
      <div className="rounded-[1.75rem] border border-border bg-card px-6 py-12 text-center shadow-[0_4px_18px_rgba(0,0,0,0.05)]">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
          <Icon className="h-7 w-7 text-primary" />
        </div>
        <Heading level={4} className="text-foreground">
          {title}
        </Heading>
        <Text className="mx-auto mt-1 max-w-xs text-[0.875rem] leading-relaxed text-muted-foreground">
          {description}
        </Text>
        <Button
          variant="primary"
          size="sm"
          radius="full"
          className="mt-5 font-bold"
          leftIcon={<CheckCircle2 className="h-4 w-4" />}
        >
          Find a restaurant
        </Button>
      </div>
    </Animate>
  );
}

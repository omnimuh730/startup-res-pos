import type { ComponentType, MouseEvent } from "react";
import { Button } from "../../../components/ds/Button";
import { statusConfig, isCurrentlyDining, type Booking } from "../diningData";
import { Clock3, QrCode, Receipt as ReceiptIcon, RotateCcw, UtensilsCrossed } from "lucide-react";

export function compactDate(date: string) {
  const parts = date.split(",").map((part) => part.trim());
  return parts.length > 1 ? parts.slice(1).join(", ") : date;
}

export function stop(action?: () => void) {
  return (event: MouseEvent) => {
    event.stopPropagation();
    action?.();
  };
}

export function DetailPill({
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

export function StatusBadge({
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

export function PrimaryAction({
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
      <Button variant="primary" size="sm" radius="full" className="min-h-9 px-3 font-bold" leftIcon={<UtensilsCrossed className="h-3.5 w-3.5" />} onClick={stop(onOpenLive)}>
        Enjoy
      </Button>
    );
  }

  if (booking.status === "confirmed") {
    return (
      <Button variant="primary" size="sm" radius="full" className="min-h-9 px-3 font-bold" leftIcon={<QrCode className="h-3.5 w-3.5" />} onClick={stop(onScanQR)}>
        Scan
      </Button>
    );
  }

  if (booking.status === "completed" && booking.receipt) {
    return (
      <Button variant="outline" size="sm" radius="full" className="min-h-9 px-3 font-bold" leftIcon={<ReceiptIcon className="h-3.5 w-3.5" />} onClick={stop(onViewReceipt)}>
        Receipt
      </Button>
    );
  }

  if (booking.status === "pending" && onOpenLive) {
    return (
      <Button variant="outline" size="sm" radius="full" className="min-h-9 px-3 font-bold" leftIcon={<Clock3 className="h-3.5 w-3.5" />} onClick={stop(onOpenLive)}>
        Details
      </Button>
    );
  }

  if (booking.status === "rejected") {
    return (
      <Button variant="primary" size="sm" radius="full" className="min-h-9 px-3 font-bold" leftIcon={<RotateCcw className="h-3.5 w-3.5" />} onClick={stop(onBookAgain ?? onManage)}>
        Request again
      </Button>
    );
  }

  return (
    <Button variant="primary" size="sm" radius="full" className="min-h-9 px-3 font-bold" leftIcon={<RotateCcw className="h-3.5 w-3.5" />} onClick={stop(onBookAgain ?? onManage)}>
      Book again
    </Button>
  );
}

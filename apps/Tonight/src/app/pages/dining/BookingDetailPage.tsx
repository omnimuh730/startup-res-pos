/* Full-page booking detail view */
import { useEffect, useState } from "react";
import { Animate } from "../../components/ds/Animate";
import { Text } from "../../components/ds/Text";
import { ChevronLeft, Share2 } from "lucide-react";
import type { Booking } from "./diningData";
import { statusConfig } from "./diningData";
import { BookingDetailMainContent } from "./booking-detail-page/BookingDetailMainContent";

interface Props {
  booking: Booking;
  onBack: () => void;
  onManage: () => void;
  onScanQR: () => void;
  onShowQR: () => void;
  onInvite: () => void;
  onBookAgain: () => void;
  onDeleteRequest?: () => void;
  onViewReceipt?: () => void;
}

export function BookingDetailPage({ booking, onBack, onManage, onScanQR, onShowQR, onInvite, onBookAgain, onDeleteRequest, onViewReceipt }: Props) {
  const [saved, setSaved] = useState(false);
  const [copied, setCopied] = useState(false);
  const sc = statusConfig[booking.status];
  const StatusIcon = sc.icon;
  const isScheduled = booking.status === "confirmed";
  const isCancelled = booking.status === "cancelled" || booking.status === "no-show";

  useEffect(() => {
    if (!copied) return undefined;
    const timer = window.setTimeout(() => setCopied(false), 1400);
    return () => window.clearTimeout(timer);
  }, [copied]);

  const copyCode = async () => {
    try {
      await navigator.clipboard?.writeText(booking.confirmationNo);
    } catch {
      // Clipboard may be blocked in some webviews; the UI still confirms the tap.
    }
    setCopied(true);
  };

  return (
    <Animate preset="fadeIn" duration={0.25}>
      <div className="pb-8">
        <div className="sticky top-0 z-20 -mx-4 mb-4 flex items-center justify-between bg-background/92 px-4 py-3 backdrop-blur-md sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
          <button type="button" onClick={onBack} className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-secondary text-foreground transition hover:bg-secondary/80 active:scale-95" aria-label="Back to Dining">
            <ChevronLeft className="h-5 w-5" />
          </button>
          <Text className="text-[0.9375rem]" style={{ fontWeight: 800 }}>Reservation</Text>
          <button type="button" onClick={onInvite} className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-secondary text-foreground transition hover:bg-secondary/80 active:scale-95" aria-label="Share reservation">
            <Share2 className="h-4 w-4" />
          </button>
        </div>

        <BookingDetailMainContent
          booking={booking}
          saved={saved}
          setSaved={setSaved}
          copied={copied}
          copyCode={copyCode}
          statusLabel={sc.label}
          statusClass={{ bg: sc.bg, color: sc.color }}
          StatusIcon={StatusIcon}
          isScheduled={isScheduled}
          isCancelled={isCancelled}
          onManage={onManage}
          onScanQR={onScanQR}
          onShowQR={onShowQR}
          onInvite={onInvite}
          onBookAgain={onBookAgain}
          onDeleteRequest={onDeleteRequest}
          onViewReceipt={onViewReceipt}
        />
      </div>
    </Animate>
  );
}

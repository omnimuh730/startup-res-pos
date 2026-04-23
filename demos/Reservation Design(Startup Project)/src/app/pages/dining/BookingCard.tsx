/* BookingCard and EmptyState components */
import { Card } from "../../components/ds/Card";
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
  Heart,
  QrCode,
  UserPlus,
  Copy,
  Receipt as ReceiptIcon,
} from "lucide-react";
import type { Booking } from "./diningData";
import {
  statusConfig,
  fmtR,
  isCurrentlyDining,
} from "./diningData";

export function BookingCard({
  booking,
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
  onTap: () => void;
  onManage?: () => void;
  onScanQR?: () => void;
  onShowQR?: () => void;
  onInvite?: () => void;
  onBookAgain?: () => void;
  onViewReceipt?: () => void;
  invitedCount?: number;
}) {
  const sc = statusConfig[booking.status];
  const StatusIcon = sc.icon;
  const isScheduled = booking.status === "confirmed";
  const isLive = isScheduled && isCurrentlyDining(booking);

  return (
    <Card
      variant="default"
      padding="none"
      radius="lg"
      className={`overflow-hidden cursor-pointer group hover:shadow-md transition-shadow ${isLive ? "ring-2 ring-success/40" : ""}`}
      clickable
      onClick={onTap}
    >
      <div className="relative h-44 sm:h-48 overflow-hidden">
        <ImageWithFallback
          src={booking.image}
          alt={booking.restaurant}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        {isLive && (
          <div className="absolute top-3 left-3 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-success text-white shadow-lg">
            <span className="relative flex w-1.5 h-1.5">
              <span className="absolute inset-0 rounded-full bg-white opacity-75 animate-ping" />
              <span className="relative inline-flex rounded-full w-1.5 h-1.5 bg-white" />
            </span>
            <span
              className="text-[0.625rem]"
              style={{
                fontWeight: 700,
                letterSpacing: "0.06em",
              }}
            >
              NOW DINING
            </span>
          </div>
        )}
      </div>

      <div className="p-4">
        <div className="flex items-start justify-between gap-2">
          <Text
            style={{ fontWeight: 600 }}
            className="text-[1.0625rem]"
          >
            {booking.restaurant}
          </Text>
          <div className="flex items-center gap-1.5 shrink-0 mt-0.5">
            {isScheduled && (
              <button
                className="p-1 rounded-full hover:bg-secondary transition cursor-pointer"
                onClick={(e: React.MouseEvent) => {
                  e.stopPropagation();
                  onShowQR?.();
                }}
              >
                <QrCode className="w-5 h-5 text-muted-foreground" />
              </button>
            )}
          </div>
        </div>

        <div className="flex items-center gap-1.5 mt-1.5">
          <StatusIcon className={`w-4 h-4 ${sc.color}`} />
          <Text
            className={`${sc.color} text-[0.9375rem]`}
            style={{ fontWeight: 500 }}
          >
            {sc.label}
          </Text>
        </div>

        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-2 text-[0.9375rem] text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <Users className="w-4 h-4" />
            {booking.guests}
          </span>
          <span className="flex items-center gap-1.5">
            <Calendar className="w-4 h-4" />
            {booking.date}
          </span>
          <span className="flex items-center gap-1.5">
            <Clock className="w-4 h-4" />
            {booking.time}
          </span>
        </div>

        {booking.status === "completed" && booking.rating && (
          <div className="flex items-center gap-1 mt-2">
            <Star className="w-4 h-4 text-warning fill-warning" />
            <Text
              className="text-[0.9375rem] text-warning"
              style={{ fontWeight: 600 }}
            >
              {fmtR(booking.rating)}
            </Text>
            <Text className="text-muted-foreground text-[0.875rem] ml-1">
              Your rating
            </Text>
          </div>
        )}

        {isScheduled && (
          <div className="flex items-center gap-2 mt-2.5 text-[0.875rem]">
            <Text className="text-muted-foreground">Code:</Text>
            <Text
              style={{
                fontWeight: 600,
                letterSpacing: "0.03em",
              }}
            >
              {booking.confirmationNo}
            </Text>
            <button
              className="p-0.5 rounded hover:bg-secondary transition"
              onClick={(e: React.MouseEvent) =>
                e.stopPropagation()
              }
            >
              <Copy className="w-3.5 h-3.5 text-muted-foreground" />
            </button>
          </div>
        )}

        <div className="flex flex-wrap gap-2 mt-3 pt-3 border-t border-border">
          {isScheduled && (
            <>
              <Button
                variant="outline"
                size="sm"
                radius="full"
                onClick={(e: React.MouseEvent) => {
                  e.stopPropagation();
                  onManage?.();
                }}
              >
                Manage
              </Button>
              <Button
                variant="outline"
                size="sm"
                radius="full"
                leftIcon={<QrCode className="w-3.5 h-3.5" />}
                onClick={(e: React.MouseEvent) => {
                  e.stopPropagation();
                  onScanQR?.();
                }}
              >
                Scan QR
              </Button>
              <Button
                variant="outline"
                size="sm"
                radius="full"
                leftIcon={<UserPlus className="w-3.5 h-3.5" />}
                onClick={(e: React.MouseEvent) => {
                  e.stopPropagation();
                  onInvite?.();
                }}
              >
                Invite
                {invitedCount > 0 && (
                  <span
                    className="ml-1 min-w-[1.125rem] h-[1.125rem] rounded-full bg-primary text-primary-foreground text-[0.625rem] flex items-center justify-center px-1"
                    style={{ fontWeight: 600 }}
                  >
                    {invitedCount}
                  </span>
                )}
              </Button>
            </>
          )}
          {booking.status === "completed" && (
            <>
              {booking.receipt && (
                <Button
                  variant="outline"
                  size="sm"
                  radius="full"
                  leftIcon={
                    <ReceiptIcon className="w-3.5 h-3.5" />
                  }
                  onClick={(e: React.MouseEvent) => {
                    e.stopPropagation();
                    onViewReceipt?.();
                  }}
                >
                  Receipt
                </Button>
              )}
              <Button
                variant="outline"
                size="sm"
                radius="full"
                leftIcon={<RotateCcw className="w-3.5 h-3.5" />}
                onClick={(e: React.MouseEvent) => {
                  e.stopPropagation();
                  onBookAgain?.();
                }}
              >
                Book Again
              </Button>
            </>
          )}
          {(booking.status === "cancelled" ||
            booking.status === "no-show") && (
            <Button
              variant="primary"
              size="sm"
              radius="full"
              leftIcon={<RotateCcw className="w-3.5 h-3.5" />}
              onClick={(e: React.MouseEvent) => {
                e.stopPropagation();
                onBookAgain?.();
              }}
            >
              Book Again
            </Button>
          )}
        </div>
      </div>
    </Card>
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
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center mb-4">
          <Icon className="w-7 h-7 text-muted-foreground/50" />
        </div>
        <Heading level={4} className="text-muted-foreground">
          {title}
        </Heading>
        <Text className="text-muted-foreground/70 text-[0.9375rem] mt-1 max-w-xs">
          {description}
        </Text>
        <Button
          variant="primary"
          size="sm"
          radius="full"
          className="mt-5"
        >
          Find a Restaurant
        </Button>
      </div>
    </Animate>
  );
}
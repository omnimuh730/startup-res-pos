import type { ComponentType } from "react";
import { CalendarCheck, CheckCircle, Clock3, XCircle } from "lucide-react";

export type DiningTabId = "pending" | "approved" | "rejected" | "visited" | "cancel";

export type DiningTabOption = {
  id: DiningTabId;
  label: string;
  shortLabel: string;
  icon: ComponentType<{ className?: string; strokeWidth?: number }>;
};

export const DINING_TABS: DiningTabOption[] = [
  { id: "pending", label: "Pending", shortLabel: "Pending", icon: Clock3 },
  { id: "approved", label: "Approved", shortLabel: "Approved", icon: CalendarCheck },
  { id: "rejected", label: "Rejected", shortLabel: "Rejected", icon: XCircle },
  { id: "visited", label: "Visited", shortLabel: "Past", icon: CheckCircle },
  { id: "cancel", label: "Cancelled", shortLabel: "Off", icon: XCircle },
];

export const TAB_COPY: Record<DiningTabId, { title: string; description: string }> = {
  pending: {
    title: "Pending requests",
    description: "Reservation requests waiting for the restaurant to approve.",
  },
  approved: {
    title: "Approved reservations",
    description: "Confirmed reservations with arrival QR, party, seating, and confirmation details.",
  },
  rejected: {
    title: "Rejected requests",
    description: "Requests the restaurant could not approve. You can request again or delete them.",
  },
  visited: {
    title: "Visited places",
    description: "Your completed meals with receipts, ratings, and quick rebooking.",
  },
  cancel: {
    title: "Cancelled bookings",
    description: "Past cancellations and no-shows, kept here for reference.",
  },
};

export function isDiningTab(value: string | null): value is DiningTabId {
  return value === "pending" || value === "approved" || value === "rejected" || value === "visited" || value === "cancel";
}

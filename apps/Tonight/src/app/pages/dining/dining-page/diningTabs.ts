import type { ComponentType } from "react";
import { CalendarPlus, CheckCircle, XCircle } from "lucide-react";

export type DiningTabId = "scheduled" | "visited" | "cancel";

export type DiningTabOption = {
  id: DiningTabId;
  label: string;
  shortLabel: string;
  icon: ComponentType<{ className?: string; strokeWidth?: number }>;
};

export const DINING_TABS: DiningTabOption[] = [
  { id: "scheduled", label: "Scheduled", shortLabel: "Next", icon: CalendarPlus },
  { id: "visited", label: "Visited", shortLabel: "Past", icon: CheckCircle },
  { id: "cancel", label: "Cancelled", shortLabel: "Off", icon: XCircle },
];

export const TAB_COPY: Record<DiningTabId, { title: string; description: string }> = {
  scheduled: {
    title: "Upcoming reservations",
    description: "Everything you need before you arrive: party, seating, QR, and confirmation.",
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
  return value === "scheduled" || value === "visited" || value === "cancel";
}

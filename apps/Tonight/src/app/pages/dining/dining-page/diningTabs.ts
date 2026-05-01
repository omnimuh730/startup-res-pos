import type { ComponentType } from "react";
import { CalendarPlus, CheckCircle, XCircle } from "lucide-react";

export type DiningTabId = "upcoming" | "visited" | "cancel";

export type DiningTabOption = {
  id: DiningTabId;
  label: string;
  shortLabel: string;
  icon: ComponentType<{ className?: string; strokeWidth?: number }>;
};

export const DINING_TABS: DiningTabOption[] = [
  { id: "upcoming", label: "Upcoming", shortLabel: "Upcoming", icon: CalendarPlus },
  { id: "visited", label: "Visited", shortLabel: "Visited", icon: CheckCircle },
  { id: "cancel", label: "Cancelled", shortLabel: "Cancelled", icon: XCircle },
];

export const TAB_COPY: Record<DiningTabId, { title: string; description: string }> = {
  upcoming: {
    title: "Upcoming reservations",
    description: "Pending requests and confirmed reservations before you arrive.",
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
  return value === "upcoming" || value === "visited" || value === "cancel";
}

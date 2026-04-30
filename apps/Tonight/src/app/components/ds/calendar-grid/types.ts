import type { Dispatch, SetStateAction } from "react";

export interface CalendarEvent {
  id: string;
  date: Date;
  endDate?: Date;
  title: string;
  color?: string;
  time?: string;
  guests?: number;
  table?: string;
  status?: "confirmed" | "arrived" | "left-message" | "requested" | "no-show";
}

export type CalendarView = "month" | "week" | "day";

export interface CalendarGridProps {
  events?: CalendarEvent[];
  selectedDate?: Date;
  onSelectDate?: (date: Date) => void;
  onEventClick?: (event: CalendarEvent) => void;
  onNewBooking?: () => void;
  view?: CalendarView;
  className?: string;
}

export interface TableConfig {
  id: string;
  label: string;
  section: string;
  seats: number;
}

export type SetView = Dispatch<SetStateAction<CalendarView>>;

import { useState, useRef } from "react";
import { ChevronLeft, ChevronRight, Plus } from "lucide-react";
import {
  format,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  addMonths,
  subMonths,
  addWeeks,
  subWeeks,
  addDays,
  subDays,
  isSameMonth,
  isSameDay,
  isToday,
} from "date-fns";

// ── Types ──────────────────────────────────────────────────
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

type CalendarView = "month" | "week" | "day";

export interface CalendarGridProps {
  events?: CalendarEvent[];
  selectedDate?: Date;
  onSelectDate?: (date: Date) => void;
  onEventClick?: (event: CalendarEvent) => void;
  onNewBooking?: () => void;
  view?: CalendarView;
  className?: string;
}

// ── Status colors ──────────────────────────────────────────
const statusColors: Record<string, { bg: string; text: string; border: string }> = {
  confirmed: { bg: "bg-success/15", text: "text-success", border: "border-l-success" },
  arrived: { bg: "bg-primary/15", text: "text-primary", border: "border-l-primary" },
  "left-message": { bg: "bg-info/15", text: "text-info", border: "border-l-info" },
  requested: { bg: "bg-warning/15", text: "text-warning", border: "border-l-warning" },
  "no-show": { bg: "bg-destructive/15", text: "text-destructive", border: "border-l-destructive" },
};

// ── Month View ─────────────────────────────────────────────
function MonthView({ date, events, selectedDate, onSelectDate, onEventClick }: {
  date: Date; events: CalendarEvent[]; selectedDate?: Date;
  onSelectDate?: (d: Date) => void; onEventClick?: (e: CalendarEvent) => void;
}) {
  const days = eachDayOfInterval({
    start: startOfWeek(startOfMonth(date), { weekStartsOn: 0 }),
    end: endOfWeek(endOfMonth(date), { weekStartsOn: 0 }),
  });

  const getEventsForDay = (day: Date) => events.filter((e) => isSameDay(e.date, day));

  return (
    <>
      <div className="grid grid-cols-7 border-b border-border">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
          <div key={d} className="py-2.5 text-center text-[0.6875rem] text-muted-foreground">{d}</div>
        ))}
      </div>
      <div className="grid grid-cols-7">
        {days.map((day, idx) => {
          const dayEvents = getEventsForDay(day);
          const today = isToday(day);
          const outOfMonth = !isSameMonth(day, date);
          const isSelected = selectedDate && isSameDay(day, selectedDate);

          return (
            <div
              key={idx}
              onClick={() => onSelectDate?.(day)}
              className={`
                min-h-[80px] sm:min-h-[96px] p-1.5 border-b border-r border-border cursor-pointer transition-colors
                ${outOfMonth ? "bg-muted/20" : "hover:bg-secondary/40"}
                ${isSelected ? "bg-primary/5 ring-1 ring-primary/20 ring-inset" : ""}
              `}
            >
              <div className="flex items-center justify-between mb-1">
                <span
                  className={`
                    w-6 h-6 flex items-center justify-center rounded-full text-[0.6875rem]
                    ${today ? "bg-primary text-primary-foreground" : ""}
                    ${outOfMonth ? "text-muted-foreground/30" : ""}
                  `}
                >
                  {format(day, "d")}
                </span>
                {dayEvents.length > 0 && !outOfMonth && (
                  <span className="text-[0.5rem] text-muted-foreground">{dayEvents.length}</span>
                )}
              </div>
              <div className="space-y-0.5">
                {dayEvents.slice(0, 3).map((ev) => {
                  const sc = statusColors[ev.status || "confirmed"];
                  return (
                    <button
                      key={ev.id}
                      onClick={(e) => { e.stopPropagation(); onEventClick?.(ev); }}
                      className={`w-full text-left px-1.5 py-0.5 rounded text-[0.5625rem] truncate cursor-pointer border-l-2 ${sc.bg} ${sc.text} ${sc.border}`}
                    >
                      {ev.time && <span className="opacity-70">{ev.time} </span>}
                      {ev.title}
                    </button>
                  );
                })}
                {dayEvents.length > 3 && (
                  <span className="text-[0.5rem] text-muted-foreground px-1.5">+{dayEvents.length - 3} more</span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}

// ── Week View ──────────────────────────────────────────────
function WeekView({ date, events, onEventClick }: {
  date: Date; events: CalendarEvent[]; onEventClick?: (e: CalendarEvent) => void;
}) {
  const weekStart = startOfWeek(date, { weekStartsOn: 0 });
  const weekDays = eachDayOfInterval({ start: weekStart, end: addDays(weekStart, 6) });
  const hours = Array.from({ length: 16 }, (_, i) => i + 6); // 6 AM - 9 PM

  const getEventsForDayHour = (day: Date, hour: number) =>
    events.filter((e) => {
      if (!isSameDay(e.date, day)) return false;
      const h = e.date.getHours();
      return h === hour;
    });

  return (
    <div className="overflow-x-auto">
      <div className="min-w-[700px]">
        {/* Day headers */}
        <div className="grid grid-cols-[60px_repeat(7,1fr)] border-b border-border sticky top-0 bg-card z-10">
          <div className="p-2" />
          {weekDays.map((day) => (
            <div
              key={day.toISOString()}
              className={`p-2 text-center border-l border-border ${isToday(day) ? "bg-primary/5" : ""}`}
            >
              <p className="text-[0.625rem] text-muted-foreground uppercase">{format(day, "EEE")}</p>
              <p className={`text-[0.9375rem] ${isToday(day) ? "text-primary" : ""}`}>{format(day, "d")}</p>
            </div>
          ))}
        </div>
        {/* Time grid */}
        <div className="relative">
          {hours.map((hour) => (
            <div key={hour} className="grid grid-cols-[60px_repeat(7,1fr)] border-b border-border min-h-[52px]">
              <div className="px-2 py-1 text-[0.625rem] text-muted-foreground text-right pr-3">
                {hour === 0 ? "12 AM" : hour < 12 ? `${hour} AM` : hour === 12 ? "12 PM" : `${hour - 12} PM`}
              </div>
              {weekDays.map((day) => {
                const dayEvents = getEventsForDayHour(day, hour);
                return (
                  <div key={day.toISOString()} className={`border-l border-border p-0.5 ${isToday(day) ? "bg-primary/[0.02]" : ""}`}>
                    {dayEvents.map((ev) => {
                      const sc = statusColors[ev.status || "confirmed"];
                      return (
                        <button
                          key={ev.id}
                          onClick={() => onEventClick?.(ev)}
                          className={`w-full text-left px-2 py-1 rounded-md text-[0.625rem] truncate cursor-pointer border-l-2 ${sc.bg} ${sc.text} ${sc.border}`}
                        >
                          <span className="block truncate">{ev.title}</span>
                          {ev.guests && <span className="opacity-60">👥{ev.guests}</span>}
                        </button>
                      );
                    })}
                  </div>
                );
              })}
            </div>
          ))}
          {/* Current time indicator */}
          {weekDays.some(isToday) && (() => {
            const now = new Date();
            const h = now.getHours();
            const m = now.getMinutes();
            if (h < 6 || h > 21) return null;
            const top = (h - 6) * 52 + (m / 60) * 52;
            const todayIdx = weekDays.findIndex(isToday);
            return (
              <div
                className="absolute left-[60px] right-0 pointer-events-none z-10"
                style={{ top: `${top}px` }}
              >
                <div className="relative h-0">
                  <div
                    className="absolute h-[2px] bg-destructive/80"
                    style={{
                      left: `${(todayIdx / 7) * 100}%`,
                      width: `${(1 / 7) * 100}%`,
                    }}
                  />
                  <div
                    className="absolute w-2.5 h-2.5 rounded-full bg-destructive -translate-y-1/2"
                    style={{ left: `${(todayIdx / 7) * 100}%` }}
                  />
                </div>
              </div>
            );
          })()}
        </div>
      </div>
    </div>
  );
}

// ── Day / Timeline View (Reservation-style like the image) ─
export interface TableConfig {
  id: string;
  label: string;
  section: string;
  seats: number;
}

function DayTimelineView({ date, events, tables, onEventClick }: {
  date: Date;
  events: CalendarEvent[];
  tables: TableConfig[];
  onEventClick?: (e: CalendarEvent) => void;
}) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const startHour = 11; // 11 AM
  const endHour = 23; // 11 PM
  const totalHours = endHour - startHour;
  const colWidth = 120; // px per hour

  const dayEvents = events.filter((e) => isSameDay(e.date, date));

  // Group by section
  const sections = [...new Set(tables.map((t) => t.section))];

  // Compute event position/width
  const getEventStyle = (ev: CalendarEvent) => {
    const h = ev.date.getHours() + ev.date.getMinutes() / 60;
    const endH = ev.endDate
      ? ev.endDate.getHours() + ev.endDate.getMinutes() / 60
      : h + 1.5;
    const left = (h - startHour) * colWidth;
    const width = (endH - h) * colWidth;
    return { left: `${left}px`, width: `${Math.max(width, 40)}px` };
  };

  // Current time line
  const now = new Date();
  const nowH = now.getHours() + now.getMinutes() / 60;
  const nowLeft = (nowH - startHour) * colWidth;
  const showNowLine = isSameDay(date, now) && nowH >= startHour && nowH <= endHour;

  return (
    <div className="overflow-x-auto border border-border rounded-xl" ref={scrollRef}>
      <div style={{ minWidth: `${totalHours * colWidth + 100}px` }}>
        {/* Time headers */}
        <div className="flex border-b border-border bg-secondary/30 sticky top-0 z-10">
          <div className="w-[100px] shrink-0 px-3 py-2.5 text-[0.6875rem] text-muted-foreground uppercase tracking-wider">
            Tables
          </div>
          {Array.from({ length: totalHours + 1 }, (_, i) => {
            const h = startHour + i;
            return (
              <div
                key={h}
                className="text-[0.6875rem] text-muted-foreground py-2.5 border-l border-border"
                style={{ width: `${colWidth}px` }}
              >
                <span className="pl-2">
                  {h === 0 ? "12 AM" : h < 12 ? `${h}:00 AM` : h === 12 ? "12:00 PM" : `${h - 12}:00 PM`}
                </span>
              </div>
            );
          })}
        </div>

        {/* Rows by section */}
        {sections.map((section) => {
          const sectionTables = tables.filter((t) => t.section === section);
          return sectionTables.map((table) => {
            const tableEvents = dayEvents.filter((e) => e.table === table.id);
            return (
              <div key={table.id} className="flex border-b border-border hover:bg-secondary/20 transition-colors">
                <div className="w-[100px] shrink-0 px-3 py-2 border-r border-border bg-card">
                  <p className="text-[0.6875rem] text-primary">{table.id}</p>
                  <p className="text-[0.75rem]">{table.label}</p>
                  <p className="text-[0.5625rem] text-muted-foreground">{table.seats} seats</p>
                </div>
                <div className="flex-1 relative min-h-[48px]">
                  {/* Hour grid lines */}
                  {Array.from({ length: totalHours + 1 }, (_, i) => (
                    <div
                      key={i}
                      className="absolute top-0 bottom-0 border-l border-border/40"
                      style={{ left: `${i * colWidth}px` }}
                    />
                  ))}
                  {/* Events */}
                  {tableEvents.map((ev) => {
                    const sc = statusColors[ev.status || "confirmed"];
                    const style = getEventStyle(ev);
                    return (
                      <button
                        key={ev.id}
                        onClick={() => onEventClick?.(ev)}
                        className={`absolute top-1 bottom-1 rounded-md px-2 py-1 cursor-pointer overflow-hidden border-l-3 ${sc.bg} ${sc.border} hover:ring-1 hover:ring-primary/30 transition-all`}
                        style={{ left: style.left, width: style.width }}
                      >
                        <p className={`text-[0.625rem] truncate ${sc.text}`}>
                          {ev.title}
                          {ev.guests && <span className="ml-1 opacity-60">👥{ev.guests}</span>}
                        </p>
                      </button>
                    );
                  })}
                  {/* Current time */}
                  {showNowLine && (
                    <div
                      className="absolute top-0 bottom-0 w-[2px] bg-destructive z-10"
                      style={{ left: `${nowLeft}px` }}
                    >
                      <div className="w-2.5 h-2.5 rounded-full bg-destructive -translate-x-1 -translate-y-1" />
                    </div>
                  )}
                </div>
              </div>
            );
          });
        })}
      </div>
    </div>
  );
}

// ── Main Calendar Component ────────────────────────────────
export function CalendarGrid({
  events = [],
  selectedDate: controlledDate,
  onSelectDate,
  onEventClick,
  onNewBooking,
  view: controlledView,
  className = "",
}: CalendarGridProps) {
  const [internalDate, setInternalDate] = useState(controlledDate || new Date());
  const [internalView, setInternalView] = useState<CalendarView>(controlledView || "month");

  const date = controlledDate || internalDate;
  const view = controlledView || internalView;

  const navigate = (dir: -1 | 1) => {
    const fn =
      view === "month" ? (dir === 1 ? addMonths : subMonths) :
      view === "week" ? (dir === 1 ? addWeeks : subWeeks) :
      (dir === 1 ? addDays : subDays);
    const next = fn(date, 1);
    setInternalDate(next);
    onSelectDate?.(next);
  };

  const headerLabel =
    view === "month" ? format(date, "MMMM yyyy") :
    view === "week"
      ? `${format(startOfWeek(date), "MMM d")} – ${format(addDays(startOfWeek(date), 6), "MMM d, yyyy")}`
      : format(date, "EEEE, MMMM d, yyyy");

  // Default tables for day view
  const defaultTables: TableConfig[] = [
    { id: "A1", label: "Window", section: "Window", seats: 2 },
    { id: "A2", label: "Window", section: "Window", seats: 2 },
    { id: "A3", label: "Main", section: "Main", seats: 4 },
    { id: "B1", label: "Main", section: "Main", seats: 4 },
    { id: "C1", label: "Center", section: "Center", seats: 2 },
    { id: "C2", label: "Center", section: "Center", seats: 4 },
    { id: "C3", label: "Center", section: "Center", seats: 4 },
    { id: "Q1", label: "Private", section: "Private", seats: 8 },
    { id: "P1", label: "Patio", section: "Patio", seats: 2 },
    { id: "P2", label: "Patio", section: "Patio", seats: 4 },
    { id: "BR1", label: "Bar", section: "Bar", seats: 3 },
    { id: "BR2", label: "Bar", section: "Bar", seats: 2 },
  ];

  return (
    <div className={`border border-border rounded-xl overflow-hidden bg-card ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-secondary/20">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="p-1.5 hover:bg-secondary rounded-lg cursor-pointer transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => navigate(1)}
            className="p-1.5 hover:bg-secondary rounded-lg cursor-pointer transition-colors"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => { setInternalDate(new Date()); onSelectDate?.(new Date()); }}
            className="px-2.5 py-1 text-[0.6875rem] border border-border rounded-lg hover:bg-secondary cursor-pointer transition-colors ml-1"
          >
            Today
          </button>
          <h3 className="text-[0.9375rem] ml-2">{headerLabel}</h3>
        </div>

        <div className="flex items-center gap-2">
          {/* Status legend (day view) */}
          {view === "day" && (
            <div className="hidden lg:flex items-center gap-2 mr-3">
              {Object.entries(statusColors).map(([status, colors]) => (
                <span
                  key={status}
                  className={`px-2 py-0.5 rounded-full text-[0.5625rem] ${colors.bg} ${colors.text} capitalize`}
                >
                  {status.replace("-", " ")}
                </span>
              ))}
            </div>
          )}

          {/* View toggles */}
          <div className="flex bg-secondary rounded-lg p-0.5">
            {(["month", "week", "day"] as CalendarView[]).map((v) => (
              <button
                key={v}
                type="button"
                onClick={() => setInternalView(v)}
                className={`px-3 py-1 rounded-md text-[0.6875rem] cursor-pointer transition-colors capitalize ${
                  view === v ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {v}
              </button>
            ))}
          </div>

          {onNewBooking && (
            <button
              type="button"
              onClick={onNewBooking}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-primary text-primary-foreground rounded-lg text-[0.6875rem] hover:opacity-90 cursor-pointer transition-opacity"
            >
              <Plus className="w-3.5 h-3.5" /> New Booking
            </button>
          )}
        </div>
      </div>

      {/* Views */}
      {view === "month" && (
        <MonthView
          date={date}
          events={events}
          selectedDate={controlledDate}
          onSelectDate={onSelectDate}
          onEventClick={onEventClick}
        />
      )}
      {view === "week" && (
        <div className="max-h-[500px] overflow-y-auto">
          <WeekView date={date} events={events} onEventClick={onEventClick} />
        </div>
      )}
      {view === "day" && (
        <DayTimelineView
          date={date}
          events={events}
          tables={defaultTables}
          onEventClick={onEventClick}
        />
      )}
    </div>
  );
}
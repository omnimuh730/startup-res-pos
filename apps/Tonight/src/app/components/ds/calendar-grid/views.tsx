import { useRef } from "react";
import {
  addDays,
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  isSameDay,
  isSameMonth,
  isToday,
  startOfMonth,
  startOfWeek,
} from "date-fns";
import { statusColors } from "./constants";
import type { CalendarEvent, TableConfig } from "./types";

export function MonthView({
  date,
  events,
  selectedDate,
  onSelectDate,
  onEventClick,
}: {
  date: Date;
  events: CalendarEvent[];
  selectedDate?: Date;
  onSelectDate?: (d: Date) => void;
  onEventClick?: (e: CalendarEvent) => void;
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
          <div key={d} className="py-2.5 text-center text-[0.6875rem] text-muted-foreground">
            {d}
          </div>
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
              className={`min-h-[80px] border-b border-r border-border p-1.5 transition-colors sm:min-h-[96px] ${outOfMonth ? "bg-muted/20" : "cursor-pointer hover:bg-secondary/40"} ${isSelected ? "bg-primary/5 ring-1 ring-primary/20 ring-inset" : ""}`}
            >
              <div className="mb-1 flex items-center justify-between">
                <span
                  className={`flex h-6 w-6 items-center justify-center rounded-full text-[0.6875rem] ${today ? "bg-primary text-primary-foreground" : ""} ${outOfMonth ? "text-muted-foreground/30" : ""}`}
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
                      onClick={(e) => {
                        e.stopPropagation();
                        onEventClick?.(ev);
                      }}
                      className={`w-full truncate rounded border-l-2 px-1.5 py-0.5 text-left text-[0.5625rem] ${sc.bg} ${sc.text} ${sc.border}`}
                    >
                      {ev.time && <span className="opacity-70">{ev.time} </span>}
                      {ev.title}
                    </button>
                  );
                })}
                {dayEvents.length > 3 && (
                  <span className="px-1.5 text-[0.5rem] text-muted-foreground">+{dayEvents.length - 3} more</span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}

export function WeekView({
  date,
  events,
  onEventClick,
}: {
  date: Date;
  events: CalendarEvent[];
  onEventClick?: (e: CalendarEvent) => void;
}) {
  const weekStart = startOfWeek(date, { weekStartsOn: 0 });
  const weekDays = eachDayOfInterval({ start: weekStart, end: addDays(weekStart, 6) });
  const hours = Array.from({ length: 16 }, (_, i) => i + 6);

  const getEventsForDayHour = (day: Date, hour: number) =>
    events.filter((e) => isSameDay(e.date, day) && e.date.getHours() === hour);

  return (
    <div className="overflow-x-auto">
      <div className="min-w-[700px]">
        <div className="sticky top-0 z-10 grid grid-cols-[60px_repeat(7,1fr)] border-b border-border bg-card">
          <div className="p-2" />
          {weekDays.map((day) => (
            <div
              key={day.toISOString()}
              className={`border-l border-border p-2 text-center ${isToday(day) ? "bg-primary/5" : ""}`}
            >
              <p className="text-[0.625rem] uppercase text-muted-foreground">{format(day, "EEE")}</p>
              <p className={`text-[0.9375rem] ${isToday(day) ? "text-primary" : ""}`}>{format(day, "d")}</p>
            </div>
          ))}
        </div>
        <div className="relative">
          {hours.map((hour) => (
            <div key={hour} className="grid min-h-[52px] grid-cols-[60px_repeat(7,1fr)] border-b border-border">
              <div className="px-2 py-1 pr-3 text-right text-[0.625rem] text-muted-foreground">
                {hour === 0 ? "12 AM" : hour < 12 ? `${hour} AM` : hour === 12 ? "12 PM" : `${hour - 12} PM`}
              </div>
              {weekDays.map((day) => {
                const dayEvents = getEventsForDayHour(day, hour);
                return (
                  <div
                    key={`${day.toISOString()}-${hour}`}
                    className={`border-l border-border p-0.5 ${isToday(day) ? "bg-primary/[0.02]" : ""}`}
                  >
                    {dayEvents.map((ev) => {
                      const sc = statusColors[ev.status || "confirmed"];
                      return (
                        <button
                          key={ev.id}
                          onClick={() => onEventClick?.(ev)}
                          className={`w-full truncate rounded-md border-l-2 px-2 py-1 text-left text-[0.625rem] ${sc.bg} ${sc.text} ${sc.border}`}
                        >
                          <span className="block truncate">{ev.title}</span>
                          {ev.guests && <span className="opacity-60">Guests: {ev.guests}</span>}
                        </button>
                      );
                    })}
                  </div>
                );
              })}
            </div>
          ))}

          {weekDays.some((day) => isToday(day)) && (() => {
            const now = new Date();
            const h = now.getHours();
            const m = now.getMinutes();
            if (h < 6 || h > 21) return null;
            const top = (h - 6) * 52 + (m / 60) * 52;
            const todayIdx = weekDays.findIndex((day) => isToday(day));
            return (
              <div className="pointer-events-none absolute left-[60px] right-0 z-10" style={{ top: `${top}px` }}>
                <div className="relative h-0">
                  <div
                    className="absolute h-[2px] bg-destructive/80"
                    style={{ left: `${(todayIdx / 7) * 100}%`, width: `${(1 / 7) * 100}%` }}
                  />
                  <div
                    className="absolute h-2.5 w-2.5 -translate-y-1/2 rounded-full bg-destructive"
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

export function DayTimelineView({
  date,
  events,
  tables,
  onEventClick,
}: {
  date: Date;
  events: CalendarEvent[];
  tables: TableConfig[];
  onEventClick?: (e: CalendarEvent) => void;
}) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const startHour = 11;
  const endHour = 23;
  const totalHours = endHour - startHour;
  const colWidth = 120;

  const dayEvents = events.filter((e) => isSameDay(e.date, date));
  const sections = [...new Set(tables.map((t) => t.section))];

  const getEventStyle = (ev: CalendarEvent) => {
    const h = ev.date.getHours() + ev.date.getMinutes() / 60;
    const endH = ev.endDate ? ev.endDate.getHours() + ev.endDate.getMinutes() / 60 : h + 1.5;
    const left = (h - startHour) * colWidth;
    const width = (endH - h) * colWidth;
    return { left: `${left}px`, width: `${Math.max(width, 40)}px` };
  };

  const now = new Date();
  const nowH = now.getHours() + now.getMinutes() / 60;
  const nowLeft = (nowH - startHour) * colWidth;
  const showNowLine = isSameDay(date, now) && nowH >= startHour && nowH <= endHour;

  return (
    <div className="overflow-x-auto rounded-xl border border-border" ref={scrollRef}>
      <div style={{ minWidth: `${totalHours * colWidth + 100}px` }}>
        <div className="sticky top-0 z-10 flex border-b border-border bg-secondary/30">
          <div className="w-[100px] shrink-0 px-3 py-2.5 text-[0.6875rem] uppercase tracking-wider text-muted-foreground">
            Tables
          </div>
          {Array.from({ length: totalHours + 1 }, (_, i) => {
            const h = startHour + i;
            return (
              <div
                key={h}
                className="border-l border-border py-2.5 text-[0.6875rem] text-muted-foreground"
                style={{ width: `${colWidth}px` }}
              >
                <span className="pl-2">
                  {h === 0 ? "12 AM" : h < 12 ? `${h}:00 AM` : h === 12 ? "12:00 PM" : `${h - 12}:00 PM`}
                </span>
              </div>
            );
          })}
        </div>

        {sections.map((section) => {
          const sectionTables = tables.filter((t) => t.section === section);
          return sectionTables.map((table) => {
            const tableEvents = dayEvents.filter((e) => e.table === table.id);
            return (
              <div key={table.id} className="flex border-b border-border transition-colors hover:bg-secondary/20">
                <div className="w-[100px] shrink-0 border-r border-border bg-card px-3 py-2">
                  <p className="text-[0.6875rem] text-primary">{table.id}</p>
                  <p className="text-[0.75rem]">{table.label}</p>
                  <p className="text-[0.5625rem] text-muted-foreground">{table.seats} seats</p>
                </div>
                <div className="relative min-h-[48px] flex-1">
                  {Array.from({ length: totalHours + 1 }, (_, i) => (
                    <div
                      key={i}
                      className="absolute bottom-0 top-0 border-l border-border/40"
                      style={{ left: `${i * colWidth}px` }}
                    />
                  ))}

                  {tableEvents.map((ev) => {
                    const sc = statusColors[ev.status || "confirmed"];
                    const style = getEventStyle(ev);
                    return (
                      <button
                        key={ev.id}
                        onClick={() => onEventClick?.(ev)}
                        className={`absolute bottom-1 top-1 overflow-hidden rounded-md border-l-4 px-2 py-1 transition-all hover:ring-1 hover:ring-primary/30 ${sc.bg} ${sc.border}`}
                        style={{ left: style.left, width: style.width }}
                      >
                        <p className={`truncate text-[0.625rem] ${sc.text}`}>
                          {ev.title}
                          {ev.guests && <span className="ml-1 opacity-60">Guests: {ev.guests}</span>}
                        </p>
                      </button>
                    );
                  })}

                  {showNowLine && (
                    <div className="absolute bottom-0 top-0 z-10 w-[2px] bg-destructive" style={{ left: `${nowLeft}px` }}>
                      <div className="h-2.5 w-2.5 -translate-x-1 -translate-y-1 rounded-full bg-destructive" />
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

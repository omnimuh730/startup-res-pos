import { useState } from "react";
import { addDays, addMonths, addWeeks, format, startOfWeek, subDays, subMonths, subWeeks } from "date-fns";
import { ChevronLeft, ChevronRight, Plus } from "lucide-react";
import { defaultTables, statusColors } from "./constants";
import type { CalendarGridProps, CalendarView } from "./types";
import { DayTimelineView, MonthView, WeekView } from "./views";

export function CalendarGrid({ events = [], selectedDate: controlledDate, onSelectDate, onEventClick, onNewBooking, view: controlledView, className = "" }: CalendarGridProps) {
  const [internalDate, setInternalDate] = useState(controlledDate || new Date());
  const [internalView, setInternalView] = useState<CalendarView>(controlledView || "month");

  const date = controlledDate || internalDate;
  const view = controlledView || internalView;

  const navigate = (dir: -1 | 1) => {
    const fn = view === "month" ? (dir === 1 ? addMonths : subMonths) : view === "week" ? (dir === 1 ? addWeeks : subWeeks) : (dir === 1 ? addDays : subDays);
    const next = fn(date, 1);
    setInternalDate(next);
    onSelectDate?.(next);
  };

  const headerLabel = view === "month" ? format(date, "MMMM yyyy") : view === "week" ? `${format(startOfWeek(date), "MMM d")} – ${format(addDays(startOfWeek(date), 6), "MMM d, yyyy")}` : format(date, "EEEE, MMMM d, yyyy");

  return (
    <div className={`border border-border rounded-xl overflow-hidden bg-card ${className}`}>
      <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-secondary/20">
        <div className="flex items-center gap-2"><button type="button" onClick={() => navigate(-1)} className="p-1.5 hover:bg-secondary rounded-lg cursor-pointer transition-colors"><ChevronLeft className="w-4 h-4" /></button><button type="button" onClick={() => navigate(1)} className="p-1.5 hover:bg-secondary rounded-lg cursor-pointer transition-colors"><ChevronRight className="w-4 h-4" /></button><button type="button" onClick={() => { setInternalDate(new Date()); onSelectDate?.(new Date()); }} className="px-2.5 py-1 text-[0.6875rem] border border-border rounded-lg hover:bg-secondary cursor-pointer transition-colors ml-1">Today</button><h3 className="text-[0.9375rem] ml-2">{headerLabel}</h3></div>
        <div className="flex items-center gap-2">{view === "day" && <div className="hidden lg:flex items-center gap-2 mr-3">{Object.entries(statusColors).map(([status, colors]) => <span key={status} className={`px-2 py-0.5 rounded-full text-[0.5625rem] ${colors.bg} ${colors.text} capitalize`}>{status.replace("-", " ")}</span>)}</div>}<div className="flex bg-secondary rounded-lg p-0.5">{(["month", "week", "day"] as CalendarView[]).map((v) => <button key={v} type="button" onClick={() => setInternalView(v)} className={`px-3 py-1 rounded-md text-[0.6875rem] cursor-pointer transition-colors capitalize ${view === v ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}>{v}</button>)}</div>{onNewBooking && <button type="button" onClick={onNewBooking} className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-primary text-primary-foreground rounded-lg text-[0.6875rem] hover:opacity-90 cursor-pointer transition-opacity"><Plus className="w-3.5 h-3.5" /> New Booking</button>}</div>
      </div>

      {view === "month" && <MonthView date={date} events={events} selectedDate={controlledDate} onSelectDate={onSelectDate} onEventClick={onEventClick} />}
      {view === "week" && <div className="max-h-[500px] overflow-y-auto"><WeekView date={date} events={events} onEventClick={onEventClick} /></div>}
      {view === "day" && <DayTimelineView date={date} events={events} tables={defaultTables} onEventClick={onEventClick} />}
    </div>
  );
}

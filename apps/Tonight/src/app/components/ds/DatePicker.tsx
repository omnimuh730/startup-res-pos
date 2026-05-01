import { useState, useRef, useEffect } from "react";
import { ChevronLeft, ChevronRight, Calendar } from "lucide-react";
import {
  format,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  addMonths,
  subMonths,
  isSameMonth,
  isSameDay,
  isToday,
  isBefore,
  isAfter,
} from "date-fns";

// ── DatePicker ─────────────────────────────────────────────
export interface DatePickerProps {
  value?: Date | null;
  onChange?: (date: Date | null) => void;
  label?: string;
  placeholder?: string;
  minDate?: Date;
  maxDate?: Date;
  disabled?: boolean;
  error?: string;
  className?: string;
}

export function DatePicker({
  value,
  onChange,
  label,
  placeholder = "Select date",
  minDate,
  maxDate,
  disabled = false,
  error,
  className = "",
}: DatePickerProps) {
  const [open, setOpen] = useState(false);
  const [month, setMonth] = useState(value || new Date());
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const days = eachDayOfInterval({
    start: startOfWeek(startOfMonth(month), { weekStartsOn: 0 }),
    end: endOfWeek(endOfMonth(month), { weekStartsOn: 0 }),
  });

  const isDisabledDay = (d: Date) => {
    if (minDate && isBefore(d, minDate)) return true;
    if (maxDate && isAfter(d, maxDate)) return true;
    return false;
  };

  return (
    <div className={`${className}`} ref={ref}>
      {label && <label className="text-[0.8125rem] mb-1.5 block">{label}</label>}
      <button
        type="button"
        disabled={disabled}
        onClick={() => !disabled && setOpen(!open)}
        className={`
          w-full flex items-center justify-between px-3.5 py-2.5 text-[0.8125rem] border rounded-lg bg-background transition-all cursor-pointer
          ${error ? "border-destructive" : open ? "border-primary ring-2 ring-primary/20" : "border-border hover:border-primary/40"}
          ${disabled ? "opacity-50 cursor-not-allowed" : ""}
        `}
      >
        <span className={value ? "text-foreground" : "text-muted-foreground"}>
          {value ? format(value, "MMM d, yyyy") : placeholder}
        </span>
        <Calendar className="w-4 h-4 text-muted-foreground" />
      </button>

      {open && (
        <div className="absolute z-50 mt-1 bg-background border border-border rounded-xl shadow-xl p-3 w-[280px]">
          <div className="flex items-center justify-between mb-3">
            <button type="button" onClick={() => setMonth(subMonths(month, 1))} className="p-1 hover:bg-secondary rounded cursor-pointer">
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-[0.8125rem]">{format(month, "MMMM yyyy")}</span>
            <button type="button" onClick={() => setMonth(addMonths(month, 1))} className="p-1 hover:bg-secondary rounded cursor-pointer">
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
          <div className="grid grid-cols-7 gap-0">
            {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((d) => (
              <div key={d} className="text-center text-[0.625rem] text-muted-foreground py-1">{d}</div>
            ))}
            {days.map((day) => {
              const selected = value && isSameDay(day, value);
              const today = isToday(day);
              const outOfMonth = !isSameMonth(day, month);
              const disabledDay = isDisabledDay(day);

              return (
                <button
                  key={day.toISOString()}
                  type="button"
                  disabled={disabledDay}
                  onClick={() => { onChange?.(day); setOpen(false); }}
                  className={`
                    w-full aspect-square flex items-center justify-center text-[0.75rem] rounded-lg transition-colors cursor-pointer
                    ${selected ? "bg-primary text-primary-foreground" : ""}
                    ${!selected && today ? "border border-primary text-primary" : ""}
                    ${outOfMonth ? "text-muted-foreground/40" : ""}
                    ${disabledDay ? "opacity-30 cursor-not-allowed" : "hover:bg-secondary"}
                  `}
                >
                  {format(day, "d")}
                </button>
              );
            })}
          </div>
          <div className="flex justify-between mt-2 pt-2 border-t border-border">
            <button type="button" onClick={() => { onChange?.(new Date()); setOpen(false); }} className="text-[0.75rem] text-primary cursor-pointer hover:underline">Today</button>
            <button type="button" onClick={() => { onChange?.(null); setOpen(false); }} className="text-[0.75rem] text-muted-foreground cursor-pointer hover:underline">Clear</button>
          </div>
        </div>
      )}
      {error && <p className="text-[0.75rem] text-destructive mt-1">{error}</p>}
    </div>
  );
}

// ── DateRangePicker ────────────────────────────────────────
export interface DateRangePickerProps {
  value?: [Date | null, Date | null];
  onChange?: (range: [Date | null, Date | null]) => void;
  label?: string;
  placeholder?: string;
  minDate?: Date;
  maxDate?: Date;
  disabled?: boolean;
  error?: string;
  className?: string;
}

export function DateRangePicker({
  value = [null, null],
  onChange,
  label,
  placeholder = "Select dates",
  minDate,
  maxDate,
  disabled = false,
  error,
  className = "",
}: DateRangePickerProps) {
  const [open, setOpen] = useState(false);
  const [month, setMonth] = useState(value[0] || new Date());
  const [selecting, setSelecting] = useState<"start" | "end">("start");
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const days = eachDayOfInterval({
    start: startOfWeek(startOfMonth(month), { weekStartsOn: 0 }),
    end: endOfWeek(endOfMonth(month), { weekStartsOn: 0 }),
  });

  const isDisabledDay = (d: Date) => {
    if (minDate && isBefore(d, minDate)) return true;
    if (maxDate && isAfter(d, maxDate)) return true;
    return false;
  };

  const handleSelect = (day: Date) => {
    if (selecting === "start") {
      onChange?.([day, null]);
      setSelecting("end");
    } else {
      if (value[0] && isBefore(day, value[0])) {
        onChange?.([day, null]);
        setSelecting("end");
      } else {
        onChange?.([value[0], day]);
        setSelecting("start");
        setOpen(false);
      }
    }
  };

  const isInRange = (day: Date) => {
    if (!value[0] || !value[1]) return false;
    return isAfter(day, value[0]) && isBefore(day, value[1]);
  };

  const displayText = value[0] && value[1]
    ? `${format(value[0], "MMM d")} – ${format(value[1], "MMM d, yyyy")}`
    : value[0]
    ? `${format(value[0], "MMM d, yyyy")} – ...`
    : placeholder;

  return (
    <div className={`${className}`} ref={ref}>
      {label && <label className="text-[0.8125rem] mb-1.5 block">{label}</label>}
      <button
        type="button"
        disabled={disabled}
        onClick={() => !disabled && setOpen(!open)}
        className={`
          w-full flex items-center justify-between px-3.5 py-2.5 text-[0.8125rem] border rounded-lg bg-background transition-all cursor-pointer
          ${error ? "border-destructive" : open ? "border-primary ring-2 ring-primary/20" : "border-border hover:border-primary/40"}
          ${disabled ? "opacity-50 cursor-not-allowed" : ""}
        `}
      >
        <span className={value[0] ? "text-foreground" : "text-muted-foreground"}>{displayText}</span>
        <Calendar className="w-4 h-4 text-muted-foreground" />
      </button>

      {open && (
        <div className="absolute z-50 mt-1 bg-background border border-border rounded-xl shadow-xl p-3 w-[280px]">
          <div className="flex items-center justify-between mb-3">
            <button type="button" onClick={() => setMonth(subMonths(month, 1))} className="p-1 hover:bg-secondary rounded cursor-pointer">
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-[0.8125rem]">{format(month, "MMMM yyyy")}</span>
            <button type="button" onClick={() => setMonth(addMonths(month, 1))} className="p-1 hover:bg-secondary rounded cursor-pointer">
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
          <div className="flex gap-2 mb-2 text-[0.6875rem]">
            <span className={`px-2 py-0.5 rounded ${selecting === "start" ? "bg-primary/15 text-primary" : "text-muted-foreground"}`}>Check-in</span>
            <span className={`px-2 py-0.5 rounded ${selecting === "end" ? "bg-primary/15 text-primary" : "text-muted-foreground"}`}>Check-out</span>
          </div>
          <div className="grid grid-cols-7 gap-0">
            {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((d) => (
              <div key={d} className="text-center text-[0.625rem] text-muted-foreground py-1">{d}</div>
            ))}
            {days.map((day) => {
              const isStart = value[0] && isSameDay(day, value[0]);
              const isEnd = value[1] && isSameDay(day, value[1]);
              const inRange = isInRange(day);
              const outOfMonth = !isSameMonth(day, month);
              const dis = isDisabledDay(day);

              return (
                <button
                  key={day.toISOString()}
                  type="button"
                  disabled={dis}
                  onClick={() => handleSelect(day)}
                  className={`
                    w-full aspect-square flex items-center justify-center text-[0.75rem] transition-colors cursor-pointer
                    ${isStart || isEnd ? "bg-primary text-primary-foreground rounded-lg" : ""}
                    ${inRange ? "bg-primary/10" : ""}
                    ${!isStart && !isEnd && !inRange ? "rounded-lg hover:bg-secondary" : ""}
                    ${outOfMonth ? "text-muted-foreground/40" : ""}
                    ${dis ? "opacity-30 cursor-not-allowed" : ""}
                  `}
                >
                  {format(day, "d")}
                </button>
              );
            })}
          </div>
          <div className="flex justify-end mt-2 pt-2 border-t border-border">
            <button type="button" onClick={() => { onChange?.([null, null]); setSelecting("start"); }} className="text-[0.75rem] text-muted-foreground cursor-pointer hover:underline">Clear</button>
          </div>
        </div>
      )}
      {error && <p className="text-[0.75rem] text-destructive mt-1">{error}</p>}
    </div>
  );
}

import { useState, useRef, useEffect } from "react";
import { Clock, Check } from "lucide-react";

export interface TimeSlotPickerProps {
  slots?: string[];
  value?: string;
  onChange?: (slot: string) => void;
  label?: string;
  disabled?: boolean;
  unavailable?: string[];
  columns?: 3 | 4 | 5;
  className?: string;
}

const defaultSlots = [
  "17:00", "17:30", "18:00", "18:30", "19:00", "19:30",
  "20:00", "20:30", "21:00", "21:30", "22:00", "22:30",
];

export function TimeSlotPicker({
  slots = defaultSlots,
  value,
  onChange,
  label,
  disabled = false,
  unavailable = [],
  columns = 4,
  className = "",
}: TimeSlotPickerProps) {
  const colClass = columns === 3 ? "grid-cols-3" : columns === 5 ? "grid-cols-5" : "grid-cols-4";

  return (
    <div className={className}>
      {label && (
        <label className="text-[0.8125rem] mb-2 flex items-center gap-2">
          <Clock className="w-3.5 h-3.5 text-muted-foreground" />
          {label}
        </label>
      )}
      <div className={`grid ${colClass} gap-2`}>
        {slots.map((slot) => {
          const isUnavailable = unavailable.includes(slot);
          const isSelected = value === slot;

          return (
            <button
              key={slot}
              type="button"
              disabled={disabled || isUnavailable}
              onClick={() => onChange?.(slot)}
              className={`
                px-2 py-2 rounded-lg text-[0.75rem] transition-all cursor-pointer text-center
                ${isSelected
                  ? "bg-primary text-primary-foreground"
                  : isUnavailable
                  ? "bg-muted text-muted-foreground/40 line-through cursor-not-allowed"
                  : "border border-border hover:border-primary hover:text-primary"
                }
              `}
            >
              {slot}
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ── Compact Time Picker ────────────────────────────────────
export interface TimePickerProps {
  value?: string; // "HH:mm"
  onChange?: (time: string) => void;
  label?: string;
  disabled?: boolean;
  min?: string;
  max?: string;
  className?: string;
}

export function TimePicker({ value = "12:00", onChange, label, disabled = false, className = "" }: TimePickerProps) {
  const [h, m] = value.split(":").map(Number);
  const [showHourDropdown, setShowHourDropdown] = useState(false);
  const [showMinuteDropdown, setShowMinuteDropdown] = useState(false);
  const hourRef = useRef<HTMLDivElement>(null);
  const minuteRef = useRef<HTMLDivElement>(null);

  const pad = (n: number) => String(n).padStart(2, "0");

  const setHour = (newH: number) => {
    onChange?.(`${pad(newH)}:${pad(m)}`);
    setShowHourDropdown(false);
  };
  const setMinute = (newM: number) => {
    onChange?.(`${pad(h)}:${pad(newM)}`);
    setShowMinuteDropdown(false);
  };

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (hourRef.current && !hourRef.current.contains(e.target as Node)) setShowHourDropdown(false);
      if (minuteRef.current && !minuteRef.current.contains(e.target as Node)) setShowMinuteDropdown(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div className={className}>
      {label && <label className="text-[0.8125rem] mb-1.5 block">{label}</label>}
      <div className={`inline-flex items-center gap-1 border border-border rounded-lg px-3 py-2 ${disabled ? "opacity-50" : ""}`}>
        <div ref={hourRef} className="relative">
          <button
            type="button"
            onClick={() => !disabled && setShowHourDropdown(!showHourDropdown)}
            disabled={disabled}
            className="bg-transparent text-[0.875rem] outline-none cursor-pointer text-center w-8 hover:text-primary"
          >
            {pad(h)}
          </button>
          {showHourDropdown && (
            <div className="absolute top-full left-0 mt-1 bg-background border border-border rounded-lg shadow-xl z-50 max-h-48 overflow-y-auto w-16">
              {Array.from({ length: 24 }, (_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setHour(i)}
                  className={`w-full px-3 py-2 text-[0.875rem] text-center hover:bg-secondary cursor-pointer transition-colors ${
                    h === i ? "bg-primary/10 text-primary" : ""
                  }`}
                >
                  {pad(i)}
                </button>
              ))}
            </div>
          )}
        </div>
        <span className="text-muted-foreground">:</span>
        <div ref={minuteRef} className="relative">
          <button
            type="button"
            onClick={() => !disabled && setShowMinuteDropdown(!showMinuteDropdown)}
            disabled={disabled}
            className="bg-transparent text-[0.875rem] outline-none cursor-pointer text-center w-8 hover:text-primary"
          >
            {pad(m)}
          </button>
          {showMinuteDropdown && (
            <div className="absolute top-full left-0 mt-1 bg-background border border-border rounded-lg shadow-xl z-50 max-h-48 overflow-y-auto w-16">
              {[0, 15, 30, 45].map((v) => (
                <button
                  key={v}
                  type="button"
                  onClick={() => setMinute(v)}
                  className={`w-full px-3 py-2 text-[0.875rem] text-center hover:bg-secondary cursor-pointer transition-colors ${
                    m === v ? "bg-primary/10 text-primary" : ""
                  }`}
                >
                  {pad(v)}
                </button>
              ))}
            </div>
          )}
        </div>
        <Clock className="w-3.5 h-3.5 text-muted-foreground ml-1" />
      </div>
    </div>
  );
}

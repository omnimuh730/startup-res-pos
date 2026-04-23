import { useState } from "react";
import { CalendarRange } from "lucide-react";
import { useThemeClasses } from "../theme-context";
import { CustomRangePicker, type DateRange } from "./CustomRangePicker";

const PERIODS = [
  { key: "today", label: "Today" },
  { key: "week", label: "1 W" },
  { key: "month", label: "1 M" },
  { key: "3month", label: "3 Q" },
  { key: "custom", label: "Custom" },
] as const;

export type Period = (typeof PERIODS)[number]["key"];

interface DateFilterBarProps {
  period: Period;
  setPeriod: (p: Period) => void;
  title?: string;
  onRangeChange?: (range: DateRange | null) => void;
}

function fmtShort(d: Date) {
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export function DateFilterBar({ period, setPeriod, title, onRangeChange }: DateFilterBarProps) {
  const tc = useThemeClasses();
  const [pickerOpen, setPickerOpen] = useState(false);
  const [range, setRange] = useState<DateRange | null>(null);

  const handleSelect = (p: Period) => {
    if (p === "custom") {
      setPickerOpen(true);
    } else {
      setPeriod(p);
    }
  };

  const customLabel = period === "custom" && range
    ? `${fmtShort(range.start)} – ${fmtShort(range.end)}`
    : "Custom";

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 w-full">
      {title && <h2 className={`hidden md:block text-[1rem] ${tc.heading}`}>{title}</h2>}
      <div className="flex items-center gap-2 w-full sm:w-auto shrink-0">
        <div className={`flex items-center gap-0.5 ${tc.card} rounded-full p-0.5 w-full sm:w-auto shrink-0`}>
          {PERIODS.map((p) => {
            const isActive = period === p.key;
            const isCustom = p.key === "custom";
            return (
              <button
                key={p.key}
                onClick={() => handleSelect(p.key)}
                className={`flex-1 sm:flex-none justify-center px-3 py-1.5 rounded-full text-[0.875rem] cursor-pointer transition-colors flex items-center gap-1.5 ${
                  isActive ? "bg-blue-600 text-white" : `${tc.subtext} ${tc.hover}`
                }`}
              >
                {isCustom && <CalendarRange className="w-3 h-3" />}
                {isCustom ? customLabel : p.label}
              </button>
            );
          })}
        </div>
      </div>

      <CustomRangePicker
        open={pickerOpen}
        onClose={() => setPickerOpen(false)}
        onApply={(r) => { setRange(r); setPeriod("custom"); onRangeChange?.(r); }}
        initial={range}
      />
    </div>
  );
}

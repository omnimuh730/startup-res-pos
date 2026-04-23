import { buildMonthGrid } from "@rn/ui-core";
import { useMemo } from "react";
import { useWebTheme } from "../theme/provider";

export interface CalendarViewProps {
  year: number;
  monthZeroBased: number;
  selectedDate?: string;
  onSelectDate?: (isoDate: string) => void;
}

export function CalendarView({ year, monthZeroBased, selectedDate, onSelectDate }: CalendarViewProps) {
  const { colors } = useWebTheme();
  const days = useMemo(() => buildMonthGrid(year, monthZeroBased), [year, monthZeroBased]);

  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(7, minmax(0, 1fr))", gap: 6 }}>
      {days.map((day) => {
        const selected = selectedDate === day.isoDate;
        return (
          <button
            key={day.isoDate}
            onClick={() => onSelectDate?.(day.isoDate)}
            style={{
              minHeight: 36,
              borderRadius: 8,
              border: `1px solid ${colors.border}`,
              background: selected ? colors.primary : colors.card,
              color: selected ? colors.primaryForeground : day.inCurrentMonth ? colors.foreground : colors.mutedForeground,
              cursor: "pointer"
            }}
          >
            {day.day}
          </button>
        );
      })}
    </div>
  );
}

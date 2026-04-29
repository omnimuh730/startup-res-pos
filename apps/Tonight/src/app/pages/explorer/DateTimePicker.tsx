/* Date / Party / Time picker UI used in Explorer's bottom drawer */
import { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const TIME_SLOTS = [
  "5:00 PM", "5:30 PM", "6:00 PM", "6:30 PM",
  "7:00 PM", "7:30 PM", "8:00 PM", "8:30 PM",
  "9:00 PM", "9:30 PM", "10:00 PM",
];

const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
const WEEK = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];

function ymd(d: Date) { return `${d.getFullYear()}-${d.getMonth()+1}-${d.getDate()}`; }
function startOfDay(d: Date) { const x = new Date(d); x.setHours(0,0,0,0); return x; }

export interface DateTimeValue {
  date: Date | null;
  time: string | null;
  party: number;
}

interface Props {
  value: DateTimeValue;
  onChange: (v: DateTimeValue) => void;
}

export function DateTimePicker({ value, onChange }: Props) {
  const today = startOfDay(new Date());
  const initialMonth = value.date ?? today;
  const [viewMonth, setViewMonth] = useState(new Date(initialMonth.getFullYear(), initialMonth.getMonth(), 1));

  const grid = useMemo(() => {
    const first = new Date(viewMonth.getFullYear(), viewMonth.getMonth(), 1);
    const startWeekday = first.getDay();
    const cells: Date[] = [];
    const gridStart = new Date(first);
    gridStart.setDate(first.getDate() - startWeekday);
    for (let i = 0; i < 42; i++) {
      const d = new Date(gridStart);
      d.setDate(gridStart.getDate() + i);
      cells.push(d);
    }
    return cells;
  }, [viewMonth]);

  const selectedYmd = value.date ? ymd(value.date) : null;
  const todayYmd = ymd(today);

  const goPrev = () => setViewMonth(m => new Date(m.getFullYear(), m.getMonth() - 1, 1));
  const goNext = () => setViewMonth(m => new Date(m.getFullYear(), m.getMonth() + 1, 1));
  const goToday = () => {
    setViewMonth(new Date(today.getFullYear(), today.getMonth(), 1));
    onChange({ ...value, date: today });
  };

  return (
    <div className="space-y-5">
      <div>
        <div className="flex items-center justify-between mb-3">
          <button onClick={goToday} className="text-[0.875rem] text-primary underline underline-offset-2 cursor-pointer hover:opacity-80" style={{ fontWeight: 600 }}>Today</button>
          <div className="flex items-center gap-3">
            <button onClick={goPrev} className="p-1 hover:bg-secondary rounded-full cursor-pointer" aria-label="Previous month"><ChevronLeft className="w-5 h-5" /></button>
            <span className="text-[1rem]" style={{ fontWeight: 600 }}>{MONTHS[viewMonth.getMonth()]} {viewMonth.getFullYear()}</span>
            <button onClick={goNext} className="p-1 hover:bg-secondary rounded-full cursor-pointer" aria-label="Next month"><ChevronRight className="w-5 h-5" /></button>
          </div>
          <span className="w-12" />
        </div>
        <div className="grid grid-cols-7 gap-y-1">
          {WEEK.map(w => (
            <div key={w} className="text-center text-[0.75rem] text-muted-foreground py-1.5" style={{ fontWeight: 500 }}>{w}</div>
          ))}
          {grid.map((d, i) => {
            const inMonth = d.getMonth() === viewMonth.getMonth();
            const isPast = d < today;
            const isToday = ymd(d) === todayYmd;
            const isSelected = selectedYmd === ymd(d);
            const disabled = isPast;
            return (
              <button
                key={i}
                disabled={disabled}
                onClick={() => onChange({ ...value, date: startOfDay(d) })}
                className={`aspect-square flex items-center justify-center rounded-full text-[0.875rem] transition-all ${
                  isSelected ? "bg-primary text-primary-foreground shadow-md" :
                  disabled ? "text-muted-foreground/40 cursor-not-allowed" :
                  isToday ? "text-primary cursor-pointer hover:bg-secondary" :
                  inMonth ? "text-foreground cursor-pointer hover:bg-secondary" :
                  "text-muted-foreground/50 cursor-pointer hover:bg-secondary"
                }`}
                style={{ fontWeight: isSelected || isToday ? 600 : 400 }}
              >
                {d.getDate()}
              </button>
            );
          })}
        </div>
      </div>

      <div className="border-t border-border pt-4">
        <p className="text-[0.875rem] mb-2.5" style={{ fontWeight: 600 }}>Party Size</p>
        <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
          {[1,2,3,4,5,6,7,8,9,10].map(n => {
            const active = value.party === n;
            return (
              <button key={n} onClick={() => onChange({ ...value, party: n })}
                className={`shrink-0 w-11 h-11 rounded-full border flex items-center justify-center text-[0.9375rem] transition-all cursor-pointer ${active ? "bg-primary text-primary-foreground border-primary shadow-md" : "bg-card border-border hover:bg-secondary"}`}
                style={{ fontWeight: active ? 600 : 500 }}>
                {n}
              </button>
            );
          })}
        </div>
      </div>

      <div>
        <p className="text-[0.875rem] mb-2.5" style={{ fontWeight: 600 }}>Time</p>
        <div className="flex flex-wrap gap-2">
          {TIME_SLOTS.map(t => {
            const active = value.time === t;
            return (
              <button key={t} onClick={() => onChange({ ...value, time: active ? null : t })}
                className={`px-4 h-10 rounded-2xl border text-[0.875rem] transition-all cursor-pointer ${active ? "bg-primary text-primary-foreground border-primary shadow-md" : "bg-card border-border hover:bg-secondary"}`}
                style={{ fontWeight: active ? 600 : 500 }}>
                {t}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export function isSlotAvailable(restaurantId: string, date: Date, time: string, party: number): boolean {
  // Deterministic mock availability based on restaurant id + slot
  let h = 0;
  const key = `${restaurantId}|${ymd(date)}|${time}|${party}`;
  for (let i = 0; i < key.length; i++) h = (h * 31 + key.charCodeAt(i)) | 0;
  return Math.abs(h) % 100 < 70;
}

export function formatChipLabel(v: DateTimeValue): string {
  if (!v.date && !v.time) return "Time & Date";
  const parts: string[] = [];
  if (v.date) {
    const today = startOfDay(new Date());
    const tomorrow = new Date(today); tomorrow.setDate(today.getDate() + 1);
    if (ymd(v.date) === ymd(today)) parts.push("Today");
    else if (ymd(v.date) === ymd(tomorrow)) parts.push("Tomorrow");
    else parts.push(`${MONTHS[v.date.getMonth()]} ${v.date.getDate()}`);
  }
  if (v.time) parts.push(v.time);
  if (v.party && (v.date || v.time)) parts.push(`· ${v.party}`);
  return parts.join(" · ");
}

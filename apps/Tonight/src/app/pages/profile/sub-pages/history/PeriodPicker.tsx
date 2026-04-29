import { useEffect, useRef, useState } from "react";
import { ArrowRight, Calendar, ChevronLeft, ChevronRight } from "lucide-react";
import { addMonths, eachDayOfInterval, endOfMonth, endOfWeek, format as fmtDateFns, isAfter, isBefore, isSameDay, isSameMonth, startOfDay, startOfMonth, startOfWeek, subMonths } from "date-fns";
import { PERIOD_PRESETS, type DateRange, type PresetId } from "./types";
import { rangeFromPreset, rangeLabel } from "./mockData";

export function PeriodPicker({ value, onChange }: { value: DateRange; onChange: (r: DateRange) => void }) {
  const [open, setOpen] = useState(false);
  const [month, setMonth] = useState<Date>(value.from);
  const [draft, setDraft] = useState<{ from: Date | null; to: Date | null }>({ from: value.from, to: value.to });
  const [selecting, setSelecting] = useState<"from" | "to">("from");
  const [hover, setHover] = useState<Date | null>(null);
  const ref = useRef<HTMLDivElement>(null);
  const today = startOfDay(new Date());
  useEffect(() => { const onDoc = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false); }; document.addEventListener("mousedown", onDoc); return () => document.removeEventListener("mousedown", onDoc); }, []);
  useEffect(() => { if (open) { setDraft({ from: value.from, to: value.to }); setMonth(value.from); setSelecting("from"); setHover(null); } }, [open, value]);
  const days = eachDayOfInterval({ start: startOfWeek(startOfMonth(month), { weekStartsOn: 0 }), end: endOfWeek(endOfMonth(month), { weekStartsOn: 0 }) });
  const handleDay = (d: Date) => {
    if (selecting === "from" || !draft.from || (draft.from && draft.to)) { setDraft({ from: d, to: null }); setSelecting("to"); return; }
    if (isBefore(d, draft.from)) { setDraft({ from: d, to: null }); setSelecting("to"); return; }
    setDraft({ from: draft.from, to: d });
    setSelecting("from");
  };
  const effFrom = draft.from;
  const effTo = draft.to ?? (selecting === "to" && draft.from && hover && !isBefore(hover, draft.from) ? hover : draft.to);
  const inRange = (d: Date) => effFrom && effTo && isAfter(d, effFrom) && isBefore(d, effTo);
  const dayCount = effFrom && effTo ? Math.round((startOfDay(effTo).getTime() - startOfDay(effFrom).getTime()) / 86400000) + 1 : 0;
  const apply = () => { if (draft.from && draft.to) { onChange({ from: startOfDay(draft.from), to: draft.to, presetId: "custom" }); setOpen(false); } };
  const choosePreset = (id: PresetId) => { if (id === "custom") { setDraft({ from: null, to: null }); setSelecting("from"); return; } onChange(rangeFromPreset(id)); setOpen(false); };

  return (
    <div className="relative" ref={ref}>
      <button onClick={() => setOpen((o) => !o)} className={`w-full flex items-center justify-between gap-2 pl-2 pr-5 py-2 rounded-full border bg-card transition cursor-pointer ${open ? "border-primary ring-4 ring-primary/15" : "border-border hover:border-primary/40"}`}>
        <div className="flex items-center gap-3 min-w-0"><div className={`w-10 h-10 rounded-full flex items-center justify-center transition ${open ? "bg-primary text-primary-foreground" : "bg-primary/10 text-primary"}`}><Calendar className="w-4 h-4" /></div><div className="text-left min-w-0"><div className="text-[0.625rem] text-muted-foreground tracking-wider" style={{ fontWeight: 600 }}>PERIOD</div><div className="text-[0.875rem] truncate" style={{ fontWeight: 600 }}>{rangeLabel(value)}</div></div></div>
        <ChevronRight className={`w-4 h-4 text-muted-foreground transition-transform ${open ? "rotate-90" : ""}`} />
      </button>
      {open && (
        <div className="absolute z-50 left-0 right-0 mt-2 bg-background border border-border rounded-3xl shadow-2xl overflow-hidden">
          <div className="p-3 border-b border-border"><div className="grid grid-cols-3 gap-1.5">{PERIOD_PRESETS.map((p) => { const isActive = value.presetId === p.id || (p.id === "custom" && (!draft.from || !draft.to) && value.presetId === "custom"); return <button key={p.id} onClick={() => choosePreset(p.id)} className={`relative px-2 py-1.5 rounded-full border text-center text-[0.75rem] transition ${isActive ? "border-primary bg-primary/5 text-primary" : "border-border hover:border-primary/40 hover:bg-primary/5"}`} style={{ fontWeight: isActive ? 700 : 500 }}>{p.label}</button>; })}</div></div>
          <div className="px-3 pt-2 pb-1.5 flex items-center gap-1.5">
            <button onClick={() => setSelecting("from")} className={`flex-1 text-left px-3 py-1 rounded-full border transition ${selecting === "from" ? "border-primary bg-primary/5" : "border-border"}`}><div className="text-[0.5625rem] tracking-wider text-muted-foreground leading-tight" style={{ fontWeight: 600 }}>FROM</div><div className="text-[0.75rem] leading-tight" style={{ fontWeight: 600 }}>{draft.from ? fmtDateFns(draft.from, "MMM d") : <span className="text-muted-foreground">—</span>}</div></button>
            {dayCount > 0 ? <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-[0.625rem] shrink-0" style={{ fontWeight: 700 }}>{dayCount}d</span> : <ArrowRight className="w-3.5 h-3.5 text-muted-foreground shrink-0" />}
            <button onClick={() => draft.from && setSelecting("to")} className={`flex-1 text-left px-3 py-1 rounded-full border transition ${selecting === "to" ? "border-primary bg-primary/5" : "border-border"}`}><div className="text-[0.5625rem] tracking-wider text-muted-foreground leading-tight" style={{ fontWeight: 600 }}>TO</div><div className="text-[0.75rem] leading-tight" style={{ fontWeight: 600 }}>{draft.to ? fmtDateFns(draft.to, "MMM d") : <span className="text-muted-foreground">—</span>}</div></button>
          </div>
          <div className="px-3 pb-2">
            <div className="flex items-center justify-between mb-1.5"><button onClick={() => setMonth(subMonths(month, 1))} className="w-7 h-7 bg-primary/10 text-primary hover:bg-primary/15 rounded-full flex items-center justify-center transition"><ChevronLeft className="w-3.5 h-3.5" /></button><span className="text-[0.8125rem]" style={{ fontWeight: 700 }}>{fmtDateFns(month, "MMMM")} <span className="text-muted-foreground" style={{ fontWeight: 500 }}>{fmtDateFns(month, "yyyy")}</span></span><button onClick={() => setMonth(addMonths(month, 1))} className="w-7 h-7 bg-primary/10 text-primary hover:bg-primary/15 rounded-full flex items-center justify-center transition"><ChevronRight className="w-3.5 h-3.5" /></button></div>
            <div className="grid grid-cols-7">
              {["S", "M", "T", "W", "T", "F", "S"].map((d, i) => <div key={i} className="text-center text-[0.625rem] text-muted-foreground py-2 tracking-wider" style={{ fontWeight: 600 }}>{d}</div>)}
              {days.map((day) => {
                const isFrom = !!effFrom && isSameDay(day, effFrom);
                const isTo = !!effTo && isSameDay(day, effTo);
                const within = inRange(day);
                const outside = !isSameMonth(day, month);
                const isTodayDay = isSameDay(day, today);
                const endpoint = isFrom || isTo;
                const sameDayRange = isFrom && isTo;
                const fillClasses = [within ? "bg-primary/12" : "", isFrom && !sameDayRange ? "bg-primary/12 rounded-l-full" : "", isTo && !sameDayRange ? "bg-primary/12 rounded-r-full" : ""].join(" ");
                return <button key={day.toISOString()} onClick={() => handleDay(day)} onMouseEnter={() => setHover(day)} onMouseLeave={() => setHover(null)} className={`relative w-full h-11 flex items-center justify-center text-[0.8125rem] ${fillClasses}`} style={{ fontWeight: outside ? 400 : 500 }}><span className={`relative z-10 w-9 h-9 max-w-full max-h-full flex items-center justify-center transition-all rounded-full ${isFrom ? "bg-primary text-primary-foreground shadow-md" : ""} ${isTo && !isFrom ? "border-2 border-primary text-primary bg-background" : ""} ${!endpoint && !within ? "hover:bg-secondary" : ""} ${outside ? "text-muted-foreground/40" : ""} ${isTodayDay && !endpoint ? "text-primary" : ""}`}>{fmtDateFns(day, "d")}{isTodayDay && !endpoint && <span className="absolute -bottom-0.5 w-1 h-1 rounded-full bg-primary" />}</span></button>;
              })}
            </div>
          </div>
          <div className="flex items-center justify-between gap-2 px-3 py-2 border-t border-border bg-secondary/20">
            <button onClick={() => { setDraft({ from: null, to: null }); setSelecting("from"); }} className="text-[0.75rem] text-muted-foreground hover:text-foreground" style={{ fontWeight: 500 }}>Clear</button>
            <div className="flex gap-1.5"><button onClick={() => setOpen(false)} className="px-3.5 py-1.5 text-[0.75rem] rounded-full hover:bg-secondary" style={{ fontWeight: 500 }}>Cancel</button><button onClick={apply} disabled={!draft.from || !draft.to} className="px-3.5 py-1.5 text-[0.75rem] rounded-full bg-primary text-primary-foreground disabled:opacity-40 hover:bg-primary/90 transition" style={{ fontWeight: 600 }}>Apply</button></div>
          </div>
        </div>
      )}
    </div>
  );
}

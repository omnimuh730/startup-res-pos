import { useEffect, useRef, useState } from "react";
import { ArrowRight, Calendar, ChevronLeft, ChevronRight } from "lucide-react";
import { addMonths, eachDayOfInterval, endOfMonth, endOfWeek, format as fmtDateFns, isAfter, isBefore, isSameDay, isSameMonth, startOfDay, startOfMonth, startOfWeek, subMonths } from "date-fns";
import { PERIOD_PRESETS, type DateRange, type PresetId } from "./types";
import { rangeFromPreset, rangeLabel } from "./mockData";
import { motion, AnimatePresence } from "framer-motion";

export function PeriodPicker({ value, onChange }: { value: DateRange; onChange: (r: DateRange) => void }) {
  const [open, setOpen] = useState(false);
  const [month, setMonth] = useState<Date>(value.from);
  const [draft, setDraft] = useState<{ from: Date | null; to: Date | null }>({ from: value.from, to: value.to });
  const [selecting, setSelecting] = useState<"from" | "to">("from");
  const [hover, setHover] = useState<Date | null>(null);
  const ref = useRef<HTMLDivElement>(null);
  
  const today = startOfDay(new Date());

  useEffect(() => { 
    const onDoc = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false); }; 
    document.addEventListener("mousedown", onDoc); 
    return () => document.removeEventListener("mousedown", onDoc); 
  }, []);

  useEffect(() => { 
    if (open) { 
      setDraft({ from: value.from, to: value.to }); 
      setMonth(value.from); 
      setSelecting("from"); 
      setHover(null); 
    } 
  }, [open, value]);

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
  const apply = () => { if (draft.from && draft.to) { onChange({ from: startOfDay(draft.from), to: draft.to, presetId: "custom" }); setOpen(false); } };
  const choosePreset = (id: PresetId) => { if (id === "custom") { setDraft({ from: null, to: null }); setSelecting("from"); return; } onChange(rangeFromPreset(id)); setOpen(false); };

  return (
    <div className="relative font-sans" ref={ref}>
      {/* Search Bar / Trigger */}
      <button 
        onClick={() => setOpen((o) => !o)} 
        className={`w-full flex items-center gap-3 pl-4 pr-2 py-2 rounded-full border transition-all cursor-pointer bg-white shadow-[0_2px_12px_rgba(0,0,0,0.06)] hover:shadow-[0_4px_16px_rgba(0,0,0,0.1)] ${open ? "border-primary ring-2 ring-primary/10" : "border-border"}`}
      >
        <Calendar className="w-5 h-5 text-primary shrink-0" strokeWidth={2.5} />
        <div className="text-left flex-1 min-w-0 py-1">
          <div className="text-[0.625rem] text-muted-foreground tracking-widest uppercase mb-0.5" style={{ fontWeight: 700 }}>Dates</div>
          <div className="text-[0.9375rem] text-black truncate" style={{ fontWeight: 600 }}>{rangeLabel(value)}</div>
        </div>
        <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
          <ChevronRight className={`w-5 h-5 transition-transform ${open ? "rotate-90" : ""}`} />
        </div>
      </button>

      {/* Dropdown Calendar Modal */}
      <AnimatePresence>
        {open && (
          <motion.div 
            initial={{ opacity: 0, y: 10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.98 }}
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
            className="absolute z-50 left-0 right-0 mt-3 bg-white border border-border rounded-3xl shadow-[0_8px_32px_rgba(0,0,0,0.12)] overflow-hidden"
          >
            {/* Quick Presets */}
            <div className="p-4 border-b border-border bg-secondary/50">
              <div className="flex overflow-x-auto gap-2 pb-1 scrollbar-hide mask-fade-edges">
                {PERIOD_PRESETS.map((p) => { 
                  const isActive = value.presetId === p.id || (p.id === "custom" && (!draft.from || !draft.to) && value.presetId === "custom"); 
                  return (
                    <button 
                      key={p.id} 
                      onClick={() => choosePreset(p.id)} 
                      className={`whitespace-nowrap px-4 py-2 rounded-full border text-[0.875rem] transition-colors ${isActive ? "border-primary bg-primary text-primary-foreground shadow-[0_6px_14px_rgba(255,56,92,0.22)]" : "border-border bg-white text-muted-foreground hover:border-primary/35 hover:text-foreground"}`} 
                      style={{ fontWeight: 600 }}
                    >
                      {p.label}
                    </button>
                  ); 
                })}
              </div>
            </div>

            {/* From / To Indicator */}
            <div className="px-5 pt-4 pb-2 flex items-center gap-3">
              <button onClick={() => setSelecting("from")} className={`flex-1 text-left p-3 rounded-2xl border transition-colors ${selecting === "from" ? "border-primary bg-primary/5 shadow-inner" : "border-border hover:border-primary/35"}`}>
                <div className="text-[0.625rem] tracking-widest text-muted-foreground uppercase" style={{ fontWeight: 700 }}>From</div>
                <div className="text-[0.9375rem] mt-0.5" style={{ fontWeight: 600 }}>{draft.from ? fmtDateFns(draft.from, "MMM d") : <span className="text-gray-300">Add date</span>}</div>
              </button>
              <ArrowRight className="w-5 h-5 text-border shrink-0" />
              <button onClick={() => draft.from && setSelecting("to")} className={`flex-1 text-left p-3 rounded-2xl border transition-colors ${selecting === "to" ? "border-primary bg-primary/5 shadow-inner" : "border-border hover:border-primary/35"}`}>
                <div className="text-[0.625rem] tracking-widest text-muted-foreground uppercase" style={{ fontWeight: 700 }}>To</div>
                <div className="text-[0.9375rem] mt-0.5" style={{ fontWeight: 600 }}>{draft.to ? fmtDateFns(draft.to, "MMM d") : <span className="text-gray-300">Add date</span>}</div>
              </button>
            </div>

            {/* Calendar Grid */}
            <div className="px-5 pb-4">
              <div className="flex items-center justify-between py-3">
                <button onClick={() => setMonth(subMonths(month, 1))} className="w-8 h-8 rounded-full hover:bg-primary/10 flex items-center justify-center transition text-black"><ChevronLeft className="w-5 h-5" /></button>
                <span className="text-[1rem] text-black" style={{ fontWeight: 700 }}>{fmtDateFns(month, "MMMM yyyy")}</span>
                <button onClick={() => setMonth(addMonths(month, 1))} className="w-8 h-8 rounded-full hover:bg-primary/10 flex items-center justify-center transition text-black"><ChevronRight className="w-5 h-5" /></button>
              </div>
              <div className="grid grid-cols-7 gap-y-1">
                {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((d, i) => <div key={i} className="text-center text-[0.75rem] text-gray-400 py-2" style={{ fontWeight: 600 }}>{d}</div>)}
                {days.map((day) => {
                  const isFrom = !!effFrom && isSameDay(day, effFrom);
                  const isTo = !!effTo && isSameDay(day, effTo);
                  const within = inRange(day);
                  const outside = !isSameMonth(day, month);
                  const isTodayDay = isSameDay(day, today);
                  const endpoint = isFrom || isTo;
                  const sameDayRange = isFrom && isTo;
                  
                  // Airbnb soft gray connecting background.
                  const fillClasses = [
                    within ? "bg-gray-100" : "", 
                    isFrom && !sameDayRange ? "bg-gray-100 rounded-l-full" : "", 
                    isTo && !sameDayRange ? "bg-gray-100 rounded-r-full" : ""
                  ].join(" ");
                  
                  return (
                    <button 
                      key={day.toISOString()} 
                      onClick={() => handleDay(day)} 
                      onMouseEnter={() => setHover(day)} 
                      onMouseLeave={() => setHover(null)} 
                      className={`relative w-full h-[2.75rem] flex items-center justify-center text-[0.875rem] ${fillClasses}`} 
                      style={{ fontWeight: endpoint ? 700 : 500 }}
                    >
                      <span className={`relative z-10 w-10 h-10 flex items-center justify-center transition-colors rounded-full ${
                          isFrom || isTo ? "bg-primary text-primary-foreground" : ""
                        } ${!endpoint && !within && !outside ? "hover:border hover:border-primary text-black" : ""} ${
                          outside ? "text-gray-300 pointer-events-none" : ""
                        } ${isTodayDay && !endpoint ? "text-primary underline underline-offset-4" : ""}`}
                      >
                        {fmtDateFns(day, "d")}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="flex items-center justify-between px-5 py-4 border-t border-border bg-white">
              <button 
                onClick={() => { setDraft({ from: null, to: null }); setSelecting("from"); }} 
                className="text-[1rem] text-primary underline underline-offset-4 hover:text-primary/80" 
                style={{ fontWeight: 600 }}
              >
                Clear dates
              </button>
              <button 
                onClick={apply} 
                disabled={!draft.from || !draft.to} 
                className="px-6 py-3 rounded-xl bg-primary text-primary-foreground disabled:bg-gray-300 disabled:text-gray-500 transition-colors" 
                style={{ fontWeight: 700, fontSize: "1rem" }}
              >
                Save
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

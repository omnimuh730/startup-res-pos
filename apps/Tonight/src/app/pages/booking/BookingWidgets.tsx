/* Booking helper widgets: PreferenceSection, SlideToPayButton, DetailRow, CustomDatePickerModal, ConfettiEffect */
import { useState, useEffect, useRef, useCallback } from "react";
import { ArrowLeft, ChevronRight, Lock, ChevronsRight, Check } from "lucide-react";
import { Button } from "../../components/ds/Button";
import { DSBadge } from "../../components/ds/Badge";

export function PreferenceSection({ title, subtitle, options, selected, onToggle }: {
  title: string; subtitle: string; options: { id: string; label: string; emoji: string }[];
  selected: string[]; onToggle: (id: string) => void;
}) {
  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <h3 className="text-[0.9375rem]" style={{ fontWeight: 600 }}>{title}</h3>
        {selected.length > 0 && <DSBadge variant="soft" color="primary" size="sm">{selected.length}</DSBadge>}
      </div>
      <p className="text-[0.75rem] text-muted-foreground mb-3">{subtitle}</p>
      <div className="flex gap-2 flex-wrap">
        {options.map((o) => {
          const sel = selected.includes(o.id);
          return (
            <button key={o.id} onClick={() => onToggle(o.id)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-full cursor-pointer transition-all text-[0.8125rem] ${sel ? "bg-primary/15 border-primary border text-primary" : "bg-card border border-border hover:bg-secondary"}`}
              style={{ fontWeight: sel ? 600 : 400 }}>
              <span className="text-[0.875rem]">{o.emoji}</span> {o.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export function SlideToPayButton({ amount, onComplete }: { amount: number; onComplete: () => void }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [dragX, setDragX] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [completed, setCompleted] = useState(false);
  const THUMB_SIZE = 52; const THRESHOLD = 0.85;

  const getMaxX = useCallback(() => {
    if (!trackRef.current) return 200;
    return trackRef.current.offsetWidth - THUMB_SIZE - 8;
  }, []);

  const handleMove = useCallback((clientX: number) => {
    if (!isDragging || completed) return;
    const track = trackRef.current; if (!track) return;
    const rect = track.getBoundingClientRect();
    const x = clientX - rect.left - THUMB_SIZE / 2 - 4;
    setDragX(Math.max(0, Math.min(x, getMaxX())));
  }, [isDragging, completed, getMaxX]);

  const handleEnd = useCallback(() => {
    if (!isDragging || completed) return;
    setIsDragging(false);
    const maxX = getMaxX();
    if (dragX / maxX >= THRESHOLD) { setDragX(maxX); setCompleted(true); onComplete(); }
    else setDragX(0);
  }, [isDragging, completed, dragX, getMaxX, onComplete]);

  useEffect(() => {
    if (!isDragging) return;
    const onMv = (e: MouseEvent) => handleMove(e.clientX);
    const onUp = () => handleEnd();
    const onTm = (e: TouchEvent) => handleMove(e.touches[0].clientX);
    const onTe = () => handleEnd();
    window.addEventListener("mousemove", onMv); window.addEventListener("mouseup", onUp);
    window.addEventListener("touchmove", onTm, { passive: true }); window.addEventListener("touchend", onTe);
    return () => { window.removeEventListener("mousemove", onMv); window.removeEventListener("mouseup", onUp); window.removeEventListener("touchmove", onTm); window.removeEventListener("touchend", onTe); };
  }, [isDragging, handleMove, handleEnd]);

  const maxX = getMaxX(); const progress = maxX > 0 ? dragX / maxX : 0;
  return (
    <div ref={trackRef} className="relative w-full h-14 rounded-2xl bg-secondary overflow-hidden select-none">
      <div className="absolute inset-y-0 left-0 rounded-2xl bg-primary/20" style={{ width: `${progress * 100}%`, transition: isDragging ? "none" : "width 0.3s ease-out" }} />
      <div className="absolute inset-0 flex items-center justify-center gap-2 pointer-events-none" style={{ opacity: 1 - progress * 1.5 }}>
        <Lock className="w-4 h-4 text-muted-foreground" />
        <span className="text-[0.875rem] text-muted-foreground" style={{ fontWeight: 500 }}>Slide to Pay · ${amount.toFixed(2)}</span>
      </div>
      <div className="absolute top-1 w-12 h-12 rounded-xl bg-primary text-primary-foreground flex items-center justify-center cursor-grab active:cursor-grabbing shadow-lg"
        style={{ left: dragX + 4, transition: isDragging ? "none" : "left 0.3s ease-out" }}
        onMouseDown={(e) => { e.preventDefault(); setIsDragging(true); }} onTouchStart={() => setIsDragging(true)}>
        <ChevronsRight className="w-5 h-5" />
      </div>
    </div>
  );
}

export function DetailRow({ icon, label, value }: { icon?: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <span className="flex items-center gap-2 text-[0.8125rem] text-muted-foreground">{icon} {label}</span>
      <span className="text-[0.8125rem]" style={{ fontWeight: 600 }}>{value}</span>
    </div>
  );
}

export function CustomDatePickerModal({ value, onSelect, onClose }: { value: Date | null; onSelect: (d: Date) => void; onClose: () => void }) {
  const today = new Date();
  const [viewMonth, setViewMonth] = useState(() => value || today);
  const [selected, setSelected] = useState<Date | null>(value);
  const year = viewMonth.getFullYear(); const month = viewMonth.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const isDisabled = (day: number) => { const d = new Date(year, month, day); const ts = new Date(today.getFullYear(), today.getMonth(), today.getDate()); return d < ts; };
  const isSameDay = (d: Date, day: number) => d.getFullYear() === year && d.getMonth() === month && d.getDate() === day;

  return (
    <div className="fixed inset-0 z-[400] flex items-center justify-center bg-black/50" onClick={onClose}>
      <div className="bg-background rounded-2xl p-5 w-[20rem] shadow-xl" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-4">
          <button onClick={() => setViewMonth(new Date(year, month - 1, 1))} className="p-1.5 rounded-full hover:bg-secondary cursor-pointer transition"><ArrowLeft className="w-4 h-4" /></button>
          <span className="text-[0.9375rem]" style={{ fontWeight: 600 }}>{viewMonth.toLocaleDateString("en", { month: "long", year: "numeric" })}</span>
          <button onClick={() => setViewMonth(new Date(year, month + 1, 1))} className="p-1.5 rounded-full hover:bg-secondary cursor-pointer transition"><ChevronRight className="w-4 h-4" /></button>
        </div>
        <div className="grid grid-cols-7 gap-1 text-center mb-2">
          {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((d) => <span key={d} className="text-[0.6875rem] text-muted-foreground" style={{ fontWeight: 500 }}>{d}</span>)}
        </div>
        <div className="grid grid-cols-7 gap-1">
          {Array.from({ length: firstDay }).map((_, i) => <div key={`e-${i}`} />)}
          {Array.from({ length: daysInMonth }).map((_, i) => {
            const day = i + 1; const disabled = isDisabled(day);
            const sel = selected && isSameDay(selected, day); const isT = isSameDay(today, day);
            return (
              <button key={day} disabled={disabled} onClick={() => setSelected(new Date(year, month, day))}
                className={`w-9 h-9 rounded-full text-[0.8125rem] transition cursor-pointer ${sel ? "bg-primary text-primary-foreground" : isT ? "border border-primary text-primary" : disabled ? "text-muted-foreground/30 cursor-not-allowed" : "hover:bg-secondary"}`}
                style={{ fontWeight: sel ? 600 : 400 }}>{day}</button>
            );
          })}
        </div>
        <div className="flex gap-2 mt-4">
          <Button variant="outline" className="flex-1" onClick={onClose}>Cancel</Button>
          <Button variant="primary" className="flex-1" disabled={!selected} onClick={() => selected && onSelect(selected)}>Select</Button>
        </div>
      </div>
    </div>
  );
}

export function ConfettiEffect() {
  const pieces = Array.from({ length: 40 }).map((_, i) => {
    const left = (i * 37 + 13) % 100; const delay = (i * 71) % 2000;
    const duration = 2000 + (i * 53) % 1500;
    const colors = ["bg-primary", "bg-success", "bg-warning", "bg-info", "bg-destructive"];
    const color = colors[i % colors.length]; const size = 4 + (i % 4) * 2;
    return <div key={i} className={`absolute ${color} rounded-sm opacity-0`} style={{ left: `${left}%`, top: -10, width: size, height: size, animation: `confettiFall ${duration}ms ${delay}ms ease-out forwards` }} />;
  });
  return (
    <>
      <style>{`@keyframes confettiFall { 0% { opacity: 1; transform: translateY(0) rotate(0deg); } 100% { opacity: 0; transform: translateY(60vh) rotate(720deg); } }`}</style>
      <div className="fixed inset-0 z-[500] pointer-events-none overflow-hidden">{pieces}</div>
    </>
  );
}

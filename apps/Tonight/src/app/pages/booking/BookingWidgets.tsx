/* Booking helper widgets */
import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { motion } from "motion/react";
import { ArrowLeft, Check, ChevronRight, ChevronsRight, Lock } from "lucide-react";
import { Button } from "../../components/ds/Button";

export function PreferenceSection({
  title,
  subtitle,
  options,
  selected,
  onToggle,
}: {
  title: string;
  subtitle: string;
  options: { id: string; label: string; emoji: string }[];
  selected: string[];
  onToggle: (id: string) => void;
}) {
  return (
    <section>
      <div className="mb-3 flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="text-[1rem] text-foreground" style={{ fontWeight: 900 }}>{title}</h3>
          <p className="mt-0.5 text-[0.8125rem] text-muted-foreground">{subtitle}</p>
        </div>
        {selected.length > 0 && (
          <span className="rounded-full bg-primary px-2.5 py-1 text-[0.6875rem] text-primary-foreground" style={{ fontWeight: 900 }}>
            {selected.length}
          </span>
        )}
      </div>
      <div className="flex flex-wrap gap-2">
        {options.map((option) => {
          const isSelected = selected.includes(option.id);
          return (
            <motion.button
              key={option.id}
              type="button"
              whileTap={{ scale: 0.96 }}
              onClick={() => onToggle(option.id)}
              className={`inline-flex h-9 cursor-pointer items-center gap-1.5 rounded-full border px-3 text-[0.8125rem] transition ${
                isSelected ? "border-primary bg-primary text-primary-foreground shadow-[0_8px_18px_rgba(255,56,92,0.2)]" : "border-border bg-card text-foreground hover:bg-secondary"
              }`}
              style={{ fontWeight: 800 }}
            >
              {option.emoji && <span>{option.emoji}</span>}
              {option.label}
            </motion.button>
          );
        })}
      </div>
    </section>
  );
}

export function SlideToPayButton({ amount, onComplete }: { amount: number; onComplete: () => void }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [dragX, setDragX] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [completed, setCompleted] = useState(false);
  const THUMB_SIZE = 52;
  const THRESHOLD = 0.85;

  const getMaxX = useCallback(() => {
    if (!trackRef.current) return 200;
    return trackRef.current.offsetWidth - THUMB_SIZE - 8;
  }, []);

  const handleMove = useCallback((clientX: number) => {
    if (!isDragging || completed) return;
    const track = trackRef.current;
    if (!track) return;
    const rect = track.getBoundingClientRect();
    const x = clientX - rect.left - THUMB_SIZE / 2 - 4;
    setDragX(Math.max(0, Math.min(x, getMaxX())));
  }, [completed, getMaxX, isDragging]);

  const handleEnd = useCallback(() => {
    if (!isDragging || completed) return;
    setIsDragging(false);
    const maxX = getMaxX();
    if (dragX / maxX >= THRESHOLD) {
      setDragX(maxX);
      setCompleted(true);
      onComplete();
    } else {
      setDragX(0);
    }
  }, [completed, dragX, getMaxX, isDragging, onComplete]);

  useEffect(() => {
    if (!isDragging) return undefined;
    const onMove = (event: MouseEvent) => handleMove(event.clientX);
    const onUp = () => handleEnd();
    const onTouchMove = (event: TouchEvent) => handleMove(event.touches[0].clientX);
    const onTouchEnd = () => handleEnd();
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
    window.addEventListener("touchmove", onTouchMove, { passive: true });
    window.addEventListener("touchend", onTouchEnd);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("touchend", onTouchEnd);
    };
  }, [handleEnd, handleMove, isDragging]);

  const maxX = getMaxX();
  const progress = maxX > 0 ? dragX / maxX : 0;

  return (
    <div ref={trackRef} className="relative h-14 w-full select-none overflow-hidden rounded-full bg-secondary">
      <div className="absolute inset-y-0 left-0 rounded-full bg-primary/18" style={{ width: `${progress * 100}%`, transition: isDragging ? "none" : "width 0.3s ease-out" }} />
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center gap-2" style={{ opacity: 1 - progress * 1.5 }}>
        <Lock className="h-4 w-4 text-muted-foreground" />
        <span className="text-[0.875rem] text-muted-foreground" style={{ fontWeight: 800 }}>Slide to pay - ${amount.toFixed(2)}</span>
      </div>
      <div
        className="absolute top-1 flex h-12 w-12 cursor-grab items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg active:cursor-grabbing"
        style={{ left: dragX + 4, transition: isDragging ? "none" : "left 0.3s ease-out" }}
        onMouseDown={(event) => { event.preventDefault(); setIsDragging(true); }}
        onTouchStart={() => setIsDragging(true)}
      >
        {completed ? <Check className="h-5 w-5" /> : <ChevronsRight className="h-5 w-5" />}
      </div>
    </div>
  );
}

export function DetailRow({ icon, label, value }: { icon?: ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-[1rem] bg-secondary/60 px-3 py-2.5">
      <span className="flex min-w-0 items-center gap-2 text-[0.8125rem] text-muted-foreground">
        {icon}
        {label}
      </span>
      <span className="truncate text-right text-[0.8125rem]" style={{ fontWeight: 800 }}>{value}</span>
    </div>
  );
}

export function CustomDatePickerModal({
  value,
  onSelect,
  onClose,
}: {
  value: Date | null;
  onSelect: (date: Date) => void;
  onClose: () => void;
}) {
  const today = new Date();
  const [viewMonth, setViewMonth] = useState(() => value || today);
  const [selected, setSelected] = useState<Date | null>(value);
  const year = viewMonth.getFullYear();
  const month = viewMonth.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const isDisabled = (day: number) => {
    const date = new Date(year, month, day);
    const startToday = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    return date < startToday;
  };
  const isSameDay = (date: Date, day: number) => date.getFullYear() === year && date.getMonth() === month && date.getDate() === day;

  return (
    <div className="fixed inset-0 z-[500] flex items-end justify-center bg-black/45 p-0 backdrop-blur-sm sm:items-center sm:p-4" onClick={onClose}>
      <motion.div
        initial={{ opacity: 0, y: 70, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 70, scale: 0.97 }}
        className="w-full max-w-sm rounded-t-[2rem] bg-card p-5 shadow-[0_18px_50px_rgba(0,0,0,0.18)] sm:rounded-[2rem]"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="mx-auto mb-4 h-1 w-10 rounded-full bg-border sm:hidden" />
        <div className="mb-4 flex items-center justify-between">
          <button type="button" onClick={() => setViewMonth(new Date(year, month - 1, 1))} className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-full bg-secondary transition active:scale-95" aria-label="Previous month">
            <ArrowLeft className="h-4 w-4" />
          </button>
          <span className="text-[0.9375rem]" style={{ fontWeight: 900 }}>{viewMonth.toLocaleDateString("en", { month: "long", year: "numeric" })}</span>
          <button type="button" onClick={() => setViewMonth(new Date(year, month + 1, 1))} className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-full bg-secondary transition active:scale-95" aria-label="Next month">
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
        <div className="mb-2 grid grid-cols-7 gap-1 text-center">
          {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((day) => <span key={day} className="text-[0.6875rem] text-muted-foreground" style={{ fontWeight: 800 }}>{day}</span>)}
        </div>
        <div className="grid grid-cols-7 gap-1">
          {Array.from({ length: firstDay }).map((_, index) => <div key={`empty-${index}`} />)}
          {Array.from({ length: daysInMonth }).map((_, index) => {
            const day = index + 1;
            const disabled = isDisabled(day);
            const isSelected = selected && isSameDay(selected, day);
            const isToday = isSameDay(today, day);
            return (
              <button
                key={day}
                type="button"
                disabled={disabled}
                onClick={() => setSelected(new Date(year, month, day))}
                className={`h-9 rounded-full text-[0.8125rem] transition ${
                  isSelected ? "bg-primary text-primary-foreground" : isToday ? "border border-primary text-primary" : disabled ? "cursor-not-allowed text-muted-foreground/30" : "hover:bg-secondary"
                }`}
                style={{ fontWeight: isSelected ? 900 : 700 }}
              >
                {day}
              </button>
            );
          })}
        </div>
        <div className="mt-5 grid grid-cols-2 gap-2">
          <Button variant="outline" radius="full" className="font-bold" onClick={onClose}>Cancel</Button>
          <Button variant="primary" radius="full" className="font-bold" disabled={!selected} onClick={() => selected && onSelect(selected)}>Select</Button>
        </div>
      </motion.div>
    </div>
  );
}

export function ConfettiEffect() {
  const pieces = Array.from({ length: 42 }).map((_, index) => {
    const left = (index * 37 + 13) % 100;
    const delay = (index * 71) % 1400;
    const duration = 1900 + (index * 53) % 1200;
    const colors = ["bg-primary", "bg-success", "bg-warning", "bg-info"];
    const color = colors[index % colors.length];
    const size = 4 + (index % 4) * 2;
    return <div key={index} className={`absolute ${color} rounded-sm opacity-0`} style={{ left: `${left}%`, top: -10, width: size, height: size, animation: `confettiFall ${duration}ms ${delay}ms ease-out forwards` }} />;
  });
  return (
    <>
      <style>{`@keyframes confettiFall { 0% { opacity: 1; transform: translateY(0) rotate(0deg); } 100% { opacity: 0; transform: translateY(60vh) rotate(720deg); } }`}</style>
      <div className="pointer-events-none fixed inset-0 z-[501] overflow-hidden">{pieces}</div>
    </>
  );
}

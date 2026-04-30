/* ScanQR helper widgets: StepProgressBar, QRCodeVisual, SlideToPay, ConfettiEffect */
import { useState, useRef, useEffect, useCallback } from "react";
import { Check, ChevronRight, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { STEPS, type ScanStep } from "./scanQRData";

export function StepProgressBar({ currentStep, complete = false }: { currentStep: ScanStep; complete?: boolean }) {
  const currentIdx = STEPS.findIndex(s => s.id === currentStep);
  return (
    <div className="w-full">
      <div className="mb-2 flex items-center justify-between">
        <span className="text-[0.75rem] text-muted-foreground" style={{ fontWeight: 800 }}>Progress</span>
        <span className="text-[0.75rem] text-primary" style={{ fontWeight: 900 }}>{complete ? "Complete" : STEPS[currentIdx]?.label}</span>
      </div>
      <div className="flex items-center gap-1.5">
      {STEPS.map((step, i) => {
        const completed = complete || i < currentIdx; const active = !complete && i === currentIdx;
        return (
          <div key={step.id} className="flex-1">
            <div className={`h-1.5 w-full overflow-hidden rounded-full transition-colors duration-300 ${completed ? "bg-success" : active ? "bg-primary/22" : "bg-border/70"}`}>
              {active && (
                <motion.div
                  layoutId="active-step-progress"
                  className="h-full rounded-full bg-primary"
                  initial={{ width: "25%" }}
                  animate={{ width: "68%" }}
                  transition={{ duration: 0.6, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }}
                />
              )}
            </div>
            <span className={`mt-1 block truncate text-center text-[0.625rem] transition-colors ${completed ? "text-success" : active ? "text-primary" : "text-muted-foreground/45"}`} style={{ fontWeight: active || completed ? 800 : 500 }}>{step.label}</span>
          </div>
        );
      })}
      </div>
    </div>
  );
}

export function QRCodeVisual({ active = true }: { active?: boolean }) {
  const pattern = useRef(
    Array.from({ length: 21 }, (_, r) =>
      Array.from({ length: 21 }, (_, c) => {
        if ((r < 7 && c < 7) || (r < 7 && c > 13) || (r > 13 && c < 7)) {
          if (r === 0 || r === 6 || c === 0 || c === 6 || (r >= 2 && r <= 4 && c >= 2 && c <= 4) || (r === 0 || r === 6) || (c > 13 && (c === 14 || c === 20)) || (r > 13 && (r === 14 || r === 20))) return true;
          if ((r === 0 || r === 6 || c === 0 || c === 6)) return true;
          if (r >= 2 && r <= 4 && c >= 2 && c <= 4) return true;
          if (r < 7 && c > 13) { if (c === 14 || c === 20 || r === 0 || r === 6) return true; if (r >= 2 && r <= 4 && c >= 16 && c <= 18) return true; }
          if (r > 13 && c < 7) { if (r === 14 || r === 20 || c === 0 || c === 6) return true; if (r >= 16 && r <= 18 && c >= 2 && c <= 4) return true; }
          return false;
        }
        return ((r * 7 + c * 13 + r * c) % 3) === 0;
      })
    )
  ).current;
  return (
    <div className="relative mx-auto h-52 w-52 overflow-hidden rounded-[1.5rem] bg-white p-4 shadow-[0_10px_30px_rgba(0,0,0,0.08)]">
      <div className="absolute left-2 top-2 h-8 w-8 rounded-tl-[1rem] border-l-2 border-t-2 border-primary" />
      <div className="absolute right-2 top-2 h-8 w-8 rounded-tr-[1rem] border-r-2 border-t-2 border-primary" />
      <div className="absolute bottom-2 left-2 h-8 w-8 rounded-bl-[1rem] border-b-2 border-l-2 border-primary" />
      <div className="absolute bottom-2 right-2 h-8 w-8 rounded-br-[1rem] border-b-2 border-r-2 border-primary" />
      <div className="grid grid-cols-[repeat(21,1fr)] gap-[1px] w-full h-full">
        {pattern.flat().map((filled, i) => <div key={i} className={`rounded-[1px] ${filled ? "bg-foreground/80" : "bg-transparent"}`} />)}
      </div>
      {active && (
        <motion.div
          className="absolute inset-x-4 h-9 rounded-full bg-primary/12 blur-sm"
          initial={{ top: 18 }}
          animate={{ top: [18, 170, 18] }}
          transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
        />
      )}
    </div>
  );
}

export function SlideToPay({ amount, onComplete }: { amount: string; onComplete: () => void }) {
  const [dragX, setDragX] = useState(0);
  const [completed, setCompleted] = useState(false);
  const trackRef = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);
  const startX = useRef(0);
  const [trackWidth, setTrackWidth] = useState(280);

  useEffect(() => { if (trackRef.current) setTrackWidth(trackRef.current.offsetWidth - 56); }, []);
  const progress = Math.min(dragX / trackWidth, 1);
  const handleStart = (clientX: number) => { if (completed) return; dragging.current = true; startX.current = clientX - dragX; };
  const handleMove = useCallback((clientX: number) => { if (!dragging.current) return; setDragX(Math.max(0, Math.min(clientX - startX.current, trackWidth))); }, [trackWidth]);
  const handleEnd = useCallback(() => { dragging.current = false; if (dragX > trackWidth * 0.7) { setDragX(trackWidth); setCompleted(true); setTimeout(onComplete, 800); } else setDragX(0); }, [dragX, onComplete, trackWidth]);

  useEffect(() => {
    const moveH = (e: MouseEvent | TouchEvent) => { const cx = "touches" in e ? e.touches[0].clientX : e.clientX; handleMove(cx); };
    const upH = () => handleEnd();
    window.addEventListener("mousemove", moveH); window.addEventListener("mouseup", upH);
    window.addEventListener("touchmove", moveH); window.addEventListener("touchend", upH);
    return () => { window.removeEventListener("mousemove", moveH); window.removeEventListener("mouseup", upH); window.removeEventListener("touchmove", moveH); window.removeEventListener("touchend", upH); };
  }, [handleMove, handleEnd]);

  return (
    <div className="relative">
      <div ref={trackRef} className="relative h-16 rounded-full overflow-hidden select-none"
        style={{ background: completed ? "var(--success)" : `linear-gradient(90deg, color-mix(in srgb, var(--primary) ${Math.round(progress * 40)}%, var(--secondary)) 0%, var(--secondary) 100%)`, transition: completed ? "background 0.5s ease" : undefined }}>
        {!completed && <div className="absolute inset-0 overflow-hidden" style={{ opacity: 1 - progress * 0.8 }}><div className="absolute inset-0" style={{ background: "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.06) 50%, transparent 100%)", animation: "slideShimmer 2.5s ease-in-out infinite" }} /></div>}
        {!completed && progress > 0 && <div className="absolute top-0 left-0 bottom-0 rounded-full" style={{ width: `${progress * 100}%`, background: `linear-gradient(90deg, color-mix(in srgb, var(--primary) 15%, transparent), color-mix(in srgb, var(--primary) 8%, transparent))`, transition: dragging.current ? "none" : "width 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)" }} />}
        <AnimatePresence mode="wait">
          {!completed ? (
            <motion.div key="label" className="absolute inset-0 flex items-center justify-center gap-2.5" initial={{ opacity: 1 }} exit={{ opacity: 0, scale: 0.9 }} transition={{ duration: 0.2 }}>
              <span className="text-[1rem] text-muted-foreground" style={{ opacity: 1 - progress * 1.5, fontWeight: 500 }}>Slide to Pay - {amount}</span>
            </motion.div>
          ) : (
            <motion.div key="done" className="absolute inset-0 flex items-center justify-center gap-2.5 text-white" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.4, ease: [0.34, 1.56, 0.64, 1] }}>
              <motion.div initial={{ scale: 0, rotate: -180 }} animate={{ scale: 1, rotate: 0 }} transition={{ duration: 0.5, delay: 0.1, ease: [0.34, 1.56, 0.64, 1] }}><Check className="w-6 h-6" /></motion.div>
              <span className="text-[1.0625rem]" style={{ fontWeight: 600 }}>Payment Complete!</span>
            </motion.div>
          )}
        </AnimatePresence>
        {!completed && (
          <div className="absolute top-2 left-2 w-12 h-12 rounded-full cursor-grab active:cursor-grabbing z-10"
            style={{ transform: `translateX(${dragX}px)`, transition: dragging.current ? "none" : "transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)" }}
            onMouseDown={e => handleStart(e.clientX)} onTouchStart={e => handleStart(e.touches[0].clientX)}>
            <div className="absolute -inset-1 rounded-full bg-primary/20" style={{ opacity: progress > 0 ? 0.3 + progress * 0.7 : 0, transform: `scale(${1 + progress * 0.3})`, transition: "all 0.2s ease" }} />
            <div className="relative w-full h-full rounded-full bg-primary flex items-center justify-center shadow-lg" style={{ boxShadow: `0 4px 15px color-mix(in srgb, var(--primary) ${Math.round(30 + progress * 40)}%, transparent)` }}>
              <motion.div animate={{ x: [0, 3, 0] }} transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}><ChevronRight className="w-5 h-5 text-primary-foreground" /></motion.div>
            </div>
          </div>
        )}
        {completed && <motion.div className="absolute inset-0 rounded-full bg-white/20" initial={{ scale: 0, opacity: 0.5 }} animate={{ scale: 3, opacity: 0 }} transition={{ duration: 0.8, ease: "easeOut" }} style={{ transformOrigin: "right center" }} />}
      </div>
      <style>{`@keyframes slideShimmer { 0% { transform: translateX(-100%); } 100% { transform: translateX(200%); } }`}</style>
    </div>
  );
}

export function ConfettiEffect() {
  const COLORS = ["var(--primary)", "var(--success)", "var(--warning)", "var(--info)", "#f472b6", "#a78bfa", "#fbbf24", "#34d399"];
  const SHAPES = ["circle", "rect", "star"] as const;
  const particles = useRef(Array.from({ length: 60 }, (_, i) => ({ id: i, x: 20 + Math.random() * 60, color: COLORS[i % COLORS.length], shape: SHAPES[i % SHAPES.length], size: Math.random() * 8 + 4, delay: Math.random() * 0.8, duration: Math.random() * 2 + 2, drift: (Math.random() - 0.5) * 120, rotation: Math.random() * 720, opacity: 0.7 + Math.random() * 0.3 }))).current;
  const sparkles = useRef(Array.from({ length: 20 }, (_, i) => ({ id: i + 100, x: 10 + Math.random() * 80, y: 10 + Math.random() * 60, delay: Math.random() * 1.5, size: Math.random() * 3 + 2 }))).current;

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-[501]">
      {particles.map(p => (
        <motion.div key={p.id} initial={{ x: `${p.x}vw`, y: "-5vh", rotate: 0, scale: 0, opacity: 0 }} animate={{ y: "110vh", x: `${p.x + p.drift / 3}vw`, rotate: p.rotation, scale: [0, 1.2, 1, 0.8], opacity: [0, p.opacity, p.opacity, 0] }} transition={{ duration: p.duration, delay: p.delay, ease: [0.25, 0.46, 0.45, 0.94] }} style={{ position: "absolute" }}>
          {p.shape === "circle" && <div className="rounded-full" style={{ width: p.size, height: p.size, background: p.color }} />}
          {p.shape === "rect" && <div className="rounded-sm" style={{ width: p.size, height: p.size * 0.6, background: p.color }} />}
          {p.shape === "star" && <svg width={p.size * 1.5} height={p.size * 1.5} viewBox="0 0 20 20"><polygon points="10,0 12.5,7 20,7.5 14,12.5 16,20 10,15.5 4,20 6,12.5 0,7.5 7.5,7" fill={p.color} /></svg>}
        </motion.div>
      ))}
      {sparkles.map(s => (
        <motion.div key={s.id} className="absolute" style={{ left: `${s.x}%`, top: `${s.y}%` }} initial={{ scale: 0, opacity: 0 }} animate={{ scale: [0, 1.5, 0], opacity: [0, 1, 0] }} transition={{ duration: 0.6, delay: s.delay, ease: "easeOut" }}>
          <Sparkles className="text-warning" style={{ width: s.size * 5, height: s.size * 5 }} />
        </motion.div>
      ))}
      <motion.div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-primary/30" initial={{ width: 0, height: 0, opacity: 1 }} animate={{ width: 400, height: 400, opacity: 0 }} transition={{ duration: 1.2, ease: "easeOut", delay: 0.1 }} />
      <motion.div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-success/20" initial={{ width: 0, height: 0, opacity: 1 }} animate={{ width: 600, height: 600, opacity: 0 }} transition={{ duration: 1.5, ease: "easeOut", delay: 0.3 }} />
    </div>
  );
}

/* Explorer sub-components: ActionBtn, FilterChip, FilterSection, FilterBarChip, useSwipeable, useIsDarkTheme */
import { useRef, useEffect, useState } from "react";
import { ChevronDown, Loader2 } from "lucide-react";

export function useIsDarkTheme() {
  const [isDark, setIsDark] = useState(false);
  useEffect(() => {
    const check = () => {
      if (document.documentElement.classList.contains("dark")) { setIsDark(true); return; }
      const bg = getComputedStyle(document.documentElement).getPropertyValue("--background").trim();
      if (bg) {
        const oklchMatch = bg.match(/oklch\(([\d.]+)/);
        if (oklchMatch && parseFloat(oklchMatch[1]) < 0.3) { setIsDark(true); return; }
        if (bg.startsWith("#")) {
          const hex = bg.replace("#", "");
          const r = parseInt(hex.substring(0, 2), 16);
          const g = parseInt(hex.substring(2, 4), 16);
          const b = parseInt(hex.substring(4, 6), 16);
          if ((0.299 * r + 0.587 * g + 0.114 * b) / 255 < 0.35) { setIsDark(true); return; }
        }
      }
      setIsDark(false);
    };
    check();
    const obs = new MutationObserver(check);
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ["class", "style"] });
    return () => obs.disconnect();
  }, []);
  return isDark;
}

export function useSwipeable(ref: React.RefObject<HTMLDivElement | null>) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let isDown = false;
    let startX = 0;
    let scrollLeft = 0;
    const onDown = (e: MouseEvent) => { isDown = true; el.style.cursor = "grabbing"; startX = e.pageX - el.offsetLeft; scrollLeft = el.scrollLeft; };
    const onLeave = () => { isDown = false; el.style.cursor = "grab"; };
    const onUp = () => { isDown = false; el.style.cursor = "grab"; };
    const onMove = (e: MouseEvent) => { if (!isDown) return; e.preventDefault(); el.scrollLeft = scrollLeft - (e.pageX - el.offsetLeft - startX); };
    el.style.cursor = "grab";
    el.addEventListener("mousedown", onDown);
    el.addEventListener("mouseleave", onLeave);
    el.addEventListener("mouseup", onUp);
    el.addEventListener("mousemove", onMove);
    return () => { el.removeEventListener("mousedown", onDown); el.removeEventListener("mouseleave", onLeave); el.removeEventListener("mouseup", onUp); el.removeEventListener("mousemove", onMove); };
  }, [ref]);
}

export function ActionBtn({ icon, label, onClick, loading }: { icon: React.ReactNode; label: string; onClick?: () => void; loading?: boolean }) {
  return (
    <button onClick={onClick} disabled={loading} className={`flex flex-col items-center gap-1.5 py-3 rounded-xl bg-primary/10 hover:bg-primary/20 transition cursor-pointer ${loading ? "opacity-70 pointer-events-none" : ""}`}>
      <span className="text-primary">{loading ? <Loader2 className="w-5 h-5 animate-spin" /> : icon}</span>
      <span className="text-[0.75rem] text-primary" style={{ fontWeight: 500 }}>{label}</span>
    </button>
  );
}

export function FilterChip({ label, emoji, selected, onClick }: { label: string; emoji?: string; selected: boolean; onClick: () => void }) {
  return (
    <button onClick={onClick} className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-full text-[0.8125rem] whitespace-nowrap transition-all cursor-pointer ${selected ? "bg-primary text-primary-foreground" : "bg-secondary text-foreground hover:bg-secondary/80"}`}>
      {emoji && <span className="text-[0.875rem]">{emoji}</span>}
      {label}
    </button>
  );
}

export function FilterSection({ title, children }: { title?: string; children: React.ReactNode }) {
  return (
    <div className={title ? "border-b border-border pb-5 last:border-0" : ""}>
      {title && <h4 className="text-[0.9375rem] mb-3" style={{ fontWeight: 600 }}>{title}</h4>}
      {children}
    </div>
  );
}

export function FilterBarChip({ label, hasChevron, active, onClick }: { label: string; hasChevron?: boolean; active?: boolean; onClick: () => void }) {
  return (
    <button onClick={onClick} className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-[0.8125rem] whitespace-nowrap transition-all cursor-pointer shrink-0 ${active ? "bg-primary text-primary-foreground" : "bg-secondary text-foreground hover:bg-secondary/80"}`}>
      {label}
      {hasChevron && <ChevronDown className="w-3.5 h-3.5" />}
    </button>
  );
}
/* Category Results Page (12 Quick Categories) with date picker */
import { useState } from "react";
import { ArrowLeft, Star, ChevronRight, CalendarDays, Users } from "lucide-react";
import { ImageWithFallback } from "../../components/figma/ImageWithFallback";
import { DragScrollContainer } from "../shared/DragScrollContainer";
import { CategoryIcon } from "./CategoryIcon";
import { CATEGORY_RESTAURANTS, getTimeSlots } from "./discoverCategoryData";
import { fmtR } from "./discoverTypes";
import type { RestaurantData } from "../detail/RestaurantDetailView";

function CategoryDatePickerModal({ value, onSelect, onClose }: {
  value: Date | null; onSelect: (d: Date) => void; onClose: () => void;
}) {
  const today = new Date();
  const [viewMonth, setViewMonth] = useState(() => value || today);
  const [selected, setSelected] = useState<Date | null>(value);
  const year = viewMonth.getFullYear();
  const month = viewMonth.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const isDisabled = (day: number) => {
    const d = new Date(year, month, day);
    const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    return d < todayStart;
  };
  const isSameDay = (d: Date, day: number) =>
    d.getFullYear() === year && d.getMonth() === month && d.getDate() === day;
  return (
    <div className="fixed inset-0 z-[400] flex items-center justify-center bg-black/50" onClick={onClose}>
      <div className="bg-background rounded-2xl p-5 w-[20rem] shadow-xl" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-4">
          <button onClick={() => setViewMonth(new Date(year, month - 1, 1))} className="p-1.5 rounded-full hover:bg-secondary cursor-pointer transition"><ArrowLeft className="w-4 h-4" /></button>
          <span className="text-[0.9375rem]" style={{ fontWeight: 600 }}>{viewMonth.toLocaleDateString("en", { month: "long", year: "numeric" })}</span>
          <button onClick={() => setViewMonth(new Date(year, month + 1, 1))} className="p-1.5 rounded-full hover:bg-secondary cursor-pointer transition"><ChevronRight className="w-4 h-4" /></button>
        </div>
        <div className="grid grid-cols-7 gap-1 text-center mb-2">
          {["Su","Mo","Tu","We","Th","Fr","Sa"].map((d) => (
            <span key={d} className="text-[0.6875rem] text-muted-foreground" style={{ fontWeight: 500 }}>{d}</span>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-1">
          {Array.from({ length: firstDay }).map((_, i) => <div key={`e-${i}`} />)}
          {Array.from({ length: daysInMonth }).map((_, i) => {
            const day = i + 1;
            const disabled = isDisabled(day);
            const sel = selected && isSameDay(selected, day);
            const isTodayDay = isSameDay(today, day);
            return (
              <button key={day} disabled={disabled} onClick={() => setSelected(new Date(year, month, day))}
                className={`w-9 h-9 rounded-full text-[0.8125rem] transition cursor-pointer ${
                  sel ? "bg-primary text-primary-foreground" :
                  isTodayDay ? "border border-primary text-primary" :
                  disabled ? "text-muted-foreground/30 cursor-not-allowed" : "hover:bg-secondary"
                }`} style={{ fontWeight: sel ? 600 : 400 }}>{day}</button>
            );
          })}
        </div>
        <div className="flex gap-2 mt-4">
          <button onClick={onClose} className="flex-1 py-2.5 rounded-xl border border-border text-[0.875rem] cursor-pointer hover:bg-secondary transition">Cancel</button>
          <button disabled={!selected} onClick={() => selected && onSelect(selected)}
            className="flex-1 py-2.5 rounded-xl bg-primary text-primary-foreground text-[0.875rem] cursor-pointer disabled:opacity-40 transition"
            style={{ fontWeight: 600 }}>Select</button>
        </div>
      </div>
    </div>
  );
}

export function CategoryResultsView({ category, onBack, onSelectRestaurant, onBookTable }: {
  category: { id: string; label: string; icon?: string };
  onBack: () => void;
  onSelectRestaurant: (r: RestaurantData) => void;
  onBookTable: (r: RestaurantData) => void;
}) {
  const restaurants = CATEGORY_RESTAURANTS[category.id] || [];
  const [selectedDate, setSelectedDate] = useState(0);
  const [customDate, setCustomDate] = useState<Date | null>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);

  const dates = (() => {
    const d: { label: string; sub: string }[] = [];
    const now = new Date();
    for (let i = 0; i < 7; i++) {
      const dt = new Date(now); dt.setDate(now.getDate() + i);
      d.push({
        label: i === 0 ? "Today" : i === 1 ? "Tomorrow" : dt.toLocaleDateString("en", { weekday: "short" }),
        sub: dt.toLocaleDateString("en", { month: "short", day: "numeric" }),
      });
    }
    return d;
  })();

  const toRestaurantData = (r: typeof restaurants[0]): RestaurantData => ({
    id: r.id, name: r.name, cuisine: r.cuisine, emoji: r.emoji,
    rating: r.rating, reviews: r.reviews, price: r.price,
    lng: -122.41 + Math.random() * 0.03, lat: 37.78 + Math.random() * 0.03,
    open: true, distance: r.distance, image: r.image,
  });

  return (
    <div className="min-h-[calc(100vh-120px)]">
      <div className="sticky top-0 z-10 bg-background -mx-4 px-4 sm:-mx-6 sm:px-6 lg:-mx-4 lg:px-4 pb-3 pt-3 -mt-6">
        <div className="flex items-center gap-3 mb-4">
          <button onClick={onBack} className="p-1.5 hover:bg-secondary rounded-full transition cursor-pointer shrink-0">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2.5 flex-1">
            {category.icon ? <span className="text-[1.5rem]">{category.icon}</span> : <CategoryIcon id={category.id} className="w-8 h-8" />}
            <div>
              <h2 className="text-[1.125rem]" style={{ fontWeight: 700 }}>{category.label.replace("\n", " ")}</h2>
              <p className="text-[0.75rem] text-muted-foreground">{restaurants.length} restaurants</p>
            </div>
          </div>
        </div>
        <DragScrollContainer className="flex gap-2">
          {dates.map((d, i) => (
            <button key={i} onClick={() => { setCustomDate(null); setSelectedDate(i); }}
              className={`flex flex-col items-center px-3 py-2 rounded-xl text-center shrink-0 transition cursor-pointer ${
                !customDate && selectedDate === i ? "bg-primary text-primary-foreground" : "bg-secondary text-foreground hover:bg-secondary/80"
              }`}>
              <span className="text-[0.75rem]" style={{ fontWeight: 600 }}>{d.label}</span>
              <span className={`text-[0.6875rem] ${!customDate && selectedDate === i ? "text-primary-foreground/70" : "text-muted-foreground"}`}>{d.sub}</span>
            </button>
          ))}
          <button onClick={() => setShowDatePicker(true)}
            className={`flex flex-col items-center px-3 py-2 rounded-xl text-center shrink-0 transition cursor-pointer ${
              customDate ? "bg-primary text-primary-foreground" : "bg-secondary text-foreground hover:bg-secondary/80 border border-dashed border-border"
            }`}>
            <CalendarDays className="w-3.5 h-3.5 mb-0.5" />
            <span className="text-[0.6875rem]" style={{ fontWeight: 500 }}>
              {customDate ? `${customDate.toLocaleDateString("en", { month: "short" })} ${customDate.getDate()}` : "Pick Date"}
            </span>
          </button>
        </DragScrollContainer>
      </div>
      {showDatePicker && (
        <CategoryDatePickerModal value={customDate} onSelect={(d) => { setCustomDate(d); setShowDatePicker(false); }} onClose={() => setShowDatePicker(false)} />
      )}
      <div className="space-y-4">
        {restaurants.map((r) => {
          const slots = getTimeSlots(r.id + selectedDate);
          const rd = toRestaurantData(r);
          return (
            <div key={r.id} className="rounded-2xl border border-border bg-card overflow-hidden">
              <button onClick={() => onSelectRestaurant(rd)} className="w-full flex items-start gap-3 p-3 pb-2 text-left cursor-pointer hover:bg-secondary/20 transition">
                <div className="relative w-20 h-20 rounded-xl overflow-hidden shrink-0">
                  <ImageWithFallback src={r.image} alt={r.name} className="w-full h-full object-cover" />
                  {r.waitMin !== null && (
                    <div className="absolute bottom-0 left-0 right-0 bg-primary/90 text-primary-foreground text-[0.5625rem] text-center py-0.5" style={{ fontWeight: 600 }}>
                      <Users className="w-2.5 h-2.5 inline mr-0.5" />{r.waitMin}m wait
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[1rem]">{r.emoji}</span>
                    <p className="text-[0.9375rem] truncate" style={{ fontWeight: 600 }}>{r.name}</p>
                  </div>
                  <p className="text-[0.75rem] text-muted-foreground mt-0.5">{r.cuisine} · {r.price} · {r.distance}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="flex items-center gap-1 text-[0.75rem]"><Star className="w-3.5 h-3.5 fill-warning text-warning" /><span style={{ fontWeight: 600 }}>{fmtR(r.rating)}</span></span>
                    <span className="text-[0.6875rem] text-muted-foreground">({r.reviews.toLocaleString()})</span>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-muted-foreground shrink-0 mt-2" />
              </button>
              <div className="px-3 pb-3">
                <DragScrollContainer className="flex gap-1.5">
                  {slots.map((slot) => (
                    <button key={slot.time} onClick={(e) => { e.stopPropagation(); if (slot.open) onBookTable(rd); }} disabled={!slot.open}
                      className={`shrink-0 rounded-lg px-2.5 py-2 min-w-[3.5rem] text-center transition border ${
                        slot.open ? "bg-primary/10 border-primary/30 hover:bg-primary/20 cursor-pointer" : "bg-muted/40 border-border text-muted-foreground/40 cursor-not-allowed line-through"
                      }`}>
                      <span className={`text-[0.8125rem] ${slot.open ? "text-primary" : "text-muted-foreground/40"}`} style={{ fontWeight: 600 }}>{slot.time}</span>
                    </button>
                  ))}
                </DragScrollContainer>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

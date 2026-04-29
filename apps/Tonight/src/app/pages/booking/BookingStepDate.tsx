/* Step 1: Date/Time selection + Step 2: Details/Occasion */
import { CalendarDays, Clock, Users, Minus, Plus, Sparkles } from "lucide-react";
import { DragScrollContainer } from "../shared/DragScrollContainer";
import { TIME_SLOTS, DAYS, OCCASIONS } from "./bookingData";
import { CustomDatePickerModal } from "./BookingWidgets";

export function DateStep({ guests, setGuests, selectedDate, setSelectedDate, customDate, setCustomDate, selectedTime, setSelectedTime, showCustomDatePicker, setShowCustomDatePicker }: {
  guests: number; setGuests: (v: number) => void;
  selectedDate: number; setSelectedDate: (v: number) => void;
  customDate: Date | null; setCustomDate: (v: Date | null) => void;
  selectedTime: string | null; setSelectedTime: (v: string | null) => void;
  showCustomDatePicker: boolean; setShowCustomDatePicker: (v: boolean) => void;
}) {
  return (
    <div className="px-4 py-4 space-y-6">
      <div>
        <label className="text-[0.875rem] mb-3 block" style={{ fontWeight: 600 }}><Users className="w-4 h-4 inline mr-2" /> Number of Guests</label>
        <div className="flex items-center gap-4 justify-center py-3">
          <button onClick={() => setGuests(Math.max(1, guests - 1))} className="w-10 h-10 rounded-full border border-border flex items-center justify-center cursor-pointer hover:bg-secondary transition"><Minus className="w-4 h-4" /></button>
          <span className="text-[1.5rem] w-12 text-center" style={{ fontWeight: 700 }}>{guests}</span>
          <button onClick={() => setGuests(Math.min(20, guests + 1))} className="w-10 h-10 rounded-full border border-border flex items-center justify-center cursor-pointer hover:bg-secondary transition"><Plus className="w-4 h-4" /></button>
        </div>
      </div>
      <div>
        <label className="text-[0.875rem] mb-3 block" style={{ fontWeight: 600 }}><CalendarDays className="w-4 h-4 inline mr-2" /> Select Date</label>
        <div className="flex items-stretch gap-3">
          <DragScrollContainer className="flex gap-2 pb-1 flex-1 min-w-0">
            {DAYS.map((d, i) => (
              <button key={i} onClick={() => setSelectedDate(i)}
                className={`flex flex-col items-center px-3 py-2.5 rounded-xl shrink-0 cursor-pointer transition-all min-w-[4rem] ${selectedDate === i ? "bg-primary text-primary-foreground shadow-md" : "bg-card border border-border hover:bg-secondary"}`}>
                <span className="text-[0.6875rem]" style={{ fontWeight: 500 }}>{d.label}</span>
                <span className="text-[1.125rem] my-0.5" style={{ fontWeight: 700 }}>{d.date}</span>
                <span className="text-[0.6875rem]">{d.month}</span>
              </button>
            ))}
          </DragScrollContainer>
          <button onClick={() => { if (customDate) setSelectedDate(-1); else setShowCustomDatePicker(true); }}
            onDoubleClick={() => setShowCustomDatePicker(true)}
            className={`flex flex-col items-center justify-center px-3 py-2.5 mb-1 rounded-xl shrink-0 cursor-pointer transition-all min-w-[4rem] ${selectedDate === -1 && customDate ? "bg-primary text-primary-foreground shadow-md" : customDate ? "bg-card border border-border hover:bg-secondary" : "bg-card border border-dashed border-border hover:bg-secondary"}`}>
            <span className="text-[0.6875rem]" style={{ fontWeight: 500 }}>{customDate ? customDate.toLocaleDateString("en", { weekday: "short" }) : "Custom"}</span>
            <span className="text-[1.125rem] my-0.5 flex items-center justify-center h-[1.375rem]" style={{ fontWeight: 700 }}>
              {customDate ? customDate.getDate() : <CalendarDays className="w-4 h-4" />}
            </span>
            <span className="text-[0.6875rem]">{customDate ? customDate.toLocaleDateString("en", { month: "short" }) : "Pick"}</span>
          </button>
        </div>
        {showCustomDatePicker && (
          <CustomDatePickerModal value={customDate} onSelect={(d) => { setCustomDate(d); setSelectedDate(-1); setShowCustomDatePicker(false); }} onClose={() => setShowCustomDatePicker(false)} />
        )}
      </div>
      <div>
        <label className="text-[0.875rem] mb-3 block" style={{ fontWeight: 600 }}><Clock className="w-4 h-4 inline mr-2" /> Select Time</label>
        <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
          {TIME_SLOTS.map((t) => (
            <button key={t} onClick={() => setSelectedTime(t)}
              className={`py-2.5 rounded-xl text-[0.8125rem] cursor-pointer transition-all ${selectedTime === t ? "bg-primary text-primary-foreground shadow-md" : "bg-card border border-border hover:bg-secondary"}`}
              style={{ fontWeight: selectedTime === t ? 600 : 400 }}>{t}</button>
          ))}
        </div>
      </div>
    </div>
  );
}

export function DetailsStep({ name, phone, notes, setNotes, occasion, setOccasion }: {
  name: string; setName?: (v: string) => void; phone: string; setPhone?: (v: string) => void;
  notes: string; setNotes: (v: string) => void; occasion: string | null; setOccasion: (v: string | null) => void;
}) {
  return (
    <div className="px-4 py-4 space-y-6">
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-[0.9375rem]" style={{ fontWeight: 600 }}>Contact Information</h3>
          <span className="text-[0.6875rem] text-muted-foreground" style={{ fontWeight: 500 }}>From your profile</span>
        </div>
        <div className="rounded-xl border border-border bg-secondary/30 divide-y divide-border">
          <div className="flex items-center justify-between px-4 py-3">
            <span className="text-[0.75rem] text-muted-foreground" style={{ fontWeight: 500 }}>Full Name</span>
            <span className="text-[0.875rem]" style={{ fontWeight: 600 }}>{name}</span>
          </div>
          <div className="flex items-center justify-between px-4 py-3">
            <span className="text-[0.75rem] text-muted-foreground" style={{ fontWeight: 500 }}>Phone Number</span>
            <span className="text-[0.875rem]" style={{ fontWeight: 600 }}>{phone}</span>
          </div>
        </div>
        <p className="text-[0.6875rem] text-muted-foreground px-1">To change these, edit your profile.</p>
      </div>
      <div>
        <h3 className="text-[0.9375rem] mb-3" style={{ fontWeight: 600 }}><Sparkles className="w-4 h-4 inline mr-2" /> Occasion *</h3>
        <div className="grid grid-cols-3 gap-2">
          {OCCASIONS.map((o) => {
            const Icon = o.icon; const sel = occasion === o.id;
            return (
              <button key={o.id} onClick={() => setOccasion(o.id)}
                className={`flex flex-col items-center gap-1.5 py-3 px-2 rounded-xl cursor-pointer transition-all ${sel ? "bg-primary/15 border-primary border-2 text-primary" : "bg-card border border-border hover:bg-secondary"}`}>
                <Icon className="w-5 h-5" />
                <span className="text-[0.75rem]" style={{ fontWeight: sel ? 600 : 400 }}>{o.label}</span>
              </button>
            );
          })}
        </div>
      </div>
      <div>
        <label className="text-[0.8125rem] mb-1.5 block text-muted-foreground" style={{ fontWeight: 500 }}>Special Requests</label>
        <textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Allergies, dietary restrictions, celebrations..." rows={3}
          className="w-full px-4 py-3 rounded-xl border border-border bg-card text-[0.875rem] outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition resize-none" />
      </div>
    </div>
  );
}
/* Step 1: Date/Time selection + Step 2: Details/Occasion */
import { CalendarDays, Clock, Minus, Plus, Sparkles, User, Users } from "lucide-react";
import { motion } from "motion/react";
import { DragScrollContainer } from "../shared/DragScrollContainer";
import { DAYS, OCCASIONS, TIME_SLOTS } from "./bookingData";
import { CustomDatePickerModal } from "./BookingWidgets";

function SectionTitle({
  icon: Icon,
  title,
  subtitle,
}: {
  icon: typeof Users;
  title: string;
  subtitle?: string;
}) {
  return (
    <div className="mb-3 flex items-start gap-2">
      <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
        <Icon className="h-4 w-4" />
      </span>
      <div>
        <h3 className="text-[1rem] font-semibold">{title}</h3>
        {subtitle && <p className="mt-0.5 text-[0.8125rem] text-muted-foreground">{subtitle}</p>}
      </div>
    </div>
  );
}

export function DateStep({
  guests,
  setGuests,
  selectedDate,
  setSelectedDate,
  customDate,
  setCustomDate,
  selectedTime,
  setSelectedTime,
  showCustomDatePicker,
  setShowCustomDatePicker,
}: {
  guests: number;
  setGuests: (value: number) => void;
  selectedDate: number;
  setSelectedDate: (value: number) => void;
  customDate: Date | null;
  setCustomDate: (value: Date | null) => void;
  selectedTime: string | null;
  setSelectedTime: (value: string | null) => void;
  showCustomDatePicker: boolean;
  setShowCustomDatePicker: (value: boolean) => void;
}) {
  return (
    <div className="space-y-6 px-5 py-5">
      <section className="rounded-[1.5rem] border border-border bg-card p-4 shadow-[0_6px_20px_rgba(0,0,0,0.045)]">
        <SectionTitle icon={Users} title="Party size" subtitle="Choose how many seats you need." />
        <div className="flex items-center justify-center gap-5 py-2">
          <button type="button" onClick={() => setGuests(Math.max(1, guests - 1))} className="flex h-11 w-11 cursor-pointer items-center justify-center rounded-full border border-border bg-card transition hover:bg-secondary active:scale-95">
            <Minus className="h-4 w-4" />
          </button>
          <div className="min-w-20 text-center">
            <div className="text-[2rem] font-semibold leading-none">{guests}</div>
            <div className="mt-1 text-[0.75rem] text-muted-foreground">{guests === 1 ? "guest" : "guests"}</div>
          </div>
          <button type="button" onClick={() => setGuests(Math.min(20, guests + 1))} className="flex h-11 w-11 cursor-pointer items-center justify-center rounded-full bg-primary text-primary-foreground shadow-[0_8px_18px_rgba(255,56,92,0.22)] transition active:scale-95">
            <Plus className="h-4 w-4" />
          </button>
        </div>
      </section>

      <section>
        <SectionTitle icon={CalendarDays} title="Date" subtitle="Swipe to see more available dates." />
        <div className="flex items-stretch gap-2">
          <DragScrollContainer className="flex min-w-0 flex-1 gap-2 pb-1">
            {DAYS.map((day, index) => {
              const active = selectedDate === index;
              return (
                <motion.button
                  key={`${day.month}-${day.date}`}
                  type="button"
                  whileTap={{ scale: 0.96 }}
                  onClick={() => setSelectedDate(index)}
                  className={`flex min-w-[4.25rem] shrink-0 cursor-pointer flex-col items-center rounded-[1.15rem] border px-3 py-2.5 transition ${
                    active ? "border-primary bg-primary text-primary-foreground shadow-[0_8px_18px_rgba(255,56,92,0.22)]" : "border-border bg-card hover:bg-secondary"
                  }`}
                >
                  <span className="text-[0.6875rem] font-medium">{day.label}</span>
                  <span className="my-0.5 text-[1.125rem] font-semibold">{day.date}</span>
                  <span className="text-[0.6875rem]">{day.month}</span>
                </motion.button>
              );
            })}
          </DragScrollContainer>
          <button
            type="button"
            onClick={() => { if (customDate) setSelectedDate(-1); else setShowCustomDatePicker(true); }}
            onDoubleClick={() => setShowCustomDatePicker(true)}
            className={`mb-1 flex min-w-[4.25rem] shrink-0 cursor-pointer flex-col items-center justify-center rounded-[1.15rem] border px-3 py-2.5 transition ${
              selectedDate === -1 && customDate ? "border-primary bg-primary text-primary-foreground" : customDate ? "border-border bg-card hover:bg-secondary" : "border-dashed border-border bg-card hover:bg-secondary"
            }`}
          >
            <span className="text-[0.6875rem] font-medium">{customDate ? customDate.toLocaleDateString("en", { weekday: "short" }) : "Custom"}</span>
            <span className="my-0.5 flex h-[1.375rem] items-center justify-center text-[1.125rem] font-semibold">
              {customDate ? customDate.getDate() : <CalendarDays className="h-4 w-4" />}
            </span>
            <span className="text-[0.6875rem]">{customDate ? customDate.toLocaleDateString("en", { month: "short" }) : "Pick"}</span>
          </button>
        </div>
        {showCustomDatePicker && (
          <CustomDatePickerModal
            value={customDate}
            onSelect={(date) => {
              setCustomDate(date);
              setSelectedDate(-1);
              setShowCustomDatePicker(false);
            }}
            onClose={() => setShowCustomDatePicker(false)}
          />
        )}
      </section>

      <section>
        <SectionTitle icon={Clock} title="Time" subtitle="Pick the reservation start time." />
        <div className="grid grid-cols-3 gap-2 sm:grid-cols-5">
          {TIME_SLOTS.map((time) => {
            const active = selectedTime === time;
            return (
              <motion.button
                key={time}
                type="button"
                whileTap={{ scale: 0.96 }}
                onClick={() => setSelectedTime(time)}
                className={`h-10 cursor-pointer rounded-full text-[0.8125rem] transition ${
                  active ? "bg-primary text-primary-foreground shadow-[0_8px_18px_rgba(255,56,92,0.22)]" : "border border-border bg-card hover:bg-secondary"
                }`}
                style={{ fontWeight: active ? 600 : 400 }}
              >
                {time}
              </motion.button>
            );
          })}
        </div>
      </section>
    </div>
  );
}

export function DetailsStep({
  name,
  phone,
  notes,
  setNotes,
  occasion,
  setOccasion,
}: {
  name: string;
  setName?: (value: string) => void;
  phone: string;
  setPhone?: (value: string) => void;
  notes: string;
  setNotes: (value: string) => void;
  occasion: string | null;
  setOccasion: (value: string | null) => void;
}) {
  return (
    <div className="space-y-6 px-5 py-5">
      <section className="rounded-[1.5rem] border border-border bg-card p-4 shadow-[0_6px_20px_rgba(0,0,0,0.045)]">
        <div className="mb-3 flex items-center justify-between">
          <SectionTitle icon={User} title="Contact" subtitle="Pulled from your profile." />
        </div>
        <div className="grid gap-2">
          <div className="flex items-center justify-between rounded-[1rem] bg-secondary/65 px-3 py-2.5">
            <span className="text-[0.75rem] font-medium text-muted-foreground">Full name</span>
            <span className="text-[0.875rem]">{name}</span>
          </div>
          <div className="flex items-center justify-between rounded-[1rem] bg-secondary/65 px-3 py-2.5">
            <span className="text-[0.75rem] font-medium text-muted-foreground">Phone</span>
            <span className="text-[0.875rem]">{phone}</span>
          </div>
        </div>
      </section>

      <section>
        <SectionTitle icon={Sparkles} title="Occasion" subtitle="This helps the restaurant prepare." />
        <div className="grid grid-cols-3 gap-2">
          {OCCASIONS.map((occasionOption) => {
            const Icon = occasionOption.icon;
            const active = occasion === occasionOption.id;
            return (
              <motion.button
                key={occasionOption.id}
                type="button"
                whileTap={{ scale: 0.96 }}
                onClick={() => setOccasion(occasionOption.id)}
                className={`flex cursor-pointer flex-col items-center gap-1.5 rounded-[1.15rem] border px-2 py-3 transition ${
                  active ? "border-primary bg-primary text-primary-foreground shadow-[0_8px_18px_rgba(255,56,92,0.22)]" : "border-border bg-card hover:bg-secondary"
                }`}
              >
                <Icon className="h-5 w-5" />
                <span className="text-[0.75rem] font-medium">{occasionOption.label}</span>
              </motion.button>
            );
          })}
        </div>
      </section>

      <section>
        <SectionTitle icon={Sparkles} title="Special requests" subtitle="Allergies, seating, or celebration notes." />
        <textarea
          value={notes}
          onChange={(event) => setNotes(event.target.value)}
          placeholder="Allergies, dietary restrictions, celebrations..."
          rows={4}
          className="w-full resize-none rounded-[1.25rem] border border-border bg-card px-4 py-3 text-[0.875rem] outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/15"
        />
      </section>
    </div>
  );
}

/* BookTableFlow - main reservation flow */
import { useEffect, useState } from "react";
import { ArrowLeft, Check, ShieldCheck, SlidersHorizontal, Sparkles } from "lucide-react";
import { motion } from "motion/react";
import { Button } from "../../components/ds/Button";
import { BottomSheet } from "../../components/ds/BottomSheet";
import type { RestaurantData } from "../detail/restaurantDetailData";
import {
  AMENITY_OPTIONS,
  CUISINE_PREFS,
  DAYS,
  DEPOSIT_PER_GUEST,
  REWARD_BALANCE,
  SEATING_OPTIONS,
  SERVICE_FEE,
  STEP_ORDER,
  VIBE_OPTIONS,
  collectPrefTags,
  genBookingId,
  type Step,
} from "./bookingData";
import { PreferenceSection } from "./BookingWidgets";
import { DateStep, DetailsStep } from "./BookingStepDate";
import { AwaitingStep, ConfirmStep, SuccessStep } from "./BookingConfirmStep";
import { UnifiedPayment } from "../shared/UnifiedPayment";

interface ReservationPrefill {
  dateOffset?: number;
  timeLabel?: string;
  partySize?: number;
}

interface Props {
  restaurant: RestaurantData;
  onBack: () => void;
  onComplete: () => void;
  initialReservation?: ReservationPrefill;
}

const TIME_SLOTS = ["17:00", "17:30", "18:00", "18:30", "19:00", "19:30", "20:00", "20:30", "21:00", "21:30"];

function normalizeInitialTime(value?: string) {
  if (!value) return null;
  if (TIME_SLOTS.includes(value)) return value;

  const match = value.trim().match(/^(\d{1,2})(?::(\d{2}))?\s*(AM|PM)$/i);
  if (!match) return null;
  const suffix = match[3].toUpperCase();
  let hour = Number(match[1]);
  const minute = match[2] ?? "00";
  if (suffix === "PM" && hour < 12) hour += 12;
  if (suffix === "AM" && hour === 12) hour = 0;
  const normalized = `${hour.toString().padStart(2, "0")}:${minute}`;
  return TIME_SLOTS.includes(normalized) ? normalized : null;
}

function StepHeader({
  restaurant,
  step,
  stepIndex,
  title,
  onBack,
}: {
  restaurant: RestaurantData;
  step: Step;
  stepIndex: number;
  title: string;
  onBack: () => void;
}) {
  return (
    <div className="shrink-0 border-b border-border bg-background/94 px-5 py-4 backdrop-blur-md">
      <div className="mb-4 flex items-center gap-3">
        <button type="button" onClick={onBack} className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-secondary transition active:scale-95" aria-label="Back">
          <ArrowLeft className="h-5 w-5" />
        </button>
        <div className="min-w-0 flex-1">
          <p className="truncate text-[1rem] font-semibold">{title}</p>
          <p className="truncate text-[0.75rem] text-muted-foreground">{restaurant.name}</p>
        </div>
        <span className="rounded-full bg-primary/10 px-3 py-1.5 text-[0.75rem] font-medium text-primary">
          {stepIndex + 1}/{STEP_ORDER.length}
        </span>
      </div>
      <div className="flex gap-1.5">
        {STEP_ORDER.map((item, index) => (
          <div key={item} className={`h-1.5 flex-1 rounded-full transition-colors ${index <= stepIndex ? "bg-primary" : "bg-border"}`} />
        ))}
      </div>
      <div className="mt-3 flex items-center gap-2 rounded-[1.25rem] bg-secondary/65 p-2">
        <img src={restaurant.image} alt="" className="h-10 w-10 rounded-full object-cover" />
        <div className="min-w-0 flex-1">
          <p className="truncate text-[0.8125rem] font-medium">{restaurant.name}</p>
          <p className="truncate text-[0.6875rem] text-muted-foreground">{restaurant.cuisine}</p>
        </div>
        <ShieldCheck className="h-4 w-4 shrink-0 text-primary" />
      </div>
    </div>
  );
}

export function BookTableFlow({ restaurant, onBack, onComplete, initialReservation }: Props) {
  const initialDateOffset = initialReservation?.dateOffset ?? 0;
  const [step, setStep] = useState<Step>("date");
  const [selectedDate, setSelectedDate] = useState(() => (
    initialDateOffset >= 0 && initialDateOffset < DAYS.length ? initialDateOffset : -1
  ));
  const [customDate, setCustomDate] = useState<Date | null>(() => {
    if (initialDateOffset >= 0 && initialDateOffset < DAYS.length) return null;
    const date = new Date();
    date.setDate(date.getDate() + Math.max(0, initialDateOffset));
    return date;
  });
  const [showCustomDatePicker, setShowCustomDatePicker] = useState(false);
  const [selectedTime, setSelectedTime] = useState<string | null>(() => normalizeInitialTime(initialReservation?.timeLabel));
  const [guests, setGuests] = useState(() => Math.max(1, initialReservation?.partySize ?? 2));
  const [name] = useState("Alex Chen");
  const [phone] = useState("+1 (415) 555-0142");
  const [notes, setNotes] = useState("");
  const [occasion, setOccasion] = useState<string | null>(null);
  const [seating, setSeating] = useState<string[]>([]);
  const [cuisinePrefs, setCuisinePrefs] = useState<string[]>([]);
  const [vibes, setVibes] = useState<string[]>([]);
  const [amenities, setAmenities] = useState<string[]>([]);
  const [showPaymentSheet, setShowPaymentSheet] = useState(false);
  const [useRewards] = useState(false);
  const [paymentConfirmed, setPaymentConfirmed] = useState(false);

  const canProceedDate = selectedTime !== null;
  const canProceedDetails = name.trim().length > 0 && phone.trim().length > 0 && occasion !== null;
  const totalPrefs = seating.length + cuisinePrefs.length + vibes.length + amenities.length;
  const bookingId = genBookingId(restaurant.id);
  const depositAmount = guests * DEPOSIT_PER_GUEST;
  const rewardDiscount = useRewards ? REWARD_BALANCE : 0;
  const totalAmount = Math.max(0, depositAmount + SERVICE_FEE - rewardDiscount);
  const dateStr = selectedDate === -1 && customDate
    ? `${customDate.toLocaleDateString("en", { weekday: "short" })}, ${customDate.toLocaleDateString("en", { month: "short" })} ${customDate.getDate()}`
    : DAYS[selectedDate]
      ? `${DAYS[selectedDate].day}, ${DAYS[selectedDate].month} ${DAYS[selectedDate].date}`
      : "";
  const allPrefTags = collectPrefTags(seating, cuisinePrefs, vibes, amenities);

  const togglePref = (list: string[], setList: (value: string[]) => void, id: string) => {
    setList(list.includes(id) ? list.filter((item) => item !== id) : [...list, id]);
  };

  useEffect(() => {
    if (step !== "awaiting") return undefined;
    const timer = window.setTimeout(() => setStep("success"), 3200);
    return () => window.clearTimeout(timer);
  }, [step]);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    const main = document.querySelector("main");
    if (main) main.setAttribute("data-booking-scroll-lock", "true");
    const previous = main instanceof HTMLElement ? main.style.overflow : "";
    if (main instanceof HTMLElement) main.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
      if (main instanceof HTMLElement) main.style.overflow = previous;
      main?.removeAttribute("data-booking-scroll-lock");
    };
  }, []);

  const handlePaymentComplete = () => {
    setPaymentConfirmed(true);
    window.setTimeout(() => {
      setShowPaymentSheet(false);
      setStep("awaiting");
    }, 1100);
  };

  const stepIndex = STEP_ORDER.indexOf(step);
  const goBack = () => {
    if (step === "date") onBack();
    else if (step === "details") setStep("date");
    else if (step === "preferences") setStep("details");
    else if (step === "confirm") setStep("preferences");
  };
  const headerTitle = step === "preferences" ? "Preferences" : step === "confirm" ? "Review and pay" : "Book a table";

  return (
    <div className="fixed inset-0 z-[500] flex flex-col bg-background">
      {step !== "awaiting" && step !== "success" && (
        <StepHeader restaurant={restaurant} step={step} stepIndex={stepIndex} title={headerTitle} onBack={goBack} />
      )}

      <div className="min-h-0 flex-1 overflow-y-auto">
        {step === "date" && (
          <DateStep
            guests={guests}
            setGuests={setGuests}
            selectedDate={selectedDate}
            setSelectedDate={setSelectedDate}
            customDate={customDate}
            setCustomDate={setCustomDate}
            selectedTime={selectedTime}
            setSelectedTime={setSelectedTime}
            showCustomDatePicker={showCustomDatePicker}
            setShowCustomDatePicker={setShowCustomDatePicker}
          />
        )}
        {step === "details" && (
          <DetailsStep
            name={name}
            phone={phone}
            notes={notes}
            setNotes={setNotes}
            occasion={occasion}
            setOccasion={setOccasion}
          />
        )}
        {step === "preferences" && (
          <div className="space-y-6 px-5 py-5">
            <div className="rounded-[1.5rem] border border-primary/20 bg-primary/8 p-4">
              <p className="text-[0.8125rem] leading-snug text-muted-foreground">
                <SlidersHorizontal className="mr-1.5 inline h-4 w-4 text-primary" />
                Customize the visit so the restaurant can prepare the right table, pace, and atmosphere.
              </p>
            </div>
            <PreferenceSection title="Seating" subtitle="Where would you like to sit?" options={SEATING_OPTIONS} selected={seating} onToggle={(id) => togglePref(seating, setSeating, id)} />
            <PreferenceSection title="Cuisine preferences" subtitle="What type of food do you enjoy?" options={CUISINE_PREFS} selected={cuisinePrefs} onToggle={(id) => togglePref(cuisinePrefs, setCuisinePrefs, id)} />
            <PreferenceSection title="Vibe" subtitle="What is the mood for tonight?" options={VIBE_OPTIONS} selected={vibes} onToggle={(id) => togglePref(vibes, setVibes, id)} />
            <PreferenceSection title="Amenities" subtitle="Any special needs or requests?" options={AMENITY_OPTIONS} selected={amenities} onToggle={(id) => togglePref(amenities, setAmenities, id)} />
          </div>
        )}
        {step === "confirm" && (
          <ConfirmStep
            restaurant={restaurant}
            dateStr={dateStr}
            selectedTime={selectedTime}
            guests={guests}
            occasion={occasion}
            name={name}
            phone={phone}
            notes={notes}
            allPrefTags={allPrefTags}
            depositAmount={depositAmount}
            useRewards={useRewards}
            rewardDiscount={rewardDiscount}
            totalAmount={totalAmount}
          />
        )}
        {step === "awaiting" && <AwaitingStep restaurant={restaurant} dateStr={dateStr} selectedTime={selectedTime} guests={guests} totalAmount={totalAmount} />}
        {step === "success" && <SuccessStep restaurant={restaurant} bookingId={bookingId} dateStr={dateStr} selectedTime={selectedTime} guests={guests} occasion={occasion} totalAmount={totalAmount} allPrefTags={allPrefTags} />}
      </div>

      {step !== "awaiting" && (
        <div className="shrink-0 border-t border-border bg-card/96 px-5 py-3 backdrop-blur-md">
          {step === "date" && (
            <Button variant="primary" radius="full" className="h-12 w-full font-medium" disabled={!canProceedDate} onClick={() => setStep("details")}>
              Continue
            </Button>
          )}
          {step === "details" && (
            <Button variant="primary" radius="full" className="h-12 w-full font-medium" disabled={!canProceedDetails} onClick={() => setStep("preferences")}>
              Set preferences
            </Button>
          )}
          {step === "preferences" && (
            <div className="grid grid-cols-2 gap-2">
              <Button variant="outline" radius="full" className="h-12 font-medium" onClick={() => setStep("confirm")}>Skip</Button>
              <Button variant="primary" radius="full" className="h-12 gap-2 font-medium" onClick={() => setStep("confirm")}>
                Continue
                {totalPrefs > 0 && <span className="rounded-full bg-primary-foreground px-1.5 py-0.5 text-[0.625rem] text-primary">{totalPrefs}</span>}
              </Button>
            </div>
          )}
          {step === "confirm" && (
            <Button variant="primary" radius="full" className="h-12 w-full gap-2 font-medium" onClick={() => setShowPaymentSheet(true)}>
              <Check className="h-4 w-4" />
              Confirm and pay ${totalAmount.toFixed(2)}
            </Button>
          )}
          {step === "success" && (
            <div className="space-y-2">
              <Button variant="primary" radius="full" className="h-12 w-full font-medium" onClick={onComplete}>View reservations</Button>
              <Button variant="outline" radius="full" className="h-12 w-full font-medium" onClick={onComplete}>Back to discover</Button>
            </div>
          )}
        </div>
      )}

      <BottomSheet
        open={showPaymentSheet}
        onClose={() => {
          setShowPaymentSheet(false);
          setPaymentConfirmed(false);
        }}
        title="Reservation payment"
        snap="full"
        footer={paymentConfirmed ? (
          <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="flex w-full items-center justify-center gap-2 rounded-full bg-success py-3.5">
            <Check className="h-5 w-5 text-success-foreground" />
            <span className="text-[0.9375rem] font-medium text-success-foreground">Payment confirmed</span>
          </motion.div>
        ) : undefined}
      >
        {!paymentConfirmed && (
          <UnifiedPayment
            payTo={restaurant.name}
            payToSub={dateStr}
            amount={totalAmount}
            editable={false}
            lineItems={[
              { label: `Reservation deposit (${guests} x $${DEPOSIT_PER_GUEST})`, value: depositAmount },
              { label: "Service fee", value: SERVICE_FEE, color: "muted" },
              ...(useRewards ? [{ label: "Reward points", value: -rewardDiscount, color: "success" as const, icon: <Sparkles className="h-3 w-3" /> }] : []),
            ]}
            showRewards
            onComplete={handlePaymentComplete}
          />
        )}
      </BottomSheet>
    </div>
  );
}

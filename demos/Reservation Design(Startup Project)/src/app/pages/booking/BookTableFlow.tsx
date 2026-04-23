/* BookTableFlow — main flow component with state + payment sheet */
import { useState, useEffect } from "react";
import { ArrowLeft, Check, Sparkles, SlidersHorizontal } from "lucide-react";
import { Button } from "../../components/ds/Button";
import { DSBadge } from "../../components/ds/Badge";
import { BottomSheet } from "../../components/ds/BottomSheet";
import type { RestaurantData } from "../detail/restaurantDetailData";
import {
  DAYS, OCCASIONS, SEATING_OPTIONS, CUISINE_PREFS, VIBE_OPTIONS, AMENITY_OPTIONS,
  DEPOSIT_PER_GUEST, SERVICE_FEE, REWARD_BALANCE, POINTS_EARN, STEP_ORDER,
  genBookingId, collectPrefTags, type Step,
} from "./bookingData";
import { PreferenceSection } from "./BookingWidgets";
import { DateStep, DetailsStep } from "./BookingStepDate";
import { ConfirmStep, AwaitingStep, SuccessStep } from "./BookingConfirmStep";
import { UnifiedPayment } from "../shared/UnifiedPayment";

interface Props { restaurant: RestaurantData; onBack: () => void; onComplete: () => void; }

export function BookTableFlow({ restaurant, onBack, onComplete }: Props) {
  const [step, setStep] = useState<Step>("date");
  const [selectedDate, setSelectedDate] = useState(0);
  const [customDate, setCustomDate] = useState<Date | null>(null);
  const [showCustomDatePicker, setShowCustomDatePicker] = useState(false);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [guests, setGuests] = useState(2);
  const [name, setName] = useState(""); const [phone, setPhone] = useState(""); const [notes, setNotes] = useState("");
  const [occasion, setOccasion] = useState<string | null>(null);
  const [seating, setSeating] = useState<string[]>([]);
  const [cuisinePrefs, setCuisinePrefs] = useState<string[]>([]);
  const [vibes, setVibes] = useState<string[]>([]);
  const [amenities, setAmenities] = useState<string[]>([]);
  const [showPaymentSheet, setShowPaymentSheet] = useState(false);
  const [useRewards, setUseRewards] = useState(false);
  const [paymentConfirmed, setPaymentConfirmed] = useState(false);

  const canProceedDate = selectedTime !== null;
  const canProceedDetails = name.trim().length > 0 && phone.trim().length > 0 && occasion !== null;
  const totalPrefs = seating.length + cuisinePrefs.length + vibes.length + amenities.length;
  const bookingId = genBookingId(restaurant.id);
  const depositAmount = guests * DEPOSIT_PER_GUEST;
  const rewardDiscount = useRewards ? REWARD_BALANCE : 0;
  const totalAmount = Math.max(0, depositAmount + SERVICE_FEE - rewardDiscount);
  const dateStr = customDate
    ? `${customDate.toLocaleDateString("en", { weekday: "short" })}, ${customDate.toLocaleDateString("en", { month: "short" })} ${customDate.getDate()}`
    : `${DAYS[selectedDate].day}, ${DAYS[selectedDate].month} ${DAYS[selectedDate].date}`;
  const allPrefTags = collectPrefTags(seating, cuisinePrefs, vibes, amenities);

  const togglePref = (list: string[], setList: (v: string[]) => void, id: string) => {
    setList(list.includes(id) ? list.filter(x => x !== id) : [...list, id]);
  };

  useEffect(() => { if (step === "awaiting") { const t = setTimeout(() => setStep("success"), 4000); return () => clearTimeout(t); } }, [step]);
  useEffect(() => { document.body.style.overflow = "hidden"; const m = document.querySelector("main"); if (m) m.style.overflow = "hidden"; return () => { document.body.style.overflow = ""; if (m) m.style.overflow = ""; }; }, []);

  const handlePaymentComplete = () => { setPaymentConfirmed(true); setTimeout(() => { setShowPaymentSheet(false); setStep("awaiting"); }, 1200); };

  const stepIndex = STEP_ORDER.indexOf(step);
  const goBack = () => { if (step === "date") onBack(); else if (step === "details") setStep("date"); else if (step === "preferences") setStep("details"); else if (step === "confirm") setStep("preferences"); };
  const headerTitle = step === "success" ? "Reservation Approved!" : step === "awaiting" ? "Awaiting Approval" : step === "preferences" ? "Preferences" : step === "confirm" ? "Review & Pay" : "Book a Table";

  return (
    <div className="fixed inset-0 z-[300] bg-background flex flex-col">
      {step !== "awaiting" && step !== "success" && (
        <div className="flex items-center gap-3 px-4 py-3 border-b border-border shrink-0">
          <button onClick={goBack} className="w-9 h-9 rounded-full hover:bg-secondary flex items-center justify-center cursor-pointer transition"><ArrowLeft className="w-5 h-5" /></button>
          <div className="flex-1 min-w-0">
            <p className="text-[0.9375rem] truncate" style={{ fontWeight: 600 }}>{headerTitle}</p>
            <p className="text-[0.75rem] text-muted-foreground truncate">{restaurant.name}</p>
          </div>
          <div className="flex gap-1.5">{STEP_ORDER.map((_, i) => <div key={i} className={`w-2 h-2 rounded-full transition-colors ${i <= stepIndex ? "bg-primary" : "bg-secondary"}`} />)}</div>
        </div>
      )}
      {step !== "awaiting" && step !== "success" && (
        <div className="flex gap-1.5 px-4 py-2 shrink-0">{STEP_ORDER.map((_, i) => <div key={i} className={`h-1 flex-1 rounded-full transition-colors ${i <= stepIndex ? "bg-primary" : "bg-secondary"}`} />)}</div>
      )}

      <div className="flex-1 overflow-y-auto">
        {step === "date" && <DateStep guests={guests} setGuests={setGuests} selectedDate={selectedDate} setSelectedDate={setSelectedDate} customDate={customDate} setCustomDate={setCustomDate} selectedTime={selectedTime} setSelectedTime={setSelectedTime} showCustomDatePicker={showCustomDatePicker} setShowCustomDatePicker={setShowCustomDatePicker} />}
        {step === "details" && <DetailsStep name={name} setName={setName} phone={phone} setPhone={setPhone} notes={notes} setNotes={setNotes} occasion={occasion} setOccasion={setOccasion} />}
        {step === "preferences" && (
          <div className="px-4 py-4 space-y-6">
            <div className="p-4 rounded-xl border border-primary/20 bg-primary/5"><p className="text-[0.8125rem] text-muted-foreground"><SlidersHorizontal className="w-4 h-4 inline mr-1.5 text-primary" />Customize your dining experience. These help the restaurant prepare for your visit.</p></div>
            <PreferenceSection title="Seating Preference" subtitle="Where would you like to sit?" options={SEATING_OPTIONS} selected={seating} onToggle={id => togglePref(seating, setSeating, id)} />
            <PreferenceSection title="Cuisine Preferences" subtitle="What type of food do you enjoy?" options={CUISINE_PREFS} selected={cuisinePrefs} onToggle={id => togglePref(cuisinePrefs, setCuisinePrefs, id)} />
            <PreferenceSection title="Vibe & Atmosphere" subtitle="What's the mood for tonight?" options={VIBE_OPTIONS} selected={vibes} onToggle={id => togglePref(vibes, setVibes, id)} />
            <PreferenceSection title="Amenities" subtitle="Any special needs or requests?" options={AMENITY_OPTIONS} selected={amenities} onToggle={id => togglePref(amenities, setAmenities, id)} />
          </div>
        )}
        {step === "confirm" && <ConfirmStep restaurant={restaurant} dateStr={dateStr} selectedTime={selectedTime} guests={guests} occasion={occasion} name={name} phone={phone} notes={notes} allPrefTags={allPrefTags} depositAmount={depositAmount} useRewards={useRewards} rewardDiscount={rewardDiscount} totalAmount={totalAmount} />}
        {step === "awaiting" && <AwaitingStep restaurant={restaurant} dateStr={dateStr} selectedTime={selectedTime} guests={guests} totalAmount={totalAmount} />}
        {step === "success" && <SuccessStep restaurant={restaurant} bookingId={bookingId} dateStr={dateStr} selectedTime={selectedTime} guests={guests} occasion={occasion} totalAmount={totalAmount} allPrefTags={allPrefTags} />}
      </div>

      {step !== "awaiting" && (
        <div className="px-4 py-3 border-t border-border shrink-0">
          {step === "date" && <Button variant="primary" className="w-full" disabled={!canProceedDate} onClick={() => setStep("details")}>Continue</Button>}
          {step === "details" && <Button variant="primary" className="w-full" disabled={!canProceedDetails} onClick={() => setStep("preferences")}>Set Preferences</Button>}
          {step === "preferences" && (
            <div className="flex gap-3">
              <Button variant="outline" className="flex-1" onClick={() => setStep("confirm")}>Skip</Button>
              <Button variant="primary" className="flex-1 gap-2" onClick={() => setStep("confirm")}>{totalPrefs > 0 && <DSBadge variant="solid" color="default" size="sm" className="!bg-primary-foreground !text-primary">{totalPrefs}</DSBadge>}Continue</Button>
            </div>
          )}
          {step === "confirm" && <Button variant="primary" className="w-full gap-2" onClick={() => setShowPaymentSheet(true)}><Check className="w-4 h-4" /> Confirm & Pay ${totalAmount.toFixed(2)}</Button>}
          {step === "success" && (
            <div className="space-y-2">
              <Button variant="primary" className="w-full" onClick={onComplete}>View My Reservations</Button>
              <Button variant="outline" className="w-full" onClick={onComplete}>Back to Discover</Button>
            </div>
          )}
        </div>
      )}

      <BottomSheet open={showPaymentSheet} onClose={() => { setShowPaymentSheet(false); setPaymentConfirmed(false); }} title="Reservation Payment" snap="full"
        footer={paymentConfirmed ? (
          <div className="w-full py-3.5 rounded-2xl bg-success flex items-center justify-center gap-2"><Check className="w-5 h-5 text-success-foreground" /><span className="text-success-foreground text-[0.9375rem]" style={{ fontWeight: 600 }}>Payment Confirmed!</span></div>
        ) : undefined}>
        {!paymentConfirmed && (
          <UnifiedPayment
            payTo={restaurant.name}
            payToSub={dateStr}
            amount={totalAmount}
            editable={false}
            lineItems={[
              { label: `Reservation Deposit (${guests} x $${DEPOSIT_PER_GUEST})`, value: depositAmount },
              { label: "Service Fee", value: SERVICE_FEE, color: "muted" },
              ...(useRewards ? [{ label: "Reward Points", value: -rewardDiscount, color: "success" as const, icon: <Sparkles className="w-3 h-3" /> }] : []),
            ]}
            showRewards
            onComplete={handlePaymentComplete}
          />
        )}
      </BottomSheet>
    </div>
  );
}
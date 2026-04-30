import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Camera, Check, ChevronLeft, Receipt, Send, Sparkles, Star, ThumbsUp, UtensilsCrossed, Users, WalletCards, X } from "lucide-react";
import { Text, Heading } from "../../../components/ds/Text";
import { Button } from "../../../components/ds/Button";
import { FULL_MENU, INITIAL_MENU, REVIEW_TAGS, STEPS, type ScanStep } from "../scanQRData";
import { ConfettiEffect, QRCodeVisual, StepProgressBar } from "../ScanQRWidgets";
import { UnifiedPayment } from "../../shared/UnifiedPayment";
import { formatMoney } from "./helpers";
import { BillCard, BookingMiniCard, StepIntro, SubRatingRow } from "./shared";
import type { ScanQRFlowProps } from "./types";

export function ScanQRFlow({ booking, onClose, initialStep = "scan", onCheckedIn }: ScanQRFlowProps) {
  const [step, setStep] = useState<ScanStep>(initialStep);
  const [scanned, setScanned] = useState(false);
  const [tipPercent, setTipPercent] = useState(18);
  const [paymentDone, setPaymentDone] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [reviewText, setReviewText] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [tasteRating, setTasteRating] = useState<number | null>(null);
  const [ambienceRating, setAmbienceRating] = useState<number | null>(null);
  const [serviceRating, setServiceRating] = useState<number | null>(null);
  const [valueRating, setValueRating] = useState<number | null>(null);
  const [reviewSubmitted, setReviewSubmitted] = useState(false);
  const [allDone, setAllDone] = useState(false);

  const subtotal = 428.0;
  const taxRate = 0.0875;
  const tax = subtotal * taxRate;
  const tip = subtotal * (tipPercent / 100);
  const total = subtotal + tax + tip;
  const stepIdx = STEPS.findIndex((item) => item.id === step);

  const goNext = () => {
    const nextIdx = stepIdx + 1;
    if (nextIdx < STEPS.length) setStep(STEPS[nextIdx].id);
  };
  const goPrev = () => { if (stepIdx > 0) setStep(STEPS[stepIdx - 1].id); };

  const handleSimulateScan = () => {
    setScanned(true);
    window.setTimeout(() => { setStep("arrived"); onCheckedIn?.(); }, 1050);
  };

  const handlePaymentComplete = () => {
    setPaymentDone(true);
    setShowConfetti(true);
    window.setTimeout(() => { setStep("review"); setShowConfetti(false); }, 1700);
  };

  const handleSubmitReview = () => {
    setReviewSubmitted(true);
    window.setTimeout(() => setAllDone(true), 1200);
  };

  const toggleTag = (tag: string) => setSelectedTags((current) => (current.includes(tag) ? current.filter((item) => item !== tag) : [...current, tag]));
  const ratedSubs = [tasteRating, ambienceRating, serviceRating, valueRating].filter((value): value is number => typeof value === "number");
  const overallRating = ratedSubs.length ? Math.round(ratedSubs.reduce((sum, value) => sum + value, 0) / ratedSubs.length) : 0;
  const ratingLabel = ["", "Not great", "Could be better", "It was okay", "Glad you enjoyed it", "Loved it"][overallRating] || "";

  if (allDone) {
    return (
      <div className="fixed inset-0 z-[500] overflow-y-auto bg-background">
        <div className="mx-auto flex min-h-screen max-w-md flex-col px-5 py-5">
          <div className="mb-5 flex items-center justify-between"><button type="button" onClick={onClose} className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary" aria-label="Back"><ChevronLeft className="h-5 w-5" /></button><button type="button" onClick={onClose} className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary" aria-label="Close"><X className="h-5 w-5" /></button></div>
          <StepProgressBar currentStep="review" complete />
          <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} className="flex flex-1 flex-col items-center pt-8 text-center">
            <div className="mb-5 flex h-20 w-20 items-center justify-center rounded-[1.75rem] bg-success/10 text-success"><Sparkles className="h-9 w-9" /></div>
            <Heading level={2}>All done</Heading>
            <Text className="mt-2 text-[0.9375rem] text-muted-foreground">Thanks for dining at {booking.restaurant}.</Text>
            <div className="mt-7 w-full rounded-[1.5rem] border border-border bg-card p-4 text-left shadow-[0_8px_24px_rgba(0,0,0,0.055)]"><div className="mb-4 flex items-center justify-between"><Text className="text-[0.9375rem]" style={{ fontWeight: 900 }}>Digital receipt</Text><span className="rounded-full bg-success/10 px-3 py-1 text-[0.75rem] text-success" style={{ fontWeight: 900 }}>Paid</span></div><div className="space-y-2 text-[0.875rem]"><div className="flex justify-between"><Text className="text-muted-foreground">8 items</Text><Text>{formatMoney(subtotal)}</Text></div><div className="flex justify-between"><Text className="text-muted-foreground">Tax</Text><Text>{formatMoney(tax)}</Text></div><div className="flex justify-between"><Text className="text-muted-foreground">Tip</Text><Text>{formatMoney(tip)}</Text></div><div className="mt-3 flex justify-between rounded-[1rem] bg-primary/8 px-3 py-2"><Text style={{ fontWeight: 900 }}>Total paid</Text><Text className="text-primary" style={{ fontWeight: 900 }}>{formatMoney(total)}</Text></div></div></div>
            <div className="mt-3 flex w-full items-center gap-3 rounded-[1.5rem] border border-border bg-card p-4"><div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-warning/10 text-warning"><Star className="h-5 w-5" /></div><div className="min-w-0 flex-1 text-left"><Text style={{ fontWeight: 900 }}>+{Math.floor(total * 2)} reward points</Text><Text className="text-[0.8125rem] text-muted-foreground">Earned from this visit</Text></div></div>
            <div className="mt-auto w-full space-y-2 pb-4 pt-8"><Button variant="primary" fullWidth radius="full" className="h-12 font-bold" onClick={onClose}>Discover more restaurants</Button><button type="button" onClick={onClose} className="h-11 w-full text-[0.9375rem] text-muted-foreground" style={{ fontWeight: 800 }}>Back to My Dining</button></div>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[500] overflow-y-auto bg-background">
      {showConfetti && <ConfettiEffect />}
      <div className="mx-auto flex min-h-screen max-w-md flex-col px-5 py-5">
        <div className="mb-5 flex items-center justify-between"><button type="button" onClick={stepIdx > 0 ? goPrev : onClose} className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-secondary transition active:scale-95" aria-label="Previous"><ChevronLeft className="h-5 w-5" /></button><Text className="text-[0.9375rem]" style={{ fontWeight: 900 }}>QR dining</Text><button type="button" onClick={onClose} className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-secondary transition active:scale-95" aria-label="Close"><X className="h-5 w-5" /></button></div>
        <StepProgressBar currentStep={step} />
        <div className="mt-6 flex flex-1 flex-col"><AnimatePresence mode="wait"><motion.div key={`${step}-${paymentDone ? "done" : "active"}-${reviewSubmitted ? "reviewed" : "open"}`} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.22, ease: "easeOut" }} className="flex flex-1 flex-col">
          {step === "scan" && <div className="flex flex-1 flex-col items-center text-center"><StepIntro icon={Camera} title="Scan restaurant QR" desc="Use the table or host stand code to confirm your arrival." /><div className="mt-6 w-full rounded-[1.75rem] border border-border bg-secondary/55 p-5"><QRCodeVisual active={!scanned} /></div><div className="mt-4 flex items-center gap-2 rounded-full bg-card px-3 py-2 shadow-sm"><span className={`h-2 w-2 rounded-full ${scanned ? "bg-success" : "bg-primary animate-pulse"}`} /><Text className="text-[0.875rem] text-muted-foreground">{scanned ? "QR code detected" : "Scanning..."}</Text></div><div className="mt-5 w-full"><BookingMiniCard booking={booking} /></div><div className="mt-auto w-full pt-8"><Button variant="primary" fullWidth radius="full" className="h-12 font-bold" onClick={handleSimulateScan} disabled={scanned} leftIcon={<Camera className="h-4 w-4" />}>{scanned ? "Detected" : "Simulate QR scan"}</Button></div></div>}
          {step === "arrived" && <div className="flex flex-1 flex-col items-center text-center"><StepIntro icon={Check} title="Welcome in" desc="Your table is ready and the restaurant has checked you in." tone="success" /><div className="mt-6 w-full rounded-[1.5rem] border border-success/20 bg-success/6 p-4"><div className="grid grid-cols-2 gap-3"><div className="rounded-[1rem] bg-card p-3"><UtensilsCrossed className="mx-auto mb-1 h-5 w-5 text-primary" /><Text className="text-[0.75rem] text-muted-foreground">Table</Text><Text style={{ fontWeight: 900 }}>P1</Text></div><div className="rounded-[1rem] bg-card p-3"><Users className="mx-auto mb-1 h-5 w-5 text-primary" /><Text className="text-[0.75rem] text-muted-foreground">Party</Text><Text style={{ fontWeight: 900 }}>{booking.guests} guest{booking.guests > 1 ? "s" : ""}</Text></div></div></div><div className="mt-auto w-full pt-8"><Button variant="primary" fullWidth radius="full" className="h-12 font-bold" onClick={goNext}>Continue to dining</Button></div></div>}
          {step === "dining" && <div className="flex flex-1 flex-col items-center text-center"><StepIntro icon={UtensilsCrossed} title="Enjoy your meal" desc="Your bill updates as items are added by the restaurant." tone="warning" /><div className="mt-5 w-full"><BookingMiniCard booking={booking} right={<span className="rounded-full bg-success/10 px-2.5 py-1 text-[0.6875rem] text-success" style={{ fontWeight: 900 }}>Dining</span>} /></div><div className="mt-4 w-full"><BillCard items={INITIAL_MENU as typeof FULL_MENU} subtotal={INITIAL_MENU.reduce((sum, item) => sum + item.price, 0)} compact /></div><div className="mt-auto w-full pt-8"><Button variant="primary" fullWidth radius="full" className="h-12 font-bold" onClick={() => setStep("bill")} leftIcon={<Receipt className="h-4 w-4" />}>Request bill</Button></div></div>}
          {step === "bill" && <div className="flex flex-1 flex-col items-center text-center"><StepIntro icon={Receipt} title="Review your bill" desc="Confirm the items and choose a gratuity before payment." tone="info" /><div className="mt-5 w-full"><BillCard items={FULL_MENU} subtotal={subtotal} tax={tax} tip={tip} total={total} tipPercent={tipPercent} setTipPercent={setTipPercent} /></div><div className="mt-auto w-full pt-8"><Button variant="primary" fullWidth radius="full" className="h-12 font-bold" onClick={goNext}>Continue to payment</Button></div></div>}
          {step === "pay" && !paymentDone && <UnifiedPayment payTo={booking.restaurant} payToSub={`${booking.date} - Table P1`} amount={total} editable={false} lineItems={[{ label: "Subtotal (8 items)", value: subtotal }, { label: "Tax (8.75%)", value: tax, color: "muted" }, { label: "Tip", value: tip, color: "muted" }]} showRewards onComplete={handlePaymentComplete} />}
          {step === "pay" && paymentDone && <div className="flex flex-1 flex-col items-center justify-center text-center"><StepIntro icon={WalletCards} title="Payment complete" desc="Paid with Tonight Wallet. Redirecting to review." tone="success" /></div>}
          {step === "review" && !reviewSubmitted && <div className="flex flex-1 flex-col items-center text-center"><StepIntro icon={Star} title="How was it?" desc="A quick rating helps improve future recommendations." tone="warning" /><div className="mt-5 w-full"><BookingMiniCard booking={booking} right={<Text className="text-primary" style={{ fontWeight: 900 }}>{formatMoney(total)}</Text>} /></div><div className="mt-5 w-full space-y-2 text-left"><SubRatingRow label="Taste" value={tasteRating} onChange={setTasteRating} /><SubRatingRow label="Ambience" value={ambienceRating} onChange={setAmbienceRating} /><SubRatingRow label="Service" value={serviceRating} onChange={setServiceRating} /><SubRatingRow label="Value" value={valueRating} onChange={setValueRating} /></div>{overallRating > 0 && <Text className="mt-3 text-[0.8125rem] text-warning" style={{ fontWeight: 900 }}>Overall {overallRating}/5 - {ratingLabel}</Text>}<div className="relative mt-4 w-full"><textarea value={reviewText} onChange={(event) => setReviewText(event.target.value)} placeholder="Tell others about your experience..." maxLength={500} className="h-28 w-full resize-none rounded-[1.25rem] border border-border bg-card px-4 py-3 text-[0.9375rem] outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/15" /><Text className="absolute bottom-3 right-4 text-[0.75rem] text-muted-foreground/60">{reviewText.length}/500</Text></div><div className="mt-3 flex flex-wrap justify-center gap-2">{REVIEW_TAGS.map((tag) => <button key={tag} type="button" onClick={() => toggleTag(tag)} className={`rounded-full border px-3 py-1.5 text-[0.8125rem] transition ${selectedTags.includes(tag) ? "border-primary bg-primary/8 text-primary" : "border-border text-muted-foreground"}`} style={{ fontWeight: 800 }}>{tag}</button>)}</div><div className="mt-auto w-full space-y-2 pt-8"><Button variant="primary" fullWidth radius="full" className="h-12 font-bold" onClick={handleSubmitReview} disabled={overallRating === 0} leftIcon={<Send className="h-4 w-4" />}>Submit review</Button><button type="button" onClick={() => setAllDone(true)} className="h-11 w-full text-[0.9375rem] text-muted-foreground" style={{ fontWeight: 800 }}>Skip for now</button></div></div>}
          {step === "review" && reviewSubmitted && <div className="flex flex-1 flex-col items-center justify-center text-center"><StepIntro icon={ThumbsUp} title="Thank you" desc="Your review was submitted." tone="warning" /></div>}
        </motion.div></AnimatePresence></div>
      </div>
    </div>
  );
}

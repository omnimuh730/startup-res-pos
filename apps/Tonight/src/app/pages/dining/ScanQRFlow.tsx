import { useState } from "react";
import { Text, Heading } from "../../components/ds/Text";
import { Button } from "../../components/ds/Button";
import { DSBadge } from "../../components/ds/Badge";
import { Animate } from "../../components/ds/Animate";
import { ImageWithFallback } from "../../components/figma/ImageWithFallback";
import {
  Camera, Check, ChevronLeft, X, UtensilsCrossed, Receipt,
  Star, Send, ThumbsUp, PartyPopper, Shield,
  ChevronRight, Sparkles,
} from "lucide-react";
import {
  STEPS, type ScanStep, type BookingInfo,
  INITIAL_MENU, FULL_MENU, REVIEW_TAGS,
} from "./scanQRData";
import {
  StepProgressBar, QRCodeVisual, ConfettiEffect,
} from "./ScanQRWidgets";
import { UnifiedPayment } from "../shared/UnifiedPayment";

interface ScanQRFlowProps {
  booking: BookingInfo;
  onClose: () => void;
  initialStep?: ScanStep;
}

export function ScanQRFlow({ booking, onClose, initialStep = "scan" }: ScanQRFlowProps) {
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

  const stepIdx = STEPS.findIndex(s => s.id === step);

  const goNext = () => {
    const nextIdx = stepIdx + 1;
    if (nextIdx < STEPS.length) setStep(STEPS[nextIdx].id);
  };

  const goPrev = () => {
    if (stepIdx > 0) setStep(STEPS[stepIdx - 1].id);
  };

  const handleSimulateScan = () => {
    setScanned(true);
    setTimeout(() => setStep("arrived"), 1200);
  };

  const handleRequestBill = () => setStep("bill");

  const handlePaymentComplete = () => {
    setPaymentDone(true);
    setShowConfetti(true);
    setTimeout(() => { setStep("review"); setShowConfetti(false); }, 2000);
  };

  const handleSubmitReview = () => {
    setReviewSubmitted(true);
    setTimeout(() => setAllDone(true), 1500);
  };

  const toggleTag = (t: string) => {
    setSelectedTags(prev => prev.includes(t) ? prev.filter(x => x !== t) : [...prev, t]);
  };

  const ratedSubs = [tasteRating, ambienceRating, serviceRating, valueRating].filter((v): v is number => typeof v === "number");
  const overallRating = ratedSubs.length ? Math.round(ratedSubs.reduce((s, n) => s + n, 0) / ratedSubs.length) : 0;
  const ratingLabel = ["", "Not great", "Could be better", "It was okay", "Glad you enjoyed it!", "Absolutely loved it!"][overallRating] || "";

  // ── All Done Screen ──
  if (allDone) {
    return (
      <div className="fixed inset-0 z-[200] bg-background overflow-y-auto">
        <div className="max-w-md mx-auto px-5 py-6 min-h-screen flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <button onClick={onClose} className="p-2 rounded-full hover:bg-secondary transition cursor-pointer"><ChevronLeft className="w-5 h-5" /></button>
            <button onClick={onClose} className="p-2 rounded-full hover:bg-secondary transition cursor-pointer"><X className="w-5 h-5" /></button>
          </div>

          {/* All steps completed */}
          <div className="flex items-center gap-1 w-full mb-6">
            {STEPS.map(s => (
              <div key={s.id} className="flex-1 flex flex-col items-center gap-1">
                <div className="h-1 w-full rounded-full bg-success" />
                <span className="text-[0.6875rem] text-success" style={{ fontWeight: 600 }}>{s.label}</span>
              </div>
            ))}
          </div>

          <Animate preset="scaleIn" duration={0.5} className="flex-1 flex flex-col items-center pt-8">
            <div className="w-20 h-20 rounded-2xl bg-success/10 flex items-center justify-center mb-5">
              <PartyPopper className="w-10 h-10 text-success" />
            </div>
            <Heading level={2} className="mb-2">All Done!</Heading>
            <Text className="text-muted-foreground text-[0.9375rem] mb-8">
              Thanks for dining at {booking.restaurant}
            </Text>

            {/* Receipt Card */}
            <div className="w-full rounded-2xl border border-border p-5 mb-5">
              <div className="flex items-center justify-between mb-4">
                <Text className="text-[0.9375rem]" style={{ fontWeight: 500 }}>Digital Receipt</Text>
                <DSBadge variant="success" size="sm">Paid</DSBadge>
              </div>
              <div className="space-y-2 text-[0.9375rem]">
                <div className="flex justify-between"><Text className="text-muted-foreground">8 items</Text><Text>${subtotal.toFixed(2)}</Text></div>
                <div className="flex justify-between"><Text className="text-muted-foreground">Tax</Text><Text>${tax.toFixed(2)}</Text></div>
                <div className="flex justify-between"><Text className="text-muted-foreground">Tip</Text><Text>${tip.toFixed(2)}</Text></div>
                <div className="border-t border-border pt-2 flex justify-between">
                  <Text style={{ fontWeight: 600 }}>Total Paid</Text>
                  <Text className="text-primary text-[1.125rem]" style={{ fontWeight: 700 }}>${total.toFixed(2)}</Text>
                </div>
              </div>
            </div>

            {/* Rewards */}
            <div className="w-full rounded-2xl border border-border p-4 flex items-center gap-4 mb-8">
              <div className="w-12 h-12 rounded-full bg-warning/10 flex items-center justify-center shrink-0">
                <Star className="w-6 h-6 text-warning" />
              </div>
              <div className="flex-1">
                <Text style={{ fontWeight: 600 }}>+{Math.floor(total * 2)} Reward Points</Text>
                <Text className="text-muted-foreground text-[0.875rem]">Earned from this visit</Text>
              </div>
              <Sparkles className="w-5 h-5 text-warning" />
            </div>

            <div className="w-full mt-auto space-y-3 pb-8">
              <Button variant="primary" fullWidth radius="full" onClick={onClose}>
                Discover More Restaurants
              </Button>
              <button onClick={onClose} className="w-full text-center text-muted-foreground text-[0.9375rem] py-2">
                Back to My Activity
              </button>
            </div>
          </Animate>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[200] bg-background overflow-y-auto">
      {showConfetti && <ConfettiEffect />}
      <div className="max-w-md mx-auto px-5 py-6 min-h-screen flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <button onClick={stepIdx > 0 ? goPrev : onClose} className="p-2 rounded-full hover:bg-secondary transition cursor-pointer"><ChevronLeft className="w-5 h-5" /></button>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-secondary transition cursor-pointer"><X className="w-5 h-5" /></button>
        </div>

        {/* Step Progress */}
        <StepProgressBar currentStep={step} />

        {/* Content */}
        <div className="flex-1 flex flex-col mt-6">
          <Animate preset="fadeIn" duration={0.3} key={step + (paymentDone ? "-done" : "")}>

            {/* ── SCAN STEP ── */}
            {step === "scan" && (
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-4"><Camera className="w-8 h-8 text-primary" /></div>
                <Heading level={3} className="mb-2">Scan Restaurant QR</Heading>
                <Text className="text-muted-foreground text-[0.9375rem] mb-8 max-w-xs">Point your camera at the QR code on your table to check in</Text>
                <div className="w-full rounded-2xl bg-secondary/50 p-8 mb-6"><QRCodeVisual /></div>
                <div className="flex items-center gap-2 mb-8">
                  <div className={`w-2 h-2 rounded-full ${scanned ? "bg-success" : "bg-primary animate-pulse"}`} />
                  <Text className="text-muted-foreground text-[0.9375rem]">{scanned ? "QR code detected!" : "Scanning for QR code..."}</Text>
                </div>
                <div className="w-full rounded-2xl border border-border p-4 flex items-center gap-3 mb-6">
                  <ImageWithFallback src={booking.image} alt={booking.restaurant} className="w-14 h-14 rounded-xl object-cover shrink-0" />
                  <div className="text-left min-w-0">
                    <Text style={{ fontWeight: 600 }}>{booking.restaurant}</Text>
                    <Text className="text-muted-foreground text-[0.875rem]">{booking.date.includes("16") ? "Tomorrow" : booking.date} · {booking.time} · {booking.guests} guest{booking.guests > 1 ? "s" : ""}</Text>
                    <Text className="text-primary text-[0.8125rem]">Table P1 · {booking.seating}</Text>
                  </div>
                </div>
                <Button variant="primary" fullWidth radius="full" onClick={handleSimulateScan} disabled={scanned} leftIcon={<Camera className="w-4 h-4" />}>
                  {scanned ? "Detected!" : "Simulate QR Scan"}
                </Button>
                <Text className="text-muted-foreground/60 text-[0.8125rem] mt-2">In production, your camera automatically detects the QR code</Text>
              </div>
            )}

            {/* ── ARRIVED STEP ── */}
            {step === "arrived" && (
              <div className="flex flex-col items-center text-center">
                <div className="w-20 h-20 rounded-2xl bg-success/10 flex items-center justify-center mb-5"><Check className="w-10 h-10 text-success" /></div>
                <Heading level={2} className="mb-2">Welcome!</Heading>
                <Text className="text-primary text-[1.125rem] mb-2" style={{ fontWeight: 600 }}>{booking.restaurant}</Text>
                <Text className="text-muted-foreground text-[0.9375rem] mb-8">You've checked in successfully. Your table is ready.</Text>
                <div className="flex items-center gap-4 p-4 rounded-2xl border border-border mb-8">
                  <div className="flex items-center gap-2">
                    <UtensilsCrossed className="w-5 h-5 text-primary" />
                    <div className="text-left"><Text className="text-muted-foreground text-[0.8125rem]">Table</Text><Text style={{ fontWeight: 600 }}>P1</Text></div>
                  </div>
                  <div className="w-px h-10 bg-border" />
                  <div className="flex items-center gap-2">
                    <svg className="w-5 h-5 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M22 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>
                    <div className="text-left"><Text className="text-muted-foreground text-[0.8125rem]">Party</Text><Text style={{ fontWeight: 600 }}>{booking.guests} guest{booking.guests > 1 ? "s" : ""}</Text></div>
                  </div>
                </div>
                <Text className="text-muted-foreground/60 text-[0.9375rem] flex items-center gap-2"><Sparkles className="w-4 h-4" /> Preparing your dining experience...</Text>
                <div className="mt-auto pt-12 w-full"><Button variant="primary" fullWidth radius="full" onClick={goNext}>Continue to Dining</Button></div>
              </div>
            )}

            {/* ── DINING STEP ── */}
            {step === "dining" && (
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-2xl bg-warning/10 flex items-center justify-center mb-4"><UtensilsCrossed className="w-8 h-8 text-warning" /></div>
                <Heading level={3} className="mb-2">Enjoying Your Meal</Heading>
                <Text className="text-muted-foreground text-[0.9375rem] mb-6">Your bill updates in real-time as you order</Text>
                <div className="w-full rounded-2xl border border-border p-4 flex items-center justify-between mb-5">
                  <div className="flex items-center gap-3">
                    <ImageWithFallback src={booking.image} alt={booking.restaurant} className="w-12 h-12 rounded-xl object-cover" />
                    <div className="text-left"><Text style={{ fontWeight: 600 }}>{booking.restaurant}</Text><Text className="text-muted-foreground text-[0.8125rem]">Table P1 · {booking.seating}</Text></div>
                  </div>
                  <DSBadge variant="success" size="sm">Dining</DSBadge>
                </div>
                <div className="w-full rounded-2xl border border-border p-5 text-left mb-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2"><Receipt className="w-5 h-5 text-primary" /><Text style={{ fontWeight: 600 }}>Live Bill</Text></div>
                    <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-warning animate-pulse" /><Text className="text-warning text-[0.8125rem]" style={{ fontWeight: 500 }}>Updating</Text></div>
                  </div>
                  <div className="divide-y divide-border">
                    {INITIAL_MENU.map((item, i) => (
                      <div key={i} className="flex items-center justify-between py-3">
                        <div className="flex items-center gap-3">
                          <span className="text-[1.25rem]">{item.icon}</span>
                          <div><Text className="text-[0.9375rem]">{item.name}</Text>{item.qty > 1 ? <Text className="text-muted-foreground text-[0.8125rem]">x{item.qty}</Text> : <Text className="text-muted-foreground text-[0.8125rem]">Qty: {item.qty}</Text>}</div>
                        </div>
                        <Text style={{ fontWeight: 500 }}>${item.price.toFixed(2)}</Text>
                      </div>
                    ))}
                  </div>
                  <div className="border-t border-border pt-3 mt-1">
                    <div className="flex justify-between">
                      <div><Text className="text-primary" style={{ fontWeight: 600 }}>Running Total</Text><Text className="text-muted-foreground text-[0.8125rem]">{INITIAL_MENU.length} items · Tax calculated at checkout</Text></div>
                      <Text className="text-primary text-[1.125rem]" style={{ fontWeight: 700 }}>${INITIAL_MENU.reduce((s, m) => s + m.price, 0).toFixed(2)}</Text>
                    </div>
                  </div>
                </div>
                <Button variant="primary" fullWidth radius="full" onClick={handleRequestBill} leftIcon={<Receipt className="w-4 h-4" />}>Request Bill</Button>
                <Text className="text-muted-foreground/60 text-[0.8125rem] mt-2">Your server will finalize the bill</Text>
              </div>
            )}

            {/* ── BILL STEP ── */}
            {step === "bill" && (
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-2xl bg-info/10 flex items-center justify-center mb-4"><Receipt className="w-8 h-8 text-info" /></div>
                <Heading level={3} className="mb-2">Your Bill</Heading>
                <Text className="text-muted-foreground text-[0.9375rem] mb-6">Review your order and add a tip</Text>
                <div className="w-full rounded-2xl border border-border p-4 flex items-center gap-3 mb-5">
                  <ImageWithFallback src={booking.image} alt={booking.restaurant} className="w-12 h-12 rounded-xl object-cover" />
                  <div className="text-left"><Text style={{ fontWeight: 600 }}>{booking.restaurant}</Text><Text className="text-muted-foreground text-[0.8125rem]">{booking.date.includes("16") ? "Tomorrow" : booking.date} · Table P1</Text></div>
                </div>
                <div className="w-full rounded-2xl border border-border p-5 text-left mb-5">
                  <div className="divide-y divide-border">
                    {FULL_MENU.map((item, i) => (
                      <div key={i} className="flex items-center justify-between py-2.5">
                        <div className="flex items-center gap-3">
                          <span className="text-[1.125rem]">{item.icon}</span>
                          <div><Text className="text-[0.9375rem]">{item.name}</Text>{item.qty > 1 && <Text className="text-muted-foreground text-[0.8125rem]">x{item.qty}</Text>}</div>
                        </div>
                        <Text style={{ fontWeight: 500 }}>${item.price.toFixed(2)}</Text>
                      </div>
                    ))}
                  </div>
                  <div className="border-t border-border pt-3 mt-1 space-y-1.5">
                    <div className="flex justify-between text-[0.9375rem]"><Text className="text-muted-foreground">Subtotal</Text><Text>${subtotal.toFixed(2)}</Text></div>
                    <div className="flex justify-between text-[0.9375rem]"><Text className="text-muted-foreground">Tax (8.75%)</Text><Text>${tax.toFixed(2)}</Text></div>
                  </div>
                  <div className="border-t border-border pt-3 mt-3">
                    <div className="flex justify-between items-center mb-3"><Text className="text-muted-foreground text-[0.9375rem]">Gratuity</Text><Text style={{ fontWeight: 600 }}>${tip.toFixed(2)}</Text></div>
                    <div className="flex gap-2">
                      {[15, 18, 20, 25].map(p => (
                        <button key={p} onClick={() => setTipPercent(p)} className={`flex-1 py-2 rounded-full text-[0.875rem] transition ${tipPercent === p ? "bg-primary text-primary-foreground" : "bg-secondary text-foreground hover:bg-secondary/80"}`} style={{ fontWeight: tipPercent === p ? 600 : 400 }}>{p}%</button>
                      ))}
                    </div>
                  </div>
                  <div className="border-t border-border pt-3 mt-3 flex justify-between items-center"><Text style={{ fontWeight: 700 }}>Total</Text><Text className="text-primary text-[1.25rem]" style={{ fontWeight: 700 }}>${total.toFixed(2)}</Text></div>
                </div>
                <Button variant="primary" fullWidth radius="full" onClick={goNext}>Continue to Payment</Button>
              </div>
            )}

            {/* ── PAY STEP ── */}
            {step === "pay" && !paymentDone && (
              <UnifiedPayment
                payTo={booking.restaurant}
                payToSub={`${booking.date.includes("16") ? "Tomorrow" : booking.date} - Table P1`}
                amount={total}
                editable={false}
                lineItems={[
                  { label: `Subtotal (8 items)`, value: subtotal },
                  { label: "Tax (8.75%)", value: tax, color: "muted" },
                  { label: "Tip", value: tip, color: "muted" },
                ]}
                showRewards
                onComplete={handlePaymentComplete}
              />
            )}
            {step === "pay" && paymentDone && (
              <div className="flex flex-col items-center text-center pt-8">
                <div className="w-16 h-16 rounded-2xl bg-success/10 flex items-center justify-center mb-4"><Check className="w-8 h-8 text-success" /></div>
                <Heading level={3} className="mb-2">Payment Complete!</Heading>
                <Text className="text-muted-foreground text-[0.9375rem]">Redirecting to review...</Text>
              </div>
            )}

            {/* ─ REVIEW STEP ── */}
            {step === "review" && !reviewSubmitted && (
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-2xl bg-warning/10 flex items-center justify-center mb-4"><Star className="w-8 h-8 text-warning" /></div>
                <Heading level={3} className="mb-2">How was your experience?</Heading>
                <Text className="text-muted-foreground text-[0.9375rem] mb-6">Your feedback helps us improve</Text>
                <div className="w-full rounded-2xl border border-border p-4 flex items-center gap-3 mb-6">
                  <ImageWithFallback src={booking.image} alt={booking.restaurant} className="w-14 h-14 rounded-xl object-cover" />
                  <div className="text-left"><Text style={{ fontWeight: 600 }}>{booking.restaurant}</Text><Text className="text-muted-foreground text-[0.8125rem]">{booking.date.includes("16") ? "Tomorrow" : booking.date} · ${total.toFixed(2)}</Text></div>
                </div>
                {/* Sub-ratings — overall is averaged from these */}
                <div className="w-full mb-4 text-left">
                  <Text className="text-[0.8125rem] text-muted-foreground mb-2">Rate by category <span className="opacity-70">(each is optional)</span></Text>
                  <div className="space-y-2">
                    <SubRatingRow label="Taste" emoji="🍴" value={tasteRating} onChange={setTasteRating} />
                    <SubRatingRow label="Ambience" emoji="✨" value={ambienceRating} onChange={setAmbienceRating} />
                    <SubRatingRow label="Service" emoji="🤝" value={serviceRating} onChange={setServiceRating} />
                    <SubRatingRow label="Value" emoji="💰" value={valueRating} onChange={setValueRating} />
                  </div>
                  {overallRating > 0 && (
                    <Text className="text-warning text-[0.8125rem] mt-2 text-center" style={{ fontWeight: 500 }}>
                      Overall: {overallRating}★ · {ratingLabel}
                    </Text>
                  )}
                </div>

                <div className="w-full mb-4 relative">
                  <textarea value={reviewText} onChange={e => setReviewText(e.target.value)} placeholder="Tell others about your experience... (optional)" maxLength={500} className="w-full h-28 p-4 rounded-xl border border-border bg-card resize-none text-[0.9375rem] focus:outline-none focus:ring-2 focus:ring-primary/30" />
                  <Text className="absolute bottom-3 right-4 text-muted-foreground/50 text-[0.8125rem]">{reviewText.length}/500</Text>
                </div>
                <div className="flex flex-wrap gap-2 mb-8 justify-center">
                  {REVIEW_TAGS.map(t => (
                    <button key={t} onClick={() => toggleTag(t)} className={`px-3 py-1.5 rounded-full text-[0.875rem] border transition ${selectedTags.includes(t) ? "border-primary bg-primary/5 text-primary" : "border-border text-muted-foreground hover:border-primary/40"}`}>{t}</button>
                  ))}
                </div>
                <Button variant="primary" fullWidth radius="full" onClick={handleSubmitReview} disabled={overallRating === 0} leftIcon={<Send className="w-4 h-4" />}>Submit Review</Button>
                <button onClick={() => setAllDone(true)} className="mt-3 text-muted-foreground text-[0.9375rem] py-2">Skip for now</button>
              </div>
            )}

            {/* ── REVIEW SUBMITTED ── */}
            {step === "review" && reviewSubmitted && (
              <div className="flex flex-col items-center text-center pt-8">
                <div className="w-16 h-16 rounded-2xl bg-warning/10 flex items-center justify-center mb-4"><Star className="w-8 h-8 text-warning" /></div>
                <Heading level={3} className="mb-2">How was your experience?</Heading>
                <Text className="text-muted-foreground text-[0.9375rem] mb-10">Your feedback helps us improve</Text>
                <Animate preset="scaleIn" duration={0.4}>
                  <div className="w-20 h-20 rounded-2xl bg-warning/10 flex items-center justify-center mb-4 mx-auto"><ThumbsUp className="w-10 h-10 text-warning" /></div>
                  <Heading level={3} className="mb-1">Thank you!</Heading>
                  <Text className="text-muted-foreground text-[0.9375rem]">Your review has been submitted</Text>
                </Animate>
              </div>
            )}

          </Animate>
        </div>
      </div>
    </div>
  );
}

function SubRatingRow({ label, emoji, value, onChange }: { label: string; emoji: string; value: number | null; onChange: (v: number | null) => void }) {
  return (
    <div className="flex items-center justify-between p-2.5 rounded-xl bg-secondary/40">
      <div className="flex items-center gap-2">
        <span className="text-[0.875rem]">{emoji}</span>
        <span className="text-[0.875rem]" style={{ fontWeight: 500 }}>{label}</span>
      </div>
      <div className="flex items-center gap-1">
        {Array.from({ length: 5 }).map((_, i) => (
          <button key={i} onClick={() => onChange(i + 1)} className="cursor-pointer p-0.5">
            <Star className={`w-6 h-6 transition ${value !== null && i < value ? "fill-warning text-warning" : "text-border hover:text-warning/50"}`} />
          </button>
        ))}
        <button
          onClick={() => onChange(value === null ? 5 : null)}
          className="ml-1 text-[0.6875rem] text-muted-foreground hover:text-foreground cursor-pointer underline underline-offset-2"
        >
          {value === null ? "Rate" : "Skip"}
        </button>
      </div>
    </div>
  );
}
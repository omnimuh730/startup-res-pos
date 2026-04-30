/* Subscription Page — plan selection, payment, confirmation */
import { useState, useSyncExternalStore } from "react";
import { Card } from "../../../components/ds/Card";
import { Text } from "../../../components/ds/Text";
import { Button } from "../../../components/ds/Button";
import { Modal, ModalHeader, ModalBody, ModalFooter } from "../../../components/ds/Modal";
import { DSBadge } from "../../../components/ds/Badge";
import { Crown, Star, TrendingUp, Gift, Lock, Check, Wallet } from "lucide-react";
import { subscribePlan, getPlanSnapshot, getPlan, activatePro, cancelPro, PLAN_PRICES, type BillingCycle } from "../../../stores/subscriptionStore";
import { PageHeader } from "../profileHelpers";

export function SubscriptionPage({ onBack }: { onBack: () => void }) {
  const [step, setStep] = useState<"plan" | "payment" | "processing" | "confirmed">("plan");
  const [cycle, setCycle] = useState<BillingCycle>("yearly");
  useSyncExternalStore(subscribePlan, getPlanSnapshot);
  
  const plan = getPlan();
  const isAlreadyPro = plan.type === "pro";
  
  const handlePayment = () => { 
    setStep("processing"); 
    setTimeout(() => { 
      activatePro(cycle); 
      setStep("confirmed"); 
    }, 2000); 
  };
  
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const confirmCancel = () => { cancelPro(); setShowCancelConfirm(false); };
  
  const selectedPrice = PLAN_PRICES[cycle];

  if (isAlreadyPro && step === "plan") {
    return (
      <div className="pb-4">
        <PageHeader title="Subscription" onBack={onBack} />
        <div className="px-5 pt-1">
          <div className="mb-4 text-center">
            <div className="flex items-center justify-center gap-2">
              <Crown className="h-6 w-6 shrink-0 text-foreground" strokeWidth={2} />
              <Text className="text-[22px] font-bold leading-none text-foreground">CatchTable Pro</Text>
            </div>
            <div className="mt-1.5 flex justify-center">
              <DSBadge color="success" size="sm">Active</DSBadge>
            </div>
          </div>

          <Card variant="default" padding="sm" radius="lg" className="mb-4 border-border shadow-sm">
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Text className="text-muted-foreground text-[13px]">Plan</Text>
                <Text className="text-[14px] font-semibold">{PLAN_PRICES[plan.cycle || "monthly"].label}</Text>
              </div>
              <div className="flex justify-between items-center">
                <Text className="text-muted-foreground text-[13px]">Price</Text>
                <Text className="text-[14px] font-semibold">${PLAN_PRICES[plan.cycle || "monthly"].price}/cycle</Text>
              </div>
              <div className="flex justify-between items-center">
                <Text className="text-muted-foreground text-[13px]">Next billing</Text>
                <Text className="text-[14px] font-semibold">
                  {plan.expiresAt ? new Date(plan.expiresAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "\u2014"}
                </Text>
              </div>
              <div className="flex justify-between items-center">
                <Text className="text-muted-foreground text-[13px]">Member since</Text>
                <Text className="text-[14px] font-semibold">
                  {plan.subscribedAt ? new Date(plan.subscribedAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "\u2014"}
                </Text>
              </div>
            </div>
          </Card>

          <div className="mb-4">
            <Text className="mb-2 text-[15px] font-bold text-foreground">Pro Benefits</Text>
            <div className="space-y-2">
              {["Unlimited reservations", "Priority booking access", "Exclusive restaurant deals", "No booking fees", "Early access to new restaurants", "Personal dining concierge"].map(b => (
                <div key={b} className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-foreground shrink-0" />
                  <Text className="text-[14px] text-foreground">{b}</Text>
                </div>
              ))}
            </div>
          </div>

          <Button variant="ghost" onClick={() => setShowCancelConfirm(true)} className="h-11 w-full rounded-full font-semibold text-destructive hover:text-destructive">
            Cancel Subscription
          </Button>

          <Modal open={showCancelConfirm} onClose={() => setShowCancelConfirm(false)}>
            <ModalHeader>Cancel Subscription</ModalHeader>
            <ModalBody>
              <Text className="text-[14px] text-muted-foreground leading-relaxed">
                Are you sure you want to cancel your PRO subscription? You'll lose access to all premium features at the end of your current billing period.
              </Text>
            </ModalBody>
            <ModalFooter>
              <Button variant="ghost" onClick={() => setShowCancelConfirm(false)} className="rounded-full font-semibold">Keep Plan</Button>
              <Button variant="destructive" onClick={confirmCancel} className="rounded-full font-semibold">Yes, Cancel</Button>
            </ModalFooter>
          </Modal>
        </div>
      </div>
    );
  }

  if (step === "confirmed") {
    return (
      <div className="pb-4">
        <PageHeader title="Subscription" onBack={onBack} />
        <div className="flex flex-col items-center justify-center px-5 py-8 text-center">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-foreground">
            <Check className="h-7 w-7 text-background" />
          </div>
          <Text className="mb-0.5 text-[22px] font-bold text-foreground">Welcome to Pro</Text>
          <Text className="mb-4 text-[14px] text-muted-foreground">Your subscription is now active.</Text>
          
          <Card variant="filled" padding="sm" radius="lg" className="mb-4 w-full border-0 bg-secondary/50">
            <Text className="text-foreground text-[14px] font-semibold mb-0.5">{selectedPrice.label} plan</Text>
            <Text className="text-muted-foreground text-[13px]">${selectedPrice.price} / {cycle === "monthly" ? "mo" : cycle === "quarterly" ? "qtr" : "yr"}</Text>
          </Card>

          <Button variant="primary" onClick={onBack} className="h-11 w-full rounded-full text-[15px] font-bold">
            Start Exploring
          </Button>
        </div>
      </div>
    );
  }

  if (step === "processing") {
    return (
      <div className="flex h-screen flex-col pb-4">
        <PageHeader title="Confirming" onBack={() => {}} />
        <div className="flex flex-1 flex-col items-center justify-center px-5 pb-16 text-center">
          <div className="mb-4 h-11 w-11 animate-spin rounded-full border-4 border-secondary border-t-foreground" />
          <Text className="text-[20px] font-bold text-foreground">Processing Payment</Text>
          <Text className="text-muted-foreground text-[14px] mt-1">Please wait while we confirm your subscription</Text>
        </div>
      </div>
    );
  }

  if (step === "payment") {
    const canPay = selectedPrice.price <= 24.50; // hardcoded balance check for demo
    return (
      <div className="pb-4">
        <PageHeader title="Confirm and pay" onBack={() => setStep("plan")} />
        <div className="px-5 pt-1">
          
          {/* Summary Box */}
          <div className="mb-4">
            <div className="mb-2 flex items-start justify-between">
              <div>
                <Text className="text-[16px] font-bold text-foreground">CatchTable Pro</Text>
                <Text className="text-muted-foreground text-[14px] mt-0.5">{selectedPrice.label} plan</Text>
              </div>
              <Text className="text-[16px] font-bold text-foreground">${selectedPrice.price}</Text>
            </div>
            {selectedPrice.discount > 0 && (
              <div className="bg-success/10 rounded-md px-2.5 py-1.5 inline-block">
                <Text className="text-success text-[12px] font-bold">Includes {selectedPrice.discount}% discount</Text>
              </div>
            )}
          </div>

          <div className="mb-4 h-px w-full bg-border" />

          {/* Payment Method */}
          <Text className="mb-2 text-[15px] font-bold text-foreground">Pay with</Text>
          <div className="mb-4 flex items-center gap-2.5 rounded-xl border border-border p-3">
            <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center shrink-0">
              <Wallet className="w-5 h-5 text-foreground" />
            </div>
            <div className="flex-1">
              <Text className="text-[14px] font-semibold text-foreground">Available Balance</Text>
              <Text className="text-muted-foreground text-[13px] mt-0.5">$24.50 available</Text>
            </div>
            <div className="w-4 h-4 rounded-full border-[5px] border-foreground shrink-0" />
          </div>

          {/* Footer Actions */}
          <div className="space-y-3">
            <div className="flex items-start gap-2">
              <Lock className="w-3.5 h-3.5 text-muted-foreground shrink-0 mt-0.5" />
              <Text className="text-muted-foreground text-[12px] leading-relaxed">
                Your payment is secure. By confirming, you agree to our terms of service and acknowledge that your subscription will auto-renew.
              </Text>
            </div>
            <Button 
              variant="primary" 
              onClick={handlePayment} 
              disabled={!canPay} 
              className="h-11 w-full rounded-full text-[15px] font-bold"
            >
              Pay ${selectedPrice.price}
            </Button>
            {!canPay && (
              <Text className="text-primary text-[12px] font-semibold text-center flex justify-center items-center gap-1">
                Insufficient balance. Please top up first.
              </Text>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-[calc(100dvh-var(--app-bottom-nav-height,0px)-3rem)] flex-col">
      <PageHeader title="Upgrade" onBack={onBack} />
      <div className="flex flex-1 flex-col px-5 pt-0">
        
        {/* Header Area */}
        <div className="mb-4 text-center">
          <div className="flex items-center justify-center gap-2">
            <Crown className="h-6 w-6 shrink-0 text-foreground" strokeWidth={2} />
            <Text className="text-[22px] font-bold leading-tight text-foreground">CatchTable Pro</Text>
          </div>
          <Text className="mt-1 text-[13px] text-muted-foreground">Unlock the ultimate dining experience.</Text>
        </div>

        {/* Benefits Section */}
        <div className="mb-4">
          <Text className="mb-2 text-[15px] font-bold text-foreground">Pro benefits</Text>
          <div className="space-y-2.5">
            {[
              { icon: Star, label: "Unlimited Reservations", desc: "Book as many tables as you want" },
              { icon: TrendingUp, label: "Priority Booking", desc: "Earlier access to limited reservations" },
              { icon: Wallet, label: "No Booking Fees", desc: "Save on every reservation" },
              { icon: Gift, label: "Exclusive Deals", desc: "Members-only discounts & offers" }
            ].map((b, i) => (
              <div key={i} className="flex items-start gap-2.5">
                <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center">
                  <b.icon className="h-4 w-4 text-foreground" strokeWidth={1.5} />
                </div>
                <div>
                  <Text className="text-[13px] font-semibold text-foreground">{b.label}</Text>
                  <Text className="mt-0.5 text-[11px] text-muted-foreground">{b.desc}</Text>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Pricing Plan Section */}
        <div className="mb-6">
          <Text className="text-[16px] font-bold text-foreground mb-3">Choose your plan</Text>
          <div className="space-y-2.5">
            {(Object.entries(PLAN_PRICES) as [BillingCycle, typeof PLAN_PRICES["monthly"]][]).map(([key, p]) => {
              const isSelected = cycle === key;
              return (
                <button 
                  key={key} 
                  onClick={() => setCycle(key)}
                  className={`w-full flex items-center justify-between p-3.5 rounded-xl transition-all text-left cursor-pointer ${
                    isSelected 
                      ? "border-[2px] border-foreground bg-card" 
                      : "border border-border bg-card hover:border-foreground/30"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ${
                      isSelected ? "border-[5px] border-foreground" : "border-border"
                    }`} />
                    <div>
                      <div className="flex items-center gap-2 mb-0.5">
                        <Text className="text-[14px] font-semibold text-foreground">{p.label}</Text>
                    {p.discount > 0 && (
                          <span className="bg-success/10 text-success text-[10px] px-1.5 py-0.5 rounded-md font-bold uppercase tracking-wide">
                            Save {p.discount}%
                          </span>
                        )}
                      </div>
                      <Text className="text-muted-foreground text-[12px]">${p.perMonth.toFixed(2)} / month</Text>
                      </div>
                  </div>
                  <Text className="text-[15px] font-bold text-foreground">${p.price}</Text>
                 </button>
              );
            })}
          </div>
        </div>

        <div className="min-h-4 flex-1" aria-hidden="true" />

        {/* CTA */}
        <div className="pt-4 pb-[calc(var(--app-bottom-nav-overhang,0px)+0.5rem)]">
          <Button variant="primary" onClick={() => setStep("payment")} className="h-12 w-full rounded-full text-[15px] font-bold">
            Continue to Payment
          </Button>
          <Text className="mt-2 text-center text-[11px] text-muted-foreground">
            Cancel anytime. No hidden fees.
          </Text>
        </div>
      </div>
    </div>
  );
}

/* Subscription Page — plan selection, payment, confirmation */
import { useState, useSyncExternalStore } from "react";
import { Card } from "../../components/ds/Card";
import { Text } from "../../components/ds/Text";
import { Button } from "../../components/ds/Button";
import { Modal, ModalHeader, ModalBody, ModalFooter } from "../../components/ds/Modal";
import { DSBadge } from "../../components/ds/Badge";
import { Crown, Star, TrendingUp, Gift, Users, Lock, Check, Wallet } from "lucide-react";
import { subscribePlan, getPlanSnapshot, getPlan, activatePro, cancelPro, PLAN_PRICES, type BillingCycle } from "../../stores/subscriptionStore";
import { PageHeader } from "./profileHelpers";

export function SubscriptionPage({ onBack }: { onBack: () => void }) {
  const [step, setStep] = useState<"plan" | "payment" | "processing" | "confirmed">("plan");
  const [cycle, setCycle] = useState<BillingCycle>("yearly");
  useSyncExternalStore(subscribePlan, getPlanSnapshot);
  const plan = getPlan();
  const isAlreadyPro = plan.type === "pro";
  const handlePayment = () => { setStep("processing"); setTimeout(() => { activatePro(cycle); setStep("confirmed"); }, 2000); };
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const confirmCancel = () => { cancelPro(); setShowCancelConfirm(false); };
  const selectedPrice = PLAN_PRICES[cycle];

  if (isAlreadyPro && step === "plan") {
    return (
      <div className="pb-8">
        <PageHeader title="Subscription" onBack={onBack} />
        <div className="text-center mb-6">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3"><Crown className="w-8 h-8 text-primary" /></div>
          <Text className="text-[1.25rem]" style={{ fontWeight: 700 }}>CatchTable Pro</Text>
          <DSBadge color="success" size="sm" className="mt-2">Active</DSBadge>
        </div>
        <Card variant="default" padding="md" radius="lg" className="mb-4">
          <div className="space-y-3">
            <div className="flex justify-between"><Text className="text-muted-foreground text-[0.8125rem]">Plan</Text><Text className="text-[0.8125rem]" style={{ fontWeight: 600 }}>{PLAN_PRICES[plan.cycle || "monthly"].label}</Text></div>
            <div className="flex justify-between"><Text className="text-muted-foreground text-[0.8125rem]">Price</Text><Text className="text-[0.8125rem]" style={{ fontWeight: 600 }}>${PLAN_PRICES[plan.cycle || "monthly"].price}/cycle</Text></div>
            <div className="flex justify-between"><Text className="text-muted-foreground text-[0.8125rem]">Next billing</Text><Text className="text-[0.8125rem]" style={{ fontWeight: 600 }}>{plan.expiresAt ? new Date(plan.expiresAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "\u2014"}</Text></div>
            <div className="flex justify-between"><Text className="text-muted-foreground text-[0.8125rem]">Member since</Text><Text className="text-[0.8125rem]" style={{ fontWeight: 600 }}>{plan.subscribedAt ? new Date(plan.subscribedAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "\u2014"}</Text></div>
          </div>
        </Card>
        <Card variant="default" padding="md" radius="lg" className="mb-6">
          <Text className="text-[0.8125rem] mb-3" style={{ fontWeight: 600 }}>Pro Benefits</Text>
          {["Unlimited reservations", "Priority booking access", "Exclusive restaurant deals", "No booking fees", "Early access to new restaurants", "Personal dining concierge"].map(b => (
            <div key={b} className="flex items-center gap-2 py-1.5"><Check className="w-4 h-4 text-success shrink-0" /><Text className="text-[0.8125rem]">{b}</Text></div>
          ))}
        </Card>
        <Button variant="ghost" onClick={() => setShowCancelConfirm(true)} className="w-full text-destructive hover:text-destructive">Cancel Subscription</Button>
        <Modal open={showCancelConfirm} onClose={() => setShowCancelConfirm(false)}>
          <ModalHeader>Cancel Subscription</ModalHeader>
          <ModalBody><Text className="text-[0.8125rem] text-muted-foreground">Are you sure you want to cancel your PRO subscription? You'll lose access to all premium features at the end of your current billing period.</Text></ModalBody>
          <ModalFooter><Button variant="ghost" onClick={() => setShowCancelConfirm(false)}>Keep Plan</Button><Button variant="destructive" onClick={confirmCancel}>Yes, Cancel</Button></ModalFooter>
        </Modal>
      </div>
    );
  }

  if (step === "confirmed") {
    return (
      <div className="pb-8">
        <PageHeader title="Subscription" onBack={onBack} />
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="w-20 h-20 rounded-full bg-success/10 flex items-center justify-center mb-4"><Check className="w-10 h-10 text-success" /></div>
          <Text className="text-[1.375rem] mb-2" style={{ fontWeight: 700 }}>Welcome to Pro!</Text>
          <Text className="text-muted-foreground text-[0.875rem] mb-1">Your subscription is now active.</Text>
          <Text className="text-muted-foreground text-[0.8125rem] mb-6">{selectedPrice.label} plan · ${selectedPrice.price}/{cycle === "monthly" ? "mo" : cycle === "quarterly" ? "qtr" : "yr"}</Text>
          <div className="w-full max-w-xs space-y-2 text-left mb-8">
            {["Unlimited reservations", "Priority booking access", "Exclusive restaurant deals", "No booking fees"].map(b => (
              <div key={b} className="flex items-center gap-2"><Check className="w-4 h-4 text-success shrink-0" /><Text className="text-[0.8125rem]">{b}</Text></div>
            ))}
          </div>
          <Button variant="primary" onClick={onBack} className="w-full max-w-xs">Done</Button>
        </div>
      </div>
    );
  }

  if (step === "processing") {
    return (
      <div className="pb-8">
        <PageHeader title="Subscription" onBack={() => {}} />
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-16 h-16 rounded-full border-4 border-primary/20 border-t-primary animate-spin mb-6" />
          <Text className="text-[1.125rem]" style={{ fontWeight: 600 }}>Processing Payment...</Text>
          <Text className="text-muted-foreground text-[0.8125rem] mt-2">Please wait while we confirm your subscription.</Text>
        </div>
      </div>
    );
  }

  if (step === "payment") {
    const canPay = selectedPrice.price <= 24.50; // balance check
    return (
      <div className="pb-8">
        <PageHeader title="Payment" onBack={() => setStep("plan")} />
        <Card variant="filled" padding="md" radius="lg" className="mb-5">
          <div className="flex items-center justify-between mb-2">
            <Text className="text-[0.8125rem]" style={{ fontWeight: 600 }}>CatchTable Pro — {selectedPrice.label}</Text>
            <DSBadge color="primary" size="sm">{selectedPrice.discount > 0 ? `Save ${selectedPrice.discount}%` : "Standard"}</DSBadge>
          </div>
          <div className="flex items-baseline gap-1">
            <Text className="text-[1.5rem]" style={{ fontWeight: 700 }}>${selectedPrice.price}</Text>
            <Text className="text-muted-foreground text-[0.8125rem]">/{cycle === "monthly" ? "month" : cycle === "quarterly" ? "quarter" : "year"}</Text>
          </div>
          {selectedPrice.discount > 0 && <Text className="text-success text-[0.75rem] mt-1" style={{ fontWeight: 500 }}>That's ${selectedPrice.perMonth.toFixed(2)}/month</Text>}
        </Card>
        <div className="p-4 rounded-xl border border-border space-y-2 mb-5">
          <div className="flex justify-between text-[0.875rem]">
            <Text className="text-muted-foreground">Subscription</Text>
            <Text>${selectedPrice.price.toFixed(2)}</Text>
          </div>
          <div className="border-t border-border pt-2 mt-1 flex justify-between">
            <Text style={{ fontWeight: 700 }}>Total</Text>
            <Text className="text-[1.125rem]" style={{ fontWeight: 700 }}>${selectedPrice.price.toFixed(2)}</Text>
          </div>
        </div>
        <div className="p-4 rounded-xl bg-secondary flex items-center gap-3 mb-5">
          <Wallet className="w-5 h-5 text-muted-foreground" />
          <div className="flex-1">
            <Text className="text-[0.8125rem]" style={{ fontWeight: 500 }}>Pay from Balance</Text>
            <Text className="text-muted-foreground text-[0.6875rem]">Available: $24.50</Text>
          </div>
          <DSBadge variant="outline" size="sm">Default</DSBadge>
        </div>
        <div className="flex items-center gap-2 mb-6 p-3 rounded-xl bg-secondary">
          <Lock className="w-4 h-4 text-muted-foreground shrink-0" />
          <Text className="text-muted-foreground text-[0.75rem]">Payment will be deducted from your balance. You can top up anytime.</Text>
        </div>
        <Button variant="primary" onClick={handlePayment} disabled={!canPay} className="w-full">Pay ${selectedPrice.price}</Button>
        {!canPay && <Text className="text-destructive text-[0.75rem] text-center mt-2">Insufficient balance. Please top up first.</Text>}
      </div>
    );
  }

  return (
    <div className="pb-8">
      <PageHeader title="Upgrade to Pro" onBack={onBack} />
      <div className="text-center mb-6">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center mx-auto mb-3 shadow-lg"><Crown className="w-8 h-8 text-white" /></div>
        <Text className="text-[1.25rem]" style={{ fontWeight: 700 }}>CatchTable Pro</Text>
        <Text className="text-muted-foreground text-[0.875rem] mt-1">Unlock the ultimate dining experience</Text>
      </div>
      <Card variant="default" padding="md" radius="lg" className="mb-6">
        {[
          { icon: Star, label: "Unlimited Reservations", desc: "Book as many tables as you want" },
          { icon: TrendingUp, label: "Priority Booking", desc: "Earlier access to limited reservations" },
          { icon: Gift, label: "Exclusive Deals", desc: "Members-only discounts & offers" },
          { icon: Wallet, label: "No Booking Fees", desc: "Save on every reservation" },
          { icon: Crown, label: "Early Access", desc: "Be first to try new restaurants" },
          { icon: Users, label: "Dining Concierge", desc: "Personal dining recommendations" },
        ].map((b, i) => (
          <div key={i} className="flex items-start gap-3 py-2.5 border-b border-border last:border-0">
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-0.5"><b.icon className="w-4 h-4 text-primary" /></div>
            <div><Text className="text-[0.875rem]" style={{ fontWeight: 600 }}>{b.label}</Text><Text className="text-muted-foreground text-[0.75rem]">{b.desc}</Text></div>
          </div>
        ))}
      </Card>
      <Text className="text-[0.875rem] mb-3" style={{ fontWeight: 600 }}>Choose Your Plan</Text>
      <div className="space-y-2.5 mb-6">
        {(Object.entries(PLAN_PRICES) as [BillingCycle, typeof PLAN_PRICES["monthly"]][]).map(([key, p]) => (
          <button key={key} onClick={() => setCycle(key)}
            className={`w-full flex items-center justify-between p-4 rounded-2xl border-2 transition text-left cursor-pointer ${cycle === key ? "border-primary bg-primary/5" : "border-border hover:border-muted-foreground/30"}`}>
            <div className="flex items-center gap-3">
              <div className={`w-5 h-5 rounded-full border-2 relative shrink-0 ${cycle === key ? "border-primary" : "border-muted-foreground/40"}`}>
                {cycle === key && <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full bg-primary" />}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <Text className="text-[0.9375rem]" style={{ fontWeight: 600 }}>{p.label}</Text>
                  {p.discount > 0 && <span className="bg-success/10 text-success text-[0.6875rem] px-1.5 py-0.5 rounded-full" style={{ fontWeight: 700 }}>Save {p.discount}%</span>}
                  {key === "yearly" && <span className="bg-primary/10 text-primary text-[0.6875rem] px-1.5 py-0.5 rounded-full" style={{ fontWeight: 700 }}>Best Value</span>}
                </div>
                <Text className="text-muted-foreground text-[0.75rem]">${p.perMonth.toFixed(2)}/month</Text>
              </div>
            </div>
            <Text className="text-[1rem]" style={{ fontWeight: 700 }}>${p.price}</Text>
          </button>
        ))}
      </div>
      <Button variant="primary" onClick={() => setStep("payment")} className="w-full">Continue to Payment</Button>
      <Text className="text-muted-foreground text-[0.6875rem] text-center mt-3">Cancel anytime. No hidden fees.</Text>
    </div>
  );
}
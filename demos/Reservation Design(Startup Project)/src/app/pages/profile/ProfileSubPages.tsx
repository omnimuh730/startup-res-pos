/* Profile sub-pages: Edit, TopUp, SendGift, History, Orders, ThisMonth */
import { useState } from "react";
import { Card } from "../../components/ds/Card";
import { Text } from "../../components/ds/Text";
import { Button } from "../../components/ds/Button";
import { Avatar } from "../../components/ds/Avatar";
import { Input } from "../../components/ds/Input";
import { ProgressBar } from "../../components/ds/ProgressBar";
import { DSBadge } from "../../components/ds/Badge";
import {
  Gift, ShoppingBag, Plus, Minus, Send, Star, X, Check, MapPin,
  Wallet, Shield, ArrowRight, Zap, Building2, Smartphone, Globe, Lock, Sparkles,
} from "lucide-react";
import { PageHeader } from "./profileHelpers";

export function ProfileEditPage({ onBack }: { onBack: () => void }) {
  const [name, setName] = useState("Alex Chen");
  const [phone, setPhone] = useState("+1 (555) 234-5678");
  const [username, setUsername] = useState("alexchen");
  return (
    <div className="pb-8">
      <PageHeader title="Edit Profile" onBack={onBack} />
      <div className="flex flex-col items-center mb-6">
        <Avatar name="Alex Chen" size="2xl" className="mb-3" />
        <Button variant="link" size="xs">Change Photo</Button>
      </div>
      <div className="space-y-4">
        <Input label="Full Name" value={name} onChange={e => setName(e.target.value)} fullWidth />
        <Input label="Phone Number" value={phone} onChange={e => setPhone(e.target.value)} fullWidth />
        <Input label="Username" value={username} onChange={e => setUsername(e.target.value)} fullWidth />
      </div>
      <div className="flex gap-3 mt-6">
        <Button variant="ghost" onClick={onBack} className="flex-1">Cancel</Button>
        <Button variant="primary" onClick={onBack} className="flex-1">Save Changes</Button>
      </div>
    </div>
  );
}

/* ── Payment Methods for Top Up ─────────────────── */
const PAYMENT_PROVIDERS = [
  { id: "apple", name: "Apple Pay", icon: <Smartphone className="w-5 h-5" />, color: "bg-foreground text-background", desc: "Instant" },
  { id: "google", name: "Google Pay", icon: <Globe className="w-5 h-5" />, color: "bg-blue-500 text-white", desc: "Instant" },
  { id: "paypal", name: "PayPal", icon: <Zap className="w-5 h-5" />, color: "bg-blue-600 text-white", desc: "1-2 min" },
  { id: "bank", name: "Bank Transfer", icon: <Building2 className="w-5 h-5" />, color: "bg-emerald-600 text-white", desc: "1-3 days" },
] as const;

const TOPUP_PRESETS = [10, 25, 50, 100, 200, 500];

export function TopUpPage({ onBack }: { onBack: () => void }) {
  const [amount, setAmount] = useState(50);
  const [customAmount, setCustomAmount] = useState("");
  const [selectedProvider, setSelectedProvider] = useState<string | null>(null);
  const [step, setStep] = useState<"select" | "confirm" | "processing" | "done">("select");

  const activeAmount = customAmount ? Number(customAmount) : amount;
  const bonus = activeAmount >= 100 ? Math.floor(activeAmount * 0.05) : activeAmount >= 50 ? Math.floor(activeAmount * 0.02) : 0;

  const handleConfirm = () => {
    setStep("processing");
    setTimeout(() => setStep("done"), 2200);
  };

  if (step === "done") {
    return (
      <div className="pb-8">
        <PageHeader title="Top Up" onBack={onBack} />
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="relative w-20 h-20 mb-5">
            <div className="absolute inset-0 rounded-full bg-success/10 animate-ping" style={{ animationDuration: "2s", animationIterationCount: "3" }} />
            <div className="relative w-20 h-20 rounded-full bg-success/15 flex items-center justify-center">
              <Check className="w-10 h-10 text-success" />
            </div>
          </div>
          <Text className="text-[1.375rem] mb-2" style={{ fontWeight: 700 }}>Top Up Successful!</Text>
          <Text className="text-muted-foreground text-[0.875rem] mb-1">${activeAmount.toFixed(2)} added to your balance</Text>
          {bonus > 0 && (
            <div className="flex items-center gap-1.5 mt-2 px-3 py-1.5 rounded-full bg-success/10 border border-success/20">
              <Sparkles className="w-3.5 h-3.5 text-success" />
              <Text className="text-success text-[0.8125rem]" style={{ fontWeight: 600 }}>+${bonus} bonus added!</Text>
            </div>
          )}
          <div className="w-full mt-8 p-4 rounded-2xl border border-border">
            <div className="flex justify-between text-[0.875rem] mb-2">
              <Text className="text-muted-foreground">Previous Balance</Text>
              <Text>$24.50</Text>
            </div>
            <div className="flex justify-between text-[0.875rem] mb-2">
              <Text className="text-muted-foreground">Top Up</Text>
              <Text className="text-success">+${activeAmount.toFixed(2)}</Text>
            </div>
            {bonus > 0 && (
              <div className="flex justify-between text-[0.875rem] mb-2">
                <Text className="text-success flex items-center gap-1"><Sparkles className="w-3 h-3" /> Bonus</Text>
                <Text className="text-success">+${bonus.toFixed(2)}</Text>
              </div>
            )}
            <div className="border-t border-border pt-2 mt-1 flex justify-between">
              <Text style={{ fontWeight: 700 }}>New Balance</Text>
              <Text className="text-[1.125rem]" style={{ fontWeight: 700 }}>${(24.50 + activeAmount + bonus).toFixed(2)}</Text>
            </div>
          </div>
          <div className="w-full mt-6 space-y-2">
            <Button variant="primary" fullWidth onClick={onBack}>Done</Button>
          </div>
        </div>
      </div>
    );
  }

  if (step === "processing") {
    return (
      <div className="pb-8">
        <PageHeader title="Processing" onBack={() => {}} />
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-16 h-16 rounded-full border-4 border-primary/20 border-t-primary animate-spin mb-6" />
          <Text className="text-[1.125rem]" style={{ fontWeight: 600 }}>Processing Payment...</Text>
          <Text className="text-muted-foreground text-[0.8125rem] mt-2">
            Connecting to {PAYMENT_PROVIDERS.find(p => p.id === selectedProvider)?.name}
          </Text>
        </div>
      </div>
    );
  }

  if (step === "confirm") {
    const provider = PAYMENT_PROVIDERS.find(p => p.id === selectedProvider)!;
    return (
      <div className="pb-8">
        <PageHeader title="Confirm Top Up" onBack={() => setStep("select")} />
        <div className="space-y-4">
          {/* Summary Card */}
          <div className="relative rounded-2xl overflow-hidden p-5" style={{ background: "linear-gradient(135deg, var(--primary) 0%, color-mix(in srgb, var(--primary) 60%, #000) 100%)" }}>
            <div className="absolute top-0 right-0 w-24 h-24 rounded-full bg-white/5 -translate-y-1/2 translate-x-1/2" />
            <div className="relative z-10 text-center">
              <Text className="text-white/60 text-[0.75rem]" style={{ fontWeight: 500 }}>TOP UP AMOUNT</Text>
              <div className="flex items-baseline justify-center gap-1 mt-1">
                <Text className="text-white text-[0.75rem]">$</Text>
                <Text className="text-white text-[2.5rem]" style={{ fontWeight: 700 }}>{activeAmount}</Text>
                <Text className="text-white/60 text-[1rem]">.00</Text>
              </div>
              {bonus > 0 && (
                <div className="inline-flex items-center gap-1 mt-2 px-3 py-1 rounded-full bg-white/15">
                  <Sparkles className="w-3 h-3 text-white" />
                  <Text className="text-white text-[0.75rem]" style={{ fontWeight: 600 }}>+${bonus} bonus included</Text>
                </div>
              )}
            </div>
          </div>

          {/* Payment Method */}
          <div className="p-4 rounded-xl border border-border">
            <Text className="text-[0.75rem] text-muted-foreground mb-2" style={{ fontWeight: 500 }}>PAYMENT METHOD</Text>
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl ${provider.color} flex items-center justify-center shrink-0`}>
                {provider.icon}
              </div>
              <div className="flex-1">
                <Text className="text-[0.9375rem]" style={{ fontWeight: 600 }}>{provider.name}</Text>
                <Text className="text-muted-foreground text-[0.75rem]">{provider.desc}</Text>
              </div>
              <button onClick={() => setStep("select")} className="text-primary text-[0.8125rem]" style={{ fontWeight: 500 }}>Change</button>
            </div>
          </div>

          {/* Breakdown */}
          <div className="p-4 rounded-xl border border-border space-y-2">
            <div className="flex justify-between text-[0.875rem]">
              <Text className="text-muted-foreground">Top Up Amount</Text>
              <Text>${activeAmount.toFixed(2)}</Text>
            </div>
            <div className="flex justify-between text-[0.875rem]">
              <Text className="text-muted-foreground">Processing Fee</Text>
              <Text className="text-success">FREE</Text>
            </div>
            {bonus > 0 && (
              <div className="flex justify-between text-[0.875rem]">
                <Text className="text-success flex items-center gap-1"><Sparkles className="w-3 h-3" /> Bonus</Text>
                <Text className="text-success">+${bonus.toFixed(2)}</Text>
              </div>
            )}
            <div className="border-t border-border pt-2 mt-1 flex justify-between">
              <Text style={{ fontWeight: 700 }}>You Pay</Text>
              <Text className="text-[1.125rem]" style={{ fontWeight: 700 }}>${activeAmount.toFixed(2)}</Text>
            </div>
          </div>

          {/* Security */}
          <div className="flex items-center justify-center gap-2 text-[0.75rem] text-muted-foreground">
            <Lock className="w-3.5 h-3.5 text-success" />
            <span>Secured by {provider.name} · 256-bit encryption</span>
          </div>

          <Button variant="primary" fullWidth radius="full" onClick={handleConfirm} className="!mt-6">
            Pay ${activeAmount.toFixed(2)} with {provider.name}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="pb-8">
      <PageHeader title="Top Up Balance" onBack={onBack} />

      {/* Current Balance */}
      <div className="text-center mb-5">
        <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-3">
          <Wallet className="w-7 h-7 text-primary" />
        </div>
        <Text className="text-muted-foreground text-[0.75rem]">Current Balance</Text>
        <Text className="text-[2rem] text-foreground" style={{ fontWeight: 700 }}>$24.50</Text>
      </div>

      {/* Amount Selection */}
      <Text className="text-[0.8125rem] mb-2" style={{ fontWeight: 600 }}>Select Amount</Text>
      <div className="grid grid-cols-3 gap-2 mb-3">
        {TOPUP_PRESETS.map(a => {
          const isSelected = !customAmount && amount === a;
          const b = a >= 100 ? Math.floor(a * 0.05) : a >= 50 ? Math.floor(a * 0.02) : 0;
          return (
            <button key={a} onClick={() => { setAmount(a); setCustomAmount(""); }}
              className={`relative py-3 rounded-xl text-[0.9375rem] transition ${isSelected ? "bg-primary text-primary-foreground" : "bg-secondary text-foreground hover:bg-secondary/80"}`}
              style={{ fontWeight: isSelected ? 600 : 400 }}>
              ${a}
              {b > 0 && (
                <span className={`absolute -top-1.5 -right-1.5 text-[0.5625rem] px-1.5 py-0.5 rounded-full ${isSelected ? "bg-success text-white" : "bg-success/10 text-success"}`} style={{ fontWeight: 700 }}>
                  +${b}
                </span>
              )}
            </button>
          );
        })}
      </div>
      <Input
        label="Or enter custom amount"
        type="number"
        value={customAmount}
        onChange={e => { setCustomAmount(e.target.value); }}
        leftIcon={<span className="text-muted-foreground">$</span>}
        placeholder="Enter amount"
        fullWidth
      />

      {/* Bonus Banner */}
      {bonus > 0 && (
        <div className="mt-3 p-3 rounded-xl bg-success/10 border border-success/20 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-success shrink-0" />
          <Text className="text-success text-[0.8125rem]" style={{ fontWeight: 500 }}>
            You'll get <span style={{ fontWeight: 700 }}>${bonus} bonus</span> with this top up!
          </Text>
        </div>
      )}

      {/* Payment Providers */}
      <Text className="text-[0.8125rem] mt-5 mb-3" style={{ fontWeight: 600 }}>Payment Method</Text>
      <div className="space-y-2">
        {PAYMENT_PROVIDERS.map(p => (
          <button
            key={p.id}
            onClick={() => setSelectedProvider(p.id)}
            className={`w-full flex items-center gap-3 p-4 rounded-xl border-2 transition text-left cursor-pointer ${selectedProvider === p.id ? "border-primary bg-primary/5" : "border-border hover:border-muted-foreground/30"}`}
          >
            <div className={`w-10 h-10 rounded-xl ${p.color} flex items-center justify-center shrink-0`}>
              {p.icon}
            </div>
            <div className="flex-1">
              <Text className="text-[0.9375rem]" style={{ fontWeight: 600 }}>{p.name}</Text>
              <Text className="text-muted-foreground text-[0.6875rem]">{p.desc}</Text>
            </div>
            <div className={`w-5 h-5 rounded-full border-2 relative shrink-0 ${selectedProvider === p.id ? "border-primary" : "border-muted-foreground/40"}`}>
              {selectedProvider === p.id && <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full bg-primary" />}
            </div>
          </button>
        ))}
      </div>

      <div className="flex items-center justify-center gap-2 text-[0.75rem] text-muted-foreground mt-4">
        <Shield className="w-3.5 h-3.5 text-success" />
        <span>All payments are securely processed</span>
      </div>

      <Button
        variant="primary"
        fullWidth
        radius="full"
        onClick={() => setStep("confirm")}
        className="mt-5"
        disabled={!selectedProvider || activeAmount <= 0}
        rightIcon={<ArrowRight className="w-4 h-4" />}
      >
        Continue - ${activeAmount > 0 ? activeAmount.toFixed(2) : "0.00"}
      </Button>
    </div>
  );
}

export function SendGiftPage({ onBack }: { onBack: () => void }) {
  const [amount, setAmount] = useState(25);
  const [recipient, setRecipient] = useState("");
  return (
    <div className="pb-8">
      <PageHeader title="Send Gift Card" onBack={onBack} />
      <div className="text-center mb-5">
        <div className="w-16 h-16 rounded-full bg-success/10 flex items-center justify-center mx-auto mb-3">
          <Gift className="w-8 h-8 text-success" />
        </div>
        <Text className="text-[0.8125rem] text-muted-foreground">Send a dining gift to someone special</Text>
      </div>
      <div className="space-y-4">
        <Input label="Recipient Username" value={recipient} onChange={e => setRecipient(e.target.value)} placeholder="Enter username" fullWidth />
        <div>
          <Text className="text-[0.8125rem] mb-2" style={{ fontWeight: 600 }}>Gift Amount</Text>
          <div className="flex items-center gap-3 justify-center">
            <Button variant="outline" size="icon" radius="full" onClick={() => setAmount(Math.max(5, amount - 5))}><Minus className="w-4 h-4" /></Button>
            <Text className="text-[1.5rem] w-20 text-center" style={{ fontWeight: 700 }}>${amount}</Text>
            <Button variant="outline" size="icon" radius="full" onClick={() => setAmount(amount + 5)}><Plus className="w-4 h-4" /></Button>
          </div>
        </div>
        <Input label="Personal Message (optional)" placeholder="Enjoy a great meal!" fullWidth />
      </div>
      <div className="mt-4 p-3 rounded-xl bg-secondary flex items-center gap-3">
        <Wallet className="w-5 h-5 text-muted-foreground" />
        <div className="flex-1">
          <Text className="text-[0.8125rem]" style={{ fontWeight: 500 }}>Pay from Balance</Text>
          <Text className="text-muted-foreground text-[0.6875rem]">Available: $24.50</Text>
        </div>
        <DSBadge variant="outline" size="sm">Default</DSBadge>
      </div>
      <Button variant="primary" fullWidth radius="full" leftIcon={<Send className="w-4 h-4" />} onClick={onBack} className="mt-5">Send Gift</Button>
    </div>
  );
}

export function HistoryPage({ onBack }: { onBack: () => void }) {
  const [selectedTransaction, setSelectedTransaction] = useState<any | null>(null);

  const transactions = [
    { id: "1", label: "Top Up", amount: "+$50.00", date: "Apr 10", type: "credit", time: "10:32 AM", method: "Apple Pay", receiptNo: "TOP-2026-001", transactionId: "TXN-50284719" },
    { id: "2", label: "Sakura Omakase", amount: "-$42.50", date: "Apr 8", type: "debit", time: "7:15 PM", method: "Balance", receiptNo: "INV-2026-042", transactionId: "TXN-50273841", items: [{ name: "Omakase Set", qty: 1, price: 38.00 }, { name: "Green Tea", qty: 1, price: 3.50 }], subtotal: 41.50, tax: 3.73, serviceFee: 0.00, tip: 0.00, discount: 2.73, restaurant: "Sakura Omakase", address: "456 Sushi Lane, San Francisco, CA 94110" },
    { id: "3", label: "Reward Earned", amount: "+$4.25", date: "Apr 8", type: "reward", time: "7:20 PM", receiptNo: "RWD-2026-012", transactionId: "TXN-50273899", source: "10% cashback from Sakura Omakase" },
    { id: "4", label: "Bella Napoli", amount: "-$28.00", date: "Apr 5", type: "debit", time: "6:45 PM", method: "Balance", receiptNo: "INV-2026-039", transactionId: "TXN-50251728", items: [{ name: "Margherita Pizza", qty: 1, price: 18.00 }, { name: "Tiramisu", qty: 1, price: 8.00 }], subtotal: 26.00, tax: 2.34, serviceFee: 1.30, tip: 0.00, discount: 1.64, restaurant: "Bella Napoli", address: "789 Pizza St, San Francisco, CA 94102" },
    { id: "5", label: "Referral Bonus", amount: "+$10.00", date: "Mar 27", type: "reward", time: "9:15 AM", receiptNo: "RWD-2026-008", transactionId: "TXN-50198374", source: "Friend signup bonus" },
    { id: "6", label: "Gift Received", amount: "+$25.00", date: "Mar 20", type: "credit", time: "2:30 PM", method: "Gift Card", receiptNo: "GFT-2026-005", transactionId: "TXN-50142856", sender: "Maria Rodriguez" },
    { id: "7", label: "Le Petit Bistro", amount: "-$65.00", date: "Mar 15", type: "debit", time: "8:00 PM", method: "Balance", receiptNo: "INV-2026-027", transactionId: "TXN-50098234", items: [{ name: "Steak Frites", qty: 1, price: 42.00 }, { name: "French Onion Soup", qty: 1, price: 12.00 }, { name: "Red Wine", qty: 1, price: 15.00 }], subtotal: 69.00, tax: 6.21, serviceFee: 3.45, tip: 0.00, discount: 13.66, restaurant: "Le Petit Bistro", address: "234 Bistro Ave, San Francisco, CA 94115" },
    { id: "8", label: "Top Up", amount: "+$100.00", date: "Mar 10", type: "credit", time: "11:20 AM", method: "Google Pay", receiptNo: "TOP-2026-002", transactionId: "TXN-50042817" },
    { id: "9", label: "Taco Fiesta", amount: "-$19.50", date: "Mar 8", type: "debit", time: "12:30 PM", method: "Balance", receiptNo: "INV-2026-019", transactionId: "TXN-50028491", items: [{ name: "Taco Trio", qty: 1, price: 15.00 }, { name: "Guacamole", qty: 1, price: 4.00 }], subtotal: 19.00, tax: 1.71, serviceFee: 0.95, tip: 0.00, discount: 2.16, restaurant: "Taco Fiesta", address: "567 Taco Blvd, San Francisco, CA 94103" },
    { id: "10", label: "Birthday Bonus", amount: "+$25.00", date: "Feb 28", type: "reward", time: "12:00 AM", receiptNo: "RWD-2026-003", transactionId: "TXN-49928374", source: "Birthday celebration" },
  ];

  return (
    <div className="pb-8">
      <PageHeader title="Transaction History" onBack={onBack} />
      <div className="space-y-1">
        {transactions.map(t => (
          <button
            key={t.id}
            onClick={() => setSelectedTransaction(t)}
            className="w-full flex items-center justify-between py-3 border-b border-border last:border-0 hover:bg-secondary/30 transition-colors rounded-lg px-2"
          >
            <div className="flex items-center gap-3">
              <div className={`w-9 h-9 rounded-full flex items-center justify-center ${t.type === "credit" ? "bg-success/10" : t.type === "reward" ? "bg-primary/10" : "bg-secondary"}`}>
                {t.type === "credit" ? <Plus className="w-4 h-4 text-success" /> : t.type === "reward" ? <Star className="w-4 h-4 text-primary" /> : <ShoppingBag className="w-4 h-4 text-muted-foreground" />}
              </div>
              <div className="text-left">
                <Text className="text-[0.8125rem]" style={{ fontWeight: 500 }}>{t.label}</Text>
                <Text className="text-muted-foreground text-[0.6875rem]">{t.date}</Text>
              </div>
            </div>
            <Text className={`text-[0.8125rem] ${t.type !== "debit" ? "text-success" : ""}`} style={{ fontWeight: 600 }}>{t.amount}</Text>
          </button>
        ))}
      </div>

      {selectedTransaction && (
        <InvoiceModal transaction={selectedTransaction} onClose={() => setSelectedTransaction(null)} />
      )}
    </div>
  );
}

export function OrdersPage({ onBack }: { onBack: () => void }) {
  return (
    <div className="pb-8">
      <PageHeader title="Orders" onBack={onBack} />
      <div className="text-center mb-4">
        <Text className="text-[2.5rem]" style={{ fontWeight: 700 }}>47</Text>
        <Text className="text-muted-foreground text-[0.75rem]">Total Orders</Text>
      </div>
      <div className="space-y-3">
        {[
          { name: "Sakura Omakase", date: "Apr 8", amount: "$42.50", items: 3 },
          { name: "Bella Napoli", date: "Apr 5", amount: "$28.00", items: 2 },
          { name: "Le Petit Bistro", date: "Mar 15", amount: "$65.00", items: 4 },
          { name: "Gangnam BBQ", date: "Mar 10", amount: "$55.00", items: 5 },
        ].map((o, i) => (
          <Card key={i} variant="filled" padding="sm" radius="lg">
            <div className="flex items-center justify-between">
              <div>
                <Text className="text-[0.8125rem]" style={{ fontWeight: 600 }}>{o.name}</Text>
                <Text className="text-muted-foreground text-[0.6875rem]">{o.date} · {o.items} items</Text>
              </div>
              <Text style={{ fontWeight: 600 }}>{o.amount}</Text>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

export function ThisMonthPage({ onBack }: { onBack: () => void }) {
  return (
    <div className="pb-8">
      <PageHeader title="This Month's Spending" onBack={onBack} />
      <div className="text-center mb-5">
        <Text className="text-[2.5rem] text-primary" style={{ fontWeight: 700 }}>$218</Text>
        <Text className="text-muted-foreground text-[0.75rem]">April 2026</Text>
      </div>
      <div className="space-y-3">
        <div className="flex justify-between text-[0.8125rem]">
          <Text className="text-muted-foreground">Dining Out</Text>
          <Text style={{ fontWeight: 600 }}>$178.00</Text>
        </div>
        <ProgressBar value={82} color="primary" size="sm" />
        <div className="flex justify-between text-[0.8125rem]">
          <Text className="text-muted-foreground">Delivery</Text>
          <Text style={{ fontWeight: 600 }}>$40.00</Text>
        </div>
        <ProgressBar value={18} color="info" size="sm" />
      </div>
      <div className="mt-5 p-3 rounded-xl bg-secondary">
        <div className="flex justify-between text-[0.8125rem]">
          <Text className="text-muted-foreground">vs Last Month</Text>
          <Text className="text-success" style={{ fontWeight: 600 }}>{"\u2193"} 12% less</Text>
        </div>
      </div>
    </div>
  );
}

function InvoiceModal({ transaction, onClose }: { transaction: any; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4" onClick={onClose}>
      <div className="bg-background rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="sticky top-0 bg-background border-b border-border px-5 py-4 flex items-center justify-between">
          <Text style={{ fontWeight: 700 }}>Receipt</Text>
          <button onClick={onClose} className="w-8 h-8 rounded-full hover:bg-secondary flex items-center justify-center transition">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 space-y-4">
          {transaction.type === "debit" && transaction.items ? (
            <>
              <div className="text-center pb-4 border-b border-dashed border-border">
                <div className="w-12 h-12 rounded-full bg-success/10 flex items-center justify-center mx-auto mb-2">
                  <Check className="w-6 h-6 text-success" />
                </div>
                <Text className="text-success" style={{ fontWeight: 600 }}>Payment Successful</Text>
                <Text className="text-muted-foreground text-[0.75rem] mt-1">{transaction.date}, {transaction.time}</Text>
              </div>

              <div className="space-y-2">
                <div className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 text-muted-foreground mt-0.5 shrink-0" />
                  <div>
                    <Text className="text-[0.9375rem]" style={{ fontWeight: 600 }}>{transaction.restaurant}</Text>
                    <Text className="text-muted-foreground text-[0.75rem]">{transaction.address}</Text>
                  </div>
                </div>
              </div>

              <div className="space-y-2 pt-3 border-t border-border">
                <Text className="text-[0.75rem] text-muted-foreground" style={{ fontWeight: 600 }}>ORDER DETAILS</Text>
                {transaction.items.map((item: any, idx: number) => (
                  <div key={idx} className="flex justify-between">
                    <div className="flex gap-2">
                      <Text className="text-[0.8125rem] text-muted-foreground">{item.qty}x</Text>
                      <Text className="text-[0.8125rem]">{item.name}</Text>
                    </div>
                    <Text className="text-[0.8125rem]">${item.price.toFixed(2)}</Text>
                  </div>
                ))}
              </div>

              <div className="space-y-2 pt-3 border-t border-dashed border-border">
                <div className="flex justify-between text-[0.8125rem]">
                  <Text className="text-muted-foreground">Subtotal</Text>
                  <Text>${transaction.subtotal.toFixed(2)}</Text>
                </div>
                <div className="flex justify-between text-[0.8125rem]">
                  <Text className="text-muted-foreground">Tax</Text>
                  <Text>${transaction.tax.toFixed(2)}</Text>
                </div>
                {transaction.serviceFee > 0 && (
                  <div className="flex justify-between text-[0.8125rem]">
                    <Text className="text-muted-foreground">Service Fee</Text>
                    <Text>${transaction.serviceFee.toFixed(2)}</Text>
                  </div>
                )}
                {transaction.discount > 0 && (
                  <div className="flex justify-between text-[0.8125rem]">
                    <Text className="text-success">Discount</Text>
                    <Text className="text-success">-${transaction.discount.toFixed(2)}</Text>
                  </div>
                )}
              </div>

              <div className="flex justify-between pt-3 border-t border-border">
                <Text style={{ fontWeight: 700 }}>Total Paid</Text>
                <Text className="text-[1.125rem]" style={{ fontWeight: 700 }}>{transaction.amount}</Text>
              </div>

              <div className="pt-3 border-t border-dashed border-border space-y-1">
                <div className="flex justify-between text-[0.75rem]">
                  <Text className="text-muted-foreground">Paid From</Text>
                  <Text>{transaction.method}</Text>
                </div>
                <div className="flex justify-between text-[0.75rem]">
                  <Text className="text-muted-foreground">Receipt No.</Text>
                  <Text>{transaction.receiptNo}</Text>
                </div>
                <div className="flex justify-between text-[0.75rem]">
                  <Text className="text-muted-foreground">Transaction ID</Text>
                  <Text>{transaction.transactionId}</Text>
                </div>
              </div>
            </>
          ) : transaction.type === "credit" ? (
            <>
              <div className="text-center pb-4 border-b border-dashed border-border">
                <div className="w-12 h-12 rounded-full bg-success/10 flex items-center justify-center mx-auto mb-2">
                  <Plus className="w-6 h-6 text-success" />
                </div>
                <Text className="text-success" style={{ fontWeight: 600 }}>Top Up Successful</Text>
                <Text className="text-muted-foreground text-[0.75rem] mt-1">{transaction.date}, {transaction.time}</Text>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between">
                  <Text className="text-muted-foreground">Amount</Text>
                  <Text className="text-success text-[1.5rem]" style={{ fontWeight: 700 }}>{transaction.amount}</Text>
                </div>
                <div className="flex justify-between text-[0.875rem]">
                  <Text className="text-muted-foreground">Via</Text>
                  <Text>{transaction.method}</Text>
                </div>
                {transaction.sender && (
                  <div className="flex justify-between text-[0.875rem]">
                    <Text className="text-muted-foreground">From</Text>
                    <Text>{transaction.sender}</Text>
                  </div>
                )}
              </div>

              <div className="pt-3 border-t border-dashed border-border space-y-1">
                <div className="flex justify-between text-[0.75rem]">
                  <Text className="text-muted-foreground">Receipt No.</Text>
                  <Text>{transaction.receiptNo}</Text>
                </div>
                <div className="flex justify-between text-[0.75rem]">
                  <Text className="text-muted-foreground">Transaction ID</Text>
                  <Text>{transaction.transactionId}</Text>
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="text-center pb-4 border-b border-dashed border-border">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-2">
                  <Star className="w-6 h-6 text-primary" />
                </div>
                <Text className="text-primary" style={{ fontWeight: 600 }}>Reward Earned</Text>
                <Text className="text-muted-foreground text-[0.75rem] mt-1">{transaction.date}, {transaction.time}</Text>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between">
                  <Text className="text-muted-foreground">Amount</Text>
                  <Text className="text-success text-[1.5rem]" style={{ fontWeight: 700 }}>{transaction.amount}</Text>
                </div>
                <div className="text-[0.875rem]">
                  <Text className="text-muted-foreground mb-1">Source</Text>
                  <Text>{transaction.source}</Text>
                </div>
              </div>

              <div className="pt-3 border-t border-dashed border-border space-y-1">
                <div className="flex justify-between text-[0.75rem]">
                  <Text className="text-muted-foreground">Receipt No.</Text>
                  <Text>{transaction.receiptNo}</Text>
                </div>
                <div className="flex justify-between text-[0.75rem]">
                  <Text className="text-muted-foreground">Transaction ID</Text>
                  <Text>{transaction.transactionId}</Text>
                </div>
              </div>
            </>
          )}

          <div className="pt-3">
            <Button variant="primary" fullWidth onClick={onClose}>Close</Button>
          </div>
        </div>
      </div>
    </div>
  );
}

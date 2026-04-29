import { useState } from "react";
import { Gift, Minus, Plus, Send, Wallet } from "lucide-react";
import { DSBadge } from "../../../components/ds/Badge";
import { Button } from "../../../components/ds/Button";
import { Input } from "../../../components/ds/Input";
import { Text } from "../../../components/ds/Text";
import { PageHeader } from "../profileHelpers";

const fmtMoney = (n: number, c: "KRW" | "USD") => c === "KRW" ? `\u20A9${Math.round(n).toLocaleString()}` : `$${n.toFixed(2)}`;

export function SendGiftPage({ onBack }: { onBack: () => void }) {
  const [currency, setCurrency] = useState<"KRW" | "USD">("KRW");
  const [amount, setAmount] = useState(30_000);
  const [recipient, setRecipient] = useState("");

  const step = currency === "KRW" ? 5_000 : 5;
  const min = currency === "KRW" ? 5_000 : 5;
  const max = currency === "KRW" ? 1_000_000 : 1000;
  const fmt = (n: number) => fmtMoney(n, currency);
  const balance = currency === "KRW" ? 13_000_000 : 5_000;

  const switchCurrency = (c: "KRW" | "USD") => {
    setCurrency(c);
    setAmount(c === "KRW" ? 30_000 : 25);
  };

  return (
    <div className="pb-8">
      <PageHeader title="Send Gift Card" onBack={onBack} />
      <div className="text-center mb-5">
        <div className="w-16 h-16 rounded-full bg-success/10 flex items-center justify-center mx-auto mb-3">
          <Gift className="w-8 h-8 text-success" />
        </div>
        <Text className="text-[0.8125rem] text-muted-foreground">Send a dining gift to someone special</Text>
      </div>

      <Text className="text-[0.8125rem] mb-2" style={{ fontWeight: 600 }}>Send From</Text>
      <div className="grid grid-cols-2 gap-2 mb-4">
        <button onClick={() => switchCurrency("KRW")} className={`rounded-xl p-3 text-left border transition ${currency === "KRW" ? "border-primary bg-primary/5" : "border-border bg-card hover:bg-secondary/30"}`}>
          <p className="text-[0.625rem] text-muted-foreground tracking-wider" style={{ fontWeight: 600 }}>DOMESTIC · ₩</p>
          <p className="text-[0.9375rem] mt-0.5" style={{ fontWeight: 700 }}>₩13,000,000</p>
        </button>
        <button onClick={() => switchCurrency("USD")} className={`rounded-xl p-3 text-left border transition ${currency === "USD" ? "border-primary bg-primary/5" : "border-border bg-card hover:bg-secondary/30"}`}>
          <p className="text-[0.625rem] text-muted-foreground tracking-wider" style={{ fontWeight: 600 }}>FOREIGN · $</p>
          <p className="text-[0.9375rem] mt-0.5" style={{ fontWeight: 700 }}>$5,000.00</p>
        </button>
      </div>

      <div className="space-y-4">
        <Input label="Recipient Username" value={recipient} onChange={e => setRecipient(e.target.value)} placeholder="Enter username" fullWidth />
        <div>
          <Text className="text-[0.8125rem] mb-2" style={{ fontWeight: 600 }}>Gift Amount</Text>
          <div className="flex items-center gap-3 justify-center">
            <Button variant="outline" size="icon" radius="full" onClick={() => setAmount(Math.max(min, amount - step))}><Minus className="w-4 h-4" /></Button>
            <Text className="text-[1.5rem] w-32 text-center" style={{ fontWeight: 700 }}>{fmt(amount)}</Text>
            <Button variant="outline" size="icon" radius="full" onClick={() => setAmount(Math.min(max, amount + step))}><Plus className="w-4 h-4" /></Button>
          </div>
        </div>
        <Input label="Personal Message (optional)" placeholder="Enjoy a great meal!" fullWidth />
      </div>
      <div className="mt-4 p-3 rounded-xl bg-secondary flex items-center gap-3">
        <Wallet className="w-5 h-5 text-muted-foreground" />
        <div className="flex-1">
          <Text className="text-[0.8125rem]" style={{ fontWeight: 500 }}>Pay from {currency === "KRW" ? "Domestic" : "Foreign"} Balance</Text>
          <Text className="text-muted-foreground text-[0.6875rem]">Available: {fmt(balance)}</Text>
        </div>
        <DSBadge variant="outline" size="sm">Default</DSBadge>
      </div>
      <Button variant="primary" fullWidth radius="full" leftIcon={<Send className="w-4 h-4" />} onClick={onBack} className="mt-5" disabled={amount > balance || !recipient}>
        Send {fmt(amount)}
      </Button>
    </div>
  );
}

import { Check, Copy, Receipt, Sparkles } from "lucide-react";
import { Button } from "../../../../components/ds/Button";
import { Text } from "../../../../components/ds/Text";
import { PageHeader } from "../../profileHelpers";
import { PAYMENT_PROVIDERS } from "./types";

interface Props {
  onBack: () => void;
  activeAmount: number;
  currency: "KRW" | "USD";
  bonus: number;
  selectedProvider: string | null;
  receipt: { id: string; txn: string; at: string } | null;
  fmt: (n: number) => string;
  onTopUpAgain: () => void;
}

export function TopUpDoneView({ onBack, activeAmount, currency, bonus, selectedProvider, receipt, fmt, onTopUpAgain }: Props) {
  const provider = PAYMENT_PROVIDERS.find((p) => p.id === selectedProvider);
  return (
    <div className="pb-8">
      <PageHeader title="Top Up" onBack={onBack} />
      <div className="flex flex-col items-center justify-center py-10 text-center">
        <div className="relative w-20 h-20 mb-5">
          <div className="absolute inset-0 rounded-full bg-success/10 animate-ping" style={{ animationDuration: "2s", animationIterationCount: "3" }} />
          <div className="relative w-20 h-20 rounded-full bg-success/15 flex items-center justify-center">
            <Check className="w-10 h-10 text-success" />
          </div>
        </div>
        <Text className="text-[1.375rem] mb-2" style={{ fontWeight: 700 }}>Top Up Successful!</Text>
        <Text className="text-muted-foreground text-[0.875rem] mb-1">{fmt(activeAmount)} added to your {currency === "KRW" ? "Domestic" : "Foreign"} balance</Text>
        {bonus > 0 && (
          <div className="flex items-center gap-1.5 mt-2 px-3 py-1.5 rounded-full bg-success/10 border border-success/20">
            <Sparkles className="w-3.5 h-3.5 text-success" />
            <Text className="text-success text-[0.8125rem]" style={{ fontWeight: 600 }}>+{fmt(bonus)} bonus added!</Text>
          </div>
        )}
        <div className="w-full mt-7 p-4 rounded-2xl border border-border bg-card text-left">
          <div className="flex items-center gap-2 mb-3 pb-3 border-b border-dashed border-border">
            <Receipt className="w-4 h-4 text-muted-foreground" />
            <Text className="text-[0.75rem] tracking-wider text-muted-foreground" style={{ fontWeight: 600 }}>RECEIPT</Text>
            <span className="ml-auto text-[0.6875rem] text-muted-foreground">{receipt?.at}</span>
          </div>
          <div className="flex justify-between text-[0.8125rem] mb-1.5">
            <Text className="text-muted-foreground">Receipt No.</Text>
            <button className="flex items-center gap-1 hover:text-primary transition" onClick={() => receipt && navigator.clipboard?.writeText(receipt.id)}>
              <span style={{ fontWeight: 500 }}>{receipt?.id}</span>
              <Copy className="w-3 h-3" />
            </button>
          </div>
          <div className="flex justify-between text-[0.8125rem] mb-1.5"><Text className="text-muted-foreground">Transaction ID</Text><Text style={{ fontWeight: 500 }}>{receipt?.txn}</Text></div>
          <div className="flex justify-between text-[0.8125rem] mb-3"><Text className="text-muted-foreground">Method</Text><Text style={{ fontWeight: 500 }}>{provider?.name}</Text></div>
          <div className="flex justify-between text-[0.875rem] mb-2"><Text className="text-muted-foreground">Top Up</Text><Text className="text-success">+{fmt(activeAmount)}</Text></div>
          {bonus > 0 && <div className="flex justify-between text-[0.875rem] mb-2"><Text className="text-success flex items-center gap-1"><Sparkles className="w-3 h-3" /> Bonus</Text><Text className="text-success">+{fmt(bonus)}</Text></div>}
          <div className="border-t border-border pt-2 mt-1 flex justify-between"><Text style={{ fontWeight: 700 }}>Added</Text><Text className="text-[1.125rem]" style={{ fontWeight: 700 }}>{fmt(activeAmount + bonus)}</Text></div>
        </div>
        <div className="w-full mt-6 grid grid-cols-2 gap-2">
          <Button variant="ghost" onClick={onTopUpAgain}>Top Up Again</Button>
          <Button variant="primary" onClick={onBack}>Done</Button>
        </div>
      </div>
    </div>
  );
}

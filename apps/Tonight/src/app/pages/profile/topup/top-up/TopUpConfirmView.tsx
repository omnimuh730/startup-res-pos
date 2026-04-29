import { Lock, Sparkles } from "lucide-react";
import { Button } from "../../../../components/ds/Button";
import { Text } from "../../../../components/ds/Text";
import { PageHeader } from "../../profileHelpers";
import { PAYMENT_PROVIDERS } from "./types";

interface Props {
  onBack: () => void;
  onChangeMethod: () => void;
  onConfirm: () => void;
  selectedProvider: string | null;
  currency: "KRW" | "USD";
  activeAmount: number;
  bonus: number;
  fmt: (n: number) => string;
}

export function TopUpConfirmView({ onBack, onChangeMethod, onConfirm, selectedProvider, currency, activeAmount, bonus, fmt }: Props) {
  const provider = PAYMENT_PROVIDERS.find((p) => p.id === selectedProvider)!;
  return (
    <div className="pb-8">
      <PageHeader title="Confirm Top Up" onBack={onBack} />
      <div className="space-y-4">
        <div className="relative rounded-2xl overflow-hidden p-5" style={{ background: "linear-gradient(135deg, var(--primary) 0%, color-mix(in srgb, var(--primary) 60%, #000) 100%)" }}>
          <div className="absolute top-0 right-0 w-24 h-24 rounded-full bg-white/5 -translate-y-1/2 translate-x-1/2" />
          <div className="relative z-10 text-center">
            <Text className="text-white/60 text-[0.75rem]" style={{ fontWeight: 500 }}>TOP UP · {currency === "KRW" ? "DOMESTIC" : "FOREIGN"}</Text>
            <Text className="text-white text-[2.25rem] block mt-1" style={{ fontWeight: 700 }}>{fmt(activeAmount)}</Text>
            {bonus > 0 && <div className="inline-flex items-center gap-1 mt-2 px-3 py-1 rounded-full bg-white/15"><Sparkles className="w-3 h-3 text-white" /><Text className="text-white text-[0.75rem]" style={{ fontWeight: 600 }}>+{fmt(bonus)} bonus included</Text></div>}
          </div>
        </div>
        <div className="p-4 rounded-xl border border-border">
          <Text className="text-[0.75rem] text-muted-foreground mb-2" style={{ fontWeight: 500 }}>PAYMENT METHOD</Text>
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl ${provider.color} flex items-center justify-center shrink-0`}>{provider.icon}</div>
            <div className="flex-1"><Text className="text-[0.9375rem]" style={{ fontWeight: 600 }}>{provider.name}</Text><Text className="text-muted-foreground text-[0.75rem]">{provider.desc}</Text></div>
            <button onClick={onChangeMethod} className="text-primary text-[0.8125rem]" style={{ fontWeight: 500 }}>Change</button>
          </div>
        </div>
        <div className="p-4 rounded-xl border border-border space-y-2">
          <div className="flex justify-between text-[0.875rem]"><Text className="text-muted-foreground">Top Up Amount</Text><Text>{fmt(activeAmount)}</Text></div>
          <div className="flex justify-between text-[0.875rem]"><Text className="text-muted-foreground">Processing Fee</Text><Text className="text-success">FREE</Text></div>
          {bonus > 0 && <div className="flex justify-between text-[0.875rem]"><Text className="text-success flex items-center gap-1"><Sparkles className="w-3 h-3" /> Bonus</Text><Text className="text-success">+{fmt(bonus)}</Text></div>}
          <div className="border-t border-border pt-2 mt-1 flex justify-between"><Text style={{ fontWeight: 700 }}>You Pay</Text><Text className="text-[1.125rem]" style={{ fontWeight: 700 }}>{fmt(activeAmount)}</Text></div>
        </div>
        <div className="flex items-center justify-center gap-2 text-[0.75rem] text-muted-foreground"><Lock className="w-3.5 h-3.5 text-success" /><span>Secured by {provider.name} · 256-bit encryption</span></div>
        <Button variant="primary" fullWidth radius="full" onClick={onConfirm} className="!mt-6">Pay {fmt(activeAmount)} with {provider.name}</Button>
      </div>
    </div>
  );
}

import { Check, Fingerprint, Loader2, Lock } from "lucide-react";
import { Text } from "../../../../components/ds/Text";
import { PageHeader } from "../../profileHelpers";
import { PAYMENT_PROVIDERS, PROCESS_STAGES_BY_PROVIDER } from "./types";

interface Props {
  selectedProvider: string | null;
  stageIdx: number;
  activeAmount: number;
  fmt: (n: number) => string;
}

export function TopUpProcessingView({ selectedProvider, stageIdx, activeAmount, fmt }: Props) {
  const provider = PAYMENT_PROVIDERS.find((p) => p.id === selectedProvider);
  const stages = PROCESS_STAGES_BY_PROVIDER[selectedProvider ?? "apple"];
  return (
    <div className="pb-8">
      <PageHeader title="Processing" onBack={() => {}} />
      <div className="px-1 pt-2">
        <div className="rounded-2xl p-5 mb-5 text-center" style={{ background: "linear-gradient(135deg, var(--primary) 0%, color-mix(in srgb, var(--primary) 60%, #000) 100%)" }}>
          <Text className="text-white/70 text-[0.6875rem] tracking-wider" style={{ fontWeight: 600 }}>PROCESSING TOP UP</Text>
          <Text className="text-white text-[1.75rem] block mt-1" style={{ fontWeight: 700 }}>{fmt(activeAmount)}</Text>
          <Text className="text-white/70 text-[0.75rem]">via {provider?.name}</Text>
        </div>
        <ol className="space-y-3">
          {stages.map((s, i) => {
            const done = i < stageIdx;
            const active = i === stageIdx;
            return (
              <li key={s.key} className={`flex items-center gap-3 p-3 rounded-xl border transition ${active ? "border-primary bg-primary/5" : done ? "border-success/30 bg-success/5" : "border-border"}`}>
                <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 ${done ? "bg-success text-white" : active ? "bg-primary/15 text-primary" : "bg-secondary text-muted-foreground"}`}>
                  {done ? <Check className="w-4 h-4" /> : active ? <Loader2 className="w-4 h-4 animate-spin" /> : <span className="text-[0.75rem]" style={{ fontWeight: 700 }}>{i + 1}</span>}
                </div>
                <Text className={`text-[0.875rem] ${done ? "text-muted-foreground" : ""}`} style={{ fontWeight: active ? 600 : 500 }}>{s.label}</Text>
                {active && <Fingerprint className="w-4 h-4 text-primary ml-auto opacity-60" />}
              </li>
            );
          })}
        </ol>
        <div className="flex items-center justify-center gap-2 text-[0.75rem] text-muted-foreground mt-5">
          <Lock className="w-3.5 h-3.5 text-success" />
          <span>End-to-end encrypted · do not close this screen</span>
        </div>
      </div>
    </div>
  );
}

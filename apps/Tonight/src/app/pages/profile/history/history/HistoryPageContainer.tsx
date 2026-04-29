import { useEffect, useState } from "react";
import { Gift, Plus, Receipt, Send, ShoppingBag, Star, Wallet } from "lucide-react";
import { Button } from "../../../../components/ds/Button";
import { DSBadge } from "../../../../components/ds/Badge";
import { Text } from "../../../../components/ds/Text";
import { PageHeader } from "../../profileHelpers";
import { InvoiceModal } from "./InvoiceModal";
import { generateMockTransactions, rangeFromPreset } from "./mockData";
import { PeriodPicker } from "./PeriodPicker";
import type { DateRange, TxCategory, TxRecord } from "./types";

const CATEGORY_OPTIONS: { id: "all" | TxCategory; label: string; icon: any; color: string }[] = [
  { id: "all", label: "All", icon: Wallet, color: "text-foreground" },
  { id: "charge", label: "Charge", icon: Plus, color: "text-success" },
  { id: "pay", label: "Pay", icon: ShoppingBag, color: "text-foreground" },
  { id: "reward", label: "Reward", icon: Star, color: "text-primary" },
  { id: "referral", label: "Referral", icon: Send, color: "text-info" },
  { id: "gift", label: "Gift", icon: Gift, color: "text-success" },
];
const PAGE_SIZE = 20;

export function HistoryPage({ onBack }: { onBack: () => void }) {
  const [selectedTransaction, setSelectedTransaction] = useState<TxRecord | null>(null);
  const [range, setRange] = useState<DateRange>(() => rangeFromPreset("1m"));
  const [category, setCategory] = useState<"all" | TxCategory>("all");
  const [visible, setVisible] = useState(PAGE_SIZE);
  const [allTransactions] = useState(() => generateMockTransactions(84));
  const filtered = allTransactions.filter((t) => (category === "all" || t.category === category) && t.dateObj.getTime() >= range.from.getTime() && t.dateObj.getTime() <= range.to.getTime());
  useEffect(() => { setVisible(PAGE_SIZE); }, [range, category]);
  const shown = filtered.slice(0, visible);
  const hasMore = visible < filtered.length;
  const groups: { date: string; items: TxRecord[] }[] = [];
  shown.forEach((t) => { const last = groups[groups.length - 1]; if (last && last.date === t.date) last.items.push(t); else groups.push({ date: t.date, items: [t] }); });

  return (
    <div className="pb-8">
      <PageHeader title="Transaction History" onBack={onBack} />
      <div className="mb-4"><PeriodPicker value={range} onChange={setRange} /></div>
      <div className="flex items-stretch gap-1 mb-4 p-1.5 rounded-full bg-secondary/40 w-full">
        {CATEGORY_OPTIONS.map((c) => {
          const Icon = c.icon;
          const isActive = category === c.id;
          return <button key={c.id} onClick={() => setCategory(c.id)} aria-label={c.label} className={`group relative flex items-center justify-center h-12 rounded-full cursor-pointer min-w-0 overflow-hidden transition-[flex-grow,flex-basis,padding,background-color,border-color,box-shadow,color] duration-[1400ms] ease-[cubic-bezier(0.22,1,0.36,1)] ${isActive ? "flex-[0_0_auto] px-5 bg-background border border-border shadow-sm text-foreground" : "flex-[1_1_0%] px-0 bg-transparent border border-transparent text-muted-foreground hover:text-foreground hover:bg-background/60"}`} style={{ fontWeight: isActive ? 600 : 500 }}><Icon className={`w-[1.125rem] h-[1.125rem] shrink-0 transition-colors duration-[1400ms] ${isActive ? c.color : ""}`} /><span className="text-[0.8125rem] whitespace-nowrap inline-block transition-[max-width,opacity,margin-left,transform] duration-[1400ms] ease-[cubic-bezier(0.22,1,0.36,1)] overflow-hidden" style={{ maxWidth: isActive ? "10rem" : "0px", opacity: isActive ? 1 : 0, marginLeft: isActive ? "0.5rem" : "0px", transform: isActive ? "translateX(0)" : "translateX(-4px)" }}>{c.label}</span></button>;
        })}
      </div>
      <div className="flex items-center justify-between mb-2 px-1">
        <Text className="text-[0.6875rem] text-muted-foreground">{filtered.length} result{filtered.length === 1 ? "" : "s"}</Text>
        {(category !== "all" || range.presetId !== "1m") && <button onClick={() => { setCategory("all"); setRange(rangeFromPreset("1m")); }} className="text-[0.6875rem] text-primary" style={{ fontWeight: 600 }}>Reset filters</button>}
      </div>
      {filtered.length === 0 ? (
        <div className="text-center py-12"><div className="w-14 h-14 rounded-full bg-secondary mx-auto flex items-center justify-center mb-3"><Receipt className="w-6 h-6 text-muted-foreground" /></div><Text className="text-[0.9375rem]" style={{ fontWeight: 600 }}>No transactions</Text><Text className="text-muted-foreground text-[0.75rem] mt-1">Try a different period or category.</Text></div>
      ) : (
        <div className="space-y-4">
          {groups.map((g) => (
            <div key={g.date}>
              <Text className="text-[0.6875rem] text-muted-foreground tracking-wider mb-1 px-1" style={{ fontWeight: 600 }}>{g.date.toUpperCase()}</Text>
              <div className="rounded-xl border border-border bg-card overflow-hidden">
                {g.items.map((t, idx) => (
                  <button key={t.id} onClick={() => setSelectedTransaction(t)} className={`w-full flex items-center justify-between py-3 px-3 hover:bg-secondary/30 transition-colors ${idx > 0 ? "border-t border-border" : ""}`}>
                    <div className="flex items-center gap-3 min-w-0">
                      <div className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 ${t.category === "charge" ? "bg-success/10" : t.category === "gift" ? "bg-success/10" : t.category === "reward" ? "bg-primary/10" : t.category === "referral" ? "bg-info/10" : "bg-secondary"}`}>{t.category === "charge" ? <Plus className="w-4 h-4 text-success" /> : t.category === "gift" ? <Gift className="w-4 h-4 text-success" /> : t.category === "reward" ? <Star className="w-4 h-4 text-primary" /> : t.category === "referral" ? <Send className="w-4 h-4 text-info" /> : <ShoppingBag className="w-4 h-4 text-muted-foreground" />}</div>
                      <div className="text-left min-w-0"><Text className="text-[0.8125rem] truncate" style={{ fontWeight: 500 }}>{t.label}</Text><div className="flex items-center gap-1.5"><Text className="text-muted-foreground text-[0.6875rem]">{t.time}</Text><span className="text-muted-foreground text-[0.6875rem]">·</span><DSBadge variant="soft" size="sm" color={t.category === "charge" ? "success" : t.category === "reward" ? "primary" : t.category === "referral" ? "info" : t.category === "gift" ? "success" : "secondary"}>{CATEGORY_OPTIONS.find((c) => c.id === t.category)?.label}</DSBadge></div></div>
                    </div>
                    <Text className={`text-[0.8125rem] shrink-0 ml-2 ${t.type !== "debit" ? "text-success" : ""}`} style={{ fontWeight: 600 }}>{t.amount}</Text>
                  </button>
                ))}
              </div>
            </div>
          ))}
          {hasMore && <Button variant="outline" fullWidth onClick={() => setVisible((v) => v + PAGE_SIZE)} className="mt-2">Load {Math.min(PAGE_SIZE, filtered.length - visible)} more</Button>}
          {!hasMore && filtered.length > PAGE_SIZE && <Text className="text-center text-muted-foreground text-[0.6875rem] mt-2">You're all caught up.</Text>}
        </div>
      )}
      {selectedTransaction && <InvoiceModal transaction={selectedTransaction} onClose={() => setSelectedTransaction(null)} />}
    </div>
  );
}

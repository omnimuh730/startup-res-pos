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
import { motion, AnimatePresence } from "framer-motion";

const CATEGORY_OPTIONS: { id: "all" | TxCategory; label: string; icon: any; color: string; bg: string }[] = [
  { id: "all", label: "All", icon: Wallet, color: "text-black", bg: "bg-gray-100" },
  { id: "charge", label: "Charge", icon: Plus, color: "text-green-600", bg: "bg-green-100" },
  { id: "pay", label: "Pay", icon: ShoppingBag, color: "text-black", bg: "bg-gray-100" },
  { id: "reward", label: "Reward", icon: Star, color: "text-[#FF5A5F]", bg: "bg-[#FF5A5F]/10" },
  { id: "referral", label: "Referral", icon: Send, color: "text-blue-500", bg: "bg-blue-100" },
  { id: "gift", label: "Gift", icon: Gift, color: "text-green-600", bg: "bg-green-100" },
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
  
  shown.forEach((t) => { 
    const last = groups[groups.length - 1]; 
    if (last && last.date === t.date) last.items.push(t); 
    else groups.push({ date: t.date, items: [t] }); 
  });

  return (
    <div className="pb-8 bg-white min-h-full font-sans">
      <PageHeader title="Transaction History" onBack={onBack} />
      
      <div className="px-6 mb-6 mt-2">
        <PeriodPicker value={range} onChange={setRange} />
      </div>

      {/* Airbnb Style Sliding Filter Pills */}
      <div className="px-6 mb-6">
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide -mx-6 px-6 mask-fade-edges">
          {CATEGORY_OPTIONS.map((c) => {
            const Icon = c.icon;
            const isActive = category === c.id;
            return (
              <button 
                key={c.id} 
                onClick={() => setCategory(c.id)} 
                className={`relative flex items-center justify-center h-[2.75rem] rounded-full px-5 whitespace-nowrap transition-colors duration-300 z-10 ${
                  isActive ? "text-white" : "text-gray-500 hover:text-black hover:bg-gray-100"
                }`}
                style={{ fontWeight: 600, fontSize: "0.875rem" }}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeFilterBg"
                    className="absolute inset-0 bg-black rounded-full -z-10 shadow-md"
                    transition={{ type: "spring", stiffness: 500, damping: 35 }}
                  />
                )}
                <Icon className={`w-4 h-4 mr-2 ${isActive ? "text-white" : c.color}`} strokeWidth={2.5} />
                {c.label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex items-center justify-between mb-4 px-6">
        <Text className="text-[0.875rem] font-medium text-gray-500">
          {filtered.length} result{filtered.length === 1 ? "" : "s"}
        </Text>
        {(category !== "all" || range.presetId !== "1m") && (
          <button 
            onClick={() => { setCategory("all"); setRange(rangeFromPreset("1m")); }} 
            className="text-[0.875rem] text-black underline underline-offset-4 hover:text-gray-600 transition" 
            style={{ fontWeight: 600 }}
          >
            Reset
          </button>
        )}
      </div>

      {filtered.length === 0 ? (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="text-center py-20 px-6">
          <div className="w-16 h-16 rounded-full bg-gray-100 mx-auto flex items-center justify-center mb-4">
            <Receipt className="w-7 h-7 text-gray-400" />
          </div>
          <Text className="text-[1.125rem]" style={{ fontWeight: 600 }}>No transactions found</Text>
          <Text className="text-gray-500 text-[0.875rem] mt-1">Try adjusting your filters or date range.</Text>
        </motion.div>
      ) : (
        <div className="space-y-6 px-6">
          <AnimatePresence mode="popLayout">
            {groups.map((g) => (
              <motion.div layout key={g.date} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <Text className="text-[0.75rem] text-gray-500 tracking-widest uppercase mb-3 ml-1" style={{ fontWeight: 700 }}>
                  {g.date}
                </Text>
                <div className="bg-white rounded-2xl border border-gray-100 shadow-[0_2px_12px_rgba(0,0,0,0.03)] overflow-hidden">
                  {g.items.map((t, idx) => {
                    const catDef = CATEGORY_OPTIONS.find((c) => c.id === t.category);
                    return (
                      <motion.button 
                        whileTap={{ backgroundColor: "#f9fafb" }}
                        key={t.id} 
                        onClick={() => setSelectedTransaction(t)} 
                        className={`w-full flex items-center justify-between py-4 px-4 transition-colors ${idx > 0 ? "border-t border-gray-100" : ""}`}
                      >
                        <div className="flex items-center gap-4 min-w-0">
                          <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 ${catDef?.bg || "bg-gray-100"}`}>
                            {catDef ? <catDef.icon className={`w-5 h-5 ${catDef.color}`} strokeWidth={2.5} /> : <ShoppingBag className="w-5 h-5 text-gray-500" />}
                          </div>
                          <div className="text-left min-w-0">
                            <Text className="text-[1rem] truncate mb-0.5 text-black" style={{ fontWeight: 600 }}>{t.label}</Text>
                            <div className="flex items-center gap-1.5 text-[0.8125rem] text-gray-500 font-medium">
                              <span>{t.time}</span>
                              <span>·</span>
                              <span>{catDef?.label}</span>
                            </div>
                          </div>
                        </div>
                        <Text className={`text-[1.0625rem] shrink-0 ml-3 tracking-tight ${t.type !== "debit" ? "text-green-600" : "text-black"}`} style={{ fontWeight: 700 }}>
                          {t.amount}
                        </Text>
                      </motion.button>
                    );
                  })}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          
          {hasMore && (
            <motion.div layout>
              <button 
                onClick={() => setVisible((v) => v + PAGE_SIZE)} 
                className="w-full mt-4 py-3.5 rounded-xl border border-black text-black font-bold text-[0.9375rem] hover:bg-gray-50 transition active:scale-[0.98]"
              >
                Show more
              </button>
            </motion.div>
          )}
          {!hasMore && filtered.length > PAGE_SIZE && (
            <Text className="text-center text-gray-400 text-[0.8125rem] mt-6 font-medium pb-4">
              You've reached the end of the list
            </Text>
          )}
        </div>
      )}
      
      <AnimatePresence>
        {selectedTransaction && (
          <InvoiceModal transaction={selectedTransaction} onClose={() => setSelectedTransaction(null)} />
        )}
      </AnimatePresence>
    </div>
  );
}
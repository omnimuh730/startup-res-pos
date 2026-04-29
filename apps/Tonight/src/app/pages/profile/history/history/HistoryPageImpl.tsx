import { useEffect, useState } from "react";
import { Gift, Plus, Receipt, Send, ShoppingBag, Star, Wallet, ArrowLeft } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { InvoiceModal } from "./InvoiceModal";
import { generateMockTransactions, rangeFromPreset } from "./mockData";
import { PeriodPicker } from "./PeriodPicker";
import type { DateRange, TxCategory, TxRecord } from "./types";

const CATEGORY_OPTIONS: { id: "all" | TxCategory; label: string; icon: any; color: string }[] = [
  { id: "all", label: "Home", icon: Wallet, color: "text-gray-900" },
  { id: "charge", label: "Charge", icon: Plus, color: "text-gray-900" },
  { id: "pay", label: "Pay", icon: ShoppingBag, color: "text-gray-900" },
  { id: "reward", label: "Reward", icon: Star, color: "text-gray-900" },
  { id: "referral", label: "Referral", icon: Send, color: "text-gray-900" },
  { id: "gift", label: "Gift", icon: Gift, color: "text-gray-900" },
];

const PAGE_SIZE = 20;

export function HistoryPage({ onBack }: { onBack: () => void }) {
  const [selectedTransaction, setSelectedTransaction] = useState<TxRecord | null>(null);
  const [range, setRange] = useState<DateRange>(() => rangeFromPreset("1m"));
  const [category, setCategory] = useState<"all" | TxCategory>("all");
  const [visible, setVisible] = useState(PAGE_SIZE);
  
  const [allTransactions] = useState(() => generateMockTransactions(84));
  
  const filtered = allTransactions.filter((t) => 
    (category === "all" || t.category === category) && 
    t.dateObj.getTime() >= range.from.getTime() && 
    t.dateObj.getTime() <= range.to.getTime()
  );

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
    <div className="fixed inset-0 z-50 bg-white flex flex-col font-sans">
      
      {/* Header */}
      <div className="flex items-center justify-between px-4 pt-12 pb-2 bg-white shrink-0">
        <button onClick={onBack} className="w-10 h-10 -ml-2 rounded-full hover:bg-gray-100 flex items-center justify-center text-black cursor-pointer transition">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <span className="font-bold text-[1rem] tracking-tight">Transaction History</span>
        <div className="w-10" />
      </div>

      {/* Top Controls (Sticky) */}
      <div className="shrink-0 bg-white z-10 border-b border-black/[0.04] pb-2">
        <div className="px-4 mb-4">
          <PeriodPicker value={range} onChange={setRange} />
        </div>

        {/* ✨ Notion-style Semantic Animated Tabs ✨ */}
        <div className="px-4">
          <div className="flex gap-1.5 overflow-x-auto pb-2 -mb-2 [&::-webkit-scrollbar]:hidden touch-pan-x">
            {CATEGORY_OPTIONS.map((c) => {
              const Icon = c.icon;
              const isActive = category === c.id;
              
              return (
                <motion.button 
                  layout
                  key={c.id} 
                  onClick={() => setCategory(c.id)} 
                  className={`relative flex items-center justify-center h-10 rounded-full transition-colors cursor-pointer shrink-0 ${
                    isActive ? "px-4 text-gray-900" : "w-10 text-gray-500 hover:bg-gray-50"
                  }`}
                >
                  {/* Light gray background pill for active state */}
                  {isActive && (
                    <motion.div 
                      layoutId="activeCategoryBg" 
                      className="absolute inset-0 bg-gray-100 rounded-full"
                      transition={{ type: "spring", stiffness: 500, damping: 35, mass: 0.8 }}
                    />
                  )}
                  
                  <div className="relative z-10 flex items-center">
                    <Icon className="w-[18px] h-[18px] shrink-0" strokeWidth={isActive ? 2 : 1.5} />
                    
                    {/* Animated Text Reveal */}
                    <AnimatePresence>
                      {isActive && (
                        <motion.span
                          initial={{ width: 0, opacity: 0, marginLeft: 0 }}
                          animate={{ width: "auto", opacity: 1, marginLeft: 8 }}
                          exit={{ width: 0, opacity: 0, marginLeft: 0 }}
                          transition={{ type: "spring", stiffness: 500, damping: 35, mass: 0.8 }}
                          className="overflow-hidden whitespace-nowrap text-[0.9375rem] font-medium tracking-tight"
                        >
                          {c.label}
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </div>
                </motion.button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Scrollable List */}
      <div className="flex-1 overflow-y-auto px-4 py-4">
        
        {/* Results Count & Reset */}
        <div className="flex items-center justify-between mb-4">
          <span className="text-[0.8125rem] font-medium text-gray-400">
            {filtered.length} transaction{filtered.length === 1 ? "" : "s"}
          </span>
          {(category !== "all" || range.presetId !== "1m") && (
            <button 
              onClick={() => { setCategory("all"); setRange(rangeFromPreset("1m")); }} 
              className="text-[0.8125rem] font-medium text-black hover:underline cursor-pointer"
            >
              Reset filters
            </button>
          )}
        </div>

        {/* Empty State */}
        {filtered.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            className="text-center py-16"
          >
            <div className="w-16 h-16 rounded-full bg-gray-50 mx-auto flex items-center justify-center mb-4 border border-black/[0.04]">
              <Receipt className="w-6 h-6 text-gray-400" />
            </div>
            <h3 className="text-[1.125rem] font-bold text-black tracking-tight mb-1">No transactions found</h3>
            <p className="text-[0.9375rem] text-gray-500">Try adjusting your filters or date range.</p>
          </motion.div>
        ) : (
          /* Grouped Transactions */
          <div className="space-y-6">
            <AnimatePresence mode="popLayout">
              {groups.map((g, groupIndex) => (
                <motion.div 
                  key={g.date}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: groupIndex * 0.05 }}
                >
                  <h3 className="text-[0.9375rem] font-bold text-black mb-3 pl-1">
                    {g.date}
                  </h3>
                  <div className="bg-white rounded-2xl border border-black/[0.06] shadow-[0_2px_12px_rgba(0,0,0,0.02)] overflow-hidden">
                    {g.items.map((t, idx) => {
                      const opt = CATEGORY_OPTIONS.find(c => c.id === t.category);
                      const isCredit = t.type !== "debit";
                      
                      return (
                        <button 
                          key={t.id} 
                          onClick={() => setSelectedTransaction(t)} 
                          className={`w-full flex items-center justify-between p-4 bg-white hover:bg-gray-50 transition cursor-pointer text-left ${
                            idx > 0 ? "border-t border-black/[0.04]" : ""
                          }`}
                        >
                          <div className="flex items-center gap-4 min-w-0">
                            {/* Icon Circle (Keeping original colors for list items) */}
                            <div className="w-12 h-12 rounded-full bg-[#f3f4f6] flex items-center justify-center shrink-0">
                              {t.category === "charge" ? <Plus className="w-5 h-5 text-[#008A44]" /> 
                                : t.category === "gift" ? <Gift className="w-5 h-5 text-[#008A44]" /> 
                                : t.category === "reward" ? <Star className="w-5 h-5 text-[#FF5A5F]" /> 
                                : t.category === "referral" ? <Send className="w-5 h-5 text-blue-500" /> 
                                : <ShoppingBag className="w-5 h-5 text-black" />}
                            </div>
                            
                            {/* Text Info */}
                            <div className="min-w-0 pr-4">
                              <p className="text-[1rem] font-bold text-black truncate leading-tight mb-1">
                                {t.label}
                              </p>
                              <div className="flex items-center gap-1.5">
                                <span className="text-[0.8125rem] text-gray-500 font-medium">{t.time}</span>
                                <span className="text-gray-300">·</span>
                                <span className="text-[0.8125rem] text-gray-500 font-medium">{opt?.label}</span>
                              </div>
                            </div>
                          </div>
                          
                          {/* Amount */}
                          <div className={`text-[1rem] font-bold shrink-0 tracking-tight ${isCredit ? "text-[#008A44]" : "text-black"}`}>
                            {isCredit ? "+" : ""}{t.amount}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {/* Load More Area */}
            {hasMore ? (
              <button 
                onClick={() => setVisible((v) => v + PAGE_SIZE)} 
                className="w-full py-4 rounded-[1.25rem] border border-black/[0.08] font-bold text-black text-[0.9375rem] hover:bg-gray-50 transition cursor-pointer"
              >
                Load {Math.min(PAGE_SIZE, filtered.length - visible)} more
              </button>
            ) : filtered.length > PAGE_SIZE ? (
              <div className="text-center pb-8 pt-4">
                <span className="text-[0.875rem] font-medium text-gray-400">You're all caught up.</span>
              </div>
            ) : null}
            
          </div>
        )}
      </div>

      {selectedTransaction && (
        <InvoiceModal transaction={selectedTransaction} onClose={() => setSelectedTransaction(null)} />
      )}
    </div>
  );
}
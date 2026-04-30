import { useEffect, useState } from "react";
import { Gift, Plus, Receipt, Send, ShoppingBag, Star, Wallet, ArrowLeft } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { InvoiceModal } from "./InvoiceModal";
import { generateMockTransactions, rangeFromPreset } from "./mockData";
import { PeriodPicker } from "./PeriodPicker";
import type { DateRange, TxCategory, TxRecord } from "./types";

const CATEGORY_OPTIONS: { id: "all" | TxCategory; label: string; icon: any; }[] = [
  { id: "all", label: "Home", icon: Wallet },
  { id: "charge", label: "Charge", icon: Plus },
  { id: "pay", label: "Pay", icon: ShoppingBag },
  { id: "reward", label: "Reward", icon: Star },
  { id: "referral", label: "Referral", icon: Send },
  { id: "gift", label: "Gift", icon: Gift },
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
    <div className="fixed left-0 right-0 top-0 z-50 flex flex-col bg-white font-sans" style={{ bottom: "var(--app-bottom-chrome-height, 0px)" }}>
      
      {/* Header */}
      <div className="flex items-center justify-between px-4 pt-12 pb-2 bg-white shrink-0">
        <button onClick={onBack} className="w-10 h-10 -ml-2 rounded-full hover:bg-gray-100 flex items-center justify-center cursor-pointer transition">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <span className="text-[1rem]">Transaction History</span>
        <div className="w-10" />
      </div>

      {/* Top Controls (Sticky) */}
      <div className="shrink-0 bg-white z-10 border-b border-black/[0.04] pb-2">
        <div className="px-4 mb-4">
          <PeriodPicker value={range} onChange={setRange} />
        </div>

        {/* Category tabs: sliding pill + smooth label width only (no layout jitter on siblings) */}
        <div className="px-4">
          {/* Full-width row: space-between absorbs variable active-tab width so no dead zone on the right */}
          <div className="flex w-full min-w-0 touch-pan-x justify-between gap-x-1 overflow-x-auto pb-2 -mb-2 [&::-webkit-scrollbar]:hidden">
            {CATEGORY_OPTIONS.map((c) => {
              const Icon = c.icon;
              const isActive = category === c.id;
              
              return (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => setCategory(c.id)}
                  className={`relative flex pr-3 pl-3 h-10 shrink-0 items-center rounded-full text-gray-500 transition-colors duration-200 cursor-pointer hover:text-gray-700 ${
                    isActive ? "min-w-10 text-gray-900 pr-6 pl-6" : "w-10 hover:bg-gray-50"
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="activeCategoryBg"
                      className="absolute inset-0 rounded-full bg-gray-100"
                      transition={{ type: "tween", duration: 0.28, ease: [0.4, 0, 0.2, 1] }}
                    />
                  )}

                  {/* Fixed-width icon rail (2.5rem) keeps the glyph centered in the same spot for active + inactive */}
                  <span className="relative z-10 flex min-w-0 flex-1 items-center justify-start">
                    <span className="flex h-[18px] w-5 shrink-0 items-center justify-center">
                      <Icon className="h-[18px] w-[18px]" strokeWidth={1.75} />
                    </span>
                    <motion.span
                      aria-hidden={!isActive}
                      animate={{
                        maxWidth: isActive ? 120 : 0,
                        opacity: isActive ? 1 : 0,
                      }}
                      transition={{ type: "tween", duration: 0.28, ease: [0.4, 0, 0.2, 1] }}
                      className="overflow-hidden whitespace-nowrap text-left text-[0.9375rem] pl-1"
                    >
                      {c.label}
                    </motion.span>
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Scrollable List */}
      <div className="flex-1 overflow-y-auto px-4 py-4">
        
        {/* Results Count & Reset */}
        <div className="flex items-center justify-between mb-4">
          <span className="text-[0.8125rem] text-gray-400">
            {filtered.length} transaction{filtered.length === 1 ? "" : "s"}
          </span>
          {(category !== "all" || range.presetId !== "1m") && (
            <button 
              onClick={() => { setCategory("all"); setRange(rangeFromPreset("1m")); }} 
              className="text-[0.8125rem] hover:underline cursor-pointer"
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
            <h3 className="text-[1.125rem] mb-1">No transactions found</h3>
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
                  <h3 className="text-[0.9375rem] mb-3 pl-1">
                    {g.date}
                  </h3>
                  <div className="bg-white rounded-2xl border border-black/[0.06] shadow-[0_2px_12px_rgba(0,0,0,0.02)] overflow-hidden">
                    {g.items.map((t, idx) => {
                      const opt = CATEGORY_OPTIONS.find(c => c.id === t.category);
                      
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
                              {t.category === "charge" ? <Plus className="w-5 h-5"/> 
                                : t.category === "gift" ? <Gift className="w-5 h-5" /> 
                                : t.category === "reward" ? <Star className="w-5 h-5" /> 
                                : t.category === "referral" ? <Send className="w-5 h-5 text-blue-500" /> 
                                : <ShoppingBag className="w-5 h-5" />}
                            </div>
                            
                            {/* Text Info */}
                            <div className="min-w-0 pr-4">
                              <p className="mb-1 text-gray-700">
                                {t.label}
                              </p>
                              <div className="flex items-center gap-1.5">
                                <span className="text-[0.8125rem] text-gray-500">{t.time}</span>
                                <span className="text-gray-300">·</span>
                                <span className="text-[0.8125rem] text-gray-500">{opt?.label}</span>
                              </div>
                            </div>
                          </div>
                          
                          {/* Amount */}
                          <div className="text-gray-500">
                            {t.amount}
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
                className="w-full py-4 rounded-[1.25rem] border border-black/[0.08] text-[0.9375rem] hover:bg-gray-50 transition cursor-pointer"
              >
                Load {Math.min(PAGE_SIZE, filtered.length - visible)} more
              </button>
            ) : filtered.length > PAGE_SIZE ? (
              <div className="text-center pb-8 pt-4">
                <span className="text-[0.875rem] text-gray-400">You're all caught up.</span>
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

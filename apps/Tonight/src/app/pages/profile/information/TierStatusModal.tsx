import { useEffect } from "react";
import { Check, Crown, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Text } from "../../../components/ds/Text";

export function TierStatusModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  // Prevent body scroll when the modal is open
  useEffect(() => {
    if (open) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Blocking Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[500] bg-black/40 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Modal / Sheet Content Container */}
          <div className="fixed inset-0 z-[501] flex items-end sm:items-center justify-center pointer-events-none">
            <motion.div
              initial={{ y: "100%", opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: "100%", opacity: 0 }}
              transition={{ type: "spring", damping: 26, stiffness: 260 }}
              className="w-full sm:max-w-md bg-card rounded-t-[28px] sm:rounded-3xl shadow-2xl flex flex-col pointer-events-auto"
              style={{ maxHeight: "85dvh" }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Mobile handle indicator */}
              <div className="w-full flex justify-center pt-3 pb-1 sm:hidden">
                <div className="w-10 h-1.5 rounded-full bg-border" />
              </div>

              {/* Header */}
              <div className="flex items-center justify-between px-5 pt-2 pb-4 shrink-0 border-b border-border/50">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-amber-500/10 flex items-center justify-center">
                    <Crown className="w-4 h-4 text-amber-500" strokeWidth={2.5} />
                  </div>
                  <Text className="text-[18px] font-bold text-foreground">Tier Benefits</Text>
                </div>
                <button 
                  onClick={onClose} 
                  className="w-8 h-8 rounded-full bg-secondary hover:bg-border flex items-center justify-center transition-colors text-muted-foreground" 
                  aria-label="Close"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              
              {/* Scrollable Content */}
              <div className="flex-1 overflow-y-auto px-5 py-5 space-y-4">
                
                {/* Current Tier VIP Card */}
                <div className="rounded-2xl p-4 bg-foreground text-background shadow-lg relative overflow-hidden">
                  <div className="absolute -top-6 -right-6 opacity-10">
                    <Crown className="w-32 h-32" />
                  </div>
                  <Text className="text-[11px] uppercase text-background/70 font-bold tracking-widest mb-1">Current Tier</Text>
                  <Text className="text-[22px] font-bold text-background leading-tight">GOLD · Level 2</Text>
                  
                  <div className="flex items-center gap-3 mt-3">
                    <div className="h-1.5 flex-1 bg-background/20 rounded-full overflow-hidden">
                      <div className="h-full bg-amber-500 rounded-full w-[67%]" />
                    </div>
                    <Text className="text-background/90 text-[12px] font-semibold whitespace-nowrap">660 to Platinum</Text>
                  </div>
                </div>

                {/* Tier List */}
                <div className="space-y-3">
                  {[
                    { tier: "Silver", min: 0, perks: ["Standard reservations", "Basic support", "5% birthday bonus"] },
                    { tier: "Gold", min: 1000, perks: ["Priority booking window", "10% wallet bonus", "Free cancellation up to 2h", "Dedicated chat support"] },
                    { tier: "Platinum", min: 5000, perks: ["Concierge reservations", "20% wallet bonus", "Complimentary welcome drink", "Exclusive chef tables"] },
                    { tier: "Diamond", min: 10000, perks: ["Private dining priority", "30% wallet bonus", "VIP event invites", "Personal sommelier picks"] },
                  ].map((t) => {
                    const isCurrent = t.tier === "Gold";
                    return (
                      <div 
                        key={t.tier} 
                        className={`rounded-2xl p-4 border transition-colors ${
                          isCurrent 
                            ? "border-amber-500/40 bg-amber-500/5 shadow-sm" 
                            : "border-border/60 bg-card"
                        }`}
                      >
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-2">
                            <Text className="text-[16px] font-bold text-foreground">{t.tier}</Text>
                            {isCurrent && (
                              <span className="px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-600 text-[10px] font-bold uppercase tracking-wider">
                                Current
                              </span>
                            )}
                          </div>
                          <Text className="text-muted-foreground text-[13px] font-semibold">{t.min.toLocaleString()}+ pts</Text>
                        </div>
                        <ul className="space-y-2">
                          {t.perks.map((p) => (
                            <li key={p} className="flex items-start gap-2.5">
                              <Check className={`w-4 h-4 mt-0.5 shrink-0 ${isCurrent ? "text-amber-500" : "text-muted-foreground/50"}`} strokeWidth={3} />
                              <Text className="text-[13px] text-muted-foreground font-medium leading-snug">{p}</Text>
                            </li>
                          ))}
                        </ul>
                      </div>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
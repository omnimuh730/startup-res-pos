import { Check, Crown, X } from "lucide-react";
import { Text } from "../../../components/ds/Text";

export function TierStatusModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[500] flex items-end justify-center bg-black/40 backdrop-blur-sm md:items-center" onClick={onClose}>
      <div
        className="w-full md:max-w-md bg-white rounded-t-[2rem] md:rounded-[2rem] shadow-2xl flex flex-col"
        style={{ maxHeight: "min(85dvh, 720px)" }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 pt-6 pb-4 shrink-0 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <Crown className="w-6 h-6 text-amber-500" strokeWidth={2} />
            <Text className="text-xl font-bold text-black">Tier Benefits</Text>
          </div>
          <button onClick={onClose} className="w-9 h-9 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center cursor-pointer text-black" aria-label="Close">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto px-6 py-6">
          <div className="rounded-[1.25rem] p-5 mb-6 bg-gradient-to-r from-amber-500 to-amber-400 text-white shadow-md">
            <Text className="text-[0.6875rem] uppercase text-white/80 font-bold tracking-widest">Current Tier</Text>
            <Text className="text-[1.5rem] font-bold mt-1">GOLD · Level 2</Text>
            <Text className="text-white/90 text-[0.875rem] mt-1">2,340 pts · 660 to Platinum</Text>
          </div>
          <div className="space-y-4">
            {[
              { tier: "Silver", min: 0, perks: ["Standard reservations", "Basic support", "5% birthday bonus"] },
              { tier: "Gold", min: 1000, perks: ["Priority booking window", "10% wallet bonus", "Free cancellation up to 2h", "Dedicated chat support"] },
              { tier: "Platinum", min: 5000, perks: ["Concierge reservations", "20% wallet bonus", "Complimentary welcome drink", "Exclusive chef tables"] },
              { tier: "Diamond", min: 10000, perks: ["Private dining priority", "30% wallet bonus", "VIP event invites", "Personal sommelier picks"] },
            ].map((t) => {
              const isCurrent = t.tier === "Gold";
              return (
                <div key={t.tier} className={`rounded-[1.25rem] p-5 border transition ${isCurrent ? "border-amber-500 bg-amber-50/50 shadow-sm" : "border-gray-200 bg-transparent"}`}>
                  <div className="flex items-center justify-between mb-3">
                    <Text className="text-[1.125rem] font-bold text-black">{t.tier}</Text>
                    <Text className="text-gray-500 text-[0.8125rem] font-medium">{t.min.toLocaleString()}+ pts</Text>
                  </div>
                  <ul className="space-y-2">
                    {t.perks.map((p) => (
                      <li key={p} className="flex items-start gap-3 text-[0.875rem] text-gray-600">
                        <Check className={`w-4 h-4 mt-0.5 shrink-0 ${isCurrent ? "text-amber-500" : "text-gray-400"}`} strokeWidth={2.5} />
                        <span className="leading-snug">{p}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

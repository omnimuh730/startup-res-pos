/* Daily Bonus — pick-a-gift modal shown once per day on signin */
import { useState } from "react";
import { Gift, Sparkles, PartyPopper } from "lucide-react";
import { Modal, ModalBody } from "../../components/ds/Modal";
import { Button } from "../../components/ds/Button";

export type DailyBonusReward = {
  id: string;
  label: string;
  description: string;
  kind: "bonus" | "coupon" | "points" | "fx";
};

const REWARDS: DailyBonusReward[] = [
  { id: "bonus-5k",   label: "\u20A95,000 Bonus",      description: "Added to your bonus wallet",    kind: "bonus" },
  { id: "bonus-10k",  label: "\u20A910,000 Bonus",     description: "Added to your bonus wallet",    kind: "bonus" },
  { id: "coupon-free",label: "Free Delivery Coupon",   description: "Use on any order this week",    kind: "coupon" },
  { id: "points-50",  label: "50 Reward Points",       description: "Earned toward your next tier",  kind: "points" },
  { id: "fx-waiver",  label: "FX Fee Waiver",          description: "Next foreign-card payment",      kind: "fx" },
  { id: "bonus-20k",  label: "\u20A920,000 Bonus",     description: "Jackpot! Added to wallet",       kind: "bonus" },
];

const BOX_COUNT = 3;

export function DailyBonusModal({ open, onClose, onClaim }: { open: boolean; onClose: () => void; onClaim: (reward: DailyBonusReward) => void }) {
  const [choices] = useState(() => {
    const shuffled = [...REWARDS].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, BOX_COUNT);
  });
  const [selected, setSelected] = useState<number | null>(null);
  const [revealed, setRevealed] = useState(false);

  const handlePick = (i: number) => {
    if (revealed) return;
    setSelected(i);
    setTimeout(() => setRevealed(true), 500);
  };

  const reward = selected !== null ? choices[selected] : null;

  const handleClaim = () => {
    if (reward) onClaim(reward);
    onClose();
  };

  return (
    <Modal open={open} onClose={onClose} size="md" closeOnOverlay={false} showCloseButton={!revealed}>
      <ModalBody className="p-6 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-[0.75rem] mb-3" style={{ fontWeight: 600 }}>
          <Sparkles className="w-3.5 h-3.5" /> DAILY BONUS
        </div>
        <h2 className="text-[1.25rem]" style={{ fontWeight: 700 }}>
          {revealed ? "You won!" : "Pick a gift!"}
        </h2>
        <p className="text-[0.875rem] text-muted-foreground mt-1">
          {revealed ? "Here's your daily reward" : "Tap one of the boxes below to reveal today's reward"}
        </p>

        <div className="grid grid-cols-3 gap-3 mt-5">
          {choices.map((r, i) => {
            const isPicked = selected === i;
            const isOther = selected !== null && !isPicked;
            return (
              <button
                key={r.id}
                disabled={revealed}
                onClick={() => handlePick(i)}
                className={`relative rounded-xl aspect-square flex flex-col items-center justify-center border-2 transition-all ${
                  isPicked
                    ? "border-primary bg-primary/10 scale-105"
                    : isOther
                    ? "border-border bg-secondary/40 opacity-50"
                    : "border-border bg-card hover:border-primary/60 hover:bg-primary/5 cursor-pointer"
                }`}
                style={{ transform: isPicked && !revealed ? "rotateY(180deg)" : undefined, transition: "transform 0.5s" }}
              >
                {revealed && isPicked ? (
                  <div className="flex flex-col items-center px-2">
                    <PartyPopper className="w-6 h-6 text-primary mb-1" />
                    <span className="text-[0.6875rem]" style={{ fontWeight: 700 }}>{r.label}</span>
                  </div>
                ) : (
                  <Gift className={`w-9 h-9 ${isPicked ? "text-primary" : "text-muted-foreground"}`} />
                )}
              </button>
            );
          })}
        </div>

        {revealed && reward && (
          <div className="mt-5 p-3 rounded-xl bg-success/10 border border-success/30">
            <p className="text-[0.9375rem] text-success" style={{ fontWeight: 700 }}>{reward.label}</p>
            <p className="text-[0.75rem] text-muted-foreground mt-0.5">{reward.description}</p>
          </div>
        )}

        <Button variant="primary" onClick={handleClaim} disabled={!revealed} className="w-full mt-5">
          {revealed ? "Claim Reward" : "Select a box"}
        </Button>
      </ModalBody>
    </Modal>
  );
}

const STORAGE_KEY = "daily-bonus-last-claim";

const listeners = new Set<() => void>();
function todayKey() { return new Date().toISOString().slice(0, 10); }
function readClaimed(): boolean {
  try { return localStorage.getItem(STORAGE_KEY) === todayKey(); } catch { return false; }
}
let claimedSnapshot = readClaimed();

export const dailyBonusStore = {
  subscribe(cb: () => void) { listeners.add(cb); return () => { listeners.delete(cb); }; },
  getSnapshot() { return claimedSnapshot; },
};

export function shouldShowDailyBonus(): boolean {
  return !readClaimed();
}

export function markDailyBonusClaimed() {
  try { localStorage.setItem(STORAGE_KEY, todayKey()); } catch {}
  claimedSnapshot = true;
  listeners.forEach((l) => l());
}

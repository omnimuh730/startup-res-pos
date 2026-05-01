/* Daily Bonus — pick-a-gift modal shown once per day on signin */
import { useState, useEffect } from "react";
import { Gift, Sparkles, PartyPopper, Ticket, Coins, Star, Globe } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Modal, ModalBody } from "../../../components/ds/Modal";
import { Button } from "../../../components/ds/Button";

export type DailyBonusReward = {
  id: string;
  label: string;
  description: string;
  kind: "bonus" | "coupon" | "points" | "fx";
};

// Expanded pool to ensure we can fill 9 boxes with exciting options
const REWARDS_POOL: DailyBonusReward[] = [
  { id: "bonus-1k",   label: "₩1,000",      description: "Bonus Wallet",   kind: "bonus" },
  { id: "bonus-5k",   label: "₩5,000",      description: "Bonus Wallet",   kind: "bonus" },
  { id: "bonus-10k",  label: "₩10,000",     description: "Bonus Wallet",   kind: "bonus" },
  { id: "bonus-20k",  label: "₩20,000",     description: "Jackpot!",       kind: "bonus" },
  { id: "coupon-10",  label: "10% Off",     description: "Dining Coupon",  kind: "coupon" },
  { id: "coupon-free",label: "Free Delivery",description: "Any order",     kind: "coupon" },
  { id: "points-50",  label: "50 Pts",      description: "Reward Points",  kind: "points" },
  { id: "points-100", label: "100 Pts",     description: "Reward Points",  kind: "points" },
  { id: "fx-waiver",  label: "Zero FX",     description: "Fee Waiver",     kind: "fx" },
];

const BOX_COUNT = 9;

// Helper to map kind to a premium Lucide icon
const getRewardIcon = (kind: DailyBonusReward["kind"], className: string) => {
  switch (kind) {
    case "bonus": return <Coins className={className} strokeWidth={1.5} />;
    case "coupon": return <Ticket className={className} strokeWidth={1.5} />;
    case "points": return <Star className={className} strokeWidth={1.5} />;
    case "fx": return <Globe className={className} strokeWidth={1.5} />;
    default: return <Gift className={className} strokeWidth={1.5} />;
  }
};

export function DailyBonusModal({ open, onClose, onClaim }: { open: boolean; onClose: () => void; onClaim: (reward: DailyBonusReward) => void }) {
  // Generate 9 random choices
  const [choices] = useState(() => {
    const shuffled = [...REWARDS_POOL].sort(() => Math.random() - 0.5);
    // If pool is smaller than 9, repeat items to fill
    const grid = [];
    for (let i = 0; i < BOX_COUNT; i++) {
      grid.push({ ...shuffled[i % shuffled.length], uniqueId: `box-${i}` });
    }
    return grid.sort(() => Math.random() - 0.5); // shuffle the final grid
  });

  const [selected, setSelected] = useState<number | null>(null);
  const [revealed, setRevealed] = useState(false);
  const [showOthers, setShowOthers] = useState(false);

  const handlePick = (i: number) => {
    if (selected !== null) return;
    setSelected(i);
    setRevealed(true);
    
    // Delay revealing the other boxes to build suspense
    setTimeout(() => {
      setShowOthers(true);
    }, 600);
  };

  const reward = selected !== null ? choices[selected] : null;

  const handleClaim = () => {
    if (reward) onClaim(reward);
    onClose();
  };

  // Reset state if modal closes and reopens (for testing)
  useEffect(() => {
    if (open && !revealed) {
      setSelected(null);
      setRevealed(false);
      setShowOthers(false);
    }
  }, [open]);

  return (
    <Modal open={open} onClose={onClose} size="md" closeOnOverlay={false} showCloseButton={!revealed}>
      <ModalBody className="p-5 text-center overflow-hidden">
        
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-5"
        >
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-primary/10 text-primary text-[11px] font-bold tracking-wide uppercase mb-3">
            <Sparkles className="w-3.5 h-3.5" /> Daily Drop
          </div>
          <h2 className="text-[22px] font-bold text-foreground leading-tight">
            {revealed ? "You won!" : "Pick a gift"}
          </h2>
          <p className="text-[13px] text-muted-foreground mt-1">
            {revealed ? "Here's your daily reward." : "Tap one of the boxes to reveal today's prize."}
          </p>
        </motion.div>

        {/* 3x3 Grid */}
        <motion.div 
          className="grid grid-cols-3 gap-2 mx-auto max-w-[300px]"
          variants={{
            hidden: { opacity: 0 },
            show: { opacity: 1, transition: { staggerChildren: 0.05 } }
          }}
          initial="hidden"
          animate="show"
        >
          {choices.map((r, i) => {
            const isPicked = selected === i;
            const isOther = selected !== null && !isPicked;
            const isFlipped = isPicked || (isOther && showOthers);

            return (
              <motion.button
                key={r.uniqueId}
                disabled={selected !== null}
                onClick={() => handlePick(i)}
                className="relative aspect-square w-full perspective-1000 cursor-pointer"
                variants={{
                  hidden: { opacity: 0, scale: 0.8 },
                  show: { opacity: 1, scale: 1, transition: { type: "spring", bounce: 0.4 } }
                }}
                whileHover={selected === null ? { scale: 1.05 } : {}}
                whileTap={selected === null ? { scale: 0.95 } : {}}
              >
                <motion.div
                  className="w-full h-full relative preserve-3d"
                  animate={{ rotateY: isFlipped ? 180 : 0 }}
                  transition={{ type: "spring", stiffness: 260, damping: 20 }}
                >
                  {/* Front of Box (Unopened) */}
                  <div 
                    className="absolute inset-0 backface-hidden bg-secondary rounded-xl flex items-center justify-center border border-border/50 hover:bg-secondary/80 transition-colors"
                  >
                    <Gift className="w-8 h-8 text-muted-foreground/60" strokeWidth={1.5} />
                  </div>

                  {/* Back of Box (Revealed) */}
                  <div 
                    className={`absolute inset-0 backface-hidden rounded-xl flex flex-col items-center justify-center rotate-y-180 p-1
                      ${isPicked 
                        ? "bg-primary/10 border-2 border-primary shadow-[0_4px_20px_rgba(255,56,92,0.15)]" 
                        : "bg-secondary/40 border border-border/30 opacity-60"
                      }
                    `}
                  >
                    {isPicked && (
                      <motion.div 
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: 0.2, type: "spring" }}
                        className="absolute -top-3 -right-3"
                      >
                        <PartyPopper className="w-6 h-6 text-primary drop-shadow-md" />
                      </motion.div>
                    )}
                    
                    {getRewardIcon(r.kind, `w-6 h-6 mb-1 ${isPicked ? "text-primary" : "text-muted-foreground"}`)}
                    <span className={`text-[11px] leading-tight text-center ${isPicked ? "font-bold text-primary" : "font-semibold text-muted-foreground"}`}>
                      {r.label}
                    </span>
                  </div>
                </motion.div>
              </motion.button>
            );
          })}
        </motion.div>

        {/* Claim Action Area */}
        <AnimatePresence>
          {showOthers && reward && (
            <motion.div 
              initial={{ opacity: 0, height: 0, y: 10 }}
              animate={{ opacity: 1, height: "auto", y: 0 }}
              transition={{ type: "spring", bounce: 0.3, duration: 0.6 }}
              className="mt-6"
            >
              <div className="bg-secondary/50 rounded-xl p-3.5 mb-4 border border-border/50">
                <p className="text-[15px] font-bold text-foreground">{reward.label}</p>
                <p className="text-[13px] text-muted-foreground mt-0.5">{reward.description}</p>
              </div>

              <Button 
                variant="primary" 
                onClick={handleClaim} 
                className="w-full h-[52px] rounded-full text-[15px] font-bold shadow-[0_8px_24px_rgba(255,56,92,0.2)] hover:shadow-[0_8px_24px_rgba(255,56,92,0.3)] transition-all"
              >
                Claim Reward
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* Placeholder to keep height stable before claim appears */}
        {!showOthers && <div className="h-[20px]" />}
      </ModalBody>
    </Modal>
  );
}

// ... Store logic remains exactly the same below ...
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
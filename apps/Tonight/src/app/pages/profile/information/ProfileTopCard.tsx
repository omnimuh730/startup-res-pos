import { Crown } from "lucide-react";
import { motion } from "framer-motion";
import { Text } from "../../../components/ds/Text";

type ProfileTopCardProps = {
  selectedAvatar: string | null;
  onOpenAvatarPicker: () => void;
  onOpenTierDetails: () => void;
  planType: "free" | "pro";
  cardShadow?: string;
};

export function ProfileTopCard({
  selectedAvatar,
  onOpenAvatarPicker,
  onOpenTierDetails,
  planType,
  cardShadow = "",
}: ProfileTopCardProps) {
  const isPro = planType === "pro";
  const avatarSrc = selectedAvatar
    ? selectedAvatar.replace(/([?&]w=)\d+/i, "$1640").replace(/([?&]h=)\d+/i, "$1640")
    : null;

  return (
    <div className={`mx-5 bg-card border border-border/50 rounded-3xl p-4 flex flex-col items-center text-center relative overflow-hidden ${cardShadow}`}>
      <div className="relative mb-2">
        <motion.button
          type="button"
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.94 }}
          onClick={onOpenAvatarPicker}
          className="relative block rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-primary cursor-pointer shrink-0"
        >
          {avatarSrc ? (
            <span
              className="block h-28 w-28 overflow-hidden rounded-full border-2 border-background bg-secondary shadow-sm"
              aria-label="Alex Chen profile photo"
              role="img"
            >
              <img
                src={avatarSrc}
                alt="Alex Chen"
                className="h-full w-full object-cover"
                draggable={false}
              />
            </span>
          ) : (
            <div
              className="h-28 w-28 rounded-full bg-secondary text-foreground flex items-center justify-center text-[40px] font-bold border-2 border-background shadow-sm"
              aria-label="Alex Chen profile photo"
              role="img"
            >
              A
            </div>
          )}

          <span
            className={`absolute bottom-0 right-1 z-10 inline-flex items-center rounded-full border-2 border-background px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide shadow-sm ${
              isPro ? "bg-primary text-primary-foreground" : "bg-gray-700 text-white"
            }`}
          >
            {isPro ? "Pro" : "Free"}
          </span>
        </motion.button>
      </div>

      <Text className="text-[22px] font-bold text-foreground leading-tight">Alex Chen</Text>
      <Text className="text-[14px] text-muted-foreground font-medium mt-0.5 mb-3">@alexchen</Text>

      <motion.button
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.98 }}
        onClick={onOpenTierDetails}
        className="w-full bg-secondary/40 hover:bg-secondary/80 transition-colors rounded-2xl p-3.5 text-left cursor-pointer border border-border/60"
      >
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-amber-500/10 flex items-center justify-center">
              <Crown className="w-3.5 h-3.5 text-amber-500" strokeWidth={2.5} />
            </div>
            <Text className="text-[14px] font-bold text-foreground">Gold Tier</Text>
          </div>
          <Text className="text-[12px] text-muted-foreground font-semibold">660 pts to Platinum</Text>
        </div>
        <div className="h-1.5 w-full bg-border rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: "67%" }}
            transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
            className="h-full bg-amber-500 rounded-full"
          />
        </div>
      </motion.button>
    </div>
  );
}

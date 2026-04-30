import { Avatar } from "../../../components/ds/Avatar";
import { Crown, Pencil } from "lucide-react";

type ProfileTopCardProps = {
  selectedAvatar: string | null;
  onOpenAvatarPicker: () => void;
  onOpenTierDetails: () => void;
  cardShadow: string;
};

export function ProfileTopCard({
  selectedAvatar,
  onOpenAvatarPicker,
  onOpenTierDetails,
  cardShadow,
}: ProfileTopCardProps) {
  return (
    <div className={`mx-4 bg-white rounded-[2rem] p-6 flex flex-col items-center text-center relative overflow-hidden ${cardShadow}`}>
      <div className="relative mb-4">
        <button
          type="button"
          onClick={onOpenAvatarPicker}
          className="relative block rounded-full shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-primary cursor-pointer shrink-0 transition hover:scale-[1.02]"
        >
          {selectedAvatar ? (
            <Avatar name="Alex Chen" size="2xl" src={selectedAvatar} className="w-24 h-24 text-2xl border border-border/20" />
          ) : (
            <div className="w-24 h-24 rounded-full bg-[#222222] text-white flex items-center justify-center text-[2.5rem] font-semibold tracking-tight shadow-inner">
              A
            </div>
          )}

          <div className="absolute bottom-0 right-0 w-8 h-8 bg-white text-black rounded-full shadow-md border border-black/5 flex items-center justify-center z-10">
            <Pencil className="w-3.5 h-3.5" strokeWidth={2.5} />
          </div>
        </button>
      </div>

      <h2 className="text-[1.5rem] font-bold text-black">Alex Chen</h2>
      <div className="flex items-center gap-2 mt-1 mb-5">
        <p className="text-[0.875rem] text-gray-500 font-medium">Guest</p>
      </div>

      <button
        onClick={onOpenTierDetails}
        className="w-full bg-gray-50 hover:bg-gray-100 transition-colors rounded-[1rem] p-3.5 text-left cursor-pointer active:scale-[0.99] border border-gray-100"
      >
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-1.5">
            <Crown className="w-4 h-4 text-amber-500" strokeWidth={2.5} />
            <span className="text-[0.8125rem] font-bold text-black">Gold Tier</span>
          </div>
          <span className="text-[0.6875rem] text-gray-500 font-medium">660 pts to Platinum</span>
        </div>
        <div className="h-1 w-full bg-gray-200 rounded-full overflow-hidden">
          <div className="h-full bg-amber-500 rounded-full w-[67%]" />
        </div>
      </button>
    </div>
  );
}

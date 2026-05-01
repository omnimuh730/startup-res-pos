import { Button } from "../../../components/ds/Button";
import { Text } from "../../../components/ds/Text";
import { Check, X } from "lucide-react";

type Avatar = { id: string; src: string; label: string };

export function AvatarPickerModal({
  open,
  avatars,
  pendingAvatar,
  setPendingAvatar,
  onClose,
  onSave,
}: {
  open: boolean;
  avatars: Avatar[];
  pendingAvatar: string | null;
  setPendingAvatar: (src: string | null) => void;
  onClose: () => void;
  onSave: () => void;
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[500] flex items-end justify-center bg-black/40 backdrop-blur-sm md:items-center" onClick={onClose}>
      <div className="w-full rounded-t-[2rem] bg-white shadow-2xl md:max-w-md md:rounded-[2rem]" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between px-6 pt-6 pb-4">
          <div>
            <Text className="text-xl font-bold text-black">Choose Photo</Text>
            <Text className="mt-1 text-[0.875rem] text-gray-500">Pick from our curated collection</Text>
          </div>
          <button onClick={onClose} className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-full bg-gray-100 text-black hover:bg-gray-200" aria-label="Close">
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="px-6 pb-6">
          <div className="grid grid-cols-4 gap-4">
            {avatars.map((a) => {
              const isPicked = pendingAvatar === a.src;
              return (
                <button
                  key={a.id}
                  onClick={() => setPendingAvatar(a.src)}
                  className={`relative aspect-square overflow-hidden rounded-full transition ring-offset-2 ring-offset-white ${isPicked ? "scale-[1.04] ring-2 ring-black" : "ring-1 ring-gray-200 hover:ring-gray-300"}`}
                  aria-label={a.label}
                >
                  <img src={a.src} alt={a.label} className="h-full w-full object-cover" />
                  {isPicked && (
                    <span className="absolute inset-0 flex items-center justify-center bg-black/20 backdrop-blur-[2px]">
                      <span className="flex h-7 w-7 items-center justify-center rounded-full bg-black text-white"><Check className="h-4 w-4" strokeWidth={3} /></span>
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
        <div className="flex items-center gap-3 border-t border-gray-100 px-6 py-5">
          <Button variant="ghost" size="lg" className="flex-1 rounded-[1rem] text-black hover:bg-gray-100" onClick={() => setPendingAvatar(null)}>Reset</Button>
          <Button variant="primary" size="lg" className="flex-[2] rounded-[1rem] !bg-[#E51D53] !text-white hover:!bg-[#D70466]" onClick={onSave}>Save Photo</Button>
        </div>
      </div>
    </div>
  );
}

import { Utensils, Tag, Gift, Sparkles, MessageCircle, Share2 } from "lucide-react";
import type { Notification } from "../../../../stores/notificationStore";

export const iconMap: Record<
  Notification["icon"],
  {
    Icon: typeof Utensils;
    ring: string;
    surface: string;
    tint: string;
    label: string;
  }
> = {
  reservation: {
    Icon: Utensils,
    ring: "ring-[#E31C5F]/15",
    surface: "bg-[#FFF1F5]",
    tint: "text-[#E31C5F]",
    label: "Reservation",
  },
  promo: {
    Icon: Tag,
    ring: "ring-[#FFB400]/15",
    surface: "bg-[#FFF7DF]",
    tint: "text-[#A16207]",
    label: "Offer",
  },
  reward: {
    Icon: Gift,
    ring: "ring-[#008A5B]/15",
    surface: "bg-[#EAF8F1]",
    tint: "text-[#008A5B]",
    label: "Reward",
  },
  system: {
    Icon: Sparkles,
    ring: "ring-black/10",
    surface: "bg-[#F7F7F7]",
    tint: "text-[#222222]",
    label: "Update",
  },
  review: {
    Icon: MessageCircle,
    ring: "ring-[#5B5FC7]/15",
    surface: "bg-[#F1F2FF]",
    tint: "text-[#4B4FB8]",
    label: "Review",
  },
  share: {
    Icon: Share2,
    ring: "ring-[#0EA5E9]/15",
    surface: "bg-[#EAF6FF]",
    tint: "text-[#0284C7]",
    label: "Shared",
  },
};

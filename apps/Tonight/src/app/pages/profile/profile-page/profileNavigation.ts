export const PRESET_AVATARS: { id: string; src: string; label: string }[] = [
  { id: "a1", src: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=240&h=240&fit=crop&crop=faces", label: "Classic" },
  { id: "a2", src: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=240&h=240&fit=crop&crop=faces", label: "Sunny" },
  { id: "a3", src: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=240&h=240&fit=crop&crop=faces", label: "Warm" },
  { id: "a4", src: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=240&h=240&fit=crop&crop=faces", label: "Sharp" },
  { id: "a5", src: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=240&h=240&fit=crop&crop=faces", label: "Soft" },
  { id: "a6", src: "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=240&h=240&fit=crop&crop=faces", label: "Bold" },
  { id: "a7", src: "https://images.unsplash.com/photo-1502685104226-ee32379fefbe?w=240&h=240&fit=crop&crop=faces", label: "Calm" },
  { id: "a8", src: "https://images.unsplash.com/photo-1463453091185-61582044d556?w=240&h=240&fit=crop&crop=faces", label: "Bright" },
];

export const PAGE_MAP: Record<string, string> = {
  topup: "topUp",
  "send-gift": "sendGift",
  history: "history",
  edit: "profileEdit",
  location: "location",
  refer: "refer",
  friends: "friends",
  settings: "settings",
  subscription: "subscription",
  help: "help",
  "contact-support": "contactSupport",
  notifications: "notifications",
};

export const REVERSE_PAGE_MAP: Record<string, string> = Object.fromEntries(Object.entries(PAGE_MAP).map(([url, state]) => [state, url]));

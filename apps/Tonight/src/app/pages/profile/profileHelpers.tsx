/* Profile shared helpers: PageHeader, fmtR, TierMedalSvg */
import React from "react";
import { ArrowLeft } from "lucide-react";
import { Heading } from "../../components/ds/Text";

export function fmtR(n: number): string {
  if (Number.isInteger(n)) return String(n);
  const s = n.toFixed(2);
  return s.replace(/0+$/, "").replace(/\.$/, "");
}

export function PageHeader({ title, onBack }: { title: string; onBack: () => void }) {
  return (
    <div className="flex items-center gap-3 mb-6">
      <button
        onClick={onBack}
        className="w-9 h-9 rounded-full bg-secondary flex items-center justify-center hover:bg-secondary/80 transition cursor-pointer"
      >
        <ArrowLeft className="w-5 h-5" />
      </button>
      <Heading level={3}>{title}</Heading>
    </div>
  );
}

export type TierType = "silver" | "gold" | "platinum" | "diamond";

export function TierMedalSvg({ tier, size = 28 }: { tier: TierType; size?: number }) {
  const configs: Record<TierType, { bg: string; shine: string; ring: string; symbol: React.ReactNode }> = {
    silver: {
      bg: "#94a3b8", shine: "#cbd5e1", ring: "#64748b",
      symbol: <path d="M12 6l1.5 3.5L17 11l-3.5 1.5L12 16l-1.5-3.5L7 11l3.5-1.5z" fill="#e2e8f0" />,
    },
    gold: {
      bg: "#f59e0b", shine: "#fcd34d", ring: "#d97706",
      symbol: <path d="M12 6l1.5 3.5L17 11l-3.5 1.5L12 16l-1.5-3.5L7 11l3.5-1.5z" fill="#fef3c7" />,
    },
    platinum: {
      bg: "#8b5cf6", shine: "#a78bfa", ring: "#7c3aed",
      symbol: <><path d="M12 7l2 4h-4l2-4z" fill="#e0e7ff" /><path d="M8 11h8l-4 6-4-6z" fill="#c4b5fd" /></>,
    },
    diamond: {
      bg: "#ec4899", shine: "#f472b6", ring: "#db2777",
      symbol: (
        <>
          <path d="M12 6l2.5 4H7.5L12 6z" fill="#fce7f3" />
          <path d="M7.5 10h9L12 17l-4.5-7z" fill="#fbcfe8" />
          <circle cx="12" cy="5" r="1" fill="#fde68a" />
          <circle cx="9" cy="5.5" r="0.7" fill="#fde68a" />
          <circle cx="15" cy="5.5" r="0.7" fill="#fde68a" />
        </>
      ),
    },
  };
  const c = configs[tier];
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="12" r="10" fill={c.bg} />
      <circle cx="12" cy="12" r="10" fill="url(#medalShine)" opacity="0.3" />
      <circle cx="12" cy="12" r="9" stroke={c.ring} strokeWidth="1.5" fill="none" opacity="0.5" />
      {c.symbol}
      <defs>
        <radialGradient id="medalShine" cx="0.35" cy="0.35" r="0.65">
          <stop offset="0%" stopColor="white" stopOpacity="0.6" />
          <stop offset="100%" stopColor="white" stopOpacity="0" />
        </radialGradient>
      </defs>
    </svg>
  );
}

export const REWARD_TIERS = [
  { name: "Silver", min: 0, icon: "silver" as const, color: "#94a3b8" },
  { name: "Gold", min: 1000, icon: "gold" as const, color: "#f59e0b" },
  { name: "Platinum", min: 5000, icon: "platinum" as const, color: "#8b5cf6" },
  { name: "Diamond", min: 10000, icon: "diamond" as const, color: "#ec4899" },
];

export const themePresets: Record<string, Record<string, string>> = {
  Airbnb: {
    "--primary": "#FF385C", "--primary-foreground": "#ffffff", "--secondary": "#f7f7f7", "--secondary-foreground": "#222222",
    "--background": "#ffffff", "--foreground": "#222222", "--card": "#ffffff", "--card-foreground": "#222222",
    "--muted": "#f7f7f7", "--muted-foreground": "#717171", "--accent": "#f0efe9", "--accent-foreground": "#222222",
    "--destructive": "#C13515", "--destructive-foreground": "#ffffff", "--border": "#DDDDDD",
    "--success": "#008A05", "--success-foreground": "#ffffff", "--warning": "#E07912", "--warning-foreground": "#ffffff",
    "--info": "#428BFF", "--info-foreground": "#ffffff",
  },
  Ocean: {
    "--primary": "#0066FF", "--primary-foreground": "#ffffff", "--secondary": "#EBF4FF", "--secondary-foreground": "#1a1a2e",
    "--background": "#ffffff", "--foreground": "#1a1a2e", "--card": "#ffffff", "--card-foreground": "#1a1a2e",
    "--muted": "#f0f4f8", "--muted-foreground": "#64748b", "--accent": "#e0f2fe", "--accent-foreground": "#1a1a2e",
    "--destructive": "#dc2626", "--destructive-foreground": "#ffffff", "--border": "#e2e8f0",
    "--success": "#059669", "--success-foreground": "#ffffff", "--warning": "#d97706", "--warning-foreground": "#ffffff",
    "--info": "#2563eb", "--info-foreground": "#ffffff",
  },
  Forest: {
    "--primary": "#16a34a", "--primary-foreground": "#ffffff", "--secondary": "#f0fdf4", "--secondary-foreground": "#1a2e1a",
    "--background": "#ffffff", "--foreground": "#1a2e1a", "--card": "#ffffff", "--card-foreground": "#1a2e1a",
    "--muted": "#f0fdf4", "--muted-foreground": "#4b6043", "--accent": "#dcfce7", "--accent-foreground": "#1a2e1a",
    "--destructive": "#dc2626", "--destructive-foreground": "#ffffff", "--border": "#d1d5db",
    "--success": "#15803d", "--success-foreground": "#ffffff", "--warning": "#ca8a04", "--warning-foreground": "#ffffff",
    "--info": "#2563eb", "--info-foreground": "#ffffff",
  },
  Midnight: {
    "--primary": "#8b5cf6", "--primary-foreground": "#ffffff", "--secondary": "#1e1b4b", "--secondary-foreground": "#e0e7ff",
    "--background": "#0f0b2a", "--foreground": "#e2e8f0", "--card": "#1a1438", "--card-foreground": "#e2e8f0",
    "--muted": "#1e1b4b", "--muted-foreground": "#94a3b8", "--accent": "#312e81", "--accent-foreground": "#e0e7ff",
    "--destructive": "#ef4444", "--destructive-foreground": "#ffffff", "--border": "#334155",
    "--success": "#22c55e", "--success-foreground": "#ffffff", "--warning": "#f59e0b", "--warning-foreground": "#ffffff",
    "--info": "#60a5fa", "--info-foreground": "#ffffff",
  },
};

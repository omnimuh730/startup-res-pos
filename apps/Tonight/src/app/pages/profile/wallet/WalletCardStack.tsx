import { useState } from "react";
import { Info } from "lucide-react";

export function WalletCardStack({ showBalance, onToggleBalance }: { showBalance: boolean; onToggleBalance: () => void }) {
  const [showInfo, setShowInfo] = useState(false);
  const masked = "••••••";

  return (
    <div>
      <div
        className="relative rounded-[20px] overflow-hidden text-primary-foreground"
        style={{
          background: "linear-gradient(135deg, color-mix(in srgb, var(--primary) 92%, white) 0%, var(--primary) 50%, color-mix(in srgb, var(--primary) 75%, #000) 100%)",
          boxShadow: "0 18px 40px -18px color-mix(in srgb, var(--primary) 55%, transparent), 0 6px 16px -8px color-mix(in srgb, var(--foreground) 25%, transparent)",
        }}
      >
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: "radial-gradient(120% 80% at 100% 0%, rgba(255,255,255,0.22), transparent 55%)" }}
        />
        <div
          className="absolute -bottom-12 -left-10 w-44 h-44 rounded-full pointer-events-none"
          style={{ background: "rgba(255,255,255,0.08)" }}
        />
        <div className="relative z-10 p-4">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2 text-primary-foreground">
              <svg viewBox="0 0 28 28" fill="none" className="w-5 h-5">
                <path d="M14 4.5a9.5 9.5 0 1 0 0 19 9.5 9.5 0 0 0 0-19zm0 6.7a2.8 2.8 0 1 1 0 5.6 2.8 2.8 0 0 1 0-5.6z" fill="currentColor" fillRule="evenodd" />
                <circle cx="1.8" cy="14" r="1.8" fill="currentColor" />
              </svg>
              <span className="text-[0.875rem] tracking-tight" style={{ fontWeight: 700 }}>CatchTable</span>
            </div>
            <button
              onClick={(e) => { e.stopPropagation(); onToggleBalance(); }}
              className="text-[0.75rem] px-2 py-1 rounded-md text-primary-foreground/85 hover:text-primary-foreground hover:bg-white/15 transition cursor-pointer"
              style={{ fontWeight: 500 }}
              aria-label={showBalance ? "Hide balance" : "Show balance"}
            >
              {showBalance ? "Hide" : "Show"}
            </button>
          </div>

          <div className="mt-3 grid grid-cols-2 gap-2.5">
            <div className="rounded-2xl p-3 bg-white/15 border border-white/20 backdrop-blur-sm">
              <p className="text-[0.6875rem] uppercase text-primary-foreground/80" style={{ fontWeight: 600, letterSpacing: "0.08em" }}>Domestic · KRW</p>
              <p className="text-[1.25rem] leading-none mt-1.5" style={{ fontWeight: 700, letterSpacing: "-0.01em" }}>
                {showBalance ? "₩13,330,000" : masked}
              </p>
              <span
                className="inline-flex items-center mt-2 text-[0.6875rem] px-1.5 py-0.5 rounded-full bg-white/25 text-primary-foreground"
                style={{ fontWeight: 600 }}
              >
                +₩330,000 bonus
              </span>
            </div>
            <div className="rounded-2xl p-3 bg-white/15 border border-white/20 backdrop-blur-sm">
              <p className="text-[0.6875rem] uppercase text-primary-foreground/80" style={{ fontWeight: 600, letterSpacing: "0.08em" }}>Foreign · USD</p>
              <p className="text-[1.25rem] leading-none mt-1.5" style={{ fontWeight: 700, letterSpacing: "-0.01em" }}>
                {showBalance ? "$5,000.00" : masked}
              </p>
              <p className="text-[0.6875rem] mt-2 text-primary-foreground/80">VISA ••4242</p>
            </div>
          </div>

          <div className="mt-3 flex items-center justify-between">
            <span className="text-[0.8125rem] tracking-[0.15em] tabular-nums text-primary-foreground/95" style={{ fontWeight: 500 }}>
              {showBalance ? "5282 •••• •••• 1289" : "•••• •••• •••• ••••"}
            </span>
            <button
              onClick={(e) => { e.stopPropagation(); setShowInfo((v) => !v); }}
              className="w-7 h-7 rounded-full flex items-center justify-center text-primary-foreground/80 hover:text-primary-foreground hover:bg-white/15 transition cursor-pointer"
              aria-label="About these balances"
            >
              <Info className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {showInfo && (
        <p className="text-muted-foreground text-[0.6875rem] mt-2 leading-snug">
          Balances aren't interchangeable. Bonus stacks on Domestic only.
        </p>
      )}
    </div>
  );
}

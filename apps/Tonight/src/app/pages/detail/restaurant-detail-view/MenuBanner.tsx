import { ArrowLeft } from "lucide-react";

export function MenuBanner({
  compactBanner,
  onBack,
}: {
  compactBanner: boolean;
  onBack: () => void;
}) {
  return (
    <section
      className={`sticky top-0 z-20 overflow-hidden text-primary-foreground transition-[height] duration-[400ms] ease-[cubic-bezier(0.22,0.61,0.36,1)] ${
        compactBanner ? "h-[4.5rem]" : "h-[12.5rem]"
      }`}
      style={{
        background:
          "linear-gradient(135deg, color-mix(in srgb, var(--primary) 88%, #000 12%) 0%, var(--primary) 55%, color-mix(in srgb, var(--primary) 80%, #fff 20%) 100%)",
      }}
    >
      {/* Decorative artwork layer */}
      <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-16 -left-16 w-56 h-56 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute -bottom-20 right-10 w-72 h-72 rounded-full bg-black/15 blur-3xl" />

        {/* OpenTable style logo (Right side, slightly pushed in from the edge) */}
        <svg
          viewBox="0 0 240 240"
          className={`absolute text-white transition-all duration-[440ms] ease-[cubic-bezier(0.22,0.61,0.36,1)] ${
            compactBanner
              ? "top-1/2 -translate-y-1/2 right-6 w-[2.75rem] h-[2.75rem] opacity-40"
              : "top-1/2 -translate-y-1/2 right-[8%] w-[10rem] h-[10rem] opacity-[0.22]"
          }`}
        >
          <mask id="opentable-donut-mask">
            <rect width="100%" height="100%" fill="white" />
            <circle cx="150" cy="120" r="20" fill="black" />
          </mask>
          <circle cx="150" cy="120" r="60" fill="currentColor" mask="url(#opentable-donut-mask)" />
          <circle cx="54" cy="120" r="18" fill="currentColor" />
        </svg>

        {/* Utensils Vector (Left-Center side, opposite from OpenTable logo) */}
        <svg
          viewBox="0 0 200 200"
          className={`absolute text-white transition-all duration-[440ms] ease-[cubic-bezier(0.22,0.61,0.36,1)] ${
            compactBanner
              ? "top-1/2 -translate-y-1/2 left-[45%] w-[5.5rem] h-[5.5rem] opacity-20 rotate-[10deg]"
              : "top-1/2 -translate-y-1/2 left-[30%] w-[13rem] h-[13rem] opacity-[0.18] rotate-[15deg]"
          }`}
          fill="none"
        >
          <g stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
            {/* Spoon Bowl */}
            <ellipse cx="60" cy="50" rx="15" ry="22" fill="rgba(255,255,255,0.05)" />
            {/* Spoon Outer Body */}
            <path d="M38 50 C38 28 46 18 60 18 C74 18 82 28 82 50 C82 66 74 76 68 84 C66 87 66 90 66 94 L66 170 C66 176 63 180 60 180 C57 180 54 176 54 170 L54 94 C54 90 54 87 52 84 C46 76 38 66 38 50 Z" fill="rgba(255,255,255,0.05)" />
            
            {/* Spoon Handle Grips */}
            <line x1="53" y1="110" x2="67" y2="110" />
            <line x1="53" y1="125" x2="67" y2="125" />
            <line x1="53" y1="140" x2="67" y2="140" />
            <line x1="53" y1="155" x2="67" y2="155" />
            
            {/* Left Chopstick */}
            <path d="M110 20 L122 20 L118 178 L114 178 Z" fill="rgba(255,255,255,0.05)" />
            <line x1="111" y1="45" x2="121" y2="45" />
            <line x1="111" y1="55" x2="121" y2="55" />

            {/* Right Chopstick */}
            <path d="M136 20 L148 20 L144 178 L140 178 Z" fill="rgba(255,255,255,0.05)" />
            <line x1="137" y1="45" x2="147" y2="45" />
            <line x1="137" y1="55" x2="147" y2="55" />
          </g>
        </svg>
      </div>

      <div className="relative z-10 h-full w-full">
        {/* Top Header (Nav + Compact Title) */}
        <div
          className={`absolute top-0 left-0 right-0 flex items-center transition-all duration-[400ms] ease-[cubic-bezier(0.22,0.61,0.36,1)] ${
            compactBanner ? "p-4" : "p-5"
          }`}
        >
          <button
            onClick={onBack}
            aria-label="Back"
            className="w-10 h-10 rounded-full bg-white/15 hover:bg-white/25 backdrop-blur flex items-center justify-center cursor-pointer shrink-0 transition"
          >
            <ArrowLeft className="w-[1.1rem] h-[1.1rem] text-white" />
          </button>
          <p
            className={`ml-3 text-white text-[1.15rem] leading-none transition-all duration-300 ${
              compactBanner ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-1 pointer-events-none"
            }`}
            style={{ fontWeight: 700 }}
          >
            Menu
          </p>
        </div>

        {/* Expanded Title */}
        <div
          className={`absolute bottom-0 left-0 right-0 transition-all duration-[400ms] ease-[cubic-bezier(0.22,0.61,0.36,1)] origin-bottom-left ${
            compactBanner ? "p-4 opacity-0 scale-95 translate-y-3 pointer-events-none" : "p-5 opacity-100 scale-100 translate-y-0"
          }`}
        >
          <h2 className="text-white text-[2rem] leading-[1.05] tracking-tight" style={{ fontWeight: 800 }}>
            Menu
          </h2>
          <p className="mt-1.5 text-white/90 text-[0.95rem]">
            Pick your dishes and build your order.
          </p>
        </div>
      </div>
    </section>
  );
}
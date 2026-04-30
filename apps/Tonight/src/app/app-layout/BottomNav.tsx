import React from "react";
import { TABS, TabButton, type TabId } from "./navigation";

export function BottomNav({
  bottomNavRef,
  qrActionRef,
  activeTab,
  unreadCount,
  dailyClaimed,
  onTabSelect,
  onQrPay,
}: {
  bottomNavRef: React.RefObject<HTMLElement | null>;
  qrActionRef: React.RefObject<HTMLButtonElement | null>;
  activeTab: TabId;
  unreadCount: number;
  dailyClaimed: boolean;
  onTabSelect: (id: TabId) => void;
  onQrPay: () => void;
}) {
  return (
    <nav ref={bottomNavRef} data-bottom-nav="true" className="z-50 shrink-0 border-t border-border bg-card/95 backdrop-blur-md lg:hidden">
      <div className="flex items-stretch" style={{ paddingBottom: "var(--safe-area-inset-bottom)" }}>
        {TABS.map((tab, idx) => (
          <React.Fragment key={tab.id}>
            <TabButton tab={tab} isActive={activeTab === tab.id} onSelect={() => onTabSelect(tab.id)} badgeCount={tab.id === "profile" ? unreadCount : undefined} showDot={tab.id === "profile" && !dailyClaimed} />
            {idx === 1 && (
              <div className="relative flex items-center justify-center" style={{ width: 0 }}>
                <button ref={qrActionRef} onClick={onQrPay} className="absolute -top-5 z-10 flex h-[3.75rem] w-[3.75rem] items-center justify-center rounded-full border-4 border-card shadow-lg transition-transform active:scale-90" style={{ background: "var(--primary)", color: "var(--primary-foreground)" }} aria-label="QR Pay">
                  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="3" width="7" height="7" rx="1" />
                    <rect x="14" y="3" width="7" height="7" rx="1" />
                    <rect x="3" y="14" width="7" height="7" rx="1" />
                    <rect x="14" y="14" width="3" height="3" />
                    <path d="M21 14h-3v3" />
                    <path d="M18 21v-3h3" />
                  </svg>
                </button>
              </div>
            )}
          </React.Fragment>
        ))}
      </div>
    </nav>
  );
}

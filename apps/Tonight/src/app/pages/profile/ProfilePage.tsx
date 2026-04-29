/* Main Profile Page — routes to sub-pages */
import { useState, useSyncExternalStore } from "react";
import { useLocation, useNavigate, useOutletContext } from "react-router";
import { Card } from "../../components/ds/Card";
import { Text, Heading } from "../../components/ds/Text";
import { Button } from "../../components/ds/Button";
import { Avatar } from "../../components/ds/Avatar";
import { ListGroup } from "../../components/ds/ListGroup";
import { DSBadge } from "../../components/ds/Badge";
import { Stagger, StaggerItem } from "../../components/ds/Animate";
import {
  ChevronRight, ArrowUpRight, Gift, Clock,
  Users,
  Settings, Smartphone, Crown, LifeBuoy, MessageCircle,
  Pencil, Check, X, Sparkles, MapPin, Bell,
} from "lucide-react";
import { subscribePlan, getPlanSnapshot, getPlan } from "../../stores/subscriptionStore";
import { subscribeNotifications, getNotificationSnapshot, getUnreadCount } from "../../stores/notificationStore";
import type { AppOutletContext } from "../../AppLayout";
import { TopUpPage, SendGiftPage, HistoryPage } from "./ProfileSubPages";
import { WalletCardStack } from "./WalletCardStack";
import { DailyBonusModal, dailyBonusStore, markDailyBonusClaimed, type DailyBonusReward } from "../discover/DailyBonusModal";
import { ReferPage, FriendsPage, TierBenefitsPage } from "./SavedAndSocialPages";
import { SettingsPage } from "./SettingsPage";
import { SubscriptionPage } from "./SubscriptionPage";
import { HelpCenterPage } from "./HelpCenterPage";
import { ContactSupportPage } from "./ContactSupportPage";
import { LocationPickerModal } from "../shared/LocationPickerModal";
import { NotificationsView } from "../discover/NotificationsView";

const PRESET_AVATARS: { id: string; src: string; label: string }[] = [
  { id: "a1", src: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=240&h=240&fit=crop&crop=faces", label: "Classic" },
  { id: "a2", src: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=240&h=240&fit=crop&crop=faces", label: "Sunny" },
  { id: "a3", src: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=240&h=240&fit=crop&crop=faces", label: "Warm" },
  { id: "a4", src: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=240&h=240&fit=crop&crop=faces", label: "Sharp" },
  { id: "a5", src: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=240&h=240&fit=crop&crop=faces", label: "Soft" },
  { id: "a6", src: "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=240&h=240&fit=crop&crop=faces", label: "Bold" },
  { id: "a7", src: "https://images.unsplash.com/photo-1502685104226-ee32379fefbe?w=240&h=240&fit=crop&crop=faces", label: "Calm" },
  { id: "a8", src: "https://images.unsplash.com/photo-1463453091185-61582044d556?w=240&h=240&fit=crop&crop=faces", label: "Bright" },
];

const PAGE_MAP: Record<string, string> = {
  topup: "topUp",
  "send-gift": "sendGift",
  history: "history",
  refer: "refer",
  friends: "friends",
  settings: "settings",
  "tier-benefits": "tierBenefits",
  subscription: "subscription",
  help: "help",
  "contact-support": "contactSupport",
  notifications: "notifications",
};
const REVERSE_PAGE_MAP: Record<string, string> = Object.fromEntries(
  Object.entries(PAGE_MAP).map(([url, state]) => [state, url])
);

export function ProfilePage() {
  const location = useLocation();
  const navigate = useNavigate();
  const pathSegs = location.pathname.replace(/^\/profile\/?/, "").split("/").filter(Boolean);
  const sub = pathSegs[0];
  const sub2 = pathSegs[1] ?? null;
  const page = sub ? PAGE_MAP[sub] ?? null : null;
  const setPage = (p: string | null) => {
    if (!p) navigate("/profile");
    else {
      const url = REVERSE_PAGE_MAP[p];
      if (url) navigate(`/profile/${url}`);
    }
  };
  const goBack = () => navigate("/profile");
  const outletCtx = useOutletContext<AppOutletContext | undefined>();
  useSyncExternalStore(subscribePlan, getPlanSnapshot);
  useSyncExternalStore(subscribeNotifications, getNotificationSnapshot);
  const currentPlan = getPlan();
  const unreadCount = getUnreadCount();
  const userLocation = outletCtx?.userLocation ?? { name: "Gangnam Station", address: "Gangnam-gu, Seoul", lat: 37.498, lng: 127.0276 };
  const [showBalance, setShowBalance] = useState(false);
  const [selectedAvatar, setSelectedAvatar] = useState<string | null>(null);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [locationPickerOpen, setLocationPickerOpen] = useState(false);
  const [pendingAvatar, setPendingAvatar] = useState<string | null>(null);
  const dailyClaimed = useSyncExternalStore(dailyBonusStore.subscribe, dailyBonusStore.getSnapshot);
  const [bonusOpen, setBonusOpen] = useState(false);
  const [tierBenefitsOpen, setTierBenefitsOpen] = useState(false);
  const handleClaimBonus = (reward: DailyBonusReward) => { markDailyBonusClaimed(); console.info("Daily bonus claimed:", reward); };
  const openNotifications = () => {
    if (outletCtx?.requireAuth && !outletCtx.requireAuth("/profile/notifications", "Sign in to view your notifications.")) return;
    navigate("/profile/notifications");
  };

  if (page === "topUp") return <TopUpPage onBack={goBack} />;
  if (page === "sendGift") return <SendGiftPage onBack={goBack} />;
  if (page === "history") return <HistoryPage onBack={goBack} />;
  if (page === "refer") return <ReferPage onBack={goBack} />;
  if (page === "friends") return <FriendsPage onBack={goBack} />;
  if (page === "settings") return <SettingsPage onBack={goBack} />;
  if (page === "tierBenefits") return <TierBenefitsPage onBack={goBack} />;
  if (page === "subscription") return <SubscriptionPage onBack={goBack} />;
  if (page === "notifications") return <NotificationsView onBack={goBack} />;
  if (page === "help") return (
    <HelpCenterPage
      onBack={goBack}
      topicId={sub2}
      onNavigateTopic={(id) => navigate(id ? `/profile/help/${id}` : "/profile/help")}
      onContactSupport={() => navigate("/profile/contact-support")}
    />
  );
  if (page === "contactSupport") return <ContactSupportPage onBack={goBack} />;

  return (
    <div className="relative">
      {/* Tinted background + logo texture, extends to main edges */}
      <div
        aria-hidden
        className="absolute pointer-events-none -z-10"
        style={{
          insetInline: "calc(50% - 50vw)",
          top: "-1.5rem",
          bottom: "-6rem",
          background: "color-mix(in srgb, var(--primary) 18%, var(--background))",
          overflow: "hidden",
        }}
      >
        <svg
          viewBox="0 0 600 600"
          className="absolute"
          style={{ right: "-6rem", top: "8rem", width: "32rem", height: "32rem", opacity: 0.55, color: "rgba(255,255,255,0.6)" }}
          fill="none"
        >
          <path d="M300 60a240 240 0 1 0 0 480 240 240 0 0 0 0-480zm0 170a70 70 0 1 1 0 140 70 70 0 0 1 0-140z" fill="currentColor" fillRule="evenodd" />
          <circle cx="40" cy="300" r="40" fill="currentColor" />
        </svg>
        <svg
          viewBox="0 0 200 200"
          className="absolute"
          style={{ left: "-3rem", top: "55%", width: "16rem", height: "16rem", opacity: 0.35, color: "rgba(255,255,255,0.7)" }}
          fill="none"
        >
          <circle cx="100" cy="100" r="90" stroke="currentColor" strokeWidth="2" strokeDasharray="6 8" />
          <circle cx="100" cy="100" r="60" stroke="currentColor" strokeWidth="2" />
          <circle cx="100" cy="100" r="20" fill="currentColor" />
        </svg>
        <svg
          viewBox="0 0 200 200"
          className="absolute"
          style={{ right: "20%", bottom: "10%", width: "10rem", height: "10rem", opacity: 0.4, color: "rgba(255,255,255,0.65)" }}
          fill="none"
        >
          <path d="M100 20 L120 80 L180 100 L120 120 L100 180 L80 120 L20 100 L80 80 Z" fill="currentColor" />
        </svg>
        <svg
          viewBox="0 0 200 200"
          className="absolute"
          style={{ left: "10%", top: "10%", width: "8rem", height: "8rem", opacity: 0.3, color: "rgba(255,255,255,0.6)" }}
          fill="none"
        >
          <rect x="30" y="30" width="140" height="140" rx="40" stroke="currentColor" strokeWidth="2" />
          <rect x="60" y="60" width="80" height="80" rx="22" stroke="currentColor" strokeWidth="2" />
        </svg>
      </div>
    <Stagger stagger={0.06} className="relative space-y-5 pb-4">
      <div className="-mx-4 sm:-mx-6 lg:-mx-8 -mt-6 sticky top-0 z-30">
        <div
          className="relative bg-background text-foreground px-5 sm:px-6 lg:px-8 pt-0 pb-5 border-b border-border"
          style={{ paddingTop: "calc(var(--safe-area-inset-top) + 2.5rem)" }} // pt-10 (2.5rem) + safe-area
        >
          <div className="relative z-10 flex items-center gap-4 max-w-3xl mx-auto">
            <button
              type="button"
              onClick={() => { setPendingAvatar(selectedAvatar); setPickerOpen(true); }}
              className="relative rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-primary cursor-pointer shrink-0"
              aria-label="Change profile photo"
            >
              <span className="block rounded-full p-[3px]" style={{ background: "var(--primary)" }}>
                <span className="block rounded-full p-[2px] bg-background">
                  <Avatar name="Alex Chen" size="xl" src={selectedAvatar ?? undefined} />
                </span>
              </span>
              <span
                className="absolute -bottom-0.5 -right-0.5 w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-sm"
                style={{ border: "2px solid var(--background)" }}
              >
                <Pencil className="w-3 h-3" />
              </span>
            </button>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <p className="text-[1.125rem]" style={{ fontWeight: 700 }}>Alex Chen</p>
                {currentPlan.type === "pro" ? (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-primary text-primary-foreground text-[0.625rem]" style={{ fontWeight: 700, letterSpacing: "0.06em" }}>
                    <Crown className="w-3 h-3" /> PREMIUM
                  </span>
                ) : (
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-secondary text-muted-foreground text-[0.625rem] border border-border" style={{ fontWeight: 700, letterSpacing: "0.06em" }}>
                    FREE
                  </span>
                )}
              </div>
              <p className="text-[0.8125rem] text-muted-foreground truncate">@alexchen</p>
              <button
                type="button"
                onClick={() => setTierBenefitsOpen(true)}
                className="mt-2 group flex items-center gap-2 w-full max-w-xs cursor-pointer"
                aria-label="View tier benefits"
              >
                <span
                  className="inline-flex items-center justify-center w-5 h-5 rounded-full text-[0.5625rem] text-primary-foreground shrink-0"
                  style={{ background: "linear-gradient(135deg, color-mix(in srgb, var(--primary) 90%, white), var(--primary))", fontWeight: 800, letterSpacing: "0.02em" }}
                >
                  G
                </span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-baseline justify-between gap-2">
                    <span className="text-[0.6875rem] text-foreground" style={{ fontWeight: 700, letterSpacing: "0.04em" }}>GOLD · LEVEL 2</span>
                    <span className="text-[0.625rem] text-muted-foreground">660 to Platinum</span>
                  </div>
                  <div className="mt-1 h-1.5 rounded-full bg-secondary overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all"
                      style={{ width: "67%", background: "linear-gradient(90deg, color-mix(in srgb, var(--primary) 60%, white), var(--primary))" }}
                    />
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition shrink-0" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <StaggerItem preset="fadeInUp">
        <div className="pt-6">
          <WalletCardStack showBalance={showBalance} onToggleBalance={() => setShowBalance(!showBalance)} />
        </div>
      </StaggerItem>

      <StaggerItem preset="fadeInUp">
        <div className="pt-2">
          <div className="rounded-2xl border border-border bg-card overflow-hidden" style={{ boxShadow: "0 12px 28px -16px color-mix(in srgb, var(--foreground) 28%, transparent), 0 4px 10px -6px color-mix(in srgb, var(--foreground) 15%, transparent)" }}>
              <div className="grid grid-cols-3 divide-x divide-border">
                {[
                  { label: "Top Up", icon: ArrowUpRight, page: "topUp" },
                  { label: "Send Gift", icon: Gift, page: "sendGift" },
                  { label: "Activity", icon: Clock, page: "history" },
                ].map((a) => (
                  <button
                    key={a.label}
                    onClick={() => setPage(a.page)}
                    className="relative flex flex-col items-center gap-1.5 py-3.5 cursor-pointer transition-colors active:bg-foreground/[0.08]"
                  >
                    <a.icon className="w-7 h-7 text-foreground" strokeWidth={1.5} />
                    <span className="text-[0.75rem] text-foreground" style={{ fontWeight: 500 }}>{a.label}</span>
                  </button>
                ))}
              </div>
            </div>
        </div>
      </StaggerItem>
      <StaggerItem preset="fadeInUp">
        <div className="space-y-2 rounded-2xl bg-card overflow-hidden" style={{ boxShadow: "0 12px 28px -16px color-mix(in srgb, var(--foreground) 28%, transparent), 0 4px 10px -6px color-mix(in srgb, var(--foreground) 15%, transparent)" }}>
          <ListGroup
            items={[
              {
                id: "location",
                label: "Location",
                description: userLocation.address,
                icon: <MapPin className="w-4 h-4" />,
                onClick: () => setLocationPickerOpen(true),
                rightContent: <span className="block max-w-[8.5rem] truncate text-[0.75rem] text-muted-foreground">{userLocation.name}</span>,
              },
              {
                id: "notifications",
                label: "Notifications",
                description: unreadCount > 0 ? `${unreadCount} unread updates` : "No unread notifications",
                icon: <Bell className="w-4 h-4" />,
                onClick: openNotifications,
                rightContent: unreadCount > 0 ? <DSBadge color="primary" size="sm">{unreadCount}</DSBadge> : undefined,
              },
            ]}
            showChevron
            hoverable
          />
        </div>
      </StaggerItem>
      {!dailyClaimed && (
        <StaggerItem preset="fadeInUp">
          <button
            onClick={() => setBonusOpen(true)}
            className="relative w-full text-left rounded-2xl overflow-hidden p-4 transition border border-transparent hover:scale-[1.01] cursor-pointer"
            style={{ background: "linear-gradient(120deg, color-mix(in srgb, var(--primary) 92%, white) 0%, color-mix(in srgb, var(--primary) 70%, #000) 100%)" }}
          >
            <div className="absolute -top-6 -right-6 w-24 h-24 rounded-full bg-white/15" />
            <div className="absolute -bottom-8 -left-4 w-20 h-20 rounded-full bg-white/10" />
            <div className="relative z-10 flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 bg-white/20 text-white">
                <Gift className="w-6 h-6" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <Text className="!text-white" style={{ fontWeight: 700 }}>Today's daily reward</Text>
                  <span className="inline-flex items-center gap-1 bg-white text-primary text-[0.625rem] px-2 py-0.5 rounded-full" style={{ fontWeight: 700 }}>
                    <Sparkles className="w-3 h-3" /> NEW
                  </span>
                </div>
                <Text className="text-[0.8125rem] !text-white/85">Tap to pick a gift box and reveal your reward</Text>
              </div>
              <ChevronRight className="w-5 h-5 text-white shrink-0" />
            </div>
          </button>
        </StaggerItem>
      )}
      <StaggerItem preset="fadeInUp">
        <Card variant="elevated" padding="md" radius="lg" hoverable clickable onClick={() => setPage("refer")} style={{ boxShadow: "0 12px 28px -16px color-mix(in srgb, var(--foreground) 28%, transparent), 0 4px 10px -6px color-mix(in srgb, var(--foreground) 15%, transparent)" }}>
          <div className="flex items-center gap-4">
            <div className="w-11 h-11 rounded-full bg-success/10 flex items-center justify-center shrink-0"><Gift className="w-5 h-5 text-success" /></div>
            <div className="flex-1 min-w-0"><Text style={{ fontWeight: 600 }}>Refer a Friend</Text><Text className="text-muted-foreground text-[0.875rem]">You both get $10 in rewards</Text></div>
            <ChevronRight className="w-5 h-5 text-muted-foreground shrink-0" />
          </div>
        </Card>
      </StaggerItem>
      <StaggerItem preset="fadeInUp">
        <div className="space-y-2 rounded-2xl bg-card overflow-hidden" style={{ boxShadow: "0 12px 28px -16px color-mix(in srgb, var(--foreground) 28%, transparent), 0 4px 10px -6px color-mix(in srgb, var(--foreground) 15%, transparent)" }}>
          <ListGroup
            items={[
              { id: "subscription", label: currentPlan.type === "pro" ? "Manage Subscription" : "Upgrade to Pro", icon: <Crown className="w-4 h-4" />, onClick: () => setPage("subscription"), rightContent: currentPlan.type === "pro" ? <DSBadge color="primary" size="sm">PRO</DSBadge> : <DSBadge color="default" variant="outline" size="sm">FREE</DSBadge> },
              { id: "friends", label: "Friends & Contacts", icon: <Users className="w-4 h-4" />, onClick: () => setPage("friends") },
              { id: "settings", label: "Settings", icon: <Settings className="w-4 h-4" />, onClick: () => setPage("settings") },
              { id: "help", label: "Help & Guide", icon: <LifeBuoy className="w-4 h-4" />, onClick: () => setPage("help"), rightContent: <DSBadge variant="soft" color="primary" size="sm">Step-by-step</DSBadge> },
              { id: "contact-support", label: "Contact Support", icon: <MessageCircle className="w-4 h-4" />, onClick: () => navigate("/profile/contact-support"), rightContent: <DSBadge variant="soft" color="success" size="sm">Chat</DSBadge> },
            ]}
            showChevron hoverable
          />
        </div>
      </StaggerItem>
      <StaggerItem preset="fadeInUp">
        <div className="flex items-center justify-between px-4 py-3 rounded-xl bg-secondary/50">
          <div className="flex items-center gap-3">
            <Smartphone className="w-4 h-4 text-muted-foreground" />
            <div><Text className="text-[0.8125rem]" style={{ fontWeight: 500 }}>App Version 2.4.1</Text><Text className="text-muted-foreground text-[0.6875rem]">Last released: April 10, 2026</Text></div>
          </div>
        </div>
      </StaggerItem>
      {pickerOpen && (
        <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center bg-black/50 backdrop-blur-sm" onClick={() => setPickerOpen(false)}>
          <div className="w-full md:max-w-md bg-background rounded-t-3xl md:rounded-3xl border border-border shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between px-5 pt-5 pb-3">
              <div>
                <Text style={{ fontWeight: 600 }}>Choose Profile Photo</Text>
                <Text className="text-muted-foreground text-[0.75rem]">Pick from our curated collection</Text>
              </div>
              <button onClick={() => setPickerOpen(false)} className="w-8 h-8 rounded-full bg-secondary hover:bg-secondary/70 flex items-center justify-center" aria-label="Close">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="px-5 pb-3">
              <div className="grid grid-cols-4 gap-3">
                {PRESET_AVATARS.map((a) => {
                  const isPicked = pendingAvatar === a.src;
                  return (
                    <button
                      key={a.id}
                      onClick={() => setPendingAvatar(a.src)}
                      className={`relative aspect-square rounded-full overflow-hidden transition ring-offset-2 ring-offset-background ${isPicked ? "ring-2 ring-primary scale-[1.04]" : "ring-1 ring-border hover:ring-primary/50"}`}
                      aria-label={a.label}
                    >
                      <img src={a.src} alt={a.label} className="w-full h-full object-cover" />
                      {isPicked && (
                        <span className="absolute inset-0 bg-primary/20 flex items-center justify-center">
                          <span className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center"><Check className="w-3.5 h-3.5" /></span>
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
            <div className="flex items-center gap-2 px-5 py-4 border-t border-border">
              <Button variant="ghost" size="sm" className="flex-1" onClick={() => { setPendingAvatar(null); }}>Reset</Button>
              <Button variant="primary" size="sm" className="flex-[2]" onClick={() => { setSelectedAvatar(pendingAvatar); setPickerOpen(false); }}>Save Photo</Button>
            </div>
          </div>
        </div>
      )}
      <DailyBonusModal open={bonusOpen} onClose={() => setBonusOpen(false)} onClaim={handleClaimBonus} />
      <LocationPickerModal
        open={locationPickerOpen}
        onClose={() => setLocationPickerOpen(false)}
        onSelect={(loc) => {
          outletCtx?.setUserLocation(loc);
          setLocationPickerOpen(false);
        }}
        currentLocation={userLocation}
      />
      {tierBenefitsOpen && (
        <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center bg-black/50 backdrop-blur-sm" onClick={() => setTierBenefitsOpen(false)}>
          <div
            className="w-full md:max-w-md bg-background rounded-t-3xl md:rounded-3xl border border-border shadow-2xl flex flex-col"
            style={{ maxHeight: "min(85dvh, 720px)" }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-5 pt-5 pb-3 shrink-0 border-b border-border">
              <div className="flex items-center gap-2">
                <Crown className="w-5 h-5 text-primary" />
                <Text style={{ fontWeight: 700 }}>Tier Benefits</Text>
              </div>
              <button onClick={() => setTierBenefitsOpen(false)} className="w-8 h-8 rounded-full bg-secondary hover:bg-secondary/70 flex items-center justify-center cursor-pointer" aria-label="Close">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="px-5 py-4 overflow-y-auto flex-1" style={{ paddingBottom: "max(1.25rem, env(safe-area-inset-bottom))" }}>
              <div className="rounded-2xl p-4 mb-4 bg-primary/10 border border-primary/20">
                <Text className="text-[0.6875rem] uppercase text-primary" style={{ fontWeight: 700, letterSpacing: "0.08em" }}>Current Tier</Text>
                <Text className="text-[1.25rem] mt-1" style={{ fontWeight: 700 }}>GOLD · Level 2</Text>
                <Text className="text-muted-foreground text-[0.8125rem]">2,340 pts · 660 to Platinum</Text>
              </div>
              <div className="space-y-3">
                {[
                  { tier: "Silver", min: 0, perks: ["Standard reservations", "Basic support", "5% birthday bonus"] },
                  { tier: "Gold", min: 1000, perks: ["Priority booking window", "10% wallet bonus", "Free cancellation up to 2h", "Dedicated chat support"] },
                  { tier: "Platinum", min: 5000, perks: ["Concierge reservations", "20% wallet bonus", "Complimentary welcome drink", "Exclusive chef tables"] },
                  { tier: "Diamond", min: 10000, perks: ["Private dining priority", "30% wallet bonus", "VIP event invites", "Personal sommelier picks"] },
                ].map((t) => {
                  const isCurrent = t.tier === "Gold";
                  return (
                    <div key={t.tier} className={`rounded-2xl p-4 border ${isCurrent ? "border-primary bg-primary/5" : "border-border bg-card"}`}>
                      <div className="flex items-center justify-between mb-2">
                        <Text style={{ fontWeight: 700 }}>{t.tier}</Text>
                        <Text className="text-muted-foreground text-[0.75rem]">{t.min.toLocaleString()}+ pts</Text>
                      </div>
                      <ul className="space-y-1.5">
                        {t.perks.map((p) => (
                          <li key={p} className="flex items-start gap-2 text-[0.8125rem]">
                            <Check className="w-3.5 h-3.5 text-primary mt-0.5 shrink-0" />
                            <span className="text-foreground">{p}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}
    </Stagger>
    </div>
  );
}

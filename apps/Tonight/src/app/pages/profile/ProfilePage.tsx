/* Main Profile Page — routes to sub-pages */
import { useState, useSyncExternalStore } from "react";
import { useLocation, useNavigate, useOutletContext } from "react-router";
import { Text } from "../../components/ds/Text";
import { Button } from "../../components/ds/Button";
import { Avatar } from "../../components/ds/Avatar";
import { ListGroup } from "../../components/ds/ListGroup";
import { Stagger, StaggerItem } from "../../components/ds/Animate";
import {
  ChevronRight, ArrowUpRight, Gift, Clock,
  Users,
  Settings, Crown, LifeBuoy, MessageCircle,
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

  // Common shadow class for the Airbnb look
  const cardShadow = "shadow-[0_6px_16px_rgba(0,0,0,0.08)] border border-black/[0.04]";

  return (
    <div className="min-h-screen bg-white text-foreground pb-24 font-sans">
      <Stagger stagger={0.04} className="space-y-6">
        
        {/* Header */}
        <div className="px-6 pt-12 pb-2 flex items-center justify-between sticky top-0 z-30 bg-white/90 backdrop-blur-md">
          <h1 className="text-[2rem] font-bold tracking-tight">Profile</h1>
          <button 
            onClick={openNotifications} 
            className="relative w-11 h-11 flex items-center justify-center bg-white rounded-full shadow-[0_2px_8px_rgba(0,0,0,0.08)] border border-black/5 hover:bg-gray-50 transition cursor-pointer"
            aria-label="Notifications"
          >
            <Bell className="w-[1.125rem] h-[1.125rem] text-black" strokeWidth={2} />
            {unreadCount > 0 && (
              <span className="absolute top-2.5 right-2.5 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white" />
            )}
          </button>
        </div>

        {/* Main Identity Card */}
        <StaggerItem preset="fadeInUp">
          <div className={`mx-6 bg-white rounded-[2rem] p-6 flex flex-col items-center text-center relative overflow-hidden ${cardShadow}`}>
            
            {/* Avatar block */}
            <div className="relative mb-4">
              <button
                type="button"
                onClick={() => { setPendingAvatar(selectedAvatar); setPickerOpen(true); }}
                className="relative block rounded-full shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-primary cursor-pointer shrink-0 transition hover:scale-[1.02]"
              >
                {selectedAvatar ? (
                  <Avatar name="Alex Chen" size="2xl" src={selectedAvatar} className="w-24 h-24 text-2xl border border-border/20" />
                ) : (
                  <div className="w-24 h-24 rounded-full bg-[#222222] text-white flex items-center justify-center text-[2.5rem] font-semibold tracking-tight shadow-inner">
                    A
                  </div>
                )}
                
                {/* Pencil Overlay */}
                <div className="absolute bottom-0 right-0 w-8 h-8 bg-white text-black rounded-full shadow-md border border-black/5 flex items-center justify-center z-10">
                  <Pencil className="w-3.5 h-3.5" strokeWidth={2.5} />
                </div>
              </button>
            </div>

            <h2 className="text-[1.5rem] font-bold tracking-tight text-black">Alex Chen</h2>
            <div className="flex items-center gap-2 mt-1 mb-5">
              <p className="text-[0.875rem] text-gray-500 font-medium">Guest</p>
            </div>

            {/* Subtle Tier Progress */}
            <button
              onClick={() => setTierBenefitsOpen(true)}
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
        </StaggerItem>

        <StaggerItem preset="fadeInUp">
          <div className="mx-6">
            <WalletCardStack showBalance={showBalance} onToggleBalance={() => setShowBalance(!showBalance)} />
          </div>
        </StaggerItem>

        {/* Cute Action Cards Grid */}
        <StaggerItem preset="fadeInUp">
          <div className="mx-6 grid grid-cols-3 gap-3">
            {[
              { label: "Top Up", icon: ArrowUpRight, page: "topUp", color: "bg-blue-100 text-blue-600" },
              { label: "Gift", icon: Gift, page: "sendGift", color: "bg-emerald-100 text-emerald-600" },
              { label: "Activity", icon: Clock, page: "history", color: "bg-orange-100 text-orange-600" },
            ].map((a) => (
              <button
                key={a.label}
                onClick={() => setPage(a.page)}
                className={`bg-white rounded-[1.25rem] py-5 px-2 flex flex-col items-center justify-center gap-3 cursor-pointer transition active:scale-[0.96] hover:-translate-y-0.5 ${cardShadow}`}
              >
                <div className={`w-14 h-14 rounded-full flex items-center justify-center ${a.color} shadow-sm`}>
                  <a.icon className="w-6 h-6" strokeWidth={2.5} />
                </div>
                <span className="text-[0.8125rem] font-bold text-black tracking-tight">{a.label}</span>
              </button>
            ))}
          </div>
        </StaggerItem>

        {/* Promotional / Call to Action Cards */}
        <div className="space-y-4">
          
          {/* Recovered Daily Reward Card - Airbnb host style */}
          {!dailyClaimed && (
            <StaggerItem preset="fadeInUp">
              <button
                onClick={() => setBonusOpen(true)}
                className={`mx-6 w-[calc(100%-3rem)] bg-white rounded-[1.5rem] p-5 flex items-center gap-4 text-left active:scale-[0.98] transition cursor-pointer ${cardShadow}`}
              >
                <div className="w-[4.5rem] h-[4.5rem] rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shrink-0 shadow-inner relative overflow-hidden">
                  <Sparkles className="w-8 h-8 text-white absolute top-2 right-2 opacity-30" />
                  <Gift className="w-8 h-8 text-white relative z-10" strokeWidth={1.5} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="bg-purple-100 text-purple-700 text-[0.625rem] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded">Daily</span>
                  </div>
                  <h3 className="font-bold text-[1.125rem] text-black tracking-tight leading-tight mb-1">Claim your reward</h3>
                  <p className="text-[0.8125rem] text-gray-500 leading-snug">Open your mystery box for points.</p>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400 shrink-0" />
              </button>
            </StaggerItem>
          )}

          <StaggerItem preset="fadeInUp">
            <button
              onClick={() => setPage("refer")}
              className={`mx-6 w-[calc(100%-3rem)] bg-white rounded-[1.5rem] p-5 flex items-center gap-4 text-left active:scale-[0.98] transition cursor-pointer ${cardShadow}`}
            >
              <div className="w-[4.5rem] h-[4.5rem] rounded-2xl bg-rose-50 flex items-center justify-center shrink-0">
                <Users className="w-8 h-8 text-rose-500" strokeWidth={1.5} />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-[1.125rem] text-black tracking-tight mb-1">Refer a friend</h3>
                <p className="text-[0.8125rem] text-gray-500 leading-snug">You both get $10 in rewards.</p>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-400 shrink-0" />
            </button>
          </StaggerItem>
        </div>

        {/* Unified Settings List */}
        <StaggerItem preset="fadeInUp">
          <div className="mx-6 pt-2">
            <h3 className="text-[1.375rem] font-bold text-black mb-4">Account settings</h3>
            <div className="bg-white rounded-none">
              <ListGroup
                items={[
                  {
                    id: "location",
                    label: "Location",
                    description: userLocation.address,
                    icon: <MapPin className="w-6 h-6 text-black/70" strokeWidth={1.5} />,
                    onClick: () => setLocationPickerOpen(true),
                    rightContent: <span className="block max-w-[8.5rem] truncate text-[0.875rem] text-gray-500">{userLocation.name}</span>,
                  },
                  { 
                    id: "subscription", 
                    label: "Subscription", 
                    icon: <Crown className="w-6 h-6 text-black/70" strokeWidth={1.5} />, 
                    onClick: () => setPage("subscription"), 
                    rightContent: currentPlan.type === "pro" ? <span className="font-semibold text-black text-[0.875rem]">PRO</span> : <span className="text-[0.875rem] text-gray-500">Free</span> 
                  },
                  { 
                    id: "friends", 
                    label: "Friends & Contacts", 
                    icon: <Users className="w-6 h-6 text-black/70" strokeWidth={1.5} />, 
                    onClick: () => setPage("friends") 
                  },
                  { 
                    id: "settings", 
                    label: "Settings", 
                    icon: <Settings className="w-6 h-6 text-black/70" strokeWidth={1.5} />, 
                    onClick: () => setPage("settings") 
                  },
                  { 
                    id: "help", 
                    label: "Get help", 
                    icon: <LifeBuoy className="w-6 h-6 text-black/70" strokeWidth={1.5} />, 
                    onClick: () => setPage("help") 
                  },
                  { 
                    id: "contact-support", 
                    label: "Contact Support", 
                    icon: <MessageCircle className="w-6 h-6 text-black/70" strokeWidth={1.5} />, 
                    onClick: () => navigate("/profile/contact-support") 
                  },
                ]}
                showChevron 
                hoverable
                className="[&>button]:px-0 [&>button]:py-5 [&>button]:border-b [&>button]:border-gray-100 last:[&>button]:border-0"
              />
            </div>
          </div>
        </StaggerItem>

        <StaggerItem preset="fadeInUp">
          <div className="flex flex-col items-center justify-center pt-8 pb-8">
            <Text className="text-[0.8125rem] text-gray-400 font-medium">App Version 2.4.1</Text>
            <Text className="text-gray-400/70 text-[0.6875rem] mt-0.5">Last released: April 10, 2026</Text>
          </div>
        </StaggerItem>

        {/* Modals remain mostly structurally identical, adjusted styles for white theme */}
        {pickerOpen && (
          <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center bg-black/40 backdrop-blur-sm" onClick={() => setPickerOpen(false)}>
            <div className="w-full md:max-w-md bg-white rounded-t-[2rem] md:rounded-[2rem] shadow-2xl" onClick={(e) => e.stopPropagation()}>
              <div className="flex items-center justify-between px-6 pt-6 pb-4">
                <div>
                  <Text className="text-xl font-bold tracking-tight text-black">Choose Photo</Text>
                  <Text className="text-gray-500 text-[0.875rem] mt-1">Pick from our curated collection</Text>
                </div>
                <button onClick={() => setPickerOpen(false)} className="w-9 h-9 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center cursor-pointer text-black" aria-label="Close">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="px-6 pb-6">
                <div className="grid grid-cols-4 gap-4">
                  {PRESET_AVATARS.map((a) => {
                    const isPicked = pendingAvatar === a.src;
                    return (
                      <button
                        key={a.id}
                        onClick={() => setPendingAvatar(a.src)}
                        className={`relative aspect-square rounded-full overflow-hidden transition ring-offset-2 ring-offset-white ${isPicked ? "ring-2 ring-black scale-[1.04]" : "ring-1 ring-gray-200 hover:ring-gray-300"}`}
                        aria-label={a.label}
                      >
                        <img src={a.src} alt={a.label} className="w-full h-full object-cover" />
                        {isPicked && (
                          <span className="absolute inset-0 bg-black/20 flex items-center justify-center backdrop-blur-[2px]">
                            <span className="w-7 h-7 rounded-full bg-black text-white flex items-center justify-center"><Check className="w-4 h-4" strokeWidth={3} /></span>
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
              <div className="flex items-center gap-3 px-6 py-5 border-t border-gray-100">
                <Button variant="ghost" size="lg" className="flex-1 rounded-[1rem] text-black hover:bg-gray-100" onClick={() => { setPendingAvatar(null); }}>Reset</Button>
                <Button variant="primary" size="lg" className="flex-[2] rounded-[1rem] !bg-[#E51D53] !text-white hover:!bg-[#D70466]" onClick={() => { setSelectedAvatar(pendingAvatar); setPickerOpen(false); }}>Save Photo</Button>
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
          <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center bg-black/40 backdrop-blur-sm" onClick={() => setTierBenefitsOpen(false)}>
            <div
              className="w-full md:max-w-md bg-white rounded-t-[2rem] md:rounded-[2rem] shadow-2xl flex flex-col"
              style={{ maxHeight: "min(85dvh, 720px)" }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between px-6 pt-6 pb-4 shrink-0 border-b border-gray-100">
                <div className="flex items-center gap-3">
                  <Crown className="w-6 h-6 text-amber-500" strokeWidth={2} />
                  <Text className="text-xl font-bold tracking-tight text-black">Tier Benefits</Text>
                </div>
                <button onClick={() => setTierBenefitsOpen(false)} className="w-9 h-9 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center cursor-pointer text-black" aria-label="Close">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="px-6 py-6 overflow-y-auto flex-1" style={{ paddingBottom: "max(1.5rem, env(safe-area-inset-bottom))" }}>
                <div className="rounded-[1.25rem] p-5 mb-6 bg-gradient-to-r from-amber-500 to-amber-400 text-white shadow-md">
                  <Text className="text-[0.6875rem] uppercase text-white/80 font-bold tracking-widest">Current Tier</Text>
                  <Text className="text-[1.5rem] font-bold tracking-tight mt-1">GOLD · Level 2</Text>
                  <Text className="text-white/90 text-[0.875rem] mt-1">2,340 pts · 660 to Platinum</Text>
                </div>
                <div className="space-y-4">
                  {[
                    { tier: "Silver", min: 0, perks: ["Standard reservations", "Basic support", "5% birthday bonus"] },
                    { tier: "Gold", min: 1000, perks: ["Priority booking window", "10% wallet bonus", "Free cancellation up to 2h", "Dedicated chat support"] },
                    { tier: "Platinum", min: 5000, perks: ["Concierge reservations", "20% wallet bonus", "Complimentary welcome drink", "Exclusive chef tables"] },
                    { tier: "Diamond", min: 10000, perks: ["Private dining priority", "30% wallet bonus", "VIP event invites", "Personal sommelier picks"] },
                  ].map((t) => {
                    const isCurrent = t.tier === "Gold";
                    return (
                      <div key={t.tier} className={`rounded-[1.25rem] p-5 border transition ${isCurrent ? "border-amber-500 bg-amber-50/50 shadow-sm" : "border-gray-200 bg-transparent"}`}>
                        <div className="flex items-center justify-between mb-3">
                          <Text className="text-[1.125rem] font-bold text-black">{t.tier}</Text>
                          <Text className="text-gray-500 text-[0.8125rem] font-medium">{t.min.toLocaleString()}+ pts</Text>
                        </div>
                        <ul className="space-y-2">
                          {t.perks.map((p) => (
                            <li key={p} className="flex items-start gap-3 text-[0.875rem] text-gray-600">
                              <Check className={`w-4 h-4 mt-0.5 shrink-0 ${isCurrent ? 'text-amber-500' : 'text-gray-400'}`} strokeWidth={2.5} />
                              <span className="leading-snug">{p}</span>
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
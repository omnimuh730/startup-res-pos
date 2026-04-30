/* Main Profile Page ? routes to sub-pages */
import { useState, useSyncExternalStore } from "react";
import { useLocation, useNavigate, useOutletContext } from "react-router";
import { Text } from "../../components/ds/Text";
import { ListGroup } from "../../components/ds/ListGroup";
import { Stagger, StaggerItem } from "../../components/ds/Animate";
import { ChevronRight, ArrowUpRight, Gift, Clock, Users, Settings, Crown, LifeBuoy, MessageCircle, MapPin, Bell } from "lucide-react";
import { subscribePlan, getPlanSnapshot, getPlan } from "../../stores/subscriptionStore";
import { subscribeNotifications, getNotificationSnapshot, getUnreadCount } from "../../stores/notificationStore";
import type { AppOutletContext } from "../../app-layout/types";
import { TopUpPage } from "./topup/TopUpPage";
import { SendGiftPage } from "./gift/SendGiftPage";
import { HistoryPage } from "./history/HistoryPage";
import { ProfileEditPage } from "./account/ProfileEditPage";
import { WalletCardStack } from "./wallet/WalletCardStack";
import { DailyBonusModal, dailyBonusStore, markDailyBonusClaimed, type DailyBonusReward } from "./dailyreward/DailyBonusModal";
import { ReferPage } from "./refer/ReferPage";
import { FriendsPage } from "./friends/FriendsPage";
import { SettingsPage } from "./settings/SettingsPage";
import { SubscriptionPage } from "./subscription/SubscriptionPage";
import { HelpCenterPage } from "./help-center/HelpCenterPage";
import { ContactSupportPage } from "./support/ContactSupportPage";
import { LocationPage } from "./location/LocationPage";
import { ProfileTopCard } from "./information/ProfileTopCard";
import { TierStatusModal } from "./information/TierStatusModal";
import { NotificationsView } from "./notification/NotificationsView";
import { AvatarPickerModal } from "./profile-page/AvatarPickerModal";
import { PAGE_MAP, PRESET_AVATARS, REVERSE_PAGE_MAP } from "./profile-page/profileNavigation";

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
  const [pendingAvatar, setPendingAvatar] = useState<string | null>(null);
  const [tierStatusOpen, setTierStatusOpen] = useState(false);
  const dailyClaimed = useSyncExternalStore(dailyBonusStore.subscribe, dailyBonusStore.getSnapshot);
  const [bonusOpen, setBonusOpen] = useState(false);
  const handleClaimBonus = (reward: DailyBonusReward) => {
    markDailyBonusClaimed();
    console.info("Daily bonus claimed:", reward);
  };
  const openNotifications = () => {
    if (outletCtx?.requireAuth && !outletCtx.requireAuth("/profile/notifications", "Sign in to view your notifications.")) return;
    navigate("/profile/notifications");
  };

  if (page === "topUp") return <TopUpPage onBack={goBack} />;
  if (page === "sendGift") return <SendGiftPage onBack={goBack} />;
  if (page === "history") return <HistoryPage onBack={goBack} />;
  if (page === "profileEdit") return <ProfileEditPage onBack={goBack} />;
  if (page === "location") return <LocationPage onBack={goBack} currentLocation={userLocation} onSelect={(loc) => outletCtx?.setUserLocation(loc)} />;
  if (page === "refer") return <ReferPage onBack={goBack} />;
  if (page === "friends") return <FriendsPage onBack={goBack} />;
  if (page === "settings") return <SettingsPage onBack={goBack} />;
  if (page === "subscription") return <SubscriptionPage onBack={goBack} />;
  if (page === "notifications") return <NotificationsView onBack={goBack} />;
  if (page === "help") {
    return (
      <HelpCenterPage
        onBack={goBack}
        topicId={sub2}
        onNavigateTopic={(id) => navigate(id ? `/profile/help/${id}` : "/profile/help")}
        onContactSupport={() => navigate("/profile/contact-support")}
      />
    );
  }
  if (page === "contactSupport") return <ContactSupportPage onBack={goBack} />;

  const cardShadow = "shadow-[0_4px_8px_rgba(0,0,0,0.18)] border border-black/[0.04]";

  return (
    <div className="min-h-full bg-white text-foreground font-sans">
      <Stagger stagger={0.04} className="space-y-6">
        <div className="sticky top-0 z-30 flex items-center justify-between bg-white/90 px-6 pt-6 pb-2 backdrop-blur-md">
          <h1 className="text-[2rem] font-bold">Profile</h1>
          <button onClick={openNotifications} className="relative flex h-11 w-11 cursor-pointer items-center justify-center rounded-full border border-black/5 bg-white shadow-[0_2px_8px_rgba(0,0,0,0.08)] transition hover:bg-gray-50" aria-label="Notifications">
            <Bell className="h-[1.125rem] w-[1.125rem] text-black" strokeWidth={2} />
            {unreadCount > 0 && <span className="absolute top-2.5 right-2.5 h-2.5 w-2.5 rounded-full border-2 border-white bg-red-500" />}
          </button>
        </div>

        <StaggerItem preset="fadeInUp">
          <ProfileTopCard
            selectedAvatar={selectedAvatar}
            onOpenAvatarPicker={() => {
              setPendingAvatar(selectedAvatar);
              setPickerOpen(true);
            }}
            onOpenTierDetails={() => setTierStatusOpen(true)}
            planType={currentPlan.type === "pro" ? "pro" : "free"}
            cardShadow={cardShadow}
          />
        </StaggerItem>

        <StaggerItem preset="fadeInUp">
          <div className="mx-4">
            <WalletCardStack showBalance={showBalance} onToggleBalance={() => setShowBalance(!showBalance)} />
          </div>
        </StaggerItem>

        <StaggerItem preset="fadeInUp">
          <div className="mx-4 grid grid-cols-3 gap-3">
            {[
              { label: "Top Up", icon: ArrowUpRight, page: "topUp", color: "bg-blue-100 text-blue-600" },
              { label: "Gift", icon: Gift, page: "sendGift", color: "bg-emerald-100 text-emerald-600" },
              { label: "Activity", icon: Clock, page: "history", color: "bg-orange-100 text-orange-600" },
            ].map((a) => (
              <button key={a.label} onClick={() => setPage(a.page)} className={`flex cursor-pointer flex-col items-center justify-center gap-3 rounded-[1.25rem] bg-white px-2 py-3 transition active:scale-[0.96] hover:-translate-y-0.5 ${cardShadow}`}>
                <div className={`flex h-12 w-12 items-center justify-center rounded-full ${a.color} shadow-sm`}>
                  <a.icon className="h-6 w-6" strokeWidth={2.5} />
                </div>
                <span className="text-[0.875rem] font-medium">{a.label}</span>
              </button>
            ))}
          </div>
        </StaggerItem>

        <div className="space-y-4">
          {!dailyClaimed && (
            <StaggerItem preset="fadeInUp">
              <button onClick={() => setBonusOpen(true)} className={`group mx-4 flex w-[calc(100%-2rem)] cursor-pointer items-center gap-4 rounded-[1.5rem] bg-white p-5 text-left transition active:scale-[0.98] ${cardShadow}`}>
                <div className="relative flex h-[4.5rem] w-[4.5rem] shrink-0 items-center justify-center overflow-hidden rounded-[1.25rem] bg-gradient-to-br from-[#FF385C] to-[#D70466] shadow-[0_4px_12px_rgba(229,29,83,0.3)]">
                  <div className="absolute top-0 right-0 h-8 w-8 rounded-bl-full bg-white/20" />
                  <div className="absolute bottom-0 left-0 h-6 w-6 rounded-tr-full bg-black/10" />
                  <Gift className="relative z-10 h-8 w-8 text-white drop-shadow-sm" strokeWidth={1.5} />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="mb-1 flex items-center gap-2">
                    <h3 className="text-[1.125rem] font-bold">Today's daily reward</h3>
                    <span className="rounded-md bg-[#E51D53] px-1.5 py-0.5 text-[0.625rem] font-bold tracking-wider text-white uppercase">Daily</span>
                  </div>
                  <p className="text-[0.8rem] leading-snug text-gray-500">Tap to pick a gift box and reveal your extra points.</p>
                </div>
                <ChevronRight className="h-5 w-5 shrink-0 text-gray-400 transition-colors group-hover:text-black" />
              </button>
            </StaggerItem>
          )}

          <StaggerItem preset="fadeInUp">
            <button onClick={() => setPage("refer")} className={`group mx-4 flex w-[calc(100%-2rem)] cursor-pointer items-center gap-4 rounded-[1.5rem] bg-white p-5 text-left transition active:scale-[0.98] ${cardShadow}`}>
              <div className="flex h-[4.5rem] w-[4.5rem] shrink-0 items-center justify-center rounded-2xl bg-rose-50">
                <Users className="h-8 w-8 text-rose-500" strokeWidth={1.5} />
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="mb-1 text-[1.125rem] font-bold">Refer a friend</h3>
                <p className="text-[0.8125rem] leading-snug text-gray-500">You both get $10 in rewards.</p>
              </div>
              <ChevronRight className="h-5 w-5 shrink-0 text-gray-400" />
            </button>
          </StaggerItem>
        </div>

        <StaggerItem preset="fadeInUp">
          <div className="mx-4 pt-2">
            <h3 className="mb-4 text-[1.375rem] font-bold text-black">Account settings</h3>
            <div className="rounded-none bg-white">
              <ListGroup
                items={[
                  { id: "location", label: "Location", description: userLocation.address, icon: <MapPin className="h-6 w-6 text-black/70" strokeWidth={1.5} />, onClick: () => setPage("location"), rightContent: <span className="block max-w-[8.5rem] truncate text-[0.875rem] text-gray-500">{userLocation.name}</span> },
                  { id: "subscription", label: "Subscription", icon: <Crown className="h-6 w-6 text-black/70" strokeWidth={1.5} />, onClick: () => setPage("subscription"), rightContent: currentPlan.type === "pro" ? <span className="text-[0.875rem] font-semibold text-black">PRO</span> : <span className="text-[0.875rem] text-gray-500">Free</span> },
                  { id: "friends", label: "Friends & Contacts", icon: <Users className="h-6 w-6 text-black/70" strokeWidth={1.5} />, onClick: () => setPage("friends") },
                  { id: "settings", label: "Settings", icon: <Settings className="h-6 w-6 text-black/70" strokeWidth={1.5} />, onClick: () => setPage("settings") },
                  { id: "help", label: "Get help", icon: <LifeBuoy className="h-6 w-6 text-black/70" strokeWidth={1.5} />, onClick: () => setPage("help") },
                  { id: "contact-support", label: "Contact Support", icon: <MessageCircle className="h-6 w-6 text-black/70" strokeWidth={1.5} />, onClick: () => navigate("/profile/contact-support") },
                ]}
                variant="default"
                showChevron
                hoverable
                className="[&>button]:px-0 [&>button]:py-5 [&>div>div]:py-[1.125rem]"
              />
            </div>
          </div>
        </StaggerItem>

        <StaggerItem preset="fadeInUp">
          <div className="flex flex-col items-center justify-center pb-4">
            <Text className="text-[0.8125rem] font-medium text-gray-400">App Version 2.4.1</Text>
            <Text className="mt-0.5 text-[0.6875rem] text-gray-400/70">Last released: April 10, 2026</Text>
          </div>
        </StaggerItem>

        <AvatarPickerModal
          open={pickerOpen}
          avatars={PRESET_AVATARS}
          pendingAvatar={pendingAvatar}
          setPendingAvatar={setPendingAvatar}
          onClose={() => setPickerOpen(false)}
          onSave={() => {
            setSelectedAvatar(pendingAvatar);
            setPickerOpen(false);
          }}
        />

        <DailyBonusModal open={bonusOpen} onClose={() => setBonusOpen(false)} onClaim={handleClaimBonus} />
        <TierStatusModal open={tierStatusOpen} onClose={() => setTierStatusOpen(false)} />
      </Stagger>
    </div>
  );
}

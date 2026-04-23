/* Main Profile Page — routes to sub-pages */
import { useState, useSyncExternalStore } from "react";
import { useLocation, useNavigate } from "react-router";
import { Card } from "../../components/ds/Card";
import { Text, Heading } from "../../components/ds/Text";
import { Button } from "../../components/ds/Button";
import { Avatar } from "../../components/ds/Avatar";
import { ListGroup } from "../../components/ds/ListGroup";
import { DSBadge } from "../../components/ds/Badge";
import { Stagger, StaggerItem } from "../../components/ds/Animate";
import {
  ChevronRight, ArrowUpRight, Gift, Clock,
  Sun, Users,
  Settings, Smartphone, Star, Crown, Wallet, Eye, EyeOff, LifeBuoy, MessageCircle,
} from "lucide-react";
import { subscribePlan, getPlanSnapshot, getPlan } from "../../stores/subscriptionStore";
import { TierMedalSvg, REWARD_TIERS, themePresets } from "./profileHelpers";
import { ProfileEditPage, TopUpPage, SendGiftPage, HistoryPage } from "./ProfileSubPages";
import { ReferPage, FriendsPage, TierBenefitsPage } from "./SavedAndSocialPages";
import { SettingsPage } from "./SettingsPage";
import { SubscriptionPage } from "./SubscriptionPage";
import { HelpCenterPage } from "./HelpCenterPage";
import { ContactSupportPage } from "./ContactSupportPage";

const PAGE_MAP: Record<string, string> = {
  edit: "editProfile",
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
  useSyncExternalStore(subscribePlan, getPlanSnapshot);
  const currentPlan = getPlan();
  const [showBalance, setShowBalance] = useState(true);
  const [selectedTheme, setSelectedTheme] = useState("Airbnb");

  const applyTheme = (themeName: string) => {
    const preset = themePresets[themeName];
    if (preset) { Object.entries(preset).forEach(([key, value]) => { document.documentElement.style.setProperty(key, value); }); setSelectedTheme(themeName); }
  };

  const currentPoints = 2340;
  const currentTierIdx = 1;
  const nextTier = REWARD_TIERS[currentTierIdx + 1];
  const progressToNext = ((currentPoints - REWARD_TIERS[currentTierIdx].min) / (nextTier.min - REWARD_TIERS[currentTierIdx].min)) * 100;

  if (page === "editProfile") return <ProfileEditPage onBack={goBack} />;
  if (page === "topUp") return <TopUpPage onBack={goBack} />;
  if (page === "sendGift") return <SendGiftPage onBack={goBack} />;
  if (page === "history") return <HistoryPage onBack={goBack} />;
  if (page === "refer") return <ReferPage onBack={goBack} />;
  if (page === "friends") return <FriendsPage onBack={goBack} />;
  if (page === "settings") return <SettingsPage onBack={goBack} />;
  if (page === "tierBenefits") return <TierBenefitsPage onBack={goBack} />;
  if (page === "subscription") return <SubscriptionPage onBack={goBack} />;
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
    <Stagger stagger={0.06} className="space-y-5 pb-4">
      <StaggerItem preset="fadeInUp"><div className="flex items-center justify-between"><Heading level={2}>Profile</Heading></div></StaggerItem>
      <StaggerItem preset="fadeInUp">
        <div className="space-y-5 md:grid md:grid-cols-2 md:gap-5 md:space-y-0">
          <Card variant="default" padding="md" radius="lg" hoverable clickable onClick={() => setPage("editProfile")}>
            <div className="flex items-center gap-4">
              <Avatar name="Alex Chen" size="xl" />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <Text style={{ fontWeight: 600 }}>Alex Chen</Text>
                  {currentPlan.type === "pro" ? (
                    <span className="inline-flex items-center gap-1 bg-primary/10 text-primary text-[0.625rem] px-2 py-0.5 rounded-full" style={{ fontWeight: 700 }}><Crown className="w-3 h-3" /> PRO</span>
                  ) : (
                    <span className="inline-flex items-center bg-muted text-muted-foreground text-[0.625rem] px-2 py-0.5 rounded-full" style={{ fontWeight: 600 }}>FREE</span>
                  )}
                </div>
                <Text className="text-muted-foreground text-[0.875rem]">alex.chen@email.com</Text>
              </div>
              <ChevronRight className="w-5 h-5 text-muted-foreground shrink-0" />
            </div>
          </Card>
          <div className="relative rounded-2xl overflow-hidden p-5" style={{ background: "linear-gradient(135deg, var(--primary) 0%, color-mix(in srgb, var(--primary) 60%, #000) 100%)" }}>
            <div className="absolute top-0 right-0 w-32 h-32 rounded-full bg-white/5 -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-24 h-24 rounded-full bg-white/5 translate-y-1/2 -translate-x-1/2" />
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2"><Wallet className="w-4 h-4 text-white/70" /><Text className="text-white/70 text-[0.8125rem]" style={{ fontWeight: 600 }}>REWARDS</Text></div>
                <DSBadge variant="outline" size="sm" className="!border-white/30 !text-white/80">Gold Member</DSBadge>
              </div>
              <div className="mt-3">
                <Text className="text-white/60 text-[0.8125rem]">Total Balance (USD eq.)</Text>
                <div className="flex items-baseline gap-1">
                  <Text className="text-white text-[0.75rem]">$</Text>
                  <Text className="text-white text-[2rem]" style={{ fontWeight: 700 }}>{showBalance ? "14,874" : "\u2022\u2022"}</Text>
                  <Text className="text-white/70 text-[1rem]">{showBalance ? ".07" : ""}</Text>
                  <button onClick={(e) => { e.stopPropagation(); setShowBalance(!showBalance); }} className="ml-2 text-white/50 hover:text-white/80 transition">
                    {showBalance ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                  </button>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-2 mt-4">
                <div className="rounded-lg bg-white/10 px-2.5 py-2">
                  <Text className="text-white/60 text-[0.625rem]" style={{ fontWeight: 600 }}>DOMESTIC</Text>
                  <Text className="text-white text-[0.8125rem]" style={{ fontWeight: 700 }}>{showBalance ? "₩13,000,000" : "••••"}</Text>
                </div>
                <div className="rounded-lg bg-white/10 px-2.5 py-2">
                  <Text className="text-white/60 text-[0.625rem]" style={{ fontWeight: 600 }}>FOREIGN</Text>
                  <Text className="text-white text-[0.8125rem]" style={{ fontWeight: 700 }}>{showBalance ? "$5,000.00" : "••••"}</Text>
                </div>
                <div className="rounded-lg bg-white/10 px-2.5 py-2">
                  <Text className="text-white/60 text-[0.625rem]" style={{ fontWeight: 600 }}>BONUS</Text>
                  <Text className="text-white text-[0.8125rem]" style={{ fontWeight: 700 }}>{showBalance ? "₩330,000" : "••••"}</Text>
                </div>
              </div>
            </div>
          </div>
        </div>
      </StaggerItem>
      <StaggerItem preset="fadeInUp">
        <div className="grid grid-cols-3 gap-3">
          {[{ label: "Top Up", icon: ArrowUpRight, page: "topUp" }, { label: "Send Gift", icon: Gift, page: "sendGift" }, { label: "History", icon: Clock, page: "history" }].map(a => (
            <Card key={a.label} variant="default" padding="sm" radius="lg" hoverable clickable onClick={() => setPage(a.page)} className="text-center">
              <div className="flex flex-col items-center gap-1.5">
                <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center"><a.icon className="w-4 h-4 text-primary" /></div>
                <Text className="text-[0.75rem]" style={{ fontWeight: 500 }}>{a.label}</Text>
              </div>
            </Card>
          ))}
        </div>
      </StaggerItem>
      <StaggerItem preset="fadeInUp">
        <Card variant="default" padding="md" radius="lg">
          <div className="flex items-center justify-between mb-4"><div className="flex items-center gap-2"><Crown className="w-5 h-5 text-primary" /><Text style={{ fontWeight: 600 }}>Reward Tier</Text></div><Text className="text-primary text-[0.8125rem]" style={{ fontWeight: 600 }}>{currentPoints.toLocaleString()} pts</Text></div>
          <div className="relative">
            <div className="flex justify-between mb-3">
              {REWARD_TIERS.map((t, i) => (
                <div key={t.name} className="flex flex-col items-center gap-1.5">
                  <div className={`transition-all ${i === currentTierIdx ? "scale-110" : i < currentTierIdx ? "opacity-70" : "opacity-40"}`}><TierMedalSvg tier={t.icon} size={28} /></div>
                  <Text className={`text-[0.75rem] ${i === currentTierIdx ? "text-primary" : i < currentTierIdx ? "text-success" : "text-muted-foreground"}`} style={{ fontWeight: i === currentTierIdx ? 600 : 400 }}>{t.name}</Text>
                  <Text className="text-[0.6875rem] text-muted-foreground">{t.min.toLocaleString()}+</Text>
                </div>
              ))}
            </div>
            <div className="relative h-2 bg-border rounded-full overflow-hidden">
              <div className="absolute left-0 top-0 h-full rounded-full transition-all duration-500" style={{ width: `${((currentTierIdx + progressToNext / 100) / (REWARD_TIERS.length - 1)) * 100}%`, background: `linear-gradient(90deg, color-mix(in srgb, var(--primary) 40%, white), var(--primary), color-mix(in srgb, var(--primary) 70%, black))` }} />
            </div>
          </div>
          <div className="flex items-center justify-between mt-4 pt-3 border-t border-border">
            <div className="flex items-center gap-2"><Star className="w-4 h-4 text-warning" /><Text className="text-[0.8125rem] text-muted-foreground">{(nextTier.min - currentPoints).toLocaleString()} pts to {nextTier.name}</Text></div>
            <Button variant="link" size="xs" rightIcon={<ChevronRight className="w-3 h-3" />} onClick={() => setPage("tierBenefits")}>View Benefits</Button>
          </div>
        </Card>
      </StaggerItem>
      <StaggerItem preset="fadeInUp">
        <Card variant="default" padding="md" radius="lg" hoverable clickable onClick={() => setPage("refer")}>
          <div className="flex items-center gap-4">
            <div className="w-11 h-11 rounded-full bg-success/10 flex items-center justify-center shrink-0"><Gift className="w-5 h-5 text-success" /></div>
            <div className="flex-1 min-w-0"><Text style={{ fontWeight: 600 }}>Refer a Friend</Text><Text className="text-muted-foreground text-[0.875rem]">You both get $10 in rewards</Text></div>
            <ChevronRight className="w-5 h-5 text-muted-foreground shrink-0" />
          </div>
        </Card>
      </StaggerItem>
      <StaggerItem preset="fadeInUp">
        <div className="space-y-3">
          <div className="flex items-center gap-2"><Sun className="w-4 h-4 text-primary" /><Text style={{ fontWeight: 600 }}>Appearance</Text></div>
          <div className="grid grid-cols-4 gap-2">
            {Object.keys(themePresets).map((themeName) => (
              <button key={themeName} onClick={() => applyTheme(themeName)}
                className={`py-2.5 px-3 rounded-xl text-[0.8125rem] transition ${selectedTheme === themeName ? "bg-primary text-primary-foreground" : "bg-secondary text-foreground hover:bg-secondary/80"}`}
                style={{ fontWeight: selectedTheme === themeName ? 600 : 400 }}>{themeName}</button>
            ))}
          </div>
        </div>
      </StaggerItem>
      <StaggerItem preset="fadeInUp">
        <div className="space-y-2">
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
    </Stagger>
  );
}
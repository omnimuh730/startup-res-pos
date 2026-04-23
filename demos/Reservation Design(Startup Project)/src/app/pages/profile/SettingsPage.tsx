/* Settings Page (merged: Notifications + Privacy & Security + Sound) */
import { useState } from "react";
import { Text } from "../../components/ds/Text";
import { Button } from "../../components/ds/Button";
import { Toggle } from "../../components/ds/Toggle";
import { PasswordInput } from "../../components/ds/PasswordInput";
import {
  Bell, Gift, Calendar, Star, ShoppingBag, Volume2,
  MapPin, Eye, Smartphone, Share, Shield, Lock, X,
} from "lucide-react";
import { PageHeader } from "./profileHelpers";

function ToggleRow({ icon: Icon, label, description, checked, onToggle }: {
  icon: typeof Bell; label: string; description: string; checked: boolean; onToggle: (v: boolean) => void;
}) {
  return (
    <div onClick={() => onToggle(!checked)} className="flex items-center gap-3 p-3 rounded-xl bg-secondary/50 hover:bg-secondary/70 transition cursor-pointer">
      <div className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 ${checked ? "bg-primary/10" : "bg-muted"}`}>
        <Icon className={`w-4 h-4 ${checked ? "text-primary" : "text-muted-foreground"}`} />
      </div>
      <div className="flex-1 min-w-0">
        <Text className="text-[0.8125rem]" style={{ fontWeight: 600 }}>{label}</Text>
        <Text className="text-muted-foreground text-[0.6875rem]">{description}</Text>
      </div>
      <div onClick={(e) => e.stopPropagation()} className="shrink-0">
        <Toggle checked={checked} onToggle={onToggle} size="sm" />
      </div>
    </div>
  );
}

export function SettingsPage({ onBack }: { onBack: () => void }) {
  const [orderUpdates, setOrderUpdates] = useState(true);
  const [promotions, setPromotions] = useState(true);
  const [reservationReminders, setReservationReminders] = useState(true);
  const [rewardsPoints, setRewardsPoints] = useState(false);
  const [newRestaurants, setNewRestaurants] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [volume, setVolume] = useState(35);
  const [locationTracking, setLocationTracking] = useState(true);
  const [orderHistory, setOrderHistory] = useState(true);
  const [personalizedAds, setPersonalizedAds] = useState(false);
  const [dataSharing, setDataSharing] = useState(false);
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleChangePassword = () => {
    if (newPassword === confirmPassword) {
      setShowPasswordForm(false); setCurrentPassword(""); setNewPassword(""); setConfirmPassword("");
    }
  };

  return (
    <div className="pb-8">
      <PageHeader title="Settings" onBack={onBack} />
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-3"><Bell className="w-4 h-4 text-primary" /><Text style={{ fontWeight: 600 }}>Notifications</Text></div>
        <div className="space-y-2">
          <ToggleRow icon={Bell} label="Order Updates" description="Status changes and delivery tracking" checked={orderUpdates} onToggle={setOrderUpdates} />
          <ToggleRow icon={Gift} label="Promotions" description="Deals, coupons, and special offers" checked={promotions} onToggle={setPromotions} />
          <ToggleRow icon={Calendar} label="Reservation Reminders" description="Upcoming booking reminders" checked={reservationReminders} onToggle={setReservationReminders} />
          <ToggleRow icon={Star} label="Rewards & Points" description="Points earned and tier updates" checked={rewardsPoints} onToggle={setRewardsPoints} />
          <ToggleRow icon={ShoppingBag} label="New Restaurants" description="Openings near you" checked={newRestaurants} onToggle={setNewRestaurants} />
        </div>
      </div>
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-3"><Volume2 className="w-4 h-4 text-primary" /><Text style={{ fontWeight: 600 }}>Sound</Text></div>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 rounded-xl bg-secondary">
            <div className="flex items-center gap-3"><Volume2 className="w-5 h-5 text-primary" /><Text className="text-[0.8125rem]" style={{ fontWeight: 600 }}>Sound Effects</Text></div>
            <Toggle checked={soundEnabled} onToggle={setSoundEnabled} />
          </div>
          {soundEnabled && (
            <div className="p-4 rounded-xl bg-secondary/50">
              <div className="flex items-center gap-3">
                <Volume2 className="w-4 h-4 text-muted-foreground" />
                <input type="range" min="0" max="100" value={volume} onChange={e => setVolume(Number(e.target.value))} className="flex-1 accent-primary" />
                <Volume2 className="w-5 h-5 text-muted-foreground" />
                <Text className="text-[0.8125rem] w-10 text-right" style={{ fontWeight: 500 }}>{volume}%</Text>
              </div>
            </div>
          )}
        </div>
      </div>
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-3"><Shield className="w-4 h-4 text-primary" /><Text style={{ fontWeight: 600 }}>Privacy & Security</Text></div>
        <div className="space-y-2 mb-4">
          <ToggleRow icon={MapPin} label="Location Tracking" description="Allow app to use your location" checked={locationTracking} onToggle={setLocationTracking} />
          <ToggleRow icon={Eye} label="Order History Visible" description="Show past orders on your profile" checked={orderHistory} onToggle={setOrderHistory} />
          <ToggleRow icon={Smartphone} label="Personalized Ads" description="Show ads based on your activity" checked={personalizedAds} onToggle={setPersonalizedAds} />
          <ToggleRow icon={Share} label="Data Sharing" description="Share data with restaurant partners" checked={dataSharing} onToggle={setDataSharing} />
        </div>
        <div className="pt-4 border-t border-border space-y-3">
          {showPasswordForm ? (
            <div className="p-4 rounded-xl bg-secondary/50 space-y-4">
              <div className="flex items-center justify-between">
                <Text style={{ fontWeight: 600 }}>Change Password</Text>
                <button onClick={() => setShowPasswordForm(false)} className="p-1.5 hover:bg-background/50 rounded-lg"><X className="w-4 h-4" /></button>
              </div>
              <PasswordInput label="Current Password" value={currentPassword} onChange={e => setCurrentPassword(e.target.value)} fullWidth />
              <PasswordInput label="New Password" value={newPassword} onChange={e => setNewPassword(e.target.value)} fullWidth />
              <PasswordInput label="Confirm New Password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} fullWidth />
              <Button variant="primary" fullWidth onClick={handleChangePassword}>Update Password</Button>
            </div>
          ) : (
            <Button variant="outline" fullWidth leftIcon={<Lock className="w-4 h-4" />} onClick={() => setShowPasswordForm(true)}>Change Password</Button>
          )}
          <Button variant="ghost" fullWidth className="!text-destructive">Delete Account</Button>
        </div>
      </div>
    </div>
  );
}
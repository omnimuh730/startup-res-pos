/* Settings Page (merged: Notifications + Privacy & Security + Sound) */
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Text } from "../../../components/ds/Text";
import { Button } from "../../../components/ds/Button";
import { PasswordInput } from "../../../components/ds/PasswordInput";
import {
  Bell, Gift, Calendar, Star, ShoppingBag, Volume2,
  MapPin, Eye, Smartphone, Share, Shield, Lock, X, Sun, VolumeX
} from "lucide-react";
import { PageHeader, themePresets } from "../profileHelpers";

// 1. Improved accessible Switch with drop shadow and better track contrast
function PremiumSwitch({ checked, onToggle }: { checked: boolean; onToggle: (v: boolean) => void }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onToggle(!checked)}
      className={`relative inline-flex h-[28px] w-[50px] shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background ${
        checked ? "bg-primary" : "bg-muted-foreground/30" // Darker inactive track for better visibility
      }`}
    >
      <span className="sr-only">Use setting</span>
      <span
        className={`pointer-events-none inline-block h-[24px] w-[24px] transform rounded-full bg-white shadow-[0_2px_5px_rgba(0,0,0,0.25)] ring-0 transition duration-200 ease-in-out ${
          checked ? "translate-x-[22px]" : "translate-x-0"
        }`}
      />
    </button>
  );
}

function SettingsGroup({ children, label }: { children: React.ReactNode; label: string }) {
  return (
    <div className="mb-6">
      <Text className="text-[16px] font-bold text-foreground mb-3 px-1">{label}</Text>
      <div className="border border-border rounded-2xl bg-card overflow-hidden">
        {children}
      </div>
    </div>
  );
}

function SettingsRow({ 
  icon: Icon, label, description, checked, onToggle, isLast 
}: {
  icon: React.ElementType; label: string; description?: string; checked: boolean; onToggle: (v: boolean) => void; isLast?: boolean;
}) {
  return (
    <div 
      onClick={() => onToggle(!checked)} 
      className={`flex items-center gap-3.5 p-4 bg-card active:bg-secondary/50 transition-colors cursor-pointer ${!isLast ? "border-b border-border/60" : ""}`}
    >
      <div className="w-9 h-9 rounded-full bg-secondary flex items-center justify-center shrink-0">
        <Icon className="w-5 h-5 text-foreground" strokeWidth={1.5} />
      </div>
      <div className="flex-1 min-w-0 pr-2">
        <Text className="text-[15px] font-semibold text-foreground leading-tight truncate">{label}</Text>
        {description && <Text className="text-muted-foreground text-[13px] mt-0.5 truncate">{description}</Text>}
      </div>
      <div onClick={(e) => e.stopPropagation()} className="shrink-0">
        <PremiumSwitch checked={checked} onToggle={onToggle} />
      </div>
    </div>
  );
}

const staggerContainer = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.08 } }
};

const itemVariant = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
};

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
  const [selectedTheme, setSelectedTheme] = useState("Airbnb");

  const applyTheme = (themeName: string) => {
    const preset = themePresets[themeName];
    if (preset) {
      Object.entries(preset).forEach(([key, value]) => { document.documentElement.style.setProperty(key, value); });
      setSelectedTheme(themeName);
    }
  };

  const handleChangePassword = () => {
    if (newPassword === confirmPassword && newPassword.length > 0) {
      setShowPasswordForm(false); 
      setCurrentPassword(""); 
      setNewPassword(""); 
      setConfirmPassword("");
    }
  };

  return (
    <div className="pb-8">
      <PageHeader title="Settings" onBack={onBack} />
      
      <motion.div 
        className="px-5 pt-2"
        variants={staggerContainer}
        initial="hidden"
        animate="show"
      >
        {/* Appearance Section */}
        <motion.div variants={itemVariant}>
          <SettingsGroup label="Appearance">
            <div className="p-4 bg-card">
              <div className="flex items-center gap-3.5 mb-4">
                <div className="w-9 h-9 rounded-full bg-secondary flex items-center justify-center shrink-0">
                  <Sun className="w-5 h-5 text-foreground" strokeWidth={1.5} />
                </div>
                <div className="flex-1">
                  <Text className="text-[15px] font-semibold text-foreground">Color Theme</Text>
                  <Text className="text-muted-foreground text-[13px] mt-0.5">Select your preferred app style</Text>
                </div>
              </div>
              
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {Object.keys(themePresets).map((themeName) => {
                  const isSelected = selectedTheme === themeName;
                  return (
                    <button 
                      key={themeName} 
                      onClick={() => applyTheme(themeName)}
                      className={`py-2.5 px-3 rounded-xl text-[13px] font-semibold transition-all border ${
                        isSelected 
                          ? "bg-foreground text-background border-foreground shadow-sm" 
                          : "bg-secondary text-foreground border-transparent hover:border-border"
                      }`}
                    >
                      {themeName}
                    </button>
                  );
                })}
              </div>
            </div>
          </SettingsGroup>
        </motion.div>

        {/* Notifications Section */}
        <motion.div variants={itemVariant}>
          <SettingsGroup label="Notifications">
            <SettingsRow icon={Bell} label="Order Updates" description="Status changes and delivery tracking" checked={orderUpdates} onToggle={setOrderUpdates} />
            <SettingsRow icon={Gift} label="Promotions" description="Deals, coupons, and special offers" checked={promotions} onToggle={setPromotions} />
            <SettingsRow icon={Calendar} label="Reservation Reminders" description="Upcoming booking reminders" checked={reservationReminders} onToggle={setReservationReminders} />
            <SettingsRow icon={Star} label="Rewards & Points" description="Points earned and tier updates" checked={rewardsPoints} onToggle={setRewardsPoints} />
            <SettingsRow icon={ShoppingBag} label="New Restaurants" description="Openings near you" checked={newRestaurants} onToggle={setNewRestaurants} isLast />
          </SettingsGroup>
        </motion.div>

        {/* Sound Section */}
        <motion.div variants={itemVariant}>
          <SettingsGroup label="Sound & Haptics">
            <SettingsRow icon={Volume2} label="In-App Sounds" description="Play sounds for actions and alerts" checked={soundEnabled} onToggle={setSoundEnabled} isLast={!soundEnabled} />
            
            <AnimatePresence initial={false}>
              {soundEnabled && (
                <motion.div 
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ type: "spring", bounce: 0, duration: 0.3 }}
                  className="overflow-hidden"
                >
                  <div className="p-4 bg-card flex items-center gap-4 border-t border-border/60">
                    <VolumeX className="w-5 h-5 text-foreground/70 shrink-0" strokeWidth={1.5} />
                    
                    {/* 2. Improved Accessible Volume Slider */}
                    <input 
                      type="range" 
                      min="0" max="100" 
                      value={volume} 
                      onChange={e => setVolume(Number(e.target.value))} 
                      style={{
                        background: `linear-gradient(to right, var(--primary) ${volume}%, var(--border) ${volume}%)`
                      }}
                      className="flex-1 h-1.5 rounded-full appearance-none cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2
                        [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:h-6 [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:shadow-[0_2px_6px_rgba(0,0,0,0.25)] [&::-webkit-slider-thumb]:border [&::-webkit-slider-thumb]:border-border/50" 
                      aria-label="Volume adjustment"
                    />
                    
                    <Volume2 className="w-5 h-5 text-foreground/70 shrink-0" strokeWidth={1.5} />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </SettingsGroup>
        </motion.div>

        {/* Privacy Section */}
        <motion.div variants={itemVariant}>
          <SettingsGroup label="Privacy & Data">
            <SettingsRow icon={MapPin} label="Location Tracking" description="Allow app to use your location" checked={locationTracking} onToggle={setLocationTracking} />
            <SettingsRow icon={Eye} label="Order History Visible" description="Show past orders on your profile" checked={orderHistory} onToggle={setOrderHistory} />
            <SettingsRow icon={Smartphone} label="Personalized Ads" description="Show ads based on your activity" checked={personalizedAds} onToggle={setPersonalizedAds} />
            <SettingsRow icon={Share} label="Data Sharing" description="Share data with restaurant partners" checked={dataSharing} onToggle={setDataSharing} isLast />
          </SettingsGroup>
        </motion.div>

        {/* Security / Account Actions */}
        <motion.div variants={itemVariant} className="space-y-4 pt-2">
          <Text className="text-[16px] font-bold text-foreground mb-1 px-1">Security</Text>
          
          <AnimatePresence mode="wait">
            {!showPasswordForm ? (
              <motion.div 
                key="btn"
                initial={{ opacity: 0, y: -10 }} 
                animate={{ opacity: 1, y: 0 }} 
                exit={{ opacity: 0, y: -10 }}
              >
                <Button 
                  variant="outline" 
                  fullWidth 
                  className="h-[52px] rounded-xl text-[15px] font-semibold border-border bg-card"
                  leftIcon={<Lock className="w-4 h-4" />} 
                  onClick={() => setShowPasswordForm(true)}
                >
                  Change Password
                </Button>
              </motion.div>
            ) : (
              <motion.div 
                key="form"
                initial={{ opacity: 0, height: 0 }} 
                animate={{ opacity: 1, height: "auto" }} 
                exit={{ opacity: 0, height: 0 }}
                transition={{ type: "spring", bounce: 0, duration: 0.4 }}
                className="overflow-hidden"
              >
                <div className="p-4 rounded-2xl border border-border bg-card space-y-4">
                  <div className="flex items-center justify-between pb-2 border-b border-border/50">
                    <Text className="text-[15px] font-bold text-foreground">Update Password</Text>
                    <button 
                      onClick={() => setShowPasswordForm(false)} 
                      className="w-8 h-8 flex items-center justify-center rounded-full bg-secondary text-muted-foreground hover:bg-border transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="space-y-3">
                    <PasswordInput label="Current Password" value={currentPassword} onChange={e => setCurrentPassword(e.target.value)} />
                    <PasswordInput label="New Password" value={newPassword} onChange={e => setNewPassword(e.target.value)} />
                    <PasswordInput label="Confirm New Password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} />
                  </div>
                  <Button 
                    variant="primary" 
                    fullWidth 
                    className="h-[52px] rounded-xl font-bold mt-2"
                    onClick={handleChangePassword}
                    disabled={!newPassword || newPassword !== confirmPassword}
                  >
                    Save New Password
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <Button 
            variant="ghost" 
            fullWidth 
            className="h-[52px] rounded-xl text-[15px] font-semibold text-destructive hover:bg-destructive/10"
          >
            Delete Account
          </Button>
        </motion.div>
      </motion.div>
    </div>
  );
}
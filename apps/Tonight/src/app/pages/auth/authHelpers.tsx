/* Auth shared components: Logo, InputField, FeedbackBanner, mock data */
import { useState } from "react";
import { motion } from "motion/react";
import { Eye, EyeOff, AlertTriangle, CheckCircle2, XCircle } from "lucide-react";
import React from "react";

export function Logo() {
  const size = 48;
  const tableD = size * 0.58;
  const holeD = tableD * 0.3;
  const chairD = size * 0.15;
  const orbitR = tableD / 2 + chairD * 0.9;
  const cx = size / 2;
  const cy = size / 2;
  return (
    <div className="relative" style={{ width: size, height: size }}>
      <div className="absolute rounded-full overflow-hidden" style={{ width: tableD, height: tableD, left: cx - tableD / 2, top: cy - tableD / 2, background: "#FF385C" }}>
        <div className="absolute rounded-full bg-white" style={{ width: holeD, height: holeD, left: "50%", top: "50%", transform: "translate(-50%, -50%)" }} />
      </div>
      <div className="absolute rounded-full" style={{ width: chairD, height: chairD, background: "#FF385C", left: cx - orbitR - chairD / 2, top: cy - chairD / 2 }} />
    </div>
  );
}

export function InputField({ icon: Icon, type, placeholder, value, onChange, error, disabled }: {
  icon: React.ElementType; type: string; placeholder: string; value: string; onChange: (v: string) => void; error?: string; disabled?: boolean;
}) {
  const [showPw, setShowPw] = useState(false);
  const isPw = type === "password";
  return (
    <div>
      <div className="relative">
        <Icon className="absolute left-4 top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-[#999]" strokeWidth={1.8} />
        <input
          type={isPw && showPw ? "text" : type} placeholder={placeholder} value={value}
          onChange={(e) => onChange(e.target.value)} disabled={disabled}
          className={`w-full h-[52px] pl-11 pr-12 rounded-2xl bg-[#f5f5f5] text-[0.9375rem] text-[#222] placeholder:text-[#aaa] outline-none transition ${error ? "ring-2 ring-[#C13515]/40" : "focus:ring-2 focus:ring-[#FF385C]/30"} ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
        />
        {isPw && (
          <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-4 top-1/2 -translate-y-1/2 text-[#999] hover:text-[#666] transition cursor-pointer">
            {showPw ? <EyeOff className="w-[18px] h-[18px]" /> : <Eye className="w-[18px] h-[18px]" />}
          </button>
        )}
      </div>
      {error && <p className="text-[0.75rem] text-[#C13515] mt-1 ml-1 flex items-center gap-1"><AlertTriangle className="w-3 h-3 shrink-0" />{error}</p>}
    </div>
  );
}

export function FeedbackBanner({ type, message, onDismiss }: { type: "success" | "error" | "warning"; message: string; onDismiss?: () => void }) {
  const styles = { success: "bg-[#E8F5E9] border-[#4CAF50]/30 text-[#2E7D32]", error: "bg-[#FFEBEE] border-[#EF5350]/30 text-[#C62828]", warning: "bg-[#FFF8E1] border-[#FFA726]/30 text-[#E65100]" };
  const icons = { success: <CheckCircle2 className="w-4 h-4 shrink-0" />, error: <XCircle className="w-4 h-4 shrink-0" />, warning: <AlertTriangle className="w-4 h-4 shrink-0" /> };
  return (
    <motion.div initial={{ opacity: 0, y: -10, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -10, scale: 0.95 }}
      className={`flex items-start gap-2.5 px-4 py-3 rounded-2xl border ${styles[type]} text-[0.8125rem]`}>
      <span className="mt-0.5">{icons[type]}</span>
      <span className="flex-1">{message}</span>
      {onDismiss && <button onClick={onDismiss} className="mt-0.5 opacity-60 hover:opacity-100 cursor-pointer"><XCircle className="w-3.5 h-3.5" /></button>}
    </motion.div>
  );
}

export const MOCK_USERS: Record<string, { password: string; name: string; active: boolean; securityQA: { q: string; a: string }[] }> = {
  catchtable: { password: "Pass1234", name: "Demo User", active: true, securityQA: [
    { q: "What is your pet's name?", a: "fluffy" }, { q: "What city were you born in?", a: "seoul" }, { q: "What is your favorite food?", a: "pizza" },
  ]},
  admin: { password: "Admin123", name: "Admin", active: false, securityQA: [
    { q: "What city were you born in?", a: "seoul" }, { q: "What was the name of your first school?", a: "greenfield" }, { q: "What is your mother's maiden name?", a: "kim" },
  ]},
  foodie99: { password: "Yummy123", name: "Food Lover", active: true, securityQA: [
    { q: "What is your favorite food?", a: "pizza" }, { q: "What is your pet's name?", a: "buddy" }, { q: "What was your childhood nickname?", a: "foodster" },
  ]},
};

export const SECURITY_QUESTIONS = [
  "What is your pet's name?", "What city were you born in?", "What is your favorite food?",
  "What was the name of your first school?", "What is your mother's maiden name?",
  "What was your childhood nickname?", "What is your favorite movie?",
  "What street did you grow up on?", "What is your favorite sports team?",
];

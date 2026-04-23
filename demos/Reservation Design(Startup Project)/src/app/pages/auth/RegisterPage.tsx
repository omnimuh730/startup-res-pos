/* Register (Onboarding) Flow */
import { useState } from "react";
import React from "react";
import { motion, AnimatePresence } from "motion/react";
import { ArrowLeft, Lock, User, CheckCircle2, ShieldQuestion, ChevronRight, Gift, QrCode, X } from "lucide-react";
import { useNavigate } from "react-router";
import { Logo, InputField, FeedbackBanner, MOCK_USERS, SECURITY_QUESTIONS } from "./authHelpers";
import { authStore } from "../../stores/authStore";

type SignUpStep = "refer" | "credentials" | "profile" | "security" | "done";

export function RegisterPage() {
  const navigate = useNavigate();
  const onRegister = () => { authStore.setAuthed(true); navigate("/discover", { replace: true }); };
  const onGoLogin = () => navigate("/auth/login");
  const [step, setStep] = useState<SignUpStep>("refer");
  const [referCode, setReferCode] = useState("");
  const [showScanner, setShowScanner] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [securityQA, setSecurityQA] = useState<{ q: string; a: string }[]>([
    { q: SECURITY_QUESTIONS[0], a: "" }, { q: SECURITY_QUESTIONS[1], a: "" }, { q: SECURITY_QUESTIONS[2], a: "" },
  ]);
  const [feedback, setFeedback] = useState<{ type: "success" | "error" | "warning"; message: string } | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const handleCredentialsNext = () => {
    setFeedback(null); setFieldErrors({});
    if (!username.trim()) { setFieldErrors({ username: "Username is required" }); return; }
    if (username.trim().length < 3) { setFieldErrors({ username: "Username must be at least 3 characters" }); return; }
    if (/\s/.test(username)) { setFieldErrors({ username: "Username cannot contain spaces" }); return; }
    if (MOCK_USERS[username.toLowerCase()]) { setFeedback({ type: "error", message: "This username is already taken." }); setFieldErrors({ username: "Username already exists" }); return; }
    if (password.length < 6) { setFieldErrors({ password: "Password must be at least 6 characters" }); return; }
    if (!/[A-Z]/.test(password) || !/[0-9]/.test(password)) { setFieldErrors({ password: "Must contain at least 1 uppercase letter and 1 number" }); return; }
    if (password !== confirmPassword) { setFieldErrors({ confirmPassword: "Passwords do not match" }); return; }
    setStep("profile");
  };

  const handleProfileNext = () => {
    setFeedback(null); setFieldErrors({});
    if (!displayName.trim()) { setFieldErrors({ displayName: "Display name is required" }); return; }
    if (displayName.trim().length < 2) { setFieldErrors({ displayName: "Name must be at least 2 characters" }); return; }
    setStep("security");
  };

  const handleSecurityNext = () => {
    setFeedback(null); setFieldErrors({});
    const errors: Record<string, string> = {};
    securityQA.forEach((qa, i) => { if (!qa.a.trim()) errors[`securityA${i}`] = "Please provide an answer"; });
    const qs = securityQA.map(qa => qa.q);
    if (new Set(qs).size !== qs.length) { setFeedback({ type: "error", message: "Each security question must be different." }); return; }
    if (Object.keys(errors).length > 0) { setFieldErrors(errors); return; }
    setLoading(true); setTimeout(() => { setLoading(false); setStep("done"); }, 800);
  };

  const stepIndex = ["refer", "credentials", "profile", "security", "done"].indexOf(step);

  return (
    <motion.div className="min-h-screen bg-white flex flex-col" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} transition={{ duration: 0.3 }}>
      <div className="flex items-center gap-3 px-4 pt-4 pb-2">
        <button onClick={() => { if (step === "refer") onGoLogin(); else if (step === "credentials") setStep("refer"); else if (step === "profile") setStep("credentials"); else if (step === "security") setStep("profile"); else onGoLogin(); }} className="p-2 rounded-full hover:bg-[#f5f5f5] cursor-pointer">
          <ArrowLeft className="w-5 h-5 text-[#222]" />
        </button>
        <span className="text-[1rem] text-[#222]" style={{ fontWeight: 600 }}>Create Account</span>
        <button onClick={() => navigate("/discover")} aria-label="Close" className="ml-auto p-2 rounded-full hover:bg-[#f5f5f5] cursor-pointer">
          <X className="w-5 h-5 text-[#666]" />
        </button>
      </div>
      <div className="flex-1 flex flex-col px-6 sm:px-8 max-w-md mx-auto w-full pt-4">
        <div className="flex items-center mb-6">
          {["Refer", "Account", "Profile", "Security", "Done"].map((label, i) => (
            <React.Fragment key={label}>
              <div className="flex flex-col items-center gap-1">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-[0.75rem] transition-all ${stepIndex === i ? "bg-[#FF385C] text-white" : stepIndex > i ? "bg-[#4CAF50] text-white" : "bg-[#f5f5f5] text-[#aaa]"}`} style={{ fontWeight: 600 }}>
                  {stepIndex > i ? <CheckCircle2 className="w-4 h-4" /> : i + 1}
                </div>
                <span className={`text-[0.625rem] ${stepIndex >= i ? "text-[#222]" : "text-[#ccc]"}`} style={{ fontWeight: 500 }}>{label}</span>
              </div>
              {i < 4 && <div className={`flex-1 h-0.5 mb-4 mx-2 ${stepIndex > i ? "bg-[#4CAF50]" : "bg-[#eee]"}`} />}
            </React.Fragment>
          ))}
        </div>
        <AnimatePresence>{feedback && <div className="mb-4"><FeedbackBanner type={feedback.type} message={feedback.message} onDismiss={() => setFeedback(null)} /></div>}</AnimatePresence>
        {step === "refer" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="flex flex-col items-center mb-6">
              <div className="w-16 h-16 rounded-full bg-[#FFF3F0] flex items-center justify-center mb-3"><Gift className="w-7 h-7 text-[#FF385C]" /></div>
              <h2 className="text-[1.25rem] text-[#222]" style={{ fontWeight: 700 }}>Got a referral code?</h2>
              <p className="text-[0.8125rem] text-[#888] mt-1 text-center">Enter a friend's code or scan their QR to claim bonus rewards. This step is optional.</p>
            </div>
            {!showScanner ? (
              <>
                <InputField icon={Gift} type="text" placeholder="Enter referral code (optional)" value={referCode} onChange={(v) => setReferCode(v.toUpperCase().replace(/\s/g, ""))} />
                <button onClick={() => setShowScanner(true)} className="w-full h-[52px] mt-3 rounded-2xl border border-[#eee] bg-white text-[#222] text-[0.9375rem] transition hover:bg-[#f5f5f5] cursor-pointer flex items-center justify-center gap-2" style={{ fontWeight: 600 }}>
                  <QrCode className="w-4 h-4" /> Scan QR code
                </button>
              </>
            ) : (
              <div className="rounded-2xl bg-[#f5f5f5] p-6 flex flex-col items-center">
                <div className="w-48 h-48 rounded-xl bg-white border-2 border-dashed border-[#FF385C] flex items-center justify-center mb-3 relative overflow-hidden">
                  <QrCode className="w-24 h-24 text-[#ccc]" />
                  <motion.div className="absolute left-0 right-0 h-0.5 bg-[#FF385C]" animate={{ top: ["10%", "90%", "10%"] }} transition={{ duration: 2, repeat: Infinity, ease: "linear" }} />
                </div>
                <p className="text-[0.8125rem] text-[#888] text-center mb-3">Point your camera at a friend's referral QR</p>
                <button onClick={() => { setReferCode("FRIEND-" + Math.random().toString(36).slice(2, 7).toUpperCase()); setShowScanner(false); }} className="text-[0.8125rem] text-[#FF385C] underline cursor-pointer" style={{ fontWeight: 600 }}>Simulate scan</button>
                <button onClick={() => setShowScanner(false)} className="text-[0.75rem] text-[#888] mt-2 cursor-pointer">Cancel</button>
              </div>
            )}
            <button onClick={() => setStep("credentials")} className="w-full h-[52px] mt-5 rounded-2xl text-white text-[0.9375rem] transition hover:opacity-90 cursor-pointer flex items-center justify-center gap-2" style={{ fontWeight: 700, background: "#FF385C" }}>{referCode ? "Apply & Continue" : "Continue"} <ChevronRight className="w-4 h-4" /></button>
            <button onClick={() => { setReferCode(""); setStep("credentials"); }} className="w-full h-[44px] mt-2 text-[0.875rem] text-[#888] hover:text-[#222] transition cursor-pointer" style={{ fontWeight: 500 }}>Skip for now</button>
          </motion.div>
        )}
        {step === "credentials" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="flex flex-col items-center mb-6">
              <Logo />
              <h2 className="mt-3 text-[1.25rem] text-[#222]" style={{ fontWeight: 700 }}>Choose your credentials</h2>
              <p className="text-[0.8125rem] text-[#888] mt-1">Pick a unique username and strong password</p>
            </div>
            <div className="space-y-3">
              <InputField icon={User} type="text" placeholder="Username" value={username} onChange={(v) => { setUsername(v.replace(/\s/g, "")); setFieldErrors({}); setFeedback(null); }} error={fieldErrors.username} />
              <InputField icon={Lock} type="password" placeholder="Password (min 6, 1 uppercase, 1 number)" value={password} onChange={(v) => { setPassword(v); setFieldErrors({}); }} error={fieldErrors.password} />
              <InputField icon={Lock} type="password" placeholder="Confirm password" value={confirmPassword} onChange={(v) => { setConfirmPassword(v); setFieldErrors({}); }} error={fieldErrors.confirmPassword} />
            </div>
            {password.length > 0 && (
              <div className="mt-3">
                <div className="flex gap-1">
                  {[1, 2, 3, 4].map((level) => { const s = (password.length >= 6 ? 1 : 0) + (/[A-Z]/.test(password) ? 1 : 0) + (/[0-9]/.test(password) ? 1 : 0) + (password.length >= 10 ? 1 : 0); return <div key={level} className={`flex-1 h-1 rounded-full ${s >= level ? (s <= 1 ? "bg-[#C13515]" : s <= 2 ? "bg-[#FFA726]" : "bg-[#4CAF50]") : "bg-[#eee]"}`} />; })}
                </div>
                <p className="text-[0.6875rem] text-[#aaa] mt-1">{(() => { const s = (password.length >= 6 ? 1 : 0) + (/[A-Z]/.test(password) ? 1 : 0) + (/[0-9]/.test(password) ? 1 : 0) + (password.length >= 10 ? 1 : 0); return s <= 1 ? "Weak" : s <= 2 ? "Fair" : s <= 3 ? "Good" : "Strong"; })()}</p>
              </div>
            )}
            <button onClick={handleCredentialsNext} className="w-full h-[52px] mt-5 rounded-2xl text-white text-[0.9375rem] transition hover:opacity-90 cursor-pointer flex items-center justify-center gap-2" style={{ fontWeight: 700, background: "#FF385C" }}>Next <ChevronRight className="w-4 h-4" /></button>
          </motion.div>
        )}
        {step === "profile" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="flex flex-col items-center mb-6">
              <div className="w-16 h-16 rounded-full bg-[#FFF3F0] flex items-center justify-center mb-3"><User className="w-7 h-7 text-[#FF385C]" /></div>
              <h2 className="text-[1.25rem] text-[#222]" style={{ fontWeight: 700 }}>Set up your profile</h2>
              <p className="text-[0.8125rem] text-[#888] mt-1">How should we call you?</p>
            </div>
            <InputField icon={User} type="text" placeholder="Display name" value={displayName} onChange={(v) => { setDisplayName(v); setFieldErrors({}); }} error={fieldErrors.displayName} />
            <button onClick={handleProfileNext} className="w-full h-[52px] mt-5 rounded-2xl text-white text-[0.9375rem] transition hover:opacity-90 cursor-pointer flex items-center justify-center gap-2" style={{ fontWeight: 700, background: "#FF385C" }}>Next <ChevronRight className="w-4 h-4" /></button>
          </motion.div>
        )}
        {step === "security" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="flex flex-col items-center mb-5">
              <div className="w-16 h-16 rounded-full bg-[#FFF3F0] flex items-center justify-center mb-3"><ShieldQuestion className="w-7 h-7 text-[#FF385C]" /></div>
              <h2 className="text-[1.25rem] text-[#222]" style={{ fontWeight: 700 }}>Password Recovery</h2>
              <p className="text-[0.8125rem] text-[#888] mt-1 text-center">Set up 3 security questions for password recovery</p>
            </div>
            <div className="space-y-4">
              {securityQA.map((qa, idx) => {
                const usedQs = securityQA.filter((_, j) => j !== idx).map(x => x.q);
                const availableQs = SECURITY_QUESTIONS.filter(q => !usedQs.includes(q) || q === qa.q);
                return (
                  <div key={idx}>
                    <label className="text-[0.75rem] text-[#999] mb-1 block" style={{ fontWeight: 500 }}>Question {idx + 1}</label>
                    <select value={qa.q} onChange={(e) => { const updated = [...securityQA]; updated[idx] = { ...updated[idx], q: e.target.value }; setSecurityQA(updated); setFeedback(null); }}
                      className="w-full h-[48px] px-4 rounded-2xl bg-[#f5f5f5] text-[0.875rem] text-[#222] outline-none focus:ring-2 focus:ring-[#FF385C]/30 transition appearance-none cursor-pointer mb-2">
                      {availableQs.map((q) => <option key={q} value={q}>{q}</option>)}
                    </select>
                    <InputField icon={ShieldQuestion} type="text" placeholder="Your answer" value={qa.a}
                      onChange={(v) => { const updated = [...securityQA]; updated[idx] = { ...updated[idx], a: v }; setSecurityQA(updated); setFieldErrors({}); }}
                      error={fieldErrors[`securityA${idx}`]} disabled={loading} />
                  </div>
                );
              })}
            </div>
            <button onClick={handleSecurityNext} disabled={loading} className="w-full h-[52px] mt-5 rounded-2xl text-white text-[0.9375rem] transition hover:opacity-90 cursor-pointer flex items-center justify-center gap-2 disabled:opacity-60" style={{ fontWeight: 700, background: "#FF385C" }}>
              {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <>Create Account <ChevronRight className="w-4 h-4" /></>}
            </button>
          </motion.div>
        )}
        {step === "done" && (
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center pt-8">
            <div className="w-20 h-20 rounded-full bg-[#E8F5E9] flex items-center justify-center mb-4"><CheckCircle2 className="w-10 h-10 text-[#4CAF50]" /></div>
            <h2 className="text-[1.25rem] text-[#222]" style={{ fontWeight: 700 }}>Welcome, {displayName}!</h2>
            <p className="text-[0.875rem] text-[#888] mt-2 text-center">Your account has been created successfully. Start discovering great restaurants!</p>
            <button onClick={onRegister} className="w-full h-[52px] mt-8 rounded-2xl text-white text-[0.9375rem] transition hover:opacity-90 cursor-pointer" style={{ fontWeight: 700, background: "#FF385C" }}>Get Started</button>
          </motion.div>
        )}
        {(step === "refer" || step === "credentials") && (
          <p className="text-center text-[0.8125rem] text-[#888] mt-8 pb-8">
            Already have an account?{" "}<button onClick={onGoLogin} className="text-[#FF385C] hover:underline cursor-pointer" style={{ fontWeight: 600 }}>Sign In</button>
          </p>
        )}
      </div>
    </motion.div>
  );
}

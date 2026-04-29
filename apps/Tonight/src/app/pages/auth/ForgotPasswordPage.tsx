/* Forgot Password Flow */
import { useState } from "react";
import React from "react";
import { motion, AnimatePresence } from "motion/react";
import { ArrowLeft, User, Lock, ShieldQuestion, KeyRound, CheckCircle2, X } from "lucide-react";
import { useNavigate } from "react-router";
import { InputField, FeedbackBanner, MOCK_USERS } from "./authHelpers";

type ForgotStep = "username" | "security" | "reset" | "done";

export function ForgotPasswordPage() {
  const navigate = useNavigate();
  const onBack = () => navigate("/auth/login");
  const [step, setStep] = useState<ForgotStep>("username");
  const [username, setUsername] = useState("");
  const [securityAnswer, setSecurityAnswer] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [feedback, setFeedback] = useState<{ type: "success" | "error" | "warning"; message: string } | null>(null);
  const [foundUser, setFoundUser] = useState<typeof MOCK_USERS[string] | null>(null);
  const [randomQIndex, setRandomQIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const handleFindAccount = () => {
    setFeedback(null); setFieldErrors({});
    if (!username.trim()) { setFieldErrors({ username: "Please enter your username" }); return; }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      const user = MOCK_USERS[username.toLowerCase()];
      if (!user) { setFeedback({ type: "error", message: "No account found with this username." }); return; }
      if (!user.active) { setFeedback({ type: "warning", message: "This account is deactivated. Contact support." }); return; }
      setFoundUser(user); setRandomQIndex(Math.floor(Math.random() * user.securityQA.length)); setStep("security");
    }, 600);
  };

  const handleVerifySecurity = () => {
    setFeedback(null);
    if (!securityAnswer.trim()) { setFieldErrors({ security: "Please answer the security question" }); return; }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      if (foundUser && securityAnswer.toLowerCase().trim() === foundUser.securityQA[randomQIndex].a) setStep("reset");
      else setFeedback({ type: "error", message: "Incorrect answer. Please try again." });
    }, 600);
  };

  const handleResetPassword = () => {
    setFeedback(null); setFieldErrors({});
    if (newPassword.length < 6) { setFieldErrors({ newPw: "Password must be at least 6 characters" }); return; }
    if (newPassword !== confirmPassword) { setFieldErrors({ confirmPw: "Passwords do not match" }); return; }
    setLoading(true); setTimeout(() => { setLoading(false); setStep("done"); }, 600);
  };

  return (
    <motion.div className="min-h-screen bg-white flex flex-col" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} transition={{ duration: 0.3 }}>
      <div className="flex items-center gap-3 px-4 pt-4 pb-2">
        <button onClick={onBack} className="p-2 rounded-full hover:bg-[#f5f5f5] cursor-pointer"><ArrowLeft className="w-5 h-5 text-[#222]" /></button>
        <span className="text-[1rem] text-[#222]" style={{ fontWeight: 600 }}>Forgot Password</span>
        <button onClick={() => navigate("/discover")} aria-label="Close" className="ml-auto p-2 rounded-full hover:bg-[#f5f5f5] cursor-pointer">
          <X className="w-5 h-5 text-[#666]" />
        </button>
      </div>
      <div className="flex-1 flex flex-col px-6 sm:px-8 max-w-md mx-auto w-full pt-6">
        <div className="flex items-center mb-8">
          {(["username", "security", "reset", "done"] as ForgotStep[]).map((s, i) => {
            const stepIdx = (["username", "security", "reset", "done"] as ForgotStep[]).indexOf(step);
            return (
              <React.Fragment key={s}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-[0.75rem] transition-all ${step === s ? "bg-[#FF385C] text-white" : stepIdx > i ? "bg-[#4CAF50] text-white" : "bg-[#f5f5f5] text-[#aaa]"}`} style={{ fontWeight: 600 }}>
                  {stepIdx > i ? <CheckCircle2 className="w-4 h-4" /> : i + 1}
                </div>
                {i < 3 && <div className={`flex-1 h-0.5 mx-2 ${stepIdx > i ? "bg-[#4CAF50]" : "bg-[#eee]"}`} />}
              </React.Fragment>
            );
          })}
        </div>
        <AnimatePresence>{feedback && <div className="mb-4"><FeedbackBanner type={feedback.type} message={feedback.message} onDismiss={() => setFeedback(null)} /></div>}</AnimatePresence>
        {step === "username" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="flex flex-col items-center mb-6">
              <div className="w-16 h-16 rounded-full bg-[#FFF3F0] flex items-center justify-center mb-3"><User className="w-7 h-7 text-[#FF385C]" /></div>
              <h2 className="text-[1.25rem] text-[#222]" style={{ fontWeight: 700 }}>Find your account</h2>
              <p className="text-[0.8125rem] text-[#888] mt-1 text-center">Enter your username to recover your password</p>
            </div>
            <InputField icon={User} type="text" placeholder="Username" value={username} onChange={(v) => { setUsername(v); setFieldErrors({}); setFeedback(null); }} error={fieldErrors.username} disabled={loading} />
            <button onClick={handleFindAccount} disabled={loading} className="w-full h-[52px] mt-5 rounded-2xl text-white text-[0.9375rem] transition hover:opacity-90 cursor-pointer flex items-center justify-center disabled:opacity-60" style={{ fontWeight: 700, background: "#FF385C" }}>
              {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : "Find Account"}
            </button>
            <div className="mt-4 p-3 rounded-xl bg-[#f5f5f5] text-[0.75rem] text-[#888]">
              <p style={{ fontWeight: 600 }} className="text-[#666] mb-1">Test accounts:</p>
              <p><span className="text-[#222]" style={{ fontWeight: 500 }}>catchtable</span> — answers: fluffy, seoul, pizza</p>
              <p className="mt-0.5"><span className="text-[#222]" style={{ fontWeight: 500 }}>foodie99</span> — answers: pizza, buddy, foodster</p>
            </div>
          </motion.div>
        )}
        {step === "security" && foundUser && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="flex flex-col items-center mb-6">
              <div className="w-16 h-16 rounded-full bg-[#FFF3F0] flex items-center justify-center mb-3"><ShieldQuestion className="w-7 h-7 text-[#FF385C]" /></div>
              <h2 className="text-[1.25rem] text-[#222]" style={{ fontWeight: 700 }}>Security Question</h2>
              <p className="text-[0.8125rem] text-[#888] mt-1 text-center">Answer your security question to verify identity</p>
            </div>
            <div className="p-3 rounded-xl bg-[#f5f5f5] mb-3 text-[0.875rem] text-[#444]" style={{ fontWeight: 500 }}>{foundUser.securityQA[randomQIndex].q}</div>
            <InputField icon={ShieldQuestion} type="text" placeholder="Your answer" value={securityAnswer} onChange={(v) => { setSecurityAnswer(v); setFieldErrors({}); setFeedback(null); }} error={fieldErrors.security} disabled={loading} />
            <button onClick={handleVerifySecurity} disabled={loading} className="w-full h-[52px] mt-5 rounded-2xl text-white text-[0.9375rem] transition hover:opacity-90 cursor-pointer flex items-center justify-center disabled:opacity-60" style={{ fontWeight: 700, background: "#FF385C" }}>
              {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : "Verify"}
            </button>
          </motion.div>
        )}
        {step === "reset" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="flex flex-col items-center mb-6">
              <div className="w-16 h-16 rounded-full bg-[#FFF3F0] flex items-center justify-center mb-3"><KeyRound className="w-7 h-7 text-[#FF385C]" /></div>
              <h2 className="text-[1.25rem] text-[#222]" style={{ fontWeight: 700 }}>Set New Password</h2>
              <p className="text-[0.8125rem] text-[#888] mt-1 text-center">Create a strong password for your account</p>
            </div>
            <div className="space-y-3">
              <InputField icon={Lock} type="password" placeholder="New password" value={newPassword} onChange={(v) => { setNewPassword(v); setFieldErrors({}); }} error={fieldErrors.newPw} disabled={loading} />
              <InputField icon={Lock} type="password" placeholder="Confirm new password" value={confirmPassword} onChange={(v) => { setConfirmPassword(v); setFieldErrors({}); }} error={fieldErrors.confirmPw} disabled={loading} />
            </div>
            <button onClick={handleResetPassword} disabled={loading} className="w-full h-[52px] mt-5 rounded-2xl text-white text-[0.9375rem] transition hover:opacity-90 cursor-pointer flex items-center justify-center disabled:opacity-60" style={{ fontWeight: 700, background: "#FF385C" }}>
              {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : "Reset Password"}
            </button>
          </motion.div>
        )}
        {step === "done" && (
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center pt-8">
            <div className="w-20 h-20 rounded-full bg-[#E8F5E9] flex items-center justify-center mb-4"><CheckCircle2 className="w-10 h-10 text-[#4CAF50]" /></div>
            <h2 className="text-[1.25rem] text-[#222]" style={{ fontWeight: 700 }}>Password Reset!</h2>
            <p className="text-[0.875rem] text-[#888] mt-2 text-center">Your password has been successfully updated. You can now sign in with your new password.</p>
            <button onClick={onBack} className="w-full h-[52px] mt-8 rounded-2xl text-white text-[0.9375rem] transition hover:opacity-90 cursor-pointer" style={{ fontWeight: 700, background: "#FF385C" }}>Back to Sign In</button>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}

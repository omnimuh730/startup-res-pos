/* Login Page */
import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Lock, User, X } from "lucide-react";
import { useNavigate, useLocation } from "react-router";
import { Logo, InputField, FeedbackBanner, MOCK_USERS } from "./authHelpers";
import { authStore } from "../../stores/authStore";

export function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as { from?: string } | null)?.from || "/discover";
  const onLogin = () => { authStore.setAuthed(true); navigate(from, { replace: true }); };
  const onGoRegister = () => navigate("/auth/register");
  const onForgotPassword = () => navigate("/auth/forgot");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState<{ type: "success" | "error" | "warning"; message: string } | null>(null);
  const [fieldErrors, setFieldErrors] = useState<{ username?: string; password?: string }>({});

  const handleLogin = () => {
    setFeedback(null); setFieldErrors({});
    if (!username.trim()) { setFieldErrors({ username: "Username is required" }); return; }
    if (!password) { setFieldErrors({ password: "Password is required" }); return; }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      const user = MOCK_USERS[username.toLowerCase()];
      if (!user) { setFeedback({ type: "error", message: "Account not found. Please check your username or sign up." }); setFieldErrors({ username: "Username not found" }); return; }
      if (!user.active) { setFeedback({ type: "warning", message: "This account has been deactivated. Please contact support for assistance." }); return; }
      if (user.password !== password) { setFeedback({ type: "error", message: "Incorrect password. Please try again or reset your password." }); setFieldErrors({ password: "Incorrect password" }); return; }
      setFeedback({ type: "success", message: `Welcome back, ${user.name}! Signing you in...` });
      setTimeout(() => onLogin(), 1200);
    }, 800);
  };

  return (
    <motion.div className="min-h-screen bg-white flex flex-col relative" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} transition={{ duration: 0.3 }}>
      <button onClick={() => navigate("/discover")} aria-label="Close" className="absolute top-4 right-4 w-10 h-10 rounded-full hover:bg-[#f3f3f3] flex items-center justify-center cursor-pointer transition z-10">
        <X className="w-5 h-5 text-[#666]" />
      </button>
      <div className="flex-1 flex flex-col justify-center px-6 sm:px-8 max-w-md mx-auto w-full">
        <div className="flex flex-col items-center mb-10">
          <Logo />
          <h1 className="mt-4 text-[1.5rem] text-[#222]" style={{ fontWeight: 800 }}>Welcome back</h1>
          <p className="text-[0.875rem] text-[#888] mt-1">Sign in to your CatchTable account</p>
        </div>
        <AnimatePresence>
          {feedback && <div className="mb-4"><FeedbackBanner type={feedback.type} message={feedback.message} onDismiss={() => setFeedback(null)} /></div>}
        </AnimatePresence>
        <div className="space-y-3">
          <InputField icon={User} type="text" placeholder="Username" value={username} onChange={(v) => { setUsername(v); setFieldErrors({}); setFeedback(null); }} error={fieldErrors.username} disabled={loading} />
          <InputField icon={Lock} type="password" placeholder="Password" value={password} onChange={(v) => { setPassword(v); setFieldErrors({}); setFeedback(null); }} error={fieldErrors.password} disabled={loading} />
        </div>
        <div className="flex justify-end mt-2">
          <button onClick={onForgotPassword} className="text-[0.8125rem] text-[#FF385C] hover:underline cursor-pointer" style={{ fontWeight: 500 }}>Forgot password?</button>
        </div>
        <button onClick={handleLogin} disabled={loading} className="w-full h-[52px] mt-6 rounded-2xl text-white text-[0.9375rem] transition hover:opacity-90 cursor-pointer flex items-center justify-center gap-2 disabled:opacity-60" style={{ fontWeight: 700, background: "#FF385C" }}>
          {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : "Sign In"}
        </button>
        <div className="mt-4 p-3 rounded-xl bg-[#f5f5f5] text-[0.75rem] text-[#888]">
          <p style={{ fontWeight: 600 }} className="text-[#666] mb-1">Demo credentials:</p>
          <p>Username: <span className="text-[#222]" style={{ fontWeight: 500 }}>catchtable</span> / Password: <span className="text-[#222]" style={{ fontWeight: 500 }}>Pass1234</span></p>
          <p className="mt-0.5 text-[#aaa]">Try "admin" for deactivated, wrong password for error</p>
        </div>
        <p className="text-center text-[0.8125rem] text-[#888] mt-8">
          Don't have an account?{" "}
          <button onClick={onGoRegister} className="text-[#FF385C] hover:underline cursor-pointer" style={{ fontWeight: 600 }}>Sign Up</button>
        </p>
      </div>
    </motion.div>
  );
}

/* Login Page */
import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Lock, Sparkles, User, X } from "lucide-react";
import { useLocation, useNavigate } from "react-router";
import { AuthHero, AuthSurface, FeedbackBanner, InputField, Logo, MOCK_USERS } from "./authHelpers";
import { authStore } from "../../stores/authStore";

interface LoginPageProps {
  onLogin?: () => void;
  onGoRegister?: () => void;
  onForgotPassword?: () => void;
}

export function LoginPage(props: LoginPageProps = {}) {
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as { from?: string } | null)?.from || "/discover";
  const onLogin = () => {
    authStore.setAuthed(true);
    if (props.onLogin) props.onLogin();
    else navigate(from, { replace: true });
  };
  const onGoRegister = () => props.onGoRegister?.() ?? navigate("/auth/register");
  const onForgotPassword = () => props.onForgotPassword?.() ?? navigate("/auth/forgot");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState<{ type: "success" | "error" | "warning"; message: string } | null>(null);
  const [fieldErrors, setFieldErrors] = useState<{ username?: string; password?: string }>({});

  const handleLogin = () => {
    setFeedback(null);
    setFieldErrors({});
    if (!username.trim()) {
      setFieldErrors({ username: "Username is required" });
      return;
    }
    if (!password) {
      setFieldErrors({ password: "Password is required" });
      return;
    }
    setLoading(true);
    window.setTimeout(() => {
      setLoading(false);
      const user = MOCK_USERS[username.toLowerCase()];
      if (!user) {
        setFeedback({ type: "error", message: "Account not found. Check your username or sign up." });
        setFieldErrors({ username: "Username not found" });
        return;
      }
      if (!user.active) {
        setFeedback({ type: "warning", message: "This account has been deactivated. Please contact support." });
        return;
      }
      if (user.password !== password) {
        setFeedback({ type: "error", message: "Incorrect password. Please try again or reset it." });
        setFieldErrors({ password: "Incorrect password" });
        return;
      }
      setFeedback({ type: "success", message: `Welcome back, ${user.name}. Signing you in...` });
      window.setTimeout(onLogin, 900);
    }, 650);
  };

  return (
    <AuthSurface>
      <div className="mb-4 flex items-center justify-between">
        <Logo compact />
        <button
          type="button"
          onClick={() => navigate("/discover")}
          aria-label="Close"
          className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-secondary text-foreground transition active:scale-95"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      <div className="flex flex-1 flex-col justify-center">
        <AuthHero title="Welcome back" subtitle="Sign in to keep your reservations, rewards, and favorite dining spots close." />

        <AnimatePresence>
          {feedback && (
            <div className="mb-4">
              <FeedbackBanner type={feedback.type} message={feedback.message} onDismiss={() => setFeedback(null)} />
            </div>
          )}
        </AnimatePresence>

        <div className="space-y-3">
          <InputField icon={User} type="text" placeholder="Username" value={username} onChange={(value) => { setUsername(value); setFieldErrors({}); setFeedback(null); }} error={fieldErrors.username} disabled={loading} />
          <InputField icon={Lock} type="password" placeholder="Password" value={password} onChange={(value) => { setPassword(value); setFieldErrors({}); setFeedback(null); }} error={fieldErrors.password} disabled={loading} />
        </div>

        <div className="mt-2 flex justify-end">
          <button type="button" onClick={onForgotPassword} className="cursor-pointer text-[0.8125rem] text-primary transition hover:opacity-75" style={{ fontWeight: 800 }}>
            Forgot password?
          </button>
        </div>

        <motion.button
          type="button"
          whileTap={{ scale: 0.985 }}
          onClick={handleLogin}
          disabled={loading}
          className="mt-6 flex h-12 w-full cursor-pointer items-center justify-center gap-2 rounded-full bg-primary text-[0.9375rem] text-primary-foreground shadow-[0_10px_24px_rgba(255,56,92,0.22)] transition disabled:cursor-not-allowed disabled:opacity-60"
          style={{ fontWeight: 900 }}
        >
          {loading ? <span className="h-5 w-5 rounded-full border-2 border-white/35 border-t-white animate-spin" /> : "Sign in"}
        </motion.button>

        <div className="mt-4 rounded-[1.35rem] border border-border bg-secondary/55 p-3">
          <div className="mb-1 flex items-center gap-1.5">
            <Sparkles className="h-3.5 w-3.5 text-primary" />
            <p className="text-[0.75rem] text-foreground" style={{ fontWeight: 900 }}>Demo access</p>
          </div>
          <p className="text-[0.75rem] leading-snug text-muted-foreground">
            Username <span className="text-foreground" style={{ fontWeight: 800 }}>catchtable</span> / Password <span className="text-foreground" style={{ fontWeight: 800 }}>Pass1234</span>
          </p>
        </div>

        <p className="mt-8 text-center text-[0.8125rem] text-muted-foreground">
          New to Tonight?{" "}
          <button type="button" onClick={onGoRegister} className="cursor-pointer text-primary" style={{ fontWeight: 900 }}>
            Create account
          </button>
        </p>
      </div>
    </AuthSurface>
  );
}

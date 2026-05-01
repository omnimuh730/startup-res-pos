/* Forgot Password Flow */
import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ArrowLeft, CheckCircle2, KeyRound, Lock, ShieldQuestion, User, X } from "lucide-react";
import { useNavigate } from "react-router";
import { AuthHero, AuthProgress, AuthSurface, FeedbackBanner, IconBadge, InputField, MOCK_USERS } from "./authHelpers";

type ForgotStep = "username" | "security" | "reset" | "done";

interface ForgotPasswordPageProps {
  onBack?: () => void;
}

const STEPS: ForgotStep[] = ["username", "security", "reset", "done"];
const STEP_LABELS = ["Account", "Verify", "Reset", "Done"];

export function ForgotPasswordPage({ onBack: onBackProp }: ForgotPasswordPageProps = {}) {
  const navigate = useNavigate();
  const onBack = () => onBackProp?.() ?? navigate("/auth/login");
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

  const stepIndex = STEPS.indexOf(step);

  const handleFindAccount = () => {
    setFeedback(null);
    setFieldErrors({});
    if (!username.trim()) {
      setFieldErrors({ username: "Please enter your username" });
      return;
    }
    setLoading(true);
    window.setTimeout(() => {
      setLoading(false);
      const user = MOCK_USERS[username.toLowerCase()];
      if (!user) {
        setFeedback({ type: "error", message: "No account found with this username." });
        return;
      }
      if (!user.active) {
        setFeedback({ type: "warning", message: "This account is deactivated. Contact support." });
        return;
      }
      setFoundUser(user);
      setRandomQIndex(Math.floor(Math.random() * user.securityQA.length));
      setStep("security");
    }, 550);
  };

  const handleVerifySecurity = () => {
    setFeedback(null);
    setFieldErrors({});
    if (!securityAnswer.trim()) {
      setFieldErrors({ security: "Please answer the security question" });
      return;
    }
    setLoading(true);
    window.setTimeout(() => {
      setLoading(false);
      if (foundUser && securityAnswer.toLowerCase().trim() === foundUser.securityQA[randomQIndex].a) {
        setStep("reset");
      } else {
        setFeedback({ type: "error", message: "Incorrect answer. Please try again." });
      }
    }, 550);
  };

  const handleResetPassword = () => {
    setFeedback(null);
    setFieldErrors({});
    if (newPassword.length < 6) {
      setFieldErrors({ newPw: "Password must be at least 6 characters" });
      return;
    }
    if (newPassword !== confirmPassword) {
      setFieldErrors({ confirmPw: "Passwords do not match" });
      return;
    }
    setLoading(true);
    window.setTimeout(() => {
      setLoading(false);
      setStep("done");
    }, 550);
  };

  const goBack = () => {
    if (step === "username" || step === "done") onBack();
    else if (step === "security") setStep("username");
    else if (step === "reset") setStep("security");
  };

  return (
    <AuthSurface>
      <div className="mb-5 flex items-center gap-3">
        <button type="button" onClick={goBack} className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-secondary transition active:scale-95" aria-label="Back">
          <ArrowLeft className="h-5 w-5" />
        </button>
        <div className="min-w-0 flex-1">
          <p className="truncate text-[0.9375rem] font-medium">Password recovery</p>
          <p className="truncate text-[0.75rem] text-muted-foreground">Secure account reset</p>
        </div>
        <button type="button" onClick={() => navigate("/discover")} className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-secondary transition active:scale-95" aria-label="Close">
          <X className="h-5 w-5" />
        </button>
      </div>

      <AuthProgress labels={STEP_LABELS} activeIndex={stepIndex} />

      <AnimatePresence>
        {feedback && (
          <div className="mb-4">
            <FeedbackBanner type={feedback.type} message={feedback.message} onDismiss={() => setFeedback(null)} />
          </div>
        )}
      </AnimatePresence>

      {step === "username" && (
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
          <AuthHero
            icon={<IconBadge><User className="h-7 w-7" /></IconBadge>}
            title="Find your account"
            subtitle="Enter your username and we will confirm your recovery questions."
          />
          <InputField icon={User} type="text" placeholder="Username" value={username} onChange={(value) => { setUsername(value); setFieldErrors({}); setFeedback(null); }} error={fieldErrors.username} disabled={loading} />
          <button type="button" onClick={handleFindAccount} disabled={loading} className="mt-5 flex h-12 w-full cursor-pointer items-center justify-center rounded-full bg-primary text-[0.9375rem] font-medium text-primary-foreground shadow-[0_10px_24px_rgba(255,56,92,0.22)] disabled:opacity-60">
            {loading ? <span className="h-5 w-5 rounded-full border-2 border-white/35 border-t-white animate-spin" /> : "Find account"}
          </button>
          <div className="mt-4 rounded-[1.25rem] bg-secondary/60 p-3 text-[0.75rem] leading-snug text-muted-foreground">
            Test accounts: <span className="font-medium">catchtable</span> answers with fluffy, seoul, or pizza.
          </div>
        </motion.div>
      )}

      {step === "security" && foundUser && (
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
          <AuthHero
            icon={<IconBadge><ShieldQuestion className="h-7 w-7" /></IconBadge>}
            title="Verify identity"
            subtitle="Answer the security question attached to your account."
          />
          <div className="mb-3 rounded-[1.25rem] border border-primary/20 bg-primary/8 p-4">
            <p className="text-[0.875rem] font-medium leading-snug">
              {foundUser.securityQA[randomQIndex].q}
            </p>
          </div>
          <InputField icon={ShieldQuestion} type="text" placeholder="Your answer" value={securityAnswer} onChange={(value) => { setSecurityAnswer(value); setFieldErrors({}); setFeedback(null); }} error={fieldErrors.security} disabled={loading} />
          <button type="button" onClick={handleVerifySecurity} disabled={loading} className="mt-5 flex h-12 w-full cursor-pointer items-center justify-center rounded-full bg-primary text-[0.9375rem] font-medium text-primary-foreground shadow-[0_10px_24px_rgba(255,56,92,0.22)] disabled:opacity-60">
            {loading ? <span className="h-5 w-5 rounded-full border-2 border-white/35 border-t-white animate-spin" /> : "Verify"}
          </button>
        </motion.div>
      )}

      {step === "reset" && (
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
          <AuthHero
            icon={<IconBadge><KeyRound className="h-7 w-7" /></IconBadge>}
            title="Set new password"
            subtitle="Choose a new password for your Tonight account."
          />
          <div className="space-y-3">
            <InputField icon={Lock} type="password" placeholder="New password" value={newPassword} onChange={(value) => { setNewPassword(value); setFieldErrors({}); }} error={fieldErrors.newPw} disabled={loading} />
            <InputField icon={Lock} type="password" placeholder="Confirm new password" value={confirmPassword} onChange={(value) => { setConfirmPassword(value); setFieldErrors({}); }} error={fieldErrors.confirmPw} disabled={loading} />
          </div>
          <button type="button" onClick={handleResetPassword} disabled={loading} className="mt-5 flex h-12 w-full cursor-pointer items-center justify-center rounded-full bg-primary text-[0.9375rem] font-medium text-primary-foreground shadow-[0_10px_24px_rgba(255,56,92,0.22)] disabled:opacity-60">
            {loading ? <span className="h-5 w-5 rounded-full border-2 border-white/35 border-t-white animate-spin" /> : "Reset password"}
          </button>
        </motion.div>
      )}

      {step === "done" && (
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-1 flex-col items-center justify-center text-center">
          <IconBadge tone="success"><CheckCircle2 className="h-8 w-8" /></IconBadge>
          <h2 className="mt-5 text-[1.5rem] font-semibold">Password reset</h2>
          <p className="mt-2 max-w-xs text-[0.875rem] leading-snug text-muted-foreground">You can now sign in with your updated password.</p>
          <button type="button" onClick={onBack} className="mt-8 flex h-12 w-full cursor-pointer items-center justify-center rounded-full bg-primary text-[0.9375rem] font-medium text-primary-foreground shadow-[0_10px_24px_rgba(255,56,92,0.22)]">
            Back to sign in
          </button>
        </motion.div>
      )}
    </AuthSurface>
  );
}

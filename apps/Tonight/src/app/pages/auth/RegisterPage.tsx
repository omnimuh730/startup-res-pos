/* Register (Onboarding) Flow */
import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ArrowLeft, CheckCircle2, ChevronRight, Gift, Lock, QrCode, ShieldQuestion, User, X } from "lucide-react";
import { useNavigate } from "react-router";
import { AuthHero, AuthProgress, AuthSurface, FeedbackBanner, IconBadge, InputField, Logo, MOCK_USERS, SECURITY_QUESTIONS } from "./authHelpers";
import { authStore } from "../../stores/authStore";

type SignUpStep = "refer" | "credentials" | "profile" | "security" | "done";

interface RegisterPageProps {
  onRegister?: () => void;
  onGoLogin?: () => void;
}

const STEPS: SignUpStep[] = ["refer", "credentials", "profile", "security", "done"];
const STEP_LABELS = ["Invite", "Account", "Profile", "Secure", "Done"];

export function RegisterPage(props: RegisterPageProps = {}) {
  const navigate = useNavigate();
  const onRegister = () => {
    authStore.setAuthed(true);
    if (props.onRegister) props.onRegister();
    else navigate("/discover", { replace: true });
  };
  const onGoLogin = () => props.onGoLogin?.() ?? navigate("/auth/login");
  const [step, setStep] = useState<SignUpStep>("refer");
  const [referCode, setReferCode] = useState("");
  const [showScanner, setShowScanner] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [securityQA, setSecurityQA] = useState<{ q: string; a: string }[]>([
    { q: SECURITY_QUESTIONS[0], a: "" },
    { q: SECURITY_QUESTIONS[1], a: "" },
    { q: SECURITY_QUESTIONS[2], a: "" },
  ]);
  const [feedback, setFeedback] = useState<{ type: "success" | "error" | "warning"; message: string } | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const stepIndex = STEPS.indexOf(step);

  const handleCredentialsNext = () => {
    setFeedback(null);
    setFieldErrors({});
    if (!username.trim()) {
      setFieldErrors({ username: "Username is required" });
      return;
    }
    if (username.trim().length < 3) {
      setFieldErrors({ username: "Username must be at least 3 characters" });
      return;
    }
    if (/\s/.test(username)) {
      setFieldErrors({ username: "Username cannot contain spaces" });
      return;
    }
    if (MOCK_USERS[username.toLowerCase()]) {
      setFeedback({ type: "error", message: "This username is already taken." });
      setFieldErrors({ username: "Username already exists" });
      return;
    }
    if (password.length < 6) {
      setFieldErrors({ password: "Password must be at least 6 characters" });
      return;
    }
    if (!/[A-Z]/.test(password) || !/[0-9]/.test(password)) {
      setFieldErrors({ password: "Use at least 1 uppercase letter and 1 number" });
      return;
    }
    if (password !== confirmPassword) {
      setFieldErrors({ confirmPassword: "Passwords do not match" });
      return;
    }
    setStep("profile");
  };

  const handleProfileNext = () => {
    setFeedback(null);
    setFieldErrors({});
    if (!displayName.trim()) {
      setFieldErrors({ displayName: "Display name is required" });
      return;
    }
    if (displayName.trim().length < 2) {
      setFieldErrors({ displayName: "Name must be at least 2 characters" });
      return;
    }
    setStep("security");
  };

  const handleSecurityNext = () => {
    setFeedback(null);
    setFieldErrors({});
    const errors: Record<string, string> = {};
    securityQA.forEach((qa, index) => {
      if (!qa.a.trim()) errors[`securityA${index}`] = "Please provide an answer";
    });
    const questions = securityQA.map((qa) => qa.q);
    if (new Set(questions).size !== questions.length) {
      setFeedback({ type: "error", message: "Each security question must be different." });
      return;
    }
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }
    setLoading(true);
    window.setTimeout(() => {
      setLoading(false);
      setStep("done");
    }, 700);
  };

  const goBack = () => {
    if (step === "refer" || step === "done") onGoLogin();
    else if (step === "credentials") setStep("refer");
    else if (step === "profile") setStep("credentials");
    else if (step === "security") setStep("profile");
  };

  const strength = (password.length >= 6 ? 1 : 0) + (/[A-Z]/.test(password) ? 1 : 0) + (/[0-9]/.test(password) ? 1 : 0) + (password.length >= 10 ? 1 : 0);
  const strengthLabel = strength <= 1 ? "Weak" : strength <= 2 ? "Fair" : strength <= 3 ? "Good" : "Strong";

  return (
    <AuthSurface>
      <div className="mb-5 flex items-center gap-3">
        <button type="button" onClick={goBack} className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-secondary transition active:scale-95" aria-label="Back">
          <ArrowLeft className="h-5 w-5" />
        </button>
        <div className="min-w-0 flex-1">
          <p className="truncate text-[0.9375rem] text-foreground" style={{ fontWeight: 900 }}>Create account</p>
          <p className="truncate text-[0.75rem] text-muted-foreground">Join Tonight dining</p>
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

      {step === "refer" && (
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
          <AuthHero
            icon={<IconBadge><Gift className="h-7 w-7" /></IconBadge>}
            title="Have an invite?"
            subtitle="Enter a referral code or scan a friend's QR. You can also skip this."
          />
          {!showScanner ? (
            <>
              <InputField icon={Gift} type="text" placeholder="Referral code (optional)" value={referCode} onChange={(value) => setReferCode(value.toUpperCase().replace(/\s/g, ""))} />
              <button type="button" onClick={() => setShowScanner(true)} className="mt-3 flex h-12 w-full cursor-pointer items-center justify-center gap-2 rounded-full border border-border bg-card text-[0.9375rem] transition hover:bg-secondary" style={{ fontWeight: 900 }}>
                <QrCode className="h-4 w-4" />
                Scan QR code
              </button>
            </>
          ) : (
            <div className="rounded-[1.75rem] border border-border bg-secondary/60 p-5 text-center">
              <div className="relative mx-auto mb-3 flex h-48 w-48 items-center justify-center overflow-hidden rounded-[1.5rem] border border-dashed border-primary bg-card">
                <QrCode className="h-24 w-24 text-muted-foreground/45" />
                <motion.div className="absolute left-6 right-6 h-0.5 rounded-full bg-primary" animate={{ top: ["15%", "85%", "15%"] }} transition={{ duration: 2, repeat: Infinity, ease: "linear" }} />
              </div>
              <p className="text-[0.8125rem] text-muted-foreground">Point your camera at a referral QR.</p>
              <button type="button" onClick={() => { setReferCode(`FRIEND-${Math.random().toString(36).slice(2, 7).toUpperCase()}`); setShowScanner(false); }} className="mt-3 cursor-pointer text-[0.8125rem] text-primary" style={{ fontWeight: 900 }}>
                Simulate scan
              </button>
              <button type="button" onClick={() => setShowScanner(false)} className="mt-2 block w-full cursor-pointer text-[0.75rem] text-muted-foreground">
                Cancel
              </button>
            </div>
          )}
          <button type="button" onClick={() => setStep("credentials")} className="mt-5 flex h-12 w-full cursor-pointer items-center justify-center gap-2 rounded-full bg-primary text-[0.9375rem] text-primary-foreground shadow-[0_10px_24px_rgba(255,56,92,0.22)]" style={{ fontWeight: 900 }}>
            {referCode ? "Apply and continue" : "Continue"}
            <ChevronRight className="h-4 w-4" />
          </button>
          <button type="button" onClick={() => { setReferCode(""); setStep("credentials"); }} className="mt-2 h-11 w-full cursor-pointer text-[0.875rem] text-muted-foreground" style={{ fontWeight: 800 }}>
            Skip for now
          </button>
        </motion.div>
      )}

      {step === "credentials" && (
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
          <AuthHero icon={<Logo />} title="Choose credentials" subtitle="Create a username and a password strong enough for reservation security." />
          <div className="space-y-3">
            <InputField icon={User} type="text" placeholder="Username" value={username} onChange={(value) => { setUsername(value.replace(/\s/g, "")); setFieldErrors({}); setFeedback(null); }} error={fieldErrors.username} />
            <InputField icon={Lock} type="password" placeholder="Password" value={password} onChange={(value) => { setPassword(value); setFieldErrors({}); }} error={fieldErrors.password} />
            <InputField icon={Lock} type="password" placeholder="Confirm password" value={confirmPassword} onChange={(value) => { setConfirmPassword(value); setFieldErrors({}); }} error={fieldErrors.confirmPassword} />
          </div>
          {password.length > 0 && (
            <div className="mt-3">
              <div className="flex gap-1">
                {[1, 2, 3, 4].map((level) => (
                  <div key={level} className={`h-1 flex-1 rounded-full ${strength >= level ? (strength <= 1 ? "bg-destructive" : strength <= 2 ? "bg-warning" : "bg-success") : "bg-border"}`} />
                ))}
              </div>
              <p className="mt-1 text-[0.6875rem] text-muted-foreground">{strengthLabel}</p>
            </div>
          )}
          <button type="button" onClick={handleCredentialsNext} className="mt-5 flex h-12 w-full cursor-pointer items-center justify-center gap-2 rounded-full bg-primary text-[0.9375rem] text-primary-foreground shadow-[0_10px_24px_rgba(255,56,92,0.22)]" style={{ fontWeight: 900 }}>
            Next
            <ChevronRight className="h-4 w-4" />
          </button>
        </motion.div>
      )}

      {step === "profile" && (
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
          <AuthHero
            icon={<IconBadge><User className="h-7 w-7" /></IconBadge>}
            title="Set up profile"
            subtitle="Tell us what to call you on reservations and invites."
          />
          <InputField icon={User} type="text" placeholder="Display name" value={displayName} onChange={(value) => { setDisplayName(value); setFieldErrors({}); }} error={fieldErrors.displayName} />
          <button type="button" onClick={handleProfileNext} className="mt-5 flex h-12 w-full cursor-pointer items-center justify-center gap-2 rounded-full bg-primary text-[0.9375rem] text-primary-foreground shadow-[0_10px_24px_rgba(255,56,92,0.22)]" style={{ fontWeight: 900 }}>
            Next
            <ChevronRight className="h-4 w-4" />
          </button>
        </motion.div>
      )}

      {step === "security" && (
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
          <AuthHero
            icon={<IconBadge><ShieldQuestion className="h-7 w-7" /></IconBadge>}
            title="Recovery setup"
            subtitle="Pick three questions so you can safely recover your account."
          />
          <div className="space-y-4">
            {securityQA.map((qa, index) => {
              const usedQuestions = securityQA.filter((_, otherIndex) => otherIndex !== index).map((item) => item.q);
              const availableQuestions = SECURITY_QUESTIONS.filter((question) => !usedQuestions.includes(question) || question === qa.q);
              return (
                <div key={index} className="rounded-[1.35rem] border border-border bg-card p-3">
                  <label className="mb-2 block text-[0.75rem] text-muted-foreground" style={{ fontWeight: 900 }}>
                    Question {index + 1}
                  </label>
                  <select
                    value={qa.q}
                    onChange={(event) => {
                      const updated = [...securityQA];
                      updated[index] = { ...updated[index], q: event.target.value };
                      setSecurityQA(updated);
                      setFeedback(null);
                    }}
                    className="mb-2 h-11 w-full cursor-pointer appearance-none rounded-full bg-secondary px-4 text-[0.8125rem] text-foreground outline-none focus:ring-2 focus:ring-primary/15"
                  >
                    {availableQuestions.map((question) => <option key={question} value={question}>{question}</option>)}
                  </select>
                  <InputField
                    icon={ShieldQuestion}
                    type="text"
                    placeholder="Your answer"
                    value={qa.a}
                    onChange={(value) => {
                      const updated = [...securityQA];
                      updated[index] = { ...updated[index], a: value };
                      setSecurityQA(updated);
                      setFieldErrors({});
                    }}
                    error={fieldErrors[`securityA${index}`]}
                    disabled={loading}
                  />
                </div>
              );
            })}
          </div>
          <button type="button" onClick={handleSecurityNext} disabled={loading} className="mt-5 flex h-12 w-full cursor-pointer items-center justify-center gap-2 rounded-full bg-primary text-[0.9375rem] text-primary-foreground shadow-[0_10px_24px_rgba(255,56,92,0.22)] disabled:opacity-60" style={{ fontWeight: 900 }}>
            {loading ? <span className="h-5 w-5 rounded-full border-2 border-white/35 border-t-white animate-spin" /> : <>Create account <ChevronRight className="h-4 w-4" /></>}
          </button>
        </motion.div>
      )}

      {step === "done" && (
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-1 flex-col items-center justify-center text-center">
          <IconBadge tone="success"><CheckCircle2 className="h-8 w-8" /></IconBadge>
          <h2 className="mt-5 text-[1.5rem] text-foreground" style={{ fontWeight: 900 }}>Welcome, {displayName}</h2>
          <p className="mt-2 max-w-xs text-[0.875rem] leading-snug text-muted-foreground">Your account is ready. Start discovering memorable restaurants tonight.</p>
          <button type="button" onClick={onRegister} className="mt-8 flex h-12 w-full cursor-pointer items-center justify-center rounded-full bg-primary text-[0.9375rem] text-primary-foreground shadow-[0_10px_24px_rgba(255,56,92,0.22)]" style={{ fontWeight: 900 }}>
            Get started
          </button>
        </motion.div>
      )}

      {(step === "refer" || step === "credentials") && (
        <p className="mt-8 pb-4 text-center text-[0.8125rem] text-muted-foreground">
          Already have an account?{" "}
          <button type="button" onClick={onGoLogin} className="cursor-pointer text-primary" style={{ fontWeight: 900 }}>
            Sign in
          </button>
        </p>
      )}
    </AuthSurface>
  );
}

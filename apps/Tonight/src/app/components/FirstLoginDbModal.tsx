import { useEffect, useRef, useState, useSyncExternalStore, type ReactNode } from "react";
import { AnimatePresence, motion } from "motion/react";
import {
  BadgeCheck,
  CalendarCheck2,
  Check,
  Clock3,
  Database,
  RefreshCw,
  ShieldCheck,
  Sparkles,
  WalletCards,
  X,
} from "lucide-react";
import { Button } from "./ds/Button";
import { useToast } from "./ds/Toast";
import { authStore } from "../stores/authStore";
import { TonightLogoBadge } from "../utils/brand/TonightLogo";

const CURRENT_VERSION = "2026.04.27";
const SYNC_DURATION_MS = 5200;

type Stage = "ask" | "updating" | "done";

const STEPS = [
  "Connecting to Tonight",
  "Updating restaurant catalog",
  "Syncing reservations and wallet",
  "Refreshing recommendations",
  "Finalizing local cache",
];

const RELEASE_NOTES = [
  { icon: <Database className="h-4 w-4" />, title: "Faster restaurant search", detail: "Fresh catalog indexes for nearby dining." },
  { icon: <CalendarCheck2 className="h-4 w-4" />, title: "Better booking accuracy", detail: "Availability and reservation states stay current." },
  { icon: <WalletCards className="h-4 w-4" />, title: "Rewards stay ready", detail: "Wallet and bonus data are saved locally." },
];

function InfoPill({ icon, children }: { icon: ReactNode; children: ReactNode }) {
  return (
    <span className="inline-flex h-8 items-center gap-1.5 rounded-full bg-secondary px-3 text-[0.75rem] font-medium text-muted-foreground">
      {icon}
      {children}
    </span>
  );
}

function SyncBadge({ stage }: { stage: Stage }) {
  return (
    <div className="relative mb-4 h-16 w-16">
      {stage === "updating" && (
        <>
          <motion.span
            className="absolute inset-0 rounded-[1.35rem] bg-primary/10"
            animate={{ scale: [1, 1.22, 1], opacity: [0.75, 0, 0.75] }}
            transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.span
            className="absolute inset-2 rounded-[1.15rem] border border-primary/20"
            animate={{ rotate: 360 }}
            transition={{ duration: 3.2, repeat: Infinity, ease: "linear" }}
          />
        </>
      )}
      <motion.div
        layout
        className="relative"
      >
        <TonightLogoBadge size={64} variant={stage === "done" ? "soft" : "solid"} title="Tonight" />
        <span
          className={`absolute -bottom-1 -right-1 flex h-7 w-7 items-center justify-center rounded-full border-2 border-card ${
            stage === "done" ? "bg-success text-success-foreground" : "bg-primary text-primary-foreground"
          }`}
        >
          {stage === "done" ? <ShieldCheck className="h-3.5 w-3.5" /> : <RefreshCw className={`h-3.5 w-3.5 ${stage === "updating" ? "animate-spin" : ""}`} />}
        </span>
      </motion.div>
    </div>
  );
}

function ReleaseCard() {
  return (
    <div className="mt-4 rounded-[1.35rem] border border-border bg-secondary/45 p-3.5">
      <div className="mb-3 flex items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-2">
          <Sparkles className="h-4 w-4 shrink-0 text-primary" />
          <span className="truncate text-[0.8125rem] font-medium">What's new in {CURRENT_VERSION}</span>
        </div>
        <span className="shrink-0 rounded-full bg-card px-2.5 py-1 text-[0.6875rem] text-muted-foreground">Release</span>
      </div>
      <div className="space-y-2.5">
        {RELEASE_NOTES.map((note) => (
          <div key={note.title} className="flex gap-2.5">
            <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-card text-primary">
              {note.icon}
            </span>
            <div className="min-w-0">
              <p className="text-[0.8125rem] font-medium">{note.title}</p>
              <p className="mt-0.5 text-[0.75rem] leading-snug text-muted-foreground">{note.detail}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ProgressSteps({ stepIdx }: { stepIdx: number }) {
  return (
    <div className="mt-4 space-y-2.5">
      {STEPS.map((step, index) => {
        const complete = index < stepIdx;
        const active = index === stepIdx;
        return (
          <motion.div
            key={step}
            layout
            className={`flex items-center gap-2.5 rounded-[1rem] px-3 py-2.5 transition ${
              active ? "bg-primary/8 text-primary" : complete ? "bg-success/8 text-success" : "bg-secondary/45 text-muted-foreground"
            }`}
          >
            <span className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full ${complete ? "bg-success text-success-foreground" : active ? "bg-primary text-primary-foreground" : "bg-card"}`}>
              {complete ? <Check className="h-3.5 w-3.5" /> : <span className="h-1.5 w-1.5 rounded-full bg-current" />}
            </span>
            <span className="min-w-0 flex-1 truncate text-[0.8125rem] font-medium">{step}</span>
            {active && <RefreshCw className="h-3.5 w-3.5 animate-spin" />}
          </motion.div>
        );
      })}
    </div>
  );
}

export function FirstLoginDbModal() {
  const [open, setOpen] = useState(false);
  const [stage, setStage] = useState<Stage>("ask");
  const [progress, setProgress] = useState(0);
  const [stepIdx, setStepIdx] = useState(0);
  const authed = useSyncExternalStore(authStore.subscribe, authStore.getSnapshot, () => false);
  const { success } = useToast();
  const successRef = useRef(success);

  useEffect(() => {
    successRef.current = success;
  }, [success]);

  useEffect(() => {
    if (!authed) return;
    setStage("ask");
    setProgress(0);
    setStepIdx(0);
    const t = setTimeout(() => setOpen(true), 500);
    return () => clearTimeout(t);
  }, [authed]);

  useEffect(() => {
    if (stage !== "updating") return;
    const startedAt = performance.now();
    const tick = window.setInterval(() => {
      const elapsed = performance.now() - startedAt;
      const linear = Math.min(1, elapsed / SYNC_DURATION_MS);
      const eased = 1 - Math.pow(1 - linear, 1.55);
      const nextProgress = Math.min(100, eased * 100);
      setProgress(nextProgress);
      const idx = Math.min(STEPS.length - 1, Math.floor((nextProgress / 100) * STEPS.length));
      setStepIdx(idx);
      if (linear >= 1) {
        window.clearInterval(tick);
        setProgress(100);
        setStepIdx(STEPS.length - 1);
        setStage("done");
      }
    }, 80);
    return () => window.clearInterval(tick);
  }, [stage]);

  useEffect(() => {
    if (stage !== "done") return;
    const t = window.setTimeout(() => {
      setOpen(false);
      successRef.current("You're up to date", `Database synced to ${CURRENT_VERSION}`);
    }, 900);
    return () => window.clearTimeout(t);
  }, [stage]);

  const canDismiss = stage === "ask";

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[500] flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => canDismiss && setOpen(false)}
        >
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="db-update-title"
            className="w-full max-w-[25.5rem] overflow-hidden rounded-[1.75rem] border border-border bg-card shadow-[0_22px_70px_rgba(0,0,0,0.22)]"
            initial={{ opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 18, scale: 0.97 }}
            transition={{ type: "spring", stiffness: 360, damping: 30 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative px-5 pb-5 pt-5">
              {canDismiss && (
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="absolute right-3 top-3 flex h-9 w-9 cursor-pointer items-center justify-center rounded-full bg-secondary/70 text-muted-foreground transition hover:text-primary active:scale-95"
                  aria-label="Close"
                >
                  <X className="h-4 w-4" />
                </button>
              )}

              <SyncBadge stage={stage} />

              <AnimatePresence mode="wait">
                {stage === "ask" && (
                  <motion.div
                    key="ask"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                  >
                    <div className="mb-3 flex flex-wrap gap-2">
                      <InfoPill icon={<Clock3 className="h-3.5 w-3.5" />}>About 8 seconds</InfoPill>
                      <InfoPill icon={<ShieldCheck className="h-3.5 w-3.5" />}>Offline ready</InfoPill>
                    </div>
                    <h2 id="db-update-title" className="text-[1.45rem] font-semibold leading-tight">Update local data?</h2>
                    <p className="mt-2 text-[0.875rem] leading-relaxed text-muted-foreground">
                      Sync the latest restaurant catalog, reservations, and rewards to this device before you start browsing.
                    </p>
                    <ReleaseCard />
                  </motion.div>
                )}

                {stage === "updating" && (
                  <motion.div
                    key="updating"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                  >
                    <h2 id="db-update-title" className="text-[1.45rem] font-semibold leading-tight">Syncing your Tonight data</h2>
                    <p className="mt-2 text-[0.875rem] leading-relaxed text-muted-foreground">
                      Keep the app open while we prepare the freshest local experience.
                    </p>
                    <div className="mt-5 rounded-[1.35rem] border border-border bg-secondary/40 p-3.5">
                      <div className="mb-2 flex items-center justify-between gap-3">
                        <span className="truncate text-[0.8125rem] text-muted-foreground">{STEPS[stepIdx]}</span>
                        <span className="text-[0.8125rem] font-medium tabular-nums">{Math.floor(progress)}%</span>
                      </div>
                      <div className="h-2 overflow-hidden rounded-full bg-card">
                        <motion.div
                          className="h-full rounded-full bg-primary"
                          animate={{ width: `${progress}%` }}
                          transition={{ duration: 0.16, ease: "easeOut" }}
                        />
                      </div>
                    </div>
                    <ProgressSteps stepIdx={stepIdx} />
                  </motion.div>
                )}

                {stage === "done" && (
                  <motion.div
                    key="done"
                    initial={{ opacity: 0, scale: 0.96 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, y: -8 }}
                    className="pb-1"
                  >
                    <div className="mb-3 inline-flex items-center gap-1.5 rounded-full bg-success/10 px-3 py-1.5 text-[0.75rem] font-medium text-success">
                      <BadgeCheck className="h-3.5 w-3.5" />
                      Version {CURRENT_VERSION}
                    </div>
                    <h2 id="db-update-title" className="text-[1.45rem] font-semibold leading-tight">Ready for tonight</h2>
                    <p className="mt-2 text-[0.875rem] leading-relaxed text-muted-foreground">
                      Catalog, reservations, wallet, and rewards are now available on this device.
                    </p>
                    <div className="mt-5 h-2 overflow-hidden rounded-full bg-secondary">
                      <motion.div className="h-full rounded-full bg-success" initial={{ width: "72%" }} animate={{ width: "100%" }} transition={{ duration: 0.45, ease: "easeOut" }} />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {stage === "ask" && (
              <div className="grid grid-cols-[0.9fr_1.5fr] gap-2 border-t border-border bg-secondary/20 px-5 py-4">
                <Button variant="ghost" size="md" radius="full" className="h-11 font-medium" onClick={() => setOpen(false)}>
                  Later
                </Button>
                <Button variant="primary" size="md" radius="full" className="h-11 font-medium shadow-[0_10px_22px_rgba(255,56,92,0.22)]" onClick={() => setStage("updating")}>
                  Update now
                </Button>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

import { useEffect, useState, useSyncExternalStore } from "react";
import { toast } from "sonner";
import { Database, ShieldCheck, Sparkles, X } from "lucide-react";
import { Button } from "./ds/Button";
import { authStore } from "../stores/authStore";

const CURRENT_VERSION = "2026.04.27";

type Stage = "ask" | "updating" | "done";

const STEPS = [
  "Connecting to server",
  "Fetching latest restaurant catalog",
  "Syncing reservations & wallet",
  "Refreshing recommendations",
  "Finalizing local cache",
];

export function FirstLoginDbModal() {
  const [open, setOpen] = useState(false);
  const [stage, setStage] = useState<Stage>("ask");
  const [progress, setProgress] = useState(0);
  const [stepIdx, setStepIdx] = useState(0);
  const authed = useSyncExternalStore(authStore.subscribe, authStore.getSnapshot, () => false);

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
    let p = 0;
    const tick = setInterval(() => {
      p = Math.min(100, p + 3 + Math.random() * 5);
      setProgress(p);
      const idx = Math.min(STEPS.length - 1, Math.floor((p / 100) * STEPS.length));
      setStepIdx(idx);
      if (p >= 100) {
        clearInterval(tick);
        setStage("done");
        setTimeout(() => {
          setOpen(false);
          toast.success("You're up to date", {
            description: `Database synced to ${CURRENT_VERSION}`,
            position: "bottom-right",
            duration: 4000,
          });
        }, 600);
      }
    }, 120);
    return () => clearInterval(tick);
  }, [stage]);

  if (!open) return null;
  const canDismiss = stage === "ask";

  return (
    <div className="fixed inset-0 z-[60] bg-black/55 backdrop-blur-sm flex items-center justify-center p-4" onClick={() => canDismiss && setOpen(false)}>
      <div className="bg-background w-full max-w-md rounded-3xl overflow-hidden shadow-2xl border border-border" onClick={(e) => e.stopPropagation()}>
        <div className="relative px-6 pt-6 pb-4">
          {canDismiss && (
            <button onClick={() => setOpen(false)} className="absolute top-3 right-3 w-8 h-8 rounded-full hover:bg-secondary flex items-center justify-center" aria-label="Close">
              <X className="w-4 h-4" />
            </button>
          )}
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4" style={{ background: "linear-gradient(135deg, color-mix(in srgb, var(--primary) 20%, transparent), color-mix(in srgb, var(--primary) 8%, transparent))" }}>
            {stage === "done" ? <ShieldCheck className="w-7 h-7 text-success" /> : <Database className="w-7 h-7 text-primary" />}
          </div>

          {stage === "ask" && (
            <>
              <h2 className="text-[1.25rem] leading-tight" style={{ fontWeight: 700 }}>Update local database?</h2>
              <p className="text-[0.875rem] text-muted-foreground mt-1.5 leading-relaxed">
                We'll sync the latest restaurant catalog, reservations and rewards to your device. This usually takes just a few seconds.
              </p>
              <div className="mt-4 rounded-xl bg-secondary/50 p-3 flex items-start gap-2.5">
                <Sparkles className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                <div className="text-[0.75rem] leading-snug">
                  <span style={{ fontWeight: 600 }}>What's new in {CURRENT_VERSION}</span>
                  <p className="text-muted-foreground mt-0.5">Faster search, fresh editor's picks, and improved booking availability.</p>
                </div>
              </div>
            </>
          )}

          {stage === "updating" && (
            <>
              <h2 className="text-[1.25rem] leading-tight" style={{ fontWeight: 700 }}>Updating database…</h2>
              <p className="text-[0.875rem] text-muted-foreground mt-1.5">Hang tight — this only happens once per release.</p>
              <div className="mt-5">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[0.75rem] text-muted-foreground truncate pr-3">{STEPS[stepIdx]}</span>
                  <span className="text-[0.75rem] tabular-nums" style={{ fontWeight: 600 }}>{Math.floor(progress)}%</span>
                </div>
                <div className="h-2 rounded-full bg-secondary overflow-hidden">
                  <div className="h-full rounded-full transition-[width] duration-150 ease-out" style={{ width: `${progress}%`, background: "linear-gradient(90deg, color-mix(in srgb, var(--primary) 60%, white), var(--primary))" }} />
                </div>
              </div>
            </>
          )}

          {stage === "done" && (
            <>
              <h2 className="text-[1.25rem] leading-tight" style={{ fontWeight: 700 }}>You're up to date</h2>
              <p className="text-[0.875rem] text-muted-foreground mt-1.5">Database synced successfully.</p>
            </>
          )}
        </div>

        {stage === "ask" && (
          <div className="flex items-center gap-2 px-6 py-4 border-t border-border bg-secondary/20">
            <Button variant="ghost" size="sm" className="flex-1" onClick={() => setOpen(false)}>Later</Button>
            <Button variant="primary" size="sm" className="flex-[2]" onClick={() => setStage("updating")}>Confirm & Update</Button>
          </div>
        )}
      </div>
    </div>
  );
}

/* Modal that prompts unauthenticated users to sign in */
import { motion, AnimatePresence } from "motion/react";
import { LogIn, X } from "lucide-react";
import { Button } from "./ds/Button";

interface LoginPromptModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  message?: string;
}

export function LoginPromptModal({
  open,
  onClose,
  onConfirm,
  title = "Sign in required",
  message = "You need an account to use this feature. Sign in or create one to continue.",
}: LoginPromptModalProps) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[500] bg-black/60 backdrop-blur-sm flex items-center justify-center p-5"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
            className="relative w-full max-w-sm rounded-3xl bg-card border border-border shadow-xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={onClose}
              className="absolute top-3 right-3 w-8 h-8 rounded-full hover:bg-secondary flex items-center justify-center cursor-pointer transition"
            >
              <X className="w-4 h-4" />
            </button>
            <div className="px-6 pt-8 pb-6 text-center">
              <div
                className="w-14 h-14 rounded-2xl mx-auto flex items-center justify-center mb-4"
                style={{ background: "color-mix(in oklab, var(--primary) 15%, transparent)" }}
              >
                <LogIn className="w-7 h-7" style={{ color: "var(--primary)" }} />
              </div>
              <h2 className="text-[1.125rem]" style={{ fontWeight: 700 }}>{title}</h2>
              <p className="text-muted-foreground text-[0.875rem] mt-2 leading-relaxed">{message}</p>
            </div>
            <div className="px-5 pb-5 flex flex-col gap-2">
              <Button variant="primary" radius="full" fullWidth onClick={onConfirm}>Sign in</Button>
              <Button variant="ghost" radius="full" fullWidth onClick={onClose}>Not now</Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

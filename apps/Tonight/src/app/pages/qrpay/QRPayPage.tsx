import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ArrowLeft, ScanLine, X, CheckCircle } from "lucide-react";
import { UnifiedPayment } from "../shared/UnifiedPayment";

interface QRPayPageProps {
  onClose: () => void;
}

type Stage = "scan" | "pay" | "success";

/* ── Fake Scanner ─────────────────────────────── */
function ScannerView({ onScanned }: { onScanned: (addr: string) => void }) {
  const [scanning, setScanning] = useState(false);

  const handleScan = () => {
    setScanning(true);
    setTimeout(() => {
      onScanned("0xA7c3...F92d - Sakura Omakase");
    }, 1800);
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center px-6">
      <div className="relative w-64 h-64 mb-8">
        <div className="absolute inset-0 rounded-3xl border-2 border-dashed border-primary/30" />
        {[["top-0 left-0", "rounded-tl-3xl border-t-4 border-l-4"], ["top-0 right-0", "rounded-tr-3xl border-t-4 border-r-4"], ["bottom-0 left-0", "rounded-bl-3xl border-b-4 border-l-4"], ["bottom-0 right-0", "rounded-br-3xl border-b-4 border-r-4"]].map(([pos, cls], i) => (
          <div key={i} className={`absolute ${pos} w-10 h-10 ${cls} border-primary`} />
        ))}
        {scanning && (
          <motion.div
            className="absolute left-4 right-4 h-0.5 bg-primary rounded-full shadow-[0_0_8px_var(--primary)]"
            animate={{ top: ["10%", "85%", "10%"] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          />
        )}
        <div className="absolute inset-0 flex items-center justify-center">
          <ScanLine className={`w-16 h-16 ${scanning ? "text-primary animate-pulse" : "text-muted-foreground/40"}`} />
        </div>
      </div>
      <p className="text-muted-foreground text-[0.875rem] mb-6 text-center">
        {scanning ? "Scanning QR code..." : "Position the QR code within the frame"}
      </p>
      {!scanning && (
        <button
          onClick={handleScan}
          className="px-8 py-3.5 rounded-2xl text-[0.9375rem] transition-all active:scale-95"
          style={{ fontWeight: 600, background: "var(--primary)", color: "var(--primary-foreground)" }}
        >
          Scan QR Code
        </button>
      )}
      {scanning && (
        <div className="flex items-center gap-2 text-primary">
          <motion.div
            className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full"
            animate={{ rotate: 360 }}
            transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
          />
          <span className="text-[0.875rem]" style={{ fontWeight: 500 }}>Detecting...</span>
        </div>
      )}
    </div>
  );
}

/* ── Success View ─────────────────────────────── */
function SuccessView({ address, amount, onClose }: { address: string; amount: number; onClose: () => void }) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center px-6">
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 15 }}
        className="w-20 h-20 rounded-full bg-success/10 flex items-center justify-center mb-6"
      >
        <CheckCircle className="w-10 h-10 text-success" />
      </motion.div>
      <motion.h2 initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="text-[1.5rem] mb-2" style={{ fontWeight: 700 }}>
        Payment Sent
      </motion.h2>
      <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="text-muted-foreground text-[0.875rem] text-center mb-2">
        ${amount.toFixed(2)} paid to
      </motion.p>
      <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }} className="text-[0.875rem] text-center mb-8" style={{ fontWeight: 600 }}>
        {address}
      </motion.p>
      <motion.button
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        onClick={onClose}
        className="px-10 py-3.5 rounded-2xl text-[0.9375rem] transition-all active:scale-95"
        style={{ fontWeight: 600, background: "var(--primary)", color: "var(--primary-foreground)" }}
      >
        Done
      </motion.button>
    </div>
  );
}

/* ── Main QR Pay Page ─────────────────────────── */
export function QRPayPage({ onClose }: QRPayPageProps) {
  const [stage, setStage] = useState<Stage>("scan");
  const [address, setAddress] = useState("");
  const [paidAmount, setPaidAmount] = useState(0);

  const handleScanned = useCallback((addr: string) => {
    setAddress(addr);
    setStage("pay");
  }, []);

  const handlePaymentComplete = useCallback((amount: number) => {
    setPaidAmount(amount);
    setTimeout(() => setStage("success"), 1200);
  }, []);

  return (
    <motion.div
      className="fixed inset-0 z-[100] bg-background flex flex-col"
      initial={{ opacity: 0, y: "100%" }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: "100%" }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-border">
        <button
          onClick={stage === "pay" ? () => setStage("scan") : onClose}
          className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-secondary transition"
        >
          {stage === "scan" ? <X className="w-5 h-5" /> : <ArrowLeft className="w-5 h-5" />}
        </button>
        <h2 className="text-[1.0625rem]" style={{ fontWeight: 600 }}>
          {stage === "scan" ? "QR Pay" : stage === "pay" ? "Confirm Payment" : "Complete"}
        </h2>
        <div className="w-10" />
      </div>

      {/* Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={stage}
          className="flex-1 flex flex-col min-h-0"
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -30 }}
          transition={{ duration: 0.2 }}
        >
          {stage === "scan" && <ScannerView onScanned={handleScanned} />}
          {stage === "pay" && (
            <UnifiedPayment
              payTo={address}
              editable
              showRewards
              onComplete={handlePaymentComplete}
            />
          )}
          {stage === "success" && <SuccessView address={address} amount={paidAmount} onClose={onClose} />}
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
}
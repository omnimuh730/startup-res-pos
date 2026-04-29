import { useEffect, useState } from "react";
import { TopUpAuthView } from "./TopUpAuthView";
import { TopUpConfirmView } from "./TopUpConfirmView";
import { TopUpDoneView } from "./TopUpDoneView";
import { TopUpErrorView } from "./TopUpErrorView";
import { TopUpProcessingView } from "./TopUpProcessingView";
import { TopUpSelectView } from "./TopUpSelectView";
import { PROCESS_STAGES_BY_PROVIDER, TOPUP_PRESETS_KRW, TOPUP_PRESETS_USD, type TopUpStep, fmtMoney, genReceiptNo, genTxnId } from "./types";

export function TopUpPage({ onBack }: { onBack: () => void }) {
  const [currency, setCurrency] = useState<"KRW" | "USD">("KRW");
  const [amount, setAmount] = useState(50_000);
  const [customAmount, setCustomAmount] = useState("");
  const [selectedProvider, setSelectedProvider] = useState<string | null>(null);
  const [step, setStep] = useState<TopUpStep>("select");
  const [stageIdx, setStageIdx] = useState(0);
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [otpError, setOtpError] = useState<string | null>(null);
  const [resendIn, setResendIn] = useState(0);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [receipt, setReceipt] = useState<{ id: string; txn: string; at: string } | null>(null);
  const [providerSheet, setProviderSheet] = useState(false);
  useEffect(() => { if (!selectedProvider) setSelectedProvider("apple"); }, [selectedProvider]);
  const activeAmount = customAmount ? Number(customAmount) : amount;
  const bonus = 0;
  const presets = currency === "KRW" ? TOPUP_PRESETS_KRW : TOPUP_PRESETS_USD;
  const fmt = (n: number) => fmtMoney(n, currency);
  const switchCurrency = (c: "KRW" | "USD") => { setCurrency(c); setCustomAmount(""); setAmount(c === "KRW" ? 50_000 : 50); };
  useEffect(() => {
    if (resendIn <= 0) return;
    const t = setInterval(() => setResendIn((s) => Math.max(0, s - 1)), 1000);
    return () => clearInterval(t);
  }, [resendIn]);
  useEffect(() => {
    if (step !== "processing" || !selectedProvider) return;
    const stages = PROCESS_STAGES_BY_PROVIDER[selectedProvider] ?? PROCESS_STAGES_BY_PROVIDER.apple;
    setStageIdx(0);
    let i = 0;
    const tick = () => {
      i += 1;
      if (i >= stages.length) { setStageIdx(stages.length); setReceipt({ id: genReceiptNo(), txn: genTxnId(), at: new Date().toLocaleString() }); setTimeout(() => setStep("done"), 450); return; }
      setStageIdx(i);
      timer = window.setTimeout(tick, 700 + Math.random() * 600);
    };
    let timer = window.setTimeout(tick, 800);
    return () => window.clearTimeout(timer);
  }, [step, selectedProvider]);
  const handleConfirm = () => { if (selectedProvider === "bank") { setOtp(["", "", "", ""]); setOtpError(null); setResendIn(30); setStep("auth"); } else { setStep("processing"); } };
  const submitOtp = () => { const code = otp.join(""); if (code.length < 4) { setOtpError("Enter the 4-digit code"); return; } if (code === "0000") { setOtpError("That code didn't match. Try again."); return; } setOtpError(null); setStep("processing"); };
  const setOtpDigit = (i: number, v: string) => { const digit = v.replace(/\D/g, "").slice(-1); setOtp((prev) => { const next = [...prev]; next[i] = digit; return next; }); if (digit && i < 3) document.getElementById(`topup-otp-${i + 1}`)?.focus(); };
  const pressKey = (k: string) => {
    if (k === "back") { setCustomAmount((prev) => (prev !== "" ? prev : String(amount)).slice(0, -1)); return; }
    if (k === ".") { if (currency !== "USD") return; setCustomAmount((prev) => { const base = prev !== "" ? prev : String(amount); if (base.includes(".")) return base; return (base || "0") + "."; }); return; }
    setCustomAmount((prev) => { const base = prev !== "" ? prev : ""; if (base === "" && k === "0") return "0"; if (base === "0") return k; if (base.replace(".", "").length >= 12) return base; if (currency === "USD" && base.includes(".") && (base.split(".")[1] || "").length >= 2) return base; return base + k; });
  };
  if (step === "done") return <TopUpDoneView onBack={onBack} activeAmount={activeAmount} currency={currency} bonus={bonus} selectedProvider={selectedProvider} receipt={receipt} fmt={fmt} onTopUpAgain={() => { setStep("select"); setSelectedProvider(null); setReceipt(null); }} />;
  if (step === "error") return <TopUpErrorView onBack={() => setStep("confirm")} errorMsg={errorMsg} onCancel={onBack} onRetry={() => { setErrorMsg(null); setStep("processing"); }} />;
  if (step === "auth") return <TopUpAuthView selectedProvider={selectedProvider} otp={otp} otpError={otpError} resendIn={resendIn} setOtpDigit={setOtpDigit} setResendIn={setResendIn} setOtpError={setOtpError} submitOtp={submitOtp} onBack={() => setStep("confirm")} />;
  if (step === "processing") return <TopUpProcessingView selectedProvider={selectedProvider} stageIdx={stageIdx} activeAmount={activeAmount} fmt={fmt} />;
  if (step === "confirm") return <TopUpConfirmView onBack={() => setStep("select")} onChangeMethod={() => setStep("select")} onConfirm={handleConfirm} selectedProvider={selectedProvider} currency={currency} activeAmount={activeAmount} bonus={bonus} fmt={fmt} />;
  return <TopUpSelectView onBack={onBack} currency={currency} amount={amount} customAmount={customAmount} activeAmount={activeAmount} presets={presets} selectedProvider={selectedProvider} providerSheet={providerSheet} fmt={fmt} switchCurrency={switchCurrency} setAmount={setAmount} setCustomAmount={setCustomAmount} setProviderSheet={setProviderSheet} setSelectedProvider={setSelectedProvider} pressKey={pressKey} onContinue={() => setStep("confirm")} />;
}

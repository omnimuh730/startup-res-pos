import { useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router";
import { QRCodeSVG } from "qrcode.react";
import { ArrowLeft, Banknote, Check, CreditCard, HandCoins, Receipt } from "lucide-react";
import { useThemeClasses } from "../theme-context";

interface PaymentState {
  totalUsd?: number;
  totalKrw?: number;
  checkNumber?: string;
  tableLabel?: string;
  returnTo?: string;
}

export default function PaymentPage() {
  const tc = useThemeClasses();
  const navigate = useNavigate();
  const { state } = useLocation() as { state: PaymentState | null };

  const totalUsd = state?.totalUsd ?? 0;
  const totalKrw = state?.totalKrw ?? 0;
  const checkNumber = state?.checkNumber ?? "—";
  const tableLabel = state?.tableLabel ?? "—";
  const returnTo = state?.returnTo ?? "/pos";

  const qrPayload = useMemo(
    () =>
      JSON.stringify({
        kind: "pos-payment",
        check: checkNumber,
        table: tableLabel,
        usd: totalUsd,
        krw: totalKrw,
        ts: Date.now(),
      }),
    [checkNumber, tableLabel, totalUsd, totalKrw],
  );

  const [step, setStep] = useState<"qr" | "manual" | "done">("qr");
  const [receivedKrw, setReceivedKrw] = useState("");
  const [receivedUsd, setReceivedUsd] = useState("");

  const krwNum = parseFloat(receivedKrw) || 0;
  const usdNum = parseFloat(receivedUsd) || 0;

  // Each currency pool is checked independently — no conversion.
  const krwCovered = krwNum >= totalKrw - 0.5;
  const usdCovered = usdNum >= totalUsd - 0.005;
  const covered = krwCovered && usdCovered;
  const krwChange = Math.max(0, krwNum - totalKrw);
  const usdChange = Math.max(0, usdNum - totalUsd);

  const confirmManual = () => {
    if (!covered) return;
    setStep("done");
  };

  const finish = () => navigate(returnTo);

  const hasKrw = totalKrw > 0;
  const hasUsd = totalUsd > 0;

  return (
    <div className={`h-full overflow-y-auto ${tc.page}`}>
      <div className="max-w-3xl mx-auto p-4 sm:p-6">
        {/* Header */}
        <div className="flex items-center gap-3 mb-4">
          <button
            onClick={() => navigate(-1)}
            className={`w-9 h-9 rounded-lg flex items-center justify-center cursor-pointer transition-colors ${
              tc.isDark ? "bg-slate-800 hover:bg-slate-700 text-slate-300" : "bg-white hover:bg-slate-50 text-slate-600 border border-slate-200"
            }`}
            aria-label="Back"
          >
            <ArrowLeft className="w-4.5 h-4.5" />
          </button>
          <div className="flex-1 min-w-0">
            <h1 className={`text-[1.125rem] ${tc.heading}`}>Payment</h1>
            <p className={`text-[0.75rem] ${tc.subtext}`}>
              {tableLabel} · {checkNumber}
            </p>
          </div>
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-blue-600/15 text-blue-500 text-[0.6875rem]">
            <Receipt className="w-3.5 h-3.5" /> Due
          </span>
        </div>

        {/* Amount summary — two independent totals */}
        <div className={`${tc.card} rounded-2xl p-5 mb-4`}>
          <p className={`text-[0.6875rem] uppercase tracking-wider ${tc.subtext} mb-2`}>Amount due</p>
          <div className="grid grid-cols-2 gap-3">
            <div className={`rounded-lg p-3 ${tc.isDark ? "bg-slate-800/60" : "bg-slate-100"}`}>
              <p className={`text-[0.625rem] uppercase tracking-wider ${tc.muted}`}>Domestic</p>
              <p className={`text-[1.5rem] ${tc.heading} mt-0.5`}>₩{Math.round(totalKrw).toLocaleString()}</p>
            </div>
            <div className={`rounded-lg p-3 ${tc.isDark ? "bg-slate-800/60" : "bg-slate-100"}`}>
              <p className={`text-[0.625rem] uppercase tracking-wider ${tc.muted}`}>Foreign</p>
              <p className={`text-[1.5rem] ${tc.heading} mt-0.5`}>${totalUsd.toFixed(2)}</p>
            </div>
          </div>
          <p className={`text-[0.6875rem] ${tc.muted} mt-2`}>
            Domestic and foreign totals are tracked independently — no conversion.
          </p>
        </div>

        {step === "qr" && (
          <div className={`${tc.card} rounded-2xl p-6 flex flex-col items-center`}>
            <p className={`text-[0.875rem] ${tc.heading} mb-1`}>Scan to Pay</p>
            <p className={`text-[0.75rem] ${tc.subtext} mb-4`}>Show this QR to the guest</p>
            <div className="bg-white rounded-xl p-4 shadow-lg">
              <QRCodeSVG value={qrPayload} size={224} level="M" />
            </div>

            <button
              onClick={() => setStep("manual")}
              className="mt-5 w-full flex items-center justify-center gap-2 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-[0.875rem] cursor-pointer transition-colors"
            >
              <HandCoins className="w-4 h-4" /> Manual Accept (Cash)
            </button>
            <button
              onClick={() => navigate(-1)}
              className={`mt-2 w-full py-2 rounded-lg text-[0.8125rem] cursor-pointer transition-colors ${tc.isDark ? "text-slate-300 hover:bg-slate-800" : "text-slate-600 hover:bg-slate-100"}`}
            >
              Cancel
            </button>
          </div>
        )}

        {step === "manual" && (
          <div className={`${tc.card} rounded-2xl p-5`}>
            <div className="flex items-center gap-2 mb-4">
              <Banknote className="w-4 h-4 text-blue-500" />
              <h2 className={`text-[0.9375rem] ${tc.heading}`}>Record cash received</h2>
            </div>
            <p className={`text-[0.75rem] ${tc.subtext} mb-4`}>
              Each currency is settled in its own pool. Guest pays ₩ items in ₩ and $ items in $.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
              {hasKrw && (
                <div>
                  <label className={`text-[0.75rem] ${tc.subtext} mb-1 block`}>
                    Domestic (₩) — due ₩{Math.round(totalKrw).toLocaleString()}
                  </label>
                  <div className="relative">
                    <span className={`absolute left-3 top-1/2 -translate-y-1/2 text-[0.875rem] ${tc.subtext}`}>₩</span>
                    <input
                      value={receivedKrw}
                      onChange={(e) => setReceivedKrw(e.target.value)}
                      type="number"
                      step={100}
                      placeholder="0"
                      className={`${tc.input} pl-7`}
                    />
                  </div>
                  {!krwCovered && krwNum > 0 && (
                    <p className="text-[0.75rem] text-red-500 mt-1">
                      Short by ₩{Math.round(totalKrw - krwNum).toLocaleString()}
                    </p>
                  )}
                  {krwChange > 0 && (
                    <p className={`text-[0.75rem] ${tc.subtext} mt-1`}>
                      Change: ₩{Math.round(krwChange).toLocaleString()}
                    </p>
                  )}
                </div>
              )}
              {hasUsd && (
                <div>
                  <label className={`text-[0.75rem] ${tc.subtext} mb-1 block`}>
                    Foreign ($) — due ${totalUsd.toFixed(2)}
                  </label>
                  <div className="relative">
                    <span className={`absolute left-3 top-1/2 -translate-y-1/2 text-[0.875rem] ${tc.subtext}`}>$</span>
                    <input
                      value={receivedUsd}
                      onChange={(e) => setReceivedUsd(e.target.value)}
                      type="number"
                      step={0.01}
                      placeholder="0.00"
                      className={`${tc.input} pl-7`}
                    />
                  </div>
                  {!usdCovered && usdNum > 0 && (
                    <p className="text-[0.75rem] text-red-500 mt-1">
                      Short by ${(totalUsd - usdNum).toFixed(2)}
                    </p>
                  )}
                  {usdChange > 0 && (
                    <p className={`text-[0.75rem] ${tc.subtext} mt-1`}>
                      Change: ${usdChange.toFixed(2)}
                    </p>
                  )}
                </div>
              )}
            </div>

            <div className="flex gap-2 mt-5">
              <button
                onClick={() => setStep("qr")}
                className={`flex-1 py-2.5 rounded-lg text-[0.8125rem] cursor-pointer transition-colors ${tc.isDark ? "bg-slate-700 hover:bg-slate-600 text-slate-100" : "bg-slate-100 hover:bg-slate-200 text-slate-700"}`}
              >
                Back
              </button>
              <button
                onClick={confirmManual}
                disabled={!covered}
                className={`flex-1 py-2.5 rounded-lg text-[0.8125rem] cursor-pointer transition-colors ${
                  covered ? "bg-blue-600 hover:bg-blue-700 text-white" : tc.isDark ? "bg-slate-700 text-slate-500 cursor-not-allowed" : "bg-slate-200 text-slate-400 cursor-not-allowed"
                }`}
              >
                Confirm Payment
              </button>
            </div>
          </div>
        )}

        {step === "done" && (
          <div className={`${tc.card} rounded-2xl p-6 flex flex-col items-center text-center`}>
            <div className="w-14 h-14 rounded-full bg-blue-600 text-white flex items-center justify-center mb-3 shadow-lg">
              <Check className="w-7 h-7" strokeWidth={2.5} />
            </div>
            <h2 className={`text-[1.125rem] ${tc.heading}`}>Payment complete</h2>
            <p className={`text-[0.8125rem] ${tc.subtext} mt-1`}>
              Received ₩{Math.round(krwNum).toLocaleString()} + ${usdNum.toFixed(2)}
              {(krwChange > 0 || usdChange > 0) ? ` · change ₩${Math.round(krwChange).toLocaleString()} + $${usdChange.toFixed(2)}` : ""}
            </p>
            <button
              onClick={finish}
              className="mt-5 w-full py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-[0.875rem] cursor-pointer transition-colors inline-flex items-center justify-center gap-2"
            >
              <CreditCard className="w-4 h-4" /> Done
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

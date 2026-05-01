import { AlertCircle, Shield } from "lucide-react";
import { Button } from "../../../../components/ds/Button";
import { Text } from "../../../../components/ds/Text";
import { PageHeader } from "../../profileHelpers";
import { PAYMENT_PROVIDERS } from "./types";

interface Props {
  selectedProvider: string | null;
  otp: string[];
  otpError: string | null;
  resendIn: number;
  setOtpDigit: (i: number, v: string) => void;
  setResendIn: (n: number) => void;
  setOtpError: (v: string | null) => void;
  submitOtp: () => void;
  onBack: () => void;
}

export function TopUpAuthView(props: Props) {
  const { selectedProvider, otp, otpError, resendIn, setOtpDigit, setResendIn, setOtpError, submitOtp, onBack } = props;
  const provider = PAYMENT_PROVIDERS.find((p) => p.id === selectedProvider)!;
  const code = otp.join("");
  return (
    <div className="pb-8">
      <PageHeader title="Verify It's You" onBack={onBack} />
      <div className="flex flex-col items-center text-center pt-2">
        <div className={`w-16 h-16 rounded-2xl ${provider.color} flex items-center justify-center mb-4`}><Shield className="w-8 h-8" /></div>
        <Text className="text-[1.125rem]" style={{ fontWeight: 700 }}>Enter the 4-digit code</Text>
        <Text className="text-muted-foreground text-[0.8125rem] mt-1.5 px-6">We sent a verification code to your {provider.name === "Bank Transfer" ? "registered phone (•••• 5678)" : provider.name + " account"}.</Text>
        <div className="flex items-center gap-2 mt-6">
          {otp.map((d, i) => (
            <input
              key={i}
              id={`topup-otp-${i}`}
              value={d}
              onChange={(e) => setOtpDigit(i, e.target.value)}
              onKeyDown={(e) => { if (e.key === "Backspace" && !otp[i] && i > 0) document.getElementById(`topup-otp-${i - 1}`)?.focus(); }}
              inputMode="numeric"
              maxLength={1}
              className={`w-12 h-14 text-center text-[1.25rem] rounded-xl border-2 outline-none transition ${otpError ? "border-destructive" : d ? "border-primary bg-primary/5" : "border-border focus:border-primary"}`}
              style={{ fontWeight: 700 }}
            />
          ))}
        </div>
        {otpError && <div className="flex items-center gap-1.5 mt-3 text-destructive text-[0.75rem]"><AlertCircle className="w-3.5 h-3.5" /><span>{otpError}</span></div>}
        <button disabled={resendIn > 0} onClick={() => { setResendIn(30); setOtpError(null); }} className="mt-5 text-[0.8125rem] text-primary disabled:text-muted-foreground" style={{ fontWeight: 500 }}>
          {resendIn > 0 ? `Resend code in ${resendIn}s` : "Resend code"}
        </button>
        <div className="text-[0.6875rem] text-muted-foreground mt-3">Tip: try <span className="font-mono">0000</span> to see the failure flow.</div>
        <Button variant="primary" fullWidth radius="full" onClick={submitOtp} className="mt-7" disabled={code.length < 4}>Verify & Continue</Button>
      </div>
    </div>
  );
}

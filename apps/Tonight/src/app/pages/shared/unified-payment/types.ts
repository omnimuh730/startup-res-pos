import type { ReactNode } from "react";

export interface PaymentLineItem {
  label: string;
  value: number;
  color?: "default" | "muted" | "success" | "destructive";
  icon?: ReactNode;
}

export interface UnifiedPaymentProps {
  payTo: string;
  payToSub?: string;
  amount?: number;
  amountKRW?: number;
  editable?: boolean;
  lineItems?: PaymentLineItem[];
  showRewards?: boolean;
  onComplete: (amount: number) => void;
  quickAmounts?: number[];
}

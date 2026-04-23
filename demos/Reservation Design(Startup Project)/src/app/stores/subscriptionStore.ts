/* ── Subscription Store (module-level, useSyncExternalStore compatible) ── */

export type PlanType = "free" | "pro";
export type BillingCycle = "monthly" | "quarterly" | "yearly";

export interface PlanInfo {
  type: PlanType;
  cycle?: BillingCycle;
  expiresAt?: string;
  subscribedAt?: string;
}

export const PLAN_PRICES: Record<BillingCycle, { price: number; perMonth: number; discount: number; label: string }> = {
  monthly: { price: 9.99, perMonth: 9.99, discount: 0, label: "Monthly" },
  quarterly: { price: 24.99, perMonth: 8.33, discount: 17, label: "Quarterly" },
  yearly: { price: 79.99, perMonth: 6.67, discount: 33, label: "Yearly" },
};

let _plan: PlanInfo = { type: "free" };
let _listeners = new Set<() => void>();
let _snapshot = 0;

function _notify() { _snapshot++; _listeners.forEach(fn => fn()); }

export function subscribePlan(fn: () => void) {
  _listeners.add(fn);
  return () => { _listeners.delete(fn); };
}

export function getPlanSnapshot() { return _snapshot; }
export function getPlan() { return _plan; }

export function activatePro(cycle: BillingCycle) {
  const now = new Date();
  const expiry = new Date(now);
  if (cycle === "monthly") expiry.setMonth(expiry.getMonth() + 1);
  else if (cycle === "quarterly") expiry.setMonth(expiry.getMonth() + 3);
  else expiry.setFullYear(expiry.getFullYear() + 1);

  _plan = {
    type: "pro",
    cycle,
    subscribedAt: now.toISOString(),
    expiresAt: expiry.toISOString(),
  };
  _notify();
}

export function cancelPro() {
  _plan = { type: "free" };
  _notify();
}

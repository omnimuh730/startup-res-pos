import type { SearchPlan } from "../DiscoverSearchModal";

/** Long ease-out for “gliding” compact bar + hero handoff (no spring overshoot). */
export const DISCOVER_GLIDE_EASE = [0.16, 1, 0.32, 1] as const;

export function formatReservationTime(value: string) {
  const match = value.match(/^(\d{1,2}):(\d{2})$/);
  if (!match) return value;
  const hour = Number(match[1]);
  const suffix = hour >= 12 ? "PM" : "AM";
  const displayHour = hour % 12 || 12;
  return `${displayHour}:${match[2]} ${suffix}`;
}

export function formatSearchPlanSummary(plan: SearchPlan) {
  const people = `${plan.partySize} ${plan.partySize === 1 ? "person" : "people"}`;
  return `${plan.dateLabel}, ${formatReservationTime(plan.timeLabel)}, ${people}`;
}

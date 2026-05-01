import { createBookingFlowSections } from "./sections/bookingFlowSections";
import { createFoundationsSections } from "./sections/foundationsSections";
import { createSupportSections } from "./sections/supportSections";
import type { Section } from "./types";

export interface BuildSectionsArgs {
  jump: (id: string) => void;
  onContactSupport?: () => void;
}

export function createHelpCenterSections({ onContactSupport }: BuildSectionsArgs): Section[] {
  return [
    ...createFoundationsSections(),
    ...createBookingFlowSections(),
    ...createSupportSections({ onContactSupport }),
  ];
}

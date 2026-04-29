import type { FAQ, Section } from "./types";
import { createHelpCenterFaqs } from "./helpCenterFaqs";
import { createHelpCenterSections, type BuildSectionsArgs } from "./helpCenterSections";

export function buildSections({ jump, onContactSupport }: BuildSectionsArgs): Section[] {
  return createHelpCenterSections({ jump, onContactSupport });
}

export function buildFaqs(jumpTo: (id: string) => void): FAQ[] {
  return createHelpCenterFaqs(jumpTo);
}

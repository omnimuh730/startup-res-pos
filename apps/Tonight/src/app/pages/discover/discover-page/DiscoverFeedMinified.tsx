import type { ReactElement } from "react";
import type { DiscoverFeedBuilderProps } from "./discoverFeedTypes";
import { discoverFeedTopPart } from "./DiscoverFeedTopPart";
import { discoverFeedBottomPart } from "./DiscoverFeedBottomPart";

export function buildDiscoverFeedStaggerItems(p: DiscoverFeedBuilderProps): ReactElement[] {
  return [...discoverFeedTopPart(p), ...discoverFeedBottomPart(p)];
}

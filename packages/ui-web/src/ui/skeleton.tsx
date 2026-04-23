import * as React from "react";
import { EmptyState as BaseEmptyState } from "../components/NavigationDisplay";

export type SkeletonProps = React.ComponentProps<typeof BaseEmptyState>;

export function Skeleton(props: SkeletonProps) {
  return <BaseEmptyState title="Loading" description="Content is being prepared" {...props} />;
}

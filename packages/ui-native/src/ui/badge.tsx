import * as React from "react";
import { Banner as BaseBanner } from "../components/Feedback";

export type BadgeProps = React.ComponentProps<typeof BaseBanner>;

export function Badge(props: BadgeProps) {
  return <BaseBanner {...props}>{props.children ?? "Status"}</BaseBanner>;
}

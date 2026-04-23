import * as React from "react";
import { Popover as BasePopover } from "../components/NavigationDisplay";

export type HoverCardProps = React.ComponentProps<typeof BasePopover>;

export function HoverCard(props: HoverCardProps) {
  const { trigger = <React.Fragment />, children, ...rest } = props;
  return <BasePopover {...rest} trigger={trigger}>{children ?? "Popover content"}</BasePopover>;
}

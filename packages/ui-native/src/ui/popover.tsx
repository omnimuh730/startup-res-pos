import * as React from "react";
import { Popover as BasePopover } from "../components/NavigationDisplay";

export type PopoverProps = React.ComponentProps<typeof BasePopover>;

export function Popover(props: PopoverProps) {
  const { trigger = <React.Fragment />, children, ...rest } = props;
  return <BasePopover {...rest} trigger={trigger}>{children ?? "Popover content"}</BasePopover>;
}

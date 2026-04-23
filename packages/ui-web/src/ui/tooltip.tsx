import * as React from "react";
import { Tooltip as BaseTooltip } from "../components/NavigationDisplay";

export type TooltipProps = React.ComponentProps<typeof BaseTooltip>;

export function Tooltip(props: TooltipProps) {
  const { content = "Helpful hint", children, ...rest } = props;
  return <BaseTooltip {...rest} content={content}>{children ?? <React.Fragment />}</BaseTooltip>;
}

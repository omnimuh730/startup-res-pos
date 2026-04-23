import * as React from "react";
import { Card as BaseCard } from "../components/Card";

export type ScrollAreaProps = React.ComponentProps<typeof BaseCard>;

export function ScrollArea(props: ScrollAreaProps) {
  return <BaseCard {...props}>{props.children ?? "Layout container"}</BaseCard>;
}

import * as React from "react";
import { Card as BaseCard } from "../components/Card";

export type ResizableProps = React.ComponentProps<typeof BaseCard>;

export function Resizable(props: ResizableProps) {
  return <BaseCard {...props}>{props.children ?? "Layout container"}</BaseCard>;
}

import * as React from "react";
import { Card as BaseCard } from "../components/Card";

export type AspectRatioProps = React.ComponentProps<typeof BaseCard>;

export function AspectRatio(props: AspectRatioProps) {
  return <BaseCard {...props}>{props.children ?? "Layout container"}</BaseCard>;
}

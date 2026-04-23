import * as React from "react";
import { CardDescription as BaseCardDescription } from "../components/Card";

export type LabelProps = React.ComponentProps<typeof BaseCardDescription>;

export function Label(props: LabelProps) {
  return <BaseCardDescription {...props}>{props.children ?? "Field label"}</BaseCardDescription>;
}

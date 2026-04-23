import * as React from "react";
import { Card as BaseCard } from "../components/Card";

export type SeparatorProps = React.ComponentProps<typeof BaseCard>;

export function Separator(props: SeparatorProps) {
  return <BaseCard {...props} />;
}

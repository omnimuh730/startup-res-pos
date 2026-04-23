import * as React from "react";
import { Card as BaseCard, CardDescription } from "../components/Card";

export type CardProps = React.ComponentProps<typeof BaseCard>;

export function Card(props: CardProps) {
  return <BaseCard {...props}>{props.children ?? <CardDescription>Card container</CardDescription>}</BaseCard>;
}

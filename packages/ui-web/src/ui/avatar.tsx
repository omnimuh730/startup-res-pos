import * as React from "react";
import { Card, CardTitle } from "../components/Card";

export type AvatarProps = React.ComponentProps<typeof Card>;

export function Avatar(props: AvatarProps) {
  return <Card {...props}>{props.children ?? <CardTitle>User</CardTitle>}</Card>;
}

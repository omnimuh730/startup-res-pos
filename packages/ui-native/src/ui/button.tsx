import * as React from "react";
import { Button as BaseButton } from "../components/Button";

export type ButtonProps = React.ComponentProps<typeof BaseButton>;

export function Button(props: ButtonProps) {
  return <BaseButton variant="primary" {...props}>{props.children ?? "Action"}</BaseButton>;
}

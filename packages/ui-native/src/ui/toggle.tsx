import * as React from "react";
import { Toggle as BaseToggle } from "../components/Selection";

export type ToggleProps = React.ComponentProps<typeof BaseToggle>;

export function Toggle(props: ToggleProps) {
  return <BaseToggle label={props.label ?? "Enabled"} {...props} />;
}

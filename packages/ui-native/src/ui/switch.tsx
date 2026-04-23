import * as React from "react";
import { Toggle as BaseToggle } from "../components/Selection";

export type SwitchProps = React.ComponentProps<typeof BaseToggle>;

export function Switch(props: SwitchProps) {
  return <BaseToggle label={props.label ?? "Enabled"} {...props} />;
}

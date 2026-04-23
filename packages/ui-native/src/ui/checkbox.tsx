import * as React from "react";
import { Checkbox as BaseCheckbox } from "../components/Selection";

export type CheckboxProps = React.ComponentProps<typeof BaseCheckbox>;

export function Checkbox(props: CheckboxProps) {
  return <BaseCheckbox label={props.label ?? "Accept terms"} {...props} />;
}

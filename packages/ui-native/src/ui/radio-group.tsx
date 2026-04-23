import * as React from "react";
import { Radio, RadioGroup as BaseRadioGroup } from "../components/Selection";

export type RadioGroupProps = React.ComponentProps<typeof BaseRadioGroup>;

export function RadioGroup(props: RadioGroupProps) {
  return <BaseRadioGroup {...props}>{props.children ?? <><Radio checked label="Primary" /><Radio label="Secondary" /></>}</BaseRadioGroup>;
}

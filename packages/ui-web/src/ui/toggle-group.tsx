import * as React from "react";
import { RadioGroup as BaseRadioGroup, Toggle } from "../components/Selection";

export type ToggleGroupProps = React.ComponentProps<typeof BaseRadioGroup>;

export function ToggleGroup(props: ToggleGroupProps) {
  return <BaseRadioGroup {...props}>{props.children ?? <><Toggle label="Alpha" checked /><Toggle label="Beta" /></>}</BaseRadioGroup>;
}

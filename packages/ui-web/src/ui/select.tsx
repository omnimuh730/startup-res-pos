import * as React from "react";
import { Select as BaseSelect } from "../components/FormExtras";

export type SelectProps = React.ComponentProps<typeof BaseSelect>;

export function Select(props: SelectProps) {
  const options = props.options ?? [{ label: "One", value: "one" }, { label: "Two", value: "two" }];
  return <BaseSelect {...props} options={options} />;
}

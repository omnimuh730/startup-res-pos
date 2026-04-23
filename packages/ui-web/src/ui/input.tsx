import * as React from "react";
import { Input as BaseInput } from "../components/Input";

export type InputProps = React.ComponentProps<typeof BaseInput>;

export function Input(props: InputProps) {
  return <BaseInput label="Input" placeholder="Type here" {...props} />;
}

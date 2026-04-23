import * as React from "react";
import { Textarea as BaseTextarea } from "../components/Input";

export type TextareaProps = React.ComponentProps<typeof BaseTextarea>;

export function Textarea(props: TextareaProps) {
  return <BaseTextarea label="Details" placeholder="Type details" {...props} />;
}

import * as React from "react";
import { Alert as BaseAlert } from "../components/Feedback";

export type AlertProps = React.ComponentProps<typeof BaseAlert>;

export function Alert(props: AlertProps) {
  return <BaseAlert {...props}>{props.children ?? "System notice"}</BaseAlert>;
}

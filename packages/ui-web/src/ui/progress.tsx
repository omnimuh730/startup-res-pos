import * as React from "react";
import { ProgressBar as BaseProgressBar } from "../components/DataDisplay";

export type ProgressProps = React.ComponentProps<typeof BaseProgressBar>;

export function Progress(props: ProgressProps) {
  return <BaseProgressBar value={64} {...props} />;
}

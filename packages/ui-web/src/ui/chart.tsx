import * as React from "react";
import { CircularProgress as BaseCircularProgress } from "../components/DataDisplay";

export type ChartProps = React.ComponentProps<typeof BaseCircularProgress>;

export function Chart(props: ChartProps) {
  return <BaseCircularProgress value={72} {...props} />;
}

import * as React from "react";
import { CalendarView as BaseCalendarView } from "../components/CalendarView";

export type CalendarProps = React.ComponentProps<typeof BaseCalendarView>;

export function Calendar(props: CalendarProps) {
  const { year = 2026, monthZeroBased = 3, ...rest } = props;
  return <BaseCalendarView {...rest} year={year} monthZeroBased={monthZeroBased} />;
}

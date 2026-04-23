import * as React from "react";
import { ListGroup as BaseListGroup } from "../components/NavigationDisplay";

export type CommandProps = React.ComponentProps<typeof BaseListGroup>;

export function Command(props: CommandProps) {
  return <BaseListGroup items={props.items ?? [{ id: "1", label: "Row 1", description: "Detail" }, { id: "2", label: "Row 2" }]} {...props} />;
}

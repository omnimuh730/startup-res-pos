import * as React from "react";
import { ListGroup as BaseListGroup } from "../components/NavigationDisplay";

export type TableProps = React.ComponentProps<typeof BaseListGroup>;

export function Table(props: TableProps) {
  return <BaseListGroup items={props.items ?? [{ id: "1", label: "Row 1", description: "Detail" }, { id: "2", label: "Row 2" }]} {...props} />;
}

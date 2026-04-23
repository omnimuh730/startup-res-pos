import * as React from "react";
import { ListGroup as BaseListGroup } from "../components/NavigationDisplay";

export type DropdownMenuProps = React.ComponentProps<typeof BaseListGroup>;

export function DropdownMenu(props: DropdownMenuProps) {
  return <BaseListGroup items={props.items ?? [{ id: "1", label: "Row 1", description: "Detail" }, { id: "2", label: "Row 2" }]} {...props} />;
}

import * as React from "react";
import { Drawer as BaseDrawer } from "../components/DataDisplay";

export type SidebarProps = React.ComponentProps<typeof BaseDrawer>;

export function Sidebar(props: SidebarProps) {
  return <BaseDrawer open {...props}>{props.children ?? "Navigation items"}</BaseDrawer>;
}

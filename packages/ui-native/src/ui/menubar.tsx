import * as React from "react";
import { Navbar as BaseNavbar } from "../components/NavigationDisplay";

export type MenubarProps = React.ComponentProps<typeof BaseNavbar>;

export function Menubar(props: MenubarProps) {
  return <BaseNavbar title={"title" in props ? props.title : "Navigation"} {...props} />;
}

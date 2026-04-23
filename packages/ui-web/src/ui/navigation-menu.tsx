import * as React from "react";
import { Navbar as BaseNavbar } from "../components/NavigationDisplay";

export type NavigationMenuProps = React.ComponentProps<typeof BaseNavbar>;

export function NavigationMenu(props: NavigationMenuProps) {
  return <BaseNavbar title={"title" in props ? props.title : "Navigation"} {...props} />;
}

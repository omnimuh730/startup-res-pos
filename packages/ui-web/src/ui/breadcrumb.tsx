import * as React from "react";
import { Breadcrumbs as BaseBreadcrumbs } from "../components/NavigationDisplay";

export type BreadcrumbProps = React.ComponentProps<typeof BaseBreadcrumbs>;

export function Breadcrumb(props: BreadcrumbProps) {
  return <BaseBreadcrumbs items={props.items ?? [{ label: "Home", value: "home" }, { label: "Library", value: "library" }]} {...props} />;
}

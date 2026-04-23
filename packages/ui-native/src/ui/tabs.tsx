import * as React from "react";
import { Tabs as BaseTabs, TabList, TabPanel, TabTrigger } from "../components/Tabs";

export type TabsProps = React.ComponentProps<typeof BaseTabs>;

export function Tabs(props: TabsProps) {
  return <BaseTabs defaultValue="overview" {...props}><TabList><TabTrigger value="overview">Overview</TabTrigger><TabTrigger value="details">Details</TabTrigger></TabList><TabPanel value="overview">Overview content</TabPanel><TabPanel value="details">Details content</TabPanel></BaseTabs>;
}

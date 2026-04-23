import * as React from "react";
import { Tabs, TabList, TabPanel, TabTrigger } from "../components/Tabs";

export type AccordionProps = React.ComponentProps<typeof Tabs>;

export function Accordion(props: AccordionProps) {
  return <Tabs defaultValue="overview" {...props}><TabList><TabTrigger value="overview">Section</TabTrigger></TabList><TabPanel value="overview">Collapsible content</TabPanel></Tabs>;
}

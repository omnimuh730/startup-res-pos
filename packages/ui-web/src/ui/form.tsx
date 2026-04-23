import * as React from "react";
import { Card } from "../components/Card";
import { SearchBar } from "../components/FormExtras";
import { Input } from "../components/Input";

export type FormProps = React.HTMLAttributes<HTMLDivElement>;

export function Form(props: FormProps) {
  return <Card {...props}><Input label="Email" placeholder="name@example.com" /><SearchBar placeholder="Search records" /></Card>;
}

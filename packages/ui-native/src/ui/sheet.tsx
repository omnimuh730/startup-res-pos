import * as React from "react";
import { BottomSheet as BaseBottomSheet } from "../components/DataDisplay";

export type SheetProps = React.ComponentProps<typeof BaseBottomSheet>;

export function Sheet(props: SheetProps) {
  return <BaseBottomSheet open {...props}>{props.children ?? "Sheet content"}</BaseBottomSheet>;
}

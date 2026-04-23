import * as React from "react";
import { Pagination as BasePagination } from "../components/DataDisplay";

export type PaginationProps = React.ComponentProps<typeof BasePagination>;

export function Pagination(props: PaginationProps) {
  return <BasePagination page={1} totalPages={10} {...props} />;
}

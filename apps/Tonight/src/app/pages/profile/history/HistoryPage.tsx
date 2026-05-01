import { HistoryPage as HistoryPageImpl } from "./history/HistoryPageImpl";

type HistoryPageProps = Parameters<typeof HistoryPageImpl>[0];

export function HistoryPage(props: HistoryPageProps) {
  return <HistoryPageImpl {...props} />;
}

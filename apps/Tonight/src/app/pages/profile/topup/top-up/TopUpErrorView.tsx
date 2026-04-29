import { AlertCircle } from "lucide-react";
import { Button } from "../../../../components/ds/Button";
import { Text } from "../../../../components/ds/Text";
import { PageHeader } from "../../profileHelpers";

interface Props {
  onBack: () => void;
  errorMsg: string | null;
  onCancel: () => void;
  onRetry: () => void;
}

export function TopUpErrorView({ onBack, errorMsg, onCancel, onRetry }: Props) {
  return (
    <div className="pb-8">
      <PageHeader title="Top Up Failed" onBack={onBack} />
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="w-20 h-20 rounded-full bg-destructive/10 flex items-center justify-center mb-5"><AlertCircle className="w-10 h-10 text-destructive" /></div>
        <Text className="text-[1.25rem] mb-2" style={{ fontWeight: 700 }}>Payment Couldn't Be Completed</Text>
        <Text className="text-muted-foreground text-[0.875rem]">{errorMsg ?? "We couldn't reach your payment provider."}</Text>
        <Text className="text-muted-foreground text-[0.75rem] mt-3">No funds were deducted.</Text>
        <div className="w-full mt-8 grid grid-cols-2 gap-2">
          <Button variant="ghost" onClick={onCancel}>Cancel</Button>
          <Button variant="primary" onClick={onRetry}>Try Again</Button>
        </div>
      </div>
    </div>
  );
}

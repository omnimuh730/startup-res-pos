import { Animate } from "../../../components/ds/Animate";
import { Button } from "../../../components/ds/Button";
import { Heading, Text } from "../../../components/ds/Text";
import { Calendar, CheckCircle2 } from "lucide-react";

export function EmptyState({
  icon: Icon,
  title,
  description,
}: {
  icon: typeof Calendar;
  title: string;
  description: string;
}) {
  return (
    <Animate preset="fadeIn" duration={0.4}>
      <div className="rounded-[1.75rem] border border-border bg-card px-6 py-12 text-center shadow-[0_4px_18px_rgba(0,0,0,0.05)]">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
          <Icon className="h-7 w-7 text-primary" />
        </div>
        <Heading level={4} className="text-foreground">
          {title}
        </Heading>
        <Text className="mx-auto mt-1 max-w-xs text-[0.875rem] leading-relaxed text-muted-foreground">
          {description}
        </Text>
        <Button variant="primary" size="sm" radius="full" className="mt-5 font-bold" leftIcon={<CheckCircle2 className="h-4 w-4" />}>
          Find a restaurant
        </Button>
      </div>
    </Animate>
  );
}

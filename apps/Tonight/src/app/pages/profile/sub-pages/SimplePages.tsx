import { Card } from "../../../components/ds/Card";
import { ProgressBar } from "../../../components/ds/ProgressBar";
import { Text } from "../../../components/ds/Text";
import { PageHeader } from "../profileHelpers";

export function OrdersPage({ onBack }: { onBack: () => void }) {
  return (
    <div className="pb-8">
      <PageHeader title="Orders" onBack={onBack} />
      <div className="text-center mb-4">
        <Text className="text-[2.5rem]" style={{ fontWeight: 700 }}>47</Text>
        <Text className="text-muted-foreground text-[0.75rem]">Total Orders</Text>
      </div>
      <div className="space-y-3">
        {[
          { name: "Sakura Omakase", date: "Apr 8", amount: "$42.50", items: 3 },
          { name: "Bella Napoli", date: "Apr 5", amount: "$28.00", items: 2 },
          { name: "Le Petit Bistro", date: "Mar 15", amount: "$65.00", items: 4 },
          { name: "Gangnam BBQ", date: "Mar 10", amount: "$55.00", items: 5 },
        ].map((o, i) => (
          <Card key={i} variant="filled" padding="sm" radius="lg">
            <div className="flex items-center justify-between">
              <div>
                <Text className="text-[0.8125rem]" style={{ fontWeight: 600 }}>{o.name}</Text>
                <Text className="text-muted-foreground text-[0.6875rem]">{o.date} · {o.items} items</Text>
              </div>
              <Text style={{ fontWeight: 600 }}>{o.amount}</Text>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

export function ThisMonthPage({ onBack }: { onBack: () => void }) {
  return (
    <div className="pb-8">
      <PageHeader title="This Month's Spending" onBack={onBack} />
      <div className="text-center mb-5">
        <Text className="text-[2.5rem] text-primary" style={{ fontWeight: 700 }}>$218</Text>
        <Text className="text-muted-foreground text-[0.75rem]">April 2026</Text>
      </div>
      <div className="space-y-3">
        <div className="flex justify-between text-[0.8125rem]">
          <Text className="text-muted-foreground">Dining Out</Text>
          <Text style={{ fontWeight: 600 }}>$178.00</Text>
        </div>
        <ProgressBar value={82} color="primary" size="sm" />
        <div className="flex justify-between text-[0.8125rem]">
          <Text className="text-muted-foreground">Delivery</Text>
          <Text style={{ fontWeight: 600 }}>$40.00</Text>
        </div>
        <ProgressBar value={18} color="info" size="sm" />
      </div>
      <div className="mt-5 p-3 rounded-xl bg-secondary">
        <div className="flex justify-between text-[0.8125rem]">
          <Text className="text-muted-foreground">vs Last Month</Text>
          <Text className="text-success" style={{ fontWeight: 600 }}>{"\u2193"} 12% less</Text>
        </div>
      </div>
    </div>
  );
}

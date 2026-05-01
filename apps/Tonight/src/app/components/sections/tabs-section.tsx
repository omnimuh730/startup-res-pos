import { SectionWrapper, ComponentCard } from "../section-wrapper";
import { Tabs, TabList, TabTrigger, TabPanel } from "../ds";
import { Home, Settings, User, Bell, BarChart3 } from "lucide-react";

export function TabsSection() {
  return (
    <SectionWrapper
      id="tabs-ds"
      title="Tabs"
      description="Composable tab component with underline, pill, and boxed variants. Supports icons, badges, sizes, and controlled/uncontrolled modes."
    >
      <ComponentCard title="Underline Variant (Default)">
        <Tabs defaultValue="overview" variant="underline">
          <TabList>
            <TabTrigger value="overview">Overview</TabTrigger>
            <TabTrigger value="analytics">Analytics</TabTrigger>
            <TabTrigger value="settings">Settings</TabTrigger>
            <TabTrigger value="billing">Billing</TabTrigger>
          </TabList>
          <TabPanel value="overview" className="p-4 text-[0.875rem] text-muted-foreground">
            Welcome to the overview. This tab displays general dashboard information and key metrics at a glance.
          </TabPanel>
          <TabPanel value="analytics" className="p-4 text-[0.875rem] text-muted-foreground">
            Analytics data with charts and trends would appear here.
          </TabPanel>
          <TabPanel value="settings" className="p-4 text-[0.875rem] text-muted-foreground">
            Configure your preferences, notifications, and account settings.
          </TabPanel>
          <TabPanel value="billing" className="p-4 text-[0.875rem] text-muted-foreground">
            Manage your subscription, view invoices, and update payment methods.
          </TabPanel>
        </Tabs>
      </ComponentCard>

      <ComponentCard title="Pill Variant">
        <Tabs defaultValue="all" variant="pill">
          <TabList>
            <TabTrigger value="all">All Items</TabTrigger>
            <TabTrigger value="active">Active</TabTrigger>
            <TabTrigger value="archived">Archived</TabTrigger>
          </TabList>
          <TabPanel value="all" className="mt-4 p-4 text-[0.875rem] text-muted-foreground border border-border rounded-xl">
            Showing all 24 items across every category.
          </TabPanel>
          <TabPanel value="active" className="mt-4 p-4 text-[0.875rem] text-muted-foreground border border-border rounded-xl">
            18 active items found.
          </TabPanel>
          <TabPanel value="archived" className="mt-4 p-4 text-[0.875rem] text-muted-foreground border border-border rounded-xl">
            6 archived items.
          </TabPanel>
        </Tabs>
      </ComponentCard>

      <ComponentCard title="Boxed Variant">
        <Tabs defaultValue="daily" variant="boxed">
          <TabList>
            <TabTrigger value="daily">Daily</TabTrigger>
            <TabTrigger value="weekly">Weekly</TabTrigger>
            <TabTrigger value="monthly">Monthly</TabTrigger>
            <TabTrigger value="yearly">Yearly</TabTrigger>
          </TabList>
          <TabPanel value="daily" className="mt-4 p-4 text-[0.875rem] text-muted-foreground">
            Daily view: Showing results for today.
          </TabPanel>
          <TabPanel value="weekly" className="mt-4 p-4 text-[0.875rem] text-muted-foreground">
            Weekly view: Summarizing the last 7 days.
          </TabPanel>
          <TabPanel value="monthly" className="mt-4 p-4 text-[0.875rem] text-muted-foreground">
            Monthly view: Aggregated data for this month.
          </TabPanel>
          <TabPanel value="yearly" className="mt-4 p-4 text-[0.875rem] text-muted-foreground">
            Yearly view: Annual summary and trends.
          </TabPanel>
        </Tabs>
      </ComponentCard>

      <ComponentCard title="With Icons & Badges">
        <Tabs defaultValue="home" variant="underline">
          <TabList>
            <TabTrigger value="home" icon={<Home className="w-4 h-4" />}>Home</TabTrigger>
            <TabTrigger value="profile" icon={<User className="w-4 h-4" />}>Profile</TabTrigger>
            <TabTrigger value="notifications" icon={<Bell className="w-4 h-4" />} badge={5}>Notifications</TabTrigger>
            <TabTrigger value="analytics" icon={<BarChart3 className="w-4 h-4" />} badge="New">Analytics</TabTrigger>
            <TabTrigger value="settings" icon={<Settings className="w-4 h-4" />} disabled>Settings</TabTrigger>
          </TabList>
          <TabPanel value="home" className="p-4 text-[0.875rem] text-muted-foreground">Home content here.</TabPanel>
          <TabPanel value="profile" className="p-4 text-[0.875rem] text-muted-foreground">Profile content here.</TabPanel>
          <TabPanel value="notifications" className="p-4 text-[0.875rem] text-muted-foreground">You have 5 new notifications.</TabPanel>
          <TabPanel value="analytics" className="p-4 text-[0.875rem] text-muted-foreground">New analytics dashboard.</TabPanel>
        </Tabs>
      </ComponentCard>

      <ComponentCard title="Sizes">
        <div className="space-y-6">
          {(["sm", "md", "lg"] as const).map((size) => (
            <div key={size}>
              <p className="text-[0.6875rem] text-muted-foreground font-mono mb-2">size="{size}"</p>
              <Tabs defaultValue="a" variant="pill" size={size}>
                <TabList>
                  <TabTrigger value="a">First</TabTrigger>
                  <TabTrigger value="b">Second</TabTrigger>
                  <TabTrigger value="c">Third</TabTrigger>
                </TabList>
              </Tabs>
            </div>
          ))}
        </div>
      </ComponentCard>
    </SectionWrapper>
  );
}

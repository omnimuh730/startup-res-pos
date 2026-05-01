import { SectionWrapper, ComponentCard } from "../section-wrapper";
import { Alert, Banner, Tooltip, Popover, Button, useToast } from "../ds";
import { Info, Settings, HelpCircle } from "lucide-react";

export function FeedbackSection() {
  const { success, error, warning, info } = useToast();

  return (
    <SectionWrapper
      id="feedback-ds"
      title="Feedback & Overlays"
      description="Toast notifications, alert banners, tooltips, and popovers — for user communication and contextual help."
    >
      {/* Toast */}
      <ComponentCard title="Toast / Snackbar">
        <p className="text-[0.75rem] text-muted-foreground mb-3">Click buttons to trigger toast notifications (top-right)</p>
        <div className="flex flex-wrap gap-3">
          <Button variant="primary" size="sm" onClick={() => success("Reservation confirmed!", "Your table is booked for 7:30 PM")}>
            Success Toast
          </Button>
          <Button variant="destructive" size="sm" onClick={() => error("Payment failed", "Please check your card details and try again")}>
            Error Toast
          </Button>
          <Button variant="outline" size="sm" onClick={() => warning("Low stock", "Only 2 items left at this price")}>
            Warning Toast
          </Button>
          <Button variant="secondary" size="sm" onClick={() => info("New feature", "Check out our new date picker component!")}>
            Info Toast
          </Button>
        </div>
      </ComponentCard>

      {/* Alert */}
      <ComponentCard title="Alert Variants">
        <div className="space-y-3 max-w-xl">
          <Alert color="info" title="Booking update" dismissible>
            Your check-in time has been updated to 3:00 PM.
          </Alert>
          <Alert color="success" title="Order delivered!">
            Your order has been delivered successfully.
          </Alert>
          <Alert color="warning" title="High demand area" dismissible>
            Delivery times may be longer than usual.
          </Alert>
          <Alert color="destructive" title="Payment declined" dismissible>
            Please update your payment method to continue.
          </Alert>
        </div>
      </ComponentCard>

      <ComponentCard title="Alert Styles">
        <div className="space-y-3 max-w-xl">
          <Alert variant="soft" color="info" title="Soft (default)" />
          <Alert variant="outlined" color="success" title="Outlined variant" />
          <Alert variant="filled" color="warning" title="Filled variant" />
          <Alert color="default" title="Default color">
            A neutral alert for general messages.
          </Alert>
        </div>
      </ComponentCard>

      {/* Banner */}
      <ComponentCard title="Banner">
        <div className="space-y-3 -mx-4 sm:-mx-6">
          <Banner color="info" dismissible>
            Free delivery on orders over $30! 
            <button className="underline ml-2 cursor-pointer">Shop now</button>
          </Banner>
          <Banner color="warning">
            Your restaurant is currently closed to new orders.
            <button className="underline ml-2 cursor-pointer">Go online</button>
          </Banner>
          <Banner color="destructive" dismissible>
            Your account verification is pending. 
            <button className="underline ml-2 cursor-pointer">Verify now</button>
          </Banner>
        </div>
      </ComponentCard>

      {/* Tooltip */}
      <ComponentCard title="Tooltip">
        <div className="flex flex-wrap gap-6 items-center">
          <Tooltip content="This is a top tooltip" placement="top">
            <Button variant="outline" size="sm">Top</Button>
          </Tooltip>
          <Tooltip content="Bottom tooltip here" placement="bottom">
            <Button variant="outline" size="sm">Bottom</Button>
          </Tooltip>
          <Tooltip content="Left side" placement="left">
            <Button variant="outline" size="sm">Left</Button>
          </Tooltip>
          <Tooltip content="Right side" placement="right">
            <Button variant="outline" size="sm">Right</Button>
          </Tooltip>
          <Tooltip content="Helpful hint about this feature">
            <HelpCircle className="w-5 h-5 text-muted-foreground cursor-help" />
          </Tooltip>
        </div>
      </ComponentCard>

      {/* Popover */}
      <ComponentCard title="Popover">
        <div className="flex flex-wrap gap-4">
          <Popover
            trigger={<Button variant="outline" size="sm" leftIcon={<Settings className="w-3.5 h-3.5" />}>Settings</Button>}
          >
            <div className="space-y-3">
              <h4 className="text-[0.8125rem]">Quick Settings</h4>
              <div className="space-y-2">
                <label className="flex items-center justify-between text-[0.75rem]">
                  <span>Dark Mode</span>
                  <input type="checkbox" className="accent-primary" />
                </label>
                <label className="flex items-center justify-between text-[0.75rem]">
                  <span>Notifications</span>
                  <input type="checkbox" defaultChecked className="accent-primary" />
                </label>
                <label className="flex items-center justify-between text-[0.75rem]">
                  <span>Sounds</span>
                  <input type="checkbox" className="accent-primary" />
                </label>
              </div>
            </div>
          </Popover>

          <Popover
            trigger={<Button variant="outline" size="sm" leftIcon={<Info className="w-3.5 h-3.5" />}>More Info</Button>}
          >
            <div>
              <h4 className="text-[0.8125rem] mb-1">Superhost Status</h4>
              <p className="text-[0.75rem] text-muted-foreground">
                Superhosts are experienced, highly rated hosts who are committed to providing great stays.
              </p>
            </div>
          </Popover>
        </div>
      </ComponentCard>
    </SectionWrapper>
  );
}

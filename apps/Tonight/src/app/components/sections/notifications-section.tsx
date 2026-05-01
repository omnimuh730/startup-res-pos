import { SectionWrapper, ComponentCard } from "../section-wrapper";
import { toast, Toaster } from "sonner";
import {
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Info,
  X,
  Bell,
} from "lucide-react";

export function NotificationsSection() {
  return (
    <SectionWrapper
      id="notifications"
      title="Notifications"
      description="Alerts, banners, and toast notifications for user feedback."
    >
      <Toaster position="top-right" richColors />

      <ComponentCard title="Inline Alerts">
        <div className="space-y-4 max-w-xl">
          <div className="flex items-start gap-3 p-4 rounded-xl bg-success/10 border border-success/20">
            <CheckCircle2 className="w-5 h-5 text-success shrink-0 mt-0.5" />
            <div>
              <p className="text-[0.875rem]">Success</p>
              <p className="text-[0.8125rem] text-muted-foreground">
                Your changes have been saved successfully.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-4 rounded-xl bg-warning/10 border border-warning/20">
            <AlertTriangle className="w-5 h-5 text-warning shrink-0 mt-0.5" />
            <div>
              <p className="text-[0.875rem]">Warning</p>
              <p className="text-[0.8125rem] text-muted-foreground">
                Your trial expires in 3 days. Upgrade now to keep access.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-4 rounded-xl bg-destructive/10 border border-destructive/20">
            <XCircle className="w-5 h-5 text-destructive shrink-0 mt-0.5" />
            <div>
              <p className="text-[0.875rem]">Error</p>
              <p className="text-[0.8125rem] text-muted-foreground">
                Something went wrong. Please try again later.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-4 rounded-xl bg-info/10 border border-info/20">
            <Info className="w-5 h-5 text-info shrink-0 mt-0.5" />
            <div>
              <p className="text-[0.875rem]">Info</p>
              <p className="text-[0.8125rem] text-muted-foreground">
                A new version is available. Refresh to update.
              </p>
            </div>
          </div>
        </div>
      </ComponentCard>

      <ComponentCard title="Dismissible Banner">
        <div className="max-w-xl">
          <div className="flex items-center justify-between p-4 rounded-xl bg-primary text-primary-foreground">
            <div className="flex items-center gap-3">
              <Bell className="w-5 h-5" />
              <p className="text-[0.875rem]">
                New features available! Check out what's new in v2.0.
              </p>
            </div>
            <button className="p-1 hover:bg-white/20 rounded-md cursor-pointer">
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      </ComponentCard>

      <ComponentCard title="Toast Notifications">
        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => toast.success("Changes saved successfully!")}
            className="px-4 py-2 text-[0.875rem] bg-success text-success-foreground rounded-lg hover:opacity-90 cursor-pointer"
          >
            Success Toast
          </button>
          <button
            onClick={() => toast.error("Something went wrong.")}
            className="px-4 py-2 text-[0.875rem] bg-destructive text-destructive-foreground rounded-lg hover:opacity-90 cursor-pointer"
          >
            Error Toast
          </button>
          <button
            onClick={() => toast.warning("Please check your input.")}
            className="px-4 py-2 text-[0.875rem] bg-warning text-warning-foreground rounded-lg hover:opacity-90 cursor-pointer"
          >
            Warning Toast
          </button>
          <button
            onClick={() => toast.info("Here's some useful information.")}
            className="px-4 py-2 text-[0.875rem] bg-info text-info-foreground rounded-lg hover:opacity-90 cursor-pointer"
          >
            Info Toast
          </button>
          <button
            onClick={() =>
              toast("New message received", {
                description: "John sent you a message.",
                action: { label: "View", onClick: () => {} },
              })
            }
            className="px-4 py-2 text-[0.875rem] border border-border rounded-lg hover:bg-secondary cursor-pointer"
          >
            Action Toast
          </button>
        </div>
      </ComponentCard>
    </SectionWrapper>
  );
}

export type NotificationTab = "all" | "unread" | "read";

export const tabs: { id: NotificationTab; label: string }[] = [
  { id: "all", label: "All" },
  { id: "unread", label: "Unread" },
  { id: "read", label: "Read" },
];

type DeepLinkTarget = {
  to: string;
  state?: unknown;
};

export type { DeepLinkTarget };

import type { CSSProperties, ReactNode } from "react";
import { Button } from "./Button";
import { CalendarView } from "./CalendarView";
import { MapView } from "./MapView";
import { Input, PasswordInput, Textarea } from "./Input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./Card";
import { Alert, Banner, ToastProvider, useToast } from "./Feedback";
import { BottomSheet, CircularProgress, Drawer, Pagination, ProgressBar, Rating, StepProgress } from "./DataDisplay";
import { FileUploader, MultiSelect, NumberInput, SearchBar, Select, StepperCounter } from "./FormExtras";
import { Animate, AnimatePresence, CalendarGrid, ChatBubble, ChatContainer, ChatInput, OrderSummary, PaymentMethod, Stagger, StaggerItem } from "./MacroMotion";
import { Breadcrumbs, Carousel, EmptyState, ListGroup, Navbar, Overlay, Popover, Tooltip } from "./NavigationDisplay";
import { Checkbox, Radio, RadioGroup, Toggle } from "./Selection";
import { Modal, ModalBody, ModalFooter, ModalHeader } from "./Modal";
import { TabList, TabPanel, Tabs, TabTrigger } from "./Tabs";
import { useWebTheme } from "../theme/provider";

type CompatProps = {
  children?: ReactNode;
  style?: CSSProperties;
};

function Box({ children, style }: CompatProps) {
  const { colors } = useWebTheme();
  return (
    <div style={{ border: `1px solid ${colors.border}`, borderRadius: 10, padding: 10, background: colors.card, ...style }}>
      {children}
    </div>
  );
}

export const Container = (props: CompatProps) => <div style={{ width: "100%", ...props.style }}>{props.children}</div>;
export const Stack = (props: CompatProps) => <div style={{ display: "flex", flexDirection: "column", gap: 8, ...props.style }}>{props.children}</div>;
export const HStack = (props: CompatProps) => <div style={{ display: "flex", flexDirection: "row", gap: 8, ...props.style }}>{props.children}</div>;
export const VStack = Stack;
export const Grid = (props: CompatProps) => <div style={{ display: "grid", gap: 8, gridTemplateColumns: "repeat(2, minmax(0, 1fr))", ...props.style }}>{props.children}</div>;

export const Heading = ({ children }: CompatProps) => <h3>{children}</h3>;
export const TextLabel = ({ children }: CompatProps) => <span>{children}</span>;
export { Button };
export const Avatar = ({ children, style }: CompatProps) => (
  <div style={{ width: 36, height: 36, borderRadius: 18, display: "grid", placeItems: "center", background: "#e5e7eb", ...style }}>
    {children ?? "A"}
  </div>
);
export const AvatarGroup = ({ children, style }: CompatProps) => <HStack style={{ alignItems: "center", ...style }}>{children}</HStack>;
export const Spinner = ({ style }: CompatProps) => <div style={{ width: 18, height: 18, border: "2px solid #d1d5db", borderTopColor: "#111827", borderRadius: "50%", animation: "spin 1s linear infinite", ...style }} />;
export const Skeleton = ({ style }: CompatProps) => <div style={{ width: "100%", height: 12, borderRadius: 6, background: "#e5e7eb", ...style }} />;
export const SkeletonCard = ({ style }: CompatProps) => <Box style={style}><Skeleton /><div style={{ height: 8 }} /><Skeleton /></Box>;
export const SkeletonListItem = ({ style }: CompatProps) => <HStack style={style}><Skeleton style={{ width: 24, height: 24, borderRadius: 12 }} /><Skeleton style={{ flex: 1 }} /></HStack>;
export const SkeletonTable = ({ style }: CompatProps) => <VStack style={style}><Skeleton /><Skeleton /><Skeleton /></VStack>;
export const DSBadge = ({ children, style }: CompatProps) => <span style={{ display: "inline-block", padding: "2px 8px", borderRadius: 999, background: "#e0f2fe", color: "#075985", fontSize: 12, ...style }}>{children ?? "Badge"}</span>;
export { Input, Textarea };
export { NumberInput, StepperCounter };
export { PasswordInput };
export { Checkbox, Radio, RadioGroup, Toggle };
export { Select, MultiSelect };
export const Slider = ({ style }: CompatProps) => <input type="range" min={0} max={100} defaultValue={40} style={{ width: "100%", ...style }} />;
export const RangeSlider = ({ style }: CompatProps) => <HStack style={style}><input type="range" min={0} max={100} defaultValue={20} style={{ flex: 1 }} /><input type="range" min={0} max={100} defaultValue={80} style={{ flex: 1 }} /></HStack>;
export { FileUploader };
export const DatePicker = CalendarView;
export const DateRangePicker = CalendarView;
export const TimePicker = ({ style }: CompatProps) => <input type="time" style={{ padding: 8, borderRadius: 6, border: "1px solid #d1d5db", ...style }} />;
export const TimeSlotPicker = ({ style }: CompatProps) => (
  <select style={{ padding: 8, borderRadius: 6, border: "1px solid #d1d5db", ...style }}>
    <option value="09:00">09:00</option>
    <option value="10:00">10:00</option>
  </select>
);
export { SearchBar };
export { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter };
export { ListGroup, EmptyState, Navbar, Breadcrumbs };
export { Tabs, TabList, TabTrigger, TabPanel };
export const Separator = ({ style }: CompatProps) => <div style={{ width: "100%", height: 1, background: "#e5e7eb", ...style }} />;
export const Ribbon = ({ children, style }: CompatProps) => <span style={{ background: "#fef3c7", color: "#92400e", padding: "4px 8px", borderRadius: 4, ...style }}>{children ?? "Ribbon"}</span>;
export const RibbonContainer = ({ children, style }: CompatProps) => <div style={{ position: "relative", ...style }}>{children}</div>;
export { Rating, Pagination };
export { Overlay };
export { Modal, ModalHeader, ModalBody, ModalFooter };
export { Carousel };
export { ProgressBar, StepProgress, CircularProgress, Drawer, BottomSheet };
export { Alert, Banner };
export { Tooltip, Popover };
export { ToastProvider, useToast };
export { OrderSummary, PaymentMethod, ChatBubble, ChatContainer, ChatInput, CalendarGrid };
export { Animate, Stagger, StaggerItem, AnimatePresence };
export { MapView };

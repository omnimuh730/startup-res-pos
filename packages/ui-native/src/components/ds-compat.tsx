import type { ReactNode } from "react";
import { StyleSheet, Text, View, type StyleProp, type ViewStyle } from "react-native";
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
import { useNativeTheme } from "../theme/provider";

type CompatProps = {
  children?: ReactNode;
  style?: StyleProp<ViewStyle>;
};

function Box({ children, style }: CompatProps) {
  const { colors } = useNativeTheme();
  return (
    <View style={[styles.box, { borderColor: colors.border, backgroundColor: colors.card }, style]}>
      {children}
    </View>
  );
}

export const Container = ({ children, style }: CompatProps) => <View style={style}>{children}</View>;
export const Stack = ({ children, style }: CompatProps) => <View style={[styles.stack, style]}>{children}</View>;
export const HStack = ({ children, style }: CompatProps) => <View style={[styles.hStack, style]}>{children}</View>;
export const VStack = Stack;
export const Grid = ({ children, style }: CompatProps) => <View style={[styles.grid, style]}>{children}</View>;

export const Heading = ({ children }: CompatProps) => <Text style={styles.heading}>{children}</Text>;
export const TextLabel = ({ children }: CompatProps) => <Text>{children}</Text>;
export { Button };
export const Avatar = ({ children, style }: CompatProps) => <View style={[styles.avatar, style]}><Text>{children ?? "A"}</Text></View>;
export const AvatarGroup = ({ children, style }: CompatProps) => <View style={[styles.hStack, style]}>{children}</View>;
export const Spinner = ({ style }: CompatProps) => <Text style={style as never}>Loading...</Text>;
export const Skeleton = ({ style }: CompatProps) => <View style={[styles.skeleton, style]} />;
export const SkeletonCard = ({ style }: CompatProps) => <Box style={style}><Skeleton /><View style={{ height: 8 }} /><Skeleton /></Box>;
export const SkeletonListItem = ({ style }: CompatProps) => <View style={[styles.hStack, style]}><Skeleton style={{ width: 24, height: 24, borderRadius: 12 }} /><Skeleton style={{ flex: 1 }} /></View>;
export const SkeletonTable = ({ style }: CompatProps) => <View style={[styles.stack, style]}><Skeleton /><Skeleton /><Skeleton /></View>;
export const DSBadge = ({ children, style }: CompatProps) => <View style={[styles.badge, style]}><Text style={styles.badgeText}>{children ?? "Badge"}</Text></View>;
export { Input, Textarea };
export { NumberInput, StepperCounter };
export { PasswordInput };
export { Checkbox, Radio, RadioGroup, Toggle };
export { Select, MultiSelect };
export const Slider = ({ style }: CompatProps) => <NumberInput value={40} style={style as never} />;
export const RangeSlider = ({ style }: CompatProps) => <View style={[styles.hStack, style]}><NumberInput value={20} /><NumberInput value={80} /></View>;
export { FileUploader };
export const DatePicker = CalendarView;
export const DateRangePicker = CalendarView;
export const TimePicker = ({ style }: CompatProps) => <Input style={style as never} label="Time" placeholder="09:00" />;
export const TimeSlotPicker = ({ style }: CompatProps) => (
  <View style={style}>
    <Select options={[{ label: "09:00", value: "09:00" }, { label: "10:00", value: "10:00" }]} />
  </View>
);
export { SearchBar };
export { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter };
export { ListGroup, EmptyState, Navbar, Breadcrumbs };
export { Tabs, TabList, TabTrigger, TabPanel };
export const Separator = ({ style }: CompatProps) => <View style={[styles.separator, style]} />;
export const Ribbon = ({ children, style }: CompatProps) => <View style={[styles.ribbon, style]}><Text style={styles.ribbonText}>{children ?? "Ribbon"}</Text></View>;
export const RibbonContainer = ({ children, style }: CompatProps) => <View style={style}>{children}</View>;
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

const styles = StyleSheet.create({
  box: {
    borderWidth: 1,
    borderRadius: 10,
    padding: 10
  },
  content: {
    marginTop: 8
  },
  stack: {
    gap: 8
  },
  hStack: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#e5e7eb"
  },
  skeleton: {
    height: 12,
    borderRadius: 6,
    backgroundColor: "#e5e7eb"
  },
  badge: {
    alignSelf: "flex-start",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 999,
    backgroundColor: "#e0f2fe"
  },
  badgeText: {
    color: "#075985",
    fontSize: 12
  },
  separator: {
    width: "100%",
    height: 1,
    backgroundColor: "#e5e7eb"
  },
  ribbon: {
    alignSelf: "flex-start",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    backgroundColor: "#fef3c7"
  },
  ribbonText: {
    color: "#92400e"
  },
  heading: {
    fontSize: 18,
    fontWeight: "700"
  }
});

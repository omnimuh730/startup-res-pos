import type { CSSProperties, ReactNode } from "react";

type UiProps = { children?: ReactNode; style?: CSSProperties; title?: string };

function UiBlock({ children, style, title }: UiProps) {
  return (
    <div style={{ border: "1px solid #e5e7eb", borderRadius: 8, padding: 8, ...style }}>
      <strong style={{ display: "block", marginBottom: 6 }}>{title ?? "UI"}</strong>
      {children}
    </div>
  );
}

export const ContextMenu = (props: UiProps) => <UiBlock {...props} title="ContextMenu" />;
export const Progress = (props: UiProps) => <UiBlock {...props} title="Progress" />;
export const TextareaUi = (props: UiProps) => <UiBlock {...props} title="Textarea" />;
export const SkeletonUi = (props: UiProps) => <UiBlock {...props} title="Skeleton" />;
export const Menubar = (props: UiProps) => <UiBlock {...props} title="Menubar" />;
export const ScrollArea = (props: UiProps) => <UiBlock {...props} title="ScrollArea" />;
export const CarouselUi = (props: UiProps) => <UiBlock {...props} title="Carousel" />;
export const AlertDialog = (props: UiProps) => <UiBlock {...props} title="AlertDialog" />;
export const Table = (props: UiProps) => <UiBlock {...props} title="Table" />;
export const HoverCard = (props: UiProps) => <UiBlock {...props} title="HoverCard" />;
export const Command = (props: UiProps) => <UiBlock {...props} title="Command" />;
export const SliderUi = (props: UiProps) => <UiBlock {...props} title="Slider" />;
export const Breadcrumb = (props: UiProps) => <UiBlock {...props} title="Breadcrumb" />;
export const Sidebar = (props: UiProps) => <UiBlock {...props} title="Sidebar" />;
export const AlertUi = (props: UiProps) => <UiBlock {...props} title="Alert" />;
export const Accordion = (props: UiProps) => <UiBlock {...props} title="Accordion" />;
export const Sheet = (props: UiProps) => <UiBlock {...props} title="Sheet" />;
export const RadioGroupUi = (props: UiProps) => <UiBlock {...props} title="RadioGroup" />;
export const Label = (props: UiProps) => <UiBlock {...props} title="Label" />;
export const TooltipUi = (props: UiProps) => <UiBlock {...props} title="Tooltip" />;
export const TabsUi = (props: UiProps) => <UiBlock {...props} title="Tabs" />;
export const Switch = (props: UiProps) => <UiBlock {...props} title="Switch" />;
export const Form = (props: UiProps) => <UiBlock {...props} title="Form" />;
export const SelectUi = (props: UiProps) => <UiBlock {...props} title="Select" />;
export const CheckboxUi = (props: UiProps) => <UiBlock {...props} title="Checkbox" />;
export const DropdownMenu = (props: UiProps) => <UiBlock {...props} title="DropdownMenu" />;
export const PaginationUi = (props: UiProps) => <UiBlock {...props} title="Pagination" />;
export const SeparatorUi = (props: UiProps) => <UiBlock {...props} title="Separator" />;
export const Chart = (props: UiProps) => <UiBlock {...props} title="Chart" />;
export const Dialog = (props: UiProps) => <UiBlock {...props} title="Dialog" />;
export const Collapsible = (props: UiProps) => <UiBlock {...props} title="Collapsible" />;
export const InputOtp = (props: UiProps) => <UiBlock {...props} title="InputOtp" />;
export const AspectRatio = (props: UiProps) => <UiBlock {...props} title="AspectRatio" />;
export const DrawerUi = (props: UiProps) => <UiBlock {...props} title="Drawer" />;
export const Resizable = (props: UiProps) => <UiBlock {...props} title="Resizable" />;
export const ToggleUi = (props: UiProps) => <UiBlock {...props} title="Toggle" />;
export const CardUi = (props: UiProps) => <UiBlock {...props} title="Card" />;
export const PopoverUi = (props: UiProps) => <UiBlock {...props} title="Popover" />;
export const NavigationMenu = (props: UiProps) => <UiBlock {...props} title="NavigationMenu" />;
export const InputUi = (props: UiProps) => <UiBlock {...props} title="Input" />;
export const AvatarUi = (props: UiProps) => <UiBlock {...props} title="Avatar" />;
export const CalendarUi = (props: UiProps) => <UiBlock {...props} title="Calendar" />;
export const ButtonUi = (props: UiProps) => <UiBlock {...props} title="Button" />;
export const ToggleGroup = (props: UiProps) => <UiBlock {...props} title="ToggleGroup" />;
export const BadgeUi = (props: UiProps) => <UiBlock {...props} title="Badge" />;
export const Sonner = (props: UiProps) => <UiBlock {...props} title="Sonner" />;

import { StyleSheet, Text, View, type StyleProp, type ViewStyle } from "react-native";
import type { ReactNode } from "react";
import { useNativeTheme } from "../theme/provider";
import { Alert, Banner } from "../components/Feedback";
import { Breadcrumbs, Carousel, EmptyState, ListGroup, Navbar } from "../components/NavigationDisplay";
import { Button } from "../components/Button";
import { CalendarView } from "../components/CalendarView";
import { Card, CardContent, CardHeader, CardTitle } from "../components/Card";
import { Input } from "../components/Input";
import { MapView } from "../components/MapView";
import { Pagination, ProgressBar, Rating, StepProgress } from "../components/DataDisplay";
import { SearchBar } from "../components/FormExtras";
import { Tabs, TabList, TabPanel, TabTrigger } from "../components/Tabs";

type SectionProps = { children?: ReactNode; style?: StyleProp<ViewStyle> };

function SectionScaffold({ title, children, style }: SectionProps & { title: string }) {
  const { colors } = useNativeTheme();
  return (
    <View style={[styles.wrap, { borderColor: colors.border, backgroundColor: colors.card }, style]}>
      <Text style={{ color: colors.foreground, fontSize: 16, fontWeight: "700" }}>{title}</Text>
      <View style={styles.body}>{children}</View>
    </View>
  );
}

const makeSimpleSection = (title: string) => (props: SectionProps) => (
  <SectionScaffold title={title} {...props}>
    <Card><CardHeader><CardTitle>{title}</CardTitle></CardHeader><CardContent><SearchBar placeholder={`Search in ${title}`} /></CardContent></Card>
  </SectionScaffold>
);

export const ColorsSection = makeSimpleSection("ColorsSection");
export const TypographySection = makeSimpleSection("TypographySection");
export const GridSection = makeSimpleSection("GridSection");
export const LayoutSection = makeSimpleSection("LayoutSection");
export const IconsSection = makeSimpleSection("IconsSection");
export const AtomsSection = (props: SectionProps) => <SectionScaffold title="AtomsSection" {...props}><Button>Primary Action</Button><Rating value={4} /></SectionScaffold>;
export const InputsSection = (props: SectionProps) => <SectionScaffold title="InputsSection" {...props}><Input label="Email" placeholder="user@site.com" /><SearchBar /></SectionScaffold>;
export const FormControlsSection = makeSimpleSection("FormControlsSection");
export const AdvancedInputsSection = (props: SectionProps) => <SectionScaffold title="AdvancedInputsSection" {...props}><CalendarView year={2026} monthZeroBased={3} /><Input label="Date time" /></SectionScaffold>;
export const ButtonsSection = (props: SectionProps) => <SectionScaffold title="ButtonsSection" {...props}><Button variant="primary">Primary</Button><Button variant="outline">Outline</Button></SectionScaffold>;
export const CardsSection = (props: SectionProps) => <SectionScaffold title="CardsSection" {...props}><Card><CardHeader><CardTitle>Simple Card</CardTitle></CardHeader><CardContent>Reusable card content</CardContent></Card></SectionScaffold>;
export const ChipsSection = makeSimpleSection("ChipsSection");
export const BadgesSection = makeSimpleSection("BadgesSection");
export const AccordionSection = makeSimpleSection("AccordionSection");
export const NotificationsSection = (props: SectionProps) => <SectionScaffold title="NotificationsSection" {...props}><Alert>Important alert</Alert><Banner>Banner info</Banner></SectionScaffold>;
export const DataDisplaySection = (props: SectionProps) => <SectionScaffold title="DataDisplaySection" {...props}><ProgressBar value={42} /><StepProgress value={40} /></SectionScaffold>;
export const NavigationSection = (props: SectionProps) => <SectionScaffold title="NavigationSection" {...props}><Navbar title="Navigation" /><Breadcrumbs items={[{ label: "Home", value: "home" }]} /><ListGroup items={[{ id: "1", label: "Item" }]} /></SectionScaffold>;
export const TabsSection = (props: SectionProps) => <SectionScaffold title="TabsSection" {...props}><Tabs><TabList><TabTrigger value="a">A</TabTrigger></TabList><TabPanel value="a">Panel A</TabPanel></Tabs></SectionScaffold>;
export const PaginationSection = (props: SectionProps) => <SectionScaffold title="PaginationSection" {...props}><Pagination page={2} totalPages={8} /></SectionScaffold>;
export const FeedbackSection = (props: SectionProps) => <SectionScaffold title="FeedbackSection" {...props}><Alert>Something happened</Alert></SectionScaffold>;
export const OverlaySection = makeSimpleSection("OverlaySection");
export const ModalSection = makeSimpleSection("ModalSection");
export const SeparatorSection = makeSimpleSection("SeparatorSection");
export const RibbonSection = makeSimpleSection("RibbonSection");
export const RatingSection = (props: SectionProps) => <SectionScaffold title="RatingSection" {...props}><Rating value={5} /></SectionScaffold>;
export const CarouselSection = (props: SectionProps) => <SectionScaffold title="CarouselSection" {...props}><Carousel><Card><CardContent>Slide 1</CardContent></Card><Card><CardContent>Slide 2</CardContent></Card></Carousel></SectionScaffold>;
export const ProgressBarSection = (props: SectionProps) => <SectionScaffold title="ProgressBarSection" {...props}><ProgressBar value={64} /></SectionScaffold>;
export const AnimationSection = makeSimpleSection("AnimationSection");
export const MacroSection = makeSimpleSection("MacroSection");
export const TreeViewSection = makeSimpleSection("TreeViewSection");
export const MapSection = (props: SectionProps) => <SectionScaffold title="MapSection" {...props}><MapView markers={[{ id: "m1", latitude: 37.77, longitude: -122.41 }]} /></SectionScaffold>;
export const CalendarSection = (props: SectionProps) => <SectionScaffold title="CalendarSection" {...props}><CalendarView year={2026} monthZeroBased={0} /></SectionScaffold>;
export const ChartsSection = makeSimpleSection("ChartsSection");
export const FormsSection = (props: SectionProps) => <SectionScaffold title="FormsSection" {...props}><Input label="Name" /><Button>Submit</Button></SectionScaffold>;
export const TableSection = makeSimpleSection("TableSection");
export const ExtrasSection = (props: SectionProps) => <SectionScaffold title="ExtrasSection" {...props}><EmptyState /></SectionScaffold>;

const styles = StyleSheet.create({
  wrap: {
    borderWidth: 1,
    borderRadius: 10,
    padding: 12
  },
  body: {
    marginTop: 8
  }
});

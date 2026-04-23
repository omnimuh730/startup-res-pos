import { createBrowserRouter, Navigate } from "react-router";
import { lazy, Suspense, type ReactNode } from "react";

// Layout
const DesignSystem = lazy(() => import("./pages/DesignSystem"));
const HeroPage = lazy(() => import("./pages/HeroPage"));
const SampleDashboard = lazy(() => import("./pages/SampleDashboard"));

// Helper for named exports
const lz = (imp: () => Promise<{ [k: string]: any }>, name: string) =>
  lazy(() => imp().then((m) => ({ default: m[name] })));

// Foundation
const ColorsSection = lz(() => import("./components/sections/colors-section"), "ColorsSection");
const TypographySection = lz(() => import("./components/sections/typography-section"), "TypographySection");
const GridSection = lz(() => import("./components/sections/grid-section"), "GridSection");
const LayoutSection = lz(() => import("./components/sections/layout-section"), "LayoutSection");
const IconsSection = lz(() => import("./components/sections/icons-section"), "IconsSection");
const AtomsSection = lz(() => import("./components/sections/atoms-section"), "AtomsSection");

// Form & Inputs
const InputsSection = lz(() => import("./components/sections/inputs-section"), "InputsSection");
const FormControlsSection = lz(() => import("./components/sections/form-controls-section"), "FormControlsSection");
const AdvancedInputsSection = lz(() => import("./components/sections/advanced-inputs-section"), "AdvancedInputsSection");

// Components
const ButtonsSection = lz(() => import("./components/sections/buttons-section"), "ButtonsSection");
const ChipsSection = lz(() => import("./components/sections/chips-section"), "ChipsSection");
const BadgesSection = lz(() => import("./components/sections/badges-section"), "BadgesSection");
const AccordionSection = lz(() => import("./components/sections/accordion-section"), "AccordionSection");
const NotificationsSection = lz(() => import("./components/sections/notifications-section"), "NotificationsSection");
const DataDisplaySection = lz(() => import("./components/sections/data-display-section"), "DataDisplaySection");

// Sections with props
const CardsSectionPage = lz(() => import("./pages/section-wrappers"), "CardsSectionPage");
const RibbonSectionPage = lz(() => import("./pages/section-wrappers"), "RibbonSectionPage");
const ExtrasSectionPage = lz(() => import("./pages/section-wrappers"), "ExtrasSectionPage");

// Navigation
const NavigationSection = lz(() => import("./components/sections/navigation-section"), "NavigationSection");
const TabsSection = lz(() => import("./components/sections/tabs-section"), "TabsSection");
const PaginationSection = lz(() => import("./components/sections/pagination-section"), "PaginationSection");

// Feedback
const FeedbackSection = lz(() => import("./components/sections/feedback-section"), "FeedbackSection");
const OverlaySection = lz(() => import("./components/sections/overlay-section"), "OverlaySection");
const ModalSection = lz(() => import("./components/sections/modal-section"), "ModalSection");

// Reusable DS
const SeparatorSection = lz(() => import("./components/sections/separator-section"), "SeparatorSection");
const RatingSection = lz(() => import("./components/sections/rating-section"), "RatingSection");
const CarouselSection = lz(() => import("./components/sections/carousel-section"), "CarouselSection");
const ProgressBarSection = lz(() => import("./components/sections/progressbar-section"), "ProgressBarSection");
const AnimationSection = lz(() => import("./components/sections/animation-section"), "AnimationSection");

// Macro
const MacroSection = lz(() => import("./components/sections/macro-section"), "MacroSection");

// Advanced
const TreeViewSection = lz(() => import("./components/sections/treeview-section"), "TreeViewSection");
const MapSection = lz(() => import("./components/sections/map-section"), "MapSection");
const CalendarSection = lz(() => import("./components/sections/calendar-section"), "CalendarSection");
const ChartsSection = lz(() => import("./components/sections/charts-section"), "ChartsSection");
const FormsSection = lz(() => import("./components/sections/forms-section"), "FormsSection");
const TableSection = lz(() => import("./components/sections/table-section"), "TableSection");

function Loading() {
  return (
    <div className="flex items-center justify-center py-20">
      <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
    </div>
  );
}

function W({ children }: { children: ReactNode }) {
  return <Suspense fallback={<Loading />}>{children}</Suspense>;
}

export const router = createBrowserRouter([
  {
    path: "/",
    element: <W><DesignSystem /></W>,
    children: [
      { index: true, element: <W><HeroPage /></W> },
      // Foundation
      { path: "colors", element: <W><ColorsSection /></W> },
      { path: "typography", element: <W><TypographySection /></W> },
      { path: "grid", element: <W><GridSection /></W> },
      { path: "layout", element: <W><LayoutSection /></W> },
      { path: "icons", element: <W><IconsSection /></W> },
      { path: "atoms-ds", element: <W><AtomsSection /></W> },
      // Form & Inputs
      { path: "inputs", element: <W><InputsSection /></W> },
      { path: "form-controls-ds", element: <W><FormControlsSection /></W> },
      { path: "advanced-inputs-ds", element: <W><AdvancedInputsSection /></W> },
      // Components
      { path: "buttons", element: <W><ButtonsSection /></W> },
      { path: "cards", element: <W><CardsSectionPage /></W> },
      { path: "chips", element: <W><ChipsSection /></W> },
      { path: "badges", element: <W><BadgesSection /></W> },
      { path: "accordion", element: <W><AccordionSection /></W> },
      { path: "notifications", element: <W><NotificationsSection /></W> },
      { path: "data-display-ds", element: <W><DataDisplaySection /></W> },
      // Navigation
      { path: "navigation-ds", element: <W><NavigationSection /></W> },
      { path: "tabs-ds", element: <W><TabsSection /></W> },
      { path: "pagination-ds", element: <W><PaginationSection /></W> },
      // Feedback
      { path: "feedback-ds", element: <W><FeedbackSection /></W> },
      { path: "overlay-ds", element: <W><OverlaySection /></W> },
      { path: "modal-ds", element: <W><ModalSection /></W> },
      // Reusable DS
      { path: "separator-ds", element: <W><SeparatorSection /></W> },
      { path: "ribbon-ds", element: <W><RibbonSectionPage /></W> },
      { path: "rating-ds", element: <W><RatingSection /></W> },
      { path: "carousel-ds", element: <W><CarouselSection /></W> },
      { path: "progress-ds", element: <W><ProgressBarSection /></W> },
      { path: "animation-ds", element: <W><AnimationSection /></W> },
      // Macro
      { path: "macro-ds", element: <W><MacroSection /></W> },
      // Advanced
      { path: "treeview", element: <W><TreeViewSection /></W> },
      { path: "map", element: <W><MapSection /></W> },
      { path: "calendar", element: <W><CalendarSection /></W> },
      { path: "charts", element: <W><ChartsSection /></W> },
      { path: "forms", element: <W><FormsSection /></W> },
      { path: "table", element: <W><TableSection /></W> },
      { path: "extras", element: <W><ExtrasSectionPage /></W> },
      // Catch-all
      { path: "*", element: <Navigate to="/" replace /> },
    ],
  },
  {
    path: "/dashboard",
    element: <W><SampleDashboard /></W>,
  },
]);

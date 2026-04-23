import { useState, useEffect, useRef } from "react";
import {
  Palette, Type, LayoutGrid, Grid3X3, MousePointerClick, FormInput,
  CreditCard, ChevronDown, Bell, Layers, Menu, X, Copy, Check,
  Smile, Tag, CircleDot, FolderTree, Map, BarChart3, FileText, Table2,
  PanelTop, Minus, Star as StarIcon, ChevronsLeftRight, Maximize,
  Square, GalleryHorizontal, Activity, Sparkles, Box, User,
  ToggleLeft, ListChecks, CalendarDays, Clock, Search,
  Navigation, PanelLeftOpen, ArrowDownFromLine, List, Inbox,
  MessageSquare, AlertTriangle, MessageCircle, ShoppingCart, Wallet,
  Calendar,
} from "lucide-react";
import { Link, Outlet, useLocation } from "react-router";
import { ThemeCustomizer } from "../components/theme-customizer";
import { ToastProvider } from "../components/ds";

export const NAV_GROUPS = [
  {
    label: "Foundation",
    items: [
      { id: "colors", label: "Colors", icon: Palette },
      { id: "typography", label: "Typography", icon: Type },
      { id: "grid", label: "Grid System", icon: Grid3X3 },
      { id: "layout", label: "Layout & Spacing", icon: LayoutGrid },
      { id: "icons", label: "Icons", icon: Smile },
      { id: "atoms-ds", label: "Avatar / Spinner", icon: User },
    ],
  },
  {
    label: "Form & Inputs",
    items: [
      { id: "inputs", label: "Text Inputs", icon: FormInput },
      { id: "form-controls-ds", label: "Controls & Select", icon: ToggleLeft },
      { id: "advanced-inputs-ds", label: "Date / Time / Search", icon: CalendarDays },
    ],
  },
  {
    label: "Components",
    items: [
      { id: "buttons", label: "Buttons", icon: MousePointerClick },
      { id: "cards", label: "Cards & Boxes", icon: CreditCard },
      { id: "chips", label: "Chips & Tags", icon: Tag },
      { id: "badges", label: "Badges", icon: CircleDot },
      { id: "accordion", label: "Accordion", icon: ChevronDown },
      { id: "notifications", label: "Notifications", icon: Bell },
      { id: "data-display-ds", label: "List / Empty State", icon: List },
    ],
  },
  {
    label: "Navigation",
    items: [
      { id: "navigation-ds", label: "Nav / Drawer / Sheet", icon: Navigation },
      { id: "tabs-ds", label: "Tabs", icon: PanelTop },
      { id: "pagination-ds", label: "Pagination", icon: ChevronsLeftRight },
    ],
  },
  {
    label: "Feedback",
    items: [
      { id: "feedback-ds", label: "Toast / Alert / Tooltip", icon: AlertTriangle },
      { id: "overlay-ds", label: "Overlay", icon: Maximize },
      { id: "modal-ds", label: "Modal", icon: Square },
    ],
  },
  {
    label: "Reusable DS",
    items: [
      { id: "separator-ds", label: "Separator", icon: Minus },
      { id: "ribbon-ds", label: "Ribbon", icon: Tag },
      { id: "rating-ds", label: "Rating", icon: StarIcon },
      { id: "carousel-ds", label: "Carousel", icon: GalleryHorizontal },
      { id: "progress-ds", label: "Progress Bar", icon: Activity },
      { id: "animation-ds", label: "Animations", icon: Sparkles },
    ],
  },
  {
    label: "Macro",
    items: [
      { id: "macro-ds", label: "Cart / Pay / Chat / Cal", icon: ShoppingCart },
    ],
  },
  {
    label: "Advanced",
    items: [
      { id: "treeview", label: "Tree View", icon: FolderTree },
      { id: "map", label: "Map View", icon: Map },
      { id: "calendar", label: "Calendar View", icon: Calendar },
      { id: "charts", label: "Charts", icon: BarChart3 },
      { id: "forms", label: "Form Layouts", icon: FileText },
      { id: "table", label: "Tables", icon: Table2 },
      { id: "extras", label: "More Components", icon: Box },
    ],
  },
];

export const ALL_NAV_ITEMS = NAV_GROUPS.flatMap((g) => g.items);

export default function DesignSystem() {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const location = useLocation();
  const mainRef = useRef<HTMLElement>(null);

  const pathParts = location.pathname.split("/").filter(Boolean);
  const activePage = pathParts.length > 0 ? pathParts[pathParts.length - 1] : "";

  useEffect(() => {
    mainRef.current?.scrollTo(0, 0);
    window.scrollTo(0, 0);
  }, [location.pathname]);

  const copyTokens = async () => {
    const root = getComputedStyle(document.documentElement);
    const vars = [
      "--primary", "--primary-foreground", "--secondary", "--secondary-foreground",
      "--background", "--foreground", "--muted", "--muted-foreground", "--accent",
      "--destructive", "--success", "--warning", "--info", "--border", "--radius",
    ];
    const css = `:root {\n${vars.map((v) => `  ${v}: ${root.getPropertyValue(v).trim()};`).join("\n")}\n}`;

    try {
      await navigator.clipboard.writeText(css);
    } catch {
      const textarea = document.createElement("textarea");
      textarea.value = css;
      textarea.style.position = "fixed";
      textarea.style.opacity = "0";
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <ToastProvider position="top-right">
      <div className="min-h-screen bg-background">
        {/* Header */}
        <header className="fixed top-0 left-0 right-0 z-40 bg-background/80 backdrop-blur-xl border-b border-border">
          <div className="flex items-center justify-between px-4 lg:px-6 h-14">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setMobileNavOpen(!mobileNavOpen)}
                className="lg:hidden p-2 hover:bg-secondary rounded-lg cursor-pointer"
              >
                {mobileNavOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
              <Link to="/" className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center">
                  <Layers className="w-3.5 h-3.5 text-primary-foreground" />
                </div>
                <div className="flex items-baseline gap-2">
                  <h1 className="text-[0.9375rem] tracking-tight leading-none">Design System</h1>
                  <span className="text-[0.625rem] text-muted-foreground bg-muted px-1.5 py-0.5 rounded">v4.0</span>
                </div>
              </Link>
            </div>
            <div className="flex items-center gap-2">
              <Link
                to="/dashboard"
                className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-[0.8125rem] bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity cursor-pointer"
              >
                Sample Dashboard →
              </Link>
              <button
                onClick={copyTokens}
                className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-[0.8125rem] border border-border rounded-lg hover:bg-secondary transition-colors cursor-pointer"
              >
                {copied ? (
                  <><Check className="w-3.5 h-3.5 text-success" /> Copied</>
                ) : (
                  <><Copy className="w-3.5 h-3.5" /> Export Tokens</>
                )}
              </button>
            </div>
          </div>
        </header>

        <div className="flex pt-14">
          {/* Sidebar */}
          <aside
            className={`fixed lg:sticky top-14 left-0 z-30 h-[calc(100vh-3.5rem)] w-56 bg-background border-r border-border overflow-y-auto transition-transform lg:translate-x-0 shrink-0 ${
              mobileNavOpen ? "translate-x-0" : "-translate-x-full"
            }`}
          >
            <nav className="p-2.5 space-y-3 pb-8">
              {NAV_GROUPS.map((group) => (
                <div key={group.label}>
                  <p className="text-[0.5625rem] text-muted-foreground uppercase tracking-widest mb-1.5 px-2.5">
                    {group.label}
                  </p>
                  <div className="space-y-0.5">
                    {group.items.map(({ id, label, icon: Icon }) => (
                      <Link
                        key={id}
                        to={`/${id}`}
                        onClick={() => setMobileNavOpen(false)}
                        className={`w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-[0.75rem] transition-colors cursor-pointer ${
                          activePage === id
                            ? "bg-primary/10 text-primary"
                            : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                        }`}
                      >
                        <Icon className="w-3.5 h-3.5 shrink-0" />
                        <span className="truncate">{label}</span>
                      </Link>
                    ))}
                  </div>
                </div>
              ))}

              <div className="px-2 pt-2">
                <Link
                  to="/dashboard"
                  className="flex items-center gap-2 px-3 py-2 rounded-lg bg-primary/10 text-primary text-[0.75rem] hover:bg-primary/15 transition-colors cursor-pointer"
                >
                  <BarChart3 className="w-3.5 h-3.5" />
                  Sample Dashboard
                </Link>
              </div>
            </nav>
          </aside>

          {mobileNavOpen && (
            <div className="fixed inset-0 z-20 bg-black/30 lg:hidden" onClick={() => setMobileNavOpen(false)} />
          )}

          {/* Main */}
          <main ref={mainRef} className="flex-1 min-w-0 px-4 sm:px-5 lg:px-10 py-8 sm:py-10 max-w-5xl">
            <Outlet />
          </main>
        </div>

        <ThemeCustomizer />
      </div>
    </ToastProvider>
  );
}

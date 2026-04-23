import { useState } from "react";
import { SectionWrapper, ComponentCard } from "../section-wrapper";
import {
  Home, Search, Settings, User, Bell, Heart, Star, Mail,
  Phone, Camera, Calendar, Clock, MapPin, Globe, Lock, Unlock,
  Eye, EyeOff, Download, Upload, Share2, Trash2, Edit, Copy,
  Check, X, Plus, Minus, ChevronUp, ChevronDown, ChevronLeft, ChevronRight,
  ArrowUp, ArrowDown, ArrowLeft, ArrowRight, RefreshCw, RotateCcw,
  Sun, Moon, Cloud, Zap, Wifi, Bluetooth, Battery, Volume2,
  Play, Pause, SkipForward, SkipBack, Maximize, Minimize,
  Folder, File, Image, Video, Music, Database, Server, Code,
  Shield, AlertTriangle, Info, HelpCircle, MessageCircle, Send,
  Bookmark, Tag, Filter, SlidersHorizontal, BarChart3, PieChart,
  TrendingUp, Activity, Package, Gift, ShoppingCart, CreditCard,
  Layers, Layout, Grid3X3, List, Menu, MoreHorizontal, ExternalLink,
} from "lucide-react";

const allIcons = [
  { name: "Home", Icon: Home }, { name: "Search", Icon: Search }, { name: "Settings", Icon: Settings },
  { name: "User", Icon: User }, { name: "Bell", Icon: Bell }, { name: "Heart", Icon: Heart },
  { name: "Star", Icon: Star }, { name: "Mail", Icon: Mail }, { name: "Phone", Icon: Phone },
  { name: "Camera", Icon: Camera }, { name: "Calendar", Icon: Calendar }, { name: "Clock", Icon: Clock },
  { name: "MapPin", Icon: MapPin }, { name: "Globe", Icon: Globe }, { name: "Lock", Icon: Lock },
  { name: "Unlock", Icon: Unlock }, { name: "Eye", Icon: Eye }, { name: "EyeOff", Icon: EyeOff },
  { name: "Download", Icon: Download }, { name: "Upload", Icon: Upload }, { name: "Share2", Icon: Share2 },
  { name: "Trash2", Icon: Trash2 }, { name: "Edit", Icon: Edit }, { name: "Copy", Icon: Copy },
  { name: "Check", Icon: Check }, { name: "X", Icon: X }, { name: "Plus", Icon: Plus },
  { name: "Minus", Icon: Minus }, { name: "ChevronUp", Icon: ChevronUp }, { name: "ChevronDown", Icon: ChevronDown },
  { name: "ChevronLeft", Icon: ChevronLeft }, { name: "ChevronRight", Icon: ChevronRight },
  { name: "ArrowUp", Icon: ArrowUp }, { name: "ArrowDown", Icon: ArrowDown },
  { name: "ArrowLeft", Icon: ArrowLeft }, { name: "ArrowRight", Icon: ArrowRight },
  { name: "RefreshCw", Icon: RefreshCw }, { name: "RotateCcw", Icon: RotateCcw },
  { name: "Sun", Icon: Sun }, { name: "Moon", Icon: Moon }, { name: "Cloud", Icon: Cloud },
  { name: "Zap", Icon: Zap }, { name: "Wifi", Icon: Wifi }, { name: "Bluetooth", Icon: Bluetooth },
  { name: "Battery", Icon: Battery }, { name: "Volume2", Icon: Volume2 },
  { name: "Play", Icon: Play }, { name: "Pause", Icon: Pause },
  { name: "SkipForward", Icon: SkipForward }, { name: "SkipBack", Icon: SkipBack },
  { name: "Maximize", Icon: Maximize }, { name: "Minimize", Icon: Minimize },
  { name: "Folder", Icon: Folder }, { name: "File", Icon: File }, { name: "Image", Icon: Image },
  { name: "Video", Icon: Video }, { name: "Music", Icon: Music }, { name: "Database", Icon: Database },
  { name: "Server", Icon: Server }, { name: "Code", Icon: Code },
  { name: "Shield", Icon: Shield }, { name: "AlertTriangle", Icon: AlertTriangle },
  { name: "Info", Icon: Info }, { name: "HelpCircle", Icon: HelpCircle },
  { name: "MessageCircle", Icon: MessageCircle }, { name: "Send", Icon: Send },
  { name: "Bookmark", Icon: Bookmark }, { name: "Tag", Icon: Tag },
  { name: "Filter", Icon: Filter }, { name: "Sliders", Icon: SlidersHorizontal },
  { name: "BarChart3", Icon: BarChart3 }, { name: "PieChart", Icon: PieChart },
  { name: "TrendingUp", Icon: TrendingUp }, { name: "Activity", Icon: Activity },
  { name: "Package", Icon: Package }, { name: "Gift", Icon: Gift },
  { name: "ShoppingCart", Icon: ShoppingCart }, { name: "CreditCard", Icon: CreditCard },
  { name: "Layers", Icon: Layers }, { name: "Layout", Icon: Layout },
  { name: "Grid", Icon: Grid3X3 }, { name: "List", Icon: List },
  { name: "Menu", Icon: Menu }, { name: "More", Icon: MoreHorizontal },
  { name: "ExternalLink", Icon: ExternalLink },
];

export function IconsSection() {
  const [search, setSearch] = useState("");
  const [size, setSize] = useState(20);
  const [strokeW, setStrokeW] = useState(2);

  const filtered = allIcons.filter((i) =>
    i.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <SectionWrapper
      id="icons"
      title="Icons"
      description="80+ icons from Lucide React. Search, resize, and adjust stroke weight."
    >
      <ComponentCard title="Icon Explorer">
        <div className="flex flex-wrap gap-4 mb-5 items-end">
          <div className="flex-1 min-w-[200px]">
            <label className="text-[0.75rem] text-muted-foreground block mb-1">Search</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search icons..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-border bg-background focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
              />
            </div>
          </div>
          <div className="w-32">
            <label className="text-[0.75rem] text-muted-foreground block mb-1">Size: {size}px</label>
            <input type="range" min="14" max="40" value={size} onChange={(e) => setSize(Number(e.target.value))} className="w-full accent-primary" />
          </div>
          <div className="w-32">
            <label className="text-[0.75rem] text-muted-foreground block mb-1">Stroke: {strokeW}</label>
            <input type="range" min="1" max="3" step="0.5" value={strokeW} onChange={(e) => setStrokeW(Number(e.target.value))} className="w-full accent-primary" />
          </div>
        </div>

        <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-2">
          {filtered.map(({ name, Icon }) => (
            <button
              key={name}
              className="flex flex-col items-center gap-1.5 p-3 rounded-xl hover:bg-secondary transition-colors cursor-pointer group"
              title={name}
            >
              <Icon size={size} strokeWidth={strokeW} className="text-foreground group-hover:text-primary transition-colors" />
              <span className="text-[0.6rem] text-muted-foreground truncate w-full text-center">{name}</span>
            </button>
          ))}
        </div>
        {filtered.length === 0 && (
          <p className="text-center text-muted-foreground py-8 text-[0.875rem]">No icons found for "{search}"</p>
        )}
      </ComponentCard>

      <ComponentCard title="Icon Sizes">
        <div className="flex flex-wrap items-end gap-6">
          {[14, 16, 20, 24, 32, 40, 48].map((s) => (
            <div key={s} className="flex flex-col items-center gap-2">
              <Heart size={s} className="text-primary" />
              <span className="text-[0.6875rem] text-muted-foreground font-mono">{s}px</span>
            </div>
          ))}
        </div>
      </ComponentCard>

      <ComponentCard title="Icon Colors">
        <div className="flex flex-wrap gap-4">
          {[
            { cls: "text-foreground", label: "Default" },
            { cls: "text-primary", label: "Primary" },
            { cls: "text-success", label: "Success" },
            { cls: "text-warning", label: "Warning" },
            { cls: "text-destructive", label: "Destructive" },
            { cls: "text-info", label: "Info" },
            { cls: "text-muted-foreground", label: "Muted" },
          ].map((c) => (
            <div key={c.label} className="flex flex-col items-center gap-1.5">
              <div className="w-12 h-12 rounded-xl bg-secondary flex items-center justify-center">
                <Star className={`w-6 h-6 ${c.cls}`} />
              </div>
              <span className="text-[0.6875rem] text-muted-foreground">{c.label}</span>
            </div>
          ))}
        </div>
      </ComponentCard>

      <ComponentCard title="Icon Buttons & Containers">
        <div className="flex flex-wrap gap-4 items-center">
          <div className="w-10 h-10 rounded-lg bg-primary text-primary-foreground flex items-center justify-center">
            <Heart className="w-5 h-5" />
          </div>
          <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center">
            <Star className="w-5 h-5" />
          </div>
          <div className="w-10 h-10 rounded-lg border border-border flex items-center justify-center hover:bg-secondary cursor-pointer transition-colors">
            <Settings className="w-5 h-5" />
          </div>
          <div className="w-12 h-12 rounded-2xl bg-success/10 text-success flex items-center justify-center">
            <Check className="w-6 h-6" />
          </div>
          <div className="w-12 h-12 rounded-2xl bg-destructive/10 text-destructive flex items-center justify-center">
            <X className="w-6 h-6" />
          </div>
          <div className="w-12 h-12 rounded-full bg-warning/10 text-warning flex items-center justify-center">
            <AlertTriangle className="w-6 h-6" />
          </div>
        </div>
      </ComponentCard>
    </SectionWrapper>
  );
}

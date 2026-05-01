import { useState } from "react";
import { SectionWrapper, ComponentCard } from "../section-wrapper";
import { Navbar, Breadcrumbs, Drawer, BottomSheet, Button } from "../ds";
import { Home, Search, Heart, ShoppingCart, User, Bell, Settings, MapPin, Store, LayoutDashboard, Package } from "lucide-react";

export function NavigationSection() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [drawerSide, setDrawerSide] = useState<"left" | "right">("right");
  const [sheetOpen, setSheetOpen] = useState(false);
  const [sheetSnap, setSheetSnap] = useState<"min" | "half" | "full">("half");

  return (
    <SectionWrapper
      id="navigation-ds"
      title="Navigation"
      description="Navbar, Breadcrumbs, Drawer/Sidebar, and BottomSheet — for app-level navigation and mobile patterns."
    >
      {/* Navbar */}
      <ComponentCard title="Navbar — Default">
        <div className="border border-border rounded-xl overflow-hidden">
          <Navbar
            brand={
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center">
                  <Home className="w-3.5 h-3.5 text-primary-foreground" />
                </div>
                <span className="text-[0.9375rem]">StayBnb</span>
              </div>
            }
            items={[
              { label: "Stays", active: true },
              { label: "Experiences" },
              { label: "Online Experiences" },
            ]}
            sticky={false}
            showSearch
            avatar={{ name: "John" }}
          />
        </div>
      </ComponentCard>

      <ComponentCard title="Navbar — Colored Variant">
        <div className="border border-border rounded-xl overflow-hidden">
          <Navbar
            variant="colored"
            brand={<span className="text-[0.9375rem]">DashEats</span>}
            items={[
              { label: "Delivery", active: true, icon: <Package className="w-3.5 h-3.5" /> },
              { label: "Pickup", icon: <Store className="w-3.5 h-3.5" /> },
              { label: "Dashboard", icon: <LayoutDashboard className="w-3.5 h-3.5" /> },
            ]}
            sticky={false}
            rightContent={
              <button className="p-2 hover:bg-white/10 rounded-lg cursor-pointer relative">
                <Bell className="w-4 h-4" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-warning rounded-full" />
              </button>
            }
          />
        </div>
      </ComponentCard>

      {/* Breadcrumbs */}
      <ComponentCard title="Breadcrumbs">
        <div className="space-y-4">
          <Breadcrumbs
            items={[
              { label: "California", href: "/ca" },
              { label: "Los Angeles", href: "/ca/la" },
              { label: "Downtown Loft" },
            ]}
          />
          <Breadcrumbs
            items={[
              { label: "Dashboard", href: "/dashboard", icon: <LayoutDashboard className="w-3.5 h-3.5" /> },
              { label: "Orders", href: "/orders" },
              { label: "Order #1234" },
            ]}
            showHome={false}
          />
          <Breadcrumbs
            items={[
              { label: "Menu" },
              { label: "Appetizers" },
              { label: "Spring Rolls" },
            ]}
            separator={<span className="text-muted-foreground">/</span>}
          />
        </div>
      </ComponentCard>

      {/* Drawer */}
      <ComponentCard title="Drawer / Sidebar">
        <div className="flex flex-wrap gap-3">
          <Button variant="outline" onClick={() => { setDrawerSide("right"); setDrawerOpen(true); }}>
            Open Right Drawer
          </Button>
          <Button variant="outline" onClick={() => { setDrawerSide("left"); setDrawerOpen(true); }}>
            Open Left Drawer
          </Button>
        </div>
        <Drawer
          open={drawerOpen}
          onClose={() => setDrawerOpen(false)}
          side={drawerSide}
          title="Navigation"
          footer={
            <div className="flex gap-2">
              <Button variant="primary" size="sm" fullWidth onClick={() => setDrawerOpen(false)}>Apply</Button>
              <Button variant="outline" size="sm" fullWidth onClick={() => setDrawerOpen(false)}>Cancel</Button>
            </div>
          }
        >
          <div className="space-y-1">
            {[
              { icon: <Home className="w-4 h-4" />, label: "Home", active: true },
              { icon: <Search className="w-4 h-4" />, label: "Explore" },
              { icon: <Heart className="w-4 h-4" />, label: "Wishlists" },
              { icon: <ShoppingCart className="w-4 h-4" />, label: "Cart" },
              { icon: <User className="w-4 h-4" />, label: "Profile" },
              { icon: <Settings className="w-4 h-4" />, label: "Settings" },
            ].map((item) => (
              <button
                key={item.label}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-[0.8125rem] transition-colors cursor-pointer ${
                  item.active ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-secondary"
                }`}
              >
                {item.icon}
                {item.label}
              </button>
            ))}
          </div>
        </Drawer>
      </ComponentCard>

      {/* Bottom Sheet */}
      <ComponentCard title="Bottom Sheet (Mobile Pattern)">
        <div className="flex flex-wrap gap-3">
          <Button variant="outline" onClick={() => { setSheetSnap("min"); setSheetOpen(true); }}>
            Min Sheet
          </Button>
          <Button variant="outline" onClick={() => { setSheetSnap("half"); setSheetOpen(true); }}>
            Half Sheet
          </Button>
          <Button variant="outline" onClick={() => { setSheetSnap("full"); setSheetOpen(true); }}>
            Full Sheet
          </Button>
        </div>
        <BottomSheet
          open={sheetOpen}
          onClose={() => setSheetOpen(false)}
          snap={sheetSnap}
          title="Order Summary"
          footer={
            <Button variant="primary" fullWidth onClick={() => setSheetOpen(false)}>
              Checkout — $42.50
            </Button>
          }
        >
          <div className="space-y-4">
            {[
              { name: "Margherita Pizza", price: "$18.50", qty: "x1" },
              { name: "Caesar Salad", price: "$12.00", qty: "x1" },
              { name: "Tiramisu", price: "$9.00", qty: "x1" },
            ].map((item) => (
              <div key={item.name} className="flex items-center justify-between py-2 border-b border-border">
                <div>
                  <p className="text-[0.8125rem]">{item.name}</p>
                  <p className="text-[0.6875rem] text-muted-foreground">{item.qty}</p>
                </div>
                <span className="text-[0.8125rem] text-primary">{item.price}</span>
              </div>
            ))}
            <div className="flex justify-between text-[0.9375rem] pt-2">
              <span>Total</span>
              <span className="text-primary">$39.50 + tax</span>
            </div>
          </div>
        </BottomSheet>
      </ComponentCard>
    </SectionWrapper>
  );
}

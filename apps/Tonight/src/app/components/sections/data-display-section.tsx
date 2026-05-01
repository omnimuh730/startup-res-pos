import { SectionWrapper, ComponentCard } from "../section-wrapper";
import { ListGroup, EmptyState, Button, type ListItem } from "../ds";
import { Bell, Settings, CreditCard, Shield, Globe, User, Wifi, Car, MapPin, Search, ShoppingCart, FileText, Heart } from "lucide-react";

const settingsItems: ListItem[] = [
  { id: "profile", label: "Profile", description: "Manage your personal info", icon: <User className="w-4 h-4" />, onClick: () => {} },
  { id: "notifications", label: "Notifications", description: "Configure alerts and emails", icon: <Bell className="w-4 h-4" />, onClick: () => {} },
  { id: "payment", label: "Payment Methods", description: "Add or remove payment options", icon: <CreditCard className="w-4 h-4" />, onClick: () => {} },
  { id: "security", label: "Security", description: "Password and two-factor auth", icon: <Shield className="w-4 h-4" />, onClick: () => {} },
  { id: "language", label: "Language & Region", icon: <Globe className="w-4 h-4" />, onClick: () => {} },
  { id: "settings", label: "General Settings", icon: <Settings className="w-4 h-4" />, onClick: () => {} },
];

const amenityItems: ListItem[] = [
  { id: "wifi", label: "WiFi", description: "Free high-speed internet", icon: <Wifi className="w-4 h-4" />, rightContent: <span className="text-[0.6875rem] text-success">Included</span> },
  { id: "parking", label: "Free Parking", icon: <Car className="w-4 h-4" />, rightContent: <span className="text-[0.6875rem] text-success">Included</span> },
  { id: "location", label: "Great Location", description: "95% of guests loved the location", icon: <MapPin className="w-4 h-4" /> },
];

export function DataDisplaySection() {
  return (
    <SectionWrapper
      id="data-display-ds"
      title="Data Display"
      description="ListGroup for settings/menus and EmptyState for zero-data scenarios — used in all apps."
    >
      {/* ListGroup */}
      <ComponentCard title="List Group — Bordered (Settings)">
        <div className="max-w-md">
          <ListGroup items={settingsItems} showChevron />
        </div>
      </ComponentCard>

      <ComponentCard title="List Group — Separated">
        <div className="max-w-md">
          <ListGroup items={amenityItems} variant="separated" />
        </div>
      </ComponentCard>

      <ComponentCard title="List Group — Default (Flat)">
        <div className="max-w-md">
          <ListGroup items={settingsItems.slice(0, 3)} variant="default" />
        </div>
      </ComponentCard>

      {/* Empty States */}
      <ComponentCard title="Empty State Presets">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="border border-border rounded-xl">
            <EmptyState preset="search" compact />
          </div>
          <div className="border border-border rounded-xl">
            <EmptyState preset="cart" compact action={<Button variant="primary" size="sm">Start Shopping</Button>} />
          </div>
          <div className="border border-border rounded-xl">
            <EmptyState preset="favorites" compact action={<Button variant="outline" size="sm">Browse Listings</Button>} />
          </div>
        </div>
      </ComponentCard>

      <ComponentCard title="Empty State — Custom">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="border border-border rounded-xl">
            <EmptyState
              preset="documents"
              compact
              title="No orders yet"
              description="When customers place orders, they'll show up here."
              action={<Button variant="primary" size="sm">View Menu</Button>}
            />
          </div>
          <div className="border border-border rounded-xl">
            <EmptyState
              preset="location"
              compact
              title="No properties in this area"
              description="Try zooming out or changing your search filters."
            />
          </div>
        </div>
      </ComponentCard>
    </SectionWrapper>
  );
}

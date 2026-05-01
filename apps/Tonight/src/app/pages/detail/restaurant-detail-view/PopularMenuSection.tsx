import { ImageWithFallback } from "../../../components/figma/ImageWithFallback";
import { MENU_IMAGES } from "../restaurantDetailData";
import type { MenuItemWithCategory } from "./types";

export function PopularMenuSection({
  menuItems,
  onSelectMenuItem,
  onShowMenu,
}: {
  menuItems: MenuItemWithCategory[];
  onSelectMenuItem: (item: MenuItemWithCategory) => void;
  onShowMenu: () => void;
}) {
  return (
    <section className="px-6 py-6 border-b border-border">
      <h2 className="text-[1.75rem] leading-tight mb-4" style={{ fontWeight: 700 }}>Popular menu</h2>
      <div className="space-y-3">
        {menuItems.slice(0, 4).map((item) => (
          <div key={item.name} role="button" tabIndex={0} onClick={() => onSelectMenuItem(item)} onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") onSelectMenuItem(item); }} className="flex items-start gap-3 rounded-2xl border border-border p-3 cursor-pointer">
            <ImageWithFallback src={MENU_IMAGES[item.name] || ""} alt={item.name} className="w-20 h-20 rounded-xl object-cover shrink-0" />
            <div className="min-w-0">
              <p className="text-[0.95rem]" style={{ fontWeight: 600 }}>{item.name}</p>
              <p className="text-[0.85rem] text-muted-foreground line-clamp-2 mt-0.5">{item.desc}</p>
              <p className="text-[0.95rem] mt-1" style={{ fontWeight: 600 }}>${item.price}</p>
            </div>
          </div>
        ))}
      </div>
      <button
        onClick={onShowMenu}
        className="w-full mt-4 rounded-xl bg-secondary h-12 text-[1rem] cursor-pointer"
        style={{ fontWeight: 600 }}
      >
        Show more
      </button>
    </section>
  );
}

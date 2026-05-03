import { ImageWithFallback } from "../../../components/figma/ImageWithFallback";
import { MENU_IMAGES } from "../restaurantDetailData";
import { buildMenuFallbackSvg } from "./menuFallbackSvg";
import type { MenuItemWithCategory } from "./types";

interface MenuCategorySectionProps {
  category: string;
  items: Omit<MenuItemWithCategory, "category">[];
  onSelectItem: (item: MenuItemWithCategory) => void;
}

export function MenuCategorySection({ category, items, onSelectItem }: MenuCategorySectionProps) {
  return (
    <section className="mb-7">
      <div className="mb-3 px-1">
        <h3 className="text-[1.1rem] tracking-[0.08em] uppercase text-foreground" style={{ fontWeight: 700 }}>{category}</h3>
      </div>
      <div
        className="overflow-x-auto scrollbar-hide overscroll-x-contain snap-x snap-mandatory scroll-smooth"
        style={{ WebkitOverflowScrolling: "touch", scrollBehavior: "smooth" }}
      >
        <div className="grid grid-rows-2 grid-flow-col auto-cols-[41%] gap-2.5 pb-2 pr-4 sm:auto-cols-[10rem]">
          {items.map((item) => (
            <MenuDishCard
              key={item.name}
              item={item}
              onSelect={() => onSelectItem({ ...item, category })}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

function MenuDishCard({ item, onSelect }: { item: Omit<MenuItemWithCategory, "category">; onSelect: () => void }) {
  return (
    <article
      role="button"
      tabIndex={0}
      aria-label={item.name}
      onClick={onSelect}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onSelect();
        }
      }}
      className="aspect-[1.12/1] rounded-2xl border border-border p-2 cursor-pointer bg-card shadow-[0_4px_14px_rgba(0,0,0,0.08)] hover:shadow-[0_6px_18px_rgba(0,0,0,0.12)] transition-shadow snap-start"
    >
      <ImageWithFallback
        src={MENU_IMAGES[item.name] || buildMenuFallbackSvg(item.name)}
        alt={item.name}
        className="h-full w-full rounded-xl object-cover"
      />
    </article>
  );
}

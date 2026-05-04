import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, Images, X } from "lucide-react";
import { ImageWithFallback } from "../../../components/figma/ImageWithFallback";
import { MENU_IMAGES } from "../restaurantDetailData";
import type { MenuItemWithCategory } from "./types";

export function PopularMenuSection({
  menuItems,
  onShowMenu,
}: {
  menuItems: MenuItemWithCategory[];
  onShowMenu: () => void;
}) {
  const [previewIndex, setPreviewIndex] = useState<number | null>(null);
  const imageItems = menuItems.filter((item) => Boolean(MENU_IMAGES[item.name]));
  const railItems = imageItems.slice(0, 8);
  const previewItem = previewIndex === null ? null : imageItems[previewIndex] ?? null;

  useEffect(() => {
    if (previewIndex === null) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setPreviewIndex(null);
      if (event.key === "ArrowLeft") setPreviewIndex((value) => getPrevIndex(value ?? 0, imageItems.length));
      if (event.key === "ArrowRight") setPreviewIndex((value) => getNextIndex(value ?? 0, imageItems.length));
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [imageItems.length, previewIndex]);

  return (
    <section className="px-6 py-6 border-b border-border">
      <h2 className="text-[1.75rem] leading-tight mb-4" style={{ fontWeight: 700 }}>Popular menu</h2>
      <div className="-mx-6 overflow-x-auto px-6 pb-1 scrollbar-hide">
        <div className="flex w-max gap-3 pr-6">
          {railItems.map((item, index) => (
            <button
              key={item.name}
              type="button"
              aria-label={`Preview ${item.name}`}
              onClick={() => setPreviewIndex(index)}
              className="h-28 w-28 shrink-0 cursor-pointer overflow-hidden rounded-2xl border border-border bg-card p-1.5 shadow-[0_4px_14px_rgba(0,0,0,0.08)] transition active:scale-[0.98]"
            >
              <ImageWithFallback src={MENU_IMAGES[item.name] ?? ""} alt={item.name} className="h-full w-full rounded-xl object-cover" />
            </button>
          ))}
          <button
            type="button"
            onClick={() => setPreviewIndex(0)}
            className="flex h-28 w-28 shrink-0 cursor-pointer flex-col items-center justify-center gap-2 rounded-2xl border border-border bg-secondary text-foreground transition hover:bg-secondary/80 active:scale-[0.98]"
            style={{ fontWeight: 800 }}
          >
            <Images className="h-5 w-5 text-primary" />
            <span className="text-[0.875rem]">See all</span>
          </button>
        </div>
      </div>
      <button
        onClick={onShowMenu}
        className="w-full mt-4 rounded-xl bg-secondary h-12 text-[1rem] cursor-pointer"
        style={{ fontWeight: 600 }}
      >
        Show more
      </button>

      {previewItem && (
        <MenuImagePreview
          item={previewItem}
          index={previewIndex}
          total={imageItems.length}
          onClose={() => setPreviewIndex(null)}
          onPrev={() => setPreviewIndex((value) => getPrevIndex(value ?? 0, imageItems.length))}
          onNext={() => setPreviewIndex((value) => getNextIndex(value ?? 0, imageItems.length))}
        />
      )}
    </section>
  );
}

function MenuImagePreview({
  item,
  index,
  total,
  onClose,
  onPrev,
  onNext,
}: {
  item: MenuItemWithCategory;
  index: number;
  total: number;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
}) {
  return (
    <div className="fixed inset-0 z-[360] flex items-center justify-center bg-black/92 p-5" onClick={onClose}>
      <button
        type="button"
        onClick={onClose}
        aria-label="Close preview"
        className="absolute right-4 top-4 flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-white/15 text-white backdrop-blur transition hover:bg-white/25"
      >
        <X className="h-5 w-5" />
      </button>

      <button
        type="button"
        onClick={(event) => {
          event.stopPropagation();
          onPrev();
        }}
        aria-label="Previous image"
        className="absolute left-4 top-1/2 flex h-11 w-11 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full bg-white/15 text-white backdrop-blur transition hover:bg-white/25"
      >
        <ChevronLeft className="h-6 w-6" />
      </button>

      <ImageWithFallback
        src={MENU_IMAGES[item.name] ?? ""}
        alt={item.name}
        className="max-h-[78vh] w-full max-w-3xl rounded-2xl object-contain"
        onClick={(event) => event.stopPropagation()}
      />

      <button
        type="button"
        onClick={(event) => {
          event.stopPropagation();
          onNext();
        }}
        aria-label="Next image"
        className="absolute right-4 top-1/2 flex h-11 w-11 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full bg-white/15 text-white backdrop-blur transition hover:bg-white/25"
      >
        <ChevronRight className="h-6 w-6" />
      </button>

      <div className="absolute bottom-5 rounded-full bg-white/15 px-3 py-1.5 text-[0.8125rem] text-white backdrop-blur">
        {index + 1} / {total}
      </div>
    </div>
  );
}

function getPrevIndex(index: number, total: number) {
  return (index - 1 + total) % total;
}

function getNextIndex(index: number, total: number) {
  return (index + 1) % total;
}

import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, Check, Heart, Plus, Sparkles, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { ImageWithFallback } from "../../components/figma/ImageWithFallback";
import type { RestaurantData } from "../detail/RestaurantDetailView";

export type WishlistSheetCollection = {
  id: string;
  title: string;
  restaurants: RestaurantData[];
  isDefault?: boolean;
};

type WishlistSelectionSheetProps = {
  open: boolean;
  restaurant: RestaurantData | null;
  collections: WishlistSheetCollection[];
  onClose: () => void;
  onSelectCollection: (collectionId: string) => void;
  onCreateWishlist: (name: string) => void;
};

const MAX_NAME_LENGTH = 50;

export function WishlistSelectionSheet({
  open,
  restaurant,
  collections,
  onClose,
  onSelectCollection,
  onCreateWishlist,
}: WishlistSelectionSheetProps) {
  const [view, setView] = useState<"select" | "create">("select");
  const [name, setName] = useState("");
  const [savingCollectionId, setSavingCollectionId] = useState<string | null>(null);
  const [displayRestaurant, setDisplayRestaurant] = useState<RestaurantData | null>(restaurant);

  useEffect(() => {
    if (restaurant) setDisplayRestaurant(restaurant);
    if (!open) return;
    setView("select");
    setName("");
    setSavingCollectionId(null);
  }, [open, restaurant?.id]);

  useEffect(() => {
    if (!open) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [open]);

  const sortedCollections = useMemo(() => {
    const defaultCollection = collections.find((collection) => collection.isDefault);
    const customCollections = collections.filter((collection) => !collection.isDefault);
    return defaultCollection ? [defaultCollection, ...customCollections] : collections;
  }, [collections]);

  const trimmedName = name.trim();
  const canCreate = trimmedName.length > 0;

  const handleSelectCollection = (collectionId: string) => {
    setSavingCollectionId(collectionId);
    window.setTimeout(() => {
      onSelectCollection(collectionId);
      setSavingCollectionId(null);
    }, 280);
  };

  const handleCreate = () => {
    if (!canCreate) return;
    onCreateWishlist(trimmedName);
  };

  if (!displayRestaurant) return null;

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[500] flex items-end justify-center bg-black/40 px-0 sm:px-4 sm:pb-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          onClick={onClose}
        >
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={view === "select" ? "Save to wishlist" : "Create wishlist"}
            className="relative max-h-[88vh] w-full max-w-[35rem] overflow-hidden rounded-t-[2rem] bg-white shadow-[0_-16px_50px_rgba(0,0,0,0.18)] sm:rounded-[2rem]"
            initial={{ y: "100%", opacity: 0.98, scale: 0.98 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: "100%", opacity: 0.98, scale: 0.98 }}
            transition={{ type: "spring", damping: 28, stiffness: 270 }}
            onClick={(event) => event.stopPropagation()}
          >
            <div className="mx-auto mt-2 h-1 w-9 rounded-full bg-[#B0B0B0] sm:hidden" />

            <AnimatePresence mode="wait" initial={false}>
              {view === "select" ? (
                <motion.div
                  key="select"
                  initial={{ opacity: 0, x: -18 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -18 }}
                  transition={{ duration: 0.22, ease: "easeOut" }}
                >
                  <SheetHeader title="Save to wishlist" onClose={onClose} />

                  <div className="max-h-[calc(88vh-8.25rem)] overflow-y-auto px-7 pb-6 pt-5">
                    <div className="grid grid-cols-2 gap-x-4 gap-y-6">
                      {sortedCollections.map((collection) => {
                        const isSaving = savingCollectionId === collection.id;
                        return (
                          <motion.button
                            key={collection.id}
                            type="button"
                            whileTap={{ scale: 0.985 }}
                            onClick={() => handleSelectCollection(collection.id)}
                            className="group relative text-left cursor-pointer"
                          >
                            <WishlistCover collection={collection} fallbackRestaurant={displayRestaurant} isSaving={isSaving} />
                            <div className="mt-3 min-w-0">
                              <p className="truncate text-[0.9375rem] leading-tight text-[#222222]" style={{ fontWeight: 700 }}>
                                {collection.title}
                              </p>
                              <p className="mt-1 text-[0.8125rem] text-[#717171]">
                                {collection.restaurants.length} saved
                              </p>
                            </div>
                          </motion.button>
                        );
                      })}
                    </div>
                  </div>

                  <div className="border-t border-[#DDDDDD] bg-white px-7 py-4">
                    <motion.button
                      type="button"
                      onClick={() => setView("create")}
                      whileTap={{ scale: 0.98 }}
                      className="flex h-14 w-full items-center justify-center gap-2 rounded-xl bg-[#222222] text-[1rem] text-white transition hover:bg-black cursor-pointer"
                      style={{ fontWeight: 700 }}
                    >
                      <Plus className="h-4 w-4" />
                      Create new wishlist
                    </motion.button>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="create"
                  initial={{ opacity: 0, x: 22 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 22 }}
                  transition={{ duration: 0.22, ease: "easeOut" }}
                >
                  <div className="relative flex h-16 items-center justify-center border-b border-transparent px-5">
                    <button
                      type="button"
                      onClick={() => setView("select")}
                      className="absolute left-5 flex h-9 w-9 items-center justify-center rounded-full text-[#222222] transition hover:bg-[#F7F7F7] cursor-pointer"
                      aria-label="Back to wishlist selection"
                    >
                      <ArrowLeft className="h-5 w-5" />
                    </button>
                    <h2 className="text-[1.125rem] text-[#222222]" style={{ fontWeight: 700 }}>Create wishlist</h2>
                  </div>

                  <div className="px-7 pb-8 pt-8">
                    <label className="block">
                      <span className="sr-only">Wishlist name</span>
                      <input
                        autoFocus
                        value={name}
                        maxLength={MAX_NAME_LENGTH}
                        onChange={(event) => setName(event.target.value)}
                        onKeyDown={(event) => {
                          if (event.key === "Enter") handleCreate();
                        }}
                        placeholder="Name"
                        className="h-[4.375rem] w-full rounded-xl border border-[#717171] bg-white px-4 text-[1.25rem] text-[#222222] outline-none transition focus:border-[#222222] focus:ring-2 focus:ring-[#222222]/10"
                      />
                    </label>
                    <p className="mt-3 text-[0.875rem] text-[#717171]" style={{ fontWeight: 600 }}>
                      {name.length}/{MAX_NAME_LENGTH} characters
                    </p>
                  </div>

                  <div className="flex items-center justify-between border-t border-[#DDDDDD] bg-white px-7 py-4">
                    <button
                      type="button"
                      onClick={() => setView("select")}
                      className="rounded-lg px-4 py-3 text-[1rem] text-[#222222] transition hover:bg-[#F7F7F7] cursor-pointer"
                      style={{ fontWeight: 700 }}
                    >
                      Cancel
                    </button>
                    <motion.button
                      type="button"
                      onClick={handleCreate}
                      disabled={!canCreate}
                      whileTap={canCreate ? { scale: 0.97 } : undefined}
                      className="min-w-[8.25rem] rounded-xl px-6 py-3.5 text-[1rem] transition disabled:cursor-not-allowed disabled:bg-[#F2F2F2] disabled:text-[#B0B0B0] bg-[#222222] text-white hover:bg-black cursor-pointer"
                      style={{ fontWeight: 700 }}
                    >
                      Create
                    </motion.button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function SheetHeader({ title, onClose }: { title: string; onClose: () => void }) {
  return (
    <div className="relative flex h-16 items-center justify-center px-5">
      <h2 className="text-[1.125rem] text-[#222222]" style={{ fontWeight: 700 }}>{title}</h2>
      <button
        type="button"
        onClick={onClose}
        className="absolute right-5 flex h-9 w-9 items-center justify-center rounded-full text-[#222222] transition hover:bg-[#F7F7F7] cursor-pointer"
        aria-label="Close wishlist selection"
      >
        <X className="h-5 w-5" />
      </button>
    </div>
  );
}

function WishlistCover({
  collection,
  fallbackRestaurant,
  isSaving,
}: {
  collection: WishlistSheetCollection;
  fallbackRestaurant: RestaurantData;
  isSaving: boolean;
}) {
  const images = collection.restaurants.map((item) => item.image).filter(Boolean);
  const coverImages = images.length > 0 ? images.slice(0, 4) : [fallbackRestaurant.image].filter(Boolean);

  return (
    <div className="relative aspect-square w-full overflow-hidden rounded-[1.25rem] bg-[#F7F7F7] shadow-[0_2px_10px_rgba(0,0,0,0.08)]">
      {coverImages.length === 0 ? (
        <div className="flex h-full w-full items-center justify-center">
          <Heart className="h-8 w-8 text-[#B0B0B0]" />
        </div>
      ) : coverImages.length === 1 ? (
        <ImageWithFallback src={coverImages[0]} alt={collection.title} className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]" />
      ) : (
        <div className="grid h-full w-full grid-cols-2 grid-rows-2 gap-1">
          {coverImages.map((src, index) => (
            <ImageWithFallback key={`${src}-${index}`} src={src} alt={collection.title} className="h-full w-full object-cover" />
          ))}
        </div>
      )}

      <AnimatePresence>
        {isSaving && (
          <motion.div
            className="absolute inset-0 flex items-center justify-center bg-black/35 backdrop-blur-[2px]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="relative flex h-12 w-12 items-center justify-center rounded-full bg-white text-[#E31C5F] shadow-lg"
              initial={{ scale: 0.4, rotate: -20 }}
              animate={{ scale: [0.4, 1.16, 1], rotate: [0, 10, 0] }}
              transition={{ duration: 0.35, ease: "easeOut" }}
            >
              <Sparkles className="absolute -right-1 -top-1 h-4 w-4 text-[#E31C5F]" />
              <Check className="h-6 w-6" strokeWidth={3} />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

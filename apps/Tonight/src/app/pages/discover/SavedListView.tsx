import React, { useState, useEffect } from "react";
import { Heart, X, ChevronLeft } from "lucide-react";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import { ImageWithFallback } from "../../components/figma/ImageWithFallback";
import { useSavedVersion } from "./savedStore";
import { fmtR } from "./discoverTypes";
import type { SearchResultFood } from "./discoverTypes";
import type { RestaurantData } from "../detail/RestaurantDetailView";

type WishlistCollection = {
  id: string;
  title: string;
  subtitle: string;
  items: (RestaurantData | SearchResultFood)[];
  type: "all" | "restaurants" | "foods" | "custom";
};

const ImageGrid = ({ images, layoutId }: { images: string[], layoutId?: string }) => {
  const displayImages = images.slice(0, 4);
  const count = displayImages.length;

  return (
    <motion.div 
      layoutId={layoutId}
      className="aspect-square w-full rounded-2xl overflow-hidden bg-muted relative"
    >
      {count === 0 && (
        <div className="absolute inset-0 flex items-center justify-center bg-secondary">
          <Heart className="w-8 h-8 text-muted-foreground/30" />
        </div>
      )}
      {count === 1 && (
        <ImageWithFallback src={displayImages[0]} alt="Saved item" className="w-full h-full object-cover" />
      )}
      {count === 2 && (
        <div className="flex h-full gap-1">
          <ImageWithFallback src={displayImages[0]} alt="Saved 1" className="w-1/2 h-full object-cover" />
          <ImageWithFallback src={displayImages[1]} alt="Saved 2" className="w-1/2 h-full object-cover" />
        </div>
      )}
      {count === 3 && (
        <div className="flex h-full gap-1">
          <ImageWithFallback src={displayImages[0]} alt="Saved 1" className="w-1/2 h-full object-cover" />
          <div className="w-1/2 flex flex-col gap-1">
            <ImageWithFallback src={displayImages[1]} alt="Saved 2" className="h-1/2 w-full object-cover" />
            <ImageWithFallback src={displayImages[2]} alt="Saved 3" className="h-1/2 w-full object-cover" />
          </div>
        </div>
      )}
      {count >= 4 && (
        <div className="grid grid-cols-2 grid-rows-2 h-full gap-1">
          {displayImages.map((src, i) => (
            <ImageWithFallback key={i} src={src} alt={`Saved ${i}`} className="w-full h-full object-cover" />
          ))}
        </div>
      )}
    </motion.div>
  );
};

const GatheredModal = ({ onClose, images }: { onClose: () => void, images: string[] }) => {
  const displayImages = [...images, ...Array(4)].slice(0, 4);

  const pieceVariants: Variants = {
    hidden: (index: number) => ({
      x: index === 0 || index === 2 ? -150 : 150,
      y: index === 0 || index === 1 ? -150 : 150,
      rotate: index % 2 === 0 ? -60 : 60,
      opacity: 0,
      scale: 0.2,
    }),
    visible: {
      x: 0,
      y: 0,
      rotate: 0,
      opacity: 1,
      scale: 1,
      transition: {
        type: "spring" as const,
        damping: 14,
        stiffness: 100,
        mass: 0.8,
        delay: 0.1,
      },
    },
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-[500] flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div 
        initial={{ y: 50, scale: 0.95 }} animate={{ y: 0, scale: 1 }} exit={{ y: 20, scale: 0.95, opacity: 0 }}
        transition={{ type: "spring", bounce: 0, duration: 0.4 }}
        className="bg-white rounded-[2rem] w-full max-w-sm overflow-hidden relative shadow-2xl"
        onClick={e => e.stopPropagation()}
      >
        <button type="button" onClick={onClose} className="absolute top-4 right-4 z-10 p-2 hover:bg-black/5 rounded-full transition-colors cursor-pointer">
          <X className="w-5 h-5 text-black" />
        </button>

        <div className="pt-16 pb-8 px-6 flex flex-col items-center text-center">
          <div className="w-48 h-48 bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] p-1.5 mb-8 relative">
             <div className="w-full h-full grid grid-cols-2 grid-rows-2 gap-1 rounded-xl overflow-hidden bg-secondary/30">
                {displayImages.map((src, i) => (
                  <motion.div
                    key={i}
                    custom={i}
                    initial="hidden"
                    animate="visible"
                    variants={pieceVariants}
                    className="w-full h-full bg-secondary origin-center relative overflow-hidden"
                  >
                    {src ? (
                      <ImageWithFallback src={src} alt={`Assembly part ${i}`} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full bg-secondary/50" />
                    )}
                  </motion.div>
                ))}
             </div>
          </div>

          <motion.h2 
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
            className="text-[1.375rem] leading-tight text-black mb-3" style={{ fontWeight: 600 }}
          >
            We've gathered your recently searched restaurants
          </motion.h2>
          
          <motion.p 
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
            className="text-muted-foreground text-[0.9375rem] leading-relaxed mb-8 px-2"
          >
            Restaurants you liked from recent search and discovery stay here so you can compare them later.
          </motion.p>

          <motion.button 
            type="button"
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}
            onClick={onClose}
            className="w-full bg-[#222222] text-white py-3.5 rounded-xl font-semibold text-[1rem] active:scale-[0.98] transition-transform cursor-pointer"
          >
            Got it
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
};

type CustomWishlistCollection = {
  id: string;
  title: string;
  restaurants: RestaurantData[];
};

export function SavedListView({ savedRestaurantsRef, savedFoodsRef, wishlistCollections = [], onBack, onSelectRestaurant, onSelectFood, onRemoveRestaurant, onRemoveFood }: {
  savedRestaurantsRef: React.RefObject<RestaurantData[]>;
  savedFoodsRef: React.RefObject<SearchResultFood[]>;
  wishlistCollections?: CustomWishlistCollection[];
  onBack: () => void;
  onSelectRestaurant: (r: RestaurantData) => void;
  onSelectFood: (f: SearchResultFood) => void;
  onRemoveRestaurant: (r: RestaurantData) => void;
  onRemoveFood: (f: SearchResultFood) => void;
}) {
  useSavedVersion();
  const savedRestaurants = savedRestaurantsRef.current || [];
  const savedFoods = savedFoodsRef.current || [];
  
  const [showModal, setShowModal] = useState(false);
  const [selectedCollection, setSelectedCollection] = useState<WishlistCollection | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowModal(true);
    }, 150);
    return () => clearTimeout(timer);
  }, []);

  const recentlySearchedRestaurants = savedRestaurants;
  const recentImages = recentlySearchedRestaurants.slice(0, 4).map(item => item.image || '').filter(Boolean);

  const collections: WishlistCollection[] = [
    {
      id: "recent",
      title: "Recently searched restaurants",
      subtitle: "Today",
      items: recentlySearchedRestaurants,
      type: "restaurants"
    },
    ...wishlistCollections.map((collection) => ({
      id: collection.id,
      title: collection.title,
      subtitle: `${collection.restaurants.length} saved`,
      items: collection.restaurants,
      type: "custom" as const,
    })),
    ...(savedRestaurants.length > 0 ? [{
      id: "restaurants",
      title: "Saved Restaurants",
      subtitle: `${savedRestaurants.length} saved`,
      items: savedRestaurants,
      type: "restaurants" as const
    }] : []),
    ...(savedFoods.length > 0 ? [{
      id: "foods",
      title: "Saved Foods",
      subtitle: `${savedFoods.length} saved`,
      items: savedFoods,
      type: "foods" as const
    }] : [])
  ];

  return (
    <div className="relative min-h-full overflow-x-hidden bg-white">
      
      <div className="px-6 pt-8">
        <div className="mb-6 flex items-center gap-3">
          <h1 className="text-[2rem] text-black tracking-tight" style={{ fontWeight: 600 }}>Wishlists</h1>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          {collections.map((collection) => {
            const images = collection.items.map(item => item.image || '').filter(Boolean);
            
            return (
              <motion.div 
                key={collection.id}
                className="cursor-pointer group"
                onClick={() => setSelectedCollection(collection)}
              >
                <div className="shadow-[0_2px_8px_rgba(0,0,0,0.08)] rounded-2xl group-hover:shadow-[0_4px_12px_rgba(0,0,0,0.12)] transition-shadow">
                   <ImageGrid images={images} />
                </div>
                <div className="mt-3">
                  <h3 className="text-[1rem] text-black truncate" style={{ fontWeight: 600 }}>{collection.title}</h3>
                  <p className="text-[0.875rem] text-muted-foreground mt-0.5">{collection.subtitle}</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* --- Detailed Grid View Page --- */}
      <AnimatePresence>
        {selectedCollection && (
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed inset-0 z-[500] overflow-y-auto bg-white pb-6"
          >
            {/* Top Navigation Bar */}
            <div
              className="sticky top-0 bg-white/90 backdrop-blur-md z-10 flex items-center justify-between px-4 pb-4"
              style={{ paddingTop: "calc(var(--safe-area-inset-top) + 1rem)" }}
            >
                 <button
                   type="button"
                 onClick={() => setSelectedCollection(null)} 
                 className="p-2 hover:bg-secondary rounded-full transition-colors cursor-pointer"
               >
                 <ChevronLeft className="w-6 h-6 text-black" />
               </button>
               <button type="button" className="px-2 py-1 text-[1rem] font-semibold text-black underline cursor-pointer">
                 Edit
               </button>
            </div>

            {/* Header Area */}
            <div className="px-6 pt-4 pb-6">
              <h1 className="text-[2rem] font-bold text-black tracking-tight leading-tight">
                {selectedCollection.title}
              </h1>
              <p className="text-[1rem] font-semibold text-black mt-4">
                {selectedCollection.subtitle}
              </p>
            </div>

            {/* Grid Items */}
            <div className="px-6 grid grid-cols-2 gap-x-4 gap-y-6">
              {selectedCollection.items.map((item, idx) => (
                <div 
                  key={item.id + idx} 
                  className="flex flex-col gap-2 cursor-pointer group"
                >
                  {/* Image Container with Aspect Ratio */}
                  <div className="aspect-square w-full rounded-xl overflow-hidden bg-secondary relative">
                    {item.image && (
                      <ImageWithFallback 
                        src={item.image} 
                        alt={item.name || 'Item'} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                      />
                    )}
                    {/* Heart Icon overlaid on image */}
                    {selectedCollection.id === "recent" && "cuisine" in item && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        onRemoveRestaurant(item);
                      }}
                      className="absolute top-3 right-3 p-1 rounded-full cursor-pointer"
                    >
                      <Heart 
                         className="w-6 h-6 text-white drop-shadow-md fill-[#E31C5F]" 
                         strokeWidth={2}
                      />
                    </button>
                    )}
                  </div>

                  {/* Card Details */}
                  <div className="flex-1 min-w-0">
                    <p className="text-[0.9375rem] truncate text-black font-semibold">
                      {item.name}
                    </p>
                    
                    {/* Differentiate Details based on Item Type */}
                    {'cuisine' in item ? (
                       <p className="text-[0.875rem] text-muted-foreground mt-0.5 truncate">
                         {item.cuisine} · ★ {fmtR(item.rating || 0)}
                       </p>
                    ) : (
                       <p className="text-[0.875rem] text-muted-foreground mt-0.5 truncate">
                         {item.count || 0} places to eat
                       </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showModal && (
          <GatheredModal onClose={() => setShowModal(false)} images={recentImages} />
        )}
      </AnimatePresence>

    </div>
  );
}

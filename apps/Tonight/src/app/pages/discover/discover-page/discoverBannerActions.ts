import type { SearchResultLocation } from "../discoverTypes";

export function createDiscoverBannerNavigator(
  saveScrollPos: () => void,
  setSelectedCategory: (c: { id: string; label: string; icon?: string }) => void,
  setViewingSection: (s: string) => void,
  setSelectedLocation: (l: SearchResultLocation) => void,
) {
  return (bannerId: string) => {
    saveScrollPos();
    const bannerMap: Record<string, () => void> = {
      "1": () => setSelectedCategory({ id: "michelin", label: "Michelin", icon: "" }),
      "2": () => setSelectedCategory({ id: "best-kbbq", label: "Best K-BBQ", icon: "" }),
      "3": () => setViewingSection("date-night"),
      "4": () => setSelectedCategory({ id: "michelin", label: "Chef's Table", icon: "" }),
      "5": () => setSelectedLocation({ id: "ny", name: "NEW YORK", count: 50 }),
      "6": () => setSelectedCategory({ id: "banner-sushi", label: "Sushi Masters", icon: "" }),
    };
    bannerMap[bannerId]?.();
  };
}

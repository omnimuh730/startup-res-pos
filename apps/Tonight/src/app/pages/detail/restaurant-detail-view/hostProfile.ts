import type { RestaurantData } from "../restaurantDetailData";
import type { HostProfile } from "./types";

const hostMap: Record<string, HostProfile> = {
  "1": {
    name: "Allison",
    yearsHosting: 7,
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=480&h=480&fit=crop",
  },
  "2": {
    name: "Marco",
    yearsHosting: 5,
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=480&h=480&fit=crop",
  },
  "4": {
    name: "Sophie",
    yearsHosting: 6,
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=480&h=480&fit=crop",
  },
  "13": {
    name: "Daniel",
    yearsHosting: 8,
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=480&h=480&fit=crop",
  },
};

export function getHostProfile(restaurant: RestaurantData): HostProfile {
  const fallbackYears = (Number.parseInt(restaurant.id, 10) % 8) + 3;
  return hostMap[restaurant.id] ?? {
    name: restaurant.name.split(" ")[0],
    yearsHosting: fallbackYears,
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=480&h=480&fit=crop",
  };
}

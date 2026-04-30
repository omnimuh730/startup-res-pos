import type { Notification } from "../../../../stores/notificationStore";
import { BOOKINGS } from "../../../dining/diningData";
import { ALL_SEARCH_DATA, searchResultToRestaurantData } from "../../../discover/discoverSearchData";
import type { DeepLinkTarget } from "./types";

function normalizeText(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
}

function getNotificationHaystack(notification: Notification) {
  return normalizeText(`${notification.title} ${notification.message}`);
}

function findRestaurantTarget(notification: Notification) {
  const haystack = getNotificationHaystack(notification);
  const restaurant = ALL_SEARCH_DATA.restaurants.find((item) => haystack.includes(normalizeText(item.name)));

  if (!restaurant) return null;
  return searchResultToRestaurantData(restaurant);
}

function findBookingTarget(notification: Notification) {
  const haystack = getNotificationHaystack(notification);
  return BOOKINGS.find((booking) => haystack.includes(normalizeText(booking.restaurant))) ?? null;
}

export function getNotificationDeepLink(notification: Notification): DeepLinkTarget {
  const haystack = getNotificationHaystack(notification);

  if (notification.icon === "reservation") {
    const booking = findBookingTarget(notification);
    if (booking) {
      return {
        to: booking.status === "confirmed" ? `/dining/${booking.id}/upcoming` : `/dining/${booking.id}`,
      };
    }
    return { to: "/dining" };
  }

  if (notification.icon === "review") {
    const restaurant = findRestaurantTarget(notification);
    if (restaurant) {
      return { to: `/discover/restaurant/${restaurant.id}`, state: { restaurant } };
    }
    return { to: "/discover/search?q=review" };
  }

  if (notification.icon === "promo") {
    if (haystack.includes("weekend") || haystack.includes("top rated")) {
      return { to: "/discover/section/monthly-best" };
    }
    if (haystack.includes("bella napoli")) {
      return { to: "/discover/search?q=Bella%20Napoli" };
    }
    return { to: "/discover/search?q=deals" };
  }

  if (notification.icon === "reward") {
    if (haystack.includes("tier") || haystack.includes("platinum")) {
      return { to: "/profile/edit" };
    }
    return { to: "/profile/history" };
  }

  if (notification.icon === "system") {
    return { to: "/profile/settings" };
  }

  return { to: "/discover" };
}

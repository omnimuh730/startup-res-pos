/* Route wrapper components that bridge URL to existing page components */
import { useNavigate, useOutletContext } from "react-router";
import { SavedListView } from "./pages/discover/SavedListView";
import { NotificationsView } from "./pages/discover/NotificationsView";
import { QRPayPage } from "./pages/qrpay/QRPayPage";
import type { AppOutletContext } from "./AppLayout";

export function SavedRoute() {
  const navigate = useNavigate();
  const ctx = useOutletContext<AppOutletContext>();
  return (
    <SavedListView
      savedRestaurantsRef={ctx.savedRestaurantsRef}
      savedFoodsRef={ctx.savedFoodsRef}
      onBack={() => navigate(-1)}
      onSelectRestaurant={(r) => navigate(`/discover/restaurant/${r.id}`, { state: { restaurant: r } })}
      onSelectFood={(f) => navigate(`/discover/food/${f.id}`, { state: { food: f } })}
      onRemoveRestaurant={ctx.toggleSaveRestaurant}
      onRemoveFood={ctx.toggleSaveFood}
    />
  );
}

export function NotificationsRoute() {
  const navigate = useNavigate();
  return <NotificationsView onBack={() => navigate(-1)} />;
}

export function QRPayRoute() {
  const navigate = useNavigate();
  return <QRPayPage onClose={() => navigate("/discover")} />;
}

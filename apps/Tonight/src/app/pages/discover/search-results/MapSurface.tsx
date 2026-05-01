import { useState, useRef } from "react";
import MapLibre, { Marker, type MapRef } from "react-map-gl/maplibre";
import { MapPin } from "lucide-react";
import { ALL_SEARCH_DATA } from "../discoverSearchData";
import { LIGHT_STYLE, USER_LOCATION } from "./searchMapData";
import { mapRestaurantToSearchLocation } from "./filterUtils";
import type { MappedSearchRestaurant } from "./types";

export function MapSurface({
  restaurants,
  activeMarker,
  onMarkerSelect,
  onMapClick,
  query,
  topOffset,
}: {
  restaurants: MappedSearchRestaurant[];
  activeMarker: number;
  onMarkerSelect: (index: number) => void;
  onMapClick: () => void;
  query: string;
  topOffset: number;
}) {
  const mapRef = useRef<MapRef>(null);
  const markers = restaurants.length > 0
    ? restaurants
    : ALL_SEARCH_DATA.restaurants.slice(0, 6).map((restaurant, index) => mapRestaurantToSearchLocation(restaurant, index));
  const [viewState, setViewState] = useState({
    longitude: USER_LOCATION.lng,
    latitude: USER_LOCATION.lat,
    zoom: 13.6,
    pitch: 0,
    bearing: 0,
  });

  return (
    <div
      className="absolute inset-x-0 bottom-0 overflow-hidden bg-[#f4f0e8]"
      style={{ top: topOffset }}
    >
      <MapLibre
        ref={mapRef}
        {...viewState}
        onMove={(event) => setViewState(event.viewState)}
        onClick={onMapClick}
        mapStyle={LIGHT_STYLE}
        style={{ width: "100%", height: "100%" }}
        maxZoom={19}
        minZoom={10}
        scrollZoom={true}
        dragPan={true}
        dragRotate={false}
        touchPitch={false}
        touchZoomRotate={true}
        attributionControl={false}
      >
        <Marker longitude={USER_LOCATION.lng} latitude={USER_LOCATION.lat} anchor="center">
          <div className="relative">
            <div className="absolute -inset-3 rounded-full bg-blue-500/20 animate-ping" style={{ animationDuration: "2.5s" }} />
            <div className="absolute -inset-2 rounded-full bg-blue-500/10" />
            <div className="h-4 w-4 rounded-full border-2 border-white bg-blue-500 shadow-lg" />
          </div>
        </Marker>

        {markers.map((restaurant, index) => {
          const active = index === activeMarker;
          const price = restaurant.price || (index % 3 === 0 ? "$$$" : "$$");
          return (
            <Marker key={`${restaurant.id}-${index}`} longitude={restaurant.lng} latitude={restaurant.lat} anchor="bottom">
              <button
                type="button"
                onClick={(event) => {
                  event.stopPropagation();
                  onMarkerSelect(index);
                  mapRef.current?.flyTo({ center: [restaurant.lng, restaurant.lat], zoom: Math.max(viewState.zoom, 14.2), duration: 450 });
                }}
                className={`relative cursor-pointer rounded-full px-3 py-1.5 text-[0.8125rem] shadow-[0_4px_12px_rgba(0,0,0,0.22)] transition ${
                  active ? "z-20 scale-110 bg-[#222222] text-white" : "bg-white text-[#222222] hover:scale-105"
                }`}
                style={{ fontWeight: 800 }}
                aria-label={`Show ${restaurant.name}`}
              >
                {price}
              </button>
            </Marker>
          );
        })}
      </MapLibre>

      <div className="absolute left-4 top-4 rounded-full bg-white/95 px-3 py-2 text-[0.8125rem] text-[#222222] shadow-[0_4px_14px_rgba(0,0,0,0.12)]" style={{ fontWeight: 700 }}>
        <MapPin className="mr-1 inline h-3.5 w-3.5" />
        {query || "Restaurants"}
      </div>
    </div>
  );
}

import { useMemo, useState } from "react";
import { Check, MapPin, Navigation, Search, X } from "lucide-react";
import Map, { Marker } from "react-map-gl/maplibre";
import "maplibre-gl/dist/maplibre-gl.css";
import { Text } from "../../../components/ds/Text";
import { PageHeader } from "../profileHelpers";

type UserLocation = {
  name: string;
  address: string;
  lat: number;
  lng: number;
};

const LOCATION_CHOICES: UserLocation[] = [
  { name: "Gangnam Station", address: "Gangnam-gu, Seoul", lat: 37.498, lng: 127.0276 },
  { name: "Garosugil", address: "Sinsa-dong, Gangnam-gu, Seoul", lat: 37.5209, lng: 127.0231 },
  { name: "Itaewon", address: "Itaewon-dong, Yongsan-gu, Seoul", lat: 37.5345, lng: 126.9946 },
  { name: "Hongdae", address: "Mapo-gu, Seoul", lat: 37.5563, lng: 126.9237 },
  { name: "Myeongdong", address: "Jung-gu, Seoul", lat: 37.5636, lng: 126.9869 },
];

const MAP_STYLE: any = {
  version: 8,
  sources: {
    "osm-tiles": {
      type: "raster",
      tiles: ["https://a.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png"],
      tileSize: 256,
      maxzoom: 19,
      attribution: "© OpenStreetMap contributors, © CartoDB",
    },
  },
  layers: [{ id: "osm-tiles-layer", type: "raster", source: "osm-tiles", minzoom: 0, maxzoom: 19 }],
};

export function LocationPage({
  onBack,
  currentLocation,
  onSelect,
}: {
  onBack: () => void;
  currentLocation: UserLocation;
  onSelect: (location: UserLocation) => void;
}) {
  const [mode, setMode] = useState<"search" | "map">("search");
  const [query, setQuery] = useState("");
  const [pickedPin, setPickedPin] = useState<{ lat: number; lng: number } | null>(null);

  const filteredLocations = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return LOCATION_CHOICES;
    return LOCATION_CHOICES.filter(
      (loc) => loc.name.toLowerCase().includes(q) || loc.address.toLowerCase().includes(q),
    );
  }, [query]);

  const pickLocation = (location: UserLocation) => {
    onSelect(location);
    onBack();
  };

  const useCurrentLocation = () => {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        pickLocation({
          name: "My Location",
          address: "Current location",
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        });
      },
      () => {
        pickLocation(currentLocation);
      },
    );
  };

  const handleMapClick = (e: any) => {
    const { lng, lat } = e.lngLat;
    setPickedPin({ lat, lng });
  };

  const confirmPin = () => {
    if (!pickedPin) return;
    pickLocation({
      name: "Picked Location",
      address: `${pickedPin.lat.toFixed(5)}, ${pickedPin.lng.toFixed(5)}`,
      lat: pickedPin.lat,
      lng: pickedPin.lng,
    });
  };

  return (
    <div className="min-h-full bg-white pb-6">
      <PageHeader title="Location" onBack={onBack} />
      <div className="px-5 pt-2 space-y-4">
        <button
          onClick={useCurrentLocation}
          className="w-full flex items-center gap-3 p-3.5 rounded-2xl border border-primary/20 bg-primary/5 hover:bg-primary/10 transition cursor-pointer text-left"
        >
          <div className="w-9 h-9 rounded-full bg-primary/15 flex items-center justify-center shrink-0">
            <Navigation className="w-4 h-4 text-primary" />
          </div>
          <div className="min-w-0">
            <Text className="text-[0.9rem] text-primary font-semibold">Use my current location</Text>
            <Text className="text-[0.75rem] text-muted-foreground">Allow GPS access</Text>
          </div>
        </button>

        <div className="flex rounded-xl bg-secondary p-1 gap-1">
          <button
            onClick={() => setMode("search")}
            className={`flex-1 py-2 rounded-lg text-[0.8125rem] transition cursor-pointer ${
              mode === "search" ? "bg-card shadow-sm text-foreground" : "text-muted-foreground"
            }`}
            style={{ fontWeight: mode === "search" ? 600 : 400 }}
          >
            <Search className="w-3.5 h-3.5 inline mr-1.5 -mt-0.5" />
            Search
          </button>
          <button
            onClick={() => setMode("map")}
            className={`flex-1 py-2 rounded-lg text-[0.8125rem] transition cursor-pointer ${
              mode === "map" ? "bg-card shadow-sm text-foreground" : "text-muted-foreground"
            }`}
            style={{ fontWeight: mode === "map" ? 600 : 400 }}
          >
            <MapPin className="w-3.5 h-3.5 inline mr-1.5 -mt-0.5" />
            Pick on Map
          </button>
        </div>

        {mode === "search" && (
          <>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search neighborhood, city, or address..."
                className="w-full pl-10 pr-9 py-3 rounded-xl border border-border bg-background text-[0.875rem] placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition"
              />
              {query && (
                <button
                  onClick={() => setQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-0.5 rounded-full hover:bg-secondary transition cursor-pointer"
                  aria-label="Clear search"
                >
                  <X className="w-3.5 h-3.5 text-muted-foreground" />
                </button>
              )}
            </div>

            <div className="border border-border rounded-2xl overflow-hidden bg-card">
              {filteredLocations.map((loc, idx) => {
                const isCurrent = currentLocation.name === loc.name && currentLocation.address === loc.address;
                return (
                  <button
                    key={loc.name}
                    onClick={() => pickLocation(loc)}
                    className={`w-full flex items-center gap-3 p-4 text-left hover:bg-secondary/40 transition cursor-pointer ${idx < filteredLocations.length - 1 ? "border-b border-border/60" : ""}`}
                  >
                    <div className="w-9 h-9 rounded-full bg-secondary flex items-center justify-center shrink-0">
                      <MapPin className="w-4.5 h-4.5 text-foreground" strokeWidth={1.5} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <Text className="text-[0.9375rem] font-semibold text-foreground truncate">{loc.name}</Text>
                      <Text className="text-[0.8125rem] text-muted-foreground truncate">{loc.address}</Text>
                    </div>
                    {isCurrent && (
                      <div className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0">
                        <Check className="w-4 h-4" strokeWidth={2.5} />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </>
        )}

        {mode === "map" && (
          <div className="space-y-3">
            <div className="relative rounded-xl overflow-hidden border border-border" style={{ height: 360 }}>
              <Map
                initialViewState={{
                  longitude: currentLocation.lng,
                  latitude: currentLocation.lat,
                  zoom: 12.8,
                }}
                mapStyle={MAP_STYLE}
                onClick={handleMapClick}
                style={{ width: "100%", height: "100%" }}
                maxZoom={19}
                attributionControl={false}
              >
                <Marker longitude={currentLocation.lng} latitude={currentLocation.lat}>
                  <div className="w-4 h-4 rounded-full bg-primary/30 border-2 border-primary flex items-center justify-center">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                  </div>
                </Marker>
                {pickedPin && (
                  <Marker longitude={pickedPin.lng} latitude={pickedPin.lat}>
                    <div className="flex flex-col items-center -mt-8">
                      <MapPin className="w-8 h-8 text-primary fill-primary/15" />
                    </div>
                  </Marker>
                )}
              </Map>
            </div>

            <button
              onClick={confirmPin}
              disabled={!pickedPin}
              className="w-full py-3 rounded-xl bg-primary text-primary-foreground text-[0.875rem] font-semibold flex items-center justify-center gap-2 hover:bg-primary/90 transition cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <Check className="w-4 h-4" />
              Confirm this location
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

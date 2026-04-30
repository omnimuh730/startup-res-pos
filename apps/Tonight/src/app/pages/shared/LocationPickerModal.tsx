import { useState, useRef, useEffect, useCallback } from "react";
import { MapPin, Search, X, Navigation, Check } from "lucide-react";
import Map, { Marker, type MapRef } from "react-map-gl/maplibre";
import "maplibre-gl/dist/maplibre-gl.css";

/* ── Map style ──────────────────────────────────────── */
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
  layers: [
    {
      id: "osm-tiles-layer",
      type: "raster",
      source: "osm-tiles",
      minzoom: 0,
      maxzoom: 19,
    },
  ],
};

/* ── Mock location database for autocomplete ────────── */
const LOCATIONS = [
  { id: "1", name: "Gangnam Station", address: "Gangnam-gu, Seoul", lat: 37.498, lng: 127.0276 },
  { id: "2", name: "Garosugil", address: "Sinsa-dong, Gangnam-gu, Seoul", lat: 37.5209, lng: 127.0231 },
  { id: "3", name: "Itaewon", address: "Itaewon-dong, Yongsan-gu, Seoul", lat: 37.5345, lng: 126.9946 },
  { id: "4", name: "Hongdae", address: "Mapo-gu, Seoul", lat: 37.5563, lng: 126.9237 },
  { id: "5", name: "Myeongdong", address: "Jung-gu, Seoul", lat: 37.5636, lng: 126.9869 },
  { id: "6", name: "Jamsil", address: "Songpa-gu, Seoul", lat: 37.5133, lng: 127.1 },
  { id: "7", name: "Yeouido", address: "Yeongdeungpo-gu, Seoul", lat: 37.5219, lng: 126.9245 },
  { id: "8", name: "Samcheongdong", address: "Jongno-gu, Seoul", lat: 37.5847, lng: 126.9822 },
  { id: "9", name: "Apgujeong Rodeo", address: "Gangnam-gu, Seoul", lat: 37.527, lng: 127.04 },
  { id: "10", name: "Seongsu-dong", address: "Seongdong-gu, Seoul", lat: 37.5446, lng: 127.056 },
  { id: "11", name: "San Francisco Downtown", address: "San Francisco, CA", lat: 37.7849, lng: -122.4074 },
  { id: "12", name: "Los Angeles Koreatown", address: "Los Angeles, CA", lat: 34.0622, lng: -118.3014 },
  { id: "13", name: "Shibuya", address: "Shibuya-ku, Tokyo", lat: 35.6595, lng: 139.7004 },
  { id: "14", name: "Shinjuku", address: "Shinjuku-ku, Tokyo", lat: 35.6938, lng: 139.7034 },
  { id: "15", name: "Ginza", address: "Chuo-ku, Tokyo", lat: 35.6717, lng: 139.7649 },
  { id: "16", name: "Gangnam COEX", address: "Samseong-dong, Gangnam-gu, Seoul", lat: 37.5126, lng: 127.0596 },
  { id: "17", name: "Garosu-gil Cafe Street", address: "Sinsa-dong, Seoul", lat: 37.5198, lng: 127.0235 },
  { id: "18", name: "Garden Grove", address: "Orange County, CA", lat: 33.7743, lng: -117.9379 },
  { id: "19", name: "Georgetown", address: "Washington, DC", lat: 38.9076, lng: -77.0723 },
  { id: "20", name: "Gastown", address: "Vancouver, BC", lat: 49.2846, lng: -123.1089 },
];

interface LocationPickerModalProps {
  open: boolean;
  onClose: () => void;
  onSelect: (location: { name: string; address: string; lat: number; lng: number }) => void;
  currentLocation?: { name: string; lat: number; lng: number };
}

export function LocationPickerModal({ open, onClose, onSelect, currentLocation }: LocationPickerModalProps) {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<typeof LOCATIONS>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [mode, setMode] = useState<"search" | "map">("search");
  const [pickedPin, setPickedPin] = useState<{ lat: number; lng: number } | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const mapRef = useRef<MapRef>(null);

  const defaultCenter = currentLocation
    ? { lat: currentLocation.lat, lng: currentLocation.lng }
    : { lat: 37.498, lng: 127.0276 };

  // Focus input on open
  useEffect(() => {
    if (open && mode === "search") {
      setTimeout(() => inputRef.current?.focus(), 200);
    }
  }, [open, mode]);

  // Autocomplete filter
  useEffect(() => {
    if (query.trim().length === 0) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }
    const q = query.toLowerCase();
    const matched = LOCATIONS.filter(
      (l) => l.name.toLowerCase().includes(q) || l.address.toLowerCase().includes(q)
    ).slice(0, 6);
    setSuggestions(matched);
    setShowSuggestions(matched.length > 0);
  }, [query]);

  const handleSelectSuggestion = useCallback(
    (loc: (typeof LOCATIONS)[number]) => {
      onSelect({ name: loc.name, address: loc.address, lat: loc.lat, lng: loc.lng });
      setQuery("");
      setShowSuggestions(false);
    },
    [onSelect]
  );

  const handleMapClick = useCallback((e: any) => {
    const { lng, lat } = e.lngLat;
    setPickedPin({ lat, lng });
  }, []);

  const handleConfirmPin = useCallback(() => {
    if (pickedPin) {
      const buildings = [
        "Starbucks Reserve", "City Hall", "Central Library", "Grand Hotel",
        "Metro Station", "Riverside Park", "Shopping Mall", "Art Gallery",
        "Tech Campus", "Union Square", "Market Street", "Heritage Tower",
        "Sunset Plaza", "Garden Court", "Broadway Center", "Hillcrest Tower",
      ];
      const hash = Math.abs(Math.floor(pickedPin.lat * 1000 + pickedPin.lng * 1000)) % buildings.length;
      const nearbyName = buildings[hash];
      onSelect({
        name: `Nearby ${nearbyName}`,
        address: "Custom location",
        lat: pickedPin.lat,
        lng: pickedPin.lng,
      });
      setPickedPin(null);
    }
  }, [pickedPin, onSelect]);

  const handleUseMyLocation = useCallback(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          onSelect({
            name: "My Location",
            address: "Current location",
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
          });
        },
        () => {
          onSelect({
            name: "Current Location",
            address: "Seoul, South Korea",
            lat: defaultCenter.lat,
            lng: defaultCenter.lng,
          });
        }
      );
    } else {
      onSelect({
        name: "Current Location",
        address: "Seoul, South Korea",
        lat: defaultCenter.lat,
        lng: defaultCenter.lng,
      });
    }
  }, [onSelect, defaultCenter]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[500] flex items-end justify-center sm:items-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div className="relative w-full sm:max-w-md mx-auto bg-card rounded-t-2xl sm:rounded-2xl overflow-hidden shadow-2xl max-h-[90vh] flex flex-col animate-in slide-in-from-bottom duration-300">
        {/* Header */}
        <div className="flex items-center justify-between px-4 pt-4 pb-2">
          <h3 className="text-[1.0625rem]" style={{ fontWeight: 700 }}>Set Location</h3>
          <button onClick={onClose} className="p-1.5 rounded-full hover:bg-secondary transition cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Mode tabs */}
        <div className="flex mx-4 mb-3 rounded-xl bg-secondary p-1 gap-1">
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

        {/* Use my location button */}
        <button
          onClick={handleUseMyLocation}
          className="mx-4 mb-3 flex items-center gap-2.5 px-3 py-2.5 rounded-xl border border-primary/20 bg-primary/5 hover:bg-primary/10 transition cursor-pointer"
        >
          <div className="w-8 h-8 rounded-full bg-primary/15 flex items-center justify-center shrink-0">
            <Navigation className="w-4 h-4 text-primary" />
          </div>
          <div className="text-left">
            <p className="text-[0.8125rem] text-primary" style={{ fontWeight: 600 }}>Use my current location</p>
            <p className="text-[0.6875rem] text-muted-foreground">Allow GPS access</p>
          </div>
        </button>

        {/* Search mode */}
        {mode === "search" && (
          <div className="flex-1 px-4 pb-4 overflow-y-auto">
            {/* Search input */}
            <div className="relative mb-2">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search neighborhood, city, or address..."
                className="w-full pl-10 pr-9 py-3 rounded-xl border border-border bg-background text-[0.875rem] placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition"
              />
              {query && (
                <button
                  onClick={() => { setQuery(""); setSuggestions([]); setShowSuggestions(false); }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-0.5 rounded-full hover:bg-secondary transition cursor-pointer"
                >
                  <X className="w-3.5 h-3.5 text-muted-foreground" />
                </button>
              )}
            </div>

            {/* Autocomplete suggestions */}
            {showSuggestions && (
              <div className="border border-border rounded-xl overflow-hidden bg-card shadow-sm mb-3">
                {suggestions.map((s, i) => (
                  <button
                    key={s.id}
                    onClick={() => handleSelectSuggestion(s)}
                    className={`w-full flex items-center gap-3 px-3 py-3 text-left hover:bg-secondary/50 transition cursor-pointer ${
                      i < suggestions.length - 1 ? "border-b border-border/50" : ""
                    }`}
                  >
                    <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center shrink-0">
                      <MapPin className="w-4 h-4 text-muted-foreground" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[0.875rem] truncate" style={{ fontWeight: 500 }}>
                        {highlightMatch(s.name, query)}
                      </p>
                      <p className="text-[0.75rem] text-muted-foreground truncate">{s.address}</p>
                    </div>
                  </button>
                ))}
              </div>
            )}

            {/* Empty state or recent */}
            {!showSuggestions && query.length === 0 && (
              <div className="mt-2">
                <p className="text-[0.75rem] text-muted-foreground mb-2 px-1" style={{ fontWeight: 500 }}>
                  Popular Areas
                </p>
                <div className="flex flex-wrap gap-2">
                  {LOCATIONS.slice(0, 10).map((l) => (
                    <button
                      key={l.id}
                      onClick={() => handleSelectSuggestion(l)}
                      className="px-3 py-1.5 rounded-full border border-border bg-secondary/40 text-[0.75rem] hover:bg-secondary transition cursor-pointer"
                    >
                      {l.name}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* No results */}
            {query.length > 0 && suggestions.length === 0 && (
              <div className="text-center py-8">
                <MapPin className="w-8 h-8 text-muted-foreground/30 mx-auto mb-2" />
                <p className="text-[0.8125rem] text-muted-foreground">No locations found</p>
                <p className="text-[0.75rem] text-muted-foreground/60 mt-0.5">Try a different search term</p>
              </div>
            )}
          </div>
        )}

        {/* Map mode */}
        {mode === "map" && (
          <div className="flex-1 px-4 pb-4">
            <div className="relative rounded-xl overflow-hidden border border-border" style={{ height: 320 }}>
              <Map
                ref={mapRef}
                initialViewState={{
                  longitude: defaultCenter.lng,
                  latitude: defaultCenter.lat,
                  zoom: 13,
                }}
                mapStyle={MAP_STYLE}
                onClick={handleMapClick}
                style={{ width: "100%", height: "100%" }}
                maxZoom={19}
                attributionControl={false}
              >
                {/* Current location marker */}
                <Marker longitude={defaultCenter.lng} latitude={defaultCenter.lat}>
                  <div className="w-4 h-4 rounded-full bg-primary/30 border-2 border-primary flex items-center justify-center">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                  </div>
                </Marker>

                {/* Picked pin */}
                {pickedPin && (
                  <Marker longitude={pickedPin.lng} latitude={pickedPin.lat}>
                    <div className="flex flex-col items-center -mt-8">
                      <MapPin className="w-8 h-8 text-destructive fill-destructive/20" />
                    </div>
                  </Marker>
                )}
              </Map>

              {/* Instruction overlay */}
              {!pickedPin && (
                <div className="absolute bottom-3 left-3 right-3 bg-card/90 backdrop-blur-sm rounded-lg px-3 py-2 text-center">
                  <p className="text-[0.75rem] text-muted-foreground">Tap on the map to drop a pin</p>
                </div>
              )}
            </div>

            {/* Confirm pin button */}
            {pickedPin && (
              <button
                onClick={handleConfirmPin}
                className="w-full mt-3 py-3 rounded-xl bg-primary text-primary-foreground text-[0.875rem] flex items-center justify-center gap-2 hover:bg-primary/90 transition cursor-pointer"
                style={{ fontWeight: 600 }}
              >
                <Check className="w-4 h-4" />
                Confirm this location
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

/* ── Helper: highlight matching text ────────────────── */
function highlightMatch(text: string, query: string) {
  if (!query.trim()) return text;
  const idx = text.toLowerCase().indexOf(query.toLowerCase());
  if (idx === -1) return text;
  return (
    <>
      {text.slice(0, idx)}
      <span className="text-primary" style={{ fontWeight: 700 }}>{text.slice(idx, idx + query.length)}</span>
      {text.slice(idx + query.length)}
    </>
  );
}

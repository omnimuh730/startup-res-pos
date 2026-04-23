import { useState, useRef, useCallback, useEffect } from "react";
import { SectionWrapper, ComponentCard } from "../section-wrapper";
import { MapPin, Star, Phone, Globe, Clock, RotateCcw, Box } from "lucide-react";
import Map, { Marker, Popup, NavigationControl, ScaleControl } from "react-map-gl/maplibre";
import type { MapRef } from "react-map-gl/maplibre";
import "maplibre-gl/dist/maplibre-gl.css";


interface MapLocation {
  id: string;
  name: string;
  type: string;
  longitude: number;
  latitude: number;
  rating?: number;
  price?: string;
}

const locations: MapLocation[] = [
  { id: "1", name: "Luxury Beach Villa", type: "Villa", longitude: -122.45, latitude: 37.78, rating: 4.95, price: "$285" },
  { id: "2", name: "Mountain Cabin", type: "Cabin", longitude: -122.41, latitude: 37.80, rating: 4.88, price: "$165" },
  { id: "3", name: "City Loft", type: "Apartment", longitude: -122.43, latitude: 37.76, rating: 4.72, price: "$120" },
  { id: "4", name: "Countryside Cottage", type: "Cottage", longitude: -122.48, latitude: 37.77, rating: 4.91, price: "$195" },
  { id: "5", name: "Lakeside Retreat", type: "House", longitude: -122.40, latitude: 37.79, rating: 4.85, price: "$210" },
  { id: "6", name: "Urban Studio", type: "Studio", longitude: -122.46, latitude: 37.75, rating: 4.65, price: "$89" },
  { id: "7", name: "Desert Oasis", type: "Villa", longitude: -122.44, latitude: 37.81, rating: 4.93, price: "$320" },
  { id: "8", name: "Forest Treehouse", type: "Treehouse", longitude: -122.42, latitude: 37.74, rating: 4.97, price: "$175" },
];

// MapLibre GL styles for light and dark modes
const LIGHT_STYLE: any = {
  version: 8 as const,
  sources: {
    "osm-tiles": {
      type: "raster" as const,
      tiles: ["https://tile.openstreetmap.org/{z}/{x}/{y}.png"],
      tileSize: 256,
      attribution: "© OpenStreetMap contributors"
    }
  },
  layers: [
    {
      id: "osm-tiles-layer",
      type: "raster" as const,
      source: "osm-tiles",
      minzoom: 0,
      maxzoom: 19
    }
  ]
};

const DARK_STYLE: any = {
  version: 8 as const,
  sources: {
    "dark-tiles": {
      type: "raster" as const,
      tiles: ["https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}.png"],
      tileSize: 256,
      attribution: "© Stadia Maps © OpenMapTiles © OpenStreetMap contributors"
    }
  },
  layers: [
    {
      id: "dark-tiles-layer",
      type: "raster" as const,
      source: "dark-tiles",
      minzoom: 0,
      maxzoom: 19
    }
  ]
};

export function MapSection() {
  const [selected, setSelected] = useState<MapLocation | null>(null);
  const [mapStyle, setMapStyle] = useState<"light" | "dark">("light");
  const [viewState, setViewState] = useState({
    longitude: -122.44,
    latitude: 37.77,
    zoom: 12,
    pitch: 0,
    bearing: 0
  });

  const mapRef = useRef<MapRef>(null);
  const isDraggingRight = useRef(false);
  const lastMousePos = useRef({ x: 0, y: 0 });

  // Inject custom styles for map popups
  useEffect(() => {
    const style = document.createElement("style");
    style.textContent = `
      .maplibregl-popup-content {
        background: var(--card) !important;
        border: 1px solid var(--border) !important;
        border-radius: 0.75rem !important;
        padding: 0 !important;
        box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1) !important;
      }
      .maplibregl-popup-close-button {
        font-size: 1.25rem !important;
        padding: 0.25rem 0.5rem !important;
        color: var(--muted-foreground) !important;
      }
      .maplibregl-popup-close-button:hover {
        background: transparent !important;
        color: var(--foreground) !important;
      }
      .maplibregl-popup-tip {
        border-top-color: var(--card) !important;
      }
      .maplibregl-ctrl-group button {
        background: var(--card) !important;
        border-color: var(--border) !important;
      }
      .maplibregl-ctrl-group button:hover {
        background: var(--secondary) !important;
      }
      .maplibregl-ctrl-group button + button {
        border-top-color: var(--border) !important;
      }
      .maplibregl-ctrl-compass {
        border-color: var(--border) !important;
      }
    `;
    document.head.appendChild(style);
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (e.button === 2) {
      isDraggingRight.current = true;
      lastMousePos.current = { x: e.clientX, y: e.clientY };
      e.preventDefault();
    }
  }, []);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (isDraggingRight.current) {
      const dx = e.clientX - lastMousePos.current.x;
      const dy = e.clientY - lastMousePos.current.y;

      setViewState((prev) => ({
        ...prev,
        bearing: prev.bearing + dx * 0.3,
        pitch: Math.max(0, Math.min(85, prev.pitch - dy * 0.3))
      }));

      lastMousePos.current = { x: e.clientX, y: e.clientY };
    }
  }, []);

  const handleMouseUp = useCallback(() => {
    isDraggingRight.current = false;
  }, []);

  const handleContextMenu = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
  }, []);

  const reset = () => {
    if (mapRef.current) {
      mapRef.current.flyTo({
        center: [-122.44, 37.77],
        zoom: 12,
        pitch: 0,
        bearing: 0,
        duration: 1000
      });
    }
  };

  const toggle3D = () => {
    if (mapRef.current) {
      const map = mapRef.current.getMap();
      const currentPitch = map.getPitch();
      if (currentPitch === 0) {
        map.easeTo({ pitch: 60, duration: 500 });
      } else {
        map.easeTo({ pitch: 0, bearing: 0, duration: 500 });
      }
    }
  };

  return (
    <SectionWrapper
      id="map"
      title="Map View"
      description="Interactive map with pan (left-click drag), zoom (scroll), rotate (right-click drag horizontal), and tilt (right-click drag vertical). Powered by MapLibre GL."
    >
      <ComponentCard title="Interactive Map">
        <p className="text-[0.75rem] text-muted-foreground mb-3">
          🖱️ <strong>Left-drag</strong> to pan • <strong>Scroll</strong> to zoom • <strong>Right-drag horizontally</strong> to rotate view • <strong>Right-drag vertically</strong> to tilt (3D) • Click <strong>3D</strong> for quick perspective toggle
        </p>
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Map container */}
          <div
            className="relative flex-1 rounded-xl overflow-hidden border border-border min-h-[500px]"
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onContextMenu={handleContextMenu}
          >
            <Map
              ref={mapRef}
              initialViewState={viewState}
              {...viewState}
              onMove={(evt) => setViewState(evt.viewState)}
              mapStyle={mapStyle === "light" ? LIGHT_STYLE : DARK_STYLE}
              style={{ width: "100%", height: "100%" }}
              scrollZoom={true}
              dragPan={!isDraggingRight.current}
              dragRotate={false}
              touchPitch={true}
              touchZoomRotate={true}
              attributionControl={false}
            >
              {/* Markers */}
              {locations.map((loc) => (
                <Marker
                  key={loc.id}
                  longitude={loc.longitude}
                  latitude={loc.latitude}
                  anchor="bottom"
                  onClick={(e) => {
                    e.originalEvent.stopPropagation();
                    setSelected(selected?.id === loc.id ? null : loc);
                  }}
                >
                  <div className="cursor-pointer group">
                    <div
                      className={`px-2.5 py-1.5 rounded-full shadow-lg text-[0.75rem] transition-all ${
                        selected?.id === loc.id
                          ? "bg-foreground text-background scale-110"
                          : "bg-card text-foreground border border-border hover:scale-110 hover:shadow-xl"
                      }`}
                    >
                      {loc.price}
                    </div>
                  </div>
                </Marker>
              ))}

              {/* Popup */}
              {selected && (
                <Popup
                  longitude={selected.longitude}
                  latitude={selected.latitude}
                  anchor="bottom"
                  offset={20}
                  onClose={() => setSelected(null)}
                  closeButton={true}
                  closeOnClick={false}
                  className="map-popup"
                >
                  <div className="p-3 min-w-[200px]">
                    <h4 className="text-[0.875rem] leading-tight mb-1">{selected.name}</h4>
                    <p className="text-[0.75rem] text-muted-foreground mb-2">{selected.type}</p>
                    {selected.rating && (
                      <div className="flex items-center gap-1 mb-2">
                        <Star className="w-3.5 h-3.5 text-primary fill-primary" />
                        <span className="text-[0.8125rem]">{selected.rating}</span>
                        <span className="text-[0.75rem] text-muted-foreground">({Math.floor(Math.random() * 200 + 20)} reviews)</span>
                      </div>
                    )}
                    {selected.price && (
                      <p className="text-[0.875rem] mb-3">
                        {selected.price} <span className="text-muted-foreground text-[0.8125rem]">/ night</span>
                      </p>
                    )}
                    <button className="w-full py-2 bg-primary text-primary-foreground text-[0.75rem] rounded-lg hover:opacity-90 cursor-pointer transition-opacity">
                      Book Now
                    </button>
                  </div>
                </Popup>
              )}

              {/* Navigation controls */}
              <NavigationControl position="top-right" showCompass={true} showZoom={true} />
              <ScaleControl position="bottom-right" />
            </Map>

            {/* Custom controls */}
            <div className="absolute top-3 right-14 flex flex-col gap-1 z-10">
              <button
                onClick={toggle3D}
                className={`w-8 h-8 border rounded-lg flex items-center justify-center shadow-sm cursor-pointer transition-colors ${
                  viewState.pitch > 0 ? "bg-primary text-primary-foreground border-primary" : "bg-card border-border hover:bg-secondary"
                }`}
                title="Toggle 3D view"
              >
                <Box className="w-4 h-4" />
              </button>
              <button
                onClick={reset}
                className="w-8 h-8 bg-card border border-border rounded-lg flex items-center justify-center shadow-sm hover:bg-secondary cursor-pointer"
                title="Reset view"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Map style toggle */}
            <div className="absolute bottom-3 left-3 flex gap-1 bg-card/90 backdrop-blur-sm border border-border rounded-lg p-1 z-10">
              {(["light", "dark"] as const).map((s) => (
                <button
                  key={s}
                  onClick={() => setMapStyle(s)}
                  className={`px-2.5 py-1 rounded-md text-[0.6875rem] cursor-pointer transition-colors ${
                    mapStyle === s ? "bg-primary text-primary-foreground" : "hover:bg-secondary"
                  }`}
                >
                  {s.charAt(0).toUpperCase() + s.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Listing sidebar */}
          <div className="w-full lg:w-64 space-y-2 max-h-[500px] overflow-y-auto">
            <p className="text-[0.75rem] text-muted-foreground uppercase tracking-wider px-1 mb-2">
              {locations.length} places
            </p>
            {locations.map((loc) => (
              <button
                key={loc.id}
                onClick={() => setSelected(loc)}
                className={`w-full text-left p-3 rounded-xl border transition-all cursor-pointer ${
                  selected?.id === loc.id
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-primary/30 hover:bg-secondary/50"
                }`}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-[0.8125rem]">{loc.name}</p>
                    <p className="text-[0.6875rem] text-muted-foreground">{loc.type}</p>
                  </div>
                  {loc.rating && (
                    <div className="flex items-center gap-0.5">
                      <Star className="w-3 h-3 fill-foreground" />
                      <span className="text-[0.6875rem]">{loc.rating}</span>
                    </div>
                  )}
                </div>
                {loc.price && (
                  <p className="text-[0.8125rem] mt-1">
                    {loc.price} <span className="text-muted-foreground text-[0.6875rem]">/ night</span>
                  </p>
                )}
              </button>
            ))}
          </div>
        </div>
      </ComponentCard>

      <ComponentCard title="Location Cards">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { name: "San Francisco, CA", time: "PST (UTC-8)", phone: "+1 (415)", stat: "4.8M pop." },
            { name: "Tokyo, Japan", time: "JST (UTC+9)", phone: "+81", stat: "13.9M pop." },
            { name: "London, UK", time: "GMT (UTC+0)", phone: "+44", stat: "8.9M pop." },
          ].map((city) => (
            <div key={city.name} className="p-4 rounded-xl border border-border bg-card hover:shadow-md transition-shadow">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                  <MapPin className="w-4 h-4 text-primary" />
                </div>
                <h4 className="text-[0.875rem]">{city.name}</h4>
              </div>
              <div className="space-y-1.5">
                <div className="flex items-center gap-2 text-[0.75rem] text-muted-foreground">
                  <Clock className="w-3 h-3" /> {city.time}
                </div>
                <div className="flex items-center gap-2 text-[0.75rem] text-muted-foreground">
                  <Phone className="w-3 h-3" /> {city.phone}
                </div>
                <div className="flex items-center gap-2 text-[0.75rem] text-muted-foreground">
                  <Globe className="w-3 h-3" /> {city.stat}
                </div>
              </div>
            </div>
          ))}
        </div>
      </ComponentCard>
    </SectionWrapper>
  );
}

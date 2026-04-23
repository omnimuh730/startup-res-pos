import { useState, useRef, useCallback, useEffect } from "react";
import { Text } from "../../components/ds/Text";
import Map, { Marker, NavigationControl, ScaleControl, type MapRef } from "react-map-gl/maplibre";
import "maplibre-gl/dist/maplibre-gl.css";
import { MapPin, Navigation, RotateCcw, Box } from "lucide-react";

// ── Map tile styles ────────────────────────────────────────
const LIGHT_STYLE: any = {
  version: 8 as const,
  sources: {
    "osm-tiles": {
      type: "raster" as const,
      tiles: ["https://a.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png"],
      tileSize: 256,
      maxzoom: 19,
      attribution: "© OpenStreetMap contributors, © CartoDB",
    },
  },
  layers: [
    {
      id: "osm-tiles-layer",
      type: "raster" as const,
      source: "osm-tiles",
      minzoom: 0,
      maxzoom: 19,
    },
  ],
};

const DARK_STYLE: any = {
  version: 8 as const,
  sources: {
    "dark-tiles": {
      type: "raster" as const,
      tiles: [
        "https://a.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png",
      ],
      tileSize: 256,
      maxzoom: 19,
      attribution:
        "© OpenStreetMap contributors, © CartoDB",
    },
  },
  layers: [
    {
      id: "dark-tiles-layer",
      type: "raster" as const,
      source: "dark-tiles",
      minzoom: 0,
      maxzoom: 19,
    },
  ],
};

// ── Coordinate lookup by address hash (mock) ───────────────
const COORD_MAP: Record<string, { lng: number; lat: number }> = {
  "243 S San Pedro St, Los Angeles, CA 90012": { lng: -118.2395, lat: 34.0465 },
  "456 Market St, San Francisco, CA 94105": { lng: -122.3988, lat: 37.7912 },
  "789 Mission St, San Francisco, CA 94103": { lng: -122.4014, lat: 37.7847 },
  "101 Main St, San Francisco, CA 94102": { lng: -122.3942, lat: 37.7907 },
  "555 Pier St, San Francisco, CA 94133": { lng: -122.4098, lat: 37.8067 },
  "222 Brunch Ave, San Francisco, CA 94110": { lng: -122.4194, lat: 37.7499 },
  "333 Nightlife Blvd, San Francisco, CA 94107": { lng: -122.3904, lat: 37.7816 },
};

// ── User location (mock – SF downtown) ─────────────────────
const USER_LOCATION = { lng: -122.4074, lat: 37.7849 };

// ── Direction line as SVG polyline overlayed ────────────────
function DirectionLine({
  from,
  to,
  project,
}: {
  from: { lng: number; lat: number };
  to: { lng: number; lat: number };
  project: (lngLat: [number, number]) => { x: number; y: number } | null;
}) {
  const p1 = project([from.lng, from.lat]);
  const p2 = project([to.lng, to.lat]);
  if (!p1 || !p2) return null;

  // Create a curved path
  const mx = (p1.x + p2.x) / 2;
  const my = (p1.y + p2.y) / 2 - 30;
  const d = `M ${p1.x} ${p1.y} Q ${mx} ${my} ${p2.x} ${p2.y}`;

  return (
    <svg
      className="absolute inset-0 pointer-events-none z-[5]"
      style={{ width: "100%", height: "100%" }}
    >
      {/* Shadow */}
      <path
        d={d}
        fill="none"
        stroke="var(--primary)"
        strokeWidth="5"
        strokeLinecap="round"
        opacity="0.15"
      />
      {/* Main line */}
      <path
        d={d}
        fill="none"
        stroke="var(--primary)"
        strokeWidth="3"
        strokeLinecap="round"
        strokeDasharray="8 6"
      >
        <animate
          attributeName="stroke-dashoffset"
          from="28"
          to="0"
          dur="1.5s"
          repeatCount="indefinite"
        />
      </path>
    </svg>
  );
}

// ── Props ──────────────────────────────────────────────────
interface MapViewProps {
  address: string;
  restaurantName: string;
  className?: string;
  height?: string;
}

export function MapView({
  address,
  restaurantName,
  className = "",
  height = "h-56",
}: MapViewProps) {
  const mapRef = useRef<MapRef>(null);
  const coords = COORD_MAP[address] ?? { lng: -122.41, lat: 37.78 };
  const isDraggingRight = useRef(false);
  const lastMousePos = useRef({ x: 0, y: 0 });
  const [showDirection, setShowDirection] = useState(false);
  const [, forceRender] = useState(0);

  const [viewState, setViewState] = useState({
    longitude: (coords.lng + USER_LOCATION.lng) / 2,
    latitude: (coords.lat + USER_LOCATION.lat) / 2,
    zoom: 13,
    pitch: 0,
    bearing: 0,
  });

  // Detect dark mode
  const [isDark, setIsDark] = useState(false);
  useEffect(() => {
    const check = () =>
      setIsDark(document.documentElement.classList.contains("dark"));
    check();
    const obs = new MutationObserver(check);
    obs.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });
    return () => obs.disconnect();
  }, []);

  // Inject custom styles for map controls
  useEffect(() => {
    const id = "map-view-style-restaurant";
    if (document.getElementById(id)) return;
    const style = document.createElement("style");
    style.id = id;
    style.textContent = `
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
    `;
    document.head.appendChild(style);
    return () => {
      document.getElementById(id)?.remove();
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
        pitch: Math.max(0, Math.min(85, prev.pitch - dy * 0.3)),
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

  const handleDirection = () => {
    setShowDirection(true);
    if (mapRef.current) {
      const bounds: [[number, number], [number, number]] = [
        [
          Math.min(USER_LOCATION.lng, coords.lng) - 0.01,
          Math.min(USER_LOCATION.lat, coords.lat) - 0.005,
        ],
        [
          Math.max(USER_LOCATION.lng, coords.lng) + 0.01,
          Math.max(USER_LOCATION.lat, coords.lat) + 0.005,
        ],
      ];
      mapRef.current.fitBounds(bounds, {
        padding: 50,
        duration: 800,
      });
    }
  };

  const reset = () => {
    setShowDirection(false);
    if (mapRef.current) {
      mapRef.current.flyTo({
        center: [(coords.lng + USER_LOCATION.lng) / 2, (coords.lat + USER_LOCATION.lat) / 2],
        zoom: 13,
        pitch: 0,
        bearing: 0,
        duration: 800,
      });
    }
  };

  const toggle3D = () => {
    if (mapRef.current) {
      const map = mapRef.current.getMap();
      const currentPitch = map.getPitch();
      if (currentPitch === 0) {
        map.easeTo({ pitch: 55, duration: 500 });
      } else {
        map.easeTo({ pitch: 0, bearing: 0, duration: 500 });
      }
    }
  };

  // Project function for direction line
  const project = useCallback(
    (lngLat: [number, number]) => {
      if (!mapRef.current) return null;
      const map = mapRef.current.getMap();
      const p = map.project(lngLat as any);
      return { x: p.x, y: p.y };
    },
    []
  );

  // Compute distance (Haversine)
  const R = 6371;
  const dLat = ((coords.lat - USER_LOCATION.lat) * Math.PI) / 180;
  const dLon = ((coords.lng - USER_LOCATION.lng) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((USER_LOCATION.lat * Math.PI) / 180) *
      Math.cos((coords.lat * Math.PI) / 180) *
      Math.sin(dLon / 2) ** 2;
  const dist = R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distStr = dist < 1 ? `${Math.round(dist * 1000)}m` : `${dist.toFixed(1)}km`;
  const walkMin = Math.round((dist / 5) * 60);

  return (
    <div className={`relative rounded-xl overflow-hidden ${height} ${className}`}>
      <div
        className="w-full h-full"
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
          onMove={(evt) => {
            setViewState(evt.viewState);
            if (showDirection) forceRender((n) => n + 1);
          }}
          mapStyle={isDark ? DARK_STYLE : LIGHT_STYLE}
          style={{ width: "100%", height: "100%" }}
          maxZoom={19}
          scrollZoom={true}
          dragPan={!isDraggingRight.current}
          dragRotate={false}
          touchPitch={true}
          touchZoomRotate={true}
          attributionControl={false}
        >
          {/* User location marker (blue dot) */}
          <Marker
            longitude={USER_LOCATION.lng}
            latitude={USER_LOCATION.lat}
            anchor="center"
          >
            <div className="relative">
              <div className="absolute -inset-3 rounded-full bg-blue-500/20 animate-ping" style={{ animationDuration: "2.5s" }} />
              <div className="absolute -inset-2 rounded-full bg-blue-500/10" />
              <div className="w-4 h-4 rounded-full bg-blue-500 border-2 border-white shadow-lg" />
            </div>
          </Marker>

          {/* Restaurant marker (primary pin) */}
          <Marker
            longitude={coords.lng}
            latitude={coords.lat}
            anchor="bottom"
          >
            <div className="flex flex-col items-center">
              <div className="relative">
                <div className="w-9 h-9 rounded-full bg-primary flex items-center justify-center shadow-lg shadow-primary/30 border-2 border-white">
                  <MapPin
                    className="w-4 h-4 text-primary-foreground"
                    fill="currentColor"
                  />
                </div>
                {/* Triangle pointer */}
                <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[6px] border-r-[6px] border-t-[8px] border-l-transparent border-r-transparent border-t-primary" />
              </div>
            </div>
          </Marker>

          <NavigationControl position="top-right" showCompass={true} showZoom={true} />
          <ScaleControl position="bottom-right" />
        </Map>

        {/* Direction dashed line */}
        {showDirection && (
          <DirectionLine from={USER_LOCATION} to={coords} project={project} />
        )}
      </div>

      {/* Custom controls */}
      <div className="absolute top-3 right-14 flex flex-col gap-1 z-10">
        <button
          onClick={toggle3D}
          className={`w-8 h-8 border rounded-lg flex items-center justify-center shadow-sm cursor-pointer transition-colors ${
            viewState.pitch > 0
              ? "bg-primary text-primary-foreground border-primary"
              : "bg-card border-border hover:bg-secondary"
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

      {/* Info bar + Direction button */}
      <div className="absolute bottom-0 left-0 right-0 bg-card/95 backdrop-blur-sm border-t border-border px-3 py-2.5 flex items-center gap-2 z-10">
        <MapPin className="w-4 h-4 text-primary shrink-0" />
        <div className="flex-1 min-w-0">
          <Text className="text-[0.875rem] truncate" style={{ fontWeight: 500 }}>{restaurantName}</Text>
          <Text className="text-[0.8125rem] text-muted-foreground truncate">{address}</Text>
        </div>
        {showDirection ? (
          <div className="flex items-center gap-2 shrink-0">
            <div className="text-right">
              <Text className="text-[0.8125rem] text-primary" style={{ fontWeight: 600 }}>{distStr}</Text>
              <Text className="text-[0.75rem] text-muted-foreground">~{walkMin} min walk</Text>
            </div>
          </div>
        ) : (
          <button
            onClick={handleDirection}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary text-primary-foreground text-[0.8125rem] shadow-md hover:opacity-90 transition shrink-0 cursor-pointer"
          >
            <Navigation className="w-3.5 h-3.5" />
            Directions
          </button>
        )}
      </div>

      {/* Legend */}
      <div className="absolute top-3 left-3 flex flex-col gap-1 z-10">
        <div className="flex items-center gap-1.5 bg-card/90 backdrop-blur-sm border border-border rounded-lg px-2 py-1">
          <div className="w-2.5 h-2.5 rounded-full bg-blue-500" />
          <span className="text-[0.6875rem] text-muted-foreground">You</span>
        </div>
        <div className="flex items-center gap-1.5 bg-card/90 backdrop-blur-sm border border-border rounded-lg px-2 py-1">
          <div className="w-2.5 h-2.5 rounded-full bg-primary" />
          <span className="text-[0.6875rem] text-muted-foreground">Restaurant</span>
        </div>
      </div>
    </div>
  );
}

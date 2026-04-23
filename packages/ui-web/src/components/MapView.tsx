import Map, { Marker, NavigationControl } from "react-map-gl/maplibre";
import "maplibre-gl/dist/maplibre-gl.css";
import { useMemo } from "react";
import { getRegionFromMarkers, type MapMarker, type MapRegion } from "@rn/ui-core";

export interface MapViewProps {
  markers: MapMarker[];
  fallbackRegion?: MapRegion;
  height?: number;
}

const defaultFallback: MapRegion = {
  latitude: 37.77,
  longitude: -122.44,
  latitudeDelta: 0.2,
  longitudeDelta: 0.2
};

const mapStyle: any = {
  version: 8,
  sources: {
    osm: {
      type: "raster",
      tiles: ["https://tile.openstreetmap.org/{z}/{x}/{y}.png"],
      tileSize: 256
    }
  },
  layers: [
    {
      id: "osm",
      type: "raster",
      source: "osm"
    }
  ]
} as const;

export function MapView({ markers, fallbackRegion = defaultFallback, height = 260 }: MapViewProps) {
  const region = useMemo(() => getRegionFromMarkers(markers, fallbackRegion), [markers, fallbackRegion]);
  const zoom = Math.max(3, 11 - Math.log2(region.latitudeDelta + region.longitudeDelta));

  return (
    <div style={{ width: "100%", height, borderRadius: 12, overflow: "hidden", border: "1px solid #ddd" }}>
      <Map
        initialViewState={{
          latitude: region.latitude,
          longitude: region.longitude,
          zoom
        }}
        mapStyle={mapStyle}
        style={{ width: "100%", height: "100%" }}
      >
        <NavigationControl position="top-right" />
        {markers.map((marker) => (
          <Marker key={marker.id} latitude={marker.latitude} longitude={marker.longitude}>
            <div style={{ width: 12, height: 12, borderRadius: 999, backgroundColor: "#FF385C" }} title={marker.label ?? marker.id} />
          </Marker>
        ))}
      </Map>
    </div>
  );
}

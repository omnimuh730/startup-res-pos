export interface MapMarker {
  id: string;
  latitude: number;
  longitude: number;
  label?: string;
}

export interface MapRegion {
  latitude: number;
  longitude: number;
  latitudeDelta: number;
  longitudeDelta: number;
}

export function getRegionFromMarkers(markers: MapMarker[], fallback: MapRegion): MapRegion {
  if (markers.length === 0) {
    return fallback;
  }

  let minLat = markers[0].latitude;
  let maxLat = markers[0].latitude;
  let minLng = markers[0].longitude;
  let maxLng = markers[0].longitude;

  for (const marker of markers) {
    minLat = Math.min(minLat, marker.latitude);
    maxLat = Math.max(maxLat, marker.latitude);
    minLng = Math.min(minLng, marker.longitude);
    maxLng = Math.max(maxLng, marker.longitude);
  }

  const latitude = (minLat + maxLat) / 2;
  const longitude = (minLng + maxLng) / 2;
  const latitudeDelta = Math.max(0.05, (maxLat - minLat) * 1.5);
  const longitudeDelta = Math.max(0.05, (maxLng - minLng) * 1.5);

  return { latitude, longitude, latitudeDelta, longitudeDelta };
}

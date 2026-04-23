import { StyleSheet, Text, View } from "react-native";
import { getRegionFromMarkers, type MapMarker, type MapRegion } from "@rn/ui-core";
import { useMemo } from "react";
import { useNativeTheme } from "../theme/provider";

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

export function MapView({ markers, fallbackRegion = defaultFallback, height = 240 }: MapViewProps) {
  const { colors } = useNativeTheme();
  const region = useMemo(() => getRegionFromMarkers(markers, fallbackRegion), [markers, fallbackRegion]);

  return (
    <View style={[styles.container, { borderColor: colors.border, backgroundColor: colors.muted, height }]}>
      <Text style={{ color: colors.foreground, fontSize: 13, fontWeight: "600" }}>
        Map View Placeholder
      </Text>
      <Text style={{ color: colors.mutedForeground, fontSize: 12, marginTop: 6 }}>
        center: {region.latitude.toFixed(4)}, {region.longitude.toFixed(4)}
      </Text>
      <Text style={{ color: colors.mutedForeground, fontSize: 12 }}>
        markers: {markers.length}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    borderWidth: 1,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center"
  }
});

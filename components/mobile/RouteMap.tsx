import { useEffect, useRef } from 'react';
import { StyleSheet, type StyleProp, type ViewStyle } from 'react-native';
import NativeMapView, { Marker, Polyline } from 'react-native-maps';

import { colors, palette } from '@/src/constants/theme';
import type { GeoPoint } from '@/src/types/common';

/** Space covered by content on top of the map, kept clear when fitting the points. */
export type MapInsets = { top?: number; bottom?: number };

export type RouteMapProps = {
  origin?: GeoPoint | null;
  destination?: GeoPoint | null;
  originLabel?: string;
  destinationLabel?: string;
  /** false = decorative background: no panning, zooming or tapping. */
  interactive?: boolean;
  insets?: MapInsets;
  style?: StyleProp<ViewStyle>;
};

/** Costa Rica's Central Valley (San José, Cartago, Heredia, Alajuela). */
const CENTRAL_VALLEY = {
  latitude: 9.93,
  longitude: -84.05,
  latitudeDelta: 0.35,
  longitudeDelta: 0.35,
};

function toLatLng(point: GeoPoint) {
  return { latitude: point.lat, longitude: point.lng };
}

/**
 * Real map with an optional route (origin marker, destination marker and a straight
 * line between them). It replaces the static placeholder of decision D3 on iOS and
 * Android; web uses RouteMap.web.tsx because react-native-maps has no web support.
 */
export function RouteMap({
  origin,
  destination,
  originLabel,
  destinationLabel,
  interactive = true,
  insets,
  style,
}: RouteMapProps) {
  const mapRef = useRef<NativeMapView>(null);
  const top = insets?.top ?? 0;
  const bottom = insets?.bottom ?? 0;

  // keep the route in view whenever its points change
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    const points = [origin, destination].filter((point): point is GeoPoint => Boolean(point));
    if (points.length === 2) {
      map.fitToCoordinates(points.map(toLatLng), {
        edgePadding: { top: 60 + top, right: 60, bottom: 60 + bottom, left: 60 },
        animated: true,
      });
    } else if (points.length === 1) {
      map.animateToRegion({ ...toLatLng(points[0]), latitudeDelta: 0.05, longitudeDelta: 0.05 });
    }
  }, [origin?.lat, origin?.lng, destination?.lat, destination?.lng, top, bottom]);

  return (
    <NativeMapView
      ref={mapRef}
      style={[styles.map, style]}
      initialRegion={CENTRAL_VALLEY}
      scrollEnabled={interactive}
      zoomEnabled={interactive}
      rotateEnabled={interactive}
      pitchEnabled={interactive}
      toolbarEnabled={false}
      pointerEvents={interactive ? 'auto' : 'none'}
    >
      {origin ? (
        <Marker coordinate={toLatLng(origin)} title={originLabel || 'Origen'} pinColor={colors.accentGreen} />
      ) : null}
      {destination ? (
        <Marker coordinate={toLatLng(destination)} title={destinationLabel || 'Destino'} pinColor={palette.black} />
      ) : null}
      {origin && destination ? (
        <Polyline
          coordinates={[toLatLng(origin), toLatLng(destination)]}
          strokeColor={colors.primary}
          strokeWidth={3}
        />
      ) : null}
    </NativeMapView>
  );
}

const styles = StyleSheet.create({
  map: {
    flex: 1,
  },
});

import { useEffect, useRef } from 'react';
import { StyleSheet, type StyleProp, type ViewStyle } from 'react-native';
import MapView, { Marker, Polyline, type MapPressEvent } from 'react-native-maps';

import { colors, palette } from '@/src/constants/theme';
import type { GeoPoint } from '@/src/types/common';

/** Which point the next tap on the map sets. */
export type PickTarget = 'origen' | 'destino';

export type LocationPickerMapProps = {
  origin: GeoPoint | null;
  destination: GeoPoint | null;
  /** Point that a tap on the map will set. */
  target: PickTarget;
  onPick: (target: PickTarget, point: GeoPoint) => void;
  originLabel?: string;
  destinationLabel?: string;
  /** Map height covered by content on top (e.g. a fields card), kept clear when fitting the points. */
  topInset?: number;
  style?: StyleProp<ViewStyle>;
};

/** Initial view: Costa Rica's Central Valley (San José, Cartago, Heredia, Alajuela). */
const INITIAL_REGION = {
  latitude: 9.93,
  longitude: -84.05,
  latitudeDelta: 0.35,
  longitudeDelta: 0.35,
};

/** The Backend stores coordinates with 6 decimals. */
function toGeoPoint(coordinate: { latitude: number; longitude: number }): GeoPoint {
  return {
    lat: Number(coordinate.latitude.toFixed(6)),
    lng: Number(coordinate.longitude.toFixed(6)),
  };
}

function toLatLng(point: GeoPoint) {
  return { latitude: point.lat, longitude: point.lng };
}

/**
 * Real map for the "Ruta" step (replaces the static placeholder of decision D3 on
 * iOS/Android). Tapping the map sets the current target; markers can also be
 * dragged. The line between both points is straight: there is no routing service.
 * Web uses LocationPickerMap.web.tsx because react-native-maps has no web support.
 */
export function LocationPickerMap({
  origin,
  destination,
  target,
  onPick,
  originLabel,
  destinationLabel,
  topInset = 0,
  style,
}: LocationPickerMapProps) {
  const mapRef = useRef<MapView>(null);

  // keep the picked points in view (e.g. after choosing a suggestion far from the current view)
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    if (origin && destination) {
      map.fitToCoordinates([toLatLng(origin), toLatLng(destination)], {
        edgePadding: { top: 60 + topInset, right: 60, bottom: 60, left: 60 },
        animated: true,
      });
    } else if (origin || destination) {
      const point = (origin ?? destination) as GeoPoint;
      map.animateToRegion({ ...toLatLng(point), latitudeDelta: 0.05, longitudeDelta: 0.05 });
    }
  }, [origin, destination, topInset]);

  const handlePress = (event: MapPressEvent) => {
    onPick(target, toGeoPoint(event.nativeEvent.coordinate));
  };

  return (
    <MapView ref={mapRef} style={[styles.map, style]} initialRegion={INITIAL_REGION} onPress={handlePress}>
      {origin ? (
        <Marker
          coordinate={toLatLng(origin)}
          title={originLabel || 'Origen'}
          pinColor={colors.accentGreen}
          draggable
          onDragEnd={(event) => onPick('origen', toGeoPoint(event.nativeEvent.coordinate))}
        />
      ) : null}
      {destination ? (
        <Marker
          coordinate={toLatLng(destination)}
          title={destinationLabel || 'Destino'}
          pinColor={palette.black}
          draggable
          onDragEnd={(event) => onPick('destino', toGeoPoint(event.nativeEvent.coordinate))}
        />
      ) : null}
      {origin && destination ? (
        <Polyline
          coordinates={[toLatLng(origin), toLatLng(destination)]}
          strokeColor={colors.primary}
          strokeWidth={3}
        />
      ) : null}
    </MapView>
  );
}

const styles = StyleSheet.create({
  map: {
    height: 318,
  },
});

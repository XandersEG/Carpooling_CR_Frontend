import { useEffect, useRef } from 'react';
import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';
import NativeMapView, { Marker, Polyline, type MapPressEvent, type Region } from 'react-native-maps';

import { colors, palette } from '@/src/constants/theme';

import { MapView } from './MapView';
import { LocateButton, MapZoomButtons, ZOOM_IN, ZOOM_OUT, zoomMap } from './MapZoomButtons';
import { useAfterTransition } from './useAfterTransition';
import { locateUser, useUserLocation } from './useUserLocation';
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
  /** Passenger's pickup point (orange pin). */
  pickup?: GeoPoint | null;
  pickupLabel?: string;
  /** When given, tapping the map or dragging the pickup pin sets the pickup point. */
  onPickPoint?: (point: GeoPoint) => void;
  insets?: MapInsets;
  /** Called once with the user's real-time location (first GPS fix), to use it as a default. */
  onLocated?: (point: GeoPoint) => void;
  style?: StyleProp<ViewStyle>;
};

/** Costa Rica's Central Valley (San José, Cartago, Heredia, Alajuela). */
const CENTRAL_VALLEY = {
  latitude: 9.93,
  longitude: -84.05,
  latitudeDelta: 0.35,
  longitudeDelta: 0.35,
};

/** The Backend stores coordinates with 6 decimals. */
function toGeoPoint(coordinate: { latitude: number; longitude: number }): GeoPoint {
  return { lat: Number(coordinate.latitude.toFixed(6)), lng: Number(coordinate.longitude.toFixed(6)) };
}

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
  pickup,
  pickupLabel,
  onPickPoint,
  insets,
  onLocated,
  style,
}: RouteMapProps) {
  const mapRef = useRef<NativeMapView>(null);
  const ready = useAfterTransition();
  const { granted } = useUserLocation((point) => {
    // with nothing marked yet, the map starts where the user is
    if (!origin && !destination) {
      mapRef.current?.animateToRegion({
        latitude: point.lat,
        longitude: point.lng,
        latitudeDelta: 0.03,
        longitudeDelta: 0.03,
      });
    }
    onLocated?.(point);
  });
  // visible area, needed by the zoom buttons
  const region = useRef<Region | null>(CENTRAL_VALLEY);
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
      map.animateToRegion({ ...toLatLng(points[0]), latitudeDelta: 0.01, longitudeDelta: 0.01 });
    }
  }, [ready, origin?.lat, origin?.lng, destination?.lat, destination?.lng, top, bottom]);

  // "my location" button: zoom in to the user; on a pickup map it also moves the pin there
  async function goToMyLocation() {
    const point = await locateUser();
    if (!point) return;
    mapRef.current?.animateToRegion({ ...toLatLng(point), latitudeDelta: 0.01, longitudeDelta: 0.01 });
    onPickPoint?.(point);
  }

  // the static map image stands in while the screen slides in
  if (!ready) return <MapView style={[styles.map, style]} />;

  return (
    <View style={[styles.map, style]}>
      <NativeMapView
        ref={mapRef}
        style={StyleSheet.absoluteFill}
        showsUserLocation={granted}
        showsMyLocationButton={false}
        onRegionChangeComplete={(next) => {
          region.current = next;
        }}
        initialRegion={CENTRAL_VALLEY}
        scrollEnabled={interactive}
        zoomEnabled={interactive}
        rotateEnabled={interactive}
        pitchEnabled={interactive}
        toolbarEnabled={false}
        pointerEvents={interactive ? 'auto' : 'none'}
        onPress={onPickPoint ? (event: MapPressEvent) => onPickPoint(toGeoPoint(event.nativeEvent.coordinate)) : undefined}
      >
        {origin ? (
          <Marker coordinate={toLatLng(origin)} title={originLabel || 'Origen'} pinColor={colors.accentGreen} />
        ) : null}
        {destination ? (
          <Marker coordinate={toLatLng(destination)} title={destinationLabel || 'Destino'} pinColor={palette.black} />
        ) : null}
        {pickup ? (
          <Marker
            coordinate={toLatLng(pickup)}
            title={pickupLabel || 'Punto de recolección'}
            pinColor={palette.terracotta}
            draggable={Boolean(onPickPoint)}
            onDragEnd={(event) => onPickPoint?.(toGeoPoint(event.nativeEvent.coordinate))}
          />
        ) : null}
        {origin && destination ? (
          <Polyline
            coordinates={[toLatLng(origin), toLatLng(destination)]}
            strokeColor={colors.primary}
            strokeWidth={3}
          />
        ) : null}
      </NativeMapView>
      {interactive ? (
        <>
          <MapZoomButtons
            style={{ top: top + 12 }}
            onZoomIn={() => zoomMap(mapRef.current, region.current, ZOOM_IN)}
            onZoomOut={() => zoomMap(mapRef.current, region.current, ZOOM_OUT)}
          />
          {/* just above whatever covers the bottom of the map */}
          <LocateButton style={{ bottom: bottom + 16 }} onPress={goToMyLocation} />
        </>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  map: {
    flex: 1,
  },
});

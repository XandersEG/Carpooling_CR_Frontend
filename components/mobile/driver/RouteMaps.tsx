import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';

import { MapLabel, MapView } from '@/components/mobile/MapView';
import { colors, palette, shadows } from '@/src/constants/theme';
import type { TripStop } from '@/src/types/trip';

import { IconPinParada, IconRutaPublicarBorde, IconRutaPublicarLinea, IconRutaViaje } from './icons';

/**
 * Mapas estáticos con la ruta dibujada encima (decisión D3). Las posiciones de
 * la ruta, los marcadores y las etiquetas son las del diseño de Figma: son datos
 * de muestra fijos hasta que exista un mapa real.
 */

/** "Pin destino": cuadro negro con borde blanco (20 × 20). */
function DestinationPin({ style }: { style: StyleProp<ViewStyle> }) {
  return <View style={[styles.destinationPin, style]} />;
}

/** Marcador verde con borde blanco. El SVG (32 × 32) incluye la sombra alrededor del punto de 20 px. */
function StopPin({ left, top }: { left: number; top: number }) {
  return (
    <View style={[styles.absolute, { left: left - 6, top: top - 4 }]} pointerEvents="none">
      <IconPinParada width={32} height={32} />
    </View>
  );
}

type PublishRouteMapProps = {
  origin: string;
  destination: string;
  style?: StyleProp<ViewStyle>;
};

/** Mapa del paso "Ruta" (2538:7764 + grupo "Ruta" 2538:7753). */
export function PublishRouteMap({ origin, destination, style }: PublishRouteMapProps) {
  return (
    <MapView style={[styles.publishMap, style]}>
      {/* Grupo de 260 × 280 centrado, como en el diseño. */}
      <View style={styles.publishGroup} pointerEvents="none">
        <View style={[styles.absolute, { left: 24, top: 14 }]}>
          <IconRutaPublicarBorde width={227} height={252} />
        </View>
        <View style={[styles.absolute, { left: 27, top: 17 }]}>
          <IconRutaPublicarLinea width={221} height={246} />
        </View>
        <StopPin left={20} top={250} />
        <DestinationPin style={{ left: 235, top: 10 }} />
        <MapLabel text={origin} style={{ left: 48, top: 248 }} />
        <MapLabel text={destination} style={{ right: 30, top: 8 }} />
      </View>
    </MapView>
  );
}

/** Altura visible del mapa en "Viaje programado / en curso" (entre el encabezado y la hoja inferior). */
export const DRIVER_MAP_DESIGN_HEIGHT = 320;

/** Posiciones de diseño de las paradas de recogida (en orden de recorrido). */
const PICKUP_POSITIONS = [
  { pin: { left: 106, top: 196 }, label: { left: 124, top: 212 } },
  { pin: { left: 204, top: 158 }, label: { left: 226, top: 166 } },
];

type DriverTripMapProps = {
  stops: TripStop[];
  style?: StyleProp<ViewStyle>;
};

/** Mapa de "Viaje programado / en curso" (2642:3781…3725) con ruta, paradas y etiquetas. */
export function DriverTripMap({ stops, style }: DriverTripMapProps) {
  const origin = stops.find((stop) => stop.kind === 'origen');
  const destination = [...stops].reverse().find((stop) => stop.kind === 'destino');
  const pickups = stops.filter((stop) => stop.kind === 'recogida').slice(0, PICKUP_POSITIONS.length);

  return (
    <MapView style={[styles.flex, style]}>
      <View style={styles.tripGroup} pointerEvents="none">
        <View style={[styles.absolute, { left: 1, top: 5 }]}>
          <IconRutaViaje width={367} height={602} />
        </View>
        <StopPin left={33} top={268} />
        <DestinationPin style={{ left: 336, top: 38 }} />
        {pickups.map((stop, index) => (
          <StopPin key={`pin-${stop.place.name}`} {...PICKUP_POSITIONS[index].pin} />
        ))}
        {origin ? <MapLabel text={origin.place.name} style={{ left: 46, top: 288 }} /> : null}
        {destination ? <MapLabel text={destination.place.name} style={{ right: 82, top: 19 }} /> : null}
        {pickups.map((stop, index) => (
          <MapLabel key={`label-${stop.place.name}`} text={stop.place.name} style={PICKUP_POSITIONS[index].label} />
        ))}
      </View>
    </MapView>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  absolute: {
    position: 'absolute',
  },
  publishMap: {
    height: 318,
  },
  publishGroup: {
    position: 'absolute',
    top: 9,
    left: '50%',
    marginLeft: -130,
    width: 260,
    height: 280,
  },
  tripGroup: {
    position: 'absolute',
    top: 0,
    left: '50%',
    marginLeft: -201,
    width: 402,
    height: DRIVER_MAP_DESIGN_HEIGHT,
  },
  destinationPin: {
    position: 'absolute',
    width: 20,
    height: 20,
    borderRadius: 5,
    borderWidth: 3,
    borderColor: palette.white,
    backgroundColor: colors.textPrimary,
    ...shadows.mapLabel,
  },
});

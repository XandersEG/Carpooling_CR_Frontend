import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, View, type GestureResponderEvent } from 'react-native';

import { MapView } from '@/components/mobile/MapView';
import { Screen } from '@/components/mobile/Screen';
import { ScreenHeader } from '@/components/mobile/ScreenHeader';
import { RutaRecogida } from '@/components/mobile/passenger/icons';
import { LoadState } from '@/components/mobile/passenger/LoadState';
import { MapCanvas, MapTag, OriginPin, SquarePin } from '@/components/mobile/passenger/MapCanvas';
import { useServiceData } from '@/components/mobile/passenger/useServiceData';
import { Button } from '@/components/shared/Button';
import { Card } from '@/components/shared/Card';
import { colors, layout, spacing, typography } from '@/src/constants/theme';
import { getPickupPoints, getTrip, requestToJoin } from '@/src/services/tripService';
import type { Place } from '@/src/types/common';

// Coordenadas de "Seleccionar Punto Recogida" (Figma 2506:5746) relativas al
// borde superior del mapa (y = 164 en el frame).
const CANVAS_HEIGHT = 610;
const ROUTE = { left: 1, top: 5 };

/**
 * Posición (esquina superior izquierda del marcador de 20 × 20) de cada punto
 * de recogida sobre la ruta. `Place` no trae coordenadas: se usan, por orden,
 * las posiciones de los puntos del diseño ("Mall San Pedro" en 2522:4082 y
 * "Parada de buses Ochomogo" en 2567:4861, trasladado a este encuadre).
 */
const PICKUP_POSITIONS = [
  { left: 225, top: 215 },
  { left: 129, top: 401 },
];

/**
 * "Seleccionar punto de recolección" (Figma 2506:5746) → "Confirmar Punto
 * Recogida" (2522:4082 / 2567:4861). Al tocar el mapa se selecciona el punto de
 * recogida más cercano al toque.
 */
export default function RecogidaScreen() {
  const { tripId } = useLocalSearchParams<{ tripId: string }>();
  const data = useServiceData(
    async () => {
      const [trip, points] = await Promise.all([getTrip(tripId), getPickupPoints(tripId)]);
      return { trip, points: points.slice(0, PICKUP_POSITIONS.length) };
    },
    [tripId],
  );
  const [selected, setSelected] = useState<number | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const points: Place[] = data.data?.points ?? [];
  const selectedPoint = selected !== null ? points[selected] : undefined;

  function handleMapPress(event: GestureResponderEvent) {
    const { locationX, locationY } = event.nativeEvent;
    let nearest = 0;
    let best = Number.POSITIVE_INFINITY;
    points.forEach((_, index) => {
      const { left, top } = PICKUP_POSITIONS[index];
      const distance = Math.hypot(left + 10 - locationX, top + 10 - locationY);
      if (distance < best) {
        best = distance;
        nearest = index;
      }
    });
    if (points.length > 0) {
      setSelected(nearest);
      setError(null);
    }
  }

  async function handleConfirm() {
    if (!selectedPoint) return;
    setSubmitting(true);
    setError(null);
    try {
      await requestToJoin(tripId, selectedPoint);
      router.replace('/mis-viajes');
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'No se pudo enviar la solicitud.');
      setSubmitting(false);
    }
  }

  return (
    <Screen header={<ScreenHeader title="Seleccionar punto de recolección" />}>
      {data.data ? (
        <View style={styles.flex}>
          <MapView style={StyleSheet.absoluteFill} />
          <MapCanvas height={CANVAS_HEIGHT}>
            <View pointerEvents="none" style={[styles.absolute, ROUTE]}>
              <RutaRecogida width={367} height={602} />
            </View>
            <OriginPin x={43} y={564} />
            <SquarePin variant="destino" left={336} top={38} />
            <MapTag text={data.data.trip.destination.name} right={layout.mobileDesignWidth - 324} top={19} />
            <MapTag text={data.data.trip.origin.name} left={46} top={574} />
            {points.map((point, index) => (
              <SquarePin
                key={point.name}
                variant={index === selected ? 'recogida' : 'recogida-disponible'}
                {...PICKUP_POSITIONS[index]}
              />
            ))}
            {selected !== null ? (
              <MapTag
                text="Punto seleccionado"
                right={layout.mobileDesignWidth - PICKUP_POSITIONS[selected].left}
                top={PICKUP_POSITIONS[selected].top - 32}
              />
            ) : null}
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Seleccionar punto de recolección en el mapa"
              onPress={handleMapPress}
              style={StyleSheet.absoluteFill}
            />
          </MapCanvas>

          {selectedPoint ? (
            <View style={styles.bottom} pointerEvents="box-none">
              <Card gap={2} style={styles.infoCard}>
                <Text style={styles.pointName}>{selectedPoint.name}</Text>
                {selectedPoint.detail ? <Text style={styles.pointDetail}>{selectedPoint.detail}</Text> : null}
                {error ? <Text style={styles.error}>{error}</Text> : null}
              </Card>
              <Button
                title="Confirmar punto de recolección"
                onPress={handleConfirm}
                loading={submitting}
                fullWidth
                style={styles.cta}
              />
            </View>
          ) : null}
        </View>
      ) : (
        <LoadState loading={data.loading} error={data.error} />
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
    overflow: 'hidden',
  },
  absolute: {
    position: 'absolute',
  },
  bottom: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    gap: 23,
    paddingHorizontal: 19,
    paddingBottom: 19,
  },
  infoCard: {
    paddingHorizontal: spacing.l,
    paddingVertical: spacing.l,
  },
  pointName: {
    ...typography.nameCard,
    color: colors.textPrimary,
  },
  pointDetail: {
    ...typography.textSmall,
    lineHeight: 22,
    color: colors.textSecondary,
  },
  error: {
    ...typography.textSmall,
    color: colors.error,
  },
  cta: {
    marginHorizontal: 7,
  },
});

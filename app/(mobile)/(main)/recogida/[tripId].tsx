import { router, useLocalSearchParams } from 'expo-router';
import { useRef, useState } from 'react';
import { Keyboard, StyleSheet, Text, View } from 'react-native';

import { PlaceAutocomplete } from '@/components/mobile/PlaceAutocomplete';
import { RouteMap } from '@/components/mobile/RouteMap';
import { Screen } from '@/components/mobile/Screen';
import { ScreenHeader } from '@/components/mobile/ScreenHeader';
import { LoadState } from '@/components/mobile/passenger/LoadState';
import { useServiceData } from '@/components/mobile/passenger/useServiceData';
import { Button } from '@/components/shared/Button';
import { Card } from '@/components/shared/Card';
import { colors, palette, radius, shadows, spacing, typography } from '@/src/constants/theme';
import { describePoint } from '@/src/services/placeService';
import { getTrip, requestToJoin, type PickupChoice } from '@/src/services/tripService';
import type { GeoPoint } from '@/src/types/common';

/** Shown as the pickup name while the address of the pin is being looked up. */
const LOOKING_UP_ADDRESS = 'Buscando dirección…';
/** Map height covered by the search card at the top, kept clear when fitting the route. */
const SEARCH_CARD_INSET = 110;

/**
 * "Seleccionar punto de recolección" (Figma 2506:5746) → "Confirmar Punto
 * Recogida" (2522:4082). Real map with the trip's route: the passenger marks
 * where to be picked up by tapping the map, dragging the orange pin or searching
 * an address. The pin and the address always match (as in Uber).
 */
export default function RecogidaScreen() {
  const { tripId } = useLocalSearchParams<{ tripId: string }>();
  const trip = useServiceData(() => getTrip(tripId), [tripId]);

  const [query, setQuery] = useState('');
  const [pickup, setPickup] = useState<PickupChoice | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  // latest address lookup: a slower, older answer must not overwrite a newer pin
  const lookupId = useRef(0);

  // pin placed on the map (tap or drag): look up its address
  function pickPoint(point: GeoPoint) {
    Keyboard.dismiss();
    setError(null);
    const id = ++lookupId.current;
    setPickup({ name: LOOKING_UP_ADDRESS, point });
    setQuery(LOOKING_UP_ADDRESS);
    describePoint(point)
      .catch(() => null)
      .then((place) => {
        if (lookupId.current !== id) return;
        const name = place?.name ?? 'Punto en el mapa';
        setPickup({ name, detail: place?.detail, point });
        setQuery(name);
      });
  }

  // address picked from the suggestions: the pin moves there
  function selectPlace(place: PickupChoice) {
    lookupId.current++;
    setError(null);
    setPickup({ name: place.name, detail: place.detail, point: place.point });
    setQuery(place.name);
  }

  async function handleConfirm() {
    if (!pickup || pickup.name === LOOKING_UP_ADDRESS) return;
    setSubmitting(true);
    setError(null);
    try {
      await requestToJoin(tripId, pickup);
      router.replace('/mis-viajes');
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'No se pudo enviar la solicitud.');
      setSubmitting(false);
    }
  }

  const data = trip.data;

  return (
    <Screen header={<ScreenHeader title="Seleccionar punto de recolección" />}>
      {data ? (
        <View style={styles.flex}>
          <RouteMap
            style={StyleSheet.absoluteFill}
            origin={data.originPoint}
            destination={data.destinationPoint}
            originLabel={data.origin.name}
            destinationLabel={data.destination.name}
            pickup={pickup?.point}
            pickupLabel={pickup?.name}
            onPickPoint={pickPoint}
            insets={{ top: SEARCH_CARD_INSET, bottom: pickup ? 200 : 60 }}
          />

          {/* address search on top of the map */}
          <View style={styles.searchCard}>
            <PlaceAutocomplete
              kind="origen"
              value={query}
              placeholder="Busca dónde quieres que te recojan"
              onChangeText={setQuery}
              onSelect={selectPlace}
            />
          </View>

          {pickup ? (
            <View style={styles.bottom} pointerEvents="box-none">
              <Card gap={2} style={styles.infoCard}>
                <Text style={styles.pointName}>{pickup.name}</Text>
                {pickup.detail ? <Text style={styles.pointDetail}>{pickup.detail}</Text> : null}
                {error ? <Text style={styles.error}>{error}</Text> : null}
              </Card>
              <Button
                title="Confirmar punto de recolección"
                onPress={handleConfirm}
                loading={submitting}
                disabled={pickup.name === LOOKING_UP_ADDRESS}
                fullWidth
                style={styles.cta}
              />
            </View>
          ) : (
            <View style={styles.hint} pointerEvents="none">
              <Text style={styles.hintText}>Toca el mapa o busca una dirección para marcar tu punto de recolección.</Text>
            </View>
          )}
        </View>
      ) : (
        <LoadState loading={trip.loading} error={trip.error} />
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
    overflow: 'hidden',
  },
  searchCard: {
    position: 'absolute',
    top: spacing.s,
    left: 19,
    right: 19,
    padding: spacing.s,
    borderRadius: radius.card,
    backgroundColor: palette.white,
    ...shadows.card,
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
  hint: {
    position: 'absolute',
    left: 19,
    right: 19,
    bottom: 19,
    padding: spacing.s,
    borderRadius: radius.card,
    backgroundColor: palette.white,
    ...shadows.card,
  },
  hintText: {
    ...typography.textSmall,
    color: colors.textSecondary,
    textAlign: 'center',
  },
});

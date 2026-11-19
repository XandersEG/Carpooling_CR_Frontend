import { router, useLocalSearchParams } from 'expo-router';
import { useRef, useState } from 'react';
import { Keyboard, KeyboardAvoidingView, Platform, Pressable, StyleSheet, Text, View } from 'react-native';

import { PlaceAutocomplete } from '@/components/mobile/PlaceAutocomplete';
import { RouteMap } from '@/components/mobile/RouteMap';
import { Screen } from '@/components/mobile/Screen';
import { ScreenHeader } from '@/components/mobile/ScreenHeader';
import { LoadState } from '@/components/mobile/passenger/LoadState';
import { useServiceData } from '@/components/mobile/passenger/useServiceData';
import { Button } from '@/components/shared/Button';
import { colors, palette, radius, shadows, spacing, typography } from '@/src/constants/theme';
import { describePoint } from '@/src/services/placeService';
import { getTrip, requestToJoin, type PickupChoice } from '@/src/services/tripService';
import type { GeoPoint } from '@/src/types/common';

/** Shown as the pickup name while the address of the pin is being looked up. */
const LOOKING_UP_ADDRESS = 'Buscando dirección…';

/**
 * "Seleccionar punto de recolección" (Figma 2506:5746) → "Confirmar Punto
 * Recogida" (2522:4082). Real map with the trip's route and, as in Uber's
 * "Confirm your pickup spot", a bottom panel with the address and a "Buscar"
 * button. The passenger marks the pickup point by tapping the map, dragging the
 * orange pin, using "my location" or searching; pin and address always match.
 */
export default function RecogidaScreen() {
  const { tripId } = useLocalSearchParams<{ tripId: string }>();
  const trip = useServiceData(() => getTrip(tripId), [tripId]);

  const [query, setQuery] = useState('');
  const [pickup, setPickup] = useState<PickupChoice | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  // the panel shows the address search instead of the address while this is on
  const [searching, setSearching] = useState(false);
  // panel height, so the map keeps the route and the "my location" button above it
  const [panelHeight, setPanelHeight] = useState(0);
  // latest address lookup: a slower, older answer must not overwrite a newer pin
  const lookupId = useRef(0);

  // pin placed on the map (tap or drag): look up its address
  function pickPoint(point: GeoPoint) {
    Keyboard.dismiss();
    setSearching(false);
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
    setSearching(false);
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
  const lookingUp = pickup?.name === LOOKING_UP_ADDRESS;

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
            // the passenger's real-time location is the default pickup point
            onLocated={(point) => {
              if (!pickup) pickPoint(point);
            }}
            insets={{ bottom: panelHeight }}
          />

          {/* bottom panel, as in Uber's "Confirm your pickup spot"; on iOS it rises with the
              keyboard while searching (Android already resizes the screen) */}
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'position' : undefined}
            style={styles.panelArea}
            pointerEvents="box-none"
          >
            <View style={styles.panel} onLayout={(event) => setPanelHeight(event.nativeEvent.layout.height)}>
              <Text style={styles.panelTitle}>Confirma tu punto de recolección</Text>
              <View style={styles.divider} />
  
              {searching ? (
                <PlaceAutocomplete
                  kind="origen"
                  value={query === LOOKING_UP_ADDRESS ? '' : query}
                  placeholder="Busca dónde quieres que te recojan"
                  onChangeText={setQuery}
                  onSelect={selectPlace}
                  inputProps={{ autoFocus: true }}
                />
              ) : (
                <View style={styles.addressRow}>
                  <View style={styles.addressText}>
                    <Text style={styles.pointName} numberOfLines={2}>
                      {pickup ? pickup.name : 'Toca el mapa para marcar dónde te recogen'}
                    </Text>
                    {pickup?.detail ? (
                      <Text style={styles.pointDetail} numberOfLines={2}>
                        {pickup.detail}
                      </Text>
                    ) : null}
                  </View>
                  <Pressable
                    accessibilityRole="button"
                    accessibilityLabel="Buscar una dirección"
                    onPress={() => setSearching(true)}
                    style={({ pressed }) => [styles.searchPill, pressed ? styles.pressed : null]}
                  >
                    <Text style={styles.searchPillText}>Buscar</Text>
                  </Pressable>
                </View>
              )}
  
              {error ? <Text style={styles.error}>{error}</Text> : null}
              <Button
                title="Confirmar punto de recolección"
                onPress={handleConfirm}
                loading={submitting}
                disabled={!pickup || lookingUp}
                fullWidth
              />
            </View>
          </KeyboardAvoidingView>
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
  panelArea: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
  },
  panel: {
    gap: spacing.m,
    paddingTop: spacing.l,
    paddingHorizontal: spacing.screen,
    paddingBottom: spacing.l,
    backgroundColor: palette.white,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    ...shadows.bottomPanel,
  },
  panelTitle: {
    ...typography.nameHighlight,
    textAlign: 'center',
    color: colors.textPrimary,
  },
  divider: {
    height: 1,
    marginHorizontal: -spacing.screen,
    backgroundColor: colors.borderCard,
  },
  addressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.s,
  },
  addressText: {
    flex: 1,
    gap: 2,
  },
  pointName: {
    ...typography.nameCard,
    color: colors.textPrimary,
  },
  pointDetail: {
    ...typography.textSmall,
    lineHeight: 18,
    color: colors.textSecondary,
  },
  searchPill: {
    paddingHorizontal: spacing.l,
    paddingVertical: spacing.s,
    borderRadius: radius.chip,
    backgroundColor: colors.surfaceInput,
  },
  pressed: {
    opacity: 0.7,
  },
  searchPillText: {
    ...typography.textStrong,
    color: colors.textPrimary,
  },
  error: {
    ...typography.textSmall,
    color: colors.error,
  },
});

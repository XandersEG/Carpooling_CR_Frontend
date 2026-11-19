import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Keyboard, StyleSheet, View } from 'react-native';

import { BottomSheet } from '@/components/mobile/BottomSheet';
import { CalendarPicker } from '@/components/mobile/CalendarPicker';
import { LocationPickerMap, type PickTarget } from '@/components/mobile/driver/LocationPickerMap';
import { LOOKING_UP_ADDRESS, useAddressLookup } from '@/components/mobile/useAddressLookup';
import { PlaceAutocomplete } from '@/components/mobile/PlaceAutocomplete';
import { Screen } from '@/components/mobile/Screen';
import { ScreenHeader } from '@/components/mobile/ScreenHeader';
import { SearchField } from '@/components/mobile/SearchField';
import { TimeSlotPicker } from '@/components/mobile/TimeSlotPicker';
import {
  formatSearchDate,
  formatSearchTime,
  readSearchParams,
  rememberSearch,
  toRouteParams,
  type SearchRouteParams,
} from '@/components/mobile/passenger/search';
import { Button } from '@/components/shared/Button';
import { colors, radius, spacing } from '@/src/constants/theme';
import type { GeoPoint } from '@/src/types/common';
import type { TripSearchParams } from '@/src/types/trip';
import { now } from '@/src/utils/clock';
import { toIsoDate } from '@/src/utils/format';

type Panel = 'fecha' | 'hora' | null;

/**
 * "Buscar rutas" (Figma 2427:2341). Origen y destino se escriben con el teclado
 * del sistema (paneles 2466:2849 / 2466:2956); fecha y hora abren el
 * "Calendario" (2466:3869) y el "Selector hora" (2466:3962) en un panel inferior.
 */
export default function BuscarScreen() {
  const params = useLocalSearchParams<SearchRouteParams>();
  const [search, setSearch] = useState<TripSearchParams>(() => readSearchParams(params));
  const [panel, setPanel] = useState<Panel>(null);
  // field that the next tap on the map sets
  const [mapTarget, setMapTarget] = useState<PickTarget>('origen');
  const { lookup, cancel } = useAddressLookup();

  function update(patch: Partial<TripSearchParams>) {
    setSearch((current) => ({ ...current, ...patch }));
  }

  // a tapped or dragged pin moves its point and rewrites its field with the address
  function pickPoint(target: PickTarget, point: GeoPoint) {
    Keyboard.dismiss();
    if (target === 'origen') {
      update({ originPoint: point });
      if (!search.destinationPoint) setMapTarget('destino');
      lookup('origen', point, (origin) => update({ origin }));
    } else {
      update({ destinationPoint: point });
      lookup('destino', point, (destination) => update({ destination }));
    }
  }

  // the user's real-time location is the default origin (only while the origin is empty)
  function applyMyLocation(point: GeoPoint) {
    if (search.origin.trim() || search.originPoint) return;
    update({ originPoint: point });
    setMapTarget('destino');
    lookup('origen', point, (origin) => update({ origin }));
  }

  function handleSearch() {
    const next = { ...search, origin: search.origin.trim(), destination: search.destination.trim() };
    rememberSearch(next);
    router.push({ pathname: '/resultados', params: toRouteParams(next) });
  }

  const canSearch =
    search.origin.trim().length > 0 &&
    search.destination.trim().length > 0 &&
    search.origin !== LOOKING_UP_ADDRESS &&
    search.destination !== LOOKING_UP_ADDRESS;

  return (
    <Screen header={<ScreenHeader title="Buscar rutas" />}>
      {/* real map behind the form: tap it (or drag the pins) to mark origin and destination */}
      <LocationPickerMap
        style={StyleSheet.absoluteFill}
        origin={search.originPoint ?? null}
        destination={search.destinationPoint ?? null}
        target={mapTarget}
        onPick={pickPoint}
        onLocated={applyMyLocation}
        originLabel={search.origin}
        destinationLabel={search.destination}
        topInset={300}
      />

      {/* La tarjeta de búsqueda queda mitad sobre el fondo blanco y mitad sobre el mapa. */}
      <View style={styles.cardWrapper}>
        <View style={styles.cardBackdrop} />
        <View style={styles.card}>
          {/* origin and destination suggest places in Costa Rica while typing */}
          <PlaceAutocomplete
            kind="origen"
            value={search.origin}
            placeholder="Origen"
            // typing something else drops the point of the previously picked place
            onChangeText={(origin) => update({ origin, originPoint: undefined })}
            onSelect={(place) => {
              cancel('origen');
              update({ origin: place.name, originPoint: place.point });
              if (!search.destinationPoint) setMapTarget('destino');
            }}
            inputProps={{ returnKeyType: 'next', onFocus: () => setMapTarget('origen') }}
          />
          <PlaceAutocomplete
            kind="destino"
            value={search.destination}
            placeholder="Destino"
            onChangeText={(destination) => update({ destination, destinationPoint: undefined })}
            onSelect={(place) => {
              cancel('destino');
              update({ destination: place.name, destinationPoint: place.point });
            }}
            inputProps={{
              returnKeyType: 'search',
              onSubmitEditing: canSearch ? handleSearch : undefined,
              onFocus: () => setMapTarget('destino'),
            }}
          />
          <SearchField
            kind="fecha"
            value={formatSearchDate(search.date)}
            placeholder="Fecha"
            onPress={() => setPanel('fecha')}
          />
          <SearchField
            kind="horario"
            value={formatSearchTime(search.time)}
            placeholder="Horario"
            onPress={() => setPanel('hora')}
          />
        </View>
      </View>

      <View style={styles.cta}>
        <Button title="Buscar viaje" onPress={handleSearch} disabled={!canSearch} fullWidth />
      </View>

      <BottomSheet visible={panel === 'fecha'} onClose={() => setPanel(null)}>
        <CalendarPicker
          value={search.date}
          minDate={toIsoDate(now())}
          onChange={(date) => {
            update({ date });
            setPanel(null);
          }}
        />
      </BottomSheet>
      <BottomSheet visible={panel === 'hora'} onClose={() => setPanel(null)}>
        <TimeSlotPicker
          value={search.time}
          onChange={(time) => {
            update({ time });
            setPanel(null);
          }}
        />
      </BottomSheet>
    </Screen>
  );
}

const styles = StyleSheet.create({
  cardWrapper: {
    paddingHorizontal: spacing.screen,
  },
  cardBackdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '55%',
    backgroundColor: colors.background,
  },
  card: {
    gap: 7,
    paddingTop: 15,
    paddingBottom: spacing.s,
    paddingLeft: spacing.m,
    paddingRight: 13,
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.borderSearch,
    borderRadius: radius.card,
  },
  cta: {
    position: 'absolute',
    left: 28,
    right: 29,
    bottom: 16,
  },
});

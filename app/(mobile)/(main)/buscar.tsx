import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { BottomSheet } from '@/components/mobile/BottomSheet';
import { CalendarPicker } from '@/components/mobile/CalendarPicker';
import { MapView } from '@/components/mobile/MapView';
import { Screen } from '@/components/mobile/Screen';
import { ScreenHeader } from '@/components/mobile/ScreenHeader';
import { SearchField } from '@/components/mobile/SearchField';
import { TimeSlotPicker } from '@/components/mobile/TimeSlotPicker';
import {
  formatSearchDate,
  formatSearchTime,
  readSearchParams,
  rememberSearch,
} from '@/components/mobile/passenger/search';
import { Button } from '@/components/shared/Button';
import { colors, radius, spacing } from '@/src/constants/theme';
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
  const params = useLocalSearchParams<{ origin?: string; destination?: string; date?: string; time?: string }>();
  const [search, setSearch] = useState<TripSearchParams>(() => readSearchParams(params));
  const [panel, setPanel] = useState<Panel>(null);

  function update(patch: Partial<TripSearchParams>) {
    setSearch((current) => ({ ...current, ...patch }));
  }

  function handleSearch() {
    const next = { ...search, origin: search.origin.trim(), destination: search.destination.trim() };
    rememberSearch(next);
    router.push({ pathname: '/resultados', params: next });
  }

  const canSearch = search.origin.trim().length > 0 && search.destination.trim().length > 0;

  return (
    <Screen header={<ScreenHeader title="Buscar rutas" />}>
      <MapView style={StyleSheet.absoluteFill} />

      {/* La tarjeta de búsqueda queda mitad sobre el fondo blanco y mitad sobre el mapa. */}
      <View style={styles.cardWrapper}>
        <View style={styles.cardBackdrop} />
        <View style={styles.card}>
          <SearchField
            kind="origen"
            value={search.origin}
            placeholder="Origen"
            onChangeText={(origin) => update({ origin })}
            inputProps={{ returnKeyType: 'next' }}
          />
          <SearchField
            kind="destino"
            value={search.destination}
            placeholder="Destino"
            onChangeText={(destination) => update({ destination })}
            inputProps={{ returnKeyType: 'search', onSubmitEditing: canSearch ? handleSearch : undefined }}
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

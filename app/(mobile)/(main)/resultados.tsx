import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { Screen } from '@/components/mobile/Screen';
import { ScreenHeader } from '@/components/mobile/ScreenHeader';
import { SearchSummary } from '@/components/mobile/SearchSummary';
import { SegmentedControl } from '@/components/mobile/SegmentedControl';
import { TripCard } from '@/components/mobile/TripCard';
import { LoadState } from '@/components/mobile/passenger/LoadState';
import { formatSearchDate, formatSearchTime, readSearchParams } from '@/components/mobile/passenger/search';
import { TripMapView } from '@/components/mobile/passenger/TripMapView';
import { searchResultCard } from '@/components/mobile/passenger/tripHelpers';
import { useServiceData } from '@/components/mobile/passenger/useServiceData';
import { colors, spacing, typography } from '@/src/constants/theme';
import { searchTrips } from '@/src/services/tripService';

type ResultsView = 'lista' | 'mapa';

const VIEW_OPTIONS: { value: ResultsView; label: string }[] = [
  { value: 'lista', label: 'Lista' },
  { value: 'mapa', label: 'Mapa' },
];

/** "Resultados viajes" (Figma 2446:2252) y "Resultados mapa" (Figma 2448:2302). */
export default function ResultadosScreen() {
  const params = useLocalSearchParams<{ origin?: string; destination?: string; date?: string; time?: string }>();
  const search = readSearchParams(params);
  const [view, setView] = useState<ResultsView>('lista');
  const results = useServiceData(
    () => searchTrips(search),
    [search.origin, search.destination, search.date, search.time],
  );
  const trips = results.data ?? [];

  function openTrip(id: string) {
    router.push(`/viaje/${id}`);
  }

  function editSearch() {
    if (router.canGoBack()) router.back();
    else router.replace({ pathname: '/buscar', params: search });
  }

  return (
    <Screen
      header={
        <>
          <ScreenHeader title="Resultados" />
          <View style={styles.controls}>
            <SearchSummary
              origin={search.origin}
              destination={search.destination}
              dateLabel={formatSearchDate(search.date)}
              timeLabel={formatSearchTime(search.time)}
              onEdit={editSearch}
            />
            <SegmentedControl options={VIEW_OPTIONS} value={view} onChange={setView} />
          </View>
        </>
      }
    >
      {results.loading || results.error ? (
        <LoadState loading={results.loading} error={results.error} />
      ) : view === 'lista' ? (
        <ScrollView contentContainerStyle={styles.list} showsVerticalScrollIndicator={false}>
          <Text style={styles.count}>
            {trips.length} {trips.length === 1 ? 'viaje encontrado' : 'viajes encontrados'}
          </Text>
          {trips.map((trip) => (
            <TripCard key={trip.id} {...searchResultCard(trip)} onPress={() => openTrip(trip.id)} />
          ))}
        </ScrollView>
      ) : (
        <View style={styles.map}>
          <TripMapView
            items={trips.map((trip) => ({
              key: trip.id,
              card: searchResultCard(trip),
              onPress: () => openTrip(trip.id),
            }))}
          />
        </View>
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  controls: {
    gap: spacing.xs,
    paddingHorizontal: spacing.screen,
  },
  list: {
    gap: spacing.m,
    paddingHorizontal: spacing.screen,
    paddingTop: 20,
    paddingBottom: spacing.xl * 2,
  },
  count: {
    ...typography.textSmall,
    marginBottom: -spacing.xxs,
    color: colors.textSecondary,
  },
  map: {
    flex: 1,
    marginTop: spacing.xs,
  },
});

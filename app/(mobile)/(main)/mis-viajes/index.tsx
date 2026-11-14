import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { Screen } from '@/components/mobile/Screen';
import { ScreenHeader } from '@/components/mobile/ScreenHeader';
import { SearchSummary } from '@/components/mobile/SearchSummary';
import { SegmentedControl } from '@/components/mobile/SegmentedControl';
import { TripCard } from '@/components/mobile/TripCard';
import { LoadState } from '@/components/mobile/passenger/LoadState';
import { formatSearchDate, formatSearchTime, getLastSearch } from '@/components/mobile/passenger/search';
import { TripMapView } from '@/components/mobile/passenger/TripMapView';
import { myTripCard } from '@/components/mobile/passenger/tripHelpers';
import { useServiceData } from '@/components/mobile/passenger/useServiceData';
import { fonts, radius, spacing } from '@/src/constants/theme';
import { getMyTrips } from '@/src/services/tripService';

type MyTripsView = 'lista' | 'mapa';

const VIEW_OPTIONS: { value: MyTripsView; label: string }[] = [
  { value: 'lista', label: 'Lista' },
  { value: 'mapa', label: 'Mapa' },
];

// Sin token: pastilla "Solicitudes" (Figma 2703:10482), verde primario al 63 % y texto verde oscuro.
const REQUESTS_PILL_BACKGROUND = 'rgba(117, 194, 23, 0.63)';
const REQUESTS_PILL_TEXT = '#137300';

/** "Mis Viajes" (Figma 2501:6043) y "Mis viaje con mapa" (Figma 2633:9509). */
export default function MisViajesScreen() {
  const [view, setView] = useState<MyTripsView>('lista');
  const myTrips = useServiceData(getMyTrips, [], { reloadOnFocus: true });
  const items = myTrips.data ?? [];
  const search = getLastSearch();

  function openRequest(requestId: string) {
    router.push(`/mis-viajes/${requestId}`);
  }

  return (
    <Screen
      header={
        <>
          <ScreenHeader
            title="Mis Viajes"
            right={
              <Pressable
                accessibilityRole="button"
                onPress={() => router.push('/solicitudes')}
                style={({ pressed }) => [styles.requestsPill, pressed ? styles.pressed : null]}
              >
                <Text style={styles.requestsText}>Solicitudes</Text>
              </Pressable>
            }
          />
          <View style={styles.controls}>
            <SearchSummary
              origin={search.origin}
              destination={search.destination}
              dateLabel={formatSearchDate(search.date)}
              timeLabel={formatSearchTime(search.time)}
              onEdit={() => router.push({ pathname: '/buscar', params: search })}
            />
            <SegmentedControl options={VIEW_OPTIONS} value={view} onChange={setView} />
          </View>
        </>
      }
    >
      {myTrips.loading || myTrips.error ? (
        <LoadState loading={myTrips.loading} error={myTrips.error} />
      ) : view === 'lista' ? (
        <ScrollView contentContainerStyle={styles.list} showsVerticalScrollIndicator={false}>
          {items.map((item) => (
            <TripCard
              key={item.requestId}
              {...myTripCard(item, 'lista')}
              onPress={() => openRequest(item.requestId)}
            />
          ))}
        </ScrollView>
      ) : (
        <View style={styles.map}>
          <TripMapView
            items={items.map((item) => ({
              key: item.requestId,
              card: myTripCard(item, 'mapa'),
              onPress: () => openRequest(item.requestId),
            }))}
          />
        </View>
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  requestsPill: {
    minWidth: 123,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.l,
    backgroundColor: REQUESTS_PILL_BACKGROUND,
    borderRadius: radius.button,
  },
  pressed: {
    opacity: 0.8,
  },
  requestsText: {
    fontFamily: fonts.black,
    fontSize: 12,
    lineHeight: 20,
    color: REQUESTS_PILL_TEXT,
  },
  controls: {
    gap: spacing.xs,
    paddingHorizontal: spacing.screen,
  },
  list: {
    gap: spacing.m,
    paddingHorizontal: spacing.screen,
    paddingTop: 40,
    paddingBottom: spacing.xl * 2,
  },
  map: {
    flex: 1,
    marginTop: spacing.xs,
  },
});

import { router, useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import { ActivityIndicator, StyleSheet } from 'react-native';

import { formatChipDateTime, paymentKind, vehicleName } from '@/components/mobile/driver/format';
import { Screen } from '@/components/mobile/Screen';
import { ScreenHeader } from '@/components/mobile/ScreenHeader';
import { TripCard, type TripCardChip } from '@/components/mobile/TripCard';
import { colors, spacing } from '@/src/constants/theme';
import { getTripHistory } from '@/src/services/tripService';
import type { TripHistoryItem } from '@/src/types/trip';
import { formatCost } from '@/src/utils/format';

function chipsFor(item: TripHistoryItem): TripCardChip[] {
  const chips: TripCardChip[] = [
    { label: formatChipDateTime(item.trip.departureAt), tone: 'green' },
    { label: item.role === 'conductor' ? 'Conductor' : 'Pasajero', tone: 'green' },
  ];
  // Los viajes gratuitos no muestran chip de pago (tarjeta de Rafael Díaz en el diseño).
  if (item.amount > 0 && paymentKind(item.trip.paymentMethod.name) !== 'gratuito') {
    chips.push({ label: item.trip.paymentMethod.name, tone: 'orange' });
  }
  return chips;
}

/** "Historial de viajes" (Figma 2518:3432): raíz de pestaña, sin botón atrás. */
export default function HistoryScreen() {
  const [items, setItems] = useState<TripHistoryItem[] | null>(null);

  useFocusEffect(
    useCallback(() => {
      let active = true;
      getTripHistory().then((list) => {
        if (active) setItems(list);
      });
      return () => {
        active = false;
      };
    }, []),
  );

  return (
    <Screen
      scroll
      header={<ScreenHeader title="Historial de viajes" showBack={false} centered />}
      contentStyle={styles.content}
    >
      {items === null ? (
        <ActivityIndicator color={colors.primary} style={styles.loading} />
      ) : (
        items.map((item) => {
          const asDriver = item.role === 'conductor';
          return (
            <TripCard
              key={item.id}
              name={asDriver ? 'Tú' : item.trip.driver.fullName}
              avatarLabel={asDriver ? `+${item.passengers?.length ?? 0}` : undefined}
              vehicle={`${vehicleName(item.trip.vehicle)} · ${item.trip.vehicle.color}`}
              cost={formatCost(item.amount)}
              origin={item.trip.origin.name}
              destination={item.trip.destination.name}
              chips={chipsFor(item)}
              onPress={() => router.push(`/historial/${item.id}`)}
            />
          );
        })
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: {
    gap: spacing.m,
  },
  loading: {
    marginTop: spacing.xl * 2,
  },
});

import { router } from 'expo-router';
import { StyleSheet, Text } from 'react-native';

import { formatChipDateTime, paymentKind, vehicleName } from '@/components/mobile/driver/format';
import { LoadState } from '@/components/mobile/passenger/LoadState';
import { useServiceData } from '@/components/mobile/passenger/useServiceData';
import { Screen } from '@/components/mobile/Screen';
import { ScreenHeader } from '@/components/mobile/ScreenHeader';
import { TripCard, type TripCardChip } from '@/components/mobile/TripCard';
import { colors, spacing, typography } from '@/src/constants/theme';
import { getTripHistory } from '@/src/services/tripService';
import type { TripHistoryItem } from '@/src/types/trip';
import { formatCost } from '@/src/utils/format';

function chipsFor(item: TripHistoryItem): TripCardChip[] {
  const chips: TripCardChip[] = [
    { label: formatChipDateTime(item.trip.departureAt), tone: 'green' },
    { label: item.role === 'conductor' ? 'Conductor' : 'Pasajero', tone: 'green' },
  ];
  if (item.trip.status === 'cancelado') {
    chips.push({ label: 'Cancelado', tone: 'neutral' });
    return chips;
  }
  // Los viajes gratuitos no muestran chip de pago (tarjeta de Rafael Díaz en el diseño).
  if (item.amount > 0 && paymentKind(item.trip.paymentMethod.name) !== 'gratuito') {
    chips.push({ label: item.trip.paymentMethod.name, tone: 'orange' });
  }
  return chips;
}

/**
 * "Historial de viajes" (Figma 2518:3432): raíz de pestaña, sin botón atrás.
 * Muestra los viajes finalizados o cancelados del usuario, como conductor y
 * como pasajero (`GET /history`). Se recarga cada vez que se abre la pestaña.
 */
export default function HistoryScreen() {
  const history = useServiceData(getTripHistory, [], { reloadOnFocus: true });
  const items = history.data;

  return (
    <Screen
      scroll={Boolean(items && items.length > 0)}
      header={<ScreenHeader title="Historial de viajes" showBack={false} centered />}
      contentStyle={styles.content}
    >
      {items === null ? (
        <LoadState loading={history.loading} error={history.error} />
      ) : items.length === 0 ? (
        <Text style={styles.empty}>
          Todavía no tienes viajes terminados. Cuando finalices o participes en un viaje, aparecerá aquí.
        </Text>
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
  empty: {
    ...typography.textSecondary,
    marginTop: spacing.xl * 2,
    textAlign: 'center',
    color: colors.textSecondary,
  },
});

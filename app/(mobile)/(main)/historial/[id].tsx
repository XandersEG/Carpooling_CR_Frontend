import { useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet } from 'react-native';

import { DetailCard, DetailDivider, DetailRow, PersonCard } from '@/components/mobile/Detail';
import { vehicleName } from '@/components/mobile/driver/format';
import { PassengersEarningsCard } from '@/components/mobile/driver/PassengersEarningsCard';
import { RouteVertical } from '@/components/mobile/Route';
import { Screen } from '@/components/mobile/Screen';
import { ScreenHeader } from '@/components/mobile/ScreenHeader';
import { colors, spacing } from '@/src/constants/theme';
import { getHistoryItem } from '@/src/services/tripService';
import type { TripHistoryItem } from '@/src/types/trip';
import { driverBadge, formatCost, formatDayMonth, formatPassengers, formatTime } from '@/src/utils/format';

/** Detalle del historial: "Viaje de conductor" (2518:3471) o "Viaje de pasajero" (2518:3789). */
export default function HistoryDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [item, setItem] = useState<TripHistoryItem | null>(null);

  useEffect(() => {
    let active = true;
    getHistoryItem(id).then((data) => {
      if (active) setItem(data);
    });
    return () => {
      active = false;
    };
  }, [id]);

  const asDriver = item?.role === 'conductor';
  const title = item ? (asDriver ? 'Viaje de conductor' : 'Viaje de pasajero') : '';

  if (!item) {
    return (
      <Screen header={<ScreenHeader title={title} />}>
        <ActivityIndicator color={colors.primary} style={styles.loading} />
      </Screen>
    );
  }

  const { trip } = item;
  const driverLabel = driverBadge(trip.driver);

  return (
    <Screen scroll header={<ScreenHeader title={title} />} contentStyle={styles.content}>
      {!asDriver ? <PersonCard name={trip.driver.fullName} badge={driverLabel} /> : null}

      <DetailCard title={vehicleName(trip.vehicle)}>
        {trip.vehicle.plate ? <DetailRow label="Placa" value={trip.vehicle.plate} /> : null}
        <DetailRow label="Color" value={trip.vehicle.color} />
        {trip.vehicle.capacity ? <DetailRow label="Capacidad" value={formatPassengers(trip.vehicle.capacity)} /> : null}
      </DetailCard>

      <DetailCard>
        <RouteVertical origin={trip.origin.name} destination={trip.destination.name} />
        <DetailDivider />
        <DetailRow label="Fecha" value={formatDayMonth(trip.departureAt)} />
        <DetailRow label="Hora de salida" value={formatTime(trip.departureAt)} />
        {trip.arrivalAt ? <DetailRow label="Hora de llegada" value={formatTime(trip.arrivalAt)} /> : null}
      </DetailCard>

      {asDriver ? (
        <PassengersEarningsCard passengers={item.passengers ?? []} total={item.amount} />
      ) : (
        <DetailCard>
          <DetailRow label="Costo" value={formatCost(item.amount)} />
          <DetailRow label="Método de pago" value={trip.paymentMethod.name} />
        </DetailCard>
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: {
    gap: spacing.xs,
  },
  loading: {
    marginTop: spacing.xl * 2,
  },
});

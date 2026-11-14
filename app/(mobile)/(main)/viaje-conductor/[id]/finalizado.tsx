import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator } from 'react-native';

import { DetailCard, DetailRow } from '@/components/mobile/Detail';
import { ResultScreen } from '@/components/mobile/driver/ResultScreen';
import { Chip } from '@/components/shared/Chip';
import { colors } from '@/src/constants/theme';
import { getDriverTrip } from '@/src/services/driverService';
import type { DriverTrip } from '@/src/types/trip';
import { formatColones, formatLongDate, formatPassengers, formatTime } from '@/src/utils/format';

/**
 * "Viaje finalizado" (Figma 2642:3884). "Volver al inicio" va a /inicio (en el
 * prototipo vuelve a "Viaje programado", lo que parece un atajo del prototipo).
 */
export default function TripFinishedScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [trip, setTrip] = useState<DriverTrip | null>(null);

  useEffect(() => {
    let active = true;
    getDriverTrip(id).then((data) => {
      if (active) setTrip(data);
    });
    return () => {
      active = false;
    };
  }, [id]);

  const passengers = trip?.passengers.length ?? 0;
  const earnings = trip?.passengers.reduce((sum, request) => sum + request.amount, 0) ?? 0;

  return (
    <ResultScreen
      kind="success"
      headerTitle="Viaje finalizado"
      title="Llegaste a tu destino"
      subtitle={trip ? `Viaje completado con ${formatPassengers(passengers)}` : undefined}
      actionLabel="Volver al inicio"
      onAction={() => router.replace('/inicio')}
    >
      {trip ? (
        <DetailCard>
          <DetailRow label="Ruta" value={`${trip.origin.name} → ${trip.destination.name}`} />
          <DetailRow label="Fecha" value={formatLongDate(trip.departureAt)} />
          <DetailRow label="Hora de salida" value={formatTime(trip.departureAt)} />
          {trip.arrivalAt ? <DetailRow label="Hora de llegada" value={formatTime(trip.arrivalAt)} /> : null}
          <DetailRow label="Pasajeros" value={`${passengers} de ${trip.seats} cupos`} />
          <DetailRow label="Ganancia total" value={formatColones(earnings)} />
          <DetailRow label="Estado" valueElement={<Chip label="Finalizado" tone="green" />} />
        </DetailCard>
      ) : (
        <ActivityIndicator color={colors.primary} />
      )}
    </ResultScreen>
  );
}

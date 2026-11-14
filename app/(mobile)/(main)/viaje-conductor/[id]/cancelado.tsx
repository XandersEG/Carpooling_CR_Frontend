import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator } from 'react-native';

import { DetailCard, DetailRow } from '@/components/mobile/Detail';
import { ResultScreen } from '@/components/mobile/driver/ResultScreen';
import { Chip } from '@/components/shared/Chip';
import { colors } from '@/src/constants/theme';
import { getDriverTrip } from '@/src/services/driverService';
import type { DriverTrip } from '@/src/types/trip';
import { formatLongDate, formatTime } from '@/src/utils/format';

/**
 * "Viaje cancelado" (Figma 2642:3920). "Volver al inicio" va a /inicio (en el
 * prototipo vuelve a "Viaje programado", lo que parece un atajo del prototipo).
 */
export default function TripCancelledScreen() {
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

  return (
    <ResultScreen
      kind="cancelled"
      headerTitle="Viaje cancelado"
      title="Viaje cancelado"
      subtitle="Avisamos a los pasajeros aceptados"
      actionLabel="Volver al inicio"
      onAction={() => router.replace('/inicio')}
    >
      {trip ? (
        <DetailCard>
          <DetailRow label="Ruta" value={`${trip.origin.name} → ${trip.destination.name}`} />
          <DetailRow label="Fecha" value={formatLongDate(trip.departureAt)} />
          <DetailRow label="Hora de salida" value={formatTime(trip.departureAt)} />
          <DetailRow label="Pasajeros avisados" value={String(trip.passengers.length)} />
          <DetailRow label="Estado" valueElement={<Chip label="Cancelado" tone="orange" />} />
        </DetailCard>
      ) : (
        <ActivityIndicator color={colors.primary} />
      )}
    </ResultScreen>
  );
}

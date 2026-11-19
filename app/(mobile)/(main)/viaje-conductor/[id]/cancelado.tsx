import { Redirect, router, useLocalSearchParams } from 'expo-router';

import { DetailCard, DetailRow } from '@/components/mobile/Detail';
import { ResultScreen } from '@/components/mobile/driver/ResultScreen';
import { LoadState } from '@/components/mobile/passenger/LoadState';
import { useServiceData } from '@/components/mobile/passenger/useServiceData';
import { Screen } from '@/components/mobile/Screen';
import { ScreenHeader } from '@/components/mobile/ScreenHeader';
import { Chip } from '@/components/shared/Chip';
import { getDriverTrip } from '@/src/services/driverService';
import { formatLongDate, formatTime } from '@/src/utils/format';

function noticeMessage(passengers: number): string {
  if (passengers === 0) return 'No había pasajeros aceptados';
  if (passengers === 1) return 'Avisamos al pasajero aceptado';
  return 'Avisamos a los pasajeros aceptados';
}

/**
 * "Viaje cancelado" (Figma 2642:3920). "Volver al inicio" va a /inicio (en el
 * prototipo vuelve a "Viaje programado", lo que parece un atajo del prototipo).
 */
export default function TripCancelledScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data: trip, loading, error } = useServiceData(() => getDriverTrip(id), [id]);

  if (!trip) {
    return (
      <Screen header={<ScreenHeader title="Viaje cancelado" />}>
        <LoadState loading={loading} error={error} />
      </Screen>
    );
  }

  if (trip.status !== 'cancelado') return <Redirect href={`/viaje-conductor/${id}`} />;

  return (
    <ResultScreen
      kind="cancelled"
      headerTitle="Viaje cancelado"
      title="Viaje cancelado"
      subtitle={noticeMessage(trip.passengers.length)}
      actionLabel="Volver al inicio"
      onAction={() => router.replace('/inicio')}
    >
      <DetailCard>
        <DetailRow label="Ruta" value={`${trip.origin.name} → ${trip.destination.name}`} />
        <DetailRow label="Fecha" value={formatLongDate(trip.departureAt)} />
        <DetailRow label="Hora de salida" value={formatTime(trip.departureAt)} />
        <DetailRow label="Pasajeros avisados" value={String(trip.passengers.length)} />
        <DetailRow label="Estado" valueElement={<Chip label="Cancelado" tone="orange" />} />
      </DetailCard>
    </ResultScreen>
  );
}

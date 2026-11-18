import { Redirect, router, useLocalSearchParams } from 'expo-router';

import { DetailCard, DetailRow } from '@/components/mobile/Detail';
import { ResultScreen } from '@/components/mobile/driver/ResultScreen';
import { LoadState } from '@/components/mobile/passenger/LoadState';
import { useServiceData } from '@/components/mobile/passenger/useServiceData';
import { Screen } from '@/components/mobile/Screen';
import { ScreenHeader } from '@/components/mobile/ScreenHeader';
import { Chip } from '@/components/shared/Chip';
import { getDriverTrip } from '@/src/services/driverService';
import { formatColones, formatLongDate, formatPassengers, formatTime } from '@/src/utils/format';

/**
 * "Viaje finalizado" (Figma 2642:3884). "Volver al inicio" va a /inicio (en el
 * prototipo vuelve a "Viaje programado", lo que parece un atajo del prototipo).
 */
export default function TripFinishedScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data: trip, loading, error } = useServiceData(() => getDriverTrip(id), [id]);

  if (!trip) {
    return (
      <Screen header={<ScreenHeader title="Viaje finalizado" />}>
        <LoadState loading={loading} error={error} />
      </Screen>
    );
  }

  if (trip.status !== 'finalizado') return <Redirect href={`/viaje-conductor/${id}`} />;

  const passengers = trip.passengers.length;
  const earnings = trip.passengers.reduce((sum, request) => sum + request.amount, 0);

  return (
    <ResultScreen
      kind="success"
      headerTitle="Viaje finalizado"
      title="Llegaste a tu destino"
      subtitle={
        passengers === 0 ? 'Viaje completado sin pasajeros' : `Viaje completado con ${formatPassengers(passengers)}`
      }
      actionLabel="Volver al inicio"
      onAction={() => router.replace('/inicio')}
    >
      <DetailCard>
        <DetailRow label="Ruta" value={`${trip.origin.name} → ${trip.destination.name}`} />
        <DetailRow label="Fecha" value={formatLongDate(trip.departureAt)} />
        <DetailRow label="Hora de salida" value={formatTime(trip.departureAt)} />
        {trip.arrivalAt ? <DetailRow label="Hora de llegada" value={formatTime(trip.arrivalAt)} /> : null}
        <DetailRow label="Pasajeros" value={`${passengers} de ${trip.seats} ${trip.seats === 1 ? 'cupo' : 'cupos'}`} />
        <DetailRow label="Ganancia total" value={formatColones(earnings)} />
        <DetailRow label="Estado" valueElement={<Chip label="Finalizado" tone="green" />} />
      </DetailCard>
    </ResultScreen>
  );
}

import { router, useLocalSearchParams } from 'expo-router';

import { DetailRow, NoticeBox } from '@/components/mobile/Detail';
import { Screen } from '@/components/mobile/Screen';
import { ScreenHeader } from '@/components/mobile/ScreenHeader';
import { LoadState } from '@/components/mobile/passenger/LoadState';
import { TripSummary } from '@/components/mobile/passenger/TripSummary';
import { useServiceData } from '@/components/mobile/passenger/useServiceData';
import { Button } from '@/components/shared/Button';
import { getTrip } from '@/src/services/tripService';
import { formatSeats, formatShortDate } from '@/src/utils/format';

/** "Detalle viaje" (Figma 2448:2822). */
export default function DetalleViajeScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const trip = useServiceData(() => getTrip(id), [id]);

  return (
    <Screen
      header={<ScreenHeader title="Detalle del viaje" />}
      scroll={Boolean(trip.data)}
      contentStyle={trip.data ? { paddingTop: 7 } : undefined}
      footer={
        trip.data ? (
          <Button
            title="Solicitar unirme"
            onPress={() => router.push(`/recogida/${trip.data?.id ?? id}`)}
            fullWidth
          />
        ) : undefined
      }
    >
      {trip.data ? (
        <>
          <TripSummary
            trip={trip.data}
            dateLabel={formatShortDate(trip.data.departureAt)}
            extraCostRow={<DetailRow label="Cupos disponibles" value={formatSeats(trip.data.availableSeats)} />}
          />
          <NoticeBox text="El pago se realiza directamente con el conductor. Coordina el encuentro por medios externos a la app." />
        </>
      ) : (
        <LoadState loading={trip.loading} error={trip.error} />
      )}
    </Screen>
  );
}

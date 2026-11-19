import { useLocalSearchParams } from 'expo-router';

import { DetailRow, NoticeBox } from '@/components/mobile/Detail';
import { Screen } from '@/components/mobile/Screen';
import { ScreenHeader } from '@/components/mobile/ScreenHeader';
import { LoadState } from '@/components/mobile/passenger/LoadState';
import { TripSummary } from '@/components/mobile/passenger/TripSummary';
import { requestStatusChip } from '@/components/mobile/passenger/tripHelpers';
import { useServiceData } from '@/components/mobile/passenger/useServiceData';
import { Chip } from '@/components/shared/Chip';
import { getMyTrip } from '@/src/services/tripService';
import { formatLongDate } from '@/src/utils/format';

/**
 * "Resumen del viaje": Aprobado (Figma 2501:5937), Pendiente (2501:6580) y
 * Cancelado (2501:6684). El aviso de pago solo aparece en la solicitud aprobada
 * de un viaje que todavía no termina.
 */
export default function ResumenViajeScreen() {
  const { requestId } = useLocalSearchParams<{ requestId: string }>();
  const request = useServiceData(() => getMyTrip(requestId), [requestId], { reloadOnFocus: true });
  const item = request.data;

  return (
    <Screen
      header={<ScreenHeader title="Resumen del viaje" />}
      scroll={Boolean(item)}
      contentStyle={item ? { paddingTop: 7 } : undefined}
    >
      {item ? (
        <>
          <TripSummary
            trip={item.trip}
            dateLabel={formatLongDate(item.trip.departureAt)}
            extraCostRow={
              <DetailRow
                label="Estado Solicitud"
                valueElement={<Chip {...requestStatusChip(item.status)} style={{ paddingVertical: 3 }} />}
              />
            }
          />
          {item.status === 'aprobada' && item.trip.status !== 'finalizado' ? (
            <NoticeBox text="El pago se realiza directamente con el conductor, coordina el encuentro por medios externos a la app" />
          ) : null}
        </>
      ) : (
        <LoadState loading={request.loading} error={request.error} />
      )}
    </Screen>
  );
}

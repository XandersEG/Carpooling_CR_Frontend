import type { ReactNode } from 'react';

import { DetailCard, DetailDivider, DetailRow, PersonCard } from '@/components/mobile/Detail';
import { RouteVertical } from '@/components/mobile/Route';
import type { Trip } from '@/src/types/trip';
import { formatCost, formatPassengers, formatTime } from '@/src/utils/format';

import { driverBadge, paymentLabel } from './tripHelpers';

type TripSummaryProps = {
  trip: Trip;
  /** Texto de la fila "Fecha" ("Hoy, 25 oct" en Detalle, "Domingo 25 de Oct 2026" en Resumen). */
  dateLabel: string;
  /** Última fila del bloque de costo ("Cupos disponibles" o "Estado Solicitud"). */
  extraCostRow: ReactNode;
};

/**
 * Bloques de "Detalle del viaje" (Figma 2448:2822) y "Resumen del viaje"
 * (Figma 2501:5937): conductor, vehículo, ruta y horario, costo y pago.
 */
export function TripSummary({ trip, dateLabel, extraCostRow }: TripSummaryProps) {
  const { vehicle } = trip;

  return (
    <>
      <PersonCard name={trip.driver.fullName} badge={driverBadge(trip.driver)} />
      <DetailCard title={`${vehicle.brand} ${vehicle.model}`}>
        {vehicle.plate ? <DetailRow label="Placa" value={vehicle.plate} /> : null}
        <DetailRow label="Color" value={vehicle.color} />
        {vehicle.capacity !== undefined ? (
          <DetailRow label="Capacidad" value={formatPassengers(vehicle.capacity)} />
        ) : null}
      </DetailCard>
      <DetailCard>
        <RouteVertical origin={trip.origin.name} destination={trip.destination.name} />
        <DetailDivider />
        <DetailRow label="Fecha" value={dateLabel} />
        <DetailRow label="Hora de salida" value={formatTime(trip.departureAt)} />
      </DetailCard>
      <DetailCard>
        <DetailRow label="Costo" value={formatCost(trip.costPerPassenger)} />
        <DetailRow label="Método de pago" value={paymentLabel(trip)} />
        {extraCostRow}
      </DetailCard>
    </>
  );
}

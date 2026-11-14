import type { TripCardChip, TripCardProps } from '@/components/mobile/TripCard';
import type { ChipTone } from '@/components/shared/Chip';
import type { JoinRequestStatus, PassengerTrip, Trip } from '@/src/types/trip';
import type { PersonSummary } from '@/src/types/user';
import {
  driverBadge as formatDriverBadge,
  formatCardDateTime,
  formatCost,
  formatSeats,
  formatTime,
} from '@/src/utils/format';

/** "Toyota Corolla · Blanco" */
export function vehicleLabel(trip: Trip): string {
  const { brand, model, color } = trip.vehicle;
  return `${brand} ${model} · ${color}`;
}

/** "SINPE Móvil", o "Sin costo" cuando el viaje es gratuito (como en el diseño). */
export function paymentLabel(trip: Trip): string {
  return trip.costPerPassenger === 0 ? 'Sin costo' : trip.paymentMethod.name;
}

/** Chip del conductor ("Conductora · Verificada TEC" / "Conductor · Verificado TEC"). */
export function driverBadge(driver: PersonSummary): string {
  return formatDriverBadge(driver);
}

type StatusChip = { label: string; tone: ChipTone };

/** Chip de estado de las tarjetas de "Mis Viajes". */
export function tripStatusChip(status: JoinRequestStatus): StatusChip {
  switch (status) {
    case 'aprobada':
      return { label: 'Aprobado', tone: 'green' };
    case 'pendiente':
      return { label: 'Pendiente', tone: 'sage' };
    case 'rechazada':
      // No diseñado: se muestra como un estado negativo, igual que "Cancelado".
      return { label: 'Rechazado', tone: 'orange' };
    case 'cancelada':
    default:
      return { label: 'Cancelado', tone: 'orange' };
  }
}

/** Chip "Estado Solicitud" de "Resumen del viaje" ("Aprobada", "Pendiente"…). */
export function requestStatusChip(status: JoinRequestStatus): StatusChip {
  switch (status) {
    case 'aprobada':
      return { label: 'Aprobada', tone: 'green' };
    case 'pendiente':
      return { label: 'Pendiente', tone: 'sage' };
    case 'rechazada':
      return { label: 'Rechazada', tone: 'orange' };
    case 'cancelada':
    default:
      return { label: 'Cancelada', tone: 'orange' };
  }
}

function baseCardProps(trip: Trip): Omit<TripCardProps, 'chips'> {
  return {
    name: trip.driver.fullName,
    vehicle: vehicleLabel(trip),
    cost: formatCost(trip.costPerPassenger),
    origin: trip.origin.name,
    destination: trip.destination.name,
  };
}

/** Tarjeta de "Resultados viajes": hora, cupos y pago. */
export function searchResultCard(trip: Trip): Omit<TripCardProps, 'onPress' | 'style'> {
  const chips: TripCardChip[] = [
    { label: formatTime(trip.departureAt), tone: 'green' },
    { label: formatSeats(trip.availableSeats), tone: 'green' },
    { label: paymentLabel(trip), tone: 'orange' },
  ];
  return { ...baseCardProps(trip), chips };
}

/**
 * Tarjeta de "Mis Viajes". En la lista el diseño muestra la fecha completa y el
 * pago en verde; en la vista de mapa, solo la hora y el pago en naranja.
 */
export function myTripCard(item: PassengerTrip, view: 'lista' | 'mapa'): Omit<TripCardProps, 'onPress' | 'style'> {
  const { trip } = item;
  const chips: TripCardChip[] = [
    { label: view === 'lista' ? formatCardDateTime(trip.departureAt) : formatTime(trip.departureAt), tone: 'green' },
    tripStatusChip(item.status),
    { label: paymentLabel(trip), tone: view === 'lista' ? 'green' : 'orange' },
  ];
  return { ...baseCardProps(trip), chips };
}

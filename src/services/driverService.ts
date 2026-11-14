/**
 * Viajes desde la perspectiva del conductor: publicar, solicitudes y ejecución
 * del viaje (iniciar, finalizar, cancelar).
 *
 * Provisional: implementación simulada con datos de ejemplo.
 */
import type { Id } from '@/src/types/common';
import type { DriverTrip, IncomingRequest, PublishTripInput, TripStatus } from '@/src/types/trip';

import { db } from './mock/db';
import { createId, notFound, respond } from './mock/utils';

export async function publishTrip(input: PublishTripInput): Promise<DriverTrip> {
  const vehicle = db.vehicles.find((item) => item.id === input.vehicleId);
  if (!vehicle) throw notFound('Vehículo', input.vehicleId);

  const paymentMethod = db.catalogs['metodos-pago'].find((item) => item.id === input.paymentMethodId);
  if (!paymentMethod) throw notFound('Método de pago', input.paymentMethodId);

  const { currentUser } = db;
  const trip: DriverTrip = {
    id: createId('t'),
    driver: { id: currentUser.id, fullName: currentUser.fullName },
    vehicle: {
      brand: vehicle.brand,
      model: vehicle.model,
      color: vehicle.color,
      plate: vehicle.plate,
      capacity: vehicle.capacity,
    },
    origin: input.origin,
    destination: input.destination,
    departureAt: input.departureAt,
    costPerPassenger: input.costPerPassenger,
    paymentMethod: { id: paymentMethod.id, name: paymentMethod.name },
    seats: input.seats,
    availableSeats: input.seats,
    status: 'programado',
    passengers: [],
    stops: [
      { place: input.origin, time: input.departureAt, kind: 'origen' },
      { place: input.destination, time: input.departureAt, kind: 'destino' },
    ],
  };
  db.driverTrips.unshift(trip);
  return respond(trip);
}

export async function getIncomingRequests(): Promise<IncomingRequest[]> {
  return respond(db.incomingRequests);
}

export async function respondToRequest(
  id: Id,
  decision: 'aceptada' | 'rechazada',
): Promise<IncomingRequest> {
  const request = db.incomingRequests.find((item) => item.id === id);
  if (!request) throw notFound('Solicitud', id);
  request.status = decision;

  // Al aceptar, los pasajeros de la solicitud se agregan al viaje (sin duplicarlos).
  const trip = request.tripId ? db.driverTrips.find((item) => item.id === request.tripId) : undefined;
  if (decision === 'aceptada' && trip) {
    for (const passenger of request.passengers) {
      const alreadyAdded = trip.passengers.some((item) => item.passenger.id === passenger.passenger.id);
      if (!alreadyAdded && trip.availableSeats > 0) {
        trip.passengers.push({ ...passenger, status: 'aprobada' });
        trip.availableSeats -= 1;
      }
    }
  }

  return respond(request);
}

/** Viajes publicados por el conductor (el más reciente primero). */
export async function getDriverTrips(): Promise<DriverTrip[]> {
  return respond(db.driverTrips);
}

export async function getDriverTrip(id: Id): Promise<DriverTrip> {
  const trip = db.driverTrips.find((item) => item.id === id);
  if (!trip) throw notFound('Viaje', id);
  return respond(trip);
}

async function setTripStatus(id: Id, status: TripStatus): Promise<DriverTrip> {
  const trip = db.driverTrips.find((item) => item.id === id);
  if (!trip) throw notFound('Viaje', id);
  trip.status = status;
  return respond(trip);
}

export function startTrip(id: Id): Promise<DriverTrip> {
  return setTripStatus(id, 'en_curso');
}

export function finishTrip(id: Id): Promise<DriverTrip> {
  return setTripStatus(id, 'finalizado');
}

/** Según el diseño, se avisa a los pasajeros aceptados y el viaje se cierra. */
export function cancelTrip(id: Id): Promise<DriverTrip> {
  return setTripStatus(id, 'cancelado');
}

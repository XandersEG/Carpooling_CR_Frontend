/**
 * Viajes desde la perspectiva del pasajero: búsqueda, solicitud para unirse,
 * "Mis Viajes" e historial.
 *
 * Provisional: implementación simulada con datos de ejemplo. Reemplazar por
 * llamadas al Backend cuando se definan los contratos de la API.
 */
import type { Id, Place } from '@/src/types/common';
import type { PassengerTrip, Trip, TripHistoryItem, TripSearchParams } from '@/src/types/trip';

import { db } from './mock/db';
import { createId, notFound, respond } from './mock/utils';

/** Simulado: devuelve siempre los mismos resultados, sin aplicar los filtros. */
export async function searchTrips(_params: TripSearchParams): Promise<Trip[]> {
  return respond(db.availableTrips.filter((trip) => trip.status === 'programado'));
}

export async function getTrip(id: Id): Promise<Trip> {
  const trip =
    db.availableTrips.find((item) => item.id === id) ??
    db.passengerTrips.find((item) => item.trip.id === id)?.trip;
  if (!trip) throw notFound('Viaje', id);
  return respond(trip);
}

/** Simulado: los mismos puntos de recogida para cualquier viaje. */
export async function getPickupPoints(_tripId: Id): Promise<Place[]> {
  return respond(db.pickupPoints);
}

/** "Solicitar unirme" + "Confirmar punto de recolección". */
export async function requestToJoin(tripId: Id, pickupPoint: Place): Promise<PassengerTrip> {
  const trip = db.availableTrips.find((item) => item.id === tripId);
  if (!trip) throw notFound('Viaje', tripId);

  const passengerTrip: PassengerTrip = {
    requestId: createId('r'),
    status: 'pendiente',
    pickupPoint,
    trip,
  };
  db.passengerTrips.unshift(passengerTrip);
  return respond(passengerTrip);
}

export async function getMyTrips(): Promise<PassengerTrip[]> {
  return respond(db.passengerTrips);
}

export async function getMyTrip(requestId: Id): Promise<PassengerTrip> {
  const passengerTrip = db.passengerTrips.find((item) => item.requestId === requestId);
  if (!passengerTrip) throw notFound('Solicitud', requestId);
  return respond(passengerTrip);
}

export async function getTripHistory(): Promise<TripHistoryItem[]> {
  return respond(db.tripHistory);
}

export async function getHistoryItem(id: Id): Promise<TripHistoryItem> {
  const item = db.tripHistory.find((entry) => entry.id === id);
  if (!item) throw notFound('Viaje del historial', id);
  return respond(item);
}

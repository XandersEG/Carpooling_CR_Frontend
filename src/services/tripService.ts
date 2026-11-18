/**
 * Viajes desde la perspectiva del pasajero: búsqueda, solicitud para unirse,
 * "Mis Viajes" e historial.
 *
 * Provisional: implementación simulada con datos de ejemplo, salvo "Mis Viajes"
 * y "Resumen del viaje", que usan el Backend cuando los mocks están apagados.
 */
import type { Id, Place } from '@/src/types/common';
import type {
  JoinRequestStatus,
  PassengerTrip,
  Trip,
  TripHistoryItem,
  TripSearchParams,
  TripStatus,
} from '@/src/types/trip';

import { apiRequest } from './apiClient';
import { USE_MOCK_DATA } from './config';
import { db } from './mock/db';
import { createId, notFound, respond } from './mock/utils';

type PassengerRequestResponse = {
  id: number;
  estado: 'PENDIENTE' | 'ACEPTADA' | 'RECHAZADA' | 'CANCELADA';
  puntoRecogida: { nombre: string };
  viaje: {
    id: number;
    estado: 'PROGRAMADO' | 'EN_CURSO' | 'FINALIZADO' | 'CANCELADO';
    origen: { nombre: string };
    destino: { nombre: string };
    salida: string;
    cuposDisponibles: number;
    costo: number;
    metodoPago: { id: number; nombre: string };
    conductor: {
      id: number;
      nombre: string;
      fotoUrl: string | null;
      genero: string | null;
      institucion: string | null;
    };
    vehiculo: { marca: string; modelo: string; color: string; placa: string; capacidad: number };
  };
};

const REQUEST_STATUS_FROM_API: Record<PassengerRequestResponse['estado'], JoinRequestStatus> = {
  PENDIENTE: 'pendiente',
  ACEPTADA: 'aprobada',
  RECHAZADA: 'rechazada',
  CANCELADA: 'cancelada',
};

const TRIP_STATUS_FROM_API: Record<PassengerRequestResponse['viaje']['estado'], TripStatus> = {
  PROGRAMADO: 'programado',
  EN_CURSO: 'en_curso',
  FINALIZADO: 'finalizado',
  CANCELADO: 'cancelado',
};

function toPassengerTrip(response: PassengerRequestResponse): PassengerTrip {
  const { viaje } = response;
  return {
    requestId: String(response.id),
    status: REQUEST_STATUS_FROM_API[response.estado],
    pickupPoint: { name: response.puntoRecogida.nombre },
    trip: {
      id: String(viaje.id),
      driver: {
        id: String(viaje.conductor.id),
        fullName: viaje.conductor.nombre,
        gender: viaje.conductor.genero ?? undefined,
        verifiedInstitution: viaje.conductor.institucion ?? undefined,
        avatarUrl: viaje.conductor.fotoUrl ?? undefined,
      },
      vehicle: {
        brand: viaje.vehiculo.marca,
        model: viaje.vehiculo.modelo,
        color: viaje.vehiculo.color,
        plate: viaje.vehiculo.placa,
        capacity: viaje.vehiculo.capacidad,
      },
      origin: { name: viaje.origen.nombre },
      destination: { name: viaje.destino.nombre },
      departureAt: viaje.salida,
      costPerPassenger: viaje.costo,
      paymentMethod: { id: String(viaje.metodoPago.id), name: viaje.metodoPago.nombre },
      availableSeats: viaje.cuposDisponibles,
      status: TRIP_STATUS_FROM_API[viaje.estado],
    },
  };
}

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
  // Sin esto la app confirmaría una solicitud que nunca llega a "Mis Viajes".
  if (!USE_MOCK_DATA) throw new Error('Solicitar viajes todavía no está disponible.');

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
  if (!USE_MOCK_DATA) {
    const requests = await apiRequest<PassengerRequestResponse[]>('/passenger/requests');
    return requests.map(toPassengerTrip);
  }

  return respond(db.passengerTrips);
}

export async function getMyTrip(requestId: Id): Promise<PassengerTrip> {
  if (!USE_MOCK_DATA) {
    return toPassengerTrip(
      await apiRequest<PassengerRequestResponse>(`/passenger/requests/${encodeURIComponent(requestId)}`),
    );
  }

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

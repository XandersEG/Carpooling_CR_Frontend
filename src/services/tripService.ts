/**
 * Viajes desde la perspectiva del pasajero: búsqueda, solicitud para unirse,
 * "Mis Viajes" e historial.
 *
 * Searching trips and the trip detail use the Backend (`/passenger/trips`) when
 * `EXPO_PUBLIC_USE_MOCKS=false`. Provisional: lo demás sigue simulado.
 */
import type { Id, Place } from '@/src/types/common';
import type { PassengerTrip, Trip, TripHistoryItem, TripSearchParams, TripStatus } from '@/src/types/trip';

import { apiRequest } from './apiClient';
import { USE_MOCK_DATA } from './config';
import { db } from './mock/db';
import { createId, notFound, respond } from './mock/utils';

/** Costa Rica's UTC offset; dates and times picked in the app are local to it. */
const CR_OFFSET = '-06:00';

/** A trip in the list of `GET /passenger/trips`. */
type TripListItemResponse = {
  id: number;
  origen: string;
  destino: string;
  origenLat: number;
  origenLng: number;
  destinoLat: number;
  destinoLng: number;
  salida: string;
  cuposDisponibles: number;
  costo: number;
  metodoPago: string;
  conductor: string;
  conductorFoto: string | null;
  /** "Marca Modelo" */
  vehiculo: string;
  color: string;
};

type ApiPlace = { nombre: string; lat: number; lng: number };

/** Response of `GET /passenger/trips/:id`. */
type TripDetailResponse = {
  id: number;
  estado: 'PROGRAMADO' | 'EN_CURSO' | 'FINALIZADO' | 'CANCELADO';
  origen: ApiPlace;
  destino: ApiPlace;
  salida: string;
  cuposDisponibles: number;
  costo: number;
  metodoPago: { id: number; nombre: string };
  conductor: { nombre: string; fotoUrl: string | null; telefono: string | null };
  vehiculo: { marca: string; modelo: string; color: string; placa: string };
};

const STATUS_FROM_API: Record<TripDetailResponse['estado'], TripStatus> = {
  PROGRAMADO: 'programado',
  EN_CURSO: 'en_curso',
  FINALIZADO: 'finalizado',
  CANCELADO: 'cancelado',
};

/** About 5 km around each picked place (the Backend measures the radius in degrees). */
const SEARCH_RADIUS_DEGREES = 0.05;

function toListTrip(item: TripListItemResponse): Trip {
  // the list only brings "Marca Modelo" together; the first word is the brand
  const [brand = '', ...model] = item.vehiculo.split(' ');
  return {
    id: String(item.id),
    // the list does not include the driver's id; the detail screen does not need it
    driver: { id: '', fullName: item.conductor, avatarUrl: item.conductorFoto ?? undefined },
    vehicle: { brand, model: model.join(' '), color: item.color },
    origin: { name: item.origen },
    destination: { name: item.destino },
    departureAt: item.salida,
    costPerPassenger: item.costo,
    // the list only brings the method's name, which is unique in the catalog
    paymentMethod: { id: item.metodoPago, name: item.metodoPago },
    availableSeats: item.cuposDisponibles,
    status: 'programado',
    originPoint: { lat: item.origenLat, lng: item.origenLng },
    destinationPoint: { lat: item.destinoLat, lng: item.destinoLng },
  };
}

function toDetailTrip(detail: TripDetailResponse): Trip {
  return {
    id: String(detail.id),
    driver: { id: '', fullName: detail.conductor.nombre, avatarUrl: detail.conductor.fotoUrl ?? undefined },
    vehicle: {
      brand: detail.vehiculo.marca,
      model: detail.vehiculo.modelo,
      color: detail.vehiculo.color,
      plate: detail.vehiculo.placa,
    },
    origin: { name: detail.origen.nombre },
    destination: { name: detail.destino.nombre },
    departureAt: detail.salida,
    costPerPassenger: detail.costo,
    paymentMethod: { id: String(detail.metodoPago.id), name: detail.metodoPago.nombre },
    availableSeats: detail.cuposDisponibles,
    status: STATUS_FROM_API[detail.estado],
    originPoint: { lat: detail.origen.lat, lng: detail.origen.lng },
    destinationPoint: { lat: detail.destino.lat, lng: detail.destino.lng },
  };
}

/** Query of `GET /passenger/trips`: picked places and the chosen day from the chosen time. */
function toSearchQuery(params: TripSearchParams): string {
  const query = new URLSearchParams({
    desde: `${params.date}T${params.time}:00${CR_OFFSET}`,
    hasta: `${params.date}T23:59:59${CR_OFFSET}`,
    radioGrados: String(SEARCH_RADIUS_DEGREES),
  });
  if (params.originPoint) {
    query.set('origenLat', String(params.originPoint.lat));
    query.set('origenLng', String(params.originPoint.lng));
  }
  if (params.destinationPoint) {
    query.set('destinoLat', String(params.destinationPoint.lat));
    query.set('destinoLng', String(params.destinationPoint.lng));
  } else if (params.destination.trim()) {
    // a typed destination that was not picked from the suggestions is matched by name
    query.set('destinoNombre', params.destination.trim());
  }
  return query.toString();
}

/** Scheduled trips with free seats that match the search (never the user's own). */
export async function searchTrips(params: TripSearchParams): Promise<Trip[]> {
  if (!USE_MOCK_DATA) {
    const response = await apiRequest<TripListItemResponse[]>(`/passenger/trips?${toSearchQuery(params)}`);
    return response.map(toListTrip);
  }
  // Simulado: devuelve siempre los mismos resultados, sin aplicar los filtros.
  return respond(db.availableTrips.filter((trip) => trip.status === 'programado'));
}

export async function getTrip(id: Id): Promise<Trip> {
  if (!USE_MOCK_DATA) {
    return toDetailTrip(await apiRequest<TripDetailResponse>(`/passenger/trips/${encodeURIComponent(id)}`));
  }

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

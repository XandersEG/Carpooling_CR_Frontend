/**
 * Viajes desde la perspectiva del pasajero: búsqueda, solicitud para unirse,
 * "Mis Viajes" e "Historial de viajes" (como pasajero y como conductor).
 * Todo usa el Backend.
 */
import type { GeoPoint, Id, Place } from '@/src/types/common';
import type {
  JoinRequest,
  JoinRequestStatus,
  PassengerTrip,
  Trip,
  TripHistoryItem,
  TripSearchParams,
  TripStatus,
} from '@/src/types/trip';

import { apiRequest } from './apiClient';

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

const STATUS_FROM_API: Record<TripDetailResponse['estado'], TripStatus> = {
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
      status: STATUS_FROM_API[viaje.estado],
    },
  };
}

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
  const response = await apiRequest<TripListItemResponse[]>(`/passenger/trips?${toSearchQuery(params)}`);
  return response.map(toListTrip);
}

export async function getTrip(id: Id): Promise<Trip> {
  return toDetailTrip(await apiRequest<TripDetailResponse>(`/passenger/trips/${encodeURIComponent(id)}`));
}

/** Pickup point chosen by the passenger: a name for the driver and its map point. */
export type PickupChoice = Place & { point: GeoPoint };

/** Response of `POST /passenger/trips/:id/join-requests`. */
type JoinRequestResponse = {
  id: number;
  viajeId: number;
  estado: 'PENDIENTE';
};

/** "Solicitar unirme" + "Confirmar punto de recolección". */
export async function requestToJoin(tripId: Id, pickupPoint: PickupChoice): Promise<PassengerTrip> {
  const request = await apiRequest<JoinRequestResponse>(
    `/passenger/trips/${encodeURIComponent(tripId)}/join-requests`,
    {
      method: 'POST',
      body: { nombre: pickupPoint.name, lat: pickupPoint.point.lat, lng: pickupPoint.point.lng },
    },
  );
  return {
    requestId: String(request.id),
    status: 'pendiente',
    pickupPoint: { name: pickupPoint.name, detail: pickupPoint.detail },
    trip: await getTrip(tripId),
  };
}

export async function getMyTrips(): Promise<PassengerTrip[]> {
  const requests = await apiRequest<PassengerRequestResponse[]>('/passenger/requests');
  return requests.map(toPassengerTrip);
}

export async function getMyTrip(requestId: Id): Promise<PassengerTrip> {
  return toPassengerTrip(
    await apiRequest<PassengerRequestResponse>(`/passenger/requests/${encodeURIComponent(requestId)}`),
  );
}

/** Viaje dentro de un elemento de `GET /history`. */
type HistoryTripResponse = {
  id: number;
  estado: 'FINALIZADO' | 'CANCELADO';
  origen: ApiPlace;
  destino: ApiPlace;
  salida: string;
  inicioReal: string | null;
  finReal: string | null;
  motivoCancelacion: string | null;
  cuposTotales: number;
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

/** Elemento de `GET /history` y `GET /history/:id`. */
type HistoryItemResponse = {
  /** `c-<viajeId>` como conductor, `p-<solicitudId>` como pasajero. */
  id: string;
  rol: 'conductor' | 'pasajero';
  monto: number;
  viaje: HistoryTripResponse;
  /** Solo como pasajero: dónde lo recogieron. */
  puntoRecogida?: { nombre: string };
  /** Solo como conductor: pasajeros que iban en el viaje. */
  pasajeros?: {
    solicitudId: number;
    pasajeroId: number;
    nombre: string;
    fotoUrl: string | null;
    puntoRecogida: { nombre: string };
    monto: number;
  }[];
};

function toHistoryItem(item: HistoryItemResponse): TripHistoryItem {
  const { viaje } = item;
  const tripId = String(viaje.id);
  const paymentMethod = { id: String(viaje.metodoPago.id), name: viaje.metodoPago.nombre };
  const passengers: JoinRequest[] | undefined = item.pasajeros?.map((passenger) => ({
    id: String(passenger.solicitudId),
    tripId,
    passenger: {
      id: String(passenger.pasajeroId),
      fullName: passenger.nombre,
      avatarUrl: passenger.fotoUrl ?? undefined,
    },
    pickupPoint: { name: passenger.puntoRecogida.nombre },
    amount: passenger.monto,
    paymentMethod,
    status: 'aprobada',
  }));

  return {
    id: item.id,
    role: item.rol,
    amount: item.monto,
    passengers,
    pickupPoint: item.puntoRecogida ? { name: item.puntoRecogida.nombre } : undefined,
    cancellationReason: viaje.motivoCancelacion ?? undefined,
    trip: {
      id: tripId,
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
      arrivalAt: viaje.finReal ?? undefined,
      costPerPassenger: viaje.costo,
      paymentMethod,
      availableSeats: 0,
      status: STATUS_FROM_API[viaje.estado],
      originPoint: { lat: viaje.origen.lat, lng: viaje.origen.lng },
      destinationPoint: { lat: viaje.destino.lat, lng: viaje.destino.lng },
    },
  };
}

/** Viajes finalizados o cancelados del usuario, como conductor y como pasajero (el más reciente primero). */
export async function getTripHistory(): Promise<TripHistoryItem[]> {
  const items = await apiRequest<HistoryItemResponse[]>('/history');
  return items.map(toHistoryItem);
}

/** Un viaje del historial; `id` es el que devuelve `getTripHistory`. */
export async function getHistoryItem(id: Id): Promise<TripHistoryItem> {
  return toHistoryItem(await apiRequest<HistoryItemResponse>(`/history/${encodeURIComponent(id)}`));
}

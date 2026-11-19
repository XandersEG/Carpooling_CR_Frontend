/**
 * Viajes desde la perspectiva del conductor: publicar, solicitudes y ejecución
 * del viaje (iniciar, finalizar, cancelar).
 *
 * Todo usa el Backend (`/driver/trips`, `/driver/requests`, `/catalogs`).
 */
import type { PaymentMethodItem } from '@/src/types/admin';
import type { Id } from '@/src/types/common';
import type { DriverTrip, IncomingRequest, IncomingRequestStatus, PublishTripInput, TripStatus } from '@/src/types/trip';

import { apiRequest } from './apiClient';
import { buildDriverTripStops, sortAlongRoute } from './driverTripStops';

type ApiPlace = { nombre: string; lat: number; lng: number };

/** Respuesta de `/driver/trips/:id`. */
type DriverTripResponse = {
  id: number;
  estado: 'PROGRAMADO' | 'EN_CURSO' | 'FINALIZADO' | 'CANCELADO';
  origen: ApiPlace;
  destino: ApiPlace;
  salida: string;
  inicioReal: string | null;
  finReal: string | null;
  cuposTotales: number;
  cuposDisponibles: number;
  costo: number;
  metodoPago: { id: number; nombre: string };
  conductor: { id: number; nombre: string; fotoUrl: string | null };
  vehiculo: { marca: string; modelo: string; color: string; placa: string };
  pasajeros: {
    solicitudId: number;
    pasajeroId: number;
    nombre: string;
    fotoUrl: string | null;
    puntoRecogida: ApiPlace;
  }[];
};

const STATUS_FROM_API: Record<DriverTripResponse['estado'], TripStatus> = {
  PROGRAMADO: 'programado',
  EN_CURSO: 'en_curso',
  FINALIZADO: 'finalizado',
  CANCELADO: 'cancelado',
};

function toDriverTrip(response: DriverTripResponse): DriverTrip {
  const id = String(response.id);
  const paymentMethod = { id: String(response.metodoPago.id), name: response.metodoPago.nombre };
  const origin = { name: response.origen.nombre };
  const destination = { name: response.destino.nombre };
  const arrivalAt = response.finReal ?? undefined;
  const originPoint = { lat: response.origen.lat, lng: response.origen.lng };
  const destinationPoint = { lat: response.destino.lat, lng: response.destino.lng };

  // El Backend los manda en orden de aceptación; las dos pestañas van en orden de recogida.
  const pasajeros = sortAlongRoute(originPoint, destinationPoint, response.pasajeros, ({ puntoRecogida }) => ({
    lat: puntoRecogida.lat,
    lng: puntoRecogida.lng,
  }));

  const stops = buildDriverTripStops({
    origin: { name: response.origen.nombre, point: originPoint },
    destination: { name: response.destino.nombre, point: destinationPoint },
    departureAt: response.salida,
    arrivalAt,
    pickups: pasajeros.map((passenger) => ({
      name: passenger.puntoRecogida.nombre,
      point: { lat: passenger.puntoRecogida.lat, lng: passenger.puntoRecogida.lng },
      passengerName: passenger.nombre,
    })),
  });

  return {
    id,
    driver: {
      id: String(response.conductor.id),
      fullName: response.conductor.nombre,
      avatarUrl: response.conductor.fotoUrl ?? undefined,
    },
    vehicle: {
      brand: response.vehiculo.marca,
      model: response.vehiculo.modelo,
      color: response.vehiculo.color,
      plate: response.vehiculo.placa,
    },
    origin,
    destination,
    departureAt: response.salida,
    arrivalAt,
    costPerPassenger: response.costo,
    paymentMethod,
    seats: response.cuposTotales,
    availableSeats: response.cuposDisponibles,
    status: STATUS_FROM_API[response.estado],
    passengers: pasajeros.map((passenger) => ({
      id: String(passenger.solicitudId),
      tripId: id,
      passenger: {
        id: String(passenger.pasajeroId),
        fullName: passenger.nombre,
        avatarUrl: passenger.fotoUrl ?? undefined,
      },
      pickupPoint: { name: passenger.puntoRecogida.nombre },
      amount: response.costo,
      paymentMethod,
      status: 'aprobada',
    })),
    stops,
  };
}

async function requestTripAction(id: Id, action: 'start' | 'finish' | 'cancel'): Promise<DriverTrip> {
  const response = await apiRequest<DriverTripResponse>(`/driver/trips/${encodeURIComponent(id)}/${action}`, {
    method: 'POST',
  });
  return toDriverTrip(response);
}

/** Payment method as returned by `GET /catalogs/payment-methods` (only active ones). */
type PaymentMethodResponse = {
  id: number;
  nombre: string;
  descripcion: string | null;
  activo: boolean;
};

/** Payment methods the driver can choose when publishing a trip. */
export async function listPaymentMethods(): Promise<PaymentMethodItem[]> {
  const response = await apiRequest<PaymentMethodResponse[]>('/catalogs/payment-methods');
  return response.map((method) => ({
    id: String(method.id),
    name: method.nombre,
    description: method.descripcion ?? '',
    active: method.activo,
  }));
}

/** Body of `POST /driver/trips`. */
type PublishTripRequest = {
  vehiculoId: number;
  metodoPagoId: number;
  origenNombre: string;
  origenLat: number;
  origenLng: number;
  destinoNombre: string;
  destinoLat: number;
  destinoLng: number;
  fechaHoraSalida: string;
  cuposTotales: number;
  costo: number;
};

/** Publishes the trip; with the real API the created trip is then loaded with its full details. */
export async function publishTrip(input: PublishTripInput): Promise<DriverTrip> {
  const body: PublishTripRequest = {
    vehiculoId: Number(input.vehicleId),
    metodoPagoId: Number(input.paymentMethodId),
    origenNombre: input.origin.name,
    origenLat: input.originPoint.lat,
    origenLng: input.originPoint.lng,
    destinoNombre: input.destination.name,
    destinoLat: input.destinationPoint.lat,
    destinoLng: input.destinationPoint.lng,
    fechaHoraSalida: input.departureAt,
    cuposTotales: input.seats,
    costo: input.costPerPassenger,
  };
  const created = await apiRequest<{ id: number }>('/driver/trips', { method: 'POST', body });
  return getDriverTrip(String(created.id));
}

/** Solicitud como la devuelve `GET /driver/requests`. */
type IncomingRequestResponse = {
  id: number;
  estado: 'PENDIENTE' | 'ACEPTADA' | 'RECHAZADA';
  pasajero: { id: number; nombre: string; fotoUrl: string | null };
  puntoRecogida: ApiPlace;
  viaje: {
    id: number;
    origen: { nombre: string };
    destino: { nombre: string };
    salida: string;
    costo: number;
  };
};

const REQUEST_STATUS_FROM_API: Record<IncomingRequestResponse['estado'], IncomingRequestStatus> = {
  PENDIENTE: 'pendiente',
  ACEPTADA: 'aceptada',
  RECHAZADA: 'rechazada',
};

function toIncomingRequest(response: IncomingRequestResponse): IncomingRequest {
  return {
    id: String(response.id),
    tripId: String(response.viaje.id),
    passenger: {
      id: String(response.pasajero.id),
      fullName: response.pasajero.nombre,
      avatarUrl: response.pasajero.fotoUrl ?? undefined,
    },
    pickupPoint: { name: response.puntoRecogida.nombre },
    origin: { name: response.viaje.origen.nombre },
    destination: { name: response.viaje.destino.nombre },
    departureAt: response.viaje.salida,
    amount: response.viaje.costo,
    status: REQUEST_STATUS_FROM_API[response.estado],
  };
}

/** Solicitudes pendientes y aceptadas de los viajes programados del conductor. */
export async function getIncomingRequests(): Promise<IncomingRequest[]> {
  const response = await apiRequest<IncomingRequestResponse[]>('/driver/requests');
  return response.map(toIncomingRequest);
}

/** Acepta o rechaza una solicitud. Devuelve su nuevo estado. */
export async function respondToRequest(
  id: Id,
  decision: 'aceptada' | 'rechazada',
): Promise<IncomingRequestStatus> {
  const action = decision === 'aceptada' ? 'accept' : 'reject';
  const response = await apiRequest<{ estado: IncomingRequestResponse['estado'] }>(
    `/driver/requests/${encodeURIComponent(id)}/${action}`,
    { method: 'POST' },
  );
  return REQUEST_STATUS_FROM_API[response.estado];
}

export async function getDriverTrip(id: Id): Promise<DriverTrip> {
  return toDriverTrip(await apiRequest<DriverTripResponse>(`/driver/trips/${encodeURIComponent(id)}`));
}

export function startTrip(id: Id): Promise<DriverTrip> {
  return requestTripAction(id, 'start');
}

export function finishTrip(id: Id): Promise<DriverTrip> {
  return requestTripAction(id, 'finish');
}

/** Según el diseño, se avisa a los pasajeros aceptados y el viaje se cierra. */
export function cancelTrip(id: Id): Promise<DriverTrip> {
  return requestTripAction(id, 'cancel');
}

/**
 * Viajes desde la perspectiva del conductor: publicar, solicitudes y ejecución
 * del viaje (iniciar, finalizar, cancelar).
 *
 * Publicar, consultar, iniciar, finalizar y cancelar un viaje y listar los
 * métodos de pago usan el Backend cuando `EXPO_PUBLIC_USE_MOCKS=false`.
 * Provisional: lo demás sigue simulado.
 */
import type { PaymentMethodItem } from '@/src/types/admin';
import type { Id } from '@/src/types/common';
import type { DriverTrip, IncomingRequest, IncomingRequestStatus, PublishTripInput, TripStatus, TripStop, } from '@/src/types/trip';
import { now } from '@/src/utils/clock';

import { apiRequest } from './apiClient';
import { USE_MOCK_DATA } from './config';
import { db } from './mock/db';
import { createId, delay, notFound, respond } from './mock/utils';
type ApiPlace = { nombre: string; lat: number; lng: number };

/** Respuesta de `/driver/trips/:id`. */
type DriverTripResponse = {
  id: number;
  estado: 'PROGRAMADO' | 'EN_CURSO' | 'FINALIZADO' | 'CANCELADO';
  origen: ApiPlace;
  destino: ApiPlace;
  salida: string;
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

  const stops: TripStop[] = [
    { place: origin, time: response.salida, kind: 'origen' },
    ...response.pasajeros.map(
      (passenger): TripStop => ({
        place: { name: passenger.puntoRecogida.nombre },
        kind: 'recogida',
        passengerName: passenger.nombre,
      }),
    ),
    { place: destination, time: arrivalAt, kind: 'destino' },
  ];

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
    passengers: response.pasajeros.map((passenger) => ({
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
  if (!USE_MOCK_DATA) {
    const response = await apiRequest<PaymentMethodResponse[]>('/catalogs/payment-methods');
    return response.map((method) => ({
      id: String(method.id),
      name: method.nombre,
      description: method.descripcion ?? '',
      active: method.activo,
    }));
  }
  return respond(db.catalogs['metodos-pago']);
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
  if (!USE_MOCK_DATA) {
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
  if (!USE_MOCK_DATA) {
    const response = await apiRequest<IncomingRequestResponse[]>('/driver/requests');
    return response.map(toIncomingRequest);
  }
  return respond(db.incomingRequests.filter((request) => request.status !== 'rechazada'));
}

/** Acepta o rechaza una solicitud. Devuelve su nuevo estado. */
export async function respondToRequest(
  id: Id,
  decision: 'aceptada' | 'rechazada',
): Promise<IncomingRequestStatus> {
  if (!USE_MOCK_DATA) {
    const action = decision === 'aceptada' ? 'accept' : 'reject';
    const response = await apiRequest<{ estado: IncomingRequestResponse['estado'] }>(
      `/driver/requests/${encodeURIComponent(id)}/${action}`,
      { method: 'POST' },
    );
    return REQUEST_STATUS_FROM_API[response.estado];
  }

  // Simulado con las mismas reglas que el Backend.
  const request = db.incomingRequests.find((item) => item.id === id);
  if (!request) throw new Error('La solicitud no existe.');
  if (request.status !== 'pendiente') throw new Error('La solicitud ya fue respondida.');

  const trip = db.driverTrips.find((item) => item.id === request.tripId);
  if (decision === 'aceptada' && trip) {
    if (trip.availableSeats <= 0) throw new Error('El viaje ya no tiene cupos disponibles.');
    trip.passengers.push({
      id: request.id,
      tripId: request.tripId,
      passenger: request.passenger,
      pickupPoint: request.pickupPoint,
      amount: request.amount,
      paymentMethod: trip.paymentMethod,
      status: 'aprobada',
    });
    trip.availableSeats -= 1;
  }

  request.status = decision;
  await delay();
  return decision;
}

/** Viajes publicados por el conductor (el más reciente primero). */
export async function getDriverTrips(): Promise<DriverTrip[]> {
  return respond(db.driverTrips);
}

export async function getDriverTrip(id: Id): Promise<DriverTrip> {
  if (!USE_MOCK_DATA) {
    return toDriverTrip(await apiRequest<DriverTripResponse>(`/driver/trips/${encodeURIComponent(id)}`));
  }

  const trip = db.driverTrips.find((item) => item.id === id);
  if (!trip) throw notFound('Viaje', id);
  return respond(trip);
}

async function setTripStatus(id: Id, status: TripStatus): Promise<DriverTrip> {
  const trip = db.driverTrips.find((item) => item.id === id);
  if (!trip) throw notFound('Viaje', id);
  trip.status = status;
  if (status === 'finalizado') trip.arrivalAt ??= now().toISOString();
  return respond(trip);
}

export function startTrip(id: Id): Promise<DriverTrip> {
  return USE_MOCK_DATA ? setTripStatus(id, 'en_curso') : requestTripAction(id, 'start');
}

export function finishTrip(id: Id): Promise<DriverTrip> {
  return USE_MOCK_DATA ? setTripStatus(id, 'finalizado') : requestTripAction(id, 'finish');
}

/** Según el diseño, se avisa a los pasajeros aceptados y el viaje se cierra. */
export function cancelTrip(id: Id): Promise<DriverTrip> {
  return USE_MOCK_DATA ? setTripStatus(id, 'cancelado') : requestTripAction(id, 'cancel');
}

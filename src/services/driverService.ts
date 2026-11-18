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
import type { DriverTrip, IncomingRequest, PublishTripInput, TripStatus, TripStop } from '@/src/types/trip';
import { now } from '@/src/utils/clock';

import { apiRequest } from './apiClient';
import { USE_MOCK_DATA } from './config';
import { db } from './mock/db';
import { createId, notFound, respond } from './mock/utils';

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

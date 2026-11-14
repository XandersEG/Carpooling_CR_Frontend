import type { Colones, Id, IsoDate, IsoDateTime, PaymentMethodRef, Place } from '@/src/types/common';
import type { PersonSummary, Role } from '@/src/types/user';
import type { TripVehicle } from '@/src/types/vehicle';

/** Estado de un viaje publicado. */
export type TripStatus = 'programado' | 'en_curso' | 'finalizado' | 'cancelado';

/** Estado de la solicitud de un pasajero para unirse a un viaje. */
export type JoinRequestStatus = 'pendiente' | 'aprobada' | 'rechazada' | 'cancelada';

/** Viaje publicado por un conductor (resultados de búsqueda y "Detalle del viaje"). */
export type Trip = {
  id: Id;
  driver: PersonSummary;
  vehicle: TripVehicle;
  origin: Place;
  destination: Place;
  departureAt: IsoDateTime;
  arrivalAt?: IsoDateTime;
  /** Aporte por pasajero. 0 = gratuito. */
  costPerPassenger: Colones;
  paymentMethod: PaymentMethodRef;
  availableSeats: number;
  status: TripStatus;
  distanceKm?: number;
  estimatedMinutes?: number;
};

/** Filtros de la pantalla "Buscar rutas". */
export type TripSearchParams = {
  origin: string;
  destination: string;
  date: IsoDate;
  /** Hora de salida en formato `HH:mm`. */
  time: string;
};

/** Solicitud de un pasajero para unirse a un viaje. */
export type JoinRequest = {
  id: Id;
  tripId: Id;
  passenger: PersonSummary;
  pickupPoint?: Place;
  pickupAt?: IsoDateTime;
  amount: Colones;
  paymentMethod: PaymentMethodRef;
  status: JoinRequestStatus;
};

/** Viaje desde la perspectiva del pasajero ("Mis Viajes" y "Resumen del viaje"). */
export type PassengerTrip = {
  requestId: Id;
  trip: Trip;
  status: JoinRequestStatus;
  pickupPoint?: Place;
};

/** Parada en el recorrido de un viaje (pestaña "Paradas"). */
export type TripStop = {
  place: Place;
  time: IsoDateTime;
  kind: 'origen' | 'recogida' | 'destino';
  /** Pasajero que se recoge en esta parada. */
  passengerName?: string;
};

/** Viaje del conductor con sus pasajeros aceptados y paradas. */
export type DriverTrip = Trip & {
  /** Capacidad publicada para el viaje. */
  seats: number;
  passengers: JoinRequest[];
  stops: TripStop[];
};

/** Datos para publicar un viaje (asistente "Publicar Viaje"). */
export type PublishTripInput = {
  vehicleId: Id;
  origin: Place;
  destination: Place;
  departureAt: IsoDateTime;
  seats: number;
  costPerPassenger: Colones;
  paymentMethodId: Id;
};

/**
 * Tarjeta de la pantalla "Solicitudes" del conductor.
 *
 * Provisional: el diseño muestra cada tarjeta como una ruta que se acepta o
 * rechaza y que, al expandirse, lista pasajeros y la ganancia total. Falta
 * confirmar con producto si cada tarjeta representa una solicitud individual o
 * un viaje con varias solicitudes (docs/design/user-flows.md §4).
 */
export type IncomingRequest = {
  id: Id;
  tripId?: Id;
  origin: Place;
  destination: Place;
  departureAt?: IsoDateTime;
  arrivalAt?: IsoDateTime;
  passengers: JoinRequest[];
  status: 'pendiente' | 'aceptada' | 'rechazada';
};

/** Elemento del "Historial de viajes". */
export type TripHistoryItem = {
  id: Id;
  role: Role;
  trip: Trip;
  /** Como pasajero: monto pagado. Como conductor: ganancia total. */
  amount: Colones;
  /** Solo como conductor: pasajeros que viajaron. */
  passengers?: JoinRequest[];
};

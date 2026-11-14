/**
 * Datos de ejemplo de la app móvil, tomados de los diseños de Figma
 * (docs/design/screens-inventory.md §2). Solo para desarrollo: no usar como
 * valores por defecto en producción.
 *
 * En Figma, "Hoy" corresponde al domingo 25 de octubre de 2026.
 */
import type { PaymentMethodRef, Place } from '@/src/types/common';
import type {
  DriverTrip,
  IncomingRequest,
  JoinRequest,
  PassengerTrip,
  Trip,
  TripHistoryItem,
} from '@/src/types/trip';
import type { PersonSummary, SavedPlace, UserProfile } from '@/src/types/user';
import type { Vehicle } from '@/src/types/vehicle';

export const paymentMethods = {
  sinpe: { id: 'pm-sinpe', name: 'SINPE Móvil' },
  efectivo: { id: 'pm-efectivo', name: 'Efectivo' },
  gratuito: { id: 'pm-gratuito', name: 'Gratuito / Solidario' },
} as const satisfies Record<string, PaymentMethodRef>;

export const currentUser: UserProfile = {
  id: 'u-danny',
  fullName: 'Danny Jimenez Sevilla',
  displayName: 'Danny',
  email: 'danny.jimenez@estudiantec.cr',
  gender: 'Masculino',
  birthDate: '2006-01-01',
  roles: ['conductor', 'pasajero'],
  institutionName: 'Tecnológico de Costa Rica',
};

export const savedPlaces: SavedPlace[] = [
  { id: 'sp-1', name: 'San José centro', detail: 'Avenida Central' },
  { id: 'sp-2', name: 'UCR San Pedro', detail: 'Montes de Oca' },
  { id: 'sp-3', name: 'Heredia centro', detail: 'Parque Central' },
];

export const myVehicles: Vehicle[] = [
  {
    id: 'v-corolla',
    brand: 'Toyota',
    model: 'Corolla',
    plate: 'ABC-123',
    color: 'Blanco',
    capacity: 4,
    photoUrls: [],
    active: true,
  },
  {
    id: 'v-tucson',
    brand: 'Hyundai',
    model: 'Tucson',
    plate: 'XYZ-789',
    color: 'Gris',
    capacity: 5,
    photoUrls: [],
    active: false,
  },
  {
    id: 'v-versa',
    brand: 'Nissan',
    model: 'Versa',
    plate: 'LMN-456',
    color: 'Rojo',
    capacity: 4,
    photoUrls: [],
    active: false,
  },
];

const people = {
  ana: { id: 'u-ana', fullName: 'Ana Rojas', verifiedInstitution: 'TEC', gender: 'Femenino' },
  luis: { id: 'u-luis', fullName: 'Luis Mora', verifiedInstitution: 'TEC', gender: 'Masculino' },
  karla: { id: 'u-karla', fullName: 'Karla Vargas', verifiedInstitution: 'TEC', gender: 'Femenino' },
  rafael: { id: 'u-rafael', fullName: 'Rafael Díaz' },
  lucy: { id: 'u-lucy', fullName: 'Lucy Madrigal' },
  jose: { id: 'u-jose', fullName: 'José Solís' },
  me: { id: currentUser.id, fullName: currentUser.fullName, verifiedInstitution: 'TEC' },
} as const satisfies Record<string, PersonSummary>;

const places = {
  tecCartago: { name: 'TEC Cartago' },
  sanJose: { name: 'San José' },
  tecSanJose: { name: 'TEC San José' },
  tresRios: { name: 'Tres Ríos' },
  cartago: { name: 'Cartago' },
  alajuela: { name: 'Alajuela' },
  heredia: { name: 'Heredia' },
} as const satisfies Record<string, Place>;

/** Puntos de recogida disponibles en la pantalla "Seleccionar punto de recolección". */
export const pickupPoints: Place[] = [
  {
    name: 'Mall San Pedro',
    detail:
      '100 metros al este de la Fuente de la Hispanidad, San Pedro de Montes de Oca, San José, Costa Rica',
  },
  {
    name: 'Parada de buses Ochomogo',
    detail: 'Diagonal a la salida de RECOPE, autopista Florencio del Castillo, Cartago.',
  },
];

/** Resultados de "Buscar rutas" (TEC Cartago → San José, hoy, 6:30 a. m.). */
export const availableTrips: Trip[] = [
  {
    id: 't-ana',
    driver: people.ana,
    vehicle: { brand: 'Toyota', model: 'Corolla', color: 'Blanco', plate: 'ABC-123', capacity: 4 },
    origin: places.tecCartago,
    destination: places.sanJose,
    departureAt: '2026-10-25T06:30:00-06:00',
    costPerPassenger: 1500,
    paymentMethod: paymentMethods.sinpe,
    availableSeats: 3,
    status: 'programado',
  },
  {
    id: 't-luis',
    driver: people.luis,
    vehicle: { brand: 'Hyundai', model: 'Tucson', color: 'Gris', plate: 'SQL-234', capacity: 4 },
    origin: places.tresRios,
    destination: places.sanJose,
    departureAt: '2026-10-25T06:45:00-06:00',
    costPerPassenger: 0,
    paymentMethod: paymentMethods.gratuito,
    availableSeats: 2,
    status: 'programado',
  },
  {
    id: 't-karla',
    driver: people.karla,
    vehicle: { brand: 'Nissan', model: 'Versa', color: 'Rojo', plate: 'SQL-007', capacity: 4 },
    origin: places.cartago,
    destination: places.sanJose,
    departureAt: '2026-10-25T07:00:00-06:00',
    costPerPassenger: 1200,
    paymentMethod: paymentMethods.efectivo,
    availableSeats: 1,
    status: 'programado',
  },
];

/** Viajes del pasajero ("Mis Viajes"): aprobado, pendiente y cancelado. */
export const passengerTrips: PassengerTrip[] = [
  {
    requestId: 'r-mine-1',
    status: 'aprobada',
    pickupPoint: pickupPoints[0],
    trip: availableTrips[0],
  },
  {
    requestId: 'r-mine-2',
    status: 'pendiente',
    trip: {
      ...availableTrips[1],
      id: 't-luis-pm',
      destination: places.tecSanJose,
      departureAt: '2026-10-25T18:45:00-06:00',
    },
  },
  {
    requestId: 'r-mine-3',
    status: 'cancelada',
    trip: {
      ...availableTrips[2],
      id: 't-karla-lunes',
      destination: places.tecSanJose,
      departureAt: '2026-10-26T07:00:00-06:00',
    },
  },
];

const acceptedPassengers: JoinRequest[] = [
  {
    id: 'r-lucy',
    tripId: 't-mine',
    passenger: people.lucy,
    pickupPoint: { name: 'Parada Ochomogo' },
    pickupAt: '2026-10-25T18:40:00-06:00',
    amount: 1500,
    paymentMethod: paymentMethods.sinpe,
    status: 'aprobada',
  },
  {
    id: 'r-jose',
    tripId: 't-mine',
    passenger: people.jose,
    pickupPoint: { name: 'Mall San Pedro' },
    pickupAt: '2026-10-25T19:00:00-06:00',
    amount: 1500,
    paymentMethod: paymentMethods.efectivo,
    status: 'aprobada',
  },
];

/** Viaje publicado por el usuario actual como conductor ("Viaje programado"). */
export const driverTrips: DriverTrip[] = [
  {
    id: 't-mine',
    driver: people.me,
    vehicle: { brand: 'Toyota', model: 'Corolla', color: 'Blanco', plate: 'ABC-123', capacity: 4 },
    origin: places.tecCartago,
    destination: { name: 'San José', detail: 'TEC San José' },
    departureAt: '2026-10-25T18:30:00-06:00',
    arrivalAt: '2026-10-25T19:30:00-06:00',
    costPerPassenger: 1500,
    paymentMethod: paymentMethods.sinpe,
    seats: 4,
    availableSeats: 2,
    status: 'programado',
    passengers: acceptedPassengers,
    stops: [
      { place: places.tecCartago, time: '2026-10-25T18:30:00-06:00', kind: 'origen' },
      {
        place: { name: 'Parada Ochomogo' },
        time: '2026-10-25T18:40:00-06:00',
        kind: 'recogida',
        passengerName: 'Lucy Madrigal',
      },
      {
        place: { name: 'Mall San Pedro' },
        time: '2026-10-25T19:00:00-06:00',
        kind: 'recogida',
        passengerName: 'José Solís',
      },
      {
        place: { name: 'San José', detail: 'TEC San José' },
        time: '2026-10-25T19:30:00-06:00',
        kind: 'destino',
      },
    ],
  },
];

/** Tarjetas de la pantalla "Solicitudes". Solo la primera tiene detalle en el diseño. */
export const incomingRequests: IncomingRequest[] = [
  {
    id: 'ir-1',
    tripId: 't-mine',
    origin: places.sanJose,
    destination: places.tecCartago,
    departureAt: '2026-10-25T18:30:00-06:00',
    arrivalAt: '2026-10-25T19:30:00-06:00',
    passengers: acceptedPassengers.map((request) => ({ ...request, status: 'pendiente' })),
    status: 'pendiente',
  },
  { id: 'ir-2', origin: places.tecCartago, destination: places.heredia, passengers: [], status: 'pendiente' },
  { id: 'ir-3', origin: places.heredia, destination: { name: 'TEC SJO' }, passengers: [], status: 'pendiente' },
  { id: 'ir-4', origin: places.tecCartago, destination: places.alajuela, passengers: [], status: 'pendiente' },
];

export const tripHistory: TripHistoryItem[] = [
  {
    id: 'h-1',
    role: 'conductor',
    amount: 3000,
    passengers: acceptedPassengers,
    trip: { ...driverTrips[0], status: 'finalizado' },
  },
  {
    id: 'h-2',
    role: 'pasajero',
    amount: 1500,
    trip: {
      ...availableTrips[1],
      id: 't-luis-24',
      departureAt: '2026-10-24T06:45:00-06:00',
      arrivalAt: '2026-10-24T07:15:00-06:00',
      costPerPassenger: 1500,
      paymentMethod: paymentMethods.sinpe,
      status: 'finalizado',
    },
  },
  {
    id: 'h-3',
    role: 'pasajero',
    amount: 1200,
    trip: {
      ...availableTrips[2],
      id: 't-karla-23',
      departureAt: '2026-10-23T07:00:00-06:00',
      status: 'finalizado',
    },
  },
  {
    id: 'h-4',
    role: 'pasajero',
    amount: 0,
    trip: {
      id: 't-rafael-22',
      driver: people.rafael,
      vehicle: { brand: 'Kia', model: 'Sportage', color: 'Azul' },
      origin: places.alajuela,
      destination: places.sanJose,
      departureAt: '2026-10-22T07:15:00-06:00',
      costPerPassenger: 0,
      paymentMethod: paymentMethods.gratuito,
      availableSeats: 0,
      status: 'finalizado',
    },
  },
];

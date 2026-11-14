/**
 * Datos de ejemplo de "Consultas generales" y "Estadísticas", transcritos de
 * los frames de Figma (sección "Web Parte 2, puntos 3, 4 y 5"). Solo para
 * desarrollo.
 */
import type {
  AverageAmountQuery,
  InstitutionFilterOption,
  NewUsersQuery,
  RankingQuery,
  StatisticsSummary,
  TripListEntry,
} from '@/src/types/analytics';

/** Opciones del "Menú Plegable" de instituciones (`2055:2086`). */
export const institutionFilterOptions: InstitutionFilterOption[] = [
  { label: 'Todas las instituciones', code: null },
  { label: 'Universidad de Costa Rica', code: 'UCR' },
  { label: 'Tecnológico de Costa Rica', code: 'TEC' },
  { label: 'Universidad Nacional', code: 'UNA' },
  { label: 'UNED', code: 'UNED' },
];

/** 1 · Top Conductores (`228:142`). */
export const topDrivers: RankingQuery = {
  totalWithRecords: 109,
  entries: [
    { id: 'td-1', name: 'Andrés Alfaro Monge', institution: 'UNA', trips: 16 },
    { id: 'td-2', name: 'Diego Vargas Campos', institution: 'TEC', trips: 16 },
    { id: 'td-3', name: 'Fernanda Castro Rojas', institution: 'UCR', trips: 14 },
    { id: 'td-4', name: 'Luis Campos Vargas', institution: 'TEC', trips: 13 },
    { id: 'td-5', name: 'María Castro Chaves', institution: 'TEC', trips: 13 },
  ],
};

/** 2 · Puntos concurrentes (`340:3557`). */
export const busiestPoints: RankingQuery = {
  totalWithRecords: 24,
  tripsInPeriod: 341,
  entries: [
    { id: 'bp-1', name: 'Basílica de Cartago', institution: 'TEC', trips: 48 },
    { id: 'bp-2', name: 'Mercedes, Sede Central', institution: 'UNED', trips: 46 },
    { id: 'bp-3', name: 'Parque de Heredia', institution: 'UNA', trips: 37 },
    { id: 'bp-4', name: 'Mall San Pedro', institution: 'UCR', trips: 36 },
    { id: 'bp-5', name: 'Parada Fuente de la Hispanidad', institution: 'UCR', trips: 31 },
  ],
};

/** 3 · Usuarios activos (`340:3858`). */
export const mostActiveUsers: RankingQuery = {
  totalWithRecords: 225,
  entries: [
    { id: 'au-1', name: 'Diego Vargas Campos', institution: 'TEC', trips: 34 },
    { id: 'au-2', name: 'Valeria Brenes Calderón', institution: 'UNED', trips: 30 },
    { id: 'au-3', name: 'Mauricio Monge Jiménez', institution: 'UNA', trips: 30 },
    { id: 'au-4', name: 'Andrés Alfaro Monge', institution: 'UNA', trips: 28 },
    { id: 'au-5', name: 'Luis Campos Vargas', institution: 'TEC', trips: 26 },
  ],
};

/** 4 · Listado de viajes (`340:2884` y filas expandidas del componente `2287:3249`). */
export const tripList: TripListEntry[] = [
  {
    id: 'tl-1176',
    code: 'V-1176',
    departureAt: '2026-10-20T09:00:00-06:00',
    institution: 'UNED',
    driverName: 'Valeria Brenes Calderón',
    origin: 'Guadalupe Centro',
    destination: 'Campus UNED',
    amount: 1200,
    stops: ['Guadalupe Centro', 'Terminal Coca-Cola', 'Campus UNED'],
    vehicle: 'Kia Rio - CRX-334',
    passengers: ['Mario Mora Alfaro'],
  },
  {
    id: 'tl-1280',
    code: 'V-1280',
    departureAt: '2026-10-20T06:00:00-06:00',
    institution: 'TEC',
    driverName: 'Andrea Rodríguez Brenes',
    origin: 'Basílica de Cartago',
    destination: 'Campus TEC',
    amount: 1600,
    stops: ['Basílica de Cartago', 'Campus TEC'],
    vehicle: 'Mitsubishi - PQR-561',
    passengers: ['Pablo Mora Chaves', 'Diego Monge Campos', 'Alejandro Quesada Calderón'],
  },
  {
    id: 'tl-1325',
    code: 'V-1325',
    departureAt: '2026-10-19T08:45:00-06:00',
    institution: 'UNA',
    driverName: 'Valeria Brenes Calderón',
    origin: 'Mall Oxígeno',
    destination: 'Campus UNA',
    amount: 1100,
    stops: ['Mall Oxígeno', 'Campus UNA'],
    vehicle: 'Seat Arona - LTB-784',
    passengers: ['Mauricio Monge Jiménez', 'Andrés Alfaro Monge'],
  },
  {
    id: 'tl-1135',
    code: 'V-1135',
    departureAt: '2026-10-18T11:00:00-06:00',
    institution: 'TEC',
    driverName: 'Andrés Alfaro Monge',
    origin: 'Terminal Paraíso',
    destination: 'Campus TEC',
    amount: 500,
    stops: ['Terminal Paraíso', 'Campus TEC'],
    vehicle: 'Nissan Leaf - TKY-123',
    passengers: ['Luis Campos Vargas', 'Diego Vargas Campos'],
  },
  {
    id: 'tl-1295',
    code: 'V-1295',
    departureAt: '2026-10-18T10:00:00-06:00',
    institution: 'UCR',
    driverName: 'Javier Castro Solís',
    origin: 'Terminal Zapote',
    destination: 'Campus UCR',
    amount: 0,
    stops: ['Terminal Zapote', 'Campus UCR'],
    vehicle: 'Kia Rio - CRX-334',
    passengers: ['Fernanda Castro Rojas', 'Valeria Calderón Ulate', 'Alejandro Quesada Calderón'],
  },
];

/** 5 · Monto promedio (`340:3079`, tooltips `Promedio1–4`). */
export const averageAmount: AverageAmountQuery = {
  average: 1242,
  tripsWithCharge: 253,
  tripsWithoutCharge: 88,
  tripsInPeriod: 341,
  min: 500,
  max: 2000,
  byInstitution: [
    { institution: 'UCR', average: 1203 },
    { institution: 'TEC', average: 1210 },
    { institution: 'UNA', average: 1328 },
    { institution: 'UNED', average: 1233 },
  ],
};

/** 6 · Usuarios nuevos (`340:3224`). El diseño solo muestra 5 filas de la tabla. */
export const newUsers: NewUsersQuery = {
  total: 37,
  percentOfTotal: 15.4,
  totalUsers: 240,
  from: '2026-07-26',
  to: '2026-10-26',
  monthly: [
    { month: 'jul', count: 4 },
    { month: 'ago', count: 17 },
    { month: 'sep', count: 9 },
    { month: 'oct', count: 7 },
  ],
  users: [
    { id: 'nu-1', fullName: 'Andres Madrigal Garro', institution: 'UNA', role: 'conductor', registeredAt: '2026-10-19' },
    { id: 'nu-2', fullName: 'Flora Rodriguez Poma', institution: 'UCR', role: 'conductor', registeredAt: '2026-10-18' },
    { id: 'nu-3', fullName: 'Roberth Rojas Quesada', institution: 'UNA', role: 'pasajero', registeredAt: '2026-10-16' },
    { id: 'nu-4', fullName: 'Ximena Molina Portilla', institution: 'TEC', role: 'pasajero', registeredAt: '2026-10-16' },
    { id: 'nu-5', fullName: 'Valeria Vargas Alvarado', institution: 'UCR', role: 'conductor', registeredAt: '2026-10-15' },
  ],
};

/** Estadísticas (`285:483`), filtro "Tecnológico de Costa Rica". */
export const statistics: StatisticsSummary = {
  activeDrivers: 25,
  activePassengers: 46,
  uniqueUsers: 57,
  bothRoles: 14,
  driversByGender: [
    { key: 'femenino', label: 'Femenino', count: 11, percent: 44.0 },
    { key: 'masculino', label: 'Masculino', count: 12, percent: 48.0 },
    { key: 'otro', label: 'Otro / No indica', count: 2, percent: 8.0 },
  ],
  passengersByGender: [
    { key: 'femenino', label: 'Femenino', count: 17, percent: 37.0 },
    { key: 'masculino', label: 'Masculino', count: 27, percent: 58.7 },
    { key: 'otro', label: 'Otro / No indica', count: 2, percent: 4.3 },
  ],
  tripsByPaymentMethod: [
    { key: 'efectivo', label: 'Efectivo', count: 34, percent: 34.7 },
    { key: 'sinpe', label: 'SINPE móvil', count: 41, percent: 41.8 },
    { key: 'gratuito', label: 'Gratuito', count: 23, percent: 23.5 },
  ],
  usersByAgeRange: [
    { label: '0 a 18 años', count: 3, percent: 5.0 },
    { label: '19 a 30 años', count: 33, percent: 55.0 },
    { label: '31 a 45 años', count: 12, percent: 20.0 },
    { label: '46 a 60 años', count: 8, percent: 13.3 },
    { label: '61 a 75 años', count: 2, percent: 3.3 },
    { label: 'Más de 75 años', tableLabel: 'Mayores de 75 años', count: 2, percent: 3.3 },
  ],
};

/** Opciones del "Menú generos" (`2222:2236`). */
export const genderFilterOptions = ['Todos los géneros', 'Femenino', 'Masculino', 'Otro / No indica'];

// Tipos de "Consultas generales" y "Estadísticas" (portal administrativo).
// Provisional: confirmar los contratos con el equipo de Backend.
import type { Colones, Id, IsoDate, IsoDateTime } from '@/src/types/common';
import type { Role } from '@/src/types/user';

/** Siglas de institución que se muestran en las tablas ("TEC", "UCR", …). */
export type InstitutionCode = 'TEC' | 'UCR' | 'UNA' | 'UNED';

/** Opción del filtro "Institución" (menú plegable). `code` nulo = todas. */
export type InstitutionFilterOption = {
  label: string;
  code: InstitutionCode | null;
};

/** Fila de las consultas "Top N" (conductores, puntos o usuarios). */
export type RankingEntry = {
  id: Id;
  /** Conductor, punto de recogida o usuario. */
  name: string;
  institution: InstitutionCode;
  /** Viajes brindados o registrados. */
  trips: number;
};

export type RankingQuery = {
  entries: RankingEntry[];
  /** Total que muestra la etiqueta naranja ("Conductores con viajes: 109"). */
  totalWithRecords: number;
  /** Viajes en el periodo (solo "Puntos concurrentes"). */
  tripsInPeriod?: number;
};

export type TripListEntry = {
  id: Id;
  /** Código visible del viaje ("V-1176"). */
  code: string;
  departureAt: IsoDateTime;
  institution: InstitutionCode;
  driverName: string;
  origin: string;
  destination: string;
  /** 0 = "Sin cobro". */
  amount: Colones;
  /** Paradas de la ruta, incluidos origen y destino. */
  stops: string[];
  /** "Kia Rio - CRX-334". */
  vehicle: string;
  passengers: string[];
};

export type AverageAmountByInstitution = {
  institution: InstitutionCode;
  average: Colones;
};

export type AverageAmountQuery = {
  average: Colones;
  tripsWithCharge: number;
  tripsWithoutCharge: number;
  tripsInPeriod: number;
  min: Colones;
  max: Colones;
  byInstitution: AverageAmountByInstitution[];
};

export type NewUserEntry = {
  id: Id;
  fullName: string;
  institution: InstitutionCode;
  role: Role;
  registeredAt: IsoDate;
};

export type MonthlyCount = {
  /** Mes abreviado tal como aparece en el gráfico ("jul"). */
  month: string;
  count: number;
};

export type NewUsersQuery = {
  total: number;
  /** Porcentaje sobre los usuarios totales (15.4). */
  percentOfTotal: number;
  totalUsers: number;
  /** Rango del periodo mostrado en el subtítulo. */
  from: IsoDate;
  to: IsoDate;
  monthly: MonthlyCount[];
  users: NewUserEntry[];
};

// ── Estadísticas ─────────────────────────────────────────────────────────────

export type DistributionSlice = {
  key: string;
  label: string;
  count: number;
  /** Porcentaje mostrado en la leyenda (44.0). */
  percent: number;
};

export type AgeRangeStat = {
  label: string;
  /** Etiqueta en la tabla cuando difiere de la del gráfico. */
  tableLabel?: string;
  count: number;
  percent: number;
};

export type StatisticsSummary = {
  activeDrivers: number;
  activePassengers: number;
  uniqueUsers: number;
  /** Personas que fueron conductoras y pasajeras. */
  bothRoles: number;
  driversByGender: DistributionSlice[];
  passengersByGender: DistributionSlice[];
  tripsByPaymentMethod: DistributionSlice[];
  usersByAgeRange: AgeRangeStat[];
};

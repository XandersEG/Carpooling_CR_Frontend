/**
 * Consultas generales y Estadísticas del portal administrativo.
 *
 * Provisional: implementación simulada con las cifras de los diseños. Los
 * filtros se aplican del lado del cliente solo donde los datos lo permiten
 * (institución y nombre en las tablas, fechas en el listado de viajes); los
 * totales de las etiquetas no se recalculan.
 */
import type {
  AverageAmountQuery,
  InstitutionCode,
  InstitutionFilterOption,
  NewUsersQuery,
  RankingQuery,
  StatisticsSummary,
  TripListEntry,
} from '@/src/types/analytics';
import type { IsoDate } from '@/src/types/common';
import { toIsoDate } from '@/src/utils/format';

import * as fixtures from '../mock/fixtures/analytics';
import { respond } from '../mock/utils';

export type RankingKind = 'conductores' | 'puntos' | 'usuarios';

export type TableFilters = {
  institution?: InstitutionCode | null;
  search?: string;
};

export type DateRange = {
  from?: IsoDate | null;
  to?: IsoDate | null;
};

const rankings: Record<RankingKind, RankingQuery> = {
  conductores: fixtures.topDrivers,
  puntos: fixtures.busiestPoints,
  usuarios: fixtures.mostActiveUsers,
};

function matches(name: string, institution: InstitutionCode, filters: TableFilters): boolean {
  if (filters.institution && institution !== filters.institution) return false;
  const term = filters.search?.trim().toLowerCase();
  return !term || name.toLowerCase().includes(term);
}

export async function listInstitutionFilterOptions(): Promise<InstitutionFilterOption[]> {
  return respond(fixtures.institutionFilterOptions);
}

/** "Top N" de conductores, puntos de recogida o usuarios. */
export async function getRanking(
  kind: RankingKind,
  filters: TableFilters & { top: number },
): Promise<RankingQuery> {
  const query = rankings[kind];
  const entries = query.entries.filter((entry) => matches(entry.name, entry.institution, filters));
  return respond({ ...query, entries: entries.slice(0, Math.max(0, filters.top)) });
}

export async function listTrips(filters: TableFilters & DateRange): Promise<TripListEntry[]> {
  const trips = fixtures.tripList.filter((trip) => {
    if (!matches(trip.driverName, trip.institution, filters)) return false;
    const day = toIsoDate(trip.departureAt);
    if (filters.from && day < filters.from) return false;
    if (filters.to && day > filters.to) return false;
    return true;
  });
  return respond(trips);
}

export async function getAverageAmount(filters: TableFilters): Promise<AverageAmountQuery> {
  const query = fixtures.averageAmount;
  const byInstitution = filters.institution
    ? query.byInstitution.filter((item) => item.institution === filters.institution)
    : query.byInstitution;
  return respond({ ...query, byInstitution });
}

/** Usuarios nuevos de los últimos `months` meses (el diseño muestra 4 meses de datos). */
export async function getNewUsers(filters: TableFilters & { months: number }): Promise<NewUsersQuery> {
  const query = fixtures.newUsers;
  return respond({
    ...query,
    monthly: query.monthly.slice(-Math.max(1, filters.months)),
    users: query.users.filter((user) => matches(user.fullName, user.institution, filters)),
  });
}

export async function getStatistics(): Promise<StatisticsSummary> {
  return respond(fixtures.statistics);
}

export async function listGenderFilterOptions(): Promise<string[]> {
  return respond(fixtures.genderFilterOptions);
}

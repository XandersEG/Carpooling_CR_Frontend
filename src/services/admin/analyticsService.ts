/**
 * Consultas generales y Estadísticas del portal administrativo.
 *
 * Provisional: "Puntos concurrentes" y "Usuarios nuevos" consultan el back end;
 * las demás conservan los fixtures del diseño.
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
import {
  consultarPuntosConcurrentes,
  consultarUsuariosNuevos,
} from '@/src/features/admin/api';

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

const rankings: Record<Exclude<RankingKind, 'puntos'>, RankingQuery> = {
  conductores: fixtures.topDrivers,
  usuarios: fixtures.mostActiveUsers,
};

function matches(name: string, institution: string, filters: TableFilters): boolean {
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
  filters: TableFilters &
    DateRange & {
      top: number;
      institutionId?: number;
    },
): Promise<RankingQuery> {
  if (kind === 'puntos') {
    return consultarPuntosConcurrentes({
      desde: filters.from ?? undefined,
      hasta: filters.to ?? undefined,
      institucionId: filters.institutionId,
      top: filters.top,
    });
  }

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

/* Usuarios registrados en los últimos meses. */
export function getNewUsers(filters: {
  institutionId?: number;
  search?: string;
  months: number;
}): Promise<NewUsersQuery> {
  return consultarUsuariosNuevos({
    meses: filters.months,
    institucionId: filters.institutionId,
    buscar: filters.search,
  });
}

export async function getStatistics(): Promise<StatisticsSummary> {
  return respond(fixtures.statistics);
}

export async function listGenderFilterOptions(): Promise<string[]> {
  return respond(fixtures.genderFilterOptions);
}

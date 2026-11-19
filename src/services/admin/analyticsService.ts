/**
 * Consultas generales y Estadísticas del portal administrativo.
 *
 * Provisional: la mayoría de las consultas usa datos de ejemplo. "Usuarios
 * nuevos" ya consulta el back end; las demás conservan los fixtures del diseño.
 */
import type {
  AgeRangeStat,
  AverageAmountQuery,
  DistributionSlice,
  EstadisticasRespuesta,
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
import { consultarUsuariosNuevos } from '@/src/features/admin/api';

import { obtenerEstadisticas } from '@/src/features/admin/api';
import { USE_MOCK_DATA } from '../config';

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


const TODOS_LOS_GENEROS = 'Todos los géneros';
const OTRO_GENERO = 'Otro / No indica';
const ORDEN_GENEROS = ['Femenino', 'Masculino', OTRO_GENERO];

function agruparGenero(nombre: string): string {
  return nombre === 'Femenino' || nombre === 'Masculino' ? nombre : OTRO_GENERO;
}

function porcentaje(parte: number, total: number): number {
  return total > 0 ? (parte * 100) / total : 0;
}

function sumar(filas: { total: number }[]): number {
  return filas.reduce((suma, fila) => suma + fila.total, 0);
}

function aSlices(filas: { label: string; count: number }[]): DistributionSlice[] {
  const total = filas.reduce((suma, fila) => suma + fila.count, 0);
  return filas.map((fila) => ({
    key: fila.label.toLowerCase(),
    label: fila.label,
    count: fila.count,
    percent: porcentaje(fila.count, total),
  }));
}

function porGenero(filas: { genero: string; total: number }[]): DistributionSlice[] {
  return aSlices(
    ORDEN_GENEROS.map((label) => ({
      label,
      count: sumar(filas.filter((fila) => agruparGenero(fila.genero) === label)),
    })),
  );
}

function porRangoEdad(filas: EstadisticasRespuesta['rangoEdad'], genero: string): AgeRangeStat[] {
  const elegidas = filas.filter((fila) => genero === TODOS_LOS_GENEROS || agruparGenero(fila.genero) === genero);
  const rangos = [...new Set(filas.map((fila) => fila.rango))];
  const conteos = rangos.map((rango) => ({
    label: rango,
    count: sumar(elegidas.filter((fila) => fila.rango === rango)),
  }));
  const total = conteos.reduce((suma, fila) => suma + fila.count, 0);
  return conteos.map((fila) => ({ ...fila, percent: porcentaje(fila.count, total) }));
}



export type StatisticsFilters = {
  institucionId?: number;
  desde?: IsoDate | null;
  hasta?: IsoDate | null;
};

export async function getStatistics(
  filtros: StatisticsFilters = {},
  genero: string = TODOS_LOS_GENEROS,
): Promise<StatisticsSummary> {
  if (USE_MOCK_DATA) {
    return respond(fixtures.statistics);
  }

  const datos = await obtenerEstadisticas({
    institucionId: filtros.institucionId,
    desde: filtros.desde ?? undefined,
    hasta: filtros.hasta ?? undefined,
  });

  return {
    activeDrivers: datos.resumenDatos.conductoresActivos,
    activePassengers: datos.resumenDatos.pasajerosActivos,
    uniqueUsers: datos.resumenDatos.usuariosUnicos,
    bothRoles: datos.resumenDatos.ambosRoles,
    driversByGender: porGenero(datos.conductoresGenero),
    passengersByGender: porGenero(datos.pasajerosGenero),
    tripsByPaymentMethod: aSlices(datos.viajesMetodo.map((fila) => ({ label: fila.metodo, count: fila.total }))),
    usersByAgeRange: porRangoEdad(datos.rangoEdad, genero),
  };
}

export async function listGenderFilterOptions(): Promise<string[]> {
  return respond(fixtures.genderFilterOptions);
}

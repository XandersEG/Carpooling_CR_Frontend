import { formatSlot } from '@/components/mobile/TimeSlotPicker';
import { USE_MOCK_DATA } from '@/src/services/config';
import type { IsoDate } from '@/src/types/common';
import type { TripSearchParams } from '@/src/types/trip';
import { now } from '@/src/utils/clock';
import { formatRelativeDay, toIsoDate } from '@/src/utils/format';

/**
 * Parámetros de búsqueda compartidos por "Buscar rutas", "Resultados" y el
 * resumen de búsqueda de "Mis Viajes". Viajan como parámetros de la URL.
 */
export type SearchRouteParams = {
  origin?: string;
  destination?: string;
  date?: string;
  time?: string;
};

/** Última búsqueda realizada en la sesión (resumen de "Mis Viajes"). */
let lastSearch: TripSearchParams | null = null;

/**
 * Valores iniciales de "Buscar rutas". Con datos simulados se usan los de las
 * variables de Figma (`busqueda/origen` "TEC Cartago", `busqueda/destino`
 * "San José", "Hoy", "6:30 a. m.").
 */
export function defaultSearch(): TripSearchParams {
  return {
    origin: USE_MOCK_DATA ? 'TEC Cartago' : '',
    destination: USE_MOCK_DATA ? 'San José' : '',
    date: toIsoDate(now()),
    time: '06:30',
  };
}

function single(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

/** Combina los parámetros de la URL con los valores por defecto. */
export function readSearchParams(params: Record<string, string | string[] | undefined>): TripSearchParams {
  const base = lastSearch ?? defaultSearch();
  return {
    origin: single(params.origin) ?? base.origin,
    destination: single(params.destination) ?? base.destination,
    date: single(params.date) ?? base.date,
    time: single(params.time) ?? base.time,
  };
}

export function rememberSearch(params: TripSearchParams): void {
  lastSearch = params;
}

export function getLastSearch(): TripSearchParams {
  return lastSearch ?? defaultSearch();
}

/** "Hoy" o "26 oct" para una fecha `YYYY-MM-DD`. */
export function formatSearchDate(date: IsoDate): string {
  return formatRelativeDay(`${date}T12:00:00-06:00`);
}

/** "6:30 a. m." para una hora `HH:mm`. */
export function formatSearchTime(time: string): string {
  return formatSlot(time);
}

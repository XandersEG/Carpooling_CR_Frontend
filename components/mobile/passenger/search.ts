import { formatSlot } from '@/components/mobile/TimeSlotPicker';
import { USE_MOCK_DATA } from '@/src/services/config';
import type { GeoPoint, IsoDate } from '@/src/types/common';
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
  originLat?: string;
  originLng?: string;
  destinationLat?: string;
  destinationLng?: string;
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

/** Point from a pair of URL params, or undefined if either is missing or not a number. */
function readPoint(lat: string | undefined, lng: string | undefined): GeoPoint | undefined {
  const point = { lat: Number(lat), lng: Number(lng) };
  return lat && lng && Number.isFinite(point.lat) && Number.isFinite(point.lng) ? point : undefined;
}

/** Combina los parámetros de la URL con los valores por defecto. */
export function readSearchParams(params: Record<string, string | string[] | undefined>): TripSearchParams {
  const base = lastSearch ?? defaultSearch();
  const origin = single(params.origin);
  const destination = single(params.destination);
  return {
    origin: origin ?? base.origin,
    destination: destination ?? base.destination,
    date: single(params.date) ?? base.date,
    time: single(params.time) ?? base.time,
    // a place that comes in the URL brings its own point (or none); otherwise the remembered one is kept
    originPoint:
      origin !== undefined ? readPoint(single(params.originLat), single(params.originLng)) : base.originPoint,
    destinationPoint:
      destination !== undefined
        ? readPoint(single(params.destinationLat), single(params.destinationLng))
        : base.destinationPoint,
  };
}

/** Search as flat URL params (Expo Router only passes text values). */
export function toRouteParams(search: TripSearchParams): SearchRouteParams {
  return {
    origin: search.origin,
    destination: search.destination,
    date: search.date,
    time: search.time,
    originLat: search.originPoint ? String(search.originPoint.lat) : undefined,
    originLng: search.originPoint ? String(search.originPoint.lng) : undefined,
    destinationLat: search.destinationPoint ? String(search.destinationPoint.lat) : undefined,
    destinationLng: search.destinationPoint ? String(search.destinationPoint.lng) : undefined,
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

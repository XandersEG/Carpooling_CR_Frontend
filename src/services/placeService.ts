/**
 * Place search for the Origen/Destino fields, using OpenStreetMap's Nominatim API
 * (free, no API key). Results are limited to Costa Rica.
 *
 * Nominatim's usage policy: at most ~1 request per second and an identifying
 * User-Agent. The autocomplete field waits until the user stops typing before
 * calling `searchPlaces`, which keeps it well under that limit.
 */
import type { GeoPoint, Place } from '@/src/types/common';

const NOMINATIM_URL = 'https://nominatim.openstreetmap.org';
/** Generic app identification required by Nominatim; it carries no user data. */
const HEADERS = { 'Accept-Language': 'es', 'User-Agent': 'TuanisCarpooling/1.0' };
const MAX_RESULTS = 5;

/** A place found by the search, with its point on the map. */
export type PlaceSuggestion = Place & { point: GeoPoint };

type NominatimResult = {
  lat: string;
  lon: string;
  name?: string;
  display_name: string;
};

function toSuggestion(result: NominatimResult): PlaceSuggestion {
  // display_name is "name, district, canton, province, country"; the first part is the
  // short name, the rest (without the country) is shown as the detail line
  const parts = result.display_name.split(', ').filter((part) => part !== 'Costa Rica');
  const name = result.name || parts[0];
  return {
    name,
    detail: parts.filter((part) => part !== name).slice(0, 3).join(', ') || undefined,
    point: { lat: Number(Number(result.lat).toFixed(6)), lng: Number(Number(result.lon).toFixed(6)) },
  };
}

/** Places in Costa Rica that match the text. `signal` lets the caller cancel an outdated search. */
export async function searchPlaces(query: string, signal?: AbortSignal): Promise<PlaceSuggestion[]> {
  const params = new URLSearchParams({
    q: query,
    format: 'jsonv2',
    countrycodes: 'cr',
    limit: String(MAX_RESULTS),
  });
  const response = await fetch(`${NOMINATIM_URL}/search?${params}`, { headers: HEADERS, signal });
  if (!response.ok) throw new Error('No se pudieron buscar lugares. Inténtalo de nuevo.');
  const results = (await response.json()) as NominatimResult[];
  return results.map(toSuggestion);
}

/** Name of the place at a point (used when the driver taps the map). Returns null if none is found. */
export async function describePoint(point: GeoPoint): Promise<PlaceSuggestion | null> {
  const params = new URLSearchParams({
    lat: String(point.lat),
    lon: String(point.lng),
    format: 'jsonv2',
    zoom: '17',
  });
  const response = await fetch(`${NOMINATIM_URL}/reverse?${params}`, { headers: HEADERS });
  if (!response.ok) return null;
  const result = (await response.json()) as NominatimResult & { error?: string };
  if (result.error) return null;
  // keep the exact tapped point, not the center of the building OSM found
  return { ...toSuggestion(result), point };
}

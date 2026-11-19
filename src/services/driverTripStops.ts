/**
 * Orden del recorrido para "Viaje programado / en curso" (pestañas "Pasajeros"
 * y "Paradas") a partir de la respuesta de `GET /driver/trips/:id`.
 *
 * El Backend entrega los pasajeros en el orden en que se aceptaron, no en el del
 * recorrido, y no hay servicio de rutas. Por eso las recogidas se ordenan según
 * qué tan avanzadas quedan sobre la línea recta origen → destino, y los pasajeros
 * que comparten el mismo punto de recogida forman una sola parada.
 */
import type { GeoPoint, IsoDateTime } from '@/src/types/common';
import type { TripStop } from '@/src/types/trip';

type NamedPoint = { name: string; point: GeoPoint };

export type PickupInput = NamedPoint & { passengerName: string };

export type DriverTripStopsInput = {
  origin: NamedPoint;
  destination: NamedPoint;
  departureAt: IsoDateTime;
  /** Hora real de llegada; no existe mientras el viaje no termina. */
  arrivalAt?: IsoDateTime;
  /** Pasajeros aceptados, en el orden en que los devuelve el Backend. */
  pickups: PickupInput[];
};

/**
 * Avance del punto sobre la línea origen → destino: 0 en el origen, 1 en el
 * destino. Para distancias de una ciudad basta con aproximar la Tierra como un
 * plano (la longitud se escala por el coseno de la latitud).
 */
function progressAlongRoute(origin: GeoPoint, destination: GeoPoint, point: GeoPoint): number {
  const cosLat = Math.cos((((origin.lat + destination.lat) / 2) * Math.PI) / 180);
  const routeX = (destination.lng - origin.lng) * cosLat;
  const routeY = destination.lat - origin.lat;
  const lengthSquared = routeX * routeX + routeY * routeY;
  if (lengthSquared === 0) return 0;
  const pointX = (point.lng - origin.lng) * cosLat;
  const pointY = point.lat - origin.lat;
  return (pointX * routeX + pointY * routeY) / lengthSquared;
}

/**
 * Copia de `items` en el orden en que se pasa por ellos yendo del origen al
 * destino. sort es estable: con el mismo avance se respeta el orden recibido.
 */
export function sortAlongRoute<T>(
  origin: GeoPoint,
  destination: GeoPoint,
  items: readonly T[],
  pointOf: (item: T) => GeoPoint,
): T[] {
  return items
    .map((item) => ({ item, progress: progressAlongRoute(origin, destination, pointOf(item)) }))
    .sort((a, b) => a.progress - b.progress)
    .map(({ item }) => item);
}

/** "Ana", "Ana y Luis", "Ana, Luis y Sofía". */
function joinNames(names: string[]): string {
  if (names.length <= 1) return names[0] ?? '';
  return `${names.slice(0, -1).join(', ')} y ${names[names.length - 1]}`;
}

/** Origen, una parada por punto de recogida (en orden del recorrido) y destino. */
export function buildDriverTripStops({
  origin,
  destination,
  departureAt,
  arrivalAt,
  pickups,
}: DriverTripStopsInput): TripStop[] {
  // Un mismo lugar (mismo nombre y mismas coordenadas) es una sola parada.
  const groups = new Map<string, { name: string; point: GeoPoint; passengerNames: string[] }>();
  for (const pickup of pickups) {
    const key = `${pickup.name}|${pickup.point.lat}|${pickup.point.lng}`;
    const group = groups.get(key);
    if (group) group.passengerNames.push(pickup.passengerName);
    else groups.set(key, { name: pickup.name, point: pickup.point, passengerNames: [pickup.passengerName] });
  }

  const ordered = sortAlongRoute(origin.point, destination.point, [...groups.values()], (group) => group.point);

  return [
    { place: { name: origin.name }, point: origin.point, time: departureAt, kind: 'origen' },
    ...ordered.map(
      (group): TripStop => ({
        place: { name: group.name },
        point: group.point,
        kind: 'recogida',
        passengerName: joinNames(group.passengerNames),
      }),
    ),
    { place: { name: destination.name }, point: destination.point, time: arrivalAt, kind: 'destino' },
  ];
}

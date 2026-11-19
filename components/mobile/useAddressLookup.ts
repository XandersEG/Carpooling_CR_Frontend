import { useCallback, useRef } from 'react';

import { describePoint, type PlaceSuggestion } from '@/src/services/placeService';
import type { GeoPoint } from '@/src/types/common';

/** Shown in a field while the address of its pin is being looked up. */
export const LOOKING_UP_ADDRESS = 'Buscando dirección…';
/** Used when OpenStreetMap has no address for the point; the user can rename it. */
const UNNAMED_POINT = 'Punto en el mapa';

/**
 * Looks up the address of a pin placed on the map. `key` identifies the field
 * (e.g. 'origen'); only the latest lookup per key reports back, so a slow, older
 * answer never overwrites a newer pin.
 */
export function useAddressLookup() {
  const latest = useRef<Record<string, number>>({});

  const lookup = useCallback(
    (key: string, point: GeoPoint, onName: (name: string, place?: PlaceSuggestion) => void) => {
      const id = (latest.current[key] ?? 0) + 1;
      latest.current[key] = id;
      onName(LOOKING_UP_ADDRESS);
      describePoint(point)
        .catch(() => null)
        .then((place) => {
          if (latest.current[key] !== id) return;
          onName(place?.name ?? UNNAMED_POINT, place ?? undefined);
        });
    },
    [],
  );

  // a suggestion picked by hand replaces any lookup still pending for that field
  const cancel = useCallback((key: string) => {
    latest.current[key] = (latest.current[key] ?? 0) + 1;
  }, []);

  return { lookup, cancel };
}

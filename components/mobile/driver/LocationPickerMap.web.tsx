import { PublishRouteMap } from './RouteMaps';
import type { LocationPickerMapProps } from './LocationPickerMap';

export type { LocationPickerMapProps, PickTarget } from './LocationPickerMap';

/**
 * Web version: react-native-maps does not support web, so the static map of
 * decision D3 is shown and no points can be picked. Trips are published from
 * the iOS/Android app.
 */
export function LocationPickerMap({ originLabel, destinationLabel, style }: LocationPickerMapProps) {
  return (
    <PublishRouteMap origin={originLabel || 'Origen'} destination={destinationLabel || 'Destino'} style={style} />
  );
}

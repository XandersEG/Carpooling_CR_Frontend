import { MapView } from './MapView';
import type { RouteMapProps } from './RouteMap';

export type { MapInsets, RouteMapProps } from './RouteMap';

/**
 * Web version: react-native-maps does not support web, so the static map image of
 * decision D3 is shown without the route.
 */
export function RouteMap({ style }: RouteMapProps) {
  return <MapView style={style} />;
}

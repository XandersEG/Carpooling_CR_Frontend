import { Pressable, StyleSheet, Text, View, type StyleProp, type ViewStyle } from 'react-native';
import type MapView from 'react-native-maps';
import type { Region } from 'react-native-maps';

import { colors, palette, radius, shadows } from '@/src/constants/theme';

/** How much one tap zooms: halves (or doubles) the visible area. */
const ZOOM_STEP = 2;
/** Limits so the buttons cannot zoom into a single building or out past Costa Rica. */
const MIN_DELTA = 0.002;
const MAX_DELTA = 4;

/** Zooms the map by changing the visible span around the current center. */
export function zoomMap(map: MapView | null, region: Region | null, factor: number) {
  if (!map || !region) return;
  const latitudeDelta = Math.min(MAX_DELTA, Math.max(MIN_DELTA, region.latitudeDelta * factor));
  const longitudeDelta = Math.min(MAX_DELTA, Math.max(MIN_DELTA, region.longitudeDelta * factor));
  map.animateToRegion({ ...region, latitudeDelta, longitudeDelta }, 250);
}

type MapZoomButtonsProps = {
  onZoomIn: () => void;
  onZoomOut: () => void;
  style?: StyleProp<ViewStyle>;
};

/** "+" and "−" buttons over a real map, for people who cannot (or prefer not to) pinch. */
export function MapZoomButtons({ onZoomIn, onZoomOut, style }: MapZoomButtonsProps) {
  return (
    <View style={[styles.container, style]}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Acercar mapa"
        onPress={onZoomIn}
        style={({ pressed }) => [styles.button, pressed ? styles.pressed : null]}
      >
        <Text style={styles.label}>+</Text>
      </Pressable>
      <View style={styles.divider} />
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Alejar mapa"
        onPress={onZoomOut}
        style={({ pressed }) => [styles.button, pressed ? styles.pressed : null]}
      >
        <Text style={styles.label}>−</Text>
      </Pressable>
    </View>
  );
}

/** Exported so each map can zoom in with ZOOM_STEP and out with its inverse. */
export const ZOOM_IN = 1 / ZOOM_STEP;
export const ZOOM_OUT = ZOOM_STEP;

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    right: 12,
    width: 40,
    borderRadius: radius.card,
    backgroundColor: palette.white,
    overflow: 'hidden',
    ...shadows.card,
  },
  button: {
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pressed: {
    opacity: 0.6,
  },
  label: {
    fontSize: 22,
    lineHeight: 24,
    color: colors.textPrimary,
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: colors.borderCard,
  },
});

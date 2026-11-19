import { Pressable, StyleSheet, Text, View, type StyleProp, type ViewStyle } from 'react-native';
import type MapView from 'react-native-maps';
import type { Region } from 'react-native-maps';
import Svg, { Circle, Path } from 'react-native-svg';

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

/** Bold crosshair for the "my location" button (no icon for it in the design). */
function LocateIcon() {
  return (
    <Svg width={26} height={26} viewBox="0 0 26 26" fill="none">
      <Circle cx={13} cy={13} r={7.5} stroke={palette.black} strokeWidth={2.6} />
      <Circle cx={13} cy={13} r={3.2} fill={palette.black} />
      <Path d="M13 1.5v4M13 20.5v4M1.5 13h4M20.5 13h4" stroke={palette.black} strokeWidth={2.6} strokeLinecap="round" />
    </Svg>
  );
}

type LocateButtonProps = {
  onPress: () => void;
  style?: StyleProp<ViewStyle>;
};

/** Round "my location" button at the bottom right of a map (as in Uber). */
export function LocateButton({ onPress, style }: LocateButtonProps) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel="Ir a mi ubicación"
      onPress={onPress}
      style={({ pressed }) => [styles.locate, style, pressed ? styles.pressed : null]}
    >
      <LocateIcon />
    </Pressable>
  );
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
  locate: {
    position: 'absolute',
    right: 16,
    width: 54,
    height: 54,
    borderRadius: 27,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: palette.white,
    boxShadow: '0px 3px 10px rgba(0, 0, 0, 0.22)',
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: colors.borderCard,
  },
});

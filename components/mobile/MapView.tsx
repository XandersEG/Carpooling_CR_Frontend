import type { ReactNode } from 'react';
import { Image, StyleSheet, Text, View, type StyleProp, type ViewStyle } from 'react-native';

import { colors, fonts, shadows } from '@/src/constants/theme';

const mapPlaceholder = require('@/assets/images/map-placeholder.jpg');

type MapViewProps = {
  /** Superposiciones (rutas dibujadas con react-native-svg, etiquetas, marcadores). */
  children?: ReactNode;
  style?: StyleProp<ViewStyle>;
};

/**
 * Mapa estático (decisión D3). Muestra la imagen de mapa del diseño; las rutas y
 * marcadores se dibujan encima como en Figma. Reemplazable por un mapa real sin
 * cambiar las pantallas.
 */
export function MapView({ children, style }: MapViewProps) {
  return (
    <View style={[styles.container, style]}>
      <Image
        source={mapPlaceholder}
        style={StyleSheet.absoluteFill}
        resizeMode="cover"
        accessibilityIgnoresInvertColors
      />
      {children}
    </View>
  );
}

type MapLabelProps = {
  text: string;
  style?: StyleProp<ViewStyle>;
};

/** Etiqueta blanca sobre el mapa ("San José", "Punto seleccionado"). */
export function MapLabel({ text, style }: MapLabelProps) {
  return (
    <View style={[styles.label, style]}>
      <Text style={styles.labelText}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
    backgroundColor: '#EDE9E2',
  },
  label: {
    position: 'absolute',
    paddingHorizontal: 10,
    paddingVertical: 6,
    backgroundColor: colors.background,
    borderRadius: 10,
    ...shadows.mapLabel,
  },
  labelText: {
    fontFamily: fonts.cairoRegular,
    fontSize: 12,
    color: colors.textPrimary,
  },
});

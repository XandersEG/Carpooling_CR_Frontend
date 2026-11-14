import { StyleSheet, Text, View, type StyleProp, type ViewStyle } from 'react-native';

import { colors, spacing, typography } from '@/src/constants/theme';

/** Punto verde de origen. */
export function OriginDot({ size = 8 }: { size?: number }) {
  return <View style={{ width: size, height: size, borderRadius: size / 2, backgroundColor: colors.primary }} />;
}

/** Cuadro negro de destino. */
export function DestinationSquare({ size = 8 }: { size?: number }) {
  return <View style={{ width: size, height: size, borderRadius: 2, backgroundColor: colors.textPrimary }} />;
}

type RouteProps = {
  origin: string;
  destination: string;
  style?: StyleProp<ViewStyle>;
};

/** Ruta en una línea: "● TEC Cartago → ■ San José" (Card viaje). */
export function RouteInline({ origin, destination, style }: RouteProps) {
  return (
    <View style={[styles.inline, style]}>
      <OriginDot />
      <Text style={styles.inlineText} numberOfLines={1}>
        {origin}
      </Text>
      <Text style={styles.arrow}>→</Text>
      <DestinationSquare />
      <Text style={styles.inlineText} numberOfLines={1}>
        {destination}
      </Text>
    </View>
  );
}

/** Ruta vertical con línea (bloque "Ruta y horario" de los detalles). */
export function RouteVertical({ origin, destination, style }: RouteProps) {
  return (
    <View style={[styles.vertical, style]}>
      <View style={styles.stop}>
        <OriginDot size={10} />
        <Text style={styles.stopText}>{origin}</Text>
      </View>
      <View style={styles.lineWrapper}>
        <View style={styles.line} />
      </View>
      <View style={styles.stop}>
        <DestinationSquare size={10} />
        <Text style={styles.stopText}>{destination}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  inline: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  inlineText: {
    ...typography.textSecondary,
    flexShrink: 1,
    color: colors.textPrimary,
  },
  arrow: {
    ...typography.textSecondary,
    color: colors.textSecondary,
  },
  vertical: {
    gap: spacing.xxs,
  },
  stop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  stopText: {
    ...typography.textStrong,
    color: colors.textPrimary,
  },
  lineWrapper: {
    paddingLeft: 4,
  },
  line: {
    width: 2,
    height: 14,
    backgroundColor: colors.routeLine,
  },
});

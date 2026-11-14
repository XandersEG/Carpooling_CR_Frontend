import { StyleSheet, Text, View, type StyleProp, type ViewStyle } from 'react-native';

import { colors, palette, radius, typography } from '@/src/constants/theme';

/**
 * Chip / etiqueta (radio/chip). Tonos observados en el diseño:
 * - `green`: hora, cupos, aprobado, verificado (#C9E5AE)
 * - `sage`: pendiente (#C9DAB9)
 * - `orange`: pago, cancelado, sin costo (#EDD3C5)
 * - `neutral`: instituciones en tablas (#E1E1E1)
 */
export type ChipTone = 'green' | 'sage' | 'orange' | 'neutral';

const toneBackground: Record<ChipTone, string> = {
  green: colors.surfaceGreenLight,
  sage: palette.sageLight,
  orange: colors.surfaceOrangeLight,
  neutral: palette.greyLight,
};

type ChipProps = {
  label: string;
  tone?: ChipTone;
  style?: StyleProp<ViewStyle>;
};

export function Chip({ label, tone = 'green', style }: ChipProps) {
  return (
    <View style={[styles.chip, { backgroundColor: toneBackground[tone] }, style]}>
      <Text style={styles.label} numberOfLines={1}>
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  chip: {
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: radius.chip,
  },
  label: {
    ...typography.textSmall,
    color: colors.textDark,
  },
});

import { Pressable, StyleSheet, Text, View, type StyleProp, type ViewStyle } from 'react-native';

import { colors, fonts, radius, spacing, typography } from '@/src/constants/theme';

type SearchSummaryProps = {
  origin: string;
  destination: string;
  /** "Hoy" */
  dateLabel: string;
  /** "6:30 a. m." */
  timeLabel: string;
  onEdit?: () => void;
  style?: StyleProp<ViewStyle>;
};

/** Componente "Resumen busqueda" (Figma 2461:2830). */
export function SearchSummary({ origin, destination, dateLabel, timeLabel, onEdit, style }: SearchSummaryProps) {
  return (
    <View style={[styles.container, style]}>
      <View style={styles.text}>
        <Text style={styles.route} numberOfLines={1}>
          {origin} → {destination}
        </Text>
        <Text style={styles.when}>
          {dateLabel} · {timeLabel}
        </Text>
      </View>
      {onEdit ? (
        <Pressable accessibilityRole="button" hitSlop={8} onPress={onEdit}>
          <Text style={styles.edit}>Editar</Text>
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.s,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.m,
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.borderSearch,
    borderRadius: radius.card,
  },
  text: {
    flex: 1,
    gap: 2,
  },
  route: {
    ...typography.textStrong,
    color: colors.textPrimary,
  },
  when: {
    ...typography.textSmall,
    color: colors.textSecondary,
  },
  edit: {
    fontFamily: fonts.bold,
    fontSize: 13,
    color: colors.accentGreen,
  },
});

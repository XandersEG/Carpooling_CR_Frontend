import type { ReactNode } from 'react';
import { Pressable, StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';

import { colors, radius, shadows, spacing } from '@/src/constants/theme';

type CardProps = {
  children: ReactNode;
  /** Separación vertical entre hijos. */
  gap?: number;
  onPress?: () => void;
  accessibilityLabel?: string;
  style?: StyleProp<ViewStyle>;
};

/** Tarjeta blanca con borde, radio/tarjeta y "Carpooling/Sombra tarjeta". */
export function Card({ children, gap = spacing.xxs, onPress, accessibilityLabel, style }: CardProps) {
  if (onPress) {
    return (
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={accessibilityLabel}
        onPress={onPress}
        style={({ pressed }) => [styles.card, { gap }, pressed ? styles.pressed : null, style]}
      >
        {children}
      </Pressable>
    );
  }

  return <View style={[styles.card, { gap }, style]}>{children}</View>;
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.borderCard,
    borderRadius: radius.card,
    paddingHorizontal: spacing.l,
    paddingVertical: spacing.m,
    ...shadows.card,
  },
  pressed: {
    opacity: 0.85,
  },
});

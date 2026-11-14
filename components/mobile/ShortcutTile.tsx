import type { FC } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import type { SvgProps } from 'react-native-svg';

import { colors, radius, typography } from '@/src/constants/theme';

type ShortcutTileProps = {
  label: string;
  Icon: FC<SvgProps>;
  onPress: () => void;
};

/** Componente "Atajo menu" (Figma 2467:2453). */
export function ShortcutTile({ label, Icon, onPress }: ShortcutTileProps) {
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [styles.tile, pressed ? styles.pressed : null]}
    >
      <View style={styles.iconCircle}>
        <Icon width={24} height={24} color={colors.textPrimary} />
      </View>
      <Text style={styles.label} numberOfLines={1}>
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  tile: {
    flex: 1,
    height: 84,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingHorizontal: 8,
    paddingVertical: 12,
    backgroundColor: colors.surfaceInput,
    borderRadius: radius.card,
  },
  pressed: {
    opacity: 0.8,
  },
  iconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surfaceGreenLight,
  },
  label: {
    ...typography.textStrong,
    textAlign: 'center',
    color: colors.textPrimary,
  },
});

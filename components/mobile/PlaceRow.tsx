import { Pressable, StyleSheet, Text, View } from 'react-native';

import { colors, typography } from '@/src/constants/theme';

import { IconLugar } from './icons';

type PlaceRowProps = {
  name: string;
  detail?: string;
  onPress?: () => void;
};

/** Componente "Lugar guardado" (Figma 2467:2454). */
export function PlaceRow({ name, detail, onPress }: PlaceRowProps) {
  return (
    <Pressable
      accessibilityRole="button"
      disabled={!onPress}
      onPress={onPress}
      style={({ pressed }) => [styles.row, pressed ? styles.pressed : null]}
    >
      <View style={styles.iconCircle}>
        <IconLugar width={24} height={24} color={colors.textPrimary} />
      </View>
      <View style={styles.text}>
        <Text style={styles.name}>{name}</Text>
        {detail ? <Text style={styles.detail}>{detail}</Text> : null}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    minHeight: 52,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 8,
  },
  pressed: {
    opacity: 0.7,
  },
  iconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surfaceGreenLight,
  },
  text: {
    flex: 1,
    gap: 2,
  },
  name: {
    ...typography.nameCard,
    color: colors.textPrimary,
  },
  detail: {
    ...typography.textSmall,
    color: colors.textSecondary,
  },
});

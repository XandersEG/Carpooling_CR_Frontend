import { router } from 'expo-router';
import { Pressable, StyleSheet } from 'react-native';

import { colors } from '@/src/constants/theme';

import { IconAtras } from './icons';

type BackButtonProps = {
  /** Por defecto vuelve a la pantalla anterior. */
  onPress?: () => void;
};

/** Componente "Boton atras": círculo de 36 px con flecha. */
export function BackButton({ onPress }: BackButtonProps) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel="Volver"
      hitSlop={8}
      onPress={onPress ?? (() => (router.canGoBack() ? router.back() : router.replace('/inicio')))}
      style={({ pressed }) => [styles.button, pressed ? styles.pressed : null]}
    >
      <IconAtras width={20} height={20} color={colors.textPrimary} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surfaceInput,
  },
  pressed: {
    opacity: 0.7,
  },
});

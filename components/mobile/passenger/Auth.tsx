import { ActivityIndicator, Pressable, StyleSheet, Text, type PressableProps } from 'react-native';

import { authColors, fonts, radius, typography } from '@/src/constants/theme';
import { useHover } from '@/src/hooks/useHover';

/**
 * Piezas de Inicio de sesión / Registro / Términos (Movil Punto 1).
 * Reestilizadas con los tokens de Punto 4–7 (D1); el botón principal se
 * mantiene café oscuro (D2).
 */

// Sin token: tono más claro del café de autenticación para hover/presionado.
const AUTH_BUTTON_PRESSED = '#5A4A4A';

type AuthButtonProps = Omit<PressableProps, 'children' | 'style'> & {
  title: string;
  loading?: boolean;
};

/** Botón principal café de las pantallas de autenticación. */
export function AuthButton({ title, loading = false, disabled, ...pressableProps }: AuthButtonProps) {
  const isDisabled = Boolean(disabled) || loading;
  const { hovered, hoverProps } = useHover();

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled: isDisabled, busy: loading }}
      disabled={isDisabled}
      {...hoverProps}
      {...pressableProps}
      style={({ pressed }) => [
        styles.button,
        hovered || pressed ? styles.buttonPressed : null,
        isDisabled ? styles.buttonDisabled : null,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={authColors.onButton} />
      ) : (
        <Text style={styles.buttonText} numberOfLines={1}>
          {title}
        </Text>
      )}
    </Pressable>
  );
}

type AuthLinkProps = {
  label: string;
  onPress: () => void;
};

/** Enlace subrayado en terracota ("Regístrate", "Términos y condiciones"). */
export function AuthLink({ label, onPress }: AuthLinkProps) {
  return (
    <Pressable accessibilityRole="link" hitSlop={8} onPress={onPress}>
      <Text style={styles.link}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    minHeight: 47,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingVertical: 13,
    backgroundColor: authColors.button,
    borderRadius: radius.button,
  },
  buttonPressed: {
    backgroundColor: AUTH_BUTTON_PRESSED,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    ...typography.buttonCost,
    color: authColors.onButton,
  },
  link: {
    fontFamily: fonts.cairoSemiBold,
    fontSize: 15,
    color: authColors.text,
    textDecorationLine: 'underline',
    textDecorationColor: authColors.accent,
  },
});

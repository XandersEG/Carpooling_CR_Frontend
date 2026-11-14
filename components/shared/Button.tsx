import type { ReactNode } from 'react';
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  View,
  type PressableProps,
  type StyleProp,
  type TextStyle,
  type ViewStyle,
} from 'react-native';

import { colors, palette, radius, typography } from '@/src/constants/theme';
import { useHover } from '@/src/hooks/useHover';

/**
 * Variantes de los botones de la página Tokens (Primario, Secundario, Terciario)
 * más dos variantes observadas en pantallas:
 * - `outline`: fondo blanco con borde (p. ej. "Cancelar" en "Viaje programado").
 * - `soft`: naranja claro (p. ej. "Sí, cancelar").
 */
export type ButtonVariant = 'primary' | 'secondary' | 'tertiary' | 'outline' | 'soft';

type VariantColors = {
  background: string;
  hover: string;
  disabled: string;
  text: string;
  disabledText: string;
  border?: string;
};

const variantColors: Record<ButtonVariant, VariantColors> = {
  primary: {
    background: palette.lime,
    hover: palette.limeMedium,
    disabled: palette.limeLight,
    text: palette.white,
    disabledText: colors.textDark,
  },
  secondary: {
    background: palette.terracotta,
    hover: palette.terracottaMedium,
    disabled: palette.terracottaLight,
    text: palette.white,
    disabledText: colors.textDark,
  },
  tertiary: {
    background: palette.brownDark,
    hover: palette.mauve,
    disabled: palette.mauveLight,
    text: palette.white,
    disabledText: palette.white,
  },
  outline: {
    background: palette.white,
    hover: '#F5F5F5',
    disabled: palette.white,
    text: colors.textPrimary,
    disabledText: colors.textPlaceholder,
    border: colors.borderCard,
  },
  soft: {
    background: palette.terracottaLight,
    hover: palette.terracottaMedium,
    disabled: palette.terracottaLight,
    text: colors.textDark,
    disabledText: colors.textPlaceholder,
  },
};

export type ButtonProps = Omit<PressableProps, 'children' | 'style'> & {
  title: string;
  variant?: ButtonVariant;
  /** `md`: botón CTA (47 px de alto). `sm`: botones compactos. */
  size?: 'md' | 'sm';
  icon?: ReactNode;
  iconPosition?: 'left' | 'right';
  loading?: boolean;
  fullWidth?: boolean;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
};

export function Button({
  title,
  variant = 'primary',
  size = 'md',
  icon,
  iconPosition = 'right',
  loading = false,
  fullWidth = false,
  disabled,
  style,
  textStyle,
  ...pressableProps
}: ButtonProps) {
  const scheme = variantColors[variant];
  const isDisabled = Boolean(disabled) || loading;
  const textColor = isDisabled ? scheme.disabledText : scheme.text;
  const { hovered, hoverProps } = useHover();

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled: isDisabled, busy: loading }}
      disabled={isDisabled}
      {...hoverProps}
      {...pressableProps}
      style={({ pressed }) => [
        styles.base,
        size === 'sm' ? styles.small : styles.medium,
        fullWidth ? styles.fullWidth : null,
        scheme.border ? { borderWidth: 1, borderColor: scheme.border } : null,
        {
          backgroundColor: isDisabled
            ? scheme.disabled
            : hovered || pressed
              ? scheme.hover
              : scheme.background,
        },
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={textColor} />
      ) : (
        <View style={styles.content}>
          {icon && iconPosition === 'left' ? icon : null}
          <Text
            style={[typography.buttonCost, size === 'sm' ? styles.smallText : null, { color: textColor }, textStyle]}
            numberOfLines={1}
          >
            {title}
          </Text>
          {icon && iconPosition === 'right' ? icon : null}
        </View>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radius.button,
  },
  medium: {
    minHeight: 47,
    paddingHorizontal: 20,
    paddingVertical: 13,
  },
  small: {
    minHeight: 36,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  smallText: {
    fontSize: 14,
  },
  fullWidth: {
    alignSelf: 'stretch',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
});

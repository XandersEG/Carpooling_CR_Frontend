import type { FC } from 'react';
import {
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  type StyleProp,
  type TextInputProps,
  type ViewStyle,
} from 'react-native';
import type { SvgProps } from 'react-native-svg';

import { colors, fonts, radius, spacing } from '@/src/constants/theme';

import { IconDestino, IconFecha, IconHorario, IconOrigen } from './icons';

export type SearchFieldKind = 'origen' | 'destino' | 'fecha' | 'horario';

const icons: Record<SearchFieldKind, FC<SvgProps>> = {
  origen: IconOrigen,
  destino: IconDestino,
  fecha: IconFecha,
  horario: IconHorario,
};

type SearchFieldProps = {
  kind: SearchFieldKind;
  value: string;
  placeholder?: string;
  /** Campo de solo selección (fecha u horario): abre un selector al tocarlo. */
  onPress?: () => void;
  /** Campo editable (origen o destino). */
  onChangeText?: (text: string) => void;
  inputProps?: Omit<TextInputProps, 'value' | 'onChangeText' | 'placeholder'>;
  style?: StyleProp<ViewStyle>;
};

/** Componente "Campo busqueda" (Figma 2461:2887). */
export function SearchField({ kind, value, placeholder, onPress, onChangeText, inputProps, style }: SearchFieldProps) {
  const Icon = icons[kind];

  if (onChangeText) {
    return (
      <Pressable style={[styles.field, style]} accessible={false}>
        <Icon width={16} height={16} color={colors.textPlaceholder} />
        <TextInput
          {...inputProps}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={colors.textPlaceholder}
          accessibilityLabel={placeholder ?? kind}
          style={styles.input}
        />
      </Pressable>
    );
  }

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={placeholder ?? kind}
      onPress={onPress}
      disabled={!onPress}
      style={({ pressed }) => [styles.field, pressed ? styles.pressed : null, style]}
    >
      <Icon width={16} height={16} color={colors.textPlaceholder} />
      <Text style={[styles.text, !value ? styles.placeholder : null]} numberOfLines={1}>
        {value || placeholder}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  field: {
    height: 34,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    paddingHorizontal: spacing.xl,
    backgroundColor: colors.surfaceInput,
    borderWidth: 1,
    borderColor: colors.borderInput,
    borderRadius: radius.input,
  },
  pressed: {
    opacity: 0.8,
  },
  text: {
    flex: 1,
    fontFamily: fonts.cairoRegular,
    fontSize: 14,
    color: colors.textPlaceholder,
  },
  placeholder: {
    opacity: 0.7,
  },
  input: {
    flex: 1,
    height: '100%',
    padding: 0,
    fontFamily: fonts.cairoRegular,
    fontSize: 14,
    color: colors.textPrimary,
    ...Platform.select({ web: { outlineWidth: 0 } }),
  },
});

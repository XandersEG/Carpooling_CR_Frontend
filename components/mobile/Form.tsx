import { useState, type ReactNode } from 'react';
import {
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
  type StyleProp,
  type TextInputProps,
  type ViewStyle,
} from 'react-native';

import { colors, fonts, radius, spacing, typography } from '@/src/constants/theme';

import { BottomSheet } from './BottomSheet';
import { IconChevronAbajo, IconOjo } from './icons';

/**
 * Campos de formulario de la app móvil (Registro, Mi Perfil, Datos del vehículo).
 * Reestilizados con los tokens de Movil Punto 4–7 (decisión D1).
 */

const FIELD_HEIGHT = 48;

type FieldLabelProps = { label: string; children: ReactNode; error?: string; style?: StyleProp<ViewStyle> };

/** Etiqueta + control + mensaje de error. */
export function FieldWrapper({ label, children, error, style }: FieldLabelProps) {
  return (
    <View style={[styles.field, style]}>
      <Text style={styles.label}>{label}</Text>
      {children}
      {error ? <Text style={styles.error}>{error}</Text> : null}
    </View>
  );
}

type FormFieldProps = TextInputProps & {
  label: string;
  error?: string;
  /** Agrega el botón de ojo para mostrar/ocultar la contraseña. */
  password?: boolean;
  rightElement?: ReactNode;
  containerStyle?: StyleProp<ViewStyle>;
};

export function FormField({
  label,
  error,
  password = false,
  rightElement,
  containerStyle,
  editable = true,
  style,
  ...inputProps
}: FormFieldProps) {
  const [visible, setVisible] = useState(false);

  return (
    <FieldWrapper label={label} error={error} style={containerStyle}>
      <View style={[styles.input, !editable ? styles.inputReadOnly : null, error ? styles.inputError : null]}>
        <TextInput
          {...inputProps}
          editable={editable}
          secureTextEntry={password && !visible}
          accessibilityLabel={label}
          placeholderTextColor={colors.textPlaceholder}
          style={[styles.textInput, style]}
        />
        {password ? (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={visible ? 'Ocultar contraseña' : 'Mostrar contraseña'}
            hitSlop={8}
            onPress={() => setVisible((current) => !current)}
          >
            <IconOjo width={20} height={20} color={colors.textPlaceholder} />
          </Pressable>
        ) : null}
        {rightElement}
      </View>
    </FieldWrapper>
  );
}

export type SelectOption<T extends string> = { value: T; label: string };

type SelectFieldProps<T extends string> = {
  label: string;
  value: T | null;
  options: SelectOption<T>[];
  onChange: (value: T) => void;
  placeholder?: string;
  error?: string;
  containerStyle?: StyleProp<ViewStyle>;
};

/** Lista desplegable ("Género", "Color del vehículo"). Abre las opciones en un panel inferior. */
export function SelectField<T extends string>({
  label,
  value,
  options,
  onChange,
  placeholder = 'Seleccionar',
  error,
  containerStyle,
}: SelectFieldProps<T>) {
  const [open, setOpen] = useState(false);
  const selected = options.find((option) => option.value === value);

  return (
    <FieldWrapper label={label} error={error} style={containerStyle}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`${label}: ${selected?.label ?? placeholder}`}
        onPress={() => setOpen(true)}
        style={[styles.input, error ? styles.inputError : null]}
      >
        <Text style={[styles.textInput, styles.selectText, !selected ? styles.placeholder : null]} numberOfLines={1}>
          {selected?.label ?? placeholder}
        </Text>
        <IconChevronAbajo width={13.5} height={8.7} color={colors.textPrimary} />
      </Pressable>
      <BottomSheet visible={open} onClose={() => setOpen(false)}>
        <View style={styles.sheet}>
          <Text style={styles.sheetTitle}>{label}</Text>
          <ScrollView style={styles.sheetList}>
            {options.map((option) => {
              const active = option.value === value;
              return (
                <Pressable
                  key={option.value}
                  accessibilityRole="button"
                  accessibilityState={{ selected: active }}
                  onPress={() => {
                    onChange(option.value);
                    setOpen(false);
                  }}
                  style={[styles.option, active ? styles.optionActive : null]}
                >
                  <Text style={[styles.optionText, active ? styles.optionTextActive : null]}>{option.label}</Text>
                </Pressable>
              );
            })}
          </ScrollView>
        </View>
      </BottomSheet>
    </FieldWrapper>
  );
}

type StepperProps = {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  /** Texto debajo del valor ("Máximo permitido: 4 pasajeros"). */
  hint?: string;
  style?: StyleProp<ViewStyle>;
};

/** Contador "− n +" (capacidad de pasajeros). */
export function Stepper({ value, onChange, min = 1, max = Number.POSITIVE_INFINITY, hint, style }: StepperProps) {
  return (
    <View style={[styles.stepper, style]}>
      <View style={styles.stepperRow}>
        <StepperButton label="−" accessibilityLabel="Restar" disabled={value <= min} onPress={() => onChange(value - 1)} />
        <Text style={styles.stepperValue}>{value}</Text>
        <StepperButton label="+" accessibilityLabel="Sumar" disabled={value >= max} onPress={() => onChange(value + 1)} />
      </View>
      {hint ? <Text style={styles.stepperHint}>{hint}</Text> : null}
    </View>
  );
}

function StepperButton({
  label,
  accessibilityLabel,
  disabled,
  onPress,
}: {
  label: string;
  accessibilityLabel: string;
  disabled: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      accessibilityState={{ disabled }}
      disabled={disabled}
      onPress={onPress}
      style={[styles.stepperButton, disabled ? styles.stepperButtonDisabled : null]}
    >
      <Text style={styles.stepperButtonText}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  field: {
    gap: spacing.xxs,
  },
  label: {
    fontFamily: fonts.cairoSemiBold,
    fontSize: 14,
    color: colors.textDark,
  },
  error: {
    ...typography.textSmall,
    color: colors.error,
  },
  input: {
    height: FIELD_HEIGHT,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    paddingHorizontal: spacing.xl,
    backgroundColor: colors.surfaceInput,
    borderWidth: 1,
    borderColor: colors.borderInput,
    borderRadius: radius.input,
  },
  inputReadOnly: {
    opacity: 0.75,
  },
  inputError: {
    borderColor: colors.error,
  },
  textInput: {
    flex: 1,
    height: '100%',
    padding: 0,
    fontFamily: fonts.cairoRegular,
    fontSize: 15,
    color: colors.textPrimary,
    ...Platform.select({ web: { outlineWidth: 0 } }),
  },
  selectText: {
    height: 'auto',
  },
  placeholder: {
    color: colors.textPlaceholder,
  },
  sheet: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 28,
    gap: 12,
  },
  sheetTitle: {
    ...typography.nameHighlight,
    color: colors.textPrimary,
  },
  sheetList: {
    maxHeight: 360,
  },
  option: {
    paddingHorizontal: spacing.l,
    paddingVertical: spacing.m,
    borderRadius: radius.input,
  },
  optionActive: {
    backgroundColor: colors.surfaceGreenLight,
  },
  optionText: {
    fontFamily: fonts.cairoRegular,
    fontSize: 15,
    color: colors.textPrimary,
  },
  optionTextActive: {
    fontFamily: fonts.cairoSemiBold,
  },
  stepper: {
    alignItems: 'center',
    gap: spacing.xs,
  },
  stepperRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 32,
  },
  stepperButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surfaceInput,
  },
  stepperButtonDisabled: {
    opacity: 0.4,
  },
  stepperButtonText: {
    fontFamily: fonts.bold,
    fontSize: 20,
    color: colors.textPrimary,
  },
  stepperValue: {
    fontFamily: fonts.bold,
    fontSize: 28,
    minWidth: 32,
    textAlign: 'center',
    color: colors.textPrimary,
  },
  stepperHint: {
    ...typography.textSmall,
    color: colors.textSecondary,
  },
});

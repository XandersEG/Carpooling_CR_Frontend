import { useState, type ReactNode } from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
  type StyleProp,
  type TextInputProps,
  type TextStyle,
  type ViewStyle,
} from 'react-native';

import { IconArrowDown, IconCheckSmall, IconChevronDown } from '@/components/web/icons';
import { webExtra } from '@/components/web/tokens';
import { fonts, palette, radius, webColors } from '@/src/constants/theme';
import { useHover } from '@/src/hooks/useHover';

// ── Círculo con iniciales ────────────────────────────────────────────────────

type InitialsCircleProps = {
  initials: string;
  size: number;
  fontSize: number;
  backgroundColor: string;
  color?: string;
};

/** Avatar de iniciales del portal (Cairo Bold, a diferencia del Avatar móvil). */
export function InitialsCircle({ initials, size, fontSize, backgroundColor, color = webColors.headerText }: InitialsCircleProps) {
  return (
    <View style={[styles.circle, { width: size, height: size, borderRadius: size / 2, backgroundColor }]}>
      <Text style={{ fontFamily: fonts.cairoBold, fontSize, color }}>{initials}</Text>
    </View>
  );
}

// ── Botón redondeado (modales y acciones) ────────────────────────────────────

export type RoundButtonTone = 'primary' | 'cancel' | 'danger';

const roundTone: Record<RoundButtonTone, { background: string; hover: string; text: string }> = {
  primary: { background: palette.lime, hover: palette.limeMedium, text: webExtra.textMuted },
  cancel: { background: webExtra.cancel, hover: palette.greyLight, text: webExtra.textMuted },
  danger: { background: palette.terracotta, hover: palette.terracottaMedium, text: palette.white },
};

type RoundButtonProps = {
  label: string;
  onPress: () => void;
  tone?: RoundButtonTone;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
};

/** Botones "Cancelar" / "Guardar cambios" / "Eliminar" de los modales (radio 45, alto 41). */
export function RoundButton({ label, onPress, tone = 'primary', disabled = false, style }: RoundButtonProps) {
  const { hovered, hoverProps } = useHover();
  const scheme = roundTone[tone];
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled }}
      disabled={disabled}
      onPress={onPress}
      {...hoverProps}
      style={[
        styles.roundButton,
        { backgroundColor: hovered && !disabled ? scheme.hover : scheme.background },
        disabled && styles.disabled,
        style,
      ]}
    >
      <Text style={[styles.roundButtonText, { color: scheme.text }]}>{label}</Text>
    </Pressable>
  );
}

// ── Pastilla de estado (Parámetros) ──────────────────────────────────────────

/** "Activo" verde con punto (diseño). "Inactivo" no está diseñado: se usa naranja claro. */
export function StatusPill({ active }: { active: boolean }) {
  return (
    <View style={[styles.statusPill, active ? styles.statusActive : styles.statusInactive]}>
      <View style={[styles.statusDot, { backgroundColor: active ? palette.lime : palette.terracotta }]} />
      <Text style={styles.statusText}>{active ? 'Activo' : 'Inactivo'}</Text>
    </View>
  );
}

// ── Select con menú desplegable ──────────────────────────────────────────────

export type SelectVariant = 'filter' | 'modal' | 'pill';

type SelectFieldProps = {
  value: string;
  options: string[];
  onChange: (value: string) => void;
  variant?: SelectVariant;
  placeholder?: string;
  disabled?: boolean;
  width?: number | `${number}%`;
  accessibilityLabel?: string;
  style?: StyleProp<ViewStyle>;
};

/**
 * Select del portal. El menú replica el overlay `Menú Plegable` (2055:2086):
 * lista blanca con borde café de 1.5 px y opciones Cairo SemiBold 20.
 * Variantes: `filter` (Instituciones 2050:1810), `modal` (campo "Catálogo") y
 * `pill` ("Todos los estados").
 */
export function SelectField({
  value,
  options,
  onChange,
  variant = 'filter',
  placeholder,
  disabled = false,
  width,
  accessibilityLabel,
  style,
}: SelectFieldProps) {
  const [open, setOpen] = useState(false);
  const triggerStyle = selectTrigger[variant];
  const textStyle = selectText[variant];
  const isPlaceholder = !value && Boolean(placeholder);

  return (
    <View style={[styles.selectWrapper, open && styles.selectWrapperOpen, width !== undefined && { width }, style]}>
      <Pressable
        accessibilityRole="combobox"
        accessibilityLabel={accessibilityLabel}
        accessibilityState={{ expanded: open, disabled }}
        disabled={disabled}
        onPress={() => setOpen((current) => !current)}
        style={[triggerStyle, open && variant === 'filter' && styles.selectTriggerOpen, disabled && styles.disabled]}
      >
        <Text style={[textStyle, isPlaceholder && styles.placeholder]} numberOfLines={1}>
          {isPlaceholder ? placeholder : value}
        </Text>
        {variant === 'filter' ? (
          <IconChevronDown color={palette.black} />
        ) : (
          <IconArrowDown color={variant === 'modal' ? palette.greyDark : webExtra.border} />
        )}
      </Pressable>
      {open ? (
        <View style={[styles.menu, { top: variant === 'filter' ? 47 : 43 }]}>
          {options.map((option) => (
            <SelectOption
              key={option}
              label={option}
              selected={option === value}
              onPress={() => {
                setOpen(false);
                onChange(option);
              }}
            />
          ))}
        </View>
      ) : null}
    </View>
  );
}

function SelectOption({ label, selected, onPress }: { label: string; selected: boolean; onPress: () => void }) {
  const { hovered, hoverProps } = useHover();
  return (
    <Pressable
      accessibilityRole="menuitem"
      accessibilityState={{ selected }}
      onPress={onPress}
      {...hoverProps}
      style={[styles.option, hovered && styles.optionHover]}
    >
      <Text style={styles.optionText} numberOfLines={1}>
        {label}
      </Text>
    </Pressable>
  );
}

// ── Interruptor (Switch "Estado") ────────────────────────────────────────────

type WebSwitchProps = {
  value: boolean;
  onValueChange: (value: boolean) => void;
  accessibilityLabel?: string;
};

/** Switch Material 3 de los modales de Parámetros (52 × 32). El estado apagado no está diseñado. */
export function WebSwitch({ value, onValueChange, accessibilityLabel }: WebSwitchProps) {
  return (
    <Pressable
      accessibilityRole="switch"
      accessibilityLabel={accessibilityLabel}
      accessibilityState={{ checked: value }}
      onPress={() => onValueChange(!value)}
      style={[styles.switchTrack, value ? styles.switchOn : styles.switchOff]}
    >
      <View style={[styles.switchThumb, value ? styles.switchThumbOn : styles.switchThumbOff]} />
    </Pressable>
  );
}

// ── Casillas ─────────────────────────────────────────────────────────────────

/** Casilla verde marcada (columna "Validación", instancia `Checkboxes` 2920:6155). */
export function CheckedBox() {
  return (
    <View style={styles.checkedBox} accessibilityLabel="Validada">
      <View style={styles.checkedFill} />
      <View style={styles.checkIcon}>
        <IconCheckSmall />
      </View>
    </View>
  );
}

type CheckboxProps = {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: string;
  labelStyle?: StyleProp<TextStyle>;
};

/** Casilla "Recordarme" (16 px, borde malva). El estado marcado no está diseñado. */
export function Checkbox({ checked, onChange, label, labelStyle }: CheckboxProps) {
  return (
    <Pressable
      accessibilityRole="checkbox"
      accessibilityState={{ checked }}
      onPress={() => onChange(!checked)}
      style={styles.checkboxRow}
    >
      <View style={[styles.checkbox, checked && styles.checkboxChecked]}>
        {checked ? (
          <View style={styles.checkboxIcon}>
            <IconCheckSmall width={16} height={16} />
          </View>
        ) : null}
      </View>
      <Text style={labelStyle}>{label}</Text>
    </Pressable>
  );
}

// ── Campo de formulario de los modales ───────────────────────────────────────

type ModalFieldProps = Omit<TextInputProps, 'style'> & {
  label: string;
  style?: StyleProp<ViewStyle>;
  children?: ReactNode;
};

/** Etiqueta Cairo Bold 15 + campo gris (radio 8, alto 41) de los modales. */
export function ModalField({ label, style, children, ...inputProps }: ModalFieldProps) {
  return (
    <View style={[styles.modalField, style]}>
      <Text style={styles.modalLabel}>{label}</Text>
      {children ?? (
        <TextInput placeholderTextColor={webExtra.border} {...inputProps} style={styles.modalInput} />
      )}
    </View>
  );
}

export function ModalLabel({ children }: { children: string }) {
  return <Text style={styles.modalLabel}>{children}</Text>;
}

const selectTrigger = StyleSheet.create({
  filter: {
    height: 45,
    borderRadius: radius.webControl,
    borderWidth: 2,
    borderColor: palette.grey,
    backgroundColor: palette.white,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingLeft: 9,
    paddingRight: 12,
    gap: 8,
  },
  modal: {
    height: 41,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: webExtra.border,
    backgroundColor: webExtra.fieldBackground,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingLeft: 12,
    paddingRight: 7,
  },
  pill: {
    height: 41,
    borderRadius: 45,
    borderWidth: 1,
    borderColor: webExtra.border,
    backgroundColor: webExtra.fieldBackground,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingLeft: 36,
    paddingRight: 10,
    gap: 8,
  },
});

const selectText = StyleSheet.create({
  filter: { fontFamily: fonts.cairoSemiBold, fontSize: 20, color: webColors.headerText, flexShrink: 1 },
  modal: { fontFamily: fonts.cairoMedium, fontSize: 16, color: webExtra.fieldText, flexShrink: 1 },
  pill: { fontFamily: fonts.cairoMedium, fontSize: 20, color: webExtra.fieldText, flexShrink: 1 },
});

const styles = StyleSheet.create({
  circle: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  disabled: {
    opacity: 0.6,
  },
  roundButton: {
    height: 41,
    borderRadius: 45,
    paddingHorizontal: 25,
    alignItems: 'center',
    justifyContent: 'center',
  },
  roundButtonText: {
    fontFamily: fonts.cairoSemiBold,
    fontSize: 16,
  },
  statusPill: {
    width: 127,
    height: 41,
    borderRadius: 45,
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 14,
    gap: 15,
  },
  statusActive: {
    backgroundColor: palette.limeMedium,
    borderColor: palette.lime,
  },
  statusInactive: {
    backgroundColor: palette.terracottaLight,
    borderColor: palette.terracotta,
  },
  statusDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  statusText: {
    fontFamily: fonts.cairoSemiBold,
    fontSize: 16,
    color: webExtra.textMuted,
  },
  selectWrapper: {
    position: 'relative',
  },
  selectWrapperOpen: {
    zIndex: 50,
  },
  selectTriggerOpen: {
    borderColor: palette.sage,
  },
  placeholder: {
    color: palette.grey,
  },
  menu: {
    position: 'absolute',
    left: 0,
    minWidth: '100%',
    backgroundColor: palette.white,
    borderWidth: 1.5,
    borderColor: webColors.headerText,
    zIndex: 60,
  },
  option: {
    height: 36,
    justifyContent: 'center',
    paddingLeft: 23,
    paddingRight: 16,
    backgroundColor: palette.white,
  },
  optionHover: {
    backgroundColor: webExtra.fieldBackground,
  },
  optionText: {
    fontFamily: fonts.cairoSemiBold,
    fontSize: 20,
    color: webColors.headerText,
  },
  switchTrack: {
    width: 52,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  switchOn: {
    backgroundColor: palette.lime,
    alignItems: 'flex-end',
  },
  switchOff: {
    backgroundColor: palette.greyLight,
    borderWidth: 2,
    borderColor: palette.greyMedium,
    alignItems: 'flex-start',
  },
  switchThumb: {
    borderRadius: 12,
  },
  switchThumbOn: {
    width: 24,
    height: 24,
    backgroundColor: palette.white,
  },
  switchThumbOff: {
    width: 16,
    height: 16,
    marginLeft: 2,
    backgroundColor: palette.greyMedium,
  },
  checkedBox: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkedFill: {
    width: 18,
    height: 18,
    borderRadius: 2,
    backgroundColor: palette.sage,
  },
  checkIcon: {
    position: 'absolute',
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
  },
  checkbox: {
    width: 16,
    height: 16,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: palette.mauveLight,
    backgroundColor: palette.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxChecked: {
    backgroundColor: palette.sage,
    borderColor: palette.sage,
  },
  checkboxIcon: {
    position: 'absolute',
  },
  modalField: {
    gap: 6,
  },
  modalLabel: {
    fontFamily: fonts.cairoBold,
    fontSize: 15,
    color: webColors.headerText,
  },
  modalInput: {
    height: 41,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: webExtra.border,
    backgroundColor: webExtra.fieldBackground,
    paddingHorizontal: 12,
    fontFamily: fonts.cairoMedium,
    fontSize: 16,
    color: webExtra.fieldText,
  },
});

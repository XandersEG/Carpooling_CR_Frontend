import type { FC } from 'react';
import { Pressable, StyleSheet, Text, View, type StyleProp, type ViewStyle } from 'react-native';
import type { SvgProps } from 'react-native-svg';

import { IconRolConductor, IconRolPasajero } from '@/components/mobile/icons';
import { authColors, colors, fonts, palette, radius, spacing } from '@/src/constants/theme';
import type { Role } from '@/src/types/user';

type RoleOption = {
  value: Role;
  label: string;
  Icon: FC<SvgProps>;
  iconSize: { width: number; height: number };
};

const OPTIONS: RoleOption[] = [
  { value: 'conductor', label: 'Conductor', Icon: IconRolConductor, iconSize: { width: 15.5, height: 12.6254 } },
  { value: 'pasajero', label: 'Pasajero', Icon: IconRolPasajero, iconSize: { width: 10.6667, height: 11.75 } },
];

// Sin token: gris del botón de rol no seleccionado en Registro (Figma 2806:3266).
const AUTH_ROLE_INACTIVE = '#D1D1D1';

type RoleToggleProps = {
  value: Role[];
  onChange: (roles: Role[]) => void;
  /**
   * `auth`: café oscuro como en Registro (paleta de autenticación, D2).
   * `app`: verde primario de Punto 4–7 (Mi Perfil reestilizado, D1).
   */
  tone?: 'auth' | 'app';
  style?: StyleProp<ViewStyle>;
};

/**
 * Botones de rol "Conductor" / "Pasajero" (Registro y Mi Perfil). Selección
 * múltiple: un usuario puede tener ambos roles.
 */
export function RoleToggle({ value, onChange, tone = 'auth', style }: RoleToggleProps) {
  function toggle(role: Role) {
    onChange(value.includes(role) ? value.filter((item) => item !== role) : [...value, role]);
  }

  return (
    <View style={[styles.row, style]}>
      {OPTIONS.map(({ value: role, label, Icon, iconSize }) => {
        const selected = value.includes(role);
        const scheme = tone === 'auth' ? authScheme : appScheme;
        const textColor = selected ? scheme.activeText : scheme.inactiveText;
        return (
          <Pressable
            key={role}
            accessibilityRole="checkbox"
            accessibilityLabel={label}
            accessibilityState={{ checked: selected }}
            onPress={() => toggle(role)}
            style={({ pressed }) => [
              styles.pill,
              tone === 'auth' ? styles.pillAuth : styles.pillApp,
              { backgroundColor: selected ? scheme.active : scheme.inactive },
              tone === 'app' && selected ? styles.pillAppActive : null,
              pressed ? styles.pressed : null,
            ]}
          >
            <Icon {...iconSize} color={textColor} />
            <Text style={[styles.label, { color: textColor }]}>{label}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const authScheme = {
  active: authColors.button,
  inactive: AUTH_ROLE_INACTIVE,
  activeText: palette.white,
  inactiveText: palette.black,
};

const appScheme = {
  active: colors.primary,
  inactive: colors.surfaceInput,
  activeText: colors.onPrimary,
  inactiveText: colors.textSecondary,
};

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: spacing.xl,
  },
  pill: {
    minWidth: 125,
    height: 31,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.s,
    paddingHorizontal: spacing.xl,
    borderRadius: radius.input,
  },
  pillAuth: {
    borderWidth: 1,
    borderColor: palette.black,
    boxShadow: '0px 4px 2px rgba(0, 0, 0, 0.25)',
  },
  pillApp: {
    height: 36,
    borderWidth: 1,
    borderColor: colors.borderInput,
  },
  pillAppActive: {
    borderColor: colors.primary,
  },
  pressed: {
    opacity: 0.85,
  },
  label: {
    fontFamily: fonts.cairoBold,
    fontSize: 14,
  },
});

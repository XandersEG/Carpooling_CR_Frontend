import type { ReactNode } from 'react';
import { Pressable, StyleSheet, Text, View, type StyleProp, type ViewStyle } from 'react-native';

import { colors, fonts, palette, radius, spacing, typography } from '@/src/constants/theme';

/** Piezas compartidas por los pasos del asistente "Publicar Viaje" (Movil Punto 3). */

export type PublishStep = 'vehiculo' | 'ruta' | 'horario' | 'pago' | 'confirmar';

export const PUBLISH_STEPS: { value: PublishStep; label: string }[] = [
  { value: 'vehiculo', label: 'Vehículo' },
  { value: 'ruta', label: 'Ruta' },
  { value: 'horario', label: 'Horario' },
  { value: 'pago', label: 'Pago' },
  { value: 'confirmar', label: 'Confirmar' },
];

type StepTabsProps = {
  value: PublishStep;
  onChange: (step: PublishStep) => void;
};

/** Pestañas de pasos ("Botón vehículo" ×5). Se puede saltar a cualquier paso. */
export function StepTabs({ value, onChange }: StepTabsProps) {
  return (
    <View accessibilityRole="tablist" style={styles.tabs}>
      {PUBLISH_STEPS.map((step) => {
        const active = step.value === value;
        return (
          <Pressable
            key={step.value}
            accessibilityRole="tab"
            accessibilityState={{ selected: active }}
            onPress={() => onChange(step.value)}
            style={[styles.tab, active ? styles.tabActive : null]}
          >
            <Text style={[styles.tabText, active ? styles.tabTextActive : null]} numberOfLines={1}>
              {step.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

type SectionTitleProps = {
  title: string;
  subtitle?: string;
  style?: StyleProp<ViewStyle>;
};

/** Título de sección del paso ("Mis vehículos", "Ruta", "Costo"…) con subtítulo. */
export function SectionTitle({ title, subtitle, style }: SectionTitleProps) {
  return (
    <View style={[styles.section, style]}>
      <Text accessibilityRole="header" style={styles.sectionTitle}>
        {title}
      </Text>
      {subtitle ? <Text style={styles.sectionSubtitle}>{subtitle}</Text> : null}
    </View>
  );
}

/** Tarjeta con borde gris que agrupa campos ("Campo busqueda", contador, métodos de pago). */
export function FieldGroup({ children, style }: { children: ReactNode; style?: StyleProp<ViewStyle> }) {
  return <View style={[styles.group, style]}>{children}</View>;
}

type PaymentMethodIconProps = { kind: 'efectivo' | 'sinpe' | 'gratuito' | 'otro' };

/**
 * Íconos de "Método de pago" (2538:8651). En Figma están dibujados con
 * rectángulos y un círculo (no hay vector exportable), así que se reproducen con
 * vistas en el verde de acento.
 */
export function PaymentMethodIcon({ kind }: PaymentMethodIconProps) {
  if (kind === 'efectivo') {
    return (
      <View style={styles.iconSlot}>
        <View style={styles.bill}>
          <View style={styles.billCoin} />
        </View>
      </View>
    );
  }
  if (kind === 'sinpe') {
    return (
      <View style={styles.iconSlot}>
        <View style={styles.phone}>
          <View style={styles.phoneScreen} />
        </View>
      </View>
    );
  }
  return <View style={styles.iconSlot} />;
}

const styles = StyleSheet.create({
  tabs: {
    flexDirection: 'row',
    paddingHorizontal: spacing.screen,
  },
  tab: {
    flex: 1,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 2,
    backgroundColor: palette.grey,
    borderTopLeftRadius: radius.card,
    borderTopRightRadius: radius.card,
  },
  tabActive: {
    backgroundColor: colors.surfaceGreenLight,
  },
  tabText: {
    fontFamily: fonts.semiBold,
    fontSize: 11,
    color: colors.textDark,
  },
  tabTextActive: {
    fontFamily: fonts.bold,
    color: colors.textPrimary,
  },
  section: {
    gap: 2,
  },
  sectionTitle: {
    ...typography.screenTitle,
    color: colors.textTitle,
  },
  sectionSubtitle: {
    ...typography.subtitle,
    color: colors.textSubtitle,
  },
  group: {
    gap: 7,
    paddingTop: 15,
    paddingBottom: spacing.s,
    paddingHorizontal: spacing.m,
    backgroundColor: palette.white,
    borderWidth: 1,
    borderColor: colors.borderSearch,
    borderRadius: radius.card,
  },
  iconSlot: {
    width: 44,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bill: {
    width: 44,
    height: 26,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.accentGreen,
  },
  billCoin: {
    width: 14,
    height: 14,
    borderRadius: 7,
    borderWidth: 1,
    borderColor: colors.accentGreen,
  },
  phone: {
    width: 25,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.accentGreen,
  },
  phoneScreen: {
    width: 21,
    height: 28,
    backgroundColor: palette.white,
  },
});

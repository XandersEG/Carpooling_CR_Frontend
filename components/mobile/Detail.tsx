import type { ReactNode } from 'react';
import { StyleSheet, Text, View, type StyleProp, type ViewStyle } from 'react-native';

import { Avatar } from '@/components/shared/Avatar';
import { Card } from '@/components/shared/Card';
import { Chip, type ChipTone } from '@/components/shared/Chip';
import { colors, radius, spacing, typography } from '@/src/constants/theme';

/**
 * Bloques de "Detalle del viaje" (Figma 2448:2822), reutilizados en "Resumen
 * del viaje", "Historial" y "Viaje finalizado/cancelado".
 */

type DetailCardProps = {
  /** Título opcional del bloque (p. ej. "Toyota Corolla"). */
  title?: string;
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
};

export function DetailCard({ title, children, style }: DetailCardProps) {
  return (
    <Card gap={spacing.xxs} style={style}>
      {title ? <Text style={styles.cardTitle}>{title}</Text> : null}
      {children}
    </Card>
  );
}

type DetailRowProps = {
  label: string;
  value?: string;
  /** Valor como elemento (p. ej. un Chip de estado). */
  valueElement?: ReactNode;
};

/** Fila etiqueta/valor ("Placa … ABC-123"). */
export function DetailRow({ label, value, valueElement }: DetailRowProps) {
  return (
    <View style={styles.row}>
      <Text style={styles.label}>{label}</Text>
      {valueElement ?? <Text style={styles.value}>{value}</Text>}
    </View>
  );
}

export function DetailDivider() {
  return <View style={styles.divider} />;
}

type PersonCardProps = {
  name: string;
  /** "Conductora · Verificada TEC" */
  badge?: string;
  badgeTone?: ChipTone;
  style?: StyleProp<ViewStyle>;
};

/** Bloque "Conductor": avatar de 44 px, nombre destacado y chip de verificación. */
export function PersonCard({ name, badge, badgeTone = 'green', style }: PersonCardProps) {
  return (
    <Card style={[styles.person, style]}>
      <Avatar name={name} size={44} />
      <View style={styles.personText}>
        <Text style={styles.personName}>{name}</Text>
        {badge ? <Chip label={badge} tone={badgeTone} style={styles.badge} /> : null}
      </View>
    </Card>
  );
}

type NoticeBoxProps = {
  text: string;
  style?: StyleProp<ViewStyle>;
};

/** Aviso naranja claro ("El pago se realiza directamente con el conductor…"). */
export function NoticeBox({ text, style }: NoticeBoxProps) {
  return (
    <View style={[styles.notice, style]}>
      <Text style={styles.noticeText}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  cardTitle: {
    ...typography.nameCard,
    color: colors.textPrimary,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.s,
  },
  label: {
    ...typography.textSecondary,
    color: colors.textSecondary,
  },
  value: {
    ...typography.textStrong,
    flexShrink: 1,
    textAlign: 'right',
    color: colors.textPrimary,
  },
  divider: {
    height: 1,
    backgroundColor: colors.borderCard,
  },
  person: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.m,
  },
  personText: {
    flex: 1,
    gap: 4,
  },
  personName: {
    ...typography.nameHighlight,
    color: colors.textPrimary,
  },
  badge: {
    paddingVertical: 3,
  },
  notice: {
    paddingHorizontal: spacing.l,
    paddingVertical: spacing.xs,
    backgroundColor: colors.surfaceOrangeLight,
    borderRadius: radius.chip,
  },
  noticeText: {
    ...typography.textSmall,
    color: colors.textDark,
  },
});

import type { ReactNode } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { Screen } from '@/components/mobile/Screen';
import { ScreenHeader } from '@/components/mobile/ScreenHeader';
import { Button } from '@/components/shared/Button';
import { colors, fonts, palette, radius, spacing } from '@/src/constants/theme';

import { IconCancelar, IconResultadoCheck } from './icons';

export type ResultKind = 'success' | 'cancelled';

/** "Icono resultado" (2642:3892) y "Icono cancelar" (2642:4006): círculo de 72 px. */
export function ResultIcon({ kind }: { kind: ResultKind }) {
  const success = kind === 'success';
  return (
    <View
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
      style={[styles.icon, { backgroundColor: success ? colors.primary : colors.surfaceOrangeLight }]}
    >
      {success ? (
        <IconResultadoCheck width={36} height={36} color={palette.white} />
      ) : (
        <IconCancelar width={36} height={36} color={colors.textDark} />
      )}
    </View>
  );
}

type ResultScreenProps = {
  kind: ResultKind;
  /** Título del encabezado ("Viaje finalizado"). Sin título no se muestra encabezado. */
  headerTitle?: string;
  title: string;
  subtitle?: string;
  /** Resumen debajo del mensaje (p. ej. `DetailCard`). */
  children?: ReactNode;
  /** Botón inferior ("Volver al inicio"). */
  actionLabel?: string;
  onAction?: () => void;
};

/**
 * Pantalla de resultado: "Confirmado" (2649:3473), "Viaje finalizado"
 * (2642:3884) y "Viaje cancelado" (2642:3920).
 */
export function ResultScreen({
  kind,
  headerTitle,
  title,
  subtitle,
  children,
  actionLabel,
  onAction,
}: ResultScreenProps) {
  return (
    <Screen
      scroll
      header={headerTitle ? <ScreenHeader title={headerTitle} /> : undefined}
      contentStyle={[styles.content, !headerTitle ? styles.contentNoHeader : null]}
      footer={
        actionLabel && onAction ? (
          <Button
            title={actionLabel}
            onPress={onAction}
            fullWidth
            style={styles.action}
            textStyle={styles.actionText}
          />
        ) : undefined
      }
    >
      <ResultIcon kind={kind} />
      <View style={styles.message}>
        <Text accessibilityRole="header" style={styles.title}>
          {title}
        </Text>
        {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
      </View>
      {children ? <View style={styles.summary}>{children}</View> : null}
    </Screen>
  );
}

const styles = StyleSheet.create({
  icon: {
    width: 72,
    height: 72,
    borderRadius: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    alignItems: 'center',
    gap: spacing.l,
  },
  contentNoHeader: {
    paddingTop: 140,
  },
  message: {
    alignSelf: 'stretch',
    gap: 4,
  },
  title: {
    fontFamily: fonts.bold,
    fontSize: 22,
    textAlign: 'center',
    color: colors.textPrimary,
  },
  subtitle: {
    fontFamily: fonts.regular,
    fontSize: 14,
    textAlign: 'center',
    color: colors.textSecondary,
  },
  summary: {
    alignSelf: 'stretch',
  },
  action: {
    minHeight: 48,
    borderRadius: radius.segment,
  },
  actionText: {
    fontFamily: fonts.bold,
    fontSize: 15,
  },
});

import type { ReactNode } from 'react';
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';

import { Button, type ButtonVariant } from '@/components/shared/Button';
import { colors, fonts, palette, radius, shadows, spacing } from '@/src/constants/theme';

/** Radio de los botones del diálogo "Cancelar viaje" (2642:4012). */
const DIALOG_BUTTON_RADIUS = radius.segment;

type ConfirmDialogProps = {
  visible: boolean;
  /** Ícono dentro del círculo superior (p. ej. `IconCancelar`). */
  icon: ReactNode;
  /** Fondo del círculo del ícono. Por defecto naranja claro, como en el diseño. */
  iconBackground?: string;
  title: string;
  message: string;
  /** Segundo párrafo en negrita (p. ej. "Esta acción no se puede deshacer"). */
  note?: string;
  cancelLabel: string;
  confirmLabel: string;
  confirmVariant?: ButtonVariant;
  /** Muestra un indicador en el botón de confirmar mientras se procesa la acción. */
  loading?: boolean;
  onCancel: () => void;
  onConfirm: () => void;
};

/**
 * Diálogo de confirmación móvil con el estilo de Movil Punto 6 ("¿Cancelar
 * viaje?", Figma 2642:3953): tarjeta blanca, ícono circular, título, texto y dos
 * botones. Se usa también para eliminar y activar vehículos, que en Punto 2/3
 * tenían otro estilo (design-system.md §7, inconsistencia 5).
 */
export function ConfirmDialog({
  visible,
  icon,
  iconBackground = colors.surfaceOrangeLight,
  title,
  message,
  note,
  cancelLabel,
  confirmLabel,
  confirmVariant = 'soft',
  loading = false,
  onCancel,
  onConfirm,
}: ConfirmDialogProps) {
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onCancel}>
      <View style={styles.root}>
        <Pressable accessibilityLabel={cancelLabel} style={styles.scrim} onPress={loading ? undefined : onCancel} />
        <View accessibilityRole="alert" style={styles.card}>
          <View style={[styles.iconCircle, { backgroundColor: iconBackground }]}>{icon}</View>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.message}>{message}</Text>
          {note ? <Text style={styles.note}>{note}</Text> : null}
          <View style={styles.buttons}>
            <Button
              title={cancelLabel}
              variant="outline"
              disabled={loading}
              onPress={onCancel}
              style={styles.button}
              textStyle={styles.buttonText}
            />
            <Button
              title={confirmLabel}
              variant={confirmVariant}
              loading={loading}
              onPress={onConfirm}
              style={styles.button}
              textStyle={styles.buttonText}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.screen,
  },
  scrim: {
    ...StyleSheet.absoluteFill,
    backgroundColor: colors.scrim,
  },
  card: {
    width: '100%',
    maxWidth: 340,
    alignItems: 'center',
    gap: spacing.l,
    paddingTop: 24,
    paddingHorizontal: 20,
    paddingBottom: 20,
    backgroundColor: palette.white,
    borderRadius: 20,
    ...shadows.dialog,
  },
  iconCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  title: {
    fontFamily: fonts.bold,
    fontSize: 20,
    textAlign: 'center',
    color: colors.textPrimary,
  },
  message: {
    fontFamily: fonts.regular,
    fontSize: 14,
    textAlign: 'center',
    color: colors.textSecondary,
  },
  note: {
    fontFamily: fonts.bold,
    fontSize: 14,
    textAlign: 'center',
    color: colors.textDark,
  },
  buttons: {
    alignSelf: 'stretch',
    flexDirection: 'row',
    gap: spacing.s,
  },
  button: {
    flex: 1,
    minHeight: 48,
    paddingHorizontal: spacing.s,
    borderRadius: DIALOG_BUTTON_RADIUS,
  },
  buttonText: {
    fontFamily: fonts.bold,
    fontSize: 15,
  },
});

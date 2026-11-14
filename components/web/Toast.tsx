import { useEffect, type ReactNode } from 'react';
import { Pressable, StyleSheet, Text, View, type ViewStyle } from 'react-native';

import { IconClose, IconNotifications } from '@/components/web/icons';
import { webExtra } from '@/components/web/tokens';
import { fonts, palette, webColors } from '@/src/constants/theme';

/** Tiempo visible de los avisos que se cierran solos (no definido en Figma). */
export const TOAST_DURATION_MS = 4000;

/** Oculta un aviso después de `TOAST_DURATION_MS`. */
export function useAutoDismiss(visible: boolean, onDismiss: () => void) {
  useEffect(() => {
    if (!visible) return undefined;
    const timer = setTimeout(onDismiss, TOAST_DURATION_MS);
    return () => clearTimeout(timer);
  }, [visible, onDismiss]);
}

// react-native-web acepta `position: fixed`; el tipo de RN no lo incluye.
const FIXED = { position: 'fixed' } as unknown as ViewStyle;

type DarkToastProps = {
  visible: boolean;
  onClose: () => void;
  children: ReactNode;
};

/**
 * Aviso oscuro de Instituciones (270:1942): campana grande, texto centrado y
 * botón ✕. Se fija en la esquina inferior derecha de la ventana.
 */
export function DarkToast({ visible, onClose, children }: DarkToastProps) {
  if (!visible) return null;
  return (
    <View style={[FIXED, styles.darkToast]} accessibilityRole="alert">
      <IconNotifications color={palette.greyLight} />
      <View style={styles.darkToastBody}>{children}</View>
      <Pressable accessibilityRole="button" accessibilityLabel="Cerrar aviso" onPress={onClose} style={styles.close}>
        <IconClose color={palette.greyLight} />
      </Pressable>
    </View>
  );
}

/** Texto del aviso oscuro: Cairo Black con partes en Bold. */
export function DarkToastText({ children }: { children: ReactNode }) {
  return <Text style={styles.darkToastText}>{children}</Text>;
}

export const darkToastStyles = StyleSheet.create({
  regular: { fontFamily: fonts.cairoBold },
});

type PillToastProps = {
  visible: boolean;
  message: string;
  style?: ViewStyle;
};

/** Aviso verde de Parámetros ("«SINPE Móvil» se eliminó correctamente", 2950:11914). */
export function PillToast({ visible, message, style }: PillToastProps) {
  if (!visible) return null;
  return (
    <View style={[styles.pillToast, style]} accessibilityRole="alert">
      <View style={styles.pillDot} />
      <Text style={styles.pillText}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  darkToast: {
    right: 35,
    bottom: 23,
    width: 544,
    minHeight: 148,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: palette.black,
    backgroundColor: webColors.modalHeader,
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 4,
    paddingRight: 14,
    zIndex: 100,
  },
  darkToastBody: {
    flex: 1,
    paddingVertical: 16,
  },
  darkToastText: {
    fontFamily: fonts.cairoBlack,
    fontSize: 22,
    lineHeight: 41,
    color: webColors.sidebarText,
    textAlign: 'center',
  },
  close: {
    alignSelf: 'flex-start',
    marginTop: 8,
  },
  pillToast: {
    alignSelf: 'center',
    height: 41,
    borderRadius: 45,
    borderWidth: 1,
    borderColor: palette.lime,
    backgroundColor: palette.limeMedium,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 18,
    gap: 14,
  },
  pillDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: palette.lime,
  },
  pillText: {
    fontFamily: fonts.cairoMedium,
    fontSize: 15,
    color: webExtra.textMuted,
  },
});

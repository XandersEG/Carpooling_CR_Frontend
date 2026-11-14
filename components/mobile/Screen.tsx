import type { ReactNode } from 'react';
import { ScrollView, StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { colors, spacing } from '@/src/constants/theme';

type ScreenProps = {
  children: ReactNode;
  /** Encabezado fijo (normalmente `ScreenHeader`). */
  header?: ReactNode;
  /** Contenido fijo al pie, sobre la barra de pestañas (p. ej. botón CTA). */
  footer?: ReactNode;
  /** Envuelve el contenido en un ScrollView con margen de pantalla. */
  scroll?: boolean;
  contentStyle?: StyleProp<ViewStyle>;
  backgroundColor?: string;
};

/**
 * Contenedor base de las pantallas móviles. La barra de pestañas la agrega el
 * layout `(main)`, por eso aquí solo se respeta el área segura superior.
 */
export function Screen({
  children,
  header,
  footer,
  scroll = false,
  contentStyle,
  backgroundColor = colors.background,
}: ScreenProps) {
  return (
    <SafeAreaView edges={['top']} style={[styles.safeArea, { backgroundColor }]}>
      {header}
      {scroll ? (
        <ScrollView
          style={styles.flex}
          contentContainerStyle={[styles.scrollContent, contentStyle]}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {children}
        </ScrollView>
      ) : (
        <View style={[styles.flex, contentStyle]}>{children}</View>
      )}
      {footer ? <View style={styles.footer}>{footer}</View> : null}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  flex: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: spacing.screen,
    paddingBottom: spacing.xl * 2,
    gap: spacing.xs,
  },
  footer: {
    paddingHorizontal: spacing.screen,
    paddingVertical: spacing.m,
  },
});

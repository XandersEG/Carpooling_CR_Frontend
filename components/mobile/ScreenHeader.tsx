import type { ReactNode } from 'react';
import { StyleSheet, Text, View, type StyleProp, type ViewStyle } from 'react-native';

import { colors, spacing, typography } from '@/src/constants/theme';

import { BackButton } from './BackButton';

type ScreenHeaderProps = {
  title: string;
  /** Oculta el botón atrás (pantallas principales de pestaña). */
  showBack?: boolean;
  onBack?: () => void;
  /** Elemento a la derecha del título (p. ej. pastilla "Solicitudes"). */
  right?: ReactNode;
  /** Contenido debajo del título (p. ej. chip de estado "Por iniciar"). */
  children?: ReactNode;
  centered?: boolean;
  style?: StyleProp<ViewStyle>;
};

/** Encabezado de pantalla: botón atrás + "Carpooling/Titulo pantalla". */
export function ScreenHeader({
  title,
  showBack = true,
  onBack,
  right,
  children,
  centered = false,
  style,
}: ScreenHeaderProps) {
  return (
    <View style={[styles.container, style]}>
      <View style={[styles.row, centered ? styles.centered : null]}>
        {showBack ? <BackButton onPress={onBack} /> : null}
        <Text
          accessibilityRole="header"
          style={[styles.title, centered ? styles.titleCentered : null]}
        >
          {title}
        </Text>
        {right ? <View style={styles.right}>{right}</View> : null}
      </View>
      {children ? <View style={[styles.below, showBack ? styles.belowIndented : null]}>{children}</View> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: spacing.screen,
    paddingTop: 19,
    paddingBottom: spacing.xl,
    gap: spacing.s,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.s,
  },
  centered: {
    justifyContent: 'center',
  },
  title: {
    ...typography.screenTitle,
    flexShrink: 1,
    color: colors.textTitle,
  },
  titleCentered: {
    textAlign: 'center',
  },
  right: {
    marginLeft: 'auto',
  },
  below: {
    flexDirection: 'row',
    gap: spacing.xs,
  },
  belowIndented: {
    paddingLeft: 36 + spacing.s,
  },
});

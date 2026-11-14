import { ActivityIndicator, StyleSheet, Text, View, type StyleProp, type ViewStyle } from 'react-native';

import { colors, spacing, typography } from '@/src/constants/theme';

type LoadStateProps = {
  loading: boolean;
  error?: string | null;
  style?: StyleProp<ViewStyle>;
};

/**
 * Estado de carga mínimo mientras responden los servicios (sin diseño en
 * Figma; los estados vacíos y de error se diseñarán en la Fase 5).
 */
export function LoadState({ loading, error, style }: LoadStateProps) {
  return (
    <View style={[styles.container, style]}>
      {loading ? <ActivityIndicator color={colors.primary} /> : null}
      {!loading && error ? <Text style={styles.error}>{error}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.screen,
  },
  error: {
    ...typography.textSecondary,
    textAlign: 'center',
    color: colors.textSecondary,
  },
});

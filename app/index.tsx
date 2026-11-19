import { Redirect } from 'expo-router';
import { ActivityIndicator, Platform, StyleSheet, View } from 'react-native';

import { colors } from '@/src/constants/theme';
import { useSession } from '@/src/hooks/useSession';

/**
 * Punto de entrada: el navegador va al portal administrativo; la app móvil va
 * al inicio si ya hay una sesión guardada en el teléfono, o al inicio de sesión.
 */
export default function Index() {
  const { ready, signedIn } = useSession();

  if (Platform.OS === 'web') return <Redirect href="/admin/login" />;

  if (!ready) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator color={colors.primary} />
      </View>
    );
  }

  return <Redirect href={signedIn ? '/inicio' : '/login'} />;
}

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.background,
  },
});

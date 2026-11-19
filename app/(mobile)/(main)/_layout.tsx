import { Redirect, Stack } from 'expo-router';
import { ActivityIndicator, StyleSheet, View } from 'react-native';

import { TabBar } from '@/components/mobile/TabBar';
import { colors } from '@/src/constants/theme';
import { useSession } from '@/src/hooks/useSession';

/**
 * Pantallas de la app con sesión iniciada. En el diseño la barra de pestañas
 * aparece en todas ellas (incluidos los detalles), por eso es permanente y la
 * navegación entre pantallas es una pila.
 *
 * Sin sesión (nunca se inició, se cerró o el Backend la dio por vencida) se
 * vuelve al inicio de sesión.
 */
export default function MainLayout() {
  const { ready, signedIn } = useSession();

  if (!ready) {
    return (
      <View style={[styles.container, styles.loading]}>
        <ActivityIndicator color={colors.primary} />
      </View>
    );
  }

  if (!signedIn) return <Redirect href="/login" />;

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        {/* ios_from_right: smoother slide on Android (iOS already slides this way) */}
        <Stack
          screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: colors.background },
            animation: 'ios_from_right',
          }}
        />
      </View>
      <TabBar />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  loading: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flex: 1,
  },
});

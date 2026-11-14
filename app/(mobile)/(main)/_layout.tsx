import { Stack } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { TabBar } from '@/components/mobile/TabBar';
import { colors } from '@/src/constants/theme';

/**
 * Pantallas de la app con sesión iniciada. En el diseño la barra de pestañas
 * aparece en todas ellas (incluidos los detalles), por eso es permanente y la
 * navegación entre pantallas es una pila.
 */
export default function MainLayout() {
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: colors.background } }} />
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
  content: {
    flex: 1,
  },
});

import { Redirect, Stack } from 'expo-router';
import { Platform } from 'react-native';

/**
 * Páginas del portal web administrativo. Solo están disponibles en el navegador.
 */
export default function WebLayout() {
  if (Platform.OS !== 'web') {
    return <Redirect href="/login" />;
  }

  return <Stack screenOptions={{ headerShown: false }} />;
}

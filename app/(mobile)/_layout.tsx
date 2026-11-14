import { Redirect, Stack } from 'expo-router';
import { Platform } from 'react-native';

/** Permite ver la app móvil en una compilación web (vista previa o demostración). */
const MOBILE_WEB_PREVIEW = process.env.EXPO_PUBLIC_MOBILE_WEB_PREVIEW === 'true';

/**
 * Páginas de la app móvil.
 *
 * En la versión web publicada estas rutas redirigen al portal administrativo.
 * Durante el desarrollo (`npx expo start --web`) o con
 * `EXPO_PUBLIC_MOBILE_WEB_PREVIEW=true` se permiten en el navegador.
 */
export default function MobileLayout() {
  if (Platform.OS === 'web' && !__DEV__ && !MOBILE_WEB_PREVIEW) {
    return <Redirect href="/admin/login" />;
  }

  return <Stack screenOptions={{ headerShown: false }} />;
}

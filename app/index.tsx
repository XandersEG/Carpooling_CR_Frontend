import { Redirect } from 'expo-router';
import { Platform } from 'react-native';

/**
 * Punto de entrada: la app móvil inicia en el inicio de sesión de usuarios y
 * el navegador en el portal administrativo.
 */
export default function Index() {
  return <Redirect href={Platform.OS === 'web' ? '/admin/login' : '/login'} />;
}

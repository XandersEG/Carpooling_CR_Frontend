import { Redirect } from 'expo-router';

import { LoginScreen } from '@/src/features/admin/screens/LoginScreen';
import { INICIO_DEL_PORTAL, leerSesion } from '@/src/features/admin/session';

// inicio de sesión del portal; con una sesión abierta entra directo
export default function AdminLogin() {
  return leerSesion() ? <Redirect href={INICIO_DEL_PORTAL} /> : <LoginScreen />;
}

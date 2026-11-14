import { Redirect } from 'expo-router';

/** `/admin` lleva al inicio de sesión (que redirige al portal si ya hay sesión). */
export default function AdminIndex() {
  return <Redirect href="/admin/login" />;
}

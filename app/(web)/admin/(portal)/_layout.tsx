import { Redirect, Slot, useRouter } from 'expo-router';

import { AdminShell } from '@/components/web/AdminShell';
import { getAdminSession, logoutAdmin } from '@/src/services/admin/adminAuthService';

/** Portal autenticado: requiere sesión de administrador (simulada). */
export default function PortalLayout() {
  const router = useRouter();
  const session = getAdminSession();

  if (!session) {
    return <Redirect href="/admin/login" />;
  }

  return (
    <AdminShell
      userName={session.displayName}
      userRole={session.role}
      onLogout={() => {
        logoutAdmin();
        router.replace('/admin/login');
      }}
    >
      <Slot />
    </AdminShell>
  );
}

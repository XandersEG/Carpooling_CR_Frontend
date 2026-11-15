import { Redirect, Slot, usePathname } from 'expo-router';
import type { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';

import { Screen } from '@/components/admin/Screen';
import { Sidebar } from '@/components/admin/Sidebar';
import { AdminHeaderProvider, useAdminHeaderState } from '@/components/web/PageHeader';
import { leerSesion } from '@/src/features/admin/session';

// las secciones de análisis son de otro grupo y definen su encabezado con useAdminHeader
const RUTAS_DE_ANALISIS = ['/admin/consultas', '/admin/estadisticas'];

// les pone a esas secciones el encabezado del portal, con el título que ellas mismas definen
function MarcoDeAnalisis({ children }: { children: ReactNode }) {
  const { title, subtitle, actions } = useAdminHeaderState();
  return (
    <Screen
      title={Array.isArray(title) ? title.join(' > ') : title}
      subtitle={subtitle ?? ''}
      action={actions}
      sinRelleno
    >
      {children}
    </Screen>
  );
}

// protege las pantallas del portal y les pone la barra lateral.  
export default function PortalLayout() {
  const ruta = usePathname();
  if (!leerSesion()) {
    return <Redirect href="/admin/login" />;
  }
  const esAnalisis = RUTAS_DE_ANALISIS.some((inicio) => ruta.startsWith(inicio));

  return (
    <View style={styles.portal}>
      <Sidebar />
      <View style={styles.pantalla}>
        {esAnalisis ? (
          <AdminHeaderProvider>
            <MarcoDeAnalisis>
              <Slot />
            </MarcoDeAnalisis>
          </AdminHeaderProvider>
        ) : (
          <Slot />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  portal: {
    flex: 1,
    flexDirection: 'row',
  },
  pantalla: {
    flex: 1,
  },
});

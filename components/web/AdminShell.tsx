import type { ReactNode } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';

import { AdminHeader } from '@/components/web/AdminHeader';
import { DesktopViewport } from '@/components/web/DesktopViewport';
import { AdminHeaderProvider } from '@/components/web/PageHeader';
import { Sidebar } from '@/components/web/Sidebar';
import { webColors } from '@/src/constants/theme';

type AdminShellProps = {
  userName: string;
  userRole: string;
  onLogout: () => void;
  children: ReactNode;
};

/**
 * Estructura común del portal autenticado (decisión D5): menú lateral de
 * 366 px, encabezado blanco de 126 px y área de contenido salvia con scroll
 * vertical. Las páginas definen su encabezado con `useAdminHeader`.
 */
export function AdminShell({ userName, userRole, onLogout, children }: AdminShellProps) {
  return (
    <AdminHeaderProvider>
      <DesktopViewport>
        <View style={styles.row}>
          <Sidebar onLogout={onLogout} />
          <View style={styles.main}>
            <AdminHeader userName={userName} userRole={userRole} />
            <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
              {children}
            </ScrollView>
          </View>
        </View>
      </DesktopViewport>
    </AdminHeaderProvider>
  );
}

const styles = StyleSheet.create({
  row: {
    flex: 1,
    flexDirection: 'row',
  },
  main: {
    flex: 1,
  },
  content: {
    flex: 1,
    backgroundColor: webColors.contentBackground,
  },
  contentContainer: {
    flexGrow: 1,
  },
});

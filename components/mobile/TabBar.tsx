import { router, usePathname, type Href } from 'expo-router';
import type { FC } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import type { SvgProps } from 'react-native-svg';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { colors, palette, typography } from '@/src/constants/theme';

import { IconTabHistorial, IconTabMenu, IconTabPerfil, IconTabPublicar } from './icons';

type TabItem = {
  key: string;
  label: string;
  href: Href;
  Icon: FC<SvgProps>;
  iconSize: { width: number; height: number };
  /** Rutas (prefijos) que marcan la pestaña como activa. */
  matches: string[];
};

const TABS: TabItem[] = [
  {
    key: 'menu',
    label: 'Menú',
    href: '/inicio',
    Icon: IconTabMenu,
    iconSize: { width: 16, height: 18.5 },
    matches: ['/inicio', '/buscar', '/resultados', '/viaje/', '/recogida', '/mis-viajes'],
  },
  {
    key: 'publicar',
    label: 'Publicar',
    href: '/publicar',
    Icon: IconTabPublicar,
    iconSize: { width: 24, height: 24 },
    matches: ['/publicar', '/solicitudes', '/viaje-conductor'],
  },
  {
    key: 'historial',
    label: 'Historial',
    href: '/historial',
    Icon: IconTabHistorial,
    iconSize: { width: 16, height: 18.5 },
    matches: ['/historial'],
  },
  {
    key: 'perfil',
    label: 'Perfil',
    href: '/perfil',
    Icon: IconTabPerfil,
    iconSize: { width: 14.4, height: 18.24 },
    matches: ['/perfil', '/vehiculos'],
  },
];

/**
 * Barra de pestañas inferior ("navbar" en Figma).
 *
 * El diseño usa las fuentes 42dot Sans / ABeeZee por accidente; aquí se usa
 * DM Sans (docs/design/design-system.md §7).
 */
export function TabBar() {
  const pathname = usePathname();
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingBottom: Math.max(insets.bottom, 13) }]}>
      <View style={styles.bar}>
        {TABS.map(({ key, label, href, Icon, iconSize, matches }) => {
          const active = matches.some((prefix) => pathname.startsWith(prefix));
          const color = active ? colors.textTitle : colors.tabInactive;

          return (
            <Pressable
              key={key}
              accessibilityRole="tab"
              accessibilityLabel={label}
              accessibilityState={{ selected: active }}
              onPress={() => router.navigate(href)}
              style={styles.tab}
            >
              <View style={styles.icon}>
                <Icon {...iconSize} color={color} />
              </View>
              <Text style={[styles.label, { color }]}>{label}</Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: palette.white,
    paddingTop: 9,
    alignItems: 'center',
    boxShadow: 'inset 0px 0.5px 0.5px rgba(0, 0, 0, 0.25)',
  },
  bar: {
    width: 340,
    maxWidth: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    paddingHorizontal: 21,
  },
  tab: {
    minWidth: 48,
    alignItems: 'center',
  },
  icon: {
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    ...typography.tabLabel,
    lineHeight: 16,
  },
});

import { usePathname, useRouter, type Href } from 'expo-router';
import type { FC } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import type { SvgProps } from 'react-native-svg';

import {
  IconLogoSidebar,
  IconNavCerrarSesion,
  IconNavConsultas,
  IconNavEstadisticas,
  IconNavInstituciones,
  IconNavParametros,
  IconNavUsuarios,
} from '@/components/web/icons';
import { webExtra } from '@/components/web/tokens';
import { fonts, layout, palette, radius, webColors } from '@/src/constants/theme';
import { useHover } from '@/src/hooks/useHover';

type NavItem = {
  label: string;
  href: Href;
  /** Prefijo de la ruta que marca el ítem como activo. */
  match: string;
  Icon: FC<SvgProps>;
  iconColor?: string;
};

// Componente `Menu lateral` (316:1561): secciones Análisis y Gestión.
const ANALYSIS_ITEMS: NavItem[] = [
  { label: 'Consultas generales', href: '/admin/consultas/top-conductores', match: '/admin/consultas', Icon: IconNavConsultas },
  // El ícono de Estadísticas viene en un gris distinto en el diseño.
  { label: 'Estadísticas', href: '/admin/estadisticas', match: '/admin/estadisticas', Icon: IconNavEstadisticas, iconColor: webExtra.lightGrey },
];

const MANAGEMENT_ITEMS: NavItem[] = [
  { label: 'Instituciones', href: '/admin/instituciones', match: '/admin/instituciones', Icon: IconNavInstituciones },
  { label: 'Usuarios', href: '/admin/usuarios', match: '/admin/usuarios', Icon: IconNavUsuarios },
  { label: 'Parámetros', href: '/admin/parametros/metodos-pago', match: '/admin/parametros', Icon: IconNavParametros },
];

type SidebarItemProps = {
  label: string;
  Icon: FC<SvgProps>;
  iconColor?: string;
  active?: boolean;
  onPress: () => void;
};

/** Ítem del menú: estados Default, Hover (malva) y Click/activo (malva con borde lima). */
function SidebarItem({ label, Icon, iconColor, active = false, onPress }: SidebarItemProps) {
  const { hovered, hoverProps } = useHover();
  const highlighted = active || hovered;

  return (
    <Pressable
      accessibilityRole="link"
      accessibilityState={{ selected: active }}
      onPress={onPress}
      {...hoverProps}
      style={[styles.item, highlighted && styles.itemHighlighted, active && styles.itemActive]}
    >
      <View style={styles.itemIcon}>
        <Icon color={iconColor ?? webColors.sidebarText} />
      </View>
      <Text style={[styles.itemLabel, hovered && !active && styles.itemLabelHover]} numberOfLines={1}>
        {label}
      </Text>
    </Pressable>
  );
}

type SidebarProps = {
  onLogout: () => void;
};

/** Menú lateral del portal administrativo (decisión D5: un solo shell). */
export function Sidebar({ onLogout }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();

  const renderItem = (item: NavItem) => (
    <SidebarItem
      key={item.label}
      label={item.label}
      Icon={item.Icon}
      iconColor={item.iconColor}
      active={pathname.startsWith(item.match)}
      onPress={() => router.push(item.href)}
    />
  );

  return (
    <View style={styles.sidebar}>
      <View style={styles.logo}>
        <IconLogoSidebar />
      </View>
      <Text style={styles.portalTitle}>Portal administrativo</Text>

      <Text style={[styles.section, styles.sectionAnalysis]}>Análisis</Text>
      <View style={styles.items}>{ANALYSIS_ITEMS.map(renderItem)}</View>

      <Text style={[styles.section, styles.sectionManagement]}>Gestión</Text>
      <View style={styles.items}>{MANAGEMENT_ITEMS.map(renderItem)}</View>

      <View style={styles.spacer} />
      <SidebarItem label="Cerrar sesión" Icon={IconNavCerrarSesion} onPress={onLogout} />
    </View>
  );
}

const styles = StyleSheet.create({
  sidebar: {
    width: layout.webSidebarWidth,
    height: '100%',
    backgroundColor: webColors.sidebar,
    paddingTop: 27,
    paddingBottom: 37,
    paddingHorizontal: 31,
  },
  logo: {
    alignSelf: 'flex-start',
  },
  portalTitle: {
    fontFamily: fonts.cairoExtraBold,
    fontSize: 24,
    color: webColors.sidebarText,
    marginTop: 29,
  },
  section: {
    fontSize: 20,
    color: webColors.sidebarText,
    marginLeft: -6,
  },
  sectionAnalysis: {
    fontFamily: fonts.cairoBold,
    marginTop: 31,
  },
  sectionManagement: {
    fontFamily: fonts.cairoExtraBold,
    marginTop: 37,
  },
  items: {
    marginTop: 4,
    gap: 22,
  },
  item: {
    height: 40,
    borderRadius: radius.webControl,
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 26,
    borderWidth: 2,
    borderColor: 'transparent',
    backgroundColor: webColors.sidebar,
  },
  itemHighlighted: {
    backgroundColor: webColors.sidebarActive,
  },
  itemActive: {
    borderColor: webColors.sidebarActiveBorder,
  },
  itemIcon: {
    width: 21,
    height: 23,
    alignItems: 'center',
    justifyContent: 'center',
  },
  itemLabel: {
    fontFamily: fonts.cairoBold,
    fontSize: 20,
    color: webColors.sidebarText,
    marginLeft: 19,
  },
  itemLabelHover: {
    color: palette.white,
  },
  spacer: {
    flex: 1,
  },
});

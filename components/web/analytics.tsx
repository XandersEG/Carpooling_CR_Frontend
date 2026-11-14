import { useRouter } from 'expo-router';
import type { FC, ReactNode } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import type { SvgProps } from 'react-native-svg';

import {
  IconTabCoins,
  IconTabList,
  IconTabPin,
  IconTabTrophy,
  IconTabUserPlus,
  IconTabUsers,
} from '@/components/web/icons';
import { webExtra, webShadow } from '@/components/web/tokens';
import { fonts, palette, radius, webColors } from '@/src/constants/theme';
import { useHover } from '@/src/hooks/useHover';

// ── Pestañas numeradas de Consultas generales ────────────────────────────────

export type ConsultaTab =
  | 'top-conductores'
  | 'puntos-concurrentes'
  | 'usuarios-activos'
  | 'listado-viajes'
  | 'monto-promedio'
  | 'usuarios-nuevos';

export const CONSULTA_TABS: { key: ConsultaTab; label: string; Icon: FC<SvgProps> }[] = [
  { key: 'top-conductores', label: 'Top Conductores', Icon: IconTabTrophy },
  { key: 'puntos-concurrentes', label: 'Puntos concurrentes', Icon: IconTabPin },
  { key: 'usuarios-activos', label: 'Usuarios activos', Icon: IconTabUsers },
  { key: 'listado-viajes', label: 'Listado de viajes', Icon: IconTabList },
  { key: 'monto-promedio', label: 'Monto promedio', Icon: IconTabCoins },
  { key: 'usuarios-nuevos', label: 'Usuarios nuevos', Icon: IconTabUserPlus },
];

export function isConsultaTab(value: string | undefined): value is ConsultaTab {
  return CONSULTA_TABS.some((tab) => tab.key === value);
}

type TabPillProps = {
  index: number;
  label: string;
  Icon: FC<SvgProps>;
  active: boolean;
  onPress: () => void;
};

/** Pestaña numerada (componentes 285:963…285:1718, estados Default / Hover / Click). */
function TabPill({ index, label, Icon, active, onPress }: TabPillProps) {
  const { hovered, hoverProps } = useHover();
  const color = active ? webExtra.textMuted : palette.grey;
  return (
    <Pressable
      accessibilityRole="tab"
      accessibilityState={{ selected: active }}
      onPress={onPress}
      {...hoverProps}
      style={[
        styles.tab,
        { backgroundColor: active ? palette.limeMedium : hovered ? palette.limeLight : palette.white },
      ]}
    >
      <View style={[styles.tabNumber, { backgroundColor: active ? palette.sage : palette.greyLight }]}>
        <Text style={[styles.tabNumberText, { color: active ? palette.white : palette.grey }]}>{index}</Text>
      </View>
      <View style={styles.tabIcon}>
        <Icon color={color} />
      </View>
      <Text style={[styles.tabLabel, { color }]} numberOfLines={1}>
        {label}
      </Text>
    </Pressable>
  );
}

export function ConsultaTabs({ active }: { active: ConsultaTab }) {
  const router = useRouter();
  return (
    <View style={styles.tabs} accessibilityRole="tablist">
      {CONSULTA_TABS.map((tab, index) => (
        <TabPill
          key={tab.key}
          index={index + 1}
          label={tab.label}
          Icon={tab.Icon}
          active={tab.key === active}
          onPress={() => router.replace(`/admin/consultas/${tab.key}`)}
        />
      ))}
    </View>
  );
}

// ── Tarjeta de resultados ────────────────────────────────────────────────────

type ResultsCardProps = {
  title: string;
  subtitle: string;
  showing?: number;
  totalLabel?: string;
  total?: number;
  children: ReactNode;
};

/** Tarjeta de resultados con título, subtítulo y etiquetas "Mostrando N" / total. */
export function ResultsCard({ title, subtitle, showing, totalLabel, total, children }: ResultsCardProps) {
  return (
    <View style={styles.results}>
      <View style={styles.resultsHeader}>
        <View style={styles.resultsTitles}>
          <Text style={styles.resultsTitle}>{title}</Text>
          <Text style={styles.resultsSubtitle}>{subtitle}</Text>
        </View>
        {showing !== undefined ? (
          <View style={[styles.badge, styles.badgeGreen]}>
            <Text style={styles.badgeGreenText}>
              Mostrando <Text style={styles.bold}>{showing}</Text>
            </Text>
          </View>
        ) : null}
        {totalLabel ? (
          <View style={[styles.badge, styles.badgeOrange]}>
            <Text style={styles.badgeOrangeText}>
              {totalLabel}: {total}
            </Text>
          </View>
        ) : null}
      </View>
      {children}
    </View>
  );
}

// ── Piezas de tabla ──────────────────────────────────────────────────────────

const rankColors = [palette.lime, palette.limeMedium, palette.limeLight, webExtra.rank4, webExtra.rank5];

/** Insignia de posición (1–3 verdes, 4–5 claras). */
export function RankBadge({ position }: { position: number }) {
  return (
    <View style={[styles.rank, { backgroundColor: rankColors[Math.min(position, rankColors.length) - 1] }]}>
      <Text style={styles.rankText}>{position}</Text>
    </View>
  );
}

/** Pastilla gris con las siglas de la institución. */
export function InstitutionPill({ code }: { code: string }) {
  return (
    <View style={styles.institution}>
      <Text style={styles.institutionText}>{code}</Text>
    </View>
  );
}

/** Barra horizontal dentro de la celda + valor (columna "Viajes brindados"). */
export function BarCell({ value, max }: { value: number; max: number }) {
  const ratio = max > 0 ? Math.min(1, value / max) : 0;
  return (
    <View style={styles.barCell}>
      <View style={styles.barTrack}>
        <View style={[styles.barFill, { width: `${ratio * 100}%` }]} />
      </View>
      <Text style={styles.barValue}>{value}</Text>
    </View>
  );
}

export function TableHeaderRow({ children }: { children: ReactNode }) {
  return <View style={styles.tableHeader}>{children}</View>;
}

export const analyticsStyles = StyleSheet.create({
  headerText: {
    fontFamily: fonts.cairoBold,
    fontSize: 15,
    color: webColors.headerText,
  },
  cellText: {
    fontFamily: fonts.cairoRegular,
    fontSize: 13,
    color: webColors.headerText,
  },
  row: {
    minHeight: 42,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: palette.greyLight,
  },
  page: {
    paddingTop: 31,
    paddingBottom: 40,
    paddingLeft: '3.5%',
    paddingRight: '1.9%',
    gap: 23,
  },
});

const styles = StyleSheet.create({
  tabs: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 7,
    marginBottom: 11,
  },
  tab: {
    flexGrow: 1,
    flexShrink: 1,
    height: 40,
    borderRadius: radius.webControl,
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 10,
    paddingRight: 6,
    ...webShadow,
  },
  tabNumber: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabNumberText: {
    fontFamily: fonts.cairoBold,
    fontSize: 18,
    lineHeight: 26,
  },
  tabIcon: {
    width: 27,
    alignItems: 'center',
    marginLeft: 5,
  },
  tabLabel: {
    marginLeft: 6,
    flexShrink: 1,
    fontFamily: fonts.cairoBold,
    fontSize: 20,
  },
  results: {
    minHeight: 478,
    borderRadius: 26,
    backgroundColor: webColors.card,
    paddingBottom: 30,
    overflow: 'hidden',
    ...webShadow,
  },
  resultsHeader: {
    minHeight: 95,
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingTop: 14,
    paddingHorizontal: 24,
    gap: 21,
    borderBottomWidth: 1,
    borderBottomColor: palette.grey,
  },
  resultsTitles: {
    flex: 1,
  },
  resultsTitle: {
    fontFamily: fonts.cairoBold,
    fontSize: 20,
    color: webColors.headerText,
  },
  resultsSubtitle: {
    fontFamily: fonts.cairoSemiBold,
    fontSize: 15,
    color: palette.greyDark,
  },
  badge: {
    height: 28,
    borderRadius: 100,
    justifyContent: 'center',
    paddingHorizontal: 10,
    marginTop: 18,
  },
  badgeGreen: {
    backgroundColor: palette.limeLight,
  },
  badgeOrange: {
    backgroundColor: palette.terracottaLight,
  },
  badgeGreenText: {
    fontFamily: fonts.cairoSemiBold,
    fontSize: 15,
    color: webColors.headerText,
  },
  badgeOrangeText: {
    fontFamily: fonts.cairoSemiBold,
    fontSize: 15,
    color: palette.terracotta,
  },
  bold: {
    fontFamily: fonts.cairoBold,
  },
  rank: {
    width: 31,
    height: 31,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rankText: {
    fontFamily: fonts.cairoRegular,
    fontSize: 15,
    color: palette.black,
  },
  institution: {
    width: 99,
    height: 21,
    borderRadius: radius.webControl,
    backgroundColor: palette.greyLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  institutionText: {
    fontFamily: fonts.cairoBold,
    fontSize: 14,
    lineHeight: 20,
    color: palette.greyDark,
  },
  barCell: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  barTrack: {
    flex: 1,
    maxWidth: 267,
    height: 8,
    borderRadius: 4,
    backgroundColor: palette.greyLight,
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    borderRadius: 4,
    backgroundColor: palette.lime,
  },
  barValue: {
    width: 32,
    textAlign: 'center',
    fontFamily: fonts.cairoRegular,
    fontSize: 15,
    color: palette.black,
  },
  tableHeader: {
    height: 40,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: webExtra.tableHeader,
  },
});

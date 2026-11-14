import { useEffect, useState } from 'react';
import { ActivityIndicator, Image, StyleSheet, Text, View, type ImageSourcePropType } from 'react-native';

import { useAdminHeader } from '@/components/web/PageHeader';
import { DonutChart, HorizontalBars } from '@/components/web/charts';
import { InstitutionFilter, useInstitutionOptions } from '@/components/web/consultas/shared';
import { SelectField } from '@/components/web/controls';
import { DateField, FilterCard, FilterItem } from '@/components/web/filters';
import { webExtra, webShadow } from '@/components/web/tokens';
import { getStatistics, listGenderFilterOptions } from '@/src/services/admin/analyticsService';
import type { DistributionSlice, StatisticsSummary } from '@/src/types/analytics';
import type { IsoDate } from '@/src/types/common';
import { fonts, palette, webColors } from '@/src/constants/theme';

const kpiCar = require('@/assets/images/web/kpi-car.png');
const kpiPerson = require('@/assets/images/web/kpi-person.png');
const kpiGroup = require('@/assets/images/web/kpi-group.png');

// Filtros del frame 285:483. Los datos de ejemplo corresponden a ese filtro;
// cambiar institución, fechas o género no recalcula las cifras.
const DEFAULT_INSTITUTION = 'Tecnológico de Costa Rica';
const DEFAULT_FROM: IsoDate = '2026-01-01';
const DEFAULT_TO: IsoDate = '2026-10-15';
const ALL_GENDERS = 'Todos los géneros';

/** Colores de los segmentos: terracota, verde y malva. */
const SLICE_COLORS = [palette.terracotta, webExtra.chartGreen, palette.mauve];

type KpiCardProps = {
  image: ImageSourcePropType;
  imageSize: number;
  tileColor: string;
  title: string;
  value: number;
  caption: string;
};

function KpiCard({ image, imageSize, tileColor, title, value, caption }: KpiCardProps) {
  return (
    <View style={styles.kpiCard}>
      <View style={[styles.kpiTile, { backgroundColor: tileColor }]}>
        <Image source={image} style={{ width: imageSize, height: imageSize }} resizeMode="contain" />
      </View>
      <View style={styles.kpiTexts}>
        <Text style={styles.kpiTitle}>{title}</Text>
        <Text style={styles.kpiValue}>{value}</Text>
        <Text style={styles.kpiCaption}>{caption}</Text>
      </View>
    </View>
  );
}

/** Fila de leyenda con punto, barra, porcentaje y cantidad. */
function LegendRow({ slice, color }: { slice: DistributionSlice; color: string }) {
  return (
    <View style={styles.legendRow}>
      <View style={styles.legendMain}>
        <View style={styles.legendLabelRow}>
          <View style={[styles.legendDot, { backgroundColor: color }]} />
          <Text style={styles.legendLabel}>{slice.label}</Text>
        </View>
        <View style={styles.legendBarRow}>
          <View style={styles.legendTrack}>
            <View style={[styles.legendFill, { width: `${slice.percent}%`, backgroundColor: color }]} />
          </View>
          <Text style={styles.legendPercent}>{slice.percent.toFixed(1)}%</Text>
        </View>
      </View>
      <Text style={styles.legendCount}>{slice.count}</Text>
    </View>
  );
}

function segments(slices: DistributionSlice[]) {
  return slices.map((slice, index) => ({ key: slice.key, value: slice.count, color: SLICE_COLORS[index % SLICE_COLORS.length] }));
}

function GenderCard({ title, total, slices }: { title: string; total: number; slices: DistributionSlice[] }) {
  return (
    <View style={[styles.card, styles.genderCard]}>
      <Text style={styles.cardTitle}>{title}</Text>
      <View style={styles.genderBody}>
        <DonutChart segments={segments(slices)} size={212} thickness={38} centerValue={String(total)} centerLabel="Personas" />
        <View style={styles.legend}>
          {slices.map((slice, index) => (
            <LegendRow key={slice.key} slice={slice} color={SLICE_COLORS[index % SLICE_COLORS.length]} />
          ))}
        </View>
      </View>
    </View>
  );
}

/** Estadísticas (285:483): filtros, KPI, donas por género y método de pago, rangos de edad. */
export default function StatisticsScreen() {
  const options = useInstitutionOptions();
  const [institution, setInstitution] = useState(DEFAULT_INSTITUTION);
  const [from, setFrom] = useState<IsoDate | null>(DEFAULT_FROM);
  const [to, setTo] = useState<IsoDate | null>(DEFAULT_TO);
  const [gender, setGender] = useState(ALL_GENDERS);
  const [genderOptions, setGenderOptions] = useState<string[]>([ALL_GENDERS]);
  const [stats, setStats] = useState<StatisticsSummary | null>(null);

  useAdminHeader({ title: 'Estadísticas', subtitle: 'Uso del servicio y consulta de datos' });

  useEffect(() => {
    getStatistics().then(setStats);
    listGenderFilterOptions().then(setGenderOptions);
  }, []);

  const reset = () => {
    setInstitution(DEFAULT_INSTITUTION);
    setFrom(DEFAULT_FROM);
    setTo(DEFAULT_TO);
  };

  const paymentTotal = stats?.tripsByPaymentMethod.reduce((sum, slice) => sum + slice.count, 0) ?? 0;

  return (
    <View style={styles.page}>
      <FilterCard onReset={reset} resetLabel="Restablecer">
        <InstitutionFilter value={institution} onChange={setInstitution} options={options} />
        <FilterItem label="Desde">
          <DateField value={from} onChange={setFrom} accessibilityLabel="Desde" />
        </FilterItem>
        <FilterItem label="Hasta">
          <DateField value={to} onChange={setTo} accessibilityLabel="Hasta" />
        </FilterItem>
      </FilterCard>

      {stats === null ? (
        <ActivityIndicator color={palette.lime} style={styles.loading} />
      ) : (
        <>
          <View style={styles.kpis}>
            <KpiCard
              image={kpiCar}
              imageSize={71}
              tileColor={palette.limeMedium}
              title="Conductores activos"
              value={stats.activeDrivers}
              caption="Personas que condujeron en el período"
            />
            <KpiCard
              image={kpiPerson}
              imageSize={56}
              tileColor={palette.terracottaLight}
              title="Pasajeros activos"
              value={stats.activePassengers}
              caption="Personas que viajaron como pasajeras"
            />
            <KpiCard
              image={kpiGroup}
              imageSize={76}
              tileColor={palette.mauveLight}
              title="Usuarios únicos"
              value={stats.uniqueUsers}
              caption={`${stats.bothRoles} personas fueron conductoras y pasajeras`}
            />
          </View>

          <View style={styles.genderRow}>
            <GenderCard title="Conductores por género" total={stats.activeDrivers} slices={stats.driversByGender} />
            <GenderCard title="Pasajeros por género" total={stats.activePassengers} slices={stats.passengersByGender} />
          </View>

          <View style={[styles.card, styles.paymentCard]}>
            <Text style={[styles.cardTitle, styles.paymentTitle]}>Viajes por método de pago</Text>
            <View style={styles.paymentBody}>
              <View style={styles.paymentDonut}>
                <DonutChart
                  segments={segments(stats.tripsByPaymentMethod)}
                  size={140}
                  thickness={25}
                  centerValue={String(paymentTotal)}
                  centerLabel="Viajes"
                  valueFontSize={30}
                  labelFontSize={18}
                />
              </View>
              <View style={[styles.legend, styles.paymentLegend]}>
                {stats.tripsByPaymentMethod.map((slice, index) => (
                  <LegendRow key={slice.key} slice={slice} color={SLICE_COLORS[index % SLICE_COLORS.length]} />
                ))}
              </View>
            </View>
          </View>

          <View style={[styles.card, styles.ageCard]}>
            <View style={styles.ageHeader}>
              <Text style={[styles.cardTitle, styles.ageTitle]}>Usuarios por rango de edad</Text>
              {/* Selector `Generos` (2222:2258) con el menú `Menú generos` (2222:2236). */}
              <SelectField value={gender} options={genderOptions} onChange={setGender} width={271} accessibilityLabel="Género" />
            </View>
            <View style={styles.ageBody}>
              <View style={styles.ageBars}>
                <HorizontalBars
                  data={stats.usersByAgeRange.map((range) => ({ key: range.label, label: range.label, value: range.count }))}
                  color={palette.limeMedium}
                />
              </View>
              <View style={styles.ageTable}>
                <View style={[styles.ageRow, styles.ageHeadRow]}>
                  <Text style={[styles.ageCell, styles.ageColRange]}>Rango</Text>
                  <Text style={[styles.ageCell, styles.ageColCount]}>Cantidad</Text>
                  <Text style={[styles.ageCell, styles.ageColPercent]}>%</Text>
                </View>
                {stats.usersByAgeRange.map((range) => (
                  <View key={range.label} style={styles.ageRow}>
                    <Text style={[styles.ageCell, styles.ageColRange]}>{range.tableLabel ?? range.label}</Text>
                    <Text style={[styles.ageCell, styles.ageColCount]}>{range.count}</Text>
                    <Text style={[styles.ageCell, styles.ageColPercent]}>{range.percent.toFixed(1)}%</Text>
                  </View>
                ))}
              </View>
            </View>
          </View>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  page: {
    paddingTop: 30,
    paddingBottom: 40,
    paddingLeft: '3.5%',
    paddingRight: '2.6%',
    gap: 33,
  },
  loading: {
    marginTop: 40,
  },
  card: {
    backgroundColor: webColors.card,
    borderRadius: 20,
    ...webShadow,
  },
  kpis: {
    flexDirection: 'row',
    gap: 35,
  },
  kpiCard: {
    flex: 1,
    minHeight: 135,
    borderRadius: 20,
    backgroundColor: webColors.card,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 33,
    gap: 42,
    ...webShadow,
  },
  kpiTile: {
    width: 95,
    height: 81,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  kpiTexts: {
    flex: 1,
  },
  kpiTitle: {
    fontFamily: fonts.cairoRegular,
    fontSize: 20,
    color: palette.greyMedium,
  },
  kpiValue: {
    fontFamily: fonts.cairoBold,
    fontSize: 30,
    lineHeight: 42,
    color: palette.nearBlack,
  },
  kpiCaption: {
    fontFamily: fonts.cairoRegular,
    fontSize: 14,
    color: palette.mauve,
  },
  genderRow: {
    flexDirection: 'row',
    gap: 97,
  },
  genderCard: {
    flex: 1,
    paddingTop: 16,
    paddingBottom: 24,
    paddingHorizontal: 22,
  },
  cardTitle: {
    fontFamily: fonts.cairoBold,
    fontSize: 26,
    color: palette.nearBlack,
  },
  genderBody: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 64,
    marginTop: 16,
  },
  legend: {
    flex: 1,
    gap: 24,
  },
  legendRow: {
    minHeight: 51,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: palette.greyLight,
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 9,
    paddingRight: 14,
    paddingVertical: 4,
    gap: 12,
  },
  legendMain: {
    flex: 1,
  },
  legendLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
  },
  legendDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  legendLabel: {
    fontFamily: fonts.cairoRegular,
    fontSize: 14,
    color: palette.nearBlack,
  },
  legendBarRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingLeft: 25,
  },
  legendTrack: {
    flex: 1,
    height: 4,
    borderRadius: 2,
    backgroundColor: palette.greyLight,
    overflow: 'hidden',
  },
  legendFill: {
    height: '100%',
    borderRadius: 2,
  },
  legendPercent: {
    width: 44,
    textAlign: 'right',
    fontFamily: fonts.cairoRegular,
    fontSize: 11,
    color: palette.greyMedium,
  },
  legendCount: {
    fontFamily: fonts.cairoRegular,
    fontSize: 14,
    color: palette.nearBlack,
  },
  paymentCard: {
    paddingTop: 16,
    paddingBottom: 24,
    paddingHorizontal: 22,
  },
  paymentTitle: {
    fontSize: 22,
  },
  paymentBody: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  paymentDonut: {
    width: 294,
    alignItems: 'center',
  },
  paymentLegend: {
    gap: 8,
    marginRight: 66,
  },
  ageCard: {
    paddingTop: 18,
    paddingBottom: 36,
    paddingHorizontal: 36,
    zIndex: 5,
  },
  ageHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    zIndex: 5,
  },
  ageTitle: {
    fontSize: 24,
  },
  ageBody: {
    flexDirection: 'row',
    gap: 130,
    marginTop: 24,
  },
  ageBars: {
    flex: 655,
  },
  ageTable: {
    flex: 630,
  },
  ageRow: {
    minHeight: 37,
    flexDirection: 'row',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: palette.greyLight,
  },
  ageHeadRow: {
    borderTopWidth: 0,
  },
  ageCell: {
    fontFamily: fonts.cairoRegular,
    fontSize: 18,
    color: webColors.headerText,
  },
  ageColRange: {
    flex: 260,
    paddingLeft: 36,
  },
  ageColCount: {
    flex: 255,
    textAlign: 'center',
  },
  ageColPercent: {
    flex: 115,
    textAlign: 'right',
    paddingRight: 24,
  },
});

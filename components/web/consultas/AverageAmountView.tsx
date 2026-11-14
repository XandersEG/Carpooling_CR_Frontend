import { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';

import { ResultsCard } from '@/components/web/analytics';
import { ValueBarChart } from '@/components/web/charts';
import { ALL_INSTITUTIONS, InstitutionFilter, institutionCode, useInstitutionOptions } from '@/components/web/consultas/shared';
import { DateField, FilterCard, FilterItem } from '@/components/web/filters';
import { IconInfo } from '@/components/web/icons';
import { getAverageAmount } from '@/src/services/admin/analyticsService';
import type { AverageAmountQuery } from '@/src/types/analytics';
import type { IsoDate } from '@/src/types/common';
import { fonts, palette, webColors } from '@/src/constants/theme';
import { formatColones } from '@/src/utils/format';

// Rango del frame 340:3079. Los datos de ejemplo no permiten filtrar por fechas.
const DEFAULT_FROM: IsoDate = '2026-01-01';
const DEFAULT_TO: IsoDate = '2026-10-15';
/** Eje del gráfico "Promedio por institución": ₡0 a ₡1400 cada ₡350. */
const AXIS_MAX = 1400;
const AXIS_STEP = 350;

/** Etiquetas del eje sin separador de miles, como en el diseño ("₡1050"). */
const axisLabel = (value: number) => `₡${value}`;

/** Consulta 5 · Monto promedio (340:3079) con tooltips `Promedio1–4` al pasar el cursor. */
export function AverageAmountView() {
  const options = useInstitutionOptions();
  const [institution, setInstitution] = useState(ALL_INSTITUTIONS);
  const [from, setFrom] = useState<IsoDate | null>(DEFAULT_FROM);
  const [to, setTo] = useState<IsoDate | null>(DEFAULT_TO);
  const [query, setQuery] = useState<AverageAmountQuery | null>(null);

  const code = institutionCode(options, institution);

  useEffect(() => {
    let mounted = true;
    getAverageAmount({ institution: code }).then((result) => mounted && setQuery(result));
    return () => {
      mounted = false;
    };
  }, [code]);

  const reset = () => {
    setInstitution(ALL_INSTITUTIONS);
    setFrom(DEFAULT_FROM);
    setTo(DEFAULT_TO);
  };

  return (
    <>
      <FilterCard onReset={reset}>
        <InstitutionFilter value={institution} onChange={setInstitution} options={options} />
        <FilterItem label="Desde">
          <DateField value={from} onChange={setFrom} accessibilityLabel="Desde" />
        </FilterItem>
        <FilterItem label="Hasta">
          <DateField value={to} onChange={setTo} accessibilityLabel="Hasta" />
        </FilterItem>
      </FilterCard>

      <ResultsCard
        title="Promedio del monto cobrado"
        subtitle="Promedio del monto cobrado por conductores en viajes con cobro."
        showing={query?.tripsWithCharge}
        totalLabel="Viajes en el periodo"
        total={query?.tripsInPeriod}
      >
        {query === null ? (
          <ActivityIndicator color={palette.lime} style={styles.loading} />
        ) : (
          <View style={styles.body}>
            <View style={styles.kpis}>
              <View style={[styles.kpi, styles.kpiMain]}>
                <Text style={styles.kpiLabel}>Monto promedio por viaje</Text>
                <Text style={[styles.kpiValue, styles.kpiMainValue]}>{formatColones(query.average)}</Text>
                <Text style={styles.kpiLabel}>Calculado sobre {query.tripsWithCharge} viajes con cobro</Text>
              </View>
              <View style={styles.kpiRow}>
                <View style={[styles.kpi, styles.kpiGreen]}>
                  <Text style={styles.kpiLabel}>Mínimo</Text>
                  <Text style={styles.kpiValue}>{formatColones(query.min)}</Text>
                  <Text style={styles.kpiLabel}>Monto más bajo</Text>
                </View>
                <View style={[styles.kpi, styles.kpiGreen]}>
                  <Text style={styles.kpiLabel}>Máximo</Text>
                  <Text style={styles.kpiValue}>{formatColones(query.max)}</Text>
                  <Text style={styles.kpiLabel}>Monto más alto</Text>
                </View>
              </View>
              <View style={styles.footnote}>
                <IconInfo color={palette.greyMedium} />
                <Text style={styles.footnoteText}>
                  {query.tripsWithoutCharge} viajes sin cobro no se incluyen en el promedio.
                </Text>
              </View>
            </View>

            <View style={styles.chart}>
              <Text style={styles.chartTitle}>Promedio por institución</Text>
              <ValueBarChart
                data={query.byInstitution.map((item) => ({
                  key: item.institution,
                  label: item.institution,
                  value: item.average,
                }))}
                max={AXIS_MAX}
                step={AXIS_STEP}
                height={283}
                color={palette.terracotta}
                formatValue={(value) => (value % AXIS_STEP === 0 ? axisLabel(value) : formatColones(value))}
                renderTooltip={(datum) => (
                  <View style={styles.tooltip}>
                    <Text style={styles.tooltipTitle}>{datum.label}</Text>
                    <Text style={styles.tooltipValue}>Promedio: {formatColones(datum.value)}</Text>
                  </View>
                )}
              />
            </View>
          </View>
        )}
      </ResultsCard>
    </>
  );
}

const styles = StyleSheet.create({
  loading: {
    marginTop: 40,
  },
  body: {
    flexDirection: 'row',
    paddingTop: 24,
    paddingHorizontal: 24,
    gap: 54,
  },
  kpis: {
    flex: 673,
    gap: 17,
  },
  kpiRow: {
    flexDirection: 'row',
    gap: 19,
  },
  kpi: {
    minHeight: 157,
    borderRadius: 20,
    paddingHorizontal: 22,
    paddingVertical: 18,
    justifyContent: 'center',
  },
  kpiMain: {
    backgroundColor: palette.terracottaLight,
  },
  kpiGreen: {
    flex: 1,
    backgroundColor: palette.limeLight,
  },
  kpiLabel: {
    fontFamily: fonts.cairoMedium,
    fontSize: 15,
    color: webColors.headerText,
  },
  kpiValue: {
    fontFamily: fonts.cairoBold,
    fontSize: 42,
    lineHeight: 56,
    color: webColors.headerText,
  },
  kpiMainValue: {
    color: palette.terracotta,
  },
  footnote: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  footnoteText: {
    fontFamily: fonts.cairoMedium,
    fontSize: 15,
    color: palette.greyMedium,
  },
  chart: {
    flex: 690,
    gap: 16,
  },
  chartTitle: {
    fontFamily: fonts.cairoMedium,
    fontSize: 13,
    color: webColors.headerText,
  },
  tooltip: {
    width: 141,
    height: 68,
    borderRadius: 5,
    borderWidth: 1.8,
    borderColor: palette.terracotta,
    backgroundColor: palette.white,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  tooltipTitle: {
    fontFamily: fonts.cairoSemiBold,
    fontSize: 15,
    color: webColors.headerText,
  },
  tooltipValue: {
    fontFamily: fonts.cairoSemiBold,
    fontSize: 15,
    color: palette.terracotta,
  },
});

import { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';

import { ResultsCard } from '@/components/web/analytics';
import { ValueBarChart } from '@/components/web/charts';
import { ALL_INSTITUTIONS, InstitutionFilter } from '@/components/web/consultas/shared';
import { DateField, FilterCard, FilterItem } from '@/components/web/filters';
import { IconInfo } from '@/components/web/icons';
import { consultarMontoPromedio, listarInstituciones, mensajesDe, type RespuestaMontoPromedio } from '@/src/features/admin/api';
import type { InstitutionFilterOption } from '@/src/types/analytics';
import type { IsoDate } from '@/src/types/common';
import { fonts, palette, webColors } from '@/src/constants/theme';
import { formatColones, toIsoDate  } from '@/src/utils/format';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

/** Ajustar el eje a montos reales; el diseño original asumía un máximo fijo de ₡1400. */
function chartScale(values: number[]): { max: number; step: number } {
  const highest = Math.max(0, ...values);
  const raw = Math.max(1, highest) / 4;
  const magnitude = 10 ** Math.floor(Math.log10(raw));
  const step = [1, 2, 2.5, 5, 10].map((n) => n * magnitude).find((n) => n >= raw) ?? 10 * magnitude;
  return { max: Math.ceil(highest / step || 1) * step, step };
}

function shortInstitution(name: string): string {
  const normalized = name.toLowerCase();
  if (normalized.includes('tecnológico de costa rica') || normalized.includes('tecnologico de costa rica')) return 'TEC';
  if (normalized.includes('universidad de costa rica')) return 'UCR';
  if (normalized.includes('universidad nacional')) return 'UNA';
  if (normalized.includes('universidad estatal a distancia')) return 'UNED';
  return name;
}

function inicioDelAnio(fecha: IsoDate): IsoDate {
  return `${fecha.slice(0, 4)}-01-01`;
}

const money = (amount: number | null) => amount === null ? 'Sin datos' : formatColones(amount);

/** Consulta 5 · Monto promedio (340:3079) con tooltips `Promedio1–4` al pasar el cursor. */
export function AverageAmountView() {
  const [options, setOptions] = useState<InstitutionFilterOption[]>([
    { label: ALL_INSTITUTIONS, code: null },
  ]);
  const [institutionIds, setInstitutionIds] = useState<Record<string, number>>({});
  const [institution, setInstitution] = useState(ALL_INSTITUTIONS);
  const [from, setFrom] = useState<IsoDate | null>(() =>inicioDelAnio(toIsoDate(new Date())),);
  const [to, setTo] = useState<IsoDate | null>(() => toIsoDate(new Date()));
  const [query, setQuery] = useState<RespuestaMontoPromedio | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [institutionsError, setInstitutionsError] = useState<string | null>(null);

  // No usamos las instituciones simuladas de las otras consultas.
  useEffect(() => {
    let active = true;
    listarInstituciones()
      .then((institutions) => {
        if (!active) return;
        const ids: Record<string, number> = {};
        const nextOptions: InstitutionFilterOption[] = [{ label: ALL_INSTITUTIONS, code: null }];
        for (const item of institutions) {
          // `code` es solo para el componente compartido; el filtro real usa IDs de la BD.
          ids[item.nombre] = item.id;
          nextOptions.push({ label: item.nombre, code: null });
        }
        setInstitutionIds(ids);
        setOptions(nextOptions);
      })
      .catch((reason: unknown) => {
        if (active) setInstitutionsError(mensajesDe(reason).join(' '));
      });
    return () => { active = false; };
  }, []);

  const invalidRange = Boolean(from && to && from > to);
  const selectedId = institution === ALL_INSTITUTIONS ? undefined : institutionIds[institution];

  useEffect(() => {
    if (invalidRange || (institution !== ALL_INSTITUTIONS && selectedId === undefined)) {
      setQuery(null);
      setLoading(false);
      return;
    }
    let active = true;
    setLoading(true);
    setError(null);
    setQuery(null);
    consultarMontoPromedio({
      institucionId: selectedId,
      desde: from ?? undefined,
      hasta: to ?? undefined,
    })
      .then((result) => { if (active) setQuery(result); })
      .catch((reason: unknown) => { if (active) setError(mensajesDe(reason).join(' ')); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [selectedId, institution, from, to, invalidRange]);

  const chartData = (query?.promedioPorInstitucion ?? []).map((item) => ({
    key: String(item.institucionId),
    label: shortInstitution(item.institucion),
    value: item.montoPromedio,
  }));
  const scale = chartScale(chartData.map((item) => item.value));

  const reset = () => {
    const hoy = toIsoDate(new Date());
    
    setInstitution(ALL_INSTITUTIONS);
    setFrom(inicioDelAnio(hoy));
    setTo(hoy);
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
        showing={query?.viajesConCobro}
        totalLabel="Viajes en el periodo"
        total={query?.viajesEnPeriodo}
      >
        {invalidRange ? (
          <Text style={styles.message}>La fecha «Desde» no puede ser posterior a «Hasta».</Text>
        ) : institutionsError || error ? (
          <Text style={styles.message}>{institutionsError ?? error}</Text>
        ) : loading || query === null ? (
          <ActivityIndicator color={palette.lime} style={styles.loading} />
        ) : query.viajesEnPeriodo === 0 ? (
          <View style={styles.emptyState}>
            <View style={styles.emptyStateIcon}>
              <MaterialCommunityIcons
                name="clipboard-text-outline"
                size={30}
                color={palette.terracotta}
                accessible={false}
              />
            </View>

            <Text style={styles.emptyStateTitle}>No hay viajes registrados</Text>

            <Text style={styles.emptyStateDescription}>
              {institution === ALL_INSTITUTIONS
                ? 'No se encontraron viajes con los filtros seleccionados.'
                : from || to
                  ? `No se encontraron viajes para ${institution} en el período seleccionado.`
                  : `No se encontraron viajes para ${institution}.`}
            </Text>
          </View>
        ) : (
          <View style={styles.body}>
            <View style={styles.kpis}>
              <View style={[styles.kpi, styles.kpiMain]}>
                <Text style={styles.kpiLabel}>Monto promedio por viaje</Text>
                <Text style={[styles.kpiValue, styles.kpiMainValue]}>{money(query.montoPromedio)}</Text>
                <Text style={styles.kpiLabel}>Calculado sobre {query.viajesConCobro} viajes con cobro</Text>
              </View>
              <View style={styles.kpiRow}>
                <View style={[styles.kpi, styles.kpiGreen]}>
                  <Text style={styles.kpiLabel}>Mínimo</Text>
                  <Text style={styles.kpiValue}>{money(query.montoMinimo)}</Text>
                  <Text style={styles.kpiLabel}>Monto más bajo</Text>
                </View>
                <View style={[styles.kpi, styles.kpiGreen]}>
                  <Text style={styles.kpiLabel}>Máximo</Text>
                  <Text style={styles.kpiValue}>{money(query.montoMaximo)}</Text>
                  <Text style={styles.kpiLabel}>Monto más alto</Text>
                </View>
              </View>
              <View style={styles.footnote}>
                <IconInfo color={palette.greyMedium} />
                <Text style={styles.footnoteText}>
                  {query.viajesSinCobro} viajes sin cobro no se incluyen en el promedio.
                </Text>
              </View>
            </View>

            <View style={styles.chart}>
              <Text style={styles.chartTitle}>Promedio por institución</Text>
              {chartData.length === 0 ? (
                <Text style={styles.empty}>No hay viajes con cobro para los filtros seleccionados.</Text>
              ) : <ValueBarChart
                data={chartData}
                max={scale.max}
                step={scale.step}
                height={283}
                color={palette.terracotta}
                formatValue={formatColones}
                renderTooltip={(datum) => (
                  <View style={styles.tooltip}>
                    <Text style={styles.tooltipTitle}>{datum.label}</Text>
                    <Text style={styles.tooltipValue}>Promedio: {formatColones(datum.value)}</Text>
                  </View>
                )}
              />}
            </View>
          </View>
        )}
      </ResultsCard>
    </>
  );
}

const styles = StyleSheet.create({
  loading: { marginTop: 40 },
  message: { padding: 24, color: palette.terracotta, fontFamily: fonts.cairoMedium, fontSize: 16 },
  empty: { paddingTop: 36, color: palette.greyMedium, fontFamily: fonts.cairoMedium },
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
    minHeight: 68,
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
  emptyState: {
  minHeight: 220,
  alignItems: 'center',
  justifyContent: 'center',
  gap: 8,
  paddingHorizontal: 24,
  paddingVertical: 32,
  },
  emptyStateIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: palette.terracottaLight,
  },
  emptyStateTitle: {
    fontFamily: fonts.cairoBold,
    fontSize: 20,
    color: webColors.headerText,
    textAlign: 'center',
  },
  emptyStateDescription: {
    maxWidth: 420,
    fontFamily: fonts.cairoMedium,
    fontSize: 15,
    color: palette.greyMedium,
    textAlign: 'center',
  },
});

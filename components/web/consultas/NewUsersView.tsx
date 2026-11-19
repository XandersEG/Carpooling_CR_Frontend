import { useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from 'react-native';

import { ResultsCard } from '@/components/web/analytics';
import { CountBarChart } from '@/components/web/charts';
import { SelectField } from '@/components/web/controls';
import { ALL_INSTITUTIONS } from '@/components/web/consultas/shared';
import { FilterCard, FilterItem, FilterSearch, TopStepper } from '@/components/web/filters';
import { listarInstituciones, mensajesDe } from '@/src/features/admin/api';
import type { Institucion } from '@/src/features/admin/types';
import { getNewUsers } from '@/src/services/admin/analyticsService';
import type { NewUsersQuery } from '@/src/types/analytics';
import { fonts, palette, webColors } from '@/src/constants/theme';
import { capitalize, getDateParts, monthName } from '@/src/utils/format';

const DEFAULT_MONTHS = 3;
/** Meses con datos en el diseño (jul–oct). */
const MAX_MONTHS = 4;

/** "26 de julio 2026" */
function longDate(value: string): string {
  const { day, month, year } = getDateParts(`${value}T12:00:00-06:00`);
  return `${day} de ${monthName(month)} ${year}`;
}

/** "19 oct 2026" */
function shortDate(value: string): string {
  const { day, month, year } = getDateParts(`${value}T12:00:00-06:00`);
  return `${day} ${monthName(month).slice(0, 3)} ${year}`;
}

/** Consulta 6 · Usuarios nuevos (340:3224): KPI, barras por mes y tabla con scroll. */
export function NewUsersView() {
  const [institutions, setInstitutions] = useState<Institucion[]>([]);
  const [institution, setInstitution] = useState(ALL_INSTITUTIONS);
  const [search, setSearch] = useState('');
  const [months, setMonths] = useState(DEFAULT_MONTHS);
  const [query, setQuery] = useState<NewUsersQuery | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [institutionError, setInstitutionError] = useState<string | null>(null);
  const institutionId = institutions.find((item) => item.nombre === institution)?.id;

  useEffect(() => {
    let mounted = true;
    listarInstituciones()
      .then((result) => mounted && setInstitutions(result.filter((item) => item.activo)))
      .catch((cause: unknown) => mounted && setInstitutionError(mensajesDe(cause).join(' ')));
    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    setError(null);
    getNewUsers({ institutionId, search, months })
      .then((result) => {
        if (mounted) setQuery(result);
      })
      .catch((cause: unknown) => {
        if (mounted) {
          setQuery(null);
          setError(mensajesDe(cause).join(' '));
        }
      })
      .finally(() => mounted && setLoading(false));
    return () => {
      mounted = false;
    };
  }, [institutionId, search, months]);

  const reset = () => {
    setInstitution(ALL_INSTITUTIONS);
    setSearch('');
    setMonths(DEFAULT_MONTHS);
  };

  return (
    <>
      <FilterCard onReset={reset}>
        <FilterItem label="Institución">
          <SelectField
            value={institution}
            options={[ALL_INSTITUTIONS, ...institutions.map((item) => item.nombre)]}
            onChange={setInstitution}
            width={287}
            accessibilityLabel="Institución"
          />
        </FilterItem>
        <FilterItem label="Buscar">
          <FilterSearch value={search} onChange={setSearch} />
        </FilterItem>
        <FilterItem label="Últimos" suffix="meses">
          <TopStepper value={months} onChange={setMonths} max={MAX_MONTHS} accessibilityLabel="Últimos meses" />
        </FilterItem>
      </FilterCard>
      {institutionError ? <Text style={styles.error}>{institutionError}</Text> : null}

      <ResultsCard
        title={`Usuarios nuevos - últimos ${months} meses`}
        subtitle={query ? `Registrados entre ${longDate(query.from)} y ${longDate(query.to)}` : ''}
        showing={query?.total}
        totalLabel="Usuarios totales"
        total={query?.totalUsers}
      >
        {loading ? (
          <ActivityIndicator color={palette.lime} style={styles.loading} />
        ) : error ? (
          <Text style={styles.error}>{error}</Text>
        ) : query === null ? null : (
          <View style={styles.body}>
            <View style={styles.left}>
              <View style={styles.kpi}>
                <Text style={styles.kpiLabel}>Usuarios nuevos</Text>
                <Text style={styles.kpiValue}>{query.total}</Text>
                <Text style={styles.kpiLabel}>{query.percentOfTotal}% de los usuarios totales</Text>
              </View>
              <CountBarChart
                data={query.monthly.map((item) => ({ key: item.month, label: item.month, value: item.count }))}
                height={180}
                color={palette.sage}
              />
            </View>

            <View style={styles.table}>
              <View style={styles.tableHeader}>
                <Text style={[styles.headText, styles.colUser]}>Usuario</Text>
                <Text style={[styles.headText, styles.colInst]}>Institución</Text>
                <Text style={[styles.headText, styles.colRole]}>Rol</Text>
                <Text style={[styles.headText, styles.colDate]}>Registro</Text>
              </View>
              <ScrollView style={styles.tableScroll}>
                {query.users.length === 0 ? (
                  <Text style={styles.empty}>No se encontraron usuarios en este periodo.</Text>
                ) : (
                  query.users.map((user) => (
                    <View key={user.id} style={styles.tableRow}>
                      <Text style={[styles.cellText, styles.colUser]}>{user.fullName}</Text>
                      <Text style={[styles.cellText, styles.colInst]}>{user.institution}</Text>
                      <Text style={[styles.cellText, styles.colRole, styles.centerText]}>{capitalize(user.role)}</Text>
                      <Text style={[styles.cellText, styles.colDate, styles.centerText]}>{shortDate(user.registeredAt)}</Text>
                    </View>
                  ))
                )}
              </ScrollView>
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
  error: {
    color: palette.terracotta,
    fontFamily: fonts.cairoMedium,
    fontSize: 15,
    paddingHorizontal: 24,
    paddingVertical: 12,
  },
  empty: {
    color: palette.grey,
    fontFamily: fonts.cairoMedium,
    fontSize: 15,
    padding: 18,
    textAlign: 'center',
  },
  body: {
    flexDirection: 'row',
    paddingTop: 22,
    paddingHorizontal: 24,
    gap: 116,
  },
  left: {
    flex: 615,
    gap: 20,
  },
  kpi: {
    minHeight: 154,
    borderRadius: 20,
    backgroundColor: palette.limeLight,
    paddingHorizontal: 40,
    paddingVertical: 20,
    justifyContent: 'center',
  },
  kpiLabel: {
    fontFamily: fonts.cairoMedium,
    fontSize: 15,
    color: webColors.headerText,
  },
  kpiValue: {
    fontFamily: fonts.cairoBold,
    fontSize: 46,
    lineHeight: 58,
    color: webColors.headerText,
  },
  table: {
    flex: 640,
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderColor: palette.greyMedium,
    paddingHorizontal: 4,
  },
  tableHeader: {
    height: 68,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: palette.grey,
  },
  tableScroll: {
    maxHeight: 305,
  },
  tableRow: {
    minHeight: 62,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: palette.grey,
  },
  headText: {
    fontFamily: fonts.cairoBold,
    fontSize: 16,
    color: webColors.headerText,
    textAlign: 'center',
  },
  cellText: {
    fontFamily: fonts.cairoMedium,
    fontSize: 16,
    color: palette.black,
    paddingLeft: 8,
  },
  centerText: {
    textAlign: 'center',
    paddingLeft: 0,
  },
  center: {
    alignItems: 'center',
  },
  colUser: { flex: 190 },
  colInst: { flex: 130 },
  colRole: { flex: 150 },
  colDate: { flex: 150 },
});

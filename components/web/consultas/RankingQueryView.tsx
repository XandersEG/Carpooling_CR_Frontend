import { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';

import {
  BarCell,
  InstitutionPill,
  RankBadge,
  ResultsCard,
  TableHeaderRow,
  analyticsStyles,
} from '@/components/web/analytics';
import { ALL_INSTITUTIONS, InstitutionFilter, institutionCode, useInstitutionOptions } from '@/components/web/consultas/shared';
import { DateField, FilterCard, FilterItem, FilterSearch, TopStepper } from '@/components/web/filters';
import { mensajesDe } from '@/src/features/admin/api';
import { getRanking, type RankingKind } from '@/src/services/admin/analyticsService';
import type { RankingQuery } from '@/src/types/analytics';
import type { IsoDate } from '@/src/types/common';
import { palette } from '@/src/constants/theme';

type RankingConfig = {
  /** Filtro de fechas (Puntos concurrentes) o búsqueda por nombre (Conductores, Usuarios). */
  filter: 'search' | 'dates';
  stepperSuffix: string;
  title: (top: number) => string;
  subtitle: (query: RankingQuery | null) => string;
  totalLabel: string;
  nameHeader: string;
  defaultFrom?: IsoDate;
  defaultTo?: IsoDate;
};

const DEFAULT_TOP = 5;
/** Límite del selector "Top N" (no definido en el diseño). */
const MAX_TOP = 20;

function fechaActual(): IsoDate {
  const hoy = new Date();
  const mes = String(hoy.getMonth() + 1).padStart(2, '0');
  const dia = String(hoy.getDate()).padStart(2, '0');
  return `${hoy.getFullYear()}-${mes}-${dia}`;
}

export const rankingConfigs: Record<RankingKind, RankingConfig> = {
  conductores: {
    filter: 'search',
    stepperSuffix: 'conductores',
    title: () => 'Ranking',
    subtitle: () => 'Conductores con más viajes finalizados.',
    totalLabel: 'Conductores con viajes',
    nameHeader: 'CONDUCTOR',
  },
  puntos: {
    filter: 'dates',
    stepperSuffix: 'puntos más concurrentes',
    title: (top) => `Top ${top} puntos más concurrentes`,
    subtitle: (query) =>
      `Puntos de recogida con mayor concurrencia · ${query?.tripsInPeriod ?? '–'} viajes en el periodo.`,
    totalLabel: 'Puntos con registros',
    nameHeader: 'PUNTO',
    defaultFrom: '2026-01-01',
  },
  usuarios: {
    filter: 'search',
    stepperSuffix: 'usuarios',
    title: (top) => `Top ${top} usuarios más activos`,
    subtitle: () => 'Usuarios con más viajes finalizados: como conductor o pasajero.',
    totalLabel: 'Usuarios con viajes',
    // El diseño repite "CONDUCTOR" en esta tabla; se corrige a "USUARIO".
    nameHeader: 'USUARIO',
  },
};

/** Consultas 1–3 (228:142, 340:3557, 340:3858): tabla "Top N" con barra en la celda. */
export function RankingQueryView({ kind }: { kind: RankingKind }) {
  const config = rankingConfigs[kind];
  const [institutionError, setInstitutionError] = useState<string | null>(null);
  const [institution, setInstitution] = useState(ALL_INSTITUTIONS);
  const [search, setSearch] = useState('');
  // El rango se consulta para puntos concurrentes; los demás rankings filtran por nombre.
  const [from, setFrom] = useState<IsoDate | null>(config.defaultFrom ?? null);
  const [to, setTo] = useState<IsoDate | null>(
    kind === 'puntos' ? fechaActual() : config.defaultTo ?? null,
  );
  const [top, setTop] = useState(DEFAULT_TOP);
  const [query, setQuery] = useState<RankingQuery | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const options = useInstitutionOptions('admin', setInstitutionError, kind === 'puntos');
  const selectedInstitution = options.find((option) => option.label === institution);

  const filterOptions = options;
  const institutionId = selectedInstitution?.id;
  const code = kind === 'puntos' ? null : institutionCode(options, institution);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    setError(null);
    setQuery(null);
    getRanking(kind, {
      institution: code,
      institutionId,
      search,
      top,
      from,
      to,
    })
      .then((result) => mounted && setQuery(result))
      .catch((cause: unknown) => {
        if (mounted) setError(mensajesDe(cause).join(' '));
      })
      .finally(() => mounted && setLoading(false));
    return () => {
      mounted = false;
    };
  }, [kind, code, institutionId, search, top, from, to]);

  const reset = () => {
    setInstitution(ALL_INSTITUTIONS);
    setSearch('');
    setFrom(config.defaultFrom ?? null);
    setTo(kind === 'puntos' ? fechaActual() : config.defaultTo ?? null);
    setTop(DEFAULT_TOP);
  };

  const maxTrips = Math.max(0, ...(query?.entries.map((entry) => entry.trips) ?? [0]));

  return (
    <>
      <FilterCard onReset={reset}>
        <InstitutionFilter value={institution} onChange={setInstitution} options={filterOptions} />
        {config.filter === 'search' ? (
          <FilterItem label="Buscar">
            <FilterSearch value={search} onChange={setSearch} />
          </FilterItem>
        ) : (
          <>
            <FilterItem label="Desde">
              <DateField value={from} onChange={setFrom} accessibilityLabel="Desde" />
            </FilterItem>
            <FilterItem label="Hasta">
              <DateField value={to} onChange={setTo} accessibilityLabel="Hasta" />
            </FilterItem>
          </>
        )}
        <FilterItem label="Top" suffix={config.stepperSuffix}>
          <TopStepper value={top} onChange={setTop} max={MAX_TOP} accessibilityLabel="Top" />
        </FilterItem>
      </FilterCard>
      {institutionError ? <Text style={styles.error}>{institutionError}</Text> : null}

      <ResultsCard
        title={config.title(top)}
        subtitle={config.subtitle(query)}
        showing={query?.entries.length}
        totalLabel={config.totalLabel}
        total={query?.totalWithRecords}
      >
        <TableHeaderRow>
          <Text style={[analyticsStyles.headerText, styles.positionHeader]}>POSICIÓN</Text>
          <Text style={[analyticsStyles.headerText, styles.name]}>{config.nameHeader}</Text>
          <Text style={[analyticsStyles.headerText, styles.institution, styles.institutionHeader]}>
            INSTITUCIÓN
          </Text>
          <Text style={[analyticsStyles.headerText, styles.trips, styles.tripsHeader]}>VIAJES</Text>
        </TableHeaderRow>
        {loading ? (
          <ActivityIndicator color={palette.lime} style={styles.loading} />
        ) : error ? (
          <Text style={styles.error}>{error}</Text>
        ) : query === null ? null : (
          query.entries.length === 0 ? (
            <Text style={styles.empty}>No se encontraron resultados para esos filtros.</Text>
          ) : query.entries.map((entry, index) => (
            <View key={entry.id} style={analyticsStyles.row}>
              <View style={styles.position}>
                <RankBadge position={index + 1} />
              </View>
              <Text style={[analyticsStyles.cellText, styles.name]} numberOfLines={1}>
                {entry.name}
              </Text>
              {kind === 'puntos' ? (
                <Text style={[analyticsStyles.cellText, styles.institution]}>{entry.institution}</Text>
              ) : (
                <View style={styles.institution}>
                  <InstitutionPill name={entry.institution} />
                </View>
              )}
              <View style={styles.trips}>
                <BarCell value={entry.trips} max={maxTrips} />
              </View>
            </View>
          ))
        )}
      </ResultsCard>
    </>
  );
}

const styles = StyleSheet.create({
  positionHeader: {
    flex: 310,
    paddingLeft: 30,
  },
  position: {
    flex: 280,
    paddingLeft: 45,
  },
  name: {
    flex: 450,
    paddingRight: 12,
  },
  institution: {
    flex: 406,
    minWidth: 0,
  },
  institutionHeader: {
    textAlign: 'left',
    marginLeft: 60,
  },
  trips: {
    flex: 313,
    paddingRight: 10,
  },
  tripsHeader: {
    paddingLeft: 60,
  },
  loading: {
    marginTop: 40,
  },
  error: {
    marginTop: 24,
    color: palette.terracotta,
    fontSize: 14,
    paddingHorizontal: 24,
    paddingVertical: 12,
  },
  empty: {
    color: palette.grey,
    fontSize: 14,
    paddingHorizontal: 24,
    paddingVertical: 20,
    textAlign: 'center',
  },
});

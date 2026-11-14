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

export const rankingConfigs: Record<RankingKind, RankingConfig> = {
  conductores: {
    filter: 'search',
    stepperSuffix: 'conductores',
    title: (top) => `Top ${top} conductores`,
    subtitle: () => 'Conductores que han brindado más servicios de transporte.',
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
    defaultTo: '2026-10-15',
  },
  usuarios: {
    filter: 'search',
    stepperSuffix: 'usuarios',
    title: (top) => `Top ${top} usuarios más activos`,
    subtitle: () => 'Usuarios con más viajes registrados, como conductor o pasajero.',
    totalLabel: 'Usuarios con viajes',
    // El diseño repite "CONDUCTOR" en esta tabla; se corrige a "USUARIO".
    nameHeader: 'USUARIO',
  },
};

/** Consultas 1–3 (228:142, 340:3557, 340:3858): tabla "Top N" con barra en la celda. */
export function RankingQueryView({ kind }: { kind: RankingKind }) {
  const config = rankingConfigs[kind];
  const options = useInstitutionOptions();
  const [institution, setInstitution] = useState(ALL_INSTITUTIONS);
  const [search, setSearch] = useState('');
  // Las fechas no filtran: los datos de ejemplo no tienen fechas por fila.
  const [from, setFrom] = useState<IsoDate | null>(config.defaultFrom ?? null);
  const [to, setTo] = useState<IsoDate | null>(config.defaultTo ?? null);
  const [top, setTop] = useState(DEFAULT_TOP);
  const [query, setQuery] = useState<RankingQuery | null>(null);

  const code = institutionCode(options, institution);

  useEffect(() => {
    let mounted = true;
    getRanking(kind, { institution: code, search, top }).then((result) => mounted && setQuery(result));
    return () => {
      mounted = false;
    };
  }, [kind, code, search, top]);

  const reset = () => {
    setInstitution(ALL_INSTITUTIONS);
    setSearch('');
    setFrom(config.defaultFrom ?? null);
    setTo(config.defaultTo ?? null);
    setTop(DEFAULT_TOP);
  };

  const maxTrips = Math.max(0, ...(query?.entries.map((entry) => entry.trips) ?? [0]));

  return (
    <>
      <FilterCard onReset={reset}>
        <InstitutionFilter value={institution} onChange={setInstitution} options={options} />
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
          <Text style={[analyticsStyles.headerText, styles.institution]}>INSTITUCIÓN</Text>
          <Text style={[analyticsStyles.headerText, styles.trips, styles.tripsHeader]}>VIAJES BRINDADOS</Text>
        </TableHeaderRow>
        {query === null ? (
          <ActivityIndicator color={palette.lime} style={styles.loading} />
        ) : (
          query.entries.map((entry, index) => (
            <View key={entry.id} style={analyticsStyles.row}>
              <View style={styles.position}>
                <RankBadge position={index + 1} />
              </View>
              <Text style={[analyticsStyles.cellText, styles.name]} numberOfLines={1}>
                {entry.name}
              </Text>
              <View style={styles.institution}>
                <InstitutionPill code={entry.institution} />
              </View>
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
    flex: 311,
    paddingLeft: 50,
  },
  position: {
    flex: 311,
    paddingLeft: 67,
  },
  name: {
    flex: 481,
    paddingRight: 12,
  },
  institution: {
    flex: 366,
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
});

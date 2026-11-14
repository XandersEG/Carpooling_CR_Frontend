import { useEffect, useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';

import { ResultsCard, TableHeaderRow, analyticsStyles } from '@/components/web/analytics';
import { ALL_INSTITUTIONS, InstitutionFilter, institutionCode, useInstitutionOptions } from '@/components/web/consultas/shared';
import { DateField, FilterCard, FilterItem, FilterSearch } from '@/components/web/filters';
import { IconArrowDown, IconArrowUp } from '@/components/web/icons';
import { webExtra } from '@/components/web/tokens';
import { listTrips } from '@/src/services/admin/analyticsService';
import type { TripListEntry } from '@/src/types/analytics';
import type { IsoDate } from '@/src/types/common';
import { fonts, palette, webColors } from '@/src/constants/theme';
import { formatColones, getDateParts, monthName } from '@/src/utils/format';

// Rango del frame 340:2884.
const DEFAULT_FROM: IsoDate = '2026-10-18';
const DEFAULT_TO: IsoDate = '2026-10-20';

/** "20 oct 2026" */
function tripDate(value: string): string {
  const { day, month, year } = getDateParts(value);
  return `${day} ${monthName(month).slice(0, 3)} ${year}`;
}

/** "09:00" (formato de 24 h del diseño). */
function tripTime(value: string): string {
  const { hours, minutes } = getDateParts(value);
  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
}

const amountText = (amount: number) => (amount === 0 ? 'Sin cobro' : formatColones(amount));

/** Fila del listado con acordeón "Ver detalles" (componente `acc1` 2277:2263, off / on). */
function TripRow({ trip, expanded, onToggle }: { trip: TripListEntry; expanded: boolean; onToggle: () => void }) {
  return (
    <View style={styles.rowBlock}>
      <View style={[styles.row, expanded && styles.rowExpanded]}>
        <Text style={[styles.idText, styles.colId]}>{trip.code}</Text>
        <Text style={[styles.dateText, styles.colDate]}>
          {tripDate(trip.departureAt)}
          {'\n'}
          {tripTime(trip.departureAt)}
        </Text>
        <Text style={[styles.instText, styles.colInst]}>{trip.institution}</Text>
        <Text style={[styles.smallText, styles.colDriver]}>{trip.driverName}</Text>
        <Text style={[styles.smallText, styles.colRoute]}>
          {trip.origin} → {trip.destination}
        </Text>
        <Text style={[styles.amountText, styles.colAmount]}>{amountText(trip.amount)}</Text>
        <Pressable
          accessibilityRole="button"
          accessibilityState={{ expanded }}
          accessibilityLabel={`Ver detalles de ${trip.code}`}
          onPress={onToggle}
          style={[styles.colToggle, styles.toggle]}
        >
          <Text style={[styles.toggleText, expanded && styles.toggleTextExpanded]}>Ver detalles</Text>
          {expanded ? <IconArrowUp color={palette.greyMedium} /> : <IconArrowDown color={palette.greyDark} />}
        </Pressable>
      </View>
      {expanded ? (
        <View style={styles.details}>
          <View style={styles.detailColumn}>
            <Text style={styles.detailTitle}>RUTA</Text>
            <Text style={styles.detailSmall}>{trip.stops.join(' → ')}</Text>
          </View>
          <View style={styles.detailColumn}>
            <Text style={styles.detailTitle}>VEHÍCULO</Text>
            <Text style={styles.detailStrong}>{trip.vehicle}</Text>
          </View>
          <View style={styles.detailColumn}>
            <Text style={styles.detailTitle}>MONTO COBRADO</Text>
            <Text style={styles.detailValue}>{trip.amount === 0 ? 'Sin cobro' : `${formatColones(trip.amount)} cada uno`}</Text>
          </View>
          <View style={styles.detailColumn}>
            <Text style={styles.detailTitle}>PASAJEROS ({trip.passengers.length})</Text>
            {trip.passengers.map((passenger) => (
              <Text key={passenger} style={styles.detailSmall}>
                ▪ {passenger}
              </Text>
            ))}
          </View>
        </View>
      ) : null}
    </View>
  );
}

/** Consulta 4 · Listado de viajes (340:2884) con filas expandibles (2287:3249). */
export function TripListView() {
  const options = useInstitutionOptions();
  const [institution, setInstitution] = useState(ALL_INSTITUTIONS);
  const [from, setFrom] = useState<IsoDate | null>(DEFAULT_FROM);
  const [to, setTo] = useState<IsoDate | null>(DEFAULT_TO);
  const [search, setSearch] = useState('');
  const [trips, setTrips] = useState<TripListEntry[] | null>(null);
  const [expanded, setExpanded] = useState<string | null>(null);

  const code = institutionCode(options, institution);

  useEffect(() => {
    let mounted = true;
    listTrips({ institution: code, search, from, to }).then((result) => mounted && setTrips(result));
    return () => {
      mounted = false;
    };
  }, [code, search, from, to]);

  const reset = () => {
    setInstitution(ALL_INSTITUTIONS);
    setFrom(DEFAULT_FROM);
    setTo(DEFAULT_TO);
    setSearch('');
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
        <FilterItem label="Buscar">
          <FilterSearch value={search} onChange={setSearch} />
        </FilterItem>
      </FilterCard>

      <ResultsCard title="Listado de viajes" subtitle="Viajes realizados mediante la aplicación.">
        <TableHeaderRow>
          <Text style={[analyticsStyles.headerText, styles.headerCentered, styles.colId]}>ID</Text>
          <Text style={[analyticsStyles.headerText, styles.headerCentered, styles.colDate]}>Fecha y hora</Text>
          <Text style={[analyticsStyles.headerText, styles.headerCentered, styles.colInst]}>INSTITUCIÓN</Text>
          <Text style={[analyticsStyles.headerText, styles.headerCentered, styles.colDriver]}>CONDUCTOR</Text>
          <Text style={[analyticsStyles.headerText, styles.headerCentered, styles.colRoute]}>SALIDA → DESTINO</Text>
          <Text style={[analyticsStyles.headerText, styles.headerCentered, styles.colAmount]}>MONTO</Text>
          <View style={styles.colToggle} />
        </TableHeaderRow>
        {trips === null ? (
          <ActivityIndicator color={palette.lime} style={styles.loading} />
        ) : (
          trips.map((trip) => (
            <TripRow
              key={trip.id}
              trip={trip}
              expanded={expanded === trip.id}
              onToggle={() => setExpanded((current) => (current === trip.id ? null : trip.id))}
            />
          ))
        )}
      </ResultsCard>
    </>
  );
}

const styles = StyleSheet.create({
  loading: {
    marginTop: 40,
  },
  headerCentered: {
    textAlign: 'center',
  },
  rowBlock: {
    borderWidth: 1,
    borderColor: webColors.headerText,
    marginTop: -1,
  },
  row: {
    minHeight: 46,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: palette.white,
  },
  rowExpanded: {
    backgroundColor: webExtra.accordionHeader,
  },
  colId: { flex: 155 },
  colDate: { flex: 190 },
  colInst: { flex: 180 },
  colDriver: { flex: 280 },
  colRoute: { flex: 360 },
  colAmount: { flex: 160 },
  colToggle: { flex: 150 },
  idText: {
    textAlign: 'center',
    fontFamily: fonts.cairoMedium,
    fontSize: 16,
    color: palette.black,
  },
  dateText: {
    textAlign: 'center',
    fontFamily: fonts.cairoRegular,
    fontSize: 15,
    lineHeight: 19,
    color: palette.black,
  },
  instText: {
    textAlign: 'center',
    fontFamily: fonts.cairoBold,
    fontSize: 14,
    color: webColors.headerText,
  },
  smallText: {
    textAlign: 'center',
    fontFamily: fonts.cairoRegular,
    fontSize: 12,
    color: webColors.headerText,
  },
  amountText: {
    textAlign: 'center',
    fontFamily: fonts.cairoRegular,
    fontSize: 15,
    color: webColors.headerText,
  },
  toggle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingRight: 8,
    gap: 2,
  },
  toggleText: {
    fontFamily: fonts.cairoSemiBold,
    fontSize: 11,
    color: palette.greyDark,
  },
  toggleTextExpanded: {
    color: palette.greyMedium,
  },
  details: {
    minHeight: 106,
    flexDirection: 'row',
    backgroundColor: webExtra.accordionBody,
    paddingHorizontal: 9,
    paddingTop: 8,
    paddingBottom: 14,
    gap: 16,
  },
  detailColumn: {
    flex: 1,
    gap: 2,
  },
  detailTitle: {
    fontFamily: fonts.cairoBold,
    fontSize: 13,
    color: webColors.headerText,
  },
  detailSmall: {
    fontFamily: fonts.cairoSemiBold,
    fontSize: 11,
    color: webColors.headerText,
  },
  detailStrong: {
    fontFamily: fonts.cairoBold,
    fontSize: 13,
    color: webColors.headerText,
  },
  detailValue: {
    fontFamily: fonts.cairoRegular,
    fontSize: 14,
    color: webColors.headerText,
  },
});
